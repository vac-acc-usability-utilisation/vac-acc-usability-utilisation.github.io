import { getCurrentMode, getCurrentRoute, navigateTo, onRouteChange } from './router.js';
import { debounce, fetchTemplate } from './utils.js';

/**
 * Manages navigation UI and interactions
 */
export class Navigation {
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
    
    // State
    this.routeUnsubscribe = null;
    this.initialized = false;
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
    }

    // Unsubscribe from route changes
    if (this.routeUnsubscribe) {
      this.routeUnsubscribe();
      this.routeUnsubscribe = null;
    }

    this.initialized = false;
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
      if (submenu) submenu.classList.add('hidden');
    });

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