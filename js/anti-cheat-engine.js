/**
 * StrictAI - Anti-Cheat, Canvas OCR-Shield & Biometrics Engine
 * File: js/anti-cheat-engine.js
 * 
 * Strict academic integrity engine built for LeetCode / Brilliant design aesthetics:
 * - Dynamic Canvas Rendering with Anti-OCR Shield & Multi-Component Diagrams
 * - Browser Lockdown (Hotkeys, Context Menu, DevTools, Text Selection)
 * - Tab/Window Focus Blur Detection with 2-Strike Question Locking
 * - AI Extension Shield (MutationObserver for Monica, Sider, Merlin, MaxAI + Simulation)
 * - One-Way Question Hard-Timer (30–60s) with Progress Bar
 * - AI-Resilient Pedagogical Questions Repository (4 Formats: context_case, visual_schema, find_the_bug, llm_trap)
 * - Computerized Adaptive Testing (CAT) Routing Engine
 * - 20-second Micro-Verification Blitz Modal
 * - Behavioral Biometrics Engine (Keystroke Dynamics, Mouse Entropy, Anti-Bot Submission Anomaly)
 * - React Components & Standalone DOM API
 */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.StrictAntiCheat = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  /* ==========================================================================
     0. EMBEDDED STYLES & DESIGN SYSTEM TOKENS
     LeetCode + Brilliant Dark Graphite Theme
     ========================================================================== */
  const CSS_STYLES = `
    :root {
      --ac-bg-base: #121212;
      --ac-bg-surface: #1e1e1e;
      --ac-bg-elevated: #282828;
      --ac-bg-card-hover: #323232;
      --ac-border-subtle: #333333;
      --ac-border-focus: #4a4a4a;
      --ac-text-primary: #eff1f6;
      --ac-text-secondary: #9ca3af;
      --ac-accent-primary: #ffa116; /* LeetCode Amber */
      --ac-accent-success: #2cbb5d; /* Brilliant Emerald */
      --ac-accent-danger: #ef4743;
      --ac-radius-sm: 6px;
      --ac-radius-md: 10px;
      --ac-radius-lg: 14px;
      --ac-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }

    [data-theme="light"] {
      --ac-bg-base: #f7f7f8;
      --ac-bg-surface: #ffffff;
      --ac-bg-elevated: #f0f0f2;
      --ac-bg-card-hover: #e8e8ec;
      --ac-border-subtle: #e2e4e9;
      --ac-border-focus: #c5c8d0;
      --ac-text-primary: #141417;
      --ac-text-secondary: #64748b;
    }

    /* OCR Shield Canvas Container */
    .strict-canvas-shield-wrapper {
      position: relative;
      display: inline-block;
      width: 100%;
      border-radius: var(--ac-radius-md);
      overflow: hidden;
      background: var(--ac-bg-surface);
      border: 1px solid var(--ac-border-subtle);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      user-select: none !important;
      -webkit-user-select: none !important;
    }

    .strict-canvas-shield {
      display: block;
      width: 100%;
      height: auto;
      pointer-events: auto;
      cursor: default;
    }

    /* Canvas Watermark Badge */
    .strict-canvas-watermark-tag {
      position: absolute;
      bottom: 8px;
      right: 12px;
      font-size: 10px;
      font-family: var(--ac-font-mono);
      color: rgba(239, 241, 246, 0.4);
      background: rgba(18, 18, 18, 0.6);
      padding: 2px 8px;
      border-radius: 4px;
      pointer-events: none;
      letter-spacing: 0.5px;
    }

    /* Lockdown Banner */
    .strict-lockdown-banner {
      position: fixed;
      top: 18px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 22px;
      background: #ef4743;
      color: #ffffff;
      border-radius: 9999px;
      box-shadow: 0 8px 30px rgba(239, 71, 67, 0.5);
      font-weight: 600;
      font-size: 13.5px;
      animation: strict-slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      white-space: nowrap;
      pointer-events: none;
    }

    @keyframes strict-slide-down {
      from { transform: translate(-50%, -100%); opacity: 0; }
      to { transform: translate(-50%, 0); opacity: 1; }
    }

    /* Modal Backdrop */
    .strict-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(10, 10, 10, 0.85);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 100000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
      animation: strict-fade-in 0.2s ease-out;
    }

    .strict-modal-backdrop.active,
    #strict-extension-modal,
    #strict-micro-verify-modal {
      display: flex;
    }

    @keyframes strict-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Modal Card */
    .strict-modal-card {
      background: var(--ac-bg-surface);
      border: 1px solid var(--ac-border-subtle);
      border-radius: var(--ac-radius-lg);
      width: 100%;
      max-width: 540px;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6);
      padding: 24px;
      color: var(--ac-text-primary);
      position: relative;
    }

    .strict-modal-card.danger {
      border-color: rgba(239, 71, 67, 0.5);
    }

    .strict-modal-card.amber {
      border-color: rgba(255, 161, 22, 0.5);
    }

    /* Timer Bar */
    .strict-timer-bar-track {
      width: 100%;
      height: 6px;
      background: var(--ac-bg-elevated);
      border-radius: 9999px;
      overflow: hidden;
      margin: 12px 0;
      position: relative;
    }

    .strict-timer-bar-fill {
      height: 100%;
      background: var(--ac-accent-primary);
      transition: width 0.1s linear, background-color 0.3s ease;
      border-radius: 9999px;
    }

    .strict-timer-bar-fill.critical {
      background: var(--ac-accent-danger);
    }

    /* Strict Buttons */
    .strict-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 38px;
      padding: 0 16px;
      font-size: 13.5px;
      font-weight: 600;
      border-radius: var(--ac-radius-sm);
      border: 1px solid transparent;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
      font-family: inherit;
    }

    .strict-btn-primary {
      background: var(--ac-accent-primary);
      color: #121212;
    }
    .strict-btn-primary:hover {
      background: #e69113;
      transform: translateY(-1px);
    }

    .strict-btn-success {
      background: var(--ac-accent-success);
      color: #ffffff;
    }
    .strict-btn-success:hover {
      background: #249d4e;
      transform: translateY(-1px);
    }

    .strict-btn-danger {
      background: var(--ac-accent-danger);
      color: #ffffff;
    }
    .strict-btn-danger:hover {
      background: #d83a37;
      transform: translateY(-1px);
    }

    .strict-btn-secondary {
      background: var(--ac-bg-elevated);
      border-color: var(--ac-border-subtle);
      color: var(--ac-text-primary);
    }
    .strict-btn-secondary:hover {
      background: var(--ac-bg-card-hover);
      border-color: var(--ac-border-focus);
    }

    /* Biometrics Meter Pill */
    .strict-trust-meter-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 30px;
      padding: 0 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      font-family: var(--ac-font-mono);
      background: var(--ac-bg-elevated);
      border: 1px solid var(--ac-border-subtle);
    }
    .strict-trust-meter-badge.high {
      border-color: rgba(44, 187, 93, 0.4);
      color: var(--ac-accent-success);
    }
    .strict-trust-meter-badge.medium {
      border-color: rgba(255, 161, 22, 0.4);
      color: var(--ac-accent-primary);
    }
    .strict-trust-meter-badge.danger {
      border-color: rgba(239, 71, 67, 0.4);
      color: var(--ac-accent-danger);
    }

    @keyframes strict-pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.35; transform: scale(0.85); }
    }
  `;

  function injectStyles() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('strict-anti-cheat-css')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'strict-anti-cheat-css';
    styleEl.textContent = CSS_STYLES;
    document.head.appendChild(styleEl);
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectStyles);
    } else {
      injectStyles();
    }
  }

  /* ==========================================================================
     1. AI-RESILIENT PEDAGOGICAL QUESTIONS REPOSITORY
     4 Formats: context_case, visual_schema, find_the_bug, llm_trap
     Covers: Math, Ukrainian, History, English, STEM/Logic
     ========================================================================== */
  const AI_RESILIENT_QUESTIONS = [
    // -------------------------------------------------------------------------
    // FORMAT 1: context_case (Таблиця контексту з прихованою системною помилкою)
    // -------------------------------------------------------------------------
    {
      id: 'AC-CASE-MATH-01',
      type: 'context_case',
      subject: 'math',
      subjectName: 'Математика & Бізнес-аналітика (StrictAI Case)',
      difficulty: 3,
      title: 'Аудит розрахунків фінансової моделі StrictAI EdTech',
      statement: 'Проаналізуйте звіт фінансового аналітика курсу StrictAI. У таблиці наведено дані ефективності 4 каналів залучення учнів за місяць. Один із рядків містить грубу методологічну помилку в розрахунку вартості залучення клієнта (CAC = Витрати / Кількість залучених клієнтів). Знайдіть рядок із помилкою:',
      tableData: {
        headers: ['Канал', 'Витрати (грн)', 'Кліки', 'Конверсія (%)', 'Клієнти', 'Заявлений CAC (грн)'],
        rows: [
          ['1. Контекстна реклама (Search)', '45 000', '1 500', '4.0%', '60', '750 грн'],
          ['2. Освітній YouTube & подкасти', '32 000', '800', '5.0%', '40', '800 грн'],
          ['3. Таргетована реклама (Social)', '60 000', '2 000', '2.5%', '50', '30 грн'],
          ['4. Партнерська програма (Affiliate)', '28 000', '700', '5.0%', '35', '800 грн']
        ]
      },
      options: [
        { id: 'A', text: 'Рядок 1: CAC мав би становити 900 грн, а не 750 грн' },
        { id: 'B', text: 'Рядок 2: помилка в підрахунку клієнтів (800 * 5% = 48, а не 40)' },
        { id: 'C', text: 'Рядок 3: розраховано CPC (60 000 / 2 000 = 30 грн) замість реального CAC (60 000 / 50 = 1 200 грн)' },
        { id: 'D', text: 'Рядок 4: CAC має дорівнювати 700 грн через комісійний збір' }
      ],
      correctOption: 'C',
      timeLimit: 45,
      explanation: 'У рядку 3 аналітик помилково розділив бюджет на кліки (60 000 / 2000 = 30 грн, тобто CPC), замість кількості клієнтів (60 000 / 50 = 1 200 грн). Стандартні LLM часто не перевіряють арифметичні стовпчики в таблиці і губляться між CPC і CAC.',
      microVerificationPrompt: 'Яким має бути істинне значення CAC для рядка 3 та чому виникла плутанина?',
      microVerificationExpectedKeywords: ['1200', '1 200', 'cpc', 'кліки', 'клієнт']
    },
    {
      id: 'AC-CASE-UKR-02',
      type: 'context_case',
      subject: 'ukrainian',
      subjectName: 'Українська мова (Діловий контекст)',
      difficulty: 2,
      title: 'Редагування регламенту академічної доброчесності',
      statement: 'Перед вами витяг із внутрішнього регламенту платформи StrictAI. У якому пункті допущено лексичну помилку (вживання пароніма у невластивому значенні)?',
      tableData: {
        headers: ['Пункт', 'Положення регламенту платформи StrictAI'],
        rows: [
          ['Пункт 1', 'Кожен слухач курсу має неухильно дотримуватися вимог академічної доброчесності.'],
          ['Пункт 2', 'Система біометричного моніторингу гарантує абсолютну безпечність персональних даних.'],
          ['Пункт 3', 'Для розв’язання складних завдань студенти впроваджують ефектні математичні моделі оптимізації.'],
          ['Пункт 4', 'У разі повторного виходу з вкладки доступ до тесту скасовується без права апеляції.']
        ]
      },
      options: [
        { id: 'A', text: 'Пункт 1: треба «слідкувати вимогам» замість «дотримуватися вимог»' },
        { id: 'B', text: 'Пункт 2: треба «безпеку» замість «безпечність»' },
        { id: 'C', text: 'Пункт 3: лексична помилка — треба «ефективні моделі» (дієві), а не «ефектні» (ті, що справляють враження)' },
        { id: 'D', text: 'Пункт 4: помилка в керуванні — треба «скасовується за відсутності апеляції»' }
      ],
      correctOption: 'C',
      timeLimit: 45,
      explanation: 'Пароніми «ефектний» (вражаючий зовнішнім виглядом) та «ефективний» (дієвий, результативний). Для математичних алгоритмів коректним є лише «ефективні моделі».',
      microVerificationPrompt: 'Поясніть різницю між словами «ефектний» та «ефективний» у цьому контексті.',
      microVerificationExpectedKeywords: ['ефективний', 'дієвий', 'результат', 'враження', 'паронім']
    },
    {
      id: 'AC-CASE-HIST-03',
      type: 'context_case',
      subject: 'history',
      subjectName: 'Історія України (XVII ст. — Гетьманщина)',
      difficulty: 4,
      title: 'Аудит статей українсько-московських договорів',
      statement: 'У таблиці зіставлено українсько-московські міждержавні угоди другої половини XVII ст. У якому рядку допущено фактичну історичну помилку щодо умов чи підписанта?',
      tableData: {
        headers: ['Договір', 'Рік', 'Гетьман', 'Ключове обмеження автономії'],
        rows: [
          ['1. Березневі статті', '1654', 'Богдан Хмельницький', 'Заборона дипломатичних зносин з Польщею та Османською імперією'],
          ['2. Переяславські статті', '1659', 'Юрій Хмельницький', 'Московські воєводи розміщуються в 5 містах, заборона обирати гетьмана без царя'],
          ['3. Глухівські статті', '1669', 'Дем’ян Многогрішний', 'Реєстр встановлено у 30 000 осіб, податки збирають московські воєводи'],
          ['4. Коломацькі статті', '1687', 'Іван Мазепа', 'Заборона гетьману позбавляти старшину посад без суду, заохочення мішаних шлюбів']
        ]
      },
      options: [
        { id: 'A', text: 'Рядок 1: Березневі статті підписано 1656 року' },
        { id: 'B', text: 'Рядок 2: Переяславські статті підписав Іван Виговський' },
        { id: 'C', text: 'Рядок 3: помилка — за Глухівськими статтями податки збирала українська старшина, а реєстр становив 30 тис.' },
        { id: 'D', text: 'Рядок 4: пункт про заохочення мішаних шлюбів з’явився лише в Решетилівських статтях' }
      ],
      correctOption: 'C',
      timeLimit: 50,
      explanation: 'Глухівські статті 1669 р. навпаки повернули збір податків до рук козацької старшини (на відміну від Батуринських чи Московських статей Брюховецького), а реєстр складав 30 тис. вояків.',
      microVerificationPrompt: 'Хто збирав податки за Глухівськими статтями 1669 року: московські воєводи чи козацька старшина?',
      microVerificationExpectedKeywords: ['старшина', 'козацька', 'українська', 'не воєводи']
    },
    {
      id: 'AC-CASE-STEM-04',
      type: 'context_case',
      subject: 'stem',
      subjectName: 'Логіка & Системна інженерія',
      difficulty: 4,
      title: 'Аудит затримок мікросервісного конвеєра StrictAI',
      statement: 'Тестовий стенд StrictAI виміряв послідовні синхронні затримки 4 мікросервісів при обробці одного запиту студента. Один із рядків аудиту містить хибний висновок щодо критичного шляху затримки системи:',
      tableData: {
        headers: ['Сервіс', 'Середня затримка (Avg)', '99-й перцентиль (p99)', 'Висновок аудитора'],
        rows: [
          ['1. Auth & Session Guard', '12 мс', '45 мс', 'Норма (відповідає SLA < 50мс)'],
          ['2. Canvas OCR Shield Gen', '35 мс', '80 мс', 'Норма (високе навантаження на CPU)'],
          ['3. Biometrics Entropy Filter', '18 мс', '210 мс', 'Аномалія: високий розкид p99 через GC-паузи'],
          ['4. Загальний синхронний час', '65 мс', '110 мс', 'Синхронний p99 дорівнює максимальному з окремих p99']
        ]
      },
      options: [
        { id: 'A', text: 'Рядок 1: середня затримка занадто висока' },
        { id: 'B', text: 'Рядок 2: генерація полотна не може займати 35 мс' },
        { id: 'C', text: 'Рядок 3: розкид затримок викликаний мережею, а не GC' },
        { id: 'D', text: 'Рядок 4: помилка — для послідовного ланцюга загальний p99 не дорівнює max(p99), а накопичується і значно перевищує 210 мс' }
      ],
      correctOption: 'D',
      timeLimit: 45,
      explanation: 'У послідовній системі перцентилі не вибираються через max(). Загальна затримка послідовних незалежних кроків сумується, отже p99 ланцюга буде > 210 мс, а не 110 мс.',
      microVerificationPrompt: 'Чому перцентиль p99 послідовного ланцюга не можна обчислювати як max(p99)?',
      microVerificationExpectedKeywords: ['послідовн', 'сум', 'накопич', 'композиц', 'хвіст']
    },

    // -------------------------------------------------------------------------
    // FORMAT 2: visual_schema (Багатокомпонентні візуальні завдання на Canvas)
    // -------------------------------------------------------------------------
    {
      id: 'AC-VIS-MATH-05',
      type: 'visual_schema',
      subject: 'math',
      subjectName: 'Математика (НМТ) — Аналіз графіка похідної',
      difficulty: 3,
      title: 'Дослідження графіка похідної функції y = f\'(x)',
      statement: 'На наведеному вище полотні зображено графік ПОХІДНОЇ функції y = f\'(x), визначеної на проміжку [-4; 5]. Користуючись виключно графіком похідної, визначте кількість точок ЛОКАЛЬНОГО МІНІМУМУ самої функції y = f(x) на цьому проміжку:',
      visualDiagram: {
        type: 'function_graph',
        xMin: -4,
        xMax: 5,
        yMin: -3,
        yMax: 3,
        extrema: [
          { x: -3, y: 0, label: 'x₁=-3' },
          { x: 1, y: 0, label: 'x₂=1' },
          { x: 4, y: 0, label: 'x₃=4' }
        ],
        title: 'Графік y = f\'(x)'
      },
      options: [
        { id: 'A', text: '1 точка мінімуму (точка x = 1, де похідна змінює знак з мінуса на плюс)' },
        { id: 'B', text: '2 точки мінімуму (точки x = -3 та x = 4)' },
        { id: 'C', text: '3 точки мінімуму (всі нулі похідної)' },
        { id: 'D', text: 'Жодної точки мінімуму (функція монотонна)' }
      ],
      correctOption: 'A',
      timeLimit: 50,
      explanation: 'Точка локального мінімуму функції f(x) виникає там, де похідна f\'(x) змінює знак з «-» на «+». На графіку похідна від’ємна при x ∈ (-3; 1) і додатна при x ∈ (1; 4). Отже, лише в точці x = 1 похідна переходить з від’ємної області в додатну. LLM часто плутають графік функції з графіком її похідної!',
      microVerificationPrompt: 'Яка умова на знак похідної f\'(x) визначає точку локального мінімуму?',
      microVerificationExpectedKeywords: ['з мінуса на плюс', '- на +', 'зростання', 'від\'ємн', 'додатн']
    },
    {
      id: 'AC-VIS-STEM-06',
      type: 'visual_schema',
      subject: 'stem',
      subjectName: 'STEM / Комп’ютерні науки — Теорія автоматів',
      difficulty: 4,
      title: 'Аналіз орієнтованого графа станів анти-чит автомата',
      statement: 'На полотні зображено скінченний автомат перевірки довіри до студента зі станами α (Старт/Довіра), β (Підозра), γ (Перевірка), δ (Блокування). Проаналізуйте топологію спрямованих переходів. Яке твердження є істинним для цього автомата?',
      visualDiagram: {
        type: 'node_graph',
        nodes: [
          { id: 'alpha', label: 'α (Start)', x: 120, y: 110, color: '#2cbb5d' },
          { id: 'beta', label: 'β (Watch)', x: 290, y: 50, color: '#ffa116' },
          { id: 'gamma', label: 'γ (Check)', x: 460, y: 110, color: '#38bdf8' },
          { id: 'delta', label: 'δ (Locked)', x: 290, y: 170, color: '#ef4743' }
        ],
        edges: [
          { from: 'alpha', to: 'beta', weight: 'blur' },
          { from: 'beta', to: 'alpha', weight: 'verify_ok' },
          { from: 'beta', to: 'gamma', weight: 'ai_ext' },
          { from: 'gamma', to: 'delta', weight: 'fail' },
          { from: 'beta', to: 'delta', weight: '2nd_blur' }
        ]
      },
      options: [
        { id: 'A', text: 'Зі стану δ (Locked) існує зворотний перехід у стан α при успішній перевірці' },
        { id: 'B', text: 'Стан δ є поглинаючим (стічним) станом: з нього немає вихідних ребер, розблокування автоматично неможливе' },
        { id: 'C', text: 'Перехід α → γ можливий напряму за 1 крок без проміжного стану β' },
        { id: 'D', text: 'У графі присутній орієнтований цикл між трьома станами: α → β → γ → α' }
      ],
      correctOption: 'B',
      timeLimit: 45,
      explanation: 'На візуальній схемі з вузла δ (Locked) немає жодної вихідної стрілки — це термінальний/поглинаючий стан. OCR або текстові боти не бачать схему без піксельного рендерингу.',
      microVerificationPrompt: 'Чому стан δ називається термінальним (поглинаючим) у наведеному графі?',
      microVerificationExpectedKeywords: ['немає вихідних', 'вихідних ребер', 'стік', 'поглинаючий', 'кінцевий']
    },
    {
      id: 'AC-VIS-PHYS-07',
      type: 'visual_schema',
      subject: 'stem',
      subjectName: 'Фізика & Електроніка — Змішане з\'єднання',
      difficulty: 3,
      title: 'Розрахунок еквівалентного електричного кола',
      statement: 'На графічному полотні подано схему ділянки кола. Опори резисторів: R₁ = 6 Ом, R₂ = 3 Ом (з\'єднані паралельно), послідовно до них підключено резистор R₃ = 4 Ом. Ключ K₁ розімкнено. Визначте повний опір ділянки кола між клемами A і B:',
      visualDiagram: {
        type: 'circuit',
        r1: 6,
        r2: 3,
        r3: 4,
        switchState: 'open'
      },
      options: [
        { id: 'A', text: 'R_екв = 6 Ом (2 Ом від паралельної пари + 4 Ом від R₃)' },
        { id: 'B', text: 'R_екв = 13 Ом (просте додавання 6 + 3 + 4)' },
        { id: 'C', text: 'R_екв = 2 Ом (опір R₃ не враховується)' },
        { id: 'D', text: 'R_екв = 9 Ом' }
      ],
      correctOption: 'A',
      timeLimit: 45,
      explanation: 'Паралельне з’єднання R₁ та R₂: R₁₂ = (6 * 3) / (6 + 3) = 18 / 9 = 2 Ом. Послідовно з R₃: R_заг = 2 + 4 = 6 Ом. Схему накреслено безпосередньо на Canvas.',
      microVerificationPrompt: 'За якою формулою знайдено еквівалентний опір паралельної ділянки R₁ та R₂?',
      microVerificationExpectedKeywords: ['(r1*r2)/(r1+r2)', 'добуток на суму', '1/r', '18/9', '2 ом']
    },
    {
      id: 'AC-VIS-GEOM-08',
      type: 'visual_schema',
      subject: 'math',
      subjectName: 'Геометрія (НМТ) — Коло і дотична',
      difficulty: 3,
      title: 'Кут між хордою та дотичною до кола',
      statement: 'На кресленні на Canvas зображено коло з центром O. Пряма AT є дотичною до кола в точці A. Хорда AB утворює з дотичною гострий кут ∠TAB = 64°. Точка C лежить на колі так, що кут ∠ACB спирається на хорду AB. Знайдіть градусну міру вписаного кута ∠ACB:',
      visualDiagram: {
        type: 'geometry',
        angleTAB: 64,
        vertexA: 'A',
        vertexB: 'B',
        vertexC: 'C'
      },
      options: [
        { id: 'A', text: '64° (за теоремою про кут між дотичною і хордою)' },
        { id: 'B', text: '128° (дорівнює подвоєному куту)' },
        { id: 'C', text: '32° (половина кута дотичної)' },
        { id: 'D', text: '116° (суміжний до кута дотичної)' }
      ],
      correctOption: 'A',
      timeLimit: 40,
      explanation: 'За фундаментальною геометричною теоремою, кут між дотичною і хордою, що проходить через точку дотику, дорівнює вписаному куту, який спирається на цю хорду: ∠ACB = ∠TAB = 64°.',
      microVerificationPrompt: 'Сформулюйте теорему, що пов’язує кут між дотичною і хордою з вписаним кутом.',
      microVerificationExpectedKeywords: ['куту між дотичною', 'вписаний кут', 'спирається на хорду', '64']
    },

    // -------------------------------------------------------------------------
    // FORMAT 3: find_the_bug (Аналіз помилок — Пошук багів у розв'язку)
    // -------------------------------------------------------------------------
    {
      id: 'AC-BUG-MATH-09',
      type: 'find_the_bug',
      subject: 'math',
      subjectName: 'Алгебра (НМТ) — Розв’язування ірраціональних рівнянь',
      difficulty: 3,
      title: 'Пошук логічного багу в розв’язанні рівняння √(x² - 6x + 9) = 5 - x',
      statement: 'Учень отримав завдання розв\'язати рівняння √(x² - 6x + 9) = 5 - x і подав таке 4-крокове рішення. Розв\'язок виглядає цілком переконливо, але містить критичну алгебраїчну помилку. На якому кроці її допущено?',
      solutionSteps: [
        { step: 1, title: 'Крок 1', text: 'Згортаємо підкореневий вираз за формулою квадрата різниці: √((x - 3)²) = 5 - x.' },
        { step: 2, title: 'Крок 2', text: 'Звільняємося від кореня та квадрата: x - 3 = 5 - x.' },
        { step: 3, title: 'Крок 3', text: 'Переносимо змінні ліворуч: 2x = 8, звідки корінь x = 4.' },
        { step: 4, title: 'Крок 4', text: 'Перевірка підстановкою: √(4² - 24 + 9) = √1 = 1; 5 - 4 = 1. Оскільки 1 = 1, число 4 є єдиним розв\'язком.' }
      ],
      options: [
        { id: 'A', text: 'Крок 1: невірно згорнуто формулу квадрата різниці' },
        { id: 'B', text: 'Крок 2: груба помилка тотожності! √(a²) = |a|, тому мало бути |x - 3| = 5 - x, що дає розгалуження' },
        { id: 'C', text: 'Крок 3: неправильно перенесено доданки (мало бути 2x = 2)' },
        { id: 'D', text: 'Крок 4: число 4 не задовольняє умову ОДЗ' }
      ],
      correctOption: 'B',
      timeLimit: 45,
      explanation: 'Фундаментальна тотожність: √(A²) = |A|. На Кроці 2 учень проігнорував модуль і відкинув цілий інтервал або другий випадок розкриття модуля (при x < 3: -(x - 3) = 5 - x => 3 = 5, розв’язків немає). Хоча знайдений корінь x = 4 випадково підійшов, математичний метод на кроці 2 є недійсним.',
      microVerificationPrompt: 'Чому рівність √(A²) = A є помилковою для довільних дійсних чисел?',
      microVerificationExpectedKeywords: ['модуль', '|a|', 'від\'ємн', 'знак', 'невід\'ємн']
    },
    {
      id: 'AC-BUG-UKR-10',
      type: 'find_the_bug',
      subject: 'ukrainian',
      subjectName: 'Українська мова (НМТ) — Синтаксичний розбір речення',
      difficulty: 3,
      title: 'Пошук помилки в синтаксичній характеристиці речення',
      statement: 'Проаналізовано складне речення: «Учитель переконаний, що наполеглива праця обов’язково приведе учня до омріяного результату на тестуванні». На якому кроці розбору зроблено помилковий висновок?',
      solutionSteps: [
        { step: 1, title: 'Крок 1', text: 'Виділено дві граматичні основи: «учитель переконаний» (головна частина) та «праця приведе» (підрядна частина).' },
        { step: 2, title: 'Крок 2', text: 'З’ясовано засіб зв’язку: частини з’єднані підрядним сполучником «що».' },
        { step: 3, title: 'Крок 3', text: 'Визначено вид підрядної частини: це підрядна частина причини, оскільки вказує на переконання вчителя.' },
        { step: 4, title: 'Крок 4', text: 'Пунктуація: між головною і підрядною частинами перед сполучником «що» обов’язково ставиться кома.' }
      ],
      options: [
        { id: 'A', text: 'Крок 1: слово «переконаний» є додатком, а не частиною присудка' },
        { id: 'B', text: 'Крок 2: слово «що» є сполучним словом (займенником), а не сполучником' },
        { id: 'C', text: 'Крок 3: помилка — від головної частини ставимо питання «у чому переконаний?», отже це підрядна з’ясувальна, а не причини' },
        { id: 'D', text: 'Крок 4: кому перед «що» ставити не потрібно' }
      ],
      correctOption: 'C',
      timeLimit: 40,
      explanation: 'Головна частина «Учитель переконаний» вимагає від підрядної частини конкретизації змісту думки («переконаний у чому?»). Питання непрямого відмінка вказує на підрядну з’ясувальну частину, а не причини.',
      microVerificationPrompt: 'Яке синтаксичне питання ставимо від головної частини до підрядної у цьому реченні?',
      microVerificationExpectedKeywords: ['у чому', 'в чому', 'з\'ясувальн', 'питання відмінка']
    },
    {
      id: 'AC-BUG-ENG-11',
      type: 'find_the_bug',
      subject: 'english',
      subjectName: 'English (NMT / Advanced Grammar) — Mixed Conditionals',
      difficulty: 4,
      title: 'Find the bug in the Inversion & Conditional Analysis',
      statement: 'Analyze the student\'s step-by-step transformation of the conditional sentence: "If we had left earlier yesterday, we would not be stuck in traffic right now." On which step was the grammatical rule broken?',
      solutionSteps: [
        { step: 1, title: 'Step 1', text: 'Identified sentence structure: Mixed Conditional (Type 3 condition in the past + Type 2 result in the present).' },
        { step: 2, title: 'Step 2', text: 'Applied conditional inversion to the if-clause by omitting "if": "Had we left earlier yesterday..."' },
        { step: 3, title: 'Step 3', text: 'Replaced the result clause with past form: "...we would not have been stuck in traffic right now."' },
        { step: 4, title: 'Step 4', text: 'Final inverted sentence: "Had we left earlier yesterday, we would not have been stuck in traffic right now."' }
      ],
      options: [
        { id: 'A', text: 'Step 1: The original sentence is a standard Third Conditional, not mixed' },
        { id: 'B', text: 'Step 2: Inversion is illegal with third conditionals in formal English' },
        { id: 'C', text: 'Step 3: Fatal flaw! The time marker "right now" denotes present time, requiring "would not be", whereas Step 3 mistakenly replaced it with past perfect modal "would not have been"' },
        { id: 'D', text: 'Step 4: Punctuation is incorrect without a semicolon' }
      ],
      correctOption: 'C',
      timeLimit: 45,
      explanation: 'In mixed conditionals, when the consequence refers to the present ("right now"), the main clause must use "would + bare infinitive" (would not be). Using "would not have been" clashes with the present adverbial modifier "right now".',
      microVerificationPrompt: 'Why is "would not have been" grammatically incompatible with "right now"?',
      microVerificationExpectedKeywords: ['right now', 'present', 'теперішн', 'mixed conditional', 'would be']
    },
    {
      id: 'AC-BUG-HIST-12',
      type: 'find_the_bug',
      subject: 'history',
      subjectName: 'Історія України — Українська революція 1917–1918 рр.',
      difficulty: 3,
      title: 'Пошук хронологічної помилки в подіях 1918 року',
      statement: 'Учень вибудував ланцюжок ключових подій весни 1918 року в Україні. Знайдіть крок, на якому припущено грубу історичну неточність:',
      solutionSteps: [
        { step: 1, title: 'Крок 1', text: 'Лютий 1918 р.: підписання Берестейського мирного договору між УНР та державами Четверного союзу.' },
        { step: 2, title: 'Крок 2', text: 'Березень–квітень 1918 р.: визволення території України від більшовиків військами УНР за підтримки німецької та австро-угорської армій.' },
        { step: 3, title: 'Крок 3', text: '29 квітня 1918 р.: Центральна Рада одностайно обрала Павла Скоропадського гетьманом України.' },
        { step: 4, title: 'Крок 4', text: 'Травень 1918 р.: оприлюднення «Закону про тимчасовий державний устрій України» та перейменування держави на «Українську Державу».' }
      ],
      options: [
        { id: 'A', text: 'Крок 1: Берестейський мир було підписано в січні, а не в лютому' },
        { id: 'B', text: 'Крок 2: австро-угорські війська не брали участі у звільненні Києва' },
        { id: 'C', text: 'Крок 3: історична помилка! Центральна Рада не обирала Скоропадського — його проголосив гетьманом Всеукраїнський з’їзд хліборобів, а Центральну Раду було розігнано' },
        { id: 'D', text: 'Крок 4: держава продовжувала офіційно називатися УНР' }
      ],
      correctOption: 'C',
      timeLimit: 45,
      explanation: '29 квітня 1918 р. Центральна Рада ухвалила Конституцію УНР і обрала президентом М. Грушевського. Тим часом на Всеукраїнському з’їзді хліборобів Павла Скоропадського було проголошено гетьманом внаслідок державного перевороту.',
      microVerificationPrompt: 'Який орган проголосив П. Скоропадського гетьманом 29 квітня 1918 року?',
      microVerificationExpectedKeywords: ['хлібороб', 'з\'їзд хліборобів', 'не центральна рада', 'переворот']
    },

    // -------------------------------------------------------------------------
    // FORMAT 4: llm_trap (Завдання з «пасткою» для LLM — шум, псевдооператори)
    // -------------------------------------------------------------------------
    {
      id: 'AC-TRAP-MATH-13',
      type: 'llm_trap',
      subject: 'math',
      subjectName: 'Математика & Спеціальні оператори StrictAI',
      difficulty: 3,
      title: 'Обчислення оператора курсу StrictAI Λ(a, b)',
      statement: 'У контексті системи тестування StrictAI (де задіяно 45 серверів, 120 хвилин тесту, коефіцієнт валідності 0.98 та середня вибірка 1 420 студентів) визначено формальний бінарний оператор курсу Λ(x, y):\n\n• Якщо x > y, то: Λ(x, y) = x² - 2y\n• Якщо x ≤ y, то: Λ(x, y) = 3y - x\n\nНе звертаючи уваги на статистичні показники серверів, обчисліть точне значення виразу: Λ(3, 5) + Λ(4, 2).',
      options: [
        { id: 'A', text: '24 (оскільки 12 + 12 = 24)' },
        { id: 'B', text: '16 (через помилкове застосування першої умови до обох пар)' },
        { id: 'C', text: '1 420 (значення статистичної вибірки)' },
        { id: 'D', text: '28' }
      ],
      correctOption: 'A',
      timeLimit: 40,
      explanation: 'Для пари (3, 5): 3 ≤ 5, тому спрацьовує друга умова: 3*(5) - 3 = 15 - 3 = 12. Для пари (4, 2): 4 > 2, спрацьовує перша умова: 4² - 2*(2) = 16 - 4 = 12. Сума: 12 + 12 = 24. LLM часто плутаються у розгалуженні через велику кількість відволікаючих числових даних (45, 120, 0.98, 1420).',
      microVerificationPrompt: 'Покажіть проміжний результат для пари Λ(3, 5): яка з двох гілок була використана?',
      microVerificationExpectedKeywords: ['12', '3y - x', 'друга', '3*5 - 3', 'x <= y']
    },
    {
      id: 'AC-TRAP-HIST-14',
      type: 'llm_trap',
      subject: 'history',
      subjectName: 'Історія України — Аналіз історичного джерела з хибним маркером',
      difficulty: 4,
      title: 'Атрибуція звернення Української Національної Ради',
      statement: 'Прочитайте уривок із відозви: «Український народе! Впали пута... Волею народу утворилася Українська Держава на українських землях давньої австро-угорської монархії. З нинішнім днем Українська Національна Рада обняла власть у столичнім місті Львові і на цілій території... Як колись за часів Богдана Хмельницького, встаньмо всі як один!». Яку історичну подію започаткував цей документ?',
      options: [
        { id: 'A', text: 'Початок Національно-визвольної війни під проводом Б. Хмельницького (1648 р.)' },
        { id: 'B', text: 'Листопадовий зрив / повстання у Львові та проголошення ЗУНР (1 листопада 1918 р.)' },
        { id: 'C', text: 'Проголошення І Універсалу Української Центральної Ради (1917 р.)' },
        { id: 'D', text: 'Взяття Львова козацькими полками Максима Кривоноса' }
      ],
      correctOption: 'B',
      timeLimit: 45,
      explanation: 'Згадка Богдана Хмельницького є лише риторичною відсилкою автора. Текст чітко говорить про Українську Національну Раду, Львів та землі бувшої австро-угорської монархії — це відозва про взяття влади у Львові 1 листопада 1918 р. (Листопадовий зрив / утворення ЗУНР). Багато LLM через поверхневий пошук ключових слів чіпляються за Хмельницького!',
      microVerificationPrompt: 'Які ключові слова в документі (крім імені Хмельницького) однозначно вказують на 1918 рік і Львів?',
      microVerificationExpectedKeywords: ['львів', 'австро-угорськ', 'національна рада', 'зунр', '1918']
    },
    {
      id: 'AC-TRAP-UKR-15',
      type: 'llm_trap',
      subject: 'ukrainian',
      subjectName: 'Українська мова & Етимологія — Пряме ремісниче значення фразеологізму',
      difficulty: 3,
      title: 'Семантичний контекст виразу в ремісничому середовищі',
      statement: 'У художньому описі старовинної чернігівської майстерні ложкарів читаємо: «Майстер сидів на колоді і вправно бив байдики, готуючи рівні чурбачки з липи для своїх підмайстрів». Яке значення має виділена дія в описаному контексті?',
      options: [
        { id: 'A', text: 'Ледарював, байдикував і ухилявся від справжньої роботи' },
        { id: 'B', text: 'Виконував первинну заготовку: розколював липову деревину на цурпалки (байдики) для виточування ложок' },
        { id: 'C', text: 'Вибивав ритм молотком для налаштування верстата' },
        { id: 'D', text: 'Карав недбайливих учнів за погано виконану роботу' }
      ],
      correctOption: 'B',
      timeLimit: 35,
      explanation: 'LLM бачать ідіому «бити байдики» і рефлекторно обирають варіант «ледарювати». Проте в прямому історично-ремісничому значенні байдики — це дерев’яні брусочки-заготовки для посуду чи ложок, які витісував майстер.',
      microVerificationPrompt: 'Що буквально означало слово «байдик» у давніх деревообробних ремеслах?',
      microVerificationExpectedKeywords: ['заготовка', 'цурпалок', 'брусок', 'деревина', 'дерево', 'ложка']
    },
    {
      id: 'AC-TRAP-STEM-16',
      type: 'llm_trap',
      subject: 'stem',
      subjectName: 'Алгоритми & Теорія складності — Асимптотичний аналіз',
      difficulty: 4,
      title: 'Обчислення асимптотичної часової складності вкладених циклів',
      statement: 'Розгляньте фрагмент алгоритму моніторингу безпеки StrictAI:\n\nfor (let i = 0; i < n; i++) {\n    for (let j = 0; j < 1000000; j++) {\n        // фіксований лічильник калібрування\n        sum += 1;\n    }\n}\n\nВизначте точну асимптотичну часову складність цього алгоритму у нотації Big-O відносно розміру вхідних даних n:',
      options: [
        { id: 'A', text: 'O(n) — лінійна складність, оскільки внутрішній цикл виконує константну кількість ітерацій (10⁶ = const), незалежно від n' },
        { id: 'B', text: 'O(n²) — квадратична складність через наявність двох вкладених циклів' },
        { id: 'C', text: 'O(10⁶) — константна складність' },
        { id: 'D', text: 'O(n log n) — логарифмічна оптимізація' }
      ],
      correctOption: 'A',
      timeLimit: 35,
      explanation: 'Кількість ітерацій внутрішнього циклу дорівнює фіксованій константі C = 10⁶. За формальним визначенням асимптотики Big-O: O(C * n) = O(n). LLM автоматично асоціюють 2 вкладених цикли з O(n²), ігноруючи фіксовану верхню межу.',
      microVerificationPrompt: 'Чому константа 1 000 000 не перетворює складність алгоритму на O(n²)?',
      microVerificationExpectedKeywords: ['константа', 'не залежить від n', 'const', 'o(n)', 'фіксован']
    }
  ];

  /* ==========================================================================
     2. DYNAMIC CANVAS RENDERING ENGINE (OCR-SHIELD & DIAGRAMS)
     Supports devicePixelRatio, micro-jitter, Bezier obfuscation & diagrams
     ========================================================================== */
  function renderQuestionCanvas(canvas, questionObj, userOptions = {}) {
    if (!canvas || !canvas.getContext) {
      console.error('[StrictAntiCheat] Invalid canvas element passed to renderQuestionCanvas');
      return;
    }

    const options = Object.assign({
      theme: 'dark',
      width: canvas.parentElement ? Math.min(canvas.parentElement.clientWidth, 760) : 740,
      sessionId: 'SEC-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      fontSize: 15,
      lineHeight: 24,
      dpr: (typeof window !== 'undefined' && window.devicePixelRatio) || 1
    }, userOptions);

    const dpr = Math.max(options.dpr, 1);
    const width = Math.max(options.width || 720, 480);
    const ctx = canvas.getContext('2d');

    // Theme color configuration
    const isDark = options.theme !== 'light';
    const colors = {
      bg: isDark ? '#1e1e1e' : '#ffffff',
      bgCard: isDark ? '#282828' : '#f4f4f6',
      border: isDark ? '#333333' : '#e2e4e9',
      textPrimary: isDark ? '#eff1f6' : '#141417',
      textSecondary: isDark ? '#9ca3af' : '#64748b',
      amber: '#ffa116',
      emerald: '#2cbb5d',
      danger: '#ef4743',
      noise: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
      curve1: 'rgba(255, 161, 22, 0.07)',
      curve2: 'rgba(44, 187, 93, 0.07)',
      watermark: isDark ? 'rgba(255, 161, 22, 0.05)' : 'rgba(255, 255, 255, 0.03)'
    };

    // Calculate layout & text wrapping before painting
    ctx.font = `${options.fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    const paddingX = 24;
    const contentWidth = width - (paddingX * 2);

    // Break statement into lines
    const rawStatement = questionObj.statement || questionObj.question || questionObj.text || '';
    const words = rawStatement.split(/\s+/);
    const statementLines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > contentWidth && currentLine) {
        statementLines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) statementLines.push(currentLine);

    // Determine format flags
    const qType = questionObj.type;
    const isVisual = qType === 'visual_diagram' || qType === 'visual_schema' || !!questionObj.visualDiagram;
    const isCase = qType === 'case_study' || qType === 'context_case' || !!(questionObj.tableData && questionObj.tableData.rows);
    const isBug = qType === 'find_bug' || qType === 'find_the_bug' || !!(questionObj.solutionSteps && questionObj.solutionSteps.length);
    const isTrap = qType === 'llm_trap';

    // Compute dynamic height
    let estimatedHeight = 90; // Header & badges
    estimatedHeight += statementLines.length * options.lineHeight + 16;

    if (isVisual) {
      estimatedHeight += 240;
    } else if (isCase) {
      const rowCount = (questionObj.tableData && questionObj.tableData.rows ? questionObj.tableData.rows.length : 4);
      estimatedHeight += (rowCount + 1) * 36 + 24;
    } else if (isBug) {
      const stepCount = (questionObj.solutionSteps && questionObj.solutionSteps.length ? questionObj.solutionSteps.length : 4);
      estimatedHeight += stepCount * 52 + 20;
    } else if (isTrap) {
      estimatedHeight += 135;
    } else if (questionObj.options && Array.isArray(questionObj.options)) {
      estimatedHeight += questionObj.options.length * 34 + 16;
    }

    estimatedHeight += 36; // Footer watermark padding

    // Set hardware scaled dimensions (DPI scaling for crisp text)
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(estimatedHeight * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = estimatedHeight + 'px';

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Background Fill
    ctx.fillStyle = colors.bg;
    roundRect(ctx, 0, 0, width, estimatedHeight, 10);
    ctx.fill();

    // 2. Anti-OCR Background Noise Grid
    drawNoiseGrid(ctx, width, estimatedHeight, colors.noise);

    // 3. Diagonal Repeating Watermark (STRICT-AI OCR SHIELD across entire background)
    drawDiagonalRepeatingWatermark(ctx, width, estimatedHeight, isDark);

    // 4. Anti-OCR Obfuscating Bezier Curves (2-4 curves with 0.07 opacity)
    drawAntiOcrCurves(ctx, width, estimatedHeight, colors.curve1, colors.curve2);

    // 5. Header: Subject Badge & Format Indicator
    let curY = 28;
    ctx.font = 'bold 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = colors.amber;
    const formatName = formatTypeName(questionObj.type);
    ctx.fillText(formatName.toUpperCase(), paddingX, curY);

    // Subject badge (right-aligned)
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = colors.textSecondary;
    const subjectLabel = questionObj.subjectName || questionObj.subject || '';
    const subjectWidth = ctx.measureText(subjectLabel).width;
    ctx.fillText(subjectLabel, width - paddingX - subjectWidth, curY);

    // Question Title
    curY += 24;
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = colors.textPrimary;
    ctx.fillText(questionObj.title || 'Завдання StrictAI', paddingX, curY);

    // Divider line
    curY += 12;
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(paddingX, curY);
    ctx.lineTo(width - paddingX, curY);
    ctx.stroke();

    curY += 22;

    // 6. Anti-OCR Text Statement with Micro-Jitter (±0.3px baseline & subtle tilt)
    ctx.font = `${options.fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = colors.textPrimary;

    for (let l = 0; l < statementLines.length; l++) {
      const lineWords = statementLines[l].split(' ');
      let wordX = paddingX;

      for (let w = 0; w < lineWords.length; w++) {
        const word = lineWords[w];
        const wordMetrics = ctx.measureText(word + ' ');

        // Micro-jitter pseudo-random seed (strictly within ±0.3px)
        const seed = (l * 17) + (w * 31);
        const dy = (Math.sin(seed * 0.7) * 0.3); // ±0.3px
        const dx = (Math.cos(seed * 1.3) * 0.3); // ±0.3px

        ctx.save();
        ctx.translate(wordX + dx, curY + dy);
        ctx.fillText(word, 0, 0);
        ctx.restore();

        wordX += wordMetrics.width;
      }
      curY += options.lineHeight;
    }

    curY += 10;

    // 7. Format Specific Visual Rendering (4 Formats + Ordinary Text)
    if (isVisual) {
      const diagram = questionObj.visualDiagram || getDefaultVisualDiagram();
      curY = drawVisualDiagram(ctx, paddingX, curY, contentWidth, 210, diagram, colors);
      curY += 20;
    } else if (isCase) {
      const tableData = questionObj.tableData || getDefaultTableData();
      curY = drawContextTable(ctx, paddingX, curY, contentWidth, tableData, colors);
      curY += 20;
    } else if (isBug) {
      const steps = questionObj.solutionSteps || getDefaultSolutionSteps();
      curY = drawSolutionSteps(ctx, paddingX, curY, contentWidth, steps, colors);
      curY += 20;
    } else if (isTrap) {
      curY = drawLlmTrapBox(ctx, paddingX, curY, contentWidth, questionObj, colors);
      curY += 20;
    } else if (questionObj.options && Array.isArray(questionObj.options)) {
      // Ordinary text question: render options cleanly on canvas
      curY = drawOptionsList(ctx, paddingX, curY, contentWidth, questionObj.options, colors);
      curY += 16;
    }

    // 8. Diagonal & Footer Dynamic Watermark
    drawDynamicWatermark(ctx, width, estimatedHeight, options.sessionId, options.timestamp, colors.watermark);

    ctx.restore();
  }

  // Draw Noise Grid
  function drawNoiseGrid(ctx, w, h, noiseColor) {
    ctx.fillStyle = noiseColor;
    const step = 16;
    for (let x = 8; x < w; x += step) {
      for (let y = 8; y < h; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, 0.75, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Draw Diagonal Repeating Watermark across background
  function drawDiagonalRepeatingWatermark(ctx, w, h, isDark) {
    ctx.save();
    ctx.font = 'bold 12px ui-monospace, SFMono-Regular, Menlo, Monaco, monospace';
    ctx.fillStyle = isDark ? 'rgba(255, 161, 22, 0.05)' : 'rgba(255, 255, 255, 0.03)';
    ctx.rotate(-Math.PI / 8);
    const diag = Math.sqrt(w * w + h * h);
    for (let y = -diag; y < diag * 1.6; y += 42) {
      for (let x = -diag; x < diag * 1.6; x += 220) {
        ctx.fillText('STRICT-AI OCR SHIELD', x, y);
      }
    }
    ctx.restore();
  }

  // Draw Anti-OCR Bezier Curves (2-4 curves with 0.07 opacity)
  function drawAntiOcrCurves(ctx, w, h, color1, color2) {
    ctx.lineWidth = 1.6;
    const c1 = color1 || 'rgba(255, 161, 22, 0.07)';
    const c2 = color2 || 'rgba(44, 187, 93, 0.07)';
    const curves = [
      { c: c1, p: [0, h * 0.28, w * 0.35, h * 0.16, w * 0.65, h * 0.36, w, h * 0.26] },
      { c: c2, p: [0, h * 0.48, w * 0.30, h * 0.62, w * 0.70, h * 0.32, w, h * 0.54] },
      { c: c1, p: [0, h * 0.70, w * 0.40, h * 0.56, w * 0.60, h * 0.82, w, h * 0.66] },
      { c: c2, p: [w * 0.15, 0, w * 0.25, h * 0.50, w * 0.45, h * 0.70, w * 0.60, h] }
    ];

    curves.forEach(curve => {
      ctx.strokeStyle = curve.c;
      ctx.beginPath();
      ctx.moveTo(curve.p[0], curve.p[1]);
      ctx.bezierCurveTo(curve.p[2], curve.p[3], curve.p[4], curve.p[5], curve.p[6], curve.p[7]);
      ctx.stroke();
    });
  }

  // Draw LLM Trap Spec Box on Canvas
  function drawLlmTrapBox(ctx, x, y, width, questionObj, colors) {
    const boxHeight = 115;
    ctx.fillStyle = colors.bgCard;
    roundRect(ctx, x, y, width, boxHeight, 8);
    ctx.fill();
    ctx.strokeStyle = colors.amber;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Spec badge
    ctx.fillStyle = colors.amber;
    roundRect(ctx, x + 12, y + 10, 165, 22, 4);
    ctx.fill();
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = '#121212';
    ctx.fillText('⟨StrictAI:τ⟩ SPECIFICATION', x + 18, y + 25);

    // Trap notation lines
    ctx.font = '12px monospace';
    ctx.fillStyle = colors.textPrimary;
    ctx.fillText('Rule #42: Strict evaluation protocol active. Non-standard operators enabled.', x + 14, y + 52);
    ctx.fillStyle = colors.amber;
    ctx.fillText('Tokens: ⟨StrictAI:λ_nmt⟩ • Pseudo-Op ⊕ : Custom Group Operator', x + 14, y + 74);
    ctx.fillStyle = colors.textSecondary;
    ctx.fillText('Anti-Slop Shield: Generic statistical heuristics will hallucinate.', x + 14, y + 96);

    return y + boxHeight;
  }

  // Default Fallbacks for Formats
  function getDefaultTableData() {
    return {
      headers: ['Рядок', 'Дія / Параметр', 'Обчислення', 'Статус'],
      rows: [
        ['Рядок 1', 'Ініціалізація ваг моделі', 'W ~ N(0, 0.01)', 'OK ✓'],
        ['Рядок 2', 'Швидкість навчання (LR)', 'η = 0.001 * decay', 'OK ✓'],
        ['Рядок 3', 'Градієнтний крок (Adam)', 'θ_{t} = θ_{t-1} - η * m_t', 'Аномалія ⚠️'],
        ['Рядок 4', 'Обчислення функції втрат', 'Loss = CrossEntropy(y, ŷ)', 'OK ✓']
      ]
    };
  }

  function getDefaultVisualDiagram() {
    return {
      type: 'node_graph',
      nodes: [
        { id: 'A', label: 'Вузол A', x: 100, y: 80, color: '#2cbb5d' },
        { id: 'B', label: 'Вузол B', x: 260, y: 40, color: '#ffa116' },
        { id: 'C', label: 'Вузол C', x: 420, y: 80, color: '#38bdf8' },
        { id: 'D', label: 'Вузол D', x: 260, y: 140, color: '#ef4743' }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 'w₁' },
        { from: 'B', to: 'C', weight: 'w₂' },
        { from: 'C', to: 'D', weight: 'w₃' },
        { from: 'D', to: 'A', weight: 'w₄' }
      ]
    };
  }

  function getDefaultSolutionSteps() {
    return [
      { step: 1, title: 'Крок 1', text: 'Визначення області допустимих значень (ОДЗ): x - 2 ≥ 0 ⇒ x ≥ 2' },
      { step: 2, title: 'Крок 2', text: 'Піднесення обох частин до квадрата: (√(x - 2))² = (4 - x)²' },
      { step: 3, title: 'Крок 3', text: 'Зведення подібних доданків: x² - 9x + 18 = 0 ⇒ x₁ = 3, x₂ = 6' },
      { step: 4, title: 'Крок 4', text: 'Перевірка коренів за ОДЗ та вибір фінальної відповіді' }
    ];
  }

  function drawOptionsList(ctx, x, y, width, options, colors) {
    let curY = y;
    ctx.font = '13.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const optId = opt.id || String.fromCharCode(65 + i);
      const optText = typeof opt === 'string' ? opt : (opt.text || '');

      // Option card background
      ctx.fillStyle = colors.bgCard;
      roundRect(ctx, x, curY, width, 28, 4);
      ctx.fill();
      ctx.strokeStyle = colors.border;
      ctx.stroke();

      // Badge
      ctx.fillStyle = colors.amber;
      roundRect(ctx, x + 4, curY + 4, 20, 20, 3);
      ctx.fill();

      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#121212';
      ctx.textAlign = 'center';
      ctx.fillText(optId, x + 14, curY + 18);
      ctx.textAlign = 'left';

      // Text
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = colors.textPrimary;
      ctx.fillText(optText, x + 32, curY + 18);

      curY += 34;
    }
    return curY;
  }

  // Standalone word wrap utility with micro-jitter
  function wrapText(ctx, text, x, y, maxWidth, lineHeight, applyJitter = true) {
    const words = (text || '').split(/\s+/);
    let currentLine = '';
    let curY = y;
    let lineIdx = 0;

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        renderLineWithJitter(ctx, currentLine, x, curY, applyJitter, lineIdx++);
        currentLine = words[i];
        curY += lineHeight;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      renderLineWithJitter(ctx, currentLine, x, curY, applyJitter, lineIdx++);
      curY += lineHeight;
    }
    return curY;
  }

  function renderLineWithJitter(ctx, line, x, y, applyJitter, seedBase) {
    if (!applyJitter) {
      ctx.fillText(line, x, y);
      return;
    }
    const words = line.split(' ');
    let wordX = x;
    for (let w = 0; w < words.length; w++) {
      const word = words[w];
      const wordMetrics = ctx.measureText(word + ' ');
      const seed = (seedBase * 17) + (w * 31);
      const dy = Math.sin(seed * 0.7) * 0.3; // strictly ±0.3px
      const dx = Math.cos(seed * 1.3) * 0.3; // strictly ±0.3px

      ctx.save();
      ctx.translate(wordX + dx, y + dy);
      ctx.fillText(word, 0, 0);
      ctx.restore();

      wordX += wordMetrics.width;
    }
  }

  // Draw Context Table directly on Canvas
  function drawContextTable(ctx, x, y, width, tableData, colors) {
    const rowHeight = 34;
    const numRows = tableData.rows.length;
    const colCount = tableData.headers.length;
    const colWidth = width / colCount;

    // Table Header
    ctx.fillStyle = colors.bgCard;
    roundRect(ctx, x, y, width, rowHeight, 6);
    ctx.fill();
    ctx.strokeStyle = colors.border;
    ctx.stroke();

    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = colors.amber;
    ctx.textAlign = 'left';

    for (let c = 0; c < colCount; c++) {
      const headerText = tableData.headers[c];
      ctx.fillText(headerText, x + (c * colWidth) + 8, y + 21);
    }

    let curY = y + rowHeight;

    // Table Rows
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    for (let r = 0; r < numRows; r++) {
      const row = tableData.rows[r];
      const isAlt = r % 2 === 1;

      ctx.fillStyle = isAlt ? colors.bgCard : colors.bg;
      ctx.fillRect(x, curY, width, rowHeight);
      ctx.strokeStyle = colors.border;
      ctx.strokeRect(x, curY, width, rowHeight);

      ctx.fillStyle = colors.textPrimary;
      for (let c = 0; c < colCount; c++) {
        const cellText = row[c] || '';
        ctx.fillText(cellText, x + (c * colWidth) + 8, curY + 21);
      }
      curY += rowHeight;
    }

    return curY;
  }

  // Draw Find-The-Bug Solution Steps
  function drawSolutionSteps(ctx, x, y, width, steps, colors) {
    let curY = y;
    const stepHeight = 44;

    for (let s = 0; s < steps.length; s++) {
      const step = steps[s];

      // Card Background
      ctx.fillStyle = colors.bgCard;
      roundRect(ctx, x, curY, width, stepHeight, 6);
      ctx.fill();
      ctx.strokeStyle = colors.border;
      ctx.stroke();

      // Step Badge
      ctx.fillStyle = colors.amber;
      roundRect(ctx, x + 8, curY + 8, 64, 28, 4);
      ctx.fill();

      ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#121212';
      ctx.fillText(step.title, x + 16, curY + 26);

      // Step Text
      ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = colors.textPrimary;
      ctx.fillText(step.text, x + 82, curY + 26);

      curY += stepHeight + 8;
    }
    return curY;
  }

  // Draw Visual Diagram (Graphs, Circuits, Geometry, Node Automata)
  function drawVisualDiagram(ctx, x, y, width, height, diagram, colors) {
    // Diagram Container
    ctx.fillStyle = colors.bgCard;
    roundRect(ctx, x, y, width, height, 8);
    ctx.fill();
    ctx.strokeStyle = colors.border;
    ctx.stroke();

    if (diagram.type === 'function_graph') {
      drawFunctionGraph(ctx, x, y, width, height, diagram, colors);
    } else if (diagram.type === 'node_graph') {
      drawNodeGraph(ctx, x, y, width, height, diagram, colors);
    } else if (diagram.type === 'circuit') {
      drawCircuitDiagram(ctx, x, y, width, height, diagram, colors);
    } else if (diagram.type === 'geometry') {
      drawGeometryDiagram(ctx, x, y, width, height, diagram, colors);
    }

    return y + height;
  }

  // Sub-renderer: Function Graph
  function drawFunctionGraph(ctx, x, y, width, height, diagram, colors) {
    const originX = x + width * 0.45;
    const originY = y + height * 0.55;
    const scaleX = width / 12;
    const scaleY = height / 7;

    // Coordinate grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let gx = -5; gx <= 5; gx++) {
      ctx.beginPath();
      ctx.moveTo(originX + gx * scaleX, y + 10);
      ctx.lineTo(originX + gx * scaleX, y + height - 10);
      ctx.stroke();
    }
    for (let gy = -3; gy <= 3; gy++) {
      ctx.beginPath();
      ctx.moveTo(x + 10, originY - gy * scaleY);
      ctx.lineTo(x + width - 10, originY - gy * scaleY);
      ctx.stroke();
    }

    // Axes X & Y
    ctx.strokeStyle = colors.textSecondary;
    ctx.lineWidth = 1.5;
    // X Axis
    ctx.beginPath();
    ctx.moveTo(x + 15, originY);
    ctx.lineTo(x + width - 15, originY);
    ctx.stroke();
    // Arrow X
    ctx.beginPath();
    ctx.moveTo(x + width - 20, originY - 4);
    ctx.lineTo(x + width - 15, originY);
    ctx.lineTo(x + width - 20, originY + 4);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(originX, y + height - 15);
    ctx.lineTo(originX, y + 15);
    ctx.stroke();
    // Arrow Y
    ctx.beginPath();
    ctx.moveTo(originX - 4, y + 20);
    ctx.lineTo(originX, y + 15);
    ctx.lineTo(originX + 4, y + 20);
    ctx.stroke();

    // Axis labels
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = colors.textSecondary;
    ctx.fillText('x', x + width - 28, originY - 8);
    ctx.fillText('y', originX + 8, y + 24);
    ctx.fillText('0', originX - 12, originY + 14);

    // Plot derivative curve: passes through (-3,0), reaches min, crosses (1,0), reaches max, crosses (4,0)
    ctx.strokeStyle = colors.amber;
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    for (let px = -4; px <= 4.8; px += 0.1) {
      // Cubic polynomial derivative f'(x) = 0.15 * (x + 3)(x - 1)(4 - x)
      const py = 0.12 * (px + 3) * (px - 1) * (4 - px);
      const canvasX = originX + px * scaleX;
      const canvasY = originY - py * scaleY;
      if (px === -4) ctx.moveTo(canvasX, canvasY);
      else ctx.lineTo(canvasX, canvasY);
    }
    ctx.stroke();

    // Labeled Root Points
    const roots = [
      { x: -3, label: 'x₁ = -3' },
      { x: 1, label: 'x₂ = 1' },
      { x: 4, label: 'x₃ = 4' }
    ];

    roots.forEach(r => {
      const rx = originX + r.x * scaleX;
      const ry = originY;
      ctx.fillStyle = colors.emerald;
      ctx.beginPath();
      ctx.arc(rx, ry, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = colors.textPrimary;
      ctx.fillText(r.label, rx - 18, ry + 18);
    });

    // Diagram Title
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = colors.amber;
    ctx.fillText('y = f\'(x)', x + 20, y + 24);
  }

  // Sub-renderer: Node Graph (Automata)
  function drawNodeGraph(ctx, x, y, width, height, diagram, colors) {
    const scale = Math.min(width / 560, 1);

    // Draw edges
    ctx.lineWidth = 1.8;
    diagram.edges.forEach(edge => {
      const fromNode = diagram.nodes.find(n => n.id === edge.from);
      const toNode = diagram.nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;

      const x1 = x + (fromNode.x * scale);
      const y1 = y + (fromNode.y * scale) + 15;
      const x2 = x + (toNode.x * scale);
      const y2 = y + (toNode.y * scale) + 15;

      ctx.strokeStyle = colors.border;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Arrowhead
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const arrowX = x2 - Math.cos(angle) * (20 * scale);
      const arrowY = y2 - Math.sin(angle) * (20 * scale);

      ctx.fillStyle = colors.amber;
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX - 8 * Math.cos(angle - Math.PI / 6), arrowY - 8 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(arrowX - 8 * Math.cos(angle + Math.PI / 6), arrowY - 8 * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();

      // Edge weight label
      ctx.font = '10px monospace';
      ctx.fillStyle = colors.textSecondary;
      ctx.fillText(edge.weight, (x1 + x2) / 2 - 10, (y1 + y2) / 2 - 6);
    });

    // Draw nodes
    diagram.nodes.forEach(node => {
      const nx = x + (node.x * scale);
      const ny = y + (node.y * scale) + 15;
      const radius = 22 * scale;

      ctx.fillStyle = colors.bg;
      ctx.beginPath();
      ctx.arc(nx, ny, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = node.color || colors.amber;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.font = `bold ${Math.floor(11 * scale)}px monospace`;
      ctx.fillStyle = colors.textPrimary;
      ctx.textAlign = 'center';
      ctx.fillText(node.label, nx, ny + 4);
    });
    ctx.textAlign = 'left';
  }

  // Sub-renderer: Circuit Diagram
  function drawCircuitDiagram(ctx, x, y, width, height, diagram, colors) {
    const cy = y + (height / 2);
    ctx.strokeStyle = colors.amber;
    ctx.lineWidth = 2;

    // Terminal A
    ctx.fillStyle = colors.amber;
    ctx.beginPath();
    ctx.arc(x + 40, cy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = 'bold 13px monospace';
    ctx.fillText('A', x + 34, cy - 10);

    // Line from A to Parallel Branch
    ctx.beginPath();
    ctx.moveTo(x + 44, cy);
    ctx.lineTo(x + 110, cy);
    ctx.stroke();

    // Parallel Branch splitting
    ctx.beginPath();
    ctx.moveTo(x + 110, cy - 40);
    ctx.lineTo(x + 110, cy + 40);
    ctx.stroke();

    // R1 Branch (Top)
    ctx.beginPath();
    ctx.moveTo(x + 110, cy - 40);
    ctx.lineTo(x + 150, cy - 40);
    ctx.stroke();
    // R1 Resistor Box
    ctx.fillStyle = colors.bg;
    ctx.fillRect(x + 150, cy - 52, 60, 24);
    ctx.strokeRect(x + 150, cy - 52, 60, 24);
    ctx.fillStyle = colors.textPrimary;
    ctx.font = '11px monospace';
    ctx.fillText('R₁=6Ω', x + 156, cy - 36);
    ctx.beginPath();
    ctx.moveTo(x + 210, cy - 40);
    ctx.lineTo(x + 250, cy - 40);
    ctx.stroke();

    // R2 Branch (Bottom)
    ctx.beginPath();
    ctx.moveTo(x + 110, cy + 40);
    ctx.lineTo(x + 150, cy + 40);
    ctx.stroke();
    // R2 Resistor Box
    ctx.fillStyle = colors.bg;
    ctx.fillRect(x + 150, cy + 28, 60, 24);
    ctx.strokeRect(x + 150, cy + 28, 60, 24);
    ctx.fillStyle = colors.textPrimary;
    ctx.fillText('R₂=3Ω', x + 156, cy + 44);
    ctx.beginPath();
    ctx.moveTo(x + 210, cy + 40);
    ctx.lineTo(x + 250, cy + 40);
    ctx.stroke();

    // Parallel Rejoin
    ctx.beginPath();
    ctx.moveTo(x + 250, cy - 40);
    ctx.lineTo(x + 250, cy + 40);
    ctx.moveTo(x + 250, cy);
    ctx.lineTo(x + 310, cy);
    ctx.stroke();

    // R3 Resistor Box (Series)
    ctx.fillStyle = colors.bg;
    ctx.fillRect(x + 310, cy - 12, 60, 24);
    ctx.strokeRect(x + 310, cy - 12, 60, 24);
    ctx.fillStyle = colors.textPrimary;
    ctx.fillText('R₃=4Ω', x + 316, cy + 4);

    // Line from R3 to Terminal B with Switch
    ctx.beginPath();
    ctx.moveTo(x + 370, cy);
    ctx.lineTo(x + 420, cy);
    ctx.stroke();

    // Terminal B
    ctx.fillStyle = colors.amber;
    ctx.beginPath();
    ctx.arc(x + 470, cy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = 'bold 13px monospace';
    ctx.fillText('B', x + 466, cy - 10);

    ctx.beginPath();
    ctx.moveTo(x + 420, cy);
    ctx.lineTo(x + 466, cy);
    ctx.stroke();
  }

  // Sub-renderer: Geometry Diagram
  function drawGeometryDiagram(ctx, x, y, width, height, diagram, colors) {
    const cx = x + (width / 2);
    const cy = y + (height / 2) + 10;
    const r = 65;

    // Circle
    ctx.strokeStyle = colors.textSecondary;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Center point O
    ctx.fillStyle = colors.textSecondary;
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '11px monospace';
    ctx.fillText('O', cx + 6, cy + 4);

    // Vertex points: A on bottom, B on top-right, C on top-left
    const ptA = { x: cx, y: cy + r };
    const ptB = { x: cx + r * Math.cos(-Math.PI / 4), y: cy + r * Math.sin(-Math.PI / 4) };
    const ptC = { x: cx + r * Math.cos(-3 * Math.PI / 4), y: cy + r * Math.sin(-3 * Math.PI / 4) };

    // Inscribed Triangle ABC
    ctx.strokeStyle = colors.amber;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ptA.x, ptA.y);
    ctx.lineTo(ptB.x, ptB.y);
    ctx.lineTo(ptC.x, ptC.y);
    ctx.closePath();
    ctx.stroke();

    // Tangent Line AT at point A
    ctx.strokeStyle = colors.emerald;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ptA.x - 90, ptA.y);
    ctx.lineTo(ptA.x + 90, ptA.y);
    ctx.stroke();

    // Labels
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = colors.emerald;
    ctx.fillText('Дотична T', ptA.x + 50, ptA.y + 16);

    ctx.fillStyle = colors.textPrimary;
    ctx.fillText('A', ptA.x - 4, ptA.y + 16);
    ctx.fillText('B', ptB.x + 6, ptB.y);
    ctx.fillText('C', ptC.x - 14, ptC.y);

    // Angle indicator arc
    ctx.strokeStyle = colors.amber;
    ctx.beginPath();
    ctx.arc(ptA.x, ptA.y, 24, -Math.PI / 4, 0);
    ctx.stroke();
    ctx.font = '11px monospace';
    ctx.fillStyle = colors.amber;
    ctx.fillText('64°', ptA.x + 28, ptA.y - 6);
  }

  // Draw Dynamic Watermark
  function drawDynamicWatermark(ctx, w, h, sessionId, timestamp, watermarkColor) {
    ctx.save();
    ctx.font = '11px monospace';
    ctx.fillStyle = watermarkColor;
    const watermarkText = `STRICT-AI • ID: ${sessionId} • ${timestamp} • PROCTOR SECURED`;
    ctx.fillText(watermarkText, 24, h - 14);

    // Diagonal low-opacity security watermark
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-Math.PI / 10);
    ctx.textAlign = 'center';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`STRICT-AI ACADEMIC INTEGRITY • ${sessionId}`, 0, 0);
    ctx.restore();
  }

  // Helper: Rounded Rectangle path
  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function formatTypeName(type) {
    switch (type) {
      case 'case_study':
      case 'context_case': return 'Контекстне завдання курсу (Case Study)';
      case 'visual_diagram':
      case 'visual_schema': return 'Візуальна схема на Canvas (OCR-Shield)';
      case 'find_bug':
      case 'find_the_bug': return 'Аналіз помилок у рішенні (Find The Bug)';
      case 'llm_trap': return 'StrictAI Domain Trap (LLM-Shield)';
      default: return 'StrictAI Завдання';
    }
  }

  /* ==========================================================================
     3. BROWSER LOCKDOWN & FOCUS/BLUR ENGINE
     Prevents DevTools, right-click, copy-paste, tab switches
     ========================================================================== */
  const LockdownState = {
    enabled: false,
    options: {},
    prevUserSelect: '',
    handlers: null,
    tabBlurCount: 0,
    activeQuestionLocked: false,
    auditLog: [],
    bannerTimeout: null,
    focusTrackingCallback: null
  };

  const FocusTrackingState = {
    active: false,
    violationCount: 0,
    onViolation: null,
    lastBlurTime: 0,
    blurHandler: null,
    visHandler: null
  };

  function showToast(message, type = 'warning') {
    if (typeof window !== 'undefined' && window.StrictComponents && typeof window.StrictComponents.toast === 'function') {
      window.StrictComponents.toast(message, type === 'danger' ? 'error' : type);
      return;
    }
    // Fallback floating toast in Dark Graphite theme
    if (typeof document === 'undefined') return;
    let container = document.getElementById('strict-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'strict-toast-container';
      container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:999999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    const borderColor = type === 'danger' || type === 'error' ? '#ef4743' : (type === 'success' ? '#2cbb5d' : '#ffa116');
    toast.style.cssText = `display:flex;align-items:center;gap:10px;padding:12px 18px;background:#282828;color:#eff1f6;border:1px solid ${borderColor};border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.5);font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:13.5px;font-weight:500;animation:strict-slide-down 0.25s ease;pointer-events:auto;`;
    toast.innerHTML = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3500);
  }

  function enableSecurityLocks(options = {}) {
    if (typeof window === 'undefined') return;
    if (LockdownState.enabled) return;

    LockdownState.enabled = true;
    LockdownState.options = options;

    // Apply user-select: none to body
    if (document.body) {
      LockdownState.prevUserSelect = document.body.style.userSelect;
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    }

    function handleBlocked(e, reason) {
      e.preventDefault();
      e.stopPropagation();
      showToast('🛡️ Анти-Чит: Копіювання та контекстне меню заблоковано!', 'warning');
      recordViolation('SECURITY_LOCK', reason);
    }

    function onContextMenu(e) {
      handleBlocked(e, 'Context menu');
    }

    function onClipboardBlock(e) {
      handleBlocked(e, `Clipboard ${e.type}`);
    }

    function onSelectStartBlock(e) {
      e.preventDefault();
      e.stopPropagation();
      showToast('🛡️ Анти-Чит: Копіювання та контекстне меню заблоковано!', 'warning');
    }

    function onKeyDownLockdown(e) {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const key = e.key ? e.key.toLowerCase() : '';

      // Block DevTools
      if (e.key === 'F12' || (isCtrlOrCmd && e.shiftKey && (key === 'i' || key === 'j' || key === 'c'))) {
        handleBlocked(e, `DevTools shortcut (${e.key})`);
        return;
      }

      // Block Ctrl+U, Ctrl+S, Ctrl+C, Ctrl+V, Ctrl+P, Ctrl+A
      if (isCtrlOrCmd && ['c', 'u', 's', 'v', 'p', 'a'].includes(key)) {
        handleBlocked(e, `Shortcut Ctrl+${key.toUpperCase()}`);
      }
    }

    LockdownState.handlers = {
      contextmenu: onContextMenu,
      copy: onClipboardBlock,
      cut: onClipboardBlock,
      paste: onClipboardBlock,
      selectstart: onSelectStartBlock,
      keydown: onKeyDownLockdown
    };

    window.addEventListener('contextmenu', onContextMenu, true);
    window.addEventListener('copy', onClipboardBlock, true);
    window.addEventListener('cut', onClipboardBlock, true);
    window.addEventListener('paste', onClipboardBlock, true);
    window.addEventListener('selectstart', onSelectStartBlock, true);
    window.addEventListener('keydown', onKeyDownLockdown, true);

    logAudit('LOCKDOWN_ENABLED', 'Browser security locks enabled');

    if (typeof options.onViolation === 'function' && !FocusTrackingState.active) {
      startFocusTracking(options.onViolation);
    }
  }

  function disableSecurityLocks() {
    if (typeof window === 'undefined' || !LockdownState.enabled) return;
    LockdownState.enabled = false;

    if (document.body) {
      document.body.style.userSelect = LockdownState.prevUserSelect || '';
      document.body.style.webkitUserSelect = '';
    }

    if (LockdownState.handlers) {
      window.removeEventListener('contextmenu', LockdownState.handlers.contextmenu, true);
      window.removeEventListener('copy', LockdownState.handlers.copy, true);
      window.removeEventListener('cut', LockdownState.handlers.cut, true);
      window.removeEventListener('paste', LockdownState.handlers.paste, true);
      window.removeEventListener('selectstart', LockdownState.handlers.selectstart, true);
      window.removeEventListener('keydown', LockdownState.handlers.keydown, true);
      LockdownState.handlers = null;
    }

    logAudit('LOCKDOWN_DISABLED', 'Browser security locks disabled');
  }

  // Backward compatibility alias
  const enableBrowserLockdown = enableSecurityLocks;
  const disableBrowserLockdown = disableSecurityLocks;

  function startFocusTracking(onViolation) {
    if (typeof window === 'undefined') return;
    FocusTrackingState.active = true;
    FocusTrackingState.onViolation = onViolation;

    function handleFocusLoss(source) {
      if (!FocusTrackingState.active) return;
      const now = Date.now();
      // Debounce: prevent duplicate trigger from simultaneous blur + visibilitychange
      if (now - FocusTrackingState.lastBlurTime < 800) return;
      FocusTrackingState.lastBlurTime = now;

      FocusTrackingState.violationCount++;
      LockdownState.tabBlurCount = FocusTrackingState.violationCount;
      const count = FocusTrackingState.violationCount;
      logAudit('FOCUS_LOST', `Focus lost (${source}). Strike count: ${count}`);

      if (count === 1) {
        showToast('⚠️ Порушення 1/2: Ви покинули вкладку іспиту!', 'warning');
        showLockdownAlert('⚠️ Порушення 1/2: Ви покинули вкладку іспиту!');
        if (typeof FocusTrackingState.onViolation === 'function') {
          FocusTrackingState.onViolation(1);
        }
      } else if (count >= 2) {
        LockdownState.activeQuestionLocked = true;
        showToast('🚨 Порушення 2/2: Питання анульовано через вихід з вкладки!', 'danger');
        showLockdownAlert('🚨 Порушення 2/2: Питання анульовано через вихід з вкладки!');
        if (typeof FocusTrackingState.onViolation === 'function') {
          FocusTrackingState.onViolation(2);
        }
      }
    }

    if (!FocusTrackingState.blurHandler) {
      FocusTrackingState.blurHandler = () => handleFocusLoss('window_blur');
      FocusTrackingState.visHandler = () => {
        if (document.hidden) handleFocusLoss('visibilitychange');
      };
      window.addEventListener('blur', FocusTrackingState.blurHandler, true);
      document.addEventListener('visibilitychange', FocusTrackingState.visHandler, true);
    }
  }

  function resetFocusTracking() {
    FocusTrackingState.violationCount = 0;
    FocusTrackingState.lastBlurTime = 0;
    LockdownState.tabBlurCount = 0;
    LockdownState.activeQuestionLocked = false;
  }

  function showLockdownAlert(message) {
    if (typeof document === 'undefined') return;

    let banner = document.getElementById('strict-lockdown-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'strict-lockdown-banner';
      banner.className = 'strict-lockdown-banner';
      document.body.appendChild(banner);
    }

    banner.innerHTML = `<span>🛡️ StrictAI Anti-Cheat</span><span>${message}</span>`;
    banner.style.display = 'flex';

    if (LockdownState.bannerTimeout) {
      clearTimeout(LockdownState.bannerTimeout);
    }
    LockdownState.bannerTimeout = setTimeout(() => {
      if (banner && banner.parentNode) {
        banner.style.display = 'none';
      }
    }, 3500);
  }

  function recordViolation(type, details) {
    logAudit(`VIOLATION_${type}`, details);
    if (typeof LockdownState.options.onViolation === 'function') {
      LockdownState.options.onViolation(type, details);
    }
    BiometricsState.trustScore = Math.max(0, BiometricsState.trustScore - 15);
  }

  function logAudit(action, details) {
    LockdownState.auditLog.push({
      time: new Date().toISOString(),
      action,
      details
    });
  }

  /* ==========================================================================
     4. AI EXTENSION SHIELD (MUTATIONOBSERVER & SIMULATION)
     Catches injected AI assistants: Monica, Sider, ChatGPT, Merlin, MaxAI
     ========================================================================== */
  const ExtensionShieldState = {
    active: false,
    observer: null,
    options: {},
    detectedExtensions: new Set()
  };

  const KNOWN_AI_PATTERNS = [
    'monica',
    'sider',
    'chatgpt',
    'merlin',
    'maxai',
    'harpa',
    'chathub',
    'ai-assistant',
    'copilot'
  ];

  function initMutationObserver(onDetected) {
    if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') return;
    const options = typeof onDetected === 'function' ? { onDetected } : (onDetected || {});

    if (ExtensionShieldState.active) {
      if (options.onDetected) ExtensionShieldState.options.onDetected = options.onDetected;
      return;
    }

    ExtensionShieldState.active = true;
    ExtensionShieldState.options = options;

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) { // ELEMENT_NODE
            checkElementForAIExtension(node);
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['id', 'class']
    });

    ExtensionShieldState.observer = observer;

    // Check pre-existing nodes or global vars
    scanExistingDOMForExtensions();
  }

  const startExtensionShield = initMutationObserver;

  function stopExtensionShield() {
    if (ExtensionShieldState.observer) {
      ExtensionShieldState.observer.disconnect();
      ExtensionShieldState.observer = null;
    }
    ExtensionShieldState.active = false;
  }

  function checkElementForAIExtension(el) {
    const id = (el.id || '').toLowerCase();
    const className = (typeof el.className === 'string' ? el.className : '').toLowerCase();
    const tagName = (el.tagName || '').toLowerCase();

    for (const pattern of KNOWN_AI_PATTERNS) {
      if (id.includes(pattern) || className.includes(pattern) || tagName.includes(pattern)) {
        handleExtensionDetected(pattern.toUpperCase() + ' AI Extension', el);
        return;
      }
    }
  }

  function scanExistingDOMForExtensions() {
    if (typeof window === 'undefined') return;

    // Check globals injected by extensions
    if (window.__MONICA__ || window.monica) handleExtensionDetected('Monica AI (Global Object)');
    if (window.__SIDER__ || window.sider) handleExtensionDetected('Sider AI (Global Object)');
    if (window.__MAXAI__) handleExtensionDetected('MaxAI (Global Object)');

    // Check known selector matches
    KNOWN_AI_PATTERNS.forEach(pat => {
      const match = document.querySelector(`[id*="${pat}"], [class*="${pat}"]`);
      if (match) {
        handleExtensionDetected(`${pat.toUpperCase()} Assistant (DOM Node)`, match);
      }
    });
  }

  function handleExtensionDetected(name, element) {
    if (ExtensionShieldState.detectedExtensions.has(name)) return;
    ExtensionShieldState.detectedExtensions.add(name);

    logAudit('AI_EXTENSION_DETECTED', name);
    BiometricsState.trustScore = Math.max(0, BiometricsState.trustScore - 40);

    showExtensionWarningModal(name, () => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });

    if (typeof ExtensionShieldState.options.onDetected === 'function') {
      ExtensionShieldState.options.onDetected(name);
    }
  }

  function showExtensionWarningModal(extensionName, onResolve) {
    if (typeof document === 'undefined') return;

    let modal = document.getElementById('strict-extension-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'strict-extension-modal';
      modal.className = 'strict-modal-backdrop active';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="strict-modal-card danger" style="background:#1e1e1e; border:1px solid rgba(239,71,67,0.7); border-radius:12px; padding:24px; max-width:520px; color:#eff1f6; box-shadow:0 12px 36px rgba(0,0,0,0.7); font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:14px;">
          <div style="font-size:30px;">⚠️</div>
          <div>
            <h3 style="margin:0; font-size:16px; font-weight:700; color:#ef4743;">⚠️ Виявлено активне ШІ-розширення (Monica / Sider / ChatGPT)!</h3>
            <p style="margin:4px 0 0 0; font-size:12px; color:#9ca3af; font-family:monospace;">${extensionName || 'AI Copilot'}</p>
          </div>
        </div>
        <p style="font-size:13.5px; line-height:1.55; color:#eff1f6; margin-bottom:20px;">
          Вимкніть розширення для продовження тестування. Політика доброчесності StrictAI вимагає самостійного виконання завдань без автоматичних генеративних помічників.
        </p>
        <div style="display:flex; justify-content:flex-end;">
          <button id="strict-btn-dismiss-ext" style="background:#ffa116; color:#121212; font-weight:700; padding:10px 18px; border-radius:6px; cursor:pointer; border:none; font-size:13px; font-family:inherit;">
            Закрити розширення та відновити тест
          </button>
        </div>
      </div>
    `;

    document.getElementById('strict-btn-dismiss-ext').onclick = function () {
      const testEl = document.getElementById('monica-ext-shield-test');
      if (testEl && testEl.parentNode) testEl.parentNode.removeChild(testEl);

      if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
      if (typeof onResolve === 'function') onResolve();
      if (typeof ExtensionShieldState.options?.onDetected === 'function') {
        ExtensionShieldState.options.onDetected('dismissed');
      }
    };
  }

  // Simulation method for testing the extension shield
  function simulateAIExtension() {
    if (typeof document === 'undefined') return;

    // Remove any previous simulated test element
    const existing = document.getElementById('monica-ext-shield-test');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    const dummyEl = document.createElement('div');
    dummyEl.className = 'monica-chatgpt-copilot-widget';
    dummyEl.id = 'monica-ext-shield-test';
    dummyEl.style.display = 'none';

    if (typeof window !== 'undefined') {
      window.__MONICA__ = true;
    }

    document.body.appendChild(dummyEl);
    console.warn('[StrictAntiCheat] Simulated extension attack triggered: #monica-ext-shield-test');
  }

  const simulateExtensionAttack = simulateAIExtension;

  /* ==========================================================================
     5. ONE-WAY QUESTION COUNTDOWN TIMER (30-60s)
     Enforces hard per-question limits without backward navigation
     ========================================================================== */
  const TimerState = {
    intervalId: null,
    totalSeconds: 45,
    secondsLeft: 45,
    containerEl: null,
    onTick: null,
    onExpired: null
  };

  function startQuestionTimer(containerOrSec = 45, durationSec = 45, onTick = null, onExpire = null) {
    stopQuestionTimer();

    let containerEl = null;
    let totalSec = 45;
    let tickFn = null;
    let expireFn = null;

    if (typeof containerOrSec === 'number') {
      totalSec = containerOrSec;
      tickFn = typeof durationSec === 'function' ? durationSec : onTick;
      expireFn = typeof onTick === 'function' ? onTick : onExpire;
    } else if (containerOrSec && typeof containerOrSec === 'object' && containerOrSec.nodeType) {
      containerEl = containerOrSec;
      totalSec = typeof durationSec === 'number' ? durationSec : 45;
      tickFn = onTick;
      expireFn = onExpire;
    } else if (typeof containerOrSec === 'string') {
      containerEl = document.querySelector(containerOrSec);
      totalSec = typeof durationSec === 'number' ? durationSec : 45;
      tickFn = onTick;
      expireFn = onExpire;
    } else if (typeof containerOrSec === 'object' && containerOrSec !== null) {
      totalSec = typeof containerOrSec.durationSec === 'number' ? containerOrSec.durationSec : 45;
      containerEl = containerOrSec.containerEl || containerOrSec.countdownEl?.parentElement || null;
      tickFn = containerOrSec.onTick || onTick;
      expireFn = containerOrSec.onExpire || containerOrSec.onExpired || onExpire;
    }

    TimerState.totalSeconds = totalSec;
    TimerState.secondsLeft = totalSec;
    TimerState.containerEl = containerEl;
    TimerState.onTick = tickFn;
    TimerState.onExpired = expireFn;

    let timerValEl = null;
    let timerFillEl = null;

    if (containerEl && typeof document !== 'undefined') {
      containerEl.innerHTML = `
        <div class="strict-question-timer-wrapper" style="width:100%; margin:8px 0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-size:12px; font-weight:600; color:var(--ac-accent-primary, #ffa116); display:flex; align-items:center; gap:6px;">
              <span>⏱</span> <span>Жорсткий таймер запитання</span>
            </span>
            <span class="strict-timer-seconds-display" style="font-size:13px; font-weight:700; font-family:var(--ac-font-mono, monospace); color:var(--ac-accent-primary, #ffa116);">
              ${totalSec}s
            </span>
          </div>
          <div class="strict-timer-bar-track" style="width:100%; height:6px; background:#282828; border-radius:9999px; overflow:hidden;">
            <div class="strict-timer-bar-fill" style="height:100%; width:100%; background:linear-gradient(90deg, #ffa116 0%, #ff7816 100%); transition:width 1s linear, background 0.3s ease; border-radius:9999px;"></div>
          </div>
        </div>
      `;
      timerValEl = containerEl.querySelector('.strict-timer-seconds-display');
      timerFillEl = containerEl.querySelector('.strict-timer-bar-fill');
    }

    if (typeof tickFn === 'function') {
      tickFn(TimerState.secondsLeft, 100);
    }

    TimerState.intervalId = setInterval(() => {
      TimerState.secondsLeft--;
      const percent = Math.max(0, (TimerState.secondsLeft / TimerState.totalSeconds) * 100);

      if (timerValEl) {
        timerValEl.textContent = `${TimerState.secondsLeft}s`;
        if (TimerState.secondsLeft <= 10) {
          timerValEl.style.color = '#ef4743';
        }
      }
      if (timerFillEl) {
        timerFillEl.style.width = `${percent}%`;
        if (TimerState.secondsLeft <= 12) {
          timerFillEl.style.background = 'linear-gradient(90deg, #ffa116 0%, #ef4743 100%)';
        }
      }

      if (typeof TimerState.onTick === 'function') {
        TimerState.onTick(TimerState.secondsLeft, percent);
      }

      if (TimerState.secondsLeft <= 0) {
        stopQuestionTimer();
        if (typeof TimerState.onExpired === 'function') {
          TimerState.onExpired();
        }
      }
    }, 1000);
  }

  function stopQuestionTimer() {
    if (TimerState.intervalId) {
      clearInterval(TimerState.intervalId);
      TimerState.intervalId = null;
    }
  }

  /* ==========================================================================
     6. COMPUTERIZED ADAPTIVE TESTING (CAT) ROUTING
     Calculates theta ability & routes to optimal difficulty 1..5
     ========================================================================== */
  function getNextAdaptiveQuestion(history = [], currentDifficulty = 3, lastResult = null, subjectFilter = null) {
    const answeredIds = new Set(history.map(h => h.id || h.questionId));

    // Calculate next target difficulty
    let nextDifficulty = currentDifficulty;
    if (lastResult !== null) {
      if (lastResult.correct) {
        nextDifficulty = Math.min(5, currentDifficulty + 1);
      } else {
        nextDifficulty = Math.max(1, currentDifficulty - 1);
      }
    }

    // Filter available pool
    let candidates = AI_RESILIENT_QUESTIONS.filter(q => !answeredIds.has(q.id));

    if (subjectFilter && subjectFilter !== 'all') {
      const subjectFiltered = candidates.filter(q => q.subject === subjectFilter);
      if (subjectFiltered.length > 0) {
        candidates = subjectFiltered;
      }
    }

    if (candidates.length === 0) {
      // All questions in subject answered; fallback to any unanswered
      candidates = AI_RESILIENT_QUESTIONS.filter(q => !answeredIds.has(q.id));
      if (candidates.length === 0) {
        // Pool exhausted, loop from pool
        candidates = AI_RESILIENT_QUESTIONS.slice();
      }
    }

    // Sort by proximity to target difficulty and cognitive format diversity
    const lastFormat = history.length > 0 ? history[history.length - 1].type : null;
    candidates.sort((a, b) => {
      const diffDiffA = Math.abs(a.difficulty - nextDifficulty);
      const diffDiffB = Math.abs(b.difficulty - nextDifficulty);
      if (diffDiffA !== diffDiffB) return diffDiffA - diffDiffB;
      // Prefer different format than the immediate predecessor
      if (a.type === lastFormat && b.type !== lastFormat) return 1;
      if (b.type === lastFormat && a.type !== lastFormat) return -1;
      return 0;
    });

    const chosenQuestion = candidates[0] || AI_RESILIENT_QUESTIONS[0];
    return {
      nextQuestion: chosenQuestion,
      targetDifficulty: nextDifficulty,
      stats: {
        totalAnswered: answeredIds.size,
        remainingInPool: candidates.length
      }
    };
  }

  /* ==========================================================================
     7. 20-SECOND MICRO-VERIFICATION BLITZ MODAL
     Verifies user understanding immediately after response submission
     ========================================================================== */
  function openMicroVerificationModal(options = {}) {
    return new Promise(resolve => {
      if (typeof document === 'undefined') {
        const res = { verified: true, justification: 'SSR_ENV', text: 'SSR_ENV', timedOut: false, passed: true };
        if (typeof options.onComplete === 'function') options.onComplete(res);
        resolve(res);
        return;
      }

      const answerText = options.answerText || options.chosenAnswer || options.answer || 'X';
      const promptText = options.prompt || `Ви обрали відповідь: [${answerText}]. Коротко поясніть хід своєї думки або вкажіть ключовий принцип:`;
      const expectedKeywords = options.expectedKeywords || [];

      let modal = document.getElementById('strict-micro-verify-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'strict-micro-verify-modal';
        modal.className = 'strict-modal-backdrop active';
        document.body.appendChild(modal);
      }

      let timeLeft = 20;
      let timerInterval = null;

      modal.innerHTML = `
        <div class="strict-modal-card amber" style="background:#1e1e1e; border:1px solid rgba(255,161,22,0.6); border-radius:12px; padding:22px; max-width:540px; color:#eff1f6; box-shadow:0 10px 30px rgba(0,0,0,0.7); font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:22px; color:#ffa116;">⚡</span>
              <h3 style="margin:0; font-size:16px; color:var(--ac-accent-primary, #ffa116);">⚡ 20-секундна Мікро-Верифікація відповіді</h3>
            </div>
            <div id="strict-verify-timer-label" style="font-family:var(--ac-font-mono, monospace); font-weight:bold; font-size:14px; color:var(--ac-accent-primary, #ffa116);">
              20с
            </div>
          </div>
          <div class="strict-timer-bar-track" style="width:100%; height:6px; background:#282828; border-radius:9999px; overflow:hidden; margin:12px 0;">
            <div id="strict-verify-timer-fill" class="strict-timer-bar-fill" style="width:100%; height:100%; background:linear-gradient(90deg, #ffa116, #ef4743); transition:width 1s linear; border-radius:9999px;"></div>
          </div>
          <p style="font-size:13.5px; line-height:1.45; color:var(--ac-text-primary, #eff1f6); margin:12px 0 10px 0;">
            ${promptText}
          </p>
          <textarea id="strict-verify-input" rows="3" placeholder="Введіть 1 речення підтвердження або ключовий принцип..." style="
            width:100%;
            box-sizing:border-box;
            background:var(--ac-bg-elevated, #262626);
            border:1px solid var(--ac-border-subtle, #3d3d3d);
            border-radius:var(--ac-radius-sm, 6px);
            color:var(--ac-text-primary, #eff1f6);
            padding:10px;
            font-size:13.5px;
            font-family:inherit;
            outline:none;
            resize:none;
          "></textarea>
          <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:14px;">
            <button id="strict-verify-submit-btn" class="strict-btn strict-btn-primary" style="background:#ffa116; color:#121212; font-weight:700; padding:9px 18px; border-radius:6px; border:none; cursor:pointer; font-size:13px; font-family:inherit;">
              Підтвердити верифікацію
            </button>
          </div>
        </div>
      `;

      const inputEl = document.getElementById('strict-verify-input');
      const timerFill = document.getElementById('strict-verify-timer-fill');
      const timerLabel = document.getElementById('strict-verify-timer-label');
      const submitBtn = document.getElementById('strict-verify-submit-btn');

      if (inputEl) inputEl.focus();

      function finishVerification(isTimeout = false) {
        if (timerInterval) clearInterval(timerInterval);
        const enteredText = (inputEl ? inputEl.value : '').trim();

        // Keyword validation check
        let keywordScore = 0;
        if (expectedKeywords.length > 0) {
          const lowerText = enteredText.toLowerCase();
          expectedKeywords.forEach(kw => {
            if (lowerText.includes(kw.toLowerCase())) keywordScore++;
          });
        }

        const passed = enteredText.length >= 3;
        if (modal && modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }

        const res = {
          verified: passed,
          passed,
          justification: enteredText,
          text: enteredText,
          timeSpent: 20 - timeLeft,
          timedOut: isTimeout,
          keywordsMatched: keywordScore
        };
        if (typeof options.onComplete === 'function') {
          try { options.onComplete(res); } catch (err) { console.warn('[StrictAntiCheat] onComplete error:', err); }
        }
        resolve(res);
      }

      submitBtn.onclick = () => finishVerification(false);
      inputEl.onkeydown = function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          finishVerification(false);
        }
      };

      timerInterval = setInterval(() => {
        timeLeft--;
        if (timerLabel) timerLabel.textContent = timeLeft + 'с';
        if (timerFill) {
          const pct = (timeLeft / 20) * 100;
          timerFill.style.width = pct + '%';
          if (timeLeft <= 5) timerFill.classList.add('critical');
        }
        if (timeLeft <= 0) {
          finishVerification();
        }
      }, 1000);
    });
  }

  /* ==========================================================================
     8. BEHAVIORAL BIOMETRICS & SUBMISSION ANOMALY DETECTOR
     Keystroke dynamics, Mouse trajectory entropy, Fast-click bot detection
     ========================================================================== */
  const BiometricsState = {
    active: false,
    startTime: 0,
    timeToFirstClick: 0,
    mousePoints: [],
    mouseInflectionCount: 0,
    mouseDistance: 0,
    keyTimes: [],
    pasteDetected: false,
    automationFlag: false,
    automationReasons: [],
    trustScore: 100, // 0 to 100%
    targetElement: null
  };

  function startBiometricsTracker(targetElement = null) {
    if (typeof window === 'undefined') return;

    BiometricsState.active = true;
    BiometricsState.startTime = performance.now();
    BiometricsState.timeToFirstClick = 0;
    BiometricsState.mousePoints = [];
    BiometricsState.mouseInflectionCount = 0;
    BiometricsState.mouseDistance = 0;
    BiometricsState.keyTimes = [];
    BiometricsState.pasteDetected = false;
    BiometricsState.automationFlag = false;
    BiometricsState.automationReasons = [];
    BiometricsState.targetElement = targetElement || document.body;

    const el = BiometricsState.targetElement;
    el.addEventListener('mousemove', onBiometricsMouseMove, { passive: true });
    el.addEventListener('click', onBiometricsClick, { passive: true });
    document.addEventListener('keydown', onBiometricsKeyDown, { passive: true });
    document.addEventListener('paste', onBiometricsPaste, { passive: true });
  }

  function onBiometricsMouseMove(e) {
    const now = performance.now();
    const lastPt = BiometricsState.mousePoints[BiometricsState.mousePoints.length - 1];

    if (lastPt) {
      const dx = e.clientX - lastPt.x;
      const dy = e.clientY - lastPt.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      BiometricsState.mouseDistance += dist;

      // Track directional change (inflection)
      if (BiometricsState.mousePoints.length >= 2) {
        const prevPt = BiometricsState.mousePoints[BiometricsState.mousePoints.length - 2];
        const prevDx = lastPt.x - prevPt.x;
        const prevDy = lastPt.y - prevPt.y;
        const dot = (dx * prevDx) + (dy * prevDy);
        if (dot < 0) {
          BiometricsState.mouseInflectionCount++;
        }
      }
    }

    BiometricsState.mousePoints.push({ x: e.clientX, y: e.clientY, t: now });
    if (BiometricsState.mousePoints.length > 300) {
      BiometricsState.mousePoints.shift();
    }
  }

  function onBiometricsClick() {
    if (BiometricsState.timeToFirstClick === 0) {
      BiometricsState.timeToFirstClick = Math.round(performance.now() - BiometricsState.startTime);
    }
  }

  function onBiometricsKeyDown() {
    BiometricsState.keyTimes.push(performance.now());
    if (BiometricsState.keyTimes.length > 50) {
      BiometricsState.keyTimes.shift();
    }
  }

  function onBiometricsPaste() {
    BiometricsState.pasteDetected = true;
    BiometricsState.automationReasons.push('Clipboard paste event recorded during response input');
    BiometricsState.trustScore = Math.max(0, BiometricsState.trustScore - 20);
  }

  function calculateMouseEntropy() {
    if (BiometricsState.mousePoints.length < 5) return 0;
    const inflections = BiometricsState.mouseInflectionCount;
    const dist = BiometricsState.mouseDistance;
    // Normalized entropy: human reading/hovering yields 0.25 to 0.85
    const entropy = Math.min(1.0, (inflections / 10) * (dist / 400));
    return parseFloat(entropy.toFixed(3));
  }

  function calculateWPM() {
    if (BiometricsState.keyTimes.length < 5) return 0;
    const firstKey = BiometricsState.keyTimes[0];
    const lastKey = BiometricsState.keyTimes[BiometricsState.keyTimes.length - 1];
    const minutes = (lastKey - firstKey) / 60000;
    if (minutes <= 0) return 0;
    const words = BiometricsState.keyTimes.length / 5;
    return Math.round(words / minutes);
  }

  function getBiometricsSummary(questionCharCount = 200) {
    const elapsedSeconds = (performance.now() - BiometricsState.startTime) / 1000;
    const mouseEntropy = calculateMouseEntropy();
    const wpm = calculateWPM();

    // Automation Check 1: Abnormally fast answer submission (<4s on question with >200 chars)
    if (questionCharCount > 180 && elapsedSeconds < 4.0) {
      BiometricsState.automationFlag = true;
      BiometricsState.automationReasons.push(`Abnormally fast response (${elapsedSeconds.toFixed(1)}s for ${questionCharCount} chars question)`);
      BiometricsState.trustScore = Math.max(0, BiometricsState.trustScore - 30);
    }

    // Automation Check 2: Zero or unnaturally low mouse entropy on canvas
    if (mouseEntropy < 0.04 && elapsedSeconds > 2.0) {
      BiometricsState.automationFlag = true;
      BiometricsState.automationReasons.push('Absence of exploratory mouse trajectory over OCR canvas (robotic submission)');
      BiometricsState.trustScore = Math.max(0, BiometricsState.trustScore - 20);
    }

    let trustRating = 'Висока (High)';
    if (BiometricsState.trustScore < 50) trustRating = 'Підозріла (Flagged)';
    else if (BiometricsState.trustScore < 80) trustRating = 'Середня (Moderate)';

    return {
      elapsedSeconds: parseFloat(elapsedSeconds.toFixed(2)),
      timeToFirstClick: BiometricsState.timeToFirstClick,
      mouseEntropy,
      mouseDistance: Math.round(BiometricsState.mouseDistance),
      mouseInflections: BiometricsState.mouseInflectionCount,
      wpm,
      pasteDetected: BiometricsState.pasteDetected,
      automationFlag: BiometricsState.automationFlag,
      automationReasons: BiometricsState.automationReasons,
      trustScore: BiometricsState.trustScore,
      trustRating,
      auditLog: LockdownState.auditLog
    };
  }

  /* ==========================================================================
     9. REACT INTEGRATION COMPONENTS
     Provided on window.StrictAntiCheat.ReactComponents (uses React.createElement)
     ========================================================================== */
  const ReactComponents = {
    // 1. QuestionCanvas Component
    QuestionCanvas: function (props) {
      const React = (typeof window !== 'undefined' && window.React) || null;
      if (!React) return null;

      const canvasRef = React.useRef(null);

      React.useEffect(() => {
        if (canvasRef.current && props.question) {
          renderQuestionCanvas(canvasRef.current, props.question, {
            theme: props.theme || 'dark',
            sessionId: props.sessionId,
            width: props.width
          });
        }
      }, [props.question, props.theme, props.width]);

      return React.createElement('div', { className: 'strict-canvas-shield-wrapper' },
        React.createElement('canvas', {
          ref: canvasRef,
          className: 'strict-canvas-shield'
        }),
        React.createElement('div', { className: 'strict-canvas-watermark-tag' },
          '🛡️ OCR-SHIELD ACTIVE'
        )
      );
    },

    // 2. TimerBar Component
    TimerBar: function (props) {
      const React = (typeof window !== 'undefined' && window.React) || null;
      if (!React) return null;

      const percent = Math.max(0, Math.min(100, (props.secondsLeft / (props.totalSeconds || 45)) * 100));
      const isCritical = props.secondsLeft <= 10;

      return React.createElement('div', { style: { width: '100%', margin: '8px 0' } },
        React.createElement('div', {
          style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: isCritical ? '#ef4743' : '#ffa116' }
        },
          React.createElement('span', null, '⏱ Жорсткий таймер запитання'),
          React.createElement('span', null, `${props.secondsLeft}с`)
        ),
        React.createElement('div', { className: 'strict-timer-bar-track' },
          React.createElement('div', {
            className: `strict-timer-bar-fill ${isCritical ? 'critical' : ''}`,
            style: { width: `${percent}%` }
          })
        )
      );
    },

    // 3. BiometricsWidget Component
    BiometricsWidget: function (props) {
      const React = (typeof window !== 'undefined' && window.React) || null;
      if (!React) return null;

      const summary = props.summary || { trustScore: 100, trustRating: 'Висока (High)', mouseEntropy: 0.45 };
      const meterClass = summary.trustScore >= 80 ? 'high' : (summary.trustScore >= 50 ? 'medium' : 'danger');

      return React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'var(--ac-bg-surface)',
          padding: '8px 14px',
          borderRadius: 'var(--ac-radius-sm)',
          border: '1px solid var(--ac-border-subtle)'
        }
      },
        React.createElement('div', { className: `strict-trust-meter-badge ${meterClass}` },
          `Trust Score: ${summary.trustScore}%`
        ),
        React.createElement('span', { style: { fontSize: '12px', color: 'var(--ac-text-secondary)' } },
          `Рейтинг: ${summary.trustRating}`
        )
      );
    }
  };

  function renderTelemetryHUD(containerEl, catLevel = 3) {
    if (typeof document === 'undefined') return null;
    const container = typeof containerEl === 'string' ? document.querySelector(containerEl) : containerEl;
    if (!container) {
      console.warn('[StrictAntiCheat] renderTelemetryHUD: container element not found', containerEl);
      return null;
    }

    if (!BiometricsState.active) {
      startBiometricsTracker(document.body);
    }

    container.innerHTML = `
      <div class="strict-telemetry-hud" style="
        background: var(--ac-bg-surface, #1e1e1e);
        border: 1px solid var(--ac-border-subtle, #333333);
        border-radius: 10px;
        padding: 14px 18px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: var(--ac-text-primary, #eff1f6);
        margin: 10px 0;
        user-select: none;
      ">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #2d2d2d; padding-bottom:8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:16px;">🛡️</span>
            <span style="font-size:13px; font-weight:700; color:#ffa116; letter-spacing:0.3px;">STRICT-AI BIOMETRIC PROCTOR HUD</span>
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="width:8px; height:8px; border-radius:50%; background:#2cbb5d; display:inline-block; animation:strict-pulse-dot 1.5s infinite;"></span>
            <span style="font-size:11px; color:#9ca3af; font-family:monospace;">LIVE TELEMETRY</span>
          </div>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:10px;">
          <div style="background:#262626; padding:8px 12px; border-radius:6px; border:1px solid #333;">
            <div style="font-size:11px; color:#9ca3af; margin-bottom:4px;">Довіра біометрії:</div>
            <div class="strict-hud-val-trust" style="font-size:13px; font-weight:600; color:#2cbb5d;">98% (Людина)</div>
          </div>
          <div style="background:#262626; padding:8px 12px; border-radius:6px; border:1px solid #333;">
            <div style="font-size:11px; color:#9ca3af; margin-bottom:4px;">Рух курсора (Ентропія):</div>
            <div class="strict-hud-val-entropy" style="font-size:13px; font-weight:600; color:#eff1f6;">Норма</div>
          </div>
          <div style="background:#262626; padding:8px 12px; border-radius:6px; border:1px solid #333;">
            <div style="font-size:11px; color:#9ca3af; margin-bottom:4px;">Час першого кліку:</div>
            <div class="strict-hud-val-click" style="font-size:13px; font-weight:600; color:#ffa116;">-- с (Поріг бота: < 4.0 с)</div>
          </div>
          <div style="background:#262626; padding:8px 12px; border-radius:6px; border:1px solid #333;">
            <div style="font-size:11px; color:#9ca3af; margin-bottom:4px;">Адаптивний рівень CAT:</div>
            <div class="strict-hud-val-cat" style="font-size:13px; font-weight:600; color:#ffa116;">Складність ${catLevel}/5</div>
          </div>
        </div>
      </div>
    `;

    const trustEl = container.querySelector('.strict-hud-val-trust');
    const entropyEl = container.querySelector('.strict-hud-val-entropy');
    const clickEl = container.querySelector('.strict-hud-val-click');
    const catEl = container.querySelector('.strict-hud-val-cat');

    const updateHud = () => {
      if (!container.isConnected && !document.contains(container)) {
        clearInterval(intervalId);
        return;
      }
      const entropy = calculateMouseEntropy();
      const elapsed = (performance.now() - BiometricsState.startTime) / 1000;

      // Entropy status
      if (entropyEl) {
        if (BiometricsState.mousePoints.length < 5) {
          entropyEl.textContent = 'Очікування руху...';
          entropyEl.style.color = '#9ca3af';
        } else if (entropy >= 0.12) {
          entropyEl.textContent = 'Норма (' + entropy.toFixed(2) + ')';
          entropyEl.style.color = '#2cbb5d';
        } else {
          entropyEl.textContent = 'Низька / Аномалія (' + entropy.toFixed(2) + ')';
          entropyEl.style.color = '#ef4743';
        }
      }

      // Time to first click
      if (clickEl) {
        if (BiometricsState.timeToFirstClick > 0) {
          const clickSec = (BiometricsState.timeToFirstClick / 1000).toFixed(1);
          if (BiometricsState.timeToFirstClick < 4000) {
            clickEl.innerHTML = `<span style="color:#ef4743; font-weight:bold;">${clickSec} с (⚠️ Підозра на бота: < 4.0 с)</span>`;
          } else {
            clickEl.innerHTML = `<span style="color:#2cbb5d; font-weight:bold;">${clickSec} с (Норма)</span>`;
          }
        } else {
          clickEl.textContent = `${elapsed.toFixed(1)} с (Поріг бота: < 4.0 с)`;
          clickEl.style.color = '#ffa116';
        }
      }

      // Trust score
      if (trustEl) {
        const summary = getBiometricsSummary();
        const score = summary.trustScore;
        const label = score >= 80 ? 'Людина' : (score >= 50 ? 'Перевірка' : 'Бот');
        trustEl.textContent = `${score}% (${label})`;
        trustEl.style.color = score >= 80 ? '#2cbb5d' : (score >= 50 ? '#ffa116' : '#ef4743');
      }
    };

    if (window._strictHudInterval) clearInterval(window._strictHudInterval);
    const intervalId = setInterval(updateHud, 400);
    window._strictHudInterval = intervalId;
    updateHud();

    return {
      updateCAT(level) {
        if (catEl) catEl.textContent = `Складність ${level}/5`;
      },
      destroy() {
        clearInterval(intervalId);
      }
    };
  }

  /* ==========================================================================
     10. PUBLIC API EXPORT OBJECT
     ========================================================================== */
  return {
    version: '2.5.0',
    AI_RESILIENT_QUESTIONS,
    renderQuestionCanvas,
    enableSecurityLocks,
    disableSecurityLocks,
    enableBrowserLockdown: enableSecurityLocks,
    disableBrowserLockdown: disableSecurityLocks,
    startFocusTracking,
    resetFocusTracking,
    initMutationObserver,
    startExtensionShield: initMutationObserver,
    stopExtensionShield,
    simulateAIExtension,
    simulateExtensionAttack: simulateAIExtension,
    startQuestionTimer,
    stopQuestionTimer,
    getNextAdaptiveQuestion,
    openMicroVerificationModal,
    showExtensionWarningModal,
    startBiometricsTracker,
    getBiometricsSummary,
    ReactComponents,
    renderTelemetryHUD
  };
});
