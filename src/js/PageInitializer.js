import { initSearch, destroySearch } from './search.js';
import {
  updateActiveRailItem,
  handleNavigationMenu,
  handleClientMenu,
  updateSubmenus,
} from './navigationBridge.js';
import { initToolsPanel, destroyToolsPanel } from './toolsPanel.js';
import { initSelectSearchable, destroySelectSearchable } from './select-searchable.js';

/**
 * Handles all page initialization tasks after template loading
 */
export class PageInitializer {
  constructor() {
    this.toolsPanelInstance = null;
    this.initialized = false;
  }
  /**
   * Initialize navigation-related UI elements
   * @param {string[]} segments Route segments for navigation state
   */
  initNavigation(segments) {
    try {
      updateActiveRailItem(segments[2]); // Assuming area is the 3rd segment
    } catch (e) {
      console.warn('updateActiveRailItem failed', e);
    }

    try {
      handleNavigationMenu(segments);
    } catch (e) {
      console.warn('handleNavigationMenu failed', e);
    }

    try {
      handleClientMenu(segments);
    } catch (e) {
      console.warn('handleClientMenu failed', e);
    }

    try {
      updateSubmenus(segments[2], segments[3]);
    } catch (e) {
      console.warn('updateSubmenus failed', e);
    }
  }

  /**
   * Initialize tools panels and related functionality
   */
  initTools() {
    const pageContainer = document.getElementById('page');
    if (!pageContainer) return;

    // Initialize tools panel with scoped root
    this.toolsPanelInstance = initToolsPanel(pageContainer);

    // Set up specific buttons
    this.toolsPanelInstance.setupButton('#add-identifier-btn', 'src/templates/csa/demo/forms/add-identifier.html');
    this.toolsPanelInstance.setupButton('.id-edit-btn', 'src/templates/csa/demo/forms/edit-identifier.html');
    this.toolsPanelInstance.setupButton('.id-info-btn', 'src/templates/csa/demo/forms/info-identifier.html');
  }

  /**
   * Initialize search functionality if needed
   * @param {string[]} segments Route segments to check search state
   */
  async initSearch(segments) {
    if (segments.includes('search')) {
      try {
        const pageContainer = document.getElementById('page');
        await initSearch(pageContainer);
      } catch (e) {
        console.warn('initSearch failed', e);
      }
    }
  }

  /**
   * Initialize tab selection
   * @param {string} tab Tab name to activate
   */
  initTabs(tab) {
    const tabLinks = document.querySelectorAll('nav.tabs a[data-tab]');
    const pageDivs = document.querySelectorAll('[data-page]');
    if (tabLinks.length === 0 || pageDivs.length === 0) return;

    tabLinks.forEach((tabLink) => {
      tabLink.classList.toggle('active', tabLink.dataset.tab === tab);
    });
    pageDivs.forEach((div) => {
      div.classList.toggle('active', div.getAttribute('data-page') === tab);
    });
  }

  /**
   * Initialize the searchable select components
   */
  initSelectBehavior() {
    const pageContainer = document.getElementById('page');
    try {
      initSelectSearchable(pageContainer);
    } catch (e) {
      console.warn('initSelectSearchable failed', e);
    }
  }

  /**
   * Clean up all initialized components
   */
  destroy() {
    // Destroy tools panel
    if (this.toolsPanelInstance) {
      destroyToolsPanel();
      this.toolsPanelInstance = null;
    }

    // Destroy select searchable
    destroySelectSearchable();

    // Destroy search (if initialized)
    destroySearch();

    this.initialized = false;
  }

  /**
   * Run all initialization tasks in the correct order
   * @param {string[]} segments Route segments for initialization context
   */
  async init(segments) {
    // Clean up previous initialization
    if (this.initialized) {
      this.destroy();
    }

    // Initialize navigation first (most visible)
    this.initNavigation(segments);

    // Initialize tools (may depend on navigation)
    this.initTools();

    // Initialize UI components
    this.initSelectBehavior();

    // Initialize tabs (needs page content ready)
    const pageTab = segments[4] || 'overview'; // fallback to default tab
    this.initTabs(pageTab);

    // Initialize search last (potentially heavy operation)
    await this.initSearch(segments);

    this.initialized = true;
  }
}