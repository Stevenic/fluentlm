/**
 * Panel component JS — slide-in/out, Escape key, overlay dismiss.
 *
 * Usage:
 *   FluentLMPanelComponent.open('my-panel')
 *   FluentLMPanelComponent.close('my-panel')
 *
 * Trigger: <button data-panel-open="my-panel">Open</button>
 */
var FluentLMPanelComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var triggers = doc.querySelectorAll('[data-panel-open]');
    for (var i = 0; i < triggers.length; i++) {
      wireTrigger(triggers[i]);
    }

    var closeBtns = doc.querySelectorAll('.flm-panel-close, [data-panel-close]');
    for (var j = 0; j < closeBtns.length; j++) {
      wireClose(closeBtns[j]);
    }

    var overlays = doc.querySelectorAll('.flm-panel-overlay');
    for (var k = 0; k < overlays.length; k++) {
      wireOverlay(overlays[k]);
    }
  }

  function wireTrigger(btn) {
    if (btn.getAttribute('data-panel-wired')) return;
    btn.addEventListener('click', function () {
      open(btn.getAttribute('data-panel-open'));
    });
    btn.setAttribute('data-panel-wired', 'true');
  }

  function wireClose(btn) {
    if (btn.getAttribute('data-panel-wired')) return;
    btn.addEventListener('click', function () {
      var panel = btn.closest('.flm-panel');
      if (panel) closePanel(panel);
    });
    btn.setAttribute('data-panel-wired', 'true');
  }

  function wireOverlay(overlay) {
    if (overlay.getAttribute('data-panel-overlay-wired')) return;
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        var panel = overlay.nextElementSibling;
        if (panel && panel.classList.contains('flm-panel')) {
          closePanel(panel);
        }
      }
    });
    overlay.setAttribute('data-panel-overlay-wired', 'true');
  }

  function open(id) {
    var panel = document.getElementById(id);
    if (!panel) return;

    // Show overlay
    var overlay = panel.previousElementSibling;
    if (overlay && overlay.classList.contains('flm-panel-overlay')) {
      overlay.classList.add('flm-panel-overlay--open');
    }

    panel.classList.add('flm-panel--open');
    document.body.style.overflow = 'hidden';

    var escHandler = function (e) {
      if (e.key === 'Escape') {
        closePanel(panel);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    panel._escHandler = escHandler;

    setTimeout(function () {
      var focusable = panel.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
    }, 50);
  }

  function close(id) {
    var panel = document.getElementById(id);
    if (panel) closePanel(panel);
  }

  function closePanel(panel) {
    panel.classList.remove('flm-panel--open');

    var overlay = panel.previousElementSibling;
    if (overlay && overlay.classList.contains('flm-panel-overlay')) {
      overlay.classList.remove('flm-panel-overlay--open');
    }

    document.body.style.overflow = '';
    if (panel._escHandler) {
      document.removeEventListener('keydown', panel._escHandler);
      delete panel._escHandler;
    }
  }

  return { init: init, open: open, close: close };
})();
