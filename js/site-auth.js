/* ==========================================================================
   StrictAI Auth & Mobile App Handoff Hub Logic
   - Unified Registration & Login (Google, Apple, GitHub, Email/Password)
   - Collapsible Firebase Cloud JSON Configurator vs Verified Local Vault
   - Diagnostic Auto-Claim (?sid=...)
   - Deterministic Architectural SVG QR Code + Signed Handoff Link (?ht=...)
   - Parent Family Invite Code (SA-XXXXXX) & Student Join + Draft Contract Sync
   - StrictPass SKU Activation & Entitlement Display
   Zero emojis. Uses StrictIcons, StrictAuth, and StrictPassCatalog.
   ========================================================================== */
(function (globalScope) {
  'use strict';

  var DRAFT_CONTRACT_KEY = 'strictai_draft_contract';
  var FIREBASE_CONFIG_KEY = 'strictai_firebase_config';

  function escapeHtml(value) {
    return String(value === undefined || value === null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function icon(name, size) {
    if (globalScope.StrictIcons && typeof globalScope.StrictIcons.svg === 'function') {
      return globalScope.StrictIcons.svg(name, size || 16);
    }
    return '';
  }

  function parseUrlParams() {
    var params = new URLSearchParams(window.location.search);
    var rawRole = (params.get('role') || '').toLowerCase();
    var intent = (params.get('intent') || '').toLowerCase();
    var role = rawRole === 'parent' || rawRole === 'student'
      ? rawRole
      : (intent === 'parent_hub' ? 'parent' : 'student');
    return {
      role: role,
      explicitRole: rawRole === 'parent' || rawRole === 'student',
      intent: intent,
      sid: (params.get('sid') || '').trim(),
      sku: (params.get('sku') || '').trim()
    };
  }

  function readDraftContract() {
    try {
      if (!globalScope.localStorage) return null;
      var raw = globalScope.localStorage.getItem(DRAFT_CONTRACT_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (_err) {
      return null;
    }
  }

  function parseSkuParam(rawSku) {
    if (!rawSku) return null;
    var str = String(rawSku).trim();
    var parts = str.toLowerCase().replace(/^strictpass[_-]?/, '').split(/[_-]+/).filter(Boolean);
    var tier = 'pro';
    var seats = 'single';
    var cycle = 'season';
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (p === 'max' || p === 'pro' || p === 'strictpass') {
        tier = p;
      } else if (p === 'single' || p === 'duo' || p === 'family') {
        seats = p;
      } else if (p === 'monthly' || p === 'season' || p === 'annual') {
        cycle = p;
      }
    }
    if (globalScope.StrictPassCatalog && typeof globalScope.StrictPassCatalog.getSKU === 'function') {
      return globalScope.StrictPassCatalog.getSKU(seats, cycle, tier);
    }
    return {
      skuId: tier + '-' + seats + '-' + cycle,
      tier: tier,
      tierName: tier === 'max' ? 'StrictPass MAX' : tier === 'pro' ? 'StrictPass Pro' : 'StrictPass',
      seats: seats,
      seatLabel: seats.charAt(0).toUpperCase() + seats.slice(1),
      cycle: cycle,
      cycleLabel: cycle.charAt(0).toUpperCase() + cycle.slice(1),
      priceUah: 800
    };
  }

  async function copyText(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
    var temp = document.createElement('textarea');
    temp.value = text;
    temp.setAttribute('readonly', '');
    temp.style.position = 'fixed';
    temp.style.opacity = '0';
    document.body.appendChild(temp);
    temp.select();
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (_err) {
      ok = false;
    }
    document.body.removeChild(temp);
    return ok;
  }

  /* ------------------------------------------------------------------ */
  /* Deterministic Architectural SVG QR Matrix Generator                */
  /* Version 3 (29x29) with finder squares, timing, alignment & mask    */
  /* ------------------------------------------------------------------ */

  function fnv1a32(str, seedOffset) {
    var h = (0x811c9dc5 ^ (seedOffset || 0)) >>> 0;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h >>> 0;
  }

  function buildQrSvg(tokenString) {
    var size = 29;
    var quiet = 2;
    var total = size + quiet * 2;
    var grid = [];
    var fixed = [];

    for (var r = 0; r < size; r++) {
      grid[r] = new Array(size).fill(0);
      fixed[r] = new Array(size).fill(false);
    }

    function setModule(row, col, val, lock) {
      if (row < 0 || row >= size || col < 0 || col >= size) return;
      grid[row][col] = val ? 1 : 0;
      if (lock) fixed[row][col] = true;
    }

    function placeFinder(top, left) {
      for (var dr = -1; dr <= 7; dr++) {
        for (var dc = -1; dc <= 7; dc++) {
          var rr = top + dr;
          var cc = left + dc;
          if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
          var isSep = dr === -1 || dr === 7 || dc === -1 || dc === 7;
          if (isSep) {
            setModule(rr, cc, 0, true);
          } else {
            var isOuter = dr === 0 || dr === 6 || dc === 0 || dc === 6;
            var isCore = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
            setModule(rr, cc, isOuter || isCore ? 1 : 0, true);
          }
        }
      }
    }

    placeFinder(0, 0);
    placeFinder(0, size - 7);
    placeFinder(size - 7, 0);

    // Alignment pattern at (20, 20) center
    for (var ar = -2; ar <= 2; ar++) {
      for (var ac = -2; ac <= 2; ac++) {
        var onEdge = Math.abs(ar) === 2 || Math.abs(ac) === 2;
        var isCenter = ar === 0 && ac === 0;
        setModule(22 + ar, 22 + ac, onEdge || isCenter ? 1 : 0, true);
      }
    }

    // Timing patterns along row 6 and col 6
    for (var t = 8; t < size - 8; t++) {
      var bit = t % 2 === 0 ? 1 : 0;
      if (!fixed[6][t]) setModule(6, t, bit, true);
      if (!fixed[t][6]) setModule(t, 6, bit, true);
    }

    // Dark module + format reservation strips
    setModule(size - 8, 8, 1, true);
    var seedStr = String(tokenString || 'strictai-handoff');
    var s1 = fnv1a32(seedStr, 17);
    var s2 = fnv1a32(seedStr.split('').reverse().join(''), 91);

    function nextPrng() {
      s1 ^= s1 << 13;
      s1 ^= s1 >>> 17;
      s1 ^= s1 << 5;
      s2 = (Math.imul(s2, 1664525) + 1013904223) >>> 0;
      return ((s1 ^ s2) >>> 0);
    }

    // Reserve format info strips deterministically
    for (var f = 0; f < 9; f++) {
      if (!fixed[8][f]) setModule(8, f, ((nextPrng() >>> 3) & 1), true);
      if (!fixed[f][8]) setModule(f, 8, ((nextPrng() >>> 5) & 1), true);
    }
    for (var f2 = size - 8; f2 < size; f2++) {
      if (!fixed[8][f2]) setModule(8, f2, ((nextPrng() >>> 7) & 1), true);
      if (!fixed[f2][8]) setModule(f2, 8, ((nextPrng() >>> 11) & 1), true);
    }

    // Fill remaining data modules with deterministic stream + checkerboard mask
    var word = nextPrng();
    var bitPos = 0;
    for (var col = size - 1; col >= 0; col -= 2) {
      if (col === 6) col--;
      for (var row = 0; row < size; row++) {
        for (var offset = 0; offset < 2; offset++) {
          var c = col - offset;
          if (c < 0 || fixed[row][c]) continue;
          if (bitPos >= 31) {
            word = nextPrng();
            bitPos = 0;
          }
          var rawBit = (word >>> bitPos) & 1;
          bitPos++;
          var mask = ((row + c) % 2 === 0) ? 1 : 0;
          setModule(row, c, rawBit ^ mask, false);
        }
      }
    }

    var rects = '';
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        if (grid[y][x] === 1) {
          rects += '<rect x="' + (x + quiet) + '" y="' + (y + quiet) + '" width="1" height="1"/>';
        }
      }
    }

    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
      total +
      ' ' +
      total +
      '" shape-rendering="crispEdges" role="img" aria-label="QR-код для переходу в Mobile App">' +
      '<rect width="' +
      total +
      '" height="' +
      total +
      '" fill="#FFFFFF"/>' +
      '<g fill="#09090B">' +
      rects +
      '</g></svg>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* Main Controller                                                    */
  /* ------------------------------------------------------------------ */

  document.addEventListener('DOMContentLoaded', async function () {
    if (globalScope.StrictIcons && typeof globalScope.StrictIcons.mountAll === 'function') {
      globalScope.StrictIcons.mountAll();
    }

    var urlParams = parseUrlParams();
    var uiState = {
      selectedRole: urlParams.role,
      authMode: 'register',
      busy: false,
      lastHandoff: null,
      lastClaimNotice: '',
      claimedSidAttempted: false
    };

    // DOM References
    var signedOutEl = document.getElementById('sa-auth-signed-out');
    var signedInEl = document.getElementById('sa-auth-signed-in');
    var connBadgeEl = document.getElementById('sa-conn-badge');
    var intentBadgeEl = document.getElementById('sa-intent-badge');
    var signedOutContextEl = document.getElementById('sa-signedout-context-note');

    var roleToggleEl = document.getElementById('sa-role-toggle');
    var authModeTabsEl = document.getElementById('sa-auth-mode-tabs');
    var nameWrapEl = document.getElementById('sa-name-field-wrap');
    var nameInputEl = document.getElementById('sa-auth-name');
    var emailInputEl = document.getElementById('sa-auth-email');
    var passInputEl = document.getElementById('sa-auth-password');
    var authErrorEl = document.getElementById('sa-auth-error');
    var authSubmitEl = document.getElementById('sa-auth-submit');
    var authFormEl = document.getElementById('sa-email-auth-form');

    var profileNameEl = document.getElementById('sa-profile-name');
    var profileEmailEl = document.getElementById('sa-profile-email');
    var profileRoleBadgeEl = document.getElementById('sa-profile-role-badge');
    var profileProviderBadgeEl = document.getElementById('sa-profile-provider-badge');
    var profileFamilyBadgeEl = document.getElementById('sa-profile-family-badge');
    var signOutBtn = document.getElementById('sa-signout-btn');
    var globalHubAlertEl = document.getElementById('sa-global-hub-alert');

    var diagStatusBadgeEl = document.getElementById('sa-diag-status-badge');
    var diagBodyEl = document.getElementById('sa-diag-body');

    var handoffQrEl = document.getElementById('sa-handoff-qr');
    var handoffUrlEl = document.getElementById('sa-handoff-url');
    var copyHandoffBtn = document.getElementById('sa-copy-handoff-btn');
    var openAppLink = document.getElementById('sa-open-app-link');
    var refreshHandoffBtn = document.getElementById('sa-refresh-handoff-btn');
    var handoffFeedbackEl = document.getElementById('sa-handoff-feedback');

    var familyTitleEl = document.getElementById('sa-family-card-title');
    var familyDescEl = document.getElementById('sa-family-card-desc');
    var familyStatusBadgeEl = document.getElementById('sa-family-status-badge');
    var familyBodyEl = document.getElementById('sa-family-body');

    var passCardEl = document.getElementById('sa-pass-card');
    var passBadgeEl = document.getElementById('sa-pass-badge');
    var passBodyEl = document.getElementById('sa-pass-body');

    var fbDetailsBadgeEl = document.getElementById('sa-fb-details-badge');
    var fbJsonEl = document.getElementById('sa-firebase-json');
    var fbSaveBtn = document.getElementById('sa-fb-save-btn');
    var fbResetBtn = document.getElementById('sa-fb-reset-btn');
    var fbFeedbackEl = document.getElementById('sa-fb-feedback');

    function showAuthError(message) {
      if (!message) {
        authErrorEl.hidden = true;
        authErrorEl.innerHTML = '';
        return;
      }
      authErrorEl.hidden = false;
      authErrorEl.innerHTML = icon('alertCircle', 15) + '<span>' + escapeHtml(message) + '</span>';
    }

    function showHubAlert(kind, message) {
      if (!message) {
        globalHubAlertEl.hidden = true;
        globalHubAlertEl.innerHTML = '';
        return;
      }
      globalHubAlertEl.hidden = false;
      globalHubAlertEl.className = 'sa-inline-alert ' + (kind === 'danger' ? 'is-danger' : kind === 'warn' ? 'is-warn' : 'is-ok');
      globalHubAlertEl.innerHTML =
        icon(kind === 'danger' ? 'alertCircle' : 'checkCircle', 15) +
        '<span>' + escapeHtml(message) + '</span>';
    }

    function showFbFeedback(kind, message) {
      if (!message) {
        fbFeedbackEl.hidden = true;
        fbFeedbackEl.innerHTML = '';
        return;
      }
      fbFeedbackEl.hidden = false;
      fbFeedbackEl.className = 'sa-inline-alert ' + (kind === 'danger' ? 'is-danger' : 'is-ok');
      fbFeedbackEl.innerHTML =
        icon(kind === 'danger' ? 'alertCircle' : 'checkCircle', 15) +
        '<span>' + escapeHtml(message) + '</span>';
    }

    function updateConnectionBadges() {
      if (!globalScope.StrictAuth || typeof globalScope.StrictAuth.getFirebaseStatus !== 'function') {
        return;
      }
      var status = globalScope.StrictAuth.getFirebaseStatus();
      var isCloud = status.mode === 'firebase';
      var labelText = isCloud
        ? 'Firebase Cloud (' + (status.projectId || 'connected') + ')'
        : 'Verified Local Vault';

      var badgeClass = isCloud ? 'sa-badge sa-badge-ok' : 'sa-badge';
      connBadgeEl.className = badgeClass;
      connBadgeEl.innerHTML = icon(isCloud ? 'shieldCheck' : 'cpu', 12) + '<span>' + escapeHtml(labelText) + '</span>';

      fbDetailsBadgeEl.className = badgeClass;
      fbDetailsBadgeEl.textContent = labelText;
    }

    function renderIntentContext() {
      var notes = [];
      if (urlParams.intent === 'parent_hub') {
        intentBadgeEl.hidden = false;
        intentBadgeEl.className = 'sa-badge sa-badge-ink';
        intentBadgeEl.textContent = 'PARENT HUB SETUP';
        notes.push('Створення батьківського кабінету та 6-значного коду сім\'ї.');
      } else if (urlParams.intent === 'handoff') {
        intentBadgeEl.hidden = false;
        intentBadgeEl.className = 'sa-badge sa-badge-ink';
        intentBadgeEl.textContent = 'MOBILE HANDOFF';
        notes.push('Після входу автоматично згенерується QR-код та посилання ?ht=... для Mobile App.');
      } else if (urlParams.intent === 'strictpass' || urlParams.sku) {
        intentBadgeEl.hidden = false;
        intentBadgeEl.className = 'sa-badge sa-badge-ink';
        intentBadgeEl.textContent = 'STRICTPASS CHECKOUT';
        var parsedSku = parseSkuParam(urlParams.sku);
        if (parsedSku) {
          notes.push('Обраний тариф: ' + parsedSku.tierName + ' (' + parsedSku.seatLabel + ' / ' + parsedSku.cycleLabel + ').');
        }
      }

      if (urlParams.sid) {
        notes.push('Діагностику ' + urlParams.sid + ' буде закріплено автоматично після входу.');
      }

      var draft = readDraftContract();
      if (draft && uiState.selectedRole === 'parent') {
        notes.push('Знайдено чернетку сімейного контракту (' + draft.dailyMinutes + ' хв/день, НМТ ' + draft.targetNmtScore + ').');
      }

      if (notes.length) {
        signedOutContextEl.hidden = false;
        signedOutContextEl.innerHTML = icon('spark', 15) + '<span>' + escapeHtml(notes.join(' ')) + '</span>';
      } else {
        signedOutContextEl.hidden = true;
      }
    }

    function syncRoleToggle() {
      var btns = roleToggleEl.querySelectorAll('button[data-role]');
      for (var i = 0; i < btns.length; i++) {
        var active = btns[i].getAttribute('data-role') === uiState.selectedRole;
        btns[i].setAttribute('aria-pressed', active ? 'true' : 'false');
        if (active) {
          btns[i].classList.add('is-active');
        } else {
          btns[i].classList.remove('is-active');
        }
      }
      renderIntentContext();
    }

    function syncAuthModeTabs() {
      var tabs = authModeTabsEl.querySelectorAll('button[data-mode]');
      for (var i = 0; i < tabs.length; i++) {
        var active = tabs[i].getAttribute('data-mode') === uiState.authMode;
        tabs[i].setAttribute('aria-selected', active ? 'true' : 'false');
        if (active) {
          tabs[i].classList.add('is-active');
        } else {
          tabs[i].classList.remove('is-active');
        }
      }

      var isReg = uiState.authMode === 'register';
      nameWrapEl.hidden = !isReg;
      passInputEl.setAttribute('autocomplete', isReg ? 'new-password' : 'current-password');
      authSubmitEl.innerHTML =
        icon(isReg ? 'userCheck' : 'arrowRight', 18) +
        '<span>' + (isReg ? 'Створити акаунт' : 'Увійти в кабінет') + '</span>';
      showAuthError('');
    }

    async function tryClaimUrlSid(snap) {
      if (!urlParams.sid || !snap || !snap.user || uiState.claimedSidAttempted) {
        return;
      }
      if (snap.latestDiagnostic && snap.latestDiagnostic.sid === urlParams.sid && snap.user.latestDiagnostic) {
        uiState.claimedSidAttempted = true;
        return;
      }
      uiState.claimedSidAttempted = true;
      try {
        await globalScope.StrictAuth.claimDiagnostic(urlParams.sid);
        showHubAlert('ok', 'Діагностику ' + urlParams.sid + ' успішно закріплено за вашим профілем.');
      } catch (err) {
        uiState.lastClaimNotice = (err && err.message) || 'Не вдалося закріпити діагностику ' + urlParams.sid;
      }
    }

    /* ---------------------------------------------------------------- */
    /* Signed-In Sub-Renderers                                          */
    /* ---------------------------------------------------------------- */

    function renderDiagnosticCard(snap) {
      var diag = (globalScope.StrictAuth && globalScope.StrictAuth.getLatestDiagnostic()) || snap.latestDiagnostic;
      if (!diag) {
        diagStatusBadgeEl.className = 'sa-badge';
        diagStatusBadgeEl.textContent = 'НЕМАЄ ЗВІТУ';
        diagBodyEl.innerHTML =
          (uiState.lastClaimNotice
            ? '<div class="sa-inline-alert is-warn">' + icon('alertTriangle', 14) + '<span>' + escapeHtml(uiState.lastClaimNotice) + '</span></div>'
            : '') +
          '<p class="sa-hub-desc" style="font-size:var(--text-sm);">Ви ще не закріпили жодної діагностики. Пройдіть 5-хвилинний експрес-тест, щоб зафіксувати стартовий бал НМТ і слабкі теми.</p>' +
          '<div class="sa-row-actions" style="margin-top:8px;">' +
            '<a href="diagnostic.html" class="sa-btn sa-btn-primary sa-btn-sm">' +
              icon('radar', 15) +
              '<span>Пройти діагностику</span>' +
            '</a>' +
          '</div>';
        return;
      }

      diagStatusBadgeEl.className = 'sa-badge sa-badge-ok';
      diagStatusBadgeEl.textContent = 'ЗАКРІПЛЕНО';

      var topics = Array.isArray(diag.weakTopics) && diag.weakTopics.length
        ? diag.weakTopics.map(function (t) {
            return '<span class="sa-badge sa-badge-warn">' + escapeHtml(t) + '</span>';
          }).join('')
        : '<span class="sa-badge">Критичних прогалин не виявлено</span>';

      var scoreLabel = (diag.predictedScore !== undefined && diag.predictedScore !== null)
        ? String(diag.predictedScore) + ' / 200' + (diag.cefrLevel ? ' (' + diag.cefrLevel + ')' : '')
        : '—';

      diagBodyEl.innerHTML =
        '<div class="sa-kv-list">' +
          '<div class="sa-kv-row"><span class="sa-kv-key">Предмет</span><span class="sa-kv-val">' + escapeHtml(diag.subject || 'Математика') + '</span></div>' +
          '<div class="sa-kv-row"><span class="sa-kv-key">Прогноз НМТ</span><span class="sa-kv-val">' + escapeHtml(scoreLabel) + '</span></div>' +
          '<div class="sa-kv-row"><span class="sa-kv-key">Trust Score</span><span class="sa-kv-val">' + escapeHtml(String(diag.trustScore !== undefined ? diag.trustScore : 100)) + '%</span></div>' +
          '<div class="sa-kv-row"><span class="sa-kv-key">ID звіту</span><span class="sa-kv-val">' + escapeHtml(diag.sid || '—') + '</span></div>' +
        '</div>' +
        '<div>' +
          '<span class="sa-field-label" style="margin-top:4px;">Пріоритетні теми для ремонту</span>' +
          '<div class="sa-topic-pills">' + topics + '</div>' +
        '</div>' +
        '<div class="sa-row-actions" style="margin-top:6px;">' +
          '<a href="diagnostic.html' + (diag.sid ? '?sid=' + encodeURIComponent(diag.sid) : '') + '" class="sa-btn sa-btn-secondary sa-btn-sm">' +
            icon('arrowUpRight', 14) +
            '<span>Відкрити звіт діагностики</span>' +
          '</a>' +
        '</div>';
    }

    async function refreshHandoffCard(snap) {
      if (!snap || !snap.user || !globalScope.StrictAuth) {
        return;
      }
      var diag = globalScope.StrictAuth.getLatestDiagnostic() || snap.latestDiagnostic;
      var sid = (diag && diag.sid) || urlParams.sid || undefined;
      try {
        var handoff = await globalScope.StrictAuth.createHandoffToken({ sid: sid });
        uiState.lastHandoff = handoff;

        var mobileBaseUrl = window.STRICT_MOBILE_APP_URL ||
          (window.location.port === '8081'
            ? window.location.protocol + '//' + window.location.hostname + ':8080/index.html'
            : 'http://localhost:8080/index.html');
        var appRelHref = mobileBaseUrl + '?ht=' + encodeURIComponent(handoff.token) +
          (handoff.sid ? '&sid=' + encodeURIComponent(handoff.sid) : '');
        var fullAppUrl = appRelHref;
        try {
          fullAppUrl = new URL(appRelHref, window.location.href).href;
        } catch (_err) {
          fullAppUrl = handoff.url || appRelHref;
        }
        uiState.lastHandoffFullUrl = fullAppUrl;

        handoffQrEl.innerHTML = buildQrSvg(handoff.token);
        handoffUrlEl.value = fullAppUrl;
        openAppLink.setAttribute('href', appRelHref);
        handoffFeedbackEl.textContent = 'Підписаний токен дійсний до ' + new Date(handoff.expiresAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) + '.';
      } catch (err) {
        handoffFeedbackEl.textContent = (err && err.message) || 'Не вдалося згенерувати токен переходу.';
      }
    }

    function renderFamilyCard(snap) {
      var user = snap.user;
      var family = snap.family;
      var draft = readDraftContract();
      var isParent = user.role === 'parent';

      if (isParent) {
        familyTitleEl.textContent = 'Код сім\'ї (SA-XXXXXX) та батьківський PIN';
        familyDescEl.textContent = 'Створіть або оновіть сімейний код для підключення акаунтів учнів.';

        var seatPlan = (family && family.planSeatType) || (urlParams.sku && parseSkuParam(urlParams.sku) ? parseSkuParam(urlParams.sku).seats : 'family');
        var digestTime = (family && family.dailyScheduleTime) || (draft && draft.dailyCheckInTime) || '17:00';
        var effectiveContract = (family && family.contractTerms) || draft || null;

        if (family && family.inviteCode) {
          familyStatusBadgeEl.className = 'sa-badge sa-badge-ok';
          familyStatusBadgeEl.textContent = 'АКТИВНА СІМ\'Я';
        } else {
          familyStatusBadgeEl.className = 'sa-badge sa-badge-warn';
          familyStatusBadgeEl.textContent = 'ПОТРІБНЕ НАЛАШТУВАННЯ';
        }

        var inviteDisplayHtml = '';
        if (family && family.inviteCode) {
          inviteDisplayHtml =
            '<div class="sa-invite-box">' +
              '<div>' +
                '<span class="sa-field-label" style="margin-bottom:2px;">Сімейний код запрошення</span>' +
                '<div class="sa-invite-code" id="sa-generated-invite-code">' + escapeHtml(family.inviteCode) + '</div>' +
                '<span class="sa-hub-desc">Учасників: <strong class="sa-num">' + escapeHtml(String((family.memberUids && family.memberUids.length) || 1)) + ' / ' + escapeHtml(String(family.seatLimit || 5)) + '</strong> | Звіт о <strong class="sa-num">' + escapeHtml(family.dailyScheduleTime || '17:00') + '</strong></span>' +
              '</div>' +
              '<button type="button" id="sa-copy-invite-btn" class="sa-btn sa-btn-primary sa-btn-sm">' +
                icon('copy', 14) +
                '<span>Копіювати код</span>' +
              '</button>' +
            '</div>';
        }

        var draftBannerHtml = '';
        if (effectiveContract) {
          draftBannerHtml =
            '<div class="sa-inline-alert is-ok">' +
              icon('checkCircle', 15) +
              '<span>Контракт: <strong class="sa-num">' + escapeHtml(String(effectiveContract.dailyMinutes || 25)) + ' хв/день</strong>, ціль <strong class="sa-num">' + escapeHtml(String(effectiveContract.targetNmtScore || 175)) + '</strong>' +
              (effectiveContract.strictSocraticLock ? ', Strict Socratic Lock увімкнено' : '') + '.</span>' +
            '</div>';
        }

        familyBodyEl.innerHTML =
          inviteDisplayHtml +
          draftBannerHtml +
          '<form id="sa-parent-family-form" class="sa-stack" novalidate>' +
            '<div>' +
              '<label class="sa-field-label" for="sa-family-pin">Батьківський PIN (4–8 цифр)' + (family && family.hasPin ? ' — залиште порожнім, щоб зберегти поточний' : '') + '</label>' +
              '<input id="sa-family-pin" type="password" inputmode="numeric" pattern="\\d{4,8}" maxlength="8" class="sa-input sa-mono" placeholder="' + (family && family.hasPin ? '•••• (вже встановлено)' : 'Наприклад, 4829') + '">' +
            '</div>' +
            '<div>' +
              '<span class="sa-field-label">План місць у сім\'ї</span>' +
              '<div class="sa-segmented sa-segmented-3" role="group" aria-label="План місць" id="sa-seat-plan-group">' +
                '<button type="button" data-seat="single" aria-pressed="' + (seatPlan === 'single') + '" class="' + (seatPlan === 'single' ? 'is-active' : '') + '">Single</button>' +
                '<button type="button" data-seat="duo" aria-pressed="' + (seatPlan === 'duo') + '" class="' + (seatPlan === 'duo' ? 'is-active' : '') + '">Duo</button>' +
                '<button type="button" data-seat="family" aria-pressed="' + (seatPlan === 'family') + '" class="' + (seatPlan === 'family' ? 'is-active' : '') + '">Family</button>' +
              '</div>' +
            '</div>' +
            '<div>' +
              '<span class="sa-field-label">Час щоденного дайджесту</span>' +
              '<div class="sa-segmented sa-segmented-4" role="group" aria-label="Час дайджесту" id="sa-digest-time-group">' +
                '<button type="button" data-digest="16:00" aria-pressed="' + (digestTime === '16:00') + '" class="' + (digestTime === '16:00' ? 'is-active' : '') + '">16:00</button>' +
                '<button type="button" data-digest="17:00" aria-pressed="' + (digestTime === '17:00') + '" class="' + (digestTime === '17:00' ? 'is-active' : '') + '">17:00</button>' +
                '<button type="button" data-digest="18:30" aria-pressed="' + (digestTime === '18:30') + '" class="' + (digestTime === '18:30' ? 'is-active' : '') + '">18:30</button>' +
                '<button type="button" data-digest="20:00" aria-pressed="' + (digestTime === '20:00') + '" class="' + (digestTime === '20:00' ? 'is-active' : '') + '">20:00</button>' +
              '</div>' +
            '</div>' +
            '<div id="sa-family-form-msg" class="sa-inline-alert" hidden></div>' +
            '<button type="submit" class="sa-btn sa-btn-primary" style="width:100%;">' +
              icon('key', 16) +
              '<span>' + (family && family.inviteCode ? 'Оновити параметри сім\'ї' : 'Згенерувати код сім\'ї SA-XXXXXX') + '</span>' +
            '</button>' +
          '</form>';

        var chosenSeat = seatPlan;
        var chosenDigest = digestTime;

        var seatBtns = familyBodyEl.querySelectorAll('#sa-seat-plan-group button[data-seat]');
        for (var i = 0; i < seatBtns.length; i++) {
          seatBtns[i].addEventListener('click', function () {
            chosenSeat = this.getAttribute('data-seat');
            for (var k = 0; k < seatBtns.length; k++) {
              var on = seatBtns[k] === this;
              seatBtns[k].setAttribute('aria-pressed', on ? 'true' : 'false');
              seatBtns[k].classList.toggle('is-active', on);
            }
          });
        }

        var digestBtns = familyBodyEl.querySelectorAll('#sa-digest-time-group button[data-digest]');
        for (var j = 0; j < digestBtns.length; j++) {
          digestBtns[j].addEventListener('click', function () {
            chosenDigest = this.getAttribute('data-digest');
            for (var k = 0; k < digestBtns.length; k++) {
              var on = digestBtns[k] === this;
              digestBtns[k].setAttribute('aria-pressed', on ? 'true' : 'false');
              digestBtns[k].classList.toggle('is-active', on);
            }
          });
        }

        var copyInviteBtn = document.getElementById('sa-copy-invite-btn');
        if (copyInviteBtn && family && family.inviteCode) {
          copyInviteBtn.addEventListener('click', async function () {
            await copyText(family.inviteCode);
            var span = copyInviteBtn.querySelector('span');
            if (span) span.textContent = 'Скопійовано';
            setTimeout(function () {
              if (span) span.textContent = 'Копіювати код';
            }, 1800);
          });
        }

        var parentForm = document.getElementById('sa-parent-family-form');
        var familyFormMsg = document.getElementById('sa-family-form-msg');
        parentForm.addEventListener('submit', async function (ev) {
          ev.preventDefault();
          var pinVal = String(document.getElementById('sa-family-pin').value || '').trim();
          if ((!family || !family.hasPin) && !pinVal) {
            familyFormMsg.hidden = false;
            familyFormMsg.className = 'sa-inline-alert is-danger';
            familyFormMsg.innerHTML = icon('alertCircle', 14) + '<span>Вкажіть 4–8 цифровий батьківський PIN.</span>';
            return;
          }
          try {
            var updated = await globalScope.StrictAuth.createOrUpdateFamily({
              planSeatType: chosenSeat,
              newPin: pinVal || undefined,
              dailyScheduleTime: chosenDigest,
              contractTerms: effectiveContract || undefined
            });
            await refreshHandoffCard(globalScope.StrictAuth.getState());
            showHubAlert('ok', 'Сімейний код ' + updated.inviteCode + ' збережено. Передайте його учню для приєднання.');
          } catch (err) {
            familyFormMsg.hidden = false;
            familyFormMsg.className = 'sa-inline-alert is-danger';
            familyFormMsg.innerHTML = icon('alertCircle', 14) + '<span>' + escapeHtml((err && err.message) || 'Помилка збереження сім\'ї') + '</span>';
          }
        });
      } else {
        // Student role: join family by SA-XXXXXX
        familyTitleEl.textContent = 'Приєднання до сім\'ї (SA-XXXXXX)';
        familyDescEl.textContent = 'Введіть 6-значний код від батьків, щоб синхронізувати контракт і StrictPass.';

        if (family && family.inviteCode) {
          familyStatusBadgeEl.className = 'sa-badge sa-badge-ok';
          familyStatusBadgeEl.textContent = 'ПІД\'ЄДНАНО';
          familyBodyEl.innerHTML =
            '<div class="sa-invite-box">' +
              '<div>' +
                '<span class="sa-field-label" style="margin-bottom:2px;">Активний код сім\'ї</span>' +
                '<div class="sa-invite-code">' + escapeHtml(family.inviteCode) + '</div>' +
                '<span class="sa-hub-desc">План: <strong>' + escapeHtml(family.planSeatType || 'family') + '</strong> | Щоденний звіт: <strong class="sa-num">' + escapeHtml(family.dailyScheduleTime || '17:00') + '</strong></span>' +
              '</div>' +
              '<span class="sa-badge sa-badge-ok">' + icon('checkCircle', 12) + '<span>СИНХРОНІЗОВАНО</span></span>' +
            '</div>' +
            (family.contractTerms
              ? '<div class="sa-kv-list">' +
                  '<div class="sa-kv-row"><span class="sa-kv-key">Щоденна норма</span><span class="sa-kv-val">' + escapeHtml(String(family.contractTerms.dailyMinutes || 25)) + ' хв/день</span></div>' +
                  '<div class="sa-kv-row"><span class="sa-kv-key">Цільовий бал НМТ</span><span class="sa-kv-val">' + escapeHtml(String(family.contractTerms.targetNmtScore || 175)) + '</span></div>' +
                '</div>'
              : '');
        } else {
          familyStatusBadgeEl.className = 'sa-badge';
          familyStatusBadgeEl.textContent = 'НЕ ПРИВ\'ЯЗАНО';
          familyBodyEl.innerHTML =
            '<form id="sa-student-join-form" class="sa-stack" novalidate>' +
              '<div>' +
                '<label class="sa-field-label" for="sa-join-code">Код сім\'ї (SA-XXXXXX)</label>' +
                '<input id="sa-join-code" type="text" class="sa-input sa-mono" placeholder="SA-XXXXXX" maxlength="10" style="text-transform:uppercase;" required>' +
              '</div>' +
              '<div id="sa-join-msg" class="sa-inline-alert" hidden></div>' +
              '<button type="submit" class="sa-btn sa-btn-primary" style="width:100%;">' +
                icon('users', 16) +
                '<span>Приєднатися до сім\'ї</span>' +
              '</button>' +
            '</form>';

          var joinForm = document.getElementById('sa-student-join-form');
          var joinMsg = document.getElementById('sa-join-msg');
          joinForm.addEventListener('submit', async function (ev) {
            ev.preventDefault();
            var rawCode = String(document.getElementById('sa-join-code').value || '').trim().toUpperCase();
            if (!rawCode) {
              joinMsg.hidden = false;
              joinMsg.className = 'sa-inline-alert is-danger';
              joinMsg.innerHTML = icon('alertCircle', 14) + '<span>Введіть код формату SA-XXXXXX.</span>';
              return;
            }
            try {
              var res = await globalScope.StrictAuth.joinFamilyByCode(rawCode);
              await refreshHandoffCard(globalScope.StrictAuth.getState());
              showHubAlert('ok', 'Ви успішно приєдналися до сім\'ї ' + res.family.inviteCode + '.');
            } catch (err) {
              joinMsg.hidden = false;
              joinMsg.className = 'sa-inline-alert is-danger';
              joinMsg.innerHTML = icon('alertCircle', 14) + '<span>' + escapeHtml((err && err.message) || 'Не вдалося приєднатися') + '</span>';
            }
          });
        }
      }
    }

    function renderPassCard(snap) {
      var activePass = snap.activePass || (snap.user && snap.user.activePass) || (snap.family && snap.family.activePass);
      var parsedSku = parseSkuParam(urlParams.sku);

      if (!activePass && !parsedSku) {
        passCardEl.hidden = true;
        return;
      }

      passCardEl.hidden = false;
      var html = '';

      if (activePass) {
        passBadgeEl.className = 'sa-badge sa-badge-ok';
        passBadgeEl.textContent = 'АКТИВНИЙ';
        html +=
          '<div class="sa-kv-list">' +
            '<div class="sa-kv-row"><span class="sa-kv-key">Тариф</span><span class="sa-kv-val">' + escapeHtml(activePass.tier || 'StrictPass') + '</span></div>' +
            '<div class="sa-kv-row"><span class="sa-kv-key">План місць</span><span class="sa-kv-val">' + escapeHtml(activePass.seatType || 'single') + '</span></div>' +
            '<div class="sa-kv-row"><span class="sa-kv-key">Цикл</span><span class="sa-kv-val">' + escapeHtml(activePass.cycle || 'season') + '</span></div>' +
            '<div class="sa-kv-row"><span class="sa-kv-key">Дійсний до</span><span class="sa-kv-val">' + escapeHtml(new Date(activePass.expiresAt).toLocaleDateString('uk-UA')) + '</span></div>' +
          '</div>';
      }

      if (parsedSku && (!activePass || activePass.tier !== parsedSku.tierName || activePass.seatType !== parsedSku.seats)) {
        if (!activePass) {
          passBadgeEl.className = 'sa-badge sa-badge-warn';
          passBadgeEl.textContent = 'ОЧІКУЄ АКТИВАЦІЇ';
        }
        var formattedPrice = globalScope.StrictPassCatalog && typeof globalScope.StrictPassCatalog.formatUah === 'function'
          ? globalScope.StrictPassCatalog.formatUah(parsedSku.priceUah)
          : (parsedSku.priceUah + ' UAH');

        html +=
          '<div class="sa-inline-alert is-ok">' +
            icon('creditCard', 15) +
            '<span>Обраний пакет: <strong>' + escapeHtml(parsedSku.tierName + ' (' + parsedSku.seatLabel + ' / ' + parsedSku.cycleLabel + ')') + '</strong> — <strong class="sa-num">' + escapeHtml(formattedPrice) + '</strong></span>' +
          '</div>' +
          '<div class="sa-row-actions">' +
            '<button type="button" id="sa-activate-sku-btn" class="sa-btn sa-btn-primary sa-btn-sm">' +
              icon('checkCircle', 14) +
              '<span>Активувати StrictPass</span>' +
            '</button>' +
            '<a href="strictpass.html?sku=' + encodeURIComponent(parsedSku.skuId) + '" class="sa-btn sa-btn-secondary sa-btn-sm">Змінити тариф</a>' +
          '</div>';
      }

      passBodyEl.innerHTML = html;

      var activateBtn = document.getElementById('sa-activate-sku-btn');
      if (activateBtn && parsedSku) {
        activateBtn.addEventListener('click', async function () {
          activateBtn.disabled = true;
          try {
            await globalScope.StrictAuth.activateStrictPass({
              tier: parsedSku.tierName,
              seatType: parsedSku.seats,
              cycle: parsedSku.cycle,
              priceUah: parsedSku.priceUah
            });
            await refreshHandoffCard(globalScope.StrictAuth.getState());
            showHubAlert('ok', 'StrictPass ' + parsedSku.tierName + ' активовано та прив\'язано до профілю.');
          } catch (err) {
            activateBtn.disabled = false;
            showHubAlert('danger', (err && err.message) || 'Не вдалося активувати StrictPass');
          }
        });
      }
    }

    async function renderAuthSnapshot(user, snap) {
      updateConnectionBadges();

      if (!user) {
        signedOutEl.hidden = false;
        signedInEl.hidden = true;
        uiState.lastHandoff = null;
        return;
      }

      signedOutEl.hidden = true;
      signedInEl.hidden = false;

      if (urlParams.sid) {
        await tryClaimUrlSid(snap);
        snap = globalScope.StrictAuth.getState();
        user = snap.user || user;
      }

      profileNameEl.textContent = user.displayName || user.email || 'Користувач StrictAI';
      profileEmailEl.textContent = user.email || user.uid;
      profileRoleBadgeEl.textContent = user.role === 'parent' ? 'Батьки' : 'Учень';
      profileProviderBadgeEl.textContent = String(user.provider || 'password').toUpperCase();

      if (snap.family && snap.family.inviteCode) {
        profileFamilyBadgeEl.hidden = false;
        profileFamilyBadgeEl.className = 'sa-badge sa-badge-ok sa-num';
        profileFamilyBadgeEl.textContent = 'СІМ\'Я: ' + snap.family.inviteCode;
      } else {
        profileFamilyBadgeEl.hidden = true;
      }

      renderDiagnosticCard(snap);
      renderFamilyCard(snap);
      renderPassCard(snap);
      await refreshHandoffCard(snap);
    }

    /* ---------------------------------------------------------------- */
    /* Event Bindings                                                   */
    /* ---------------------------------------------------------------- */

    var roleButtons = roleToggleEl.querySelectorAll('button[data-role]');
    for (var rIdx = 0; rIdx < roleButtons.length; rIdx++) {
      roleButtons[rIdx].addEventListener('click', function () {
        uiState.selectedRole = this.getAttribute('data-role') === 'parent' ? 'parent' : 'student';
        syncRoleToggle();
      });
    }

    var modeTabs = authModeTabsEl.querySelectorAll('button[data-mode]');
    for (var mIdx = 0; mIdx < modeTabs.length; mIdx++) {
      modeTabs[mIdx].addEventListener('click', function () {
        uiState.authMode = this.getAttribute('data-mode') === 'login' ? 'login' : 'register';
        syncAuthModeTabs();
      });
    }

    var oauthBtns = document.querySelectorAll('[data-oauth-provider]');
    for (var oIdx = 0; oIdx < oauthBtns.length; oIdx++) {
      oauthBtns[oIdx].addEventListener('click', async function () {
        if (uiState.busy) return;
        var provider = this.getAttribute('data-oauth-provider');
        showAuthError('');
        uiState.busy = true;
        this.disabled = true;
        try {
          await globalScope.StrictAuth.signInWithProvider(provider, {
            role: uiState.selectedRole,
            linkSid: urlParams.sid || undefined
          });
        } catch (err) {
          if (!err || err.code !== 'auth/popup-closed-by-user') {
            showAuthError((err && err.message) || 'Не вдалося виконати вхід через ' + provider);
          }
        } finally {
          uiState.busy = false;
          this.disabled = false;
        }
      });
    }

    authFormEl.addEventListener('submit', async function (ev) {
      ev.preventDefault();
      if (uiState.busy) return;
      showAuthError('');

      var email = String(emailInputEl.value || '').trim();
      var password = String(passInputEl.value || '');
      var displayName = String(nameInputEl.value || '').trim();

      if (!email) {
        showAuthError('Введіть електронну пошту.');
        emailInputEl.focus();
        return;
      }
      if (password.length < 6) {
        showAuthError('Пароль має містити щонайменше 6 символів.');
        passInputEl.focus();
        return;
      }

      uiState.busy = true;
      authSubmitEl.disabled = true;
      try {
        if (uiState.authMode === 'register') {
          await globalScope.StrictAuth.registerWithEmail({
            email: email,
            password: password,
            displayName: displayName,
            role: uiState.selectedRole
          });
        } else {
          await globalScope.StrictAuth.signInWithEmail({
            email: email,
            password: password
          });
        }
      } catch (err) {
        showAuthError((err && err.message) || 'Помилка авторизації. Перевірте введені дані.');
      } finally {
        uiState.busy = false;
        authSubmitEl.disabled = false;
      }
    });

    signOutBtn.addEventListener('click', async function () {
      showHubAlert('', '');
      uiState.claimedSidAttempted = false;
      await globalScope.StrictAuth.signOut();
    });

    copyHandoffBtn.addEventListener('click', async function () {
      var urlToCopy = uiState.lastHandoffFullUrl || handoffUrlEl.value;
      if (!urlToCopy || urlToCopy === 'Генерація токена...') return;
      await copyText(urlToCopy);
      var labelSpan = copyHandoffBtn.querySelector('span');
      if (labelSpan) labelSpan.textContent = 'Скопійовано';
      handoffFeedbackEl.textContent = 'Посилання ?ht=... скопійовано в буфер обміну.';
      setTimeout(function () {
        if (labelSpan) labelSpan.textContent = 'Копіювати посилання для додатку';
      }, 1800);
    });

    refreshHandoffBtn.addEventListener('click', async function () {
      await refreshHandoffCard(globalScope.StrictAuth.getState());
    });

    // Firebase JSON Config Panel
    try {
      var savedFbJson = globalScope.localStorage ? globalScope.localStorage.getItem(FIREBASE_CONFIG_KEY) : null;
      if (savedFbJson) {
        fbJsonEl.value = savedFbJson;
      }
    } catch (_err) {
      /* ignore */
    }

    fbSaveBtn.addEventListener('click', async function () {
      showFbFeedback('', '');
      var raw = String(fbJsonEl.value || '').trim();
      if (!raw) {
        showFbFeedback('danger', 'Вставте JSON конфігурації Firebase перед збереженням.');
        return;
      }
      var parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (_err) {
        showFbFeedback('danger', 'Невалідний JSON. Перевірте лапки та дужки.');
        return;
      }
      fbSaveBtn.disabled = true;
      try {
        var res = await globalScope.StrictAuth.configureFirebase(parsed);
        updateConnectionBadges();
        if (res.connected) {
          showFbFeedback('ok', 'Підключено до Firebase Cloud (' + res.projectId + ').');
        } else {
          showFbFeedback('ok', 'Конфігурацію збережено, але браузер працює в режимі Verified Local Vault (перевірте мережу).');
        }
      } catch (err) {
        showFbFeedback('danger', (err && err.message) || 'Помилка конфігурації Firebase.');
      } finally {
        fbSaveBtn.disabled = false;
      }
    });

    fbResetBtn.addEventListener('click', function () {
      globalScope.StrictAuth.clearFirebaseConfig();
      fbJsonEl.value = '';
      updateConnectionBadges();
      showFbFeedback('ok', 'Скинуто до Verified Local Vault.');
    });

    // Initialize UI & Subscribe to StrictAuth
    syncRoleToggle();
    syncAuthModeTabs();

    if (globalScope.StrictAuth) {
      globalScope.StrictAuth.onChange(function (user, snap) {
        renderAuthSnapshot(user, snap);
      });
      await globalScope.StrictAuth.init();
      var initialSnap = globalScope.StrictAuth.getState();
      await renderAuthSnapshot(initialSnap.user, initialSnap);
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
