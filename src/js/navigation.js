import { navigateTo } from './router.js';
import { queryAll, removeClass, addClass } from './utils.js';

export function setupPageNavigation() {
  const pageLinks = queryAll('[data-ui]');

  for (let i = 0; i < pageLinks.length; i++) {
    const link = pageLinks[i];

    if (!link.dataset.bound) {
      link.dataset.bound = "true";

      link.addEventListener('click', (event) => {
        event.preventDefault();
        const pageId = link.getAttribute('data-ui').replace(/^#/, '');
        const tabId = link.dataset.tab;

        if (tabId) {
          navigateTo(pageId, { tab: tabId });
        } else {
          navigateTo(pageId);
        }
      });
    }
  }
}

export function updateActiveLink(pageId) {
  // Clear all active classes
  const links = queryAll('[data-ui]');
  links.forEach(link => removeClass(link, 'active'));

  if (!pageId) return;

  // Add 'active' to parent link only if it's in the top-level rail
  const segments = pageId.split('/');
  if (segments.length > 1) {
    const parentId = segments[0];
    const railNavItems = document.querySelectorAll(
      `nav.left > ul > li > a[data-ui="${parentId}"]`
    );
    railNavItems.forEach(link => addClass(link, 'active'));
  }

  // Add 'active' to exact match
  const exactMatches = queryAll(`[data-ui="${pageId}"]`);
  exactMatches.forEach(link => addClass(link, 'active'));
}

export function handleNavRailHover() {
  const navItems = document.querySelectorAll("nav.left ul > li");

  navItems.forEach((li) => {
    const trigger = li.querySelector("a[data-ui]");
    const submenu = li.querySelector(".rail-submenu");

    if (!trigger || !submenu) return;

    const showSubmenu = () => {
      if (submenu.dataset.defaultOpen === "true") return; // Don’t override default
      submenu.classList.remove("hide");
      submenu.classList.add("show");
    };

    const hideSubmenu = () => {
      if (submenu.dataset.defaultOpen === "true") return; // Never hide default
      submenu.classList.remove("show");
      submenu.classList.add("hide");
    };

    let hideTimeout;

    const cancelHide = () => clearTimeout(hideTimeout);
    const scheduleHide = () => {
      hideTimeout = setTimeout(() => hideSubmenu(), 200);
    };

    li.addEventListener("mouseenter", showSubmenu);
    li.addEventListener("mouseleave", scheduleHide);
    submenu.addEventListener("mouseenter", cancelHide);
    submenu.addEventListener("mouseleave", scheduleHide);
  });
}

export function setupExpandableNav() {
  const expandableButtons = document.querySelectorAll('.nav-button.expandable');

  expandableButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const li = button.closest('li');

      // Collapse any other expanded items
      //document.querySelectorAll('nav.left li.expanded').forEach(el => {
      //if (el !== li) el.classList.remove('expanded');
      //});

      li.classList.toggle('expanded');
    });
  });
}



