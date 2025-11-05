//let currentLang = 'en';

import { handleRouting, getCurrentMode, getCurrentProduct } from './router.js';
import { initNavigation } from './navigationBridge.js';
import { initI18n, initLanguageToggle } from './language.js';
import { fetchTemplate, enablePerformanceLogging, clearAllCaches, isPerformanceLoggingEnabled } from './utils.js';

// On DOM ready, initialize navigation and language features
window.addEventListener('DOMContentLoaded', () => {
  console.log('VAC   .\\^/.   ACC\nACC  \\=%¥%=/  VAC\nVAC   ^`|`^   ACC');
  console.log('App initialized');

  // Handle URL query params (separate from hash routing)
  handleQueryParams();

  updateNavigation();

  // Initialize i18n for translations
  initI18n();
  initLanguageToggle();
});

/**
 * Parse and handle URL query parameters (e.g., ?perf=1&clearCache=1)
 * These work independently of the hash-based routing.
 */
function handleQueryParams() {
  try {
    const params = new URLSearchParams(window.location.search);

    // Performance logging toggle
    if (params.has('perf')) {
      const perfValue = params.get('perf');
      if (perfValue === '1') {
        enablePerformanceLogging();
        console.log('⏱️ Performance logging enabled via ?perf=1');
      }
    }

    // Cache clearing
    if (params.has('clearCache') && params.get('clearCache') === '1') {
      clearAllCaches();
      console.log('🗑️ All caches cleared via ?clearCache=1');
    }

    // Check localStorage for persistent perf flag (fallback)
    if (!params.has('perf') && !isPerformanceLoggingEnabled()) {
      const storedFlag = localStorage.getItem('perfLog');
      if (storedFlag === '1') {
        enablePerformanceLogging();
        console.log('⏱️ Performance logging enabled via localStorage');
      }
    }
  } catch (_e) {
    // Silently fail if URLSearchParams or localStorage not available
  }
}

// Reload navigation and routing when the URL hash changes
window.addEventListener('hashchange', () => {
  updateNavigation();
});

/**
 * Updates the navigation menu based on the current product and mode from the URL hash.
 * Called on initial load and whenever the hash changes.
 */
function updateNavigation() {
  const product = getCurrentProduct();
  const mode = getCurrentMode();
  loadNavigation(product, mode);
}

// Map of navigation templates by product and mode
const navTemplates = {
  csa: {
    design: 'src/templates/csa/design/rail.html',
    demo: 'src/templates/csa/demo/rail.html',
    default: 'src/templates/design-rail.html',
  },
};

/**
 * Returns the navigation template path for a given product and mode.
 * @param {string} product - The product key (e.g., 'csa')
 * @param {string} mode - The mode key (e.g., 'design', 'demo')
 * @returns {string} Path to the navigation template HTML file
 */
function getNavTemplate(product, mode) {
  const productTemplates = navTemplates[product];
  if (!productTemplates) return '';
  return productTemplates[mode] || productTemplates.default;
}

/**
 * Loads the navigation rails and navigation menu for the given product and mode.
 * Fetches the appropriate HTML templates and inserts them into the DOM.
 * @param {string} product - The product key
 * @param {string} mode - The mode key
 */
async function loadNavigation(product, mode) {
  const nav = document.getElementById('navigationRail');
  if (!nav) {
    console.error('navigationRail element not found');
    return;
  }

  const navTemplate = getNavTemplate(product, mode);
  if (navTemplate) {
    try {
      // Prefer explicit error handling for the rail (let caller log/show fallback)
      const html = await fetchTemplate(navTemplate, { throwOnError: true });
      nav.innerHTML = html;
      initNavigation(); // Set up navigation event handlers
      handleRouting(); // Load the correct page content
    } catch (err) {
      console.error('Error loading navigation:', err);
      nav.innerHTML = '<div class="nav-error">Navigation could not be loaded.</div>';
    }
  }

  // Load the demo's navigation menu
  const navigationMenu = document.getElementById('navigation-menu');
  if (!navigationMenu) return;

  try {
    // Load mode-specific navigation menu (design vs demo)
    const menuTemplate = mode === 'design'
      ? 'src/templates/csa/design/navigation-menu.html'
      : 'src/templates/csa/demo/navigation-menu.html';

    const html = await fetchTemplate(menuTemplate, {
      fallbackHtml: '<div class="nav-menu-placeholder">Menu unavailable</div>',
    });
    navigationMenu.innerHTML = html;
  } catch (err) {
    console.error('Error loading navigation menu:', err);
  }

  if (product === 'csa' && mode === 'demo') {
    // Load the demo's account menu
    const accountMenu = document.getElementById('account-menu');

    if (!accountMenu) return;

    try {
      const html = await fetchTemplate('src/templates/csa/demo/account-menu.html', {
        fallbackHtml: '<div class="account-menu-placeholder">Account menu unavailable</div>',
      });
      accountMenu.innerHTML = html;
      accountMenu.classList.remove('hidden');
    } catch (err) {
      console.error('Error loading account menu:', err);
    }
  }
}
