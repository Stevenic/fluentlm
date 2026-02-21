/**
 * TeachingBubble component JS — positioned inverted callout.
 *
 * Usage:
 *   <button data-teachingbubble-toggle="tb1">Learn more</button>
 *   <div class="flm-teachingbubble" id="tb1">
 *     <div class="flm-teachingbubble-beak"></div>
 *     <div class="flm-teachingbubble-header">
 *       <h3 class="flm-teachingbubble-headline">Title</h3>
 *       <button class="flm-teachingbubble-close" data-icon="Cancel" aria-label="Close"></button>
 *     </div>
 *     <div class="flm-teachingbubble-body">Body text</div>
 *     <div class="flm-teachingbubble-footer">
 *       <button class="flm-button">Got it</button>
 *     </div>
 *   </div>
 */
var FluentLMTeachingBubbleComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var triggers = doc.querySelectorAll('[data-teachingbubble-toggle]');
    for (var i = 0; i < triggers.length; i++) {
      // Skip coachmarks — they wire their own click handler
      if (triggers[i].classList.contains('flm-coachmark')) continue;
      wireTrigger(triggers[i]);
    }

    // Wire close buttons
    var closeBtns = doc.querySelectorAll('.flm-teachingbubble-close');
    for (var j = 0; j < closeBtns.length; j++) {
      wireClose(closeBtns[j]);
    }

    // Wire footer buttons that should dismiss
    var footerBtns = doc.querySelectorAll('.flm-teachingbubble-footer .flm-button');
    for (var k = 0; k < footerBtns.length; k++) {
      wireFooterBtn(footerBtns[k]);
    }
  }

  function wireTrigger(btn) {
    if (btn.getAttribute('data-teachingbubble-wired')) return;

    btn.addEventListener('click', function (e) {
      var id = btn.getAttribute('data-teachingbubble-toggle');
      var bubble = document.getElementById(id);
      if (!bubble) return;

      if (bubble.classList.contains('flm-teachingbubble--visible')) {
        hide(bubble);
      } else {
        show(bubble, btn);
      }
      e.stopPropagation();
    });

    btn.setAttribute('data-teachingbubble-wired', 'true');
  }

  function wireClose(btn) {
    if (btn.getAttribute('data-teachingbubble-close-wired')) return;

    btn.addEventListener('click', function () {
      var bubble = btn.closest('.flm-teachingbubble');
      if (bubble) hide(bubble);
    });

    btn.setAttribute('data-teachingbubble-close-wired', 'true');
  }

  function wireFooterBtn(btn) {
    if (btn.getAttribute('data-teachingbubble-footer-wired')) return;

    btn.addEventListener('click', function () {
      var bubble = btn.closest('.flm-teachingbubble');
      if (bubble) hide(bubble);
    });

    btn.setAttribute('data-teachingbubble-footer-wired', 'true');
  }

  function show(bubble, target) {
    var rect = target.getBoundingClientRect();
    var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Account for positioned offset parent so absolute coords are correct
    var offsetX = 0;
    var offsetY = 0;
    var offsetParent = bubble.offsetParent;
    if (offsetParent && offsetParent !== document.body && offsetParent !== document.documentElement) {
      var parentRect = offsetParent.getBoundingClientRect();
      offsetX = parentRect.left + scrollX;
      offsetY = parentRect.top + scrollY;
    }

    bubble.style.position = 'absolute';
    bubble.style.left = (rect.left + scrollX - offsetX) + 'px';
    bubble.style.top = (rect.bottom + scrollY - offsetY + 8) + 'px';

    bubble.classList.add('flm-teachingbubble--visible');
    bubble.classList.remove('flm-teachingbubble--above');

    // Position beak to point at target center
    setTimeout(function () {
      var bRect = bubble.getBoundingClientRect();
      var beak = bubble.querySelector('.flm-teachingbubble-beak');
      if (beak) {
        var targetCenterX = rect.left + rect.width / 2;
        var beakLeft = targetCenterX - bRect.left - 8; // 8 = half of 16px beak
        beakLeft = Math.max(8, Math.min(beakLeft, bRect.width - 24));
        beak.style.left = beakLeft + 'px';
      }

      // Flip above if off-screen
      if (bRect.bottom > window.innerHeight) {
        bubble.classList.add('flm-teachingbubble--above');
        bubble.style.top = (rect.top + scrollY - offsetY - bRect.height - 8) + 'px';
      }
    }, 0);

    // Click outside to dismiss
    var outsideHandler = function (e) {
      if (!bubble.contains(e.target) && !target.contains(e.target)) {
        hide(bubble);
        document.removeEventListener('click', outsideHandler);
      }
    };
    setTimeout(function () {
      document.addEventListener('click', outsideHandler);
    }, 0);
    bubble._outsideHandler = outsideHandler;
  }

  function hide(bubble) {
    bubble.classList.remove('flm-teachingbubble--visible', 'flm-teachingbubble--above');
    if (bubble._outsideHandler) {
      document.removeEventListener('click', bubble._outsideHandler);
      delete bubble._outsideHandler;
    }
  }

  return { init: init, show: show, hide: hide };
})();
