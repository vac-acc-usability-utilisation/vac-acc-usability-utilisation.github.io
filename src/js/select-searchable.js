// Minimal select-searchable behaviour
// Exports initSelectSearchable(root) which wires simple show/hide toggle
export function initSelectSearchable(root = document) {
  if (!root) return;

  // Helper to close all within root
  function closeAll() {
    root.querySelectorAll('.select-searchable.open').forEach(function (w) {
      w.classList.remove('open');
      var c = w.querySelector('.select-content');
      if (c) c.style.display = 'none';
    });
  }

  // Initialize each component within root
  root.querySelectorAll('.select-searchable').forEach(function (wrapper) {
    var btn = wrapper.querySelector('.select-searchable-btn');
    var content = wrapper.querySelector('.select-content');
    if (!btn || !content) return;

    // Ensure initial visibility matches state
    if (!wrapper.classList.contains('open')) content.style.display = 'none';

    // clicking the button toggles show/hide
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = wrapper.classList.toggle('open');
      content.style.display = isOpen ? '' : 'none';
      btn.setAttribute('aria-expanded', String(Boolean(isOpen)));
    });

    // clicking inside dropdown shouldn't close it
    content.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  });

  // clicking outside closes any open dropdowns inside root
  document.addEventListener('click', function () {
    closeAll();
  });
}
