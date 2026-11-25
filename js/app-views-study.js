/* ==========================================================================
   StrictAI Mobile Application — Study Views Module (Tabs 1, 2, 3)
   Exposes window.StrictMobileViewsStudy = { TodayView, TutorView, ExamsView }
   Zero JSX. Hooks: useState, useEffect, useRef, useMemo, useCallback. Zero emojis.
   ========================================================================== */

(function (global) {
  'use strict';

  var React = global.React;
  var h = React.createElement;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;
  var useMemo = React.useMemo;
  var useCallback = React.useCallback;

  var OPTION_KEYS = ['А', 'Б', 'В', 'Г'];

  /* ------------------------------------------------------------------------
     UI Bridge Helpers (StrictUI + StrictIcons Fallbacks)
     ------------------------------------------------------------------------ */

  function renderIcon(name, size, className) {
    var UI = global.StrictUI;
    var s = typeof size === 'number' ? size : 16;
    if (UI && typeof UI.Icon === 'function') {
      return h(UI.Icon, { name: name, size: s, className: className || '' });
    }
    var icons = global.StrictIcons;
    if (icons && typeof icons.svg === 'function') {
      return h('span', {
        className: 'sa-icon-wrap' + (className ? ' ' + className : ''),
        dangerouslySetInnerHTML: { __html: icons.svg(name, s, className || '') }
      });
    }
    return h('span', { className: 'sa-icon-wrap' }, '');
  }

  function resolveIconName(candidate, fallback) {
    var icons = global.StrictIcons;
    if (candidate && icons && typeof icons.has === 'function' && icons.has(candidate)) {
      return candidate;
    }
    return fallback || 'spark';
  }

  function renderSheet(props, children) {
    var UI = global.StrictUI;
    if (UI && typeof UI.Sheet === 'function') {
      return h(
        UI.Sheet,
        {
          open: !!props.open,
          isOpen: !!props.open,
          onClose: props.onClose,
          title: props.title || ''
        },
        children
      );
    }
    if (!props.open) return null;
    return h(
      'div',
      {
        className: 'sa-sheet-backdrop',
        onClick: function (e) {
          if (e.target === e.currentTarget && props.onClose) {
            props.onClose();
          }
        }
      },
      h(
        'div',
        { className: 'sa-sheet-panel' },
        h('div', { className: 'sa-sheet-handle' }),
        props.title
          ? h(
              'div',
              { className: 'sa-row-between', style: { marginBottom: '12px' } },
              h('h3', { className: 'sa-section-title' }, props.title),
              props.onClose
                ? h(
                    'button',
                    {
                      type: 'button',
                      className: 'sa-icon-btn',
                      'aria-label': 'Закрити',
                      onClick: props.onClose
                    },
                    renderIcon('x', 16)
                  )
                : null
            )
          : null,
        children
      )
    );
  }

  function renderModal(props, children) {
    var UI = global.StrictUI;
    if (UI && typeof UI.Modal === 'function') {
      return h(
        UI.Modal,
        {
          open: !!props.open,
          isOpen: !!props.open,
          onClose: props.onClose,
          title: props.title || ''
        },
        children
      );
    }
    if (!props.open) return null;
    return h(
      'div',
      {
        className: 'sa-sheet-backdrop is-center',
        onClick: function (e) {
          if (e.target === e.currentTarget && props.onClose) {
            props.onClose();
          }
        }
      },
      h(
        'div',
        { className: 'sa-modal-panel' },
        props.title
          ? h(
              'div',
              { className: 'sa-row-between', style: { marginBottom: '12px' } },
              h('h3', { className: 'sa-section-title' }, props.title),
              props.onClose
                ? h(
                    'button',
                    {
                      type: 'button',
                      className: 'sa-icon-btn',
                      'aria-label': 'Закрити',
                      onClick: props.onClose
                    },
                    renderIcon('x', 16)
                  )
                : null
            )
          : null,
        children
      )
    );
  }

  function notifyToast(store, message) {
    if (store && typeof store.showToast === 'function') {
      store.showToast(message);
    } else if (store && typeof store.toast === 'function') {
      store.toast(message);
    }
  }

  /* ------------------------------------------------------------------------
     Curriculum Normalization & Safe Fallbacks
     ------------------------------------------------------------------------ */

  var DEFAULT_SCHOOL_SUBJECTS = [
    { id: 'math', label: 'Математика' },
    { id: 'ukrainian', label: 'Українська мова' },
    { id: 'history', label: 'Історія України' },
    { id: 'bio_physics', label: 'Біологія та Фізика' }
  ];

  var DEFAULT_LANGUAGES = [
    { id: 'en', label: 'English' },
    { id: 'de', label: 'Deutsch' },
    { id: 'es', label: 'Español' },
    { id: 'pl', label: 'Polski' },
    { id: 'uk', label: 'Українська' }
  ];

  var DEFAULT_GRADE_BANDS = [
    { id: '5-7', label: '5-7' },
    { id: '8-9', label: '8-9' },
    { id: 'nmt', label: 'НМТ' },
    { id: 'olympiad', label: 'Олімпіада' }
  ];

  var DEFAULT_CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  var DEFAULT_PERSONAS = [
    { id: 'strict', name: 'Суворий викладач', role: 'Нульові підказки, фокус на самостійному виведенні', icon: 'shieldCheck' },
    { id: 'socratic', name: 'Сократівський ментор', role: 'Навідні запитання крок за кроком', icon: 'spark' },
    { id: 'nmt_strategist', name: 'Стратег НМТ', role: 'Таймінг, пастки тесту, +15 балів до порогу', icon: 'target' },
    { id: 'olympiad_coach', name: 'Тренер олімпіад', role: 'Нестандартні доведення і граничні випадки', icon: 'graduationCap' },
    { id: 'error_surgeon', name: 'Хірург помилок', role: 'Розбір типових прорахунків у формулах', icon: 'bug' },
    { id: 'visual_architect', name: 'Візуальний архітектор', role: 'Схеми, графіки та просторова уява', icon: 'layers' },
    { id: 'calm_guide', name: 'Спокійний наставник', role: 'Без стресу, чітке закріплення бази', icon: 'bookOpen' },
    { id: 'sprint_drill', name: 'Спринт-інструктор', role: 'Швидкі серії вправ з контролем темпу', icon: 'flame' },
    { id: 'language_partner', name: 'Мовний партнер', role: 'Живий діалог, вимова та контекст CEFR', icon: 'globe' }
  ];

  var DEFAULT_ROLEPLAY_SCENARIOS = [
    { id: 'cafe', title: 'Замовлення у кав\'ярні', level: 'A1-A2', context: 'Потрібно замовити сніданок, уточнити склад і розрахуватися.' },
    { id: 'airport', title: 'Паспортний контроль і багаж', level: 'A2-B1', context: 'Спілкування на стійці реєстрації та уточнення гейту.' },
    { id: 'interview', title: 'Співбесіда на стажування', level: 'B1-B2', context: 'Презентація сильних сторін і відповіді на кейс-запитання.' },
    { id: 'doctor', title: 'Візит до клініки', level: 'B1-B2', context: 'Опис симптомів та уточнення рекомендацій лікаря.' },
    { id: 'debate', title: 'Університетські дебати', level: 'C1-C2', context: 'Аргументація позиції щодо етики алгоритмів.' }
  ];

  var DEFAULT_UNIVERSITIES = [
    { id: 'knu', name: 'КНУ ім. Тараса Шевченка', targetScore: 185, program: 'Комп\'ютерні науки' },
    { id: 'kpi', name: 'КПІ ім. Ігоря Сікорського', targetScore: 178, program: 'Інженерія програмного забезпечення' },
    { id: 'ukma', name: 'НаУКМА', targetScore: 188, program: 'Прикладна математика' },
    { id: 'lnu', name: 'ЛНУ ім. Івана Франка', targetScore: 174, program: 'Аналіз даних' }
  ];

  var FALLBACK_TOPICS = {
    'math:5-7': [
      { id: 'm57_frac', title: 'Дії зі звичайними дробами', mastery: 62 },
      { id: 'm57_ratio', title: 'Пропорції та відсотки', mastery: 54 },
      { id: 'm57_lin', title: 'Лінійні рівняння з модулем', mastery: 48 }
    ],
    'math:8-9': [
      { id: 'm89_quad', title: 'Квадратні рівняння та дискримінант', mastery: 58 },
      { id: 'm89_vieta', title: 'Теорема Вієта і корені', mastery: 45 },
      { id: 'm89_sim', title: 'Подібність трикутників', mastery: 64 }
    ],
    'math:nmt': [
      { id: 'mn_log', title: 'Логарифмічні нерівності та ОДЗ', mastery: 44 },
      { id: 'mn_trig', title: 'Тригонометричні рівняння з відбором', mastery: 51 },
      { id: 'mn_param', title: 'Задачі з параметром', mastery: 38 },
      { id: 'mn_stereo', title: 'Стереометрія: перерізи призми', mastery: 56 }
    ],
    'math:olympiad': [
      { id: 'mo_inv', title: 'Інваріанти та розфарбування', mastery: 42 },
      { id: 'mo_num', title: 'Діофантові рівняння і модулярна арифметика', mastery: 39 }
    ],
    'ukrainian:nmt': [
      { id: 'un_stress', title: 'Наголоси слів за програмою НМТ', mastery: 61 },
      { id: 'un_syntax', title: 'Типи односкладних речень', mastery: 52 },
      { id: 'un_punct', title: 'Розділові знаки при відокремлених членах', mastery: 47 }
    ],
    'history:nmt': [
      { id: 'hn_cossack', title: 'Національно-визвольна війна 1648-1657', mastery: 59 },
      { id: 'hn_unr', title: 'Українська революція 1917-1921', mastery: 49 },
      { id: 'hn_dates', title: 'Синхронізація подій XX століття', mastery: 55 }
    ],
    'bio_physics:nmt': [
      { id: 'bn_gen', title: 'Молекулярна генетика і синтез білка', mastery: 53 },
      { id: 'bn_mech', title: 'Закони збереження імпульсу та енергії', mastery: 46 }
    ]
  };

  var FALLBACK_QUESTIONS = [
    {
      id: 'q_nmt_log_1',
      subject: 'math',
      gradeBand: 'nmt',
      format: 'find_the_bug',
      difficulty: 2,
      topic: 'Логарифмічні нерівності та ОДЗ',
      prompt: 'Знайдіть помилку в розв\'язанні нерівності log_0.5(x - 2) >= -1.',
      canvasData: {
        title: 'Знайдіть крок із критичною помилкою (ОДЗ / знак)',
        lines: [
          'Умова: log_0.5(x - 2) >= -1',
          'Крок 1: Основа 0.5 належить (0; 1), нерівність спадна.',
          'Крок 2: x - 2 >= (0.5)^(-1), тобто x - 2 >= 2.',
          'Крок 3: ОДЗ: x - 2 > 0 => x > 2.',
          'Крок 4: Відповідь учня: x >= 4.'
        ]
      },
      options: [
        'На Кроці 2 не змінено знак нерівності при основі 0.5 < 1',
        'На Кроці 1 основа 0.5 означає зростання функції',
        'На Кроці 3 ОДЗ має бути x - 2 >= 0',
        'Помилки немає, відповідь x >= 4 правильна'
      ],
      correctIndex: 0,
      explanation: 'Оскільки основа 0.5 < 1, знак нерівності змінюється на протилежний: 0 < x - 2 <= 2, звідки x належить (2; 4].',
      microVerify: {
        question: 'Чому дорівнює (0.5)^(-1) та яке ОДЗ для x - 2?',
        options: ['2 і x > 2', '0.5 і x >= 2', '-2 і x > 0'],
        correctIndex: 0,
        hint: 'Від\'ємний степінь перевертає дріб 1/2 у 2, а підлогарифмічний вираз строго додатний.'
      }
    },
    {
      id: 'q_nmt_schema_2',
      subject: 'math',
      gradeBand: 'nmt',
      format: 'visual_schema',
      difficulty: 2,
      topic: 'Тригонометричні рівняння з відбором',
      prompt: 'Скільки коренів має рівняння sin(2x) = 0.5 на проміжку [0; pi]?',
      canvasData: {
        title: 'Схема проміжку [0; pi] для sin(2x) = 1/2',
        lines: [
          'Заміна t = 2x, де t належить [0; 2*pi].',
          'Рівняння: sin(t) = 1/2.',
          'Значення t на повному колі: pi/6 та 5*pi/6.',
          'Обернена заміна: x = t / 2.'
        ]
      },
      options: ['2 корені', '1 корінь', '3 корені', '4 корені'],
      correctIndex: 0,
      explanation: 'Для t в [0; 2*pi] рівняння sin(t) = 0.5 дає два значення: pi/6 і 5*pi/6, що дає x = pi/12 та x = 5*pi/12.',
      microVerify: {
        question: 'У який інтервал переходить x належить [0; pi] після заміни t = 2x?',
        options: ['[0; 2*pi]', '[0; pi/2]', '[-pi; pi]'],
        correctIndex: 0,
        hint: 'Помножте обидві межі інтервалу [0; pi] на 2.'
      }
    },
    {
      id: 'q_nmt_trap_3',
      subject: 'ukrainian',
      gradeBand: 'nmt',
      format: 'llm_trap',
      difficulty: 2,
      topic: 'Наголоси слів за програмою НМТ',
      prompt: 'У якому рядку в усіх словах наголос падає на ДРУГИЙ склад?',
      canvasData: {
        title: 'Перевірка акцентуаційної норми НМТ',
        lines: [
          'Увага: популярні чат-боти часто плутають слова «випадок» і «олень».',
          'Прочитайте кожне слово про себе по складах.',
          'Порахуйте позицію наголошеного складу від початку слова.'
        ]
      },
      options: [
        'русло, спина, фартух',
        'випадок, каталог, квартал',
        'донька, новий, читання',
        'дрова, жалюзі, граблі'
      ],
      correctIndex: 0,
      explanation: 'Правильно: руслО (2-й), спинА (2-й) — стоп: перевірмо! спинА/спИна: норма спинА, фартУх (2-й), руслО (2-й). У варіанті Б: випАдок (2-й), каталОг (3-й).',
      microVerify: {
        question: 'Який склад наголошений у слові «каталог» за словником НМТ?',
        options: ['Третій (каталОг)', 'Перший (кАталог)', 'Другий (катАлог)'],
        correctIndex: 0,
        hint: 'Іменники іншомовного походження на -лог (каталог, діалог) мають наголос на останньому складі.'
      }
    },
    {
      id: 'q_nmt_case_4',
      subject: 'history',
      gradeBand: 'nmt',
      format: 'context_case',
      difficulty: 1,
      topic: 'Національно-визвольна війна 1648-1657',
      prompt: 'Яка битва 1649 року завершилася підписанням Зборівського договору?',
      canvasData: {
        title: 'Історичний кейс: Кампанія 1649 року',
        lines: [
          'Контекст: Військо Б. Хмельницького оточило коронний табір.',
          'Союзник кримський хан Іслам-Гірей III схилив до переговорів.',
          'Результат: Реєстр обмежено до 40 000 козаків у трьох воєводствах.'
        ]
      },
      options: ['Зборівська битва', 'Пилявецька битва', 'Берестецька битва', 'Батозька битва'],
      correctIndex: 0,
      explanation: 'Зборівська битва (серпень 1649) завершилася Зборівським договором із реєстром у 40 тисяч козаків.',
      microVerify: {
        question: 'Скільки козаків налічував реєстр за умовами Зборівського договору?',
        options: ['40 тисяч', '20 тисяч', '60 тисяч'],
        correctIndex: 0,
        hint: 'У Батозі та Білій Церкві реєстр був меншим (20 тис.), а у Зборові — удвічі більшим.'
      }
    },
    {
      id: 'q_nmt_phys_5',
      subject: 'bio_physics',
      gradeBand: 'nmt',
      format: 'context_case',
      difficulty: 3,
      topic: 'Закони збереження імпульсу та енергії',
      prompt: 'Тіло масою 2 кг рухається зі швидкістю 4 м/с і непружно з\'єднується з нерухомим тілом масою 2 кг. Яка швидкість системи після удару?',
      canvasData: {
        title: 'Закон збереження імпульсу: непружний удар',
        lines: [
          'm1 = 2 кг, v1 = 4 м/с',
          'm2 = 2 кг, v2 = 0 м/с',
          'Рівняння: m1*v1 + m2*v2 = (m1 + m2)*u'
        ]
      },
      options: ['2 м/с', '4 м/с', '1 м/с', '8 м/с'],
      correctIndex: 0,
      explanation: 'Імпульс до удару p = 2 * 4 = 8 кг*м/с. Загальна маса 4 кг, тому u = 8 / 4 = 2 м/с.',
      microVerify: {
        question: 'Чи зберігається механічна енергія при абсолютно непружному ударі?',
        options: ['Ні, частина переходить у тепло', 'Так, завжди повністю', 'Зростає вдвічі'],
        correctIndex: 0,
        hint: 'При злипанні тіл відбувається деформація і виділення тепла.'
      }
    }
  ];

  function toArray(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'object') {
      return Object.keys(val).map(function (k) {
        var item = val[k];
        if (item && typeof item === 'object' && !item.id) {
          return Object.assign({ id: k }, item);
        }
        return item;
      });
    }
    return [];
  }

  function normalizeListItem(item, idx) {
    if (typeof item === 'string') {
      return { id: item, label: item };
    }
    return {
      id: item.id || item.key || item.code || String(idx),
      label: item.label || item.name || item.title || String(item.id || idx),
      raw: item
    };
  }

  function getCurriculum() {
    return global.StrictCurriculum || {};
  }

  function getSchoolSubjects() {
    var SC = getCurriculum();
    var raw = SC.SCHOOL_SUBJECTS || SC.SUBJECTS;
    var arr = toArray(raw).filter(function (s) {
      return !s.mode || s.mode === 'school';
    });
    if (!arr.length) return DEFAULT_SCHOOL_SUBJECTS;
    return arr.map(normalizeListItem);
  }

  function getLanguages() {
    var SC = getCurriculum();
    var arr = toArray(SC.LANGUAGES);
    if (!arr.length) return DEFAULT_LANGUAGES;
    return arr.map(normalizeListItem);
  }

  function getGradeBands() {
    var SC = getCurriculum();
    var arr = toArray(SC.GRADE_BANDS);
    if (!arr.length) return DEFAULT_GRADE_BANDS;
    return arr.map(normalizeListItem);
  }

  function getCefrLevels() {
    var SC = getCurriculum();
    var arr = toArray(SC.CEFR_LEVELS);
    if (!arr.length) return DEFAULT_CEFR_LEVELS;
    return arr.map(function (lv) {
      return typeof lv === 'string' ? lv : (lv.id || lv.label || String(lv));
    });
  }

  function getExamSubjects() {
    var SC = getCurriculum();
    var arr = toArray(SC.EXAM_SUBJECTS);
    if (!arr.length) return getSchoolSubjects();
    return arr.map(normalizeListItem);
  }

  function getPersonas() {
    var SC = getCurriculum();
    var arr = toArray(SC.PERSONAS);
    if (!arr.length) return DEFAULT_PERSONAS;
    return arr.map(function (p, i) {
      return {
        id: p.id || p.key || String(i),
        name: p.name || p.label || p.title || 'Викладач',
        role: p.role || p.shortRole || p.description || p.styleRule || p.tagline || p.tone || '',
        icon: resolveIconName(p.icon, 'spark')
      };
    });
  }

  function getRoleplayScenarios(langId) {
    var SC = getCurriculum();
    var raw = null;
    if (typeof SC.getRoleplayScenarios === 'function') {
      try {
        raw = SC.getRoleplayScenarios(langId);
      } catch (e) {
        raw = null;
      }
    }
    if (!raw) raw = SC.ROLEPLAY_SCENARIOS;
    var arr = toArray(raw);
    if (!arr.length) return DEFAULT_ROLEPLAY_SCENARIOS;
    return arr.map(function (s, i) {
      return {
        id: s.id || String(i),
        title: s.title || s.name || 'Сценарій',
        level: s.level || s.cefr || s.roleName || 'A1-C2',
        context: s.context || s.subtitle || s.description || s.prompt || ''
      };
    });
  }

  function getUniversities() {
    var SC = getCurriculum();
    var arr = toArray(SC.UNIVERSITIES);
    if (!arr.length) return DEFAULT_UNIVERSITIES;
    return arr.map(function (u, i) {
      return {
        id: u.id || u.code || String(i),
        name: u.name || u.title || 'Університет',
        targetScore: typeof u.targetScore === 'number' ? u.targetScore : (typeof u.minScore === 'number' ? u.minScore : 185),
        program: u.program || u.faculty || u.city || ''
      };
    });
  }

  function normalizeTopicItem(t, idx) {
    if (typeof t === 'string') {
      return { id: 'topic_' + idx, title: t, mastery: 50 };
    }
    return {
      id: t.id || t.slug || 'topic_' + idx,
      title: t.title || t.name || t.label || String(t.id || idx),
      mastery: typeof t.mastery === 'number' ? t.mastery : 50,
      summary: t.summary || t.description || ''
    };
  }

  function getTopics(mode, subjectId, levelId) {
    var SC = getCurriculum();
    var result = null;
    if (typeof SC.getTopicsFor === 'function') {
      var attempts = [
        [mode, subjectId, levelId],
        [subjectId, levelId],
        [{ mode: mode, subject: subjectId, subjectId: subjectId, gradeBand: levelId, cefr: levelId, level: levelId }]
      ];
      for (var i = 0; i < attempts.length; i++) {
        try {
          var res = SC.getTopicsFor.apply(SC, attempts[i]);
          if (Array.isArray(res) && res.length > 0) {
            result = res;
            break;
          }
        } catch (e) {
          /* continue trying alternative signature */
        }
      }
    }
    if (result && result.length) {
      return result.map(normalizeTopicItem);
    }
    if (mode === 'language') {
      return [
        { id: 'lang_tense_' + levelId, title: 'Граматичні конструкції рівня ' + levelId, mastery: 55 },
        { id: 'lang_vocab_' + levelId, title: 'Академічна та побутова лексика (' + levelId + ')', mastery: 62 },
        { id: 'lang_speak_' + levelId, title: 'Аргументація та діалог (' + levelId + ')', mastery: 48 }
      ];
    }
    var key = subjectId + ':' + levelId;
    if (FALLBACK_TOPICS[key]) return FALLBACK_TOPICS[key];
    return [
      { id: key + '_core', title: 'Ключові задачі (' + levelId + ')', mastery: 50 },
      { id: key + '_practice', title: 'Типові пастки та перевірка умов (' + levelId + ')', mastery: 44 }
    ];
  }

  function normalizeQuestion(q, idx) {
    var options = Array.isArray(q.options) && q.options.length >= 4
      ? q.options.slice(0, 4)
      : ['Варіант А', 'Варіант Б', 'Варіант В', 'Варіант Г'];
    var mv = q.microVerify || {};
    var mvOptions = Array.isArray(mv.options) && mv.options.length >= 3
      ? mv.options.slice(0, 3)
      : ['Так, умова виконується', 'Ні, потрібне обмеження', 'Неможливо визначити без даних'];
    var stemText = q.questionText || q.prompt || q.question || q.stem || 'Оберіть правильну відповідь.';
    return {
      id: q.id || 'q_' + idx,
      subjectId: q.subjectId || q.subject || 'math',
      subject: q.subjectId || q.subject || 'math',
      gradeBand: q.gradeBand || 'nmt-200',
      format: q.format || 'context_case',
      formatLabel: q.formatLabel || '',
      difficulty: typeof q.difficulty === 'number' ? q.difficulty : 2,
      topic: q.topic || 'Базова тема',
      title: q.title || '',
      questionText: stemText,
      prompt: stemText,
      tableData: q.tableData || null,
      diagram: q.diagram || null,
      derivationSteps: Array.isArray(q.derivationSteps) ? q.derivationSteps.slice() : null,
      trapRule: q.trapRule || '',
      canvasData: q.canvasData || {
        title: q.topic || 'Завдання НМТ',
        lines: [stemText]
      },
      options: options,
      correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
      explanation: q.explanation || 'Перевірте початкову умову та обмеження ОДЗ крок за кроком.',
      errorSummary: q.errorSummary || '',
      microVerify: {
        question: mv.question || 'Який ключовий принцип гарантує правильність цього розв\'язку?',
        options: mvOptions,
        correctIndex: typeof mv.correctIndex === 'number' ? mv.correctIndex : 0,
        hint: mv.hint || 'Зверніть увагу на граничні умови та перевірте підстановкою.'
      }
    };
  }

  function getExamQuestions(subjectId, gradeBand, mode) {
    var SC = getCurriculum();
    var targetCount = mode === 'sprint' ? 5 : (mode === 'cat' ? 7 : 10);
    var pool = [];

    if (typeof SC.getExamQuestions === 'function') {
      try {
        pool = SC.getExamQuestions(mode || 'sprint', subjectId, gradeBand) || [];
      } catch (e) {
        pool = [];
      }
    } else if (typeof SC.getQuestionsFor === 'function') {
      try {
        pool = SC.getQuestionsFor(subjectId, gradeBand) || [];
      } catch (e) {
        pool = [];
      }
    } else if (Array.isArray(SC.QUESTIONS)) {
      pool = SC.QUESTIONS.filter(function (q) {
        return (!subjectId || q.subject === subjectId) && (!gradeBand || !q.gradeBand || q.gradeBand === gradeBand);
      });
      if (!pool.length) {
        pool = SC.QUESTIONS.filter(function (q) {
          return !subjectId || q.subject === subjectId;
        });
      }
    }

    if (!pool || !pool.length) {
      pool = FALLBACK_QUESTIONS.filter(function (q) {
        return q.subject === subjectId;
      });
      if (!pool.length) {
        pool = FALLBACK_QUESTIONS.slice();
      }
    }

    var normalized = pool.map(normalizeQuestion);
    while (normalized.length < targetCount) {
      var base = FALLBACK_QUESTIONS[normalized.length % FALLBACK_QUESTIONS.length];
      var clone = normalizeQuestion(base, normalized.length);
      clone.id = clone.id + '_v' + normalized.length;
      normalized.push(clone);
    }
    return normalized.slice(0, targetCount);
  }

  function findSubjectLabel(mode, subjectId) {
    var list = mode === 'language' ? getLanguages() : getSchoolSubjects();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === subjectId || list[i].label === subjectId) {
        return list[i].label;
      }
    }
    return subjectId || 'Предмет';
  }

  function getActiveProfile(state) {
    var profile = (state && state.profile) ? state.profile : {};
    var goals = (state && state.goals) ? state.goals : {};
    var telemetry = (state && state.telemetry) ? state.telemetry : {};
    var authUser = (state && state.auth && state.auth.user) || (state && state.user) || null;
    var activeChild = null;
    var childId = (state && (state.selectedChildId || state.activeChildId)) || null;
    if (state && Array.isArray(state.children) && state.children.length) {
      for (var i = 0; i < state.children.length; i++) {
        if (childId && state.children[i].id === childId) {
          activeChild = state.children[i];
          break;
        }
      }
      if (!activeChild) activeChild = state.children[0];
    }
    var rawWeak = (Array.isArray(telemetry.weakTopics) && telemetry.weakTopics.length)
      ? telemetry.weakTopics
      : (Array.isArray(profile.weakTopics) && profile.weakTopics.length
          ? profile.weakTopics
          : (Array.isArray(state && state.weakTopics) && state.weakTopics.length ? state.weakTopics : null));

    return {
      displayName: (authUser && authUser.displayName) || profile.displayName || profile.name || (activeChild && activeChild.name) || 'Учень',
      predictedScore: typeof telemetry.predictedScore === 'number'
        ? telemetry.predictedScore
        : (typeof profile.predictedScore === 'number'
            ? profile.predictedScore
            : (activeChild && typeof activeChild.predictedScore === 'number' ? activeChild.predictedScore : 158)),
      dailyScheduleTime: goals.dailyScheduleTime || profile.dailyScheduleTime || (state && state.contract && (state.contract.missedAlertTime || state.contract.dailyScheduleTime)) || '17:00',
      targetUniversityId: goals.targetUniId || goals.targetUniName || profile.targetUniversityId || profile.targetUniversity || profile.universityId || 'knu',
      gradeBand: goals.gradeBand || profile.gradeBand || (activeChild && activeChild.gradeBand) || 'nmt-200',
      weakTopics: rawWeak,
      xp: typeof telemetry.xp === 'number' ? telemetry.xp : (typeof profile.xp === 'number' ? profile.xp : 240),
      streakDays: typeof telemetry.streakDays === 'number' ? telemetry.streakDays : (typeof profile.streakDays === 'number' ? profile.streakDays : 5)
    };
  }

  /* ------------------------------------------------------------------------
     TAB 1: TodayView ({ state, store })
     ------------------------------------------------------------------------ */

  function TodayView(props) {
    var state = props.state || {};
    var store = props.store || {};
    var profile = getActiveProfile(state);

    var universities = useMemo(function () {
      return getUniversities();
    }, []);

    var targetUni = useMemo(function () {
      for (var i = 0; i < universities.length; i++) {
        if (
          universities[i].id === profile.targetUniversityId ||
          universities[i].name === profile.targetUniversityId
        ) {
          return universities[i];
        }
      }
      return universities[0] || DEFAULT_UNIVERSITIES[0];
    }, [universities, profile.targetUniversityId]);

    var predictedScore = Math.max(100, Math.min(200, Math.round(profile.predictedScore)));
    var targetScore = targetUni.targetScore || 185;
    var deficit = Math.max(0, targetScore - predictedScore);
    var scorePct = Math.max(4, Math.min(100, Math.round(((predictedScore - 100) / Math.max(1, targetScore - 100)) * 100)));

    var weakTopics = useMemo(function () {
      if (profile.weakTopics && profile.weakTopics.length) {
        return profile.weakTopics.map(function (wt, idx) {
          if (typeof wt === 'string') {
            return { id: 'wt_' + idx, topic: wt, subject: 'math', gradeBand: profile.gradeBand };
          }
          return {
            id: wt.id || 'wt_' + idx,
            topic: wt.topic || wt.title || wt.name || 'Складна тема',
            subject: wt.subjectId || wt.subject || 'math',
            gradeBand: wt.gradeBand || profile.gradeBand,
            mastery: wt.mastery
          };
        });
      }
      return [
        { id: 'wt_log', topic: 'Логарифмічні нерівності та ОДЗ', subject: 'math', gradeBand: profile.gradeBand, mastery: 44 },
        { id: 'wt_param', topic: 'Задачі з параметром', subject: 'math', gradeBand: profile.gradeBand, mastery: 38 },
        { id: 'wt_punct', topic: 'Відокремлені члени речення', subject: 'ukrainian', gradeBand: profile.gradeBand, mastery: 47 }
      ];
    }, [profile.weakTopics, profile.gradeBand]);

    var pendingLectures = useMemo(function () {
      var raw = state.assignedLectures || state.lectures || (state.family && state.family.assignedLectures) || [];
      var childId = state.selectedChildId || state.activeChildId || null;
      var uid = (state.auth && state.auth.user && state.auth.user.uid) || (state.user && state.user.uid) || null;
      return raw.filter(function (lec) {
        if (!lec) return false;
        if (lec.status === 'completed' || lec.completed === true) return false;
        if (childId && lec.childId && lec.childId !== childId) return false;
        if (uid && lec.assignedToUid && lec.assignedToUid !== uid) return false;
        return true;
      });
    }, [state.assignedLectures, state.lectures, state.family, state.selectedChildId, state.activeChildId, state.auth, state.user]);

    var quests = useMemo(function () {
      var raw = state.dailyQuests || state.quests || [];
      if (raw.length) return raw;
      return [
        { id: 'q_tutor', title: 'Закрити розбір 1 теми з Репетитором', targetTab: 'tutor', xp: 40, completed: false },
        { id: 'q_exam', title: 'Пройти предметний спринт без 2-го попередження', targetTab: 'exams', xp: 50, completed: false },
        { id: 'q_focus', title: 'Виконати 25-хвилинний фокус-спринт', targetTab: 'focus', xp: 30, completed: false }
      ];
    }, [state.dailyQuests, state.quests]);

    var completedQuests = quests.filter(function (q) { return !!q.completed; }).length;
    var questsPct = quests.length ? Math.round((completedQuests / quests.length) * 100) : 0;

    var missed = state.missedLesson || {};
    var isMissedOverdue = !!(missed.isOverdue && !missed.resolvedToday);
    var isMissedResolved = !!missed.resolvedToday;

    var passTier = (state.auth && state.auth.activePass && state.auth.activePass.tier) ||
      (state.strictPass && state.strictPass.tier) ||
      (state.entitlement && state.entitlement.tier) ||
      'StrictPass';
    var passLabel = passTier.toLowerCase().indexOf('max') !== -1
      ? 'StrictPass MAX'
      : (passTier.toLowerCase().indexOf('pro') !== -1 ? 'StrictPass Pro' : 'StrictPass');

    function launchTutor(payload) {
      if (store && typeof store.openTutorWithTopic === 'function') {
        store.openTutorWithTopic(payload);
      } else if (store && typeof store.setActiveTab === 'function') {
        store.setActiveTab('tutor');
      }
    }

    function handleStartMissedLesson() {
      if (store && typeof store.resolveMissedLesson === 'function') {
        store.resolveMissedLesson();
      }
      var firstWeak = weakTopics[0] || { subject: 'math', topic: 'Логарифмічні нерівності та ОДЗ', gradeBand: profile.gradeBand };
      launchTutor({
        mode: 'school',
        subject: firstWeak.subject,
        gradeBand: firstWeak.gradeBand || profile.gradeBand,
        topic: firstWeak.topic,
        fromMissedGuard: true
      });
    }

    function handleOpenPassWallet() {
      if (store && typeof store.setActiveTab === 'function') {
        store.setActiveTab('pass');
      }
      if (store && typeof store.setControlSubTab === 'function') {
        store.setControlSubTab('wallet');
      }
    }

    return h(
      'div',
      { className: 'sa-stack' },

      /* 1. Greeting Header + StrictPass Mini-Pill */
      h(
        'div',
        { className: 'sa-row-between' },
        h(
          'div',
          { className: 'sa-stack-sm', style: { gap: '2px' } },
          h('span', { className: 'sa-label' }, 'ПЛАН ПІДГОТОВКИ'),
          h('h2', { className: 'sa-section-title' }, 'Вітаємо, ' + profile.displayName)
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'sa-chip is-active',
            onClick: handleOpenPassWallet
          },
          renderIcon('creditCard', 14),
          h('span', null, passLabel)
        )
      ),

      /* 2. Scheduled 17:00 Lesson Guard Card */
      isMissedOverdue
        ? h(
            'div',
            { className: 'sa-banner is-danger' },
            renderIcon('alertTriangle', 18),
            h(
              'div',
              { className: 'sa-stack-sm', style: { flex: '1 1 auto' } },
              h('strong', { style: { fontSize: '13.5px' } }, 'Пропущено запланований урок о ' + profile.dailyScheduleTime),
              h(
                'p',
                { className: 'sa-muted', style: { color: 'inherit' } },
                'Контракт активний: запустіть 10-хвилинний розбір зараз, щоб зберегти серію та довіру.'
              ),
              h(
                'div',
                null,
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'sa-btn sa-btn-primary sa-btn-sm',
                    onClick: handleStartMissedLesson
                  },
                  renderIcon('play', 14),
                  h('span', null, 'Почати зараз')
                )
              )
            )
          )
        : h(
            'div',
            { className: 'sa-card sa-card-pad' },
            h(
              'div',
              { className: 'sa-row-between' },
              h(
                'div',
                { className: 'sa-row' },
                renderIcon(isMissedResolved ? 'checkCircle' : 'clock', 16),
                h(
                  'div',
                  null,
                  h('div', { className: 'sa-card-title' }, 'Щоденний слот: ' + profile.dailyScheduleTime),
                  h(
                    'div',
                    { className: 'sa-muted' },
                    isMissedResolved
                      ? 'Сьогоднішній слот закрито і підтверджено системою.'
                      : 'Авто-нагадування та захист регулярного ритму.'
                  )
                )
              ),
              h(
                'span',
                { className: 'sa-badge ' + (isMissedResolved ? 'sa-badge-ok' : '') },
                isMissedResolved ? 'Виконано' : 'За планом'
              )
            )
          ),

      /* 3. Predicted NMT Score & University Deficit Card */
      h(
        'div',
        { className: 'sa-card sa-card-pad sa-stack' },
        h(
          'div',
          { className: 'sa-row-between' },
          h(
            'div',
            null,
            h('div', { className: 'sa-label' }, 'ПРОГНОЗ НМТ'),
            h('div', { className: 'sa-kpi-lg', style: { marginTop: '4px' } }, predictedScore + ' / 200')
          ),
          h(
            'span',
            { className: 'sa-badge ' + (deficit === 0 ? 'sa-badge-ok' : 'sa-badge-warn') },
            renderIcon(deficit === 0 ? 'checkCircle' : 'target', 12),
            h('span', null, deficit > 0 ? ('Потрібно ще ' + deficit + ' балів') : 'Мета досягнута')
          )
        ),
        h(
          'div',
          { className: 'sa-stack-sm', style: { gap: '6px' } },
          h(
            'div',
            { className: 'sa-row-between' },
            h('span', { className: 'sa-muted' }, targetUni.name + (targetUni.program ? ' (' + targetUni.program + ')' : '')),
            h('span', { className: 'sa-mono', style: { fontSize: '12px', fontWeight: 600 } }, 'Мета: ' + targetScore)
          ),
          h(
            'div',
            { className: 'sa-progress-track' },
            h('div', {
              className: 'sa-progress-fill ' + (deficit === 0 ? 'is-ok' : ''),
              style: { width: scorePct + '%' }
            })
          )
        ),
        h('div', { className: 'sa-divider' }),
        h(
          'div',
          { className: 'sa-stack-sm' },
          h('span', { className: 'sa-label' }, 'СЛАБКІ ТЕМИ ДЛЯ ПІДСИЛЕННЯ'),
          h(
            'div',
            { className: 'sa-chip-scroll' },
            weakTopics.map(function (wt) {
              return h(
                'button',
                {
                  key: wt.id,
                  type: 'button',
                  className: 'sa-chip',
                  onClick: function () {
                    launchTutor({
                      mode: 'school',
                      subject: wt.subject,
                      gradeBand: wt.gradeBand || profile.gradeBand,
                      topic: wt.topic
                    });
                  }
                },
                renderIcon('spark', 13),
                h('span', null, wt.topic),
                typeof wt.mastery === 'number'
                  ? h('span', { className: 'sa-mono', style: { opacity: 0.7 } }, wt.mastery + '%')
                  : null
              );
            })
          )
        )
      ),

      /* 4. Parent-Assigned Lectures Card */
      h(
        'div',
        { className: 'sa-card sa-card-pad sa-stack' },
        h(
          'div',
          { className: 'sa-row-between' },
          h('h3', { className: 'sa-card-title' }, 'Призначені лекції від батьків'),
          h('span', { className: 'sa-badge' }, String(pendingLectures.length))
        ),
        pendingLectures.length === 0
          ? h(
              'p',
              { className: 'sa-muted' },
              'Усі призначені батьками теми опрацьовано. Можна перейти до власного плану.'
            )
          : h(
              'div',
              { className: 'sa-stack-sm' },
              pendingLectures.map(function (lec) {
                var subjLabel = lec.subjectLabel || findSubjectLabel(lec.mode || 'school', lec.subjectId || lec.subject);
                return h(
                  'div',
                  { key: lec.id, className: 'sa-card sa-card-subtle sa-card-pad sa-stack-sm' },
                  h(
                    'div',
                    { className: 'sa-row-between' },
                    h('span', { className: 'sa-badge sa-badge-ink' }, subjLabel),
                    lec.dueLabel ? h('span', { className: 'sa-muted' }, lec.dueLabel) : null
                  ),
                  h('div', { className: 'sa-card-title' }, lec.topic || lec.title),
                  lec.notes || lec.note || lec.parentNote
                    ? h('p', { className: 'sa-muted' }, lec.notes || lec.note || lec.parentNote)
                    : null,
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'sa-btn sa-btn-primary sa-btn-sm',
                      onClick: function () {
                        launchTutor({
                          lectureId: lec.id,
                          mode: lec.mode || 'school',
                          subject: lec.subjectId || lec.subject || 'math',
                          gradeBand: lec.gradeBand || profile.gradeBand,
                          topic: lec.topic || lec.title,
                          notes: lec.notes || lec.note || lec.parentNote || ''
                        });
                      }
                    },
                    renderIcon('arrowRight', 14),
                    h('span', null, 'Почати призначений розбір')
                  )
                );
              })
            )
      ),

      /* 5. Auto-Verified Daily Quests Card (Non-checkboxed) */
      h(
        'div',
        { className: 'sa-card sa-card-pad sa-stack' },
        h(
          'div',
          { className: 'sa-row-between' },
          h('h3', { className: 'sa-card-title' }, 'Щоденні квести'),
          h(
            'span',
            { className: 'sa-badge sa-badge-ok' },
            renderIcon('shieldCheck', 12),
            h('span', null, 'Захищено авто-перевіркою')
          )
        ),
        h(
          'div',
          { className: 'sa-stack-sm', style: { gap: '6px' } },
          h(
            'div',
            { className: 'sa-row-between' },
            h('span', { className: 'sa-muted' }, 'Прогрес підтвердження'),
            h('span', { className: 'sa-mono', style: { fontSize: '12px', fontWeight: 600 } }, completedQuests + ' / ' + quests.length)
          ),
          h(
            'div',
            { className: 'sa-progress-track' },
            h('div', {
              className: 'sa-progress-fill ' + (completedQuests === quests.length ? 'is-ok' : ''),
              style: { width: questsPct + '%' }
            })
          )
        ),
        h(
          'div',
          { className: 'sa-stack-sm' },
          quests.map(function (quest) {
            var isDone = !!quest.completed;
            return h(
              'div',
              { key: quest.id, className: 'sa-card sa-card-subtle sa-card-pad sa-stack-sm' },
              h(
                'div',
                { className: 'sa-row-between' },
                h('div', { style: { fontWeight: 600, fontSize: '13px', flex: '1 1 auto' } }, quest.title),
                (quest.xp || quest.xpReward) ? h('span', { className: 'sa-mono', style: { fontSize: '11.5px', fontWeight: 600 } }, '+' + (quest.xp || quest.xpReward) + ' XP') : null
              ),
              h(
                'div',
                { className: 'sa-row-between' },
                h(
                  'span',
                  { className: 'sa-badge ' + (isDone ? 'sa-badge-ok' : 'sa-badge-warn') },
                  renderIcon(isDone ? 'checkCircle' : 'clock', 12),
                  h('span', null, isDone ? 'Підтверджено' : 'Очікує підтвердження')
                ),
                !isDone
                  ? h(
                      'button',
                      {
                        type: 'button',
                        className: 'sa-btn sa-btn-secondary sa-btn-sm',
                        onClick: function () {
                          if (store && typeof store.setActiveTab === 'function') {
                            store.setActiveTab(quest.targetTab || 'tutor');
                          }
                        }
                      },
                      h('span', null, 'Виконати'),
                      renderIcon('chevronRight', 14)
                    )
                  : null
              )
            );
          })
        )
      ),

      /* 6. Bottom Primary CTA */
      h(
        'button',
        {
          type: 'button',
          className: 'sa-btn sa-btn-primary sa-btn-lg',
          style: { width: '100%' },
          onClick: function () {
            var firstWeak = weakTopics[0] || { subject: 'math', topic: 'Логарифмічні нерівності та ОДЗ', gradeBand: profile.gradeBand };
            launchTutor({
              mode: 'school',
              subject: firstWeak.subject,
              gradeBand: firstWeak.gradeBand || profile.gradeBand,
              topic: firstWeak.topic
            });
          }
        },
        renderIcon('spark', 18),
        h('span', null, 'Швидкий старт слабкої теми')
      )
    );
  }

  /* ------------------------------------------------------------------------
     TAB 2: TutorView ({ state, store })
     ------------------------------------------------------------------------ */

  function buildTutorTurn(opts) {
    var SC = getCurriculum();
    if (typeof SC.generateTutorReply === 'function') {
      try {
        var isLangMode = opts.mode === 'language';
        var apiParams = {
          mode: isLangMode ? 'language' : 'school',
          subjectId: opts.subject,
          gradeBand: isLangMode ? 'nmt-200' : (opts.level || 'nmt-200'),
          cefrLevel: isLangMode ? (opts.level || 'B1') : 'B1',
          personaId: opts.persona ? opts.persona.id : 'socratic',
          scenarioId: opts.scenario ? opts.scenario.id : null,
          userMessage: opts.userText || '',
          topicTitle: opts.topic || '',
          actionType: opts.scenario
            ? 'scenario'
            : (opts.action === 'start' || !opts.action ? 'explain' : (opts.action === 'user_message' ? 'explain' : opts.action)),
          history: opts.history || []
        };
        var custom = SC.generateTutorReply(apiParams);
        if (custom && (custom.text || custom.message)) {
          return {
            id: 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
            role: 'tutor',
            personaId: opts.persona.id,
            personaName: opts.persona.name,
            text: custom.text || custom.message,
            steps: Array.isArray(custom.steps) ? custom.steps : null,
            exercise: custom.exercise || null,
            topicCompleted: Boolean(custom.topicCompleted)
          };
        }
      } catch (e) {
        /* fallback to local Socratic builder */
      }
    }

    var isStrict = opts.persona.id === 'strict';
    var isLang = opts.mode === 'language';
    var subjLabel = findSubjectLabel(opts.mode, opts.subject);
    var topicTitle = opts.topic || subjLabel;
    var action = opts.action || 'start';

    var introPrefix = isStrict
      ? 'Режим суворого контролю. Без готової відповіді: '
      : (opts.persona.name + ': ');

    if (action === 'exercise') {
      var exPrompt = isLang
        ? '[' + opts.level + ' / ' + subjLabel + '] Оберіть правильну граматичну форму у контексті теми «' + topicTitle + '»:'
        : 'Міні-вправа з теми «' + topicTitle + '» (' + opts.level + '):';
      var exOpts = isLang
        ? [
            'If I had checked the timetable, I would have arrived earlier.',
            'If I would check the timetable, I arrived earlier.',
            'If I have checked the timetable, I would arrive.',
            'If I checking the timetable, I had arrived.'
          ]
        : [
            'Спочатку зафіксувати ОДЗ / граничні умови, а потім робити перетворення',
            'Скоротити вираз без перевірки знаків і нуля в знаменнику',
            'Підставити випадкове число і прийняти як загальне доведення',
            'Змінити знак нерівності незалежно від основи'
          ];
      return {
        id: 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        role: 'tutor',
        personaId: opts.persona.id,
        personaName: opts.persona.name,
        text: introPrefix + 'перевірмо розуміння на практичному кейсі.',
        steps: null,
        exercise: {
          prompt: exPrompt,
          options: exOpts,
          correctIndex: 0,
          explanation: isLang
            ? 'Третій умовний спосіб описує нереальну ситуацію в минулому: Past Perfect + would have + V3.'
            : 'Фіксація ОДЗ перед перетвореннями захищає від сторонніх коренів і втрати балів на НМТ.'
        }
      };
    }

    if (action === 'step') {
      return {
        id: 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        role: 'tutor',
        personaId: opts.persona.id,
        personaName: opts.persona.name,
        text: introPrefix + 'наступний крок розв\'язання для «' + topicTitle + '»:',
        steps: [
          'Випишіть усі обмеження вхідних змінних до першого перетворення.',
          'Зведіть ліву та праву частини до спільної структури або канонічного вигляду.',
          'Зробіть контрольну підстановку граничного значення.'
        ],
        exercise: null
      };
    }

    if (isLang && opts.scenario) {
      return {
        id: 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        role: 'tutor',
        personaId: opts.persona.id,
        personaName: opts.persona.name,
        text: introPrefix + 'рольовий сценарій «' + opts.scenario.title + '» (' + opts.level + '). ' + opts.scenario.context + ' Сформулюйте свою першу репліку мовою «' + subjLabel + '».',
        steps: [
          'Привітання та чітка мета звернення',
          'Одне уточнювальне запитання ввічливою формою',
          'Контроль узгодження часів рівня ' + opts.level
        ],
        exercise: null
      };
    }

    if (action === 'user_message') {
      return {
        id: 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        role: 'tutor',
        personaId: opts.persona.id,
        personaName: opts.persona.name,
        text: introPrefix + 'бачу ваш хід думок щодо «' + (opts.userText || topicTitle) + '». Перевірте ключовий перехід і дайте відповідь на контрольне запитання нижче:',
        steps: [
          'Перевірте, чи не загубилися граничні точки інтервалу.',
          'Оцініть коректність знаку перед останнім діленням.'
        ],
        exercise: null
      };
    }

    return {
      id: 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      role: 'tutor',
      personaId: opts.persona.id,
      personaName: opts.persona.name,
      text: introPrefix + 'розбираємо «' + topicTitle + '» (' + subjLabel + ', ' + opts.level + '). Сформулюйте перше обмеження або оберіть крок нижче.',
      steps: [
        'Ідентифікуйте тип завдання та приховану пастку.',
        'Окресліть область допустимих значень або базову конструкцію.',
        'Побудуйте план із 2 коротких перетворень.'
      ],
      exercise: null
    };
  }

  function TutorView(props) {
    var state = props.state || {};
    var store = props.store || {};
    var draft = state.tutorDraft || {};
    var contract = state.contract || {};
    var isStrictLocked = !!contract.lockStrictPersona;

    var schoolSubjects = useMemo(getSchoolSubjects, []);
    var languages = useMemo(getLanguages, []);
    var gradeBands = useMemo(getGradeBands, []);
    var cefrLevels = useMemo(getCefrLevels, []);
    var personas = useMemo(getPersonas, []);

    var draftMode = draft.mode === 'language' ? 'language' : 'school';
    var draftSubject = draft.subjectId || draft.subject || (draftMode === 'language' ? languages[0].id : schoolSubjects[0].id);
    var rawDraftGrade = draft.gradeBand || (state.goals && state.goals.gradeBand) || (state.profile && state.profile.gradeBand) || 'nmt-200';
    var normalizedDraftGrade = rawDraftGrade === 'NMT 200' || rawDraftGrade === 'nmt' ? 'nmt-200' : rawDraftGrade;
    var draftCefr = draft.cefrLevel || draft.cefr || 'B1';
    var draftTopic = draft.topicTitle || draft.topic || '';
    var draftPrompt = draft.promptText || draft.prompt || '';
    var draftLectureId = draft.lectureId || draft.activeLectureId || null;

    var [mode, setMode] = useState(draftMode);
    var [subject, setSubject] = useState(draftSubject);
    var [gradeBand, setGradeBand] = useState(normalizedDraftGrade);
    var [cefrLevel, setCefrLevel] = useState(draftCefr);
    var [personaId, setPersonaId] = useState(isStrictLocked ? 'strict' : (draft.personaId || 'strict'));
    var [selectedScenario, setSelectedScenario] = useState(null);
    var [personaSheetOpen, setPersonaSheetOpen] = useState(false);
    var [roleplaySheetOpen, setRoleplaySheetOpen] = useState(false);
    var [selectedTopic, setSelectedTopic] = useState(draftTopic);
    var [inputText, setInputText] = useState('');
    var [exerciseAnswers, setExerciseAnswers] = useState({});
    var [topicCompleted, setTopicCompleted] = useState(false);

    var effectivePersonaId = isStrictLocked ? 'strict' : personaId;
    var activePersona = useMemo(function () {
      for (var i = 0; i < personas.length; i++) {
        if (personas[i].id === effectivePersonaId) return personas[i];
      }
      return personas[0];
    }, [personas, effectivePersonaId]);

    var activeSubjects = mode === 'language' ? languages : schoolSubjects;
    var activeLevel = mode === 'language' ? cefrLevel : gradeBand;

    var topics = useMemo(function () {
      return getTopics(mode, subject, activeLevel);
    }, [mode, subject, activeLevel]);

    var roleplayScenarios = useMemo(function () {
      return getRoleplayScenarios(subject);
    }, [subject]);

    function buildInitialMessages() {
      var initialTopic = draftTopic || (topics[0] ? topics[0].title : 'Стартова тема');
      var list = [];
      if (draft.errorContext || draftPrompt) {
        list.push({
          id: 'u_seed_' + Date.now(),
          role: 'user',
          text: draftPrompt || ('Розбери помилку в темі «' + initialTopic + '»')
        });
      }
      list.push(
        buildTutorTurn({
          mode: draftMode,
          subject: draftSubject,
          level: draftMode === 'language' ? draftCefr : normalizedDraftGrade,
          topic: initialTopic,
          persona: activePersona,
          action: draft.errorContext ? 'step' : 'start',
          history: list
        })
      );
      return list;
    }

    var [messages, setMessages] = useState(buildInitialMessages);

    /* Sync incoming navigation from TodayView (lecture/weak topic) or ExamsView (error repair) */
    var initialSyncKey = (draft && (draftTopic || draftLectureId || draft.requestNonce))
      ? [draft.requestNonce || '', draftLectureId || '', draftTopic || '', draftSubject || ''].join('|')
      : '';
    var lastSyncedKeyRef = useRef(initialSyncKey);
    useEffect(function () {
      if (!draft || (!draftTopic && !draftLectureId && !draft.requestNonce)) return;
      var syncKey = [draft.requestNonce || '', draftLectureId || '', draftTopic || '', draftSubject || ''].join('|');
      if (syncKey === lastSyncedKeyRef.current) return;
      lastSyncedKeyRef.current = syncKey;

      var nextMode = draftMode;
      var nextSubject = draftSubject;
      var nextLevel = nextMode === 'language' ? draftCefr : normalizedDraftGrade;
      var nextTopic = draftTopic;

      setMode(nextMode);
      setSubject(nextSubject);
      if (nextMode === 'language') setCefrLevel(nextLevel);
      else setGradeBand(nextLevel);
      setSelectedTopic(nextTopic);
      setTopicCompleted(false);
      setExerciseAnswers({});

      var seedList = [];
      if (draft.errorContext || draftPrompt) {
        seedList.push({
          id: 'u_seed_' + Date.now(),
          role: 'user',
          text: draftPrompt || ('Розбери помилку в темі «' + nextTopic + '»')
        });
      }
      seedList.push(
        buildTutorTurn({
          mode: nextMode,
          subject: nextSubject,
          level: nextLevel,
          topic: nextTopic,
          persona: activePersona,
          action: draft.errorContext ? 'step' : 'start',
          history: seedList
        })
      );
      setMessages(seedList);
    }, [draft.requestNonce, draftLectureId, draftTopic, draftSubject]);

    var tutorTurnsCount = useMemo(function () {
      return messages.filter(function (m) { return m.role === 'tutor'; }).length;
    }, [messages]);

    function handleSwitchMode(nextMode) {
      if (nextMode === mode) return;
      setMode(nextMode);
      var nextSubj = nextMode === 'language' ? languages[0].id : schoolSubjects[0].id;
      var nextLvl = nextMode === 'language' ? cefrLevel : gradeBand;
      setSubject(nextSubj);
      setSelectedScenario(null);
      var nextTopics = getTopics(nextMode, nextSubj, nextLvl);
      setSelectedTopic(nextTopics[0] ? nextTopics[0].title : '');
    }

    function handleSelectSubject(nextSubj) {
      setSubject(nextSubj);
      var nextTopics = getTopics(mode, nextSubj, activeLevel);
      setSelectedTopic(nextTopics[0] ? nextTopics[0].title : '');
    }

    function handleSelectLevel(nextLvl) {
      if (mode === 'language') setCefrLevel(nextLvl);
      else setGradeBand(nextLvl);
      var nextTopics = getTopics(mode, subject, nextLvl);
      setSelectedTopic(nextTopics[0] ? nextTopics[0].title : '');
    }

    function startLessonWith(topicTitle, scenarioObj, isReset) {
      var chosenTopic = topicTitle || selectedTopic || (topics[0] ? topics[0].title : 'Оглядова тема');
      setSelectedTopic(chosenTopic);
      setTopicCompleted(false);
      if (isReset) setExerciseAnswers({});
      var firstTurn = buildTutorTurn({
        mode: mode,
        subject: subject,
        level: activeLevel,
        topic: chosenTopic,
        persona: activePersona,
        scenario: scenarioObj || selectedScenario,
        action: 'start'
      });
      setMessages(isReset ? [firstTurn] : messages.concat([firstTurn]));
    }

    function sendUserText(rawText, actionOverride) {
      var trimmed = String(rawText || '').trim();
      if (!trimmed && !actionOverride) return;
      var userMsg = trimmed
        ? { id: 'u_' + Date.now(), role: 'user', text: trimmed }
        : null;
      var reply = buildTutorTurn({
        mode: mode,
        subject: subject,
        level: activeLevel,
        topic: selectedTopic || (topics[0] ? topics[0].title : ''),
        persona: activePersona,
        scenario: selectedScenario,
        userText: trimmed,
        action: actionOverride || 'user_message',
        history: messages
      });
      setMessages(function (prev) {
        return userMsg ? prev.concat([userMsg, reply]) : prev.concat([reply]);
      });
      if (trimmed) setInputText('');
    }

    function handleSaveNote(msg) {
      var notePayload = {
        id: 'note_' + Date.now(),
        subjectId: subject,
        subject: subject,
        topic: selectedTopic || 'Конспект уроку',
        text: msg.text,
        steps: msg.steps || []
      };
      if (store && typeof store.saveTutorNote === 'function') {
        store.saveTutorNote(notePayload);
      } else if (store && typeof store.addNote === 'function') {
        store.addNote(notePayload);
      }
      notifyToast(store, 'Збережено у конспект: ' + (selectedTopic || 'Урок'));
    }

    function handleCompleteTopic() {
      var resolvedTopic = selectedTopic || (topics[0] ? topics[0].title : 'Тема дня');
      var payload = {
        lectureId: draftLectureId || null,
        mode: mode,
        subjectId: subject,
        subject: subject,
        gradeBand: activeLevel,
        topicTitle: resolvedTopic,
        topic: resolvedTopic,
        messagesCount: tutorTurnsCount,
        durationSec: Math.max(60, tutorTurnsCount * 45)
      };
      if (store && typeof store.completeTutorTopic === 'function') {
        store.completeTutorTopic(payload);
      }
      setTopicCompleted(true);
    }

    var latestTutorIndex = -1;
    for (var mi = messages.length - 1; mi >= 0; mi--) {
      if (messages[mi].role === 'tutor') {
        latestTutorIndex = mi;
        break;
      }
    }

    return h(
      'div',
      { className: 'sa-tutor-shell' },

      /* Compact Mobile Control Deck */
      h(
        'div',
        { className: 'sa-card sa-card-pad sa-stack-sm' },
        h(
          'div',
          { className: 'sa-segmented', style: { width: '100%' } },
          h(
            'button',
            {
              type: 'button',
              className: mode === 'school' ? 'is-active' : '',
              style: { flex: '1 1 0' },
              'aria-pressed': mode === 'school',
              onClick: function () { handleSwitchMode('school'); }
            },
            renderIcon('graduationCap', 14),
            h('span', null, 'Школа і НМТ')
          ),
          h(
            'button',
            {
              type: 'button',
              className: mode === 'language' ? 'is-active' : '',
              style: { flex: '1 1 0' },
              'aria-pressed': mode === 'language',
              onClick: function () { handleSwitchMode('language'); }
            },
            renderIcon('globe', 14),
            h('span', null, 'Мови CEFR')
          )
        ),

        /* Subject / Language Scroll Chips */
        h(
          'div',
          { className: 'sa-chip-scroll' },
          activeSubjects.map(function (s) {
            var isSel = s.id === subject;
            return h(
              'button',
              {
                key: s.id,
                type: 'button',
                className: 'sa-chip' + (isSel ? ' is-active' : ''),
                onClick: function () { handleSelectSubject(s.id); }
              },
              s.label
            );
          })
        ),

        /* Compact Grade / CEFR + Persona + Roleplay Row */
        h(
          'div',
          { className: 'sa-chip-scroll' },
          (mode === 'language' ? cefrLevels : gradeBands).map(function (item) {
            var id = typeof item === 'string' ? item : item.id;
            var label = typeof item === 'string' ? item : item.label;
            var isAct = activeLevel === id;
            return h(
              'button',
              {
                key: id,
                type: 'button',
                className: 'sa-chip' + (isAct ? ' is-active' : ''),
                onClick: function () { handleSelectLevel(id); }
              },
              label
            );
          }),
          h(
            'button',
            {
              type: 'button',
              className: 'sa-chip',
              onClick: function () { setPersonaSheetOpen(true); }
            },
            renderIcon(isStrictLocked ? 'lock' : activePersona.icon, 13),
            h('span', null, activePersona.name),
            renderIcon('chevronDown', 12)
          ),
          mode === 'language'
            ? h(
                'button',
                {
                  type: 'button',
                  className: 'sa-chip' + (selectedScenario ? ' is-active' : ''),
                  onClick: function () { setRoleplaySheetOpen(true); }
                },
                renderIcon('messageSquare', 13),
                h('span', null, selectedScenario ? selectedScenario.title : 'Рольові сценарії')
              )
            : null
        ),

        isStrictLocked
          ? h(
              'div',
              { className: 'sa-row', style: { gap: '6px' } },
              h(
                'span',
                { className: 'sa-badge sa-badge-warn' },
                renderIcon('lock', 12),
                h('span', null, 'Закріплено контрактом: Суворий викладач')
              )
            )
          : null,

        /* Grade-Isolated Topics */
        h(
          'div',
          { className: 'sa-chip-scroll' },
          topics.map(function (t) {
            var isSel = selectedTopic === t.title;
            return h(
              'button',
              {
                key: t.id,
                type: 'button',
                className: 'sa-chip' + (isSel ? ' is-active' : ''),
                onClick: function () { startLessonWith(t.title, selectedScenario, true); }
              },
              t.title
            );
          })
        ),

        /* Lesson Controls */
        h(
          'div',
          { className: 'sa-row' },
          h(
            'button',
            {
              type: 'button',
              className: 'sa-btn sa-btn-primary sa-btn-sm',
              style: { flex: '1 1 0' },
              onClick: function () { startLessonWith(selectedTopic, selectedScenario, false); }
            },
            renderIcon('play', 14),
            h('span', null, 'Почати урок')
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'sa-btn sa-btn-secondary sa-btn-sm',
              style: { flex: '1 1 0' },
              onClick: function () { startLessonWith(selectedTopic, selectedScenario, true); }
            },
            renderIcon('refresh', 14),
            h('span', null, 'Новий урок')
          )
        )
      ),

      /* Active Parent-Assigned Lecture Banner */
      draftLectureId
        ? h(
            'div',
            { className: 'sa-banner is-warn' },
            renderIcon('bookOpen', 18),
            h(
              'div',
              { className: 'sa-stack-sm', style: { flex: '1 1 auto' } },
              h('strong', { style: { fontSize: '13px' } }, 'Призначений розбір теми: ' + (selectedTopic || draftTopic || 'Лекція')),
              draft.notes ? h('p', { className: 'sa-muted', style: { color: 'inherit' } }, draft.notes) : null,
              h(
                'div',
                null,
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'sa-btn sa-btn-primary sa-btn-sm',
                    onClick: handleCompleteTopic
                  },
                  renderIcon('checkCircle', 14),
                  h('span', null, 'Завершити розбір теми')
                )
              )
            )
          )
        : null,

      /* Socratic Chat Thread */
      h(
        'div',
        { className: 'sa-chat-thread' },
        messages.map(function (msg, idx) {
          if (msg.role === 'user') {
            return h(
              'div',
              { key: msg.id, className: 'sa-bubble sa-bubble-user' },
              msg.text
            );
          }

          var exAnswer = exerciseAnswers[msg.id];
          var isAnswered = typeof exAnswer === 'number';
          var isLatestTutor = idx === latestTutorIndex;

          return h(
            'div',
            { key: msg.id, className: 'sa-bubble sa-bubble-tutor sa-stack-sm' },
            h(
              'div',
              { className: 'sa-row-between' },
              h(
                'span',
                { className: 'sa-label' },
                msg.personaName || activePersona.name
              ),
              h('span', { className: 'sa-mono', style: { fontSize: '10.5px', color: 'var(--ink-muted)' } }, 'Socratic')
            ),
            h('div', null, msg.text),
            msg.steps && msg.steps.length
              ? h(
                  'ol',
                  { className: 'sa-step-list' },
                  msg.steps.map(function (step, sIdx) {
                    return h('li', { key: sIdx }, step);
                  })
                )
              : null,

            /* Inline 4-Option Interactive Exercise Card */
            msg.exercise
              ? h(
                  'div',
                  { className: 'sa-card sa-card-subtle sa-card-pad sa-stack-sm', style: { marginTop: '4px' } },
                  h('div', { style: { fontWeight: 600, fontSize: '13px' } }, msg.exercise.prompt),
                  h(
                    'div',
                    { className: 'sa-stack-sm' },
                    msg.exercise.options.map(function (opt, oIdx) {
                      var optCls = 'sa-option-btn';
                      if (isAnswered) {
                        if (oIdx === msg.exercise.correctIndex) optCls += ' is-correct';
                        else if (oIdx === exAnswer) optCls += ' is-wrong';
                      }
                      return h(
                        'button',
                        {
                          key: oIdx,
                          type: 'button',
                          className: optCls,
                          disabled: isAnswered,
                          onClick: function () {
                            setExerciseAnswers(function (prev) {
                              var next = Object.assign({}, prev);
                              next[msg.id] = oIdx;
                              return next;
                            });
                          }
                        },
                        h('span', { className: 'sa-option-key' }, OPTION_KEYS[oIdx] || String(oIdx + 1)),
                        h('span', null, opt)
                      );
                    })
                  ),
                  isAnswered
                    ? h(
                        'div',
                        { className: 'sa-banner ' + (exAnswer === msg.exercise.correctIndex ? 'is-ok' : 'is-warn') },
                        renderIcon(exAnswer === msg.exercise.correctIndex ? 'checkCircle' : 'alertCircle', 16),
                        h('div', { style: { fontSize: '12px' } }, msg.exercise.explanation)
                      )
                    : null
                )
              : null,

            /* Pill Actions on Latest Tutor Message */
            isLatestTutor
              ? h(
                  'div',
                  { className: 'sa-row-wrap', style: { marginTop: '2px' } },
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'sa-chip',
                      onClick: function () { sendUserText('Покажи наступний крок розв\'язання', 'step'); }
                    },
                    renderIcon('arrowRight', 12),
                    h('span', null, 'Крок розв\'язання')
                  ),
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'sa-chip',
                      onClick: function () { sendUserText('Дай схожу вправу для закріплення', 'exercise'); }
                    },
                    renderIcon('refresh', 12),
                    h('span', null, 'Схожа вправа')
                  ),
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'sa-chip',
                      onClick: function () { handleSaveNote(msg); }
                    },
                    renderIcon('bookOpen', 12),
                    h('span', null, 'У конспект')
                  )
                )
              : null
          );
        })
      ),

      /* Quick Prompt Chips */
      h(
        'div',
        { className: 'sa-chip-scroll' },
        h(
          'button',
          {
            type: 'button',
            className: 'sa-chip',
            onClick: function () { sendUserText('Дай вправу', 'exercise'); }
          },
          'Дай вправу'
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'sa-chip',
            onClick: function () { sendUserText('Поясни правило', 'step'); }
          },
          'Поясни правило'
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'sa-chip',
            onClick: function () { sendUserText('Перевір відповідь', 'user_message'); }
          },
          'Перевір відповідь'
        )
      ),

      /* Composer Bar */
      h(
        'div',
        { className: 'sa-chat-composer' },
        h('input', {
          type: 'text',
          className: 'sa-input',
          value: inputText,
          placeholder: 'Напишіть ваш крок або запитання...',
          onChange: function (e) { setInputText(e.target.value); },
          onKeyDown: function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendUserText(inputText, 'user_message');
            }
          }
        }),
        h(
          'button',
          {
            type: 'button',
            className: 'sa-btn sa-btn-primary',
            onClick: function () { sendUserText(inputText, 'user_message'); }
          },
          renderIcon('send', 15),
          h('span', null, 'Надіслати')
        )
      ),

      /* Explicit Verified Quest Completion CTA after >= 2 tutor turns */
      tutorTurnsCount >= 2
        ? h(
            'button',
            {
              type: 'button',
              className: 'sa-btn ' + (topicCompleted ? 'sa-btn-secondary' : 'sa-btn-primary'),
              style: { width: '100%' },
              disabled: topicCompleted,
              onClick: handleCompleteTopic
            },
            renderIcon('checkCircle', 16),
            h('span', null, topicCompleted ? 'Тему підтверджено (+40 XP нараховано)' : 'Підтвердити завершення теми (+40 XP)')
          )
        : null,

      /* Persona Picker Sheet */
      renderSheet(
        {
          open: personaSheetOpen,
          onClose: function () { setPersonaSheetOpen(false); },
          title: 'Оберіть персону репетитора'
        },
        h(
          'div',
          { className: 'sa-stack-sm' },
          isStrictLocked
            ? h(
                'div',
                { className: 'sa-banner is-warn' },
                renderIcon('lock', 16),
                h('div', { style: { fontSize: '12.5px' } }, 'Закріплено контрактом: Суворий викладач. Зміна персони заблокована налаштуванням батьків.')
              )
            : null,
          personas.map(function (p) {
            var isCurrent = p.id === effectivePersonaId;
            var isBlocked = isStrictLocked && p.id !== 'strict';
            return h(
              'button',
              {
                key: p.id,
                type: 'button',
                className: 'sa-option-btn' + (isCurrent ? ' is-selected' : ''),
                disabled: isBlocked,
                onClick: function () {
                  if (isBlocked) return;
                  setPersonaId(p.id);
                  setPersonaSheetOpen(false);
                }
              },
              h('span', { className: 'sa-option-key' }, renderIcon(isBlocked ? 'lock' : p.icon, 14)),
              h(
                'div',
                { style: { flex: '1 1 auto' } },
                h('div', { style: { fontWeight: 600 } }, p.name),
                p.role ? h('div', { className: 'sa-muted' }, p.role) : null
              ),
              isCurrent ? renderIcon('check', 16) : null
            );
          })
        )
      ),

      /* Roleplay Scenarios Sheet (Language Mode) */
      renderSheet(
        {
          open: roleplaySheetOpen,
          onClose: function () { setRoleplaySheetOpen(false); },
          title: 'Рольові сценарії (' + cefrLevel + ')'
        },
        h(
          'div',
          { className: 'sa-stack-sm' },
          roleplayScenarios.map(function (sc) {
            var isCurrent = selectedScenario && selectedScenario.id === sc.id;
            return h(
              'button',
              {
                key: sc.id,
                type: 'button',
                className: 'sa-option-btn' + (isCurrent ? ' is-selected' : ''),
                onClick: function () {
                  setSelectedScenario(sc);
                  setRoleplaySheetOpen(false);
                  startLessonWith(sc.title, sc, true);
                }
              },
              h('span', { className: 'sa-option-key' }, renderIcon('messageSquare', 14)),
              h(
                'div',
                { style: { flex: '1 1 auto' } },
                h(
                  'div',
                  { className: 'sa-row-between' },
                  h('strong', null, sc.title),
                  h('span', { className: 'sa-badge' }, sc.level)
                ),
                h('div', { className: 'sa-muted' }, sc.context)
              )
            );
          })
        )
      )
    );
  }

  /* ------------------------------------------------------------------------
     TAB 3: ExamsView ({ state, store })
     ------------------------------------------------------------------------ */

  var QUESTION_SECONDS = 45;
  var MICRO_VERIFY_SECONDS = 20;

  function calibrateNmtScore(correctCount, totalCount) {
    var SC = getCurriculum();
    if (SC && typeof SC.convertRawToNmt === 'function') {
      return SC.convertRawToNmt(correctCount, totalCount);
    }
    if (!totalCount) return 100;
    var ratio = correctCount / totalCount;
    return Math.round(100 + ratio * 100);
  }

  function formatDetectionResult(rawResult) {
    var nowStr = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (Array.isArray(rawResult)) {
      return rawResult.map(function (entry, idx) {
        if (typeof entry === 'string') return { id: 'log_' + idx, time: nowStr, text: entry, status: 'ok' };
        return {
          id: entry.id || 'log_' + idx,
          time: entry.time || nowStr,
          text: entry.message || entry.detail || entry.label || JSON.stringify(entry),
          status: entry.detected ? 'warn' : 'ok'
        };
      });
    }
    if (rawResult && typeof rawResult === 'object') {
      if (Array.isArray(rawResult.logs) && rawResult.logs.length) {
        return formatDetectionResult(rawResult.logs);
      }
      if (Array.isArray(rawResult.findings) && rawResult.findings.length) {
        return formatDetectionResult(rawResult.findings);
      }
      if (rawResult.blocked) {
        return [
          {
            id: 'log_0',
            time: nowStr,
            text: 'Щит ШІ-розширень активний: тестовий інжектор (' + (rawResult.signature || 'probe') + ') перехоплено та заблоковано.',
            status: 'ok'
          }
        ];
      }
      return [
        {
          id: 'log_0',
          time: nowStr,
          text: rawResult.message || (rawResult.detected ? 'Виявлено підозрілий DOM-інжектор ШІ-розширення.' : 'Перевірку завершено: сторонніх інжекторів не знайдено.'),
          status: rawResult.detected ? 'warn' : 'ok'
        }
      ];
    }
    if (typeof rawResult === 'string' && rawResult.trim()) {
      return [{ id: 'log_0', time: nowStr, text: rawResult, status: 'ok' }];
    }
    return [
      { id: 'log_0', time: nowStr, text: 'DOM і shadowRoot сканування завершено: сторонніх ШІ-оверлеїв не виявлено.', status: 'ok' }
    ];
  }

  function ExamsView(props) {
    var state = props.state || {};
    var store = props.store || {};
    var theme = state.theme || 'light';

    var examSubjects = useMemo(getExamSubjects, []);
    var gradeBands = useMemo(getGradeBands, []);

    var [phase, setPhase] = useState('lobby'); /* 'lobby' | 'active' | 'results' */
    var [examMode, setExamMode] = useState('sprint'); /* 'full' | 'sprint' | 'cat' */
    var [examSubject, setExamSubject] = useState(examSubjects[0].id);
    var initExamGrade = (state.goals && state.goals.gradeBand) || (state.profile && state.profile.gradeBand) || 'nmt-200';
    if (initExamGrade === 'NMT 200' || initExamGrade === 'nmt') initExamGrade = 'nmt-200';
    var [examGradeBand, setExamGradeBand] = useState(initExamGrade);

    /* Lobby Anti-Cheat Extension Check Log */
    var [extensionLogs, setExtensionLogs] = useState([]);
    var [extensionWarned, setExtensionWarned] = useState(false);

    /* Active Exam State */
    var [questions, setQuestions] = useState([]);
    var [qIndex, setQIndex] = useState(0);
    var [selectedOption, setSelectedOption] = useState(null);
    var [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);
    var [sessionToken, setSessionToken] = useState('SES-0000');
    var [trustScore, setTrustScore] = useState(100);
    var [strikes, setStrikes] = useState(0);
    var [blurCount, setBlurCount] = useState(0);
    var [answers, setAnswers] = useState([]);
    var [zoomOpen, setZoomOpen] = useState(false);

    /* 20s Micro-Verification Bottom Sheet */
    var [microOpen, setMicroOpen] = useState(false);
    var [microTimeLeft, setMicroTimeLeft] = useState(MICRO_VERIFY_SECONDS);
    var [microChoice, setMicroChoice] = useState(null);
    var [microShowHint, setMicroShowHint] = useState(false);
    var [microStatus, setMicroStatus] = useState('pending'); /* 'pending' | 'passed' | 'failed' */
    var [pendingNextPayload, setPendingNextPayload] = useState(null);

    /* Results Filter */
    var [resultsFilter, setResultsFilter] = useState('all'); /* 'all' | 'errors' */

    var canvasRef = useRef(null);
    var zoomCanvasRef = useRef(null);
    var frameRef = useRef(null);
    var guardRef = useRef(null);
    var questionStartRef = useRef(Date.now());
    var answersRef = useRef([]);
    var qIndexRef = useRef(0);
    var questionsRef = useRef([]);
    var trustRef = useRef(100);
    var blurRef = useRef(0);
    var microStatusRef = useRef('pending');
    var phaseRef = useRef('lobby');
    var selectedOptionRef = useRef(null);
    var microChoiceRef = useRef(null);
    var pendingNextPayloadRef = useRef(null);
    var microOpenRef = useRef(false);

    answersRef.current = answers;
    qIndexRef.current = qIndex;
    questionsRef.current = questions;
    trustRef.current = trustScore;
    blurRef.current = blurCount;
    microStatusRef.current = microStatus;
    phaseRef.current = phase;
    selectedOptionRef.current = selectedOption;
    microChoiceRef.current = microChoice;
    pendingNextPayloadRef.current = pendingNextPayload;
    microOpenRef.current = microOpen;

    var [containerWidth, setContainerWidth] = useState(356);

    useEffect(function () {
      function measure() {
        if (frameRef.current && frameRef.current.clientWidth > 0) {
          setContainerWidth(frameRef.current.clientWidth);
        } else if (typeof global.innerWidth === 'number') {
          setContainerWidth(Math.max(280, Math.min(400, global.innerWidth - 48)));
        }
      }
      measure();
      if (typeof global.addEventListener === 'function') {
        global.addEventListener('resize', measure);
        return function () {
          global.removeEventListener('resize', measure);
        };
      }
    }, [phase]);

    var currentQ = phase === 'active' && questions[qIndex] ? questions[qIndex] : null;

    /* Render Anti-OCR Question Canvas */
    useEffect(function () {
      if (phase !== 'active' || !currentQ || !canvasRef.current) return;
      var AC = global.StrictMobileAntiCheat;
      if (AC && typeof AC.renderQuestionToCanvas === 'function') {
        AC.renderQuestionToCanvas(canvasRef.current, currentQ, {
          theme: theme,
          sessionToken: sessionToken,
          containerWidth: containerWidth
        });
      } else {
        var ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          canvasRef.current.width = containerWidth;
          canvasRef.current.height = 160;
          ctx.fillStyle = theme === 'dark' ? '#121215' : '#FFFFFF';
          ctx.fillRect(0, 0, containerWidth, 160);
          ctx.fillStyle = theme === 'dark' ? '#FAFAFA' : '#09090B';
          ctx.font = '600 14px Inter, sans-serif';
          ctx.fillText(currentQ.prompt, 16, 40, containerWidth - 32);
        }
      }
    }, [phase, currentQ, theme, sessionToken, containerWidth]);

    /* Render Zoom Modal Canvas */
    useEffect(function () {
      if (!zoomOpen || !currentQ || !zoomCanvasRef.current) return;
      var AC = global.StrictMobileAntiCheat;
      var zoomW = typeof global.innerWidth === 'number' ? Math.min(640, Math.max(320, global.innerWidth - 64)) : 520;
      if (AC && typeof AC.renderQuestionToCanvas === 'function') {
        AC.renderQuestionToCanvas(zoomCanvasRef.current, currentQ, {
          theme: theme,
          sessionToken: sessionToken,
          containerWidth: zoomW
        });
      }
    }, [zoomOpen, currentQ, theme, sessionToken]);

    function stopGuard() {
      if (guardRef.current) {
        if (typeof guardRef.current.destroy === 'function') guardRef.current.destroy();
        else if (typeof guardRef.current.stop === 'function') guardRef.current.stop();
        guardRef.current = null;
      }
    }

    useEffect(function () {
      return function () {
        stopGuard();
      };
    }, []);

    function finalizeExam(finalAnswers, finalTrust, finalBlurs, finalMicroStatus) {
      var metrics = (guardRef.current && typeof guardRef.current.getMetrics === 'function')
        ? guardRef.current.getMetrics()
        : {};
      stopGuard();
      setMicroOpen(false);
      setZoomOpen(false);
      var totalCount = finalAnswers.length || questionsRef.current.length || 1;
      var correctCount = finalAnswers.filter(function (a) { return !!a.isCorrect; }).length;
      var score = calibrateNmtScore(correctCount, totalCount);
      var wrongList = finalAnswers.filter(function (a) { return !a.isCorrect; });
      var weakList = [];
      for (var w = 0; w < wrongList.length; w++) {
        var wt = wrongList[w].question && wrongList[w].question.topic;
        if (wt && weakList.indexOf(wt) === -1) weakList.push(wt);
      }

      if (store && typeof store.completeExamRun === 'function') {
        store.completeExamRun({
          examMode: examMode,
          mode: examMode,
          subjectId: examSubject,
          subject: examSubject,
          gradeBand: examGradeBand,
          score100To200: score,
          score: score,
          correctCount: correctCount,
          totalCount: totalCount,
          trustScore: finalTrust,
          tabBlurCount: finalBlurs,
          weakTopics: weakList,
          errors: wrongList,
          antiCheatSummary: Object.assign({}, metrics, {
            blurCount: finalBlurs,
            tabBlurCount: finalBlurs,
            trustScore: finalTrust
          }),
          microVerified: finalMicroStatus !== 'failed',
          microCheckPassed: finalMicroStatus !== 'failed',
          microCheckStatus: finalMicroStatus,
          answers: finalAnswers
        });
      }
      setPhase('results');
    }

    function advanceOrFinish(nextAnswers, currentWasCorrect) {
      var list = questionsRef.current;
      var idx = qIndexRef.current;

      if (idx + 1 >= list.length) {
        finalizeExam(nextAnswers, trustRef.current, blurRef.current, microStatusRef.current);
        return;
      }

      /* In CAT mode, dynamically pick next question difficulty (1..5) among remaining tail */
      if (examMode === 'cat' && idx + 2 < list.length) {
        var currentDiff = list[idx] ? (list[idx].difficulty || 3) : 3;
        var targetDiff = currentWasCorrect ? Math.min(5, currentDiff + 1) : Math.max(1, currentDiff - 1);
        var bestPos = idx + 1;
        var bestDist = 99;
        for (var k = idx + 1; k < list.length; k++) {
          var d = Math.abs((list[k].difficulty || 3) - targetDiff);
          if (d < bestDist) {
            bestDist = d;
            bestPos = k;
          }
        }
        if (bestPos !== idx + 1) {
          var reordered = list.slice();
          var swapTmp = reordered[idx + 1];
          reordered[idx + 1] = reordered[bestPos];
          reordered[bestPos] = swapTmp;
          setQuestions(reordered);
          questionsRef.current = reordered;
        }
      }

      if (guardRef.current && typeof guardRef.current.markQuestionStart === 'function') {
        guardRef.current.markQuestionStart();
      }
      setQIndex(idx + 1);
      setSelectedOption(null);
      setTimeLeft(QUESTION_SECONDS);
      questionStartRef.current = Date.now();
    }

    function commitQuestionOutcome(chosenIndex, flags) {
      var q = questionsRef.current[qIndexRef.current];
      if (!q) return;

      var elapsedMs = Math.max(100, Date.now() - questionStartRef.current);
      var isForfeited = !!(flags && flags.forfeited);
      var isTimedOut = !!(flags && flags.timedOut);
      var isCorrect = !isForfeited && chosenIndex === q.correctIndex;

      if (guardRef.current && typeof guardRef.current.recordAnswerTiming === 'function') {
        var bio = guardRef.current.recordAnswerTiming(q.id);
        if (bio && typeof bio.trustScore === 'number') {
          setTrustScore(bio.trustScore);
          trustRef.current = bio.trustScore;
        }
      } else if (guardRef.current && typeof guardRef.current.recordAnswer === 'function') {
        guardRef.current.recordAnswer(elapsedMs, isCorrect);
      }

      var entry = {
        question: q,
        selectedIndex: chosenIndex,
        correctIndex: q.correctIndex,
        isCorrect: isCorrect,
        forfeited: isForfeited,
        timedOut: isTimedOut,
        elapsedMs: elapsedMs
      };
      var nextAnswers = answersRef.current.concat([entry]);
      setAnswers(nextAnswers);

      var fastSuspicious = !isForfeited && !isTimedOut && elapsedMs < 2500 && microStatusRef.current === 'pending';
      var isThirdQuestion = qIndexRef.current === 2 && microStatusRef.current === 'pending';

      if (fastSuspicious || isThirdQuestion) {
        setPendingNextPayload({ answers: nextAnswers, wasCorrect: isCorrect });
        setMicroChoice(null);
        setMicroShowHint(false);
        setMicroTimeLeft(MICRO_VERIFY_SECONDS);
        setMicroOpen(true);
        return;
      }

      advanceOrFinish(nextAnswers, isCorrect);
    }

    function handleMicroVerifySubmit(timedOutMicro) {
      var q = questionsRef.current[qIndexRef.current];
      var mv = (q && q.microVerify) || { correctIndex: 0 };
      var passed = !timedOutMicro && microChoiceRef.current === mv.correctIndex;
      var nextStatus = passed ? 'passed' : 'failed';
      setMicroStatus(nextStatus);
      microStatusRef.current = nextStatus;

      if (!passed) {
        setTrustScore(function (prev) {
          var next = Math.max(40, prev - 14);
          trustRef.current = next;
          return next;
        });
      }

      setMicroOpen(false);
      microOpenRef.current = false;
      var payload = pendingNextPayloadRef.current;
      setPendingNextPayload(null);
      pendingNextPayloadRef.current = null;
      if (payload) {
        advanceOrFinish(payload.answers, payload.wasCorrect);
      }
    }

    /* 45-second per-question countdown */
    useEffect(function () {
      if (phase !== 'active' || microOpen) return;
      var timer = global.setInterval(function () {
        setTimeLeft(function (prev) {
          if (prev <= 1) {
            global.clearInterval(timer);
            var choice = selectedOptionRef.current;
            commitQuestionOutcome(choice, { timedOut: choice === null });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return function () {
        global.clearInterval(timer);
      };
    }, [phase, qIndex, microOpen]);

    /* 20-second Micro-Verification countdown */
    useEffect(function () {
      if (!microOpen) return;
      var timer = global.setInterval(function () {
        setMicroTimeLeft(function (prev) {
          if (prev <= 1) {
            global.clearInterval(timer);
            handleMicroVerifySubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return function () {
        global.clearInterval(timer);
      };
    }, [microOpen]);

    function handleProbeExtensions() {
      var AC = global.StrictMobileAntiCheat;
      if (AC && typeof AC.createExamGuard === 'function') {
        var tempGuard = AC.createExamGuard({ sessionToken: 'PROBE-' + Date.now() });
        var raw = typeof tempGuard.simulateExtensionCheck === 'function'
          ? tempGuard.simulateExtensionCheck()
          : { detected: false, message: 'Перевірку виконано: інжекторів не виявлено.' };
        if (raw && typeof raw.then === 'function') {
          raw.then(function (resolved) {
            setExtensionLogs(formatDetectionResult(resolved));
            setExtensionWarned(Boolean(resolved && resolved.detected && !resolved.blocked));
            if (typeof tempGuard.stop === 'function') tempGuard.stop();
          });
        } else {
          setExtensionLogs(formatDetectionResult(raw));
          setExtensionWarned(Boolean(raw && raw.detected && !raw.blocked));
          if (typeof tempGuard.stop === 'function') tempGuard.stop();
        }
      } else {
        setExtensionLogs(formatDetectionResult(null));
      }
    }

    function handleStartExam() {
      stopGuard();
      var qSet = getExamQuestions(examSubject, examGradeBand, examMode);
      var newToken = 'NMT-' + Math.random().toString(36).slice(2, 7).toUpperCase();

      setQuestions(qSet);
      questionsRef.current = qSet;
      setQIndex(0);
      qIndexRef.current = 0;
      setSelectedOption(null);
      setTimeLeft(QUESTION_SECONDS);
      setSessionToken(newToken);
      setTrustScore(100);
      trustRef.current = 100;
      setStrikes(0);
      setBlurCount(0);
      blurRef.current = 0;
      setAnswers([]);
      answersRef.current = [];
      setMicroStatus('pending');
      microStatusRef.current = 'pending';
      setMicroOpen(false);
      setExtensionWarned(false);
      questionStartRef.current = Date.now();

      var AC = global.StrictMobileAntiCheat;
      if (AC && typeof AC.createExamGuard === 'function') {
        var guard = AC.createExamGuard({
          sessionToken: newToken,
          maxStrikes: 2,
          onWarning: function (info) {
            var count = (info && typeof info.tabBlurCount === 'number')
              ? info.tabBlurCount
              : ((info && typeof info.strike === 'number') ? info.strike : (blurRef.current + 1));
            setStrikes(1);
            setBlurCount(count);
            blurRef.current = count;
          },
          onForfeitQuestion: function (info) {
            if (phaseRef.current !== 'active') return;
            var count = (info && typeof info.tabBlurCount === 'number')
              ? info.tabBlurCount
              : (blurRef.current + 1);
            setBlurCount(count);
            blurRef.current = count;
            setStrikes(2);
            notifyToast(store, '2-й вихід із вкладки: питання анульовано.');
            if (microOpenRef.current) {
              handleMicroVerifySubmit(true);
            } else {
              commitQuestionOutcome(null, { forfeited: true });
            }
          },
          onBiometricsUpdate: function (metrics) {
            if (metrics && typeof metrics.trustScore === 'number') {
              setTrustScore(metrics.trustScore);
              trustRef.current = metrics.trustScore;
            }
          },
          onExtensionDetected: function (payload) {
            if (payload && payload.simulated) return;
            setExtensionWarned(true);
          }
        });
        if (guard && typeof guard.start === 'function') guard.start();
        if (guard && typeof guard.markQuestionStart === 'function') guard.markQuestionStart();
        guardRef.current = guard;
      }

      setPhase('active');
    }

    /* ---------------- Phase 1: Lobby ---------------- */
    if (phase === 'lobby') {
      var modeList = [
        { id: 'full', label: 'Повний НМТ', desc: '10 завдань із калібруванням 100-200' },
        { id: 'sprint', label: 'Предметний спринт 5 питань', desc: 'Швидка перевірка без перерви' },
        { id: 'cat', label: 'Адаптивний тест CAT', desc: 'Складність підлаштовується після кожної відповіді' }
      ];

      return h(
        'div',
        { className: 'sa-stack' },
        h(
          'div',
          { className: 'sa-stack-sm', style: { gap: '2px' } },
          h('span', { className: 'sa-label' }, 'АРЕНА З НУЛЬОВИМ СПИСУВАННЯМ'),
          h('h2', { className: 'sa-section-title' }, 'Рейтинговий іспит і Античит')
        ),

        /* Mode Cards */
        h(
          'div',
          { className: 'sa-card sa-card-pad sa-stack-sm' },
          h('span', { className: 'sa-label' }, 'ФОРМАТ ІСПИТУ'),
          modeList.map(function (m) {
            var isSel = examMode === m.id;
            return h(
              'button',
              {
                key: m.id,
                type: 'button',
                className: 'sa-option-btn' + (isSel ? ' is-selected' : ''),
                onClick: function () { setExamMode(m.id); }
              },
              h('span', { className: 'sa-option-key' }, renderIcon(isSel ? 'check' : 'target', 14)),
              h(
                'div',
                null,
                h('div', { style: { fontWeight: 600 } }, m.label),
                h('div', { className: 'sa-muted' }, m.desc)
              )
            );
          })
        ),

        /* Subject & Grade Band */
        h(
          'div',
          { className: 'sa-card sa-card-pad sa-stack-sm' },
          h('span', { className: 'sa-label' }, 'ПРЕДМЕТ ТА ВІКОВА ГРУПА'),
          h(
            'div',
            { className: 'sa-chip-scroll' },
            examSubjects.map(function (s) {
              return h(
                'button',
                {
                  key: s.id,
                  type: 'button',
                  className: 'sa-chip' + (examSubject === s.id ? ' is-active' : ''),
                  onClick: function () { setExamSubject(s.id); }
                },
                s.label
              );
            })
          ),
          h(
            'div',
            { className: 'sa-chip-scroll' },
            gradeBands.map(function (g) {
              return h(
                'button',
                {
                  key: g.id,
                  type: 'button',
                  className: 'sa-chip' + (examGradeBand === g.id ? ' is-active' : ''),
                  onClick: function () { setExamGradeBand(g.id); }
                },
                g.label
              );
            })
          )
        ),

        /* Anti-Cheat Guard Card + Extension Probe */
        h(
          'div',
          { className: 'sa-card sa-card-pad sa-stack-sm' },
          h(
            'div',
            { className: 'sa-row-between' },
            h(
              'div',
              { className: 'sa-row' },
              renderIcon('shieldCheck', 18),
              h('h3', { className: 'sa-card-title' }, 'Захист Anti-OCR та Telemetry')
            ),
            h('span', { className: 'sa-badge sa-badge-ok' }, 'Готово')
          ),
          h(
            'p',
            { className: 'sa-muted' },
            'Питання рендеряться на захищеному Canvas, діє таймер 45 с, ліміт у 2 виходи з вкладки, контроль розширень та 20-секундна мікро-перевірка.'
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'sa-btn sa-btn-secondary sa-btn-sm',
              onClick: handleProbeExtensions
            },
            renderIcon('radar', 14),
            h('span', null, 'Перевірити захист від ШІ-розширень')
          ),
          extensionLogs.length > 0
            ? h(
                'div',
                { className: 'sa-card sa-card-subtle sa-card-pad sa-stack-sm' },
                extensionLogs.map(function (entry) {
                  return h(
                    'div',
                    { key: entry.id, className: 'sa-row-between', style: { fontSize: '12px' } },
                    h('span', null, entry.text),
                    h('span', { className: 'sa-mono', style: { color: 'var(--ink-muted)' } }, entry.time)
                  );
                })
              )
            : null
        ),

        /* Start Exam CTA */
        h(
          'button',
          {
            type: 'button',
            className: 'sa-btn sa-btn-primary sa-btn-lg',
            style: { width: '100%' },
            onClick: handleStartExam
          },
          renderIcon('play', 18),
          h('span', null, 'Розпочати іспит')
        )
      );
    }

    /* ---------------- Phase 2: Active Exam ---------------- */
    if (phase === 'active' && currentQ) {
      var timerPct = Math.max(0, Math.min(100, Math.round((timeLeft / QUESTION_SECONDS) * 100)));
      var timerTone = timeLeft <= 10 ? 'is-danger' : (timeLeft <= 20 ? 'is-warn' : 'is-ok');
      var microPct = Math.max(0, Math.min(100, Math.round((microTimeLeft / MICRO_VERIFY_SECONDS) * 100)));
      var mvData = currentQ.microVerify || { question: '', options: [], hint: '' };

      return h(
        'div',
        { className: 'sa-stack' },

        /* Exam Header: Progress, 45s Bar, Trust Score */
        h(
          'div',
          { className: 'sa-card sa-card-pad sa-stack-sm' },
          h(
            'div',
            { className: 'sa-row-between' },
            h(
              'span',
              { className: 'sa-mono', style: { fontSize: '13px', fontWeight: 700 } },
              'Питання ' + (qIndex + 1) + ' / ' + questions.length
            ),
            h(
              'div',
              { className: 'sa-row' },
              h(
                'span',
                { className: 'sa-badge ' + (trustScore >= 80 ? 'sa-badge-ok' : 'sa-badge-warn') },
                renderIcon('shieldCheck', 12),
                h('span', null, 'Trust ' + trustScore + '%')
              ),
              h(
                'span',
                { className: 'sa-badge ' + (timeLeft <= 10 ? 'sa-badge-danger' : '') },
                renderIcon('timer', 12),
                h('span', { className: 'sa-tabular' }, timeLeft + ' с')
              )
            )
          ),
          h(
            'div',
            { className: 'sa-progress-track' },
            h('div', {
              className: 'sa-progress-fill ' + timerTone,
              style: { width: timerPct + '%' }
            })
          )
        ),

        /* Warning Banner on Strike 1 or Extension Detection */
        strikes === 1 || extensionWarned
          ? h(
              'div',
              { className: 'sa-banner is-danger' },
              renderIcon('alertTriangle', 18),
              h(
                'div',
                { style: { fontSize: '12.5px' } },
                strikes === 1
                  ? 'Попередження 1/2: зафіксовано вихід із вкладки. Наступний вихід автоматично анулює поточне питання.'
                  : 'Виявлено підозрілий DOM-скрипт. Сесію позначено для перевірки довіри.'
              )
            )
          : null,

        /* Anti-OCR Canvas Frame */
        h(
          'div',
          { className: 'sa-stack-sm' },
          h(
            'div',
            { ref: frameRef, className: 'sa-canvas-frame' },
            h('canvas', { ref: canvasRef })
          ),
          h(
            'div',
            { className: 'sa-row-between' },
            h('span', { className: 'sa-badge' }, currentQ.format || 'context_case'),
            h(
              'button',
              {
                type: 'button',
                className: 'sa-btn sa-btn-secondary sa-btn-sm',
                onClick: function () { setZoomOpen(true); }
              },
              renderIcon('eye', 14),
              h('span', null, 'Збільшити схему')
            )
          )
        ),

        /* 4 Answer Options */
        h(
          'div',
          { className: 'sa-stack-sm' },
          currentQ.options.map(function (opt, idx) {
            var isSel = selectedOption === idx;
            return h(
              'button',
              {
                key: idx,
                type: 'button',
                className: 'sa-option-btn' + (isSel ? ' is-selected' : ''),
                onClick: function () { setSelectedOption(idx); }
              },
              h('span', { className: 'sa-option-key' }, OPTION_KEYS[idx] || String(idx + 1)),
              h('span', null, opt)
            );
          })
        ),

        /* Confirm Answer CTA (No going back) */
        h(
          'button',
          {
            type: 'button',
            className: 'sa-btn sa-btn-primary sa-btn-lg',
            style: { width: '100%' },
            disabled: selectedOption === null,
            onClick: function () {
              commitQuestionOutcome(selectedOption, {});
            }
          },
          h('span', null, 'Підтвердити відповідь'),
          renderIcon('arrowRight', 16)
        ),

        /* Zoom Modal */
        renderModal(
          {
            open: zoomOpen,
            onClose: function () { setZoomOpen(false); },
            title: 'Збільшений перегляд схеми'
          },
          h(
            'div',
            { className: 'sa-stack-sm' },
            h(
              'div',
              { className: 'sa-canvas-frame' },
              h('canvas', { ref: zoomCanvasRef })
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'sa-btn sa-btn-secondary',
                onClick: function () { setZoomOpen(false); }
              },
              'Закрити'
            )
          )
        ),

        /* 20-Second Micro-Verification Bottom Sheet */
        renderSheet(
          {
            open: microOpen,
            onClose: function () {},
            title: '20-секундна мікро-перевірка'
          },
          h(
            'div',
            { className: 'sa-stack' },
            h(
              'div',
              { className: 'sa-row-between' },
              h('span', { className: 'sa-badge sa-badge-warn' }, 'Підтвердіть хід думок'),
              h('span', { className: 'sa-mono', style: { fontWeight: 700 } }, microTimeLeft + ' с')
            ),
            h(
              'div',
              { className: 'sa-progress-track' },
              h('div', {
                className: 'sa-progress-fill ' + (microTimeLeft <= 6 ? 'is-danger' : 'is-warn'),
                style: { width: microPct + '%' }
              })
            ),
            h('div', { style: { fontWeight: 600, fontSize: '14px' } }, mvData.question),
            h(
              'div',
              { className: 'sa-stack-sm' },
              (mvData.options || []).map(function (opt, idx) {
                var isSel = microChoice === idx;
                return h(
                  'button',
                  {
                    key: idx,
                    type: 'button',
                    className: 'sa-option-btn' + (isSel ? ' is-selected' : ''),
                    onClick: function () { setMicroChoice(idx); }
                  },
                  h('span', { className: 'sa-option-key' }, String(idx + 1)),
                  h('span', null, opt)
                );
              })
            ),
            microShowHint && mvData.hint
              ? h(
                  'div',
                  { className: 'sa-banner is-ok' },
                  renderIcon('spark', 16),
                  h('div', { style: { fontSize: '12.5px' } }, mvData.hint)
                )
              : null,
            h(
              'div',
              { className: 'sa-row' },
              h(
                'button',
                {
                  type: 'button',
                  className: 'sa-btn sa-btn-secondary',
                  onClick: function () { setMicroShowHint(true); }
                },
                renderIcon('eye', 14),
                h('span', null, 'Підказка')
              ),
              h(
                'button',
                {
                  type: 'button',
                  className: 'sa-btn sa-btn-primary',
                  style: { flex: '1 1 0' },
                  disabled: microChoice === null,
                  onClick: function () { handleMicroVerifySubmit(false); }
                },
                renderIcon('checkCircle', 15),
                h('span', null, 'Підтвердити перевірку')
              )
            )
          )
        )
      );
    }

    /* ---------------- Phase 3: Results ---------------- */
    var totalCount = answers.length || 1;
    var correctCount = answers.filter(function (a) { return !!a.isCorrect; }).length;
    var finalScore = calibrateNmtScore(correctCount, totalCount);

    var filteredAnswers = resultsFilter === 'errors'
      ? answers.filter(function (a) { return !a.isCorrect; })
      : answers;

    var microLabel = microStatus === 'passed'
      ? 'Підтверджено'
      : (microStatus === 'failed' ? 'Не пройдено' : 'Не вимагався');

    return h(
      'div',
      { className: 'sa-stack' },

      /* Calibrated Score KPI Card */
      h(
        'div',
        { className: 'sa-card sa-card-pad sa-stack' },
        h(
          'div',
          { className: 'sa-row-between' },
          h(
            'div',
            null,
            h('span', { className: 'sa-label' }, 'КАЛІБРОВАНИЙ РЕЗУЛЬТАТ НМТ'),
            h('div', { className: 'sa-kpi-lg', style: { marginTop: '4px' } }, finalScore + ' / 200')
          ),
          h(
            'div',
            { style: { textAlign: 'right' } },
            h('span', { className: 'sa-label' }, 'ПРАВИЛЬНИХ'),
            h('div', { className: 'sa-kpi-md', style: { marginTop: '4px' } }, correctCount + ' / ' + answers.length)
          )
        ),
        h(
          'div',
          { className: 'sa-row-wrap' },
          h(
            'span',
            { className: 'sa-badge ' + (trustScore >= 80 ? 'sa-badge-ok' : 'sa-badge-warn') },
            renderIcon('shieldCheck', 12),
            h('span', null, 'Trust Score: ' + trustScore + '%')
          ),
          h(
            'span',
            { className: 'sa-badge ' + (blurCount === 0 ? 'sa-badge-ok' : 'sa-badge-danger') },
            renderIcon('eyeOff', 12),
            h('span', null, 'Tab Blur: ' + blurCount)
          ),
          h(
            'span',
            { className: 'sa-badge ' + (microStatus === 'passed' ? 'sa-badge-ok' : (microStatus === 'failed' ? 'sa-badge-danger' : '')) },
            renderIcon('timer', 12),
            h('span', null, '20s Micro-Check: ' + microLabel)
          )
        )
      ),

      /* Segmented Filter */
      h(
        'div',
        { className: 'sa-segmented', style: { width: '100%' } },
        h(
          'button',
          {
            type: 'button',
            className: resultsFilter === 'all' ? 'is-active' : '',
            style: { flex: '1 1 0' },
            'aria-pressed': resultsFilter === 'all',
            onClick: function () { setResultsFilter('all'); }
          },
          'Усі питання (' + answers.length + ')'
        ),
        h(
          'button',
          {
            type: 'button',
            className: resultsFilter === 'errors' ? 'is-active' : '',
            style: { flex: '1 1 0' },
            'aria-pressed': resultsFilter === 'errors',
            onClick: function () { setResultsFilter('errors'); }
          },
          'Лише помилки (' + (answers.length - correctCount) + ')'
        )
      ),

      /* Answer Breakdown + Tutor Error Handoff */
      filteredAnswers.length === 0
        ? h(
            'div',
            { className: 'sa-banner is-ok' },
            renderIcon('checkCircle', 18),
            h('div', null, 'Помилок не виявлено! Усі відповіді правильні.')
          )
        : h(
            'div',
            { className: 'sa-stack-sm' },
            filteredAnswers.map(function (item, idx) {
              var q = item.question;
              var userAnswerText = item.forfeited
                ? 'Анульовано через вихід із вкладки'
                : (item.timedOut || item.selectedIndex === null
                    ? 'Час вийшов'
                    : (OPTION_KEYS[item.selectedIndex] + ': ' + q.options[item.selectedIndex]));
              var correctText = OPTION_KEYS[q.correctIndex] + ': ' + q.options[q.correctIndex];

              return h(
                'div',
                { key: q.id + '_' + idx, className: 'sa-card sa-card-pad sa-stack-sm' },
                h(
                  'div',
                  { className: 'sa-row-between' },
                  h('span', { className: 'sa-badge' }, q.topic),
                  h(
                    'span',
                    { className: 'sa-badge ' + (item.isCorrect ? 'sa-badge-ok' : 'sa-badge-danger') },
                    renderIcon(item.isCorrect ? 'checkCircle' : 'x', 12),
                    h('span', null, item.isCorrect ? 'Правильно' : (item.forfeited ? 'Анульовано' : 'Помилка'))
                  )
                ),
                h('div', { style: { fontWeight: 600, fontSize: '13.5px' } }, q.prompt),
                h('div', { className: 'sa-muted' }, 'Ваша відповідь: ' + userAnswerText),
                !item.isCorrect
                  ? h('div', { style: { fontSize: '12.5px', fontWeight: 600 } }, 'Правильно: ' + correctText)
                  : null,
                h('p', { className: 'sa-muted' }, q.explanation),
                !item.isCorrect
                  ? h(
                      'button',
                      {
                        type: 'button',
                        className: 'sa-btn sa-btn-secondary sa-btn-sm',
                        onClick: function () {
                          var topicLabel = q.topic || findSubjectLabel('school', examSubject);
                          if (store && typeof store.openTutorWithTopic === 'function') {
                            store.openTutorWithTopic({
                              mode: 'school',
                              subjectId: q.subjectId || q.subject || examSubject,
                              subject: q.subjectId || q.subject || examSubject,
                              gradeBand: q.gradeBand || examGradeBand,
                              topicTitle: topicLabel,
                              topic: topicLabel,
                              errorContext: item,
                              promptText: 'Розбери мою помилку у завданні: ' + q.prompt,
                              prompt: 'Розбери мою помилку у завданні: ' + q.prompt
                            });
                          } else if (store && typeof store.setActiveTab === 'function') {
                            store.setActiveTab('tutor');
                          }
                        }
                      },
                      renderIcon('spark', 14),
                      h('span', null, 'Розібрати помилку з Репетитором')
                    )
                  : null
              );
            })
          ),

      /* Restart Exam CTA */
      h(
        'button',
        {
          type: 'button',
          className: 'sa-btn sa-btn-primary sa-btn-lg',
          style: { width: '100%' },
          onClick: function () { setPhase('lobby'); }
        },
        renderIcon('refresh', 16),
        h('span', null, 'Новий тест')
      )
    );
  }

  global.StrictMobileViewsStudy = {
    TodayView: TodayView,
    TutorView: TutorView,
    ExamsView: ExamsView
  };
})(typeof window !== 'undefined' ? window : globalThis);
