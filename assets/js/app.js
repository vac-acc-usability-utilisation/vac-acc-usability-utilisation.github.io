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


