/**
 * Manages language/i18n functionality
 */
class Language {
  constructor(options = {}) {
    this.options = {
      toggleButtonId: 'lang-toggle',
      localesPath: 'src/locales/{{lng}}/{{ns}}.json',
      fallbackLng: 'en',
      debug: false,
      ...options
    };

    this.toggleHandler = null;
    this.initialized = false;
    this.i18nReady = false;
  }

  /**
   * Get saved language from storage
   */
  getSavedLanguage() {
    return localStorage.getItem('appLang');
  }

  /**
   * Detect browser language
   */
  detectBrowserLanguage() {
    const lang = navigator.languages ? navigator.languages[0] : navigator.language;
    return lang ? lang.slice(0, 2) : 'en';
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    return i18next.language || this.options.fallbackLng;
  }

  /**
   * Initialize i18next library
   */
  async initI18n() {
    if (this.i18nReady) return;

    const savedLang = this.getSavedLanguage();
    const browserLang = this.detectBrowserLanguage();
    const initialLang = savedLang || browserLang || this.options.fallbackLng;

    return new Promise((resolve, reject) => {
      i18next.use(i18nextHttpBackend).init(
        {
          lng: initialLang,
          fallbackLng: this.options.fallbackLng,
          debug: this.options.debug,
          backend: {
            loadPath: this.options.localesPath
          }
        },
        (err) => {
          if (err) {
            console.error('i18next init error:', err);
            reject(err);
            return;
          }
          this.i18nReady = true;
          this.updateTranslations();
          resolve();
        }
      );
    });
  }

  /**
   * Initialize language toggle button
   * @param {HTMLElement} root - Root element to search for toggle button
   */
  init(root = document.body) {
    if (this.initialized) return;

    const langBtn = root.querySelector(`#${this.options.toggleButtonId}`);
    if (!langBtn) {
      console.warn('Language toggle button not found');
      return;
    }

    // Create toggle handler
    this.toggleHandler = () => {
      this.toggleLanguage((newLang) => {
        langBtn.textContent = newLang === 'en' ? 'FR' : 'EN';
        this.updateTranslations();
      });
    };

    // Attach listener
    langBtn.addEventListener('click', this.toggleHandler);

    // Set initial button label
    langBtn.textContent = this.getCurrentLanguage() === 'en' ? 'FR' : 'EN';

    this.initialized = true;
  }

  /**
   * Update all translations in the DOM
   */
  updateTranslations() {
    if (!this.i18nReady) return;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      el.textContent = i18next.t(key);
    });
  }

  /**
   * Toggle between languages
   * @param {Function} callback - Callback after language change
   */
  toggleLanguage(callback) {
    const newLang = this.getCurrentLanguage() === 'en' ? 'fr' : 'en';
    i18next.changeLanguage(newLang, () => {
      localStorage.setItem('appLang', newLang);
      if (typeof callback === 'function') callback(newLang);
    });
    return newLang;
  }

  /**
   * Clean up language toggle
   */
  destroy() {
    if (!this.initialized) return;

    const langBtn = document.querySelector(`#${this.options.toggleButtonId}`);
    if (langBtn && this.toggleHandler) {
      langBtn.removeEventListener('click', this.toggleHandler);
    }

    this.toggleHandler = null;
    this.initialized = false;
  }
}

// Singleton instance
let languageInstance = null;

/**
 * Initialize i18n system (call once at app start)
 */
export async function initI18n() {
  if (!languageInstance) {
    languageInstance = new Language();
  }
  await languageInstance.initI18n();
  return languageInstance;
}

/**
 * Initialize language toggle button (backward compatible API)
 * @param {HTMLElement} root - Root element to search for toggle button
 */
export function initLanguageToggle(root = document.body) {
  if (!languageInstance) {
    languageInstance = new Language();
  }
  languageInstance.init(root);
}

/**
 * Update translations (backward compatible API)
 */
export function updateTranslations() {
  if (languageInstance) {
    languageInstance.updateTranslations();
  }
}

/**
 * Get current language (backward compatible API)
 */
export function getCurrentLanguage() {
  if (languageInstance) {
    return languageInstance.getCurrentLanguage();
  }
  return 'en';
}

/**
 * Get saved language (backward compatible API)
 */
export function getSavedLanguage() {
  if (languageInstance) {
    return languageInstance.getSavedLanguage();
  }
  return localStorage.getItem('appLang');
}

/**
 * Detect browser language (backward compatible API)
 */
export function detectBrowserLanguage() {
  if (languageInstance) {
    return languageInstance.detectBrowserLanguage();
  }
  const lang = navigator.languages ? navigator.languages[0] : navigator.language;
  return lang ? lang.slice(0, 2) : 'en';
}

/**
 * Toggle language (backward compatible API)
 */
export function toggleLanguage(callback) {
  if (languageInstance) {
    return languageInstance.toggleLanguage(callback);
  }
}

/**
 * Destroy language instance
 */
export function destroyLanguage() {
  if (languageInstance) {
    languageInstance.destroy();
    languageInstance = null;
  }
}
