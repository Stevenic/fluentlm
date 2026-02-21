/**
 * Button component JS — handles split buttons and icon injection.
 * Icon injection is delegated to FluentLMIconComponent.
 * This module handles data-split transformation.
 */
var FluentLMButtonComponent = (function () {
  'use strict';

  function init(root) {
    var els = (root || document).querySelectorAll('.flm-button[data-split]');
    for (var i = 0; i < els.length; i++) {
      renderSplit(els[i]);
    }
  }

  function renderSplit(btn) {
    // Skip if already rendered
    if (btn.getAttribute('data-split-rendered')) return;

    // Wrap button in a split container
    var wrapper = document.createElement('div');
    wrapper.className = 'flm-button-split';
    if (btn.classList.contains('flm-button--primary')) {
      wrapper.classList.add('flm-button-split--primary');
    }

    // Create caret button
    var caret = document.createElement('button');
    caret.className = 'flm-button-split-caret';
    caret.setAttribute('aria-label', 'See more options');
    caret.setAttribute('aria-haspopup', 'true');
    caret.type = 'button';

    var chevron = FluentIcons.getSvg('ChevronDown');
    if (chevron) {
      caret.appendChild(chevron);
    }

    // Insert wrapper and move button into it
    btn.parentNode.insertBefore(wrapper, btn);
    btn.removeAttribute('data-split');
    wrapper.appendChild(btn);
    wrapper.appendChild(caret);

    btn.setAttribute('data-split-rendered', 'true');
  }

  return { init: init };
})();
