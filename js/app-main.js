/* ==========================================================================
   StrictAI Mobile Application — Boot, Shared UI Primitives, Studio Frame,
   Onboarding Flow & 5-Tab Root Shell
   Zero JSX, zero emojis.
   ========================================================================== */

(function (global) {
  'use strict';

  var React = global.React;
  var ReactDOM = global.ReactDOM;
  var h = React.createElement;
  var useState = React.useState;
  var useEffect = React.useEffect;

  var FALLBACK_UNIVERSITIES = [
    { id: 'knu', name: 'КНУ імені Тараса Шевченка', targetScore: 188 },
    { id: 'kpi', name: 'НТУУ «КПІ ім. Ігоря Сікорського»', targetScore: 185 },
    { id: 'ucu', name: 'Український католицький університет', targetScore: 192 },
    { id: 'lpnu', name: 'НУ «Львівська політехніка»', targetScore: 180 },
    { id: 'karazin', name: 'ХНУ імені В.Н. Каразіна', targetScore: 182 }
  ];

  var FALLBACK_GRADE_BANDS = [
    { id: 'grade-5-7', label: '5-7 класи' },
    { id: 'grade-8-9', label: '8-9 класи' },
    { id: 'nmt-200', label: 'НМТ 200' },
    { id: 'olympiad', label: 'Олімпіада' }
  ];

  var PRIMARY_SUBJECTS = [
    { id: 'math', label: 'Математика' },
    { id: 'ukrainian', label: 'Українська мова' },
    { id: 'history', label: 'Історія України' },
    { id: 'bio-phys', label: 'Біологія та Фізика' },
    { id: 'english', label: 'English' }
  ];

  var TABS = [
    { id: 'today', label: 'Сьогодні', icon: 'spark' },
    { id: 'tutor', label: 'Репетитор', icon: 'messageSquare' },
    { id: 'exams', label: 'Іспити', icon: 'radar' },
    { id: 'focus', label: 'Фокус & Мапа', icon: 'layers' },
    { id: 'pass', label: 'StrictPass', icon: 'creditCard' }
  ];

  /* ========================================================================
     Shared UI Primitives (merge onto window.StrictUI)
     ======================================================================== */
  function Icon(props) {
    var p = props || {};
    var icons = global.StrictIcons;
    var svgHtml = icons && typeof icons.svg === 'function'
      ? icons.svg(p.name, p.size || 18, p.className || '')
      : '';
    var attrs = {
      className: p.className ? 'sa-icon-wrap ' + p.className : 'sa-icon-wrap',
      dangerouslySetInnerHTML: { __html: svgHtml }
    };
    if (p.ariaLabel) {
      attrs['aria-label'] = p.ariaLabel;
      attrs.role = 'img';
    }
    return h('span', attrs);
  }

  function Sheet(props) {
    var p = props || {};
    var open = Boolean(p.open);
    var onClose = p.onClose;

    useEffect(function () {
      if (!open || typeof global.addEventListener !== 'function') return;
      function onKeyDown(e) {
        if (e.key === 'Escape' && typeof onClose === 'function') {
          onClose();
        }
      }
      global.addEventListener('keydown', onKeyDown);
      return function () {
        global.removeEventListener('keydown', onKeyDown);
      };
    }, [open, onClose]);

    if (!open) return null;

    var backdropClass = 'sa-sheet-backdrop' + (p.center ? ' is-center' : '');
    var panelClass = p.center ? 'sa-modal-panel sa-stack' : 'sa-sheet-panel sa-stack';

    return h('div', {
      className: backdropClass,
      role: 'dialog',
      'aria-modal': 'true',
      onClick: function (e) {
        if (e.target === e.currentTarget && typeof onClose === 'function') {
          onClose();
        }
      }
    },
      h('div', { className: panelClass },
        !p.center ? h('div', { className: 'sa-sheet-handle' }) : null,
        h('div', { className: 'sa-row-between' },
          h('div', { className: 'sa-stack-sm', style: { gap: '2px', minWidth: 0, flex: '1 1 auto' } },
            p.title ? h('h3', { className: 'sa-section-title' }, p.title) : null,
            p.subtitle ? h('p', { className: 'sa-muted' }, p.subtitle) : null
          ),
          onClose
            ? h('button', {
                type: 'button',
                className: 'sa-icon-btn',
                'aria-label': 'Закрити',
                onClick: onClose
              }, h(Icon, { name: 'x', size: 16 }))
            : null
        ),
        h('div', { className: 'sa-divider' }),
        p.children
      )
    );
  }

  function Toast(props) {
    var p = props || {};
    var toast = p.toast;
    if (!toast) return null;

    var message = typeof toast === 'string' ? toast : (toast.message || '');
    if (!message) return null;

    var tone = typeof toast === 'object' && toast.tone ? toast.tone : 'info';
    var iconName = (tone === 'ok' || tone === 'success')
      ? 'checkCircle'
      : (tone === 'warn' || tone === 'danger' ? 'alertTriangle' : 'spark');

    return h('div', {
      className: 'sa-toast',
      role: 'status',
      onClick: function () {
        if (typeof p.onDismiss === 'function') p.onDismiss(toast);
      }
    },
      h(Icon, { name: iconName, size: 16 }),
      h('span', { style: { flex: 1 } }, message),
      typeof p.onDismiss === 'function'
        ? h(Icon, { name: 'x', size: 14 })
        : null
    );
  }

  function formatUah(amount) {
    var num = Number(amount);
    if (!isFinite(num)) num = 0;
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' \u20B4';
  }

  var existingUI = global.StrictUI || {};
  global.StrictUI = Object.assign({}, existingUI, {
    Icon: existingUI.Icon || Icon,
    Sheet: existingUI.Sheet || Sheet,
    Modal: existingUI.Modal || function Modal(p) {
      return h(Sheet, Object.assign({}, p, { center: true }));
    },
    Toast: Toast,
    formatUah: existingUI.formatUah || formatUah
  });

  function getGradeBands() {
    if (global.StrictCurriculum && Array.isArray(global.StrictCurriculum.GRADE_BANDS) && global.StrictCurriculum.GRADE_BANDS.length) {
      return global.StrictCurriculum.GRADE_BANDS;
    }
    return FALLBACK_GRADE_BANDS;
  }

  function getGradeLabel(gradeId) {
    var val = String(gradeId || '').trim();
    var list = getGradeBands();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === val || list[i].label === val) {
        return list[i].label;
      }
    }
    if (val === 'NMT 200') return 'НМТ 200';
    return val || 'НМТ 200';
  }

  function normalizeGradeId(raw) {
    var s = String(raw || '').toLowerCase();
    if (s.indexOf('5-7') !== -1) return 'grade-5-7';
    if (s.indexOf('8-9') !== -1) return 'grade-8-9';
    if (s.indexOf('olymp') !== -1) return 'olympiad';
    return 'nmt-200';
  }

  function getFirebaseStatusSafe(state) {
    if (global.StrictAuth && typeof global.StrictAuth.getFirebaseStatus === 'function') {
      return global.StrictAuth.getFirebaseStatus();
    }
    var auth = (state && state.auth) || {};
    return {
      mode: auth.mode || 'vault',
      projectId: auth.projectId || 'strictai-local-vault',
      online: auth.online !== undefined ? auth.online : true,
      hasCustomConfig: Boolean(auth.hasCustomConfig)
    };
  }

  /* ========================================================================
     Firebase Cloud Config Sheet (shared by Auth Step & Profile Sheet)
     ======================================================================== */
  function FirebaseConfigSheet(props) {
    var open = Boolean(props.open);
    var onClose = props.onClose;
    var store = props.store;
    var state = props.state;

    var _jsonInput = useState('');
    var jsonInput = _jsonInput[0];
    var setJsonInput = _jsonInput[1];

    var _apiKey = useState('');
    var apiKey = _apiKey[0];
    var setApiKey = _apiKey[1];

    var _authDomain = useState('');
    var authDomain = _authDomain[0];
    var setAuthDomain = _authDomain[1];

    var _projectId = useState('');
    var projectId = _projectId[0];
    var setProjectId = _projectId[1];

    var _appId = useState('');
    var appId = _appId[0];
    var setAppId = _appId[1];

    var _error = useState('');
    var error = _error[0];
    var setError = _error[1];

    var _busy = useState(false);
    var busy = _busy[0];
    var setBusy = _busy[1];

    var fbStatus = getFirebaseStatusSafe(state);

    function handleSaveConfig(e) {
      if (e && e.preventDefault) e.preventDefault();
      var payload;
      var trimmedJson = String(jsonInput || '').trim();
      if (trimmedJson) {
        payload = trimmedJson;
      } else {
        payload = JSON.stringify({
          apiKey: String(apiKey || '').trim(),
          authDomain: String(authDomain || '').trim(),
          projectId: String(projectId || '').trim(),
          appId: String(appId || '').trim()
        });
      }

      setError('');
      setBusy(true);
      var promise = (store && typeof store.configureFirebase === 'function')
        ? store.configureFirebase(payload)
        : (global.StrictAuth && global.StrictAuth.configureFirebase(payload));

      Promise.resolve(promise).then(function (res) {
        if (res && res.ok === false) {
          setError(res.error || 'Некоректна конфігурація Firebase.');
        } else if (typeof onClose === 'function') {
          onClose();
        }
      }).catch(function (err) {
        setError((err && err.message) || 'Некоректна конфігурація Firebase.');
      }).finally(function () {
        setBusy(false);
      });
    }

    function handleClearConfig() {
      setBusy(true);
      var promise = (store && typeof store.clearFirebaseConfig === 'function')
        ? store.clearFirebaseConfig()
        : (global.StrictAuth && global.StrictAuth.clearFirebaseConfig());
      Promise.resolve(promise).then(function () {
        if (typeof onClose === 'function') onClose();
      }).finally(function () {
        setBusy(false);
      });
    }

    return h(Sheet, {
      open: open,
      onClose: onClose,
      title: 'Налаштування Firebase Cloud',
      subtitle: 'Поточний режим: ' + (fbStatus.mode === 'firebase' ? 'Firebase Cloud (' + fbStatus.projectId + ')' : 'Local Verified Vault')
    },
      h('form', { className: 'sa-stack', onSubmit: handleSaveConfig },
        h('div', { className: 'sa-banner' },
          h(Icon, { name: 'cpu', size: 16 }),
          h('span', { className: 'sa-muted' },
            'Вставте об\'єкт firebaseConfig у JSON або заповніть поля apiKey та projectId для синхронізації з хмарою.'
          )
        ),
        h('div', { className: 'sa-stack-sm' },
          h('span', { className: 'sa-label' }, 'JSON FIREBASECONFIG (ОПЦІЙНО)'),
          h('textarea', {
            rows: 3,
            className: 'sa-input sa-mono',
            placeholder: '{"apiKey":"...","authDomain":"...","projectId":"..."}',
            value: jsonInput,
            onChange: function (e) { setJsonInput(e.target.value); }
          })
        ),
        h('div', { className: 'sa-grid-2' },
          h('input', {
            type: 'text',
            className: 'sa-input',
            placeholder: 'apiKey',
            value: apiKey,
            onChange: function (e) { setApiKey(e.target.value); }
          }),
          h('input', {
            type: 'text',
            className: 'sa-input',
            placeholder: 'projectId',
            value: projectId,
            onChange: function (e) { setProjectId(e.target.value); }
          })
        ),
        h('div', { className: 'sa-grid-2' },
          h('input', {
            type: 'text',
            className: 'sa-input',
            placeholder: 'authDomain',
            value: authDomain,
            onChange: function (e) { setAuthDomain(e.target.value); }
          }),
          h('input', {
            type: 'text',
            className: 'sa-input',
            placeholder: 'appId',
            value: appId,
            onChange: function (e) { setAppId(e.target.value); }
          })
        ),
        error
          ? h('div', { className: 'sa-banner is-danger' },
              h(Icon, { name: 'alertCircle', size: 15 }),
              h('span', { style: { fontSize: '12px' } }, error)
            )
          : null,
        h('button', {
          type: 'submit',
          className: 'sa-btn sa-btn-primary',
          disabled: busy,
          style: { width: '100%' }
        }, h(Icon, { name: 'checkCircle', size: 16 }), busy ? 'Підключення...' : 'Зберегти Firebase Config'),
        fbStatus.hasCustomConfig
          ? h('button', {
              type: 'button',
              className: 'sa-btn sa-btn-secondary',
              disabled: busy,
              style: { width: '100%' },
              onClick: handleClearConfig
            }, 'Повернутися до Local Vault')
          : null
      )
    );
  }

  /* ========================================================================
     4-Step Onboarding Flow (0: welcome, 1: auth, 2: goal, 4: ready)
     ======================================================================== */
  function OnboardingFlow(props) {
    var state = props.state || {};
    var store = props.store || {};
    var stepNum = Number(state.onboardingStep || 0);
    if (isNaN(stepNum) || stepNum < 0) stepNum = 0;
    if (stepNum > 2) stepNum = 2;

    var _htInput = useState('');
    var htInput = _htInput[0];
    var setHtInput = _htInput[1];
    var _htBusy = useState(false);
    var htBusy = _htBusy[0];
    var setHtBusy = _htBusy[1];

    var _role = useState((state.auth && state.auth.user && state.auth.user.role) || 'student');
    var role = _role[0];
    var setRole = _role[1];

    var _authMode = useState('signin');
    var authMode = _authMode[0];
    var setAuthMode = _authMode[1];

    var _displayName = useState('');
    var displayName = _displayName[0];
    var setDisplayName = _displayName[1];

    var _email = useState('');
    var email = _email[0];
    var setEmail = _email[1];

    var _password = useState('');
    var password = _password[0];
    var setPassword = _password[1];

    var _showPass = useState(false);
    var showPass = _showPass[0];
    var setShowPass = _showPass[1];

    var _familyCode = useState('');
    var familyCode = _familyCode[0];
    var setFamilyCode = _familyCode[1];

    var _authErr = useState('');
    var authErr = _authErr[0];
    var setAuthErr = _authErr[1];

    var _authBusy = useState(false);
    var authBusy = _authBusy[0];
    var setAuthBusy = _authBusy[1];

    var _showFbSheet = useState(false);
    var showFbSheet = _showFbSheet[0];
    var setShowFbSheet = _showFbSheet[1];

    var uniList = (global.StrictCurriculum && Array.isArray(global.StrictCurriculum.UNIVERSITIES) && global.StrictCurriculum.UNIVERSITIES.length)
      ? global.StrictCurriculum.UNIVERSITIES
      : FALLBACK_UNIVERSITIES;
    var gradeBands = getGradeBands();

    var goals = state.goals || {};
    var _targetUniId = useState(goals.targetUniId || (uniList[0] && uniList[0].id) || 'knu');
    var targetUniId = _targetUniId[0];
    var setTargetUniId = _targetUniId[1];

    var _gradeBand = useState(normalizeGradeId(goals.gradeBand));
    var gradeBand = _gradeBand[0];
    var setGradeBand = _gradeBand[1];

    var _primarySubject = useState(goals.primarySubject || 'math');
    var primarySubject = _primarySubject[0];
    var setPrimarySubject = _primarySubject[1];

    var _scheduleTime = useState(goals.dailyScheduleTime || '17:00');
    var scheduleTime = _scheduleTime[0];
    var setScheduleTime = _scheduleTime[1];

    var _dailyMinutes = useState(Number(goals.dailyMinutesTarget || 45));
    var dailyMinutes = _dailyMinutes[0];
    var setDailyMinutes = _dailyMinutes[1];

    var currentUser = state.auth && state.auth.user ? state.auth.user : null;
    var handoff = state.handoffStatus || {};
    var telemetry = state.telemetry || {};

    function handleImportHandoff(e) {
      if (e && e.preventDefault) e.preventDefault();
      var raw = String(htInput || '').trim();
      if (!raw || typeof store.importHandoffToken !== 'function') return;
      setHtBusy(true);
      Promise.resolve(store.importHandoffToken(raw))
        .then(function (res) {
          if (res && res.ok) setHtInput('');
        })
        .finally(function () {
          setHtBusy(false);
        });
    }

    function handleProviderSignIn(provider) {
      if (typeof store.signInWithProvider !== 'function') return;
      setAuthErr('');
      setAuthBusy(true);
      Promise.resolve(store.signInWithProvider(provider, { role: role }))
        .then(function (res) {
          if (res && res.ok === false && !res.cancelled) {
            setAuthErr(res.error || 'Не вдалося увійти через ' + provider);
          }
        })
        .finally(function () {
          setAuthBusy(false);
        });
    }

    function handleEmailSubmit(e) {
      if (e && e.preventDefault) e.preventDefault();
      setAuthErr('');
      setAuthBusy(true);
      var promise;
      if (authMode === 'register' && typeof store.registerWithEmail === 'function') {
        promise = store.registerWithEmail({
          email: email,
          password: password,
          displayName: displayName,
          role: role
        });
      } else if (typeof store.signInWithEmail === 'function') {
        promise = store.signInWithEmail({
          email: email,
          password: password
        });
      }
      Promise.resolve(promise)
        .then(function (res) {
          if (res && res.ok === false) {
            setAuthErr(res.error || 'Помилка автентифікації.');
          }
        })
        .finally(function () {
          setAuthBusy(false);
        });
    }

    function handleJoinFamily(e) {
      if (e && e.preventDefault) e.preventDefault();
      if (!String(familyCode || '').trim() || typeof store.joinFamilyByCode !== 'function') return;
      setAuthErr('');
      setAuthBusy(true);
      Promise.resolve(store.joinFamilyByCode(familyCode))
        .then(function (res) {
          if (res && res.ok === false) {
            setAuthErr(res.error || 'Не вдалося приєднатися до сім\'ї.');
          } else {
            setFamilyCode('');
          }
        })
        .finally(function () {
          setAuthBusy(false);
        });
    }

    function handleFinishOnboarding() {
      var selectedUni = null;
      for (var i = 0; i < uniList.length; i++) {
        if (uniList[i].id === targetUniId || uniList[i].name === targetUniId) {
          selectedUni = uniList[i];
          break;
        }
      }
      if (typeof store.updateGoals === 'function') {
        store.updateGoals({
          targetUniId: selectedUni ? selectedUni.id : targetUniId,
          targetUniName: selectedUni ? selectedUni.name : targetUniId,
          targetScore: selectedUni && selectedUni.targetScore ? selectedUni.targetScore : 185,
          gradeBand: gradeBand,
          primarySubject: primarySubject,
          dailyScheduleTime: scheduleTime,
          dailyMinutesTarget: dailyMinutes
        });
      }
      if (typeof store.setOnboardingStep === 'function') {
        store.setOnboardingStep(4);
      }
    }

    return h('div', { className: 'sa-viewport' },
      h('div', { className: 'sa-onboard-wrap' },
        h('div', { className: 'sa-stack' },
          h('div', { className: 'sa-row-between' },
            h('div', { className: 'sa-row' },
              h('div', { className: 'sa-brand-mark' }, h(Icon, { name: 'brandBear', size: 17 })),
              h('div', { className: 'sa-stack-sm', style: { gap: '1px' } },
                h('span', { className: 'sa-top-title' }, 'StrictAI Mobile'),
                h('span', { className: 'sa-top-sub' }, 'Крок ' + (stepNum + 1) + ' з 4')
              )
            ),
            h('div', { className: 'sa-row' },
              h('div', { className: 'sa-step-dots' },
                [0, 1, 2, 3].map(function (idx) {
                  var cls = 'sa-step-dot' +
                    (idx === stepNum ? ' is-active' : (idx < stepNum ? ' is-done' : ''));
                  return h('span', { key: 'dot_' + idx, className: cls });
                })
              ),
              h('button', {
                type: 'button',
                className: 'sa-icon-btn',
                'aria-label': 'Перемкнути тему',
                onClick: function () {
                  if (typeof store.toggleTheme === 'function') store.toggleTheme();
                }
              }, h(Icon, { name: state.theme === 'dark' ? 'sun' : 'moon', size: 16 }))
            )
          ),

          /* Step 0: Welcome & Handoff */
          stepNum === 0
            ? h('div', { className: 'sa-stack' },
                h('div', { className: 'sa-card sa-card-pad sa-stack' },
                  h('span', { className: 'sa-badge sa-badge-ink', style: { alignSelf: 'flex-start' } },
                    h(Icon, { name: 'shieldCheck', size: 12 }),
                    'SWISS INDUSTRIAL STUDY ENGINE'
                  ),
                  h('h1', { className: 'sa-section-title', style: { fontSize: '22px', lineHeight: 1.18 } },
                    'Суворий AI-репетитор, античит НМТ і батьківський контроль'
                  ),
                  h('p', { className: 'sa-muted' },
                    'Сократівське навчання без готових відповідей, захищені canvas-тести з трекінгом чесності та сімейний контракт на 17:00.'
                  ),
                  h('div', { className: 'sa-grid-3' },
                    h('div', { className: 'sa-card sa-card-subtle sa-card-pad sa-stack-sm', style: { gap: '4px' } },
                      h(Icon, { name: 'messageSquare', size: 16 }),
                      h('span', { className: 'sa-card-title', style: { fontSize: '12px' } }, 'Сократ'),
                      h('span', { className: 'sa-muted', style: { fontSize: '11px' } }, '5 мов та 4 предмети')
                    ),
                    h('div', { className: 'sa-card sa-card-subtle sa-card-pad sa-stack-sm', style: { gap: '4px' } },
                      h(Icon, { name: 'radar', size: 16 }),
                      h('span', { className: 'sa-card-title', style: { fontSize: '12px' } }, 'Античит'),
                      h('span', { className: 'sa-muted', style: { fontSize: '11px' } }, 'Canvas + 20s чеки')
                    ),
                    h('div', { className: 'sa-card sa-card-subtle sa-card-pad sa-stack-sm', style: { gap: '4px' } },
                      h(Icon, { name: 'creditCard', size: 16 }),
                      h('span', { className: 'sa-card-title', style: { fontSize: '12px' } }, 'StrictPass'),
                      h('span', { className: 'sa-muted', style: { fontSize: '11px' } }, 'Сім\'я та 3D-ключ')
                    )
                  )
                ),

                handoff.imported
                  ? h('div', { className: 'sa-banner is-ok' },
                      h(Icon, { name: 'checkCircle', size: 18 }),
                      h('div', { className: 'sa-stack-sm', style: { gap: '3px' } },
                        h('strong', { style: { fontSize: '13px' } }, 'Діагностику імпортовано (?ht= Handoff)'),
                        h('span', { className: 'sa-muted', style: { color: 'var(--ink-primary)' } },
                          'Прогноз НМТ: ' + (telemetry.predictedScore || 158) + ' б. · CEFR ' +
                          (telemetry.cefrLevel || 'B1') +
                          (goals.targetUniName ? ' · ' + goals.targetUniName : '')
                        )
                      )
                    )
                  : null,

                h('form', { className: 'sa-card sa-card-pad sa-stack-sm', onSubmit: handleImportHandoff },
                  h('span', { className: 'sa-label' }, 'РУЧНИЙ ІМПОРТ ?HT= ТОКЕНА З ВЕБ-ДІАГНОСТИКИ'),
                  h('div', { className: 'sa-row' },
                    h('input', {
                      type: 'text',
                      className: 'sa-input sa-mono',
                      placeholder: 'Вставте ht1.<payload>.<sig> або URL з ?ht=...',
                      value: htInput,
                      onChange: function (e) { setHtInput(e.target.value); }
                    }),
                    h('button', {
                      type: 'submit',
                      className: 'sa-btn sa-btn-secondary',
                      disabled: htBusy || !String(htInput || '').trim()
                    }, htBusy ? '...' : 'Імпорт')
                  )
                )
              )
            : null,

          /* Step 1: Auth */
          stepNum === 1
            ? h('div', { className: 'sa-stack' },
                h('div', { className: 'sa-card sa-card-pad sa-stack' },
                  h('span', { className: 'sa-label' }, '1. ОБЕРІТЬ РОЛЬ У СІМ\'Ї'),
                  h('div', { className: 'sa-segmented', style: { width: '100%' } },
                    h('button', {
                      type: 'button',
                      className: role === 'student' ? 'is-active' : '',
                      style: { flex: 1 },
                      onClick: function () { setRole('student'); }
                    }, h(Icon, { name: 'graduationCap', size: 15 }), 'Учень'),
                    h('button', {
                      type: 'button',
                      className: role === 'parent' ? 'is-active' : '',
                      style: { flex: 1 },
                      onClick: function () { setRole('parent'); }
                    }, h(Icon, { name: 'shieldCheck', size: 15 }), 'Батько або мати')
                  ),

                  h('span', { className: 'sa-label' }, '2. ШВИДКИЙ ВХІД ЧЕРЕЗ ПРОВАЙДЕРА'),
                  h('div', { className: 'sa-grid-3' },
                    h('button', {
                      type: 'button',
                      className: 'sa-btn sa-btn-secondary',
                      disabled: authBusy,
                      onClick: function () { handleProviderSignIn('google'); }
                    }, h(Icon, { name: 'google', size: 16 }), 'Google'),
                    h('button', {
                      type: 'button',
                      className: 'sa-btn sa-btn-secondary',
                      disabled: authBusy,
                      onClick: function () { handleProviderSignIn('apple'); }
                    }, h(Icon, { name: 'apple', size: 16 }), 'Apple'),
                    h('button', {
                      type: 'button',
                      className: 'sa-btn sa-btn-secondary',
                      disabled: authBusy,
                      onClick: function () { handleProviderSignIn('github'); }
                    }, h(Icon, { name: 'github', size: 16 }), 'GitHub')
                  ),

                  h('div', { className: 'sa-divider' }),

                  h('div', { className: 'sa-segmented', style: { width: '100%' } },
                    h('button', {
                      type: 'button',
                      className: authMode === 'signin' ? 'is-active' : '',
                      style: { flex: 1 },
                      onClick: function () { setAuthMode('signin'); }
                    }, 'Вхід Email'),
                    h('button', {
                      type: 'button',
                      className: authMode === 'register' ? 'is-active' : '',
                      style: { flex: 1 },
                      onClick: function () { setAuthMode('register'); }
                    }, 'Реєстрація')
                  ),

                  h('form', { className: 'sa-stack-sm', onSubmit: handleEmailSubmit },
                    authMode === 'register'
                      ? h('input', {
                          type: 'text',
                          className: 'sa-input',
                          placeholder: 'Ім\'я (наприклад: Олександр)',
                          value: displayName,
                          onChange: function (e) { setDisplayName(e.target.value); }
                        })
                      : null,
                    h('input', {
                      type: 'email',
                      className: 'sa-input',
                      placeholder: 'name@example.com',
                      value: email,
                      onChange: function (e) { setEmail(e.target.value); }
                    }),
                    h('div', { className: 'sa-row' },
                      h('input', {
                        type: showPass ? 'text' : 'password',
                        className: 'sa-input',
                        placeholder: 'Пароль (від 6 символів)',
                        value: password,
                        onChange: function (e) { setPassword(e.target.value); }
                      }),
                      h('button', {
                        type: 'button',
                        className: 'sa-icon-btn',
                        'aria-label': 'Показати пароль',
                        onClick: function () { setShowPass(function (v) { return !v; }); }
                      }, h(Icon, { name: showPass ? 'eyeOff' : 'eye', size: 16 }))
                    ),
                    h('button', {
                      type: 'submit',
                      className: 'sa-btn sa-btn-primary',
                      disabled: authBusy,
                      style: { width: '100%' }
                    },
                      h(Icon, { name: 'mail', size: 15 }),
                      authMode === 'register' ? 'Створити акаунт' : 'Увійти через Email'
                    )
                  ),

                  authErr
                    ? h('div', { className: 'sa-banner is-danger' },
                        h(Icon, { name: 'alertCircle', size: 15 }),
                        h('span', { style: { fontSize: '12px' } }, authErr)
                      )
                    : null
                ),

                h('form', { className: 'sa-card sa-card-pad sa-stack-sm', onSubmit: handleJoinFamily },
                  h('span', { className: 'sa-label' }, 'ПРИЄДНАТИСЯ ДО СІМ\'Ї ЗА КОДОМ'),
                  h('div', { className: 'sa-row' },
                    h('input', {
                      type: 'text',
                      className: 'sa-input sa-mono',
                      placeholder: 'SA-XXXXXX',
                      value: familyCode,
                      onChange: function (e) { setFamilyCode(e.target.value.toUpperCase()); }
                    }),
                    h('button', {
                      type: 'submit',
                      className: 'sa-btn sa-btn-secondary',
                      disabled: authBusy || !currentUser
                    }, 'Приєднатися')
                  )
                ),

                currentUser
                  ? h('div', { className: 'sa-banner is-ok' },
                      h(Icon, { name: 'userCheck', size: 17 }),
                      h('div', { className: 'sa-stack-sm', style: { gap: '2px' } },
                        h('strong', { style: { fontSize: '13px' } },
                          'Увійшли: ' + (currentUser.displayName || currentUser.email || 'Користувач')
                        ),
                        h('span', { className: 'sa-muted' },
                          'Роль: ' + (currentUser.role === 'parent' ? 'Батько або мати' : 'Учень') +
                          (currentUser.inviteCode ? ' · Код ' + currentUser.inviteCode : '')
                        )
                      )
                    )
                  : null,

                h('button', {
                  type: 'button',
                  className: 'sa-btn sa-btn-ghost sa-btn-sm',
                  onClick: function () { setShowFbSheet(true); }
                }, h(Icon, { name: 'sliders', size: 15 }), 'Налаштувати Firebase Cloud (опційно)')
              )
            : null,

          /* Step 2: Goal Setup */
          stepNum === 2
            ? h('div', { className: 'sa-card sa-card-pad sa-stack' },
                h('div', { className: 'sa-stack-sm' },
                  h('span', { className: 'sa-label' }, 'ЦІЛЬОВИЙ УНІВЕРСИТЕТ'),
                  h('select', {
                    className: 'sa-input',
                    value: targetUniId,
                    onChange: function (e) { setTargetUniId(e.target.value); }
                  },
                    uniList.map(function (u) {
                      var val = u.id || u.name;
                      var label = u.name + (u.targetScore ? ' (орієнтир ' + u.targetScore + ' б.)' : '');
                      return h('option', { key: val, value: val }, label);
                    })
                  )
                ),

                h('div', { className: 'sa-stack-sm' },
                  h('span', { className: 'sa-label' }, 'КЛАС / ВІКОВИЙ БЛОК'),
                  h('div', { className: 'sa-grid-2' },
                    gradeBands.map(function (gb) {
                      return h('button', {
                        key: gb.id,
                        type: 'button',
                        className: 'sa-chip' + (gradeBand === gb.id ? ' is-active' : ''),
                        style: { justifyContent: 'center' },
                        onClick: function () { setGradeBand(gb.id); }
                      }, gb.label);
                    })
                  )
                ),

                h('div', { className: 'sa-stack-sm' },
                  h('span', { className: 'sa-label' }, 'ПРІОРИТЕТНИЙ ПРЕДМЕТ'),
                  h('div', { className: 'sa-chip-scroll' },
                    PRIMARY_SUBJECTS.map(function (subj) {
                      return h('button', {
                        key: subj.id,
                        type: 'button',
                        className: 'sa-chip' + (primarySubject === subj.id ? ' is-active' : ''),
                        onClick: function () { setPrimarySubject(subj.id); }
                      }, subj.label);
                    })
                  )
                ),

                h('div', { className: 'sa-grid-2' },
                  h('div', { className: 'sa-stack-sm' },
                    h('span', { className: 'sa-label' }, 'ЧАС УРОКУ'),
                    h('input', {
                      type: 'time',
                      className: 'sa-input sa-mono',
                      value: scheduleTime,
                      onChange: function (e) { setScheduleTime(e.target.value || '17:00'); }
                    })
                  ),
                  h('div', { className: 'sa-stack-sm' },
                    h('span', { className: 'sa-label' }, 'НОРМА НА ДЕНЬ'),
                    h('div', { className: 'sa-segmented', style: { width: '100%' } },
                      [30, 45, 60].map(function (m) {
                        return h('button', {
                          key: String(m),
                          type: 'button',
                          className: dailyMinutes === m ? 'is-active' : '',
                          style: { flex: 1, padding: '0 6px' },
                          onClick: function () { setDailyMinutes(m); }
                        }, m + ' хв');
                      })
                    )
                  )
                )
              )
            : null
        ),

        /* Onboarding Footer Actions */
        h('div', { className: 'sa-stack-sm', style: { paddingTop: '8px' } },
          stepNum === 0
            ? h('button', {
                type: 'button',
                className: 'sa-btn sa-btn-primary sa-btn-lg',
                style: { width: '100%' },
                onClick: function () {
                  if (typeof store.setOnboardingStep === 'function') store.setOnboardingStep(1);
                }
              }, 'Почати налаштування', h(Icon, { name: 'arrowRight', size: 17 }))
            : null,

          stepNum === 1
            ? h('div', { className: 'sa-grid-2' },
                h('button', {
                  type: 'button',
                  className: 'sa-btn sa-btn-secondary',
                  onClick: function () {
                    if (typeof store.setOnboardingStep === 'function') store.setOnboardingStep(0);
                  }
                }, h(Icon, { name: 'arrowLeft', size: 16 }), 'Назад'),
                h('button', {
                  type: 'button',
                  className: 'sa-btn sa-btn-primary',
                  onClick: function () {
                    if (typeof store.setOnboardingStep === 'function') store.setOnboardingStep(2);
                  }
                }, currentUser ? 'Далі до цілі' : 'Пропустити', h(Icon, { name: 'arrowRight', size: 16 }))
              )
            : null,

          stepNum === 2
            ? h('div', { className: 'sa-grid-2' },
                h('button', {
                  type: 'button',
                  className: 'sa-btn sa-btn-secondary',
                  onClick: function () {
                    if (typeof store.setOnboardingStep === 'function') store.setOnboardingStep(1);
                  }
                }, h(Icon, { name: 'arrowLeft', size: 16 }), 'Назад'),
                h('button', {
                  type: 'button',
                  className: 'sa-btn sa-btn-primary',
                  onClick: handleFinishOnboarding
                }, 'Відкрити StrictAI Mobile', h(Icon, { name: 'arrowRight', size: 16 }))
              )
            : null
        ),

        h(FirebaseConfigSheet, {
          open: showFbSheet,
          onClose: function () { setShowFbSheet(false); },
          store: store,
          state: state
        })
      )
    );
  }

  /* ========================================================================
     Authenticated 5-Tab App Shell
     ======================================================================== */
  function AuthenticatedShell(props) {
    var state = props.state || {};
    var store = props.store || {};
    var onDismissToast = props.onDismissToast;
    var visibleToast = props.visibleToast;

    var _profileOpen = useState(false);
    var profileOpen = _profileOpen[0];
    var setProfileOpen = _profileOpen[1];

    var _fbSheetOpen = useState(false);
    var fbSheetOpen = _fbSheetOpen[0];
    var setFbSheetOpen = _fbSheetOpen[1];

    var _htToken = useState('');
    var htToken = _htToken[0];
    var setHtToken = _htToken[1];

    var activeTab = state.activeTab === 'control' ? 'pass' : (state.activeTab || 'today');
    var user = state.auth && state.auth.user ? state.auth.user : null;
    var activePass = state.auth && state.auth.activePass ? state.auth.activePass : null;
    var family = state.auth && state.auth.family ? state.auth.family : null;
    var fbStatus = getFirebaseStatusSafe(state);

    var userName = (user && (user.displayName || user.email)) || 'Олександр';
    var gradeLabel = getGradeLabel(state.goals && state.goals.gradeBand);
    var missedDot = Boolean(
      state.missedLesson &&
      state.missedLesson.isOverdue &&
      !state.missedLesson.resolvedToday
    );

    var studyViews = global.StrictMobileViewsStudy || {};
    var controlViews = global.StrictMobileViewsControl || {};

    function renderActiveTab() {
      if (activeTab === 'today' && typeof studyViews.TodayView === 'function') {
        return h(studyViews.TodayView, { state: state, store: store });
      }
      if (activeTab === 'tutor' && typeof studyViews.TutorView === 'function') {
        return h(studyViews.TutorView, { state: state, store: store });
      }
      if (activeTab === 'exams' && typeof studyViews.ExamsView === 'function') {
        return h(studyViews.ExamsView, { state: state, store: store });
      }
      if (activeTab === 'focus' && typeof controlViews.FocusMapView === 'function') {
        return h(controlViews.FocusMapView, { state: state, store: store });
      }
      if ((activeTab === 'pass' || activeTab === 'control') && typeof controlViews.PassControlView === 'function') {
        return h(controlViews.PassControlView, { state: state, store: store });
      }
      return h('div', { className: 'sa-card sa-card-pad' },
        h('p', { className: 'sa-muted' }, 'Модуль вкладки завантажується...')
      );
    }

    return h('div', { className: 'sa-app-shell' },
      h('header', { className: 'sa-top-bar' },
        h('div', { className: 'sa-top-brand' },
          h('div', { className: 'sa-brand-mark' },
            h(Icon, { name: 'brandBear', size: 17 })
          ),
          h('div', { className: 'sa-stack-sm', style: { gap: '1px', minWidth: 0 } },
            h('div', { className: 'sa-top-title' }, 'StrictAI'),
            h('div', { className: 'sa-top-sub' }, userName + ' · ' + gradeLabel)
          )
        ),
        h('div', { className: 'sa-top-actions' },
          h('button', {
            type: 'button',
            className: 'sa-icon-btn',
            'aria-label': 'Перемкнути тему',
            onClick: function () {
              if (typeof store.toggleTheme === 'function') store.toggleTheme();
            }
          }, h(Icon, { name: state.theme === 'dark' ? 'sun' : 'moon', size: 17 })),
          h('button', {
            type: 'button',
            className: 'sa-icon-btn',
            'aria-label': 'Профіль та налаштування',
            onClick: function () { setProfileOpen(true); }
          }, h(Icon, { name: user ? 'userCheck' : 'user', size: 17 }))
        )
      ),

      h('main', { className: 'sa-viewport' },
        renderActiveTab()
      ),

      h('nav', { className: 'sa-bottom-nav', 'aria-label': 'Головна навігація' },
        TABS.map(function (tab) {
          var isActive = activeTab === tab.id;
          return h('button', {
            key: tab.id,
            type: 'button',
            className: 'sa-nav-item' + (isActive ? ' is-active' : ''),
            'aria-current': isActive ? 'page' : undefined,
            onClick: function () {
              if (typeof store.setActiveTab === 'function') store.setActiveTab(tab.id);
            }
          },
            tab.id === 'today' && missedDot ? h('span', { className: 'sa-nav-dot' }) : null,
            h(Icon, { name: tab.icon, size: 18 }),
            h('span', null, tab.label)
          );
        })
      ),

      h(Sheet, {
        open: profileOpen,
        onClose: function () { setProfileOpen(false); },
        title: 'Профіль та Хмара',
        subtitle: user ? (user.email || user.uid) : 'Автономна сесія'
      },
        h('div', { className: 'sa-stack' },
          h('div', { className: 'sa-card sa-card-subtle sa-card-pad sa-stack-sm' },
            h('div', { className: 'sa-row-between' },
              h('span', { className: 'sa-card-title' }, userName),
              h('span', {
                className: fbStatus.mode === 'firebase' ? 'sa-badge sa-badge-ok' : 'sa-badge'
              }, fbStatus.mode === 'firebase' ? 'Firebase Cloud' : 'Local Vault')
            ),
            h('div', { className: 'sa-row-wrap' },
              h('span', { className: 'sa-badge' },
                'Роль: ' + (user && user.role === 'parent' ? 'Батьки' : 'Учень')
              ),
              activePass && activePass.status === 'active'
                ? h('span', { className: 'sa-badge sa-badge-ok' }, activePass.tier || 'StrictPass')
                : h('span', { className: 'sa-badge' }, 'Безкоштовний план'),
              family && family.inviteCode
                ? h('span', { className: 'sa-badge sa-badge-ink' }, family.inviteCode)
                : null
            )
          ),

          h('form', {
            className: 'sa-stack-sm',
            onSubmit: function (e) {
              e.preventDefault();
              if (!String(htToken || '').trim() || typeof store.importHandoffToken !== 'function') return;
              Promise.resolve(store.importHandoffToken(htToken)).then(function (res) {
                if (res && res.ok) setHtToken('');
              });
            }
          },
            h('span', { className: 'sa-label' }, 'ІМПОРТ ?HT= ДІАГНОСТИКИ'),
            h('div', { className: 'sa-row' },
              h('input', {
                type: 'text',
                className: 'sa-input sa-mono',
                placeholder: 'Вставте ?ht= токен',
                value: htToken,
                onChange: function (e) { setHtToken(e.target.value); }
              }),
              h('button', {
                type: 'submit',
                className: 'sa-btn sa-btn-secondary',
                disabled: !String(htToken || '').trim()
              }, 'OK')
            )
          ),

          h('div', { className: 'sa-stack-sm' },
            h('button', {
              type: 'button',
              className: 'sa-btn sa-btn-secondary',
              style: { width: '100%', justifyContent: 'flex-start' },
              onClick: function () {
                setProfileOpen(false);
                setFbSheetOpen(true);
              }
            }, h(Icon, { name: 'sliders', size: 16 }), 'Налаштування Firebase Cloud'),

            h('button', {
              type: 'button',
              className: 'sa-btn sa-btn-secondary',
              style: { width: '100%', justifyContent: 'flex-start' },
              onClick: function () {
                setProfileOpen(false);
                if (typeof store.setOnboardingStep === 'function') store.setOnboardingStep(0);
              }
            }, h(Icon, { name: 'refresh', size: 16 }), 'Повторити онбординг'),

            h('button', {
              type: 'button',
              className: 'sa-btn sa-btn-secondary',
              style: { width: '100%', justifyContent: 'flex-start', color: 'var(--status-danger)' },
              onClick: function () {
                setProfileOpen(false);
                if (typeof store.signOut === 'function') store.signOut();
              }
            }, h(Icon, { name: 'logOut', size: 16 }), 'Вийти з профілю')
          )
        )
      ),

      h(FirebaseConfigSheet, {
        open: fbSheetOpen,
        onClose: function () { setFbSheetOpen(false); },
        store: store,
        state: state
      }),

      h(Toast, {
        toast: visibleToast,
        onDismiss: onDismissToast
      })
    );
  }

  /* ========================================================================
     Root <App /> Component (Studio Frame + Onboarding / Authenticated Shell)
     ======================================================================== */
  function App() {
    var store = global.StrictMobileStore;

    var _state = useState(function () {
      return store && typeof store.getState === 'function' ? store.getState() : { initialized: false };
    });
    var state = _state[0];
    var setState = _state[1];

    var _dismissedToastId = useState(null);
    var dismissedToastId = _dismissedToastId[0];
    var setDismissedToastId = _dismissedToastId[1];

    useEffect(function () {
      if (!store) return;
      var unsubscribe = null;
      if (typeof store.subscribe === 'function') {
        unsubscribe = store.subscribe(function (next) {
          setState(next);
        });
      }
      if (typeof store.init === 'function') {
        Promise.resolve(store.init()).then(function (hydrated) {
          if (hydrated) setState(hydrated);
        });
      }
      return function () {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }, [store]);

    var theme = (state && state.theme) === 'dark' ? 'dark' : 'light';

    useEffect(function () {
      if (typeof document === 'undefined') return;
      document.documentElement.setAttribute('data-theme', theme);
      var meta = document.getElementById('strict-meta-theme');
      if (meta) {
        meta.setAttribute('content', theme === 'dark' ? '#09090B' : '#F6F6F7');
      }
    }, [theme]);

    var isReady = Boolean(state && state.initialized);
    var deviceMode = (state && state.deviceMode) === 'tablet' ? 'tablet' : 'mobile';
    var isOnboardingDone = Boolean(
      state &&
      (state.onboardingCompleted || Number(state.onboardingStep) >= 4 || state.onboardingStep === 'ready')
    );

    var rawToast = state ? state.toast : null;
    var visibleToast = rawToast && (!dismissedToastId || rawToast.id !== dismissedToastId)
      ? rawToast
      : null;

    function handleDismissToast(t) {
      if (t && t.id) setDismissedToastId(t.id);
      else setDismissedToastId('dismissed');
    }

    return h('div', { className: 'sa-studio-backdrop' },
      h('div', { className: 'sa-studio-toolbar' },
        h('div', { className: 'sa-studio-brand' },
          h(Icon, { name: 'brandBear', size: 17 }),
          h('span', null, 'StrictAI Mobile · Studio Preview')
        ),
        h('div', { className: 'sa-studio-controls' },
          h('div', { className: 'sa-segmented' },
            h('button', {
              type: 'button',
              className: deviceMode === 'mobile' ? 'is-active' : '',
              onClick: function () {
                if (store && typeof store.setDeviceMode === 'function') store.setDeviceMode('mobile');
              }
            }, h(Icon, { name: 'smartphone', size: 14 }), 'Рамка смартфона'),
            h('button', {
              type: 'button',
              className: deviceMode === 'tablet' ? 'is-active' : '',
              onClick: function () {
                if (store && typeof store.setDeviceMode === 'function') store.setDeviceMode('tablet');
              }
            }, h(Icon, { name: 'layers', size: 14 }), 'Широкий планшетний режим')
          ),

          h('div', { className: 'sa-segmented' },
            h('button', {
              type: 'button',
              className: theme === 'light' ? 'is-active' : '',
              onClick: function () {
                if (store && typeof store.setTheme === 'function') store.setTheme('light');
              }
            }, h(Icon, { name: 'sun', size: 14 }), 'Light'),
            h('button', {
              type: 'button',
              className: theme === 'dark' ? 'is-active' : '',
              onClick: function () {
                if (store && typeof store.setTheme === 'function') store.setTheme('dark');
              }
            }, h(Icon, { name: 'moon', size: 14 }), 'Dark')
          ),

          h('button', {
            type: 'button',
            className: 'sa-btn sa-btn-secondary sa-btn-sm',
            onClick: function () {
              if (store && typeof store.triggerTestHandoff === 'function') store.triggerTestHandoff();
            }
          }, h(Icon, { name: 'qrCode', size: 14 }), 'Тест ?ht= Handoff'),

          h('button', {
            type: 'button',
            className: 'sa-btn sa-btn-secondary sa-btn-sm',
            onClick: function () {
              if (store && typeof store.simulateMissedLesson === 'function') store.simulateMissedLesson();
            }
          }, h(Icon, { name: 'clock', size: 14 }), '17:00 Пропуск уроку')
        )
      ),

      h('div', { className: 'sa-device-stage' },
        h('div', {
          className: 'sa-device-frame ' + (deviceMode === 'tablet' ? 'is-tablet' : 'is-phone')
        },
          h('div', { className: 'sa-device-notch' }),
          !isReady
            ? h('div', { className: 'sa-app-shell' },
                h('div', { className: 'sa-boot-fallback' }, 'Ініціалізація StrictAI Mobile...')
              )
            : (!isOnboardingDone
                ? h('div', { className: 'sa-app-shell' },
                    h(OnboardingFlow, { state: state, store: store }),
                    h(Toast, {
                      toast: visibleToast,
                      onDismiss: handleDismissToast
                    })
                  )
                : h(AuthenticatedShell, {
                    state: state,
                    store: store,
                    visibleToast: visibleToast,
                    onDismissToast: handleDismissToast
                  }))
        )
      )
    );
  }

  function mountApp() {
    if (typeof document === 'undefined') return;
    var rootEl = document.getElementById('root');
    if (!rootEl) return;
    if (ReactDOM && typeof ReactDOM.createRoot === 'function') {
      ReactDOM.createRoot(rootEl).render(h(App));
    } else if (ReactDOM && typeof ReactDOM.render === 'function') {
      ReactDOM.render(h(App), rootEl);
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mountApp);
    } else {
      mountApp();
    }
  }
})(window);
