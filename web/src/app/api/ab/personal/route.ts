// 404 puts the app in legacy address book mode, which is the single list /api/ab serves.
export function POST() {
  return new Response(null, { status: 404 });
}
