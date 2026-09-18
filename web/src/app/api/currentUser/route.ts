import { userPayload } from "@/features/desk-account/payload";
import { deskAccountUser } from "@/features/desk-account/session";

// Polled by the app to check the session is still good; a 401 logs it out.
export async function POST(request: Request) {
  const user = await deskAccountUser(request);
  if (!user) return Response.json({ error: "Oturum sona erdi." }, { status: 401 });
  return Response.json(userPayload(user));
}
