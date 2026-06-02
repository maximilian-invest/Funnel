// Prefix for static assets referenced via plain <img src> (logos), so they
// resolve correctly when the site is served from a sub-path on GitHub Pages
// (https://<owner>.github.io/Funnel/). Next prefixes its own /_next assets and
// <Link> hrefs automatically via basePath; raw <img> srcs we prefix ourselves.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${BASE_PATH}${path}`;
