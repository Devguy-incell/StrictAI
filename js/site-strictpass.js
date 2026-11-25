/* ==========================================================================
   StrictPass Configurator, Personalized Banner, Tutor Calculator & Checkout
   Zero emojis. Depends on StrictIcons, StrictPassCatalog, StrictAuth.
   ========================================================================== */
(function (window, document) {
  'use strict';

  var TIER_ORDER = ['strictpass', 'pro', 'max'];

  var SEAT_LABELS_UK = {
    single: 'Single · 1 учень',
    duo: 'Duo · 2 учні',
    family: 'Family · 3–5 учнів'
  };

  var CYCLE_LABELS_UK = {
    season: 'Сезон НМТ · 3 міс',
    annual: 'Рік · 12 міс',
    monthly: 'Місяць'
  };

  var TIER_META_UK = {
    strictpass: {
      name: 'StrictPass',
      tagline: 'Базовий радар діагностики НМТ та сократичний розбір помилок без готових відповідей.',
      features: [
        'Повний діагностичний радар прогалин з предметів НМТ',
        'Покроковий розбір хибних рішень замість списування',
        'Адаптивна черга щоденних тренувань із контролем темпу',
        'Синхронізація прогресу між сайтом та мобільним тренажером'
      ]
    },
    pro: {
      name: 'StrictPass Pro',
      badge: 'Рекомендовано',
      tagline: 'Поглиблені симуляції НМТ, кластеризація типових помилок і щотижневий звіт для батьків.',
      features: [
        'Усі можливості базового контуру StrictPass',
        'Необмежені таймовані блоки НМТ з аналізом швидкості',
        'Форензика помилок: ізоляція слабких тем до вузла формули',
        'Щотижневий верифікований дайджест і контроль о 17:00 для батьків'
      ]
    },
    max: {
      name: 'StrictPass MAX',
      tagline: 'Максимальна глибина сократичного аналізу, індивідуальний маршрут та пріоритетний інференс.',
      features: [
        'Усі інструменти StrictPass Pro та сімейного контролю',
        'Багатокрокові доведення й розширений аналіз складних задач НМТ',
        'Персональна траєкторія під цільовий бал вступу та ВНЗ',
        'Пріоритетний канал обчислень без денних лімітів'
      ]
    }
  };

  var COMPARISON_ROWS = [
    {
      criterion: 'Вартість на місяць',
      tutor: { ok: false, text: '12 000 – 36 000 ₴/міс (за 2–4 предмети)' },
      chatgpt: { ok: false, text: '0 ₴ (але без структури та методики НМТ)' },
      strictpass: { ok: true, text: 'від 800 ₴/міс у сезонному тарифі Pro' }
    },
    {
      criterion: 'Перевірка кроків замість підказок',
      tutor: { ok: true, text: 'Залежить від досвіду викладача та часу уроку' },
      chatgpt: { ok: false, text: 'Одразу видає готову відповідь і ламає навичку' },
      strictpass: { ok: true, text: 'Сократичний діалог: зупиняє на точному кроці збою' }
    },
    {
      criterion: 'Захист від списування (Anti-OCR)',
      tutor: { ok: false, text: 'Учень легко списує домашнє завдання з ГДЗ' },
      chatgpt: { ok: false, text: 'Працює як генератор готових текстів і розв\'язків' },
      strictpass: { ok: true, text: 'Блокує сліпе копіювання та вимагає доведення кроку' }
    },
    {
      criterion: 'Контроль пропущених занять о 17:00',
      tutor: { ok: false, text: 'Ручні перенесення занять або втрата оплати' },
      chatgpt: { ok: false, text: 'Жодного розкладу, нагадувань чи дисципліни' },
      strictpass: { ok: true, text: 'Автоматичний трекінг слоту 17:00 і сповіщення батькам' }
    },
    {
      criterion: 'Синхронізація прогалин НМТ',
      tutor: { ok: false, text: 'Розрізнені конспекти, складні теми губляться' },
      chatgpt: { ok: false, text: 'Кожен чат з нуля, без карти знань НМТ' },
      strictpass: { ok: true, text: 'Єдиний радар тем НМТ оновлюється після кожної вправи' }
    },
    {
      criterion: 'Підсумок для батьків',
      tutor: { ok: false, text: 'Суб\'єктивні слова після уроку раз на тиждень' },
      chatgpt: { ok: false, text: 'Батьки не бачать реального рівня підготовки' },
      strictpass: { ok: true, text: 'Прозорий прогноз балів /200 та динаміка слабких тем' }
    }
  ];

  var state = {
    seats: 'single',
    cycle: 'season',
    highlightedTier: null,
    sponsorPayload: null,
    sponsorError: false,
    diagnostic: null,
    subjects: 3,
    lessonsPerWeek: 2,
    lessonRateUah: 500,
    activeModalSku: null,
    activeModalResult: null
  };

  var activeTiltCleanups = [];

  function escapeHtml(value) {
    return String(value === undefined || value === null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatNumber(num) {
    var rounded = Math.round(Number(num) || 0);
    return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function formatUah(amount) {
    return formatNumber(amount) + ' ₴';
  }

  function iconSvg(name, size, className) {
    if (window.StrictIcons && typeof window.StrictIcons.svg === 'function') {
      return window.StrictIcons.svg(name, size || 16, className || '');
    }
    return '';
  }

  function resolvePageUrl(filename) {
    try {
      if (window.location && window.location.href && window.location.protocol !== 'about:') {
        var resolved = new URL(filename, window.location.href);
        resolved.search = '';
        resolved.hash = '';
        return resolved.href;
      }
    } catch (_err) {
      /* fallback below */
    }
    return filename;
  }

  function parseSkuString(rawSku) {
    if (!rawSku) return null;
    var normalized = String(rawSku).trim().replace(/\.webp$/i, '');
    if (!normalized) return null;

    var lower = normalized.toLowerCase();
    var parts = lower.split(/[-_]+/).filter(Boolean);
    var parsed = { seats: null, cycle: null, tier: null };

    for (var i = 0; i < parts.length; i++) {
      var token = parts[i];
      if (token === 'single' || token === 'duo' || token === 'family') {
        parsed.seats = token;
      } else if (token === 'monthly' || token === 'season' || token === 'annual') {
        parsed.cycle = token;
      } else if (token === 'pro') {
        parsed.tier = 'pro';
      } else if (token === 'max') {
        parsed.tier = 'max';
      } else if (token === 'strictpass' && !parsed.tier) {
        parsed.tier = 'strictpass';
      }
    }

    if (!parsed.seats && !parsed.cycle && !parsed.tier) {
      return null;
    }
    return parsed;
  }

  function getSeatFeatureText(seatCount, seatsKey) {
    if (seatsKey === 'family') {
      return 'До 5 незалежних учнівських акаунтів під одним Pass';
    }
    if (seatsKey === 'duo' || seatCount === 2) {
      return '2 незалежні учнівські профілі в одному тарифі';
    }
    return '1 персональний обліковий запис учня StrictPass';
  }

  function getCycleFeatureText(cycleKey, savingsUah) {
    if (cycleKey === 'monthly') {
      return 'Гнучка оплата щомісяця, скасування у будь-який момент';
    }
    if (cycleKey === 'season') {
      return 'Фіксація ціни на 3-місячний сезон НМТ (економія ' + formatUah(savingsUah) + ')';
    }
    return 'Повний 12-місячний цикл підготовки (економія ' + formatUah(savingsUah) + ')';
  }

  function getBillingPeriodNote(sku) {
    if (sku.cycle === 'monthly') {
      return 'Оплата ' + formatUah(sku.priceUah) + ' щомісяця';
    }
    if (sku.cycle === 'season') {
      return 'Разовий платіж ' + formatUah(sku.priceUah) + ' за 3 міс';
    }
    return 'Разовий платіж ' + formatUah(sku.priceUah) + ' за 12 міс';
  }

  function pluralizeSubjects(count) {
    if (count === 1) return '1 предмет';
    return count + ' предмети';
  }

  function pluralizeLessons(count) {
    return count + ' заняття/тиж.';
  }

  function showToast(message) {
    var region = document.getElementById('sp-toast-region');
    if (!region) return;

    var toast = document.createElement('div');
    toast.className = 'sp-toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML =
      iconSvg('checkCircle', 16) +
      '<span>' + escapeHtml(message) + '</span>';

    region.appendChild(toast);

    window.setTimeout(function () {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3400);
  }

  async function copyToClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_err) {
        /* fallback to textarea */
      }
    }

    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return Boolean(ok);
    } catch (_err2) {
      return false;
    }
  }

  function detachActiveTilts() {
    for (var i = 0; i < activeTiltCleanups.length; i++) {
      try {
        activeTiltCleanups[i]();
      } catch (_err) {
        /* ignore detach error */
      }
    }
    activeTiltCleanups = [];
  }

  function formatPredictedScore(diag) {
    if (!diag) return null;
    if (diag.subject && String(diag.subject).toLowerCase().indexOf('англ') !== -1 && diag.cefrLevel) {
      return diag.cefrLevel + (diag.predictedScore ? ' (' + diag.predictedScore + ' / 200)' : '');
    }
    if (diag.predictedScore !== undefined && diag.predictedScore !== null && diag.predictedScore !== '') {
      return diag.predictedScore + ' / 200';
    }
    if (diag.cefrLevel) {
      return String(diag.cefrLevel);
    }
    return null;
  }

  function getRecommendedTierName() {
    if (state.sponsorPayload && state.sponsorPayload.sku) {
      var parsed = parseSkuString(state.sponsorPayload.sku);
      if (parsed && parsed.tier && TIER_META_UK[parsed.tier]) {
        return TIER_META_UK[parsed.tier].name;
      }
    }
    if (state.diagnostic && state.diagnostic.recommendedTier) {
      return state.diagnostic.recommendedTier;
    }
    return 'StrictPass Pro';
  }

  function renderPersonalBanner() {
    var banner = document.getElementById('sp-personal-banner');
    if (!banner) return;

    var source = state.sponsorPayload || state.diagnostic;
    if (!source) {
      if (state.sponsorError) {
        banner.hidden = false;
        banner.innerHTML =
          '<div>' +
          '<div class="sp-banner-eyebrow">' +
          iconSvg('alertCircle', 14) +
          '<span>СПОНСОРСЬКЕ ПОСИЛАННЯ НЕДІЙСНЕ АБО ПОШКОДЖЕНЕ</span>' +
          '</div>' +
          '<h2 class="sp-banner-title">Не вдалося перевірити підпис посилання</h2>' +
          '<p class="sp-banner-sub">Ви можете самостійно обрати оптимальний тариф StrictPass нижче або попросити учня згенерувати нове посилання для батьків.</p>' +
          '</div>' +
          '<div class="sp-banner-metrics">' +
          '<div class="sp-metric-box">' +
          '<span class="sp-metric-label">Рекомендація системи</span>' +
          '<span class="sp-metric-value">StrictPass Pro</span>' +
          '</div>' +
          '<div class="sp-metric-box">' +
          '<span class="sp-metric-label">Оптимальний цикл</span>' +
          '<span class="sp-metric-value">Сезон НМТ · 3 міс</span>' +
          '</div>' +
          '</div>';
        return;
      }
      banner.hidden = true;
      banner.innerHTML = '';
      return;
    }

    var isSponsor = Boolean(state.sponsorPayload);
    var studentName = isSponsor && source.studentName ? source.studentName : null;
    var subject = source.subject || 'Математика (НМТ)';
    var scoreText = formatPredictedScore(source) || 'Профіль сформовано';
    var recommendedPlan = getRecommendedTierName();
    var weakTopics = Array.isArray(source.weakTopics) ? source.weakTopics.slice(0, 5) : [];

    var topicsHtml = weakTopics.length
      ? '<div class="sp-banner-topics">' +
        weakTopics
          .map(function (topic) {
            return '<span class="sa-badge">' + escapeHtml(topic) + '</span>';
          })
          .join('') +
        '</div>'
      : '';

    var eyebrowText = isSponsor
      ? 'ПЕРСОНАЛЬНИЙ ЗАПИТ ДЛЯ БАТЬКІВ'
      : 'ПІДБІР НА ОСНОВІ ВАШОЇ ДІАГНОСТИКИ';

    var titleText = studentName
      ? 'План підготовки для учня: ' + escapeHtml(studentName)
      : 'Результати діагностики синхронізовано з конфігуратором';

    var subText = studentName
      ? 'Учень надіслав профіль діагностики та підібраний тариф. Ви можете оплатити доступ або переглянути слабкі теми нижче.'
      : 'На основі виявлених прогалин система підсвітила рекомендований тариф для стабільного закриття тем до НМТ.';

    banner.hidden = false;
    banner.innerHTML =
      '<div>' +
      '<div class="sp-banner-eyebrow">' +
      iconSvg(isSponsor ? 'userCheck' : 'radar', 14) +
      '<span>' + eyebrowText + '</span>' +
      '</div>' +
      '<h2 class="sp-banner-title">' + titleText + '</h2>' +
      '<p class="sp-banner-sub">' + subText + '</p>' +
      topicsHtml +
      '</div>' +
      '<div class="sp-banner-metrics">' +
      '<div class="sp-metric-box">' +
      '<span class="sp-metric-label">Предмет</span>' +
      '<span class="sp-metric-value">' + escapeHtml(subject) + '</span>' +
      '</div>' +
      '<div class="sp-metric-box">' +
      '<span class="sp-metric-label">Прогноз балів</span>' +
      '<span class="sp-metric-value sa-num">' + escapeHtml(scoreText) + '</span>' +
      '</div>' +
      '<div class="sp-metric-box">' +
      '<span class="sp-metric-label">Слабких тем</span>' +
      '<span class="sp-metric-value sa-num">' + (weakTopics.length ? weakTopics.length + ' виявлено' : 'Базовий аудит') + '</span>' +
      '</div>' +
      '<div class="sp-metric-box">' +
      '<span class="sp-metric-label">Рекомендований план</span>' +
      '<span class="sp-metric-value">' + escapeHtml(recommendedPlan) + '</span>' +
      '</div>' +
      '</div>';
  }

  function renderActivePassPill() {
    var pillWrap = document.getElementById('sp-active-pass-pill');
    if (!pillWrap || !window.StrictAuth) return;

    var snap = window.StrictAuth.getState();
    var pass = snap && snap.activePass;
    if (!pass) {
      pillWrap.hidden = true;
      pillWrap.innerHTML = '';
      return;
    }

    pillWrap.hidden = false;
    pillWrap.innerHTML =
      '<span class="sa-badge sa-badge-ok">' +
      iconSvg('shieldCheck', 14) +
      '<span>АКТИВНИЙ: ' + escapeHtml(pass.tier || 'StrictPass') + ' · ' + escapeHtml(pass.orderId || '') + '</span>' +
      '</span>';
  }

  function syncSegmentedButtons() {
    var seatButtons = document.querySelectorAll('#sp-seats-control button[data-seats]');
    for (var i = 0; i < seatButtons.length; i++) {
      var btn = seatButtons[i];
      var active = btn.getAttribute('data-seats') === state.seats;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      if (active) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    }

    var cycleButtons = document.querySelectorAll('#sp-cycle-control button[data-cycle]');
    for (var j = 0; j < cycleButtons.length; j++) {
      var cBtn = cycleButtons[j];
      var cActive = cBtn.getAttribute('data-cycle') === state.cycle;
      cBtn.setAttribute('aria-pressed', cActive ? 'true' : 'false');
      if (cActive) {
        cBtn.classList.add('is-active');
      } else {
        cBtn.classList.remove('is-active');
      }
    }
  }

  function renderTierCards() {
    var grid = document.getElementById('sp-tiers-grid');
    if (!grid || !window.StrictPassCatalog) return;

    detachActiveTilts();

    var html = TIER_ORDER.map(function (tierKey) {
      var sku = window.StrictPassCatalog.getSKU(state.seats, state.cycle, tierKey);
      var meta = TIER_META_UK[tierKey];
      if (!sku || !meta) return '';

      var isRecommended = tierKey === 'pro';
      var isHighlighted = state.highlightedTier === tierKey;
      var cardClasses = ['sp-tier-card'];
      if (isRecommended) cardClasses.push('is-recommended');
      if (isHighlighted) cardClasses.push('is-highlighted');

      var badgeHtml = '';
      if (isRecommended) {
        badgeHtml = '<span class="sa-badge sa-badge-ink">Рекомендовано</span>';
      } else if (isHighlighted) {
        badgeHtml = '<span class="sa-badge">Обраний рівень</span>';
      }

      var savingsBadgeHtml =
        sku.savingsUah > 0
          ? '<span class="sa-badge sa-badge-ok">Економія ' + formatUah(sku.savingsUah) + '</span>'
          : '';

      var perStudentHtml =
        sku.seatCount > 1
          ? '<span class="sa-num">(' + formatUah(sku.perStudentMonthlyUah) + '/міс за учня)</span>'
          : '';

      var features = [
        getSeatFeatureText(sku.seatCount, sku.seats),
        getCycleFeatureText(sku.cycle, sku.savingsUah)
      ].concat(meta.features);

      var featuresHtml = features
        .map(function (text) {
          return (
            '<li class="sp-feature-item">' +
            '<span class="sp-feature-icon">' + iconSvg('check', 15) + '</span>' +
            '<span>' + escapeHtml(text) + '</span>' +
            '</li>'
          );
        })
        .join('');

      var skuCode = sku.imageFilename.replace(/\.webp$/i, '');

      return (
        '<article class="' + cardClasses.join(' ') + '" data-tier="' + escapeHtml(tierKey) + '">' +
        '<div class="sp-tier-head">' +
        '<div>' +
        '<h2 class="sp-tier-name">' + escapeHtml(meta.name) + '</h2>' +
        '<div class="sp-tier-sku">' + escapeHtml(sku.skuId.toUpperCase()) + '</div>' +
        '</div>' +
        badgeHtml +
        '</div>' +
        '<p class="sp-tier-tagline">' + escapeHtml(meta.tagline) + '</p>' +
        '<div class="sp-stage-box">' +
        '<div class="sa-pass-3d-stage">' +
        '<div class="sa-pass-3d-card">' +
        '<img src="' + escapeHtml(sku.image) + '" alt="' + escapeHtml(meta.name + ' — ' + SEAT_LABELS_UK[sku.seats] + ', ' + CYCLE_LABELS_UK[sku.cycle]) + '" loading="eager" decoding="async">' +
        '<div class="sa-pass-glare"></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="sp-price-block">' +
        '<div class="sp-price-main">' +
        '<span class="sp-price-monthly sa-num">' + formatUah(sku.monthlyEquivalentUah) + '</span>' +
        '<span class="sp-price-period">/міс</span>' +
        '</div>' +
        '<div class="sp-price-meta">' +
        '<span class="sa-num">' + escapeHtml(getBillingPeriodNote(sku)) + '</span>' +
        perStudentHtml +
        savingsBadgeHtml +
        '</div>' +
        '</div>' +
        '<ul class="sp-features">' + featuresHtml + '</ul>' +
        '<div class="sp-card-actions">' +
        '<button type="button" class="sa-btn ' + (isRecommended ? 'sa-btn-primary' : 'sa-btn-secondary') + '" data-action="activate" data-tier="' + escapeHtml(tierKey) + '">' +
        '<span>Обрати та активувати</span>' +
        iconSvg('arrowRight', 15) +
        '</button>' +
        '<button type="button" class="sa-btn sa-btn-ghost sa-btn-sm" data-action="sponsor" data-tier="' + escapeHtml(tierKey) + '" data-sku="' + escapeHtml(skuCode) + '">' +
        iconSvg('share', 14) +
        '<span>Надіслати цей план батькам</span>' +
        '</button>' +
        '</div>' +
        '</article>'
      );
    }).join('');

    grid.innerHTML = html;

    var cardNodes = grid.querySelectorAll('.sa-pass-3d-card');
    for (var i = 0; i < cardNodes.length; i++) {
      var detach = window.StrictPassCatalog.attach3DTilt(cardNodes[i]);
      activeTiltCleanups.push(detach);
    }
  }

  function getCalculatorProSku() {
    if (!window.StrictPassCatalog) return null;
    return window.StrictPassCatalog.getSKU(state.seats, state.cycle, 'pro');
  }

  function computeCalculatorMetrics() {
    var lessonsPerMonth = state.subjects * state.lessonsPerWeek * 4;
    var tutorMonthlyUah = lessonsPerMonth * state.lessonRateUah;
    var proSku = getCalculatorProSku();
    var passMonthlyUah = proSku ? proSku.monthlyEquivalentUah : 800;
    var monthlySavingsUah = Math.max(0, tutorMonthlyUah - passMonthlyUah);
    var seasonSavingsUah = monthlySavingsUah * 3;
    var savingsPercent = tutorMonthlyUah > 0 ? Math.round((monthlySavingsUah / tutorMonthlyUah) * 100) : 0;

    return {
      lessonsPerMonth: lessonsPerMonth,
      tutorMonthlyUah: tutorMonthlyUah,
      passMonthlyUah: passMonthlyUah,
      monthlySavingsUah: monthlySavingsUah,
      seasonSavingsUah: seasonSavingsUah,
      savingsPercent: savingsPercent,
      proSku: proSku
    };
  }

  function renderCalculator() {
    var metrics = computeCalculatorMetrics();

    var subjValEl = document.getElementById('sp-calc-subjects-val');
    var lessValEl = document.getElementById('sp-calc-lessons-val');
    var rateValEl = document.getElementById('sp-calc-rate-val');
    var formulaEl = document.getElementById('sp-calc-formula-text');

    var tutorMonthlyEl = document.getElementById('sp-calc-tutor-monthly');
    var passLabelEl = document.getElementById('sp-calc-pass-label');
    var passMonthlyEl = document.getElementById('sp-calc-pass-monthly');
    var passBarEl = document.getElementById('sp-calc-pass-bar');
    var saveMonthlyEl = document.getElementById('sp-calc-save-monthly');
    var saveSeasonEl = document.getElementById('sp-calc-save-season');
    var savePctEl = document.getElementById('sp-calc-save-pct');

    if (subjValEl) subjValEl.textContent = pluralizeSubjects(state.subjects);
    if (lessValEl) lessValEl.textContent = pluralizeLessons(state.lessonsPerWeek);
    if (rateValEl) rateValEl.textContent = formatUah(state.lessonRateUah);
    if (formulaEl) {
      formulaEl.textContent =
        state.subjects + ' предм. × ' + state.lessonsPerWeek + ' зан. × 4 тижні = ' + metrics.lessonsPerMonth + ' заняття/міс';
    }

    if (tutorMonthlyEl) tutorMonthlyEl.textContent = formatUah(metrics.tutorMonthlyUah) + '/міс';
    if (passLabelEl) {
      passLabelEl.textContent = 'StrictPass Pro (' + CYCLE_LABELS_UK[state.cycle] + ' · ' + SEAT_LABELS_UK[state.seats] + ')';
    }
    if (passMonthlyEl) passMonthlyEl.textContent = formatUah(metrics.passMonthlyUah) + '/міс';

    if (passBarEl) {
      var barPct = metrics.tutorMonthlyUah > 0
        ? Math.max(4, Math.min(100, Math.round((metrics.passMonthlyUah / metrics.tutorMonthlyUah) * 100)))
        : 7;
      passBarEl.style.width = barPct + '%';
    }

    if (saveMonthlyEl) saveMonthlyEl.textContent = formatUah(metrics.monthlySavingsUah);
    if (saveSeasonEl) saveSeasonEl.textContent = formatUah(metrics.seasonSavingsUah);
    if (savePctEl) savePctEl.textContent = metrics.savingsPercent + '%';
  }

  function renderComparisonTable() {
    var tbody = document.getElementById('sp-compare-tbody');
    if (!tbody) return;

    tbody.innerHTML = COMPARISON_ROWS.map(function (row) {
      function renderCell(cell, extraClass) {
        var icon = cell.ok
          ? '<span class="sp-status-icon-ok">' + iconSvg('checkCircle', 16) + '</span>'
          : '<span class="sp-status-icon-no">' + iconSvg('x', 16) + '</span>';
        return (
          '<td' + (extraClass ? ' class="' + extraClass + '"' : '') + '>' +
          '<div class="sp-cell-status">' + icon + '<span>' + escapeHtml(cell.text) + '</span></div>' +
          '</td>'
        );
      }

      return (
        '<tr>' +
        '<td class="sp-cell-criterion">' + escapeHtml(row.criterion) + '</td>' +
        renderCell(row.tutor, '') +
        renderCell(row.chatgpt, '') +
        renderCell(row.strictpass, 'is-strictpass') +
        '</tr>'
      );
    }).join('');
  }

  async function handleSponsorShare(tierKey, triggerBtn) {
    if (!window.StrictPassCatalog) return;
    var sku = window.StrictPassCatalog.getSKU(state.seats, state.cycle, tierKey);
    if (!sku) return;

    var skuSlug = sku.imageFilename.replace(/\.webp$/i, '');
    var shareUrl = resolvePageUrl('strictpass.html') + '?sku=' + encodeURIComponent(sku.skuId);

    if (window.StrictAuth && typeof window.StrictAuth.createSponsorLink === 'function') {
      try {
        var res = await window.StrictAuth.createSponsorLink({
          sku: skuSlug,
          baseUrl: resolvePageUrl('strictpass.html')
        });
        if (res && res.url) {
          shareUrl = res.url;
        }
      } catch (_err) {
        /* keep fallback URL */
      }
    }

    var message =
      'Ось мій план підготовки до НМТ — ' + sku.tierName +
      ' (' + SEAT_LABELS_UK[sku.seats] + ', ' + CYCLE_LABELS_UK[sku.cycle] + '): ' +
      formatUah(sku.priceUah) + ' (' + formatUah(sku.monthlyEquivalentUah) + '/міс' +
      (sku.savingsUah > 0 ? ', економія ' + formatUah(sku.savingsUah) : '') +
      '). Переглянути деталі та діагностику: ' + shareUrl;

    var copied = await copyToClipboard(message);
    if (copied) {
      showToast('Посилання та опис тарифу скопійовано для батьків');
      if (triggerBtn) {
        var span = triggerBtn.querySelector('span');
        if (span) {
          var prev = span.textContent;
          span.textContent = 'Скопійовано для батьків';
          window.setTimeout(function () {
            span.textContent = prev;
          }, 2200);
        }
      }
    } else {
      showToast('Не вдалося скопіювати автоматично — перевірте дозвіл буфера обміну');
    }
  }

  async function handleCopyCalculatorSummary() {
    var metrics = computeCalculatorMetrics();
    var sku = metrics.proSku;
    var skuSlug = sku ? sku.imageFilename.replace(/\.webp$/i, '') : 'StrictPass_Pro_Single_Season';
    var linkUrl = resolvePageUrl('strictpass.html');

    if (window.StrictAuth && typeof window.StrictAuth.createSponsorLink === 'function') {
      try {
        var sponsor = await window.StrictAuth.createSponsorLink({
          sku: skuSlug,
          baseUrl: resolvePageUrl('strictpass.html')
        });
        if (sponsor && sponsor.url) {
          linkUrl = sponsor.url;
        }
      } catch (_err) {
        /* keep strictpass.html link */
      }
    }

    var summary =
      'Розрахунок підготовки до НМТ (StrictAI vs репетитори):\n' +
      '- Репетитори (' + pluralizeSubjects(state.subjects) + ', ' + state.lessonsPerWeek + ' зан./тиж. по ' + formatUah(state.lessonRateUah) + '): ' +
      formatUah(metrics.tutorMonthlyUah) + '/міс\n' +
      '- StrictPass Pro (' + SEAT_LABELS_UK[state.seats] + ', ' + CYCLE_LABELS_UK[state.cycle] + '): ' +
      formatUah(metrics.passMonthlyUah) + '/міс' +
      (sku ? ' (оплата ' + formatUah(sku.priceUah) + ')' : '') + '\n' +
      '- Економія: ' + formatUah(metrics.monthlySavingsUah) + '/міс (' + formatUah(metrics.seasonSavingsUah) + ' за сезон НМТ · мінус ' + metrics.savingsPercent + '% витрат)\n' +
      'Обрати та активувати: ' + linkUrl;

    var copied = await copyToClipboard(summary);
    if (copied) {
      showToast('Розрахунок для батьків скопійовано в буфер обміну');
    } else {
      showToast('Не вдалося скопіювати розрахунок у буфер обміну');
    }
  }

  function buildAuthRedirectUrl(sku) {
    var params = new URLSearchParams();
    params.set('intent', 'strictpass');
    params.set('sku', sku.skuId);
    if (state.diagnostic && state.diagnostic.sid) {
      params.set('sid', state.diagnostic.sid);
    }
    return 'auth.html?' + params.toString();
  }

  function renderCheckoutModal() {
    var modal = document.getElementById('sp-checkout-modal');
    var body = document.getElementById('sp-modal-body');
    var sku = state.activeModalSku;
    if (!modal || !body || !sku) return;

    var currentUser = window.StrictAuth && typeof window.StrictAuth.getCurrentUser === 'function'
      ? window.StrictAuth.getCurrentUser()
      : null;

    var result = state.activeModalResult;
    var resultHtml = '';

    if (result && result.activePass) {
      var expiresDate = result.activePass.expiresAt
        ? new Date(result.activePass.expiresAt).toLocaleDateString('uk-UA')
        : '—';
      resultHtml =
        '<div class="sp-modal-result">' +
        '<div style="display:flex;align-items:center;gap:8px;font-weight:600;">' +
        iconSvg('shieldCheck', 18) +
        '<span>StrictPass активовано (' + escapeHtml(result.activePass.orderId) + ')</span>' +
        '</div>' +
        '<div>Тариф: <strong>' + escapeHtml(result.activePass.tier) + '</strong> · Діє до <span class="sa-num">' + escapeHtml(expiresDate) + '</span></div>' +
        (!currentUser
          ? '<div>Це локальне демо-прев\'ю активації. Увійдіть у профіль, щоб закріпити ліцензію за акаунтом.</div>'
          : '<div>Ліцензію збережено у вашому профілі та синхронізовано з сімейним кабінетом.</div>') +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;">' +
        (!currentUser
          ? '<a class="sa-btn sa-btn-primary sa-btn-sm" href="' + escapeHtml(buildAuthRedirectUrl(sku)) + '">Закріпити в акаунті</a>'
          : '<a class="sa-btn sa-btn-primary sa-btn-sm" href="parents.html">Кабінет батьків</a>') +
        '<button type="button" class="sa-btn sa-btn-secondary sa-btn-sm" data-modal-action="close">Готово</button>' +
        '</div>' +
        '</div>';
    }

    var actionsHtml = '';
    if (!result) {
      if (currentUser) {
        actionsHtml =
          '<div class="sp-modal-actions">' +
          '<button type="button" class="sa-btn sa-btn-primary" data-modal-action="confirm-activate">' +
          iconSvg('shieldCheck', 16) +
          '<span>Підтвердити та активувати (' + formatUah(sku.priceUah) + ')</span>' +
          '</button>' +
          '<button type="button" class="sa-btn sa-btn-ghost sa-btn-sm" data-modal-action="close">Скасувати</button>' +
          '</div>';
      } else {
        actionsHtml =
          '<div class="sp-modal-actions">' +
          '<a class="sa-btn sa-btn-primary" href="' + escapeHtml(buildAuthRedirectUrl(sku)) + '">' +
          iconSvg('userCheck', 16) +
          '<span>Увійти та активувати план</span>' +
          '</a>' +
          '<button type="button" class="sa-btn sa-btn-secondary" data-modal-action="demo-activate">' +
          iconSvg('play', 15) +
          '<span>Миттєва демо-активація (прев\'ю)</span>' +
          '</button>' +
          '</div>';
      }
    }

    var accountNote = currentUser
      ? 'Акаунт: ' + escapeHtml(currentUser.displayName || currentUser.email || currentUser.uid)
      : 'Вхід не виконано — ви можете увійти або перевірити демо-активацію';

    body.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:16px;">' +
      '<div class="sp-modal-summary">' +
      '<img class="sp-modal-thumb" src="' + escapeHtml(sku.image) + '" alt="' + escapeHtml(sku.tierName) + '">' +
      '<div>' +
      '<div style="font-weight:700;font-size:16px;">' + escapeHtml(sku.tierName) + '</div>' +
      '<div style="font-size:13px;color:var(--ink-secondary);">' + escapeHtml(SEAT_LABELS_UK[sku.seats]) + ' · ' + escapeHtml(CYCLE_LABELS_UK[sku.cycle]) + '</div>' +
      '<div class="sa-mono" style="font-size:11px;color:var(--ink-muted);margin-top:4px;">' + escapeHtml(sku.skuId.toUpperCase()) + '</div>' +
      '</div>' +
      '</div>' +
      '<div class="sp-modal-rows">' +
      '<div class="sp-modal-row"><span>Еквівалент на місяць</span><strong class="sa-num">' + formatUah(sku.monthlyEquivalentUah) + '/міс</strong></div>' +
      '<div class="sp-modal-row"><span>До сплати за період</span><strong class="sa-num">' + formatUah(sku.priceUah) + '</strong></div>' +
      (sku.savingsUah > 0
        ? '<div class="sp-modal-row"><span>Вигода порівняно з помісячною оплатою</span><strong class="sa-num" style="color:var(--status-ok);">−' + formatUah(sku.savingsUah) + '</strong></div>'
        : '') +
      '<div class="sp-modal-row"><span style="color:var(--ink-muted);font-size:12px;">' + accountNote + '</span></div>' +
      '</div>' +
      resultHtml +
      actionsHtml +
      '</div>';
  }

  function openCheckoutModal(tierKey) {
    if (!window.StrictPassCatalog) return;
    var sku = window.StrictPassCatalog.getSKU(state.seats, state.cycle, tierKey);
    if (!sku) return;

    state.activeModalSku = sku;
    state.activeModalResult = null;
    renderCheckoutModal();

    var modal = document.getElementById('sp-checkout-modal');
    if (modal) {
      modal.hidden = false;
    }
  }

  function closeCheckoutModal() {
    var modal = document.getElementById('sp-checkout-modal');
    if (modal) {
      modal.hidden = true;
    }
    state.activeModalSku = null;
    state.activeModalResult = null;
  }

  async function executeActivation() {
    var sku = state.activeModalSku;
    if (!sku || !window.StrictAuth || typeof window.StrictAuth.activateStrictPass !== 'function') {
      return;
    }

    try {
      var res = await window.StrictAuth.activateStrictPass({
        tier: sku.tierName,
        seatType: sku.seats,
        cycle: sku.cycle,
        priceUah: sku.priceUah
      });
      state.activeModalResult = res;
      renderCheckoutModal();
      renderActivePassPill();
      showToast(sku.tierName + ' активовано (' + res.activePass.orderId + ')');
    } catch (err) {
      showToast((err && err.message) || 'Помилка активації StrictPass');
    }
  }

  function bindEvents() {
    var seatsControl = document.getElementById('sp-seats-control');
    if (seatsControl) {
      seatsControl.addEventListener('click', function (ev) {
        var btn = ev.target.closest('button[data-seats]');
        if (!btn) return;
        var nextSeats = btn.getAttribute('data-seats');
        if (!nextSeats || nextSeats === state.seats) return;
        state.seats = nextSeats;
        syncSegmentedButtons();
        renderTierCards();
        renderCalculator();
      });
    }

    var cycleControl = document.getElementById('sp-cycle-control');
    if (cycleControl) {
      cycleControl.addEventListener('click', function (ev) {
        var btn = ev.target.closest('button[data-cycle]');
        if (!btn) return;
        var nextCycle = btn.getAttribute('data-cycle');
        if (!nextCycle || nextCycle === state.cycle) return;
        state.cycle = nextCycle;
        syncSegmentedButtons();
        renderTierCards();
        renderCalculator();
      });
    }

    var tiersGrid = document.getElementById('sp-tiers-grid');
    if (tiersGrid) {
      tiersGrid.addEventListener('click', function (ev) {
        var btn = ev.target.closest('button[data-action]');
        if (!btn) return;
        var action = btn.getAttribute('data-action');
        var tier = btn.getAttribute('data-tier');
        if (action === 'activate') {
          openCheckoutModal(tier);
        } else if (action === 'sponsor') {
          handleSponsorShare(tier, btn);
        }
      });
    }

    var subjSlider = document.getElementById('sp-calc-subjects');
    var lessSlider = document.getElementById('sp-calc-lessons');
    var rateSlider = document.getElementById('sp-calc-rate');

    if (subjSlider) {
      subjSlider.addEventListener('input', function () {
        state.subjects = Number(subjSlider.value) || 3;
        renderCalculator();
      });
    }
    if (lessSlider) {
      lessSlider.addEventListener('input', function () {
        state.lessonsPerWeek = Number(lessSlider.value) || 2;
        renderCalculator();
      });
    }
    if (rateSlider) {
      rateSlider.addEventListener('input', function () {
        state.lessonRateUah = Number(rateSlider.value) || 500;
        renderCalculator();
      });
    }

    var copyCalcBtn = document.getElementById('sp-copy-calc-btn');
    if (copyCalcBtn) {
      copyCalcBtn.addEventListener('click', function () {
        handleCopyCalculatorSummary();
      });
    }

    var modal = document.getElementById('sp-checkout-modal');
    var modalClose = document.getElementById('sp-modal-close');
    if (modalClose) {
      modalClose.addEventListener('click', closeCheckoutModal);
    }
    if (modal) {
      modal.addEventListener('click', function (ev) {
        if (ev.target === modal) {
          closeCheckoutModal();
          return;
        }
        var actionEl = ev.target.closest('[data-modal-action]');
        if (!actionEl) return;
        var act = actionEl.getAttribute('data-modal-action');
        if (act === 'close') {
          closeCheckoutModal();
        } else if (act === 'confirm-activate' || act === 'demo-activate') {
          executeActivation();
        }
      });
    }

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') {
        var modalEl = document.getElementById('sp-checkout-modal');
        if (modalEl && !modalEl.hidden) {
          closeCheckoutModal();
        }
      }
    });
  }

  async function hydrateContextFromUrlAndAuth() {
    var params = new URLSearchParams(window.location.search || '');
    var sponsorParam = params.get('sponsor');
    var sidParam = params.get('sid');
    var skuParam = params.get('sku');
    var seatsParam = params.get('seats');
    var cycleParam = params.get('cycle');
    var tierParam = params.get('tier');

    if (window.StrictAuth && typeof window.StrictAuth.init === 'function') {
      try {
        await window.StrictAuth.init();
      } catch (_err) {
        /* continue in local fallback */
      }
    }

    if (sponsorParam && window.StrictAuth && typeof window.StrictAuth.consumeSponsorLink === 'function') {
      try {
        var sponsorData = await window.StrictAuth.consumeSponsorLink(window.location.href);
        state.sponsorPayload = sponsorData;
        if (sponsorData && sponsorData.sku) {
          var parsedSponsorSku = parseSkuString(sponsorData.sku);
          if (parsedSponsorSku) {
            if (parsedSponsorSku.seats) state.seats = parsedSponsorSku.seats;
            if (parsedSponsorSku.cycle) state.cycle = parsedSponsorSku.cycle;
            if (parsedSponsorSku.tier) state.highlightedTier = parsedSponsorSku.tier;
          }
        }
      } catch (_err2) {
        state.sponsorError = true;
      }
    }

    if (window.StrictAuth) {
      var latest = window.StrictAuth.getLatestDiagnostic();
      if (sidParam && (!latest || latest.sid !== sidParam) && typeof window.StrictAuth.consumeHandoffToken === 'function') {
        try {
          var handoff = await window.StrictAuth.consumeHandoffToken('?sid=' + encodeURIComponent(sidParam));
          if (handoff && handoff.diagnostic) {
            latest = handoff.diagnostic;
          }
        } catch (_err3) {
          /* ignore missing sid */
        }
      }
      state.diagnostic = latest || null;
    }

    if (skuParam) {
      var parsedSku = parseSkuString(skuParam);
      if (parsedSku) {
        if (parsedSku.seats) state.seats = parsedSku.seats;
        if (parsedSku.cycle) state.cycle = parsedSku.cycle;
        if (parsedSku.tier) state.highlightedTier = parsedSku.tier;
      }
    }

    if (seatsParam && SEAT_LABELS_UK[seatsParam]) {
      state.seats = seatsParam;
    }
    if (cycleParam && CYCLE_LABELS_UK[cycleParam]) {
      state.cycle = cycleParam;
    }
    if (tierParam) {
      var normalizedTier = tierParam.toLowerCase();
      if (normalizedTier === 'base' || normalizedTier === 'core') normalizedTier = 'strictpass';
      if (TIER_META_UK[normalizedTier]) {
        state.highlightedTier = normalizedTier;
      }
    }
  }

  async function initPage() {
    if (window.StrictIcons && typeof window.StrictIcons.mountAll === 'function') {
      window.StrictIcons.mountAll(document);
    }

    bindEvents();
    renderComparisonTable();
    syncSegmentedButtons();
    renderTierCards();
    renderCalculator();

    await hydrateContextFromUrlAndAuth();

    if (window.StrictAuth && typeof window.StrictAuth.onChange === 'function') {
      window.StrictAuth.onChange(function (_user, snap) {
        if (snap && snap.latestDiagnostic) {
          state.diagnostic = snap.latestDiagnostic;
        }
        renderPersonalBanner();
        renderActivePassPill();
        if (state.activeModalSku) {
          renderCheckoutModal();
        }
      });
    }

    syncSegmentedButtons();
    renderPersonalBanner();
    renderActivePassPill();
    renderTierCards();
    renderCalculator();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
  } else {
    initPage();
  }
})(window, document);
