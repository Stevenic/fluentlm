(function () {
    if (window.awarity) return;

    // ── Theme definitions ──
    var THEMES = {
        'awarity-light':       'fluent-awarity-light',
        'awarity-dark':        'fluent-awarity-dark',
        'awarity-amber-light': 'fluent-awarity-amber-light',
        'awarity-amber-dark':  'fluent-awarity-amber-dark'
    };

    var THEME_LABELS = {
        'awarity-light':       'Blue Light',
        'awarity-dark':        'Blue Dark',
        'awarity-amber-light': 'Amber Light',
        'awarity-amber-dark':  'Amber Dark'
    };

    var THEME_CYCLE = ['awarity-dark', 'awarity-light', 'awarity-amber-dark', 'awarity-amber-light'];
    var DEFAULT_THEME = 'awarity-dark';

    // ── Register themes ──
    for (var name in THEMES) {
        if (THEMES.hasOwnProperty(name)) {
            FluentLM.registerTheme(name, THEMES[name]);
        }
    }

    // ── Restore stored theme ──
    // FluentTheme.init() runs before custom themes are registered,
    // so it can't restore an awarity theme — we do it here instead.
    var stored = (function () { try { return localStorage.getItem('fluentlm-theme'); } catch (e) { return null; } })();
    FluentLM.setTheme(stored && stored.indexOf('awarity') === 0 ? stored : DEFAULT_THEME);

    // ── Theme cycling helpers ──
    function nextTheme(current) {
        var idx = THEME_CYCLE.indexOf(current);
        return THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
    }

    function updateThemeLabel(btn) {
        var next = nextTheme(FluentLM.getTheme());
        btn.textContent = 'Theme: ' + (THEME_LABELS[next] || next);
    }

    /**
     * Bind the theme-toggle button.
     * Call once per page after the DOM is ready:
     *   awarity.initThemeToggle()            — uses #themeToggle
     *   awarity.initThemeToggle('myBtnId')   — uses a custom element id
     */
    function initThemeToggle(buttonId) {
        var btn = document.getElementById(buttonId || 'themeToggle');
        if (!btn) return;

        updateThemeLabel(btn);
        btn.addEventListener('click', function () {
            FluentLM.setTheme(nextTheme(FluentLM.getTheme()));
            updateThemeLabel(btn);
        });
    }

    // ── Public API ──
    window.awarity = {
        initThemeToggle: initThemeToggle,
        themes: THEME_LABELS,
        themeCycle: THEME_CYCLE
    };
})();
