// Serve the rental microsite on its own hostname while leaving the main site intact.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname !== 'mac-studio.hoflings.com') return context.next();
  url.pathname = `/mac-studio${url.pathname}`;
  return context.env.ASSETS.fetch(new Request(url, context.request));
}
