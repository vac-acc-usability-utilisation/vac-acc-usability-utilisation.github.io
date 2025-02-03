import { showProgressBar, hideProgressBar, autoResize } from './utils.js';
import { applyTranslations } from './language.js';
import { highlightActiveNavItem } from './nav.js';
import { initializeNumberInputRestrictions } from './form-validation.js';
import { closeAllMenus } from './menus.js';
import { languageSetting, getUserLanguage } from './language.js';  // Import the language setting
import { showToast } from './utils.js';


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
                if (cleanRoute === 'home' || cleanRoute === 'search-for-client' || cleanRoute === 'work-items' || cleanRoute === 'your-work' || cleanRoute === 'create-client') {
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
            .finally(hideProgressBar);
        resolve();
    }
    );
}

// Function to enable buttons and inputs after content is loaded
function onContentLoaded() {

    console.log(languageSetting); // Should show 'fr' or 'en'

    // Check if Netlify Identity is available and handle login/logout
    if (window.netlifyIdentity) {
        console.log("Netlify Identity is available.");

        // Initialize the page by checking if a user is already logged in
        netlifyIdentity.on("init", (user) => {
            console.log("Netlify Identity Initialized");
            updateHomePage(user); // Update UI based on user state
        });

        // Explicitly check the current user if the page is refreshed
        const currentUser = netlifyIdentity.currentUser();
        if (currentUser) {
            console.log("User is already logged in on refresh.");
            updateHomePage(currentUser); // Ensure UI is updated with current user
        } else {
            console.log("No user currently logged in.");
            updateHomePage(null); // Update UI for logged-out state
        }

        // Attach event listeners for login/logout
        const loginBtn = document.getElementById("login-btn");
        const loginBtnHeader = document.getElementById("login-btn-header");
        const logoutBtn = document.getElementById("sign-out");

        // Handle login with updated language setting
        const handleLogin = () => {
            // Ensure the languageSetting is the most up-to-date value
            let currentLanguageSetting = localStorage.getItem('languageSetting') || 'en';
            console.log("Handle login, language setting = " + currentLanguageSetting); // Debugging

            // Set the locale for Netlify Identity based on the current languageSetting
            netlifyIdentity.setLocale(currentLanguageSetting);
            console.log("Netlify Identity locale set to: " + currentLanguageSetting); // Debugging

            // Open the Netlify Identity modal
            netlifyIdentity.open();
        };

        loginBtn?.addEventListener("click", handleLogin);
        loginBtnHeader?.addEventListener("click", handleLogin);

        logoutBtn?.addEventListener("click", (e) => {
            console.log("Logout button clicked");
            e.preventDefault();
            netlifyIdentity.logout(); // Log out user
            closeAllMenus(); // Close menus after logout
        });

        // Listen for login/logout events
        netlifyIdentity.on("login", (user) => {
            console.log("User logged in:", user);
            updateHomePage(user);

            // Grab the user's name
            const userName = user.user_metadata.full_name || "User";  // Use "User" as a fallback if no name is set

            // Explicitly close the modal (optional, since it closes automatically)
            netlifyIdentity.close();
            window.location.hash = "#/home"; // Redirect to home

            // Display toast message (language-dependent)
            const toastMessage = $.i18n('signed_in_snackbar_message').replace("{name}", userName);
            showToast(toastMessage, 2000);
        });

        netlifyIdentity.on("logout", () => {
            console.log("User logged out.");
            updateHomePage(null);
            window.location.hash = "#/home"; // Redirect to home
            const toastMessage = $.i18n('signed_out_snackbar_message');
            showToast(toastMessage, 2000);
        });
    } else {
        console.warn("Netlify Identity not available yet.");
    }

    function updateHomePage(user) {
        console.log("Updating home page. User:", user);

        const loginBtn = document.getElementById("login-btn");
        const loginBtnHeader = document.getElementById("login-btn-header");
        const searchBar = document.getElementById("home-page-search-bar");
        const navigationRail = document.getElementById("navigation-rail");
        const signOut = document.getElementById("sign-out");
        const accountBtn = document.getElementById("account-button");
        const helpAndSupportMenu = document.getElementById("help-and-support-menu-items");
        const authenticatedMenuItems = document.getElementsByClassName("authenticatedMenuItem");
        const root = document.documentElement; // Get the root element for CSS variables

        if (user) {
            console.log("User is logged in.");  // Debugging log
            // User is logged in, show search bar and hide login button
            if (loginBtn) loginBtn.style.display = "none";
            if (loginBtnHeader) loginBtnHeader.style.display = "none";
            if (searchBar) searchBar.style.display = "flex";
            if (navigationRail) navigationRail.style.display = "block";
            if (signOut) signOut.style.display = "block";
            if (accountBtn) accountBtn.style.display = "flex";
            if (helpAndSupportMenu) helpAndSupportMenu.style.display = "block";
            // Loop through each item in authenticatedMenuItems and set display to block
            for (let i = 0; i < authenticatedMenuItems.length; i++) {
                authenticatedMenuItems[i].style.display = "block";
            }
            // Change CSS variable
            root.style.setProperty("--navigation-rail-width", "88px"); // Adjust width for logged-in users     
        } else {
            console.log("User is logged out.");  // Debugging log
            // User is logged out, show login button and hide search bar
            if (loginBtn) loginBtn.style.display = "flex";
            if (loginBtnHeader) loginBtnHeader.style.display = "flex";
            if (searchBar) searchBar.style.display = "none";
            if (navigationRail) navigationRail.style.display = "none";
            if (signOut) signOut.style.display = "none";
            if (accountBtn) accountBtn.style.display = "none";
            if (helpAndSupportMenu) helpAndSupportMenu.style.display = "none";
            // Loop through each item in authenticatedMenuItems and set display to none
            for (let i = 0; i < authenticatedMenuItems.length; i++) {
                authenticatedMenuItems[i].style.display = "none";
            }
            // Change CSS variable
            root.style.setProperty("--navigation-rail-width", "32px"); // Adjust width for logged-out users
        }
    }

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
