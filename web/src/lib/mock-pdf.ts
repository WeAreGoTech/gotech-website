// Builds a one-page PDF so document downloads work in the mockup without stored files.
// Built-in PDF fonts have no Turkish glyphs, so text is reduced to ASCII.

const toAscii = (value: string) =>
  value
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\x20-\x7E]/g, "?")
    .replace(/[()\\]/g, (c) => `\\${c}`);

const TITLE_SIZE = 22;
const BODY_SIZE = 12;
const LINE_GAP = 24;

export function mockPdf([title, ...lines]: string[]): Uint8Array {
  const content = [
    "BT",
    `/F1 ${TITLE_SIZE} Tf`,
    "72 740 Td",
    `(${toAscii(title)}) Tj`,
    `/F1 ${BODY_SIZE} Tf`,
    ...lines.flatMap((line) => [`0 -${LINE_GAP} Td`, `(${toAscii(line)}) Tj`]),
    "ET",
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  // everything is ASCII, so string length equals byte offset
  let pdf = "%PDF-1.4\n";
  const offsets = objects.map((object, i) => {
    const offset = pdf.length;
    pdf += `${i + 1} 0 obj\n${object}\nendobj\n`;
    return offset;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new TextEncoder().encode(pdf);
}
