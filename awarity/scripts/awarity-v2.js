(function () {
    if (window.awarity) return;

    // ── Icon definitions ──
    var ICONS = {
        'Database':     'M8 1C4.13 1 1 2.34 1 4v8c0 1.66 3.13 3 7 3s7-1.34 7-3V4c0-1.66-3.13-3-7-3zM2 6.26C3.41 7.24 5.59 7.8 8 7.8s4.59-.56 6-1.54V8c0 .77-2.42 2-6 2S2 8.77 2 8V6.26zM8 2c3.58 0 6 1.23 6 2s-2.42 2-6 2S2 4.77 2 4s2.42-2 6-2zm0 12c-3.58 0-6-1.23-6-2v-1.74C3.41 11.24 5.59 11.8 8 11.8s4.59-.56 6-1.54V12c0 .77-2.42 2-6 2z',
        'Org':          'M8 1a2 2 0 0 1 2 2v1h2.5a.5.5 0 0 1 .5.5V7h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h1V5H9v1.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V5H5v2h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-4A.5.5 0 0 1 3 7h1V4.5a.5.5 0 0 1 .5-.5H7V3a2 2 0 0 1 1-2z',
        'Flow':         'M2 3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .35.15L8.71 6H13.5a.5.5 0 0 1 0 1H8.71l-2.86 2.85a.5.5 0 0 1-.35.15h-3a.5.5 0 0 1 0-1h2.79L8 6.5 5.29 4H2.5a.5.5 0 0 1-.5-.5zm0 8a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .35.15L8.71 14H13.5a.5.5 0 0 1 0 1H8.71l-2.86-2.85A.5.5 0 0 0 5.5 12h-3a.5.5 0 0 1-.5-.5z',
        'Processing':   'M8 1.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V2a.5.5 0 0 1 .5-.5zM3.05 3.05a.5.5 0 0 1 .7 0l1.42 1.42a.5.5 0 0 1-.7.7L3.05 3.76a.5.5 0 0 1 0-.7zm9.9 0a.5.5 0 0 1 0 .7l-1.42 1.42a.5.5 0 1 1-.7-.7l1.41-1.42a.5.5 0 0 1 .7 0zM1.5 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H2a.5.5 0 0 1-.5-.5zm10 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm-6.33 3.17a.5.5 0 0 1 0 .7L3.76 13.3a.5.5 0 0 1-.7-.7l1.41-1.42a.5.5 0 0 1 .7 0zm5.66 0a.5.5 0 0 1 .7 0l1.42 1.42a.5.5 0 0 1-.7.7l-1.42-1.41a.5.5 0 0 1 0-.7zM8 12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5z',
        'TextDocument': 'M4 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5.41a1 1 0 0 0-.3-.7L9.3 1.28a1 1 0 0 0-.71-.29H4zm1.5 5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zm0 2h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zm0 2h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1z',
        'Refresh':      'M1.5 8a6.5 6.5 0 0 1 11.25-4.43V2a.5.5 0 0 1 1 0v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1h1.87A5.5 5.5 0 1 0 13.5 8a.5.5 0 0 1 1 0A6.5 6.5 0 1 1 1.5 8z',
        'Tag':          'M2 3.5A1.5 1.5 0 0 1 3.5 2h3.59a1.5 1.5 0 0 1 1.06.44l5.41 5.41a1.5 1.5 0 0 1 0 2.12l-3.59 3.59a1.5 1.5 0 0 1-2.12 0L2.44 8.15A1.5 1.5 0 0 1 2 7.09V3.5zM5 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
        'Download':     'M8 1.5a.5.5 0 0 1 .5.5v7.79l2.15-2.14a.5.5 0 0 1 .7.7l-3 3a.5.5 0 0 1-.7 0l-3-3a.5.5 0 1 1 .7-.7L7.5 9.79V2a.5.5 0 0 1 .5-.5zM2.5 12a.5.5 0 0 1 .5.5v1h10v-1a.5.5 0 0 1 1 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-1.5a.5.5 0 0 1 .5-.5z',
        'FolderOpen':   'M2 4.5A1.5 1.5 0 0 1 3.5 3h3.09a1.5 1.5 0 0 1 1.06.44L8.71 4.5H12.5A1.5 1.5 0 0 1 14 6v.5h.25a.75.75 0 0 1 .72.96l-1.5 5.25A1.5 1.5 0 0 1 12.03 14H3.5A1.5 1.5 0 0 1 2 12.5v-8zM3.5 4a.5.5 0 0 0-.5.5V6h4.5a.5.5 0 0 0 .35-.15L6.79 4.79A.5.5 0 0 0 6.59 4H3.5z',
        'ViewList':     'M2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z',
        'Copy':         'M5.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-6zM4 3.5A1.5 1.5 0 0 1 5.5 2h6A1.5 1.5 0 0 1 13 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-6A1.5 1.5 0 0 1 4 12.5v-9zM2 5.5a.5.5 0 0 1 .5.5v7.5A1.5 1.5 0 0 0 4 15h6a.5.5 0 0 1 0 1H4a2.5 2.5 0 0 1-2.5-2.5V6a.5.5 0 0 1 .5-.5z',
        'Help':         'M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-3.5a1.5 1.5 0 0 1 2.87.6c0 .73-.52 1.06-1 1.36l-.13.08c-.4.26-.74.5-.74 1.06a.5.5 0 0 1-1 0c0-1.03.61-1.4 1.1-1.72l.13-.08c.46-.29.64-.44.64-.7a.5.5 0 0 0-1 0 .5.5 0 0 1-1 0zM8 11.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z',
        'Beaker':       'M6 1.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H9v4.28l3.89 5.83A1.5 1.5 0 0 1 11.64 14H4.36a1.5 1.5 0 0 1-1.25-2.33L7 5.84V2H6.5a.5.5 0 0 1-.5-.5zM8 6.16L4.36 11.67a.5.5 0 0 0 .42.77h6.44a.5.5 0 0 0 .42-.77L8 5.84V2h0v4.16z',
        'Play':         'M5.25 3.1a.75.75 0 0 1 .77.04l7 4.9a.75.75 0 0 1 0 1.22l-7 4.9A.75.75 0 0 1 4.75 13.5V2.75a.75.75 0 0 1 .5-.65z',
        'ChevronLeft':  'M10.35 3.15a.5.5 0 0 1 0 .7L6.21 8l4.14 4.15a.5.5 0 0 1-.7.7l-4.5-4.5a.5.5 0 0 1 0-.7l4.5-4.5a.5.5 0 0 1 .7 0z',
        'ChevronUp':    'M3.15 10.35a.5.5 0 0 1 0-.7L8 4.79l4.85 4.86a.5.5 0 0 1-.7.7L8 6.21l-4.15 4.14a.5.5 0 0 1-.7 0z',
        'ChevronDown':  'M3.15 5.65a.5.5 0 0 1 .7 0L8 9.79l4.15-4.14a.5.5 0 0 1 .7.7l-4.5 4.5a.5.5 0 0 1-.7 0l-4.5-4.5a.5.5 0 0 1 0-.7z',
        'Edit':         'M11.85 1.15a.5.5 0 0 1 .7 0l2.3 2.3a.5.5 0 0 1 0 .7l-8.5 8.5a.5.5 0 0 1-.22.13l-3.5 1a.5.5 0 0 1-.63-.63l1-3.5a.5.5 0 0 1 .13-.22l8.5-8.5z',
        'CheckMark':    'M13.85 4.15a.5.5 0 0 1 0 .7l-7.5 7.5a.5.5 0 0 1-.7 0l-3.5-3.5a.5.5 0 1 1 .7-.7L6 11.29l7.15-7.14a.5.5 0 0 1 .7 0z',
        'Cancel':       'M3.15 3.15a.5.5 0 0 1 .7 0L8 7.29l4.15-4.14a.5.5 0 0 1 .7.7L8.71 8l4.14 4.15a.5.5 0 0 1-.7.7L8 8.71l-4.15 4.14a.5.5 0 0 1-.7-.7L7.29 8 3.15 3.85a.5.5 0 0 1 0-.7z',
        'Back':         'M10.35 3.15a.5.5 0 0 1 0 .7L6.21 8l4.14 4.15a.5.5 0 0 1-.7.7l-4.5-4.5a.5.5 0 0 1 0-.7l4.5-4.5a.5.5 0 0 1 .7 0z',
        'Clock':        'M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-3.5a.5.5 0 0 1 .5.5v2.79l1.85 1.86a.5.5 0 0 1-.7.7l-2-2A.5.5 0 0 1 7.5 8V5a.5.5 0 0 1 .5-.5z'
    };

    // ── Register icons ──
    for (var icon in ICONS) {
        if (ICONS.hasOwnProperty(icon)) {
            FluentIcons.register(icon, ICONS[icon]);
        }
    }

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

    // ── IndexedDB helpers for file picker persistence ──
    var DB_NAME = 'awarity-filepicker';
    var STORE_NAME = 'handles';
    var HANDLE_KEY = 'lastDir';

    function openDB() {
        return new Promise(function (resolve, reject) {
            var req = indexedDB.open(DB_NAME, 1);
            req.onupgradeneeded = function () {
                var db = req.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
            req.onsuccess = function () { resolve(req.result); };
            req.onerror = function () { reject(req.error); };
        });
    }

    function getHandle() {
        return openDB().then(function (db) {
            return new Promise(function (resolve, reject) {
                var tx = db.transaction(STORE_NAME, 'readonly');
                var store = tx.objectStore(STORE_NAME);
                var req = store.get(HANDLE_KEY);
                req.onsuccess = function () { resolve(req.result || null); };
                req.onerror = function () { reject(req.error); };
            });
        }).catch(function () { return null; });
    }

    function setHandle(handle) {
        return openDB().then(function (db) {
            return new Promise(function (resolve, reject) {
                var tx = db.transaction(STORE_NAME, 'readwrite');
                var store = tx.objectStore(STORE_NAME);
                var req = store.put(handle, HANDLE_KEY);
                req.onsuccess = function () { resolve(); };
                req.onerror = function () { reject(req.error); };
            });
        }).catch(function () { /* silently ignore storage errors */ });
    }

    // ── File picker with File System Access API + fallback ──
    var _fallbackInput = null;

    function _ensureFallbackInput() {
        if (!_fallbackInput) {
            _fallbackInput = document.createElement('input');
            _fallbackInput.type = 'file';
            _fallbackInput.style.display = 'none';
            document.body.appendChild(_fallbackInput);
        }
        return _fallbackInput;
    }

    /**
     * Open a native file/folder picker.
     * @param {HTMLInputElement} targetInput — the text input to populate
     * @param {Object} [opts]
     * @param {string} [opts.mode='file'] — 'file' or 'folder'
     * @param {Array}  [opts.types]       — file type filters for showOpenFilePicker
     */
    function browse(targetInput, opts) {
        opts = opts || {};
        var mode = opts.mode || 'file';
        var hasAPI = (mode === 'folder')
            ? typeof window.showDirectoryPicker === 'function'
            : typeof window.showOpenFilePicker === 'function';

        if (hasAPI) {
            _browseNative(targetInput, mode, opts);
        } else {
            _browseFallback(targetInput, mode);
        }
    }

    function _browseNative(targetInput, mode, opts) {
        getHandle().then(function (startIn) {
            var pickerOpts = {};
            if (startIn) pickerOpts.startIn = startIn;

            var p;
            if (mode === 'folder') {
                pickerOpts.mode = 'read';
                p = window.showDirectoryPicker(pickerOpts).then(function (dirHandle) {
                    setHandle(dirHandle);
                    targetInput.value = dirHandle.name;
                    targetInput.focus();
                });
            } else {
                if (opts.types) pickerOpts.types = opts.types;
                p = window.showOpenFilePicker(pickerOpts).then(function (handles) {
                    var fileHandle = handles[0];
                    targetInput.value = fileHandle.name;
                    targetInput.focus();
                    // Try to persist parent directory
                    return getHandle().then(function (existing) {
                        // If we already have a dir handle, keep it;
                        // otherwise there's no way to get parent from a file handle
                        return existing;
                    });
                });
            }

            return p;
        }).catch(function (err) {
            // User cancelled or API error — ignore AbortError
            if (err && err.name !== 'AbortError') {
                console.warn('awarity.browse:', err);
            }
        });
    }

    function _browseFallback(targetInput, mode) {
        var input = _ensureFallbackInput();
        if (mode === 'folder') {
            input.setAttribute('webkitdirectory', '');
        } else {
            input.removeAttribute('webkitdirectory');
        }
        input.value = '';

        // One-shot handler
        var handler = function () {
            input.removeEventListener('change', handler);
            if (!input.files.length) return;
            var file = input.files[0];
            var path = file.webkitRelativePath || file.name;
            if (input.hasAttribute('webkitdirectory') && path.indexOf('/') !== -1) {
                path = path.substring(0, path.indexOf('/'));
            }
            targetInput.value = path;
            targetInput.focus();
        };
        input.addEventListener('change', handler);
        input.click();
    }

    // ── Model list ──
    function getModels() {
        return Promise.resolve([
            { id: 'claude-sonnet', label: 'Claude Sonnet' },
            { id: 'claude-haiku',  label: 'Claude Haiku' },
            { id: 'claude-opus',   label: 'Claude Opus' }
        ]);
    }

    // ── Lens list ──
    function getLenses() {
        return Promise.resolve([
            { id: 'lenses/financial-risk.lens.md', label: 'Financial Risk' },
            { id: 'lenses/triage.lens.md',         label: 'Triage' },
            { id: 'lenses/compliance.lens.md',      label: 'Compliance' },
            { id: 'lenses/research-summary.lens.md', label: 'Research Summary' }
        ]);
    }

    // ── Catalog list ──
    function getCatalogs() {
        return Promise.resolve([
            { id: 'sec-filings',     label: 'SEC Filings' },
            { id: 'legal-contracts', label: 'Legal Contracts' },
            { id: 'research-papers', label: 'Research Papers' },
            { id: 'compliance-docs', label: 'Compliance Docs' }
        ]);
    }

    // ── Public API ──
    window.awarity = {
        initThemeToggle: initThemeToggle,
        themes: THEME_LABELS,
        themeCycle: THEME_CYCLE,
        browse: browse,
        getModels: getModels,
        getLenses: getLenses,
        getCatalogs: getCatalogs
    };
})();
