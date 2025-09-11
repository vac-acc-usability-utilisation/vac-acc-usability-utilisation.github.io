import { updateActiveLink, setupPageNavigation } from './navigation.js';
import { updateLayoutForPage } from './dynamic-layout.js';
import { applyTranslations, getCurrentLanguage } from './language.js';
import { setupTabs } from './tabs.js';
import { setupStageNavigation } from './stageNavigation.js';
import { setupTableInteractions } from './tableInteractions.js';

export function navigateTo(pageId) {
  console.log('Navigating to Page:', pageId); // Debug: Log the page being navigated to

  const main = document.querySelector('main');
  const appContainer = document.querySelector('#app'); // App container
  const navContainer = document.querySelector('#main-nav'); // Navigation container

  // Determine the base path based on the current URL
  const isDemo = window.location.pathname.includes('demo.html');
  const basePath = isDemo ? 'pages/demo/' : 'pages/design-system/';

  // Construct the file path
  const filePath = `${basePath}${pageId}.html`;

  fetch(filePath)
    .then(response => {
      if (!response.ok) throw new Error('Page not found');
      return response.text();
    })
    .then(html => {
      main.innerHTML = html;

      const currentLang = getCurrentLanguage(); 
      applyTranslations(currentLang);
      setupPageNavigation(); // Re-setup navigation for the new page

      setupTabs(); // Re-setup tabs for the new page
      setupStageNavigation();
      setupTableInteractions();

      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);

      window.location.hash = `#${pageId}`;
      updateActiveLink(pageId);
      updateLayoutForPage(pageId);
    })
    .catch(() => {
      load404Page(pageId);
    });
}

export function loadPageFromHash() {
  const hash = window.location.hash.replace(/^#/, '');
  const [areaId, pageId] = hash.split('/'); // Split the hash into levels

  const resolvedPageId = pageId ? `${areaId}/${pageId}` : areaId || 'home'; // Combine areaId and pageId

  console.log('Hash:', hash); // Debug: Log the full hash
  console.log('Area ID:', areaId); // Debug: Log the area ID
  console.log('Page ID:', resolvedPageId); // Debug: Log the resolved page ID

  navigateTo(resolvedPageId); // Navigate to the resolved page ID
}

// Load 404 content into the main section, but keep the hash in the URL
function load404Page(incorrectHash) {
  const mainContent = document.querySelector('main'); // Get the main content element

  if (!mainContent) return; // If there's no main element, return early

  // Clear the current content of the main section
  mainContent.innerHTML = '';

  // Display 404 message
  mainContent.innerHTML = `
    <section class="limit-content-width">
      <h1 class="font-title-lg">404 - Page Not Found</h1>
      <p>The page you are looking for, <strong>#${incorrectHash}</strong>, doesn't exist.</p>
      <p>Please check the URL or return to the <a href="#home" onclick="navigateTo('home')">home page</a>.</p>
    </section>
  `;

  updateActiveLink(null); // Update the active link to '404'
}