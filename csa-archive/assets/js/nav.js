import { loadContent } from './routing.js';

// Function to handle displaying the navigation rail submenu
export function handleNavRailHover() {
    const navRailItems = document.querySelectorAll("#navigation-rail li.has-submenu");
    navRailItems.forEach(item => {
        item.addEventListener('mouseenter', showNavDrawer);
        item.addEventListener('focusin', showNavDrawer);

        item.addEventListener('mouseleave', hideNavDrawer);
        item.addEventListener('focusout', hideNavDrawer);
    });
}

// Show the navigation drawer on hover
function showNavDrawer() {
    const navDrawer = this.querySelector('ul.nav-drawer');
    if (navDrawer) navDrawer.classList.add('show');
}

// Hide the navigation drawer on mouse leave
function hideNavDrawer() {
    setTimeout(() => {
        const navDrawer = this.querySelector('ul.nav-drawer');
        if (navDrawer && !navDrawer.matches(':hover')) {
            navDrawer.classList.remove('show');
        }
    }, 200);
}

// Mobile drawer handling
export function handleNavDrawerMobile() {
    const navDrawer = document.getElementById('navigation-drawer-mobile');
    const navDrawerButtons = document.getElementsByClassName('navigation-drawer-mobile-button');
    const fabButtonExtended = document.getElementById('navigation-drawer-fab-extended');
    const fabButtonSmall = document.getElementById('navigation-drawer-fab-small');


    // Function to hide all top-level <li> elements except the clicked one
    function hideAllTopLevelItems(excludeItem) {
        const topLevelItems = navDrawer.querySelectorAll('nav > ul > li');
        const mainMenuItems = document.querySelectorAll('.main-menu-item');

        topLevelItems.forEach(item => {
            if (item !== excludeItem) {
                item.classList.add('hide');
                const submenu = item.querySelector('.navigation-drawer-mobile-submenu');
                if (submenu) {
                    submenu.classList.remove('show');
                    submenu.style.display = 'none';
                }
            } else {
                item.classList.remove('hide');
                const submenu = item.querySelector('.navigation-drawer-mobile-submenu');
                if (submenu) {
                    submenu.classList.add('show');
                    submenu.style.display = 'block';
                }
            }
        });

        // Hide the extended FAB button
        if (fabButtonExtended) {
            fabButtonExtended.classList.add('hide');
        }

        // Hide the small FAB button
        if (fabButtonSmall) {
            fabButtonSmall.classList.add('hide');
        }

        // Hide or show 'Help and Support' and its items
        mainMenuItems.forEach(item => {
            if (item !== excludeItem) {
                item.classList.add('hide');
                const submenu = item.querySelector('.navigation-drawer-mobile-submenu');
                if (submenu) {
                    submenu.classList.remove('show');
                    submenu.style.display = 'none';
                }
            } else {
                item.classList.remove('hide');
                const submenu = item.querySelector('.navigation-drawer-mobile-submenu');
                if (submenu) {
                    submenu.classList.add('show');
                    submenu.style.display = 'block';
                }
            }
        });
    }

    // Handle submenu interactions
    const menuItemsWithSubmenus = navDrawer.querySelectorAll('.has-submenu > a');
    menuItemsWithSubmenus.forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            // Get the submenu <ul> element
            const submenu = this.nextElementSibling;

            // Toggle the visibility of the submenu
            if (submenu) {
                submenu.classList.toggle('show');
                submenu.style.display = submenu.classList.contains('show') ? 'block' : 'none';
            }

            // Hide all top-level navigation items except the clicked one
            hideAllTopLevelItems(this.parentElement);

            // Ensure the clicked item's <a> is hidden
            this.classList.add('hide');
        });
    });

    // Handle main menu button interactions
    const mainMenuButtons = navDrawer.querySelectorAll('.navigation-drawer-main-menu');
    mainMenuButtons.forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            // Restore all top-level items
            restoreAllTopLevelItems();
        });
    });

    // Handle navigation items that lead to pages
    const pageNavigationItems = document.querySelectorAll('a[data-route]');
    pageNavigationItems.forEach(item => {
        item.addEventListener('click', function (event) {
            // Close the navigation drawer
            navDrawer.classList.remove('show');

            // Restore the navigation items
            restoreAllTopLevelItems();

            // Add your page navigation logic here
            const route = this.getAttribute('data-route');
            loadContent(route); // Call your loadContent function
        });
    });

    // Function to restore all top-level navigation items
    function restoreAllTopLevelItems() {
        const topLevelItems = navDrawer.querySelectorAll('nav > ul > li');
        const mainMenuItems = document.querySelectorAll('.main-menu-item');

        topLevelItems.forEach(item => {
            item.classList.remove('hide');
            const link = item.querySelector('a');
            if (link) {
                link.classList.remove('hide');
            }
            const submenu = item.querySelector('.navigation-drawer-mobile-submenu');
            if (submenu) {
                submenu.classList.remove('show');
                submenu.style.display = 'none';
            }
        });

        // Show the extended FAB button again
        if (fabButtonExtended) {
            fabButtonExtended.classList.remove('hide');
        }

        // Show the small FAB button again
        if (fabButtonSmall) {
            fabButtonSmall.classList.remove('hide');
        }

        mainMenuItems.forEach(item => {
            item.classList.remove('hide');
            const link = item.querySelector('a');
            if (link) {
                link.classList.remove('hide');
            }
            const submenu = item.querySelector('.navigation-drawer-mobile-submenu');
            if (submenu) {
                submenu.classList.remove('show');
                submenu.style.display = 'none';
            }
        });
    }

    // Handle clicks outside the navigation drawer to close it
    document.addEventListener('click', function (event) {
        if (!navDrawer.contains(event.target) && !Array.from(navDrawerButtons).includes(event.target)) {
            restoreAllTopLevelItems(); // Restore all top-level items
            navDrawer.classList.remove('show'); // Close the drawer
        }
    });

    // Toggle navigation drawer visibility when button is clicked
    Array.from(navDrawerButtons).forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent the click from closing the drawer immediately
            navDrawer.classList.toggle('show');
        });
    });
}

export function toggleExpandableSection(button, sectionId) {
    // Get the section to expand/collapse
    const section = document.getElementById(sectionId);

    if (!section) {
        console.error(`Section with ID '${sectionId}' not found.`);
        return;
    }

    // Toggle the visibility of the section
    const isExpanded = !section.classList.contains('hide');
    if (isExpanded) {
        section.classList.add('hide'); // Collapse the section
        button.querySelector('.material-symbols-outlined').textContent = 'arrow_drop_down'; // Update icon
    } else {
        section.classList.remove('hide'); // Expand the section
        button.querySelector('.material-symbols-outlined').textContent = 'arrow_drop_up'; // Update icon
    }
}

// Add this function to handle specific expandable sections
export function initializeExpandableSections() {
    const expandableButtons = document.querySelectorAll('.expandable-button');

    expandableButtons.forEach(button => {
        const sectionId = button.getAttribute('data-section-id');
        if (sectionId) {
            button.addEventListener('click', () => {
                toggleExpandableSection(button, sectionId);
            });
        }
    });
}

// Function to highlight the active navigation item
export function highlightActiveNavItem() {
    // Get the current route from the URL hash
    const currentRoute = window.location.hash.slice(1) || '/'; // Remove the '#' from the hash, default to '/' if empty

    // Select all navigation items
    var navItems = document.querySelectorAll('.nav-item');
    var submenuItems = document.querySelectorAll('.nav-drawer a');

    // Remove 'active' class from all nav items and submenu items
    removeActiveClass(navItems);
    removeActiveClass(submenuItems);

    // Highlight the active nav item based on the current route
    navItems.forEach(function (navItem) {
        var route = navItem.getAttribute('data-route'); // Get the data-route attribute

        // Check if the current route matches the route or if there's no current route, highlight home
        if (route === currentRoute || (currentRoute === '/' && route === '/home')) {
            navItem.classList.add('active'); // Add 'active' class to the matching nav item
        }
    });

    // Highlight the active submenu item
    submenuItems.forEach(function (submenuItem) {
        var route = submenuItem.getAttribute('data-route'); // Get the data-route attribute
        if (route === currentRoute) {
            submenuItem.classList.add('active'); // Add 'active' class to the matching submenu item
        }
    });
}

// Function to remove 'active' class from items
function removeActiveClass(items) {
    items.forEach(item => item.classList.remove('active'));
}

