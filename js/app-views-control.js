/* ==========================================================================
   StrictAI Mobile Application — Tab 4 (Focus & Knowledge Map) and
   Tab 5 (StrictPass 3D Wallet & Parent Control Cabinet)
   Zero JSX, zero emojis.
   Exposes window.StrictMobileViewsControl = { FocusMapView, PassControlView }.
   ========================================================================== */

(function (global) {
  'use strict';

  var React = global.React;
  var h = React.createElement;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;
  var useMemo = React.useMemo;

  var SUBJECT_OPTIONS = [
    { id: 'math', label: 'Математика' },
    { id: 'ukrainian', label: 'Українська мова' },
    { id: 'history', label: 'Історія України' },
    { id: 'bio-phys', label: 'Біологія та Фізика' },
    { id: 'english', label: 'English' }
  ];

  var SEAT_OPTIONS = [
    { id: 'single', label: 'Single (1)', shortLabel: 'Single', limit: 1 },
    { id: 'duo', label: 'Duo (2)', shortLabel: 'Duo', limit: 2 },
    { id: 'family', label: 'Family (5 місць)', shortLabel: 'Family', limit: 5 }
  ];

  var CYCLE_OPTIONS = [
    { id: 'monthly', label: 'Місяць (1 міс)' },
    { id: 'season', label: 'Сезон НМТ (3 міс)' },
    { id: 'annual', label: 'Рік (12 міс)' }
  ];

  var TIER_OPTIONS = [
    { id: 'strictpass', label: 'StrictPass' },
    { id: 'pro', label: 'Pro' },
    { id: 'max', label: 'MAX' }
  ];

  var TIER_FEATURES_UK = {
    strictpass: [
      'Повний діагностичний радар НМТ та CEFR A1-C2',
      'Сократівський розбір помилок крок за кроком без спойлерів',
      'Адаптивна щоденна черга тренувань і верифікований стрік',
      'Офлайн-синхронізація прогресу між мобільним і вебом'
    ],
    pro: [
      'Усі можливості базового тарифу StrictPass',
      'Безлімітні симуляції НМТ з античит-полотном і таймингом',
      'Кластеризація прогалин та ізоляція слабких вузлів карти знань',
      'Тижневий звіт верифікації для батьків і ментора'
    ],
    max: [
      'Усі інструменти StrictPass Pro та розширеної телеметрії',
      'Глибокі сократівські ланцюги доведень для задач на 200 балів',
      'Персональний маршрут до обраного університету України',
      'Пріоритетна обчислювальна лінія без добових лімітів'
    ]
  };

  function getUI() {
    if (global.StrictUI) {
      return global.StrictUI;
    }
    return {
      Icon: function FallbackIcon(props) {
        var icons = global.StrictIcons;
        var html = icons && typeof icons.svg === 'function'
          ? icons.svg(props.name, props.size || 18, props.className || '')
          : '';
        return h('span', {
          className: 'sa-icon-wrap',
          dangerouslySetInnerHTML: { __html: html }
        });
      },
      Sheet: function FallbackSheet(props) {
        if (!props.open) return null;
        return h('div', {
          className: 'sa-sheet-backdrop',
          onClick: function (e) {
            if (e.target === e.currentTarget && props.onClose) props.onClose();
          }
        },
          h('div', { className: 'sa-sheet-panel' },
            h('div', { className: 'sa-sheet-handle' }),
            h('div', { className: 'sa-row-between' },
              h('h3', { className: 'sa-section-title' }, props.title || ''),
              h('button', {
                type: 'button',
                className: 'sa-icon-btn',
                onClick: props.onClose
              }, 'X')
            ),
            props.children
          )
        );
      },
      formatUah: function (amount) {
        var num = Number(amount);
        if (isNaN(num)) return '0 \u20B4';
        return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' \u20B4';
      }
    };
  }

  function uiIcon(name, size, className) {
    var UI = getUI();
    return h(UI.Icon, { name: name, size: size || 16, className: className || '' });
  }

  function formatMoney(amount) {
    return getUI().formatUah(amount);
  }

  function formatSecondsMMSS(totalSec) {
    var safe = Math.max(0, Math.floor(Number(totalSec) || 0));
    var mins = Math.floor(safe / 60);
    var secs = safe % 60;
    return (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  function formatShortTime(isoOrNum) {
    if (!isoOrNum) return '';
    try {
      var d = new Date(isoOrNum);
      if (isNaN(d.getTime())) return String(isoOrNum);
      var hh = String(d.getHours()).padStart(2, '0');
      var mm = String(d.getMinutes()).padStart(2, '0');
      return hh + ':' + mm;
    } catch (_e) {
      return '';
    }
  }

  function normalizeTierKey(raw) {
    var val = String(raw || '').trim().toLowerCase();
    if (val.indexOf('max') !== -1) return 'max';
    if (val.indexOf('pro') !== -1) return 'pro';
    return 'strictpass';
  }

  function normalizeSeatKey(raw) {
    var val = String(raw || '').trim().toLowerCase();
    if (val === 'duo') return 'duo';
    if (val === 'family') return 'family';
    return 'single';
  }

  function normalizeCycleKey(raw) {
    var val = String(raw || '').trim().toLowerCase();
    if (val === 'monthly') return 'monthly';
    if (val === 'annual') return 'annual';
    return 'season';
  }

  function getSeatLimit(seatKey) {
    if (seatKey === 'duo') return 2;
    if (seatKey === 'family') return 5;
    return 1;
  }

  function getSeatShortLabel(seatKey) {
    if (seatKey === 'duo') return 'Duo';
    if (seatKey === 'family') return 'Family';
    return 'Single';
  }

  function getCycleLabelUk(cycleKey) {
    if (cycleKey === 'monthly') return 'Місяць (1 міс)';
    if (cycleKey === 'annual') return 'Рік (12 міс)';
    return 'Сезон НМТ (3 міс)';
  }

  function getGradeBandBadgeLabel(band) {
    var val = String(band || '').toLowerCase();
    if (val.indexOf('5-7') !== -1) return '5-7 кл.';
    if (val.indexOf('8-9') !== -1) return '8-9 кл.';
    if (val.indexOf('olymp') !== -1) return 'Олімпіада';
    return 'НМТ 200';
  }

  function copyToClipboard(text) {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(String(text || ''));
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = String(text || '');
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  function notifyToast(store, message, tone) {
    if (store && typeof store.showToast === 'function') {
      store.showToast(message, tone || 'info');
    }
  }

  function resolveSubjectLabel(subjectIdOrLabel) {
    var val = String(subjectIdOrLabel || '');
    for (var i = 0; i < SUBJECT_OPTIONS.length; i++) {
      if (SUBJECT_OPTIONS[i].id === val || SUBJECT_OPTIONS[i].label === val) {
        return SUBJECT_OPTIONS[i].label;
      }
    }
    return val || 'Математика';
  }

  function resolveSubjectId(subjectIdOrLabel) {
    var val = String(subjectIdOrLabel || '').toLowerCase();
    for (var i = 0; i < SUBJECT_OPTIONS.length; i++) {
      if (SUBJECT_OPTIONS[i].id === val || SUBJECT_OPTIONS[i].label.toLowerCase() === val) {
        return SUBJECT_OPTIONS[i].id;
      }
    }
    if (val.indexOf('укр') !== -1) return 'ukrainian';
    if (val.indexOf('іст') !== -1) return 'history';
    if (val.indexOf('біо') !== -1 || val.indexOf('фіз') !== -1) return 'bio-phys';
    if (val.indexOf('eng') !== -1 || val.indexOf('англ') !== -1) return 'english';
    return 'math';
  }

  /* ========================================================================
     TAB 4: FocusMapView (Focus Timer + Knowledge Map)
     ======================================================================== */
  function FocusMapView(props) {
    var state = (props && props.state) || {};
    var store = (props && props.store) || {};

    var _subTab = useState('timer');
    var subTab = _subTab[0];
    var setSubTab = _subTab[1];

    var _duration = useState(25);
    var duration = _duration[0];
    var setDuration = _duration[1];

    var _subjectId = useState((state.goals && state.goals.primarySubject) || 'math');
    var subjectId = _subjectId[0];
    var setSubjectId = _subjectId[1];

    var _secondsLeft = useState(25 * 60);
    var secondsLeft = _secondsLeft[0];
    var setSecondsLeft = _secondsLeft[1];

    var _isRunning = useState(false);
    var isRunning = _isRunning[0];
    var setIsRunning = _isRunning[1];

    var _bgSwitches = useState(0);
    var bgSwitches = _bgSwitches[0];
    var setBgSwitches = _bgSwitches[1];

    var _mapFilter = useState('all');
    var mapFilter = _mapFilter[0];
    var setMapFilter = _mapFilter[1];

    var switchesRef = useRef(0);
    switchesRef.current = bgSwitches;

    var subjectRef = useRef(subjectId);
    subjectRef.current = subjectId;

    var durationRef = useRef(duration);
    durationRef.current = duration;

    useEffect(function () {
      if (!isRunning) return;

      var timerId = global.setInterval(function () {
        setSecondsLeft(function (prev) {
          if (prev <= 1) {
            setIsRunning(false);
            if (typeof store.completeFocusSprint === 'function') {
              store.completeFocusSprint({
                subjectId: subjectRef.current,
                durationMinutes: durationRef.current,
                backgroundSwitches: switchesRef.current
              });
            }
            return durationRef.current * 60;
          }
          return prev - 1;
        });
      }, 1000);

      function onVisibilityChange() {
        if (typeof document !== 'undefined' && document.hidden) {
          setBgSwitches(function (c) {
            return c + 1;
          });
        }
      }

      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', onVisibilityChange);
      }

      return function () {
        global.clearInterval(timerId);
        if (typeof document !== 'undefined') {
          document.removeEventListener('visibilitychange', onVisibilityChange);
        }
      };
    }, [isRunning, store]);

    function handleSelectDuration(mins) {
      if (isRunning) return;
      setDuration(mins);
      setSecondsLeft(mins * 60);
      setBgSwitches(0);
    }

    function handleResetTimer() {
      setIsRunning(false);
      setSecondsLeft(duration * 60);
      setBgSwitches(0);
    }

    function handleInstantCompleteSprint() {
      setIsRunning(false);
      if (typeof store.completeFocusSprint === 'function') {
        store.completeFocusSprint({
          subjectId: subjectId,
          durationMinutes: duration,
          backgroundSwitches: bgSwitches
        });
      }
      setSecondsLeft(duration * 60);
      setBgSwitches(0);
    }

    var totalSeconds = duration * 60;
    var progressPct = totalSeconds > 0
      ? Math.min(100, Math.max(0, Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100)))
      : 0;

    var focusSessions = useMemo(function () {
      if (Array.isArray(state.focusSessions)) return state.focusSessions;
      var recent = (state.telemetry && Array.isArray(state.telemetry.recentSessions))
        ? state.telemetry.recentSessions
        : [];
      return recent.filter(function (s) { return s && s.type === 'focus'; });
    }, [state.focusSessions, state.telemetry]);

    var knowledgeNodes = useMemo(function () {
      var curriculumMap = (global.StrictCurriculum && Array.isArray(global.StrictCurriculum.KNOWLEDGE_MAP))
        ? global.StrictCurriculum.KNOWLEDGE_MAP
        : [];
      var telemetryNodes = (state.telemetry && Array.isArray(state.telemetry.masteryNodes))
        ? state.telemetry.masteryNodes
        : [];
      var stateMap = Array.isArray(state.knowledgeMap) ? state.knowledgeMap : [];

      var baseList = curriculumMap.length ? curriculumMap : (stateMap.length ? stateMap : telemetryNodes);

      var telemetryById = {};
      for (var t = 0; t < telemetryNodes.length; t++) {
        if (telemetryNodes[t] && telemetryNodes[t].id) {
          telemetryById[telemetryNodes[t].id] = telemetryNodes[t];
        }
      }

      var masteryById = {};
      var titleById = {};
      var enriched = baseList.map(function (item) {
        var override = telemetryById[item.id] || null;
        var mastery = override && override.mastery !== undefined
          ? Number(override.mastery)
          : Number(item.mastery !== undefined ? item.mastery : (item.defaultMastery || 50));
        masteryById[item.id] = mastery;
        titleById[item.id] = item.title || item.topic || 'Тема';
        return Object.assign({}, item, { mastery: mastery });
      });

      return enriched.map(function (node) {
        var prereqIds = Array.isArray(node.prereqIds) ? node.prereqIds : [];
        var missingPrereqs = [];
        for (var p = 0; p < prereqIds.length; p++) {
          var pid = prereqIds[p];
          var pm = masteryById[pid];
          if (pm === undefined || pm < 65) {
            missingPrereqs.push(titleById[pid] || pid);
          }
        }
        var isLocked = node.locked === true || node.unlocked === false || missingPrereqs.length > 0;
        return Object.assign({}, node, {
          isLocked: isLocked,
          prereqText: node.prereqTitle || missingPrereqs.join(', ')
        });
      });
    }, [state.knowledgeMap, state.telemetry]);

    var filteredNodes = useMemo(function () {
      if (mapFilter === 'all') return knowledgeNodes;
      return knowledgeNodes.filter(function (node) {
        return resolveSubjectId(node.subjectId || node.subject || '') === mapFilter;
      });
    }, [knowledgeNodes, mapFilter]);

    return h('div', { className: 'sa-stack' },
      h('div', { className: 'sa-segmented', style: { width: '100%' } },
        h('button', {
          type: 'button',
          className: subTab === 'timer' ? 'is-active' : '',
          style: { flex: 1 },
          onClick: function () { setSubTab('timer'); }
        }, uiIcon('timer', 15), 'Фокус-таймер'),
        h('button', {
          type: 'button',
          className: subTab === 'map' ? 'is-active' : '',
          style: { flex: 1 },
          onClick: function () { setSubTab('map'); }
        }, uiIcon('layers', 15), 'Карта знань')
      ),

      subTab === 'timer'
        ? h('div', { className: 'sa-stack' },
            h('div', { className: 'sa-card sa-card-pad sa-stack' },
              h('div', { className: 'sa-row-between' },
                h('span', { className: 'sa-label' }, 'ТРИВАЛІСТЬ СПРИНТУ'),
                h('span', {
                  className: bgSwitches > 0 ? 'sa-badge sa-badge-warn' : 'sa-badge sa-badge-ok'
                },
                  uiIcon(bgSwitches > 0 ? 'alertTriangle' : 'shieldCheck', 13),
                  'Перемикань фону: ' + bgSwitches
                )
              ),
              h('div', { className: 'sa-chip-scroll' },
                [25, 45, 60].map(function (mins) {
                  return h('button', {
                    key: String(mins),
                    type: 'button',
                    disabled: isRunning,
                    className: 'sa-chip' + (duration === mins ? ' is-active' : ''),
                    onClick: function () { handleSelectDuration(mins); }
                  }, mins + ' хв');
                })
              ),
              h('div', { className: 'sa-stack-sm' },
                h('span', { className: 'sa-label' }, 'ПРЕДМЕТ'),
                h('div', { className: 'sa-chip-scroll' },
                  SUBJECT_OPTIONS.map(function (subj) {
                    return h('button', {
                      key: subj.id,
                      type: 'button',
                      className: 'sa-chip' + (subjectId === subj.id ? ' is-active' : ''),
                      onClick: function () { setSubjectId(subj.id); }
                    }, subj.label);
                  })
                )
              ),
              h('div', { className: 'sa-divider' }),
              h('div', {
                className: 'sa-stack-sm',
                style: { alignItems: 'center', padding: '10px 0' }
              },
                h('span', { className: 'sa-label' },
                  isRunning ? 'АКТИВНИЙ ФОКУС-РЕЖИМ' : 'ГОТОВИЙ ДО СТАРТУ'
                ),
                h('div', { className: 'sa-kpi-lg', style: { fontSize: '44px' } },
                  formatSecondsMMSS(secondsLeft)
                ),
                h('span', { className: 'sa-muted' },
                  resolveSubjectLabel(subjectId) + ' · Прогрес ' + progressPct + '%'
                )
              ),
              h('div', { className: 'sa-progress-track' },
                h('div', {
                  className: 'sa-progress-fill' + (bgSwitches > 0 ? ' is-warn' : ' is-ok'),
                  style: { width: progressPct + '%' }
                })
              ),
              h('div', { className: 'sa-grid-2' },
                h('button', {
                  type: 'button',
                  className: 'sa-btn sa-btn-primary',
                  onClick: function () { setIsRunning(function (r) { return !r; }); }
                },
                  uiIcon(isRunning ? 'pause' : 'play', 16),
                  isRunning ? 'Пауза' : 'Старт'
                ),
                h('button', {
                  type: 'button',
                  className: 'sa-btn sa-btn-secondary',
                  onClick: handleResetTimer
                },
                  uiIcon('refresh', 16),
                  'Скинути'
                )
              ),
              h('button', {
                type: 'button',
                className: 'sa-btn sa-btn-secondary',
                style: { width: '100%' },
                onClick: handleInstantCompleteSprint
              },
                uiIcon('checkCircle', 16),
                'Завершити спринт (тест авто-квесту)'
              )
            ),

            h('div', { className: 'sa-card sa-card-pad sa-stack-sm' },
              h('div', { className: 'sa-row-between' },
                h('h3', { className: 'sa-card-title' }, 'Верифіковані фокус-сесії'),
                h('span', { className: 'sa-badge' }, String(focusSessions.length))
              ),
              focusSessions.length === 0
                ? h('p', { className: 'sa-muted' },
                    'Ще немає завершених фокус-сесій. Запустіть таймер або завершіть тестовий спринт.'
                  )
                : h('div', { className: 'sa-stack-sm' },
                    focusSessions.slice(0, 6).map(function (sess, idx) {
                      var mins = sess.durationMinutes || (sess.durationSec ? Math.round(sess.durationSec / 60) : 25);
                      var subj = resolveSubjectLabel(sess.subject || sess.subjectId || 'math');
                      var isClean = sess.clean !== false;
                      var ts = sess.createdAt || sess.completedAt;
                      return h('div', {
                        key: sess.id || ('fs_' + idx),
                        className: 'sa-card sa-card-subtle sa-card-pad sa-row-between'
                      },
                        h('div', { className: 'sa-stack-sm', style: { gap: '2px' } },
                          h('span', { className: 'sa-card-title' }, sess.title || (subj + ' · ' + mins + ' хв')),
                          h('span', { className: 'sa-muted' },
                            subj + (ts ? ' · ' + formatShortTime(ts) : '')
                          )
                        ),
                        h('span', {
                          className: isClean ? 'sa-badge sa-badge-ok' : 'sa-badge sa-badge-warn'
                        }, isClean ? 'Верифіковано' : 'З порушенням')
                      );
                    })
                  )
            )
          )
        : h('div', { className: 'sa-stack' },
            h('div', { className: 'sa-chip-scroll' },
              [{ id: 'all', label: 'Усі' }].concat(SUBJECT_OPTIONS).map(function (f) {
                return h('button', {
                  key: f.id,
                  type: 'button',
                  className: 'sa-chip' + (mapFilter === f.id ? ' is-active' : ''),
                  onClick: function () { setMapFilter(f.id); }
                }, f.label);
              })
            ),
            filteredNodes.length === 0
              ? h('div', { className: 'sa-card sa-card-pad' },
                  h('p', { className: 'sa-muted' }, 'Для вибраного предмета ще немає вузлів карти знань.')
                )
              : h('div', { className: 'sa-stack-sm' },
                  filteredNodes.map(function (node, idx) {
                    var mastery = Math.min(100, Math.max(0, Number(node.mastery || 0)));
                    var fillClass = mastery >= 75 ? 'is-ok' : (mastery >= 45 ? 'is-warn' : 'is-danger');
                    var gradeLabel = getGradeBandBadgeLabel(node.gradeBand);
                    var weightVal = node.weightNmt || node.nmtWeight || 15;
                    var subjId = resolveSubjectId(node.subjectId || node.subject || '');
                    var subjLabel = resolveSubjectLabel(subjId);

                    return h('div', {
                      key: node.id || ('km_' + idx),
                      className: 'sa-card sa-card-pad sa-stack-sm'
                    },
                      h('div', { className: 'sa-row-between' },
                        h('span', { className: 'sa-label' }, subjLabel),
                        h('div', { className: 'sa-row', style: { gap: '4px' } },
                          h('span', { className: 'sa-badge' }, gradeLabel),
                          h('span', { className: 'sa-badge' }, 'Вага НМТ: ' + weightVal + '%')
                        )
                      ),
                      h('div', { className: 'sa-row-between' },
                        h('h4', { className: 'sa-card-title' }, node.title || node.topic || 'Тема'),
                        h('span', { className: 'sa-mono', style: { fontSize: '12px', fontWeight: 600 } }, mastery + '%')
                      ),
                      node.summary ? h('p', { className: 'sa-muted' }, node.summary) : null,
                      h('div', { className: 'sa-progress-track' },
                        h('div', {
                          className: 'sa-progress-fill ' + fillClass,
                          style: { width: mastery + '%' }
                        })
                      ),
                      h('div', { className: 'sa-row-between' },
                        node.isLocked
                          ? h('span', { className: 'sa-badge sa-badge-warn' },
                              uiIcon('lock', 12),
                              'Потрібно: ' + (node.prereqText || 'попередня тема')
                            )
                          : h('span', { className: 'sa-badge sa-badge-ok' },
                              uiIcon('unlock', 12),
                              'Відкрито'
                            )
                      ),
                      h('div', { className: 'sa-grid-2' },
                        h('button', {
                          type: 'button',
                          className: 'sa-btn sa-btn-primary sa-btn-sm',
                          onClick: function () {
                            if (typeof store.openTutorWithTopic === 'function') {
                              store.openTutorWithTopic({
                                mode: 'subject',
                                subjectId: subjId,
                                gradeBand: node.gradeBand || 'nmt-200',
                                topicTitle: node.title || node.topic
                              });
                            }
                          }
                        },
                          uiIcon('messageSquare', 14),
                          'Тренувати в Репетиторі'
                        ),
                        h('button', {
                          type: 'button',
                          className: 'sa-btn sa-btn-secondary sa-btn-sm',
                          onClick: function () {
                            if (typeof store.setActiveTab === 'function') {
                              store.setActiveTab('exams');
                            }
                          }
                        },
                          uiIcon('radar', 14),
                          'Перевірити в тесті'
                        )
                      )
                    );
                  })
                )
          )
    );
  }

  /* ========================================================================
     TAB 5: PassControlView (StrictPass 3D Wallet & Parent Control Cabinet)
     ======================================================================== */
  function PassControlView(props) {
    var state = (props && props.state) || {};
    var store = (props && props.store) || {};
    var UI = getUI();

    var controlTab = state.controlSubTab === 'parent' ? 'parent' : 'wallet';
    var planSel = state.planSelection || {};
    var seats = normalizeSeatKey(planSel.seats || 'single');
    var cycle = normalizeCycleKey(planSel.cycle || 'season');
    var tier = normalizeTierKey(planSel.tier || 'strictpass');

    var _activating = useState(false);
    var activating = _activating[0];
    var setActivating = _activating[1];

    var _sponsorSheet = useState(null);
    var sponsorSheet = _sponsorSheet[0];
    var setSponsorSheet = _sponsorSheet[1];

    var cardRef = useRef(null);

    var sku = useMemo(function () {
      if (global.StrictPassCatalog && typeof global.StrictPassCatalog.getSKU === 'function') {
        return global.StrictPassCatalog.getSKU(seats, cycle, tier);
      }
      return {
        skuId: tier + '-' + seats + '-' + cycle,
        seats: seats,
        seatLabel: getSeatShortLabel(seats),
        seatCount: getSeatLimit(seats),
        cycle: cycle,
        cycleLabel: cycle,
        months: cycle === 'annual' ? 12 : (cycle === 'season' ? 3 : 1),
        tier: tier,
        tierName: tier === 'max' ? 'StrictPass MAX' : (tier === 'pro' ? 'StrictPass Pro' : 'StrictPass'),
        priceUah: 1699,
        monthlyEquivalentUah: 566,
        perStudentMonthlyUah: 566,
        savingsUah: 0,
        savingsPercent: 0,
        image: 'assets/strictpass/StrictPass_Single_Season.webp',
        imageFilename: 'StrictPass_Single_Season.webp'
      };
    }, [seats, cycle, tier]);

    useEffect(function () {
      if (controlTab !== 'wallet' || !cardRef.current) return;
      if (!global.StrictPassCatalog || typeof global.StrictPassCatalog.attach3DTilt !== 'function') return;
      var detach = global.StrictPassCatalog.attach3DTilt(cardRef.current, {
        maxRotateX: 14,
        maxRotateY: 16,
        scale: 1.02
      });
      return function () {
        if (typeof detach === 'function') detach();
      };
    }, [controlTab, sku && sku.skuId]);

    /* ---- Parent Control State ---- */
    var _pinInput = useState('');
    var pinInput = _pinInput[0];
    var setPinInput = _pinInput[1];

    var _pinVisible = useState(false);
    var pinVisible = _pinVisible[0];
    var setPinVisible = _pinVisible[1];

    var _pinError = useState('');
    var pinError = _pinError[0];
    var setPinError = _pinError[1];

    var _pinBusy = useState(false);
    var pinBusy = _pinBusy[0];
    var setPinBusy = _pinBusy[1];

    var _showAddChild = useState(false);
    var showAddChild = _showAddChild[0];
    var setShowAddChild = _showAddChild[1];

    var _newChildName = useState('');
    var newChildName = _newChildName[0];
    var setNewChildName = _newChildName[1];

    var _newChildCode = useState('');
    var newChildCode = _newChildCode[0];
    var setNewChildCode = _newChildCode[1];

    var _newChildGrade = useState('11 клас');
    var newChildGrade = _newChildGrade[0];
    var setNewChildGrade = _newChildGrade[1];

    var _showChangePin = useState(false);
    var showChangePin = _showChangePin[0];
    var setShowChangePin = _showChangePin[1];

    var _oldPinVal = useState('');
    var oldPinVal = _oldPinVal[0];
    var setOldPinVal = _oldPinVal[1];

    var _changePinVal = useState('');
    var changePinVal = _changePinVal[0];
    var setChangePinVal = _changePinVal[1];

    var _changePinErr = useState('');
    var changePinErr = _changePinErr[0];
    var setChangePinErr = _changePinErr[1];

    var _lectureSubTab = useState('assign');
    var lectureSubTab = _lectureSubTab[0];
    var setLectureSubTab = _lectureSubTab[1];

    var _customTopic = useState('');
    var customTopic = _customTopic[0];
    var setCustomTopic = _customTopic[1];

    var _customSubject = useState('math');
    var customSubject = _customSubject[0];
    var setCustomSubject = _customSubject[1];

    var _customNote = useState('');
    var customNote = _customNote[0];
    var setCustomNote = _customNote[1];

    var contractData = state.contract || {};
    var _rewardDraft = useState(contractData.rewardText || '');
    var rewardDraft = _rewardDraft[0];
    var setRewardDraft = _rewardDraft[1];

    useEffect(function () {
      setRewardDraft(contractData.rewardText || '');
    }, [contractData.rewardText]);

    function handleSelectPlan(patch) {
      if (typeof store.selectPlanSku === 'function') {
        store.selectPlanSku(patch);
      }
    }

    function handleActivatePass() {
      if (typeof store.activateSelectedPass !== 'function') return;
      setActivating(true);
      Promise.resolve(store.activateSelectedPass()).finally(function () {
        setActivating(false);
      });
    }

    function handleOpenSponsorShare() {
      if (typeof store.generateParentInvoiceLink !== 'function') return;
      Promise.resolve(store.generateParentInvoiceLink()).then(function (res) {
        var url = (res && res.url) || '';
        if (!url && typeof global.location !== 'undefined') {
          url = global.location.origin + global.location.pathname + '?sponsor=' + encodeURIComponent(sku.skuId);
        }
        var studentName = (state.auth && state.auth.user && state.auth.user.displayName) || 'Учень StrictAI';
        var msg = studentName + ' просить активувати ' + sku.tierName + ' (' +
          getSeatShortLabel(seats) + ', ' + getCycleLabelUk(cycle) + ') — ' +
          formatMoney(sku.priceUah) + '. Посилання для оплати: ' + url;
        setSponsorSheet({ url: url, message: msg });
      }).catch(function () {
        notifyToast(store, 'Не вдалося сформувати посилання для батьків', 'danger');
      });
    }

    var activePass = state.auth && state.auth.activePass ? state.auth.activePass : null;
    var isSelectedActive = Boolean(
      activePass &&
      activePass.status === 'active' &&
      normalizeTierKey(activePass.tier) === tier &&
      normalizeSeatKey(activePass.seatType || activePass.seats) === seats &&
      normalizeCycleKey(activePass.cycle) === cycle
    );

    var familyObj = (state.auth && state.auth.family) || null;
    var memberCount = familyObj && Array.isArray(familyObj.memberUids) && familyObj.memberUids.length
      ? familyObj.memberUids.length
      : (Array.isArray(state.children) && state.children.length ? state.children.length : 1);
    var seatLimit = getSeatLimit(seats);
    var seatUsageText = Math.min(memberCount, seatLimit) + '/' + seatLimit + ' ' + getSeatShortLabel(seats);

    /* ---- Parent Auth & Children ---- */
    var parentAuth = state.parentAuth || {};
    var isParentUnlocked = Boolean(parentAuth.unlocked);
    var hasFamilyPin = Boolean(parentAuth.hasPin || (familyObj && familyObj.hasPin));
    var familyInviteCode = (familyObj && familyObj.inviteCode) ||
      (state.auth && state.auth.user && state.auth.user.inviteCode) ||
      'SA-DEMO11';

    var childrenList = Array.isArray(state.children) && state.children.length
      ? state.children
      : [
          {
            id: 'child_oleksandr',
            name: 'Олександр',
            gradeLabel: '11 клас',
            trustScore: 98,
            focusMinutesToday: 0,
            weakTopics: ['Логарифмічні нерівності та ОДЗ']
          }
        ];

    var activeChildId = state.selectedChildId || childrenList[0].id;
    var activeChild = childrenList[0];
    for (var cIdx = 0; cIdx < childrenList.length; cIdx++) {
      if (childrenList[cIdx].id === activeChildId) {
        activeChild = childrenList[cIdx];
        break;
      }
    }

    var isPrimaryChild = activeChild.id === childrenList[0].id;
    var trustScore = Number(
      activeChild.trustScore !== undefined
        ? activeChild.trustScore
        : (state.telemetry && state.telemetry.trustScore !== undefined ? state.telemetry.trustScore : 98)
    );
    var minutesToday = Number(
      activeChild.focusMinutesToday !== undefined
        ? activeChild.focusMinutesToday
        : (state.telemetry && state.telemetry.focusMinutesToday !== undefined ? state.telemetry.focusMinutesToday : 0)
    );
    var acState = state.antiCheat || {};
    var tabBlurs = isPrimaryChild
      ? Number(acState.blurCount || activeChild.tabBlurCount || 0)
      : Number(activeChild.tabBlurCount || 0);
    var microChecks = activeChild.microChecksPassed ||
      (isPrimaryChild && acState.microChecksTotal
        ? (Number(acState.microChecksPassed || 0) + '/' + Number(acState.microChecksTotal))
        : '4/4');

    var weakTopics = Array.isArray(activeChild.weakTopics) ? activeChild.weakTopics : [];
    var assignedLectures = Array.isArray(state.assignedLectures) ? state.assignedLectures : [];

    function handleSubmitPin(e) {
      if (e && e.preventDefault) e.preventDefault();
      var cleaned = String(pinInput || '').trim();
      if (!/^\d{4,8}$/.test(cleaned)) {
        setPinError('PIN має містити від 4 до 8 цифр.');
        return;
      }
      if (typeof store.createOrVerifyParentPin !== 'function') return;
      setPinError('');
      setPinBusy(true);
      var mode = hasFamilyPin ? 'verify' : 'create';
      Promise.resolve(store.createOrVerifyParentPin({ mode: mode, pin: cleaned }))
        .then(function (res) {
          if (res && res.ok === false) {
            setPinError(res.error || 'Невірний батьківський PIN.');
          } else {
            setPinInput('');
          }
        })
        .finally(function () {
          setPinBusy(false);
        });
    }

    function handleChangePinSubmit(e) {
      if (e && e.preventDefault) e.preventDefault();
      var oldCleaned = String(oldPinVal || '').trim();
      var newCleaned = String(changePinVal || '').trim();
      if (!/^\d{4,8}$/.test(oldCleaned) || !/^\d{4,8}$/.test(newCleaned)) {
        setChangePinErr('Обидва PIN-коди мають містити від 4 до 8 цифр.');
        return;
      }
      if (typeof store.createOrVerifyParentPin !== 'function') return;
      setChangePinErr('');
      Promise.resolve(
        store.createOrVerifyParentPin({ mode: 'change', oldPin: oldCleaned, pin: newCleaned })
      ).then(function (res) {
        if (res && res.ok === false) {
          setChangePinErr(res.error || 'Не вдалося оновити PIN.');
        } else {
          setOldPinVal('');
          setChangePinVal('');
          setShowChangePin(false);
        }
      });
    }

    function handleAssignWeakTopic(wt) {
      if (typeof store.assignLecture !== 'function') return;
      var title = typeof wt === 'string' ? wt : (wt.title || wt.topic || 'Тема');
      var subj = typeof wt === 'string' ? resolveSubjectId(title) : resolveSubjectId(wt.subjectId || wt.subject || title);
      store.assignLecture({
        childId: activeChild.id,
        title: title,
        subjectId: subj,
        topic: title,
        notes: 'Призначено з аналізу слабких тем'
      });
    }

    function handleAssignCustomLecture(e) {
      if (e && e.preventDefault) e.preventDefault();
      var topicTrim = String(customTopic || '').trim();
      if (!topicTrim) {
        notifyToast(store, 'Введіть тему лекції для призначення.', 'warn');
        return;
      }
      if (typeof store.assignLecture === 'function') {
        store.assignLecture({
          childId: activeChild.id,
          title: topicTrim,
          subjectId: customSubject,
          topic: topicTrim,
          notes: String(customNote || '').trim()
        });
      }
      setCustomTopic('');
      setCustomNote('');
      setLectureSubTab('history');
    }

    function handleAddChildSubmit(e) {
      if (e && e.preventDefault) e.preventDefault();
      if (typeof store.addChildByCode !== 'function') return;
      var res = store.addChildByCode(newChildName, newChildCode || familyInviteCode, newChildGrade);
      if (res && res.ok) {
        setNewChildName('');
        setNewChildCode('');
        setShowAddChild(false);
      }
    }

    var ukFeatures = TIER_FEATURES_UK[tier] || [];

    return h('div', { className: 'sa-stack' },
      h('div', { className: 'sa-segmented', style: { width: '100%' } },
        h('button', {
          type: 'button',
          className: controlTab === 'wallet' ? 'is-active' : '',
          style: { flex: 1 },
          onClick: function () {
            if (typeof store.setControlSubTab === 'function') store.setControlSubTab('wallet');
          }
        }, uiIcon('creditCard', 15), 'Гаманець StrictPass'),
        h('button', {
          type: 'button',
          className: controlTab === 'parent' ? 'is-active' : '',
          style: { flex: 1 },
          onClick: function () {
            if (typeof store.setControlSubTab === 'function') store.setControlSubTab('parent');
          }
        }, uiIcon('shieldCheck', 15), 'Батьківський кабінет')
      ),

      controlTab === 'wallet'
        ? h('div', { className: 'sa-stack' },
            /* 3D Interactive Metallic Card Pedestal */
            h('div', { className: 'sa-wallet-stage' },
              h('div', { className: 'sa-row-between', style: { width: '100%' } },
                h('span', {
                  className: isSelectedActive ? 'sa-badge sa-badge-ok' : 'sa-badge'
                },
                  uiIcon(isSelectedActive ? 'shieldCheck' : 'creditCard', 12),
                  isSelectedActive ? 'Активний' : 'Обраний план'
                ),
                h('span', { className: 'sa-badge' },
                  uiIcon('users', 12),
                  seatUsageText
                )
              ),
              h('div', { className: 'sa-pass-3d-stage' },
                h('div', {
                  ref: cardRef,
                  className: 'sa-pass-3d-card sa-pass-card-wrap'
                },
                  h('img', {
                    src: './' + sku.image,
                    alt: sku.tierName,
                    draggable: false
                  }),
                  h('div', { className: 'sa-pass-glare' })
                )
              ),
              h('span', { className: 'sa-muted' },
                'Нахиліть картку пальцем або курсором для перевірки голограми'
              )
            ),

            activePass && activePass.status === 'active' && !isSelectedActive
              ? h('div', { className: 'sa-banner is-ok' },
                  uiIcon('checkCircle', 16),
                  h('div', { className: 'sa-stack-sm', style: { gap: '2px' } },
                    h('strong', { style: { fontSize: '12.5px' } },
                      'Поточний активний план: ' + (activePass.tier || 'StrictPass')
                    ),
                    h('span', { className: 'sa-muted' },
                      getSeatShortLabel(normalizeSeatKey(activePass.seatType || activePass.seats)) +
                      ' · ' + getCycleLabelUk(normalizeCycleKey(activePass.cycle))
                    )
                  )
                )
              : null,

            /* 27-SKU Switcher */
            h('div', { className: 'sa-card sa-card-pad sa-stack' },
              h('div', { className: 'sa-stack-sm' },
                h('span', { className: 'sa-label' }, '1. КІЛЬКІСТЬ МІСЦЬ'),
                h('div', { className: 'sa-segmented', style: { width: '100%' } },
                  SEAT_OPTIONS.map(function (opt) {
                    return h('button', {
                      key: opt.id,
                      type: 'button',
                      className: seats === opt.id ? 'is-active' : '',
                      style: { flex: 1 },
                      onClick: function () { handleSelectPlan({ seats: opt.id }); }
                    }, opt.label);
                  })
                )
              ),

              h('div', { className: 'sa-stack-sm' },
                h('span', { className: 'sa-label' }, '2. ПЕРІОД ДОСТУПУ'),
                h('div', { className: 'sa-segmented', style: { width: '100%' } },
                  CYCLE_OPTIONS.map(function (opt) {
                    return h('button', {
                      key: opt.id,
                      type: 'button',
                      className: cycle === opt.id ? 'is-active' : '',
                      style: { flex: 1 },
                      onClick: function () { handleSelectPlan({ cycle: opt.id }); }
                    }, opt.label);
                  })
                )
              ),

              h('div', { className: 'sa-stack-sm' },
                h('span', { className: 'sa-label' }, '3. РІВЕНЬ ДОСТУПУ'),
                h('div', { className: 'sa-segmented', style: { width: '100%' } },
                  TIER_OPTIONS.map(function (opt) {
                    return h('button', {
                      key: opt.id,
                      type: 'button',
                      className: tier === opt.id ? 'is-active' : '',
                      style: { flex: 1 },
                      onClick: function () { handleSelectPlan({ tier: opt.id }); }
                    }, opt.label);
                  })
                )
              ),

              h('div', { className: 'sa-divider' }),

              h('div', { className: 'sa-row-between' },
                h('div', { className: 'sa-stack-sm', style: { gap: '2px' } },
                  h('span', { className: 'sa-label' }, sku.tierName + ' · ' + seatUsageText),
                  h('div', { className: 'sa-kpi-lg' }, formatMoney(sku.priceUah)),
                  h('span', { className: 'sa-muted' },
                    formatMoney(sku.monthlyEquivalentUah) + ' / міс' +
                    (seatLimit > 1 ? ' · ' + formatMoney(Math.round(sku.monthlyEquivalentUah / seatLimit)) + ' / учень' : '')
                  )
                ),
                sku.savingsPercent > 0
                  ? h('span', { className: 'sa-badge sa-badge-ok' },
                      'Економія ' + sku.savingsPercent + '%'
                    )
                  : h('span', { className: 'sa-badge' }, 'Базовий місяць')
              ),

              h('div', { className: 'sa-stack-sm' },
                ukFeatures.map(function (feat, fIdx) {
                  return h('div', { key: 'feat_' + fIdx, className: 'sa-row', style: { alignItems: 'flex-start' } },
                    h('span', { style: { color: 'var(--status-ok)', marginTop: '2px' } },
                      uiIcon('check', 14)
                    ),
                    h('span', { className: 'sa-muted', style: { color: 'var(--ink-primary)' } }, feat)
                  );
                })
              ),

              h('div', { className: 'sa-stack-sm' },
                h('button', {
                  type: 'button',
                  className: 'sa-btn sa-btn-primary',
                  disabled: activating,
                  style: { width: '100%' },
                  onClick: handleActivatePass
                },
                  uiIcon('shieldCheck', 16),
                  activating
                    ? 'Активація...'
                    : (isSelectedActive ? 'Оновити активний StrictPass' : 'Активувати StrictPass')
                ),
                h('button', {
                  type: 'button',
                  className: 'sa-btn sa-btn-secondary',
                  style: { width: '100%' },
                  onClick: handleOpenSponsorShare
                },
                  uiIcon('share', 16),
                  'Надіслати рахунок батькам'
                )
              )
            )
          )
        : !isParentUnlocked
          ? h('div', { className: 'sa-card sa-card-pad sa-stack' },
              h('div', { className: 'sa-row' },
                h('div', { className: 'sa-brand-mark' }, uiIcon('lock', 16)),
                h('div', { className: 'sa-stack-sm', style: { gap: '2px' } },
                  h('h3', { className: 'sa-card-title' },
                    hasFamilyPin ? 'Підтвердіть батьківський PIN' : 'Створити батьківський PIN (4–8 цифр)'
                  ),
                  h('span', { className: 'sa-muted' },
                    hasFamilyPin
                      ? 'Перевірка здійснюється через salted SHA-256 хеш у Firebase / Local Vault.'
                      : 'PIN захищає налаштування контракту, телеметрію та призначення тем. Зберігається лише SHA-256 хеш.'
                  )
                )
              ),
              h('form', { className: 'sa-stack-sm', onSubmit: handleSubmitPin },
                h('div', { className: 'sa-row' },
                  h('input', {
                    type: pinVisible ? 'text' : 'password',
                    inputMode: 'numeric',
                    maxLength: 8,
                    placeholder: 'Введіть 4–8 цифр PIN',
                    className: 'sa-input sa-mono' + (pinError || parentAuth.lastError ? ' is-invalid' : ''),
                    value: pinInput,
                    onChange: function (e) {
                      setPinInput(String(e.target.value || '').replace(/\D/g, '').slice(0, 8));
                      if (pinError) setPinError('');
                    }
                  }),
                  h('button', {
                    type: 'button',
                    className: 'sa-icon-btn',
                    'aria-label': pinVisible ? 'Приховати PIN' : 'Показати PIN',
                    onClick: function () { setPinVisible(function (v) { return !v; }); }
                  }, uiIcon(pinVisible ? 'eyeOff' : 'eye', 16))
                ),
                (pinError || parentAuth.lastError)
                  ? h('div', { className: 'sa-banner is-danger' },
                      uiIcon('alertCircle', 15),
                      h('span', { style: { fontSize: '12px' } }, pinError || parentAuth.lastError)
                    )
                  : null,
                h('button', {
                  type: 'submit',
                  className: 'sa-btn sa-btn-primary',
                  disabled: pinBusy,
                  style: { width: '100%' }
                },
                  uiIcon(hasFamilyPin ? 'unlock' : 'key', 16),
                  pinBusy
                    ? 'Перевірка...'
                    : (hasFamilyPin ? 'Розблокувати кабінет' : 'Зберегти PIN і відкрити кабінет')
                )
              )
            )
          : h('div', { className: 'sa-stack' },
              /* Top Governance Bar */
              h('div', { className: 'sa-card sa-card-pad sa-stack-sm' },
                h('div', { className: 'sa-row-between' },
                  h('div', { className: 'sa-row' },
                    h('span', { className: 'sa-badge sa-badge-ink' },
                      uiIcon('users', 12),
                      'Сімейний код: ' + familyInviteCode
                    ),
                    h('button', {
                      type: 'button',
                      className: 'sa-icon-btn',
                      style: { width: '28px', height: '28px' },
                      'aria-label': 'Копіювати сімейний код',
                      onClick: function () {
                        copyToClipboard(familyInviteCode).then(function () {
                          notifyToast(store, 'Код ' + familyInviteCode + ' скопійовано.', 'success');
                        });
                      }
                    }, uiIcon('copy', 13))
                  ),
                  h('button', {
                    type: 'button',
                    className: 'sa-btn sa-btn-ghost sa-btn-sm',
                    onClick: function () {
                      if (typeof store.lockParentPanel === 'function') store.lockParentPanel();
                    }
                  }, uiIcon('lock', 14), 'Заблокувати')
                ),
                h('div', { className: 'sa-grid-2' },
                  h('button', {
                    type: 'button',
                    className: 'sa-btn sa-btn-secondary sa-btn-sm',
                    onClick: function () { setShowAddChild(true); }
                  }, uiIcon('plus', 14), 'Додати дитину'),
                  h('button', {
                    type: 'button',
                    className: 'sa-btn sa-btn-secondary sa-btn-sm',
                    onClick: function () { setShowChangePin(true); }
                  }, uiIcon('key', 14), 'Змінити PIN')
                )
              ),

              /* Child Profile Switcher */
              h('div', { className: 'sa-chip-scroll' },
                childrenList.map(function (ch) {
                  var isCurrent = ch.id === activeChild.id;
                  var gLabel = ch.gradeLabel || ch.grade || '';
                  return h('button', {
                    key: ch.id,
                    type: 'button',
                    className: 'sa-chip' + (isCurrent ? ' is-active' : ''),
                    onClick: function () {
                      if (typeof store.selectChild === 'function') store.selectChild(ch.id);
                    }
                  },
                    uiIcon('user', 13),
                    ch.name + (gLabel ? ' · ' + gLabel : '')
                  );
                })
              ),

              /* Live Anti-Cheat & Biometrics Telemetry Grid */
              h('div', { className: 'sa-card sa-card-pad sa-stack-sm' },
                h('div', { className: 'sa-row-between' },
                  h('span', { className: 'sa-label' }, 'ТЕЛЕМЕТРІЯ ЧЕСНОСТІ · ' + activeChild.name.toUpperCase()),
                  h('span', { className: 'sa-badge sa-badge-ok' }, uiIcon('activity', 12), 'Наживо')
                ),
                h('div', { className: 'sa-grid-2' },
                  h('div', { className: 'sa-card sa-card-subtle sa-card-pad sa-stack-sm', style: { gap: '4px' } },
                    h('span', { className: 'sa-label' }, 'TRUST SCORE'),
                    h('div', { className: 'sa-kpi-md' }, trustScore + '%'),
                    h('span', { className: 'sa-muted' }, trustScore >= 85 ? 'Висока довіра' : 'Потрібна увага')
                  ),
                  h('div', { className: 'sa-card sa-card-subtle sa-card-pad sa-stack-sm', style: { gap: '4px' } },
                    h('span', { className: 'sa-label' }, 'TAB BLUR'),
                    h('div', { className: 'sa-kpi-md' }, String(tabBlurs)),
                    h('span', { className: 'sa-muted' }, 'Виходів з вкладки')
                  ),
                  h('div', { className: 'sa-card sa-card-subtle sa-card-pad sa-stack-sm', style: { gap: '4px' } },
                    h('span', { className: 'sa-label' }, '20S MICRO-CHECKS'),
                    h('div', { className: 'sa-kpi-md' }, String(microChecks)),
                    h('span', { className: 'sa-muted' }, 'Перевірки уваги')
                  ),
                  h('div', { className: 'sa-card sa-card-subtle sa-card-pad sa-stack-sm', style: { gap: '4px' } },
                    h('span', { className: 'sa-label' }, 'ХВИЛИН СЬОГОДНІ'),
                    h('div', { className: 'sa-kpi-md' }, minutesToday + ' хв'),
                    h('span', { className: 'sa-muted' }, 'Верифікований час')
                  )
                )
              ),

              /* Weak Topics & Assigned Lectures Card */
              h('div', { className: 'sa-card sa-card-pad sa-stack' },
                h('div', { className: 'sa-row-between' },
                  h('h3', { className: 'sa-card-title' }, 'Слабкі теми & Призначені лекції'),
                  h('span', { className: 'sa-badge' }, String(assignedLectures.length))
                ),
                h('div', { className: 'sa-segmented', style: { width: '100%' } },
                  h('button', {
                    type: 'button',
                    className: lectureSubTab === 'assign' ? 'is-active' : '',
                    style: { flex: 1 },
                    onClick: function () { setLectureSubTab('assign'); }
                  }, 'Призначити тему'),
                  h('button', {
                    type: 'button',
                    className: lectureSubTab === 'history' ? 'is-active' : '',
                    style: { flex: 1 },
                    onClick: function () { setLectureSubTab('history'); }
                  }, 'Історія призначень')
                ),

                lectureSubTab === 'assign'
                  ? h('div', { className: 'sa-stack-sm' },
                      weakTopics.length > 0
                        ? h('div', { className: 'sa-stack-sm' },
                            h('span', { className: 'sa-label' }, 'ВИЯВЛЕНІ ПРОГАЛИНИ'),
                            weakTopics.map(function (wt, wIdx) {
                              var tTitle = typeof wt === 'string' ? wt : (wt.title || wt.topic || 'Тема');
                              var tSubj = typeof wt === 'string' ? resolveSubjectLabel(resolveSubjectId(tTitle)) : (wt.subject || 'Предмет');
                              var tMastery = typeof wt === 'object' && wt.mastery !== undefined ? wt.mastery + '%' : '';
                              return h('div', {
                                key: (wt && wt.id) || ('wt_' + wIdx),
                                className: 'sa-card sa-card-subtle sa-card-pad sa-row-between'
                              },
                                h('div', { className: 'sa-stack-sm', style: { gap: '2px' } },
                                  h('span', { className: 'sa-card-title' }, tTitle),
                                  h('span', { className: 'sa-muted' },
                                    tSubj + (tMastery ? ' · Засвоєно ' + tMastery : '')
                                  )
                                ),
                                h('button', {
                                  type: 'button',
                                  className: 'sa-btn sa-btn-primary sa-btn-sm',
                                  onClick: function () { handleAssignWeakTopic(wt); }
                                }, 'Призначити розбір')
                              );
                            })
                          )
                        : null,

                      h('div', { className: 'sa-divider' }),

                      h('form', { className: 'sa-stack-sm', onSubmit: handleAssignCustomLecture },
                        h('span', { className: 'sa-label' }, 'ВЛАСНЕ ПРИЗНАЧЕННЯ ЛЕКЦІЇ'),
                        h('input', {
                          type: 'text',
                          className: 'sa-input',
                          placeholder: 'Наприклад: Логарифмічні нерівності',
                          value: customTopic,
                          onChange: function (e) { setCustomTopic(e.target.value); }
                        }),
                        h('select', {
                          className: 'sa-input',
                          value: customSubject,
                          onChange: function (e) { setCustomSubject(e.target.value); }
                        },
                          SUBJECT_OPTIONS.map(function (s) {
                            return h('option', { key: s.id, value: s.id }, s.label);
                          })
                        ),
                        h('input', {
                          type: 'text',
                          className: 'sa-input',
                          placeholder: 'Коментар для учня (необов\'язково)',
                          value: customNote,
                          onChange: function (e) { setCustomNote(e.target.value); }
                        }),
                        h('button', {
                          type: 'submit',
                          className: 'sa-btn sa-btn-secondary',
                          style: { width: '100%' }
                        }, uiIcon('plus', 15), 'Призначити лекцію')
                      )
                    )
                  : h('div', { className: 'sa-stack-sm' },
                      assignedLectures.length === 0
                        ? h('p', { className: 'sa-muted' }, 'Призначених лекцій поки що немає.')
                        : assignedLectures.map(function (lec, lIdx) {
                            var isDone = lec.status === 'completed' || lec.completed === true;
                            return h('div', {
                              key: lec.id || ('lec_' + lIdx),
                              className: 'sa-card sa-card-subtle sa-card-pad sa-stack-sm'
                            },
                              h('div', { className: 'sa-row-between' },
                                h('div', { className: 'sa-stack-sm', style: { gap: '2px' } },
                                  h('span', { className: 'sa-card-title' }, lec.title || lec.topic || 'Лекція'),
                                  h('span', { className: 'sa-muted' },
                                    resolveSubjectLabel(lec.subjectId || lec.subject || 'math')
                                  )
                                ),
                                h('div', { className: 'sa-row' },
                                  h('span', {
                                    className: isDone ? 'sa-badge sa-badge-ok' : 'sa-badge sa-badge-warn'
                                  }, isDone ? 'Виконано' : 'Очікує'),
                                  h('button', {
                                    type: 'button',
                                    className: 'sa-icon-btn',
                                    style: { width: '30px', height: '30px' },
                                    'aria-label': 'Видалити призначення',
                                    onClick: function () {
                                      if (typeof store.deleteLecture === 'function') store.deleteLecture(lec.id);
                                    }
                                  }, uiIcon('trash', 14))
                                )
                              ),
                              isDone && lec.verifiedSessionId
                                ? h('span', { className: 'sa-mono', style: { fontSize: '11px', color: 'var(--ink-muted)' } },
                                    'verifiedSessionId: ' + lec.verifiedSessionId
                                  )
                                : null
                            );
                          })
                    )
              ),

              /* Weekly Educational Contract */
              h('div', { className: 'sa-card sa-card-pad sa-stack' },
                h('div', { className: 'sa-row-between' },
                  h('h3', { className: 'sa-card-title' }, 'Тижневий освітній контракт'),
                  uiIcon('bookOpen', 16)
                ),

                h('div', { className: 'sa-row-between' },
                  h('div', { className: 'sa-stack-sm', style: { gap: '2px' } },
                    h('span', { className: 'sa-card-title' }, 'Суворий викладач'),
                    h('span', { className: 'sa-muted' }, 'Блокує зміну персони на м\'якшу в Репетиторі')
                  ),
                  h('button', {
                    type: 'button',
                    className: contractData.lockStrictPersona
                      ? 'sa-btn sa-btn-primary sa-btn-sm'
                      : 'sa-btn sa-btn-secondary sa-btn-sm',
                    onClick: function () {
                      if (typeof store.updateContract === 'function') {
                        store.updateContract({ lockStrictPersona: !contractData.lockStrictPersona });
                      }
                    }
                  },
                    uiIcon(contractData.lockStrictPersona ? 'lock' : 'unlock', 14),
                    contractData.lockStrictPersona ? 'Заблоковано' : 'Вимкнено'
                  )
                ),

                h('div', { className: 'sa-stack-sm' },
                  h('span', { className: 'sa-label' }, 'ДЕННА НОРМА (ХВИЛИН)'),
                  h('div', { className: 'sa-segmented', style: { width: '100%' } },
                    [30, 45, 60].map(function (mins) {
                      var currentMins = Number(contractData.dailyMinutesTarget || 45);
                      return h('button', {
                        key: String(mins),
                        type: 'button',
                        className: currentMins === mins ? 'is-active' : '',
                        style: { flex: 1 },
                        onClick: function () {
                          if (typeof store.updateContract === 'function') {
                            store.updateContract({ dailyMinutesTarget: mins });
                          }
                        }
                      }, mins + ' хв');
                    })
                  )
                ),

                h('div', { className: 'sa-stack-sm' },
                  h('span', { className: 'sa-label' }, 'ЧАС СПОВІЩЕННЯ ПРО ПРОПУСК УРОКУ'),
                  h('input', {
                    type: 'time',
                    className: 'sa-input sa-mono',
                    value: contractData.missedAlertTime || '17:00',
                    onChange: function (e) {
                      if (typeof store.updateContract === 'function') {
                        store.updateContract({ missedAlertTime: e.target.value || '17:00' });
                      }
                    }
                  })
                ),

                h('div', { className: 'sa-stack-sm' },
                  h('span', { className: 'sa-label' }, 'МОТИВАЦІЙНА ВИНАГОРОДА ТИЖНЯ'),
                  h('div', { className: 'sa-row' },
                    h('input', {
                      type: 'text',
                      className: 'sa-input',
                      placeholder: 'Наприклад: Поїздка або вільний вихідний',
                      value: rewardDraft,
                      onChange: function (e) { setRewardDraft(e.target.value); }
                    }),
                    h('button', {
                      type: 'button',
                      className: 'sa-btn sa-btn-secondary',
                      onClick: function () {
                        if (typeof store.updateContract === 'function') {
                          store.updateContract({ rewardText: rewardDraft });
                        }
                      }
                    }, uiIcon('check', 15), 'OK')
                  )
                )
              )
            ),

      /* ---- Sheet: Sponsor Share Invoice ---- */
      h(UI.Sheet, {
        open: Boolean(sponsorSheet),
        onClose: function () { setSponsorSheet(null); },
        title: 'Рахунок для батьків',
        subtitle: sku.tierName + ' · ' + formatMoney(sku.priceUah)
      },
        sponsorSheet
          ? h('div', { className: 'sa-stack' },
              h('div', { className: 'sa-stack-sm' },
                h('span', { className: 'sa-label' }, 'ПОСИЛАННЯ ДЛЯ ОПЛАТИ ТА АКТИВАЦІЇ'),
                h('div', { className: 'sa-row' },
                  h('input', {
                    type: 'text',
                    readOnly: true,
                    className: 'sa-input sa-mono',
                    value: sponsorSheet.url
                  }),
                  h('button', {
                    type: 'button',
                    className: 'sa-btn sa-btn-primary',
                    onClick: function () {
                      copyToClipboard(sponsorSheet.url).then(function () {
                        notifyToast(store, 'Посилання скопійовано у буфер обміну.', 'success');
                      });
                    }
                  }, uiIcon('copy', 15), 'Копіювати')
                )
              ),
              h('div', { className: 'sa-stack-sm' },
                h('span', { className: 'sa-label' }, 'ПОПЕРЕДНІЙ ПЕРЕГЛЯД ПОВІДОМЛЕННЯ'),
                h('div', { className: 'sa-card sa-card-subtle sa-card-pad' },
                  h('p', { className: 'sa-muted', style: { color: 'var(--ink-primary)' } },
                    sponsorSheet.message
                  )
                ),
                h('button', {
                  type: 'button',
                  className: 'sa-btn sa-btn-secondary',
                  style: { width: '100%' },
                  onClick: function () {
                    copyToClipboard(sponsorSheet.message).then(function () {
                      notifyToast(store, 'Текст повідомлення скопійовано.', 'success');
                    });
                  }
                }, uiIcon('send', 15), 'Копіювати повідомлення для месенджера')
              )
            )
          : null
      ),

      /* ---- Sheet: Add Child via SA-XXXXXX ---- */
      h(UI.Sheet, {
        open: showAddChild,
        onClose: function () { setShowAddChild(false); },
        title: 'Додати профіль учня',
        subtitle: 'Сімейний код ' + familyInviteCode
      },
        h('div', { className: 'sa-stack' },
          h('div', { className: 'sa-banner is-ok' },
            uiIcon('qrCode', 18),
            h('div', { className: 'sa-stack-sm', style: { gap: '2px' } },
              h('strong', { style: { fontSize: '13px' } }, 'Сімейний код: ' + familyInviteCode),
              h('span', { className: 'sa-muted' },
                'Передайте цей код учню для приєднання з іншого пристрою або додайте профіль нижче.'
              )
            )
          ),
          h('button', {
            type: 'button',
            className: 'sa-btn sa-btn-secondary',
            style: { width: '100%' },
            onClick: function () {
              copyToClipboard(familyInviteCode).then(function () {
                notifyToast(store, 'Сімейний код скопійовано.', 'success');
              });
            }
          }, uiIcon('copy', 15), 'Копіювати код ' + familyInviteCode),
          h('div', { className: 'sa-divider' }),
          h('form', { className: 'sa-stack-sm', onSubmit: handleAddChildSubmit },
            h('span', { className: 'sa-label' }, 'ДОДАТИ ДИТИНУ В КАБІНЕТ'),
            h('input', {
              type: 'text',
              className: 'sa-input',
              placeholder: 'Ім\'я учня (наприклад: Софія)',
              value: newChildName,
              onChange: function (e) { setNewChildName(e.target.value); }
            }),
            h('input', {
              type: 'text',
              className: 'sa-input sa-mono',
              placeholder: 'Код учня (SA-XXXXXX, опційно)',
              value: newChildCode,
              onChange: function (e) { setNewChildCode(e.target.value.toUpperCase()); }
            }),
            h('select', {
              className: 'sa-input',
              value: newChildGrade,
              onChange: function (e) { setNewChildGrade(e.target.value); }
            },
              ['5 клас', '7 клас', '9 клас', '11 клас'].map(function (g) {
                return h('option', { key: g, value: g }, g);
              })
            ),
            h('button', {
              type: 'submit',
              className: 'sa-btn sa-btn-primary',
              style: { width: '100%' }
            }, uiIcon('plus', 15), 'Додати дитину')
          )
        )
      ),

      /* ---- Sheet: Change Parent PIN ---- */
      h(UI.Sheet, {
        open: showChangePin,
        onClose: function () { setShowChangePin(false); },
        title: 'Змінити батьківський PIN',
        subtitle: 'Salted SHA-256 захист'
      },
        h('form', { className: 'sa-stack', onSubmit: handleChangePinSubmit },
          h('input', {
            type: 'password',
            inputMode: 'numeric',
            maxLength: 8,
            className: 'sa-input sa-mono',
            placeholder: 'Поточний PIN (4–8 цифр)',
            value: oldPinVal,
            onChange: function (e) {
              setOldPinVal(String(e.target.value || '').replace(/\D/g, '').slice(0, 8));
              if (changePinErr) setChangePinErr('');
            }
          }),
          h('input', {
            type: 'password',
            inputMode: 'numeric',
            maxLength: 8,
            className: 'sa-input sa-mono',
            placeholder: 'Новий PIN (4–8 цифр)',
            value: changePinVal,
            onChange: function (e) {
              setChangePinVal(String(e.target.value || '').replace(/\D/g, '').slice(0, 8));
              if (changePinErr) setChangePinErr('');
            }
          }),
          changePinErr
            ? h('div', { className: 'sa-banner is-danger' },
                uiIcon('alertCircle', 15),
                h('span', { style: { fontSize: '12px' } }, changePinErr)
              )
            : null,
          h('button', {
            type: 'submit',
            className: 'sa-btn sa-btn-primary',
            style: { width: '100%' }
          }, uiIcon('key', 15), 'Оновити PIN')
        )
      )
    );
  }

  global.StrictMobileViewsControl = {
    FocusMapView: FocusMapView,
    PassControlView: PassControlView
  };
})(window);
