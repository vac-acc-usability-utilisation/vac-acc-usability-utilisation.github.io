/**
 * Manages select-searchable dropdown components
 */
class SelectSearchable {
  constructor() {
    this.root = null;
    this.handlers = new WeakMap(); // Store handlers per element
    this.documentClickHandler = null;
    this.initialized = false;
  }

  /**
   * Initialize select-searchable components within a root element
   * @param {HTMLElement} root - Root element to search for components
   */
  init(root = document.body) {
    if (!root) return;
    
    this.root = root;

    // Initialize each component
    root.querySelectorAll('.select-searchable').forEach((wrapper) => {
      this.initComponent(wrapper);
    });

    // Set up document-level click handler (only once)
    if (!this.initialized) {
      this.documentClickHandler = () => this.closeAll();
      document.addEventListener('click', this.documentClickHandler);
      this.initialized = true;
    }
  }

  /**
   * Initialize a single select-searchable component
   * @private
   */
  initComponent(wrapper) {
    const btn = wrapper.querySelector('.select-searchable-btn');
    const content = wrapper.querySelector('.select-content');
    if (!btn || !content) return;

    // Skip if already initialized
    if (this.handlers.has(btn)) return;

    // Ensure initial visibility matches state
    if (!wrapper.classList.contains('open')) {
      content.style.display = 'none';
    }

    // Create handlers
    const btnHandler = (e) => {
      e.stopPropagation();
      const isOpen = wrapper.classList.toggle('open');
      content.style.display = isOpen ? '' : 'none';
      btn.setAttribute('aria-expanded', String(isOpen));
    };

    const contentHandler = (e) => {
      e.stopPropagation();
    };

    // Store handlers for cleanup
    this.handlers.set(btn, { btnHandler, contentHandler, content });

    // Attach listeners
    btn.addEventListener('click', btnHandler);
    content.addEventListener('click', contentHandler);
  }

  /**
   * Close all open select-searchable components
   * @private
   */
  closeAll() {
    if (!this.root) return;
    
    this.root.querySelectorAll('.select-searchable.open').forEach((wrapper) => {
      wrapper.classList.remove('open');
      const content = wrapper.querySelector('.select-content');
      if (content) content.style.display = 'none';
    });
  }

  /**
   * Clean up all event listeners
   */
  destroy() {
    // Remove element-specific listeners
    this.handlers.forEach((handlers, btn) => {
      btn.removeEventListener('click', handlers.btnHandler);
      if (handlers.content) {
        handlers.content.removeEventListener('click', handlers.contentHandler);
      }
    });
    this.handlers = new WeakMap();

    // Remove document listener
    if (this.documentClickHandler) {
      document.removeEventListener('click', this.documentClickHandler);
      this.documentClickHandler = null;
    }

    this.root = null;
    this.initialized = false;
  }
}

// Singleton instance
let selectSearchableInstance = null;

/**
 * Initialize select-searchable components (backward compatible API)
 * @param {HTMLElement} root - Root element to search for components
 */
export function initSelectSearchable(root = document.body) {
  if (!selectSearchableInstance) {
    selectSearchableInstance = new SelectSearchable();
  }
  selectSearchableInstance.init(root);
}

/**
 * Destroy select-searchable instance
 */
export function destroySelectSearchable() {
  if (selectSearchableInstance) {
    selectSearchableInstance.destroy();
    selectSearchableInstance = null;
  }
}
