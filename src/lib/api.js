/**
 * Thin fetch wrapper for the site's own API.
 *
 * The admin session lives in an httpOnly cookie, so every call is
 * same-origin with credentials and no token ever touches the browser storage.
 */
export async function api(path, { method = 'GET', body } = {}) {
  try {
    const res = await fetch(path, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, data: { error: 'Network error — check your connection.' }, err };
  }
}
