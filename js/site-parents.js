/* ==========================================================================
   StrictAI Parents Page Logic
   - Sponsor Link HMAC Verification & Diagnostic Report Banner
   - Interactive Anti-Cheat & 17:00 Missed-Lesson Telemetry Simulator
   - Weekly Educational Contract Configurator (persisted to strictai_draft_contract)
   Zero emojis. Uses StrictIcons & StrictAuth.
   ========================================================================== */
(function (globalScope) {
  'use strict';

  var DRAFT_CONTRACT_KEY = 'strictai_draft_contract';

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

  function formatSkuLabel(rawSku) {
    var str = String(rawSku || 'StrictPass_Pro_Single_Season').trim();
    if (globalScope.StrictPassCatalog && typeof globalScope.StrictPassCatalog.getSKU === 'function') {
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
      var skuObj = globalScope.StrictPassCatalog.getSKU(seats, cycle, tier);
      if (skuObj) {
        return {
          title: skuObj.tierName + ' (' + skuObj.seatLabel + ' / ' + skuObj.cycleLabel + ')',
          price: globalScope.StrictPassCatalog.formatUah(skuObj.priceUah),
          skuId: skuObj.skuId
        };
      }
    }
    return {
      title: str.replace(/[_-]+/g, ' '),
      price: '',
      skuId: str
    };
  }

  /* ------------------------------------------------------------------ */
  /* 1. Sponsor Link Reader                                             */
  /* ------------------------------------------------------------------ */

  async function initSponsorBanner() {
    var wrap = document.getElementById('sa-sponsor-wrap');
    var banner = document.getElementById('sa-sponsor-banner');
    if (!wrap || !banner) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var sponsorToken = params.get('sponsor');
    if (!sponsorToken) {
      return;
    }

    wrap.hidden = false;

    if (!globalScope.StrictAuth || typeof globalScope.StrictAuth.consumeSponsorLink !== 'function') {
      banner.innerHTML =
        '<div class="sa-alert-panel is-warn">' +
        '<div class="sa-alert-top"><span>Модуль перевірки недоступний</span></div>' +
        '<p class="sa-alert-body">Не вдалося ініціалізувати перевірку спонсорського посилання.</p>' +
        '</div>';
      return;
    }

    try {
      var payload = await globalScope.StrictAuth.consumeSponsorLink(window.location.href);
      var skuMeta = formatSkuLabel(payload.sku);
      var studentName = payload.studentName || 'Учень StrictAI';
      var subject = payload.subject || 'Математика (НМТ)';
      var scoreText = payload.predictedScore !== null && payload.predictedScore !== undefined
        ? String(payload.predictedScore) + ' / 200'
        : 'Очікується';
      var cefrText = payload.cefrLevel ? ' (' + payload.cefrLevel + ')' : '';
      var weakTopics = Array.isArray(payload.weakTopics) && payload.weakTopics.length
        ? payload.weakTopics
        : ['Потрібна базова діагностика'];

      var topicsHtml = weakTopics.map(function (topic) {
        return '<span class="sa-badge sa-badge-warn">' + escapeHtml(topic) + '</span>';
      }).join('');

      var checkoutHref = 'strictpass.html?sponsor=' + encodeURIComponent(sponsorToken);

      banner.innerHTML =
        '<div class="sa-sponsor-grid">' +
          '<div>' +
            '<div class="sa-sponsor-meta">' +
              '<span class="sa-badge sa-badge-ok">' +
                icon('checkCircle', 12) +
                '<span>Звіт діагностики учня</span>' +
              '</span>' +
              '<span class="sa-badge">' +
                icon('shieldCheck', 12) +
                '<span>HMAC-підпис підтверджено</span>' +
              '</span>' +
              (payload.inviteCode
                ? '<span class="sa-badge sa-num">Код: ' + escapeHtml(payload.inviteCode) + '</span>'
                : '') +
            '</div>' +
            '<h2 class="sa-sponsor-title">Учень: ' + escapeHtml(studentName) + '</h2>' +
            '<div class="sa-sponsor-stats">' +
              '<span class="sa-sponsor-stat">' +
                icon('target', 15) +
                '<span>Прогноз НМТ: <strong class="sa-num">' + escapeHtml(scoreText + cefrText) + '</strong></span>' +
              '</span>' +
              '<span class="sa-sponsor-stat">' +
                icon('bookOpen', 15) +
                '<span>Предмет: <strong>' + escapeHtml(subject) + '</strong></span>' +
              '</span>' +
              '<span class="sa-sponsor-stat">' +
                icon('creditCard', 15) +
                '<span>Рекомендований тариф: <strong>' + escapeHtml(skuMeta.title) +
                (skuMeta.price ? ' — ' + escapeHtml(skuMeta.price) : '') +
                '</strong></span>' +
              '</span>' +
            '</div>' +
            '<div class="sa-topic-list" aria-label="Слабкі теми">' + topicsHtml + '</div>' +
          '</div>' +
          '<div class="sa-sponsor-actions">' +
            '<a href="' + escapeHtml(checkoutHref) + '" class="sa-btn sa-btn-primary sa-btn-lg">' +
              icon('creditCard', 18) +
              '<span>Оформити ' + escapeHtml(skuMeta.title) + '</span>' +
            '</a>' +
            '<span class="sa-draft-note">' +
              icon('lock', 13) +
              '<span>Звіт захищено від редагування учнем</span>' +
            '</span>' +
          '</div>' +
        '</div>';
    } catch (err) {
      banner.innerHTML =
        '<div class="sa-alert-panel is-danger">' +
          '<div class="sa-alert-top">' +
            '<span>' + icon('alertTriangle', 16) + ' Недійсне спонсорське посилання</span>' +
            '<span class="sa-badge sa-badge-danger">SIGNATURE MISMATCH</span>' +
          '</div>' +
          '<p class="sa-alert-body">' +
            escapeHtml((err && err.message) || 'Не вдалося перевірити криптографічний підпис звіту. Попросіть учня згенерувати нове посилання.') +
          '</p>' +
        '</div>';
    }
  }

  /* ------------------------------------------------------------------ */
  /* 2. Interactive Anti-Cheat & 17:00 Missed-Lesson Simulator          */
  /* ------------------------------------------------------------------ */

  function nowTimestamp() {
    var d = new Date();
    var hh = String(d.getHours()).padStart(2, '0');
    var mm = String(d.getMinutes()).padStart(2, '0');
    var ss = String(d.getSeconds()).padStart(2, '0');
    var ms = String(d.getMilliseconds()).padStart(3, '0');
    return hh + ':' + mm + ':' + ss + '.' + ms;
  }

  function initSimulator() {
    var feedEl = document.getElementById('sa-telemetry-feed');
    var trustValEl = document.getElementById('sa-trust-value');
    var trustBadgeEl = document.getElementById('sa-trust-badge');
    var trustBarEl = document.getElementById('sa-trust-bar');
    var trustBarWrapEl = document.getElementById('sa-trust-bar-wrap');
    var blurCountEl = document.getElementById('sa-blur-count');
    var pasteCountEl = document.getElementById('sa-paste-count');
    var digestStatusEl = document.getElementById('sa-digest-status');
    var answerPanelEl = document.getElementById('sa-sim-lock-state');
    var answerBadgeEl = document.getElementById('sa-answer-badge');
    var answerDescEl = document.getElementById('sa-answer-desc');
    var digestAlertEl = document.getElementById('sa-digest-alert');
    var digestBadgeEl = document.getElementById('sa-digest-badge');
    var digestBodyEl = document.getElementById('sa-digest-body');
    var digestActionsEl = document.getElementById('sa-digest-actions');
    var rescheduleBtn = document.getElementById('sa-reschedule-btn');
    var logCountEl = document.getElementById('sa-log-count');
    var resetBtn = document.getElementById('sa-sim-reset');

    if (!feedEl || !trustValEl) {
      return;
    }

    var simState = {
      trustScore: 100,
      tabBlurCount: 0,
      pasteBlockCount: 0,
      answerBlocked: false,
      focusWarned: false,
      missedAlertState: 'idle', // 'idle' | 'missed' | 'rescheduled'
      logs: []
    };

    function addLog(severity, code, message) {
      simState.logs.unshift({
        time: nowTimestamp(),
        severity: severity,
        code: code,
        message: message
      });
      if (simState.logs.length > 24) {
        simState.logs.length = 24;
      }
    }

    function computeNextMissedTimeLabel() {
      return '19:30';
    }

    function renderSimulator() {
      var score = Math.max(0, Math.min(100, simState.trustScore));
      trustValEl.textContent = score + '%';
      trustBarEl.style.width = score + '%';
      trustBarWrapEl.setAttribute('aria-valuenow', String(score));

      if (score >= 85) {
        trustBarEl.style.backgroundColor = 'var(--status-ok)';
        trustBadgeEl.className = 'sa-badge sa-badge-ok';
        trustBadgeEl.textContent = 'ВЕРИФІКОВАНО';
      } else if (score >= 60) {
        trustBarEl.style.backgroundColor = 'var(--status-warn)';
        trustBadgeEl.className = 'sa-badge sa-badge-warn';
        trustBadgeEl.textContent = 'ПІД НАГЛЯДОМ';
      } else {
        trustBarEl.style.backgroundColor = 'var(--status-danger)';
        trustBadgeEl.className = 'sa-badge sa-badge-danger';
        trustBadgeEl.textContent = 'РИЗИК СПИСУВАННЯ';
      }

      blurCountEl.textContent = String(simState.tabBlurCount);
      pasteCountEl.textContent = String(simState.pasteBlockCount);

      if (simState.answerBlocked) {
        answerPanelEl.className = 'sa-alert-panel is-danger';
        answerBadgeEl.className = 'sa-badge sa-badge-danger';
        answerBadgeEl.textContent = 'ВІДПОВІДЬ ЗАБЛОКОВАНО';
        answerDescEl.textContent =
          'Виявлено вставку зовнішнього тексту (ChatGPT / буфер обміну). Показ розв\'язку заблоковано, доки учень не пояснить 1-й крок власними словами.';
      } else if (simState.focusWarned) {
        answerPanelEl.className = 'sa-alert-panel is-warn';
        answerBadgeEl.className = 'sa-badge sa-badge-warn';
        answerBadgeEl.textContent = 'ПОПЕРЕДЖЕННЯ ФОКУСУ';
        answerDescEl.textContent =
          'Зафіксовано перемикання вкладки (' + simState.tabBlurCount + 'x). Увімкнено Focus Lock: таймер активних хвилин призупинено до повернення.';
      } else {
        answerPanelEl.className = 'sa-alert-panel is-ok';
        answerBadgeEl.className = 'sa-badge sa-badge-ok';
        answerBadgeEl.textContent = 'КОНТРОЛЬ АКТИВНИЙ';
        answerDescEl.textContent =
          'Телеметрія в нормі. Учень розв\'язує завдання самостійно, прямі підказки без кроків вимкнено.';
      }

      if (simState.missedAlertState === 'missed') {
        digestStatusEl.textContent = '17:05 ПРОПУСК';
        digestAlertEl.className = 'sa-alert-panel is-warn';
        digestBadgeEl.className = 'sa-badge sa-badge-warn';
        digestBadgeEl.textContent = '17:05 PARENT ALERT';
        digestBodyEl.innerHTML =
          'Учень пропустив слот <strong>17:00</strong>. Пропущена тема: <strong>Логарифмічні нерівності та ОДЗ</strong>. Вплив на серію: <strong>6 днів під загрозою зриву (-1 день без перенесення)</strong>.';
        digestActionsEl.hidden = false;
      } else if (simState.missedAlertState === 'rescheduled') {
        digestStatusEl.textContent = '19:30 ПЕРЕНЕСЕНО';
        digestAlertEl.className = 'sa-alert-panel is-ok';
        digestBadgeEl.className = 'sa-badge sa-badge-ok';
        digestBadgeEl.textContent = 'ПЕРЕНЕСЕНО 1-TAP';
        digestBodyEl.innerHTML =
          'Слот перенесено батьками на <strong>19:30</strong>. Серію <strong>6 днів</strong> збережено, учню надіслано оновлене нагадування у Mobile App.';
        digestActionsEl.hidden = true;
      } else {
        digestStatusEl.textContent = '17:00 OK';
        digestAlertEl.className = 'sa-alert-panel';
        digestBadgeEl.className = 'sa-badge';
        digestBadgeEl.textContent = 'ОЧІКУВАННЯ';
        digestBodyEl.textContent =
          'Щодня о 17:05 формується звіт: виконані теми, реальні хвилини концентрації та пропозиція перенесення при пропуску.';
        digestActionsEl.hidden = true;
      }

      var count = simState.logs.length;
      logCountEl.textContent = count === 1 ? '1 подія' : count + ' подій';

      feedEl.innerHTML = simState.logs.map(function (entry) {
        var cls = entry.severity === 'danger'
          ? 'is-danger'
          : entry.severity === 'warn'
            ? 'is-warn'
            : 'is-ok';
        return (
          '<div class="sa-feed-entry ' + cls + '">' +
            '<div class="sa-feed-head">' +
              '<span>' + escapeHtml(entry.code) + '</span>' +
              '<span>' + escapeHtml(entry.time) + '</span>' +
            '</div>' +
            '<div class="sa-feed-msg">' + escapeHtml(entry.message) + '</div>' +
          '</div>'
        );
      }).join('');
    }

    function handleAction(action) {
      if (action === 'paste') {
        var prevScore = simState.trustScore;
        simState.trustScore = simState.trustScore === 100 ? 64 : Math.max(12, simState.trustScore - 18);
        simState.pasteBlockCount += 1;
        simState.answerBlocked = true;
        addLog(
          'danger',
          'PASTE_INTERCEPT',
          'Буфер обміну (312 символів, LLM-сигнатура) заблоковано. Trust Score: ' +
            prevScore + '% -> ' + simState.trustScore + '%. ANSWER_REVEAL=BLOCKED.'
        );
      } else if (action === 'blur') {
        var beforeBlur = simState.trustScore;
        simState.tabBlurCount += 1;
        simState.focusWarned = true;
        simState.trustScore = Math.max(12, simState.trustScore - 12);
        addLog(
          'warn',
          'WINDOW_BLUR_DETECTED',
          'Втрата фокусу вікна (#' + simState.tabBlurCount + '). Активний таймер призупинено. Trust Score: ' +
            beforeBlur + '% -> ' + simState.trustScore + '%. FOCUS_LOCK=WARN.'
        );
      } else if (action === 'missed') {
        simState.missedAlertState = 'missed';
        addLog(
          'warn',
          'DAILY_DIGEST_1705_MISS',
          'О 17:05 не зафіксовано входу у слот 17:00. Тема: Логарифмічні нерівності. Підготовлено payload перенесення на ' +
            computeNextMissedTimeLabel() + '.'
        );
      } else if (action === 'reset') {
        simState.trustScore = 100;
        simState.tabBlurCount = 0;
        simState.pasteBlockCount = 0;
        simState.answerBlocked = false;
        simState.focusWarned = false;
        simState.missedAlertState = 'idle';
        simState.logs = [];
        addLog('ok', 'TELEMETRY_RESET', 'Сесію скинуто. Trust Score: 100%, лічильники обнулено.');
      }
      renderSimulator();
    }

    var simButtons = document.querySelectorAll('[data-sim-action]');
    for (var i = 0; i < simButtons.length; i++) {
      simButtons[i].addEventListener('click', function () {
        handleAction(this.getAttribute('data-sim-action'));
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        handleAction('reset');
      });
    }

    if (rescheduleBtn) {
      rescheduleBtn.addEventListener('click', function () {
        simState.missedAlertState = 'rescheduled';
        addLog(
          'ok',
          'PARENT_RESCHEDULE_ACK',
          'Батьківський запит reschedule_slot=19:30 підтверджено. Серію 6 днів збережено.'
        );
        renderSimulator();
      });
    }

    addLog('ok', 'TELEMETRY_READY', 'Сесію ініціалізовано. Trust Score: 100%. Очікування дій учня.');
    renderSimulator();
  }

  /* ------------------------------------------------------------------ */
  /* 3. Weekly Educational Contract Configurator                        */
  /* ------------------------------------------------------------------ */

  function scoreTierLabel(score) {
    if (score >= 185) return 'Грантовий';
    if (score >= 168) return 'Конкурентний';
    return 'Базовий';
  }

  function initContractConfigurator() {
    var minutesInput = document.getElementById('sa-contract-minutes');
    var scoreInput = document.getElementById('sa-contract-score');
    var socraticInput = document.getElementById('sa-contract-socratic');
    var checkinGroup = document.getElementById('sa-checkin-group');

    var minutesBadge = document.getElementById('sa-minutes-badge');
    var scoreBadge = document.getElementById('sa-score-badge');
    var checkinBadge = document.getElementById('sa-checkin-badge');

    var summaryDaily = document.getElementById('sa-summary-daily');
    var summaryWeekly = document.getElementById('sa-summary-weekly');
    var summaryScore = document.getElementById('sa-summary-score');
    var summarySocratic = document.getElementById('sa-summary-socratic');
    var summaryCheckin = document.getElementById('sa-summary-checkin');

    if (!minutesInput || !scoreInput || !socraticInput || !checkinGroup) {
      return;
    }

    var state = {
      dailyMinutes: 25,
      targetNmtScore: 175,
      strictSocraticLock: true,
      dailyCheckInTime: '17:00'
    };

    try {
      var savedRaw = globalScope.localStorage ? globalScope.localStorage.getItem(DRAFT_CONTRACT_KEY) : null;
      if (savedRaw) {
        var parsed = JSON.parse(savedRaw);
        if (parsed && typeof parsed === 'object') {
          if (parsed.dailyMinutes >= 15 && parsed.dailyMinutes <= 60) {
            state.dailyMinutes = Number(parsed.dailyMinutes);
          }
          if (parsed.targetNmtScore >= 140 && parsed.targetNmtScore <= 200) {
            state.targetNmtScore = Number(parsed.targetNmtScore);
          }
          if (typeof parsed.strictSocraticLock === 'boolean') {
            state.strictSocraticLock = parsed.strictSocraticLock;
          }
          if (['16:00', '17:00', '18:30', '20:00'].indexOf(parsed.dailyCheckInTime) !== -1) {
            state.dailyCheckInTime = parsed.dailyCheckInTime;
          }
        }
      }
    } catch (_err) {
      /* ignore corrupted draft */
    }

    minutesInput.value = String(state.dailyMinutes);
    scoreInput.value = String(state.targetNmtScore);
    socraticInput.checked = state.strictSocraticLock;

    function computeAlertTime(hhmm) {
      var parts = String(hhmm || '17:00').split(':');
      var hh = parts[0] || '17';
      var mm = parseInt(parts[1] || '0', 10) + 5;
      return hh + ':' + String(mm).padStart(2, '0');
    }

    function syncCheckinButtons() {
      var btns = checkinGroup.querySelectorAll('button[data-time]');
      for (var i = 0; i < btns.length; i++) {
        var isMatch = btns[i].getAttribute('data-time') === state.dailyCheckInTime;
        btns[i].setAttribute('aria-pressed', isMatch ? 'true' : 'false');
        if (isMatch) {
          btns[i].classList.add('is-active');
        } else {
          btns[i].classList.remove('is-active');
        }
      }
    }

    function persistAndRender() {
      var weeklyMinutes = state.dailyMinutes * 7;
      var payload = {
        dailyMinutes: state.dailyMinutes,
        weeklyMinutes: weeklyMinutes,
        targetNmtScore: state.targetNmtScore,
        strictSocraticLock: state.strictSocraticLock,
        dailyCheckInTime: state.dailyCheckInTime,
        updatedAt: new Date().toISOString()
      };

      try {
        if (globalScope.localStorage) {
          globalScope.localStorage.setItem(DRAFT_CONTRACT_KEY, JSON.stringify(payload));
        }
      } catch (_err) {
        /* ignore storage quota errors */
      }

      minutesBadge.textContent = state.dailyMinutes + ' хв/день';
      scoreBadge.textContent = state.targetNmtScore + ' / 200';
      checkinBadge.textContent = state.dailyCheckInTime;

      summaryDaily.textContent = state.dailyMinutes + ' хв/день';
      summaryWeekly.textContent = weeklyMinutes + ' хв/тиждень';
      summaryScore.textContent = state.targetNmtScore + ' (' + scoreTierLabel(state.targetNmtScore) + ')';
      summarySocratic.textContent = state.strictSocraticLock
        ? 'УВІМКНЕНО (0 прямих відповідей)'
        : 'СТАНДАРТНИЙ РЕЖИМ';
      summaryCheckin.textContent = state.dailyCheckInTime + ' (алерт о ' + computeAlertTime(state.dailyCheckInTime) + ')';

      syncCheckinButtons();
    }

    minutesInput.addEventListener('input', function () {
      state.dailyMinutes = Number(minutesInput.value);
      persistAndRender();
    });

    scoreInput.addEventListener('input', function () {
      state.targetNmtScore = Number(scoreInput.value);
      persistAndRender();
    });

    socraticInput.addEventListener('change', function () {
      state.strictSocraticLock = Boolean(socraticInput.checked);
      persistAndRender();
    });

    var timeBtns = checkinGroup.querySelectorAll('button[data-time]');
    for (var j = 0; j < timeBtns.length; j++) {
      timeBtns[j].addEventListener('click', function () {
        state.dailyCheckInTime = this.getAttribute('data-time') || '17:00';
        persistAndRender();
      });
    }

    persistAndRender();
  }

  /* ------------------------------------------------------------------ */
  /* Bootstrap                                                          */
  /* ------------------------------------------------------------------ */

  document.addEventListener('DOMContentLoaded', function () {
    if (globalScope.StrictIcons && typeof globalScope.StrictIcons.mountAll === 'function') {
      globalScope.StrictIcons.mountAll();
    }
    initSponsorBanner();
    initSimulator();
    initContractConfigurator();
  });
})(typeof window !== 'undefined' ? window : globalThis);
