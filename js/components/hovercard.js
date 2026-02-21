/**
 * HoverCard component JS — two-phase hover: compact after 500ms, expanded after 1500ms.
 *
 * Usage:
 *   <span class="flm-hovercard-host" data-hovercard-id="hc1">Hover over me</span>
 *   <div class="flm-hovercard" id="hc1">
 *     <div class="flm-hovercard-compact">Compact content</div>
 *     <div class="flm-hovercard-expanded">Expanded content</div>
 *   </div>
 */
var FluentLMHoverCardComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var hosts = doc.querySelectorAll('[data-hovercard-id]');
    for (var i = 0; i < hosts.length; i++) {
      wireHost(hosts[i]);
    }
  }

  function wireHost(host) {
    if (host.getAttribute('data-hovercard-wired')) return;

    var showTimer = null;
    var expandTimer = null;
    var card = null;

    function getCard() {
      if (!card) {
        var id = host.getAttribute('data-hovercard-id');
        card = document.getElementById(id);
      }
      return card;
    }

    host.addEventListener('mouseenter', function () {
      showTimer = setTimeout(function () {
        showCompact(getCard(), host);

        expandTimer = setTimeout(function () {
          showExpanded(getCard());
        }, 1000); // 1000ms after compact = 1500ms total
      }, 500);
    });

    host.addEventListener('mouseleave', function () {
      clearTimeout(showTimer);
      clearTimeout(expandTimer);

      // Delay hide to allow mouse to move to card
      var c = getCard();
      if (c) {
        setTimeout(function () {
          if (!c._hovered) {
            hide(c);
          }
        }, 100);
      }
    });

    // Keep card open while mouse is over it
    var hoverCardEl = getCard();
    if (hoverCardEl) {
      hoverCardEl.addEventListener('mouseenter', function () {
        hoverCardEl._hovered = true;
      });

      hoverCardEl.addEventListener('mouseleave', function () {
        hoverCardEl._hovered = false;
        clearTimeout(expandTimer);
        hide(hoverCardEl);
      });
    }

    host.setAttribute('data-hovercard-wired', 'true');
  }

  function showCompact(card, host) {
    if (!card) return;

    var rect = host.getBoundingClientRect();
    var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    card.style.position = 'absolute';
    card.style.left = rect.left + scrollX + 'px';
    card.style.top = (rect.bottom + scrollY + 4) + 'px';

    card.classList.add('flm-hovercard--visible');

    // Flip if off-screen
    setTimeout(function () {
      var cRect = card.getBoundingClientRect();
      if (cRect.bottom > window.innerHeight) {
        card.style.top = (rect.top + scrollY - cRect.height - 4) + 'px';
      }
      if (cRect.right > window.innerWidth) {
        card.style.left = (rect.right + scrollX - cRect.width) + 'px';
      }
    }, 0);
  }

  function showExpanded(card) {
    if (!card) return;
    var expanded = card.querySelector('.flm-hovercard-expanded');
    if (expanded) {
      expanded.classList.add('flm-hovercard-expanded--visible');
    }
  }

  function hide(card) {
    if (!card) return;
    card.classList.remove('flm-hovercard--visible');
    var expanded = card.querySelector('.flm-hovercard-expanded');
    if (expanded) {
      expanded.classList.remove('flm-hovercard-expanded--visible');
    }
  }

  return { init: init };
})();
