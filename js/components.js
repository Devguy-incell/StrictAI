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

  const BOTTOM_NAV_PAGES = [
    { id: 'index', url: 'index.html', icon: '🏠', labels: { uk: 'Головна', en: 'Home', pl: 'Start', de: 'Start' } },
    { id: 'tutor', url: 'tutor.html', icon: '🐼', labels: { uk: 'Репетитор', en: 'Tutor', pl: 'Tutor', de: 'Tutor' } },
    { id: 'nmt', url: 'nmt.html', icon: '📝', labels: { uk: 'НМТ', en: 'NMT', pl: 'NMT', de: 'NMT' } },
    { id: 'tracker', url: 'tracker.html', icon: '⏱', labels: { uk: 'Трекер', en: 'Tracker', pl: 'Tracker', de: 'Tracker' } },
    { id: 'parents', url: 'parents.html', icon: '🛡', labels: { uk: 'Батьки', en: 'Parents', pl: 'Rodzice', de: 'Eltern' } },
    { id: 'knowledge', url: 'knowledge.html', icon: '🗺', labels: { uk: 'Знання', en: 'Knowledge', pl: 'Wiedza', de: 'Wissen' } }
  ];

  class StrictComponentsController {
    constructor() {
      this.audioCtx = null;
      this.lastBlurTime = 0;
      this.currentPageId = 'index';
      this._localeListenerAttached = false;
      this._storeSubscribed = false;

      this._initAudioContext();
      this._initFocusGuard();
      this._initLocaleListener();
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
            if (window.StrictI18n && typeof window.StrictI18n.applyToDOM === 'function') {
              window.StrictI18n.applyToDOM();
            }
          };
          document.head.appendChild(s);
        }
      }
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
     * Helper to get current locale from StrictI18n, StrictStore, or localStorage
     */
    _getCurrentLocale() {
      if (window.StrictI18n && window.StrictI18n.currentLocale) {
        return window.StrictI18n.currentLocale;
      }
      if (window.StrictStore) {
        const st = window.StrictStore.get();
        if (st && st.locale) return st.locale;
      }
      try {
        if (typeof localStorage !== 'undefined') {
          const saved = localStorage.getItem('strictai_locale');
          if (saved) return saved;
        }
      } catch (e) {}
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
        this._updateUIForLocale(newLocale);
        if (window.StrictI18n && typeof window.StrictI18n.applyToDOM === 'function') {
          window.StrictI18n.applyToDOM();
        }
      });
    }

    /**
     * Changes platform language across i18n, Store, UI and triggers toast
     * @param {string} langCode - 'uk' | 'en' | 'pl' | 'de'
     */
    setLanguage(langCode) {
      this.playBeep('click');
      let activeCode = langCode;

      if (window.StrictI18n && typeof window.StrictI18n.setLocale === 'function') {
        activeCode = window.StrictI18n.setLocale(langCode);
      } else {
        if (window.StrictStore && typeof window.StrictStore.update === 'function') {
          window.StrictStore.update({ locale: langCode });
        }
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('strictai_locale', langCode);
          }
        } catch (e) {}
      }

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

      const navTitles = {
        uk: { home: 'Головна', tutor: 'AI-Репетитор', nmt: 'Тренажер НМТ', tracker: 'Контроль & Фокус', parents: 'Батьківський кабінет', knowledge: 'Карта знань' },
        en: { home: 'Home', tutor: 'AI Tutor', nmt: 'NMT Simulator', tracker: 'Focus & Tracker', parents: 'Parents Portal', knowledge: 'Knowledge Map' },
        pl: { home: 'Start', tutor: 'AI Korepetytor', nmt: 'Symulator NMT', tracker: 'Kontrola & Focus', parents: 'Panel Rodziców', knowledge: 'Mapa Wiedzy' },
        de: { home: 'Start', tutor: 'AI Tutor', nmt: 'NMT Simulator', tracker: 'Fokus & Tracker', parents: 'Elternbereich', knowledge: 'Wissenskarte' }
      };
      const activeTitles = navTitles[currentLocale] || navTitles.uk;

      const pages = [
        { id: 'index', title: activeTitles.home, url: 'index.html', icon: '🏠' },
        { id: 'tutor', title: activeTitles.tutor, url: 'tutor.html', icon: '🐼' },
        { id: 'nmt', title: activeTitles.nmt, url: 'nmt.html', icon: '📝' },
        { id: 'tracker', title: activeTitles.tracker, url: 'tracker.html', icon: '⏱' },
        { id: 'parents', title: activeTitles.parents, url: 'parents.html', icon: '🛡' },
        { id: 'knowledge', title: activeTitles.knowledge, url: 'knowledge.html', icon: '🗺' }
      ];

      const navLinksHtml = pages.map(p => {
        const isActive = p.id === activePageId ? 'active' : '';
        return `
          <li>
            <a href="${p.url}" class="nav-link ${isActive}" data-page="${p.id}">
              <span>${p.icon}</span>
              <span data-i18n="nav.${p.id}">${p.title}</span>
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
        <div class="strict-container nav-inner">
          <a href="index.html" class="nav-brand" title="StrictAI — Головна сторінка">
            <div class="nav-brand-badge">🐼</div>
            <div>Strict<span class="nav-brand-highlight">AI</span></div>
          </a>

          <!-- Desktop Nav Links -->
          <ul class="nav-links" id="nav-links-menu">
            ${navLinksHtml}
          </ul>

          <!-- Nav Actions (Top Bar) -->
          <div class="nav-actions">
            ${sessionBadgeHtml}

            <!-- Compact Language Switcher Dropdown -->
            ${langSwitcherHtml}

            <!-- Streak Badge (Compact, fits on 390px) -->
            <div class="nav-badge streak" title="Твій поточний щоденний стрік занять">
              <span>🔥</span>
              <span id="nav-streak-counter">${store.student.streakDays || 12}</span><span class="streak-days-text"> ${{ uk: 'дн.', en: 'd', pl: 'dn.', de: 'T.' }[currentLocale] || 'дн.'}</span>
            </div>

            <!-- Desktop Only: Bamboo Coins Badge -->
            <div class="nav-badge bamboo desktop-only-action" title="Бамбук-коїни за фокус та розібрані завдання">
              <span>🎋</span>
              <span id="nav-bamboo-counter">${store.student.bambooCoins || 340}</span>
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
              <span id="nav-mobile-bamboo-counter">${store.student.bambooCoins || 340}</span>
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
                  <span class="drawer-link-title" data-i18n="nav.${p.id}">${p.title}</span>
                  ${p.id === activePageId ? '<span class="drawer-link-dot">●</span>' : ''}
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      `;

      // Wire Up Top Bar Language Switcher Dropdown
      const langSwitcher = header.querySelector('#lang-switcher');
      const langBtn = header.querySelector('#lang-switcher-btn');
      if (langSwitcher && langBtn) {
        langBtn.onclick = (e) => {
          e.stopPropagation();
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
      if (window.StrictStore && !this._storeSubscribed) {
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
  }

  // Export Singleton on window
  window.StrictComponents = new StrictComponentsController();

})();
