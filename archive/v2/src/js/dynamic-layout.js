export function updateLayoutForPage(pageId) {
  const main = document.querySelector('main');
  const appContainer = document.querySelector('#app'); // App container
  const navContainer = document.querySelector('#main-nav'); // Navigation container
  let submenuFound = false;

  // Clear previous defaults
  document.querySelectorAll('.drawer.rail-submenu').forEach(drawer => {
    drawer.classList.add('hide');
    drawer.classList.remove('show');
    drawer.removeAttribute('data-default-open');
  });

  // Walk up the hierarchy to find a parent page that defines a submenu
  let segments = pageId.split('/');
  while (segments.length > 0) {
    const parentId = segments.join('/');
    const page = document.getElementById(parentId);
    if (page && page.dataset.submenu) {
      const submenu = document.getElementById(page.dataset.submenu);
      if (submenu) {
        submenu.classList.remove('hide');
        submenu.setAttribute('data-default-open', 'true');
        submenuFound = true;
      }
      break;
    }
    segments.pop();
  }

  if (main) {
    main.classList.toggle('drawer-open', submenuFound);
  }

  // Adjust layout for client pages
  if (pageId.startsWith('client/')) {
    appContainer.classList.add('full-screen'); // Add class to app container
    navContainer.classList.add('hidden'); // Hide navigation

    // Load the client-specific menu
    fetch('/src/templates/client-menu.html')
      .then(response => response.text())
      .then(html => {
        const clientMenuContainer = document.querySelector('#client-menu-container');
        if (clientMenuContainer) {
          clientMenuContainer.innerHTML = html;
          clientMenuContainer.classList.remove('hidden')
          console.log('Client menu loaded');
        }
      })
      .catch(err => console.error('Error loading client menu:', err));

    if (pageId === 'client/decision') {
      // adjust the main content area to account for the right hand supporting pane
      main.classList.add('has-supporting-pane');
      appContainer.classList.add('has-supporting-pane');
    }


  } else {
    appContainer.classList.remove('full-screen'); // Remove class from app container
    navContainer.classList.remove('hidden'); // Show navigation

    // Clear the client-specific menu
    const clientMenuContainer = document.querySelector('#client-menu-container');
    if (clientMenuContainer) {
      clientMenuContainer.innerHTML = '';
    }

  }

}

export function loadDynamicLayout() {
  const headerContainer = document.querySelector('header'); // Replace with the correct container for your header
  const navContainer = document.querySelector('#main-nav'); // Replace with the correct container for your navigation
  const isDemo = window.location.pathname.includes('demo.html');

  // Determine the correct template files
  const headerFile = isDemo ? 'src/templates/demo-header.html' : 'src/templates/design-system-header.html';
  const navFile = isDemo ? 'src/templates/demo-nav.html' : 'src/templates/design-system-nav.html';

  // Return a Promise that resolves when both header and navigation are loaded
  return Promise.all([
    // Load the header
    fetch(headerFile)
      .then(response => response.text())
      .then(html => {
        if (headerContainer) {
          headerContainer.innerHTML = html;
          console.log(`Loaded ${isDemo ? 'Demo' : 'Design-System'} Header`);
        }
      })
      .catch(err => console.error('Error loading header:', err)),

    // Load the navigation
    fetch(navFile)
      .then(response => response.text())
      .then(html => {
        if (navContainer) {
          navContainer.innerHTML = html;
          console.log(`Loaded ${isDemo ? 'Demo' : 'Design-System'} Navigation`);
        }
      })
      .catch(err => console.error('Error loading navigation:', err))
  ]);
}