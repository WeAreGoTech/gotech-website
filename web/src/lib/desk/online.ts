import "server-only";
import { connect } from "node:net";
import { env } from "@/lib/env";
import { decodeFrame, decodeOnlineResponse, encodeFrame, encodeOnlineRequest } from "./protocol";

const REQUEST_TIMEOUT_MS = 2500;
const PEERS_PER_REQUEST = 100;
const REQUESTER_ID = "gotech-panel";

function queryBatch(deskIds: string[]): Promise<boolean[] | null> {
  return new Promise((resolve) => {
    let received = Buffer.alloc(0);
    let settled = false;
    const socket = connect({ host: env.desk.serverHost, port: env.desk.natPort });

    const finish = (result: boolean[] | null) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(REQUEST_TIMEOUT_MS, () => finish(null));
    socket.on("error", () => finish(null));
    socket.on("close", () => finish(null));
    socket.on("connect", () => socket.write(encodeFrame(encodeOnlineRequest(REQUESTER_ID, deskIds))));
    socket.on("data", (chunk) => {
      received = Buffer.concat([received, chunk]);
      const payload = decodeFrame(received);
      if (!payload) return;
      try {
        finish(decodeOnlineResponse(payload, deskIds.length));
      } catch {
        finish(null);
      }
    });
  });
}

/**
 * Asks the rendezvous server which GoTech Desk computers are online.
 * Returns null when the server cannot be reached in time, so callers can show the status as unknown.
 */
export async function getOnlineStates(deskIds: string[]): Promise<Map<string, boolean> | null> {
  const unique = [...new Set(deskIds)];
  const states = new Map<string, boolean>();
  if (unique.length === 0) return states;

  const batches: string[][] = [];
  for (let i = 0; i < unique.length; i += PEERS_PER_REQUEST) batches.push(unique.slice(i, i + PEERS_PER_REQUEST));
  const results = await Promise.all(batches.map(queryBatch));
  if (results.some((result) => result === null)) return null;

  batches.forEach((batch, b) => batch.forEach((deskId, i) => states.set(deskId, results[b]?.[i] ?? false)));
  return states;
}
