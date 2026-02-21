/**
 * GroupedList component JS — collapsible groups with chevron rotation.
 */
var FluentLMGroupedListComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var headers = doc.querySelectorAll('.flm-groupedlist-header');
    for (var i = 0; i < headers.length; i++) {
      wireHeader(headers[i]);
    }
  }

  function wireHeader(header) {
    if (header.getAttribute('data-groupedlist-wired')) return;

    header.addEventListener('click', function () {
      var items = header.nextElementSibling;
      if (!items || !items.classList.contains('flm-groupedlist-items')) return;

      var chevron = header.querySelector('.flm-groupedlist-chevron');
      var collapsed = items.classList.contains('flm-groupedlist-items--collapsed');

      if (collapsed) {
        items.classList.remove('flm-groupedlist-items--collapsed');
        if (chevron) chevron.classList.add('flm-groupedlist-chevron--expanded');
      } else {
        items.classList.add('flm-groupedlist-items--collapsed');
        if (chevron) chevron.classList.remove('flm-groupedlist-chevron--expanded');
      }
    });

    header.setAttribute('data-groupedlist-wired', 'true');
  }

  return { init: init };
})();
