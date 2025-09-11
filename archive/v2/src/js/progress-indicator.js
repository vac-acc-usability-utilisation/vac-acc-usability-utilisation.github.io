export function hidePageLoadingIndicator() {
    const progressBar = document.getElementById('page-loading-indicator');
    if (progressBar) progressBar.style.display = 'none';
}