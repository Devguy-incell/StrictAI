/**
 * StrictAI — Tutor Studio Controller ("Панда-репетитор")
 * Handles sidebar settings, avatar synchronization, reactive chat stream,
 * speech recognition/synthesis, interactive quiz cards, Socratic reviews,
 * 9 pedagogical personas, 8 roleplay scenarios, session auto-save & history,
 * typewriter streaming, and polyglot official dictionary audio.
 */

(function () {
  'use strict';

  class StrictTutorController {
    constructor() {
      // Configuration & State
      this.mode = 'languages'; // 'languages' | 'school'
      this.language = 'english';
      this.languageName = 'English';
      this.level = 'A1';
      this.subject = 'math';
      this.subjectName = 'Математика';
      this.goal = 'nmt-200';
      this.goalName = 'НМТ 200!';
      this.persona = 'friend'; // 9 personas supported
      this.voiceEnabled = true;
      this.voiceGender = 'female';
      this.isLessonStarted = false;
      this.isVoiceRecording = false;
      this.speechRecognition = null;
      this.whiteboardOpen = false;
      this.roleplayOpen = false;
      this.historyDrawerOpen = false;
      this.messageCount = 0;
      this.isStreaming = false;

      // Active Roleplay Scenario State
      this.activeScenario = null;

      // Saved Messages for Active Session & History
      this.savedMessages = [];

      // 8 Roleplay Scenarios Catalog
      this.scenarios = [
        {
          id: 'cafe',
          icon: '☕',
          title: "Кав'ярня в Лондоні",
          location: "☕ Лондон, Сохо, затишна кав'ярня Artisan Roast",
          plot: "Бариста запитує про ваше замовлення, десерт та пропонує спеціальну каву дня.",
          missions: [
            "Замовити каву з рослинним молоком",
            "Розпитати про десерт без глютену",
            "Ввічливо попросити чек"
          ],
          greeting: "Hello! Welcome to Artisan Roast! What can I get started for you today? We have fantastic Ethiopian pour-over and fresh oat milk on tap! ☕",
          keywords: [
            ["milk", "oat", "latte", "coffee", "cappuccino", "plant", "almond", "молок", "вівсян", "кав"],
            ["gluten", "cake", "dessert", "pastry", "cookie", "vegan", "глютен", "десерт", "тістечк"],
            ["bill", "check", "pay", "card", "please", "receipt", "чек", "рахунок", "оплат", "рахувати"]
          ]
        },
        {
          id: 'airport',
          icon: '✈️',
          title: "Аеропорт і митниця",
          location: "✈️ Термінал 5, аеропорт Хітроу, зона паспортного контролю",
          plot: "Офіцер запитує про мету візиту, тривалість перебування та зворотний квиток.",
          missions: [
            "Пояснити мету візиту",
            "Показати бронь готелю чи квиток",
            "Пройти митну декларацію"
          ],
          greeting: "Good day, passport and landing documents please. What is the primary purpose of your visit to the United Kingdom, and how long do you plan to stay? ✈️",
          keywords: [
            ["purpose", "visit", "touris", "study", "holiday", "travel", "work", "stay", "мета", "туризм", "навчан", "відпочин"],
            ["hotel", "booking", "ticket", "return", "reservation", "stay", "готель", "квиток", "бронь", "проживан"],
            ["customs", "declare", "nothing", "goods", "baggage", "allowance", "митниц", "декларац", "нічого", "багаж"]
          ]
        },
        {
          id: 'interview',
          icon: '💼',
          title: "IT-Співбесіда",
          location: "💼 Онлайн-раунд Google/Revolut з Head of Engineering",
          plot: "Інтерв'юер просить розповісти про ваш досвід та архітектурні рішення.",
          missions: [
            "Зробити Elevator Pitch",
            "Описати складний кейс за STAR-методом",
            "Задати 2 влучні запитання інтерв'юеру"
          ],
          greeting: "Hi there! Thanks for joining today's technical architectural round. To kick things off, could you give me a brief elevator pitch about yourself and your background in software engineering? 💼",
          keywords: [
            ["engineer", "developer", "experience", "years", "stack", "react", "node", "javascript", "досвід", "інженер", "розробк", "проєкт"],
            ["situation", "task", "action", "result", "star", "scale", "problem", "solve", "кейс", "проблем", "вирішив", "оптимізув"],
            ["team", "culture", "roadmap", "architecture", "question", "tech stack", "запитан", "команд", "архітектур", "плани"]
          ]
        },
        {
          id: 'hotel',
          icon: '🏨',
          title: "Готель: Овербукінг",
          location: "🏨 Рецепція бутик-готелю в центрі Барселони",
          plot: "Адміністратор повідомляє про овербукінг вашого номеру.",
          missions: [
            "Висловити незгоду та показати ваучер",
            "Домовитися про апгрейд або сніданок",
            "Отримати письмове підтвердження"
          ],
          greeting: "Buenas tardes, welcome to Hotel Gran Vía. I'm afraid we have an unexpected overbooking situation with standard rooms tonight. Let's see what we can do... 🏨",
          keywords: [
            ["voucher", "booking", "reservation", "paid", "disagree", "confirm", "ваучер", "бронюван", "оплач", "не згоден", "номер"],
            ["upgrade", "suite", "breakfast", "complimentary", "free", "compensation", "компенсац", "сніданок", "апгрейд", "люкс"],
            ["written", "document", "paper", "signed", "proof", "letter", "письмов", "підтверджен", "довідк", "документ"]
          ]
        },
        {
          id: 'doctor',
          icon: '🏥',
          title: "Візит до лікаря",
          location: "🏥 St. Thomas Hospital, кабінет лікаря",
          plot: "Лікар збирає анамнез, запитує про симптоми та скарги.",
          missions: [
            "Описати симптоми та біль",
            "Відповісти про алергії",
            "Зрозуміти рецепт лікаря"
          ],
          greeting: "Hello, please take a seat. I'm Dr. Watson. What seems to be bothering you today, and how long have you had these symptoms? 🏥",
          keywords: [
            ["pain", "headache", "fever", "cough", "sore", "hurt", "symptom", "stomach", "біль", "голов", "температур", "кашель", "горло"],
            ["allergy", "allergic", "penicillin", "pollen", "no", "none", "reaction", "алергі", "немає", "реакці", "препарат"],
            ["prescription", "medicine", "pills", "dose", "pharmacy", "days", "recipe", "рецепт", "ліки", "приймати", "аптек"]
          ]
        },
        {
          id: 'gadget',
          icon: '💻',
          title: "Повернення гаджета",
          location: "💻 Apple Store / Saturn, відділ сервісу",
          plot: "Куплений два дні тому планшет мерехтить. Консультант з'ясовує ситуацію.",
          missions: [
            "Пояснити дефект і пред'явити чек",
            "Вимагати заміну або повернення коштів",
            "Оформити акт повернення"
          ],
          greeting: "Hello, welcome to Customer Service. How can I assist you with your device today? Do you have your purchase receipt handy? 💻",
          keywords: [
            ["screen", "flicker", "defect", "receipt", "broken", "flashing", "two days", "екран", "мерехт", "дефект", "чек", "купив"],
            ["replace", "replacement", "refund", "money", "exchange", "new device", "замін", "повернен", "кошт", "гроші"],
            ["form", "act", "sign", "warranty", "document", "paper", "service", "акт", "заяв", "гаранті", "підпис"]
          ]
        },
        {
          id: 'history_debate',
          icon: '🏛️',
          title: "Історичний дебат НМТ",
          location: "🏛️ Сесійна зала Центральної Ради, Київ, 1918 рік",
          plot: "Диспут щодо Четвертого Універсалу та державотворення УНР.",
          missions: [
            "Навести 2 аргументи за незалежність",
            "Спростувати заперечення фактами",
            "Сформулювати висновок для НМТ"
          ],
          greeting: "Вітаю в залі засідань Української Центральної Ради, січень 1918 року! 🏛️ На порядку денному доленосне питання — проголошення IV Універсалу. Які ваші вирішальні аргументи на користь повної державної незалежності УНР?",
          keywords: [
            ["більшовик", "агресі", "брест", "мир", "незалежн", "аргумент", "універсал", "війн", "держав", "соборн"],
            ["факт", "договір", "рада", "грушевськ", "армія", "спростув", "кордон", "суверенітет", "німецьк"],
            ["висновок", "нмт", "1918", "січень", "значення", "історичн", "іспит", "тест", "підсумок"]
          ]
        },
        {
          id: 'lab',
          icon: '🔬',
          title: "Лабораторія КПІ",
          location: "🔬 Фізико-хімічна лабораторія КПІ ім. Сікорського",
          plot: "Дослід закону збереження імпульсу перед захистом наукової роботи.",
          missions: [
            "Розрахувати похибку вимірювань",
            "Пояснити відхилення графіків",
            "Захистити висновок"
          ],
          greeting: "Вітаю в лабораторії КПІ! 🔬 У нас зібрана експериментальна установка для перевірки закону збереження імпульсу під час зіткнення. Датчики готові. З чого почнемо: з тарування ваг чи запуску першої серії вимірювань?",
          keywords: [
            ["похибк", "вимірюван", "дельта", "розрахун", "точність", "відносн", "абсолютн", "маса", "швидкість"],
            ["графік", "відхилен", "тертя", "втрата", "енергі", "опір", "кут", "зіткнення"],
            ["висновок", "імпульс", "збережен", "закон", "захист", "доведено", "експеримент", "підтверджено"]
          ]
        }
      ];

      // DOM Elements Cache
      this.dom = {};
    }

    /**
     * Initializes Tutor Studio on DOM ready
     */
    init() {
      // 1. Initialize shared navbar and focus guard
      if (window.StrictComponents) {
        window.StrictComponents.initPage('tutor');
      }

      // 2. Ensure advanced DOM components exist
      this._ensureDomComponents();

      // 3. Cache DOM Elements
      this._cacheDom();

      // 4. Load State from StrictStore
      this._loadInitialState();

      // 5. Initialize Red Panda Avatar
      this._initAvatar();

      // 6. Initialize Speech Recognition
      this._initSpeechRecognition();

      // 7. Bind Event Listeners
      this._bindEvents();

      // 8. Subscribe to global Store changes (parental lock, coins, streak)
      this._subscribeStore();

      // 9. Check for pending mistake review from NMT page or query params
      this._checkPendingMistakes();

      // 10. Initial UI Render
      this._renderAllSettings();
      this._renderWhiteboardFormulas();
      this.applyTranslations();

      // 11. Restore Active Session if present in localStorage
      this._restoreActiveSessionIfPresent();

      console.log('StrictAI Tutor Studio successfully initialized.');
    }

    /**
     * Injects missing advanced UI containers, controls, and CSS into the DOM.
     */
    _ensureDomComponents() {
      // 1. Inject Styles
      if (!document.getElementById('strictai-tutor-advanced-css')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'strictai-tutor-advanced-css';
        styleEl.textContent = `
          /* Typewriter Stream Cursor */
          @keyframes typewriterBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          .typewriter-cursor {
            display: inline-block;
            margin-left: 2px;
            color: var(--accent-primary, #6366f1);
            font-weight: bold;
            animation: typewriterBlink 0.7s infinite;
          }

          /* Session Restored Banner */
          .session-restored-banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 10px 16px;
            margin-bottom: 14px;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(99, 102, 241, 0.15));
            border: 1px solid rgba(16, 185, 129, 0.4);
            border-radius: 12px;
            font-size: 0.88rem;
            color: var(--text-primary, #e2e8f0);
            backdrop-filter: blur(8px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: fadeInDown 0.3s ease;
          }
          .session-restored-banner .restored-banner-content {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
          }
          .session-restored-banner .restored-banner-icon {
            font-size: 1.25rem;
          }
          .session-restored-banner .restored-banner-actions {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .btn-restored-new-lesson {
            background: var(--surface-secondary, rgba(255, 255, 255, 0.1));
            border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
            color: var(--text-primary, #fff);
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .btn-restored-new-lesson:hover {
            background: var(--accent-primary, #6366f1);
            color: #fff;
          }
          .btn-close-restored {
            background: transparent;
            border: none;
            color: var(--text-secondary, #94a3b8);
            font-size: 1rem;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 6px;
          }
          .btn-close-restored:hover {
            color: var(--text-primary, #fff);
            background: rgba(255, 255, 255, 0.1);
          }

          /* Active Scenario Banner */
          .active-scenario-banner {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 14px 18px;
            margin-bottom: 14px;
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(99, 102, 241, 0.12));
            border: 1px solid rgba(245, 158, 11, 0.4);
            border-radius: 14px;
            backdrop-filter: blur(8px);
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
          }
          .scenario-banner-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }
          .scenario-banner-left {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .scenario-banner-badge {
            background: rgba(245, 158, 11, 0.25);
            color: #f59e0b;
            border: 1px solid rgba(245, 158, 11, 0.4);
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
          }
          .scenario-banner-title {
            font-size: 1rem;
            font-weight: 700;
            color: var(--text-primary, #fff);
          }
          .btn-exit-scenario {
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(239, 68, 68, 0.4);
            color: #ef4444;
            padding: 4px 12px;
            border-radius: 8px;
            font-size: 0.8rem;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s ease;
          }
          .btn-exit-scenario:hover {
            background: #ef4444;
            color: #fff;
          }
          .scenario-banner-location, .scenario-banner-plot {
            font-size: 0.85rem;
            color: var(--text-secondary, #cbd5e1);
          }
          .scenario-banner-missions {
            margin-top: 4px;
            padding-top: 8px;
            border-top: 1px dashed rgba(255, 255, 255, 0.15);
          }
          .scenario-missions-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--text-primary, #fff);
            margin-bottom: 6px;
          }
          .scenario-progress-count {
            background: var(--surface-secondary, rgba(255, 255, 255, 0.1));
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 0.78rem;
            color: #f59e0b;
            font-weight: 700;
          }
          .scenario-missions-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .scenario-mission-item {
            font-size: 0.82rem;
            color: var(--text-secondary, #94a3b8);
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .scenario-mission-item.completed {
            color: #10b981;
            font-weight: 600;
          }

          /* Roleplay Drawer */
          .roleplay-panel-drawer {
            position: fixed;
            top: 60px;
            right: 0;
            width: 480px;
            max-width: 92vw;
            height: calc(100vh - 60px);
            background: var(--surface-primary, #0f172a);
            border-left: 1px solid var(--border-color, rgba(255, 255, 255, 0.15));
            box-shadow: -8px 0 28px rgba(0, 0, 0, 0.45);
            z-index: 1050;
            display: flex;
            flex-direction: column;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
          }
          .roleplay-panel-drawer.open {
            transform: translateX(0);
          }
          .roleplay-panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
          }
          .roleplay-panel-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 1.05rem;
            font-weight: 700;
            color: var(--text-primary, #fff);
          }
          .roleplay-panel-title h3 {
            margin: 0;
            font-size: 1.05rem;
          }
          .roleplay-close-btn {
            background: transparent;
            border: none;
            color: var(--text-secondary, #94a3b8);
            font-size: 1.2rem;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 6px;
          }
          .roleplay-close-btn:hover {
            color: var(--text-primary, #fff);
            background: rgba(255, 255, 255, 0.1);
          }
          .roleplay-panel-desc {
            padding: 12px 20px 6px;
            margin: 0;
            font-size: 0.85rem;
            color: var(--text-secondary, #94a3b8);
          }
          .roleplay-grid {
            flex: 1;
            overflow-y: auto;
            padding: 14px 20px 24px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .roleplay-card {
            background: var(--surface-card, rgba(255, 255, 255, 0.04));
            border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
            border-radius: 12px;
            padding: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .roleplay-card:hover {
            border-color: var(--accent-primary, #6366f1);
            background: rgba(99, 102, 241, 0.08);
            transform: translateY(-2px);
          }
          .roleplay-card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .roleplay-card-title {
            font-weight: 700;
            font-size: 0.95rem;
            color: var(--text-primary, #fff);
          }
          .roleplay-card-location {
            font-size: 0.8rem;
            color: #f59e0b;
          }
          .roleplay-card-plot {
            font-size: 0.82rem;
            color: var(--text-secondary, #cbd5e1);
            line-height: 1.4;
          }
          .roleplay-card-missions-preview {
            font-size: 0.76rem;
            color: var(--text-secondary, #94a3b8);
          }

          /* History Drawer */
          .tutor-history-drawer {
            position: fixed;
            top: 60px;
            right: 0;
            width: 480px;
            max-width: 92vw;
            height: calc(100vh - 60px);
            background: var(--surface-primary, #0f172a);
            border-left: 1px solid var(--border-color, rgba(255, 255, 255, 0.15));
            box-shadow: -8px 0 28px rgba(0, 0, 0, 0.45);
            z-index: 1050;
            display: flex;
            flex-direction: column;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
          }
          .tutor-history-drawer.open {
            transform: translateX(0);
          }
          .history-drawer-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
          }
          .history-drawer-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 1.05rem;
            font-weight: 700;
            color: var(--text-primary, #fff);
          }
          .history-drawer-title h4 {
            margin: 0;
            font-size: 1.05rem;
          }
          .history-close-btn {
            background: transparent;
            border: none;
            color: var(--text-secondary, #94a3b8);
            font-size: 1.2rem;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 6px;
          }
          .history-close-btn:hover {
            color: var(--text-primary, #fff);
            background: rgba(255, 255, 255, 0.1);
          }
          .history-drawer-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.02);
            border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.06));
          }
          .history-count-badge {
            font-size: 0.8rem;
            color: var(--text-secondary, #94a3b8);
          }
          .btn-clear-history {
            background: rgba(239, 68, 68, 0.12);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #ef4444;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.78rem;
            cursor: pointer;
            font-weight: 600;
          }
          .btn-clear-history:hover {
            background: #ef4444;
            color: #fff;
          }
          .history-drawer-body {
            flex: 1;
            overflow-y: auto;
            padding: 14px 20px 24px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .history-item-card {
            background: var(--surface-card, rgba(255, 255, 255, 0.04));
            border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
            border-radius: 12px;
            padding: 14px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            transition: all 0.2s ease;
          }
          .history-item-card:hover {
            border-color: var(--accent-primary, #6366f1);
          }
          .history-item-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.78rem;
            color: var(--text-secondary, #94a3b8);
          }
          .history-item-topic {
            font-size: 0.95rem;
            font-weight: 700;
            color: var(--text-primary, #fff);
          }
          .history-item-meta {
            font-size: 0.8rem;
            color: var(--text-secondary, #cbd5e1);
          }
          .btn-restore-history-lesson {
            margin-top: 4px;
            align-self: flex-start;
            background: var(--accent-primary, #6366f1);
            color: #fff;
            border: none;
            padding: 6px 14px;
            border-radius: 8px;
            font-size: 0.82rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .btn-restore-history-lesson:hover {
            background: #4f46e5;
            transform: translateY(-1px);
          }
          .history-empty {
            text-align: center;
            padding: 40px 20px;
            color: var(--text-secondary, #94a3b8);
            font-size: 0.9rem;
            line-height: 1.6;
          }

          /* Dict Audio Buttons */
          .dict-audio-container {
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px dashed rgba(255, 255, 255, 0.15);
          }
          .dict-audio-label {
            font-size: 0.78rem;
            font-weight: 600;
            color: var(--text-secondary, #94a3b8);
            margin-bottom: 6px;
          }
          .dict-audio-pills-row {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }
          .btn-dict-audio {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(99, 102, 241, 0.12);
            border: 1px solid rgba(99, 102, 241, 0.35);
            color: var(--text-primary, #e2e8f0);
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .btn-dict-audio:hover {
            background: rgba(99, 102, 241, 0.25);
            border-color: #6366f1;
            transform: translateY(-1px);
          }
          .btn-dict-audio .dict-ipa {
            color: #38bdf8;
            font-family: monospace;
            font-size: 0.75rem;
          }
          .btn-dict-audio .dict-official-tag {
            font-size: 0.7rem;
            color: #94a3b8;
          }
          .btn-dict-audio.playing-audio {
            background: rgba(16, 185, 129, 0.25);
            border-color: #10b981;
            color: #10b981;
          }
        `;
        document.head.appendChild(styleEl);
      }

      // 2. Ensure all 9 persona cards exist in #persona-selector-grid
      const personaGrid = document.getElementById('persona-selector-grid');
      if (personaGrid) {
        const additionalPersonas = [
          {
            id: 'socratic',
            icon: '🕵️',
            title: 'Сократівський детектив',
            desc: 'Веде через навідні запитання замість прямої відповіді',
            badge: 'Розслідування'
          },
          {
            id: 'examiner',
            icon: '🎓',
            title: 'Екзаменатор УЦОЯО / IELTS',
            desc: 'Офіційний тон, критерії оцінювання та таймінг',
            badge: 'Оцінка 200'
          },
          {
            id: 'gamemaster',
            icon: '🚀',
            title: 'Ігровий Гейм-майстер',
            desc: 'RPG-стиль: квести, XP, досягнення та боси',
            badge: 'RPG Квест'
          },
          {
            id: 'native',
            icon: '🗣️',
            title: 'Носій мови (Native)',
            desc: 'Діалог мовою оригіналу з поясненням українською',
            badge: 'Жива мова'
          }
        ];

        additionalPersonas.forEach(p => {
          if (!personaGrid.querySelector(`[data-persona="${p.id}"]`)) {
            const card = document.createElement('div');
            card.className = 'persona-card';
            card.dataset.persona = p.id;
            card.innerHTML = `
              <div class="persona-avatar-mini">${p.icon}</div>
              <div class="persona-info">
                <div class="persona-title">${p.title}</div>
                <div class="persona-desc">${p.desc}</div>
              </div>
              <span class="persona-badge">${p.badge}</span>
            `;
            personaGrid.appendChild(card);
          }
        });
      }

      // 3. Ensure Header Buttons in .tutor-header-controls
      const headerControls = document.querySelector('.tutor-header-controls');
      if (headerControls) {
        if (!document.getElementById('btn-toggle-roleplay')) {
          const btnRoleplay = document.createElement('button');
          btnRoleplay.type = 'button';
          btnRoleplay.className = 'control-pill-btn';
          btnRoleplay.id = 'btn-toggle-roleplay';
          btnRoleplay.title = 'Відкрити 8 інтерактивних рольових сценаріїв';
          btnRoleplay.innerHTML = '<span>🎭</span> <span>Сценарії</span>';
          headerControls.appendChild(btnRoleplay);
        }
        if (!document.getElementById('btn-lesson-history')) {
          const btnHistory = document.createElement('button');
          btnHistory.type = 'button';
          btnHistory.className = 'control-pill-btn';
          btnHistory.id = 'btn-lesson-history';
          btnHistory.title = 'Переглянути історію минулих уроків';
          btnHistory.innerHTML = '<span>📚</span> <span>Історія уроків</span>';
          headerControls.appendChild(btnHistory);
        }
      }

      // 4. Ensure Quick Action Chip for Roleplay in #tutor-chips-bar
      const chipsBar = document.getElementById('tutor-chips-bar');
      if (chipsBar && !chipsBar.querySelector('[data-action="roleplay_quick"]')) {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip-btn roleplay-chip';
        chip.dataset.action = 'roleplay_quick';
        chip.title = 'Відкрити рольові квести реального життя';
        chip.innerHTML = '<span>🎭</span> <span>Рольовий квест</span>';
        chipsBar.appendChild(chip);
      }

      // 5. Ensure #session-restored-banner inside #tutor-chat-viewport
      const chatViewport = document.getElementById('tutor-chat-viewport');
      if (chatViewport && !document.getElementById('session-restored-banner')) {
        const banner = document.createElement('div');
        banner.className = 'session-restored-banner';
        banner.id = 'session-restored-banner';
        banner.style.display = 'none';
        banner.innerHTML = `
          <div class="restored-banner-content">
            <span class="restored-banner-icon">💾</span>
            <span class="restored-banner-text">Відновлено ваш попередній урок з місця зупинки! Можете продовжувати діалог або натиснути "🔄 Новий урок" для очищення.</span>
          </div>
          <div class="restored-banner-actions">
            <button type="button" class="btn-restored-new-lesson" id="btn-restored-new-lesson">🔄 Новий урок</button>
            <button type="button" class="btn-close-restored" id="btn-close-restored-banner" title="Сховати повідомлення">✕</button>
          </div>
        `;
        chatViewport.insertBefore(banner, chatViewport.firstChild);
      }

      // 6. Ensure #active-scenario-banner inside #tutor-chat-viewport
      if (chatViewport && !document.getElementById('active-scenario-banner')) {
        const banner = document.createElement('div');
        banner.className = 'active-scenario-banner';
        banner.id = 'active-scenario-banner';
        banner.style.display = 'none';
        banner.innerHTML = `
          <div class="scenario-banner-header">
            <div class="scenario-banner-left">
              <span class="scenario-banner-badge">🎭 Активний сценарій</span>
              <span class="scenario-banner-title" id="scenario-banner-title">Кав'ярня в Лондоні</span>
            </div>
            <button type="button" class="btn-exit-scenario" id="btn-exit-scenario" title="Вийти з рольового сценарію">✕ Завершити сценарій</button>
          </div>
          <div class="scenario-banner-location" id="scenario-banner-location">
            <b>Місце:</b> ☕ Лондон, Сохо, затишна кав'ярня Artisan Roast
          </div>
          <div class="scenario-banner-plot" id="scenario-banner-plot">
            <b>Зав'язка:</b> Бариста запитує про ваше замовлення, десерт та пропонує спеціальну каву дня.
          </div>
          <div class="scenario-banner-missions">
            <div class="scenario-missions-header">
              <span>Квестові місії:</span>
              <span class="scenario-progress-count" id="scenario-progress-count">0/3</span>
            </div>
            <ul class="scenario-missions-list" id="scenario-missions-list"></ul>
          </div>
        `;
        const sessionBanner = document.getElementById('session-restored-banner');
        if (sessionBanner && sessionBanner.nextSibling) {
          chatViewport.insertBefore(banner, sessionBanner.nextSibling);
        } else {
          chatViewport.insertBefore(banner, chatViewport.firstChild);
        }
      }

      // 7. Ensure #roleplay-panel in workspace root
      const workspaceRoot = document.getElementById('tutor-workspace-root') || document.body;
      if (!document.getElementById('roleplay-panel')) {
        const drawer = document.createElement('div');
        drawer.className = 'roleplay-panel-drawer';
        drawer.id = 'roleplay-panel';
        drawer.innerHTML = `
          <div class="roleplay-panel-header">
            <div class="roleplay-panel-title">
              <span>🎭</span>
              <h3>Рольові сценарії реального життя</h3>
            </div>
            <button type="button" class="roleplay-close-btn" id="btn-close-roleplay" aria-label="Закрити панель сценаріїв">✕</button>
          </div>
          <p class="roleplay-panel-desc">Оберіть життєву ситуацію для імерсивного діалогу з Пандою. Тренуйте мову та знання у реальному контексті!</p>
          <div class="roleplay-grid" id="roleplay-grid"></div>
        `;
        workspaceRoot.appendChild(drawer);
      }

      // 8. Ensure #tutor-history-drawer in workspace root
      if (!document.getElementById('tutor-history-drawer')) {
        const drawer = document.createElement('div');
        drawer.className = 'tutor-history-drawer';
        drawer.id = 'tutor-history-drawer';
        drawer.innerHTML = `
          <div class="history-drawer-header">
            <div class="history-drawer-title">
              <span>📚</span>
              <h4>Історія уроків та конспекти</h4>
            </div>
            <button type="button" class="history-close-btn" id="btn-close-history-drawer" aria-label="Закрити історію">✕</button>
          </div>
          <div class="history-drawer-toolbar">
            <span class="history-count-badge" id="history-count-badge">Збережено: 0</span>
            <button type="button" class="btn-clear-history" id="btn-clear-all-history" title="Очистити всю збережену історію">🗑️ Очистити історію</button>
          </div>
          <div class="history-drawer-body" id="tutor-history-list"></div>
        `;
        workspaceRoot.appendChild(drawer);
      }
    }

    _cacheDom() {
      this.dom = {
        // Mode Tabs
        tabLanguages: document.getElementById('tab-mode-languages'),
        tabSchool: document.getElementById('tab-mode-school'),
        sectionLanguages: document.getElementById('section-languages-config'),
        sectionSchool: document.getElementById('section-school-config'),

        // Badges & Labels
        activeLangBadge: document.getElementById('active-lang-badge'),
        activeLevelBadge: document.getElementById('active-level-badge'),
        activeSubjectBadge: document.getElementById('active-subject-badge'),
        activeGoalBadge: document.getElementById('active-goal-badge'),
        languageLevelDesc: document.getElementById('language-level-desc'),
        schoolGoalDesc: document.getElementById('school-goal-desc'),

        // Persona Grid & Parental Lock
        personaGrid: document.getElementById('persona-selector-grid'),
        personaLockedBanner: document.getElementById('persona-locked-banner'),

        // Workspace Header
        tutorStatusTitle: document.getElementById('status-bar-title') || document.getElementById('tutor-status-title'),
        statusBarTitle: document.getElementById('status-bar-title') || document.getElementById('tutor-status-title'),
        statusSubjectText: document.getElementById('status-subject-text'),
        statusLevelText: document.getElementById('status-level-text'),
        statusPersonaText: document.getElementById('status-persona-text'),
        statusModeBadge: document.getElementById('status-mode-badge'),
        presenceDot: document.getElementById('tutor-presence-dot'),
        presenceText: document.getElementById('tutor-presence-text'),

        // Header Controls
        btnToggleVoice: document.getElementById('btn-toggle-voice'),
        btnVoiceFemale: document.getElementById('btn-voice-female'),
        btnVoiceMale: document.getElementById('btn-voice-male'),
        btnNewLesson: document.getElementById('btn-new-lesson'),
        btnToggleWhiteboard: document.getElementById('btn-toggle-whiteboard'),
        btnToggleRoleplay: document.getElementById('btn-toggle-roleplay'),
        btnLessonHistory: document.getElementById('btn-lesson-history'),

        // Viewport & Messages
        viewport: document.getElementById('tutor-chat-viewport'),
        welcomeScreen: document.getElementById('tutor-welcome-screen'),
        startLessonBtn: document.getElementById('start-lesson-btn'),
        messagesList: document.getElementById('tutor-messages-list'),

        // Session Restored Banner
        sessionRestoredBanner: document.getElementById('session-restored-banner'),
        btnCloseRestoredBanner: document.getElementById('btn-close-restored-banner'),
        btnRestoredNewLesson: document.getElementById('btn-restored-new-lesson'),

        // Active Scenario Banner
        activeScenarioBanner: document.getElementById('active-scenario-banner'),
        scenarioBannerTitle: document.getElementById('scenario-banner-title'),
        scenarioBannerLocation: document.getElementById('scenario-banner-location'),
        scenarioBannerPlot: document.getElementById('scenario-banner-plot'),
        scenarioProgressCount: document.getElementById('scenario-progress-count'),
        scenarioMissionsList: document.getElementById('scenario-missions-list'),
        btnExitScenario: document.getElementById('btn-exit-scenario'),

        // Roleplay Drawer
        roleplayPanel: document.getElementById('roleplay-panel'),
        btnCloseRoleplay: document.getElementById('btn-close-roleplay'),
        roleplayGrid: document.getElementById('roleplay-grid'),

        // History Drawer
        historyDrawer: document.getElementById('tutor-history-drawer'),
        btnCloseHistoryDrawer: document.getElementById('btn-close-history-drawer'),
        btnClearAllHistory: document.getElementById('btn-clear-all-history'),
        historyList: document.getElementById('tutor-history-list'),
        historyCountBadge: document.getElementById('history-count-badge'),

        // Quick Chips
        chipsBar: document.getElementById('tutor-chips-bar'),

        // Input Bar
        voiceInputBtn: document.getElementById('voice-input-btn'),
        userInput: document.getElementById('tutor-user-input'),
        sendMessageBtn: document.getElementById('send-message-btn'),

        // Whiteboard Drawer
        whiteboardDrawer: document.getElementById('tutor-whiteboard'),
        btnCloseWhiteboard: document.getElementById('btn-close-whiteboard'),
        whiteboardSubjectTitle: document.getElementById('whiteboard-subject-title'),
        whiteboardFormulasList: document.getElementById('whiteboard-formulas-list'),
        scratchpadText: document.getElementById('scratchpad-text'),
        btnClearScratchpad: document.getElementById('btn-clear-scratchpad'),
        btnCopyScratchpad: document.getElementById('btn-copy-scratchpad'),

        // Mobile Bar & Toggle
        mobileBar: document.getElementById('tutor-mobile-bar'),
        mobileSummarySubject: document.getElementById('mobile-summary-subject'),
        mobileSummaryPersona: document.getElementById('mobile-summary-persona'),
        mobileToggleBtn: document.getElementById('tutor-mobile-toggle-btn'),
        mobileToggleLabel: document.getElementById('mobile-toggle-label'),
        tutorSidebar: document.getElementById('tutor-sidebar'),
        btnCloseMobileSettings: document.getElementById('btn-close-mobile-settings'),
        btnMobileApplySettings: document.getElementById('btn-mobile-apply-settings')
      };
    }

    _loadInitialState() {
      if (!window.StrictStore) return;
      const st = window.StrictStore.get();
      const urlParams = new URLSearchParams(window.location.search);
      const hasUrlParams = urlParams.has('subject') || urlParams.has('topic') || urlParams.has('mode') || urlParams.has('review') || urlParams.has('reviewMistake') || urlParams.has('pendingMistakeReview');

      if (!hasUrlParams && (!st.tutor || !st.tutor.pendingMistakeReview)) {
        this.mode = 'languages';
        this.language = 'english';
        this.languageName = 'English';
        this.level = 'A1';
        this.persona = (st.parental && st.parental.strictLockPersona) ? 'strict' : 'friend';
        this.voiceEnabled = st.tutor ? st.tutor.voiceEnabled !== false : true;
        this.voiceGender = st.tutor ? st.tutor.voiceGender || 'female' : 'female';
      } else if (st.tutor) {
        this.mode = st.tutor.category === 'nmt' || st.tutor.category === 'school' ? 'school' : 'languages';
        this.level = st.tutor.level || 'A1';
        this.persona = st.tutor.persona || 'friend';
        this.voiceEnabled = st.tutor.voiceEnabled !== false;
        this.voiceGender = st.tutor.voiceGender || 'female';

        const langMap = {
          'English': 'english',
          'Deutsch': 'deutsch',
          'Español': 'espanol',
          '中文': 'chinese',
          'Українська': 'ukrainian'
        };
        if (st.tutor.language && langMap[st.tutor.language]) {
          this.language = langMap[st.tutor.language];
          this.languageName = st.tutor.language;
        }

        const subMap = {
          'Математика': 'math',
          'Українська мова': 'ukr-lang',
          'Історія України': 'history',
          'Англійська (НМТ)': 'eng-nmt',
          'Фізика': 'physics',
          'Біологія': 'biology'
        };
        if (st.tutor.nmtSubject && subMap[st.tutor.nmtSubject]) {
          this.subject = subMap[st.tutor.nmtSubject];
          this.subjectName = st.tutor.nmtSubject;
        }
      }

      // Parental Lock Enforcement
      if (st.parental && st.parental.strictLockPersona) {
        this.persona = 'strict';
      }
    }

    _initAvatar() {
      if (!window.PandaAvatar) return;
      window.PandaAvatar.render('#tutor-panda-avatar', {
        persona: this.persona,
        state: 'idle'
      });
    }

    _initSpeechRecognition() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
      if (!SpeechRecognition) {
        console.info('Web Speech API Recognition is not supported in this browser.');
        return;
      }

      try {
        this.speechRecognition = new SpeechRecognition();
        this.speechRecognition.continuous = false;
        this.speechRecognition.interimResults = false;

        this.speechRecognition.onstart = () => {
          this.isVoiceRecording = true;
          if (this.dom.voiceInputBtn) {
            this.dom.voiceInputBtn.classList.add('recording');
            this.dom.voiceInputBtn.textContent = '🔴';
          }
          if (this.dom.userInput) {
            this.dom.userInput.placeholder = 'Слухаю вас... Говоріть чітко...';
          }
          if (window.PandaAvatar) {
            window.PandaAvatar.setState('listening');
          }
        };

        this.speechRecognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          if (this.dom.userInput) {
            this.dom.userInput.value = transcript;
            this.dom.userInput.focus();
          }
          if (window.StrictComponents) {
            window.StrictComponents.toast(`Розпізнано: "${transcript}"`, 'info');
          }
        };

        this.speechRecognition.onerror = (event) => {
          console.warn('SpeechRecognition error:', event.error);
          this._stopVoiceRecording();
          if (window.StrictComponents) {
            window.StrictComponents.toast('Не вдалося розпізнати мову або мікрофон вимкнено.', 'warning');
          }
        };

        this.speechRecognition.onend = () => {
          this._stopVoiceRecording();
        };
      } catch (err) {
        console.warn('Failed to construct SpeechRecognition:', err);
      }
    }

    _stopVoiceRecording() {
      this.isVoiceRecording = false;
      if (this.dom.voiceInputBtn) {
        this.dom.voiceInputBtn.classList.remove('recording');
        this.dom.voiceInputBtn.textContent = '🎤';
      }
      if (this.dom.userInput) {
        this.dom.userInput.placeholder = 'Напишіть відповідь або натисніть швидку дію вище...';
      }
      if (window.PandaAvatar) {
        window.PandaAvatar.setState('idle');
      }
    }

    _bindEvents() {
      // 1. Mode Tabs
      if (this.dom.tabLanguages) {
        this.dom.tabLanguages.onclick = () => this.setMode('languages');
      }
      if (this.dom.tabSchool) {
        this.dom.tabSchool.onclick = () => this.setMode('school');
      }

      // 2. Language Pills
      const langPills = document.querySelectorAll('#language-pills-wrap .pill-btn');
      langPills.forEach(pill => {
        pill.onclick = () => {
          const langId = pill.dataset.lang;
          const langName = pill.dataset.langName;
          this.setLanguage(langId, langName);
        };
      });

      // 3. Language Level Circles
      const levelBtns = document.querySelectorAll('#language-levels-grid .circle-level-btn');
      levelBtns.forEach(btn => {
        btn.onclick = () => {
          const lvl = btn.dataset.level;
          this.setLevel(lvl);
        };
      });

      // 4. School Subject Pills
      const schoolPills = document.querySelectorAll('#school-pills-wrap .pill-btn');
      schoolPills.forEach(pill => {
        pill.onclick = () => {
          const subId = pill.dataset.subject;
          const subName = pill.dataset.subjectName;
          this.setSchoolSubject(subId, subName);
        };
      });

      // 5. School Goal Pills
      const goalPills = document.querySelectorAll('#school-goals-wrap .pill-btn');
      goalPills.forEach(pill => {
        pill.onclick = () => {
          const goalId = pill.dataset.goal;
          const goalName = pill.textContent.trim();
          this.setSchoolGoal(goalId, goalName);
        };
      });

      // 6. Persona Cards (all 9 personas)
      this._bindPersonaCardEvents();

      // 7. Header Controls
      if (this.dom.btnToggleVoice) {
        this.dom.btnToggleVoice.onclick = () => this.toggleVoice();
      }
      if (this.dom.btnVoiceFemale) {
        this.dom.btnVoiceFemale.onclick = () => this.setVoiceGender('female');
      }
      if (this.dom.btnVoiceMale) {
        this.dom.btnVoiceMale.onclick = () => this.setVoiceGender('male');
      }
      if (this.dom.btnNewLesson) {
        this.dom.btnNewLesson.onclick = () => this.restartLesson();
      }
      if (this.dom.btnToggleWhiteboard) {
        this.dom.btnToggleWhiteboard.onclick = () => this.toggleWhiteboard();
      }
      if (this.dom.btnCloseWhiteboard) {
        this.dom.btnCloseWhiteboard.onclick = () => this.toggleWhiteboard(false);
      }

      // 8. Roleplay Panel & Banner Controls
      if (this.dom.btnToggleRoleplay) {
        this.dom.btnToggleRoleplay.onclick = () => this.toggleRoleplayPanel();
      }
      if (this.dom.btnCloseRoleplay) {
        this.dom.btnCloseRoleplay.onclick = () => this.toggleRoleplayPanel(false);
      }
      if (this.dom.btnExitScenario) {
        this.dom.btnExitScenario.onclick = () => this.exitScenario();
      }

      // 9. History Drawer Controls
      if (this.dom.btnLessonHistory) {
        this.dom.btnLessonHistory.onclick = () => this.toggleHistoryDrawer();
      }
      if (this.dom.btnCloseHistoryDrawer) {
        this.dom.btnCloseHistoryDrawer.onclick = () => this.toggleHistoryDrawer(false);
      }
      if (this.dom.btnClearAllHistory) {
        this.dom.btnClearAllHistory.onclick = () => this.clearAllHistory();
      }

      // 10. Session Restored Banner Actions
      if (this.dom.btnCloseRestoredBanner) {
        this.dom.btnCloseRestoredBanner.onclick = () => {
          if (this.dom.sessionRestoredBanner) {
            this.dom.sessionRestoredBanner.style.display = 'none';
          }
        };
      }
      if (this.dom.btnRestoredNewLesson) {
        this.dom.btnRestoredNewLesson.onclick = () => this.restartLesson();
      }

      // 11. Start Lesson Button
      if (this.dom.startLessonBtn) {
        this.dom.startLessonBtn.onclick = () => this.startLesson();
      }

      // 12. Quick Action Chips
      if (this.dom.chipsBar) {
        this.dom.chipsBar.onclick = (e) => {
          const btn = e.target.closest('.chip-btn');
          if (!btn) return;
          if (!this.isLessonStarted) {
            this.startLesson({ skipGreetingStream: true });
          }
          const action = btn.dataset.action;
          if (action === 'roleplay_quick') {
            this.toggleRoleplayPanel(true);
          } else {
            this.handleQuickAction(action);
          }
        };
      }

      // 13. Voice Record Button
      if (this.dom.voiceInputBtn) {
        this.dom.voiceInputBtn.onclick = () => this.toggleVoiceRecording();
      }

      // 14. Send Message Button & Enter Key (without Shift)
      if (this.dom.sendMessageBtn) {
        this.dom.sendMessageBtn.onclick = () => this.handleSendMessage();
      }
      if (this.dom.userInput) {
        this.dom.userInput.onkeydown = (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendMessage();
          }
        };
      }

      // 15. Scratchpad Actions
      if (this.dom.btnClearScratchpad) {
        this.dom.btnClearScratchpad.onclick = () => {
          if (this.dom.scratchpadText) {
            this.dom.scratchpadText.value = '';
            if (window.StrictComponents) {
              window.StrictComponents.toast('Чернетку очищено', 'info');
            }
          }
        };
      }
      if (this.dom.btnCopyScratchpad) {
        this.dom.btnCopyScratchpad.onclick = () => {
          if (this.dom.scratchpadText && this.dom.userInput) {
            const text = this.dom.scratchpadText.value.trim();
            if (text) {
              this.dom.userInput.value = text;
              this.dom.userInput.focus();
              this.toggleWhiteboard(false);
              if (window.StrictComponents) {
                window.StrictComponents.toast('Чернетку скопійовано в поле вводу', 'success');
              }
            }
          }
        };
      }

      // 16. Mobile Settings Bar & Accordion
      if (this.dom.mobileToggleBtn) {
        this.dom.mobileToggleBtn.onclick = () => this.toggleMobileSettings();
      }
      if (this.dom.btnCloseMobileSettings) {
        this.dom.btnCloseMobileSettings.onclick = () => this.toggleMobileSettings(false);
      }
      if (this.dom.btnMobileApplySettings) {
        this.dom.btnMobileApplySettings.onclick = () => {
          this.toggleMobileSettings(false);
          if (this.dom.userInput) {
            this.dom.userInput.focus();
          }
          if (window.StrictComponents) {
            window.StrictComponents.toast('Налаштування застосовано!', 'success');
          }
        };
      }

      // 17. i18n Locale Change Listener
      window.addEventListener('strictai:localechange', () => {
        this._handleLocaleChange();
      });
    }

    _bindPersonaCardEvents() {
      const personaCards = document.querySelectorAll('#persona-selector-grid .persona-card');
      personaCards.forEach(card => {
        card.onclick = () => {
          const personaId = card.dataset.persona;
          this.setPersona(personaId);
        };
      });
    }

    _subscribeStore() {
      if (!window.StrictStore) return;
      window.StrictStore.subscribe((state) => {
        // Enforce parental lock dynamically if changed
        if (state.parental && state.parental.strictLockPersona) {
          if (this.persona !== 'strict') {
            this.persona = 'strict';
            this._renderPersonas();
            this._renderStatusTitle();
            if (window.PandaAvatar) {
              window.PandaAvatar.setPersona('strict');
            }
          }
          if (this.dom.personaLockedBanner) {
            this.dom.personaLockedBanner.style.display = 'flex';
          }
        } else {
          if (this.dom.personaLockedBanner) {
            this.dom.personaLockedBanner.style.display = 'none';
          }
        }
      });
    }

    _checkPendingMistakes() {
      if (!window.StrictStore) return;
      const st = window.StrictStore.get();
      const mistake = st.tutor ? st.tutor.pendingMistakeReview : null;

      const urlParams = new URLSearchParams(window.location.search);
      const isReviewParam = urlParams.get('review') === '1' || urlParams.get('reviewMistake') || urlParams.get('pendingMistakeReview');

      if (mistake || isReviewParam) {
        const mistakeData = mistake || (st.nmt && st.nmt.mistakesQueue ? st.nmt.mistakesQueue[0] : null);
        if (mistakeData) {
          this.setMode('school');
          if (mistakeData.subject) {
            const subMap = {
              'Математика': 'math',
              'Українська мова': 'ukr-lang',
              'Історія України': 'history',
              'Англійська мова': 'eng-nmt',
              'Англійська (НМТ)': 'eng-nmt',
              'Фізика': 'physics',
              'Біологія': 'biology'
            };
            const subId = subMap[mistakeData.subject] || 'math';
            this.setSchoolSubject(subId, mistakeData.subject);
          }

          setTimeout(() => {
            this.startLessonWithMistakeReview(mistakeData);
          }, 350);
          return;
        }
      }

      const paramSubject = urlParams.get('subject');
      const paramTopic = urlParams.get('topic');
      const paramMode = urlParams.get('mode');

      if (paramSubject || paramTopic || paramMode === 'nmt' || paramMode === 'school') {
        this.setMode('school');

        if (paramSubject) {
          const subKey = paramSubject.trim().toLowerCase();
          const subLookup = {
            'math': { id: 'math', name: 'Математика' },
            'математика': { id: 'math', name: 'Математика' },
            'ukr-lang': { id: 'ukr-lang', name: 'Українська мова' },
            'українська мова': { id: 'ukr-lang', name: 'Українська мова' },
            'ukr': { id: 'ukr-lang', name: 'Українська мова' },
            'history': { id: 'history', name: 'Історія України' },
            'історія україни': { id: 'history', name: 'Історія України' },
            'eng-nmt': { id: 'eng-nmt', name: 'Англійська (НМТ)' },
            'англійська мова': { id: 'eng-nmt', name: 'Англійська (НМТ)' },
            'англійська (нмт)': { id: 'eng-nmt', name: 'Англійська (НМТ)' },
            'physics': { id: 'physics', name: 'Фізика' },
            'фізика': { id: 'physics', name: 'Фізика' },
            'biology': { id: 'biology', name: 'Біологія' },
            'біологія': { id: 'biology', name: 'Біологія' }
          };

          const matchedSub = subLookup[subKey] || { id: 'math', name: paramSubject };
          this.setSchoolSubject(matchedSub.id, matchedSub.name);
        }

        if (paramTopic) {
          setTimeout(() => {
            this.startLessonWithTopic(paramTopic);
          }, 350);
        }
      }
    }

    // =========================================================================
    // UI State Setters & Renderers (All 9 Personas)
    // =========================================================================

    setMode(mode) {
      this.mode = mode;
      if (window.StrictComponents) window.StrictComponents.playBeep('click');

      if (mode === 'languages') {
        if (this.dom.tabLanguages) {
          this.dom.tabLanguages.classList.add('active');
          this.dom.tabLanguages.setAttribute('aria-selected', 'true');
        }
        if (this.dom.tabSchool) {
          this.dom.tabSchool.classList.remove('active');
          this.dom.tabSchool.setAttribute('aria-selected', 'false');
        }
        if (this.dom.sectionLanguages) this.dom.sectionLanguages.style.display = 'flex';
        if (this.dom.sectionSchool) this.dom.sectionSchool.style.display = 'none';
        if (this.dom.statusModeBadge) this.dom.statusModeBadge.textContent = 'Мови';
      } else {
        if (this.dom.tabLanguages) {
          this.dom.tabLanguages.classList.remove('active');
          this.dom.tabLanguages.setAttribute('aria-selected', 'false');
        }
        if (this.dom.tabSchool) {
          this.dom.tabSchool.classList.add('active');
          this.dom.tabSchool.setAttribute('aria-selected', 'true');
        }
        if (this.dom.sectionLanguages) this.dom.sectionLanguages.style.display = 'none';
        if (this.dom.sectionSchool) this.dom.sectionSchool.style.display = 'flex';
        if (this.dom.statusModeBadge) this.dom.statusModeBadge.textContent = 'Предмети НМТ';
      }

      this._syncStoreCategory();
      this._renderStatusTitle();
      this._renderWhiteboardFormulas();
    }

    setLanguage(langId, langName) {
      this.language = langId;
      this.languageName = langName;
      if (window.StrictComponents) window.StrictComponents.playBeep('click');

      const pills = document.querySelectorAll('#language-pills-wrap .pill-btn');
      pills.forEach(p => p.classList.toggle('active', p.dataset.lang === langId));

      if (this.dom.activeLangBadge) {
        this.dom.activeLangBadge.textContent = langName;
      }

      this._syncStoreLanguage();
      this._renderStatusTitle();
      this._renderWhiteboardFormulas();
    }

    setLevel(level) {
      this.level = level;
      if (window.StrictComponents) window.StrictComponents.playBeep('click');

      const btns = document.querySelectorAll('#language-levels-grid .circle-level-btn');
      btns.forEach(b => b.classList.toggle('active', b.dataset.level === level));

      if (this.dom.activeLevelBadge) {
        this.dom.activeLevelBadge.textContent = level;
      }

      if (this.dom.languageLevelDesc && window.StrictTutorData) {
        const desc = window.StrictTutorData.levelDescriptions.languages[level] || '';
        this.dom.languageLevelDesc.innerHTML = `<b>Рівень ${level}:</b> ${desc}`;
      }

      this._syncStoreLevel();
      this._renderStatusTitle();
    }

    setSchoolSubject(subId, subName) {
      this.subject = subId;
      this.subjectName = subName;
      if (window.StrictComponents) window.StrictComponents.playBeep('click');

      const pills = document.querySelectorAll('#school-pills-wrap .pill-btn');
      pills.forEach(p => p.classList.toggle('active', p.dataset.subject === subId));

      if (this.dom.activeSubjectBadge) {
        this.dom.activeSubjectBadge.textContent = subName;
      }

      this._syncStoreSubject();
      this._renderStatusTitle();
      this._renderWhiteboardFormulas();
    }

    setSchoolGoal(goalId, goalName) {
      this.goal = goalId;
      this.goalName = goalName;
      if (window.StrictComponents) window.StrictComponents.playBeep('click');

      const pills = document.querySelectorAll('#school-goals-wrap .pill-btn');
      pills.forEach(p => p.classList.toggle('active', p.dataset.goal === goalId));

      if (this.dom.activeGoalBadge) {
        this.dom.activeGoalBadge.textContent = goalName;
      }

      if (this.dom.schoolGoalDesc && window.StrictTutorData) {
        const desc = window.StrictTutorData.levelDescriptions.school[goalId] || '';
        this.dom.schoolGoalDesc.innerHTML = `<b>${goalName}:</b> ${desc}`;
      }

      this._renderStatusTitle();
    }

    setPersona(personaId) {
      // Check if locked by Parental Control
      if (window.StrictStore) {
        const st = window.StrictStore.get();
        if (st.parental && st.parental.strictLockPersona && personaId !== 'strict') {
          if (window.StrictComponents) {
            window.StrictComponents.toast('🔒 Характер заблоковано батьківським контролем: Тільки Суворий викладач!', 'warning');
            window.StrictComponents.playBeep('alert');
          }
          return;
        }
      }

      this.persona = personaId;
      if (window.StrictComponents) window.StrictComponents.playBeep('click');

      this._renderPersonas();
      this._renderStatusTitle();

      if (window.PandaAvatar) {
        window.PandaAvatar.setPersona(personaId);
      }

      this._syncStorePersona();
      this._saveActiveSession();
    }

    _renderPersonas() {
      const cards = document.querySelectorAll('#persona-selector-grid .persona-card');
      const isLocked = window.StrictStore && window.StrictStore.get().parental && window.StrictStore.get().parental.strictLockPersona;

      cards.forEach(card => {
        const pId = card.dataset.persona;
        const isActive = pId === this.persona;
        card.classList.toggle('active', isActive);

        if (isLocked) {
          card.classList.toggle('locked-inactive', pId !== 'strict');
        } else {
          card.classList.remove('locked-inactive');
        }
      });
    }

    _getLocalizedTargetName(locale = null) {
      const loc = locale || (window.StrictStore ? window.StrictStore.get().locale : 'uk') || 'uk';

      const LANG_NAMES = {
        english: { uk: 'Англійська', en: 'English', pl: 'Angielski', de: 'Englisch' },
        deutsch: { uk: 'Німецька', en: 'German', pl: 'Niemiecki', de: 'Deutsch' },
        espanol: { uk: 'Іспанська', en: 'Spanish', pl: 'Hiszpański', de: 'Spanisch' },
        chinese: { uk: 'Китайська', en: 'Chinese', pl: 'Chiński', de: 'Chinesisch' },
        ukrainian: { uk: 'Українська', en: 'Ukrainian', pl: 'Ukraiński', de: 'Ukrainisch' }
      };

      const SUBJ_NAMES = {
        'math': { uk: 'Математика', en: 'Mathematics', pl: 'Matematyka', de: 'Mathematik' },
        'ukr-lang': { uk: 'Українська мова', en: 'Ukrainian Language', pl: 'Język ukraiński', de: 'Ukrainische Sprache' },
        'history': { uk: 'Історія України', en: 'History of Ukraine', pl: 'Historia Ukrainy', de: 'Geschichte der Ukraine' },
        'eng-nmt': { uk: 'Англійська (НМТ)', en: 'English (NMT)', pl: 'Angielski (NMT)', de: 'Englisch (NMT)' },
        'physics': { uk: 'Фізика', en: 'Physics', pl: 'Fizyka', de: 'Physik' },
        'biology': { uk: 'Біологія', en: 'Biology', pl: 'Biologia', de: 'Biologie' }
      };

      if (this.mode === 'languages') {
        const item = LANG_NAMES[this.language];
        return (item && item[loc]) || this.languageName;
      } else {
        const item = SUBJ_NAMES[this.subject];
        return (item && item[loc]) || this.subjectName;
      }
    }

    _getMobileButtonLabel(isOpen, locale = null) {
      const loc = locale || (window.StrictStore ? window.StrictStore.get().locale : 'uk') || 'uk';
      if (isOpen) {
        const toLesson = { uk: '💬 До уроку', en: '💬 To Lesson', pl: '💬 Do lekcji', de: '💬 Zum Unterricht' };
        return toLesson[loc] || toLesson.uk;
      } else {
        const settings = { uk: '⚙️ Налаштування', en: '⚙️ Settings', pl: '⚙️ Ustawienia', de: '⚙️ Einstellungen' };
        return settings[loc] || settings.uk;
      }
    }

    applyTranslations() {
      const loc = (window.StrictStore ? window.StrictStore.get().locale : 'uk') || 'uk';
      const isOpen = this.dom.tutorSidebar && this.dom.tutorSidebar.classList.contains('mobile-open');
      const btnText = this._getMobileButtonLabel(isOpen, loc);

      const drawerToggle = document.getElementById('tutor-mobile-drawer-toggle');
      if (drawerToggle) {
        drawerToggle.textContent = btnText;
      }
      if (this.dom.mobileToggleLabel) {
        this.dom.mobileToggleLabel.textContent = btnText.replace(/^[^\s]+\s/, '');
      }

      this._renderStatusTitle();
    }

    syncHeaderPills() {
      this._renderStatusTitle();
    }

    _renderStatusTitle() {
      const personaNames = {
        friend: 'Добрий друг',
        strict: 'Суворий викладач',
        joker: 'Жартівник',
        motivator: 'Мотиватор',
        calm: 'Спокійний ментор',
        socratic: 'Сократівський детектив',
        examiner: 'Екзаменатор УЦОЯО / IELTS',
        gamemaster: 'Ігровий Гейм-майстер',
        native: 'Носій мови (Native)'
      };

      let personaName = personaNames[this.persona] || 'Добрий друг';
      if (window.StrictI18n) {
        const pMeta = window.StrictI18n.getPersona(this.persona);
        if (pMeta && pMeta.name) {
          personaName = pMeta.name;
        }
      }

      const targetLocalizedName = this._getLocalizedTargetName();
      const tabLangLabel = window.StrictI18n ? window.StrictI18n.t('tutor.tabLanguages', 'Мови') : 'Мови';
      const tabSchoolLabel = window.StrictI18n ? window.StrictI18n.t('tutor.tabSchool', 'Предмети НМТ') : 'Предмети НМТ';

      if (this.mode === 'languages') {
        if (this.dom.statusSubjectText) this.dom.statusSubjectText.textContent = targetLocalizedName;
        if (this.dom.statusLevelText) this.dom.statusLevelText.textContent = this.level;
        if (this.dom.statusModeBadge) this.dom.statusModeBadge.textContent = tabLangLabel;
      } else {
        if (this.dom.statusSubjectText) this.dom.statusSubjectText.textContent = targetLocalizedName;
        if (this.dom.statusLevelText) this.dom.statusLevelText.textContent = this.goalName;
        if (this.dom.statusModeBadge) this.dom.statusModeBadge.textContent = tabSchoolLabel;
      }

      const headerSubjectNameEl = document.getElementById('header-subject-name');
      if (headerSubjectNameEl) headerSubjectNameEl.textContent = targetLocalizedName;

      if (this.dom.statusPersonaText) {
        this.dom.statusPersonaText.textContent = personaName;
      }

      this._updateMobileSummary(targetLocalizedName, personaName);
    }

    _updateMobileSummary(targetLocalizedName, personaName) {
      const summaryText = this.mode === 'languages'
        ? `🌍 ${targetLocalizedName} • ${this.level}`
        : `🎓 ${targetLocalizedName} • ${this.goalName}`;

      if (this.dom.mobileSummarySubject) {
        this.dom.mobileSummarySubject.textContent = summaryText;
      }
      const mobileBarSubj = document.getElementById('mobile-bar-subject');
      if (mobileBarSubj) {
        mobileBarSubj.textContent = summaryText;
      }

      if (this.dom.mobileSummaryPersona) {
        const icons = {
          friend: '🐼',
          strict: '🧐',
          joker: '😜',
          motivator: '🔥',
          calm: '🧘',
          socratic: '🕵️',
          examiner: '🎓',
          gamemaster: '🚀',
          native: '🗣️'
        };
        const icon = icons[this.persona] || '🐼';
        this.dom.mobileSummaryPersona.textContent = `${icon} ${personaName}`;
      }
    }

    _renderAllSettings() {
      this.setMode(this.mode);
      this.setLevel(this.level);
      this.setLanguage(this.language, this.languageName);
      this.setSchoolSubject(this.subject, this.subjectName);
      this.setSchoolGoal(this.goal, this.goalName);
      this._renderPersonas();
      this._renderStatusTitle();

      if (this.dom.btnToggleVoice) {
        this.dom.btnToggleVoice.classList.toggle('active', this.voiceEnabled);
      }
      if (this.dom.btnVoiceFemale) {
        this.dom.btnVoiceFemale.classList.toggle('active', this.voiceGender === 'female');
      }
      if (this.dom.btnVoiceMale) {
        this.dom.btnVoiceMale.classList.toggle('active', this.voiceGender === 'male');
      }
    }

    _renderWhiteboardFormulas() {
      if (!this.dom.whiteboardFormulasList || !window.StrictTutorData) return;

      const activeKey = this.mode === 'languages' ? this.language : this.subject;
      const content = window.StrictTutorData.getSubjectContent(activeKey);

      if (this.dom.whiteboardSubjectTitle) {
        const titleText = this.mode === 'languages' ? `Формули та шпаргалка: ${this.languageName}` : `Формули та шпаргалка: ${this.subjectName}`;
        this.dom.whiteboardSubjectTitle.textContent = titleText;
      }

      if (content && content.whiteboardFormulas && content.whiteboardFormulas.length > 0) {
        this.dom.whiteboardFormulasList.innerHTML = content.whiteboardFormulas.map(f => `
          <div class="formula-item"><code>${f}</code></div>
        `).join('');
      } else {
        this.dom.whiteboardFormulasList.innerHTML = `
          <div class="formula-item">Оберіть тему або вправу для відображення ключових правил.</div>
        `;
      }
    }

    toggleVoice() {
      this.voiceEnabled = !this.voiceEnabled;
      if (this.dom.btnToggleVoice) {
        this.dom.btnToggleVoice.classList.toggle('active', this.voiceEnabled);
      }
      if (window.StrictComponents) {
        window.StrictComponents.playBeep('click');
        window.StrictComponents.toast(
          `Автоозвучення відповідей: ${this.voiceEnabled ? 'УВІМКНЕНО 🔊' : 'ВИМКНЕНО 🔇'}`,
          this.voiceEnabled ? 'success' : 'info'
        );
      }
      if (!this.voiceEnabled) {
        if (window.PandaAvatar) window.PandaAvatar.stopSpeaking();
        if (window.StrictPolyglotTTS) window.StrictPolyglotTTS.stop();
      }
      this._syncStoreVoice();
    }

    setVoiceGender(gender) {
      this.voiceGender = gender;
      if (this.dom.btnVoiceFemale) {
        this.dom.btnVoiceFemale.classList.toggle('active', gender === 'female');
      }
      if (this.dom.btnVoiceMale) {
        this.dom.btnVoiceMale.classList.toggle('active', gender === 'male');
      }
      if (window.StrictPolyglotTTS) {
        window.StrictPolyglotTTS.setGender(gender);
      }
      if (window.StrictComponents) {
        window.StrictComponents.playBeep('click');
        window.StrictComponents.toast(`Голос синтезу: ${gender === 'female' ? 'Жіночий' : 'Чоловічий'}`, 'info');
      }
      this._syncStoreVoice();
    }

    toggleWhiteboard(forceOpen) {
      if (typeof forceOpen === 'boolean') {
        this.whiteboardOpen = forceOpen;
      } else {
        this.whiteboardOpen = !this.whiteboardOpen;
      }

      if (this.dom.whiteboardDrawer) {
        this.dom.whiteboardDrawer.classList.toggle('open', this.whiteboardOpen);
      }
      if (this.dom.btnToggleWhiteboard) {
        this.dom.btnToggleWhiteboard.classList.toggle('active', this.whiteboardOpen);
      }
      if (window.StrictComponents) {
        window.StrictComponents.playBeep('click');
      }
    }

    toggleMobileSettings(forceState = null) {
      if (!this.dom.tutorSidebar) return;
      const isOpen = forceState !== null ? forceState : !this.dom.tutorSidebar.classList.contains('mobile-open');
      this.dom.tutorSidebar.classList.toggle('mobile-open', isOpen);
      if (this.dom.mobileToggleBtn) {
        this.dom.mobileToggleBtn.setAttribute('aria-expanded', String(isOpen));
      }
      const btnFullText = this._getMobileButtonLabel(isOpen);
      if (this.dom.mobileToggleLabel) {
        this.dom.mobileToggleLabel.textContent = btnFullText.replace(/^[^\s]+\s/, '');
      }
      const drawerToggle = document.getElementById('tutor-mobile-drawer-toggle');
      if (drawerToggle) {
        drawerToggle.textContent = btnFullText;
      }
      const iconEl = this.dom.mobileToggleBtn ? this.dom.mobileToggleBtn.querySelector('.toggle-icon') : null;
      if (iconEl) {
        iconEl.textContent = isOpen ? '💬' : '⚙️';
      }
      if (isOpen) {
        if (this.dom.tutorSidebar && typeof this.dom.tutorSidebar.scrollIntoView === 'function') {
          this.dom.tutorSidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        const workspace = document.getElementById('tutor-workspace-root');
        if (workspace && typeof workspace.scrollIntoView === 'function') {
          workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      if (window.StrictComponents) window.StrictComponents.playBeep('click');
    }

    _handleLocaleChange() {
      if (window.StrictI18n && typeof window.StrictI18n.applyToDOM === 'function') {
        window.StrictI18n.applyToDOM();
      }
      this.applyTranslations();
      this._renderAllSettings();
      if (this.dom.presenceText) {
        this.dom.presenceText.textContent = window.StrictI18n ? window.StrictI18n.t('tutor.statusReady', 'Панда готова до уроку') : 'Панда готова до уроку';
      }
      if (this.dom.userInput && window.StrictI18n) {
        this.dom.userInput.placeholder = window.StrictI18n.t('tutor.inputPlaceholder', 'Напишіть відповідь або натисніть швидку дію вище...');
      }
    }

    toggleVoiceRecording() {
      if (!this.speechRecognition) {
        if (window.StrictComponents) {
          window.StrictComponents.toast('Голосовий ввід не підтримується цим браузером. Використовуйте текстове поле.', 'warning');
        }
        return;
      }

      if (this.isVoiceRecording) {
        this.speechRecognition.stop();
        this._stopVoiceRecording();
      } else {
        let langCode = 'uk-UA';
        if (this.mode === 'languages') {
          if (this.language === 'english') langCode = 'en-US';
          else if (this.language === 'deutsch') langCode = 'de-DE';
          else if (this.language === 'espanol') langCode = 'es-ES';
          else if (this.language === 'chinese') langCode = 'zh-CN';
          else if (this.language === 'ukrainian') langCode = 'uk-UA';
        } else if (this.subject === 'eng-nmt') {
          langCode = 'en-US';
        }

        this.speechRecognition.lang = langCode;
        try {
          this.speechRecognition.start();
        } catch (e) {
          console.warn('Speech recognition start failed:', e);
          this._stopVoiceRecording();
        }
      }
    }

    // =========================================================================
    // Lesson & Chat Flow (Typewriter Streaming + Enter Input)
    // =========================================================================

    startLesson({ skipGreetingStream = false } = {}) {
      this.isLessonStarted = true;
      this.toggleMobileSettings(false);
      if (window.StrictComponents) {
        window.StrictComponents.playBeep('click');
      }

      if (this.dom.welcomeScreen) {
        this.dom.welcomeScreen.style.display = 'none';
      }
      if (this.dom.messagesList) {
        this.dom.messagesList.style.display = 'flex';
        this.dom.messagesList.innerHTML = '';
      }

      // Hide session restored banner when starting fresh
      if (this.dom.sessionRestoredBanner) {
        this.dom.sessionRestoredBanner.style.display = 'none';
      }

      this.savedMessages = [];

      // Generate Persona Greeting (all 9 personas)
      const greetingText = this._generateInitialGreeting();
      if (skipGreetingStream === true) {
        this.appendMessage({
          sender: 'tutor',
          text: greetingText,
          type: 'text',
          skipStream: true
        });
      } else {
        this.appendMessage({
          sender: 'tutor',
          text: greetingText,
          type: 'text'
        });
      }

      if (this.dom.presenceText) {
        this.dom.presenceText.textContent = window.StrictI18n ? window.StrictI18n.t('tutor.presenceActive', 'Урок триває • Активна сесія') : 'Урок триває • Активна сесія';
      }
    }

    startLessonWithMistakeReview(mistakeData) {
      this.isLessonStarted = true;
      this._renderAllSettings();

      if (this.dom.welcomeScreen) {
        this.dom.welcomeScreen.style.display = 'none';
      }
      if (this.dom.messagesList) {
        this.dom.messagesList.style.display = 'flex';
        this.dom.messagesList.innerHTML = '';
      }

      this.savedMessages = [];

      if (window.StrictTutorData) {
        const reviewObj = window.StrictTutorData.generateMistakeReviewLesson(mistakeData, this.persona);
        this.appendMessage({
          sender: 'tutor',
          text: reviewObj.text,
          type: 'mistake_review',
          mistakeMeta: mistakeData
        });
      }

      if (window.StrictComponents) {
        window.StrictComponents.toast('Панда розпочала сократівський розбір вашої помилки з тесту!', 'info');
      }
    }

    startLessonWithTopic(topic) {
      this.isLessonStarted = true;
      this._renderAllSettings();

      if (this.dom.welcomeScreen) {
        this.dom.welcomeScreen.style.display = 'none';
      }
      if (this.dom.messagesList) {
        this.dom.messagesList.style.display = 'flex';
        this.dom.messagesList.innerHTML = '';
      }

      this.savedMessages = [];

      let openingText = '';
      const p = this.persona;
      const subName = this.subjectName;

      if (p === 'strict') {
        openingText = `Вітаю. До початку іспитів часу обмаль. Ми розпочинаємо інтенсивне опрацювання теми **«${topic}»** (${subName}). Ця тема є обов’язковою у програмі НМТ і часто містить підступні пастки УЦОЯО. Прошу максимальної зосередженості: вимкніть сторонні вкладки. Розпочнемо з перевірки базових правил чи з практичної тестової задачі?`;
      } else if (p === 'joker') {
        openingText = `Халоу! 🐼 Твій персональний репетитор-панда на зв’язку! Сьогодні ми розносимо тему **«${topic}»** (${subName}) так, щоб екзаменатори плакали від розчулення! Нудьги не буде, гарантую. Натискай «Дай вправу» або напиши своє запитання, і погнали!`;
      } else if (p === 'motivator') {
        openingText = `Привіт, майбутній володар 200 балів! 🔥 Тема **«${topic}»** (${subName}) — це саме те, що принесе тобі вирішальні бали до бюджету в університеті твоєї мрії! Ти здатен розібратися з цим на відмінно. Покажи свій максимум! З чого стартуємо?`;
      } else if (p === 'calm') {
        openingText = `Вітаю. Зроби спокійний вдих. 🧘 Ми прийшли сюди, щоб спокійно й усвідомлено опанувати тему **«${topic}»** (${subName}). Будь-яке складне завдання підкоряється послідовній логіці. З чого тобі комфортніше почати: з теоретичного правила чи практичного прикладу?`;
      } else if (p === 'socratic') {
        openingText = `Вітаю, досліднику! 🕵️ Розпочинаємо детективний аналіз теми **«${topic}»** (${subName}). Замість готових відповідей ми розбиратимемо її через навідні запитання та виявлення прихованих закономірностей. Що тобі вже відомо про це правило?`;
      } else if (p === 'examiner') {
        openingText = `Добрий день. Розпочинаємо офіційну академічну сесію з теми **«${topic}»** (${subName}). 🎓 Цей модуль має критичну вагу в тестах УЦОЯО. Будьте готові до суворого оцінювання термінології та регламенту. Бажаєте почати з бліц-питання чи тесту?`;
      } else if (p === 'gamemaster') {
        openingText = `Вітаю у підземеллі знань, Гравцю! 🚀 Розблоковано нову локацію квесту: **«${topic}»** (${subName})! Попереду XP за кожну переможену задачу та битва з босом теми. Твоя перша дія?`;
      } else if (p === 'native') {
        openingText = `Hello and welcome! 🗣️ Today we're diving straight into **«${topic}»** (${subName}). I will guide you with native phrasings, real-world examples, and natural explanations in Ukrainian. Ready to explore?`;
      } else {
        // friend
        openingText = `Привіт, друже! 🐼 Радий, що ти тут! Бачу, що з Карти знань ти обрав тему **«${topic}»** (${subName}). Це надзвичайно важлива тема! Не хвилюйся, ми розберемо її разом без жодного стресу. Що саме викликає найбільше запитань: розібрати ключове правило чи спробувати вправу?`;
      }

      this.appendMessage({
        sender: 'tutor',
        text: openingText,
        type: 'text'
      });

      if (this.dom.presenceText) {
        this.dom.presenceText.textContent = `Урок триває • Тема: ${topic}`;
      }

      if (window.StrictComponents) {
        window.StrictComponents.toast(`Панда готова до уроку з теми: ${topic}!`, 'info');
      }
    }

    restartLesson(skipConfirm = false) {
      if (window.StrictComponents) {
        window.StrictComponents.playBeep('click');
      }

      // Archive current session if it has messages
      if (this.savedMessages && this.savedMessages.length > 0) {
        if (!skipConfirm && !confirm('Бажаєте завершити поточний урок, зберегти його в історію та розпочати новий?')) {
          return;
        }
        this._archiveCurrentLesson();
      }

      // Clear active session storage & state
      localStorage.removeItem('strictai_active_tutor_session');
      this.savedMessages = [];
      this.messageCount = 0;

      // Reset scenario banner & state
      this.activeScenario = null;
      if (this.dom.activeScenarioBanner) {
        this.dom.activeScenarioBanner.style.display = 'none';
      }

      // Hide restored banner
      if (this.dom.sessionRestoredBanner) {
        this.dom.sessionRestoredBanner.style.display = 'none';
      }

      // Clear messages list
      if (this.dom.messagesList) {
        this.dom.messagesList.innerHTML = '';
      }

      this.startLesson();

      if (window.StrictComponents) {
        window.StrictComponents.toast('Розпочато новий урок! Попередній збережено в історію.', 'info');
      }
    }

    _generateInitialGreeting() {
      const p = this.persona;
      const targetName = this.mode === 'languages' ? this.languageName : this.subjectName;
      const levelOrGoal = this.mode === 'languages' ? `рівень ${this.level}` : this.goalName;

      if (window.StrictI18n && window.StrictI18n.currentLocale !== 'uk') {
        const pMeta = window.StrictI18n.getPersona(p);
        if (pMeta && pMeta.greeting) {
          return `${pMeta.greeting}\n\n**${targetName}** (${levelOrGoal})`;
        }
      }

      if (p === 'strict') {
        return `Вітаю. До початку іспитів часу обмаль. Ми працюємо над дисципліною **«${targetName}»** (${levelOrGoal}). Прошу повної зосередженості: вимкніть сторонні вкладки, формулюйте думки чітко. З якої теми розпочнемо: правило чи практична вправа?`;
      } else if (p === 'joker') {
        return `Халоу! 🐼 Твій персональний репетитор-панда на зв’язку! Сьогодні ми прокачуємо **«${targetName}»** (${levelOrGoal}). Обіцяю: нудьги не буде, інакше мій запас бамбука конфіскують на користь голодних студентів. Натискай «Дай вправу» або напиши своє запитання!`;
      } else if (p === 'motivator') {
        return `Привіт, майбутній володар 200 балів! 🔥 Сьогодні ми робимо потужний ривок у дисципліні **«${targetName}»** (${levelOrGoal})! Кожен розібраний приклад — це твій крок на бюджет в університет мрії. Покажи свій максимум! З чого стартуємо?`;
      } else if (p === 'calm') {
        return `Вітаю. Зроби глибокий і спокійний вдих. 🧘 Сьогодні ми вивчаємо **«${targetName}»** (${levelOrGoal}). Немає потреби поспішати: складні речі стають простими, коли ми розбираємо їх усвідомлено й крок за кроком. З якої теми почнемо?`;
      } else if (p === 'socratic') {
        return `Вітаю, шукачу знань! 🕵️ Я твій Сократівський детектив. Готових відповідей ти від мене не почуєш — ми шукатимемо істину разом через навідні запитання та факти. Дисципліна: **«${targetName}»** (${levelOrGoal}). Яке питання або задачу беремо під розслідування першою?`;
      } else if (p === 'examiner') {
        return `Добрий день. Розпочинаємо офіційну академічну сесію з дисципліни **«${targetName}»** (${levelOrGoal}). 🎓 Оцінювання здійснюється за стандартами УЦОЯО / IELTS: точність формулювань, час та дотримання критеріїв. Напишіть тему або натисніть «Дай вправу».`;
      } else if (p === 'gamemaster') {
        return `Вітаю у гільдії знань, Гравцю! 🚀 Твій персональний Гейм-майстер на зв’язку. Прокачуємо скіли в **«${targetName}»** (${levelOrGoal})! За кожну відповідь нараховуються XP, а попереду — квести та боси тем. Готовий розпочати перший рейд?`;
      } else if (p === 'native') {
        return `Hello and welcome! 🗣️ Як твій репетитор-носій мови (Native Speaker), я спілкуватимуся з тобою живою, автентичною мовою навчання з корисними коментарями та поясненнями українською. Дисципліна: **«${targetName}»** (${levelOrGoal}). What would you like to explore or practice today? Let's begin!`;
      } else {
        // friend (default)
        return `Привіт, сонечко! 🐼 Радий бачити тебе на уроці! Сьогодні розбираємо **«${targetName}»** (${levelOrGoal}). Не бійся запитувати чи помилятися — ми вчимося разом у дружній атмосфері. Натисни будь-яку дію зверху або напиши мені!`;
      }
    }

    handleSendMessage() {
      if (!this.dom.userInput) return;
      const text = this.dom.userInput.value.trim();
      if (!text) return;

      if (!this.isLessonStarted) {
        this.startLesson({ skipGreetingStream: true });
      }

      // Append student message immediately
      this.appendMessage({
        sender: 'user',
        text: text,
        type: 'text'
      });

      this.dom.userInput.value = '';

      // Check scenario mission progress with student message
      if (this.activeScenario) {
        this._checkScenarioProgress(text);
      }

      // Trigger AI Panda response
      this._generatePandaResponse(text);
    }

    async _generatePandaResponse(userText) {
      if (this.dom.presenceText) {
        this.dom.presenceText.textContent = 'Панда міркує...';
      }
      if (window.PandaAvatar) {
        window.PandaAvatar.setState('thinking');
      }

      const activeKey = this.mode === 'languages' ? this.language : this.subject;
      const storeState = window.StrictStore ? window.StrictStore.get() : null;
      const apiKey = storeState && storeState.tutor ? storeState.tutor.apiKey : '';
      const apiProvider = storeState && storeState.tutor ? storeState.tutor.apiProvider : 'gemini';

      // 1. Try Live LLM if API Key is configured
      if (apiKey && apiKey.length > 5) {
        try {
          const liveAnswer = await this._callRealLlm(apiKey, apiProvider, userText);
          if (liveAnswer) {
            this._finishPandaReply(liveAnswer);
            return;
          }
        } catch (err) {
          console.warn('Real LLM call failed, falling back to autonomous engine:', err);
        }
      }

      // 2. Autonomous pedagogical fallback engine
      setTimeout(() => {
        const fallbackAnswer = this._synthesizeAutonomousResponse(userText, activeKey);
        this._finishPandaReply(fallbackAnswer);
      }, 550);
    }

    _finishPandaReply(replyText) {
      if (this.dom.presenceText) {
        this.dom.presenceText.textContent = 'Панда готова до уроку';
      }
      if (window.PandaAvatar) {
        window.PandaAvatar.setState('idle');
      }

      // Stream message with typewriter effect
      this.appendMessage({
        sender: 'tutor',
        text: replyText,
        type: 'text'
      });
    }

    _synthesizeAutonomousResponse(userText, activeKey) {
      const lower = userText.toLowerCase();
      const content = window.StrictTutorData ? window.StrictTutorData.getSubjectContent(activeKey) : null;
      const tone = (window.StrictTutorData && window.StrictTutorData.personaTones) ? window.StrictTutorData.personaTones[this.persona] : null;

      // Check for Socratic Hint request
      if (lower.includes('підказ') || lower.includes('сократ') || lower.includes('як почати')) {
        const hints = content && content.socraticPrompts ? content.socraticPrompts : [
          'Яке ключове правило чи обмеження тут діє?',
          'Спробуй розкласти завдання на два простих підкроки.'
        ];
        const randomHint = hints[Math.floor(Math.random() * hints.length)];
        const prefix = tone ? tone.socraticPrefix : 'Давай поміркуємо разом:';
        return `${prefix}\n\n💡 **Підказка:** ${randomHint}`;
      }

      // Check for Rule Explanation request
      if (lower.includes('правил') || lower.includes('поясни') || lower.includes('теорі')) {
        if (content && content.rules && content.rules.length > 0) {
          const rule = content.rules[0];
          return `### 📖 ${rule.title}\n\n` +
                 `${rule.summary}\n\n` +
                 `**Формула:** \`${rule.formula}\`\n\n` +
                 `💡 *Мнемоніка від Панди:* ${rule.mnemonic}`;
        }
      }

      // Check for Solution check
      if (lower.includes('перевір') || lower.includes('відповід') || lower.includes('правильно')) {
        const praise = tone && tone.praise ? tone.praise[0] : 'Добра спроба!';
        return `${praise}\n\nТвоя думка рухається у правильному напрямку. Пам’ятай завжди перевіряти область допустимих значень та узгодження часів! Чи хочеш закріпити це на практичній тестовій вправі?`;
      }

      // Roleplay scenario specific natural responses
      if (this.activeScenario) {
        const sc = this.activeScenario;
        if (sc.id === 'cafe') {
          return `Excellent choice! ☕ A warm cup of coffee with creamy oat milk is coming right up. Would you like to pair that with our freshly baked gluten-free almond brownie? It’s completely gluten-free!`;
        } else if (sc.id === 'airport') {
          return `Thank you for the clarification. ✈️ Your booking and passport look in order. Do you have anything to declare to customs, such as restricted items or goods exceeding allowances?`;
        } else if (sc.id === 'interview') {
          return `That's an impressive background! 💼 Could you walk me through a specific challenging architectural bottleneck you tackled recently? What was the situation, action, and final measurable outcome?`;
        } else if (sc.id === 'hotel') {
          return `I completely understand your frustration regarding the overbooking. 🏨 Since you have a confirmed voucher, we would love to offer you a complimentary upgrade to our Executive Suite with free breakfast included! Here is your written confirmation voucher.`;
        } else if (sc.id === 'doctor') {
          return `I see. Based on your symptoms, we should monitor this closely. 🏥 Are you currently taking any regular medications or do you have any drug allergies? Here is a gentle prescription for the next 5 days.`;
        } else if (sc.id === 'gadget') {
          return `I clearly see the screen flickering issue. 💻 Since you purchased it only two days ago and brought your original receipt, we are happy to process an immediate brand new replacement! Let's sign the return voucher.`;
        } else if (sc.id === 'history_debate') {
          return `Вагомий аргумент! 🏛️ Проголошення IV Універсалу в січні 1918 року стало історичною необхідністю для укладення Берестейського миру та юридичного захисту кордонів УНР. Який висновок ми зафіксуємо для тестів НМТ?`;
        } else if (sc.id === 'lab') {
          return `Чудові дані! 🔬 Розрахунок похибки показує відхилення менше 3%, що ідеально узгоджується із законом збереження імпульсу з урахуванням опору повітря. Оформлюємо фінальний графік до захисту!`;
        }
      }

      // Natural responses for all 9 personas
      if (this.persona === 'strict') {
        return `Ваше формулювання прийнято. У контексті дисципліни **«${this.mode === 'languages' ? this.languageName : this.subjectName}»** важливо пам’ятати: будь-яке твердження має спиратися на правило або теорему. Пропоную виконати перевірочну вправу для контролю засвоєння.`;
      } else if (this.persona === 'joker') {
        return `О, ловлю твою думку на льоту! 🚀 Якби ця тема була піцою, ти щойно відкусив найсмачніший шматочок з сирним бортиком! Натискай кнопку «Дай вправу», щоб закріпити цей тріумф!`;
      } else if (this.persona === 'motivator') {
        return `Відмінний хід думок! 🔥 Ти бачиш суть завдання і не боїшся заглиблюватися в деталі. Саме так куються 200 балів на НМТ! Продовжуємо штурм вершин — давай ще одну вправу!`;
      } else if (this.persona === 'calm') {
        return `Дуже ясна та виважена репліка. 🧘 Коли розум спокійний, інформація вкладається у довготривалу пам’ять значно надійніше. Зробимо ще один крок уперед?`;
      } else if (this.persona === 'socratic') {
        return `Цікавий хід думок! 🕵️ Але давай копнемо глибше: яке саме базове правило чи факт змушує нас робити такий висновок? Спробуй поставити собі зустрічне запитання: що зміниться, якщо одна з умов буде змінена на протилежну?`;
      } else if (this.persona === 'examiner') {
        return `Відповідь прийнято до екзаменаційного протоколу. 🎓 За критеріями оцінювання УЦОЯО твердження є змістовним, проте зверніть увагу на лаконічність і точність термінології. Рекомендую виконати тренувальну вправу з таймером.`;
      } else if (this.persona === 'gamemaster') {
        return `Влучний удар, Гравцю! 🚀 Твоя репліка зарахована: +25 XP у скарбничку досвіду! Монстр невігластва хитається. Готовий активувати супер-навичку та виконати бойову квестову вправу?`;
      } else if (this.persona === 'native') {
        return `That's a very natural and solid response! 🗣️ In everyday native speech, you could also hear: *"Spot on, that makes total sense!"*. Зверни увагу на інтонацію та ритміку речення. How would you explain this in your own words?`;
      } else {
        // friend
        return `Дякую за відповідь, друже! 🐼 Мені дуже подобається, як ти розмірковуєш. Давай спробуємо розібрати ще одну цікаву задачу або правило, щоб знання були міцними!`;
      }
    }

    async _callRealLlm(apiKey, provider, prompt) {
      const personaInstructions = {
        friend: 'Ти турботливий, теплий друг Червона Панда, навчаєш українською мовою, хвалиш та підтримуєш.',
        strict: 'Ти вимогливий, суворий викладач Червона Панда, вимагаєш залізної дисципліни та точності до НМТ.',
        joker: 'Ти дотепний, веселий жартівник Червона Панда, пояснюєш з добрим гумором та мемами.',
        motivator: 'Ти драйвовий тренер-мотиватор Червона Панда, заряджаєш на 200 балів та бюджет.',
        calm: 'Ти спокійний дзен-ментор Червона Панда, навчаєш повільно, без поспіху й тривоги.',
        socratic: 'Ти Сократівський детектив Червона Панда: ніколи не даєш готової прямої відповіді, ведеш учня через навідні сократівські запитання, загадки та логічний аналіз.',
        examiner: 'Ти суворий екзаменатор УЦОЯО / IELTS Червона Панда: академічний тон, посилання на критерії оцінювання, аналіз таймінгу та штрафи за неточності.',
        gamemaster: 'Ти ігровий Гейм-майстер RPG Червона Панда: перетворюєш навчання на RPG квест, нараховуєш віртуальні XP, оголошуєш квести, босів тем і ачівки.',
        native: 'Ти носій мови (Native Speaker) Червона Панда: ведеш діалог автентичною цільовою мовою з ідіомами, сленгом та живою вимовою, даючи корисні коментарі та пояснення українською.'
      };

      const systemPrompt = `Ти — ${personaInstructions[this.persona] || personaInstructions.friend}. Предмет: ${this.mode === 'languages' ? this.languageName : this.subjectName}. Рівень/Клас: ${this.mode === 'languages' ? this.level : this.goalName}. Якщо режим мовний, давай коментарі українською, а приклади та репліки — мовою навчання. Відповідай виключно природною літературною мовою.`;

      if (provider === 'gemini') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${systemPrompt}\n\nКористувач каже: "${prompt}"` }] }
            ]
          })
        });
        const data = await resp.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          return data.candidates[0].content.parts[0].text;
        }
      } else if (provider === 'openai') {
        const url = 'https://api.openai.com/v1/chat/completions';
        const resp = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt }
            ]
          })
        });
        const data = await resp.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
          return data.choices[0].message.content;
        }
      }
      return null;
    }

    // =========================================================================
    // Quick Actions
    // =========================================================================

    handleQuickAction(action) {
      if (!this.isLessonStarted) {
        this.startLesson({ skipGreetingStream: true });
      }

      const activeKey = this.mode === 'languages' ? this.language : this.subject;
      const content = window.StrictTutorData ? window.StrictTutorData.getSubjectContent(activeKey) : null;
      if (!content) return;

      if (action === 'exercise') {
        const quizzes = content.quizzes || [];
        if (quizzes.length > 0) {
          const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
          this.appendQuizMessage(quiz);
        } else {
          this.appendMessage({
            sender: 'tutor',
            text: 'Наразі формується нова вправа. Спробуйте дію «Поясни правило» або напишіть своє запитання!',
            type: 'text'
          });
        }
      } else if (action === 'explain_rule') {
        const rules = content.rules || [];
        if (rules.length > 0) {
          const rule = rules[Math.floor(Math.random() * rules.length)];
          const ruleHtml = `
            <div class="rule-card">
              <div class="rule-card-title">📖 ${rule.title}</div>
              <p>${rule.summary}</p>
              <p><b>Формула / Структура:</b> <code>${rule.formula}</code></p>
              <p>💡 <i>Мнемоніка від Панди:</i> ${rule.mnemonic}</p>
            </div>
          `;
          this.appendMessage({
            sender: 'tutor',
            text: `Ось ключове правило з теми **«${rule.title}»**:`,
            htmlExtra: ruleHtml,
            type: 'rule'
          });
        }
      } else if (action === 'conversation') {
        const prompts = content.conversationPrompts || [];
        const promptText = prompts.length > 0 ? prompts[Math.floor(Math.random() * prompts.length)] : 'Розкажи про свої навчальні плани на цей тиждень!';
        this.appendMessage({
          sender: 'tutor',
          text: `💬 **Поговорімо:**\n\n${promptText}`,
          type: 'text'
        });
      } else if (action === 'check_text') {
        this.appendMessage({
          sender: 'tutor',
          text: '🔍 **Перевірка тексту та розв’язків:**\n\nБудь ласка, вставте нижче ваше речення, твір чи чернетковий хід думок. Я уважно знайду граматичні, пунктуаційні або логічні помилки та покажу, як їх виправити!',
          type: 'text'
        });
      } else if (action === 'blitz') {
        const blitzList = content.blitzQuestions || [];
        if (blitzList.length > 0) {
          const item = blitzList[Math.floor(Math.random() * blitzList.length)];
          this.appendMessage({
            sender: 'tutor',
            text: `⚡ **Бліц до НМТ (Швидка реакція):**\n\n${item.q}\n\n*(Напишіть свою відповідь у чат, щоб перевірити себе!)*`,
            type: 'blitz'
          });
        }
      } else if (action === 'socratic_hint') {
        const hints = content.socraticPrompts || [
          'Яке ключове правило чи обмеження тут діє?',
          'Спробуй розкласти завдання на два простих підкроки.'
        ];
        const hint = hints[Math.floor(Math.random() * hints.length)];
        this.appendMessage({
          sender: 'tutor',
          text: `💡 **Підказка за методом Сократа:**\n\n${hint}`,
          type: 'text'
        });
      }
    }

    // =========================================================================
    // Message Rendering, Typewriter Streaming & Dict Audio Buttons
    // =========================================================================

    appendMessage({ sender, text, htmlExtra = '', type = 'text', mistakeMeta = null, skipStream = false }) {
      if (!this.dom.messagesList) return;

      if (sender === 'user' || skipStream) {
        // Direct non-streaming render
        this._renderMessageToDom({ sender, text, htmlExtra, type, mistakeMeta });
        if (sender === 'user') {
          this.savedMessages.push({ sender, text, htmlExtra, type, mistakeMeta, timestamp: Date.now() });
          this._saveActiveSession();
        }
      } else {
        // Typewriter streaming for Tutor replies
        this._streamPandaReply(text, { htmlExtra, type, mistakeMeta });
      }
    }

    _renderMessageToDom({ sender, text, htmlExtra = '', type = 'text', mistakeMeta = null }) {
      if (!this.dom.messagesList) return;

      const row = document.createElement('div');
      row.className = `chat-message-row ${sender}`;

      const avatarIcon = sender === 'tutor' ? '🐼' : '👤';
      const senderName = sender === 'tutor' ? 'Панда-репетитор' : 'Ти (Студент)';
      const timeStr = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

      let formattedText = this._formatMarkdown(text);

      let mistakeCardHtml = '';
      if (type === 'mistake_review' && mistakeMeta) {
        mistakeCardHtml = `
          <div class="mistake-card">
            <div class="mistake-card-title">⚠️ Порівняння варіантів відповіді:</div>
            <div class="mistake-compare-grid">
              <div class="mistake-box-user">
                <b>Твоя попередня відповідь:</b><br>${mistakeMeta.userAns || 'Не вказано'}
              </div>
              <div class="mistake-box-correct">
                <b>Правильна відповідь:</b><br>${mistakeMeta.correctAns || 'Не вказано'}
              </div>
            </div>
          </div>
        `;
      }

      // Official dictionary audio buttons for language mode
      let dictAudioHtml = '';
      if (sender === 'tutor' && this.mode === 'languages') {
        dictAudioHtml = this._generateDictAudioButtonsHtml(text);
      }

      const speakBtnHtml = sender === 'tutor' ? `
        <button class="btn-speak-msg" title="Озвучити або зупинити мовлення цієї репліки">
          <span>🔊</span>
          <span>Озвучити</span>
        </button>
      ` : '';

      row.innerHTML = `
        <div class="message-avatar">${avatarIcon}</div>
        <div class="message-bubble-wrap">
          <div class="message-meta-header">
            <span class="message-sender-name">${senderName}</span>
            <span>${timeStr}</span>
          </div>
          <div class="message-bubble">
            ${formattedText}
            ${mistakeCardHtml}
            ${htmlExtra}
            ${dictAudioHtml}
          </div>
          ${speakBtnHtml}
        </div>
      `;

      if (sender === 'tutor') {
        const speakBtn = row.querySelector('.btn-speak-msg');
        if (speakBtn) {
          this._bindSpeakButton(speakBtn, text);
        }
        this._bindDictAudioButtons(row);
      }

      this.dom.messagesList.appendChild(row);
      this._scrollToBottom();
    }

    async _streamPandaReply(replyText, { htmlExtra = '', type = 'text', mistakeMeta = null } = {}) {
      if (!this.dom.messagesList) return;
      this.isStreaming = true;

      const row = document.createElement('div');
      row.className = 'chat-message-row tutor';

      const avatarIcon = '🐼';
      const senderName = 'Панда-репетитор';
      const timeStr = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

      row.innerHTML = `
        <div class="message-avatar">${avatarIcon}</div>
        <div class="message-bubble-wrap">
          <div class="message-meta-header">
            <span class="message-sender-name">${senderName}</span>
            <span>${timeStr}</span>
          </div>
          <div class="message-bubble">
            <div class="stream-text-container">
              <span class="stream-content"></span><span class="typewriter-cursor">▋</span>
            </div>
          </div>
          <button class="btn-speak-msg" title="Озвучити або зупинити мовлення цієї репліки" style="display: none;">
            <span>🔊</span>
            <span>Озвучити</span>
          </button>
        </div>
      `;

      this.dom.messagesList.appendChild(row);
      this._scrollToBottom();

      if (window.PandaAvatar) {
        window.PandaAvatar.setState('talking');
      }

      const streamContentEl = row.querySelector('.stream-content');
      const cursorEl = row.querySelector('.typewriter-cursor');
      const bubbleEl = row.querySelector('.message-bubble');
      const speakBtn = row.querySelector('.btn-speak-msg');

      // Progressive typewriter streaming: chunks of 3 characters every 22ms
      const chunkSize = 3;
      let currentIndex = 0;

      while (currentIndex < replyText.length) {
        currentIndex = Math.min(currentIndex + chunkSize, replyText.length);
        if (streamContentEl) {
          streamContentEl.textContent = replyText.slice(0, currentIndex);
        }
        this._scrollToBottom();
        await new Promise(r => setTimeout(r, 22));
      }

      if (cursorEl) {
        cursorEl.remove();
      }

      // Render formatted markdown and accessories
      const formattedText = this._formatMarkdown(replyText);

      let mistakeCardHtml = '';
      if (type === 'mistake_review' && mistakeMeta) {
        mistakeCardHtml = `
          <div class="mistake-card">
            <div class="mistake-card-title">⚠️ Порівняння варіантів відповіді:</div>
            <div class="mistake-compare-grid">
              <div class="mistake-box-user">
                <b>Твоя попередня відповідь:</b><br>${mistakeMeta.userAns || 'Не вказано'}
              </div>
              <div class="mistake-box-correct">
                <b>Правильна відповідь:</b><br>${mistakeMeta.correctAns || 'Не вказано'}
              </div>
            </div>
          </div>
        `;
      }

      let dictAudioHtml = '';
      if (this.mode === 'languages') {
        dictAudioHtml = this._generateDictAudioButtonsHtml(replyText);
      }

      if (bubbleEl) {
        bubbleEl.innerHTML = `
          ${formattedText}
          ${mistakeCardHtml}
          ${htmlExtra}
          ${dictAudioHtml}
        `;
        this._bindDictAudioButtons(bubbleEl);
      }

      if (speakBtn) {
        speakBtn.style.display = 'inline-flex';
        this._bindSpeakButton(speakBtn, replyText);
      }

      if (window.PandaAvatar) {
        window.PandaAvatar.setState('idle');
      }

      this.isStreaming = false;
      this._scrollToBottom();

      // Trigger automatic TTS if enabled
      this._triggerTTS(replyText);

      // Save to active message history & persist
      const savedItem = {
        sender: 'tutor',
        text: replyText,
        htmlExtra,
        type,
        mistakeMeta,
        timestamp: Date.now()
      };
      this.savedMessages.push(savedItem);
      this._saveActiveSession();

      // Engagement tracking
      this.messageCount++;
      if (this.messageCount % 3 === 0 && window.StrictStore) {
        const subName = this.mode === 'languages' ? this.languageName : this.subjectName;
        window.StrictStore.addFocusMinutes(3, subName);
      }
    }

    _bindSpeakButton(speakBtn, text) {
      speakBtn.onclick = () => {
        const cleanText = text.replace(/<[^>]*>/g, '').replace(/[*#`_]/g, '');

        if (window.StrictPolyglotTTS && window.StrictPolyglotTTS.currentAudio) {
          window.StrictPolyglotTTS.cancel();
          speakBtn.innerHTML = '<span>🔊</span> <span>Озвучити</span>';
          return;
        }

        if (window.PandaAvatar && window.PandaAvatar.isSpeaking) {
          window.PandaAvatar.stopSpeaking();
          speakBtn.innerHTML = '<span>🔊</span> <span>Озвучити</span>';
          return;
        }

        speakBtn.innerHTML = '<span>⏹</span> <span>Зупинити</span>';

        if (this.mode === 'languages' && window.StrictPolyglotTTS && typeof window.StrictPolyglotTTS.speakBilingual === 'function') {
          const bilingual = this._extractBilingualParts(text);
          if (bilingual && bilingual.target) {
            window.StrictPolyglotTTS.speakBilingual(
              bilingual.uk || 'Послухайте приклад:',
              bilingual.target,
              this.language,
              () => { if (window.PandaAvatar) window.PandaAvatar.setState('talking'); },
              () => {
                speakBtn.innerHTML = '<span>🔊</span> <span>Озвучити</span>';
                if (window.PandaAvatar) window.PandaAvatar.setState('idle');
              }
            );
            return;
          }
        }

        let speechLang = 'uk-UA';
        if (this.mode === 'languages') {
          if (this.language === 'english') speechLang = 'en-US';
          else if (this.language === 'deutsch') speechLang = 'de-DE';
          else if (this.language === 'espanol') speechLang = 'es-ES';
          else if (this.language === 'chinese') speechLang = 'zh-CN';
        }

        if (window.PandaAvatar) {
          window.PandaAvatar.speak(cleanText, {
            persona: this.persona,
            gender: this.voiceGender,
            lang: speechLang,
            onEnd: () => {
              speakBtn.innerHTML = '<span>🔊</span> <span>Озвучити</span>';
            }
          });
        }
      };
    }

    _triggerTTS(replyText) {
      if (!this.voiceEnabled) return;
      const cleanText = replyText.replace(/<[^>]*>/g, '').replace(/[*#`_]/g, '');

      if (this.mode === 'languages' && window.StrictPolyglotTTS && typeof window.StrictPolyglotTTS.speakBilingual === 'function') {
        const bilingual = this._extractBilingualParts(replyText);
        if (bilingual && bilingual.target) {
          window.StrictPolyglotTTS.speakBilingual(
            bilingual.uk || 'Послухайте приклад:',
            bilingual.target,
            this.language,
            () => { if (window.PandaAvatar) window.PandaAvatar.setState('talking'); },
            () => { if (window.PandaAvatar) window.PandaAvatar.setState('idle'); }
          );
          return;
        }
      }

      let speechLang = 'uk-UA';
      if (this.mode === 'languages') {
        if (this.language === 'english') speechLang = 'en-US';
        else if (this.language === 'deutsch') speechLang = 'de-DE';
        else if (this.language === 'espanol') speechLang = 'es-ES';
        else if (this.language === 'chinese') speechLang = 'zh-CN';
      }

      if (window.PandaAvatar) {
        window.PandaAvatar.speak(cleanText, {
          persona: this.persona,
          gender: this.voiceGender,
          lang: speechLang
        });
      }
    }

    _extractBilingualParts(text) {
      if (this.mode !== 'languages') return null;
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      const ukLines = [];
      const targetLines = [];

      for (const line of lines) {
        const cyrCount = (line.match(/[\u0400-\u04FF]/g) || []).length;
        const latCount = (line.match(/[a-zA-Zäöüßáéíóúñ]/g) || []).length;
        if (latCount > cyrCount && latCount >= 4) {
          targetLines.push(line.replace(/[*#`_]/g, '').trim());
        } else {
          ukLines.push(line.replace(/[*#`_]/g, '').trim());
        }
      }

      if (targetLines.length > 0) {
        return {
          uk: ukLines.join('. ').replace(/<[^>]*>/g, '').trim(),
          target: targetLines.join('. ').replace(/<[^>]*>/g, '').trim()
        };
      }
      return null;
    }

    _getTargetLangCode() {
      const map = {
        'english': 'en',
        'deutsch': 'de',
        'espanol': 'es',
        'chinese': 'zh',
        'ukrainian': 'uk'
      };
      return map[this.language] || 'en';
    }

    _generateDictAudioButtonsHtml(text) {
      const targetLang = this._getTargetLangCode();
      if (!window.StrictDictData) return '';
      const dictData = window.StrictDictData.getData(targetLang);
      if (!dictData) return '';

      const cleanWords = text.toLowerCase().match(/[\p{L}\p{N}'-]+/gu) || [];
      const foundWords = new Set();

      if (cleanWords.length > 0) {
        for (const w of cleanWords) {
          if (dictData[w]) {
            foundWords.add(w);
          }
        }
      }

      let wordsList = Array.from(foundWords);
      if (wordsList.length === 0) {
        wordsList = Object.keys(dictData).slice(0, 3);
      } else {
        wordsList = wordsList.slice(0, 4);
      }

      if (wordsList.length === 0) return '';

      const buttonsHtml = wordsList.map(word => {
        const entry = dictData[word] || window.StrictDictData.lookup(targetLang, word);
        const ipa = (entry && entry.ipa) ? entry.ipa.replace(/[\[\/\]]/g, '') : word;
        return `
          <button type="button" class="btn-dict-audio" data-word="${word}" data-lang="${targetLang}" title="Прослухати офіційну вимову слова «${word}»">
            <span>🔊</span>
            <b>${word}</b>
            <span class="dict-ipa">[${ipa}]</span>
            <span class="dict-official-tag">• Оф. аудіо</span>
          </button>
        `;
      }).join('');

      return `
        <div class="dict-audio-container">
          <div class="dict-audio-label">🎧 Офіційна вимова слів:</div>
          <div class="dict-audio-pills-row">
            ${buttonsHtml}
          </div>
        </div>
      `;
    }

    _bindDictAudioButtons(container) {
      const dictBtns = container.querySelectorAll('.btn-dict-audio');
      dictBtns.forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const word = btn.dataset.word;
          const lang = btn.dataset.lang;
          if (window.StrictPolyglotTTS && typeof window.StrictPolyglotTTS.playOfficialWordAudio === 'function') {
            window.StrictPolyglotTTS.playOfficialWordAudio(word, lang, btn);
          } else if (window.StrictComponents) {
            window.StrictComponents.toast(`Вимова: ${word}`, 'info');
          }
        };
      });
    }

    appendQuizMessage(quizObj) {
      if (!this.dom.messagesList) return;

      const letters = ['А', 'Б', 'В', 'Г'];
      const optionsHtml = quizObj.options.map((opt, idx) => `
        <button class="quiz-option-btn" data-correct="${opt.isCorrect}">
          <span class="quiz-opt-letter">${letters[idx] || (idx + 1)}</span>
          <span class="quiz-opt-text">${opt.text}</span>
        </button>
      `).join('');

      const quizCardHtml = `
        <div class="quiz-card" id="quiz-${quizObj.id || Date.now()}">
          <div class="quiz-card-header">
            <span class="quiz-tag">Тестове завдання НМТ</span>
            <span class="quiz-reward-badge">🎋 +10 бамбук-коїнів</span>
          </div>
          <div class="quiz-question">${quizObj.question}</div>
          <div class="quiz-options-list">
            ${optionsHtml}
          </div>
          <div class="quiz-feedback-box" style="display: none;"></div>
        </div>
      `;

      this.appendMessage({
        sender: 'tutor',
        text: 'Ось інтерактивна вправа для перевірки! Оберіть один правильний варіант:',
        htmlExtra: quizCardHtml,
        type: 'quiz'
      });

      setTimeout(() => {
        const cardEl = this.dom.messagesList.querySelector(`#quiz-${quizObj.id || Date.now()}`) ||
                       this.dom.messagesList.querySelector('.quiz-card:last-child');
        if (!cardEl) return;

        const optionBtns = cardEl.querySelectorAll('.quiz-option-btn');
        const feedbackBox = cardEl.querySelector('.quiz-feedback-box');

        optionBtns.forEach(btn => {
          btn.onclick = () => {
            optionBtns.forEach(b => b.disabled = true);

            const isCorrect = btn.dataset.correct === 'true';
            btn.classList.add(isCorrect ? 'correct' : 'wrong');

            optionBtns.forEach(b => {
              if (b.dataset.correct === 'true') {
                b.classList.add('correct');
              }
            });

            if (feedbackBox) {
              feedbackBox.style.display = 'flex';
              feedbackBox.className = `quiz-feedback-box ${isCorrect ? 'correct' : 'wrong'}`;

              const tone = window.StrictTutorData ? window.StrictTutorData.personaTones[this.persona] : null;
              const praiseText = isCorrect
                ? (tone && tone.praise ? tone.praise[Math.floor(Math.random() * tone.praise.length)] : 'Правильно! +10 бамбук-коїнів!')
                : (tone && tone.mistakeSupport ? tone.mistakeSupport[Math.floor(Math.random() * tone.mistakeSupport.length)] : 'Не зовсім так, ось пояснення:');

              feedbackBox.innerHTML = `
                <div><b>${isCorrect ? '✅ ' : '❌ '}${praiseText}</b></div>
                <div>${quizObj.explanation || ''}</div>
              `;
            }

            if (isCorrect) {
              if (window.StrictComponents) {
                window.StrictComponents.playBeep('success');
                window.StrictComponents.toast('Чудово! +10 🎋 Бамбук-коїнів нараховано!', 'success');
              }
              if (window.StrictStore) {
                window.StrictStore.addCoins(10, 'Правильна відповідь на вправу у чаті');
              }
              if (window.PandaAvatar) {
                window.PandaAvatar.setState('celebrate');
                setTimeout(() => window.PandaAvatar.setState('idle'), 2500);
              }
            } else {
              if (window.StrictComponents) {
                window.StrictComponents.playBeep('alert');
              }
              if (window.PandaAvatar) {
                window.PandaAvatar.setState('strict-warning');
                setTimeout(() => window.PandaAvatar.setState('idle'), 3000);
              }
            }

            this._scrollToBottom();
          };
        });
      }, 50);
    }

    _formatMarkdown(text) {
      if (!text) return '';
      let out = text;
      out = out.replace(/^### (.*$)/gim, '<h4>$1</h4>');
      out = out.replace(/^## (.*$)/gim, '<h4>$1</h4>');
      out = out.replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>');
      out = out.replace(/\*(.*?)\*/gim, '<i>$1</i>');
      out = out.replace(/^> (.*$)/gim, '<blockquote style="border-left: 3px solid var(--accent-primary); padding-left: 10px; margin: 8px 0; color: var(--text-secondary);">$1</blockquote>');
      out = out.replace(/`(.*?)`/gim, '<code>$1</code>');
      out = out.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
      return out;
    }

    _scrollToBottom() {
      if (this.dom.viewport) {
        this.dom.viewport.scrollTop = this.dom.viewport.scrollHeight;
      }
    }

    // =========================================================================
    // 8 Roleplay Scenarios Management
    // =========================================================================

    toggleRoleplayPanel(forceState = null) {
      this.roleplayOpen = forceState !== null ? forceState : !this.roleplayOpen;
      if (this.dom.roleplayPanel) {
        this.dom.roleplayPanel.classList.toggle('open', this.roleplayOpen);
      }
      if (this.dom.btnToggleRoleplay) {
        this.dom.btnToggleRoleplay.classList.toggle('active', this.roleplayOpen);
      }
      if (this.roleplayOpen) {
        this._renderRoleplayGrid();
      }
      if (window.StrictComponents) window.StrictComponents.playBeep('click');
    }

    _renderRoleplayGrid() {
      if (!this.dom.roleplayGrid) return;
      this.dom.roleplayGrid.innerHTML = this.scenarios.map(sc => `
        <div class="roleplay-card" data-scenario-id="${sc.id}">
          <div class="roleplay-card-header">
            <span class="roleplay-card-title">${sc.icon} ${sc.title}</span>
            <span class="roleplay-card-location">${sc.location.split(',')[0]}</span>
          </div>
          <div class="roleplay-card-plot">${sc.plot}</div>
          <div class="roleplay-card-missions-preview">
            🎯 Місії (${sc.missions.length}): ${sc.missions.join(' • ')}
          </div>
        </div>
      `).join('');

      const cards = this.dom.roleplayGrid.querySelectorAll('.roleplay-card');
      cards.forEach(card => {
        card.onclick = () => {
          const scId = card.dataset.scenarioId;
          this.startScenario(scId);
        };
      });
    }

    startScenario(scenarioId) {
      const scenario = this.scenarios.find(s => s.id === scenarioId);
      if (!scenario) return;

      this.activeScenario = {
        ...scenario,
        completedMissions: []
      };

      this.toggleRoleplayPanel(false);

      if (!this.isLessonStarted) {
        this.startLesson({ skipGreetingStream: true });
      }

      this._renderActiveScenarioBanner();

      this.appendMessage({
        sender: 'tutor',
        text: `${scenario.greeting}\n\n*(${scenario.location})*`,
        type: 'text'
      });

      if (window.StrictComponents) {
        window.StrictComponents.toast(`Сценарій «${scenario.title}» активовано! Виконуйте місії в чаті.`, 'success');
      }

      this._saveActiveSession();
    }

    _renderActiveScenarioBanner() {
      if (!this.dom.activeScenarioBanner) return;

      if (!this.activeScenario) {
        this.dom.activeScenarioBanner.style.display = 'none';
        return;
      }

      const sc = this.activeScenario;
      this.dom.activeScenarioBanner.style.display = 'flex';

      if (this.dom.scenarioBannerTitle) {
        this.dom.scenarioBannerTitle.textContent = `${sc.icon} ${sc.title}`;
      }
      if (this.dom.scenarioBannerLocation) {
        this.dom.scenarioBannerLocation.innerHTML = `<b>Місце:</b> ${sc.location}`;
      }
      if (this.dom.scenarioBannerPlot) {
        this.dom.scenarioBannerPlot.innerHTML = `<b>Зав'язка:</b> ${sc.plot}`;
      }

      const completedCount = sc.completedMissions ? sc.completedMissions.length : 0;
      if (this.dom.scenarioProgressCount) {
        this.dom.scenarioProgressCount.textContent = `${completedCount}/${sc.missions.length}`;
      }

      if (this.dom.scenarioMissionsList) {
        this.dom.scenarioMissionsList.innerHTML = sc.missions.map((m, idx) => {
          const isDone = sc.completedMissions && sc.completedMissions.includes(idx);
          return `
            <li class="scenario-mission-item ${isDone ? 'completed' : ''}">
              <span>${isDone ? '✅' : '⭕'}</span>
              <span>${m}</span>
            </li>
          `;
        }).join('');
      }
    }

    _checkScenarioProgress(userText) {
      if (!this.activeScenario) return;
      const sc = this.activeScenario;
      const lower = userText.toLowerCase();

      sc.missions.forEach((m, idx) => {
        if (!sc.completedMissions.includes(idx)) {
          const kwList = sc.keywords && sc.keywords[idx] ? sc.keywords[idx] : [];
          const matched = kwList.some(k => lower.includes(k));
          if (matched) {
            sc.completedMissions.push(idx);
            if (window.StrictComponents) {
              window.StrictComponents.toast(`🎯 Місію виконано: "${m}"!`, 'success');
              window.StrictComponents.playBeep('success');
            }
          }
        }
      });

      this._renderActiveScenarioBanner();

      if (sc.completedMissions.length === sc.missions.length && !sc.allRewarded) {
        sc.allRewarded = true;
        if (window.StrictStore) {
          window.StrictStore.addCoins(30, `Успішне завершення сценарію «${sc.title}»`);
        }
        if (window.StrictComponents) {
          window.StrictComponents.toast(`🎉 Вітаємо! Всі місії сценарію виконано! +30 бамбук-коїнів! 🎋`, 'success');
        }
        if (window.PandaAvatar) {
          window.PandaAvatar.setState('celebrate');
          setTimeout(() => window.PandaAvatar.setState('idle'), 3000);
        }
      }

      this._saveActiveSession();
    }

    exitScenario() {
      if (!this.activeScenario) return;
      this.activeScenario = null;
      if (this.dom.activeScenarioBanner) {
        this.dom.activeScenarioBanner.style.display = 'none';
      }
      if (window.StrictComponents) {
        window.StrictComponents.toast('Рольовий сценарій завершено. Ви можете продовжити звичайний урок.', 'info');
      }
      this._saveActiveSession();
    }

    // =========================================================================
    // Lesson History Drawer & Session Archiving
    // =========================================================================

    toggleHistoryDrawer(forceState = null) {
      this.historyDrawerOpen = forceState !== null ? forceState : !this.historyDrawerOpen;
      if (this.dom.historyDrawer) {
        this.dom.historyDrawer.classList.toggle('open', this.historyDrawerOpen);
      }
      if (this.dom.btnLessonHistory) {
        this.dom.btnLessonHistory.classList.toggle('active', this.historyDrawerOpen);
      }
      if (this.historyDrawerOpen) {
        this._renderLessonHistory();
      }
      if (window.StrictComponents) window.StrictComponents.playBeep('click');
    }

    _getLessonHistory() {
      try {
        const raw = localStorage.getItem('strictai_lesson_history');
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.warn('Failed to parse lesson history:', e);
        return [];
      }
    }

    _archiveCurrentLesson() {
      if (!this.savedMessages || this.savedMessages.length === 0) return;
      try {
        const history = this._getLessonHistory();
        const lessonRecord = {
          id: 'lesson_' + Date.now(),
          timestamp: Date.now(),
          dateStr: new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
          mode: this.mode,
          subjectOrLang: this.mode === 'languages' ? this.languageName : this.subjectName,
          levelOrGoal: this.mode === 'languages' ? this.level : this.goalName,
          persona: this.persona,
          activeScenario: this.activeScenario ? this.activeScenario.title : null,
          messageCount: this.savedMessages.length,
          messages: [...this.savedMessages]
        };

        history.unshift(lessonRecord);
        if (history.length > 35) history.pop(); // keep top 35 lessons

        localStorage.setItem('strictai_lesson_history', JSON.stringify(history));
      } catch (e) {
        console.warn('Failed to archive lesson:', e);
      }
    }

    _renderLessonHistory() {
      if (!this.dom.historyList) return;
      const history = this._getLessonHistory();

      if (this.dom.historyCountBadge) {
        this.dom.historyCountBadge.textContent = `Збережено: ${history.length}`;
      }

      if (history.length === 0) {
        this.dom.historyList.innerHTML = `
          <div class="history-empty">
            <p>📚 Поки що немає збережених уроків.</p>
            <p>Завершіть урок або натисніть «🔄 Новий урок», щоб автоматично архівувати бесіду сюди!</p>
          </div>
        `;
        return;
      }

      const personaNames = {
        friend: 'Добрий друг',
        strict: 'Суворий викладач',
        joker: 'Жартівник',
        motivator: 'Мотиватор',
        calm: 'Спокійний ментор',
        socratic: 'Сократівський детектив',
        examiner: 'Екзаменатор УЦОЯО / IELTS',
        gamemaster: 'Ігровий Гейм-майстер',
        native: 'Носій мови (Native)'
      };

      this.dom.historyList.innerHTML = history.map(item => `
        <div class="history-item-card" data-lesson-id="${item.id}">
          <div class="history-item-top">
            <span>📅 ${item.dateStr}</span>
            <span>💬 ${item.messageCount} пов.</span>
          </div>
          <div class="history-item-topic">
            ${item.mode === 'languages' ? '🌍' : '🎓'} ${item.subjectOrLang} (${item.levelOrGoal})
          </div>
          <div class="history-item-meta">
            Характер: ${personaNames[item.persona] || item.persona}
            ${item.activeScenario ? ` • 🎭 ${item.activeScenario}` : ''}
          </div>
          <button type="button" class="btn-restore-history-lesson" data-lesson-id="${item.id}">
            📂 Відкрити цей урок у чаті
          </button>
        </div>
      `).join('');

      const restoreBtns = this.dom.historyList.querySelectorAll('.btn-restore-history-lesson');
      restoreBtns.forEach(btn => {
        btn.onclick = () => {
          const lId = btn.dataset.lessonId;
          this.restoreLessonFromHistory(lId);
        };
      });
    }

    restoreLessonFromHistory(lessonId) {
      const history = this._getLessonHistory();
      const target = history.find(h => h.id === lessonId);
      if (!target || !target.messages) return;

      // Archive current ongoing lesson before replacing
      if (this.savedMessages && this.savedMessages.length > 0) {
        this._archiveCurrentLesson();
      }

      this.mode = target.mode || 'languages';
      this.persona = target.persona || 'friend';
      this._renderAllSettings();

      this.isLessonStarted = true;
      this.savedMessages = [...target.messages];

      if (this.dom.welcomeScreen) {
        this.dom.welcomeScreen.style.display = 'none';
      }
      if (this.dom.messagesList) {
        this.dom.messagesList.style.display = 'flex';
        this.dom.messagesList.innerHTML = '';
        target.messages.forEach(msg => {
          this._renderMessageToDom({ ...msg, skipStream: true });
        });
        this._scrollToBottom();
      }

      this.toggleHistoryDrawer(false);
      this._saveActiveSession();

      if (window.StrictComponents) {
        window.StrictComponents.toast(`Урок від ${target.dateStr} успішно відновлено в чаті!`, 'success');
      }
    }

    clearAllHistory() {
      if (confirm('Ви впевнені, що бажаєте безповоротно видалити всю історію уроків?')) {
        localStorage.removeItem('strictai_lesson_history');
        this._renderLessonHistory();
        if (window.StrictComponents) {
          window.StrictComponents.toast('Історію уроків очищено.', 'info');
        }
      }
    }

    // =========================================================================
    // Active Session Auto-save & Restoration
    // =========================================================================

    _saveActiveSession() {
      try {
        const payload = {
          messages: this.savedMessages,
          mode: this.mode,
          language: this.language,
          languageName: this.languageName,
          level: this.level,
          subject: this.subject,
          subjectName: this.subjectName,
          goal: this.goal,
          goalName: this.goalName,
          persona: this.persona,
          activeScenario: this.activeScenario,
          updatedAt: Date.now()
        };
        localStorage.setItem('strictai_active_tutor_session', JSON.stringify(payload));
      } catch (e) {
        console.warn('Failed to save active session:', e);
      }
    }

    _restoreActiveSessionIfPresent() {
      try {
        const raw = localStorage.getItem('strictai_active_tutor_session');
        if (!raw) return;
        const data = JSON.parse(raw);

        if (data && data.messages && data.messages.length > 0) {
          if (data.mode) this.mode = data.mode;
          if (data.language) this.language = data.language;
          if (data.languageName) this.languageName = data.languageName;
          if (data.level) this.level = data.level;
          if (data.subject) this.subject = data.subject;
          if (data.subjectName) this.subjectName = data.subjectName;
          if (data.goal) this.goal = data.goal;
          if (data.goalName) this.goalName = data.goalName;
          if (data.persona) this.persona = data.persona;
          if (data.activeScenario) this.activeScenario = data.activeScenario;

          this._renderAllSettings();

          this.isLessonStarted = true;
          this.savedMessages = [...data.messages];

          if (this.dom.welcomeScreen) {
            this.dom.welcomeScreen.style.display = 'none';
          }
          if (this.dom.messagesList) {
            this.dom.messagesList.style.display = 'flex';
            this.dom.messagesList.innerHTML = '';
            data.messages.forEach(msg => {
              this._renderMessageToDom({ ...msg, skipStream: true });
            });
            this._scrollToBottom();
          }

          if (this.activeScenario) {
            this._renderActiveScenarioBanner();
          }

          if (this.dom.sessionRestoredBanner) {
            this.dom.sessionRestoredBanner.style.display = 'flex';
          }

          if (this.dom.presenceText) {
            this.dom.presenceText.textContent = 'Відновлено активну сесію уроку';
          }
        }
      } catch (e) {
        console.warn('Failed to restore active session:', e);
      }
    }

    // =========================================================================
    // Store Sync Helpers
    // =========================================================================

    _syncStoreCategory() {
      if (!window.StrictStore) return;
      window.StrictStore.update(st => ({
        ...st,
        tutor: {
          ...st.tutor,
          category: this.mode === 'school' ? 'nmt' : 'languages'
        }
      }));
    }

    _syncStoreLanguage() {
      if (!window.StrictStore) return;
      window.StrictStore.update(st => ({
        ...st,
        tutor: {
          ...st.tutor,
          language: this.languageName
        }
      }));
    }

    _syncStoreLevel() {
      if (!window.StrictStore) return;
      window.StrictStore.update(st => ({
        ...st,
        tutor: {
          ...st.tutor,
          level: this.level
        }
      }));
    }

    _syncStoreSubject() {
      if (!window.StrictStore) return;
      window.StrictStore.update(st => ({
        ...st,
        tutor: {
          ...st.tutor,
          nmtSubject: this.subjectName
        }
      }));
    }

    _syncStorePersona() {
      if (!window.StrictStore) return;
      window.StrictStore.update(st => ({
        ...st,
        tutor: {
          ...st.tutor,
          persona: this.persona
        }
      }));
    }

    _syncStoreVoice() {
      if (!window.StrictStore) return;
      window.StrictStore.update(st => ({
        ...st,
        tutor: {
          ...st.tutor,
          voiceEnabled: this.voiceEnabled,
          voiceGender: this.voiceGender
        }
      }));
    }
  }

  // Instantiate and mount on DOMContentLoaded or immediately if already loaded
  const bootTutor = () => {
    try {
      if (!window.StrictTutorController) {
        window.StrictTutorController = new StrictTutorController();
        window.StrictTutorController.init();
      }
    } catch(e) {
      console.error('[StrictTutorController] Initialization error:', e);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootTutor);
  } else {
    setTimeout(bootTutor, 0);
  }

})();
