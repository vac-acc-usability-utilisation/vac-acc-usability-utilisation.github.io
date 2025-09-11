//let currentLang = 'en';

import { handleRouting, getCurrentMode, getCurrentProduct } from './router.js';
import { initNavigation } from './nav.js';
import { initI18n, initLanguageToggle } from './language.js';

// On DOM ready, initialize navigation and language features
window.addEventListener('DOMContentLoaded', () => {
    console.log('VAC   .\\^/.   ACC\nACC  \\=%¥%=/  VAC\nVAC   ^`|`^   ACC');
    console.log('App initialized');

    updateNavigation();

    // Initialize i18n for translations
    initI18n();
    initLanguageToggle();
});

// Reload navigation and routing when the URL hash changes
window.addEventListener("hashchange", () => {
    updateNavigation()
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
        default: 'src/templates/design-rail.html'
    }
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
            const response = await fetch(navTemplate);
            if (!response.ok) throw new Error('Failed to load navigation template');
            nav.innerHTML = await response.text();
            initNavigation(); // Set up navigation event handlers
            handleRouting(); // Load the correct page content
        } catch (err) {
            console.error('Error loading navigation:', err);
        }
    }

    // Load the navigation menu (common menu for all products/modes)
    const navigationMenu = document.getElementById('navigation-menu');
    if (!navigationMenu) return;

    try {
        const response = await fetch('src/templates/csa/demo/navigation-menu.html');
        if (!response.ok) throw new Error('Failed to load navigationMenu menu template');
        navigationMenu.innerHTML = await response.text();
    } catch (err) {
        console.error('Error loading navigation menu:', err);
    }
}