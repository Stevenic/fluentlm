/**
 * SpinButton component JS — wires increment/decrement buttons to numeric input.
 */
var FluentLMSpinButtonComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var spinButtons = doc.querySelectorAll('.flm-spinbutton');
    for (var i = 0; i < spinButtons.length; i++) {
      wireSpinButton(spinButtons[i]);
    }
  }

  function wireSpinButton(el) {
    if (el.getAttribute('data-spinbutton-wired')) return;

    var input = el.querySelector('.flm-spinbutton-input');
    if (!input) return;

    var decBtn = el.querySelector('.flm-spinbutton-btn--decrement');
    var incBtn = el.querySelector('.flm-spinbutton-btn--increment');

    // Inject icons if empty
    if (decBtn && !decBtn.innerHTML.trim()) {
      decBtn.setAttribute('data-icon', 'ChevronDown');
    }
    if (incBtn && !incBtn.innerHTML.trim()) {
      incBtn.setAttribute('data-icon', 'ChevronUp');
    }

    if (decBtn) {
      decBtn.addEventListener('click', function () {
        if (input.disabled) return;
        try { input.stepDown(); } catch (e) {
          input.value = (parseFloat(input.value) || 0) - (parseFloat(input.step) || 1);
        }
        fireChange(input);
      });
    }

    if (incBtn) {
      incBtn.addEventListener('click', function () {
        if (input.disabled) return;
        try { input.stepUp(); } catch (e) {
          input.value = (parseFloat(input.value) || 0) + (parseFloat(input.step) || 1);
        }
        fireChange(input);
      });
    }

    el.setAttribute('data-spinbutton-wired', 'true');
  }

  function fireChange(input) {
    var evt = document.createEvent('Event');
    evt.initEvent('change', true, true);
    input.dispatchEvent(evt);
  }

  return { init: init };
})();
