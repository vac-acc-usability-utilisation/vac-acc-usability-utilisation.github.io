import { initSelectSearchable } from './select-searchable.js';
import { debounce, fetchTemplate } from './utils.js';

/**
 * Manages tools panel interactions
 */
class ToolsPanel {
  constructor(panelId = 'toolsPanel') {
    this.panelId = panelId;
    this.root = null;
    this.handlers = new Map(); // Store button handlers for cleanup
    this.initialized = false;
  }

  /**
   * Initialize tools panel with scoped event delegation
   * @param {HTMLElement} root - Root element for event delegation
   */
  init(root = document.body) {
    if (this.initialized) return;
    this.root = root;
    this.initialized = true;
  }

  /**
   * Set up a handler for a specific button
   * @param {string} buttonSelector - CSS selector for the button
   * @param {string|Function} content - HTML string, template path, or async function
   */
  setupButton(buttonSelector, content) {
    if (!this.root) {
      console.warn('ToolsPanel not initialized. Call init(root) first.');
      return;
    }

    // Wait for DOM to settle
    setTimeout(() => {
      const btn = this.root.querySelector(buttonSelector);
      if (!btn) return;

      // Remove existing handler if present
      if (this.handlers.has(buttonSelector)) {
        const oldHandler = this.handlers.get(buttonSelector);
        btn.removeEventListener('click', oldHandler);
      }

      // Create debounced handler
      const handler = debounce(async () => {
        console.log('Tools Panel button clicked:', buttonSelector);
        await this.loadContent(content);
      }, 250);

      // Store handler for cleanup
      this.handlers.set(buttonSelector, handler);
      btn.addEventListener('click', handler);
    }, 0);
  }

  /**
   * Load content into the tools panel
   * @private
   */
  async loadContent(content) {
    const panel = document.getElementById(this.panelId);
    if (!panel) return;

    panel.classList.remove('hidden');

    // Load content based on type
    if (typeof content === 'function') {
      panel.innerHTML = await content();
    } else if (typeof content === 'string' && content.endsWith('.html')) {
      const html = await fetchTemplate(content, {
        fallbackHtml: '<p>Could not load tools panel content.</p>'
      });
      panel.innerHTML = html;
    } else {
      panel.innerHTML = content;
    }

    // Initialize select-searchable for new content
    try {
      initSelectSearchable(panel);
    } catch (e) {
      console.warn('initSelectSearchable failed in toolsPanel', e);
    }
  }

  /**
   * Clean up all event listeners
   */
  destroy() {
    if (!this.root) return;

    // Remove all button handlers
    this.handlers.forEach((handler, selector) => {
      const btn = this.root.querySelector(selector);
      if (btn) {
        btn.removeEventListener('click', handler);
      }
    });

    this.handlers.clear();
    this.root = null;
    this.initialized = false;
  }
}

// Singleton instance
let toolsPanelInstance = null;

/**
 * Initialize tools panel
 * @param {HTMLElement} root - Root element for event delegation
 */
export function initToolsPanel(root = document.body) {
  if (!toolsPanelInstance) {
    toolsPanelInstance = new ToolsPanel();
    toolsPanelInstance.init(root);
  }
  return toolsPanelInstance;
}

/**
 * Destroy tools panel
 */
export function destroyToolsPanel() {
  if (toolsPanelInstance) {
    toolsPanelInstance.destroy();
    toolsPanelInstance = null;
  }
}

/**
 * Sets up a handler to open the tools panel and load content when a button is clicked.
 * @param {string} buttonSelector - CSS selector for the button to trigger the panel
 * @param {string|Function} content - HTML string, template path, or async function returning HTML
 */
export function setupToolsPanel(buttonSelector, content) {
  if (!toolsPanelInstance) {
    toolsPanelInstance = new ToolsPanel();
    toolsPanelInstance.init();
  }
  toolsPanelInstance.setupButton(buttonSelector, content);
}
