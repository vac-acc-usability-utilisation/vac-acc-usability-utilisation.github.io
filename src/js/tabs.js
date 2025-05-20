export function setupTabs(containerSelector = '.tabs') {
    const tabContainers = document.querySelectorAll(containerSelector);

    tabContainers.forEach((tabContainer) => {
        const tabs = tabContainer.querySelectorAll('a');
        const pages = tabContainer.parentElement.querySelectorAll('.page'); // Scope pages to the parent container

        // Function to activate a tab and its corresponding page
        const activateTab = (tabId) => {
            tabs.forEach((tab) => tab.classList.remove('active'));
            pages.forEach((page) => page.classList.remove('active'));

            const activeTab = tabContainer.querySelector(`[data-tab="${tabId}"]`);
            const activePage = tabContainer.parentElement.querySelector(`[data-page="${tabId}"]`);

            if (activeTab) activeTab.classList.add('active');
            if (activePage) {
                activePage.classList.add('active');

                // Initialize nested tabs within the active page
                const nestedTabs = activePage.querySelectorAll('.tabs');
                nestedTabs.forEach((nestedTabContainer) => {
                    setupTabsForContainer(nestedTabContainer);
                });
            }
        };

        // Add click event listeners to tabs
        tabs.forEach((tab) => {
            tab.addEventListener('click', (event) => {
                event.preventDefault();
                const tabId = tab.dataset.tab;

                // Activate the clicked tab and its corresponding page
                activateTab(tabId);
            });
        });

        // Activate the default or first tab
        const defaultTab = tabs[0]?.dataset.tab;
        if (defaultTab) activateTab(defaultTab);
    });
}

// Helper function to initialize tabs for a specific container
function setupTabsForContainer(tabContainer) {
    const tabs = tabContainer.querySelectorAll('a');
    const pages = tabContainer.parentElement.querySelectorAll('.page');

    const activateTab = (tabId) => {
        tabs.forEach((tab) => tab.classList.remove('active'));
        pages.forEach((page) => page.classList.remove('active'));

        const activeTab = tabContainer.querySelector(`[data-tab="${tabId}"]`);
        const activePage = tabContainer.parentElement.querySelector(`[data-page="${tabId}"]`);

        if (activeTab) activeTab.classList.add('active');
        if (activePage) activePage.classList.add('active');
    };

    tabs.forEach((tab) => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            const tabId = tab.dataset.tab;

            activateTab(tabId);
        });
    });

    const defaultTab = tabs[0]?.dataset.tab;
    if (defaultTab) activateTab(defaultTab);
}