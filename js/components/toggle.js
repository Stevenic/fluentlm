/**
 * Toggle component JS — initializes state text from data-on / data-off.
 * The CSS handles display via content: attr(data-on) / attr(data-off)
 * using the :checked sibling selector, so this module only needs to
 * handle any initial ARIA setup.
 */
var FluentLMToggleComponent = (function () {
  'use strict';

  function init(root) {
    var els = (root || document).querySelectorAll('.flm-toggle');
    for (var i = 0; i < els.length; i++) {
      render(els[i]);
    }
  }

  function render(el) {
    var input = el.querySelector('.flm-toggle-input');
    if (!input) return;

    // Set initial ARIA
    input.setAttribute('role', 'switch');
    input.setAttribute('aria-checked', input.checked ? 'true' : 'false');

    // Keep aria-checked in sync
    input.addEventListener('change', function () {
      input.setAttribute('aria-checked', input.checked ? 'true' : 'false');
    });
  }

  return { init: init };
})();
