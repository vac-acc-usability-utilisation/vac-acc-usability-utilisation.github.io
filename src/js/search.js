import { fetchWithCache, debounce } from './utils.js';

/**
 * Manages search functionality and UI
 */
class Search {
  constructor(options = {}) {
    this.options = {
      indexPath: 'src/lunr/en.json',
      searchInputId: 'search',
      resultsSelector: '.search-results',
      debounceMs: 240,
      ...options
    };

    this.root = null;
    this.searchIndex = null;
    this.documents = null;
    this.searchInput = null;
    this.resultsDiv = null;
    this.inputHandler = null;
    this.initialized = false;
  }

  /**
   * Initialize search with root element
   * @param {HTMLElement} root - Root element containing search UI
   */
  async init(root = document.body) {
    if (this.initialized) return;
    
    this.root = root;

    // Load search index
    await this.loadIndex();

    // Wire up UI
    this.setupUI();

    this.initialized = true;
  }

  /**
   * Load and build search index
   * @private
   */
  async loadIndex() {
    try {
      const documentsText = await fetchWithCache(this.options.indexPath);
      this.documents = JSON.parse(documentsText);

      // Build Lunr index
      const documents = this.documents;
      this.searchIndex = lunr(function () {
        this.ref('id');
        this.field('title');
        this.field('body');
        this.field('keywords');
        documents.forEach(function (doc) {
          this.add(doc);
        }, this);
      });

    } catch (err) {
      console.error('Could not load search index', err);
      throw err;
    }
  }

  /**
   * Set up search UI and event listeners
   * @private
   */
  setupUI() {
    this.searchInput = this.root.querySelector(`#${this.options.searchInputId}`);
    this.resultsDiv = this.root.querySelector(this.options.resultsSelector);

    if (!this.searchInput || !this.resultsDiv) {
      console.warn('Search input or results container not found');
      return;
    }

    // Create debounced input handler
    this.inputHandler = debounce((e) => {
      this.performSearch(e.target.value);
    }, this.options.debounceMs);

    // Attach listener
    this.searchInput.addEventListener('input', this.inputHandler);
  }

  /**
   * Perform search and render results
   * @private
   */
  performSearch(query) {
    if (!this.searchIndex || !this.resultsDiv) return;

    const q = query.trim();
    
    // Empty query
    if (!q) {
      this.resultsDiv.innerHTML = '<h2 class="font-body">Recent searches</h2>';
      return;
    }

    // Execute search
    let results = [];
    try {
      results = this.searchIndex.search(q);
    } catch (e) {
      console.warn('Search error:', e);
      results = [];
    }

    // Render results
    if (results.length === 0) {
      this.resultsDiv.innerHTML = `<p>No results found for "${q}".</p>`;
      return;
    }

    const resultHtml = results.map((r) => {
      const doc = this.documents.find((d) => d.id === r.ref);
      return `<div class="search-result grid">
                <a href="${doc.url}" class="card sm12 md12 lg4 xl4 xxl4">
                  <article class="round wave">
                    <h3 class="font-title">${doc.title}</h3>
                    <p>${doc.body}</p>
                  </article>
                </a>
              </div>`;
    }).join('');

    this.resultsDiv.innerHTML = 
      `<div class="search-summary bottom-margin">Showing ${results.length} result${results.length !== 1 ? 's' : ''} for "${q}"</div>` +
      resultHtml;
  }

  /**
   * Clean up search instance
   */
  destroy() {
    // Remove event listener
    if (this.searchInput && this.inputHandler) {
      this.searchInput.removeEventListener('input', this.inputHandler);
    }

    // Clear references
    this.searchInput = null;
    this.resultsDiv = null;
    this.inputHandler = null;
    this.searchIndex = null;
    this.documents = null;
    this.root = null;
    this.initialized = false;
  }
}

// Singleton instance
let searchInstance = null;

/**
 * Initialize search (backward compatible API)
 * @param {HTMLElement} root - Root element containing search UI
 */
export async function initSearch(root = document.body) {
  if (!searchInstance) {
    searchInstance = new Search();
  }
  await searchInstance.init(root);
}

/**
 * Destroy search instance
 */
export function destroySearch() {
  if (searchInstance) {
    searchInstance.destroy();
    searchInstance = null;
  }
}
