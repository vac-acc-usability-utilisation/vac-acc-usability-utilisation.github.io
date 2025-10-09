import { initSearch } from "./search.js";
import { updateActiveRailItem, handleNavigationMenu, handleClientMenu, updateSubmenus } from "./nav.js";
import { setupToolsPanel } from './toolsPanel.js';
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

    fetch(path)
        .then(response => {
            if (!response.ok) throw new Error('Page not found');
            return response.text();
        })
        .then(html => {
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


            // Handle tab highlighting after HTML is loaded
            const pageTab = segments[4] || "overview"; // fallback to default tab
            updateActiveTab(pageTab);

            if (segments.includes('search')) {
                initSearch();
            }

            document.getElementById('progress-indicator').hidden = true; // Hide after load
            return;
        })
        .catch((err) => {
            //console.error(err);
            pageContainer.innerHTML = '<h1>404</h1><p>The page "' + segments.slice(0, 4).join('/') + '" could not be found.</p>';
            //const mode = getCurrentMode();
            //window.location.hash = 'csa/' + mode + '/404';
            updateActiveRailItem(404);
            document.getElementById('progress-indicator').hidden = true; // Hide after load
        });
}

// Update active tab based on `data-tab` attribute
function updateActiveTab(currentTab) {
    const tabLinks = document.querySelectorAll('nav.tabs a[data-tab]');
    const pageDivs = document.querySelectorAll('[data-page]');
    if (tabLinks.length === 0 || pageDivs.length === 0) return;

    tabLinks.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === currentTab);
    });
    pageDivs.forEach(div => {
        div.classList.toggle('active', div.getAttribute('data-page') === currentTab);
    });
}

/**
 * Loads an HTML template into the filtersPanel.
 * @param {string} templatePath - Path to the HTML template file.
 */
function loadFiltersPanelTemplate(templatePath, afterLoadCallback) {
    const filtersPanel = document.getElementById("filtersPanel");
    if (!filtersPanel) return;

    fetch(templatePath)
        .then(response => {
            if (!response.ok) throw new Error('Template not found');
            return response.text();
        })
        .then(html => {
            filtersPanel.innerHTML = html;
            if (typeof afterLoadCallback === "function") afterLoadCallback();
        })
        .catch(() => {
            filtersPanel.innerHTML = '<p>Could not load filters.</p>';
        });
}

function toggleFiltersPanel(segments) {
    const isDemoMode = segments[1] === "demo";
    const isWorkItemsPage = segments[2] === "work-items";
    const isClientSearchPage = segments[2] === "search";
    const filtersPanel = document.getElementById("filtersPanel");
    if (!filtersPanel) return;

    function setupExpandCollapse() {
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
                document.querySelectorAll('.field.border').forEach(field => {
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
                document.querySelectorAll('.field.border').forEach(field => {
                    if (field.querySelector('#expand-id-filters')) field.classList.remove('hidden');
                });
            });
        }
    }

    if (isDemoMode && isWorkItemsPage) {
        filtersPanel.classList.remove("hidden");
        loadFiltersPanelTemplate('src/templates/csa/demo/forms/work-item-search.html', setupExpandCollapse);
    }
    else if (isDemoMode && isClientSearchPage) {
        filtersPanel.classList.remove("hidden");
        loadFiltersPanelTemplate('src/templates/csa/demo/forms/notebook-search.html', setupExpandCollapse);
    }
    else {
        filtersPanel.classList.add("hidden");
    }
}
