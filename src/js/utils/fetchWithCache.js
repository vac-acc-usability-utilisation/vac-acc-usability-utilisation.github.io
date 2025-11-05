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

/** Simple debounce */
export function debounce(fn, wait = 250) {
    let t;
    return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    };
}