import { loadPage } from './loadPage.js';

export function handleRouting() {
    const hash = getCurrentHash(); 
    const hashSegments = parseHash(hash);

    const route = {
        product: hashSegments[0] || "csa",
        mode: hashSegments[1] || "design",
        appArea: hashSegments[2] || "home",
        areaPage: hashSegments[3] || null,
        pageTab: hashSegments[4] || null,
        hasTabs: !!hashSegments[4] // Check if there are any tabs
    };

    const fullPathSegments = [route.product, route.mode, route.appArea];
    if (route.areaPage) fullPathSegments.push(route.areaPage);
    if (route.pageTab) fullPathSegments.push(route.pageTab);

    const pageSegments = getSegmentsFromRoute(route);
    loadPage(pageSegments);
}

// Helper to get the current product from the hash
export function getCurrentProduct() {
    const hash = getCurrentHash();
    const hashSegments = parseHash(hash);
    return hashSegments[0] || 'csa';
}

// Helper to get the current mode from the hash
export function getCurrentMode() {
    const hash = getCurrentHash();
    const hashSegments = parseHash(hash);
    return hashSegments[1] || 'design';
}

// Remove '#' and split into segments
function getCurrentHash() {
    return window.location.hash.slice(1);
}

function parseHash(hash) {
    return hash.split("/").filter(Boolean);
}

function getSegmentsFromRoute(route) {
    const segments = [route.product, route.mode, route.appArea];

    if (route.areaPage) segments.push(route.areaPage);
    if (route.pageTab) segments.push(route.pageTab);

    return segments;
}