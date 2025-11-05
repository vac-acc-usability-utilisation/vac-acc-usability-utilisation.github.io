import { initSearch } from './search.js';
import {
  updateActiveRailItem,
  handleNavigationMenu,
  handleClientMenu,
  updateSubmenus,
} from './nav.js';
import { setupToolsPanel } from './toolsPanel.js';
import { initSelectSearchable } from './select-searchable.js';
import { fetchWithCache } from './utils.js';

//import { getCurrentMode } from "./router.js";

export function loadPage(segments) {
  if (!Array.isArray(segments)) {
    segments = [segments];
  }
  console.log('Navigating to Page:', segments);

  const pageContainer = document.querySelector('#page');
  if (!pageContainer) return;

  let path;
  if (segments.length === 1) {
    path = `src/pages/${segments[0]}/home.html`;
  } else {
    let basePathSegments = segments.slice(0, 4); // product, mode, appArea, areaPage
    path = `src/pages/${basePathSegments.join('/')}.html`;
  }

  console.log('Fetching path:', path);

  fetchWithCache(path)
    .then((html) => {
      // fetchWithCache resolves text so we get html here
      pageContainer.innerHTML = html;

      // Scroll to top
      setTimeout(() => window.scrollTo(0, 0), 0);

      // Handle rail item highlighting
      updateActiveRailItem(segments[2]); // Assuming area is the 3rd segment

      handleNavigationMenu(segments);

      handleClientMenu(segments);
      updateSubmenus(segments[2], segments[3]);
      toggleFiltersPanel(segments);

      setupToolsPanel(
        '#add-identifier-btn',
        'src/templates/csa/demo/forms/add-identifier.html' // or an HTML string, or a function
      );

      setupToolsPanel(
        '.id-edit-btn',
        'src/templates/csa/demo/forms/edit-identifier.html' // or an HTML string, or a function
      );

      setupToolsPanel(
        '.id-info-btn',
        'src/templates/csa/demo/forms/info-identifier.html' // or an HTML string, or a function
      );

      // Initialize minimal select-searchable behaviour for elements inside the newly loaded page
      // This wires simple show/hide toggling for `.select-searchable` components
      try {
        initSelectSearchable(pageContainer);
      } catch (e) {
        console.warn('initSelectSearchable failed', e);
      }

      // Handle tab highlighting after HTML is loaded
      const pageTab = segments[4] || 'overview'; // fallback to default tab
      updateActiveTab(pageTab);

      if (segments.includes('search')) {
        initSearch();
      }

      document.getElementById('progress-indicator').hidden = true; // Hide after load
      return;
    })
    .catch((err) => {
      console.warn('loadPage error', err);
      pageContainer.innerHTML =
        '<h1>404</h1><p>The page "' + segments.slice(0, 4).join('/') + '" could not be found.</p>';
      updateActiveRailItem(404);
      document.getElementById('progress-indicator').hidden = true; // Hide after load
    });
}

// Update active tab based on `data-tab` attribute
function updateActiveTab(currentTab) {
  const tabLinks = document.querySelectorAll('nav.tabs a[data-tab]');
  const pageDivs = document.querySelectorAll('[data-page]');
  if (tabLinks.length === 0 || pageDivs.length === 0) return;

  tabLinks.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.tab === currentTab);
  });
  pageDivs.forEach((div) => {
    div.classList.toggle('active', div.getAttribute('data-page') === currentTab);
  });
}

/**
 * Loads an HTML template into the filtersPanel.
 * @param {string} templatePath - Path to the HTML template file.
 */
async function loadFiltersPanelTemplate(templatePath, afterLoadCallback) {
  const filtersPanel = document.getElementById('filtersPanel');
  if (!filtersPanel) return;

  try {
    const html = await fetchWithCache(templatePath);
    filtersPanel.innerHTML = html;
    if (typeof afterLoadCallback === 'function') afterLoadCallback();
  } catch (err) {
    filtersPanel.innerHTML = '<p>Could not load filters.</p>';
  }
}

function toggleFiltersPanel(segments) {
  const isDemoMode = segments[1] === 'demo';
  const isWorkItemsPage = segments[2] === 'work-items';
  const isClientSearchPage = segments[2] === 'search';
  const filtersPanel = document.getElementById('filtersPanel');
  if (!filtersPanel) return;

  function setupNotebookSearchFilters() {
    const group = document.querySelector('nav.group.segmented-button');
    if (!group) return;
    const buttons = group.querySelectorAll('button.segmented-button');
    if (buttons.length < 3) return;

    const [btn1, btn2, btn3] = buttons;

    btn1.addEventListener('click', function () {
      const wasSelected = btn1.classList.contains('fill');
      // Prevent deselecting the last selected
      if (wasSelected && !btn2.classList.contains('fill') && !btn3.classList.contains('fill')) {
        return;
      }
      btn1.classList.toggle('fill');
    });

    btn2.addEventListener('click', function () {
      const wasSelected = btn2.classList.contains('fill');
      if (wasSelected && !btn1.classList.contains('fill') && !btn3.classList.contains('fill')) {
        return;
      }
      btn2.classList.toggle('fill');
    });

    btn3.addEventListener('click', function () {
      const wasSelected = btn3.classList.contains('fill');
      if (wasSelected && !btn1.classList.contains('fill') && !btn2.classList.contains('fill')) {
        return;
      }
      btn3.classList.toggle('fill');
    });

    // Ensure at least one is selected on load
    if (
      !btn1.classList.contains('fill') &&
      !btn2.classList.contains('fill') &&
      !btn3.classList.contains('fill')
    ) {
      btn1.classList.add('fill');
    }

    // Name expand/collapse
    const expandNameBtn = document.getElementById('expand-name-filters');
    if (expandNameBtn) {
      expandNameBtn.addEventListener('click', function () {
        document.getElementById('additional-name-filters')?.classList.remove('hidden');
        expandNameBtn.closest('.field').classList.add('hidden');
      });
    }
    const condenseNameBtn = document.getElementById('condense-name-filters');
    if (condenseNameBtn) {
      condenseNameBtn.addEventListener('click', function () {
        document.getElementById('additional-name-filters')?.classList.add('hidden');
        // Show the main field again
        document.querySelectorAll('.field.border').forEach((field) => {
          if (field.querySelector('#expand-name-filters')) field.classList.remove('hidden');
        });
      });
    }

    // Identifier expand/collapse
    const expandIdBtn = document.getElementById('expand-id-filters');
    if (expandIdBtn) {
      expandIdBtn.addEventListener('click', function () {
        document.getElementById('additional-identifier-filters')?.classList.remove('hidden');
        expandIdBtn.closest('.field').classList.add('hidden');
      });
    }
    const condenseIdBtn = document.getElementById('condense-id-filters');
    if (condenseIdBtn) {
      condenseIdBtn.addEventListener('click', function () {
        document.getElementById('additional-identifier-filters')?.classList.add('hidden');
        // Show the main field again
        document.querySelectorAll('.field.border').forEach((field) => {
          if (field.querySelector('#expand-id-filters')) field.classList.remove('hidden');
        });
      });
    }

    // Identifier expand/collapse
    const expandAddressBtn = document.getElementById('expand-address-filters');
    if (expandAddressBtn) {
      expandAddressBtn.addEventListener('click', function () {
        document.getElementById('additional-address-filters')?.classList.remove('hidden');
        expandAddressBtn.closest('fieldset').classList.add('hidden');
      });
    }
    const condenseAddressBtn = document.getElementById('condense-address-filters');
    if (condenseAddressBtn) {
      condenseAddressBtn.addEventListener('click', function () {
        document.getElementById('additional-address-filters')?.classList.add('hidden');
        // Show the main field again
        document.querySelectorAll('fieldset').forEach((field) => {
          if (field.querySelector('#expand-address-filters')) field.classList.remove('hidden');
        });
      });
    }
  }

  if (isDemoMode && isWorkItemsPage) {
    filtersPanel.classList.remove('hidden');
  } else if (isDemoMode && isClientSearchPage) {
    filtersPanel.classList.remove('hidden');
    loadFiltersPanelTemplate(
      'src/templates/csa/demo/forms/notebook-search.html',
      setupNotebookSearchFilters
    );
  } else {
    filtersPanel.classList.add('hidden');
  }
}
