// Function to close all active menus
export function closeAllMenus() {
    const menus = document.querySelectorAll('.menu-container.active');
    menus.forEach(menu => {
        
        menu.classList.remove('active');
        menu.classList.add('hide');
    });
}

// Function to toggle the menu visibility and position it relative to the button
export function toggleMenu(button, menu) {
    closeAllMenus()

    const isMenuOpen = menu.classList.toggle('active');
    console.log(`Menu ${isMenuOpen ? 'opened' : 'closed'}`);

    if (isMenuOpen) {
        // Restore the main menu content when opening
        restoreMainMenu(menu);

        // Make sure menu is temporarily visible to get its dimensions
        menu.classList.remove('hide');

        // Calculate the position of the button and the menu dimensions
        const buttonRect = button.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();

        // Position the menu below the button, adjusting for scroll position
        let menuTop = buttonRect.bottom + window.scrollY;
        let menuLeft = buttonRect.left + window.scrollX;

        // Adjust the position if the menu would overflow the bottom of the viewport
        if (menuTop + menuRect.height > window.innerHeight) {
            menuTop = buttonRect.top + window.scrollY - menuRect.height; // Open above the button
        }

        // Adjust the position if the menu would overflow the right or left of the viewport
        if (menuLeft + menuRect.width > window.innerWidth) {
            menuLeft = buttonRect.right + window.scrollX - menuRect.width; // Shift left to fit
        } else if (menuLeft < 0) {
            menuLeft = 0; // Prevent going off the left edge of the screen
        }

        // Apply the calculated positions to the menu
        menu.style.top = `${menuTop}px`;
        menu.style.left = `${menuLeft}px`;


        // Add a click event listener to close the menu when clicking outside
        document.addEventListener('click', closeMenuOnClickOutside);

    } else {
        // Hide the menu when it's closed
        menu.classList.add('hide');
        document.removeEventListener('click', closeMenuOnClickOutside);
    }
}

function toggleSubmenu(submenubutton, submenuId) { 
   // Get the current menu container
   const menuContainer = submenubutton.closest('.menu-container');
    
   // Get all sibling menu items and the clicked submenu button's parent (li element)
   const currentMenuItems = Array.from(submenubutton.closest('ul').children);
    
    // Hide all the menu items in the current menu
    currentMenuItems.forEach(item => {
        item.classList.add('hide');
    });

     // Find the submenu by its ID
     const submenu = document.getElementById(submenuId);
    
     if (submenu) {
         // Remove the 'hide' class from the submenu to make it visible
         submenu.classList.remove('hide');
     } else {
         console.error(`Submenu with ID '${submenuId}' not found.`);
     }

}

// Function to restore the main menu and hide all submenus
export function restoreMainMenu(menuContainer) {
    // Get all submenus and hide them by adding the 'hide' class
    const submenus = menuContainer.querySelectorAll('.submenu');
    submenus.forEach(submenu => {
        submenu.classList.add('hide');
    });

    // Show all the main menu items by removing the 'hide' class
    const mainMenuItems = Array.from(menuContainer.querySelector('ul').children);
    mainMenuItems.forEach(item => {
        item.classList.remove('hide');
    });
}

// Function to handle back button click
export function handleBackButtonClick(event) {
    event.preventDefault();
    
    const backButton = event.currentTarget;

    // Get the submenu and parent menu (the ul that contains the back button)
    const submenu = backButton.closest('ul');
    
    // Find the main menu (parent menu) by navigating back to the .menu-container
    const menuContainer = submenu.closest('.menu-container');

    // Restore the main menu using the existing function
    restoreMainMenu(menuContainer, submenu.id);
}

// Initialize the back button functionality
export function initializeBackButtons() {
    const backButtons = document.querySelectorAll('.back-button');

    backButtons.forEach(button => {
        button.addEventListener('click', handleBackButtonClick);
    });
}

// Close the menu when clicking outside
export function closeMenuOnClickOutside(event) {
    const menus = document.querySelectorAll('.menu-container.active');
    
    menus.forEach(menu => {
        const button = document.querySelector(`[aria-controls="${menu.id}"]`);
        
        // Ensure the button and menu are found
        if (menu && button) {
            // Check if the click target is outside the menu and button
            if (!menu.contains(event.target) && !button.contains(event.target)) {
                // Close the menu
                menu.classList.remove('active');
                menu.classList.add('hide');
                console.log(`Closed menu: ${menu.id}`); // Debugging line
            }
        } else {
            console.warn(`Button or menu not found for menu ID: ${menu.id}`);
        }
    });
}

// Initialize all buttons with a menu attached
export function initializeMenus() {
    const buttons = document.querySelectorAll('.menu-button');
    const submenubuttons = document.querySelectorAll('.menu-item.submenu-button');

    buttons.forEach(button => {
        const menuId = button.getAttribute('aria-controls');
        const menu = document.getElementById(menuId).closest('.menu-container');

        if (menu) {
            // Attach the toggleMenu function to each button
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent immediate closing
                toggleMenu(button, menu);
            });
        }
    });

    submenubuttons.forEach(submenubutton => {
         // Attach the toggleMenu function to each button
         const submenuId = submenubutton.getAttribute('data-submenu');

         submenubutton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent navigation
            event.stopPropagation(); // Prevent immediate closing
            console.log('open the submenu: ' + submenuId)
            toggleSubmenu(submenubutton, submenuId);
        });
    });

    initializeBackButtons();
}