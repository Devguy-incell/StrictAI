/* ==========================================================================
   StrictPass 27-SKU Catalog & Spring-Interpolated 3D Tilt Physics
   Zero emojis. Framework-agnostic UMD module.
   Exposes window.StrictPassCatalog & CommonJS module.exports.
   ========================================================================== */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.StrictPassCatalog = factory();
  }
  if (typeof window !== 'undefined' && !window.StrictPassCatalog) {
    window.StrictPassCatalog = root.StrictPassCatalog || factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var SEATS = {
    single: {
      id: 'single',
      label: 'Single',
      fileSegment: 'Single',
      seatCount: 1,
      description: '1 student account'
    },
    duo: {
      id: 'duo',
      label: 'Duo',
      fileSegment: 'Duo',
      seatCount: 2,
      description: '2 student accounts'
    },
    family: {
      id: 'family',
      label: 'Family',
      fileSegment: 'Family',
      seatCount: 4,
      description: '4 student accounts'
    }
  };

  var CYCLES = {
    monthly: {
      id: 'monthly',
      label: 'Monthly',
      fileSegment: 'Monthly',
      months: 1
    },
    season: {
      id: 'season',
      label: 'Season',
      fileSegment: 'Season',
      months: 3
    },
    annual: {
      id: 'annual',
      label: 'Annual',
      fileSegment: 'Annual',
      months: 12
    }
  };

  var TIERS = {
    strictpass: {
      id: 'strictpass',
      name: 'StrictPass',
      filePrefix: 'StrictPass',
      tagline: 'Core diagnostic engine and guided Socratic remediation',
      features: [
        'Full NMT & subject diagnostic radar across core topics',
        'Socratic step-by-step error repair without answer spoilers',
        'Adaptive daily drill queue with streak telemetry',
        'Mobile & web progress sync with offline flash drills'
      ]
    },
    pro: {
      id: 'pro',
      name: 'StrictPass Pro',
      filePrefix: 'StrictPass_Pro',
      tagline: 'Extended exam simulations, mistake forensics & velocity tracking',
      features: [
        'Everything in StrictPass core diagnostic suite',
        'Unlimited timed NMT mock blocks with pacing breakdown',
        'Deep error-pattern clustering & weak-node isolation',
        'Parent / mentor weekly verification digest'
      ]
    },
    max: {
      id: 'max',
      name: 'StrictPass MAX',
      filePrefix: 'StrictPass_MAX',
      tagline: 'Full-spectrum exam mastery with priority AI reasoning & live review',
      features: [
        'Everything in StrictPass Pro telemetry & mock suite',
        'High-depth Socratic reasoning chains on multi-step proofs',
        'Custom target-score curriculum & exam-day readiness index',
        'Priority compute lane with zero daily drill caps'
      ]
    }
  };

  var PRICING = {
    single: {
      strictpass: { monthly: 749, season: 1699, annual: 5999 },
      pro: { monthly: 1099, season: 2399, annual: 8799 },
      max: { monthly: 1599, season: 3599, annual: 13299 }
    },
    duo: {
      strictpass: { monthly: 1299, season: 2999, annual: 10499 },
      pro: { monthly: 1999, season: 4199, annual: 15399 },
      max: { monthly: 2799, season: 6299, annual: 23299 }
    },
    family: {
      strictpass: { monthly: 2399, season: 5399, annual: 19199 },
      pro: { monthly: 3499, season: 7599, annual: 28099 },
      max: { monthly: 5099, season: 11499, annual: 42499 }
    }
  };

  function buildSKU(seatsKey, cycleKey, tierKey) {
    var seatMeta = SEATS[seatsKey];
    var cycleMeta = CYCLES[cycleKey];
    var tierMeta = TIERS[tierKey];

    if (!seatMeta || !cycleMeta || !tierMeta) {
      return null;
    }

    var priceUah = PRICING[seatsKey][tierKey][cycleKey];
    var monthlyBasePrice = PRICING[seatsKey][tierKey].monthly;
    var baselineTotal = monthlyBasePrice * cycleMeta.months;
    var savingsUah = cycleKey === 'monthly' ? 0 : Math.max(0, baselineTotal - priceUah);
    var savingsPercent =
      baselineTotal > 0 && savingsUah > 0 ? Math.round((savingsUah / baselineTotal) * 100) : 0;

    var monthlyEquivalentUah = Math.round(priceUah / cycleMeta.months);
    var perStudentTotalUah = Math.round(priceUah / seatMeta.seatCount);
    var perStudentMonthlyUah = Math.round(priceUah / cycleMeta.months / seatMeta.seatCount);

    var imageFilename =
      tierMeta.filePrefix + '_' + seatMeta.fileSegment + '_' + cycleMeta.fileSegment + '.webp';

    var seatFeature =
      seatMeta.seatCount === 1
        ? '1 dedicated student StrictPass credential'
        : seatMeta.seatCount + ' independent student accounts under one pass';

    var cycleFeature =
      cycleKey === 'monthly'
        ? 'Flexible 30-day billing cycle, cancel anytime'
        : cycleKey === 'season'
          ? '90-day intensive season lock (saves ' + savingsUah + ' UAH)'
          : 'Full 12-month mastery cycle (saves ' + savingsUah + ' UAH)';

    return {
      skuId: tierKey + '-' + seatsKey + '-' + cycleKey,
      seats: seatsKey,
      seatLabel: seatMeta.label,
      seatCount: seatMeta.seatCount,
      cycle: cycleKey,
      cycleLabel: cycleMeta.label,
      months: cycleMeta.months,
      tier: tierKey,
      tierName: tierMeta.name,
      tagline: tierMeta.tagline,
      priceUah: priceUah,
      monthlyEquivalentUah: monthlyEquivalentUah,
      perStudentTotalUah: perStudentTotalUah,
      perStudentMonthlyUah: perStudentMonthlyUah,
      savingsUah: savingsUah,
      savingsPercent: savingsPercent,
      image: 'assets/strictpass/' + imageFilename,
      imageFilename: imageFilename,
      features: [seatFeature, cycleFeature].concat(tierMeta.features)
    };
  }

  var SKUS = {};
  var SKU_LIST = [];

  var seatKeys = ['single', 'duo', 'family'];
  var cycleKeys = ['monthly', 'season', 'annual'];
  var tierKeys = ['strictpass', 'pro', 'max'];

  for (var sIdx = 0; sIdx < seatKeys.length; sIdx++) {
    for (var cIdx = 0; cIdx < cycleKeys.length; cIdx++) {
      for (var tIdx = 0; tIdx < tierKeys.length; tIdx++) {
        var sku = buildSKU(seatKeys[sIdx], cycleKeys[cIdx], tierKeys[tIdx]);
        if (sku) {
          SKUS[sku.skuId] = sku;
          SKU_LIST.push(sku);
        }
      }
    }
  }

  function getSKU(seats, cycle, tier) {
    var s = SEATS[seats] ? seats : 'single';
    var c = CYCLES[cycle] ? cycle : 'season';
    var t = TIERS[tier] ? tier : 'pro';
    return SKUS[t + '-' + s + '-' + c] || null;
  }

  function listSKUs(filter) {
    if (!filter) return SKU_LIST.slice();
    return SKU_LIST.filter(function (item) {
      if (filter.seats && item.seats !== filter.seats) return false;
      if (filter.cycle && item.cycle !== filter.cycle) return false;
      if (filter.tier && item.tier !== filter.tier) return false;
      return true;
    });
  }

  function formatUah(amount) {
    var num = Number(amount);
    if (isNaN(num)) return '0 UAH';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' UAH';
  }

  function prefersReducedMotion() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function clamp(val, min, max) {
    return val < min ? min : val > max ? max : val;
  }

  /**
   * Attaches spring-interpolated 3D tilt physics + specular glare to a StrictPass card element.
   *
   * @param {HTMLElement} element - Card element (typically `.sa-pass-3d-card`).
   * @param {Object} [options]
   * @param {number} [options.stiffness=0.14] - Spring stiffness factor.
   * @param {number} [options.damping=0.76] - Velocity damping factor per frame.
   * @param {number} [options.maxRotateX=14] - Maximum X-axis tilt in degrees.
   * @param {number} [options.maxRotateY=16] - Maximum Y-axis tilt in degrees.
   * @param {number} [options.scale=1.02] - Hover/active scale3d factor.
   * @param {number} [options.perspective=1000] - CSS perspective distance in px.
   * @param {HTMLElement|null} [options.glareEl] - Optional explicit glare overlay element.
   * @returns {Function} Cleanup/detach function (also has `.detach` and `.destroy` methods).
   */
  function attach3DTilt(element, options) {
    var noop = function () {};
    noop.detach = noop;
    noop.destroy = noop;

    if (!element || typeof window === 'undefined') {
      return noop;
    }

    if (typeof element._saTiltCleanup === 'function') {
      element._saTiltCleanup();
    }

    var opts = options || {};
    var stiffness = typeof opts.stiffness === 'number' ? opts.stiffness : 0.14;
    var damping = typeof opts.damping === 'number' ? opts.damping : 0.76;
    var maxRotateX = typeof opts.maxRotateX === 'number' ? opts.maxRotateX : 14;
    var maxRotateY = typeof opts.maxRotateY === 'number' ? opts.maxRotateY : 16;
    var hoverScale = typeof opts.scale === 'number' ? opts.scale : 1.02;
    var perspective = typeof opts.perspective === 'number' ? opts.perspective : 1000;

    var glareEl = opts.glareEl || element.querySelector('.sa-pass-glare');

    var state = {
      rx: 0,
      ry: 0,
      scale: 1,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
      vx: 0,
      vy: 0,
      vs: 0,
      vgx: 0,
      vgy: 0,
      vgo: 0
    };

    var target = {
      rx: 0,
      ry: 0,
      scale: 1,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0
    };

    var rafId = null;
    var destroyed = false;
    var motionReduced = prefersReducedMotion();

    var mql =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;

    function applyStyles() {
      if (motionReduced) {
        element.style.transform = '';
        element.style.setProperty('--glare-opacity', '0');
        element.style.setProperty('--tilt-shadow-x', '0px');
        element.style.setProperty('--tilt-shadow-y', '16px');
        element.style.setProperty('--tilt-shadow-blur', '28px');
        if (glareEl) {
          glareEl.style.opacity = '0';
        }
        return;
      }

      var rxStr = state.rx.toFixed(3);
      var ryStr = state.ry.toFixed(3);
      var scStr = state.scale.toFixed(4);

      element.style.transform =
        'perspective(' +
        perspective +
        'px) rotateX(' +
        rxStr +
        'deg) rotateY(' +
        ryStr +
        'deg) scale3d(' +
        scStr +
        ', ' +
        scStr +
        ', ' +
        scStr +
        ')';

      var shadowX = (-state.ry * 1.15).toFixed(2) + 'px';
      var shadowY = (18 + state.rx * 0.95).toFixed(2) + 'px';
      var shadowBlur = (28 + (state.scale - 1) * 450).toFixed(2) + 'px';

      element.style.setProperty('--glare-x', state.glareX.toFixed(2) + '%');
      element.style.setProperty('--glare-y', state.glareY.toFixed(2) + '%');
      element.style.setProperty('--glare-opacity', state.glareOpacity.toFixed(3));
      element.style.setProperty('--tilt-shadow-x', shadowX);
      element.style.setProperty('--tilt-shadow-y', shadowY);
      element.style.setProperty('--tilt-shadow-blur', shadowBlur);

      if (glareEl) {
        glareEl.style.opacity = state.glareOpacity.toFixed(3);
        glareEl.style.background =
          'radial-gradient(circle 260px at ' +
          state.glareX.toFixed(2) +
          '% ' +
          state.glareY.toFixed(2) +
          '%, var(--glare-highlight, rgba(255,255,255,0.36)) 0%, var(--glare-edge, rgba(255,255,255,0)) 72%)';
      }
    }

    function step() {
      if (destroyed || motionReduced) {
        rafId = null;
        return;
      }

      state.vx = (state.vx + (target.rx - state.rx) * stiffness) * damping;
      state.vy = (state.vy + (target.ry - state.ry) * stiffness) * damping;
      state.vs = (state.vs + (target.scale - state.scale) * stiffness) * damping;
      state.vgx = (state.vgx + (target.glareX - state.glareX) * stiffness) * damping;
      state.vgy = (state.vgy + (target.glareY - state.glareY) * stiffness) * damping;
      state.vgo = (state.vgo + (target.glareOpacity - state.glareOpacity) * stiffness) * damping;

      state.rx += state.vx;
      state.ry += state.vy;
      state.scale += state.vs;
      state.glareX += state.vgx;
      state.glareY += state.vgy;
      state.glareOpacity += state.vgo;

      applyStyles();

      var settled =
        Math.abs(target.rx - state.rx) < 0.005 &&
        Math.abs(target.ry - state.ry) < 0.005 &&
        Math.abs(target.scale - state.scale) < 0.0005 &&
        Math.abs(target.glareOpacity - state.glareOpacity) < 0.002 &&
        Math.abs(state.vx) < 0.005 &&
        Math.abs(state.vy) < 0.005 &&
        Math.abs(state.vs) < 0.0005;

      if (settled) {
        state.rx = target.rx;
        state.ry = target.ry;
        state.scale = target.scale;
        state.glareX = target.glareX;
        state.glareY = target.glareY;
        state.glareOpacity = target.glareOpacity;
        state.vx = 0;
        state.vy = 0;
        state.vs = 0;
        state.vgx = 0;
        state.vgy = 0;
        state.vgo = 0;
        applyStyles();
        rafId = null;
        return;
      }

      rafId = window.requestAnimationFrame(step);
    }

    function ensureLoop() {
      if (destroyed || motionReduced) return;
      if (rafId === null) {
        rafId = window.requestAnimationFrame(step);
      }
    }

    function updateFromClientXY(clientX, clientY) {
      if (motionReduced) return;
      var rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      var px = clamp((clientX - rect.left) / rect.width, 0, 1);
      var py = clamp((clientY - rect.top) / rect.height, 0, 1);

      var nx = (px - 0.5) * 2;
      var ny = (py - 0.5) * 2;

      target.rx = -ny * maxRotateX;
      target.ry = nx * maxRotateY;
      target.scale = hoverScale;
      target.glareX = px * 100;
      target.glareY = py * 100;
      target.glareOpacity = 1;

      ensureLoop();
    }

    function resetTarget() {
      target.rx = 0;
      target.ry = 0;
      target.scale = 1;
      target.glareX = 50;
      target.glareY = 50;
      target.glareOpacity = 0;
      ensureLoop();
    }

    function onPointerEnter(e) {
      updateFromClientXY(e.clientX, e.clientY);
    }

    function onPointerMove(e) {
      updateFromClientXY(e.clientX, e.clientY);
    }

    function onPointerLeave() {
      resetTarget();
    }

    function onTouchStart(e) {
      if (e.touches && e.touches.length > 0) {
        updateFromClientXY(e.touches[0].clientX, e.touches[0].clientY);
      }
    }

    function onTouchMove(e) {
      if (e.touches && e.touches.length > 0) {
        updateFromClientXY(e.touches[0].clientX, e.touches[0].clientY);
      }
    }

    function onTouchEnd() {
      resetTarget();
    }

    function onMotionChange(e) {
      motionReduced = !!e.matches;
      if (motionReduced) {
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        }
        state.rx = 0;
        state.ry = 0;
        state.scale = 1;
        state.glareOpacity = 0;
        applyStyles();
      }
    }

    element.addEventListener('pointerenter', onPointerEnter);
    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerleave', onPointerLeave);
    element.addEventListener('pointercancel', onPointerLeave);
    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: true });
    element.addEventListener('touchend', onTouchEnd);
    element.addEventListener('touchcancel', onTouchEnd);

    if (mql && typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onMotionChange);
    }

    function detach() {
      if (destroyed) return;
      destroyed = true;
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      element.removeEventListener('pointerenter', onPointerEnter);
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerleave', onPointerLeave);
      element.removeEventListener('pointercancel', onPointerLeave);
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
      element.removeEventListener('touchcancel', onTouchEnd);
      if (mql && typeof mql.removeEventListener === 'function') {
        mql.removeEventListener('change', onMotionChange);
      }
      element.style.transform = '';
      element.style.removeProperty('--glare-x');
      element.style.removeProperty('--glare-y');
      element.style.removeProperty('--glare-opacity');
      element.style.removeProperty('--tilt-shadow-x');
      element.style.removeProperty('--tilt-shadow-y');
      element.style.removeProperty('--tilt-shadow-blur');
      if (element._saTiltCleanup === detach) {
        delete element._saTiltCleanup;
      }
    }

    detach.detach = detach;
    detach.destroy = detach;
    element._saTiltCleanup = detach;

    return detach;
  }

  return {
    SEATS: SEATS,
    CYCLES: CYCLES,
    TIERS: TIERS,
    PRICING: PRICING,
    SKUS: SKUS,
    SKU_LIST: SKU_LIST,
    getSKU: getSKU,
    get: getSKU,
    listSKUs: listSKUs,
    formatUah: formatUah,
    attach3DTilt: attach3DTilt
  };
});
