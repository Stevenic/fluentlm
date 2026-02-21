/**
 * Slider component JS — updates CSS variable for track fill and value display.
 */
var FluentLMSliderComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var sliders = doc.querySelectorAll('.flm-slider');
    for (var i = 0; i < sliders.length; i++) {
      wireSlider(sliders[i]);
    }
  }

  function wireSlider(el) {
    if (el.getAttribute('data-slider-wired')) return;

    var input = el.querySelector('.flm-slider-input');
    if (!input) return;

    var valueDisplay = el.querySelector('.flm-slider-value');

    function update() {
      var min = parseFloat(input.min) || 0;
      var max = parseFloat(input.max) || 100;
      var val = parseFloat(input.value) || 0;
      var pct = ((val - min) / (max - min)) * 100;
      input.style.setProperty('--flm-slider-fill', pct + '%');

      if (valueDisplay) {
        valueDisplay.textContent = input.value;
      }
    }

    input.addEventListener('input', update);
    input.addEventListener('change', update);

    // Set initial fill
    update();

    el.setAttribute('data-slider-wired', 'true');
  }

  return { init: init };
})();
