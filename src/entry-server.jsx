import { renderToString } from 'react-dom/server';
import { App } from './App.jsx';

/**
 * Build-time entry point.
 *
 * The prerenderer imports this bundle in Node and calls `render(page)` for
 * each public route, so the copy in the served HTML is produced by the same
 * React components the browser runs. There is no second copy of the content
 * to keep in sync, and no headless browser in the build.
 */
export function render(page) {
  return renderToString(<App page={page} />);
}
