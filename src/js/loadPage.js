import { TemplateLoader } from './TemplateLoader.js';
import { PageInitializer } from './PageInitializer.js';
import { FiltersPanel } from './FiltersPanel.js';

/**
 * Resolves route segments into a template path.
 * @param {string|string[]} segments - Route segments to resolve
 * @returns {string} The resolved template path
 */
function resolvePath(segments) {
  // Ensure segments is an array
  if (!Array.isArray(segments)) {
    segments = [segments];
  }

  // Construct path based on number of segments
  if (segments.length === 1) {
    return `src/pages/${segments[0]}/home.html`;
  }
  
  // Take first 4 segments: product, mode, appArea, areaPage
  const basePathSegments = segments.slice(0, 4);
  return `src/pages/${basePathSegments.join('/')}.html`;
}

/**
 * Load and initialize a page based on route segments.
 * 
 * @param {string|string[]} segments - Route segments determining which page to load
 * @returns {Promise<{success: boolean, error?: string}>} Result object with success status and optional error
 */
export async function loadPage(segments) {
  if (!Array.isArray(segments)) {
    segments = [segments];
  }
  console.log('Navigating to Page:', segments);

  let success;
  let error;
  
  try {
    const path = resolvePath(segments);
    console.log('Fetching path:', path);

    // 1. Load template first
    const loader = new TemplateLoader();
    success = await loader.fetchAndRender(path);
    if (!success) {
      throw new Error(`Failed to load template: ${path}`);
    }

    // 2. Update filters panel (important for layout)
    const filtersPanel = new FiltersPanel();
    await filtersPanel.update(segments);

    // 3. Initialize all page components
    const initializer = new PageInitializer();
    await initializer.init(segments);

  } catch (e) {
    error = e;
    console.warn('loadPage error:', e);

    try {
      // Handle 404 gracefully
      if (!success) {
        // Only update rail item if template failed to load
        await updateActiveRailItem(404);
      }
    } catch (navError) {
      /* ignore navigation errors on 404 */
    }
  }

  return {
    success: Boolean(success),
    error: error?.message
  };
}


