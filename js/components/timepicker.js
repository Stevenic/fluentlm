/**
 * TimePicker component JS — scrollable time-slot dropdown with filtering.
 *
 * Usage:
 *   <div class="flm-timepicker" data-increment="30" data-use-12h data-min-time="09:00" data-max-time="17:00">
 *     <label class="flm-label" for="tp1">Time</label>
 *     <div class="flm-timepicker-wrapper">
 *       <input class="flm-timepicker-input" id="tp1" placeholder="Select a time…">
 *       <button class="flm-timepicker-icon" data-icon="Clock" aria-label="Open time picker"></button>
 *     </div>
 *   </div>
 *
 * Attributes on .flm-timepicker:
 *   data-increment="30"    — minute increment (default 30)
 *   data-use-12h           — 12-hour format with AM/PM (default 24h)
 *   data-min-time="09:00"  — earliest available time (HH:MM, 24h)
 *   data-max-time="17:00"  — latest available time (HH:MM, 24h)
 */
var FluentLMTimePickerComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;
    var pickers = doc.querySelectorAll('.flm-timepicker');
    for (var i = 0; i < pickers.length; i++) {
      wirePicker(pickers[i]);
    }
  }

  function wirePicker(el) {
    if (el.getAttribute('data-timepicker-wired')) return;

    var input = el.querySelector('.flm-timepicker-input');
    var iconBtn = el.querySelector('.flm-timepicker-icon');

    if (!input) return;

    // Configuration
    var increment = parseInt(el.getAttribute('data-increment'), 10) || 30;
    var use12h = el.hasAttribute('data-use-12h');
    var minTime = parseTime(el.getAttribute('data-min-time'));
    var maxTime = parseTime(el.getAttribute('data-max-time'));

    var highlighted = -1;

    // Create listbox
    var listbox = document.createElement('div');
    listbox.className = 'flm-timepicker-listbox';
    el.appendChild(listbox);

    // Generate options
    generateOptions();

    function parseTime(str) {
      if (!str) return null;
      var parts = str.split(':');
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }

    function padTwo(n) {
      return n < 10 ? '0' + n : '' + n;
    }

    function formatTime(totalMinutes) {
      var h = Math.floor(totalMinutes / 60) % 24;
      var m = totalMinutes % 60;
      if (use12h) {
        var period = h < 12 ? 'AM' : 'PM';
        var h12 = h % 12;
        if (h12 === 0) h12 = 12;
        return h12 + ':' + padTwo(m) + ' ' + period;
      }
      return padTwo(h) + ':' + padTwo(m);
    }

    function generateOptions() {
      listbox.innerHTML = '';
      for (var t = 0; t < 1440; t += increment) {
        if (minTime !== null && t < minTime) continue;
        if (maxTime !== null && t > maxTime) continue;
        var opt = document.createElement('div');
        opt.className = 'flm-timepicker-option';
        opt.setAttribute('data-value', padTwo(Math.floor(t / 60)) + ':' + padTwo(t % 60));
        opt.textContent = formatTime(t);
        listbox.appendChild(opt);
      }
    }

    function getOptions() {
      return listbox.querySelectorAll('.flm-timepicker-option:not(.flm-timepicker-option--hidden)');
    }

    function isOpen() {
      return listbox.classList.contains('flm-timepicker-listbox--open');
    }

    function open() {
      listbox.classList.add('flm-timepicker-listbox--open');
      highlighted = -1;
      flipIfNeeded();
      scrollToSelected();
    }

    function close() {
      listbox.classList.remove('flm-timepicker-listbox--open', 'flm-timepicker-listbox--above');
      highlighted = -1;
      clearHighlight();
    }

    function flipIfNeeded() {
      setTimeout(function () {
        var rect = listbox.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          listbox.classList.add('flm-timepicker-listbox--above');
        } else {
          listbox.classList.remove('flm-timepicker-listbox--above');
        }
      }, 0);
    }

    function scrollToSelected() {
      setTimeout(function () {
        // Scroll to selected option, or nearest-to-current-time option
        var selected = listbox.querySelector('.flm-timepicker-option--selected');
        if (selected) {
          selected.scrollIntoView({ block: 'nearest' });
          return;
        }
        // Find nearest to current time
        var now = new Date();
        var nowMinutes = now.getHours() * 60 + now.getMinutes();
        var opts = getOptions();
        var bestOpt = null;
        var bestDiff = Infinity;
        for (var i = 0; i < opts.length; i++) {
          var val = parseTime(opts[i].getAttribute('data-value'));
          var diff = Math.abs(val - nowMinutes);
          if (diff < bestDiff) {
            bestDiff = diff;
            bestOpt = opts[i];
          }
        }
        if (bestOpt) {
          bestOpt.scrollIntoView({ block: 'nearest' });
        }
      }, 0);
    }

    function clearHighlight() {
      var opts = listbox.querySelectorAll('.flm-timepicker-option--highlighted');
      for (var i = 0; i < opts.length; i++) {
        opts[i].classList.remove('flm-timepicker-option--highlighted');
      }
    }

    function setHighlight(idx) {
      clearHighlight();
      var opts = getOptions();
      if (idx >= 0 && idx < opts.length) {
        highlighted = idx;
        opts[idx].classList.add('flm-timepicker-option--highlighted');
        opts[idx].scrollIntoView({ block: 'nearest' });
      }
    }

    function filterOptions() {
      var text = input.value.toLowerCase();
      var allOpts = listbox.querySelectorAll('.flm-timepicker-option');
      for (var i = 0; i < allOpts.length; i++) {
        var optText = allOpts[i].textContent.toLowerCase();
        if (text === '' || optText.indexOf(text) !== -1) {
          allOpts[i].classList.remove('flm-timepicker-option--hidden');
        } else {
          allOpts[i].classList.add('flm-timepicker-option--hidden');
        }
      }
      highlighted = -1;
    }

    function selectOption(opt) {
      var value = opt.getAttribute('data-value');
      var text = opt.textContent;

      // Clear previous selection
      var prev = listbox.querySelectorAll('.flm-timepicker-option--selected');
      for (var j = 0; j < prev.length; j++) {
        prev[j].classList.remove('flm-timepicker-option--selected');
      }
      opt.classList.add('flm-timepicker-option--selected');
      input.value = text;
      el.setAttribute('data-value', value);
      close();

      // Reset filter so all options are visible next time
      filterOptions();

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

    // Icon toggle
    if (iconBtn) {
      iconBtn.addEventListener('click', function (e) {
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
      var opt = e.target.closest('.flm-timepicker-option');
      if (opt) {
        selectOption(opt);
      }
    });

    // Click outside
    document.addEventListener('click', function (e) {
      if (!el.contains(e.target) && isOpen()) {
        close();
      }
    });

    el.setAttribute('data-timepicker-wired', 'true');
  }

  return { init: init };
})();
