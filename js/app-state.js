/* ==========================================================================
   StrictAI Mobile Application — Module 3: Shared UI Primitives & Store
   Exposes window.StrictUI and window.StrictMobileStore.
   Zero JSX, zero useReducer, zero CSS custom props in inline styles, zero emojis.
   ========================================================================== */
(function (globalScope) {
  'use strict';

  var STORAGE_KEY_STATE = 'strictai_mobile_state_v1';
  var QUEST_REWARDS = {
    quest_focus_sprint: 30,
    quest_tutor_topic: 40,
    quest_exam_run: 50
  };

  /* ------------------------------------------------------------------ */
  /* StrictUI Primitives (Strict React.createElement only)              */
  /* ------------------------------------------------------------------ */

  function getH() {
    if (typeof window !== 'undefined' && window.React && window.React.createElement) {
      return window.React.createElement;
    }
    if (globalScope.React && globalScope.React.createElement) {
      return globalScope.React.createElement;
    }
    return null;
  }

  function Icon(props) {
    var h = getH();
    if (!h) return null;
    var p = props || {};
    var name = p.name || 'spark';
    var size = p.size || 18;
    var className = p.className || '';
    var svgHtml = '';
    var iconsApi = (typeof window !== 'undefined' && window.StrictIcons) || globalScope.StrictIcons;
    if (iconsApi && typeof iconsApi.svg === 'function') {
      svgHtml = iconsApi.svg(name, size, className);
    }
    return h('span', {
      className: className ? 'sa-icon-wrap ' + className : 'sa-icon-wrap',
      dangerouslySetInnerHTML: { __html: svgHtml }
    });
  }

  function Sheet(props) {
    var h = getH();
    if (!h) return null;
    var p = props || {};
    if (!p.open) return null;

    var onClose = typeof p.onClose === 'function' ? p.onClose : null;

    return h(
      'div',
      {
        className: 'sa-sheet-backdrop',
        role: 'dialog',
        'aria-modal': 'true',
        onClick: function (e) {
          if (onClose && e && e.target === e.currentTarget) {
            onClose();
          }
        }
      },
      h(
        'div',
        { className: 'sa-sheet-panel' },
        h('div', { className: 'sa-sheet-handle' }),
        h(
          'div',
          {
            className: 'sa-row-between',
            style: { marginBottom: '12px', alignItems: 'flex-start' }
          },
          h(
            'div',
            { className: 'sa-stack-sm', style: { gap: '2px', minWidth: '0px', flex: '1 1 auto' } },
            p.title ? h('h3', { className: 'sa-section-title' }, p.title) : null,
            p.subtitle ? h('p', { className: 'sa-muted' }, p.subtitle) : null
          ),
          onClose
            ? h(
                'button',
                {
                  type: 'button',
                  className: 'sa-icon-btn',
                  'aria-label': 'Закрити',
                  onClick: onClose
                },
                h(Icon, { name: 'x', size: 18 })
              )
            : null
        ),
        h('div', { className: 'sa-stack' }, p.children)
      )
    );
  }

  function Modal(props) {
    var h = getH();
    if (!h) return null;
    var p = props || {};
    if (!p.open) return null;

    var onClose = typeof p.onClose === 'function' ? p.onClose : null;

    return h(
      'div',
      {
        className: 'sa-sheet-backdrop is-center',
        role: 'dialog',
        'aria-modal': 'true',
        onClick: function (e) {
          if (onClose && e && e.target === e.currentTarget) {
            onClose();
          }
        }
      },
      h(
        'div',
        { className: 'sa-modal-panel' },
        h(
          'div',
          {
            className: 'sa-row-between',
            style: { marginBottom: '12px' }
          },
          p.title ? h('h3', { className: 'sa-section-title' }, p.title) : h('span', null),
          onClose
            ? h(
                'button',
                {
                  type: 'button',
                  className: 'sa-icon-btn',
                  'aria-label': 'Закрити',
                  onClick: onClose
                },
                h(Icon, { name: 'x', size: 18 })
              )
            : null
        ),
        h('div', { className: 'sa-stack' }, p.children)
      )
    );
  }

  function formatUah(amount) {
    var num = Number(amount);
    if (!isFinite(num)) {
      num = 0;
    }
    var rounded = Math.round(num);
    var sign = rounded < 0 ? '-' : '';
    var absStr = String(Math.abs(rounded));
    var spaced = absStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return sign + spaced + ' \u20B4';
  }

  var StrictUI = {
    Icon: Icon,
    Sheet: Sheet,
    Modal: Modal,
    formatUah: formatUah
  };

  /* ------------------------------------------------------------------ */
  /* Store Utilities                                                    */
  /* ------------------------------------------------------------------ */

  var memoryFallback = {};

  function safeStorageGet(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (_err) {
      /* ignore */
    }
    return Object.prototype.hasOwnProperty.call(memoryFallback, key) ? memoryFallback[key] : null;
  }

  function safeStorageSet(key, val) {
    var str = String(val);
    memoryFallback[key] = str;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, str);
      }
    } catch (_err) {
      /* ignore */
    }
  }

  function clone(val) {
    if (val === null || val === undefined) return val;
    return JSON.parse(JSON.stringify(val));
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function randomTag(prefix) {
    return (
      prefix +
      '_' +
      Date.now().toString(36) +
      '_' +
      Math.floor(Math.random() * 1679616).toString(36)
    );
  }

  function getAuthApi() {
    return (typeof window !== 'undefined' && window.StrictAuth) || globalScope.StrictAuth || null;
  }

  function getCatalogApi() {
    return (
      (typeof window !== 'undefined' && window.StrictPassCatalog) ||
      globalScope.StrictPassCatalog ||
      null
    );
  }

  function resolveSkuDetails(seats, cycle, tier) {
    var s = seats || 'single';
    var c = cycle || 'season';
    var t = tier || 'strictpass';
    var cat = getCatalogApi();
    if (cat && typeof cat.getSKU === 'function') {
      var sku = cat.getSKU(s, c, t);
      if (sku) {
        return {
          seats: sku.seats,
          cycle: sku.cycle,
          tier: sku.tier,
          skuId: sku.skuId,
          priceUah: sku.priceUah,
          tierName: sku.tierName,
          imageFilename: sku.imageFilename
        };
      }
    }
    var fallbackPricing = {
      single: { strictpass: { monthly: 749, season: 1699, annual: 5999 }, pro: { monthly: 1099, season: 2399, annual: 8799 }, max: { monthly: 1599, season: 3599, annual: 13299 } },
      duo: { strictpass: { monthly: 1299, season: 2999, annual: 10499 }, pro: { monthly: 1999, season: 4199, annual: 15399 }, max: { monthly: 2799, season: 6299, annual: 23299 } },
      family: { strictpass: { monthly: 2399, season: 5399, annual: 19199 }, pro: { monthly: 3499, season: 7599, annual: 28099 }, max: { monthly: 5099, season: 11499, annual: 42499 } }
    };
    var price =
      (fallbackPricing[s] && fallbackPricing[s][t] && fallbackPricing[s][t][c]) || 1699;
    return {
      seats: s,
      cycle: c,
      tier: t,
      skuId: t + '-' + s + '-' + c,
      priceUah: price,
      tierName: t === 'max' ? 'StrictPass MAX' : t === 'pro' ? 'StrictPass Pro' : 'StrictPass',
      imageFilename: (t === 'max' ? 'StrictPass_MAX' : t === 'pro' ? 'StrictPass_Pro' : 'StrictPass') + '_' + s + '_' + c + '.webp'
    };
  }

  function applyThemeToDom(theme) {
    var t = theme === 'dark' ? 'dark' : 'light';
    if (typeof document !== 'undefined') {
      if (document.documentElement) {
        document.documentElement.setAttribute('data-theme', t);
      }
      var meta = document.getElementById('strict-meta-theme');
      if (meta) {
        meta.setAttribute('content', t === 'dark' ? '#09090B' : '#F6F6F7');
      }
    }
    return t;
  }

  function normalizeSubjectKey(rawSubject) {
    var s = String(rawSubject || '').toLowerCase();
    if (s.indexOf('укр') !== -1 || s === 'ukrainian') return 'ukrainian';
    if (s.indexOf('іст') !== -1 || s === 'history') return 'history';
    if (s.indexOf('анг') !== -1 || s === 'english') return 'english';
    if (s.indexOf('нім') !== -1 || s === 'german') return 'german';
    if (s.indexOf('ісп') !== -1 || s === 'spanish') return 'spanish';
    if (s.indexOf('фр') !== -1 || s === 'french') return 'french';
    if (s.indexOf('пол') !== -1 || s === 'polish') return 'polish';
    if (s.indexOf('фіз') !== -1 || s === 'physics') return 'physics';
    return 'math';
  }

  function buildDefaultQuests() {
    return [
      {
        id: 'quest_focus_sprint',
        title: 'Завершити фокус-спринт без перемикань',
        xpReward: QUEST_REWARDS.quest_focus_sprint,
        targetTab: 'focus',
        icon: 'clock',
        completed: false,
        verifiedAt: null,
        proofType: null,
        proofMeta: null
      },
      {
        id: 'quest_tutor_topic',
        title: 'Розібрати тему з Репетитором',
        xpReward: QUEST_REWARDS.quest_tutor_topic,
        targetTab: 'tutor',
        icon: 'messageSquare',
        completed: false,
        verifiedAt: null,
        proofType: null,
        proofMeta: null
      },
      {
        id: 'quest_exam_run',
        title: 'Скласти міні-іспит або CAT без порушень',
        xpReward: QUEST_REWARDS.quest_exam_run,
        targetTab: 'exams',
        icon: 'radar',
        completed: false,
        verifiedAt: null,
        proofType: null,
        proofMeta: null
      }
    ];
  }

  function createDefaultState() {
    var defaultPlan = resolveSkuDetails('single', 'season', 'strictpass');
    return {
      initialized: false,
      theme: 'light',
      deviceMode: 'mobile',
      activeTab: 'today',
      controlSubTab: 'wallet',
      onboardingStep: 0,
      onboardingCompleted: false,
      toast: null,

      auth: {
        mode: 'vault',
        projectId: 'strictai-local-vault',
        online: true,
        hasCustomConfig: false,
        user: null,
        family: null,
        latestDiagnostic: null,
        activePass: null
      },

      handoffStatus: {
        imported: false,
        sid: null,
        importedAt: null,
        sourceUrl: null,
        error: null
      },

      goals: {
        targetUniId: 'knu',
        targetUniName: 'КНУ імені Тараса Шевченка',
        targetScore: 188,
        dailyScheduleTime: '17:00',
        dailyMinutesTarget: 45,
        gradeBand: 'nmt-200',
        primarySubject: 'math'
      },

      telemetry: {
        predictedScore: 158,
        cefrLevel: 'B1',
        trustScore: 98,
        xp: 240,
        streakDays: 5,
        focusMinutesToday: 0,
        totalFocusMinutes: 135,
        totalExamsCompleted: 2,
        totalTutorSessions: 3,
        weakTopics: [
          'Логарифмічні нерівності та ОДЗ',
          'Тригонометричні рівняння на проміжку',
          'Складнопідрядні речення з кількома підрядними'
        ],
        masteryNodes: [
          { id: 'km-m-log', subjectId: 'math', title: 'Логарифми, ОДЗ та похідна', mastery: 54, status: 'weak' },
          { id: 'km-m-param', subjectId: 'math', title: 'Параметри та теорія чисел', mastery: 44, status: 'weak' },
          { id: 'km-u-synt', subjectId: 'ukrainian', title: 'Звороти та складне речення', mastery: 68, status: 'review' },
          { id: 'km-en-uoe', subjectId: 'english', title: 'Use of English і Conditionals', mastery: 79, status: 'solid' }
        ],
        recentSessions: [],
        tutorNotes: []
      },

      antiCheat: {
        blurCount: 0,
        microChecksPassed: 4,
        microChecksTotal: 4
      },

      quests: buildDefaultQuests(),

      missedLesson: {
        simulated: false,
        isOverdue: false,
        resolvedToday: false,
        scheduledTime: '17:00',
        lastAlertAt: null
      },

      tutorDraft: {
        mode: 'school',
        subjectId: 'math',
        languageId: 'english',
        gradeBand: 'nmt-200',
        cefrLevel: 'B1',
        personaId: 'socratic',
        topicTitle: 'Логарифмічні та показникові рівняння (ОДЗ)',
        promptText: '',
        notes: '',
        errorContext: null,
        lectureId: null,
        requestNonce: 0,
        messages: [],
        sessionStartedAt: null
      },

      children: [
        {
          id: 'child_oleksandr',
          name: 'Олександр',
          gradeLabel: '11 клас',
          gradeBand: 'nmt-200',
          inviteCode: 'SA-DEMO11',
          predictedScore: 158,
          cefrLevel: 'B1',
          trustScore: 98,
          tabBlurCount: 0,
          microChecksPassed: '4/4',
          streakDays: 5,
          focusMinutesToday: 0,
          weakTopics: [
            'Логарифмічні нерівності та ОДЗ',
            'Тригонометричні рівняння на проміжку',
            'Складнопідрядні речення з кількома підрядними'
          ],
          lastActivityAt: null
        }
      ],
      selectedChildId: 'child_oleksandr',

      assignedLectures: [
        {
          id: 'lec_default_1',
          childId: 'child_oleksandr',
          title: 'Розбір помилок: Логарифмічні нерівності (ОДЗ)',
          subjectId: 'math',
          topic: 'Логарифмічні нерівності та ОДЗ',
          notes: 'Пройти покроковий Сократівський розбір без підказок і зафіксувати правило знаку основи.',
          status: 'pending',
          assignedAt: '2026-11-24T09:00:00.000Z',
          completedAt: null,
          verifiedSessionId: null
        }
      ],

      contract: {
        lockStrictPersona: false,
        dailyMinutesTarget: 45,
        missedAlertTime: '17:00',
        rewardText: 'Вільний вихідний після досягнення цільового балу'
      },

      parentAuth: {
        unlocked: false,
        unlockedAt: null,
        hasPin: false,
        lastError: null
      },

      planSelection: {
        seats: defaultPlan.seats,
        cycle: defaultPlan.cycle,
        tier: defaultPlan.tier,
        skuId: defaultPlan.skuId,
        priceUah: defaultPlan.priceUah
      },

      sponsorLink: {
        url: null,
        sku: null,
        createdAt: null
      }
    };
  }

  function mergePersistedState(raw) {
    var base = createDefaultState();
    if (!raw || typeof raw !== 'object') {
      return base;
    }

    base.theme = raw.theme === 'dark' ? 'dark' : 'light';
    base.deviceMode = raw.deviceMode === 'tablet' ? 'tablet' : 'mobile';
    base.activeTab = raw.activeTab === 'control' ? 'pass' : (raw.activeTab || 'today');
    base.controlSubTab = raw.controlSubTab === 'parent' ? 'parent' : 'wallet';
    base.onboardingStep = typeof raw.onboardingStep === 'number' ? raw.onboardingStep : 0;
    base.onboardingCompleted = Boolean(raw.onboardingCompleted);

    if (raw.handoffStatus && typeof raw.handoffStatus === 'object') {
      base.handoffStatus = Object.assign({}, base.handoffStatus, raw.handoffStatus);
    }
    if (raw.goals && typeof raw.goals === 'object') {
      base.goals = Object.assign({}, base.goals, raw.goals);
      if (base.goals.gradeBand === 'NMT 200') base.goals.gradeBand = 'nmt-200';
      if (base.goals.targetUniId === 'knu_cyber') base.goals.targetUniId = 'knu';
    }
    if (raw.antiCheat && typeof raw.antiCheat === 'object') {
      base.antiCheat = Object.assign({}, base.antiCheat, raw.antiCheat);
    }
    if (raw.telemetry && typeof raw.telemetry === 'object') {
      base.telemetry = Object.assign({}, base.telemetry, raw.telemetry);
      if (!Array.isArray(base.telemetry.weakTopics)) {
        base.telemetry.weakTopics = createDefaultState().telemetry.weakTopics;
      }
      if (!Array.isArray(base.telemetry.masteryNodes)) {
        base.telemetry.masteryNodes = createDefaultState().telemetry.masteryNodes;
      }
      if (!Array.isArray(base.telemetry.recentSessions)) {
        base.telemetry.recentSessions = [];
      }
      if (!Array.isArray(base.telemetry.tutorNotes)) {
        base.telemetry.tutorNotes = [];
      }
    }

    if (Array.isArray(raw.quests) && raw.quests.length === 3) {
      base.quests = base.quests.map(function (defaultQ) {
        var found = raw.quests.filter(function (q) {
          return q && q.id === defaultQ.id;
        })[0];
        if (!found) return defaultQ;
        return Object.assign({}, defaultQ, {
          completed: Boolean(found.completed),
          verifiedAt: found.verifiedAt || null,
          proofType: found.proofType || null,
          proofMeta: found.proofMeta || null
        });
      });
    }

    if (raw.missedLesson && typeof raw.missedLesson === 'object') {
      base.missedLesson = Object.assign({}, base.missedLesson, raw.missedLesson);
    }
    if (raw.tutorDraft && typeof raw.tutorDraft === 'object') {
      base.tutorDraft = Object.assign({}, base.tutorDraft, raw.tutorDraft);
    }
    if (Array.isArray(raw.children) && raw.children.length > 0) {
      base.children = raw.children;
    }
    if (raw.selectedChildId) {
      base.selectedChildId = raw.selectedChildId;
    }
    if (Array.isArray(raw.assignedLectures)) {
      base.assignedLectures = raw.assignedLectures;
    }
    if (raw.contract && typeof raw.contract === 'object') {
      base.contract = Object.assign({}, base.contract, raw.contract);
    }
    if (base.contract.lockStrictPersona) {
      base.tutorDraft.personaId = 'strict';
    }
    if (raw.planSelection && typeof raw.planSelection === 'object') {
      var sku = resolveSkuDetails(
        raw.planSelection.seats,
        raw.planSelection.cycle,
        raw.planSelection.tier
      );
      base.planSelection = {
        seats: sku.seats,
        cycle: sku.cycle,
        tier: sku.tier,
        skuId: sku.skuId,
        priceUah: sku.priceUah
      };
    }
    if (raw.sponsorLink && typeof raw.sponsorLink === 'object') {
      base.sponsorLink = Object.assign({}, base.sponsorLink, raw.sponsorLink);
    }

    // Security invariant: Parent PIN gate always starts locked after cold reload
    base.parentAuth.unlocked = false;
    base.parentAuth.unlockedAt = null;
    base.parentAuth.lastError = null;
    base.toast = null;

    return base;
  }

  /* ------------------------------------------------------------------ */
  /* StrictMobileStore Implementation                                   */
  /* ------------------------------------------------------------------ */

  function createMobileStore() {
    var state = loadInitialState();
    var listeners = [];
    var toastTimerId = null;
    var initPromise = null;
    var authUnsub = null;

    function loadInitialState() {
      var rawStr = safeStorageGet(STORAGE_KEY_STATE);
      if (rawStr) {
        try {
          var parsed = JSON.parse(rawStr);
          return mergePersistedState(parsed);
        } catch (_err) {
          /* fall back to defaults */
        }
      }
      return createDefaultState();
    }

    function persistState(nextState) {
      var toSave = {
        theme: nextState.theme,
        deviceMode: nextState.deviceMode,
        activeTab: nextState.activeTab,
        controlSubTab: nextState.controlSubTab,
        onboardingStep: nextState.onboardingStep,
        onboardingCompleted: nextState.onboardingCompleted,
        handoffStatus: nextState.handoffStatus,
        goals: nextState.goals,
        telemetry: nextState.telemetry,
        antiCheat: nextState.antiCheat,
        quests: nextState.quests,
        missedLesson: nextState.missedLesson,
        tutorDraft: nextState.tutorDraft,
        children: nextState.children,
        selectedChildId: nextState.selectedChildId,
        assignedLectures: nextState.assignedLectures,
        contract: nextState.contract,
        planSelection: nextState.planSelection,
        sponsorLink: nextState.sponsorLink
      };
      safeStorageSet(STORAGE_KEY_STATE, JSON.stringify(toSave));
    }

    function syncSelectedChildWithTelemetry(draft) {
      var children = draft.children.slice();
      var primaryIdx = -1;
      for (var i = 0; i < children.length; i++) {
        if (children[i].id === draft.selectedChildId) {
          primaryIdx = i;
          break;
        }
      }
      if (primaryIdx === -1 && children.length > 0) {
        primaryIdx = 0;
        draft.selectedChildId = children[0].id;
      }
      if (primaryIdx === 0) {
        var childName = children[0].name;
        if (draft.auth && draft.auth.user && draft.auth.user.role === 'student' && draft.auth.user.displayName) {
          childName = draft.auth.user.displayName.split(' ')[0];
        }
        children[0] = Object.assign({}, children[0], {
          name: childName,
          gradeBand: draft.goals.gradeBand,
          inviteCode:
            (draft.auth && draft.auth.family && draft.auth.family.inviteCode) ||
            (draft.auth && draft.auth.user && draft.auth.user.inviteCode) ||
            children[0].inviteCode,
          predictedScore: draft.telemetry.predictedScore,
          cefrLevel: draft.telemetry.cefrLevel,
          trustScore: draft.telemetry.trustScore,
          tabBlurCount: (draft.antiCheat && draft.antiCheat.blurCount) || 0,
          microChecksPassed: draft.antiCheat
            ? draft.antiCheat.microChecksPassed + '/' + draft.antiCheat.microChecksTotal
            : (children[0].microChecksPassed || '4/4'),
          streakDays: draft.telemetry.streakDays,
          focusMinutesToday: draft.telemetry.focusMinutesToday,
          weakTopics: draft.telemetry.weakTopics.slice()
        });
      }
      draft.children = children;
      return draft;
    }

    function commit(updater, options) {
      var opts = options || {};
      var draft = clone(state);
      var updated = typeof updater === 'function' ? updater(draft) : Object.assign(draft, updater);
      if (!updated) updated = draft;
      if (updated.contract && updated.contract.lockStrictPersona && updated.tutorDraft) {
        updated.tutorDraft.personaId = 'strict';
      }
      syncSelectedChildWithTelemetry(updated);
      state = updated;
      if (!opts.skipPersist) {
        persistState(state);
      }
      for (var i = 0; i < listeners.length; i++) {
        try {
          listeners[i](state);
        } catch (_err) {
          /* isolate subscriber errors */
        }
      }
      return state;
    }

    function getState() {
      return state;
    }

    function subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('StrictMobileStore.subscribe expects a function');
      }
      listeners.push(listener);
      return function unsubscribe() {
        listeners = listeners.filter(function (fn) {
          return fn !== listener;
        });
      };
    }

    function useStrictMobileStore() {
      var ReactApi = (typeof window !== 'undefined' && window.React) || globalScope.React;
      var pair = ReactApi.useState(function () {
        return getState();
      });
      var snap = pair[0];
      var setSnap = pair[1];

      ReactApi.useEffect(function () {
        setSnap(getState());
        return subscribe(function (nextState) {
          setSnap(nextState);
        });
      }, []);

      return snap;
    }

    function showToast(message, tone) {
      if (toastTimerId) {
        clearTimeout(toastTimerId);
        toastTimerId = null;
      }
      var toastObj = {
        id: randomTag('toast'),
        message: String(message || ''),
        tone: tone || 'info',
        createdAt: nowIso()
      };
      commit(
        function (draft) {
          draft.toast = toastObj;
          return draft;
        },
        { skipPersist: true }
      );
      if (typeof setTimeout === 'function') {
        toastTimerId = setTimeout(function () {
          toastTimerId = null;
          commit(
            function (draft) {
              if (draft.toast && draft.toast.id === toastObj.id) {
                draft.toast = null;
              }
              return draft;
            },
            { skipPersist: true }
          );
        }, 3800);
      }
    }

    function buildAuthSnapshot() {
      var authApi = getAuthApi();
      if (!authApi) {
        return clone(state.auth);
      }
      var snap = authApi.getState();
      var fbStatus = typeof authApi.getFirebaseStatus === 'function' ? authApi.getFirebaseStatus() : {};
      return {
        mode: snap.mode || 'vault',
        projectId: snap.projectId || 'strictai-local-vault',
        online: fbStatus.online !== undefined ? fbStatus.online : true,
        hasCustomConfig: Boolean(fbStatus.hasCustomConfig),
        user: snap.user || null,
        family: snap.family || null,
        latestDiagnostic: snap.latestDiagnostic || null,
        activePass: snap.activePass || null
      };
    }

    function applyDiagnosticHydration(draft, diag, sourceMeta) {
      if (diag && typeof diag === 'object') {
        if (typeof diag.predictedScore === 'number' && diag.predictedScore > 0) {
          draft.telemetry.predictedScore = diag.predictedScore;
        }
        if (diag.cefrLevel) {
          draft.telemetry.cefrLevel = diag.cefrLevel;
          draft.tutorDraft.cefrLevel = diag.cefrLevel;
        }
        if (typeof diag.trustScore === 'number') {
          draft.telemetry.trustScore = diag.trustScore;
        }
        if (Array.isArray(diag.weakTopics) && diag.weakTopics.length > 0) {
          draft.telemetry.weakTopics = diag.weakTopics.slice();
          draft.tutorDraft.topicTitle = diag.weakTopics[0];
        }
        if (diag.subject) {
          var subjKey = normalizeSubjectKey(diag.subject);
          draft.goals.primarySubject = subjKey;
          draft.tutorDraft.subjectId = subjKey;
        }
        if (diag.targetUni) {
          draft.goals.targetUniName = diag.targetUni;
        }
      }

      if (sourceMeta) {
        draft.handoffStatus = {
          imported: true,
          sid: sourceMeta.sid || (diag && diag.sid) || null,
          importedAt: sourceMeta.importedAt || nowIso(),
          sourceUrl: sourceMeta.sourceUrl || null,
          error: null
        };
      }

      if (draft.onboardingStep < 2) {
        draft.onboardingStep = 2;
      }
    }

    function syncFromAuthEngine(authSnap) {
      var snap = authSnap || buildAuthSnapshot();
      commit(function (draft) {
        draft.auth = snap;
        draft.parentAuth.hasPin = Boolean(snap.family && snap.family.hasPin);
        if (snap.user && snap.user.role === 'parent') {
          draft.parentAuth.unlocked = true;
        }
        if (snap.family && snap.family.dailyScheduleTime) {
          draft.goals.dailyScheduleTime = snap.family.dailyScheduleTime;
          draft.contract.missedAlertTime = snap.family.dailyScheduleTime;
          draft.missedLesson.scheduledTime = snap.family.dailyScheduleTime;
        }
        if (snap.family && snap.family.contractTerms) {
          draft.contract = Object.assign({}, draft.contract, snap.family.contractTerms);
        }
        if (snap.latestDiagnostic && !draft.handoffStatus.imported) {
          if (typeof snap.latestDiagnostic.predictedScore === 'number' && snap.latestDiagnostic.predictedScore > 0) {
            draft.telemetry.predictedScore = snap.latestDiagnostic.predictedScore;
          }
          if (snap.latestDiagnostic.cefrLevel) {
            draft.telemetry.cefrLevel = snap.latestDiagnostic.cefrLevel;
          }
          if (Array.isArray(snap.latestDiagnostic.weakTopics) && snap.latestDiagnostic.weakTopics.length > 0) {
            draft.telemetry.weakTopics = snap.latestDiagnostic.weakTopics.slice();
          }
        }
        return draft;
      });
    }

    async function init() {
      if (initPromise) {
        return initPromise;
      }

      initPromise = (async function () {
        applyThemeToDom(state.theme);

        var authApi = getAuthApi();
        if (authApi && typeof authApi.init === 'function') {
          await authApi.init();
          if (!authUnsub && typeof authApi.onChange === 'function') {
            authUnsub = authApi.onChange(function (_user, snap) {
              var fbStatus = typeof authApi.getFirebaseStatus === 'function' ? authApi.getFirebaseStatus() : {};
              syncFromAuthEngine({
                mode: snap.mode || 'vault',
                projectId: snap.projectId || 'strictai-local-vault',
                online: fbStatus.online !== undefined ? fbStatus.online : true,
                hasCustomConfig: Boolean(fbStatus.hasCustomConfig),
                user: snap.user || null,
                family: snap.family || null,
                latestDiagnostic: snap.latestDiagnostic || null,
                activePass: snap.activePass || null
              });
            });
          }
        }

        var searchStr =
          typeof window !== 'undefined' && window.location ? String(window.location.search || '') : '';
        var hasHandoffParam =
          searchStr.indexOf('ht=') !== -1 || searchStr.indexOf('sid=') !== -1;

        if (hasHandoffParam && authApi && typeof authApi.consumeHandoffToken === 'function') {
          try {
            var handoffRes = await authApi.consumeHandoffToken(window.location.href);
            var freshAuth = buildAuthSnapshot();
            commit(function (draft) {
              draft.auth = freshAuth;
              draft.parentAuth.hasPin = Boolean(freshAuth.family && freshAuth.family.hasPin);
              applyDiagnosticHydration(draft, handoffRes.diagnostic, {
                sid: handoffRes.sid,
                importedAt: handoffRes.importedAt,
                sourceUrl: window.location.href
              });
              return draft;
            });
            showToast('Діагностику та профіль успішно перенесено', 'success');
          } catch (err) {
            commit(function (draft) {
              draft.handoffStatus = {
                imported: false,
                sid: null,
                importedAt: null,
                sourceUrl: searchStr,
                error: err && err.message ? err.message : 'Не вдалося імпортувати токен'
              };
              return draft;
            });
            showToast(
              err && err.message ? err.message : 'Помилка імпорту Handoff-токена',
              'warn'
            );
          }
        } else {
          var currentSnap = buildAuthSnapshot();
          commit(function (draft) {
            draft.initialized = true;
            draft.auth = currentSnap;
            draft.parentAuth.hasPin = Boolean(currentSnap.family && currentSnap.family.hasPin);
            return draft;
          });
          return getState();
        }

        commit(function (draft) {
          draft.initialized = true;
          return draft;
        });
        return getState();
      })();

      return initPromise;
    }

    /* ---------------- UI & Navigation Actions ---------------- */

    function setTheme(theme) {
      var nextTheme = applyThemeToDom(theme);
      commit(function (draft) {
        draft.theme = nextTheme;
        return draft;
      });
      return nextTheme;
    }

    function toggleTheme() {
      return setTheme(state.theme === 'dark' ? 'light' : 'dark');
    }

    function setDeviceMode(mode) {
      var nextMode = mode === 'tablet' ? 'tablet' : 'mobile';
      commit(function (draft) {
        draft.deviceMode = nextMode;
        return draft;
      });
      return nextMode;
    }

    function setActiveTab(tab) {
      var raw = String(tab || 'today');
      var nextTab = raw === 'control' ? 'pass' : raw;
      commit(function (draft) {
        draft.activeTab = nextTab;
        return draft;
      });
      return nextTab;
    }

    function setControlSubTab(sub) {
      var nextSub = sub === 'parent' ? 'parent' : 'wallet';
      commit(function (draft) {
        draft.controlSubTab = nextSub;
        return draft;
      });
      return nextSub;
    }

    function setOnboardingStep(step) {
      var num = Number(step);
      if (isNaN(num) || num < 0) num = 0;
      commit(function (draft) {
        draft.onboardingStep = num;
        draft.onboardingCompleted = num >= 4;
        return draft;
      });
      return num;
    }

    /* ---------------- Auth & Cloud Sync Actions ---------------- */

    async function signInWithProvider(provider, roleOrOpts) {
      var authApi = getAuthApi();
      if (!authApi) {
        return { ok: false, error: 'StrictAuth не завантажено' };
      }
      var opts =
        roleOrOpts && typeof roleOrOpts === 'object'
          ? clone(roleOrOpts)
          : { role: roleOrOpts || 'student' };

      try {
        var res = await authApi.signInWithProvider(provider, opts);
        var snap = buildAuthSnapshot();
        commit(function (draft) {
          draft.auth = snap;
          draft.parentAuth.hasPin = Boolean(snap.family && snap.family.hasPin);
          if (draft.onboardingStep === 1) {
            draft.onboardingStep = 2;
          }
          return draft;
        });
        showToast('Вхід виконано: ' + ((res.user && res.user.displayName) || provider), 'success');
        return { ok: true, result: res };
      } catch (err) {
        var msg = err && err.message ? err.message : 'Помилка входу';
        if (err && err.code === 'auth/popup-closed-by-user') {
          return { ok: false, cancelled: true, error: msg };
        }
        showToast(msg, 'danger');
        return { ok: false, error: msg };
      }
    }

    async function registerWithEmail(params) {
      var authApi = getAuthApi();
      if (!authApi) return { ok: false, error: 'StrictAuth не завантажено' };
      try {
        var res = await authApi.registerWithEmail(params);
        var snap = buildAuthSnapshot();
        commit(function (draft) {
          draft.auth = snap;
          draft.parentAuth.hasPin = Boolean(snap.family && snap.family.hasPin);
          if (draft.onboardingStep === 1) {
            draft.onboardingStep = 2;
          }
          return draft;
        });
        showToast('Профіль створено', 'success');
        return { ok: true, result: res };
      } catch (err) {
        var msg = err && err.message ? err.message : 'Помилка реєстрації';
        showToast(msg, 'danger');
        return { ok: false, error: msg };
      }
    }

    async function signInWithEmail(params) {
      var authApi = getAuthApi();
      if (!authApi) return { ok: false, error: 'StrictAuth не завантажено' };
      try {
        var res = await authApi.signInWithEmail(params);
        var snap = buildAuthSnapshot();
        commit(function (draft) {
          draft.auth = snap;
          draft.parentAuth.hasPin = Boolean(snap.family && snap.family.hasPin);
          if (draft.onboardingStep === 1) {
            draft.onboardingStep = 2;
          }
          return draft;
        });
        showToast('Вхід виконано', 'success');
        return { ok: true, result: res };
      } catch (err) {
        var msg = err && err.message ? err.message : 'Невірна пошта або пароль';
        showToast(msg, 'danger');
        return { ok: false, error: msg };
      }
    }

    async function joinFamilyByCode(code) {
      var authApi = getAuthApi();
      if (!authApi) return { ok: false, error: 'StrictAuth не завантажено' };
      try {
        if (!authApi.getCurrentUser()) {
          showToast('Спочатку увійдіть у профіль учня, щоб приєднатися за кодом', 'warn');
          return { ok: false, error: 'Потрібен вхід у профіль' };
        }
        var res = await authApi.joinFamilyByCode(code);
        var snap = buildAuthSnapshot();
        commit(function (draft) {
          draft.auth = snap;
          draft.parentAuth.hasPin = Boolean(snap.family && snap.family.hasPin);
          return draft;
        });
        showToast('Сімейний доступ підключено', 'success');
        return { ok: true, result: res };
      } catch (err) {
        var msg = err && err.message ? err.message : 'Не вдалося приєднатися до сім\'ї';
        showToast(msg, 'danger');
        return { ok: false, error: msg };
      }
    }

    async function signOut() {
      var authApi = getAuthApi();
      if (authApi && typeof authApi.signOut === 'function') {
        await authApi.signOut();
      }
      var snap = buildAuthSnapshot();
      commit(function (draft) {
        draft.auth = snap;
        draft.parentAuth = {
          unlocked: false,
          unlockedAt: null,
          hasPin: false,
          lastError: null
        };
        return draft;
      });
      showToast('Ви вийшли з профілю', 'info');
      return { ok: true };
    }

    async function configureFirebase(jsonStr) {
      var authApi = getAuthApi();
      if (!authApi) return { ok: false, error: 'StrictAuth не завантажено' };
      try {
        var res = await authApi.configureFirebase(jsonStr);
        var snap = buildAuthSnapshot();
        commit(function (draft) {
          draft.auth = snap;
          return draft;
        });
        showToast(
          res.connected
            ? 'Хмарну синхронізацію Firebase підключено'
            : 'Конфігурацію збережено (режим Verified Vault)',
          'success'
        );
        return { ok: true, result: res };
      } catch (err) {
        var msg = err && err.message ? err.message : 'Некоректний JSON конфігурації Firebase';
        showToast(msg, 'danger');
        return { ok: false, error: msg };
      }
    }

    function clearFirebaseConfig() {
      var authApi = getAuthApi();
      if (authApi && typeof authApi.clearFirebaseConfig === 'function') {
        authApi.clearFirebaseConfig();
      }
      var snap = buildAuthSnapshot();
      commit(function (draft) {
        draft.auth = snap;
        return draft;
      });
      showToast('Хмарну конфігурацію очищено (локальний Verified Vault)', 'info');
      return { ok: true };
    }

    /* ---------------- Goals, Handoff & Missed Lesson Guard ---------------- */

    function updateGoals(patch) {
      var p = patch || {};
      commit(function (draft) {
        if (p.targetUniId !== undefined) draft.goals.targetUniId = p.targetUniId;
        if (p.targetUniName !== undefined) draft.goals.targetUniName = p.targetUniName;
        if (p.targetScore !== undefined) draft.goals.targetScore = Number(p.targetScore) || 185;
        if (p.dailyScheduleTime !== undefined) {
          draft.goals.dailyScheduleTime = String(p.dailyScheduleTime);
          draft.contract.missedAlertTime = String(p.dailyScheduleTime);
          draft.missedLesson.scheduledTime = String(p.dailyScheduleTime);
        }
        if (p.dailyMinutesTarget !== undefined) {
          var mins = Math.max(15, Number(p.dailyMinutesTarget) || 45);
          draft.goals.dailyMinutesTarget = mins;
          draft.contract.dailyMinutesTarget = mins;
        }
        if (p.gradeBand !== undefined) {
          draft.goals.gradeBand = String(p.gradeBand);
          draft.tutorDraft.gradeBand = String(p.gradeBand);
        }
        if (p.primarySubject !== undefined) {
          draft.goals.primarySubject = String(p.primarySubject);
          draft.tutorDraft.subjectId = String(p.primarySubject);
        }
        return draft;
      });

      var authApi = getAuthApi();
      if (authApi && authApi.getCurrentUser() && authApi.getFamily()) {
        authApi
          .createOrUpdateFamily({
            dailyScheduleTime: state.goals.dailyScheduleTime,
            contractTerms: state.contract
          })
          .catch(function () {});
      }
      return getState().goals;
    }

    async function triggerTestHandoff() {
      var authApi = getAuthApi();
      if (!authApi) {
        return { ok: false, error: 'StrictAuth не завантажено' };
      }
      try {
        var existingDiag = authApi.getLatestDiagnostic();
        if (!existingDiag) {
          await authApi.saveDiagnosticDraft({
            predictedScore: state.telemetry.predictedScore || 162,
            cefrLevel: state.telemetry.cefrLevel || 'B1',
            subject: state.goals.primarySubject === 'ukrainian' ? 'Українська мова' : 'Математика',
            targetUni: state.goals.targetUniName || 'КНУ ім. Шевченка',
            weakTopics: state.telemetry.weakTopics.slice(0, 3),
            trustScore: state.telemetry.trustScore || 98
          });
        }

        var targetPath =
          typeof window !== 'undefined' && window.location && window.location.pathname
            ? window.location.pathname
            : '/mobile-app/';
        var tokenRes = await authApi.createHandoffToken({ targetUrl: targetPath });
        var consumed = await authApi.consumeHandoffToken(tokenRes.url);
        var freshAuth = buildAuthSnapshot();

        commit(function (draft) {
          draft.auth = freshAuth;
          draft.parentAuth.hasPin = Boolean(freshAuth.family && freshAuth.family.hasPin);
          applyDiagnosticHydration(draft, consumed.diagnostic, {
            sid: consumed.sid,
            importedAt: consumed.importedAt,
            sourceUrl: tokenRes.url
          });
          return draft;
        });

        showToast('Тестовий Handoff (?ht=) імпортовано: бал ' + state.telemetry.predictedScore, 'success');
        return { ok: true, url: tokenRes.url, token: tokenRes.token, consumed: consumed };
      } catch (err) {
        var msg = err && err.message ? err.message : 'Помилка тестового Handoff';
        showToast(msg, 'danger');
        return { ok: false, error: msg };
      }
    }

    async function importHandoffToken(urlOrToken) {
      var authApi = getAuthApi();
      if (!authApi) {
        return { ok: false, error: 'StrictAuth не завантажено' };
      }
      try {
        var consumed = await authApi.consumeHandoffToken(urlOrToken);
        var freshAuth = buildAuthSnapshot();
        commit(function (draft) {
          draft.auth = freshAuth;
          draft.parentAuth.hasPin = Boolean(freshAuth.family && freshAuth.family.hasPin);
          applyDiagnosticHydration(draft, consumed.diagnostic, {
            sid: consumed.sid,
            importedAt: consumed.importedAt,
            sourceUrl: String(urlOrToken)
          });
          return draft;
        });
        showToast('Handoff-токен успішно застосовано', 'success');
        return { ok: true, consumed: consumed };
      } catch (err) {
        var msg = err && err.message ? err.message : 'Некоректний Handoff-токен';
        commit(function (draft) {
          draft.handoffStatus = Object.assign({}, draft.handoffStatus, { error: msg });
          return draft;
        });
        showToast(msg, 'danger');
        return { ok: false, error: msg };
      }
    }

    function simulateMissedLesson() {
      var alertTime = state.contract.missedAlertTime || state.goals.dailyScheduleTime || '17:00';
      commit(function (draft) {
        draft.missedLesson = {
          simulated: true,
          isOverdue: true,
          resolvedToday: false,
          scheduledTime: alertTime,
          lastAlertAt: nowIso()
        };
        return draft;
      });
      showToast(
        'Пропуск заняття (' + alertTime + '): щоденну ціль ще не виконано. Запустіть спринт або розбір теми.',
        'danger'
      );
      return getState().missedLesson;
    }

    /* ---------------- Tutor & Anti-Cheat Verified Quests ---------------- */

    function resolveMissedLesson() {
      commit(function (draft) {
        draft.missedLesson.isOverdue = false;
        draft.missedLesson.simulated = false;
        draft.missedLesson.resolvedToday = true;
        return draft;
      });
      return getState().missedLesson;
    }

    function saveTutorNote(note) {
      var n = note || {};
      var entry = {
        id: n.id || randomTag('note'),
        subjectId: n.subjectId || n.subject || 'math',
        topic: n.topic || 'Конспект уроку',
        text: String(n.text || ''),
        steps: Array.isArray(n.steps) ? n.steps.slice() : [],
        savedAt: nowIso()
      };
      commit(function (draft) {
        if (!Array.isArray(draft.telemetry.tutorNotes)) {
          draft.telemetry.tutorNotes = [];
        }
        draft.telemetry.tutorNotes.unshift(entry);
        draft.telemetry.tutorNotes = draft.telemetry.tutorNotes.slice(0, 30);
        return draft;
      });
      return entry;
    }

    function openTutorWithTopic(params) {
      var p = params || {};
      commit(function (draft) {
        var locked = Boolean(draft.contract && draft.contract.lockStrictPersona);
        var nextPersona = locked ? 'strict' : (p.personaId || draft.tutorDraft.personaId || 'socratic');
        var nextTopic = p.topicTitle !== undefined
          ? p.topicTitle
          : (p.topic !== undefined ? p.topic : draft.tutorDraft.topicTitle);
        var nextSubj = p.subjectId || p.subject || draft.tutorDraft.subjectId || draft.goals.primarySubject || 'math';
        var nextMode = p.mode === 'language' ? 'language' : (p.mode ? 'school' : (draft.tutorDraft.mode === 'language' ? 'language' : 'school'));
        var nextGrade = p.gradeBand || draft.tutorDraft.gradeBand || draft.goals.gradeBand || 'nmt-200';
        if (nextGrade === 'NMT 200' || nextGrade === 'nmt') nextGrade = 'nmt-200';
        if (nextGrade === '5-7') nextGrade = 'grade-5-7';
        if (nextGrade === '8-9') nextGrade = 'grade-8-9';

        draft.tutorDraft = Object.assign({}, draft.tutorDraft, {
          mode: nextMode,
          subjectId: nextSubj,
          languageId: p.languageId || (nextMode === 'language' ? nextSubj : draft.tutorDraft.languageId) || 'english',
          gradeBand: nextGrade,
          cefrLevel: p.cefrLevel || p.cefr || draft.tutorDraft.cefrLevel || draft.telemetry.cefrLevel || 'B1',
          personaId: nextPersona,
          topicTitle: nextTopic,
          promptText: p.promptText !== undefined ? p.promptText : (p.prompt !== undefined ? p.prompt : ''),
          notes: p.notes !== undefined ? p.notes : '',
          errorContext: p.errorContext || null,
          lectureId: p.lectureId !== undefined ? p.lectureId : (p.activeLectureId !== undefined ? p.activeLectureId : null),
          requestNonce: Date.now(),
          messages: p.resetMessages ? [] : (draft.tutorDraft.messages || []),
          sessionStartedAt: nowIso()
        });
        if (p.fromMissedGuard) {
          draft.missedLesson.isOverdue = false;
          draft.missedLesson.simulated = false;
          draft.missedLesson.resolvedToday = true;
        }
        draft.activeTab = 'tutor';
        if (draft.onboardingStep < 4) {
          draft.onboardingStep = 4;
          draft.onboardingCompleted = true;
        }
        return draft;
      });
      return getState().tutorDraft;
    }

    function updateTutorState(patch) {
      var p = patch || {};
      var forcedStrict = false;
      commit(function (draft) {
        var merged = Object.assign({}, draft.tutorDraft, p);
        if (draft.contract && draft.contract.lockStrictPersona) {
          if (p.personaId && p.personaId !== 'strict') {
            forcedStrict = true;
          }
          merged.personaId = 'strict';
        }
        draft.tutorDraft = merged;
        return draft;
      });
      if (forcedStrict) {
        showToast('Активовано батьківський контракт: персона заблокована у Суворому режимі', 'warn');
      }
      return getState().tutorDraft;
    }

    function completeFocusSprint(params) {
      var p = params || {};
      var subjectId = p.subjectId || state.goals.primarySubject || 'math';
      var durationMinutes = Math.max(1, Number(p.durationMinutes || 15));
      var switches = Math.max(0, Number(p.backgroundSwitches || 0));
      var cleanRun = switches === 0;
      var sessionId = randomTag('foc');
      var awardedXp = 0;

      commit(function (draft) {
        draft.telemetry.focusMinutesToday += durationMinutes;
        draft.telemetry.totalFocusMinutes += durationMinutes;

        if (cleanRun) {
          draft.telemetry.trustScore = Math.min(100, draft.telemetry.trustScore + 1);
          for (var i = 0; i < draft.quests.length; i++) {
            if (draft.quests[i].id === 'quest_focus_sprint') {
              if (!draft.quests[i].completed) {
                awardedXp = draft.quests[i].xpReward;
                draft.telemetry.xp += awardedXp;
              }
              draft.quests[i].completed = true;
              draft.quests[i].verifiedAt = nowIso();
              draft.quests[i].proofType = 'focus_sprint_clean';
              draft.quests[i].proofMeta = {
                sessionId: sessionId,
                subjectId: subjectId,
                durationMinutes: durationMinutes,
                backgroundSwitches: 0
              };
            }
          }
        } else {
          draft.telemetry.trustScore = Math.max(40, draft.telemetry.trustScore - switches * 4);
        }

        draft.missedLesson.isOverdue = false;
        draft.missedLesson.simulated = false;
        draft.missedLesson.resolvedToday = true;

        draft.telemetry.recentSessions.unshift({
          id: sessionId,
          type: 'focus',
          title: 'Фокус-спринт (' + durationMinutes + ' хв)',
          subjectId: subjectId,
          trustScore: draft.telemetry.trustScore,
          durationSec: durationMinutes * 60,
          clean: cleanRun,
          createdAt: nowIso()
        });
        draft.telemetry.recentSessions = draft.telemetry.recentSessions.slice(0, 20);
        return draft;
      });

      if (cleanRun) {
        showToast(
          awardedXp > 0
            ? 'Фокус-спринт верифіковано без перемикань (+' + awardedXp + ' XP)'
            : 'Фокус-спринт зараховано (' + durationMinutes + ' хв)',
          'success'
        );
      } else {
        showToast(
          'Зафіксовано виходів з фокусу: ' + switches + '. Квест не зараховано.',
          'warn'
        );
      }

      return { ok: true, clean: cleanRun, sessionId: sessionId, awardedXp: awardedXp };
    }

    function completeTutorTopic(params) {
      var p = params || {};
      var subjectId = p.subjectId || p.subject || state.tutorDraft.subjectId || 'math';
      var topicTitle = p.topicTitle || p.topic || state.tutorDraft.topicTitle || 'Сократівський розбір';
      var messagesCount = Math.max(1, Number(p.messagesCount || p.turns || 2));
      var durationSec = Math.max(10, Number(p.durationSec || 120));
      var targetLectureId = p.lectureId || p.activeLectureId || state.tutorDraft.lectureId || null;
      var sessionId = randomTag('tut');
      var awardedXp = 0;
      var completedLecturesCount = 0;

      commit(function (draft) {
        draft.telemetry.totalTutorSessions += 1;

        for (var i = 0; i < draft.quests.length; i++) {
          if (draft.quests[i].id === 'quest_tutor_topic') {
            if (!draft.quests[i].completed) {
              awardedXp = draft.quests[i].xpReward;
              draft.telemetry.xp += awardedXp;
            }
            draft.quests[i].completed = true;
            draft.quests[i].verifiedAt = nowIso();
            draft.quests[i].proofType = 'tutor_dialogue_verified';
            draft.quests[i].proofMeta = {
              verifiedSessionId: sessionId,
              subjectId: subjectId,
              topicTitle: topicTitle,
              messagesCount: messagesCount,
              durationSec: durationSec
            };
          }
        }

        // Automatically mark matching parent-assigned lecture(s) as completed with verifiedSessionId
        var topicLower = String(topicTitle || '').toLowerCase();
        var activeChildId = draft.selectedChildId;
        var matchedOne = false;
        draft.assignedLectures = draft.assignedLectures.map(function (lec) {
          if (lec.status === 'completed') return lec;
          var isDirectMatch = targetLectureId && lec.id === targetLectureId;
          var lecTopicLower = String(lec.topic || lec.title || '').toLowerCase();
          var isTopicMatch =
            !targetLectureId &&
            lec.childId === activeChildId &&
            !matchedOne &&
            lec.subjectId === subjectId &&
            (lecTopicLower === topicLower ||
              topicLower.indexOf(lecTopicLower) !== -1 ||
              lecTopicLower.indexOf(topicLower) !== -1 ||
              !lec.topic);

          if (isDirectMatch || isTopicMatch) {
            matchedOne = true;
            completedLecturesCount += 1;
            return Object.assign({}, lec, {
              status: 'completed',
              completedAt: nowIso(),
              verifiedSessionId: sessionId
            });
          }
          return lec;
        });

        // Improve mastery node if matched
        var nodeUpdated = false;
        draft.telemetry.masteryNodes = draft.telemetry.masteryNodes.map(function (node) {
          if (!nodeUpdated && node.subjectId === subjectId) {
            var nextVal = Math.min(100, node.mastery + 6);
            nodeUpdated = true;
            return Object.assign({}, node, {
              mastery: nextVal,
              status: nextVal >= 75 ? 'solid' : nextVal >= 60 ? 'review' : 'weak'
            });
          }
          return node;
        });

        draft.missedLesson.isOverdue = false;
        draft.missedLesson.simulated = false;
        draft.missedLesson.resolvedToday = true;

        draft.telemetry.recentSessions.unshift({
          id: sessionId,
          type: 'tutor',
          title: topicTitle,
          subjectId: subjectId,
          messagesCount: messagesCount,
          durationSec: durationSec,
          createdAt: nowIso()
        });
        draft.telemetry.recentSessions = draft.telemetry.recentSessions.slice(0, 20);
        return draft;
      });

      var msg =
        awardedXp > 0
          ? 'Тему розібрано та верифіковано (+' + awardedXp + ' XP)'
          : 'Розбір теми збережено у журнал';
      if (completedLecturesCount > 0) {
        msg += ' · Домашнє завдання від батьків виконано';
      }
      showToast(msg, 'success');

      return {
        ok: true,
        verifiedSessionId: sessionId,
        awardedXp: awardedXp,
        completedLecturesCount: completedLecturesCount
      };
    }

    function completeExamRun(params) {
      var p = params || {};
      var examMode = p.examMode || p.mode || 'cat';
      var subjectId = p.subjectId || p.subject || state.goals.primarySubject || 'math';
      var totalCount = Math.max(1, Number(p.totalCount || 5));
      var correctCount = Math.max(0, Math.min(totalCount, Number(p.correctCount || 0)));
      var scoreRaw = p.score100To200 !== undefined ? p.score100To200 : p.score;
      var score =
        scoreRaw !== undefined
          ? Math.max(100, Math.min(200, Math.round(Number(scoreRaw))))
          : Math.round(100 + (correctCount / totalCount) * 100);
      var antiCheat = p.antiCheatSummary || {};
      var blurCount = Number(
        p.tabBlurCount !== undefined
          ? p.tabBlurCount
          : (antiCheat.tabBlurCount !== undefined ? antiCheat.tabBlurCount : (antiCheat.blurCount || antiCheat.violations || 0))
      );
      var flagged = Boolean(antiCheat.flagged || antiCheat.automationFlag || antiCheat.extensionDetected) || blurCount >= 2;
      var microVerified = p.microVerified !== undefined ? p.microVerified !== false : p.microCheckPassed !== false;
      var cleanExam = !flagged && blurCount === 0 && microVerified;
      var sessionId = randomTag('exm');
      var awardedXp = 0;

      commit(function (draft) {
        draft.telemetry.totalExamsCompleted += 1;

        var blended = Math.round(draft.telemetry.predictedScore * 0.4 + score * 0.6);
        draft.telemetry.predictedScore = Math.max(100, Math.min(200, blended));

        var incomingTrust = p.trustScore !== undefined ? p.trustScore : antiCheat.trustScore;
        if (typeof incomingTrust === 'number') {
          draft.telemetry.trustScore = Math.max(0, Math.min(100, Math.round(incomingTrust)));
        } else if (flagged) {
          draft.telemetry.trustScore = Math.max(30, draft.telemetry.trustScore - 15);
        } else if (blurCount > 0) {
          draft.telemetry.trustScore = Math.max(40, draft.telemetry.trustScore - blurCount * 5);
        } else {
          draft.telemetry.trustScore = Math.min(100, draft.telemetry.trustScore + 1);
        }

        if (!draft.antiCheat) {
          draft.antiCheat = { blurCount: 0, microChecksPassed: 4, microChecksTotal: 4 };
        }
        draft.antiCheat.blurCount += blurCount;
        if (p.microCheckStatus && p.microCheckStatus !== 'pending') {
          draft.antiCheat.microChecksTotal += 1;
          if (p.microCheckStatus === 'passed') {
            draft.antiCheat.microChecksPassed += 1;
          }
        }

        if (Array.isArray(p.weakTopics) && p.weakTopics.length > 0) {
          draft.telemetry.weakTopics = p.weakTopics.slice(0, 5);
        }

        if (cleanExam) {
          for (var i = 0; i < draft.quests.length; i++) {
            if (draft.quests[i].id === 'quest_exam_run') {
              if (!draft.quests[i].completed) {
                awardedXp = draft.quests[i].xpReward;
                draft.telemetry.xp += awardedXp;
              }
              draft.quests[i].completed = true;
              draft.quests[i].verifiedAt = nowIso();
              draft.quests[i].proofType = 'exam_anticheat_verified';
              draft.quests[i].proofMeta = {
                sessionId: sessionId,
                examMode: examMode,
                subjectId: subjectId,
                score100To200: score,
                correctCount: correctCount,
                totalCount: totalCount,
                microVerified: microVerified
              };
            }
          }
        }

        draft.missedLesson.isOverdue = false;
        draft.missedLesson.simulated = false;
        draft.missedLesson.resolvedToday = true;

        draft.telemetry.recentSessions.unshift({
          id: sessionId,
          type: 'exam',
          title: 'Іспит (' + examMode.toUpperCase() + '): ' + score + ' / 200',
          subjectId: subjectId,
          score100To200: score,
          correctCount: correctCount,
          totalCount: totalCount,
          trustScore: draft.telemetry.trustScore,
          clean: cleanExam,
          errors: Array.isArray(p.errors) ? clone(p.errors) : [],
          createdAt: nowIso()
        });
        draft.telemetry.recentSessions = draft.telemetry.recentSessions.slice(0, 20);
        return draft;
      });

      if (cleanExam) {
        showToast(
          'Іспит складено (' + score + ' б.). Trust Score: ' + state.telemetry.trustScore + '%',
          'success'
        );
      } else {
        showToast(
          'Іспит завершено (' + score + ' б.), але виявлено порушення античиту. Квест не зараховано.',
          'warn'
        );
      }

      return {
        ok: true,
        clean: cleanExam,
        sessionId: sessionId,
        score100To200: score,
        awardedXp: awardedXp
      };
    }

    /* ---------------- Multi-Child & Parent Governance ---------------- */

    function selectChild(childId) {
      var found = false;
      commit(function (draft) {
        for (var i = 0; i < draft.children.length; i++) {
          if (draft.children[i].id === childId) {
            draft.selectedChildId = childId;
            found = true;
            break;
          }
        }
        return draft;
      });
      return found;
    }

    function addChildByCode(name, code, gradeLabel) {
      var cleanName = String(name || '').trim();
      if (!cleanName) {
        showToast('Введіть ім\'я учня', 'warn');
        return { ok: false, error: 'Не вказано ім\'я учня' };
      }
      var rawCode = String(code || '').trim().toUpperCase().replace(/\s+/g, '');
      if (!rawCode) {
        rawCode = 'SA-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      } else if (rawCode.indexOf('SA-') !== 0 && rawCode.length === 6) {
        rawCode = 'SA-' + rawCode;
      }

      var newChild = {
        id: randomTag('child'),
        name: cleanName,
        gradeLabel: String(gradeLabel || '9 клас').trim() || '9 клас',
        gradeBand: String(gradeLabel || '').indexOf('11') !== -1 ? 'NMT 200' : '8-9',
        inviteCode: rawCode,
        predictedScore: 148,
        cefrLevel: 'B1',
        trustScore: 96,
        streakDays: 1,
        focusMinutesToday: 0,
        weakTopics: ['Початкова діагностика по ключових темах'],
        lastActivityAt: nowIso()
      };

      commit(function (draft) {
        draft.children.push(newChild);
        draft.selectedChildId = newChild.id;
        return draft;
      });
      showToast('Додано учня: ' + cleanName + ' (' + rawCode + ')', 'success');
      return { ok: true, child: newChild };
    }

    function assignLecture(payload) {
      var p = payload || {};
      var title = String(p.title || p.topic || '').trim();
      if (!title) {
        showToast('Вкажіть назву або тему заняття', 'warn');
        return { ok: false, error: 'Порожня назва завдання' };
      }
      var lecture = {
        id: randomTag('lec'),
        childId: p.childId || state.selectedChildId || 'child_oleksandr',
        title: title,
        subjectId: p.subjectId || 'math',
        topic: String(p.topic || title),
        notes: String(p.notes || '').trim(),
        status: 'pending',
        assignedAt: nowIso(),
        completedAt: null,
        verifiedSessionId: null
      };

      commit(function (draft) {
        draft.assignedLectures.unshift(lecture);
        return draft;
      });
      showToast('Завдання призначено учню', 'success');
      return { ok: true, lecture: lecture };
    }

    function deleteLecture(lectureId) {
      commit(function (draft) {
        draft.assignedLectures = draft.assignedLectures.filter(function (lec) {
          return lec.id !== lectureId;
        });
        return draft;
      });
      showToast('Завдання видалено', 'info');
      return { ok: true };
    }

    function updateContract(patch) {
      var p = patch || {};
      var lockedTriggered = false;
      commit(function (draft) {
        var nextContract = Object.assign({}, draft.contract, p);
        if (p.dailyMinutesTarget !== undefined) {
          nextContract.dailyMinutesTarget = Math.max(15, Number(p.dailyMinutesTarget) || 45);
          draft.goals.dailyMinutesTarget = nextContract.dailyMinutesTarget;
        }
        if (p.missedAlertTime !== undefined) {
          nextContract.missedAlertTime = String(p.missedAlertTime || '17:00');
          draft.goals.dailyScheduleTime = nextContract.missedAlertTime;
          draft.missedLesson.scheduledTime = nextContract.missedAlertTime;
        }
        if (nextContract.lockStrictPersona) {
          lockedTriggered = !draft.contract.lockStrictPersona;
          draft.tutorDraft.personaId = 'strict';
        }
        draft.contract = nextContract;
        return draft;
      });

      var authApi = getAuthApi();
      if (authApi && authApi.getCurrentUser() && authApi.getFamily()) {
        authApi
          .createOrUpdateFamily({
            dailyScheduleTime: state.contract.missedAlertTime,
            contractTerms: state.contract
          })
          .catch(function () {});
      }

      if (lockedTriggered) {
        showToast('Сувору персону Репетитора зафіксовано умовами контракту', 'info');
      } else {
        showToast('Умови батьківського контракту оновлено', 'success');
      }
      return getState().contract;
    }

    async function createOrVerifyParentPin(params) {
      var p = params || {};
      var mode = p.mode || 'verify';
      var pinStr = String(p.pin === undefined || p.pin === null ? '' : p.pin).trim();
      var oldPinStr = String(p.oldPin === undefined || p.oldPin === null ? '' : p.oldPin).trim();
      var authApi = getAuthApi();

      if (!authApi) {
        return { ok: false, error: 'StrictAuth не завантажено' };
      }

      if (!/^\d{4,8}$/.test(pinStr)) {
        var fmtErr = 'PIN має містити від 4 до 8 цифр';
        commit(function (draft) {
          draft.parentAuth.lastError = fmtErr;
          return draft;
        });
        return { ok: false, error: fmtErr };
      }

      try {
        if (mode === 'create') {
          if (!authApi.getCurrentUser()) {
            await authApi.signInWithProvider('google', {
              role: 'parent',
              instant: true,
              forceVault: true,
              displayName: 'Батьківський кабінет',
              email: 'parent.vault@strictai.local'
            });
          }
          await authApi.createOrUpdateFamily({
            newPin: pinStr,
            dailyScheduleTime: state.contract.missedAlertTime,
            contractTerms: state.contract
          });
          var createdSnap = buildAuthSnapshot();
          commit(function (draft) {
            draft.auth = createdSnap;
            draft.parentAuth = {
              unlocked: true,
              unlockedAt: nowIso(),
              hasPin: true,
              lastError: null
            };
            return draft;
          });
          showToast('Батьківський PIN збережено (Salted SHA-256)', 'success');
          return { ok: true, mode: 'create' };
        }

        if (mode === 'verify') {
          var valid = await authApi.verifyParentPin(pinStr);
          if (!valid) {
            commit(function (draft) {
              draft.parentAuth = Object.assign({}, draft.parentAuth, {
                unlocked: false,
                lastError: 'Невірний PIN-код'
              });
              return draft;
            });
            return { ok: false, error: 'Невірний PIN-код' };
          }
          commit(function (draft) {
            draft.parentAuth = {
              unlocked: true,
              unlockedAt: nowIso(),
              hasPin: true,
              lastError: null
            };
            return draft;
          });
          showToast('Батьківський кабінет розблоковано', 'success');
          return { ok: true, mode: 'verify' };
        }

        if (mode === 'change') {
          var oldOk = await authApi.verifyParentPin(oldPinStr);
          if (!oldOk) {
            commit(function (draft) {
              draft.parentAuth = Object.assign({}, draft.parentAuth, {
                lastError: 'Невірний поточний PIN-код'
              });
              return draft;
            });
            return { ok: false, error: 'Невірний поточний PIN-код' };
          }
          await authApi.createOrUpdateFamily({ newPin: pinStr });
          var changedSnap = buildAuthSnapshot();
          commit(function (draft) {
            draft.auth = changedSnap;
            draft.parentAuth = {
              unlocked: true,
              unlockedAt: nowIso(),
              hasPin: true,
              lastError: null
            };
            return draft;
          });
          showToast('PIN-код батьків оновлено', 'success');
          return { ok: true, mode: 'change' };
        }

        return { ok: false, error: 'Невідомий режим PIN' };
      } catch (err) {
        var msg = err && err.message ? err.message : 'Помилка обробки PIN-коду';
        commit(function (draft) {
          draft.parentAuth = Object.assign({}, draft.parentAuth, { lastError: msg });
          return draft;
        });
        showToast(msg, 'danger');
        return { ok: false, error: msg };
      }
    }

    function lockParentPanel() {
      commit(function (draft) {
        draft.parentAuth = Object.assign({}, draft.parentAuth, {
          unlocked: false,
          unlockedAt: null,
          lastError: null
        });
        return draft;
      });
      showToast('Батьківський кабінет заблоковано', 'info');
      return true;
    }

    /* ---------------- StrictPass Wallet & Sponsor Invoice ---------------- */

    function selectPlanSku(patch) {
      var p = patch || {};
      var seats = p.seats || state.planSelection.seats || 'single';
      var cycle = p.cycle || state.planSelection.cycle || 'season';
      var tier = p.tier || state.planSelection.tier || 'strictpass';
      var resolved = resolveSkuDetails(seats, cycle, tier);

      commit(function (draft) {
        draft.planSelection = {
          seats: resolved.seats,
          cycle: resolved.cycle,
          tier: resolved.tier,
          skuId: resolved.skuId,
          priceUah: resolved.priceUah
        };
        return draft;
      });
      return getState().planSelection;
    }

    async function activateSelectedPass() {
      var authApi = getAuthApi();
      if (!authApi) {
        return { ok: false, error: 'StrictAuth не завантажено' };
      }
      var sel = state.planSelection;
      var resolved = resolveSkuDetails(sel.seats, sel.cycle, sel.tier);
      try {
        var res = await authApi.activateStrictPass({
          tier: resolved.tierName,
          seatType: resolved.seats,
          cycle: resolved.cycle,
          priceUah: resolved.priceUah
        });
        var snap = buildAuthSnapshot();
        commit(function (draft) {
          draft.auth = snap;
          return draft;
        });
        showToast(
          resolved.tierName + ' активовано (' + formatUah(resolved.priceUah) + ')',
          'success'
        );
        return { ok: true, result: res };
      } catch (err) {
        var msg = err && err.message ? err.message : 'Помилка активації StrictPass';
        showToast(msg, 'danger');
        return { ok: false, error: msg };
      }
    }

    async function generateParentInvoiceLink() {
      var authApi = getAuthApi();
      if (!authApi) {
        return { ok: false, error: 'StrictAuth не завантажено' };
      }
      var sel = state.planSelection;
      var resolved = resolveSkuDetails(sel.seats, sel.cycle, sel.tier);
      var skuCode = resolved.imageFilename.replace('.webp', '');
      var activeChild = state.children.filter(function (c) {
        return c.id === state.selectedChildId;
      })[0];

      try {
        var res = await authApi.createSponsorLink({
          sku: skuCode,
          studentName: activeChild ? activeChild.name : undefined
        });
        commit(function (draft) {
          draft.sponsorLink = {
            url: res.url,
            sku: res.sku,
            createdAt: nowIso()
          };
          return draft;
        });
        showToast('Посилання на оплату для батьків створено', 'success');
        return { ok: true, url: res.url, token: res.token, sku: res.sku };
      } catch (err) {
        var msg = err && err.message ? err.message : 'Не вдалося згенерувати посилання';
        showToast(msg, 'danger');
        return { ok: false, error: msg };
      }
    }

    return {
      init: init,
      getState: getState,
      subscribe: subscribe,
      useStrictMobileStore: useStrictMobileStore,
      setTheme: setTheme,
      toggleTheme: toggleTheme,
      setDeviceMode: setDeviceMode,
      setActiveTab: setActiveTab,
      setControlSubTab: setControlSubTab,
      setOnboardingStep: setOnboardingStep,
      showToast: showToast,
      signInWithProvider: signInWithProvider,
      registerWithEmail: registerWithEmail,
      signInWithEmail: signInWithEmail,
      joinFamilyByCode: joinFamilyByCode,
      signOut: signOut,
      configureFirebase: configureFirebase,
      clearFirebaseConfig: clearFirebaseConfig,
      updateGoals: updateGoals,
      triggerTestHandoff: triggerTestHandoff,
      importHandoffToken: importHandoffToken,
      simulateMissedLesson: simulateMissedLesson,
      resolveMissedLesson: resolveMissedLesson,
      saveTutorNote: saveTutorNote,
      openTutorWithTopic: openTutorWithTopic,
      updateTutorState: updateTutorState,
      completeFocusSprint: completeFocusSprint,
      completeTutorTopic: completeTutorTopic,
      completeExamRun: completeExamRun,
      selectChild: selectChild,
      addChildByCode: addChildByCode,
      assignLecture: assignLecture,
      deleteLecture: deleteLecture,
      updateContract: updateContract,
      createOrVerifyParentPin: createOrVerifyParentPin,
      lockParentPanel: lockParentPanel,
      selectPlanSku: selectPlanSku,
      activateSelectedPass: activateSelectedPass,
      generateParentInvoiceLink: generateParentInvoiceLink
    };
  }

  var StrictMobileStore = createMobileStore();

  globalScope.StrictUI = StrictUI;
  globalScope.StrictMobileStore = StrictMobileStore;

  if (typeof window !== 'undefined') {
    window.StrictUI = StrictUI;
    window.StrictMobileStore = StrictMobileStore;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      StrictUI: StrictUI,
      StrictMobileStore: StrictMobileStore
    };
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
