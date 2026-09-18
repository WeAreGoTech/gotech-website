// 404 tells the app there are no shared address books here (flutter/lib/models/ab_model.dart).
export function POST() {
  return new Response(null, { status: 404 });
}
