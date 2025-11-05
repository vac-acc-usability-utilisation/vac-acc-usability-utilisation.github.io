export const fetchCache = new Map();

// Prefix for sessionStorage keys used by template/data caching
const SESSION_CACHE_PREFIX = 'app-cache:';

function getSessionKey(key) {
  return `${SESSION_CACHE_PREFIX}${key}`;
}

/**
 * Fetch a URL and cache the text result in-memory.
 * Returns text for .html/.json etc.
 */
export async function fetchWithCache(url, options = {}) {
  const { cachePolicy, ...fetchOpts } = options || {};

  // Determine caching strategy
  const strategy = cachePolicy?.strategy || 'memory'; // 'memory' | 'session' | 'both'
  const forceRefresh = Boolean(cachePolicy?.forceRefresh);
  const cacheKey = cachePolicy?.key || url;

  // sessionStorage read path
  if (!forceRefresh && (strategy === 'session' || strategy === 'both')) {
    try {
      const serialized = sessionStorage.getItem(getSessionKey(cacheKey));
      if (serialized != null) return serialized;
    } catch (_e) {
      // sessionStorage might be unavailable (privacy mode); ignore and continue
    }
  }

  // in-memory read path
  if (!forceRefresh && (strategy === 'memory' || strategy === 'both')) {
    if (fetchCache.has(cacheKey)) return fetchCache.get(cacheKey);
  }

  const resp = await fetch(url, fetchOpts);
  if (!resp.ok) throw new Error(`Failed to fetch ${url}: ${resp.status}`);
  const text = await resp.text();

  // write-through caching
  if (strategy === 'memory' || strategy === 'both') {
    fetchCache.set(cacheKey, text);
  }
  if (strategy === 'session' || strategy === 'both') {
    try {
      sessionStorage.setItem(getSessionKey(cacheKey), text);
    } catch (_e) {
      // Quota or availability issues; ignore silently
    }
  }
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
    // Prefer session+memory cache for templates for faster back/forward nav
    const html = await fetchWithCache(url, {
      ...(options || {}),
      cachePolicy: {
        strategy: 'both',
        key: url,
        ...(options?.cachePolicy || {}),
      },
    });
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

/**
 * Clear in-memory cache and any sessionStorage entries created by fetchWithCache
 */
export function clearAllCaches() {
  try {
    // Clear memory cache
    fetchCache.clear();
    // Clear session entries with our prefix only
    if (typeof sessionStorage !== 'undefined') {
      const keys = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith(SESSION_CACHE_PREFIX)) keys.push(k);
      }
      keys.forEach((k) => sessionStorage.removeItem(k));
    }
  } catch (_e) {
    // ignore
  }
}
