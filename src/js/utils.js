export const fetchCache = new Map();

/**
 * Fetch a URL and cache the text result in-memory.
 * Returns text for .html/.json etc.
 */
export async function fetchWithCache(url, options) {
  if (fetchCache.has(url)) return fetchCache.get(url);
  const resp = await fetch(url, options);
  if (!resp.ok) throw new Error(`Failed to fetch ${url}: ${resp.status}`);
  const text = await resp.text();
  fetchCache.set(url, text);
  return text;
}

/**
 * Fetch a template with minimal error handling and optional fallback.
 * Returns HTML string. On error, returns fallbackHtml (unless throwOnError=true).
 */
export async function fetchTemplate(
  url,
  {
    fallbackHtml = '<p>Could not load content.</p>',
    throwOnError = false,
    options = undefined,
  } = {}
) {
  try {
    const html = await fetchWithCache(url, options);
    return html;
  } catch (err) {
    console.error(`fetchTemplate: failed to load ${url}`, err);
    if (throwOnError) throw err;
    return fallbackHtml;
  }
}

/**
 * Convenience: fetch a template and inject into a container element.
 * Returns the HTML that was injected.
 */
export async function loadTemplateInto(container, url, opts = {}) {
  if (!container) throw new Error('loadTemplateInto: container required');
  const html = await fetchTemplate(url, opts);
  container.innerHTML = html;
  return html;
}

// ...existing code...
export function debounce(fn, wait = 250) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Constants
export const DEFAULT_LANGUAGE = 'en'; // Default language constant
