// The desktop app expects JSON from every /api/ path it tries. RustDesk Server Pro serves endpoints
// we do not (device groups, audit, …); without this they would get the site's HTML 404 page, which
// the app cannot parse and reports as a character error instead of a plain "not found".
const notFound = () => Response.json({ error: "Bu özellik GoTech panelinde yok." }, { status: 404 });

export const GET = notFound;
export const POST = notFound;
export const PUT = notFound;
export const PATCH = notFound;
export const DELETE = notFound;
