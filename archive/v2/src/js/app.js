import { registerServiceWorker } from './register-serviceworker.js';
import { setLanguage, getUserLanguage, applyTranslations, loadLogo, handleLanguageToggle } from './language.js';
import { setupThemeToggle } from './theme.js';
import { setupPageNavigation, handleNavRailHover, setupExpandableNav } from './navigation.js';
import { loadPageFromHash } from './router.js';
import { hidePageLoadingIndicator } from './progress-indicator.js';
import { loadIndex, search } from './search.js';
import { loadDynamicLayout } from './dynamic-layout.js';
import { setupTabs } from './tabs.js'; 

document.addEventListener("DOMContentLoaded", () => {
    console.log('VAC   .\\^/.   ACC\nACC  \\=%¥%=/  VAC\nVAC   ^`|`^   ACC');

    registerServiceWorker();

    //loadIndex().then(() => {  // Load the search index
    // Now it's safe     to search
    //console.log(search("modular")); // <-- Test search here
    //}); 

    // Load the header and navigation, then initialize the rest of the app
    loadDynamicLayout().then(() => {
        console.log('Header and Navigation Loaded');

        const userLang = getUserLanguage(); // Detect from browser/localStorage
        setLanguage(userLang);

        applyTranslations(userLang); // Apply translations to the global UI
        loadLogo(userLang); // Load the logo based on the language
        handleLanguageToggle(); // Initialize the language toggle after the header is loaded

        loadPageFromHash(); // Initial page load
        window.addEventListener('hashchange', loadPageFromHash);

        setupThemeToggle();
        setupExpandableNav();
        handleNavRailHover();

        setupTabs(); // Initialize the tabs

        hidePageLoadingIndicator();
    }).catch(err => {
        console.error('Error loading dynamic layout:', err);
    });

});
