// Get the user's language preference from localStorage, or use the browser language if not set
const userBrowserLanguage = navigator.language ? navigator.language.slice(0, 2) : 'en';
const storedLanguageSetting = localStorage.getItem('languageSetting');
let languageSetting = storedLanguageSetting ? storedLanguageSetting : userBrowserLanguage;

const progressBar = document.getElementById('page-loading-indicator');

const contentDiv = document.getElementById('content');
const links = document.querySelectorAll('a[data-route]');

// Wait for the entire DOM to be loaded before executing the following code
document.addEventListener("DOMContentLoaded", function () {

    console.log('VAC   .\\^/.   ACC\nACC  \\=%¥%=/  VAC\nVAC   ^`|`^   ACC');


    languageSettings();
    loadLogo(languageSetting);

    handleNavRailHover();
    handleNavDrawerMobile();

    // Initialize the routing system
    setupRouting();

    // Adjust the main content width whenever the window is resized
    window.addEventListener('resize', adjustMainWidth);

    // Adjust the main content width when the window finishes loading
    window.addEventListener('load', adjustMainWidth);

    hideProgressBar();

});

function loadLogo(language) {
    const logoContainers = document.getElementsByClassName('logo-container'); // Updated class name
    let logoSrc = '';

    // Determine which logo to load based on the language
    if (language === 'fr') {
        logoSrc = 'assets/images/VAC-FIP-FR.svg'; // French logo
    } else {
        logoSrc = 'assets/images/VAC-FIP-EN.svg'; // English logo
    }

    // Fetch the SVG and set it as inner HTML
    fetch(logoSrc)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(svg => {
            Array.from(logoContainers).forEach(logoContainer => { // Iterate over each logo container
                logoContainer.innerHTML = svg; // Set the SVG for the current container

                // Set the fill color dynamically if needed
                const path = logoContainer.querySelector('path');
                if (path) {
                    path.setAttribute('fill', 'var(--md-sys-color-on-surface-variant)');
                }
            });
        })
        .catch(error => console.error('Error loading logo:', error));
}
// Function to show the progress bar
function showProgressBar() {
    progressBar.style.display = 'block'; // Show the progress bar
}

// Function to hide the progress bar
function hideProgressBar() {
    progressBar.style.display = 'none'; // Hide the progress bar
}


// Function to update the menu with the current selection
function languageSettings() {

    // Update the UI based on the current language setting
    updateLanguageUI(languageSetting);

    // Add a click event listener to toggle the language
    document.querySelector('#lang-toggle').addEventListener('click', function () {
        languageSetting = (languageSetting === 'en') ? 'fr' : 'en'; // Toggle between 'en' and 'fr'
        localStorage.setItem('languageSetting', languageSetting); // Save the new language setting
        updateLanguageUI(languageSetting); // Update the UI
    });

    $.i18n({
        locale: languageSetting
    }).load({
        'en': '../../content/en.json',
        'fr': '../../content/fr.json',
    }).done(function () {
        $('body').i18n();
    });
}

// Function to update the button title and span text based on the language
function updateLanguageUI(languageSetting) {

    loadLogo(languageSetting);

    $.i18n({
        locale: languageSetting
    }).load({
        'en': '../../content/en.json',
        'fr': '../../content/fr.json',
    }).done(function () {
        $('body').i18n();
    });
}

/*
 * Function to handle routing based on hash and load the appropriate content
*/

function setupRouting() {

    // Handle link clicks
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default anchor tag behavior

            const route = event.target.closest('a').getAttribute('data-route'); // Get the route
            if (route) {
                window.location.hash = `#${route}`; // Set the hash in the URL
                loadContent(route); // Load the content based on the route
            }
        });
    });

    // Handle the hash change event for back/forward navigation
    window.addEventListener('hashchange', () => {
        const route = window.location.hash.slice(1); // Remove the leading '#' from the hash
        if (route) {
            loadContent(route); // Load the content based on the current hash
        }
    });

    // Initial load (on page refresh or direct link access)
    const initialRoute = window.location.hash ? window.location.hash.slice(1) : '/home'; // Default to '/home'
    loadContent(initialRoute);
    highlightActiveNavItem(); // Highlight the initial active nav item
}

// Function to fetch and load external HTML content from the 'content' folder
function loadContent(route) {
    // Ensure the route is correctly formatted, removing leading slashes
    const cleanRoute = route.startsWith('/') ? route.slice(1) : route;
    const url = `content/${cleanRoute}.html`; // Corrected URL path

    showProgressBar(); // Show the progress bar when loading starts

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error(`Page not found: ${url}`);
            }
        })
        .then(html => {
            contentDiv.innerHTML = html;
            document.title = cleanRoute.charAt(0).toUpperCase() + cleanRoute.slice(1); // Update page title
            highlightActiveNavItem(); // Call to highlight the active nav item

            // Apply i18n translations after content is loaded
            applyTranslations();
        })
        .catch(error => {
            contentDiv.innerHTML = "<h1>404 - Page Not Found</h1>";
            document.title = "404 - Page Not Found";
            highlightActiveNavItem(); // Call to highlight the active nav item

            // Apply translations for the 404 page
            applyTranslations();

            console.error(error); // Debugging the exact error in the console
        })
        .finally(() => {
            hideProgressBar(); // Hide the progress bar when loading is complete
        });
}


// Function to handle i18n translations
function applyTranslations() {
    
    $.i18n({
        locale: languageSetting
    }).load({
        'en': '../../content/en.json',
        'fr': '../../content/fr.json',
    }).done(function () {
        $('body').i18n(); // Apply translations to the body or specific container
    });
}


function highlightActiveNavItem() {
    // Get the current route from the URL hash
    const currentRoute = window.location.hash.slice(1); // Remove the '#' from the hash

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
        if (route === currentRoute || (currentRoute === '' && route === '/home')) {
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

function removeActiveClass(items) {
    items.forEach(item => item.classList.remove('active'));
}


function handleNavSubmenuToggle() {
    document.querySelectorAll('.drawer-has-submenu').forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            // Toggle the 'open' class on the corresponding submenu
            const submenu = item.nextElementSibling;
            if (submenu && submenu.classList.contains('submenu')) {
                submenu.classList.toggle('open');
            }

            // Update the text within the <span> based on the submenu state
            const icon = item.querySelector('span.material-symbols-outlined');
            if (icon) {
                if (submenu.classList.contains('open')) {
                    icon.textContent = 'expand_less';  // Change to 'expand_less' when open
                } else {
                    icon.textContent = 'expand_more';  // Change to 'expand_more' when closed
                }
            }
        });
    });

}

function handleNavRailHover() {
    const navRailItems = document.querySelectorAll("#navigation-rail li.has-submenu");

    navRailItems.forEach(item => {
        let currentNavRail = null;
        item.addEventListener('mouseenter', function () {
            const navDrawer = this.querySelector('ul.nav-drawer');
            if (navDrawer) {
                navDrawer.classList.add('show');
            }
            currentNavRail = this;
        });

        item.addEventListener('mouseleave', function () {
            // Delay closing to handle potential quick re-entry
            setTimeout(() => {
                const navDrawer = this.querySelector('ul.nav-drawer');
                if (navDrawer && !navDrawer.matches(':hover')) {
                    navDrawer.classList.remove('show');
                }
            }, 200); // Adjust delay as needed
        });
    });
}


function handleNavDrawerMobile() {
    const navDrawer = document.getElementById('navigation-drawer-mobile');
    const navDrawerButtons = document.getElementsByClassName('navigation-drawer-mobile-button');

    // Function to hide all top-level <li> elements except the clicked one
    function hideAllTopLevelItems(excludeItem) {
        const topLevelItems = navDrawer.querySelectorAll('nav > ul > li');
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
    }

    // Handle submenu interactions
    const menuItemsWithSubmenus = navDrawer.querySelectorAll('.has-submenu > a');
    menuItemsWithSubmenus.forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            console.log('Item with submenu clicked');

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
    //const pageNavigationItems = navDrawer.querySelectorAll('.navigation-drawer-main-menu a');
    pageNavigationItems.forEach(item => {
        item.addEventListener('click', function (event) {
            // Close the navigation drawer
            navDrawer.classList.remove('show');

            // Optionally, you can also restore the navigation items
            restoreAllTopLevelItems();

            // Add your page navigation logic here
            const route = this.getAttribute('data-route');
            loadContent(route); // Call your loadContent function
        });
    });

    // Function to restore all top-level navigation items
    function restoreAllTopLevelItems() {
        const topLevelItems = navDrawer.querySelectorAll('nav > ul > li');
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
    }

    // Handle clicks outside the navigation drawer to close it
    document.addEventListener('click', function (event) {
        // Check if the click was outside the navDrawer and if the drawer is currently visible
        if (!navDrawer.contains(event.target) && !Array.from(navDrawerButtons).includes(event.target)) {
            restoreAllTopLevelItems(); // Restore all top-level items
            navDrawer.classList.remove('show'); // Close the drawer
        }
    });

    // Toggle navigation drawer visibility when button is clicked
    for (let i = 0; i < navDrawerButtons.length; i++) {
        navDrawerButtons[i].addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent the click from closing the drawer immediately
            navDrawer.classList.toggle('show');
        });
    }
}

// Function to adjust the width of the main content area
function adjustMainWidth() {
    // Get the main wrapper element
    const mainWrapper = document.getElementById('main-wrapper');

    // Check if the main wrapper element exists
    if (!mainWrapper) {
        console.error('main-wrapper element not found');
        return;
    }

    const mainPane = document.getElementById('main-pane');

    // Check if the main wrapper element exists
    if (!mainPane) {
        console.error('main-pane element not found');
        return;
    }

    // Match media queries for responsive layout adjustments
    const extraSmall = window.matchMedia("(max-width: 599px)");
    const small = window.matchMedia("(min-width: 600px) and (max-width: 904px)");
    const medium = window.matchMedia("(min-width: 905px) and (max-width: 1239px)");
    const mediumLarge = window.matchMedia("(min-width: 1240px) and (max-width: 1439px)");
    const large = window.matchMedia("(min-width: 1440px) and (max-width: 1647px)");
    const extraLarge = window.matchMedia("(min-width: 1648px)");
    

    // Check if there is a vertical scrollbar
    const hasVerticalScrollbar = window.innerWidth > document.documentElement.clientWidth;

    // Calculate the scrollbar width if there is a vertical scrollbar
    const scrollbarWidth = hasVerticalScrollbar ? `${window.innerWidth - document.documentElement.clientWidth}px` : '0px';

    // Check if body has the class 'has-submenu'
    const bodyHasSubmenu = document.body.classList.contains('has-submenu');

    //console.log('Has submenu ', bodyHasSubmenu)

    if (bodyHasSubmenu) {
        // Set the width of the main wrapper to account for the navigation rail, side panel, navigation-drawer-width, and scrollbar width
        mainWrapper.style.width = `calc(100vw - var(--navigation-rail-width) - var(--side-panel-width) - var(--navigation-drawer-width) - ${scrollbarWidth})`;
        mainWrapper.style.left = `calc(var(--navigation-rail-width) + var(--navigation-drawer-width))`;
    }
    else {
        // Set the width of the main wrapper to account for the navigation rail, side panel, and scrollbar width
        mainWrapper.style.width = `calc(100vw - var(--navigation-rail-width) - var(--side-panel-width) - ${scrollbarWidth})`;
    }

}