/**
 * TagPicker / PeoplePicker component JS — multi-select input with chip/tag UI.
 *
 * Usage:
 *   <div class="flm-tagpicker">
 *     <label class="flm-label">Tags</label>
 *     <div class="flm-tagpicker-well">
 *       <input class="flm-tagpicker-input" placeholder="Add tags…">
 *     </div>
 *     <div class="flm-tagpicker-listbox">
 *       <div class="flm-tagpicker-option" data-value="a">Alpha</div>
 *       <div class="flm-tagpicker-option" data-value="b">Beta</div>
 *     </div>
 *   </div>
 *
 * PeoplePicker variant: add flm-tagpicker--people on root, use
 *   data-initials="JD" and data-secondary="Engineer" on options.
 *
 * Attributes:
 *   data-max-tags="N" — limits number of selected tags.
 *   data-selected-values — CSV of selected values (auto-maintained).
 */
var FluentLMTagPickerComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;
    var pickers = doc.querySelectorAll('.flm-tagpicker');
    for (var i = 0; i < pickers.length; i++) {
      wirePicker(pickers[i]);
    }
  }

  function wirePicker(el) {
    if (el.getAttribute('data-tagpicker-wired')) return;
    if (el.classList.contains('flm-tagpicker--disabled')) return;

    var well = el.querySelector('.flm-tagpicker-well');
    var input = el.querySelector('.flm-tagpicker-input');
    var listbox = el.querySelector('.flm-tagpicker-listbox');

    if (!well || !input || !listbox) return;

    var isPeople = el.classList.contains('flm-tagpicker--people');
    var highlighted = -1;

    function getVisibleOptions() {
      return listbox.querySelectorAll('.flm-tagpicker-option:not(.flm-tagpicker-option--selected):not(.flm-tagpicker-option--hidden)');
    }

    function isOpen() {
      return listbox.classList.contains('flm-tagpicker-listbox--open');
    }

    function open() {
      listbox.classList.add('flm-tagpicker-listbox--open');
      highlighted = -1;
      flipIfNeeded();
    }

    function close() {
      listbox.classList.remove('flm-tagpicker-listbox--open', 'flm-tagpicker-listbox--above');
      highlighted = -1;
      clearHighlight();
    }

    function flipIfNeeded() {
      setTimeout(function () {
        var rect = listbox.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          listbox.classList.add('flm-tagpicker-listbox--above');
        } else {
          listbox.classList.remove('flm-tagpicker-listbox--above');
        }
      }, 0);
    }

    function clearHighlight() {
      var opts = listbox.querySelectorAll('.flm-tagpicker-option--highlighted');
      for (var i = 0; i < opts.length; i++) {
        opts[i].classList.remove('flm-tagpicker-option--highlighted');
      }
    }

    function setHighlight(idx) {
      clearHighlight();
      var opts = getVisibleOptions();
      if (idx >= 0 && idx < opts.length) {
        highlighted = idx;
        opts[idx].classList.add('flm-tagpicker-option--highlighted');
        opts[idx].scrollIntoView({ block: 'nearest' });
      }
    }

    function filterOptions() {
      var text = input.value.toLowerCase();
      var allOpts = listbox.querySelectorAll('.flm-tagpicker-option');
      for (var i = 0; i < allOpts.length; i++) {
        var optText = allOpts[i].textContent.toLowerCase();
        if (text === '' || optText.indexOf(text) !== -1) {
          allOpts[i].classList.remove('flm-tagpicker-option--hidden');
        } else {
          allOpts[i].classList.add('flm-tagpicker-option--hidden');
        }
      }
      highlighted = -1;
    }

    function getMaxTags() {
      var max = el.getAttribute('data-max-tags');
      return max ? parseInt(max, 10) : 0;
    }

    function getChips() {
      return well.querySelectorAll('.flm-tagpicker-chip');
    }

    function updateSelectedValues() {
      var chips = getChips();
      var values = [];
      for (var i = 0; i < chips.length; i++) {
        values.push(chips[i].getAttribute('data-value'));
      }
      el.setAttribute('data-selected-values', values.join(','));

      // Fire change event
      var evt = document.createEvent('Event');
      evt.initEvent('change', true, true);
      el.dispatchEvent(evt);
    }

    function addChip(opt) {
      var max = getMaxTags();
      if (max > 0 && getChips().length >= max) return;

      var value = opt.getAttribute('data-value') || opt.textContent.trim();
      var text = opt.getAttribute('data-value') ? opt.textContent.trim() : value;

      // For people picker, try to get just the name
      var nameEl = opt.querySelector('.flm-tagpicker-option-name');
      if (nameEl) {
        text = nameEl.textContent.trim();
      }

      var chip = document.createElement('span');
      chip.className = 'flm-tagpicker-chip';
      chip.setAttribute('data-value', value);

      // People variant: add small coin
      if (isPeople) {
        var initials = opt.getAttribute('data-initials') || '';
        if (initials) {
          var coin = document.createElement('span');
          coin.className = 'flm-tagpicker-chip-coin';
          coin.textContent = initials;
          chip.appendChild(coin);
        }
      }

      var textSpan = document.createElement('span');
      textSpan.className = 'flm-tagpicker-chip-text';
      textSpan.textContent = text;
      chip.appendChild(textSpan);

      var removeBtn = document.createElement('button');
      removeBtn.className = 'flm-tagpicker-chip-remove';
      removeBtn.setAttribute('aria-label', 'Remove ' + text);
      removeBtn.type = 'button';
      removeBtn.innerHTML = '<svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg"><path d="M1.17.46L4 3.3 6.83.46a.5.5 0 0 1 .71.71L4.7 4l2.84 2.83a.5.5 0 0 1-.71.71L4 4.7 1.17 7.54a.5.5 0 0 1-.71-.71L3.3 4 .46 1.17A.5.5 0 0 1 1.17.46z"/></svg>';
      chip.appendChild(removeBtn);

      // Insert chip before input
      well.insertBefore(chip, input);

      // Mark option as selected
      opt.classList.add('flm-tagpicker-option--selected');

      // Wire remove button
      removeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        removeChip(chip, opt);
      });

      input.value = '';
      filterOptions();
      updateSelectedValues();
    }

    function removeChip(chip, opt) {
      chip.parentNode.removeChild(chip);
      opt.classList.remove('flm-tagpicker-option--selected');
      updateSelectedValues();
      input.focus();
    }

    // Click on well focuses input
    well.addEventListener('click', function () {
      input.focus();
    });

    // Input events
    input.addEventListener('focus', function () {
      if (!isOpen()) {
        filterOptions();
        open();
      }
    });

    input.addEventListener('input', function () {
      if (!isOpen()) open();
      filterOptions();
    });

    // Keyboard navigation
    input.addEventListener('keydown', function (e) {
      var opts = getVisibleOptions();
      var len = opts.length;

      if (e.key === 'ArrowDown' || e.keyCode === 40) {
        e.preventDefault();
        if (!isOpen()) { filterOptions(); open(); }
        setHighlight(highlighted < len - 1 ? highlighted + 1 : 0);
      } else if (e.key === 'ArrowUp' || e.keyCode === 38) {
        e.preventDefault();
        if (!isOpen()) { filterOptions(); open(); }
        setHighlight(highlighted > 0 ? highlighted - 1 : len - 1);
      } else if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        if (highlighted >= 0 && highlighted < len) {
          addChip(opts[highlighted]);
          highlighted = -1;
        }
      } else if (e.key === 'Escape' || e.keyCode === 27) {
        close();
      } else if ((e.key === 'Backspace' || e.keyCode === 8) && input.value === '') {
        // Remove last chip on backspace with empty input
        var chips = getChips();
        if (chips.length > 0) {
          var lastChip = chips[chips.length - 1];
          var chipValue = lastChip.getAttribute('data-value');
          // Find corresponding option
          var allOpts = listbox.querySelectorAll('.flm-tagpicker-option');
          for (var i = 0; i < allOpts.length; i++) {
            var optVal = allOpts[i].getAttribute('data-value') || allOpts[i].textContent.trim();
            if (optVal === chipValue) {
              removeChip(lastChip, allOpts[i]);
              break;
            }
          }
        }
      }
    });

    // Option click
    listbox.addEventListener('click', function (e) {
      var opt = e.target.closest('.flm-tagpicker-option');
      if (opt && !opt.classList.contains('flm-tagpicker-option--selected')) {
        addChip(opt);
        input.focus();
      }
    });

    // Click outside
    document.addEventListener('click', function (e) {
      if (!el.contains(e.target) && isOpen()) {
        close();
      }
    });

    el.setAttribute('data-tagpicker-wired', 'true');
  }

  return { init: init };
})();
