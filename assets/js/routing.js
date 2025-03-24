import { showProgressBar, hideProgressBar, autoResize } from './utils.js';
import { applyTranslations } from './language.js';
import { highlightActiveNavItem } from './nav.js';
import { initializeNumberInputRestrictions } from './form-validation.js';
import { closeAllMenus } from './menus.js';
import { languageSetting, getUserLanguage } from './language.js';  // Import the language setting

// Initialize languageSetting by calling getUserLanguage
getUserLanguage();  // This will initialize languageSetting based on browser or localStorage


//Intial routing setup - gather links and add click listener, load 'home'
export function setupRouting() {
    const links = document.querySelectorAll('a[data-route]');
    links.forEach(link => link.addEventListener('click', handleLinkClick));
    window.addEventListener('hashchange', handleHashChange);

    const initialRoute = window.location.hash ? window.location.hash.slice(1) : '/home';
    loadContent(initialRoute);
}

// Handle clicks on navigation links
function handleLinkClick(event) {
    event.preventDefault();
    const route = event.target.closest('a').getAttribute('data-route');
    window.location.hash = `#${route}`;
    console.log('Navigate to: ' + route);
    highlightActiveNavItem();
}

// Handle hash changes for navigation
function handleHashChange() {
    const route = window.location.hash.slice(1);
    loadContent(route);
}

// Load content from external HTML
// Adjust loadContent to return a promise
export function loadContent(route) {
    return new Promise((resolve, reject) => {
        // Your existing content loading logic...

        // Example of loading content...
        console.log(`Loading content for route: ${route}`);

        const cleanRoute = route.startsWith('/') ? route.slice(1) : route;
        const url = `content/${cleanRoute}.html`;

        showProgressBar();

        fetch(url)
            .then(response => response.ok ? response.text() : Promise.reject('Page not found'))
            .then(html => {
                document.getElementById('content').innerHTML = html;
                document.title = cleanRoute.charAt(0).toUpperCase() + cleanRoute.slice(1);
                highlightActiveNavItem();
                applyTranslations();
                // Call the layout adjustment function for the home page
                if (cleanRoute === 'home' || cleanRoute === 'search-for-client' || cleanRoute === 'work-items' || cleanRoute === 'your-work' || cleanRoute === 'create-client' || cleanRoute === 'work-item') {
                    adjustHomePageLayout();
                } else {
                    resetLayout(); // Reset layout for other pages if needed
                }
                // Enable inputs and buttons after the page content is loaded
                onContentLoaded();
            })
            .catch(error => {
                document.getElementById('content').innerHTML = "<h1>404 - Page Not Found</h1>";
                console.error(error);
            })
            .finally(() => hideProgressBar());

    }
    );
}

// Function to enable buttons and inputs after content is loaded
function onContentLoaded() {

    console.log(languageSetting); // Should show 'fr' or 'en'

    // Select all buttons and inputs that should be disabled until everything is loaded
    const buttons = document.querySelectorAll('button:not(.disabled)');
    const inputs = document.querySelectorAll('input');

    console.log('Buttons to be enabled:', buttons);
    console.log('Inputs to be enabled:', inputs);

    // Enable buttons and inputs
    buttons.forEach(button => button.removeAttribute('disabled'));
    inputs.forEach(input => input.removeAttribute('disabled'));

    // initialize number input restrictions
    initializeNumberInputRestrictions();

    const textareas = document.querySelectorAll('textarea');
    console.log('Textareas found:', textareas); // Debugging
    textareas.forEach(textarea => {
        // Attach the event listener
        textarea.addEventListener('input', () => autoResize(textarea));
    });
}

// Function to adjust the layout for the home page
function adjustHomePageLayout() {
    // Find all elements with the class '.nav-drawer' and add 'hidden' class
    const navDrawers = document.querySelectorAll('.nav-drawer');
    const headerSearchBar = document.getElementById('header-search-bar');
    const mainWrapper = document.getElementById('main-wrapper');

    navDrawers.forEach(drawer => {
        drawer.classList.add('hide');
    });

    if (headerSearchBar) {
        headerSearchBar.classList.remove('show'); // Remove 'show' class to header search bar
        headerSearchBar.classList.add('hide'); // Add 'hide' class to header search bar
    }

    if (mainWrapper) {
        mainWrapper.classList.add('full-width');
    }

    console.log('Adjusted layout for the home page');
}

// Function to reset layout (if needed) for other pages
function resetLayout() {
    const headerSearchBar = document.getElementById('header-search-bar');
    const navDrawers = document.querySelectorAll('.nav-drawer');
    const mainWrapper = document.getElementById('main-wrapper');


    if (headerSearchBar) {
        headerSearchBar.classList.remove('hide'); // Remove 'show' class to header search bar
        headerSearchBar.classList.add('show'); // Add 'show' class to header search bar
    }

    // Find all elements with the class '.nav-drawer' and add 'hidden' class
    navDrawers.forEach(drawer => {
        drawer.classList.remove('hide');
    });

    if (mainWrapper) {
        mainWrapper.classList.remove('full-width');
    }

    console.log('Reset layout (default)');
}
