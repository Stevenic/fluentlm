/**
 * Tooltip component JS — shows tooltip on hover/focus of host elements.
 *
 * Usage: <span class="flm-tooltip-host" data-tooltip="Help text">Hover me</span>
 * Or: <span class="flm-tooltip-host" data-tooltip-id="my-tooltip">Hover me</span>
 *     <div id="my-tooltip" class="flm-tooltip">Rich tooltip content</div>
 */
var FluentLMTooltipComponent = (function () {
  'use strict';

  var activeTooltip = null;
  var showDelay = 300;

  function init(root) {
    var doc = root || document;

    var hosts = doc.querySelectorAll('.flm-tooltip-host, [data-tooltip]');
    for (var i = 0; i < hosts.length; i++) {
      wireHost(hosts[i]);
    }
  }

  function wireHost(host) {
    if (host.getAttribute('data-tooltip-wired')) return;

    var timer = null;

    host.addEventListener('mouseenter', function () {
      timer = setTimeout(function () { showForHost(host); }, showDelay);
    });

    host.addEventListener('mouseleave', function () {
      clearTimeout(timer);
      hideActive();
    });

    host.addEventListener('focus', function () {
      timer = setTimeout(function () { showForHost(host); }, showDelay);
    });

    host.addEventListener('blur', function () {
      clearTimeout(timer);
      hideActive();
    });

    host.setAttribute('data-tooltip-wired', 'true');
  }

  function showForHost(host) {
    hideActive();

    var tooltip;
    var tooltipId = host.getAttribute('data-tooltip-id');

    if (tooltipId) {
      tooltip = document.getElementById(tooltipId);
    } else {
      // Create a dynamic tooltip from data-tooltip text
      var text = host.getAttribute('data-tooltip');
      if (!text) return;

      tooltip = document.createElement('div');
      tooltip.className = 'flm-tooltip';
      tooltip.textContent = text;
      tooltip._dynamic = true;
      document.body.appendChild(tooltip);
    }

    if (!tooltip) return;

    // Position below host
    var rect = host.getBoundingClientRect();
    var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    tooltip.style.position = 'absolute';
    tooltip.style.left = rect.left + scrollX + 'px';
    tooltip.style.top = (rect.bottom + scrollY + 4) + 'px';
    tooltip.classList.add('flm-tooltip--visible');

    activeTooltip = tooltip;

    // Flip if off-screen
    setTimeout(function () {
      var tRect = tooltip.getBoundingClientRect();
      if (tRect.bottom > window.innerHeight) {
        tooltip.style.top = (rect.top + scrollY - tRect.height - 4) + 'px';
      }
      if (tRect.right > window.innerWidth) {
        tooltip.style.left = (rect.right + scrollX - tRect.width) + 'px';
      }
    }, 0);
  }

  function hideActive() {
    if (!activeTooltip) return;
    activeTooltip.classList.remove('flm-tooltip--visible');
    if (activeTooltip._dynamic) {
      activeTooltip.parentNode.removeChild(activeTooltip);
    }
    activeTooltip = null;
  }

  return { init: init };
})();
