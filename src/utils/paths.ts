/**
 * Helper to construct URLs respecting Astro's configured `base` path.
 * In Astro / Vite, `import.meta.env.BASE_URL` contains the subpath configured in `astro.config.mjs`.
 */
export function getPath(path: string = ''): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  if (!path || path === '/') {
    return `${base}/`;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
