import { showToast, hideToast } from './utils.js';

// Declare languageSetting in the global scope
let languageSetting;

// Function to get user's language
export function getUserLanguage() {
    // Get the user's language preference from localStorage, or use the browser language if not set
    const userBrowserLanguage = navigator.language ? navigator.language.slice(0, 2) : 'en';
    console.log("User's browser language: " + userBrowserLanguage);

    // Check if the user has switched their language 
    const storedLanguageSetting = localStorage.getItem('languageSetting');

    // Check if the user has switched their language 
    let languageSetting = storedLanguageSetting ? storedLanguageSetting : userBrowserLanguage;
    console.log("Application language: " + languageSetting);

    return languageSetting;
}

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
    // Always retrieve the current language from localStorage
    let languageSetting = localStorage.getItem('languageSetting') || 'en';

    // Toggle between 'en' and 'fr'
    languageSetting = (languageSetting === 'en') ? 'fr' : 'en';

    // Store the updated language setting
    localStorage.setItem('languageSetting', languageSetting);

    // Log the current language for debugging purposes
    console.log('Application language: ' + languageSetting);

    // Update the UI with the new language setting
    updateLanguageUI(languageSetting);

    // Display a toast message from the i18n content
    const toastMessage = $.i18n('language_snackbar_message'); // Fetching the translated message
    showToast(toastMessage, 2000);  // Automatically hide after 2000ms  
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

// Function to apply translations to the loaded content
export function applyTranslations(languageSetting) {
    $.i18n({ locale: languageSetting }).load({
        'en': '../../content/en.json',
        'fr': '../../content/fr.json'
    }).done(() => $('body').i18n());
}
