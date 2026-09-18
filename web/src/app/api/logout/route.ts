import { deskSessionToken, endDeskSession } from "@/features/desk-account/session";

export async function POST(request: Request) {
  const token = deskSessionToken(request);
  if (token) await endDeskSession(token);
  return Response.json({});
}
