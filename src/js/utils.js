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
 * Simple debounce function.
 * @param {Function} fn - The function to debounce.
 * @param {number} wait - The number of milliseconds to wait before calling the function.
 * @returns {Function} - A debounced version of the function.
 */
export function debounce(fn, wait = 250) {
    let t;
    return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    };
}

// Constants
export const DEFAULT_LANGUAGE = 'en'; // Default language constant