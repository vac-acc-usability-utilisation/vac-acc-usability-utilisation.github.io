const THEME_KEY = 'theme-preference';

export function setupThemeToggle(buttonSelector = '#theme-toggle') {
    const button = document.querySelector(buttonSelector);
    if (!button) return;

    // Initialize theme based on saved preference or system setting
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setTheme(useDark);

    button.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        updateButtonIcon(button, isDark);
        localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    });
}

function setTheme(dark) {
    document.body.classList.toggle('dark', dark);
    const button = document.querySelector('#theme-toggle');
    if (button) updateButtonIcon(button, dark);
}

function updateButtonIcon(button, dark) {
    const icon = button.querySelector('i');
    if (icon) {
        icon.textContent = dark ? 'light_mode' : 'dark_mode';
    }
}
