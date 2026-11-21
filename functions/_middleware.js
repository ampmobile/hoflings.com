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
  if (['/lead-context.js', '/analytics.js'].includes(url.pathname)) return context.env.ASSETS.fetch(context.request);
  if (url.pathname === '/.well-known/cloudmac.json') {
    url.pathname = '/mac-studio/cloudmac.json';
    const asset = await context.env.ASSETS.fetch(new Request(url, context.request));
    const response = new Response(asset.body, asset);
    response.headers.set('content-type', 'application/json; charset=utf-8');
    response.headers.set('access-control-allow-origin', '*');
    response.headers.set('cache-control', 'public, max-age=300');
    return response;
  }
  url.pathname = `/mac-studio${url.pathname}`;
  return context.env.ASSETS.fetch(new Request(url, context.request));
}
