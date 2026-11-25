/**
 * StrictAI Shared Application Shell
 * Theme, i18n language switcher, fixed header, account popover, mobile drawer,
 * architectural footer, sticky CTA bar, toast stack, and formatting utilities.
 * Zero emojis. Uses StrictIcons and StrictAuth when present.
 */
(function (globalScope) {
  'use strict';

  var STORAGE_KEY_THEME = 'strictai_theme';
  var STORAGE_KEY_LANG = 'strictai_lang';
  var VALID_THEMES = { light: true, dark: true };
  var VALID_LANGS = ['UA', 'EN', 'PL', 'DE'];
  var HTML_LANG_MAP = {
    UA: 'uk',
    EN: 'en',
    PL: 'pl',
    DE: 'de'
  };

  var I18N = {
    UA: {
      navOverview: 'Огляд',
      navDiagnostic: 'Діагностика',
      navStrictPass: 'StrictPass',
      navParents: 'Для батьків',
      signIn: 'Увійти',
      roleStudent: 'Учень',
      roleParent: 'Батьки',
      accountProfile: 'Акаунт і безпека',
      accountPass: 'Керування StrictPass',
      signOut: 'Вийти',
      signedOutToast: 'Сесію завершено',
      signOutFailed: 'Не вдалося вийти з акаунта',
      themeToggleToDark: 'Увімкнути темну тему',
      themeToggleToLight: 'Увімкнути світлу тему',
      themeLabelLight: 'Світла тема',
      themeLabelDark: 'Темна тема',
      menuOpen: 'Відкрити меню',
      menuClose: 'Закрити меню',
      langLabel: 'Мова інтерфейсу',
      copiedDefault: 'Скопійовано до буфера обміну',
      copyFailed: 'Не вдалося скопіювати текст',
      footerTagline: 'Система точного діагностичного оцінювання та супроводу підготовки до НМТ.',
      footerColNav: 'Навігація',
      footerColAccess: 'Акаунт і доступ',
      footerColSpecs: 'Стандарт системи',
      footerLinkAuth: 'Вхід та профіль',
      footerLinkPass: 'Активація StrictPass',
      footerLinkParents: 'Батьківський контроль',
      footerLinkDiagnostic: 'Діагностичний тест',
      footerSpecFormat: 'Формат: 4-блокова діагностика НМТ',
      footerSpecSync: 'Шифрування: WebCrypto SHA-256 + HMAC',
      footerSpecLangs: 'Локалізація: UA / EN / PL / DE',
      footerRights: 'StrictAI Diagnostic Platform. Усі права захищено.',
      modeCloud: 'Cloud Sync',
      modeVault: 'Local Vault',
      stickyTitle: 'Перевірте готовність до НМТ за 12 хвилин',
      stickySub: 'Точний профіль прогалин та персональний план на тиждень',
      stickyBtn: 'Почати діагностику',
      stickyTitleDiagnostic: 'Збережіть результати та відкрийте повний розбір',
      stickySubDiagnostic: 'Активація StrictPass для учня або родини без прихованих платежів',
      stickyBtnDiagnostic: 'Обрати StrictPass'
    },
    EN: {
      navOverview: 'Overview',
      navDiagnostic: 'Diagnostic',
      navStrictPass: 'StrictPass',
      navParents: 'For Parents',
      signIn: 'Sign in',
      roleStudent: 'Student',
      roleParent: 'Parent',
      accountProfile: 'Account & security',
      accountPass: 'Manage StrictPass',
      signOut: 'Sign out',
      signedOutToast: 'Session ended',
      signOutFailed: 'Could not sign out',
      themeToggleToDark: 'Switch to dark theme',
      themeToggleToLight: 'Switch to light theme',
      themeLabelLight: 'Light theme',
      themeLabelDark: 'Dark theme',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
      langLabel: 'Interface language',
      copiedDefault: 'Copied to clipboard',
      copyFailed: 'Failed to copy text',
      footerTagline: 'Precision diagnostic assessment and structured NMT preparation system.',
      footerColNav: 'Navigation',
      footerColAccess: 'Account & Access',
      footerColSpecs: 'System Standard',
      footerLinkAuth: 'Sign in & profile',
      footerLinkPass: 'Activate StrictPass',
      footerLinkParents: 'Parent portal',
      footerLinkDiagnostic: 'Diagnostic test',
      footerSpecFormat: 'Format: 4-module NMT diagnostic',
      footerSpecSync: 'Security: WebCrypto SHA-256 + HMAC',
      footerSpecLangs: 'Locales: UA / EN / PL / DE',
      footerRights: 'StrictAI Diagnostic Platform. All rights reserved.',
      modeCloud: 'Cloud Sync',
      modeVault: 'Local Vault',
      stickyTitle: 'Measure your NMT readiness in 12 minutes',
      stickySub: 'Exact gap profile and a structured 7-day study plan',
      stickyBtn: 'Start diagnostic',
      stickyTitleDiagnostic: 'Save your results and unlock full breakdown',
      stickySubDiagnostic: 'Activate StrictPass for student or family with transparent pricing',
      stickyBtnDiagnostic: 'View StrictPass'
    },
    PL: {
      navOverview: 'Przeglad',
      navDiagnostic: 'Diagnostyka',
      navStrictPass: 'StrictPass',
      navParents: 'Dla rodzicow',
      signIn: 'Zaloguj sie',
      roleStudent: 'Uczen',
      roleParent: 'Rodzic',
      accountProfile: 'Konto i bezpieczenstwo',
      accountPass: 'Zarzadzaj StrictPass',
      signOut: 'Wyloguj',
      signedOutToast: 'Sesja zakonczona',
      signOutFailed: 'Nie udalo sie wylogowac',
      themeToggleToDark: 'Wlacz ciemny motyw',
      themeToggleToLight: 'Wlacz jasny motyw',
      themeLabelLight: 'Jasny motyw',
      themeLabelDark: 'Ciemny motyw',
      menuOpen: 'Otworz menu',
      menuClose: 'Zamknij menu',
      langLabel: 'Jezyk interfejsu',
      copiedDefault: 'Skopiowano do schowka',
      copyFailed: 'Nie udalo sie skopiowac',
      footerTagline: 'System precyzyjnej oceny diagnostycznej i przygotowania do egzaminu NMT.',
      footerColNav: 'Nawigacja',
      footerColAccess: 'Konto i dostep',
      footerColSpecs: 'Standard systemu',
      footerLinkAuth: 'Logowanie i profil',
      footerLinkPass: 'Aktywacja StrictPass',
      footerLinkParents: 'Panel rodzica',
      footerLinkDiagnostic: 'Test diagnostyczny',
      footerSpecFormat: 'Format: 4-modulowa diagnostyka NMT',
      footerSpecSync: 'Ochrona: WebCrypto SHA-256 + HMAC',
      footerSpecLangs: 'Jezyki: UA / EN / PL / DE',
      footerRights: 'StrictAI Diagnostic Platform. Wszelkie prawa zastrzezone.',
      modeCloud: 'Cloud Sync',
      modeVault: 'Local Vault',
      stickyTitle: 'Sprawdz gotowosc do NMT w 12 minut',
      stickySub: 'Dokladny profil luk i plan nauki na najblizszy tydzien',
      stickyBtn: 'Rozpocznij diagnostyke',
      stickyTitleDiagnostic: 'Zapisz wyniki i odblokuj pelna analize',
      stickySubDiagnostic: 'Aktywuj StrictPass dla ucznia lub calej rodziny',
      stickyBtnDiagnostic: 'Wybierz StrictPass'
    },
    DE: {
      navOverview: 'Ubersicht',
      navDiagnostic: 'Diagnostik',
      navStrictPass: 'StrictPass',
      navParents: 'Fur Eltern',
      signIn: 'Anmelden',
      roleStudent: 'Schuler',
      roleParent: 'Eltern',
      accountProfile: 'Konto & Sicherheit',
      accountPass: 'StrictPass verwalten',
      signOut: 'Abmelden',
      signedOutToast: 'Sitzung beendet',
      signOutFailed: 'Abmeldung fehlgeschlagen',
      themeToggleToDark: 'Dunkles Design aktivieren',
      themeToggleToLight: 'Helles Design aktivieren',
      themeLabelLight: 'Helles Design',
      themeLabelDark: 'Dunkles Design',
      menuOpen: 'Menu offnen',
      menuClose: 'Menu schliessen',
      langLabel: 'Sprache',
      copiedDefault: 'In die Zwischenablage kopiert',
      copyFailed: 'Kopieren fehlgeschlagen',
      footerTagline: 'Prazises Diagnosesystem und strukturierte Vorbereitung auf die NMT-Prufung.',
      footerColNav: 'Navigation',
      footerColAccess: 'Konto & Zugang',
      footerColSpecs: 'Systemstandard',
      footerLinkAuth: 'Anmeldung & Profil',
      footerLinkPass: 'StrictPass aktivieren',
      footerLinkParents: 'Elternbereich',
      footerLinkDiagnostic: 'Diagnosetest',
      footerSpecFormat: 'Format: 4-Modul-NMT-Diagnostik',
      footerSpecSync: 'Sicherheit: WebCrypto SHA-256 + HMAC',
      footerSpecLangs: 'Sprachen: UA / EN / PL / DE',
      footerRights: 'StrictAI Diagnostic Platform. Alle Rechte vorbehalten.',
      modeCloud: 'Cloud Sync',
      modeVault: 'Local Vault',
      stickyTitle: 'NMT-Bereitschaft in 12 Minuten prufen',
      stickySub: 'Prazises Luckenprofil und Wochenplan ohne Umwege',
      stickyBtn: 'Diagnostik starten',
      stickyTitleDiagnostic: 'Ergebnisse sichern und Analyse freischalten',
      stickySubDiagnostic: 'StrictPass fur Einzelpersonen oder Familien aktivieren',
      stickyBtnDiagnostic: 'StrictPass ansehen'
    }
  };

  var shellState = {
    theme: 'light',
    lang: 'UA',
    user: null,
    authSubscribed: false,
    popoverOpen: false,
    drawerOpen: false,
    stickyMounted: false,
    scrollBound: false,
    docEventsBound: false
  };

  function hasWindow() {
    return typeof window !== 'undefined';
  }

  function hasDocument() {
    return typeof document !== 'undefined';
  }

  function storageGet(key) {
    try {
      if (hasWindow() && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (_err) {
      /* ignore storage access errors */
    }
    return null;
  }

  function storageSet(key, value) {
    try {
      if (hasWindow() && window.localStorage) {
        window.localStorage.setItem(key, String(value));
      }
    } catch (_err) {
      /* ignore storage quota or privacy restrictions */
    }
  }

  function normalizeTheme(theme) {
    var candidate = String(theme || '').trim().toLowerCase();
    return VALID_THEMES[candidate] ? candidate : 'light';
  }

  function normalizeLang(lang) {
    var upper = String(lang || '').trim().toUpperCase();
    if (upper === 'UK') {
      return 'UA';
    }
    return VALID_LANGS.indexOf(upper) !== -1 ? upper : 'UA';
  }

  function tr(key) {
    var dict = I18N[shellState.lang] || I18N.UA;
    if (Object.prototype.hasOwnProperty.call(dict, key)) {
      return dict[key];
    }
    return I18N.UA[key] || key;
  }

  function iconSvg(name, size, className) {
    if (hasWindow() && window.StrictIcons && typeof window.StrictIcons.svg === 'function') {
      return window.StrictIcons.svg(name, size, className);
    }
    return '';
  }

  function escapeHtml(str) {
    return String(str === undefined || str === null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatUah(num) {
    var n = Number(num);
    if (!isFinite(n)) {
      n = 0;
    }
    var rounded = Math.round(n);
    var sign = rounded < 0 ? '-' : '';
    var absStr = String(Math.abs(rounded));
    var grouped = absStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return sign + grouped + ' \u20B4';
  }

  function dispatchShellEvent(eventName, detail) {
    if (!hasDocument()) {
      return;
    }
    try {
      document.dispatchEvent(new CustomEvent(eventName, {
        bubbles: true,
        detail: detail
      }));
    } catch (_err) {
      /* ignore CustomEvent errors in constrained environments */
    }
  }

  function applyThemeToDom(theme) {
    if (!hasDocument() || !document.documentElement) {
      return;
    }
    document.documentElement.dataset.theme = theme;
  }

  function applyLangToDom(lang) {
    if (!hasDocument() || !document.documentElement) {
      return;
    }
    document.documentElement.dataset.lang = lang;
    document.documentElement.lang = HTML_LANG_MAP[lang] || 'uk';
  }

  function getTheme() {
    return shellState.theme;
  }

  function setTheme(nextTheme) {
    var normalized = normalizeTheme(nextTheme);
    var changed = shellState.theme !== normalized;
    shellState.theme = normalized;
    storageSet(STORAGE_KEY_THEME, normalized);
    applyThemeToDom(normalized);
    updateThemeButtons();
    if (changed) {
      dispatchShellEvent('strictai:themechange', { theme: normalized });
    }
    return normalized;
  }

  function toggleTheme() {
    return setTheme(shellState.theme === 'dark' ? 'light' : 'dark');
  }

  function getLang() {
    return shellState.lang;
  }

  function setLang(nextLang) {
    var normalized = normalizeLang(nextLang);
    var changed = shellState.lang !== normalized;
    shellState.lang = normalized;
    storageSet(STORAGE_KEY_LANG, normalized);
    applyLangToDom(normalized);
    if (hasDocument()) {
      if (document.getElementById('sa-header')) {
        mountHeader();
      }
      if (document.getElementById('sa-footer')) {
        mountFooter();
      }
      if (shellState.stickyMounted) {
        mountStickyCta();
      }
    }
    if (changed) {
      dispatchShellEvent('strictai:langchange', { lang: normalized });
    }
    return normalized;
  }

  /* Initialize theme and language immediately to minimize flash */
  (function initPreferences() {
    var savedTheme = storageGet(STORAGE_KEY_THEME);
    shellState.theme = normalizeTheme(savedTheme || 'light');
    applyThemeToDom(shellState.theme);

    var savedLang = storageGet(STORAGE_KEY_LANG);
    shellState.lang = normalizeLang(savedLang || 'UA');
    applyLangToDom(shellState.lang);
  })();

  /* ------------------------------------------------------------------ */
  /* Toast Notifications & Clipboard                                    */
  /* ------------------------------------------------------------------ */

  function ensureToastStack() {
    if (!hasDocument() || !document.body) {
      return null;
    }
    var stack = document.getElementById('sa-toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.id = 'sa-toast-stack';
      stack.className = 'sa-toast-stack';
      stack.setAttribute('aria-live', 'polite');
      stack.setAttribute('aria-atomic', 'false');
      document.body.appendChild(stack);
    }
    return stack;
  }

  function normalizeToastType(type) {
    var t = String(type || 'info').toLowerCase();
    if (t === 'success' || t === 'ok') return 'ok';
    if (t === 'warn' || t === 'warning') return 'warn';
    if (t === 'error' || t === 'danger') return 'danger';
    return 'info';
  }

  function toast(message, type) {
    var stack = ensureToastStack();
    if (!stack) {
      return null;
    }
    var kind = normalizeToastType(type);
    var iconName = kind === 'ok'
      ? 'checkCircle'
      : (kind === 'warn' ? 'alertTriangle' : (kind === 'danger' ? 'alertCircle' : 'spark'));

    var el = document.createElement('div');
    el.className = 'sa-toast sa-toast-' + kind;
    el.setAttribute('role', kind === 'danger' ? 'alert' : 'status');
    el.innerHTML =
      '<span class="sa-toast-icon">' + iconSvg(iconName, 17) + '</span>' +
      '<span>' + escapeHtml(message) + '</span>';

    stack.appendChild(el);

    var raf = hasWindow() && window.requestAnimationFrame
      ? window.requestAnimationFrame
      : function (fn) { return setTimeout(fn, 16); };

    raf(function () {
      el.classList.add('is-visible');
    });

    var dismissed = false;
    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      el.classList.remove('is-visible');
      setTimeout(function () {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }, 220);
    }

    el.addEventListener('click', dismiss);
    setTimeout(dismiss, 3800);
    return el;
  }

  async function copyText(text, successMsg) {
    var value = String(text === undefined || text === null ? '' : text);
    var okMsg = successMsg || tr('copiedDefault');
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(value);
        toast(okMsg, 'ok');
        return true;
      }
    } catch (_err) {
      /* fall through to legacy copy */
    }

    if (hasDocument() && document.body) {
      try {
        var area = document.createElement('textarea');
        area.value = value;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.top = '-9999px';
        area.style.left = '-9999px';
        document.body.appendChild(area);
        area.select();
        var copied = document.execCommand('copy');
        document.body.removeChild(area);
        if (copied) {
          toast(okMsg, 'ok');
          return true;
        }
      } catch (_err2) {
        /* ignore */
      }
    }

    toast(tr('copyFailed'), 'danger');
    return false;
  }

  /* ------------------------------------------------------------------ */
  /* Active Route & Auth Integration Helpers                            */
  /* ------------------------------------------------------------------ */

  function detectActivePage() {
    if (hasDocument() && document.body && document.body.dataset && document.body.dataset.page) {
      var explicit = String(document.body.dataset.page).trim().toLowerCase();
      if (explicit === 'overview' || explicit === 'home') return 'index';
      return explicit;
    }
    if (!hasWindow() || !window.location) {
      return 'index';
    }
    var path = String(window.location.pathname || '').toLowerCase();
    var seg = path.split('/').pop() || '';
    if (!seg || seg === 'index.html') return 'index';
    if (seg.indexOf('diagnostic') !== -1) return 'diagnostic';
    if (seg.indexOf('strictpass') !== -1) return 'strictpass';
    if (seg.indexOf('parents') !== -1) return 'parents';
    if (seg.indexOf('auth') !== -1) return 'auth';
    return 'index';
  }

  function getNavItems() {
    return [
      { id: 'index', href: 'index.html', label: tr('navOverview') },
      { id: 'diagnostic', href: 'diagnostic.html', label: tr('navDiagnostic') },
      { id: 'strictpass', href: 'strictpass.html', label: tr('navStrictPass') },
      { id: 'parents', href: 'parents.html', label: tr('navParents') }
    ];
  }

  function getAuthUser() {
    if (shellState.user) {
      return shellState.user;
    }
    if (hasWindow() && window.StrictAuth && typeof window.StrictAuth.getCurrentUser === 'function') {
      return window.StrictAuth.getCurrentUser();
    }
    return null;
  }

  function getFirebaseModeInfo() {
    if (hasWindow() && window.StrictAuth && typeof window.StrictAuth.getFirebaseStatus === 'function') {
      var status = window.StrictAuth.getFirebaseStatus();
      if (status) {
        return {
          mode: status.mode === 'firebase' ? 'firebase' : 'vault',
          projectId: status.projectId || 'strictai-local-vault'
        };
      }
    }
    return {
      mode: 'vault',
      projectId: 'strictai-local-vault'
    };
  }

  function ensureAuthSubscription() {
    if (shellState.authSubscribed) {
      return;
    }
    if (!hasWindow() || !window.StrictAuth) {
      return;
    }
    shellState.authSubscribed = true;
    if (typeof window.StrictAuth.onChange === 'function') {
      window.StrictAuth.onChange(function (user) {
        shellState.user = user || null;
        renderAuthSlot();
        renderDrawerAuth();
        updateFooterMode();
      });
    }
    if (typeof window.StrictAuth.init === 'function') {
      Promise.resolve(window.StrictAuth.init()).then(function () {
        if (typeof window.StrictAuth.getCurrentUser === 'function') {
          shellState.user = window.StrictAuth.getCurrentUser();
        }
        renderAuthSlot();
        renderDrawerAuth();
        updateFooterMode();
      }).catch(function () {
        /* keep fallback vault UI intact */
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Header, Account Popover & Mobile Drawer                            */
  /* ------------------------------------------------------------------ */

  function updateThemeButtons() {
    if (!hasDocument()) {
      return;
    }
    var isDark = shellState.theme === 'dark';
    var nextIcon = isDark ? 'sun' : 'moon';
    var aria = isDark ? tr('themeToggleToLight') : tr('themeToggleToDark');
    var label = isDark ? tr('themeLabelDark') : tr('themeLabelLight');

    var desktopBtn = document.getElementById('sa-theme-toggle');
    if (desktopBtn) {
      desktopBtn.setAttribute('aria-label', aria);
      desktopBtn.setAttribute('title', aria);
      desktopBtn.innerHTML = iconSvg(nextIcon, 17);
    }

    var drawerBtn = document.getElementById('sa-drawer-theme-btn');
    if (drawerBtn) {
      drawerBtn.setAttribute('aria-label', aria);
      drawerBtn.innerHTML =
        '<span class="sa-row">' + iconSvg(nextIcon, 16) + '<span>' + escapeHtml(label) + '</span></span>' +
        '<span class="sa-badge">' + (isDark ? 'DARK' : 'LIGHT') + '</span>';
    }
  }

  function setPopoverOpen(open) {
    shellState.popoverOpen = Boolean(open);
    if (!hasDocument()) {
      return;
    }
    var pop = document.getElementById('sa-account-popover');
    var trigger = document.getElementById('sa-auth-trigger');
    if (pop) {
      pop.classList.toggle('is-open', shellState.popoverOpen);
    }
    if (trigger) {
      trigger.setAttribute('aria-expanded', shellState.popoverOpen ? 'true' : 'false');
    }
  }

  function setDrawerOpen(open) {
    shellState.drawerOpen = Boolean(open);
    if (!hasDocument()) {
      return;
    }
    var drawer = document.getElementById('sa-mobile-drawer');
    var backdrop = document.getElementById('sa-drawer-backdrop');
    var toggle = document.getElementById('sa-mobile-toggle');

    if (drawer) {
      drawer.classList.toggle('is-open', shellState.drawerOpen);
      drawer.setAttribute('aria-hidden', shellState.drawerOpen ? 'false' : 'true');
    }
    if (backdrop) {
      backdrop.classList.toggle('is-open', shellState.drawerOpen);
    }
    if (toggle) {
      toggle.setAttribute('aria-expanded', shellState.drawerOpen ? 'true' : 'false');
    }
    if (document.body) {
      document.body.classList.toggle('sa-drawer-open', shellState.drawerOpen);
    }
  }

  async function handleSignOut() {
    setPopoverOpen(false);
    setDrawerOpen(false);
    if (hasWindow() && window.StrictAuth && typeof window.StrictAuth.signOut === 'function') {
      try {
        await window.StrictAuth.signOut();
        shellState.user = null;
        renderAuthSlot();
        renderDrawerAuth();
        toast(tr('signedOutToast'), 'ok');
      } catch (_err) {
        toast(tr('signOutFailed'), 'danger');
      }
    }
  }

  function renderAuthSlot() {
    if (!hasDocument()) {
      return;
    }
    var slot = document.getElementById('sa-auth-slot');
    if (!slot) {
      return;
    }
    var user = getAuthUser();
    if (!user) {
      setPopoverOpen(false);
      slot.innerHTML =
        '<a href="auth.html" class="sa-auth-pill" data-sa-auth-link>' +
        iconSvg('user', 15) +
        '<span>' + escapeHtml(tr('signIn')) + '</span>' +
        '</a>';
      return;
    }

    var displayName = user.displayName || (user.email ? user.email.split('@')[0] : tr('roleStudent'));
    var roleText = user.role === 'parent' ? tr('roleParent') : tr('roleStudent');

    slot.innerHTML =
      '<div class="sa-auth-wrap">' +
      '<button type="button" id="sa-auth-trigger" class="sa-auth-pill" aria-haspopup="menu" aria-expanded="' +
      (shellState.popoverOpen ? 'true' : 'false') +
      '">' +
      iconSvg('userCheck', 15) +
      '<span class="sa-auth-pill-name">' + escapeHtml(displayName) + '</span>' +
      '<span class="sa-auth-role">' + escapeHtml(roleText) + '</span>' +
      iconSvg('chevronDown', 13) +
      '</button>' +
      '<div id="sa-account-popover" class="sa-account-popover' + (shellState.popoverOpen ? ' is-open' : '') + '" role="menu">' +
      '<div class="sa-popover-head">' +
      '<div class="sa-popover-name">' + escapeHtml(displayName) + '</div>' +
      '<div class="sa-popover-email">' + escapeHtml(user.email || roleText) + '</div>' +
      '</div>' +
      '<a href="auth.html" class="sa-popover-item" role="menuitem">' +
      '<span class="sa-popover-item-left">' + iconSvg('shieldCheck', 15) + '<span>' + escapeHtml(tr('accountProfile')) + '</span></span>' +
      iconSvg('chevronRight', 14) +
      '</a>' +
      '<a href="strictpass.html" class="sa-popover-item" role="menuitem">' +
      '<span class="sa-popover-item-left">' + iconSvg('creditCard', 15) + '<span>' + escapeHtml(tr('accountPass')) + '</span></span>' +
      iconSvg('chevronRight', 14) +
      '</a>' +
      '<button type="button" id="sa-popover-signout" class="sa-popover-item sa-popover-item-danger" role="menuitem">' +
      '<span class="sa-popover-item-left">' + iconSvg('logOut', 15) + '<span>' + escapeHtml(tr('signOut')) + '</span></span>' +
      '</button>' +
      '</div>' +
      '</div>';

    var trigger = document.getElementById('sa-auth-trigger');
    if (trigger) {
      trigger.addEventListener('click', function (ev) {
        ev.stopPropagation();
        setPopoverOpen(!shellState.popoverOpen);
      });
    }

    var signOutBtn = document.getElementById('sa-popover-signout');
    if (signOutBtn) {
      signOutBtn.addEventListener('click', function () {
        handleSignOut();
      });
    }
  }

  function renderDrawerAuth() {
    if (!hasDocument()) {
      return;
    }
    var box = document.getElementById('sa-drawer-auth');
    if (!box) {
      return;
    }
    var user = getAuthUser();
    if (!user) {
      box.innerHTML =
        '<a href="auth.html" class="sa-btn sa-btn-primary" style="width:100%;">' +
        iconSvg('user', 16) +
        '<span>' + escapeHtml(tr('signIn')) + '</span>' +
        '</a>';
      return;
    }

    var displayName = user.displayName || (user.email ? user.email.split('@')[0] : tr('roleStudent'));
    var roleText = user.role === 'parent' ? tr('roleParent') : tr('roleStudent');

    box.innerHTML =
      '<div class="sa-card sa-card-subtle" style="padding:12px;">' +
      '<div class="sa-row sa-row-between">' +
      '<strong style="font-size:14px;">' + escapeHtml(displayName) + '</strong>' +
      '<span class="sa-auth-role">' + escapeHtml(roleText) + '</span>' +
      '</div>' +
      (user.email
        ? '<div class="sa-mono" style="font-size:11px;color:var(--ink-muted);margin-top:4px;overflow:hidden;text-overflow:ellipsis;">' + escapeHtml(user.email) + '</div>'
        : '') +
      '<div class="sa-row" style="margin-top:12px;">' +
      '<a href="auth.html" class="sa-btn sa-btn-secondary sa-btn-sm" style="flex:1;">' + escapeHtml(tr('accountProfile')) + '</a>' +
      '<button type="button" id="sa-drawer-signout" class="sa-btn sa-btn-ghost sa-btn-sm">' + iconSvg('logOut', 15) + '</button>' +
      '</div>' +
      '</div>';

    var btn = document.getElementById('sa-drawer-signout');
    if (btn) {
      btn.addEventListener('click', function () {
        handleSignOut();
      });
    }
  }

  function ensureMobileDrawer() {
    if (!hasDocument() || !document.body) {
      return;
    }
    var activePage = detectActivePage();
    var navItems = getNavItems();

    var backdrop = document.getElementById('sa-drawer-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'sa-drawer-backdrop';
      backdrop.className = 'sa-drawer-backdrop';
      backdrop.addEventListener('click', function () {
        setDrawerOpen(false);
      });
      document.body.appendChild(backdrop);
    }

    var drawer = document.getElementById('sa-mobile-drawer');
    if (!drawer) {
      drawer = document.createElement('aside');
      drawer.id = 'sa-mobile-drawer';
      drawer.className = 'sa-mobile-drawer';
      drawer.setAttribute('aria-label', tr('navOverview'));
      drawer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(drawer);
    }

    var navHtml = navItems.map(function (item) {
      var cls = 'sa-drawer-link' + (activePage === item.id ? ' is-active' : '');
      return (
        '<a href="' + item.href + '" class="' + cls + '">' +
        '<span>' + escapeHtml(item.label) + '</span>' +
        iconSvg('chevronRight', 16) +
        '</a>'
      );
    }).join('');

    var langButtonsHtml = VALID_LANGS.map(function (code) {
      var cls = 'sa-lang-btn' + (shellState.lang === code ? ' is-active' : '');
      return '<button type="button" class="' + cls + '" data-sa-lang="' + code + '">' + code + '</button>';
    }).join('');

    drawer.innerHTML =
      '<div class="sa-drawer-head">' +
      '<a href="index.html" class="sa-brand">' +
      '<span class="sa-brand-mark">' + iconSvg('brandBear', 20) + '</span>' +
      '<span>StrictAI</span>' +
      '<span class="sa-brand-badge">NMT</span>' +
      '</a>' +
      '<button type="button" id="sa-drawer-close" class="sa-theme-btn" aria-label="' + escapeHtml(tr('menuClose')) + '">' +
      iconSvg('x', 18) +
      '</button>' +
      '</div>' +
      '<nav class="sa-drawer-nav" aria-label="Mobile Navigation">' + navHtml + '</nav>' +
      '<div class="sa-drawer-controls">' +
      '<div>' +
      '<span class="sa-label">' + escapeHtml(tr('langLabel')) + '</span>' +
      '<div class="sa-lang-switch" style="width:100%;justify-content:space-between;">' + langButtonsHtml + '</div>' +
      '</div>' +
      '<button type="button" id="sa-drawer-theme-btn" class="sa-btn sa-btn-secondary" style="width:100%;justify-content:space-between;"></button>' +
      '<div id="sa-drawer-auth"></div>' +
      '</div>';

    var closeBtn = document.getElementById('sa-drawer-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        setDrawerOpen(false);
      });
    }

    var drawerLinks = drawer.querySelectorAll('.sa-drawer-link');
    for (var i = 0; i < drawerLinks.length; i++) {
      drawerLinks[i].addEventListener('click', function () {
        setDrawerOpen(false);
      });
    }

    var langBtns = drawer.querySelectorAll('[data-sa-lang]');
    for (var j = 0; j < langBtns.length; j++) {
      langBtns[j].addEventListener('click', function (ev) {
        var code = ev.currentTarget.getAttribute('data-sa-lang');
        setLang(code);
      });
    }

    var drawerThemeBtn = document.getElementById('sa-drawer-theme-btn');
    if (drawerThemeBtn) {
      drawerThemeBtn.addEventListener('click', function () {
        toggleTheme();
      });
    }

    updateThemeButtons();
    renderDrawerAuth();
  }

  function bindGlobalDocumentEvents() {
    if (shellState.docEventsBound || !hasDocument()) {
      return;
    }
    shellState.docEventsBound = true;

    document.addEventListener('click', function (ev) {
      if (!shellState.popoverOpen) {
        return;
      }
      var wrap = ev.target && ev.target.closest ? ev.target.closest('.sa-auth-wrap') : null;
      if (!wrap) {
        setPopoverOpen(false);
      }
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') {
        if (shellState.popoverOpen) {
          setPopoverOpen(false);
        }
        if (shellState.drawerOpen) {
          setDrawerOpen(false);
        }
      }
    });
  }

  function mountHeader() {
    if (!hasDocument() || !document.body) {
      return null;
    }

    var header = document.getElementById('sa-header');
    if (!header) {
      header = document.createElement('header');
      header.id = 'sa-header';
      document.body.insertBefore(header, document.body.firstChild);
    }
    header.className = 'sa-header';

    var activePage = detectActivePage();
    var navItems = getNavItems();

    var navHtml = navItems.map(function (item) {
      var cls = 'sa-nav-link' + (activePage === item.id ? ' is-active' : '');
      var ariaCurr = activePage === item.id ? ' aria-current="page"' : '';
      return '<a href="' + item.href + '" class="' + cls + '"' + ariaCurr + '>' + escapeHtml(item.label) + '</a>';
    }).join('');

    var langButtonsHtml = VALID_LANGS.map(function (code) {
      var cls = 'sa-lang-btn' + (shellState.lang === code ? ' is-active' : '');
      return '<button type="button" class="' + cls + '" data-sa-lang="' + code + '" aria-pressed="' +
        (shellState.lang === code ? 'true' : 'false') + '">' + code + '</button>';
    }).join('');

    header.innerHTML =
      '<div class="sa-container sa-header-inner">' +
      '<a href="index.html" class="sa-brand">' +
      '<span class="sa-brand-mark">' + iconSvg('brandBear', 22) + '</span>' +
      '<span>StrictAI</span>' +
      '<span class="sa-brand-badge">NMT</span>' +
      '</a>' +
      '<nav class="sa-nav" aria-label="Primary">' + navHtml + '</nav>' +
      '<div class="sa-header-actions">' +
      '<div class="sa-lang-switch" role="group" aria-label="' + escapeHtml(tr('langLabel')) + '">' +
      langButtonsHtml +
      '</div>' +
      '<button type="button" id="sa-theme-toggle" class="sa-theme-btn"></button>' +
      '<div id="sa-auth-slot"></div>' +
      '<button type="button" id="sa-mobile-toggle" class="sa-mobile-toggle" aria-label="' +
      escapeHtml(tr('menuOpen')) + '" aria-expanded="' + (shellState.drawerOpen ? 'true' : 'false') + '">' +
      '<span class="sa-hamburger" aria-hidden="true"><span></span><span></span><span></span></span>' +
      '</button>' +
      '</div>' +
      '</div>';

    var langBtns = header.querySelectorAll('[data-sa-lang]');
    for (var i = 0; i < langBtns.length; i++) {
      langBtns[i].addEventListener('click', function (ev) {
        var code = ev.currentTarget.getAttribute('data-sa-lang');
        setLang(code);
      });
    }

    var themeBtn = document.getElementById('sa-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        toggleTheme();
      });
    }

    var mobileBtn = document.getElementById('sa-mobile-toggle');
    if (mobileBtn) {
      mobileBtn.addEventListener('click', function () {
        setDrawerOpen(!shellState.drawerOpen);
      });
    }

    updateThemeButtons();
    renderAuthSlot();
    ensureMobileDrawer();
    bindGlobalDocumentEvents();
    ensureAuthSubscription();

    return header;
  }

  /* ------------------------------------------------------------------ */
  /* Architectural Footer & Live Firebase/Vault Status                  */
  /* ------------------------------------------------------------------ */

  function updateFooterMode() {
    if (!hasDocument()) {
      return;
    }
    var pill = document.getElementById('sa-footer-mode-pill');
    if (!pill) {
      return;
    }
    var info = getFirebaseModeInfo();
    var isCloud = info.mode === 'firebase';
    var label = isCloud ? tr('modeCloud') : tr('modeVault');

    pill.innerHTML =
      '<span class="sa-status-dot' + (isCloud ? ' is-cloud' : '') + '"></span>' +
      '<span>' + escapeHtml(label) + '</span>' +
      '<span style="color:var(--ink-muted);">/</span>' +
      '<span>' + escapeHtml(info.projectId) + '</span>';
  }

  function mountFooter() {
    if (!hasDocument() || !document.body) {
      return null;
    }

    var footer = document.getElementById('sa-footer');
    if (!footer) {
      footer = document.createElement('footer');
      footer.id = 'sa-footer';
      document.body.appendChild(footer);
    }
    footer.className = 'sa-footer';

    var year = new Date().getFullYear();

    footer.innerHTML =
      '<div class="sa-container">' +
      '<div class="sa-footer-grid">' +
      '<div class="sa-stack sa-stack-sm">' +
      '<a href="index.html" class="sa-brand">' +
      '<span class="sa-brand-mark">' + iconSvg('brandBear', 20) + '</span>' +
      '<span>StrictAI</span>' +
      '<span class="sa-brand-badge">NMT</span>' +
      '</a>' +
      '<p class="sa-muted" style="max-width:300px;margin-top:6px;">' + escapeHtml(tr('footerTagline')) + '</p>' +
      '<div style="margin-top:8px;">' +
      '<div id="sa-footer-mode-pill" class="sa-mode-pill"></div>' +
      '</div>' +
      '</div>' +
      '<div>' +
      '<div class="sa-footer-col-title">' + escapeHtml(tr('footerColNav')) + '</div>' +
      '<ul class="sa-footer-links">' +
      '<li><a href="index.html" class="sa-footer-link">' + escapeHtml(tr('navOverview')) + '</a></li>' +
      '<li><a href="diagnostic.html" class="sa-footer-link">' + escapeHtml(tr('navDiagnostic')) + '</a></li>' +
      '<li><a href="strictpass.html" class="sa-footer-link">' + escapeHtml(tr('navStrictPass')) + '</a></li>' +
      '<li><a href="parents.html" class="sa-footer-link">' + escapeHtml(tr('navParents')) + '</a></li>' +
      '</ul>' +
      '</div>' +
      '<div>' +
      '<div class="sa-footer-col-title">' + escapeHtml(tr('footerColAccess')) + '</div>' +
      '<ul class="sa-footer-links">' +
      '<li><a href="auth.html" class="sa-footer-link">' + escapeHtml(tr('footerLinkAuth')) + '</a></li>' +
      '<li><a href="strictpass.html" class="sa-footer-link">' + escapeHtml(tr('footerLinkPass')) + '</a></li>' +
      '<li><a href="parents.html" class="sa-footer-link">' + escapeHtml(tr('footerLinkParents')) + '</a></li>' +
      '<li><a href="diagnostic.html" class="sa-footer-link">' + escapeHtml(tr('footerLinkDiagnostic')) + '</a></li>' +
      '</ul>' +
      '</div>' +
      '<div>' +
      '<div class="sa-footer-col-title">' + escapeHtml(tr('footerColSpecs')) + '</div>' +
      '<ul class="sa-footer-links">' +
      '<li class="sa-muted">' + escapeHtml(tr('footerSpecFormat')) + '</li>' +
      '<li class="sa-muted">' + escapeHtml(tr('footerSpecSync')) + '</li>' +
      '<li class="sa-muted">' + escapeHtml(tr('footerSpecLangs')) + '</li>' +
      '</ul>' +
      '</div>' +
      '</div>' +
      '<div class="sa-footer-bottom">' +
      '<span class="sa-mono">&copy; ' + year + ' ' + escapeHtml(tr('footerRights')) + '</span>' +
      '<span class="sa-mono">STUDIO PLATINUM / ANODIZED MATTE</span>' +
      '</div>' +
      '</div>';

    updateFooterMode();
    ensureAuthSubscription();
    return footer;
  }

  /* ------------------------------------------------------------------ */
  /* Sticky Bottom CTA Bar                                              */
  /* ------------------------------------------------------------------ */

  function syncStickyVisibility() {
    if (!hasDocument() || !hasWindow()) {
      return;
    }
    var bar = document.getElementById('sa-sticky-cta');
    if (!bar) {
      return;
    }
    var show = window.scrollY > 360;
    bar.classList.toggle('is-visible', show);
    if (document.body) {
      document.body.classList.toggle('sa-has-sticky-visible', show);
    }
  }

  function mountStickyCta() {
    if (!hasDocument() || !document.body) {
      return null;
    }
    if (document.body.dataset && document.body.dataset.stickyCta === 'false') {
      var existing = document.getElementById('sa-sticky-cta');
      if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing);
      }
      document.body.classList.remove('sa-has-sticky-visible');
      shellState.stickyMounted = false;
      return null;
    }

    var bar = document.getElementById('sa-sticky-cta');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'sa-sticky-cta';
      bar.className = 'sa-sticky-cta';
      document.body.appendChild(bar);
    }

    var page = detectActivePage();
    var onDiagnostic = page === 'diagnostic';
    var title = onDiagnostic ? tr('stickyTitleDiagnostic') : tr('stickyTitle');
    var sub = onDiagnostic ? tr('stickySubDiagnostic') : tr('stickySub');
    var btnLabel = onDiagnostic ? tr('stickyBtnDiagnostic') : tr('stickyBtn');
    var btnHref = onDiagnostic ? 'strictpass.html' : 'diagnostic.html';

    bar.innerHTML =
      '<div class="sa-container sa-sticky-cta-inner">' +
      '<div class="sa-sticky-cta-copy">' +
      '<span class="sa-brand-mark">' + iconSvg(onDiagnostic ? 'creditCard' : 'radar', 18) + '</span>' +
      '<div>' +
      '<div class="sa-sticky-cta-title">' + escapeHtml(title) + '</div>' +
      '<div class="sa-sticky-cta-sub">' + escapeHtml(sub) + '</div>' +
      '</div>' +
      '</div>' +
      '<a href="' + btnHref + '" class="sa-btn sa-btn-primary">' +
      '<span>' + escapeHtml(btnLabel) + '</span>' +
      iconSvg('arrowRight', 16) +
      '</a>' +
      '</div>';

    shellState.stickyMounted = true;

    if (!shellState.scrollBound && hasWindow()) {
      shellState.scrollBound = true;
      window.addEventListener('scroll', syncStickyVisibility, { passive: true });
    }
    syncStickyVisibility();
    return bar;
  }

  /* ------------------------------------------------------------------ */
  /* Auto-Bootstrap on DOM Ready                                        */
  /* ------------------------------------------------------------------ */

  function bootstrapShell() {
    if (!hasDocument() || !document.body) {
      return;
    }
    if (document.getElementById('sa-header')) {
      mountHeader();
    }
    if (document.getElementById('sa-footer')) {
      mountFooter();
    }
    mountStickyCta();

    if (hasWindow() && window.StrictIcons && typeof window.StrictIcons.mountAll === 'function') {
      window.StrictIcons.mountAll();
    }
  }

  if (hasDocument()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bootstrapShell);
    } else {
      bootstrapShell();
    }
  }

  var StrictShell = {
    getTheme: getTheme,
    setTheme: setTheme,
    toggleTheme: toggleTheme,
    getLang: getLang,
    setLang: setLang,
    toast: toast,
    copyText: copyText,
    formatUah: formatUah,
    escapeHtml: escapeHtml,
    mountHeader: mountHeader,
    mountFooter: mountFooter
  };

  globalScope.StrictShell = StrictShell;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = StrictShell;
  }
})(typeof window !== 'undefined' ? window : globalThis);
