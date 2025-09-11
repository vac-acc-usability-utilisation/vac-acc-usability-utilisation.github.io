import { getCurrentMode } from './router.js';

let navListenerInitialized = false;

/**
 * Initializes navigation event listeners (only once).
 */
export function initNavigation() {
    if (navListenerInitialized) return;
    navListenerInitialized = true;
    document.body.addEventListener('click', handleBodyClick);
}

/**
 * Handles all navigation-related clicks via event delegation.
 */
function handleBodyClick(e) {
    if (handleNavRailClick(e)) return;
    if (handleExpansionClick(e)) return;
    if (handleTabClick(e)) return;
}

/**
 * Handles clicks on navigation rail items.
 */
function handleNavRailClick(e) {
    const target = e.target.closest('[data-ui]');
    if (!target) return false;
    if (target.tagName === 'A') e.preventDefault();
    const ui = target.getAttribute('data-ui');
    if (!ui) return true;
    const mode = getCurrentMode();
    window.location.hash = `csa/${mode}/${ui}`;
    return true;
}

/**
 * Handles clicks on expandable nav buttons.
 */
function handleExpansionClick(e) {
    const expBtn = e.target.closest('.has-expansion > .nav-button.expandable');
    if (!expBtn) return false;
    e.stopPropagation();
    const li = expBtn.closest('.has-expansion');
    const expanded = li.classList.toggle('expanded');
    expBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    const icon = expBtn.querySelector('.icon');
    if (icon) icon.textContent = expanded ? 'arrow_drop_up' : 'arrow_drop_down';
    return true;
}

/**
 * Handles tab navigation clicks.
 */
function handleTabClick(e) {
    const tabTarget = getTabTarget(e);
    if (!tabTarget) return false;

    e.preventDefault();
    const tabValue = tabTarget.getAttribute('data-tab');
    const hashSegments = getHashSegments();

    if (shouldUpdateHashForTab(hashSegments)) {
        updateHashForTab(hashSegments, tabValue);
    }

    updateActiveTab(tabTarget, tabValue);
    updateActiveTabPage(tabValue);

    return true;
}

// Helper: Get the clicked tab anchor element
function getTabTarget(e) {
    const tabTarget = e.target.closest('[data-tab]');
    if (!tabTarget || tabTarget.tagName !== 'A') return null;
    return tabTarget;
}

// Helper: Parse the current hash into segments
function getHashSegments() {
    const hash = window.location.hash.slice(1);
    return hash.split('/').filter(Boolean);
}

// Helper: Should we update the hash for this tab click?
function shouldUpdateHashForTab(hashSegments) {
    const product = hashSegments[0] || 'csa';
    const mode = hashSegments[1] || 'design';
    return product === 'csa' && mode === 'design';
}

// Helper: Update the hash to reflect the selected tab
function updateHashForTab(hashSegments, tabValue) {
    while (hashSegments.length < 4) hashSegments.push('');
    hashSegments[4] = tabValue;
    const newHash = hashSegments.slice(0, 5).join('/');
    window.location.hash = newHash;
}

// Helper: Update the active tab styling
function updateActiveTab(tabTarget, tabValue) {
    const allTabs = tabTarget.parentElement.querySelectorAll('[data-tab]');
    allTabs.forEach(tab => tab.classList.toggle('active', tab === tabTarget));
}

// Helper: Update the visible tab page
function updateActiveTabPage(tabValue) {
    const allPageDivs = document.querySelectorAll('[data-page]');
    allPageDivs.forEach(div => {
        div.classList.toggle('active', div.getAttribute('data-page') === tabValue);
    });
}

export function updateActiveRailItem(area) {
    console.log('Updating active rail item for area:', area);

    const rail = document.getElementById('navigationRail');
    if (!rail) return;

    const railItems = rail.querySelectorAll('a');

    railItems.forEach(item => {
        item.classList.remove('active');
        const itemArea = item.getAttribute('data-ui');
        if (itemArea) {
            item.classList.toggle('active', itemArea === area);
        }
    });

}

export function handleNavigationMenu(segments) {
    const navigationMenu = document.getElementById('navigation-menu');
    const scrim = document.getElementById('scrim');
    const btn = document.getElementById('navigation-menu-btn');
    if (!navigationMenu || !scrim || !btn) return;

    btn.onclick = null;
    scrim.onclick = null;

    btn.onclick = () => {
        navigationMenu.classList.toggle('hidden');
        scrim.classList.toggle('hidden');
    };

    scrim.onclick = () => {
        navigationMenu.classList.add('hidden');
        scrim.classList.add('hidden');
    };

}


// Handle client menu visibility
export function handleClientMenu(segments) {
    const navigationRail = document.getElementById('navigationRail');
    const clientMenu = document.getElementById('client-menu');
    // Only show client menu if mode is "demo" and area is "client"
    if (segments[1] === "demo" && segments[2] === "client") {
        if (navigationRail) navigationRail.classList.add('hidden');
        if (!clientMenu) {
            fetch('src/templates/client-menu.html')
                .then(response => response.text())
                .then(html => {
                    const newClientMenu = document.createElement('div');
                    newClientMenu.id = 'client-menu';
                    newClientMenu.innerHTML = html;
                    const mainContentWrapper = document.getElementById('mainContentWrapper');
                    if (mainContentWrapper && mainContentWrapper.parentNode) {
                        mainContentWrapper.parentNode.insertBefore(newClientMenu, mainContentWrapper);
                    }
                    // Call update after menu is inserted
                    updateClientMenuActive(segments);
                });
        } else {
            // If menu already exists, just update active state
            updateClientMenuActive(segments);
        }
    } else {
        if (navigationRail) navigationRail.classList.remove('hidden');
        if (clientMenu) clientMenu.remove();
    }
}

// Helper function to update active class in client menu
function updateClientMenuActive(segments) {
    const clientMenu = document.getElementById('client-menu');
    if (!clientMenu) return;
    // Build the current path for data-ui, e.g. "client/benefits"
    let path = segments.slice(2, 4).join('/');
    if (!segments[3]) path = 'client'; // fallback for overview

    // Remove active from all
    clientMenu.querySelectorAll('a[data-ui]').forEach(a => a.classList.remove('active'));
    // Add active to the matching link
    const activeLink = clientMenu.querySelector(`a[data-ui="${path}"]`);
    if (activeLink) {
        activeLink.classList.add('active');

        // If the active link is inside a collapsed section, expand it
        const expansionUl = activeLink.closest('ul');
        if (expansionUl && expansionUl.id) {
            const li = expansionUl.parentElement;
            if (li && li.classList.contains('has-expansion')) {
                li.classList.add('expanded');
                const btn = li.querySelector('.nav-button.expandable');
                if (btn) {
                    btn.setAttribute('aria-expanded', 'true');
                    const icon = btn.querySelector('.icon');
                    if (icon) icon.textContent = 'arrow_drop_up';
                }
            }
        }
    }

    // Collapse all other sections
    clientMenu.querySelectorAll('.has-expansion').forEach(li => {
        const expanded = li.contains(activeLink);
        li.classList.toggle('expanded', expanded);
        const btn = li.querySelector('.nav-button.expandable');
        if (btn) {
            btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            const icon = btn.querySelector('.icon');
            if (icon) icon.textContent = expanded ? 'arrow_drop_up' : 'arrow_drop_down';
        }
    });
}

// Combined submenu logic
export function updateSubmenus(area, subpage) {
    const submenuMap = {
        foundations: 'foundations-submenu',
        styles: 'styles-submenu',
        components: 'components-submenu',
        patterns: 'patterns-submenu'
    };
    const submenuTargets = Object.keys(submenuMap);

    // Hide all submenus
    Object.values(submenuMap).forEach(id => {
        const submenu = document.getElementById(id);
        if (submenu) submenu.classList.add('hidden');
    });

    // Show active submenu and highlight active item
    const activeSubmenuId = submenuMap[area];
    if (activeSubmenuId) {
        const submenu = document.getElementById(activeSubmenuId);
        if (submenu) {
            submenu.classList.remove('hidden');
            // Highlight active submenu item
            const submenuLinks = submenu.querySelectorAll('a[data-ui]');
            submenuLinks.forEach(link => {
                link.classList.remove('active');
            });
            if (!subpage) {
                // Highlight first link (overview) if no subpage
                if (submenuLinks.length > 0) {
                    submenuLinks[0].classList.add('active');
                }
            } else {
                submenuLinks.forEach(link => {
                    // For overview, match area only
                    if (subpage === area && link.getAttribute('data-ui') === area) {
                        link.classList.add('active');
                    } else if (link.getAttribute('data-ui') === area + '/' + subpage) {
                        link.classList.add('active');
                    }
                });
            }
        }
    }

    // Toggle submenu-open class on contentArea
    const contentArea = document.getElementById('contentArea');
    if (contentArea) {
        if (submenuTargets.includes(area)) {
            contentArea.classList.add('submenu-open');
        } else {
            contentArea.classList.remove('submenu-open');
        }
    }
}
