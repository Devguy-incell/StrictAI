/**
 * StrictAI Global Components & System Handlers
 * - Responsive Navigation Header with Mobile Drawer & Language Switcher
 * - Fixed Mobile Bottom Tab Bar (Duolingo/Speak style for screens < 768px)
 * - Anti-distraction tab-switch detector with Web Audio API sound alert
 * - Theme switcher (Dark / Warm Paper)
 * - Toast notification system
 * - AI Provider API Key configuration modal
 * - Multi-language support (uk, en, pl, de) integrated with window.StrictI18n
 */

(function () {
  'use strict';

  const SUPPORTED_LOCALES = [
    { code: 'uk', label: 'UA', name: 'Українська', flag: '🇺🇦' },
    { code: 'en', label: 'EN', name: 'English', flag: '🇬🇧' },
    { code: 'pl', label: 'PL', name: 'Polski', flag: '🇵🇱' },
    { code: 'de', label: 'DE', name: 'Deutsch', flag: '🇩🇪' }
  ];

  // Compact localized labels for all 4 languages to guarantee no overflow/wrapping in 126px buttons
  const NAV_TITLES = {
    uk: { home: 'Головна', tutor: 'AI-Репетитор', placement: 'Рівень', nmt: 'Тести НМТ', tracker: 'Трекер', parents: 'Батьки', knowledge: 'Карта знань' },
    en: { home: 'Home', tutor: 'AI Tutor', placement: 'Level', nmt: 'NMT Tests', tracker: 'Tracker', parents: 'Parents', knowledge: 'Knowledge' },
    pl: { home: 'Start', tutor: 'AI Tutor', placement: 'Poziom', nmt: 'Testy NMT', tracker: 'Tracker', parents: 'Rodzice', knowledge: 'Wiedza' },
    de: { home: 'Start', tutor: 'AI-Tutor', placement: 'Level', nmt: 'NMT-Tests', tracker: 'Tracker', parents: 'Eltern', knowledge: 'Wissen' }
  };

  const NAV_ITEMS = [
    { id: 'index', href: 'index.html', url: 'index.html', icon: '🏠', label: 'Головна', i18nKey: 'nav.home' },
    { id: 'tutor', href: 'tutor.html', url: 'tutor.html', icon: '🐼', label: 'AI-Репетитор', i18nKey: 'nav.tutor' },
    { id: 'placement', href: 'placement.html', url: 'placement.html', icon: '🎯', label: 'Рівень', i18nKey: 'nav.placement' },
    { id: 'nmt', href: 'nmt.html', url: 'nmt.html', icon: '📝', label: 'Тести НМТ', i18nKey: 'nav.nmt' },
    { id: 'tracker', href: 'tracker.html', url: 'tracker.html', icon: '⏱', label: 'Трекер', i18nKey: 'nav.tracker' },
    { id: 'parents', href: 'parents.html', url: 'parents.html', icon: '🛡', label: 'Батьки', i18nKey: 'nav.parents' },
    { id: 'knowledge', href: 'knowledge.html', url: 'knowledge.html', icon: '🗺', label: 'Карта знань', i18nKey: 'nav.knowledge' }
  ];

  const BOTTOM_NAV_PAGES = [
    { id: 'index', url: 'index.html', icon: '🏠', labels: { uk: 'Головна', en: 'Home', pl: 'Start', de: 'Start' } },
    { id: 'tutor', url: 'tutor.html', icon: '🐼', labels: { uk: 'AI-Репетитор', en: 'AI Tutor', pl: 'AI Tutor', de: 'AI-Tutor' } },
    { id: 'placement', url: 'placement.html', icon: '🎯', labels: { uk: 'Рівень', en: 'Level', pl: 'Poziom', de: 'Level' } },
    { id: 'nmt', url: 'nmt.html', icon: '📝', labels: { uk: 'Тести НМТ', en: 'NMT Tests', pl: 'Testy NMT', de: 'NMT-Tests' } },
    { id: 'tracker', url: 'tracker.html', icon: '⏱', labels: { uk: 'Трекер', en: 'Tracker', pl: 'Tracker', de: 'Tracker' } },
    { id: 'parents', url: 'parents.html', icon: '🛡', labels: { uk: 'Батьки', en: 'Parents', pl: 'Rodzice', de: 'Eltern' } },
    { id: 'knowledge', url: 'knowledge.html', icon: '🗺', labels: { uk: 'Карта знань', en: 'Knowledge', pl: 'Wiedza', de: 'Wissen' } }
  ];

  class StrictComponentsController {
    constructor() {
      this.NAV_ITEMS = NAV_ITEMS;
      this.NAV_TITLES = NAV_TITLES;
      this.BOTTOM_NAV_PAGES = BOTTOM_NAV_PAGES;
      this.audioCtx = null;
      this.lastBlurTime = 0;
      this.currentPageId = 'index';
      this._localeListenerAttached = false;
      this._storeSubscribed = false;
      this._notifEventsAttached = false;

      this._injectStyles();
      this._syncI18nNavTranslations();
      this._initAudioContext();
      this._initFocusGuard();
      this._initLocaleListener();
      this._initNotificationListeners();
      this._ensureI18nLoaded();
    }

    _ensureI18nLoaded() {
      if (typeof window !== 'undefined' && !window.StrictI18n && typeof document !== 'undefined') {
        const existing = document.querySelector('script[src*="i18n.js"]');
        if (!existing) {
          const s = document.createElement('script');
          s.src = 'js/i18n.js';
          s.async = false;
          s.onload = () => {
            this._syncI18nNavTranslations();
            if (window.StrictI18n && typeof window.StrictI18n.applyToDOM === 'function') {
              window.StrictI18n.applyToDOM();
            }
          };
          document.head.appendChild(s);
        }
      }
      this._syncI18nNavTranslations();
    }

    /**
     * Synchronizes compact navigation translations with StrictI18n runtime dictionary
     */
    _syncI18nNavTranslations() {
      if (typeof window !== 'undefined' && window.StrictI18n && window.StrictI18n.translations) {
        Object.keys(NAV_TITLES).forEach(lang => {
          if (window.StrictI18n.translations[lang] && window.StrictI18n.translations[lang].nav) {
            Object.assign(window.StrictI18n.translations[lang].nav, NAV_TITLES[lang]);
          }
        });
      }
    }

    /**
     * Injects strict LeetCode Dark Graphite theme styles for navigation buttons
     * Ensures exactly 126px fixed width, 36px height, single-line alignment for action buttons
     */
    _injectStyles() {
      if (typeof document === 'undefined') return;
      if (document.getElementById('strict-components-theme-style')) return;

      const style = document.createElement('style');
      style.id = 'strict-components-theme-style';
      style.textContent = `
        /* StrictAI Graphite LeetCode Theme Navigation & Header */
        .strict-navbar {
          background-color: var(--bg-base, #121212) !important;
          border-bottom: 1px solid var(--border-subtle, #333333) !important;
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
        }

        .strict-navbar-inner {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          height: 56px !important;
          gap: 8px !important;
          box-sizing: border-box !important;
        }

        .strict-nav-links {
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
          list-style: none !important;
          margin: 0 !important;
          padding: 0 !important;
          flex-wrap: nowrap !important;
        }

        .strict-nav-links > li {
          list-style: none !important;
          margin: 0 !important;
          padding: 0 !important;
          display: inline-flex !important;
          flex-shrink: 0 !important;
        }

        /* 126px Fixed Width Navigation Link Buttons - Graphite LeetCode Style */
        .strict-navbar .strict-nav-link,
        .strict-nav-link {
          width: 126px !important;
          min-width: 126px !important;
          max-width: 126px !important;
          height: 36px !important;
          min-height: 36px !important;
          max-height: 36px !important;
          padding: 0 6px !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          border-radius: 8px !important;
          background: #1e1e1e !important;
          border: 1px solid #333333 !important;
          color: #eff1f6 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          box-sizing: border-box !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          text-decoration: none !important;
          cursor: pointer !important;
          gap: 5px !important;
          transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease !important;
          user-select: none !important;
        }

        .strict-navbar .strict-nav-link > span:first-child,
        .strict-nav-link > span:first-child {
          font-size: 14px !important;
          line-height: 1 !important;
          flex-shrink: 0 !important;
        }

        .strict-navbar .strict-nav-link > span:last-child,
        .strict-nav-link > span:last-child {
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
          font-size: 13px !important;
          font-weight: 600 !important;
        }

        .strict-navbar .strict-nav-link:hover,
        .strict-nav-link:hover {
          background: #2e2e2e !important;
          border-color: #4a4a4a !important;
          color: #ffffff !important;
        }

        .strict-navbar .strict-nav-link.active,
        .strict-nav-link.active {
          background: rgba(255, 161, 22, 0.15) !important;
          border-color: var(--accent-primary, #ffa116) !important;
          color: #ffa116 !important;
          font-weight: 700 !important;
          box-shadow: inset 0 0 0 1px rgba(255, 161, 22, 0.25) !important;
        }

        /* Light Theme Overrides */
        [data-theme="light"] .strict-navbar .strict-nav-link,
        [data-theme="light"] .strict-nav-link {
          background: #f0f0f2 !important;
          border-color: #d1d5db !important;
          color: #374151 !important;
        }

        [data-theme="light"] .strict-navbar .strict-nav-link:hover,
        [data-theme="light"] .strict-nav-link:hover {
          background: #e5e7eb !important;
          border-color: #9ca3af !important;
          color: #111827 !important;
        }

        [data-theme="light"] .strict-navbar .strict-nav-link.active,
        [data-theme="light"] .strict-nav-link.active {
          background: rgba(255, 161, 22, 0.2) !important;
          border-color: #ffa116 !important;
          color: #b45309 !important;
          font-weight: 700 !important;
        }

        /* Action Buttons in Header - Strict 36px Height, Aligned in One Line */
        .strict-navbar-actions,
        .nav-actions {
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          flex-shrink: 0 !important;
          height: 36px !important;
        }

        .strict-navbar-actions > *,
        .strict-navbar-actions .lang-switcher-btn,
        .strict-navbar-actions .nav-badge,
        .strict-navbar-actions .theme-toggle-btn,
        .strict-navbar-actions .notif-bell-btn,
        .strict-navbar-actions #api-key-btn,
        .strict-navbar-actions .btn-sm {
          height: 36px !important;
          min-height: 36px !important;
          max-height: 36px !important;
          box-sizing: border-box !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          border-radius: 8px !important;
          padding: 0 10px !important;
          margin: 0 !important;
          vertical-align: middle !important;
        }

        .strict-navbar-actions .theme-toggle-btn,
        .strict-navbar-actions .notif-bell-btn {
          width: 36px !important;
          min-width: 36px !important;
          max-width: 36px !important;
          padding: 0 !important;
        }

        .strict-navbar-actions .lang-switcher-btn {
          padding: 0 8px !important;
          background: #1e1e1e !important;
          border: 1px solid #333333 !important;
          color: #eff1f6 !important;
        }

        .strict-navbar-actions .lang-switcher-btn:hover {
          background: #2e2e2e !important;
          border-color: #4a4a4a !important;
        }

        .strict-navbar-actions #api-key-btn {
          background: #242424 !important;
          border: 1px solid #333333 !important;
          color: #eff1f6 !important;
        }

        .strict-navbar-actions #api-key-btn:hover {
          background: #2e2e2e !important;
          border-color: #4a4a4a !important;
          color: #ffffff !important;
        }
      `;
      document.head.appendChild(style);
    }

    /**
     * Renders or re-renders navigation links via React if window.React and window.ReactDOM are available
     * @param {HTMLElement} container - The #nav-links-menu container
     * @param {string} activePageId - Current active page ID
     * @param {string} currentLocale - Current active locale
     * @returns {boolean} Whether React rendering was performed
     */
    _renderReactNavLinks(container, activePageId, currentLocale) {
      if (typeof window === 'undefined' || !window.React || !window.ReactDOM || !container) {
        return false;
      }
      try {
        const React = window.React;
        const ReactDOM = window.ReactDOM;
        const activeTitles = NAV_TITLES[currentLocale] || NAV_TITLES.uk;

        const navElements = NAV_ITEMS.map((item) => {
          const itemKey = item.id === 'index' ? 'home' : item.id;
          const title = activeTitles[itemKey] || activeTitles[item.id] || item.label;
          const isActive = (item.id === activePageId || (item.id === 'index' && activePageId === 'home') || (item.id === 'home' && activePageId === 'index'));

          return React.createElement(
            'li',
            { key: item.id },
            React.createElement(
              'a',
              {
                href: item.url || item.href,
                className: `nav-link strict-nav-link ${isActive ? 'active' : ''}`,
                'data-page': item.id,
                title: title
              },
              React.createElement('span', null, item.icon),
              React.createElement('span', { 'data-i18n': item.i18nKey || `nav.${itemKey}` }, title)
            )
          );
        });

        const fragmentElement = React.createElement(
          React.Fragment || 'div',
          null,
          navElements
        );

        if (typeof ReactDOM.createRoot === 'function') {
          if (!container._reactRoot) {
            container._reactRoot = ReactDOM.createRoot(container);
          }
          container._reactRoot.render(fragmentElement);
          return true;
        } else if (typeof ReactDOM.render === 'function') {
          ReactDOM.render(fragmentElement, container);
          return true;
        }
      } catch (err) {
        console.warn('StrictComponents: React render error, falling back to DOM markup', err);
      }
      return false;
    }

    _initAudioContext() {
      // Lazy init audio context on first user gesture
      const initAudio = () => {
        if (!this.audioCtx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) {
            this.audioCtx = new AudioContextClass();
          }
        }
        document.removeEventListener('click', initAudio);
        document.removeEventListener('keydown', initAudio);
      };
      document.addEventListener('click', initAudio, { once: true });
      document.addEventListener('keydown', initAudio, { once: true });
    }

    _ensureAudioCtx() {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    }

    /**
     * Synthesizes audio feedback via Web Audio API without external audio files
     */
    playBeep(type = 'click') {
      try {
        const ctx = this._ensureAudioCtx();
        if (!ctx) return;

        const now = ctx.currentTime;

        if (type === 'alert') {
          // Harsh alert tone for tab switching / rule violation
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gainNode = ctx.createGain();

          osc1.type = 'sawtooth';
          osc2.type = 'square';
          osc1.frequency.setValueAtTime(440, now);
          osc1.frequency.exponentialRampToValueAtTime(220, now + 0.35);

          osc2.frequency.setValueAtTime(480, now);
          osc2.frequency.exponentialRampToValueAtTime(240, now + 0.35);

          gainNode.gain.setValueAtTime(0.25, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

          osc1.connect(gainNode);
          osc2.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.35);
          osc2.stop(now + 0.35);

        } else if (type === 'success') {
          // Melodic uplifting triad
          [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.15, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.3);
          });

        } else if (type === 'tick') {
          // Soft short tick
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.04);

        } else {
          // Standard tactile click
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(600, now);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.06);
        }
      } catch (err) {
        console.warn('StrictComponents audio error:', err);
      }
    }

    /**
     * Anti-Distraction Guard (Strict Tab-Switching & Window Blur Monitor)
     */
    _initFocusGuard() {
      const handleDistraction = (reason) => {
        if (!window.StrictStore) return;
        const state = window.StrictStore.get();

        // Only enforce while focus session is active
        if (!state.tracker || !state.tracker.isSessionActive) return;

        // Debounce double firing (e.g. visibilitychange + blur within 1s)
        const now = Date.now();
        if (now - this.lastBlurTime < 1000) return;
        this.lastBlurTime = now;

        // Record violation in store
        window.StrictStore.recordTabSwitch(reason);

        // Sound alert if enabled
        if (state.parental && state.parental.soundAlertOnBlur) {
          this.playBeep('alert');
        }

        // Show warning banner
        this._showFocusWarningBanner();

        // Toast notice
        const alertMsg = (window.StrictI18n && typeof window.StrictI18n.t === 'function')
          ? window.StrictI18n.t('focusAlert.toast', '⚠️ Панда помітила відволікання! Сесія фокусу активна. Перемикання вкладок зафіксовано.')
          : '⚠️ Панда помітила відволікання! Сесія фокусу активна. Перемикання вкладок зафіксовано.';
        this.toast(alertMsg, 'warning');
      };

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          handleDistraction('Перемикання вкладки браузера');
        }
      });

      window.addEventListener('blur', () => {
        handleDistraction('Втрата фокусу вікна');
      });
    }

    _showFocusWarningBanner() {
      let banner = document.getElementById('focus-alert-banner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'focus-alert-banner';
        banner.className = 'focus-alert-banner';
        document.body.appendChild(banner);
      }

      const store = window.StrictStore ? window.StrictStore.get() : null;
      const switches = store ? store.tracker.sessionTabSwitches : 1;

      const title = (window.StrictI18n && typeof window.StrictI18n.t === 'function')
        ? window.StrictI18n.t('focusAlert.title', 'Увага! Відволікання зафіксовано!')
        : 'Увага! Відволікання зафіксовано!';
      const sub = (window.StrictI18n && typeof window.StrictI18n.t === 'function')
        ? window.StrictI18n.t('focusAlert.sub', 'Повернися до підготовки! За сесію: {switches} перемикань.', { switches })
        : `Повернися до підготовки! За сесію: ${switches} перемикань.`;

      banner.innerHTML = `
        <span>🚨</span>
        <div>
          <strong>${title}</strong>
          <div style="font-size: 0.82rem; opacity: 0.9;">${sub}</div>
        </div>
        <button id="close-warning-btn" style="color: white; margin-left: 12px; font-weight: bold; padding: 4px 8px; cursor: pointer;">✕</button>
      `;

      banner.classList.add('active');

      const closeBtn = banner.querySelector('#close-warning-btn');
      if (closeBtn) {
        closeBtn.onclick = () => banner.classList.remove('active');
      }

      clearTimeout(this._bannerTimeout);
      this._bannerTimeout = setTimeout(() => {
        banner.classList.remove('active');
      }, 5000);
    }

    /**
     * Helper to get current locale from localStorage (primary), StrictI18n, or StrictStore
     */
    _getCurrentLocale() {
      // 1. First priority: localStorage
      try {
        if (typeof localStorage !== 'undefined') {
          const saved = localStorage.getItem('strictai_locale');
          if (saved && ['uk', 'en', 'pl', 'de'].includes(saved)) {
            return saved;
          }
        }
      } catch (e) {}

      // 2. Second priority: window.StrictI18n.getLocale() or currentLocale
      if (typeof window !== 'undefined' && window.StrictI18n) {
        if (typeof window.StrictI18n.getLocale === 'function') {
          const loc = window.StrictI18n.getLocale();
          if (loc && ['uk', 'en', 'pl', 'de'].includes(loc)) {
            return loc;
          }
        }
        if (window.StrictI18n.currentLocale && ['uk', 'en', 'pl', 'de'].includes(window.StrictI18n.currentLocale)) {
          return window.StrictI18n.currentLocale;
        }
      }

      // 3. Third priority: window.StrictStore.get().locale
      if (typeof window !== 'undefined' && window.StrictStore && typeof window.StrictStore.get === 'function') {
        const st = window.StrictStore.get();
        if (st && st.locale && ['uk', 'en', 'pl', 'de'].includes(st.locale)) {
          return st.locale;
        }
      }

      return 'uk';
    }

    _getLocaleObj(code) {
      return SUPPORTED_LOCALES.find(l => l.code === code) || SUPPORTED_LOCALES[0];
    }

    /**
     * Initializes listener for strictai:localechange
     */
    _initLocaleListener() {
      if (this._localeListenerAttached || typeof window === 'undefined') return;
      this._localeListenerAttached = true;

      window.addEventListener('strictai:localechange', (e) => {
        const newLocale = (e.detail && e.detail.locale) || this._getCurrentLocale();
        this._syncI18nNavTranslations();
        this._updateUIForLocale(newLocale);
        if (window.StrictI18n && typeof window.StrictI18n.applyToDOM === 'function') {
          window.StrictI18n.applyToDOM();
        }
      });
    }

    /**
     * Changes platform language across localStorage, Store, i18n, UI and triggers toast
     * @param {string} langCode - 'uk' | 'en' | 'pl' | 'de'
     */
    setLanguage(langCode) {
      this.playBeep('click');
      const activeCode = ['uk', 'en', 'pl', 'de'].includes(langCode) ? langCode : 'uk';

      // 1. Save to localStorage
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('strictai_locale', activeCode);
        }
      } catch (e) {}

      // 2. Save in StrictStore
      if (typeof window !== 'undefined' && window.StrictStore && typeof window.StrictStore.update === 'function') {
        window.StrictStore.update({ locale: activeCode });
      }

      // 3. Call window.StrictI18n.setLocale(activeCode)
      if (typeof window !== 'undefined' && window.StrictI18n && typeof window.StrictI18n.setLocale === 'function') {
        window.StrictI18n.setLocale(activeCode);
      }

      // Sync compact navigation translations with runtime dictionary
      this._syncI18nNavTranslations();

      const toastMessages = {
        uk: 'Мову платформи змінено на: Українська 🇺🇦',
        en: 'Platform language changed to: English 🇬🇧',
        pl: 'Zmieniono język platformy na: Polski 🇵🇱',
        de: 'Plattform-Sprache geändert zu: Deutsch 🇩🇪'
      };

      this.toast(toastMessages[activeCode] || `Language: ${activeCode.toUpperCase()}`, 'info');

      // Re-render header & bottom nav to update active buttons and translations
      this.initPage(this.currentPageId || 'index');
    }

    _updateUIForLocale(locale) {
      this._syncI18nNavTranslations();
      const locObj = this._getLocaleObj(locale);

      // Update Top Bar Language Button
      const flagEl = document.querySelector('#lang-switcher-btn .lang-flag');
      const codeEl = document.querySelector('#lang-switcher-btn .lang-code');
      if (flagEl) flagEl.textContent = locObj.flag;
      if (codeEl) codeEl.textContent = locObj.label;

      // Update dropdown items active state
      document.querySelectorAll('#lang-dropdown-menu .lang-dropdown-item').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.locale === locale);
      });

      // Update mobile drawer language buttons
      document.querySelectorAll('#mobile-lang-switcher .mobile-lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.locale === locale);
      });

      // Update desktop navigation links (via React if available, or DOM)
      const navLinksMenu = document.getElementById('nav-links-menu');
      if (navLinksMenu && typeof window !== 'undefined' && window.React && window.ReactDOM) {
        this._renderReactNavLinks(navLinksMenu, this.currentPageId, locale);
      } else {
        const activeTitles = NAV_TITLES[locale] || NAV_TITLES.uk;
        document.querySelectorAll('.strict-nav-link').forEach(link => {
          const pageId = link.getAttribute('data-page');
          const itemKey = pageId === 'index' ? 'home' : pageId;
          const label = activeTitles[itemKey] || activeTitles[pageId];
          if (label) {
            const spanEl = link.querySelector('span:last-child');
            if (spanEl) spanEl.textContent = label;
            link.setAttribute('title', label);
          }
        });
      }

      // Update mobile drawer navigation labels
      const activeTitles = NAV_TITLES[locale] || NAV_TITLES.uk;
      document.querySelectorAll('.mobile-drawer-link').forEach(link => {
        const href = link.getAttribute('href') || '';
        const pageId = href.replace('.html', '');
        const itemKey = pageId === 'index' ? 'home' : pageId;
        const label = activeTitles[itemKey] || activeTitles[pageId];
        if (label) {
          const spanEl = link.querySelector('.drawer-link-title');
          if (spanEl) spanEl.textContent = label;
        }
      });

      // Update bottom mobile nav labels
      this._updateBottomNavLabels(locale);

      // Update streak badge unit
      const streakUnit = { uk: 'дн.', en: 'd', pl: 'dn.', de: 'T.' }[locale] || 'дн.';
      document.querySelectorAll('.streak-days-text').forEach(el => {
        el.textContent = ` ${streakUnit}`;
      });
    }

    _updateBottomNavLabels(locale) {
      document.querySelectorAll('.mobile-bottom-link').forEach(link => {
        const pageId = link.getAttribute('data-page-id');
        const pageData = BOTTOM_NAV_PAGES.find(p => p.id === pageId);
        if (pageData && pageData.labels) {
          const labelEl = link.querySelector('.mobile-bottom-label');
          if (labelEl) {
            labelEl.textContent = pageData.labels[locale] || pageData.labels.uk;
          }
        }
      });
    }

    /**
     * Initializes the standard header across all platform pages
     */
    initPage(activePageId = 'index') {
      this.currentPageId = activePageId;
      this._injectStyles();
      this._syncI18nNavTranslations();

      const header = document.getElementById('app-header');
      if (!header) return;

      const store = window.StrictStore ? window.StrictStore.get() : {
        theme: 'dark',
        locale: 'uk',
        student: { streakDays: 12, bambooCoins: 340 },
        tracker: { isSessionActive: false, sessionSecondsLeft: 1500 }
      };

      const currentLocale = this._getCurrentLocale();
      const currentLocObj = this._getLocaleObj(currentLocale);
      const activeTitles = NAV_TITLES[currentLocale] || NAV_TITLES.uk;

      const pages = NAV_ITEMS.map(item => {
        const itemKey = item.id === 'index' ? 'home' : item.id;
        return {
          id: item.id,
          title: activeTitles[itemKey] || activeTitles[item.id] || item.label,
          url: item.url || item.href,
          icon: item.icon,
          i18nKey: item.i18nKey || `nav.${itemKey}`
        };
      });

      const navLinksHtml = pages.map(p => {
        const isActive = (p.id === activePageId || (p.id === 'index' && activePageId === 'home') || (p.id === 'home' && activePageId === 'index')) ? 'active' : '';
        return `
          <li>
            <a href="${p.url}" class="nav-link strict-nav-link ${isActive}" data-page="${p.id}" title="${p.title}">
              <span>${p.icon}</span>
              <span data-i18n="${p.i18nKey}">${p.title}</span>
            </a>
          </li>
        `;
      }).join('');

      const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
      };

      const isSession = store.tracker && store.tracker.isSessionActive;
      const sessionBadgeHtml = isSession ? `
        <a href="tracker.html" class="nav-badge session-active" title="Активна фокус-сесія! Клацніть, щоб повернутися до таймера">
          <span>⏱</span>
          <span id="nav-session-timer">${formatTime(store.tracker.sessionSecondsLeft || 1500)}</span>
        </a>
      ` : '';

      // Language Switcher Dropdown HTML (Desktop + Top Bar on Mobile)
      const langSwitcherHtml = `
        <div class="strict-lang-switcher" id="lang-switcher">
          <button type="button" class="lang-switcher-btn" id="lang-switcher-btn" aria-label="Мова платформи: ${currentLocObj.name}" title="Мова платформи / Platform Language: ${currentLocObj.name}">
            <span class="lang-flag">${currentLocObj.flag}</span>
            <span class="lang-code">${currentLocObj.label}</span>
            <span class="lang-arrow">▾</span>
          </button>
          <div class="lang-dropdown-menu" id="lang-dropdown-menu">
            ${SUPPORTED_LOCALES.map(loc => `
              <button type="button" class="lang-dropdown-item ${loc.code === currentLocale ? 'active' : ''}" data-locale="${loc.code}">
                <span class="lang-flag">${loc.flag}</span>
                <span class="lang-name">${loc.name}</span>
                <span class="lang-code-pill">${loc.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;

      // Header Container Markup
      header.className = 'strict-navbar';
      header.innerHTML = `
        <div class="strict-container nav-inner strict-navbar-inner">
          <a href="index.html" class="nav-brand" title="StrictAI — Головна сторінка">
            <div class="nav-brand-badge">🐼</div>
            <div>Strict<span class="nav-brand-highlight">AI</span></div>
          </a>

          <!-- Desktop Nav Links -->
          <ul class="nav-links strict-nav-links" id="nav-links-menu">
            ${navLinksHtml}
          </ul>

          <!-- Nav Actions (Top Bar) -->
          <div class="nav-actions strict-navbar-actions">
            ${sessionBadgeHtml}

            <!-- Compact Language Switcher Dropdown -->
            ${langSwitcherHtml}

            <!-- Streak Badge (Compact, fits on 390px) -->
            <div class="nav-badge streak" title="Твій поточний щоденний стрік занять">
              <span>🔥</span>
              <span id="nav-streak-counter">${(store.student && store.student.streakDays) || 12}</span><span class="streak-days-text"> ${{ uk: 'дн.', en: 'd', pl: 'dn.', de: 'T.' }[currentLocale] || 'дн.'}</span>
            </div>

            <!-- Desktop Only: Bamboo Coins Badge -->
            <div class="nav-badge bamboo desktop-only-action" title="Бамбук-коїни за фокус та розібрані завдання">
              <span>🎋</span>
              <span id="nav-bamboo-counter">${(store.student && store.student.bambooCoins) || 340}</span>
            </div>

            <!-- Notification Bell Dropdown -->
            <div class="strict-notif-wrapper" id="notif-wrapper" style="position: relative;">
              <button type="button" class="notif-bell-btn" id="notif-bell-btn" aria-label="Сповіщення" title="Сповіщення про уроки">
                <span class="bell-icon">🔔</span>
                <span class="notif-badge" id="notif-badge" style="display: none;">0</span>
              </button>
              <div class="notif-dropdown" id="notif-dropdown" style="display: none;">
                <div class="notif-dropdown-header">
                  <div class="notif-dropdown-title">
                    <span>🔔</span> <span>Сповіщення</span>
                  </div>
                  <button type="button" class="notif-mark-read-btn" id="notif-mark-read-btn" title="Позначити всі як прочитані">✓ Прочитано</button>
                </div>
                <div class="notif-dropdown-body" id="notif-dropdown-list">
                  <!-- Список сповіщень -->
                </div>
                <div class="notif-dropdown-footer">
                  <button type="button" class="btn-simulate-missed-lesson" id="btn-simulate-missed-lesson">
                    ⚡ Симулювати пропуск уроку
                  </button>
                </div>
              </div>
            </div>

            <!-- Desktop Only: Theme Toggle Button -->
            <button class="theme-toggle-btn desktop-only-action" id="theme-toggle-btn" title="Змінити тему (Темна / Паперова для читання)">
              ${store.theme === 'light' ? '☀️' : '🌙'}
            </button>

            <!-- Desktop Only: API Key Button -->
            <button class="btn btn-secondary btn-sm desktop-only-action" id="api-key-btn" title="Налаштування AI провайдера (Gemini / OpenAI / Groq)">
              <span>⚙️</span>
              <span class="desktop-only">AI Ключ</span>
            </button>

            <!-- Mobile Hamburger Toggle Button (min-width: 44px, min-height: 44px) -->
            <button class="nav-mobile-btn" id="nav-mobile-toggle" aria-label="Відкрити меню" aria-expanded="false">
              <span id="nav-mobile-icon">☰</span>
            </button>
          </div>
        </div>

        <!-- Mobile Drawer Container (Slides down below navbar on < 900px) -->
        <div class="nav-mobile-drawer" id="nav-mobile-drawer">
          <div class="mobile-drawer-user-bar">
            <div class="nav-badge bamboo" title="Бамбук-коїни">
              <span>🎋</span>
              <span id="nav-mobile-bamboo-counter">${(store.student && store.student.bambooCoins) || 340}</span>
              <span style="font-size: 0.8rem; opacity: 0.85;"> коїнів</span>
            </div>

            <button type="button" class="mobile-drawer-theme-btn" id="mobile-theme-toggle-btn" title="Змінити тему">
              <span id="mobile-theme-icon">${store.theme === 'light' ? '☀️' : '🌙'}</span>
              <span id="mobile-theme-label">${store.theme === 'light' ? 'Паперова тема' : 'Темна тема'}</span>
            </button>
          </div>

          <div class="mobile-drawer-api-bar">
            <button type="button" class="btn btn-secondary btn-sm mobile-api-btn" id="mobile-api-key-btn">
              <span>⚙️</span>
              <span>AI Ключ (Gemini / OpenAI / Groq)</span>
            </button>
          </div>

          <!-- Mobile Drawer Language Selector -->
          <div class="mobile-drawer-lang">
            <div class="mobile-drawer-label">🌐 Мова платформи / Platform Language:</div>
            <div class="mobile-lang-grid" id="mobile-lang-switcher">
              ${SUPPORTED_LOCALES.map(loc => `
                <button type="button" class="mobile-lang-btn ${loc.code === currentLocale ? 'active' : ''}" data-locale="${loc.code}">
                  <span style="font-size: 1.15rem;">${loc.flag}</span>
                  <span style="font-weight: 700; font-size: 0.85rem;">${loc.label}</span>
                  <span style="font-size: 0.72rem; opacity: 0.85;">${loc.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Mobile Drawer Navigation Links -->
          <ul class="mobile-drawer-links">
            ${pages.map(p => `
              <li>
                <a href="${p.url}" class="mobile-drawer-link ${p.id === activePageId ? 'active' : ''}">
                  <span class="drawer-link-icon">${p.icon}</span>
                  <span class="drawer-link-title" data-i18n="${p.i18nKey}">${p.title}</span>
                  ${p.id === activePageId ? '<span class="drawer-link-dot">●</span>' : ''}
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      `;

      // Hybrid React Rendering if window.React & window.ReactDOM are available
      const navLinksMenu = header.querySelector('#nav-links-menu');
      if (navLinksMenu && typeof window !== 'undefined' && window.React && window.ReactDOM) {
        this._renderReactNavLinks(navLinksMenu, activePageId, currentLocale);
      }

      // Wire Up Top Bar Language Switcher Dropdown
      const langSwitcher = header.querySelector('#lang-switcher');
      const langBtn = header.querySelector('#lang-switcher-btn');
      if (langSwitcher && langBtn) {
        langBtn.onclick = (e) => {
          e.stopPropagation();
          const notifDropdown = document.getElementById('notif-dropdown');
          if (notifDropdown) notifDropdown.style.display = 'none';
          langSwitcher.classList.toggle('open');
        };

        langSwitcher.querySelectorAll('.lang-dropdown-item').forEach(itemBtn => {
          itemBtn.onclick = (e) => {
            e.stopPropagation();
            const loc = itemBtn.dataset.locale;
            langSwitcher.classList.remove('open');
            this.setLanguage(loc);
          };
        });

        document.addEventListener('click', (e) => {
          if (!langSwitcher.contains(e.target)) {
            langSwitcher.classList.remove('open');
          }
        });
      }

      // Wire Up Mobile Drawer Language Selector
      const mobileLangSwitcher = header.querySelector('#mobile-lang-switcher');
      if (mobileLangSwitcher) {
        mobileLangSwitcher.querySelectorAll('.mobile-lang-btn').forEach(mBtn => {
          mBtn.onclick = (e) => {
            e.stopPropagation();
            const loc = mBtn.dataset.locale;
            this.setLanguage(loc);
          };
        });
      }

      // Wire Up Mobile Drawer Toggle (Hamburger <-> Close)
      const mobileToggle = header.querySelector('#nav-mobile-toggle');
      const mobileDrawer = header.querySelector('#nav-mobile-drawer');
      const mobileIcon = header.querySelector('#nav-mobile-icon');

      if (mobileToggle && mobileDrawer) {
        mobileToggle.onclick = (e) => {
          e.stopPropagation();
          const notifDropdown = document.getElementById('notif-dropdown');
          if (notifDropdown) notifDropdown.style.display = 'none';
          const isOpen = mobileDrawer.classList.toggle('open');
          mobileToggle.setAttribute('aria-expanded', isOpen);
          if (mobileIcon) mobileIcon.textContent = isOpen ? '✕' : '☰';
          if (isOpen && langSwitcher) langSwitcher.classList.remove('open');
        };

        // Close drawer when clicking outside header
        document.addEventListener('click', (e) => {
          if (mobileDrawer.classList.contains('open') && !header.contains(e.target)) {
            mobileDrawer.classList.remove('open');
            mobileToggle.setAttribute('aria-expanded', 'false');
            if (mobileIcon) mobileIcon.textContent = '☰';
          }
        });

        // Close drawer when clicking any navigation link
        mobileDrawer.querySelectorAll('.mobile-drawer-link').forEach(link => {
          link.addEventListener('click', () => {
            mobileDrawer.classList.remove('open');
            mobileToggle.setAttribute('aria-expanded', 'false');
            if (mobileIcon) mobileIcon.textContent = '☰';
          });
        });
      }

      // Wire Up Theme Switchers (Both Desktop and Mobile Drawer)
      const toggleTheme = () => {
        this.playBeep('click');
        const currentTheme = (window.StrictStore ? window.StrictStore.get().theme : 'dark');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

        if (window.StrictStore) {
          window.StrictStore.update({ theme: nextTheme });
        }
        document.documentElement.setAttribute('data-theme', nextTheme);

        // Update desktop button
        const dBtn = document.getElementById('theme-toggle-btn');
        if (dBtn) dBtn.textContent = nextTheme === 'light' ? '☀️' : '🌙';

        // Update mobile drawer button
        const mIcon = document.getElementById('mobile-theme-icon');
        const mLabel = document.getElementById('mobile-theme-label');
        if (mIcon) mIcon.textContent = nextTheme === 'light' ? '☀️' : '🌙';
        if (mLabel) mLabel.textContent = nextTheme === 'light' ? 'Паперова тема' : 'Темна тема';

        const themeToastMessages = {
          uk: `Тему перемкнено на: ${nextTheme === 'light' ? 'Паперова (для читання)' : 'Темна (глибокий індиго)'}`,
          en: `Theme switched to: ${nextTheme === 'light' ? 'Paper (for reading)' : 'Dark (deep indigo)'}`,
          pl: `Zmieniono motyw na: ${nextTheme === 'light' ? 'Papierowy (do czytania)' : 'Ciemny (głęboki indygo)'}`,
          de: `Thema gewechselt zu: ${nextTheme === 'light' ? 'Papier (zum Lesen)' : 'Dunkel (tiefes Indigo)'}`
        };
        const curL = this._getCurrentLocale();
        this.toast(themeToastMessages[curL] || `Theme: ${nextTheme}`, 'info');
      };

      const desktopThemeBtn = header.querySelector('#theme-toggle-btn');
      if (desktopThemeBtn) desktopThemeBtn.onclick = toggleTheme;

      const mobileThemeBtn = header.querySelector('#mobile-theme-toggle-btn');
      if (mobileThemeBtn) mobileThemeBtn.onclick = toggleTheme;

      // Wire Up API Key Buttons (Desktop and Mobile Drawer)
      const openApiKey = () => {
        this.playBeep('click');
        if (mobileDrawer) {
          mobileDrawer.classList.remove('open');
          if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
          if (mobileIcon) mobileIcon.textContent = '☰';
        }
        this.openApiKeyModal();
      };

      const desktopApiKeyBtn = header.querySelector('#api-key-btn');
      if (desktopApiKeyBtn) desktopApiKeyBtn.onclick = openApiKey;

      const mobileApiKeyBtn = header.querySelector('#mobile-api-key-btn');
      if (mobileApiKeyBtn) mobileApiKeyBtn.onclick = openApiKey;

      // Sync Store badges
      if (window.StrictStore && typeof window.StrictStore.subscribe === 'function' && !this._storeSubscribed) {
        this._storeSubscribed = true;
        window.StrictStore.subscribe((state) => {
          const streakEl = document.getElementById('nav-streak-counter');
          const bambooEl = document.getElementById('nav-bamboo-counter');
          const mobileBambooEl = document.getElementById('nav-mobile-bamboo-counter');
          const sessionEl = document.getElementById('nav-session-timer');

          if (streakEl) streakEl.textContent = `${(state && state.student && state.student.streakDays) || 0}`;
          if (bambooEl) bambooEl.textContent = `${(state && state.student && state.student.bambooCoins) || 0}`;
          if (mobileBambooEl) mobileBambooEl.textContent = `${(state && state.student && state.student.bambooCoins) || 0}`;
          if (sessionEl && state && state.tracker && state.tracker.isSessionActive) {
            sessionEl.textContent = formatTime(state.tracker.sessionSecondsLeft || 0);
          }
        });
      }

      // Build / Update Fixed Mobile Bottom Tab Bar (< 768px)
      this._renderMobileBottomNav(activePageId, currentLocale);

      // Initialize Notification Dropdown & Badge
      this._initNotificationsUI();
      this._updateNotifBadge();

      // Translate DOM elements via StrictI18n if available
      if (window.StrictI18n && typeof window.StrictI18n.applyToDOM === 'function') {
        window.StrictI18n.applyToDOM();
      }
    }

    /**
     * Generates or updates the fixed bottom mobile navigation bar
     */
    _renderMobileBottomNav(activePageId, currentLocale) {
      let bottomNav = document.getElementById('mobile-bottom-nav');
      if (!bottomNav) {
        bottomNav = document.createElement('nav');
        bottomNav.id = 'mobile-bottom-nav';
        bottomNav.className = 'mobile-bottom-nav';
        bottomNav.setAttribute('aria-label', 'Мобільна навігація платформи');
        document.body.appendChild(bottomNav);
      }

      bottomNav.innerHTML = BOTTOM_NAV_PAGES.map(p => {
        const isActive = p.id === activePageId ? 'active' : '';
        const label = (p.labels && p.labels[currentLocale]) || (p.labels && p.labels.uk) || p.id;
        return `
          <a href="${p.url}" class="mobile-bottom-link ${isActive}" data-page-id="${p.id}" title="${label}">
            <span class="mobile-bottom-icon">${p.icon}</span>
            <span class="mobile-bottom-label">${label}</span>
          </a>
        `;
      }).join('');
    }

    /**
     * Modal dialog for AI API Key configuration
     */
    openApiKeyModal() {
      let modalBackdrop = document.getElementById('strict-api-modal');
      if (!modalBackdrop) {
        modalBackdrop = document.createElement('div');
        modalBackdrop.id = 'strict-api-modal';
        modalBackdrop.className = 'strict-modal-backdrop';
        document.body.appendChild(modalBackdrop);
      }

      const store = window.StrictStore ? window.StrictStore.get() : null;
      const currentProvider = store ? store.tutor.apiProvider : 'gemini';
      const currentKey = store ? store.tutor.apiKey : '';

      modalBackdrop.innerHTML = `
        <div class="strict-modal">
          <div class="modal-header">
            <div class="modal-title">⚙️ Налаштування AI Провайдера</div>
            <div class="modal-close-btn" id="modal-close-btn">&times;</div>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.92rem; margin-bottom: 18px; color: var(--text-secondary);">
              Платформа <strong>StrictAI</strong> працює як у режимі автономного тренажера, так і з підключенням обраної нейромережі для індивідуального репетитора. Ключ зберігається виключно локально у вашому браузері.
            </p>

            <div class="form-group">
              <label class="form-label">Оберіть AI Провайдера:</label>
              <select class="form-select" id="api-provider-select">
                <option value="gemini" ${currentProvider === 'gemini' ? 'selected' : ''}>Google Gemini (1.5 Flash / Pro) — Рекомендовано</option>
                <option value="openai" ${currentProvider === 'openai' ? 'selected' : ''}>OpenAI (GPT-4o / GPT-4o-mini)</option>
                <option value="groq" ${currentProvider === 'groq' ? 'selected' : ''}>Groq (Llama-3.3 70B — блискавична швидкість)</option>
                <option value="openrouter" ${currentProvider === 'openrouter' ? 'selected' : ''}>OpenRouter (Будь-яка відкрита модель)</option>
                <option value="mock" ${currentProvider === 'mock' ? 'selected' : ''}>Автономний інтелектуальний режим (Без API-ключа)</option>
              </select>
            </div>

            <div class="form-group" id="api-key-group">
              <label class="form-label">
                <span>API Ключ:</span>
                <span id="key-hint" style="font-size: 0.8rem; color: var(--text-muted); cursor: pointer;">Отримати ключ Gemini ↗</span>
              </label>
              <div style="position: relative;">
                <input type="password" id="api-key-input" class="form-input" placeholder="Введіть AIzaSy... або sk-..." value="${currentKey}">
                <button type="button" id="toggle-key-visibility" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.9rem; cursor: pointer;">👁</button>
              </div>
            </div>

            <div style="padding: 12px 16px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-md); font-size: 0.85rem; color: var(--accent-success);">
              🔒 <strong>Конфіденційність гарантовано:</strong> ключ не передається на сторонні сервери StrictAI і використовується для прямих запитів до обраного провайдера.
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" id="modal-cancel-btn">Скасувати</button>
            <button class="btn btn-primary btn-sm" id="modal-save-btn">Зберегти налаштування</button>
          </div>
        </div>
      `;

      modalBackdrop.classList.add('active');

      const close = () => {
        modalBackdrop.classList.remove('active');
      };

      modalBackdrop.querySelector('#modal-close-btn').onclick = close;
      modalBackdrop.querySelector('#modal-cancel-btn').onclick = close;

      modalBackdrop.onclick = (e) => {
        if (e.target === modalBackdrop) close();
      };

      const keyInput = modalBackdrop.querySelector('#api-key-input');
      const toggleVisBtn = modalBackdrop.querySelector('#toggle-key-visibility');
      if (toggleVisBtn && keyInput) {
        toggleVisBtn.onclick = () => {
          keyInput.type = keyInput.type === 'password' ? 'text' : 'password';
        };
      }

      const providerSelect = modalBackdrop.querySelector('#api-provider-select');
      const keyHint = modalBackdrop.querySelector('#key-hint');
      const keyGroup = modalBackdrop.querySelector('#api-key-group');

      const updateKeyHint = () => {
        if (providerSelect.value === 'mock') {
          keyGroup.style.display = 'none';
        } else {
          keyGroup.style.display = 'block';
          if (providerSelect.value === 'gemini') {
            keyHint.textContent = 'Отримати ключ Google AI Studio ↗';
          } else if (providerSelect.value === 'openai') {
            keyHint.textContent = 'Отримати ключ OpenAI ↗';
          } else if (providerSelect.value === 'groq') {
            keyHint.textContent = 'Отримати ключ GroqCloud ↗';
          } else if (providerSelect.value === 'openrouter') {
            keyHint.textContent = 'Отримати ключ OpenRouter ↗';
          }
        }
      };

      providerSelect.onchange = updateKeyHint;
      updateKeyHint();

      if (keyHint) {
        keyHint.onclick = () => {
          let url = 'https://aistudio.google.com/app/apikey';
          if (providerSelect.value === 'openai') url = 'https://platform.openai.com/api-keys';
          if (providerSelect.value === 'groq') url = 'https://console.groq.com/keys';
          if (providerSelect.value === 'openrouter') url = 'https://openrouter.ai/keys';
          window.open(url, '_blank');
        };
      }

      modalBackdrop.querySelector('#modal-save-btn').onclick = () => {
        const provider = providerSelect.value;
        const key = keyInput.value.trim();

        if (window.StrictStore) {
          window.StrictStore.update((st) => ({
            ...st,
            tutor: {
              ...st.tutor,
              apiProvider: provider,
              apiKey: key
            }
          }));
        }

        this.playBeep('success');
        this.toast(`Налаштування збережено! Провайдер: ${provider.toUpperCase()}`, 'success');
        close();
      };
    }

    /**
     * Toast notification trigger
     */
    toast(message, type = 'info') {
      let container = document.getElementById('strict-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'strict-toast-container';
        container.className = 'strict-toast-container';
        document.body.appendChild(container);
      }

      const toastEl = document.createElement('div');
      toastEl.className = `strict-toast ${type}`;

      const iconMap = {
        success: '✅',
        warning: '⚠️',
        error: '❌',
        info: 'ℹ️'
      };

      toastEl.innerHTML = `
        <span style="font-size: 1.15rem;">${iconMap[type] || 'ℹ️'}</span>
        <span>${message}</span>
      `;

      container.appendChild(toastEl);

      setTimeout(() => {
        toastEl.style.opacity = '0';
        toastEl.style.transform = 'translateY(10px)';
        toastEl.style.transition = 'all 0.3s ease';
        setTimeout(() => toastEl.remove(), 300);
      }, 3500);
    }

    /**
     * Initializes Global Notification Listeners (Missed Lessons & Click Outside)
     */
    _initNotificationListeners() {
      if (this._notifEventsAttached || typeof window === 'undefined') return;
      this._notifEventsAttached = true;

      window.addEventListener('strictai:notifications-updated', () => {
        this._updateNotifBadge();
        this._renderNotifications();
      });

      window.addEventListener('strictai:missed-lesson', () => {
        this._updateNotifBadge();
        this._renderNotifications();
      });

      document.addEventListener('click', (e) => {
        const notifWrapper = document.getElementById('notif-wrapper');
        const notifDropdown = document.getElementById('notif-dropdown');
        if (notifDropdown && notifDropdown.style.display !== 'none') {
          if (!notifWrapper || !notifWrapper.contains(e.target)) {
            notifDropdown.style.display = 'none';
          }
        }
      });
    }

    _escapeHtml(str) {
      if (typeof str !== 'string') return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    /**
     * Renders notification items in the dropdown
     */
    _renderNotifications() {
      const listEl = document.getElementById('notif-dropdown-list');
      if (!listEl) return;

      let alerts = [];
      if (window.StrictNotificationsData && Array.isArray(window.StrictNotificationsData.alerts)) {
        alerts = window.StrictNotificationsData.alerts;
      } else {
        try {
          const stored = JSON.parse(localStorage.getItem('strictai_notifications') || '{}');
          if (Array.isArray(stored.alerts)) {
            alerts = stored.alerts;
          }
        } catch (e) {
          alerts = [];
        }
      }

      if (!alerts || alerts.length === 0) {
        listEl.innerHTML = '<div class="notif-empty">Немає нових сповіщень 🎉</div>';
        return;
      }

      listEl.innerHTML = alerts.map(alert => `
        <div class="notif-item ${alert.read ? 'read' : 'unread'}" data-id="${this._escapeHtml(alert.id || '')}">
          <div class="notif-item-icon">⚠️</div>
          <div class="notif-item-content">
            <div class="notif-item-header">
              <strong class="notif-item-title">${this._escapeHtml(alert.title || 'Сповіщення')}</strong>
              <span class="notif-item-time">${this._escapeHtml(alert.time || '')}</span>
            </div>
            <div class="notif-item-msg">${this._escapeHtml(alert.message || '')}</div>
          </div>
        </div>
      `).join('');
    }

    /**
     * Updates notification badge unread counter
     */
    _updateNotifBadge() {
      let alerts = [];
      if (window.StrictNotificationsData && Array.isArray(window.StrictNotificationsData.alerts)) {
        alerts = window.StrictNotificationsData.alerts;
      } else {
        try {
          const stored = JSON.parse(localStorage.getItem('strictai_notifications') || '{}');
          if (Array.isArray(stored.alerts)) {
            alerts = stored.alerts;
          }
        } catch (e) {
          alerts = [];
        }
      }

      const count = alerts.filter(a => !a.read).length;
      const notifBadge = document.getElementById('notif-badge');
      if (notifBadge) {
        if (count > 0) {
          notifBadge.style.display = 'inline-flex';
          notifBadge.textContent = count > 99 ? '99+' : `${count}`;
        } else {
          notifBadge.style.display = 'none';
          notifBadge.textContent = '0';
        }
      }
    }

    /**
     * Wires up notification UI interactions
     */
    _initNotificationsUI() {
      const bellBtn = document.getElementById('notif-bell-btn');
      const notifDropdown = document.getElementById('notif-dropdown');
      const markReadBtn = document.getElementById('notif-mark-read-btn');
      const simulateBtn = document.getElementById('btn-simulate-missed-lesson');
      const langSwitcher = document.getElementById('lang-switcher');

      if (bellBtn && notifDropdown) {
        bellBtn.onclick = (e) => {
          e.stopPropagation();
          this.playBeep('click');
          const isHidden = notifDropdown.style.display === 'none' || notifDropdown.style.display === '';
          if (isHidden) {
            if (langSwitcher) langSwitcher.classList.remove('open');
            notifDropdown.style.display = 'flex';
            this._renderNotifications();
          } else {
            notifDropdown.style.display = 'none';
          }
        };
      }

      if (markReadBtn) {
        markReadBtn.onclick = (e) => {
          e.stopPropagation();
          this.playBeep('click');
          if (window.StrictNotificationsData && Array.isArray(window.StrictNotificationsData.alerts)) {
            window.StrictNotificationsData.alerts.forEach(a => { a.read = true; });
          }
          if (window.StrictNotifications && typeof window.StrictNotifications.saveStore === 'function') {
            window.StrictNotifications.saveStore();
          } else {
            try {
              const stored = JSON.parse(localStorage.getItem('strictai_notifications') || '{}');
              if (Array.isArray(stored.alerts)) {
                stored.alerts.forEach(a => { a.read = true; });
                localStorage.setItem('strictai_notifications', JSON.stringify(stored));
              }
            } catch (err) {}
          }
          this._updateNotifBadge();
          this._renderNotifications();
        };
      }

      if (simulateBtn) {
        simulateBtn.onclick = (e) => {
          e.stopPropagation();
          this.playBeep('alert');
          if (window.StrictNotifications && typeof window.StrictNotifications.triggerMissedLessonAlert === 'function') {
            window.StrictNotifications.triggerMissedLessonAlert('Англійська мова / NMT');
          } else {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const alertObj = {
              id: 'notif_' + Date.now(),
              title: '⚠️ Пропущено плановий урок!',
              message: 'Учень Антон не розпочав заняття з Англійська мова / NMT о 17:00. Батькам надіслано сповіщення у Батьківський контроль.',
              time: timeStr,
              scheduledTime: '17:00',
              studentName: 'Антон',
              timestamp: Date.now(),
              read: false,
              subject: 'Англійська мова / NMT'
            };
            if (!window.StrictNotificationsData) {
              window.StrictNotificationsData = { alerts: [], settings: { lessonTime: '17:00', enabled: true } };
            }
            window.StrictNotificationsData.alerts.unshift(alertObj);
            try {
              localStorage.setItem('strictai_notifications', JSON.stringify(window.StrictNotificationsData));
            } catch (err) {}
            this.toast('🔔 Пропущено плановий урок: Англійська мова / NMT (17:00) — Антон', 'warning');
          }
          this._renderNotifications();
          this._updateNotifBadge();
        };
      }
    }
  }

  // React Component representation for modular imports & JSX/createElement usage
  function StrictNavbarComponent(props) {
    if (typeof window === 'undefined' || !window.React) return null;
    const React = window.React;
    const currentLocale = (props && props.locale) || (window.StrictComponents ? window.StrictComponents._getCurrentLocale() : 'uk');
    const activePageId = (props && props.activePageId) || 'index';
    const activeTitles = NAV_TITLES[currentLocale] || NAV_TITLES.uk;

    return React.createElement(
      'ul',
      { className: 'nav-links strict-nav-links', id: 'nav-links-menu' },
      NAV_ITEMS.map((item) => {
        const itemKey = item.id === 'index' ? 'home' : item.id;
        const title = activeTitles[itemKey] || activeTitles[item.id] || item.label;
        const isActive = (item.id === activePageId || (item.id === 'index' && activePageId === 'home') || (item.id === 'home' && activePageId === 'index'));

        return React.createElement(
          'li',
          { key: item.id },
          React.createElement(
            'a',
            {
              href: item.url || item.href,
              className: `nav-link strict-nav-link ${isActive ? 'active' : ''}`,
              'data-page': item.id,
              title: title
            },
            React.createElement('span', null, item.icon),
            React.createElement('span', { 'data-i18n': item.i18nKey || `nav.${itemKey}` }, title)
          )
        );
      })
    );
  }

  // Static references on class
  StrictComponentsController.NAV_ITEMS = NAV_ITEMS;
  StrictComponentsController.NAV_TITLES = NAV_TITLES;
  StrictComponentsController.BOTTOM_NAV_PAGES = BOTTOM_NAV_PAGES;
  StrictComponentsController.StrictNavbarComponent = StrictNavbarComponent;

  // Export Singleton on window
  window.StrictComponents = new StrictComponentsController();
  window.StrictComponents.NAV_ITEMS = NAV_ITEMS;
  window.StrictComponents.NAV_TITLES = NAV_TITLES;
  window.StrictComponents.BOTTOM_NAV_PAGES = BOTTOM_NAV_PAGES;
  window.StrictComponents.StrictNavbar = StrictNavbarComponent;
  window.StrictNavbar = StrictNavbarComponent;

})();
