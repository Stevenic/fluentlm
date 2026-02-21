/**
 * SwatchColorPicker component JS — manages selection state on color swatches.
 */
var FluentLMSwatchColorPickerComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var pickers = doc.querySelectorAll('.flm-swatchcolorpicker');
    for (var i = 0; i < pickers.length; i++) {
      wirePicker(pickers[i]);
    }
  }

  function wirePicker(picker) {
    if (picker.getAttribute('data-swatchcolorpicker-wired')) return;

    var cells = picker.querySelectorAll('.flm-swatchcolorpicker-cell');
    for (var i = 0; i < cells.length; i++) {
      wireCell(picker, cells[i]);
    }

    picker.setAttribute('data-swatchcolorpicker-wired', 'true');
  }

  function wireCell(picker, cell) {
    cell.addEventListener('click', function () {
      if (cell.disabled || cell.classList.contains('flm-swatchcolorpicker-cell--disabled')) return;

      // Clear previous selection
      var prev = picker.querySelector('.flm-swatchcolorpicker-cell--selected');
      if (prev) {
        prev.classList.remove('flm-swatchcolorpicker-cell--selected');
      }

      // Select this cell
      cell.classList.add('flm-swatchcolorpicker-cell--selected');

      // Store selected color on root
      var color = cell.getAttribute('data-color') || cell.style.backgroundColor || '';
      picker.setAttribute('data-selected', 'true');
      picker.setAttribute('data-selected-color', color);
    });
  }

  return { init: init };
})();
