/**
 * Dropdown component JS — custom dropdown with keyboard navigation.
 *
 * Usage:
 *   <div class="flm-dropdown">
 *     <label class="flm-label" for="dd1">Country</label>
 *     <button class="flm-dropdown-trigger" id="dd1">
 *       <span class="flm-dropdown-title flm-dropdown-title--placeholder">Select…</span>
 *       <span class="flm-dropdown-caret" data-icon="ChevronDown"></span>
 *     </button>
 *     <div class="flm-dropdown-listbox">
 *       <div class="flm-dropdown-option" data-value="us">United States</div>
 *       <div class="flm-dropdown-option" data-value="gb">United Kingdom</div>
 *     </div>
 *   </div>
 *
 * Sets data-value on the root .flm-dropdown when an option is selected.
 * A hidden <input class="flm-dropdown-value"> is updated if present.
 */
var FluentLMDropdownComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var dropdowns = doc.querySelectorAll('.flm-dropdown');
    for (var i = 0; i < dropdowns.length; i++) {
      wireDropdown(dropdowns[i]);
    }
  }

  function wireDropdown(el) {
    if (el.getAttribute('data-dropdown-wired')) return;
    if (el.classList.contains('flm-dropdown--disabled')) return;

    var trigger = el.querySelector('.flm-dropdown-trigger');
    var listbox = el.querySelector('.flm-dropdown-listbox');

    if (!trigger || !listbox) return;

    var titleEl = trigger.querySelector('.flm-dropdown-title');
    var hiddenInput = el.querySelector('.flm-dropdown-value');
    var placeholder = titleEl ? titleEl.textContent : '';
    var highlighted = -1;

    function getOptions() {
      return listbox.querySelectorAll('.flm-dropdown-option:not(.flm-dropdown-option--disabled)');
    }

    function isOpen() {
      return listbox.classList.contains('flm-dropdown-listbox--open');
    }

    function open() {
      listbox.classList.add('flm-dropdown-listbox--open');
      highlighted = -1;

      // Highlight current selection
      var opts = getOptions();
      for (var i = 0; i < opts.length; i++) {
        if (opts[i].classList.contains('flm-dropdown-option--selected')) {
          highlighted = i;
          opts[i].classList.add('flm-dropdown-option--highlighted');
          opts[i].scrollIntoView({ block: 'nearest' });
          break;
        }
      }

      flipIfNeeded();
    }

    function close() {
      listbox.classList.remove('flm-dropdown-listbox--open', 'flm-dropdown-listbox--above');
      highlighted = -1;
      clearHighlight();
    }

    function flipIfNeeded() {
      setTimeout(function () {
        var rect = listbox.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          listbox.classList.add('flm-dropdown-listbox--above');
        } else {
          listbox.classList.remove('flm-dropdown-listbox--above');
        }
      }, 0);
    }

    function clearHighlight() {
      var opts = listbox.querySelectorAll('.flm-dropdown-option--highlighted');
      for (var i = 0; i < opts.length; i++) {
        opts[i].classList.remove('flm-dropdown-option--highlighted');
      }
    }

    function setHighlight(idx) {
      clearHighlight();
      var opts = getOptions();
      if (idx >= 0 && idx < opts.length) {
        highlighted = idx;
        opts[idx].classList.add('flm-dropdown-option--highlighted');
        opts[idx].scrollIntoView({ block: 'nearest' });
      }
    }

    function selectOption(opt) {
      // Clear previous
      var prev = listbox.querySelectorAll('.flm-dropdown-option--selected');
      for (var i = 0; i < prev.length; i++) {
        prev[i].classList.remove('flm-dropdown-option--selected');
      }

      opt.classList.add('flm-dropdown-option--selected');

      var value = opt.getAttribute('data-value') || opt.textContent.trim();
      var text = opt.textContent.trim();

      if (titleEl) {
        titleEl.textContent = text;
        titleEl.classList.remove('flm-dropdown-title--placeholder');
      }

      el.setAttribute('data-value', value);

      if (hiddenInput) {
        hiddenInput.value = value;
      }

      close();

      // Fire change event
      var evt = document.createEvent('Event');
      evt.initEvent('change', true, true);
      el.dispatchEvent(evt);
    }

    // Toggle on click
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isOpen()) {
        close();
      } else {
        open();
      }
    });

    // Keyboard navigation
    trigger.addEventListener('keydown', function (e) {
      var opts = getOptions();
      var len = opts.length;

      if (e.key === 'ArrowDown' || e.keyCode === 40) {
        e.preventDefault();
        if (!isOpen()) open();
        setHighlight(highlighted < len - 1 ? highlighted + 1 : 0);
      } else if (e.key === 'ArrowUp' || e.keyCode === 38) {
        e.preventDefault();
        if (!isOpen()) open();
        setHighlight(highlighted > 0 ? highlighted - 1 : len - 1);
      } else if (e.key === 'Enter' || e.keyCode === 13 || e.key === ' ' || e.keyCode === 32) {
        e.preventDefault();
        if (!isOpen()) {
          open();
        } else if (highlighted >= 0 && highlighted < len) {
          selectOption(opts[highlighted]);
        }
      } else if (e.key === 'Escape' || e.keyCode === 27) {
        close();
      }
    });

    // Option click
    listbox.addEventListener('click', function (e) {
      var opt = e.target.closest('.flm-dropdown-option');
      if (opt && !opt.classList.contains('flm-dropdown-option--disabled')) {
        selectOption(opt);
      }
    });

    // Click outside
    document.addEventListener('click', function (e) {
      if (!el.contains(e.target) && isOpen()) {
        close();
      }
    });

    el.setAttribute('data-dropdown-wired', 'true');
  }

  return { init: init };
})();
