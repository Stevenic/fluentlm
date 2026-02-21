/**
 * DatePicker component JS — generates calendar grid and handles date selection.
 *
 * Usage:
 *   <div class="flm-datepicker">
 *     <label class="flm-label" for="dp1">Date</label>
 *     <div class="flm-datepicker-wrapper">
 *       <input class="flm-datepicker-input" id="dp1" placeholder="MM/DD/YYYY">
 *       <button class="flm-datepicker-icon" data-icon="Calendar" aria-label="Open calendar"></button>
 *     </div>
 *   </div>
 *
 * Attributes on .flm-datepicker:
 *   data-min-date="MM/DD/YYYY"
 *   data-max-date="MM/DD/YYYY"
 */
var FluentLMDatePickerComponent = (function () {
  'use strict';

  var DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  var MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function init(root) {
    var doc = root || document;

    var pickers = doc.querySelectorAll('.flm-datepicker');
    for (var i = 0; i < pickers.length; i++) {
      wirePicker(pickers[i]);
    }
  }

  function wirePicker(el) {
    if (el.getAttribute('data-datepicker-wired')) return;

    var input = el.querySelector('.flm-datepicker-input');
    var iconBtn = el.querySelector('.flm-datepicker-icon');
    if (!input) return;

    var callout = null;
    var viewYear, viewMonth, selectedDate;

    // Parse min/max dates
    var minDate = parseDate(el.getAttribute('data-min-date'));
    var maxDate = parseDate(el.getAttribute('data-max-date'));

    function parseDate(str) {
      if (!str) return null;
      var parts = str.split('/');
      if (parts.length !== 3) return null;
      return new Date(parseInt(parts[2], 10), parseInt(parts[0], 10) - 1, parseInt(parts[1], 10));
    }

    function formatDate(d) {
      var mm = (d.getMonth() + 1);
      var dd = d.getDate();
      var yyyy = d.getFullYear();
      return (mm < 10 ? '0' : '') + mm + '/' + (dd < 10 ? '0' : '') + dd + '/' + yyyy;
    }

    function ensureCallout() {
      if (callout) return callout;

      callout = document.createElement('div');
      callout.className = 'flm-datepicker-callout';
      el.appendChild(callout);
      return callout;
    }

    function isOpen() {
      return callout && callout.classList.contains('flm-datepicker-callout--open');
    }

    function open() {
      document.dispatchEvent(new CustomEvent('flm-dismiss-pickers', { detail: { source: el } }));
      ensureCallout();
      var today = new Date();
      viewYear = selectedDate ? selectedDate.getFullYear() : today.getFullYear();
      viewMonth = selectedDate ? selectedDate.getMonth() : today.getMonth();
      renderCalendar();
      callout.classList.add('flm-datepicker-callout--open');
      flipIfNeeded();
    }

    function close() {
      if (callout) {
        callout.classList.remove('flm-datepicker-callout--open', 'flm-datepicker-callout--above');
      }
    }

    function flipIfNeeded() {
      setTimeout(function () {
        if (!callout) return;
        var rect = callout.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          callout.classList.add('flm-datepicker-callout--above');
        } else {
          callout.classList.remove('flm-datepicker-callout--above');
        }
      }, 0);
    }

    function renderCalendar() {
      var html = '';

      // Navigation
      html += '<div class="flm-datepicker-nav">';
      html += '<button class="flm-datepicker-nav-btn flm-datepicker-prev" data-icon="ChevronLeft" aria-label="Previous month"></button>';
      html += '<span class="flm-datepicker-month">' + MONTHS[viewMonth] + ' ' + viewYear + '</span>';
      html += '<button class="flm-datepicker-nav-btn flm-datepicker-next" data-icon="ChevronRight" aria-label="Next month"></button>';
      html += '</div>';

      // Weekday headers
      html += '<div class="flm-datepicker-weekdays">';
      for (var d = 0; d < 7; d++) {
        html += '<span class="flm-datepicker-weekday">' + DAYS[d] + '</span>';
      }
      html += '</div>';

      // Calendar grid (42 cells)
      html += '<div class="flm-datepicker-grid">';

      var firstDay = new Date(viewYear, viewMonth, 1).getDay();
      var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      var daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
      var today = new Date();
      today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      var cellDate;
      for (var i = 0; i < 42; i++) {
        var dayNum;
        var isOutside = false;
        var cellYear = viewYear;
        var cellMonth = viewMonth;

        if (i < firstDay) {
          // Previous month
          dayNum = daysInPrev - firstDay + i + 1;
          isOutside = true;
          cellMonth = viewMonth - 1;
          if (cellMonth < 0) { cellMonth = 11; cellYear--; }
        } else if (i - firstDay >= daysInMonth) {
          // Next month
          dayNum = i - firstDay - daysInMonth + 1;
          isOutside = true;
          cellMonth = viewMonth + 1;
          if (cellMonth > 11) { cellMonth = 0; cellYear++; }
        } else {
          dayNum = i - firstDay + 1;
        }

        cellDate = new Date(cellYear, cellMonth, dayNum);

        var classes = 'flm-datepicker-day';
        if (isOutside) classes += ' flm-datepicker-day--outside';
        if (cellDate.getTime() === today.getTime()) classes += ' flm-datepicker-day--today';
        if (selectedDate && cellDate.getTime() === selectedDate.getTime()) classes += ' flm-datepicker-day--selected';

        var disabled = false;
        if (minDate && cellDate < minDate) disabled = true;
        if (maxDate && cellDate > maxDate) disabled = true;
        if (disabled) classes += ' flm-datepicker-day--disabled';

        html += '<button class="' + classes + '" data-date="' + cellYear + '-' + cellMonth + '-' + dayNum + '"' +
                (disabled ? ' disabled' : '') + '>' + dayNum + '</button>';
      }

      html += '</div>';
      callout.innerHTML = html;

      // Wire navigation buttons
      var prevBtn = callout.querySelector('.flm-datepicker-prev');
      var nextBtn = callout.querySelector('.flm-datepicker-next');

      if (prevBtn) {
        // Disable prev button if at min date boundary
        if (minDate && viewYear === minDate.getFullYear() && viewMonth === minDate.getMonth()) {
          prevBtn.disabled = true;
        }
        prevBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          var newMonth = viewMonth - 1;
          var newYear = viewYear;
          if (newMonth < 0) { newMonth = 11; newYear--; }
          // Don't navigate before the month containing minDate
          if (minDate) {
            var minMonth = minDate.getFullYear() * 12 + minDate.getMonth();
            var targetMonth = newYear * 12 + newMonth;
            if (targetMonth < minMonth) return;
          }
          viewMonth = newMonth;
          viewYear = newYear;
          renderCalendar();
          if (typeof FluentLMIconComponent !== 'undefined') {
            FluentLMIconComponent.init(callout);
          }
        });
      }
      if (nextBtn) {
        // Disable next button if at max date boundary
        if (maxDate && viewYear === maxDate.getFullYear() && viewMonth === maxDate.getMonth()) {
          nextBtn.disabled = true;
        }
        nextBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          var newMonth = viewMonth + 1;
          var newYear = viewYear;
          if (newMonth > 11) { newMonth = 0; newYear++; }
          // Don't navigate past the month containing maxDate
          if (maxDate) {
            var maxMonth = maxDate.getFullYear() * 12 + maxDate.getMonth();
            var targetMonth = newYear * 12 + newMonth;
            if (targetMonth > maxMonth) return;
          }
          viewMonth = newMonth;
          viewYear = newYear;
          renderCalendar();
          if (typeof FluentLMIconComponent !== 'undefined') {
            FluentLMIconComponent.init(callout);
          }
        });
      }

      // Wire day clicks
      var days = callout.querySelectorAll('.flm-datepicker-day');
      for (var j = 0; j < days.length; j++) {
        days[j].addEventListener('click', function (e) {
          e.stopPropagation();
          var parts = this.getAttribute('data-date').split('-');
          selectedDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10), parseInt(parts[2], 10));
          input.value = formatDate(selectedDate);
          close();

          // Fire change event
          var evt = document.createEvent('Event');
          evt.initEvent('change', true, true);
          input.dispatchEvent(evt);
        });
      }

      // Init icons for nav buttons
      if (typeof FluentLMIconComponent !== 'undefined') {
        FluentLMIconComponent.init(callout);
      }
    }

    // Toggle on icon button click
    if (iconBtn) {
      iconBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (isOpen()) {
          close();
        } else {
          open();
        }
      });
    }

    // Open on input focus
    input.addEventListener('focus', function () {
      if (!isOpen()) open();
    });

    // Click outside to dismiss
    document.addEventListener('click', function (e) {
      if (!el.contains(e.target) && isOpen()) {
        close();
      }
    });

    // Keyboard: Escape closes
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        close();
      }
    });

    // Close when another picker opens
    document.addEventListener('flm-dismiss-pickers', function (e) {
      if (e.detail.source !== el && isOpen()) close();
    });

    el.setAttribute('data-datepicker-wired', 'true');
  }

  return { init: init };
})();
