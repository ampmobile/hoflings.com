// Serve the rental microsite on its own hostname while leaving the main site intact.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname !== 'mac-studio.hoflings.com') {
    if (url.pathname === '/mac-studio' || url.pathname.startsWith('/mac-studio/')) {
      const path = url.pathname.slice('/mac-studio'.length) || '/';
      const target = new URL('https://mac-studio.hoflings.com/');
      target.pathname = path === '/index.html' ? '/' : path;
      target.search = url.search;
      return Response.redirect(target, 301);
    }
    return context.next();
  }
  if (url.pathname === '/index.html' || url.pathname === '/index') {
    url.pathname = '/';
    return Response.redirect(url, 301);
  }
  // Let the existing Pages Functions backend handle rental submissions.
  if (url.pathname === '/rental-quotes') return context.next();
  url.pathname = `/mac-studio${url.pathname}`;
  return context.env.ASSETS.fetch(new Request(url, context.request));
}
