/**
 * Pivot component JS — tab switching.
 * Tabs reference panels by data-panel attribute.
 */
var FluentLMPivotComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var pivots = doc.querySelectorAll('.flm-pivot');
    for (var i = 0; i < pivots.length; i++) {
      wirePivot(pivots[i]);
    }
  }

  function wirePivot(pivot) {
    if (pivot.getAttribute('data-pivot-wired')) return;

    var tabs = pivot.querySelectorAll('.flm-pivot-tab');
    for (var i = 0; i < tabs.length; i++) {
      wireTab(pivot, tabs[i]);
    }

    pivot.setAttribute('data-pivot-wired', 'true');
  }

  function wireTab(pivot, tab) {
    tab.addEventListener('click', function () {
      if (tab.classList.contains('flm-pivot-tab--disabled')) return;

      // Deactivate all tabs
      var allTabs = pivot.querySelectorAll('.flm-pivot-tab');
      for (var i = 0; i < allTabs.length; i++) {
        allTabs[i].classList.remove('flm-pivot-tab--active');
        allTabs[i].setAttribute('aria-selected', 'false');
      }

      // Hide all panels
      var allPanels = pivot.querySelectorAll('.flm-pivot-panel');
      for (var j = 0; j < allPanels.length; j++) {
        allPanels[j].classList.remove('flm-pivot-panel--active');
      }

      // Activate clicked tab
      tab.classList.add('flm-pivot-tab--active');
      tab.setAttribute('aria-selected', 'true');

      // Show matching panel
      var panelId = tab.getAttribute('data-panel');
      if (panelId) {
        var panel = document.getElementById(panelId);
        if (panel) panel.classList.add('flm-pivot-panel--active');
      }
    });
  }

  return { init: init };
})();
