/**
 * ComboBox component JS — filterable dropdown with keyboard navigation.
 *
 * Usage:
 *   <div class="flm-combobox">
 *     <div class="flm-combobox-wrapper">
 *       <input class="flm-combobox-input" placeholder="Select...">
 *       <button class="flm-combobox-caret" data-icon="ChevronDown" aria-label="Toggle"></button>
 *     </div>
 *     <div class="flm-combobox-listbox">
 *       <div class="flm-combobox-option" data-value="a">Alpha</div>
 *       <div class="flm-combobox-option" data-value="b">Beta</div>
 *     </div>
 *   </div>
 *
 * Add data-multiselect on .flm-combobox for multi-select mode.
 */
var FluentLMComboBoxComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var combos = doc.querySelectorAll('.flm-combobox');
    for (var i = 0; i < combos.length; i++) {
      wireCombo(combos[i]);
    }
  }

  function wireCombo(el) {
    if (el.getAttribute('data-combobox-wired')) return;

    var input = el.querySelector('.flm-combobox-input');
    var caret = el.querySelector('.flm-combobox-caret');
    var listbox = el.querySelector('.flm-combobox-listbox');

    if (!input || !listbox) return;

    var multiselect = el.hasAttribute('data-multiselect');
    var highlighted = -1;

    function getOptions() {
      return listbox.querySelectorAll('.flm-combobox-option:not(.flm-combobox-option--disabled):not(.flm-combobox-option--hidden)');
    }

    function isOpen() {
      return listbox.classList.contains('flm-combobox-listbox--open');
    }

    function open() {
      listbox.classList.add('flm-combobox-listbox--open');
      highlighted = -1;
      flipIfNeeded();
    }

    function close() {
      listbox.classList.remove('flm-combobox-listbox--open', 'flm-combobox-listbox--above');
      highlighted = -1;
      clearHighlight();
    }

    function flipIfNeeded() {
      setTimeout(function () {
        var rect = listbox.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          listbox.classList.add('flm-combobox-listbox--above');
        } else {
          listbox.classList.remove('flm-combobox-listbox--above');
        }
      }, 0);
    }

    function clearHighlight() {
      var opts = listbox.querySelectorAll('.flm-combobox-option--highlighted');
      for (var i = 0; i < opts.length; i++) {
        opts[i].classList.remove('flm-combobox-option--highlighted');
      }
    }

    function setHighlight(idx) {
      clearHighlight();
      var opts = getOptions();
      if (idx >= 0 && idx < opts.length) {
        highlighted = idx;
        opts[idx].classList.add('flm-combobox-option--highlighted');
        opts[idx].scrollIntoView({ block: 'nearest' });
      }
    }

    function filterOptions() {
      var text = input.value.toLowerCase();
      var allOpts = listbox.querySelectorAll('.flm-combobox-option');
      for (var i = 0; i < allOpts.length; i++) {
        var optText = allOpts[i].textContent.toLowerCase();
        if (text === '' || optText.indexOf(text) !== -1) {
          allOpts[i].classList.remove('flm-combobox-option--hidden');
        } else {
          allOpts[i].classList.add('flm-combobox-option--hidden');
        }
      }
      highlighted = -1;
    }

    function selectOption(opt) {
      var value = opt.getAttribute('data-value') || opt.textContent;
      var text = opt.textContent;

      if (multiselect) {
        opt.classList.toggle('flm-combobox-option--selected');
        // Build comma-separated value
        var selected = listbox.querySelectorAll('.flm-combobox-option--selected');
        var values = [];
        for (var i = 0; i < selected.length; i++) {
          values.push(selected[i].textContent);
        }
        input.value = values.join(', ');
      } else {
        // Clear previous selection
        var prev = listbox.querySelectorAll('.flm-combobox-option--selected');
        for (var j = 0; j < prev.length; j++) {
          prev[j].classList.remove('flm-combobox-option--selected');
        }
        opt.classList.add('flm-combobox-option--selected');
        input.value = text;
        el.setAttribute('data-value', value);
        close();
      }

      // Fire change event
      var evt = document.createEvent('Event');
      evt.initEvent('change', true, true);
      input.dispatchEvent(evt);
    }

    // Input events
    input.addEventListener('focus', function () {
      if (!isOpen()) open();
    });

    input.addEventListener('input', function () {
      if (!isOpen()) open();
      filterOptions();
    });

    // Caret toggle
    if (caret) {
      caret.addEventListener('click', function (e) {
        e.stopPropagation();
        if (isOpen()) {
          close();
        } else {
          filterOptions();
          open();
          input.focus();
        }
      });
    }

    // Keyboard navigation
    input.addEventListener('keydown', function (e) {
      var opts = getOptions();
      var len = opts.length;

      if (e.key === 'ArrowDown' || e.keyCode === 40) {
        e.preventDefault();
        if (!isOpen()) { open(); filterOptions(); }
        setHighlight(highlighted < len - 1 ? highlighted + 1 : 0);
      } else if (e.key === 'ArrowUp' || e.keyCode === 38) {
        e.preventDefault();
        if (!isOpen()) { open(); filterOptions(); }
        setHighlight(highlighted > 0 ? highlighted - 1 : len - 1);
      } else if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        if (highlighted >= 0 && highlighted < len) {
          selectOption(opts[highlighted]);
        }
      } else if (e.key === 'Escape' || e.keyCode === 27) {
        close();
      }
    });

    // Option click
    listbox.addEventListener('click', function (e) {
      var opt = e.target.closest('.flm-combobox-option');
      if (opt && !opt.classList.contains('flm-combobox-option--disabled')) {
        selectOption(opt);
      }
    });

    // Click outside
    document.addEventListener('click', function (e) {
      if (!el.contains(e.target) && isOpen()) {
        close();
      }
    });

    el.setAttribute('data-combobox-wired', 'true');
  }

  return { init: init };
})();
