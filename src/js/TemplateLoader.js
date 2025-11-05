import { fetchTemplate, perfStart, perfEnd } from './utils.js';

/**
 * Handles template loading, rendering, and associated state management
 */
export class TemplateLoader {
  constructor(containerId = 'page') {
    this.container = document.getElementById(containerId);
    this.progressIndicator = document.getElementById('progress-indicator');
  }

  /**
   * Shows or hides the loading progress indicator
   * @private
   */
  _setLoading(isLoading) {
    if (this.progressIndicator) {
      this.progressIndicator.hidden = !isLoading;
    }
  }

  /**
   * Displays a 404 error message in the container
   * @private
   */
  _show404(path) {
    if (!this.container) return;
    this.container.innerHTML = 
      `<h1>404</h1><p>The page "${path}" could not be found.</p>`;
  }

  /**
   * Fetches and renders a template into the container
   * @param {string} path - Template path to fetch
   * @param {object} options - Options for fetching and rendering
   * @param {boolean} options.throwOnError - Whether to throw on fetch errors
   * @returns {Promise<boolean>} Success status
   */
  async fetchAndRender(path, { throwOnError = true } = {}) {
    if (!this.container) return false;
    
    this._setLoading(true);
    const totalMark = perfStart(`TemplateLoader.total: ${path}`);
    const fetchMark = perfStart(`TemplateLoader.fetch: ${path}`);
    
    try {
      const html = await fetchTemplate(path, { throwOnError });
      perfEnd(fetchMark);
      this.container.innerHTML = html;

      // Scroll to top after render
      setTimeout(() => window.scrollTo(0, 0), 0);

      // Accessibility: move focus to role="main" if present, else first heading, else container
      try {
        const mainRegion = this.container.matches('[role="main"]')
          ? this.container
          : this.container.querySelector('[role="main"]');

        const focusTarget = mainRegion || this.container.querySelector('h1, h2') || this.container;

        const previousTabIndex = focusTarget.getAttribute('tabindex');
        focusTarget.setAttribute('tabindex', '-1');
        focusTarget.focus({ preventScroll: true });
        if (previousTabIndex === null) {
          focusTarget.addEventListener('blur', () => {
            focusTarget.removeAttribute('tabindex');
          }, { once: true });
        }
      } catch (_e) {
        // best-effort only
      }

      perfEnd(totalMark);
      return true;
    } catch (err) {
      console.warn('Template loading error:', err);
      this._show404(path);
      return false;
    } finally {
      this._setLoading(false);
    }
  }
}