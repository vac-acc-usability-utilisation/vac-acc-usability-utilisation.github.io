/**
 * @typedef {Object} Route
 * @property {string} product - The product identifier (e.g., 'csa')
 * @property {string} mode - The mode (e.g., 'design', 'demo')
 * @property {string} appArea - The application area/section
 * @property {string|null} areaPage - Optional sub-page within an area
 * @property {string|null} pageTab - Optional tab within a page
 * @property {boolean} hasTabs - Whether the current route has tab segments
 */

/**
 * @typedef {function(Route): void} RouteChangeCallback
 */

import { loadPage } from './loadPage.js';

const DEFAULT_PRODUCT = 'csa';
const DEFAULT_MODE = 'design';
const DEFAULT_APP_AREA = 'home';

let currentRoute = null;
const routeChangeCallbacks = new Set();

/**
 * Subscribe to route changes. Returns an unsubscribe function.
 * @param {RouteChangeCallback} callback - Function to call when route changes
 * @returns {function(): void} Unsubscribe function
 */
export function onRouteChange(callback) {
  routeChangeCallbacks.add(callback);
  return () => routeChangeCallbacks.delete(callback);
}

/**
 * Get the current route object.
 * @returns {Route} The current route
 */
export function getCurrentRoute() {
  const hash = getCurrentHash();
  const segments = parseHash(hash);
  currentRoute = createRouteFromSegments(segments);
  return { ...currentRoute }; // Return copy to prevent mutation
}

/**
 * Navigate to a new route.
 * @param {string[]} segments - Route segments to navigate to
 * @param {Object} [options] - Navigation options
 * @param {boolean} [options.replace=false] - Replace current history entry instead of pushing
 */
export function navigateTo(segments, { replace = false } = {}) {
  const newHash = '#' + segments.filter(Boolean).join('/');
  if (replace) {
    window.location.replace(newHash);
  } else {
    window.location.hash = newHash;
  }
}

/**
 * Main routing handler - called on hash changes
 */
export function handleRouting() {
  const hash = getCurrentHash();
  const segments = parseHash(hash);
  const route = createRouteFromSegments(segments);

  // Update current route and notify subscribers
  currentRoute = route;
  notifyRouteChange(route);

  // Load the page content
  const pageSegments = getSegmentsFromRoute(route);
  loadPage(pageSegments);
}

// Notify all route change subscribers
function notifyRouteChange(route) {
  for (const callback of routeChangeCallbacks) {
    try {
      callback(route);
    } catch (err) {
      console.error('Error in route change callback:', err);
    }
  }
}

/**
 * Helper to get the current product from the route
 * @returns {string} Current product ID
 */
export function getCurrentProduct() {
  return getCurrentRoute().product;
}

/**
 * Helper to get the current mode from the route
 * @returns {string} Current mode
 */
export function getCurrentMode() {
  return getCurrentRoute().mode;
}

// Remove '#' and split into segments
function getCurrentHash() {
  return window.location.hash.slice(1);
}

/**
 * Parse hash string into segment array, preserving positions of empty segments
 * @param {string} hash - The URL hash without the # prefix
 * @returns {string[]} Array of segments with empty strings for empty segments
 */
function parseHash(hash) {
  if (!hash) return [];
  // Split but don't filter out empty segments to preserve positions
  return hash.split('/');
}

/**
 * Create a route object from URL segments
 * @param {string[]} segments - URL segments
 * @returns {Route} Parsed route object
 */
function createRouteFromSegments(segments) {
  // Only use non-empty segments for each position
  return {
    product: segments[0] || DEFAULT_PRODUCT,
    mode: segments[1]?.trim() || DEFAULT_MODE,
    appArea: segments[2]?.trim() || DEFAULT_APP_AREA,
    areaPage: segments[3]?.trim() || null,
    pageTab: segments[4]?.trim() || null,
    hasTabs: !!segments[4]?.trim(),
  };
}

function getSegmentsFromRoute(route) {
  const segments = [route.product, route.mode, route.appArea];
  if (route.areaPage) segments.push(route.areaPage);
  if (route.pageTab) segments.push(route.pageTab);
  return segments;
}

// Initialize routing
window.addEventListener('hashchange', handleRouting);
