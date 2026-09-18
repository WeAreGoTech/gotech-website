import { addressBookFor } from "@/features/desk-account/address-book";
import { deskAccountUser } from "@/features/desk-account/session";

// The legacy RustDesk address book: one JSON string holding every peer and tag. Ours is built from
// the panel on each pull, so the computers a technician sees are always the registered ones.
const unauthorized = () => Response.json({ error: "Oturum sona erdi." }, { status: 401 });

export async function GET(request: Request) {
  const user = await deskAccountUser(request);
  if (!user) return unauthorized();
  return Response.json({ data: JSON.stringify(await addressBookFor(user)) });
}

// The app pushes its copy back after an edit. The list belongs to the panel, so this accepts the
// request and changes nothing; answering with an error would only show the user a failure toast.
export async function POST(request: Request) {
  const user = await deskAccountUser(request);
  if (!user) return unauthorized();
  return new Response(null, { status: 200 });
}
