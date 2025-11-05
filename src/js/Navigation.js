import { getCurrentMode, getCurrentRoute, navigateTo, onRouteChange } from './router.js';
import { debounce, fetchTemplate } from './utils.js';

/**
 * Manages navigation UI and interactions
 */
export class NavigationManager {
  constructor(options = {}) {
    this.options = {
      navigationRailId: 'navigationRail',
      clientMenuId: 'client-menu',
      navigationMenuId: 'navigation-menu',
      scrimId: 'scrim',
      contentAreaId: 'contentArea',
      mainContentWrapperId: 'mainContentWrapper',
      ...options
    };

    // Bind methods
    this.handleBodyClick = this.handleBodyClick.bind(this);
    this.handleRouteChange = this.handleRouteChange.bind(this);
  this.handleHoverIn = this.handleHoverIn.bind(this);
  this.handleHoverOut = this.handleHoverOut.bind(this);
    
    // State
    this.routeUnsubscribe = null;
    this.initialized = false;
    this.currentPreviewArea = null;
    this.previewTimers = new Map();
  }

  /**
   * Initialize navigation component
   * @param {HTMLElement} root - Root element to attach listeners to
   */
  init(root = document.body) {
    if (this.initialized) return;
    
    // Store root element
    this.root = root;

    // Set up click delegation with debounce
    this.root.addEventListener('click', debounce(this.handleBodyClick, 250));

  // Set up hover delegation for rail submenu previews
  this.root.addEventListener('mouseover', this.handleHoverIn);
  this.root.addEventListener('mouseout', this.handleHoverOut);

    // Subscribe to route changes
    this.routeUnsubscribe = onRouteChange(this.handleRouteChange);

    this.initialized = true;
  }

  /**
   * Clean up navigation component
   */
  destroy() {
    if (!this.initialized) return;

    // Remove event listeners
    if (this.root) {
      this.root.removeEventListener('click', this.handleBodyClick);
      this.root.removeEventListener('mouseover', this.handleHoverIn);
      this.root.removeEventListener('mouseout', this.handleHoverOut);
    }

    // Unsubscribe from route changes
    if (this.routeUnsubscribe) {
      this.routeUnsubscribe();
      this.routeUnsubscribe = null;
    }

    this.initialized = false;
  }

  /**
   * Handle hover-in to preview submenus on design rail items
   * @private
   */
  handleHoverIn(e) {
    const rail = document.getElementById(this.options.navigationRailId);
    if (!rail) return;
    if (!rail.contains(e.target)) return; // only when hovering the rail

    // If hovering inside a submenu, keep it open (cancel hide timer)
    const submenuEl = e.target.closest('nav.rail-submenu');
    if (submenuEl) {
      const id = submenuEl.id;
      const areaFromId = {
        'foundations-submenu': 'foundations',
        'styles-submenu': 'styles',
        'components-submenu': 'components',
        'patterns-submenu': 'patterns'
      }[id];
      if (areaFromId) {
        const t = this.previewTimers.get(areaFromId);
        if (t) {
          clearTimeout(t);
          this.previewTimers.delete(areaFromId);
        }
        // Ensure it stays visible as a preview
        this.showSubmenuPreview(areaFromId);
        return;
      }
    }

    const link = e.target.closest('li > a[data-ui]');
    if (!link) return;

    const area = link.getAttribute('data-ui');
    const submenuMap = { foundations: 'foundations-submenu', styles: 'styles-submenu', components: 'components-submenu', patterns: 'patterns-submenu' };
    if (!submenuMap[area]) return; // no submenu for this item

    const route = getCurrentRoute();
    if (route.mode !== 'design') return; // only show previews in design mode

    // Cancel any pending hide timer for this area
    const t = this.previewTimers.get(area);
    if (t) {
      clearTimeout(t);
      this.previewTimers.delete(area);
    }

    if (this.currentPreviewArea && this.currentPreviewArea !== area) {
      this.hideSubmenuPreview(this.currentPreviewArea);
    }
    this.showSubmenuPreview(area);
  }

  /**
   * Handle hover-out to hide submenu previews when leaving the rail item
   * @private
   */
  handleHoverOut(e) {
    const rail = document.getElementById(this.options.navigationRailId);
    if (!rail) return;
    const containerLi = e.target.closest('#' + this.options.navigationRailId + ' li');
    if (!containerLi) return;

    // If moving to an element still inside the same LI (including submenu), ignore
    if (e.relatedTarget && containerLi.contains(e.relatedTarget)) return;

    // Determine area for this li (first a[data-ui])
    const link = containerLi.querySelector('a[data-ui]');
    if (!link) return;
    const area = link.getAttribute('data-ui');
    const submenuMap = { foundations: 'foundations-submenu', styles: 'styles-submenu', components: 'components-submenu', patterns: 'patterns-submenu' };
    if (!submenuMap[area]) return;

    // Schedule a slight delay before hiding to avoid flicker when moving into submenu
    const timer = setTimeout(() => {
      this.hideSubmenuPreview(area);
      this.previewTimers.delete(area);
    }, 350);
    this.previewTimers.set(area, timer);
  }

  /** Show submenu as a non-persistent preview */
  showSubmenuPreview(area) {
    const submenuMap = { foundations: 'foundations-submenu', styles: 'styles-submenu', components: 'components-submenu', patterns: 'patterns-submenu' };
    const id = submenuMap[area];
    const submenu = document.getElementById(id);
    if (!submenu) return;
    // Ensure only one submenu carries the preview class at a time
    Object.values(submenuMap).forEach((sid) => {
      const el = document.getElementById(sid);
      if (!el) return;
      el.classList.remove('preview');
    });

    submenu.classList.remove('hidden');
    submenu.classList.add('preview');
    try { document.body.classList.add('submenu-preview-open'); } catch (_e) {}
    this.currentPreviewArea = area;
  }

  /** Hide submenu preview unless it's the persistent (route) submenu */
  hideSubmenuPreview(area) {
    const route = getCurrentRoute();
    if (route.mode === 'design' && route.appArea === area) {
      // persistent submenu for current route; don't hide
      return;
    }
    const submenuMap = { foundations: 'foundations-submenu', styles: 'styles-submenu', components: 'components-submenu', patterns: 'patterns-submenu' };
    const id = submenuMap[area];
    const submenu = document.getElementById(id);
    if (submenu) {
      submenu.classList.remove('preview');
      submenu.classList.add('hidden');
    }

    // If no route submenu is active, remove layout class
    const persistentId = submenuMap[route.appArea];
    const persistentSubmenu = persistentId ? document.getElementById(persistentId) : null;
    const anyVisible = persistentSubmenu && !persistentSubmenu.classList.contains('hidden');
    const contentArea = document.getElementById(this.options.contentAreaId);
    // Do not alter layout for previews; only remove layout class if no persistent submenu is visible
    if (contentArea && !anyVisible) contentArea.classList.remove('submenu-open');

    if (this.currentPreviewArea === area) this.currentPreviewArea = null;
    // If no preview remains, remove preview-open flag
    if (!this.currentPreviewArea) {
      try { document.body.classList.remove('submenu-preview-open'); } catch (_e) {}
    }
  }

  /**
   * Handle route changes
   * @private
   */
  handleRouteChange(route) {
    this.updateActiveRailItem(route.appArea);
    if (route.pageTab) {
      this.updateActiveTab(document.querySelector(`[data-tab="${route.pageTab}"]`));
      this.updateActiveTabPage(route.pageTab);
    }
  }

  /**
   * Handle delegated click events
   * @private
   */
  handleBodyClick(e) {
    if (this.handleNavRailClick(e)) return;
    if (this.handleExpansionClick(e)) return;
    if (this.handleTabClick(e)) return;
  }

  /**
   * Handle navigation rail clicks
   * @private
   */
  handleNavRailClick(e) {
    const target = e.target.closest('[data-ui]');
    if (!target) return false;
    if (target.tagName === 'A') e.preventDefault();
    const ui = target.getAttribute('data-ui');
    if (!ui) return true;
    const mode = getCurrentMode();
    navigateTo(['csa', mode, ui]);
    return true;
  }

  /**
   * Handle expansion button clicks
   * @private
   */
  handleExpansionClick(e) {
    const expBtn = e.target.closest('.has-expansion > .nav-button.expandable');
    if (!expBtn) return false;
    e.stopPropagation();
    const li = expBtn.closest('.has-expansion');
    const expanded = li.classList.toggle('expanded');
    expBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    const icon = expBtn.querySelector('.icon');
    if (icon) icon.textContent = expanded ? 'arrow_drop_up' : 'arrow_drop_down';
    return true;
  }

  /**
   * Handle tab clicks
   * @private
   */
  handleTabClick(e) {
    const tabTarget = e.target.closest('[data-tab]');
    if (!tabTarget || tabTarget.tagName !== 'A') return false;

    e.preventDefault();
    const tabValue = tabTarget.getAttribute('data-tab');
    const route = getCurrentRoute();

    // Update URL hash if needed
    if (route.product === 'csa' && route.mode === 'design') {
      const segments = [route.product, route.mode, route.appArea];
      if (route.areaPage) segments.push(route.areaPage);
      segments.push(tabValue);
      navigateTo(segments);
    }

    this.updateActiveTab(tabTarget);
    this.updateActiveTabPage(tabValue);

    return true;
  }

  /**
   * Update active tab styling
   * @private
   */
  updateActiveTab(tabTarget) {
    if (!tabTarget) return;
    const allTabs = tabTarget.parentElement.querySelectorAll('[data-tab]');
    allTabs.forEach((tab) => tab.classList.toggle('active', tab === tabTarget));
  }

  /**
   * Update visible tab page
   * @private
   */
  updateActiveTabPage(tabValue) {
    const allPageDivs = document.querySelectorAll('[data-page]');
    allPageDivs.forEach((div) => {
      div.classList.toggle('active', div.getAttribute('data-page') === tabValue);
    });
  }

  /**
   * Update active rail item
   * @public
   */
  updateActiveRailItem(area) {
    console.log('Updating active rail item for area:', area);
    const rail = document.getElementById(this.options.navigationRailId);
    if (!rail) return;

    const railItems = rail.querySelectorAll('a');
    railItems.forEach((item) => {
      item.classList.remove('active');
      const itemArea = item.getAttribute('data-ui');
      if (itemArea) {
        item.classList.toggle('active', itemArea === area);
      }
    });
  }

  /**
   * Initialize navigation menu
   * @public
   */
  setupNavigationMenu() {
    const navigationMenu = document.getElementById(this.options.navigationMenuId);
    const scrim = document.getElementById(this.options.scrimId);
    const btn = document.getElementById('navigation-menu-btn');
    if (!navigationMenu || !scrim || !btn) return;

    btn.onclick = null;
    scrim.onclick = null;

    btn.onclick = () => {
      navigationMenu.classList.toggle('hidden');
      scrim.classList.toggle('hidden');
    };

    scrim.onclick = () => {
      navigationMenu.classList.add('hidden');
      scrim.classList.add('hidden');
    };
  }

  /**
   * Initialize client menu
   * @public
   */
  async setupClientMenu() {
    const navigationRail = document.getElementById(this.options.navigationRailId);
    const clientMenu = document.getElementById(this.options.clientMenuId);
    const route = getCurrentRoute();

    // Only show client menu if mode is "demo" and area is "client"
    if (route.mode === 'demo' && route.appArea === 'client') {
      if (navigationRail) navigationRail.classList.add('hidden');
      if (!clientMenu) {
        try {
          const html = await fetchTemplate('src/templates/client-menu.html', {
            fallbackHtml: '<div class="client-menu-placeholder">Menu unavailable</div>'
          });
          const newClientMenu = document.createElement('div');
          newClientMenu.id = this.options.clientMenuId;
          newClientMenu.innerHTML = html;
          const mainContentWrapper = document.getElementById(this.options.mainContentWrapperId);
          if (mainContentWrapper && mainContentWrapper.parentNode) {
            mainContentWrapper.parentNode.insertBefore(newClientMenu, mainContentWrapper);
          }
          this.updateClientMenuActive(route);
        } catch (err) {
          console.error('Error loading client menu', err);
        }
      } else {
        this.updateClientMenuActive(route);
      }
    } else {
      if (navigationRail) navigationRail.classList.remove('hidden');
      if (clientMenu) clientMenu.remove();
    }
  }

  /**
   * Update client menu active state
   * @private
   */
  updateClientMenuActive(route) {
    const clientMenu = document.getElementById(this.options.clientMenuId);
    if (!clientMenu) return;

    let path = route.areaPage ? `${route.appArea}/${route.areaPage}` : route.appArea;

    // Remove active from all
    clientMenu.querySelectorAll('a[data-ui]').forEach((a) => a.classList.remove('active'));
    
    // Add active to matching link
    const activeLink = clientMenu.querySelector(`a[data-ui="${path}"]`);
    if (activeLink) {
      activeLink.classList.add('active');

      // Expand parent section if needed
      const expansionUl = activeLink.closest('ul');
      if (expansionUl && expansionUl.id) {
        const li = expansionUl.parentElement;
        if (li && li.classList.contains('has-expansion')) {
          li.classList.add('expanded');
          const btn = li.querySelector('.nav-button.expandable');
          if (btn) {
            btn.setAttribute('aria-expanded', 'true');
            const icon = btn.querySelector('.icon');
            if (icon) icon.textContent = 'arrow_drop_up';
          }
        }
      }
    }

    // Collapse other sections
    clientMenu.querySelectorAll('.has-expansion').forEach((li) => {
      const expanded = li.contains(activeLink);
      li.classList.toggle('expanded', expanded);
      const btn = li.querySelector('.nav-button.expandable');
      if (btn) {
        btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        const icon = btn.querySelector('.icon');
        if (icon) icon.textContent = expanded ? 'arrow_drop_up' : 'arrow_drop_down';
      }
    });
  }

  /**
   * Update submenus visibility and active states
   * @public
   */
  updateSubmenus() {
    const route = getCurrentRoute();
    const { appArea: area, areaPage: subpage } = route;

    const submenuMap = {
      foundations: 'foundations-submenu',
      styles: 'styles-submenu',
      components: 'components-submenu',
      patterns: 'patterns-submenu'
    };
    const submenuTargets = Object.keys(submenuMap);

    // Hide all submenus
    Object.values(submenuMap).forEach((id) => {
      const submenu = document.getElementById(id);
      if (submenu) {
        submenu.classList.add('hidden');
        submenu.classList.remove('preview'); // clear any lingering preview state
      }
    });

    // Clear global preview state
    this.currentPreviewArea = null;
    try { document.body.classList.remove('submenu-preview-open'); } catch (_e) {}

    // Show active submenu
    const activeSubmenuId = submenuMap[area];
    if (activeSubmenuId) {
      const submenu = document.getElementById(activeSubmenuId);
      if (submenu) {
        submenu.classList.remove('hidden');
        
        // Update active states
        const submenuLinks = submenu.querySelectorAll('a[data-ui]');
        submenuLinks.forEach((link) => link.classList.remove('active'));
        
        if (!subpage && submenuLinks.length > 0) {
          // Highlight first link if no subpage
          submenuLinks[0].classList.add('active');
        } else {
          submenuLinks.forEach((link) => {
            const ui = link.getAttribute('data-ui');
            if ((subpage === area && ui === area) || 
                (ui === `${area}/${subpage}`)) {
              link.classList.add('active');
            }
          });
        }
      }
    }

    // Toggle submenu-open class
    const contentArea = document.getElementById(this.options.contentAreaId);
    if (contentArea) {
      contentArea.classList.toggle('submenu-open', submenuTargets.includes(area));
    }
  }
}