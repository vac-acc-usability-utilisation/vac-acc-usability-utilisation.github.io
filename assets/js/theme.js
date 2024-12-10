// Theme management (light/dark)
export function applyTheme(theme) {
    
     // Get the body element
     const body = document.body;

     // Add or remove the 'dark' class based on the theme
     if (theme === 'dark') {
         body.classList.add('dark');
     } else {
         body.classList.remove('dark');
     }

    localStorage.setItem('theme', theme);
}

// Motion settings (e.g., reduce motion)
export function applyMotionSetting(reduceMotion) {
    if (reduceMotion) {
        document.documentElement.classList.add('reduce-motion');
    } else {
        document.documentElement.classList.remove('reduce-motion');
    }
    localStorage.setItem('motion', reduceMotion ? 'reduce' : 'default');
}

// Density settings (e.g., compact/comfortable)
export function applyDensity(densityLevel) {
    document.documentElement.setAttribute('data-density', densityLevel);
    localStorage.setItem('density', densityLevel);
}

// Initialization function to apply settings from localStorage
export function initializeUISettings() {
    // Retrieve saved settings from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedMotion = localStorage.getItem('motion') || 'default';
    const savedDensity = localStorage.getItem('density') || 'comfortable';

    // Check for system preferences if no user setting is found
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    console.log('Prefers dark mode? ' + prefersDarkMode);
    console.log('Prefers reduced motion? ' + prefersReducedMotion);

    // Apply theme based on user setting or system preference
    //const themeToApply = savedTheme || (prefersDarkMode ? 'dark' : 'light');
    const themeToApply = 'light';
    applyTheme(themeToApply);

    // Apply motion setting based on user setting or system preference
    const motionToApply = savedMotion === 'reduce' || (savedMotion === 'default' && prefersReducedMotion);
    applyMotionSetting(motionToApply);

    // Apply density settings
    applyDensity(savedDensity);
}
