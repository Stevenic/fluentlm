/**
 * Callout component JS — positions a callout relative to a target element.
 *
 * Usage:
 *   FluentLMCalloutComponent.show(calloutEl, targetEl)
 *   FluentLMCalloutComponent.hide(calloutEl)
 *
 * Or declarative: <button data-callout-toggle="my-callout">Toggle</button>
 */
var FluentLMCalloutComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var triggers = doc.querySelectorAll('[data-callout-toggle]');
    for (var i = 0; i < triggers.length; i++) {
      wireTrigger(triggers[i]);
    }
  }

  function wireTrigger(btn) {
    if (btn.getAttribute('data-callout-wired')) return;
    btn.addEventListener('click', function (e) {
      var id = btn.getAttribute('data-callout-toggle');
      var callout = document.getElementById(id);
      if (!callout) return;

      if (callout.classList.contains('flm-callout--visible')) {
        hide(callout);
      } else {
        show(callout, btn);
      }
      e.stopPropagation();
    });
    btn.setAttribute('data-callout-wired', 'true');
  }

  function show(callout, target) {
    // Position relative to target
    var rect = target.getBoundingClientRect();
    var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    callout.style.position = 'absolute';
    callout.style.left = rect.left + scrollX + 'px';
    callout.style.top = (rect.bottom + scrollY + 4) + 'px';

    callout.classList.add('flm-callout--visible');
    callout.classList.add('flm-callout--below');

    // Check if callout goes off-screen bottom, flip above if needed
    setTimeout(function () {
      var calloutRect = callout.getBoundingClientRect();
      if (calloutRect.bottom > window.innerHeight) {
        callout.classList.remove('flm-callout--below');
        callout.classList.add('flm-callout--above');
        callout.style.top = (rect.top + scrollY - calloutRect.height - 4) + 'px';
      }
    }, 0);

    // Click outside to dismiss
    var outsideHandler = function (e) {
      if (!callout.contains(e.target) && !target.contains(e.target)) {
        hide(callout);
        document.removeEventListener('click', outsideHandler);
      }
    };
    setTimeout(function () {
      document.addEventListener('click', outsideHandler);
    }, 0);
    callout._outsideHandler = outsideHandler;
  }

  function hide(callout) {
    callout.classList.remove('flm-callout--visible', 'flm-callout--below', 'flm-callout--above');
    if (callout._outsideHandler) {
      document.removeEventListener('click', callout._outsideHandler);
      delete callout._outsideHandler;
    }
  }

  return { init: init, show: show, hide: hide };
})();
