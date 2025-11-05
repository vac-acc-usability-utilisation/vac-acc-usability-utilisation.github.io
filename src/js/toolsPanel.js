import { initSelectSearchable } from './select-searchable.js';
import { debounce } from './utils.js'; // Ensure debounce is imported

/**
 * Sets up a handler to open the tools panel and load content when a button is clicked.
 * @param {string} buttonSelector - CSS selector for the button to trigger the panel
 * @param {string|Function} content - HTML string, template path, or async function returning HTML
 */

export function setupToolsPanel(buttonSelector, content) {
  // Wait for DOM update (in case content is loaded dynamically)
  setTimeout(() => {
    const btn = document.querySelector(buttonSelector);
    if (!btn) return;

    btn.addEventListener(
      'click',
      debounce(async () => {
        console.log('Tools Panel button clicked:', buttonSelector);

        const panel = document.getElementById('toolsPanel');
        if (!panel) return;
        panel.classList.remove('hidden');

        //btn.classList.remove('primary-container');
        //btn.classList.add('transparent', 'border');
        //btn.innerHTML = ' <i class="on-surface-variant">close</i> Close';

        // If content is a function, call it; if it's a path, fetch; else use as HTML
        if (typeof content === 'function') {
          panel.innerHTML = await content();
        } else if (typeof content === 'string' && content.endsWith('.html')) {
          const resp = await fetch(content);
          panel.innerHTML = await resp.text();
        } else {
          panel.innerHTML = content;
        }

        // Initialize minimal select-searchable behaviour for any newly injected content
        try {
          initSelectSearchable(panel);
        } catch (e) {
          console.warn('initSelectSearchable failed in toolsPanel', e);
        }
      }, 250)
    );
  }, 0);
}
