/**
 * Dialog component JS — open/close, Escape key, overlay click dismiss.
 *
 * Usage:
 *   FluentLMDialogComponent.open('my-dialog')
 *   FluentLMDialogComponent.close('my-dialog')
 *
 * Or wire a trigger button:
 *   <button data-dialog-open="my-dialog">Open</button>
 */
var FluentLMDialogComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    // Wire trigger buttons
    var triggers = doc.querySelectorAll('[data-dialog-open]');
    for (var i = 0; i < triggers.length; i++) {
      wireOpen(triggers[i]);
    }

    // Wire close buttons inside dialogs
    var closeBtns = doc.querySelectorAll('.flm-dialog-close, [data-dialog-close]');
    for (var j = 0; j < closeBtns.length; j++) {
      wireClose(closeBtns[j]);
    }

    // Wire overlay click-to-dismiss (light dismiss)
    var overlays = doc.querySelectorAll('.flm-dialog-overlay[data-light-dismiss]');
    for (var k = 0; k < overlays.length; k++) {
      wireOverlayDismiss(overlays[k]);
    }
  }

  function wireOpen(btn) {
    if (btn.getAttribute('data-dialog-wired')) return;
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-dialog-open');
      open(id);
    });
    btn.setAttribute('data-dialog-wired', 'true');
  }

  function wireClose(btn) {
    if (btn.getAttribute('data-dialog-wired')) return;
    btn.addEventListener('click', function () {
      var overlay = btn.closest('.flm-dialog-overlay');
      if (overlay) {
        closeOverlay(overlay);
      }
    });
    btn.setAttribute('data-dialog-wired', 'true');
  }

  function wireOverlayDismiss(overlay) {
    if (overlay.getAttribute('data-dismiss-wired')) return;
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closeOverlay(overlay);
      }
    });
    overlay.setAttribute('data-dismiss-wired', 'true');
  }

  function open(id) {
    var overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('flm-dialog-overlay--open');
    document.body.style.overflow = 'hidden';

    // Escape key listener
    var escHandler = function (e) {
      if (e.key === 'Escape') {
        closeOverlay(overlay);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    overlay._escHandler = escHandler;

    // Focus first focusable element
    setTimeout(function () {
      var focusable = overlay.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
    }, 50);
  }

  function close(id) {
    var overlay = document.getElementById(id);
    if (overlay) closeOverlay(overlay);
  }

  function closeOverlay(overlay) {
    overlay.classList.remove('flm-dialog-overlay--open');
    document.body.style.overflow = '';
    if (overlay._escHandler) {
      document.removeEventListener('keydown', overlay._escHandler);
      delete overlay._escHandler;
    }
  }

  return { init: init, open: open, close: close };
})();
