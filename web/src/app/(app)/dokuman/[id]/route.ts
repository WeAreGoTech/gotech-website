import { z } from "zod";
import { DOCUMENT_KIND_LABELS } from "@/features/documents/labels";
import { getDocument } from "@/features/documents/queries";
import { getCurrentUser } from "@/lib/auth/session";
import { formatDate } from "@/lib/format";
import { mockPdf } from "@/lib/mock-pdf";

export async function GET(_request: Request, ctx: RouteContext<"/dokuman/[id]">) {
  const user = await getCurrentUser();
  if (!user) return new Response("Önce giriş yapın.", { status: 401 });

  const { id } = await ctx.params;
  const document = z.uuid().safeParse(id).success ? await getDocument(id) : null;
  // customers only see their own company's documents; answer 404 either way so ids cannot be probed
  if (!document || (user.role === "customer" && document.companyId !== user.companyId)) {
    return new Response("Doküman bulunamadı.", { status: 404 });
  }

  const pdf = mockPdf([
    document.title,
    document.companyName,
    `Tür: ${DOCUMENT_KIND_LABELS[document.kind]}`,
    `Eklenme tarihi: ${formatDate(document.createdAt)}`,
    "",
    "Bu dosya GoTech panel taslağı için oluşturulmuş örnek bir dokümandır.",
  ]);
  return new Response(pdf as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${document.fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
