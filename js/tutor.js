/**
 * StrictAI — Tutor Studio Controller ("Панда-репетитор")
 * Reactive chat workspace, Socratic methodology, Brilliant/LeetCode action pills,
 * strict grade & level filtering, and React component integration.
 */

(function () {
  'use strict';

  // =========================================================================
  // React Architecture Components (window.React / window.ReactDOM)
  // =========================================================================

  function StatusBarReact(props) {
    if (!window.React) return null;
    const e = window.React.createElement;

    return e('div', { className: 'tutor-status-title-react', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' } },
      e('span', { className: 'status-title-text' },
        e('span', { id: 'status-subject-text', style: { fontWeight: 700 } }, props.subjectText),
        ', ',
        e('span', { id: 'status-level-text' }, props.levelText),
        ', ',
        e('span', { id: 'status-persona-text', style: { color: 'var(--accent-primary, #6366f1)' } }, props.personaText)
      ),
      e('span', { className: 'tutor-status-badge', id: 'status-mode-badge' }, props.modeBadge)
    );
  }

  function QuizCardReact(props) {
    if (!window.React) return null;
    const e = window.React.createElement;
    const quiz = props.quiz;
    const [selectedIdx, setSelectedIdx] = window.React.useState(null);
    const [answered, setAnswered] = window.React.useState(false);

    const letters = ['А', 'Б', 'В', 'Г'];
    const gradeBadgeText = props.gradeBadgeText || 'Програма';

    const handleSelect = (idx, isCorrect) => {
      if (answered) return;
      setSelectedIdx(idx);
      setAnswered(true);
      if (props.onAnswer) props.onAnswer(isCorrect, quiz);
    };

    const optionElements = quiz.options.map((opt, idx) => {
      let btnClass = 'quiz-option-btn';
      if (answered) {
        if (opt.isCorrect) btnClass += ' correct';
        else if (selectedIdx === idx) btnClass += ' wrong';
      }
      return e('button', {
        key: idx,
        type: 'button',
        className: btnClass,
        disabled: answered,
        onClick: () => handleSelect(idx, opt.isCorrect)
      },
        e('span', { className: 'quiz-opt-letter' }, letters[idx] || (idx + 1)),
        e('span', { className: 'quiz-opt-text' }, opt.text)
      );
    });

    const isCorrect = selectedIdx !== null && quiz.options[selectedIdx] && quiz.options[selectedIdx].isCorrect;

    return e('div', { className: 'quiz-card react-quiz-card', id: `quiz-${quiz.id || Date.now()}` },
      e('div', { className: 'quiz-card-header' },
        e('span', { className: 'badge-grade-match' }, `✅ Програма: ${gradeBadgeText}`),
        e('span', { className: 'quiz-reward-badge' }, '🎋 +10 бамбук-коїнів')
      ),
      e('div', { className: 'quiz-question' }, quiz.question),
      e('div', { className: 'quiz-options-list' }, optionElements),
      answered ? e('div', {
        className: `quiz-feedback-box ${isCorrect ? 'correct' : 'wrong'}`
      },
        e('div', null, e('b', null, isCorrect ? '✅ Правильно! +10 бамбук-коїнів!' : '❌ Не зовсім так, ось пояснення:')),
        e('div', null, quiz.explanation || '')
      ) : null
    );
  }

  function renderReactComponent(element, container) {
    if (!container || !element) return false;
    try {
      if (container._reactRoot) {
        container._reactRoot.render(element);
        return true;
      } else if (window.ReactDOM && typeof window.ReactDOM.createRoot === 'function') {
        container._reactRoot = window.ReactDOM.createRoot(container);
        container._reactRoot.render(element);
        return true;
      } else if (window.ReactDOM && typeof window.ReactDOM.render === 'function') {
        window.ReactDOM.render(element, container);
        return true;
      }
    } catch (err) {
      console.warn('[StrictTutorReact] Render failed, falling back to DOM:', err);
    }
    return false;
  }

  window.StrictTutorReact = {
    StatusBarReact,
    QuizCardReact,
    renderReactComponent
  };

  // =========================================================================
  // Controller Class
  // =========================================================================

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
      this.isLessonStarted = false;
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

      // Fallback grade-specific repository to prevent 11th grade leak into 5-7th grade
      this._gradePacks = {
        'grade-5-7': {
          math: [
            {
              id: 'math-5-7-1',
              grade: 'grade-5-7',
              question: 'Обчисліть значення дробового виразу: 3/4 + 1/2. Оберіть правильну відповідь:',
              options: [
                { text: '5/4 (1 ціла 1/4)', isCorrect: true },
                { text: '4/6 (2/3)', isCorrect: false },
                { text: '1 ціла', isCorrect: false },
                { text: '3/8', isCorrect: false }
              ],
              explanation: 'Зводимо дроби до спільного знаменника 4: 3/4 + 2/4 = 5/4 = 1 ціла 1/4.'
            },
            {
              id: 'math-5-7-2',
              grade: 'grade-5-7',
              question: 'Знайдіть 20% від числа 150:',
              options: [
                { text: '30', isCorrect: true },
                { text: '25', isCorrect: false },
                { text: '15', isCorrect: false },
                { text: '50', isCorrect: false }
              ],
              explanation: '20% — це одна п’ята частина (або 150 · 0.20 = 30).'
            },
            {
              id: 'math-5-7-3',
              grade: 'grade-5-7',
              question: 'Розв’яжіть лінійне рівняння: 3x - 7 = 14:',
              options: [
                { text: 'x = 7', isCorrect: true },
                { text: 'x = 5', isCorrect: false },
                { text: 'x = 21', isCorrect: false },
                { text: 'x = 3', isCorrect: false }
              ],
              explanation: '3x = 14 + 7 = 21 => x = 21 / 3 = 7.'
            }
          ],
          'ukr-lang': [
            {
              id: 'ukr-5-7-1',
              grade: 'grade-5-7',
              question: 'Укажіть слово, у якому буква Я позначає два звуки [йа]:',
              options: [
                { text: 'яблуко', isCorrect: true },
                { text: 'пісня', isCorrect: false },
                { text: 'зоря', isCorrect: false },
                { text: 'буря', isCorrect: false }
              ],
              explanation: 'Буква Я позначає два звуки на початку слова: [йа]блуко.'
            }
          ],
          history: [
            {
              id: 'hist-5-7-1',
              grade: 'grade-5-7',
              question: 'У якому році відбулося Хрещення Русі князем Володимиром Великим?',
              options: [
                { text: '988 р.', isCorrect: true },
                { text: '882 р.', isCorrect: false },
                { text: '1019 р.', isCorrect: false },
                { text: '1240 р.', isCorrect: false }
              ],
              explanation: 'Володимир Великий охрестив Русь у 988 році.'
            }
          ],
          'eng-nmt': [
            {
              id: 'eng-5-7-1',
              grade: 'grade-5-7',
              question: 'Choose the correct plural form of the word "child":',
              options: [
                { text: 'children', isCorrect: true },
                { text: 'childs', isCorrect: false },
                { text: 'childrens', isCorrect: false },
                { text: 'childes', isCorrect: false }
              ],
              explanation: '"Child" is an irregular noun: child — children.'
            }
          ],
          physics: [
            {
              id: 'phys-5-7-1',
              grade: 'grade-5-7',
              question: 'Одиницею вимірювання швидкості в Міжнародній системі СІ є:',
              options: [
                { text: 'м/с (метр за секунду)', isCorrect: true },
                { text: 'км/год', isCorrect: false },
                { text: 'км/с', isCorrect: false },
                { text: 'м/хв', isCorrect: false }
              ],
              explanation: 'Основна одиниця швидкості в СІ — метр за секунду (м/с).'
            }
          ],
          biology: [
            {
              id: 'bio-5-7-1',
              grade: 'grade-5-7',
              question: 'Яка органела рослинної клітини містить пігмент хлорофіл і здійснює фотосинтез?',
              options: [
                { text: 'хлоропласт', isCorrect: true },
                { text: 'ядро', isCorrect: false },
                { text: 'вакуоля', isCorrect: false },
                { text: 'клітинна стінка', isCorrect: false }
              ],
              explanation: 'Хлоропласти містять хлорофіл і синтезують глюкозу під дією світла.'
            }
          ]
        }
      };

      // DOM Elements Cache
      this.dom = {};
    }

    /**
     * Initializes Tutor Studio on DOM ready
     */
    init() {
      if (window.StrictComponents) {
        window.StrictComponents.initPage('tutor');
      }

      this._ensureDomComponents();
      this._cacheDom();
      this._loadInitialState();
      this._initAvatar();
      this._bindEvents();
      this._subscribeStore();
      this._checkPendingMistakes();
      this._renderAllSettings();
      this._renderWhiteboardFormulas();
      this.applyTranslations();
      this._restoreActiveSessionIfPresent();

      console.log('StrictAI Tutor Studio successfully initialized (Voice-free, React-enabled, Grade-isolated).');
    }

    /**
     * Injects styles and action pill containers into DOM
     */
    _ensureDomComponents() {
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

          /* Interactive Action Pills (Brilliant / LeetCode style) */
          .tutor-message-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px dashed rgba(255, 255, 255, 0.12);
          }
          .tutor-action-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid rgba(99, 102, 241, 0.32);
            color: var(--text-primary, #e2e8f0);
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.78rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          }
          .tutor-action-pill:hover {
            background: rgba(99, 102, 241, 0.25);
            border-color: #818cf8;
            color: #ffffff;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
          }
          .tutor-action-pill:active {
            transform: translateY(0);
          }
          .tutor-action-pill .pill-icon {
            font-size: 0.85rem;
          }

          /* Grade match badge */
          .badge-grade-match {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background: rgba(16, 185, 129, 0.18);
            border: 1px solid rgba(16, 185, 129, 0.45);
            color: #34d399;
            padding: 2px 10px;
            border-radius: 99px;
            font-size: 0.74rem;
            font-weight: 700;
            text-transform: none;
          }

          /* Restored & Scenario Banners */
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
          }
          .btn-restored-new-lesson {
            background: var(--surface-secondary, rgba(255, 255, 255, 0.1));
            border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
            color: var(--text-primary, #fff);
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 0.8rem;
            cursor: pointer;
          }
        `;
        document.head.appendChild(styleEl);
      }

      // Ensure 9 persona cards exist
      const personaGrid = document.getElementById('persona-selector-grid');
      if (personaGrid) {
        const additionalPersonas = [
          { id: 'socratic', icon: '🕵️', title: 'Сократівський детектив', desc: 'Веде через навідні запитання', badge: 'Розслідування' },
          { id: 'examiner', icon: '🎓', title: 'Екзаменатор УЦОЯО / IELTS', desc: 'Офіційний тон і критерії', badge: 'Оцінка 200' },
          { id: 'gamemaster', icon: '🚀', title: 'Ігровий Гейм-майстер', desc: 'RPG-стиль: квести та XP', badge: 'RPG Квест' },
          { id: 'native', icon: '🗣️', title: 'Носій мови (Native)', desc: 'Діалог мовою оригіналу', badge: 'Жива мова' }
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
    }

    _cacheDom() {
      this.dom = {
        tabLanguages: document.getElementById('tab-mode-languages'),
        tabSchool: document.getElementById('tab-mode-school'),
        sectionLanguages: document.getElementById('section-languages-config'),
        sectionSchool: document.getElementById('section-school-config'),

        activeLangBadge: document.getElementById('active-lang-badge'),
        activeLevelBadge: document.getElementById('active-level-badge'),
        activeSubjectBadge: document.getElementById('active-subject-badge'),
        activeGoalBadge: document.getElementById('active-goal-badge'),
        languageLevelDesc: document.getElementById('language-level-desc'),
        schoolGoalDesc: document.getElementById('school-goal-desc'),

        personaGrid: document.getElementById('persona-selector-grid'),
        personaLockedBanner: document.getElementById('persona-locked-banner'),

        tutorStatusTitle: document.getElementById('status-bar-title') || document.getElementById('tutor-status-title'),
        statusBarTitle: document.getElementById('status-bar-title') || document.getElementById('tutor-status-title'),
        statusSubjectText: document.getElementById('status-subject-text'),
        statusLevelText: document.getElementById('status-level-text'),
        statusPersonaText: document.getElementById('status-persona-text'),
        statusModeBadge: document.getElementById('status-mode-badge'),
        presenceDot: document.getElementById('tutor-presence-dot'),
        presenceText: document.getElementById('tutor-presence-text'),

        btnNewLesson: document.getElementById('btn-new-lesson'),
        btnToggleWhiteboard: document.getElementById('btn-toggle-whiteboard'),
        btnToggleRoleplay: document.getElementById('btn-toggle-roleplay'),
        btnLessonHistory: document.getElementById('btn-lesson-history'),

        viewport: document.getElementById('tutor-chat-viewport'),
        welcomeScreen: document.getElementById('tutor-welcome-screen'),
        startLessonBtn: document.getElementById('start-lesson-btn'),
        messagesList: document.getElementById('tutor-messages-list'),

        sessionRestoredBanner: document.getElementById('session-restored-banner'),
        btnCloseRestoredBanner: document.getElementById('btn-close-restored-banner'),
        btnRestoredNewLesson: document.getElementById('btn-restored-new-lesson'),

        activeScenarioBanner: document.getElementById('active-scenario-banner'),
        scenarioBannerTitle: document.getElementById('scenario-banner-title'),
        scenarioBannerLocation: document.getElementById('scenario-banner-location'),
        scenarioBannerPlot: document.getElementById('scenario-banner-plot'),
        scenarioProgressCount: document.getElementById('scenario-progress-count'),
        scenarioMissionsList: document.getElementById('scenario-missions-list'),
        btnExitScenario: document.getElementById('btn-exit-scenario'),

        roleplayPanel: document.getElementById('roleplay-panel'),
        btnCloseRoleplay: document.getElementById('btn-close-roleplay'),
        roleplayGrid: document.getElementById('roleplay-grid'),

        historyDrawer: document.getElementById('tutor-history-drawer'),
        btnCloseHistoryDrawer: document.getElementById('btn-close-history-drawer'),
        btnClearAllHistory: document.getElementById('btn-clear-all-history'),
        historyList: document.getElementById('tutor-history-list'),
        historyCountBadge: document.getElementById('history-count-badge'),

        chipsBar: document.getElementById('tutor-chips-bar'),
        userInput: document.getElementById('tutor-user-input'),
        sendMessageBtn: document.getElementById('send-message-btn'),

        whiteboardDrawer: document.getElementById('tutor-whiteboard'),
        btnCloseWhiteboard: document.getElementById('btn-close-whiteboard'),
        whiteboardSubjectTitle: document.getElementById('whiteboard-subject-title'),
        whiteboardFormulasList: document.getElementById('whiteboard-formulas-list'),
        scratchpadText: document.getElementById('scratchpad-text'),
        btnClearScratchpad: document.getElementById('btn-clear-scratchpad'),
        btnCopyScratchpad: document.getElementById('btn-copy-scratchpad'),

        mobileBar: document.getElementById('tutor-mobile-bar'),
        mobileSummarySubject: document.getElementById('mobile-summary-subject'),
        mobileSummaryPersona: document.getElementById('mobile-summary-persona'),
        mobileToggleBtn: document.getElementById('tutor-mobile-toggle-btn'),
        mobileToggleLabel: document.getElementById('mobile-toggle-label'),
        tutorSidebar: document.getElementById('tutor-sidebar'),
        btnCloseMobileSettings: document.getElementById('btn-close-mobile-settings'),
        btnMobileApplySettings: document.getElementById('btn-mobile-apply-settings')
      };

      // Completely remove / hide voice controls from view
      const voiceIds = ['btn-toggle-voice', 'btn-voice-female', 'btn-voice-male', 'voice-input-btn'];
      voiceIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });
    }

    _loadInitialState() {
      if (!window.StrictStore) return;
      const st = window.StrictStore.get();
      const searchStr = (typeof window !== 'undefined' && window.location && window.location.search) ? window.location.search : '';
      const urlParams = new URLSearchParams(searchStr);
      const hasUrlParams = urlParams.has('subject') || urlParams.has('topic') || urlParams.has('mode') || urlParams.has('review') || urlParams.has('reviewMistake') || urlParams.has('pendingMistakeReview');

      if (!hasUrlParams && (!st.tutor || !st.tutor.pendingMistakeReview)) {
        this.mode = 'languages';
        this.language = 'english';
        this.languageName = 'English';
        this.level = 'A1';
        this.persona = (st.parental && st.parental.strictLockPersona) ? 'strict' : 'friend';
      } else if (st.tutor) {
        this.mode = st.tutor.category === 'nmt' || st.tutor.category === 'school' ? 'school' : 'languages';
        this.level = st.tutor.level || 'A1';
        this.persona = st.tutor.persona || 'friend';

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

    _bindEvents() {
      if (this.dom.tabLanguages) this.dom.tabLanguages.onclick = () => this.setMode('languages');
      if (this.dom.tabSchool) this.dom.tabSchool.onclick = () => this.setMode('school');

      const langPills = document.querySelectorAll('#language-pills-wrap .pill-btn');
      langPills.forEach(pill => {
        pill.onclick = () => this.setLanguage(pill.dataset.lang, pill.dataset.langName);
      });

      const levelBtns = document.querySelectorAll('#language-levels-grid .circle-level-btn');
      levelBtns.forEach(btn => {
        btn.onclick = () => this.setLevel(btn.dataset.level);
      });

      const schoolPills = document.querySelectorAll('#school-pills-wrap .pill-btn');
      schoolPills.forEach(pill => {
        pill.onclick = () => this.setSchoolSubject(pill.dataset.subject, pill.dataset.subjectName);
      });

      const goalPills = document.querySelectorAll('#school-goals-wrap .pill-btn');
      goalPills.forEach(pill => {
        pill.onclick = () => this.setSchoolGoal(pill.dataset.goal, pill.textContent.trim());
      });

      this._bindPersonaCardEvents();

      if (this.dom.btnNewLesson) this.dom.btnNewLesson.onclick = () => this.restartLesson();
      if (this.dom.btnToggleWhiteboard) this.dom.btnToggleWhiteboard.onclick = () => this.toggleWhiteboard();
      if (this.dom.btnCloseWhiteboard) this.dom.btnCloseWhiteboard.onclick = () => this.toggleWhiteboard(false);

      if (this.dom.btnToggleRoleplay) this.dom.btnToggleRoleplay.onclick = () => this.toggleRoleplayPanel();
      if (this.dom.btnCloseRoleplay) this.dom.btnCloseRoleplay.onclick = () => this.toggleRoleplayPanel(false);
      if (this.dom.btnExitScenario) this.dom.btnExitScenario.onclick = () => this.exitScenario();

      if (this.dom.btnLessonHistory) this.dom.btnLessonHistory.onclick = () => this.toggleHistoryDrawer();
      if (this.dom.btnCloseHistoryDrawer) this.dom.btnCloseHistoryDrawer.onclick = () => this.toggleHistoryDrawer(false);
      if (this.dom.btnClearAllHistory) this.dom.btnClearAllHistory.onclick = () => this.clearAllHistory();

      if (this.dom.btnCloseRestoredBanner) {
        this.dom.btnCloseRestoredBanner.onclick = () => {
          if (this.dom.sessionRestoredBanner) this.dom.sessionRestoredBanner.style.display = 'none';
        };
      }
      if (this.dom.btnRestoredNewLesson) this.dom.btnRestoredNewLesson.onclick = () => this.restartLesson();
      if (this.dom.startLessonBtn) this.dom.startLessonBtn.onclick = () => this.startLesson();

      if (this.dom.chipsBar) {
        this.dom.chipsBar.onclick = (e) => {
          const btn = e.target.closest('.chip-btn');
          if (!btn) return;
          if (!this.isLessonStarted) this.startLesson({ skipGreetingStream: true });
          const action = btn.dataset.action;
          if (action === 'roleplay_quick') this.toggleRoleplayPanel(true);
          else this.handleQuickAction(action);
        };
      }

      if (this.dom.sendMessageBtn) this.dom.sendMessageBtn.onclick = () => this.handleSendMessage();
      if (this.dom.userInput) {
        this.dom.userInput.onkeydown = (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendMessage();
          }
        };
      }

      if (this.dom.btnClearScratchpad) {
        this.dom.btnClearScratchpad.onclick = () => {
          if (this.dom.scratchpadText) {
            this.dom.scratchpadText.value = '';
            if (window.StrictComponents) window.StrictComponents.toast('Чернетку очищено', 'info');
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
              if (window.StrictComponents) window.StrictComponents.toast('Чернетку скопійовано в поле вводу', 'success');
            }
          }
        };
      }

      if (this.dom.mobileToggleBtn) this.dom.mobileToggleBtn.onclick = () => this.toggleMobileSettings();
      if (this.dom.btnCloseMobileSettings) this.dom.btnCloseMobileSettings.onclick = () => this.toggleMobileSettings(false);
      if (this.dom.btnMobileApplySettings) {
        this.dom.btnMobileApplySettings.onclick = () => {
          this.toggleMobileSettings(false);
          if (this.dom.userInput) this.dom.userInput.focus();
          if (window.StrictComponents) window.StrictComponents.toast('Налаштування застосовано!', 'success');
        };
      }

      window.addEventListener('strictai:localechange', () => this._handleLocaleChange());
    }

    _bindPersonaCardEvents() {
      const personaCards = document.querySelectorAll('#persona-selector-grid .persona-card');
      personaCards.forEach(card => {
        card.onclick = () => this.setPersona(card.dataset.persona);
      });
    }

    _subscribeStore() {
      if (!window.StrictStore) return;
      window.StrictStore.subscribe((state) => {
        if (state.parental && state.parental.strictLockPersona) {
          if (this.persona !== 'strict') {
            this.persona = 'strict';
            this._renderPersonas();
            this._renderStatusTitle();
            if (window.PandaAvatar) window.PandaAvatar.setPersona('strict');
          }
          if (this.dom.personaLockedBanner) this.dom.personaLockedBanner.style.display = 'flex';
        } else {
          if (this.dom.personaLockedBanner) this.dom.personaLockedBanner.style.display = 'none';
        }
      });
    }

    _checkPendingMistakes() {
      if (!window.StrictStore) return;
      const st = window.StrictStore.get();
      const mistake = st.tutor ? st.tutor.pendingMistakeReview : null;

      const searchStr = (typeof window !== 'undefined' && window.location && window.location.search) ? window.location.search : '';
      const urlParams = new URLSearchParams(searchStr);
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
          setTimeout(() => this.startLessonWithMistakeReview(mistakeData), 350);
          return;
        }
      }

      const paramSubject = urlParams.get('subject');
      const paramTopic = urlParams.get('topic');
      const paramMode = urlParams.get('mode');

      if (paramSubject || paramTopic || paramMode === 'nmt' || paramMode === 'school') {
        this.setMode('school');
        if (paramSubject) {
          const subLookup = {
            'math': { id: 'math', name: 'Математика' },
            'ukr-lang': { id: 'ukr-lang', name: 'Українська мова' },
            'history': { id: 'history', name: 'Історія України' },
            'eng-nmt': { id: 'eng-nmt', name: 'Англійська (НМТ)' },
            'physics': { id: 'physics', name: 'Фізика' },
            'biology': { id: 'biology', name: 'Біологія' }
          };
          const matchedSub = subLookup[paramSubject.toLowerCase()] || { id: 'math', name: paramSubject };
          this.setSchoolSubject(matchedSub.id, matchedSub.name);
        }
        if (paramTopic) {
          setTimeout(() => this.startLessonWithTopic(paramTopic), 350);
        }
      }
    }

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

      if (this.dom.activeLangBadge) this.dom.activeLangBadge.textContent = langName;

      this._syncStoreLanguage();
      this._renderStatusTitle();
      this._renderWhiteboardFormulas();
    }

    setLevel(level) {
      this.level = level;
      if (window.StrictComponents) window.StrictComponents.playBeep('click');

      const btns = document.querySelectorAll('#language-levels-grid .circle-level-btn');
      btns.forEach(b => b.classList.toggle('active', b.dataset.level === level));

      if (this.dom.activeLevelBadge) this.dom.activeLevelBadge.textContent = level;

      if (this.dom.languageLevelDesc && window.StrictTutorData && window.StrictTutorData.levelDescriptions) {
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

      if (this.dom.activeSubjectBadge) this.dom.activeSubjectBadge.textContent = subName;

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

      if (this.dom.activeGoalBadge) this.dom.activeGoalBadge.textContent = goalName;

      if (this.dom.schoolGoalDesc && window.StrictTutorData && window.StrictTutorData.levelDescriptions) {
        const desc = window.StrictTutorData.levelDescriptions.school[goalId] || '';
        this.dom.schoolGoalDesc.innerHTML = `<b>${goalName}:</b> ${desc}`;
      }

      this._renderStatusTitle();
    }

    setPersona(personaId) {
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
      if (window.PandaAvatar) window.PandaAvatar.setPersona(personaId);
      this._syncStorePersona();
      this._saveActiveSession();
    }

    _renderPersonas() {
      const cards = document.querySelectorAll('#persona-selector-grid .persona-card');
      const isLocked = window.StrictStore && window.StrictStore.get().parental && window.StrictStore.get().parental.strictLockPersona;

      cards.forEach(card => {
        const pId = card.dataset.persona;
        card.classList.toggle('active', pId === this.persona);
        if (isLocked) {
          card.classList.toggle('locked-inactive', pId !== 'strict');
        } else {
          card.classList.remove('locked-inactive');
        }
      });
    }

    _formatGradeBadgeText(gradeOrLevel) {
      const map = {
        'grade-5-7': '5–7 клас',
        'grade-8-9': '8–9 клас',
        'grade-10-11': '10–11 клас',
        'nmt-200': '10–11 клас (НМТ 200!)',
        'A1': 'A1 Starter',
        'A2': 'A2 Elementary',
        'B1': 'B1 Intermediate',
        'B2': 'B2 Upper-Intermediate',
        'C1': 'C1 Advanced',
        'C2': 'C2 Proficiency'
      };
      return map[gradeOrLevel] || gradeOrLevel || 'Загальна програма';
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

    applyTranslations() {
      const loc = (window.StrictStore ? window.StrictStore.get().locale : 'uk') || 'uk';
      const isOpen = this.dom.tutorSidebar && this.dom.tutorSidebar.classList.contains('mobile-open');
      const btnText = this._getMobileButtonLabel(isOpen, loc);

      const drawerToggle = document.getElementById('tutor-mobile-drawer-toggle');
      if (drawerToggle) drawerToggle.textContent = btnText;
      if (this.dom.mobileToggleLabel) {
        this.dom.mobileToggleLabel.textContent = btnText.replace(/^[^\s]+\s/, '');
      }

      this._renderStatusTitle();
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
        if (pMeta && pMeta.name) personaName = pMeta.name;
      }

      const targetLocalizedName = this._getLocalizedTargetName();
      const tabLangLabel = window.StrictI18n ? window.StrictI18n.t('tutor.tabLanguages', 'Мови') : 'Мови';
      const tabSchoolLabel = window.StrictI18n ? window.StrictI18n.t('tutor.tabSchool', 'Предмети НМТ') : 'Предмети НМТ';

      const modeBadge = this.mode === 'languages' ? tabLangLabel : tabSchoolLabel;
      const levelText = this.mode === 'languages' ? this.level : this.goalName;

      // React Architecture Render
      let renderedReact = false;
      const targetContainer = this.dom.statusBarTitle || this.dom.tutorStatusTitle;
      if (window.React && window.ReactDOM && targetContainer) {
        renderedReact = renderReactComponent(
          window.React.createElement(StatusBarReact, {
            subjectText: targetLocalizedName,
            levelText: levelText,
            personaText: personaName,
            modeBadge: modeBadge
          }),
          targetContainer
        );
      }

      // DOM fallback synchronization
      if (!renderedReact) {
        if (this.dom.statusSubjectText) this.dom.statusSubjectText.textContent = targetLocalizedName;
        if (this.dom.statusLevelText) this.dom.statusLevelText.textContent = levelText;
        if (this.dom.statusModeBadge) this.dom.statusModeBadge.textContent = modeBadge;
        if (this.dom.statusPersonaText) this.dom.statusPersonaText.textContent = personaName;
      }

      const headerSubjectNameEl = document.getElementById('header-subject-name');
      if (headerSubjectNameEl) headerSubjectNameEl.textContent = targetLocalizedName;

      this._updateMobileSummary(targetLocalizedName, personaName);
    }

    _updateMobileSummary(targetLocalizedName, personaName) {
      const summaryText = this.mode === 'languages'
        ? `🌍 ${targetLocalizedName} • ${this.level}`
        : `🎓 ${targetLocalizedName} • ${this.goalName}`;

      if (this.dom.mobileSummarySubject) this.dom.mobileSummarySubject.textContent = summaryText;
      const mobileBarSubj = document.getElementById('mobile-bar-subject');
      if (mobileBarSubj) mobileBarSubj.textContent = summaryText;

      if (this.dom.mobileSummaryPersona) {
        const icons = {
          friend: '🐼', strict: '🧐', joker: '😜', motivator: '🔥', calm: '🧘',
          socratic: '🕵️', examiner: '🎓', gamemaster: '🚀', native: '🗣️'
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
    }

    _renderWhiteboardFormulas() {
      if (!this.dom.whiteboardFormulasList || !window.StrictTutorData) return;

      const activeKey = this.mode === 'languages' ? this.language : this.subject;
      const content = window.StrictTutorData.getSubjectContent(activeKey);

      if (this.dom.whiteboardSubjectTitle) {
        const titleText = this.mode === 'languages'
          ? `Формули та шпаргалка: ${this.languageName}`
          : `Формули та шпаргалка: ${this.subjectName}`;
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

    toggleWhiteboard(forceOpen) {
      this.whiteboardOpen = typeof forceOpen === 'boolean' ? forceOpen : !this.whiteboardOpen;
      if (this.dom.whiteboardDrawer) {
        this.dom.whiteboardDrawer.classList.toggle('open', this.whiteboardOpen);
      }
      if (this.dom.btnToggleWhiteboard) {
        this.dom.btnToggleWhiteboard.classList.toggle('active', this.whiteboardOpen);
      }
      if (window.StrictComponents) window.StrictComponents.playBeep('click');
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
      if (drawerToggle) drawerToggle.textContent = btnFullText;
      const iconEl = this.dom.mobileToggleBtn ? this.dom.mobileToggleBtn.querySelector('.toggle-icon') : null;
      if (iconEl) iconEl.textContent = isOpen ? '💬' : '⚙️';
      if (isOpen) {
        if (typeof this.dom.tutorSidebar.scrollIntoView === 'function') {
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

    // =========================================================================
    // Strict Grade & Level Filtering Engine (Screenshot 5 Fix)
    // =========================================================================

    _isQuizCompatibleWithTier(quiz, targetTier) {
      const quizTier = quiz.grade || quiz.level || '';
      if (!quizTier) return targetTier !== 'grade-5-7'; // never allow unclassified content for 5-7

      if (targetTier === 'grade-5-7') {
        return quizTier === 'grade-5-7' || quizTier === '5-7' || quizTier === '5' || quizTier === '6' || quizTier === '7';
      }
      if (targetTier === 'grade-8-9') {
        return quizTier === 'grade-8-9' || quizTier === '8-9' || quizTier === '8' || quizTier === '9';
      }
      if (targetTier === 'grade-10-11') {
        return quizTier === 'grade-10-11' || quizTier === '10-11' || quizTier === 'nmt-200';
      }
      if (targetTier === 'nmt-200') {
        return quizTier === 'nmt-200' || quizTier === 'grade-10-11' || quizTier === 'nmt';
      }
      return quizTier.toUpperCase() === targetTier.toUpperCase();
    }

    getFilteredQuizzes(activeKey, activeGradeOrLevel) {
      if (window.StrictTutorData && typeof window.StrictTutorData.getQuizzes === 'function') {
        const res = window.StrictTutorData.getQuizzes(activeKey, activeGradeOrLevel);
        if (res && res.length > 0) {
          const safe = res.filter(q => this._isQuizCompatibleWithTier(q, activeGradeOrLevel));
          if (safe.length > 0) return safe;
        }
      }

      const content = window.StrictTutorData ? window.StrictTutorData.getSubjectContent(activeKey) : null;
      const quizzes = (content && content.quizzes) ? content.quizzes : [];

      const filtered = quizzes.filter(q => this._isQuizCompatibleWithTier(q, activeGradeOrLevel));
      if (filtered.length > 0) return filtered;

      // Grade 5-7 strict safety fallback: ALWAYS return genuine 5-7 questions
      if (activeGradeOrLevel === 'grade-5-7') {
        const pack = this._gradePacks['grade-5-7'] ? this._gradePacks['grade-5-7'][activeKey] : null;
        if (pack && pack.length > 0) return pack;
        return this._gradePacks['grade-5-7'].math;
      }

      return quizzes;
    }

    getFilteredRules(activeKey, activeGradeOrLevel) {
      if (window.StrictTutorData && typeof window.StrictTutorData.getRules === 'function') {
        const res = window.StrictTutorData.getRules(activeKey, activeGradeOrLevel);
        if (res && res.length > 0) return res;
      }
      const content = window.StrictTutorData ? window.StrictTutorData.getSubjectContent(activeKey) : null;
      return (content && content.rules) ? content.rules : [];
    }

    getFilteredBlitz(activeKey, activeGradeOrLevel) {
      if (window.StrictTutorData && typeof window.StrictTutorData.getBlitz === 'function') {
        const res = window.StrictTutorData.getBlitz(activeKey, activeGradeOrLevel);
        if (res && res.length > 0) return res;
      }
      const content = window.StrictTutorData ? window.StrictTutorData.getSubjectContent(activeKey) : null;
      return (content && content.blitzQuestions) ? content.blitzQuestions : [];
    }

    getFilteredConversationPrompts(activeKey, activeGradeOrLevel) {
      const content = window.StrictTutorData ? window.StrictTutorData.getSubjectContent(activeKey) : null;
      return (content && content.conversationPrompts) ? content.conversationPrompts : [];
    }

    getFilteredSocraticPrompts(activeKey, activeGradeOrLevel) {
      const content = window.StrictTutorData ? window.StrictTutorData.getSubjectContent(activeKey) : null;
      return (content && content.socraticPrompts) ? content.socraticPrompts : [
        'Яке ключове правило чи обмеження тут діє?',
        'Спробуй розкласти завдання на два простих підкроки.'
      ];
    }

    // =========================================================================
    // Lesson & Chat Flow
    // =========================================================================

    startLesson({ skipGreetingStream = false } = {}) {
      this.isLessonStarted = true;
      this.toggleMobileSettings(false);
      if (window.StrictComponents) window.StrictComponents.playBeep('click');

      if (this.dom.welcomeScreen) this.dom.welcomeScreen.style.display = 'none';
      if (this.dom.messagesList) {
        this.dom.messagesList.style.display = 'flex';
        this.dom.messagesList.innerHTML = '';
      }

      if (this.dom.sessionRestoredBanner) this.dom.sessionRestoredBanner.style.display = 'none';
      this.savedMessages = [];

      const greetingText = this._generateInitialGreeting();
      this.appendMessage({
        sender: 'tutor',
        text: greetingText,
        type: 'text',
        skipStream: skipGreetingStream === true
      });

      if (this.dom.presenceText) {
        this.dom.presenceText.textContent = window.StrictI18n ? window.StrictI18n.t('tutor.presenceActive', 'Урок триває • Активна сесія') : 'Урок триває • Активна сесія';
      }
    }

    startLessonWithMistakeReview(mistakeData) {
      this.isLessonStarted = true;
      this._renderAllSettings();

      if (this.dom.welcomeScreen) this.dom.welcomeScreen.style.display = 'none';
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

      if (this.dom.welcomeScreen) this.dom.welcomeScreen.style.display = 'none';
      if (this.dom.messagesList) {
        this.dom.messagesList.style.display = 'flex';
        this.dom.messagesList.innerHTML = '';
      }

      this.savedMessages = [];
      const subName = this.subjectName;
      const openingText = `Привіт! 🐼 Ми розпочинаємо детальне опрацювання теми **«${topic}»** (${subName}). Ми розберемо її послідовно та без жодного стресу. Що саме викликає найбільше запитань: розібрати ключове правило чи спробувати вправу?`;

      this.appendMessage({
        sender: 'tutor',
        text: openingText,
        type: 'text'
      });

      if (this.dom.presenceText) this.dom.presenceText.textContent = `Урок триває • Тема: ${topic}`;
      if (window.StrictComponents) window.StrictComponents.toast(`Панда готова до уроку з теми: ${topic}!`, 'info');
    }

    restartLesson(skipConfirm = false) {
      if (window.StrictComponents) window.StrictComponents.playBeep('click');

      if (this.savedMessages && this.savedMessages.length > 0) {
        if (!skipConfirm && !confirm('Бажаєте завершити поточний урок, зберегти його в історію та розпочати новий?')) {
          return;
        }
        this._archiveCurrentLesson();
      }

      localStorage.removeItem('strictai_active_tutor_session');
      this.savedMessages = [];
      this.messageCount = 0;
      this.activeScenario = null;

      if (this.dom.activeScenarioBanner) this.dom.activeScenarioBanner.style.display = 'none';
      if (this.dom.sessionRestoredBanner) this.dom.sessionRestoredBanner.style.display = 'none';
      if (this.dom.messagesList) this.dom.messagesList.innerHTML = '';

      this.startLesson();
      if (window.StrictComponents) window.StrictComponents.toast('Розпочато новий урок! Попередній збережено в історію.', 'info');
    }

    _generateInitialGreeting() {
      const p = this.persona;
      const targetName = this.mode === 'languages' ? this.languageName : this.subjectName;
      const levelOrGoal = this.mode === 'languages' ? `рівень ${this.level}` : this.goalName;

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

      this.appendMessage({
        sender: 'user',
        text: text,
        type: 'text'
      });

      this.dom.userInput.value = '';

      if (this.activeScenario) {
        this._checkScenarioProgress(text);
      }

      this._generatePandaResponse(text);
    }

    async _generatePandaResponse(userText) {
      if (this.dom.presenceText) this.dom.presenceText.textContent = 'Панда міркує...';
      if (window.PandaAvatar) window.PandaAvatar.setState('thinking');

      const activeKey = this.mode === 'languages' ? this.language : this.subject;
      const storeState = window.StrictStore ? window.StrictStore.get() : null;
      const apiKey = storeState && storeState.tutor ? storeState.tutor.apiKey : '';
      const apiProvider = storeState && storeState.tutor ? storeState.tutor.apiProvider : 'gemini';

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

      setTimeout(() => {
        const fallbackAnswer = this._synthesizeAutonomousResponse(userText, activeKey);
        this._finishPandaReply(fallbackAnswer);
      }, 500);
    }

    _finishPandaReply(replyText) {
      if (this.dom.presenceText) this.dom.presenceText.textContent = 'Панда готова до уроку';
      if (window.PandaAvatar) window.PandaAvatar.setState('idle');

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

      if (lower.includes('підказ') || lower.includes('сократ') || lower.includes('як почати')) {
        const hints = content && content.socraticPrompts ? content.socraticPrompts : [
          'Яке ключове правило чи обмеження тут діє?',
          'Спробуй розкласти завдання на два простих підкроки.'
        ];
        const randomHint = hints[Math.floor(Math.random() * hints.length)];
        const prefix = tone ? tone.socraticPrefix : 'Давай поміркуємо разом:';
        return `${prefix}\n\n💡 **Підказка:** ${randomHint}`;
      }

      if (lower.includes('правил') || lower.includes('поясни') || lower.includes('теорі')) {
        if (content && content.rules && content.rules.length > 0) {
          const rule = content.rules[0];
          return `### 📖 ${rule.title}\n\n` +
                 `${rule.summary}\n\n` +
                 `**Формула:** \`${rule.formula}\`\n\n` +
                 `💡 *Мнемоніка від Панди:* ${rule.mnemonic}`;
        }
      }

      if (lower.includes('перевір') || lower.includes('відповід') || lower.includes('правильно')) {
        const praise = tone && tone.praise ? tone.praise[0] : 'Добра спроба!';
        return `${praise}\n\nТвоя думка рухається у правильному напрямку. Пам’ятай завжди перевіряти область допустимих значень та узгодження часів! Чи хочеш закріпити це на практичній тестовій вправі?`;
      }

      if (this.persona === 'strict') {
        return `Ваше формулювання прийнято. У контексті дисципліни **«${this.mode === 'languages' ? this.languageName : this.subjectName}»** важливо спиратися на точні правила програми. Пропоную виконати перевірочну вправу.`;
      } else if (this.persona === 'joker') {
        return `О, ловлю твою думку на льоту! 🚀 Якби ця тема була піцою, ти щойно відкусив найсмачніший шматочок з сирним бортиком! Натискай кнопку «Дай вправу», щоб закріпити цей тріумф!`;
      } else if (this.persona === 'motivator') {
        return `Відмінний хід думок! 🔥 Ти бачиш суть завдання і не боїшся заглиблюватися в деталі. Саме так куються 200 балів! Продовжуємо штурм вершин — давай ще одну вправу!`;
      } else if (this.persona === 'socratic') {
        return `Цікавий хід думок! 🕵️ Але давай копнемо глибше: яке саме базове правило чи факт змушує нас робити такий висновок? Що зміниться, якщо одну з умов змінити на протилежну?`;
      } else {
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
        socratic: 'Ти Сократівський детектив Червона Панда: ведеш учня через навідні сократівські запитання.',
        examiner: 'Ти суворий екзаменатор УЦОЯО / IELTS Червона Панда: академічний тон та критерії.',
        gamemaster: 'Ти ігровий Гейм-майстер RPG Червона Панда: перетворюєш навчання на RPG квест.',
        native: 'Ти носій мови (Native Speaker) Червона Панда: ведеш діалог автентичною цільовою мовою.'
      };

      const systemPrompt = `Ти — ${personaInstructions[this.persona] || personaInstructions.friend}. Предмет: ${this.mode === 'languages' ? this.languageName : this.subjectName}. Рівень/Клас: ${this.mode === 'languages' ? this.level : this.goalName}. Відповідай виключно природною літературною мовою.`;

      if (provider === 'gemini') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nКористувач каже: "${prompt}"` }] }]
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
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }]
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
    // Quick Actions with Strict Grade Filter & Badges
    // =========================================================================

    handleQuickAction(action) {
      if (!this.isLessonStarted) {
        this.startLesson({ skipGreetingStream: true });
      }

      const activeKey = this.mode === 'languages' ? this.language : this.subject;
      const activeGradeOrLevel = this.mode === 'languages' ? this.level : this.goal;
      const gradeLabel = this._formatGradeBadgeText(activeGradeOrLevel);

      if (action === 'exercise') {
        const quizzes = this.getFilteredQuizzes(activeKey, activeGradeOrLevel);
        if (quizzes.length > 0) {
          const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
          this.appendQuizMessage(quiz);
        } else {
          this.appendMessage({
            sender: 'tutor',
            text: `Наразі формується нова вправа для програми **${gradeLabel}**. Спробуйте дію «Поясни правило» або напишіть своє запитання!`,
            type: 'text'
          });
        }
      } else if (action === 'explain_rule') {
        const rules = this.getFilteredRules(activeKey, activeGradeOrLevel);
        if (rules.length > 0) {
          const rule = rules[Math.floor(Math.random() * rules.length)];
          const ruleHtml = `
            <div class="rule-card">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
                <div class="rule-card-title">📖 ${rule.title}</div>
                <span class="badge-grade-match">✅ Програма: ${gradeLabel}</span>
              </div>
              <p>${rule.summary}</p>
              <p><b>Формула / Структура:</b> <code>${rule.formula}</code></p>
              <p>💡 <i>Мнемоніка від Панди:</i> ${rule.mnemonic}</p>
            </div>
          `;
          this.appendMessage({
            sender: 'tutor',
            text: `Ось ключове правило програми **${gradeLabel}** з теми **«${rule.title}»**:`,
            htmlExtra: ruleHtml,
            type: 'rule'
          });
        }
      } else if (action === 'conversation') {
        const prompts = this.getFilteredConversationPrompts(activeKey, activeGradeOrLevel);
        const promptText = prompts.length > 0 ? prompts[Math.floor(Math.random() * prompts.length)] : 'Розкажи про свої навчальні плани на цей тиждень!';
        this.appendMessage({
          sender: 'tutor',
          text: `💬 **Поговорімо [${gradeLabel}]:**\n\n${promptText}`,
          type: 'text'
        });
      } else if (action === 'check_text') {
        this.appendMessage({
          sender: 'tutor',
          text: `🔍 **Перевірка тексту та розв’язків [${gradeLabel}]:**\n\nБудь ласка, вставте нижче ваше речення, твір чи чернетковий хід думок. Я уважно знайду граматичні, пунктуаційні або логічні помилки за критеріями програми ${gradeLabel} та покажу, як їх виправити!`,
          type: 'text'
        });
      } else if (action === 'blitz') {
        const blitzList = this.getFilteredBlitz(activeKey, activeGradeOrLevel);
        if (blitzList.length > 0) {
          const item = blitzList[Math.floor(Math.random() * blitzList.length)];
          const blitzBadge = `<div style="margin-top: 8px;"><span class="badge-grade-match">✅ Програма: ${gradeLabel}</span></div>`;
          this.appendMessage({
            sender: 'tutor',
            text: `⚡ **Бліц (Швидка реакція) [${gradeLabel}]:**\n\n${item.q}\n\n*(Напишіть свою відповідь у чат, щоб перевірити себе!)*`,
            htmlExtra: blitzBadge,
            type: 'blitz'
          });
        }
      } else if (action === 'socratic_hint') {
        const hints = this.getFilteredSocraticPrompts(activeKey, activeGradeOrLevel);
        const hint = hints[Math.floor(Math.random() * hints.length)];
        this.appendMessage({
          sender: 'tutor',
          text: `💡 **Підказка за методом Сократа [${gradeLabel}]:**\n\n${hint}`,
          type: 'text'
        });
      }
    }

    // =========================================================================
    // Brilliant / LeetCode Interactive Message Actions
    // =========================================================================

    _bindMessageActions(container, messageText) {
      const pills = container.querySelectorAll('.tutor-action-pill');
      pills.forEach(pill => {
        pill.onclick = (e) => {
          e.stopPropagation();
          const action = pill.dataset.action;
          if (action === 'step') {
            this.handleSocraticStepBreakdown(messageText);
          } else if (action === 'case') {
            this.handleSimilarCase();
          } else if (action === 'note') {
            this.saveNoteToNotebook(messageText);
          }
        };
      });
    }

    handleSocraticStepBreakdown(topicOrText) {
      const activeGradeOrLevel = this.mode === 'languages' ? this.level : this.goal;
      const gradeLabel = this._formatGradeBadgeText(activeGradeOrLevel);

      const breakdown =
        `1️⃣ **Крок 1 (Аналіз вихідних даних):** Визначте відомі величини, граматичний час або ключові умови завдання.\n` +
        `2️⃣ **Крок 2 (Нормативне правило програми):** Зіставте знайдені умови з теоремою чи правилом для **${gradeLabel}**.\n` +
        `3️⃣ **Крок 3 (Перевірка на пастки):** Перевірте область допустимих значень (ОДЗ) та узгодження компонентів.\n\n` +
        `*Спробуйте виконати ці три кроки для поточного питання!*`;

      this.appendMessage({
        sender: 'tutor',
        text: `💡 **Сократівський покроковий розбір [${gradeLabel}]:**\n\n${breakdown}`,
        type: 'text'
      });

      if (window.StrictComponents) window.StrictComponents.playBeep('click');
    }

    handleSimilarCase() {
      const activeKey = this.mode === 'languages' ? this.language : this.subject;
      const activeGradeOrLevel = this.mode === 'languages' ? this.level : this.goal;

      const quizzes = this.getFilteredQuizzes(activeKey, activeGradeOrLevel);
      if (quizzes.length > 0) {
        const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
        this.appendQuizMessage(quiz);
        if (window.StrictComponents) {
          window.StrictComponents.toast('🧪 Згенеровано схожий кейс для тренування!', 'info');
          window.StrictComponents.playBeep('click');
        }
      } else {
        this.appendMessage({
          sender: 'tutor',
          text: 'Наразі ми формуємо нову вправу для цього рівня. Натисніть «Поясни правило» або запитайте в чаті!',
          type: 'text'
        });
      }
    }

    saveNoteToNotebook(text) {
      try {
        const cleanSnippet = (text || '').replace(/<[^>]*>/g, '').replace(/[*#`_]/g, '').trim();
        if (!cleanSnippet) return;

        const raw = localStorage.getItem('strictai_notebook_notes');
        const notes = raw ? JSON.parse(raw) : [];

        const activeGradeOrLevel = this.mode === 'languages' ? this.level : this.goal;
        const gradeBadge = this._formatGradeBadgeText(activeGradeOrLevel);

        const newNote = {
          id: 'note_' + Date.now(),
          text: cleanSnippet,
          subject: this.mode === 'languages' ? this.languageName : this.subjectName,
          grade: gradeBadge,
          persona: this.persona,
          timestamp: Date.now(),
          dateStr: new Date().toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })
        };

        notes.unshift(newNote);
        if (notes.length > 50) notes.pop();
        localStorage.setItem('strictai_notebook_notes', JSON.stringify(notes));

        if (window.StrictComponents) {
          window.StrictComponents.toast('📌 Збережено в персональний конспект!', 'success');
          window.StrictComponents.playBeep('success');
        }
      } catch (err) {
        console.warn('Failed to save notebook note:', err);
      }
    }

    // =========================================================================
    // Message Rendering & Typewriter Streaming
    // =========================================================================

    appendMessage({ sender, text, htmlExtra = '', type = 'text', mistakeMeta = null, skipStream = false }) {
      if (!this.dom.messagesList) return;

      if (sender === 'user' || skipStream) {
        this._renderMessageToDom({ sender, text, htmlExtra, type, mistakeMeta });
        if (sender === 'user') {
          this.savedMessages.push({ sender, text, htmlExtra, type, mistakeMeta, timestamp: Date.now() });
          this._saveActiveSession();
        }
      } else {
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

      let actionPillsHtml = '';
      if (sender === 'tutor') {
        actionPillsHtml = `
          <div class="tutor-message-actions">
            <button type="button" class="tutor-action-pill" data-action="step" title="Показати крок розв'язання">
              <span class="pill-icon">💡</span>
              <span>Показати крок розв'язання</span>
            </button>
            <button type="button" class="tutor-action-pill" data-action="case" title="Перевірити на схожому кейсі">
              <span class="pill-icon">🧪</span>
              <span>Перевірити на схожому кейсі</span>
            </button>
            <button type="button" class="tutor-action-pill" data-action="note" title="Зберегти в конспект">
              <span class="pill-icon">📌</span>
              <span>Зберегти в конспект</span>
            </button>
          </div>
        `;
      }

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
            ${actionPillsHtml}
          </div>
        </div>
      `;

      if (sender === 'tutor') {
        this._bindMessageActions(row, text);
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
        </div>
      `;

      this.dom.messagesList.appendChild(row);
      this._scrollToBottom();

      if (window.PandaAvatar) window.PandaAvatar.setState('talking');

      const streamContentEl = row.querySelector('.stream-content');
      const cursorEl = row.querySelector('.typewriter-cursor');
      const bubbleEl = row.querySelector('.message-bubble');

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

      if (cursorEl) cursorEl.remove();

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

      const actionPillsHtml = `
        <div class="tutor-message-actions">
          <button type="button" class="tutor-action-pill" data-action="step" title="Показати крок розв'язання">
            <span class="pill-icon">💡</span>
            <span>Показати крок розв'язання</span>
          </button>
          <button type="button" class="tutor-action-pill" data-action="case" title="Перевірити на схожому кейсі">
            <span class="pill-icon">🧪</span>
            <span>Перевірити на схожому кейсі</span>
          </button>
          <button type="button" class="tutor-action-pill" data-action="note" title="Зберегти в конспект">
            <span class="pill-icon">📌</span>
            <span>Зберегти в конспект</span>
          </button>
        </div>
      `;

      if (bubbleEl) {
        bubbleEl.innerHTML = `
          ${formattedText}
          ${mistakeCardHtml}
          ${htmlExtra}
          ${actionPillsHtml}
        `;
        this._bindMessageActions(row, replyText);
      }

      if (window.PandaAvatar) window.PandaAvatar.setState('idle');

      this.isStreaming = false;
      this._scrollToBottom();

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

      this.messageCount++;
      if (this.messageCount % 3 === 0 && window.StrictStore) {
        const subName = this.mode === 'languages' ? this.languageName : this.subjectName;
        window.StrictStore.addFocusMinutes(3, subName);
      }
    }

    // =========================================================================
    // Quiz Card Rendering (React + DOM Fallback)
    // =========================================================================

    appendQuizMessage(quizObj) {
      if (!this.dom.messagesList) return;

      const activeGradeOrLevel = this.mode === 'languages' ? this.level : this.goal;
      const gradeBadgeText = this._formatGradeBadgeText(quizObj.grade || quizObj.level || activeGradeOrLevel);
      const quizId = quizObj.id || `quiz-${Date.now()}`;

      // 1. React Architecture Render
      if (window.React && window.ReactDOM) {
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
              <p>Ось інтерактивна вправа за вашою програмою! Оберіть один правильний варіант:</p>
              <div class="quiz-react-container" id="react-quiz-${quizId}"></div>
              <div class="tutor-message-actions">
                <button type="button" class="tutor-action-pill" data-action="step" title="Показати крок розв'язання">
                  <span class="pill-icon">💡</span> <span>Показати крок розв'язання</span>
                </button>
                <button type="button" class="tutor-action-pill" data-action="case" title="Перевірити на схожому кейсі">
                  <span class="pill-icon">🧪</span> <span>Перевірити на схожому кейсі</span>
                </button>
                <button type="button" class="tutor-action-pill" data-action="note" title="Зберегти в конспект">
                  <span class="pill-icon">📌</span> <span>Зберегти в конспект</span>
                </button>
              </div>
            </div>
          </div>
        `;

        this.dom.messagesList.appendChild(row);
        const reactContainer = row.querySelector(`#react-quiz-${quizId}`);

        renderReactComponent(
          window.React.createElement(QuizCardReact, {
            quiz: quizObj,
            gradeBadgeText: gradeBadgeText,
            onAnswer: (isCorrect) => {
              this._handleQuizAnswerFeedback(isCorrect, quizObj);
            }
          }),
          reactContainer
        );

        this._bindMessageActions(row, quizObj.question);
        this._scrollToBottom();
        return;
      }

      // 2. Pure DOM Fallback
      const letters = ['А', 'Б', 'В', 'Г'];
      const optionsHtml = quizObj.options.map((opt, idx) => `
        <button class="quiz-option-btn" data-correct="${opt.isCorrect}">
          <span class="quiz-opt-letter">${letters[idx] || (idx + 1)}</span>
          <span class="quiz-opt-text">${opt.text}</span>
        </button>
      `).join('');

      const quizCardHtml = `
        <div class="quiz-card" id="quiz-${quizId}">
          <div class="quiz-card-header">
            <span class="badge-grade-match">✅ Програма: ${gradeBadgeText}</span>
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
        text: 'Ось інтерактивна вправа за вашою програмою! Оберіть один правильний варіант:',
        htmlExtra: quizCardHtml,
        type: 'quiz'
      });

      setTimeout(() => {
        const cardEl = this.dom.messagesList.querySelector(`#quiz-${quizId}`) ||
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
              if (b.dataset.correct === 'true') b.classList.add('correct');
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

            this._handleQuizAnswerFeedback(isCorrect, quizObj);
            this._scrollToBottom();
          };
        });
      }, 50);
    }

    _handleQuizAnswerFeedback(isCorrect, quizObj) {
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
        if (window.StrictComponents) window.StrictComponents.playBeep('alert');
        if (window.PandaAvatar) {
          window.PandaAvatar.setState('strict-warning');
          setTimeout(() => window.PandaAvatar.setState('idle'), 3000);
        }
      }
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
          this.startScenario(card.dataset.scenarioId);
        };
      });
    }

    startScenario(scenarioId) {
      const scenario = this.scenarios.find(s => s.id === scenarioId);
      if (!scenario) return;

      this.activeScenario = { ...scenario, completedMissions: [] };
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

      if (this.dom.scenarioBannerTitle) this.dom.scenarioBannerTitle.textContent = `${sc.icon} ${sc.title}`;
      if (this.dom.scenarioBannerLocation) this.dom.scenarioBannerLocation.innerHTML = `<b>Місце:</b> ${sc.location}`;
      if (this.dom.scenarioBannerPlot) this.dom.scenarioBannerPlot.innerHTML = `<b>Зав'язка:</b> ${sc.plot}`;

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
          if (kwList.some(k => lower.includes(k))) {
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
      if (this.dom.activeScenarioBanner) this.dom.activeScenarioBanner.style.display = 'none';
      if (window.StrictComponents) {
        window.StrictComponents.toast('Рольовий сценарій завершено. Ви можете продовжити звичайний урок.', 'info');
      }
      this._saveActiveSession();
    }

    // =========================================================================
    // History Drawer & Archiving
    // =========================================================================

    toggleHistoryDrawer(forceState = null) {
      this.historyDrawerOpen = forceState !== null ? forceState : !this.historyDrawerOpen;
      if (this.dom.historyDrawer) {
        this.dom.historyDrawer.classList.toggle('open', this.historyDrawerOpen);
      }
      if (this.dom.btnLessonHistory) {
        this.dom.btnLessonHistory.classList.toggle('active', this.historyDrawerOpen);
      }
      if (this.historyDrawerOpen) this._renderLessonHistory();
      if (window.StrictComponents) window.StrictComponents.playBeep('click');
    }

    _getLessonHistory() {
      try {
        const raw = localStorage.getItem('strictai_lesson_history');
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
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
        if (history.length > 35) history.pop();
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
        friend: 'Добрий друг', strict: 'Суворий викладач', joker: 'Жартівник',
        motivator: 'Мотиватор', calm: 'Спокійний ментор', socratic: 'Сократівський детектив',
        examiner: 'Екзаменатор УЦОЯО / IELTS', gamemaster: 'Ігровий Гейм-майстер', native: 'Носій мови (Native)'
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
        btn.onclick = () => this.restoreLessonFromHistory(btn.dataset.lessonId);
      });
    }

    restoreLessonFromHistory(lessonId) {
      const history = this._getLessonHistory();
      const target = history.find(h => h.id === lessonId);
      if (!target || !target.messages) return;

      if (this.savedMessages && this.savedMessages.length > 0) {
        this._archiveCurrentLesson();
      }

      this.mode = target.mode || 'languages';
      this.persona = target.persona || 'friend';
      this._renderAllSettings();

      this.isLessonStarted = true;
      this.savedMessages = [...target.messages];

      if (this.dom.welcomeScreen) this.dom.welcomeScreen.style.display = 'none';
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
        if (window.StrictComponents) window.StrictComponents.toast('Історію уроків очищено.', 'info');
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

          if (this.dom.welcomeScreen) this.dom.welcomeScreen.style.display = 'none';
          if (this.dom.messagesList) {
            this.dom.messagesList.style.display = 'flex';
            this.dom.messagesList.innerHTML = '';
            data.messages.forEach(msg => {
              this._renderMessageToDom({ ...msg, skipStream: true });
            });
            this._scrollToBottom();
          }

          if (this.activeScenario) this._renderActiveScenarioBanner();
          if (this.dom.sessionRestoredBanner) this.dom.sessionRestoredBanner.style.display = 'flex';
          if (this.dom.presenceText) this.dom.presenceText.textContent = 'Відновлено активну сесію уроку';
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
        tutor: { ...st.tutor, category: this.mode === 'school' ? 'nmt' : 'languages' }
      }));
    }

    _syncStoreLanguage() {
      if (!window.StrictStore) return;
      window.StrictStore.update(st => ({
        ...st,
        tutor: { ...st.tutor, language: this.languageName }
      }));
    }

    _syncStoreLevel() {
      if (!window.StrictStore) return;
      window.StrictStore.update(st => ({
        ...st,
        tutor: { ...st.tutor, level: this.level }
      }));
    }

    _syncStoreSubject() {
      if (!window.StrictStore) return;
      window.StrictStore.update(st => ({
        ...st,
        tutor: { ...st.tutor, nmtSubject: this.subjectName }
      }));
    }

    _syncStorePersona() {
      if (!window.StrictStore) return;
      window.StrictStore.update(st => ({
        ...st,
        tutor: { ...st.tutor, persona: this.persona }
      }));
    }
  }

  // Instantiate and mount
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