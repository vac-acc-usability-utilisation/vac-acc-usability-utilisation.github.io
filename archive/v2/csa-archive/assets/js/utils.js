export function enableSkipToMain(skipLinkId, mainContentId) {
    const skipLink = document.getElementById(skipLinkId);
    const mainContent = document.getElementById(mainContentId);

    if (skipLink && mainContent) {
        skipLink.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default hash navigation

            // Ensure the main content can receive focus and move focus to it
            mainContent.setAttribute('tabindex', '-1');
            mainContent.focus();
        });
    }
}

// Show the progress bar
export function showProgressBar() {
    const progressBar = document.getElementById('page-loading-indicator');
    if (progressBar) progressBar.style.display = 'block';
}

// Hide the progress bar
export function hideProgressBar() {
    const progressBar = document.getElementById('page-loading-indicator');
    if (progressBar) progressBar.style.display = 'none';
}

let hideTimeout = null; // Moved outside to track state

// Show toast with hover and close button functionality
export function showToast(message, autoHideDelay = 3000) {
    const snackbarContainer = document.querySelector('.snackbar-container');
    const snackbarContent = document.querySelector('.snackbar-content');
    const closeButton = document.querySelector('.snackbar-actions .icon-button');

    snackbarContent.textContent = message;

    // Function to hide the snackbar
    function hideSnackbar() {
        console.log("Hiding snackbar");
        snackbarContainer.style.transition = 'bottom 150ms ease-out';
        snackbarContainer.style.bottom = '-64px';
        snackbarContainer.classList.add('hidden'); // Ensure it's hidden
        clearTimeout(hideTimeout);
        hideTimeout = null; // Reset the timeout
    }

    // Clear any previous timeouts if the snackbar was shown before
    if (hideTimeout) {
        console.log("Clearing previous timeout");
        clearTimeout(hideTimeout);
        hideTimeout = null; // Reset the timeout
    }

    // Show the snackbar
    snackbarContainer.classList.remove('hidden');
    snackbarContainer.style.transition = 'bottom 150ms ease-in';
    snackbarContainer.style.bottom = '24px';

    // Set a timeout to auto-hide the snackbar
    hideTimeout = setTimeout(hideSnackbar, autoHideDelay);
    console.log("Hide timeout set for", autoHideDelay, "ms");

    // Prevent auto-hide when hovering over the snackbar
    snackbarContainer.addEventListener('mouseenter', () => {
        console.log("Snackbar hovered, clearing timeout");
        if (hideTimeout) {
            clearTimeout(hideTimeout); // Cancel auto-hide when hovered
            hideTimeout = null; // Ensure timeout is cleared
        }
    });

    // Resume auto-hide when the mouse leaves the snackbar
    snackbarContainer.addEventListener('mouseleave', () => {
        console.log("Mouse left snackbar, setting delay to hide");
        if (!hideTimeout) { // Only set timeout if it wasn't already set
            hideTimeout = setTimeout(hideSnackbar, 1000); // Delay closing when mouse leaves
            console.log("Hide timeout reset for 1000 ms");
        }
    });

    // Close snackbar on close button click
    closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Close button clicked");
        hideSnackbar();
    });
}

// Hide toast manually if needed
export function hideToast() {
    const snackbarContainer = document.querySelector('.snackbar-container');
    console.log("Hiding snackbar manually");
    snackbarContainer.style.transition = 'bottom 150ms ease-out';
    snackbarContainer.style.bottom = '-64px';
    snackbarContainer.classList.add('hidden'); // Ensure it's hidden
    if (hideTimeout) {
        clearTimeout(hideTimeout); // Clear any hide timeouts
        hideTimeout = null;
    }
}

export function checkBannerDisplay() {
    const isBannerDismissed = sessionStorage.getItem('globalBannerDismissed');
    if (!isBannerDismissed) {
        document.body.classList.add('banner-visible');
        document.getElementById('global-banner').classList.remove('hide');
    } else {
        document.body.classList.remove('banner-visible');
        document.getElementById('global-banner').classList.add('hide');
    }


    const dismissGlobalBannerButton = document.getElementById('dismiss-global-banner-button');

    if (dismissGlobalBannerButton) {
        dismissGlobalBannerButton.addEventListener('click', function (event) {
            event.preventDefault();
            dismissGlobalBanner();
        });
    }



}

export function dismissGlobalBanner() {
    document.body.classList.remove('banner-visible');
    document.getElementById('global-banner').classList.add('hide');

    sessionStorage.setItem('globalBannerDismissed', 'true');
}

export function autoResize(textarea) {
    console.log('Resizing textarea:', textarea);
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = textarea.scrollHeight + 'px'; // Set new height
}

// Adjust the main content width based on screen size and layout
/*
export function adjustMainWidth() {
    const mainWrapper = document.getElementById('main-wrapper');
    const mainPane = document.getElementById('main-pane');

    if (!mainWrapper || !mainPane) {
        console.error('Main elements not found.');
        return;
    }

    const hasScrollbar = window.innerWidth > document.documentElement.clientWidth;
    const scrollbarWidth = hasScrollbar ? `${window.innerWidth - document.documentElement.clientWidth}px` : '0px';

    mainWrapper.style.width = `calc(100vw - var(--navigation-rail-width) - var(--side-panel-width) - ${scrollbarWidth})`;
}*/
