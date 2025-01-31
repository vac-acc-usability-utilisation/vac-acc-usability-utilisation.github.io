import { getUserLanguage, loadLogo, languageSettings, applyTranslations } from './language.js';
import { setupRouting } from './routing.js';
import { handleNavRailHover, handleNavDrawerMobile, highlightActiveNavItem, initializeExpandableSections } from './nav.js';
import { initializeMenus } from './menus.js';
import { enableSkipToMain, hideProgressBar, checkBannerDisplay } from './utils.js';
import { initializeUISettings } from './theme.js';

document.addEventListener("DOMContentLoaded", function () {
    console.log('VAC   .\\^/.   ACC\nACC  \\=%¥%=/  VAC\nVAC   ^`|`^   ACC');
    console.log('Application started.');

    // Select all buttons and inputs that should be disabled until everything is loaded
    const buttons = document.querySelectorAll('button:not(.disabled)');

    // Get user's preferred language
    var languageSetting = getUserLanguage();

    // Initialize language settings and logo
    languageSettings();
    applyTranslations(languageSetting);
    loadLogo(languageSetting);
    initializeUISettings();

    // Initialize routing system
    setupRouting();

    // Enable skip to main functionality with the appropriate element IDs
    enableSkipToMain('skip-to-content', 'cont');

    // Initialize navigation
    highlightActiveNavItem();
    handleNavRailHover();
    handleNavDrawerMobile();

    // Initialize expandable sections
    initializeExpandableSections();

    // Check if any global banners/alerts need to be displayed
    checkBannerDisplay();

    // Initialize Menu functionality
    initializeMenus();    
 
});

export function updateHomePage(user) {
    const loginBtn = document.getElementById("login-btn");
    const loginBtnHeader = document.getElementById("login-btn-header");
    const searchBar = document.getElementById("home-page-search-bar");
    const navigationRail = document.getElementById("navigation-rail");
    const signOut = document.getElementById("sign-out");
    const root = document.documentElement; // Get the root element for CSS variables

    if (user) {
        // User is logged in, show search bar and hide login button
        if (loginBtn) loginBtn.style.display = "none";
        if (loginBtnHeader) loginBtnHeader.style.display = "none";
        if (searchBar) searchBar.style.display = "flex";
        if (navigationRail) navigationRail.style.display = "block";
        if (signOut) signOut.style.display = "block";     
         // Change CSS variable
         root.style.setProperty("--navigation-rail-width", "88px"); // Adjust width for logged-in users     
    } else {
        // User is logged out, show login button and hide search bar
        if (loginBtn) loginBtn.style.display = "flex";
        if (loginBtnHeader) loginBtnHeader.style.display = "flex";
        if (searchBar) searchBar.style.display = "none";
        if (navigationRail) navigationRail.style.display = "none";
        if (signOut) signOut.style.display = "none";  
         // Change CSS variable
         root.style.setProperty("--navigation-rail-width", "32px"); // Adjust width for logged-out users
    }
}