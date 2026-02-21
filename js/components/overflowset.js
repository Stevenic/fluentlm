/**
 * OverflowSet component JS — responsive container that hides items into
 * an overflow "..." menu.
 *
 * Usage:
 *   <div class="flm-overflowset">
 *     <div class="flm-overflowset-items">
 *       <button class="flm-overflowset-item" data-label="New" data-icon="Add">New</button>
 *       <button class="flm-overflowset-item" data-label="Edit" data-icon="Edit">Edit</button>
 *     </div>
 *     <button class="flm-overflowset-overflow" aria-label="More items">...</button>
 *     <div class="flm-overflowset-far">
 *       <button class="flm-overflowset-item" data-label="Settings">Settings</button>
 *     </div>
 *   </div>
 *
 * Attributes:
 *   data-overflow-order="N" on items — higher N overflows first.
 *   data-label — label shown in overflow menu.
 *   data-icon — icon name shown in overflow menu.
 */
var FluentLMOverflowSetComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;
    var sets = doc.querySelectorAll('.flm-overflowset');
    for (var i = 0; i < sets.length; i++) {
      wireSet(sets[i]);
    }
  }

  function wireSet(el) {
    if (el.getAttribute('data-overflowset-wired')) return;

    var itemsContainer = el.querySelector('.flm-overflowset-items');
    var overflowBtn = el.querySelector('.flm-overflowset-overflow');

    if (!itemsContainer) return;

    var menuEl = null;

    function getItems() {
      return itemsContainer.querySelectorAll('.flm-overflowset-item');
    }

    function recalculate() {
      var items = getItems();
      var i;

      // Show all items first to measure
      for (i = 0; i < items.length; i++) {
        items[i].classList.remove('flm-overflowset-item--hidden');
      }
      el.classList.remove('flm-overflowset--has-overflow');

      // Get available width
      var containerWidth = itemsContainer.offsetWidth;

      // Build array with overflow priority
      var itemData = [];
      for (i = 0; i < items.length; i++) {
        itemData.push({
          el: items[i],
          order: parseInt(items[i].getAttribute('data-overflow-order') || '0', 10),
          index: i,
          width: items[i].offsetWidth
        });
      }

      // Sort by overflow order descending (higher order overflows first), then by reverse DOM order
      itemData.sort(function (a, b) {
        if (b.order !== a.order) return b.order - a.order;
        return b.index - a.index;
      });

      // Measure total width
      var totalWidth = 0;
      var gap = 4; // matches var(--spacingS2) = 4px
      for (i = 0; i < items.length; i++) {
        totalWidth += items[i].offsetWidth + (i > 0 ? gap : 0);
      }

      // Account for overflow button width if we might need it
      var overflowBtnWidth = overflowBtn ? 36 : 0; // 32px + gap

      // Hide items until they fit
      var hiddenItems = [];
      var idx = 0;
      while (totalWidth > containerWidth && idx < itemData.length) {
        var item = itemData[idx];
        item.el.classList.add('flm-overflowset-item--hidden');
        totalWidth -= item.width + gap;
        // First time we overflow, account for the overflow button
        if (hiddenItems.length === 0) {
          totalWidth += overflowBtnWidth;
        }
        hiddenItems.push(item);
        idx++;
      }

      if (hiddenItems.length > 0) {
        el.classList.add('flm-overflowset--has-overflow');
      }
    }

    function buildOverflowMenu() {
      // Clean up existing menu
      if (menuEl) {
        if (menuEl.classList.contains('flm-contextmenu--visible')) {
          hideMenu();
          return;
        }
        menuEl.parentNode.removeChild(menuEl);
        menuEl = null;
      }

      var hiddenItems = itemsContainer.querySelectorAll('.flm-overflowset-item--hidden');
      if (hiddenItems.length === 0) return;

      menuEl = document.createElement('div');
      menuEl.className = 'flm-contextmenu';

      for (var i = 0; i < hiddenItems.length; i++) {
        var item = hiddenItems[i];
        var label = item.getAttribute('data-label') || item.textContent.trim();
        var icon = item.getAttribute('data-icon');

        var menuItem = document.createElement('button');
        menuItem.className = 'flm-contextmenu-item';

        if (icon) {
          var iconSpan = document.createElement('span');
          iconSpan.className = 'flm-contextmenu-item-icon';
          var svg = typeof FluentIcons !== 'undefined' ? FluentIcons.getSvg(icon) : null;
          if (svg) {
            iconSpan.appendChild(svg);
          }
          menuItem.appendChild(iconSpan);
        }

        var textSpan = document.createElement('span');
        textSpan.className = 'flm-contextmenu-item-text';
        textSpan.textContent = label;
        menuItem.appendChild(textSpan);

        // Proxy click to original item
        (function (originalItem) {
          menuItem.addEventListener('click', function () {
            hideMenu();
            originalItem.click();
          });
        })(item);

        menuEl.appendChild(menuItem);
      }

      document.body.appendChild(menuEl);
      showMenu();
    }

    function showMenu() {
      if (!menuEl || !overflowBtn) return;

      var rect = overflowBtn.getBoundingClientRect();
      var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;

      menuEl.style.position = 'absolute';
      menuEl.style.left = rect.left + scrollX + 'px';
      menuEl.style.top = (rect.bottom + scrollY + 2) + 'px';
      menuEl.classList.add('flm-contextmenu--visible');

      // Reposition if off-screen
      setTimeout(function () {
        var menuRect = menuEl.getBoundingClientRect();
        if (menuRect.right > window.innerWidth) {
          menuEl.style.left = (rect.right + scrollX - menuRect.width) + 'px';
        }
        if (menuRect.bottom > window.innerHeight) {
          menuEl.style.top = (rect.top + scrollY - menuRect.height - 2) + 'px';
        }
      }, 0);

      // Click outside to close
      var outsideHandler = function (e) {
        if (!menuEl.contains(e.target) && e.target !== overflowBtn) {
          hideMenu();
          document.removeEventListener('click', outsideHandler);
        }
      };
      setTimeout(function () {
        document.addEventListener('click', outsideHandler);
      }, 0);
      menuEl._outsideHandler = outsideHandler;
    }

    function hideMenu() {
      if (!menuEl) return;
      menuEl.classList.remove('flm-contextmenu--visible');
      if (menuEl._outsideHandler) {
        document.removeEventListener('click', menuEl._outsideHandler);
        delete menuEl._outsideHandler;
      }
      // Remove from DOM after transition
      setTimeout(function () {
        if (menuEl && menuEl.parentNode) {
          menuEl.parentNode.removeChild(menuEl);
        }
        menuEl = null;
      }, 200);
    }

    // Wire overflow button click
    if (overflowBtn) {
      overflowBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        buildOverflowMenu();
      });
    }

    // Observe size changes
    if (typeof ResizeObserver !== 'undefined') {
      var observer = new ResizeObserver(function () {
        recalculate();
      });
      observer.observe(el);
    } else {
      window.addEventListener('resize', recalculate);
    }

    // Initial calculation
    recalculate();

    el.setAttribute('data-overflowset-wired', 'true');
  }

  return { init: init };
})();
