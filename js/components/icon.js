/**
 * Icon component — resolves data-icon attributes to inline SVG.
 */
var FluentLMIconComponent = (function () {
  'use strict';

  function init(root) {
    var els = (root || document).querySelectorAll('[data-icon]');
    for (var i = 0; i < els.length; i++) {
      render(els[i]);
    }
  }

  function render(el) {
    // Skip if already rendered
    if (el.getAttribute('data-icon-rendered')) return;

    var name = el.getAttribute('data-icon');
    if (!name) return;

    var svg = FluentIcons.getSvg(name);
    if (!svg) return;

    // For .flm-icon elements or inline icon elements (i, span with data-icon only), replace contents
    if (el.classList.contains('flm-icon') || ((el.tagName === 'I' || el.tagName === 'SPAN') && el.childNodes.length === 0)) {
      el.innerHTML = '';
      el.appendChild(svg);
    }
    // For buttons / other elements, prepend icon
    else if (el.classList.contains('flm-button') || el.tagName === 'BUTTON' || el.tagName === 'A') {
      el.insertBefore(svg, el.firstChild);
      // Add a small space text node if there's text content after the icon
      if (el.childNodes.length > 1 && !el.classList.contains('flm-button--icon')) {
        svg.style.marginRight = '4px';
      }
    }

    el.setAttribute('data-icon-rendered', 'true');
  }

  return { init: init, render: render };
})();
