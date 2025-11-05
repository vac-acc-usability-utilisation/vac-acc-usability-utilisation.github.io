import { fetchTemplate } from './utils.js';

/**
 * Manages filter panel UI, state, and interactions
 */
export class FiltersPanel {
  constructor(elementId = 'filtersPanel') {
    this.panel = document.getElementById(elementId);
  }

  /**
   * Initialize notebook search filters
   * @private
   */
  _initNotebookSearchFilters() {
    const group = document.querySelector('nav.group.segmented-button');
    if (!group) return;

    const buttons = Array.from(group.querySelectorAll('button.segmented-button'));
    if (buttons.length < 3) return;

    // Add click handlers to ensure at least one button is always selected
    const [btn1, btn2, btn3] = buttons;
    const addButtonHandler = (btn, otherBtns) => {
      btn.addEventListener('click', () => {
        const wasSelected = btn.classList.contains('fill');
        if (wasSelected && !otherBtns.some(b => b.classList.contains('fill'))) {
          return; // Prevent deselecting last selected
        }
        btn.classList.toggle('fill');
      });
    };

    addButtonHandler(btn1, [btn2, btn3]);
    addButtonHandler(btn2, [btn1, btn3]);
    addButtonHandler(btn3, [btn1, btn2]);

    // Ensure at least one is selected
    if (!buttons.some(btn => btn.classList.contains('fill'))) {
      btn1.classList.add('fill');
    }

    // Set up expand/collapse for different sections
    this._setupExpandCollapse('name');
    this._setupExpandCollapse('identifier');
    this._setupExpandCollapse('address', 'fieldset');
  }

  /**
   * Set up expand/collapse behavior for a filter section
   * @private
   */
  _setupExpandCollapse(section, containerType = '.field') {
    const expandBtn = document.getElementById(`expand-${section}-filters`);
    const condenseBtn = document.getElementById(`condense-${section}-filters`);
    const additionalFilters = document.getElementById(`additional-${section}-filters`);

    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        additionalFilters?.classList.remove('hidden');
        expandBtn.closest(containerType)?.classList.add('hidden');
      });
    }

    if (condenseBtn) {
      condenseBtn.addEventListener('click', () => {
        additionalFilters?.classList.add('hidden');
        // Show the main field again
        const selector = containerType === 'fieldset' ? 'fieldset' : '.field.border';
        document.querySelectorAll(selector).forEach(field => {
          if (field.querySelector(`#expand-${section}-filters`)) {
            field.classList.remove('hidden');
          }
        });
      });
    }
  }

  /**
   * Load template content into the filters panel
   * @private
   */
  async _loadTemplate(templatePath, afterLoadCallback) {
    if (!this.panel) return;

    try {
      const html = await fetchTemplate(templatePath, {
        fallbackHtml: '<div class="filters-placeholder">Filters unavailable</div>'
      });
      this.panel.innerHTML = html;
      if (typeof afterLoadCallback === 'function') {
        afterLoadCallback();
      }
    } catch (err) {
      console.warn('Unable to load filters panel template', err);
      this.panel.innerHTML = '<div class="filters-placeholder">Filters unavailable</div>';
    }
  }

  /**
   * Update filters panel visibility and content based on route
   * @param {string[]} segments Route segments determining panel state
   */
  async update(segments) {
    if (!this.panel) return;

    const isDemoMode = segments[1] === 'demo';
    const isWorkItemsPage = segments[2] === 'work-items';
    const isClientSearchPage = segments[2] === 'search';

    if (isDemoMode && isWorkItemsPage) {
      this.panel.classList.remove('hidden');
    } else if (isDemoMode && isClientSearchPage) {
      this.panel.classList.remove('hidden');
      await this._loadTemplate(
        'src/templates/csa/demo/forms/notebook-search.html',
        () => this._initNotebookSearchFilters()
      );
    } else {
      this.panel.classList.add('hidden');
    }
  }
}