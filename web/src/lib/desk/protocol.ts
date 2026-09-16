// Minimal hand-written protobuf + frame codec for the GoTech Desk (RustDesk) rendezvous server.
// Only what the online check needs: OnlineRequest out, OnlineResponse in.

const WIRE_VARINT = 0;
const WIRE_FIXED64 = 1;
const WIRE_LENGTH_DELIMITED = 2;
const WIRE_FIXED32 = 5;
const FIXED64_BYTES = 8;
const FIXED32_BYTES = 4;
const TAG_SHIFT = 3;
const WIRE_MASK = 0x07;
const VARINT_PAYLOAD = 0x7f;
const VARINT_CONTINUE = 0x80;
const BITS_PER_BYTE = 8;
const HIGHEST_BIT = 7;

// RendezvousMessage oneof field numbers and inner fields
const RENDEZVOUS_ONLINE_REQUEST = 23;
const RENDEZVOUS_ONLINE_RESPONSE = 24;
const ONLINE_REQUEST_ID = 1;
const ONLINE_REQUEST_PEERS = 2;
const ONLINE_RESPONSE_STATES = 1;

// Frame header: the low 2 bits of the first byte hold (header length - 1), the rest is the payload length.
const HEADER_LEN_BITS = 2;
const HEADER_LEN_MASK = 0x03;
const ONE_BYTE_MAX = 0x3f;
const TWO_BYTE_MAX = 0x3fff;
const THREE_BYTE_MAX = 0x3fffff;
const TWO_BYTES = 2;
const THREE_BYTES = 3;
const FOUR_BYTES = 4;

function encodeVarint(value: number): Buffer {
  const bytes: number[] = [];
  let rest = value;
  while (rest > VARINT_PAYLOAD) {
    bytes.push((rest % VARINT_CONTINUE) | VARINT_CONTINUE);
    rest = Math.floor(rest / VARINT_CONTINUE);
  }
  bytes.push(rest);
  return Buffer.from(bytes);
}

function lengthDelimited(field: number, payload: Buffer): Buffer {
  return Buffer.concat([encodeVarint((field << TAG_SHIFT) | WIRE_LENGTH_DELIMITED), encodeVarint(payload.length), payload]);
}

export function encodeOnlineRequest(id: string, peers: string[]): Buffer {
  const request = Buffer.concat([
    lengthDelimited(ONLINE_REQUEST_ID, Buffer.from(id, "utf8")),
    ...peers.map((peer) => lengthDelimited(ONLINE_REQUEST_PEERS, Buffer.from(peer, "utf8"))),
  ]);
  return lengthDelimited(RENDEZVOUS_ONLINE_REQUEST, request);
}

export function encodeFrame(payload: Buffer): Buffer {
  const n = payload.length;
  const headerLength = n <= ONE_BYTE_MAX ? 1 : n <= TWO_BYTE_MAX ? TWO_BYTES : n <= THREE_BYTE_MAX ? THREE_BYTES : FOUR_BYTES;
  const header = Buffer.alloc(headerLength);
  // (n << 2) | (headerLength - 1), written with arithmetic so 4-byte lengths do not overflow int32
  header.writeUIntLE(n * (1 << HEADER_LEN_BITS) + (headerLength - 1), 0, headerLength);
  return Buffer.concat([header, payload]);
}

/** Returns the first complete frame's payload, or null while more bytes are needed. */
export function decodeFrame(data: Buffer): Buffer | null {
  if (data.length === 0) return null;
  const headerLength = (data[0] & HEADER_LEN_MASK) + 1;
  if (data.length < headerLength) return null;
  const payloadLength = Math.floor(data.readUIntLE(0, headerLength) / (1 << HEADER_LEN_BITS));
  const end = headerLength + payloadLength;
  return data.length < end ? null : data.subarray(headerLength, end);
}

type Field = { field: number; value: Buffer | number };

function readVarint(data: Buffer, offset: number): [value: number, next: number] {
  let value = 0;
  let multiplier = 1;
  let pos = offset;
  while (pos < data.length) {
    const byte = data[pos++];
    value += (byte & VARINT_PAYLOAD) * multiplier;
    if ((byte & VARINT_CONTINUE) === 0) return [value, pos];
    multiplier *= VARINT_CONTINUE;
  }
  throw new Error("Truncated varint.");
}

/** Generic protobuf reader: every top-level field, unknown ones included (callers skip what they do not need). */
function readFields(data: Buffer): Field[] {
  const fields: Field[] = [];
  let pos = 0;
  while (pos < data.length) {
    const [key, afterKey] = readVarint(data, pos);
    const field = Math.floor(key / (1 << TAG_SHIFT));
    const wire = key & WIRE_MASK;
    pos = afterKey;
    if (wire === WIRE_VARINT) {
      const [value, next] = readVarint(data, pos);
      fields.push({ field, value });
      pos = next;
    } else if (wire === WIRE_LENGTH_DELIMITED) {
      const [length, start] = readVarint(data, pos);
      if (start + length > data.length) throw new Error("Truncated field.");
      fields.push({ field, value: data.subarray(start, start + length) });
      pos = start + length;
    } else if (wire === WIRE_FIXED64) {
      pos += FIXED64_BYTES;
    } else if (wire === WIRE_FIXED32) {
      pos += FIXED32_BYTES;
    } else {
      throw new Error(`Unsupported wire type ${wire}.`);
    }
  }
  return fields;
}

const bytesField = (fields: Field[], field: number) => {
  const found = fields.find((f) => f.field === field && Buffer.isBuffer(f.value));
  return found ? (found.value as Buffer) : null;
};

/** Online flags in request order, or null when the message is not an OnlineResponse. */
export function decodeOnlineResponse(payload: Buffer, peerCount: number): boolean[] | null {
  const response = bytesField(readFields(payload), RENDEZVOUS_ONLINE_RESPONSE);
  if (!response) return null;
  const states = bytesField(readFields(response), ONLINE_RESPONSE_STATES) ?? Buffer.alloc(0);
  return Array.from({ length: peerCount }, (_, i) => {
    const byte = states[Math.floor(i / BITS_PER_BYTE)] ?? 0;
    return (byte & (1 << (HIGHEST_BIT - (i % BITS_PER_BYTE)))) !== 0;
  });
}
