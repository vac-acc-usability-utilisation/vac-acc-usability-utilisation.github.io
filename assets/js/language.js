import { showToast } from './utils.js';

// Declare languageSetting in the global scope
let languageSetting = getUserLanguage(); 

// Function to get the user's language
export function getUserLanguage() {
    const storedLanguageSetting = localStorage.getItem('languageSetting');
    const userBrowserLanguage = navigator.language ? navigator.language.slice(0, 2) : 'en';

    // Use the stored language if available, else fallback to the browser's language
    return storedLanguageSetting ? storedLanguageSetting : userBrowserLanguage;
}

// Apply the language settings right after the page loads (DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
    languageSetting = getUserLanguage(); // Reinitialize after page load
    //netlifyIdentity.setLocale(languageSetting);  // Ensure correct locale is set on load
    languageSettings();  // Initialize other language settings
});

// Function to load the logo based on the language
export function loadLogo(language) {
    const logoContainers = document.getElementsByClassName('logo-container');
    let logoSrc = (language === 'fr') ? 'assets/images/VAC-FIP-FR.svg' : 'assets/images/VAC-FIP-EN.svg';

    fetch(logoSrc)
        .then(response => response.ok ? response.text() : Promise.reject('Failed to load logo'))
        .then(svg => {
            Array.from(logoContainers).forEach(container => {
                container.innerHTML = svg;
                const path = container.querySelector('path');
                if (path) path.setAttribute('fill', 'var(--md-sys-color-on-surface-variant)');
            });
        })
        .catch(error => console.error('Error loading logo:', error));
}

// Function to set up language settings and toggle
export function languageSettings() {
    updateLanguageUI(languageSetting);
    document.querySelector('#lang-toggle').addEventListener('click', toggleLanguage);
    applyTranslations(languageSetting);
}

function toggleLanguage() {
    // Retrieve the current language from localStorage
    let languageSetting = localStorage.getItem('languageSetting') || 'en';

    // Toggle between 'en' and 'fr'
    languageSetting = (languageSetting === 'en') ? 'fr' : 'en';

    // Store the updated language setting in localStorage
    localStorage.setItem('languageSetting', languageSetting);

    // Log the current language for debugging
    console.log('Application language: ' + languageSetting);

    // Apply the new language settings
    updateLanguageUI(languageSetting);

    // Change the Netlify Identity locale
    //changeNetlifyLocale(languageSetting);

    // Display toast message (language-dependent)
    const toastMessage = $.i18n('language_snackbar_message');
    showToast(toastMessage, 2000);
}

// Update the UI based on the language setting
function updateLanguageUI(language) {
    loadLogo(language);

    // Load the translations for the selected language
    $.i18n({ locale: language }).load({
        'en': '../../content/en.json',
        'fr': '../../content/fr.json'
    }).done(() => {
        // Apply the translations to the body
        $('body').i18n();
    });

}

// Function to handle locale change for Netlify
/*
function changeNetlifyLocale(language) {
    // Reset Netlify Identity locale every time, to avoid stale locale state
    console.log("Updated Netlify locale to: " + language);

    // Optionally, force a close and reopen the modal
    if (netlifyIdentity.currentUser()) {
        netlifyIdentity.close();
        setTimeout(() => {
            netlifyIdentity.open();
        }, 100);  // short delay to let the locale change take effect
    }
}*/


// Function to apply translations to the loaded content
export function applyTranslations(languageSetting) {
    $.i18n({ locale: languageSetting }).load({
        'en': '../../content/en.json',
        'fr': '../../content/fr.json'
    }).done(() => $('body').i18n());
}

// Export the languageSetting for use in other files
export { languageSetting };