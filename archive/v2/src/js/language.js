// Declare languageSetting in the global scope
let currentLanguage = getUserLanguage();
//const translationsCache = {};


// Function to get the user's language
export function getUserLanguage() {
    const storedLanguageSetting = localStorage.getItem('languageSetting');
    const userBrowserLanguage = navigator.language ? navigator.language.slice(0, 2) : 'en';

    // Use the stored language if available, else fallback to the browser's language
    return storedLanguageSetting ? storedLanguageSetting : userBrowserLanguage;
}

export function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('lang', lang);
}

export function getCurrentLanguage() {
    return currentLanguage;
}

export function toggleLanguage() {
    const newLang = currentLanguage === 'en' ? 'fr' : 'en';
    setLanguage(newLang);
    return newLang;
}

export function handleLanguageToggle() {
    const langBtn = document.getElementById('lang-toggle');

    langBtn.addEventListener('click', async () => {
        const newLang = toggleLanguage();
        //langBtn.textContent = newLang.toUpperCase();
        loadLogo(newLang);
        await applyTranslations(newLang);
    });
}

// Function to load the logo based on the language
export function loadLogo(language) {
    const logoContainers = document.getElementsByClassName('brand');
    let logoSrc = (language === 'fr') ? 'src/img/VAC-FIP-FR.svg' : 'src/img/VAC-FIP-EN.svg';

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

export function applyTranslations(languageSetting) {
    $.i18n({ locale: languageSetting }).load({
        'en': './src/content/ui/en.json',
        'fr': './src/content/ui/fr.json'
    }).done(() => $('body').i18n());
}