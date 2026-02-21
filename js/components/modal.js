/**
 * Modal component JS — open/close, Escape key, overlay dismiss.
 *
 * Usage:
 *   FluentLMModalComponent.open('my-modal')
 *   FluentLMModalComponent.close('my-modal')
 *
 * Trigger: <button data-modal-open="my-modal">Open</button>
 */
var FluentLMModalComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var triggers = doc.querySelectorAll('[data-modal-open]');
    for (var i = 0; i < triggers.length; i++) {
      wireTrigger(triggers[i]);
    }

    var closeBtns = doc.querySelectorAll('[data-modal-close]');
    for (var j = 0; j < closeBtns.length; j++) {
      wireClose(closeBtns[j]);
    }

    var overlays = doc.querySelectorAll('.flm-modal-overlay');
    for (var k = 0; k < overlays.length; k++) {
      wireOverlay(overlays[k]);
    }
  }

  function wireTrigger(btn) {
    if (btn.getAttribute('data-modal-wired')) return;
    btn.addEventListener('click', function () {
      open(btn.getAttribute('data-modal-open'));
    });
    btn.setAttribute('data-modal-wired', 'true');
  }

  function wireClose(btn) {
    if (btn.getAttribute('data-modal-wired')) return;
    btn.addEventListener('click', function () {
      var overlay = btn.closest('.flm-modal-overlay');
      if (overlay) closeOverlay(overlay);
    });
    btn.setAttribute('data-modal-wired', 'true');
  }

  function wireOverlay(overlay) {
    if (overlay.getAttribute('data-modal-overlay-wired')) return;
    // Only light-dismiss if not blocking
    if (overlay.hasAttribute('data-light-dismiss')) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeOverlay(overlay);
      });
    }
    overlay.setAttribute('data-modal-overlay-wired', 'true');
  }

  function open(id) {
    var overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('flm-modal-overlay--open');
    document.body.style.overflow = 'hidden';

    var escHandler = function (e) {
      if (e.key === 'Escape' && !overlay.hasAttribute('data-blocking')) {
        closeOverlay(overlay);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    overlay._escHandler = escHandler;
  }

  function close(id) {
    var overlay = document.getElementById(id);
    if (overlay) closeOverlay(overlay);
  }

  function closeOverlay(overlay) {
    overlay.classList.remove('flm-modal-overlay--open');
    document.body.style.overflow = '';
    if (overlay._escHandler) {
      document.removeEventListener('keydown', overlay._escHandler);
      delete overlay._escHandler;
    }
  }

  return { init: init, open: open, close: close };
})();
