/* ==========================================================================
   StrictAI Home Page Controller (site-home.js)
   Drives:
   1. 3D-Tilt Metallic StrictPass Showcase Stage (Steel / Gold / Iridescent)
   2. NMT Competitive Score & Budget Deficit Calculator
   3. Mobile App Handoff Preview Hydration via StrictAuth
   Zero emojis.
   ========================================================================== */
(function (globalScope) {
  'use strict';

  var TIER_META = {
    strictpass: {
      badge: 'STEEL FINISH',
      alt: 'Металева картка StrictPass Single Season (Steel)',
      summary: 'Базова діагностика НМТ, сократичний розбір помилок і щоденні вправи з телеметрією.'
    },
    pro: {
      badge: 'GOLD FINISH',
      alt: 'Металева картка StrictPass Pro Single Season (Gold)',
      summary: 'Розширені симуляції НМТ, кластеризація помилок і щотижневий звіт для батьків.'
    },
    max: {
      badge: 'IRIDESCENT',
      alt: 'Металева картка StrictPass MAX Single Season (Iridescent)',
      summary: 'Повний спектр підготовки: пріоритетний ШІ-розбір доведень і персональний індекс готовності.'
    }
  };

  var UNI_PRESETS = {
    kpi_121: {
      key: 'kpi_121',
      name: 'КПІ 121 ІПЗ',
      target: 184,
      weights: { math: 0.40, ukr: 0.25, hist: 0.15, elective: 0.20 }
    },
    knu_cs: {
      key: 'knu_cs',
      name: 'КНУ Комп\'ютерні науки',
      target: 186,
      weights: { math: 0.40, ukr: 0.25, hist: 0.15, elective: 0.20 }
    },
    lpnu_it: {
      key: 'lpnu_it',
      name: 'Львівська політехніка ІТ',
      target: 179,
      weights: { math: 0.35, ukr: 0.25, hist: 0.15, elective: 0.25 }
    },
    naukma_law: {
      key: 'naukma_law',
      name: 'НаУКМА Право',
      target: 185,
      weights: { math: 0.20, ukr: 0.35, hist: 0.30, elective: 0.15 }
    }
  };

  var SUBJECTS = [
    { key: 'math', label: 'Математика' },
    { key: 'ukr', label: 'Українська мова' },
    { key: 'hist', label: 'Історія України' },
    { key: 'elective', label: 'Вибірковий предмет' }
  ];

  function formatSpacedInt(num) {
    var n = Math.round(Number(num) || 0);
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function formatHryvnia(num) {
    return formatSpacedInt(num) + ' \u20B4';
  }

  function formatSignedOneDecimal(val) {
    var rounded = Math.round(val * 10) / 10;
    var sign = rounded > 0 ? '+' : (rounded < 0 ? '-' : '');
    return sign + Math.abs(rounded).toFixed(1);
  }

  function clampScore(val) {
    var n = Number(val);
    if (isNaN(n)) return 150;
    return n < 100 ? 100 : (n > 200 ? 200 : n);
  }

  /* ------------------------------------------------------------------
     1. 3D-Tilt Metallic StrictPass Showcase Stage
     ------------------------------------------------------------------ */
  function initHeroPassStage() {
    var cardEl = document.getElementById('hero-pass-card');
    var imgEl = document.getElementById('hero-pass-img');
    var badgeEl = document.getElementById('hero-pass-badge');
    var priceEl = document.getElementById('hero-sku-price');
    var monthlyEl = document.getElementById('hero-sku-monthly');
    var codeEl = document.getElementById('hero-sku-code');
    var summaryEl = document.getElementById('hero-sku-summary');
    var linkEl = document.getElementById('hero-sku-link');
    var tabs = document.querySelectorAll('[data-tier-tab]');

    if (!cardEl || !imgEl || !tabs.length) {
      return;
    }

    var catalog = globalScope.StrictPassCatalog;
    if (catalog && typeof catalog.attach3DTilt === 'function') {
      catalog.attach3DTilt(cardEl, {
        stiffness: 0.14,
        damping: 0.76,
        maxRotateX: 13,
        maxRotateY: 15,
        scale: 1.02
      });
    }

    function selectTier(tierKey) {
      var normalized = TIER_META[tierKey] ? tierKey : 'pro';
      var meta = TIER_META[normalized];
      var sku = catalog && typeof catalog.getSKU === 'function'
        ? catalog.getSKU('single', 'season', normalized)
        : null;

      for (var i = 0; i < tabs.length; i++) {
        var btn = tabs[i];
        var isMatch = btn.getAttribute('data-tier-tab') === normalized;
        btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        btn.classList.toggle('is-active', isMatch);
      }

      if (sku) {
        imgEl.src = sku.image;
        if (priceEl) priceEl.textContent = formatHryvnia(sku.priceUah);
        if (monthlyEl) monthlyEl.textContent = formatHryvnia(sku.monthlyEquivalentUah) + ' / \u043c\u0456\u0441';
        if (codeEl) codeEl.textContent = sku.seatLabel + ' \u00b7 ' + sku.cycleLabel;
      }

      imgEl.alt = meta.alt;
      if (badgeEl) badgeEl.textContent = meta.badge;
      if (summaryEl) summaryEl.textContent = meta.summary;
      if (linkEl) linkEl.href = 'strictpass.html?tier=' + encodeURIComponent(normalized);
    }

    for (var j = 0; j < tabs.length; j++) {
      tabs[j].addEventListener('click', function (ev) {
        var tier = ev.currentTarget.getAttribute('data-tier-tab');
        selectTier(tier);
      });
    }

    selectTier('pro');
  }

  /* ------------------------------------------------------------------
     2. NMT Competitive Score & Budget Deficit Calculator
     ------------------------------------------------------------------ */
  function initCalculator() {
    var uniButtons = document.querySelectorAll('[data-uni]');
    var sliderEls = document.querySelectorAll('[data-subject-slider]');

    if (!uniButtons.length || !sliderEls.length) {
      return null;
    }

    var state = {
      uniKey: 'kpi_121',
      scores: {
        math: 152,
        ukr: 164,
        hist: 158,
        elective: 160
      },
      hasRealDiagnostic: false
    };

    var scoreEl = document.getElementById('calc-score');
    var targetEl = document.getElementById('calc-target');
    var bannerEl = document.getElementById('calc-deficit-banner');
    var deficitTextEl = document.getElementById('calc-deficit-text');
    var deficitBadgeEl = document.getElementById('calc-deficit-badge');
    var uniLabelEl = document.getElementById('calc-uni-label');
    var weakestLabelEl = document.getElementById('calc-weakest-label');
    var weeksLabelEl = document.getElementById('calc-weeks-label');
    var ctaLinkEl = document.getElementById('calc-cta-link');

    var handoffScoreEl = document.getElementById('handoff-score');

    function updateSliderVisual(inputEl, val) {
      var pct = ((val - 100) / 100) * 100;
      inputEl.style.background =
        'linear-gradient(to right, var(--accent-ink) 0%, var(--accent-ink) ' +
        pct.toFixed(1) +
        '%, var(--bg-subtle) ' +
        pct.toFixed(1) +
        '%, var(--bg-subtle) 100%)';
    }

    function computeResult() {
      var preset = UNI_PRESETS[state.uniKey] || UNI_PRESETS.kpi_121;
      var weights = preset.weights;
      var weightedSum = 0;
      var weakest = SUBJECTS[0];
      var maxDrag = -Infinity;

      for (var i = 0; i < SUBJECTS.length; i++) {
        var subj = SUBJECTS[i];
        var val = clampScore(state.scores[subj.key]);
        var w = weights[subj.key] || 0.25;
        weightedSum += val * w;

        // Impact drag: deficit relative to target weighted by subject coefficient
        var drag = (preset.target - val) * w;
        if (drag > maxDrag || (drag === maxDrag && val < clampScore(state.scores[weakest.key]))) {
          maxDrag = drag;
          weakest = subj;
        }
      }

      var finalScore = Math.round(weightedSum * 10) / 10;
      var diff = Math.round((finalScore - preset.target) * 10) / 10;

      return {
        preset: preset,
        score: finalScore,
        diff: diff,
        weakestKey: weakest.key,
        weakestLabel: weakest.label,
        weakestScore: clampScore(state.scores[weakest.key])
      };
    }

    function render() {
      var res = computeResult();
      var preset = res.preset;

      for (var u = 0; u < uniButtons.length; u++) {
        var btn = uniButtons[u];
        var active = btn.getAttribute('data-uni') === preset.key;
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        btn.classList.toggle('is-active', active);
      }

      for (var i = 0; i < SUBJECTS.length; i++) {
        var subjKey = SUBJECTS[i].key;
        var wEl = document.getElementById('weight-' + subjKey);
        var valEl = document.getElementById('val-' + subjKey);
        var inputEl = document.getElementById('slider-' + subjKey);
        var scoreVal = clampScore(state.scores[subjKey]);

        if (wEl) {
          wEl.textContent = 'k = ' + (preset.weights[subjKey] || 0.25).toFixed(2);
        }
        if (valEl) {
          valEl.textContent = String(scoreVal);
        }
        if (inputEl) {
          updateSliderVisual(inputEl, scoreVal);
        }
      }

      if (scoreEl) scoreEl.textContent = res.score.toFixed(1);
      if (targetEl) targetEl.textContent = preset.target.toFixed(1);
      if (uniLabelEl) uniLabelEl.textContent = preset.name;
      if (weakestLabelEl) {
        weakestLabelEl.textContent = res.weakestLabel + ' \u00b7 ' + res.weakestScore + ' \u0431.';
      }

      if (bannerEl && deficitTextEl && deficitBadgeEl) {
        bannerEl.classList.remove('is-danger', 'is-warn', 'is-ok');

        var iconEl = bannerEl.querySelector('svg, [data-icon]');
        if (res.diff < 0) {
          var isSevere = res.diff <= -10;
          bannerEl.classList.add(isSevere ? 'is-danger' : 'is-warn');
          deficitTextEl.textContent = '\u0414\u0435\u0444\u0456\u0446\u0438\u0442: ' + formatSignedOneDecimal(res.diff) + ' \u0431.';
          deficitBadgeEl.textContent = isSevere
            ? '\u041a\u0440\u0438\u0442\u0438\u0447\u043d\u0438\u0439 \u0440\u043e\u0437\u0440\u0438\u0432 \u0434\u043e \u0431\u044e\u0434\u0436\u0435\u0442\u0443'
            : '\u0411\u043b\u0438\u0437\u044c\u043a\u043e \u0434\u043e \u043f\u043e\u0440\u043e\u0433\u0443 \u0431\u044e\u0434\u0436\u0435\u0442\u0443';
          if (iconEl && globalScope.StrictIcons) {
            var warnWrap = document.createElement('span');
            warnWrap.innerHTML = globalScope.StrictIcons.svg('alertTriangle', 18);
            if (warnWrap.firstElementChild && iconEl.parentNode) {
              iconEl.parentNode.replaceChild(warnWrap.firstElementChild, iconEl);
            }
          }
        } else {
          bannerEl.classList.add('is-ok');
          deficitTextEl.textContent = '\u0417\u0430\u043f\u0430\u0441: ' + formatSignedOneDecimal(res.diff) + ' \u0431.';
          deficitBadgeEl.textContent = '\u0412\u0438\u0449\u0435 \u043f\u043e\u0440\u043e\u0433\u0443 \u0431\u044e\u0434\u0436\u0435\u0442\u0443';
          if (iconEl && globalScope.StrictIcons) {
            var okWrap = document.createElement('span');
            okWrap.innerHTML = globalScope.StrictIcons.svg('checkCircle', 18);
            if (okWrap.firstElementChild && iconEl.parentNode) {
              iconEl.parentNode.replaceChild(okWrap.firstElementChild, iconEl);
            }
          }
        }
      }

      if (weeksLabelEl) {
        if (res.diff < 0) {
          var weeks = Math.max(2, Math.min(24, Math.ceil(Math.abs(res.diff) / 3)));
          weeksLabelEl.textContent = '~' + weeks + ' \u0442\u0438\u0436\u043d\u0456\u0432 \u0441\u0438\u0441\u0442\u0435\u043c\u043d\u043e\u0433\u043e \u0442\u0440\u0435\u043a\u0443';
        } else {
          weeksLabelEl.textContent = '\u041f\u0456\u0434\u0442\u0440\u0438\u043c\u043a\u0430 \u0442\u0435\u043c\u043f\u0443 \u0434\u043e \u0456\u0441\u043f\u0438\u0442\u0443';
        }
      }

      if (ctaLinkEl) {
        ctaLinkEl.href =
          'diagnostic.html?uni=' +
          encodeURIComponent(preset.key) +
          '&subject=' +
          encodeURIComponent(res.weakestKey);
      }

      if (!state.hasRealDiagnostic && handoffScoreEl) {
        handoffScoreEl.textContent =
          res.score.toFixed(1) + ' / ' + preset.target.toFixed(1) + ' (' + preset.name + ')';
      }
    }

    for (var i = 0; i < uniButtons.length; i++) {
      uniButtons[i].addEventListener('click', function (ev) {
        var uni = ev.currentTarget.getAttribute('data-uni');
        if (UNI_PRESETS[uni]) {
          state.uniKey = uni;
          render();
        }
      });
    }

    for (var j = 0; j < sliderEls.length; j++) {
      sliderEls[j].addEventListener('input', function (ev) {
        var el = ev.currentTarget;
        var subjKey = el.getAttribute('data-subject-slider');
        if (Object.prototype.hasOwnProperty.call(state.scores, subjKey)) {
          state.scores[subjKey] = clampScore(el.value);
          render();
        }
      });
    }

    render();

    return {
      markRealDiagnostic: function () {
        state.hasRealDiagnostic = true;
      }
    };
  }

  /* ------------------------------------------------------------------
     3. Mobile App Handoff Preview Hydration (StrictAuth)
     ------------------------------------------------------------------ */
  function hydrateHandoffPreview(calcController) {
    var auth = globalScope.StrictAuth;
    if (!auth || typeof auth.init !== 'function') {
      return;
    }

    var badgeEl = document.getElementById('handoff-sync-badge');
    var sidEl = document.getElementById('handoff-sid');
    var scoreEl = document.getElementById('handoff-score');
    var trustEl = document.getElementById('handoff-trust');
    var tierEl = document.getElementById('handoff-tier');
    var topicsEl = document.getElementById('handoff-topics');

    function applyDiagnosticSnapshot(diag, status) {
      if (badgeEl && status) {
        badgeEl.textContent = status.mode === 'firebase' ? 'Firebase Cloud Sync' : 'Vault Ready';
      }

      if (!diag) {
        return;
      }

      if (calcController) {
        calcController.markRealDiagnostic();
      }

      if (sidEl && diag.sid) {
        sidEl.textContent = diag.sid;
      }

      if (scoreEl && diag.predictedScore) {
        var uniSuffix = diag.targetUni ? ' (' + diag.targetUni + ')' : '';
        scoreEl.textContent = String(diag.predictedScore) + ' \u0431.' + uniSuffix;
      }

      if (trustEl && diag.trustScore !== undefined) {
        trustEl.textContent = String(diag.trustScore) + '% Verified';
      }

      if (tierEl && diag.recommendedTier) {
        tierEl.textContent = diag.recommendedTier;
      }

      if (topicsEl && Array.isArray(diag.weakTopics) && diag.weakTopics.length > 0) {
        topicsEl.innerHTML = '';
        var limit = Math.min(diag.weakTopics.length, 4);
        for (var i = 0; i < limit; i++) {
          var badge = document.createElement('span');
          badge.className = 'sa-badge sa-mono';
          badge.textContent = String(diag.weakTopics[i]);
          topicsEl.appendChild(badge);
        }
      }
    }

    auth.init().then(function () {
      var latest = typeof auth.getLatestDiagnostic === 'function' ? auth.getLatestDiagnostic() : null;
      var status = typeof auth.getFirebaseStatus === 'function' ? auth.getFirebaseStatus() : null;
      applyDiagnosticSnapshot(latest, status);
    }).catch(function () {
      /* gracefully remain in preview state */
    });

    if (typeof auth.onChange === 'function') {
      auth.onChange(function (_user, snap) {
        var status = typeof auth.getFirebaseStatus === 'function' ? auth.getFirebaseStatus() : null;
        if (snap && snap.latestDiagnostic) {
          applyDiagnosticSnapshot(snap.latestDiagnostic, status);
        }
      });
    }
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  function boot() {
    if (globalScope.StrictIcons && typeof globalScope.StrictIcons.mountAll === 'function') {
      globalScope.StrictIcons.mountAll(document);
    }
    initHeroPassStage();
    var calcController = initCalculator();
    hydrateHandoffPreview(calcController);
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
