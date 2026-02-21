/**
 * ContextualMenu component JS — show/hide, positioning, click-outside dismiss.
 *
 * Usage:
 *   FluentLMContextMenuComponent.show(menuEl, targetEl)
 *   FluentLMContextMenuComponent.hide(menuEl)
 *
 * Or: <button data-contextmenu-toggle="my-menu">Menu</button>
 * Or: Right-click trigger: <div data-contextmenu="my-menu">Right-click me</div>
 */
var FluentLMContextMenuComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    // Button triggers
    var triggers = doc.querySelectorAll('[data-contextmenu-toggle]');
    for (var i = 0; i < triggers.length; i++) {
      wireTrigger(triggers[i]);
    }

    // Right-click triggers
    var contextTriggers = doc.querySelectorAll('[data-contextmenu]');
    for (var j = 0; j < contextTriggers.length; j++) {
      wireContextTrigger(contextTriggers[j]);
    }

    // Wire menu item clicks for dismiss
    var menus = doc.querySelectorAll('.flm-contextmenu');
    for (var k = 0; k < menus.length; k++) {
      wireMenuItems(menus[k]);
    }
  }

  function wireTrigger(btn) {
    if (btn.getAttribute('data-cm-wired')) return;
    btn.addEventListener('click', function (e) {
      var id = btn.getAttribute('data-contextmenu-toggle');
      var menu = document.getElementById(id);
      if (!menu) return;
      if (menu.classList.contains('flm-contextmenu--visible')) {
        hide(menu);
      } else {
        show(menu, btn);
      }
      e.stopPropagation();
    });
    btn.setAttribute('data-cm-wired', 'true');
  }

  function wireContextTrigger(el) {
    if (el.getAttribute('data-cm-wired')) return;
    el.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      var id = el.getAttribute('data-contextmenu');
      var menu = document.getElementById(id);
      if (!menu) return;
      showAt(menu, e.pageX, e.pageY);
    });
    el.setAttribute('data-cm-wired', 'true');
  }

  function wireMenuItems(menu) {
    var items = menu.querySelectorAll('.flm-contextmenu-item');
    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener('click', function () {
        hide(menu);
      });
    }
  }

  function show(menu, target) {
    var rect = target.getBoundingClientRect();
    var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    showAt(menu, rect.left + scrollX, rect.bottom + scrollY + 2);
  }

  function showAt(menu, x, y) {
    menu.style.position = 'absolute';
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.classList.add('flm-contextmenu--visible');

    // Reposition if off-screen
    setTimeout(function () {
      var menuRect = menu.getBoundingClientRect();
      if (menuRect.right > window.innerWidth) {
        menu.style.left = (x - menuRect.width) + 'px';
      }
      if (menuRect.bottom > window.innerHeight) {
        menu.style.top = (y - menuRect.height) + 'px';
      }
    }, 0);

    var outsideHandler = function (e) {
      if (!menu.contains(e.target)) {
        hide(menu);
        document.removeEventListener('click', outsideHandler);
      }
    };
    setTimeout(function () {
      document.addEventListener('click', outsideHandler);
    }, 0);
    menu._outsideHandler = outsideHandler;
  }

  function hide(menu) {
    menu.classList.remove('flm-contextmenu--visible');
    if (menu._outsideHandler) {
      document.removeEventListener('click', menu._outsideHandler);
      delete menu._outsideHandler;
    }
  }

  return { init: init, show: show, showAt: showAt, hide: hide };
})();
