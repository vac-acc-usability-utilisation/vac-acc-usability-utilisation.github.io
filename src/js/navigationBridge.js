import { NavigationManager } from './Navigation.js';

// Singleton instance
let navigationInstance = null;

/**
 * Initializes navigation event listeners and route subscription.
 * @param {HTMLElement} [root=document.body] Root element for event delegation
 */
export function initNavigation(root = document.body) {
  if (!navigationInstance) {
    navigationInstance = new NavigationManager();
    navigationInstance.init(root);
  }
  return navigationInstance;
}

/**
 * Clean up navigation listeners
 */
export function destroyNavigation() {
  if (navigationInstance) {
    navigationInstance.destroy();
    navigationInstance = null;
  }
}

/**
 * Export navigation methods while maintaining backward compatibility
 */
export const updateActiveRailItem = (area) => {
  if (navigationInstance) {
    navigationInstance.updateActiveRailItem(area);
  }
};

export const handleNavigationMenu = () => {
  if (navigationInstance) {
    navigationInstance.setupNavigationMenu();
  }
};

export const handleClientMenu = () => {
  if (navigationInstance) {
    return navigationInstance.setupClientMenu();
  }
  return Promise.resolve();
};

export const updateSubmenus = () => {
  if (navigationInstance) {
    navigationInstance.updateSubmenus();
  }
};
