export function getSavedLanguage() {
    return localStorage.getItem('appLang');
}

export function detectBrowserLanguage() {
    const lang = navigator.languages ? navigator.languages[0] : navigator.language;
    return lang ? lang.slice(0, 2) : 'en'; // e.g., 'en-US' -> 'en'
}

export function initI18n() {
    // Use saved language, or browser language, or fallback to 'en'
    const savedLang = getSavedLanguage();
    const browserLang = detectBrowserLanguage();
    const initialLang = savedLang || browserLang || 'en';

    const langBtn = document.getElementById('lang-toggle');

    //langBtn.textContent = getCurrentLanguage() === 'en' ? 'FR' : 'EN';

    // Initialize i18next with the default language
    i18next
        .use(i18nextHttpBackend)
        .init({
            lng: initialLang,
            fallbackLng: 'en',
            debug: true,
            backend: {
                // Load path must match your public folder
                loadPath: 'src/locales/{{lng}}/{{ns}}.json'
            }
        }, function (err, t) {
            if (err) return console.error('i18next init error:', err);
            
            // Set initial button label
            if (langBtn) {
                langBtn.textContent = getCurrentLanguage() === 'en' ? 'FR' : 'EN';
            }
            updateContent(); // Set initial translations
        });
    
    // Apply translations to elements with [data-i18n]
    function updateContent() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = i18next.t(key);
        });
    }
}

export function updateTranslations() {
    // For all elements with a data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = i18next.t(key);
    });
}

export function getCurrentLanguage() {
    return i18next.language || 'en';
}

export function initLanguageToggle() {
    const langBtn = document.getElementById('lang-toggle');
    if (!langBtn) return;

    langBtn.addEventListener('click', () => {
        toggleLanguage((newLang) => {
            langBtn.textContent = newLang === 'en' ? 'FR' : 'EN';
            updateTranslations();
        });
    });
}

export function toggleLanguage(callback) {
    const newLang = getCurrentLanguage() === 'en' ? 'fr' : 'en';
    i18next.changeLanguage(newLang, () => {
        localStorage.setItem('appLang', newLang); // Save language choice
        if (typeof callback === 'function') callback(newLang);
    });
    return newLang;
}