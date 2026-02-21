/**
 * Nav component JS — collapsible groups and active link tracking.
 */
var FluentLMNavComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    // Wire collapsible group headers
    var headers = doc.querySelectorAll('.flm-nav-group-header');
    for (var i = 0; i < headers.length; i++) {
      wireGroupHeader(headers[i]);
    }

    // Wire nav link clicks
    var links = doc.querySelectorAll('.flm-nav-link');
    for (var j = 0; j < links.length; j++) {
      wireLink(links[j]);
    }
  }

  function wireGroupHeader(header) {
    if (header.getAttribute('data-nav-wired')) return;

    header.addEventListener('click', function () {
      var items = header.nextElementSibling;
      if (!items || !items.classList.contains('flm-nav-group-items')) return;

      var chevron = header.querySelector('.flm-nav-chevron');
      var collapsed = items.classList.contains('flm-nav-group-items--collapsed');

      if (collapsed) {
        items.classList.remove('flm-nav-group-items--collapsed');
        if (chevron) chevron.classList.add('flm-nav-chevron--expanded');
      } else {
        items.classList.add('flm-nav-group-items--collapsed');
        if (chevron) chevron.classList.remove('flm-nav-chevron--expanded');
      }
    });

    header.setAttribute('data-nav-wired', 'true');
  }

  function wireLink(link) {
    if (link.getAttribute('data-nav-wired')) return;

    link.addEventListener('click', function () {
      // Remove active from all links in this nav
      var nav = link.closest('.flm-nav');
      if (nav) {
        var allLinks = nav.querySelectorAll('.flm-nav-link');
        for (var i = 0; i < allLinks.length; i++) {
          allLinks[i].classList.remove('flm-nav-link--active');
        }
      }
      link.classList.add('flm-nav-link--active');
    });

    link.setAttribute('data-nav-wired', 'true');
  }

  return { init: init };
})();
