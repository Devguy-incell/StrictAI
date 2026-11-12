/**
 * StrictAI Internationalization Engine (i18n)
 * Multi-Tier Localization & Language Switching System
 * Supports: Ukrainian (uk - default), English (en), Polish (pl), German (de).
 * Zero build step required - 100% vanilla ES6/Browser & Node.js compatible.
 */

(function () {
  'use strict';

  const STORAGE_LOCALE_KEY = 'strictai_locale';

  const SUPPORTED_LOCALES = [
    { code: 'uk', name: 'Українська', flag: '🇺🇦', native: 'Українська' },
    { code: 'en', name: 'English', flag: '🇬🇧', native: 'English' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱', native: 'Polski' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', native: 'Deutsch' }
  ];

  const TRANSLATIONS = {
    // =========================================================================
    // 🇺🇦 UKRAINIAN (DEFAULT / PRIMARY)
    // =========================================================================
    uk: {
      nav: {
        home: 'Головна',
        tutor: 'AI-Репетитор',
        nmt: 'Тренажер НМТ',
        tracker: 'Контроль & Фокус',
        parents: 'Батьківський кабінет',
        knowledge: 'Карта знань',
        themeDark: 'Темна (глибокий індиго)',
        themeLight: 'Паперова (для читання)',
        themeToggle: 'Змінити тему (Темна / Паперова для читання)',
        streakTitle: 'Твій поточний щоденний стрік занять',
        streakDays: 'дн.',
        bambooTitle: 'Бамбук-коїни за фокус та розібрані завдання',
        apiKey: 'AI Ключ',
        apiKeyTitle: 'Налаштування AI провайдера (Gemini / OpenAI / Groq)',
        sessionBadge: 'Активна фокус-сесія! Клацніть, щоб повернутися до таймера',
        menuAria: 'Відкрити меню',
        langSelect: 'Мова інтерфейсу',
        langModalTitle: 'Оберіть мову платформи'
      },

      focusAlert: {
        title: 'Увага! Відволікання зафіксовано!',
        sub: 'Повернися до підготовки! За сесію: {switches} перемикань.',
        toast: '⚠️ Панда помітила відволікання! Сесія фокусу активна. Перемикання вкладок зафіксовано.',
        close: '✕'
      },

      apiModal: {
        title: '⚙️ Налаштування AI Провайдера',
        desc: 'Платформа StrictAI працює як у режимі автономного тренажера, так і з підключенням обраної нейромережі для індивідуального репетитора. Ключ зберігається виключно локально у вашому браузері.',
        selectProvider: 'Оберіть AI Провайдера:',
        keyLabel: 'API Ключ:',
        keyHintGemini: 'Отримати ключ Google AI Studio ↗',
        keyHintOpenAI: 'Отримати ключ OpenAI ↗',
        keyHintGroq: 'Отримати ключ GroqCloud ↗',
        keyPlaceholder: 'Введіть AIzaSy... або sk-...',
        privacy: '🔒 Конфіденційність гарантовано: ключ не передається на сторонні сервери StrictAI і використовується для прямих запитів до обраного провайдера.',
        cancel: 'Скасувати',
        save: 'Зберегти налаштування',
        success: 'Налаштування збережено! Провайдер: {provider}'
      },

      personas: {
        friend: {
          name: 'Добрий друг',
          tagline: 'М’яка підтримка, жодного тиску та терпляче пояснення',
          desc: 'Підтримує й хвалить за кожен крок',
          badge: 'Терплячий',
          greeting: 'Привіт! Я поруч, щоб допомогти тобі розібратися з будь-якою темою без жодного стресу. З чого почнемо сьогодні?'
        },
        strict: {
          name: 'Суворий викладач',
          tagline: 'Залізна дисципліна, точність формулювань, нуль лінощів',
          desc: 'Вимогливий, виправляє кожну помилку',
          badge: 'Без поблажок',
          greeting: 'Вітаю. Час до НМТ спливає. Жодних виправдань та сторонніх вкладок! Сконцентруйся та доведи свою відповідь.'
        },
        joker: {
          name: 'Жартівник',
          tagline: 'Мемологія, кумедні асоціації та навчання з усмішкою',
          desc: 'Пояснює з гумором і жартами',
          badge: 'З гумором',
          greeting: 'О, привіт! Кажуть, що граніт науки смакує краще за молодий бамбук. Розкладемо ці формули по поличках так, щоб комісія плакала від радості!'
        },
        motivator: {
          name: 'Мотиватор',
          tagline: 'Енергія переможця, фокус на бюджет та рекордні 200 балів',
          desc: 'Дає виклики й святкує успіхи',
          badge: 'Драйв 200',
          greeting: 'Увага на ціль! Ти можеш значно більше, ніж думаєш. Кожен розібраний тест — це твій крок до омріяного вишу! Погнали!'
        },
        calm: {
          name: 'Спокійний ментор',
          tagline: 'Дзен-підхід, структура, системне мислення та впевненість',
          desc: 'Терпляче, крок за кроком, без поспіху',
          badge: 'Дзен',
          greeting: 'Зроби спокійний вдих. Складне стає елементарним, коли розкласти його на послідовні кроки. Почнімо повільно й вдумливо.'
        }
      },

      index: {
        hero: {
          badge: 'ШІ-репетитор нового покоління',
          titleHtml: 'Твій персональний репетитор із <span>залізною дисципліною</span>',
          subtitle: 'Ми — перший український освітній ШІ-сервіс із власним живим цифровим аватаром Червоної Панди. Панда підлаштовується під твій характер, покроково пояснює кожну помилку за програмою УЦОЯО та не дає прокрастинувати під час уроку.',
          btnTutor: 'Почати урок з Пандою',
          btnNmt: 'Тренажер НМТ 2025',
          statPredicted: 'Сер. прогнозований бал',
          statBudget: 'Вступників на бюджет',
          statCheating: 'Шансів списати у соцмережах',
          statPersonas: 'Унікальних характерів ШІ',
          bubble: 'Привіт! Я поруч, щоб допомогти тобі скласти НМТ на омріяні 190+ без стресу. Обери мій характер або натисни кнопку нижче!',
          btnVoice: 'Послухати голос Панди',
          btnVoiceStop: 'Зупинити озвучення',
          btnChat: 'Відкрити чат'
        },
        calc: {
          badge: '📊 Офіційні коефіцієнти УЦОЯО 2024–2025',
          title: 'Калькулятор шансів вступу та прогнозу НМТ',
          desc: 'Дізнайся свій точний конкурсний бал для топових університетів України. Пересувай повзунки балів та дивись розрахунок шансів на бюджет у реальному часі.',
          uniLabel: 'Цільовий університет:',
          specLabel: 'Спеціальність (Коефіцієнти):',
          lblUkr: '🇺🇦 Українська мова:',
          lblMath: '📐 Математика:',
          lblHist: '🏛 Історія України:',
          lblFourth: '🇬🇧 Англійська мова (4-й предмет):',
          kbResult: 'Прогнозований конкурсний бал (КБ)',
          kbSub: 'з урахуванням коефіцієнтів обраної спеціальності',
          chanceLabel: 'Шанс потрапляння на бюджет:',
          statusHigh: '⚡ Високий шанс на бюджет',
          recText: 'Для 100% гарантії бюджету рекомендуємо підтягнути <strong>Історію України</strong> на +8 балів за допомогою тренажера помилок.',
          saveTarget: 'Зберегти як ціль та скласти план з Пандою',
          nmtFullLink: 'Пройти повний пробний тест НМТ →'
        },
        modules: {
          badge: '🏛 Повноцінна екосистема навчання',
          title: '5 інтегрованих модулів StrictAI',
          desc: 'Жодних розрізнених додатків чи хаотичних чатів. Кожен модуль взаємодіє зі спільним профілем учня та базою знань.',
          cardTutorTitle: 'AI-Репетитор Червона Панда',
          cardTutorDesc: '5 унікальних характерів під будь-який настрій. Панда не видає готові відповіді для списування — вона використовує сократичний діалог, направляє запитаннями та пояснює кожен крок розв’язку. Голосове введення, озвучення та жива міміка.',
          cardTutorCta: 'Перейти до уроку →',
          cardNmtTitle: 'Тренажер НМТ',
          cardNmtDesc: 'Повна імітація реального тестування: таймер зворотного відліку, шкала 100–200 балів, банк актуальних завдань та генератор аналогічних прикладів на помилки.',
          cardNmtCta: 'Тест →',
          cardTrackerTitle: 'Контроль фокусу & Помодоро',
          cardTrackerDesc: 'Детекція зміни вкладок браузера в режимі реального часу. Якщо учень відволікається на соцмережі — сесія переривається, а Панда видає суворе попередження.',
          cardTrackerCta: 'Трекер →',
          cardKnowledgeTitle: 'Карта знань 5–11 класів',
          cardKnowledgeDesc: 'Інтерактивна матриця тем з Математики, Мови, Історії та Англійської. Автоматичне підсвічування прогалин та адресне направлення на повторення.',
          cardKnowledgeCta: 'Карта →',
          cardParentsTitle: 'Батьківський кабінет & Контракт',
          cardParentsDesc: 'Захист PIN-кодом, тижневий договір мотивації («Нагорода за досягнення мети»), спостереження за реальними хвилинами занять без порушення довіри.',
          cardParentsCta: 'Кабінет →',
          activePersonaLabel: 'Обраний характер:'
        },
        compare: {
          badge: '⚖️ Чесне порівняння підходів',
          title: 'Чому StrictAI перевершує звичайні рішення',
          desc: 'Ми поєднали терплячість індивідуального репетитора, доступність ШІ та залізну дисципліну контролю відволікань.',
          thCriteria: 'Критерій порівняння',
          thStrict: 'StrictAI («Панда-репетитор») 🐼',
          thTutor: 'Звичайний репетитор 👩‍🏫',
          thBot: 'Звичайний чат-бот 🤖',
          rowCost: 'Вартість підготовки',
          rowCostStrict: 'Доступно кожному учню',
          rowCostTutor: 'Від 4 000 до 12 000 ₴/міс',
          rowCostBot: 'Безкоштовно / підписка',
          rowAvail: 'Доступність 24/7 без запізнень',
          rowAvailStrict: 'Завжди на зв’язку в будь-який час',
          rowAvailTutor: 'Тільки за розкладом 1-2 рази/тижд',
          rowAvailBot: 'Цілодобово',
          rowAvatar: 'Цифровий аватар та емоції',
          rowAvatarStrict: 'Жива Червона Панда з 5 характерами',
          rowAvatarTutor: 'Жива людина (інколи втомлена)',
          rowAvatarBot: 'Сухе текстове полотно без душі',
          rowTabs: 'Контроль відволікань та вкладок',
          rowTabsStrict: 'Залізна детекція перемикання вкладок',
          rowTabsTutor: 'Не бачить екран учня онлайн',
          rowTabsBot: 'Відсутній будь-який контроль',
          rowNmt: 'Програма НМТ та база УЦОЯО',
          rowNmtStrict: 'Офіційні коефіцієнти та тести 2024–2025',
          rowNmtTutor: 'Залежить від кваліфікації',
          rowNmtBot: 'Галюцинує, плутає програму МОН',
          rowSocrates: 'Захист від списання (Метод Сократа)',
          rowSocratesStrict: 'Покроково веде до відповіді учня',
          rowSocratesTutor: 'Пояснює хід думок',
          rowSocratesBot: 'Одразу дає готову відповідь',
          rowParents: 'Батьківський кабінет & Контракт',
          rowParentsStrict: 'PIN-код, прозорий час та винагороди',
          rowParentsTutor: 'Суб’єктивні короткі дзвінки',
          rowParentsBot: 'Немає батьківського доступу',
          rowGame: 'Гейміфікація та мотивація',
          rowGameStrict: 'Бамбук-коїни, стрік днів, аксесуари',
          rowGameTutor: 'Зазвичай нудні домашні завдання',
          rowGameBot: 'Відсутня гейміфікація'
        },
        wardrobe: {
          badge: '🎋 Гардероб Червоної Панди',
          title: 'Навчайся, заробляй бамбук та прокачуй аватар',
          desc: 'За кожні 25 хвилин чесної фокус-сесії без перемикання вкладок та за кожну правильно розібрану помилку ти отримуєш Бамбук-коїни (🎋). Відкривай нові аксесуари та змінюй вигляд своєї Панди!',
          glasses: '👓 Окуляри професора',
          band: '🔥 Пов’язка сенсея',
          cap: '🎓 Шапочка випускника',
          none: '🌿 Без аксесуарів',
          btnRoom: 'Перейти до кімнати репетитора',
          balance: 'Поточний баланс:'
        },
        footer: {
          brandDesc: 'Панда-репетитор: адаптивна підготовка до НМТ 2025 за програмою УЦОЯО, гейміфікація та залізна концентрація уваги.',
          uaBadge: 'Розроблено для українських випускників',
          colNav: 'Навігація',
          colPersonas: 'Характери репетитора',
          colSecurity: 'Безпека та конфіденційність',
          copyright: '© 2025–2026 StrictAI EdTech Platform. Всі права захищено.',
          version: 'Версія 1.0 (Release Candidate)',
          zeroBuild: 'Zero Build Step Architecture'
        }
      },

      tutor: {
        heroTitle: 'Панда-репетитор',
        heroSub: 'Вчіть мови, шкільні предмети та готуйтесь до НМТ у розмові з AI-репетитором',
        tabLanguages: 'Мови',
        tabSchool: 'Предмети НМТ та Школа',
        lblLanguage: 'Мова',
        lblLevel: 'Рівень',
        lblSubject: 'Предмет',
        lblGoal: 'Клас / Мета',
        personaTitle: 'Характер репетитора',
        personaSub: 'Оберіть, як саме вас навчатимуть',
        personaLocked: 'Зафіксовано батьківським контролем: <b>Суворий викладач</b>',
        btnVoice: 'Озвучення',
        btnVoiceFemale: 'Жіночий голос',
        btnVoiceMale: 'Чоловічий голос',
        btnNewLesson: 'Новий урок',
        btnWhiteboard: 'Дошка / Чернетка',
        welcomeTitle: 'Готові до продуктивного уроку?',
        welcomeDesc: 'Оберіть мову або предмет, рівень і характер у лівій панелі, а потім натисніть кнопку, щоб розпочати живе навчання з Пандою!',
        btnStartLesson: 'Почати урок',
        featSocratic: '✨ Сократівський метод',
        featVoice: '🎤 Голосовий ввід',
        featBamboo: '🎋 Бамбук-винагороди',
        featNoDistract: '🔒 Без відволікань',
        chipExercise: 'Дай вправу',
        chipExplainRule: 'Поясни правило',
        chipConversation: 'Поговорімо',
        chipCheckText: 'Перевір текст',
        chipBlitz: 'Бліц до НМТ',
        chipSocraticHint: 'Підказка (Сократ)',
        inputPlaceholder: 'Напишіть відповідь або натисніть швидку дію вище...',
        btnSend: 'Надіслати',
        wbTitle: 'Дошка знань та чернетка',
        wbScratchpadTitle: 'Твоя чернетка до завдання',
        wbClear: 'Очистити чернетку',
        wbCopy: 'Копіювати в чат',
        statusReady: 'Панда готова до уроку',
        modeLanguages: 'Мови',
        modeSchool: 'Предмети НМТ'
      },

      nmt: {
        heroBadge: '🎯 Офіційна сертифікація УЦОЯО',
        heroTitle: 'Симулятор НМТ та Іспитів',
        heroDesc: 'Перевір свій рівень у бойових умовах, максимально наближених до реального національного мультипредметного тесту. Завдання оновлено за чинними програмами МОН, включено офіційні довідкові матеріали та переведення у шкалу 100–200 балів.',
        formatTitle: '1. Оберіть формат тестування:',
        modeFull: 'Повний блок НМТ (120 хв)',
        modeSubject: 'Предметний тренажер (15–30 хв)',
        modeExpress: 'Експрес-діагностика (5 завдань)',
        subjectTitle: '2. Оберіть навчальний предмет:',
        subjAll: 'Всі предмети (Комплексний)',
        subjUkr: 'Українська мова',
        subjMath: 'Математика',
        subjHist: 'Історія України',
        subjEng: 'Англійська мова',
        timerModeTitle: '3. Режим контролю часу (Антистрес-ергономіка):',
        timerClassic: 'Класичний таймер',
        timerClassicDesc: 'Зворотний відлік хвилин і секунд',
        timerZen: 'Прихована лінія (Zen)',
        timerZenDesc: 'Жодних панічних секунд — спокійний фокус',
        timerStrict: 'Суворий екзаменатор',
        timerStrictDesc: 'Аудіо-тіки та контроль кожної хвилини',
        btnStartExam: 'Розпочати тестування',
        pastAttempts: 'Історія твоїх спроб НМТ',
        syncProfile: 'Дані синхронізовано з профілем',
        btnPrev: 'Попереднє',
        btnNext: 'Наступне',
        btnClearChoice: 'Очистити вибір',
        btnFlag: 'Позначити прапорцем',
        btnFlagActive: 'Прапорець активний',
        btnSubmitExam: 'Завершити тест та отримати бал',
        matrixTitle: 'Карта завдань',
        answered: 'Дано відповідь',
        flagged: 'Прапорець 🚩',
        skipped: 'Пропущено',
        resultsHeadline: 'Вітаємо із завершенням тесту!',
        resultsSub: 'Результат збережено у твоєму персональному профілі. Переглянь розгорнуту аналітику та розбери кожну проблемну тему з ШІ-репетитором.',
        scaledScoreLabel: 'Рейтинговий бал НМТ',
        metricAccuracy: 'Точність відповідей',
        metricMistakes: 'Кількість помилок',
        metricTime: 'Витрачений час',
        metricCoins: 'Зароблено бамбук-коїнів',
        btnRetake: 'Скласти інший варіант',
        reviewTitle: 'Детальний розбір відповідей',
        refMaterialsTitle: 'Офіційні довідкові матеріали УЦОЯО',
        refMaterialsSub: 'Дозволені формули та довідники для сертифікаційної роботи',
        scratchpadTitle: 'Інтерактивна чернетка для розв\'язків',
        scratchpadSub: 'Твої чорнові нотатки та проміжні обчислення',
        filterAll: 'Всі завдання',
        filterMistakes: 'Лише помилки ❌',
        filterCorrect: 'Правильні ✅'
      },

      tracker: {
        heroProtocol: 'Strict Focus Protocol • Анти-чит контроль',
        heroTitle: 'Програма-Трекер навчального процесу',
        heroSub: 'Залізна концентрація на уроці: розумний таймер блокує відволікання, фіксує кожен вихід зі вкладки та автоматично нараховує бамбук-коїни за чесну роботу.',
        topFocus: 'Фокус сьогодні',
        topSwitches: 'Зміна вкладок',
        topCoins: 'Коїни за сесії',
        moduleTitle: 'Центральний модуль сесії',
        statusReady: 'Готовий до старту',
        statusActive: 'Сесія активна',
        statusPaused: 'Пауза',
        modeSelectTitle: '1. Оберіть режим фокус-сесії:',
        mode1: 'Помодоро Спринт',
        mode1Time: '25 хвилин',
        mode2: 'Глибоке занурення',
        mode2Time: '45 хвилин',
        mode3: 'Марафон НМТ',
        mode3Time: '60 хвилин',
        subjectSelectTitle: '2. Оберіть навчальний предмет:',
        btnStart: 'Почати фокус-сесію',
        btnPause: 'Пауза',
        btnResume: 'Продовжити',
        btnFinish: 'Завершити та зберегти',
        btnTestBlur: 'Тест детектора відволікання',
        questsTitle: 'Щоденний план та Квести',
        questsSub: 'Виконуй завдання та збирай бамбук 🎋',
        inputNewQuest: 'Додати власну навчальну ціль на сьогодні...',
        btnAddQuest: 'Додати квест',
        logTitle: 'Журнал дисципліни сесії',
        btnClearLog: 'Очистити',
        chartTitle: 'Графік за 7 днів (Пн–Нд)',
        chartNorm: 'Норма: 90 хв/день',
        chartTotal: 'Всього за тиждень:',
        parentsLink: 'Детальний звіт у кабінеті батьків ↗',
        supervisorTitle: 'Живий наглядач уроку',
        supervisorVoiceBtn: '🔊 Озвучити',
        supervisorStrictLock: '🔒 Батьківський контроль активний: Увімкнено примусовий режим «Суворий викладач».'
      },

      parents: {
        authTitle: 'Батьківський контроль',
        authSub: 'Вхід захищено PIN-кодом для збереження конфіденційності налаштувань та аналітики.',
        demoHint: 'Демо-доступ для перевірки:',
        defaultPin: 'За замовчуванням PIN: 1234',
        btnAutofill: '⚡ Ввести 1234',
        dashTitle: 'Аналітичний дашборд успішності',
        dashSub: 'Об\'єктивна картина підготовки без гіперопіки та сварок: прогрес за темами НМТ, час фокусу та спільний освітній контракт.',
        btnChangePin: '🔑 Змінити PIN',
        btnLock: '🔒 Вийти',
        cardReadinessTitle: 'Готовність до НМТ 2025',
        cardDisciplineTitle: 'Індекс дисципліни',
        cardWeakTopicsTitle: 'Слабкі теми учня',
        panelStrictTitle: 'Панель контролю строгості',
        panelStrictDesc: 'Керуйте параметрами нагляду за дитиною. Зміни застосовуються миттєво для всіх модулів платформи.',
        lockPersonaLabel: '🔒 Примусовий режим «Суворий викладач»',
        lockPersonaDesc: 'Блокує можливість дитини змінити характер репетитора на занадто м\'який або жартівливий перед НМТ.',
        dailyNormLabel: 'Денна норма фокусу:',
        tabLimitLabel: 'Ліміт відволікань вкладки під час сесії:',
        soundAlertLabel: '🔊 Звуковий сигнал при втраті фокусу',
        soundAlertDesc: 'Гучний попереджувальний сигнал через динаміки, якщо дитина відкриває YouTube або ігри під час уроку.',
        tgDigestLabel: '📱 Щотижневі дайджести в Telegram',
        tgDigestDesc: 'Щонеділі о 20:00 бот надсилає структурований звіт про бали, хвилини фокусу та теми, що потребують уваги.',
        btnPreviewTg: 'Переглянути приклад тижневого звіту для батьків',
        contractTitle: 'Освітній контракт',
        contractDesc: 'Контракт замінює моралізаторство прозорою угодою: ви фіксуєте мету та бажану винагороду дитини, а StrictAI фіксує прогрес виконання.',
        contractNameLabel: 'Назва контракту / Спринт:',
        contractTargetMins: 'Ціль фокусу (хв/тиждень):',
        contractTargetScore: 'Цільовий сер. бал НМТ:',
        contractRewardLabel: '🎁 Винагорода від батьків за виконання:',
        contractProgressLabel: 'Поточний прогрес виконання:',
        btnSaveContract: 'Зберегти умови контракту',
        modalTgTitle: '📱 Прев\'ю тижневого дайджесту для батьків',
        modalTgCopy: '📋 Скопіювати текст звіту'
      },

      knowledge: {
        profTarget: 'Ціль на НМТ 2025',
        btnEditProfile: '✏️ Редагувати профіль',
        btnDojo: '🎋 Додзьо Панди (Магазин скінів)',
        mapTitle: 'Інтерактивна Карта знань',
        mapSub: 'Дерево тем шкільної програми та обов\'язкових модулів НМТ УЦОЯО',
        searchPlaceholder: '🔍 Пошук за назвою теми чи правилом...',
        totalMastery: 'Загальне засвоєння програми',
        statMastered: 'Опановані теми (🟢)',
        statProgress: 'В процесі вивчення (🟡)',
        statAttention: 'Потребують уваги (🔴)',
        allSubjects: 'Всі предмети',
        allLevels: 'Всі рівні',
        filterMastered: '🟢 Опановано',
        filterProgress: '🟡 В процесі',
        filterAttention: '🔴 Потребує уваги',
        journalTitle: 'Журнал помилок (Робота над помилками)',
        journalSub: 'Усі завдання, де траплялися неточності під час тестувань, зібрані тут для повторення з Пандою.',
        btnClearMastered: '🗑️ Очистити засвоєні',
        dojoTitle: 'Додзьо Панди — Гардероб аватара',
        dojoSub: 'Купуй унікальні аксесуари за чесно зароблені бамбук-коїни',
        dojoCatalog: 'Каталог спорядження:',
        editProfileTitle: 'Редагування цілей та даних учня',
        editNameLabel: 'Прізвище та ім\'я учня:',
        editGradeLabel: 'Клас або навчальний заклад:',
        editUniLabel: 'Цільовий університет (ЗВО):',
        editSpecLabel: 'Спеціальність мрії:',
        editScoreLabel: 'Цільовий бал НМТ (100–200):',
        btnSaveProfile: 'Зберегти зміни'
      }
    },

    // =========================================================================
    // 🇬🇧 ENGLISH
    // =========================================================================
    en: {
      nav: {
        home: 'Home',
        tutor: 'AI Tutor',
        nmt: 'NMT Simulator',
        tracker: 'Control & Focus',
        parents: 'Parents Hub',
        knowledge: 'Knowledge Map',
        themeDark: 'Dark (Deep Indigo)',
        themeLight: 'Paper (Reading Mode)',
        themeToggle: 'Toggle theme (Dark / Warm Paper for reading)',
        streakTitle: 'Your current daily study streak',
        streakDays: 'd.',
        bambooTitle: 'Bamboo coins for focus and solved tasks',
        apiKey: 'AI Key',
        apiKeyTitle: 'AI provider settings (Gemini / OpenAI / Groq)',
        sessionBadge: 'Active focus session! Click to return to timer',
        menuAria: 'Open menu',
        langSelect: 'Interface Language',
        langModalTitle: 'Select Platform Language'
      },

      focusAlert: {
        title: 'Warning! Distraction detected!',
        sub: 'Return to your study! Session tab switches: {switches}.',
        toast: '⚠️ Panda noticed a distraction! Focus session is active. Tab switch recorded.',
        close: '✕'
      },

      apiModal: {
        title: '⚙️ AI Provider Settings',
        desc: 'StrictAI operates both in autonomous practice mode and connected to your chosen neural network for personal tutoring. The key is stored exclusively locally in your browser.',
        selectProvider: 'Select AI Provider:',
        keyLabel: 'API Key:',
        keyHintGemini: 'Get Google AI Studio Key ↗',
        keyHintOpenAI: 'Get OpenAI Key ↗',
        keyHintGroq: 'Get GroqCloud Key ↗',
        keyPlaceholder: 'Enter AIzaSy... or sk-...',
        privacy: '🔒 Privacy guaranteed: the key is never sent to third-party StrictAI servers and is used only for direct requests to the selected provider.',
        cancel: 'Cancel',
        save: 'Save Settings',
        success: 'Settings saved! Provider: {provider}'
      },

      personas: {
        friend: {
          name: 'Kind Friend',
          tagline: 'Gentle support, zero pressure, and patient explanations',
          desc: 'Supports and praises every single step',
          badge: 'Patient',
          greeting: 'Hi! I\'m here to help you master any topic completely stress-free. Where shall we start today?'
        },
        strict: {
          name: 'Strict Teacher',
          tagline: 'Ironclad discipline, precise phrasing, zero slacking',
          desc: 'Demanding, corrects every single mistake',
          badge: 'No Excuses',
          greeting: 'Greetings. Time until NMT is ticking away. No excuses and no extra tabs! Focus and justify your answer.'
        },
        joker: {
          name: 'Joker',
          tagline: 'Memes, humorous analogies, and learning with a smile',
          desc: 'Explains with humor and clever memes',
          badge: 'Witty',
          greeting: 'Oh, hello! They say the granite of science tastes better than fresh bamboo shoots. Let\'s conquer these formulas so smoothly that the exam board weeps with joy!'
        },
        motivator: {
          name: 'Motivator',
          tagline: 'Winner\'s drive, focus on tuition-free spots, and a 200 score target',
          desc: 'Challenges you and celebrates wins',
          badge: '200 Score Drive',
          greeting: 'Eyes on the prize! You can do so much more than you think. Every solved test is your leap toward your dream university! Let\'s go!'
        },
        calm: {
          name: 'Calm Mentor',
          tagline: 'Zen approach, structure, systemic thinking, and confidence',
          desc: 'Patiently, step by step, unhurried',
          badge: 'Zen',
          greeting: 'Take a calm deep breath. The complex becomes elementary when broken down into sequential steps. Let us begin slowly and mindfully.'
        }
      },

      index: {
        hero: {
          badge: 'Next-Gen AI Tutor',
          titleHtml: 'Your Personal Tutor with <span>Ironclad Discipline</span>',
          subtitle: 'We are the first Ukrainian EdTech AI service with our own interactive Red Panda digital avatar. Panda adapts to your personality, explains every mistake step-by-step according to the official curriculum, and prevents procrastination during lessons.',
          btnTutor: 'Start Lesson with Panda',
          btnNmt: 'NMT 2025 Simulator',
          statPredicted: 'Avg. predicted score',
          statBudget: 'Tuition-free admissions',
          statCheating: 'Chance of cheating in social media',
          statPersonas: 'Unique AI personas',
          bubble: 'Hi! I\'m here to help you ace your NMT with 190+ points stress-free. Choose my personality or click the button below!',
          btnVoice: 'Listen to Panda\'s Voice',
          btnVoiceStop: 'Stop Voice Audio',
          btnChat: 'Open Chat'
        },
        calc: {
          badge: '📊 Official UCEQA Coefficients 2024–2025',
          title: 'Admission Odds & NMT Prediction Calculator',
          desc: 'Find out your exact competitive score for top universities in Ukraine. Move the score sliders and see real-time calculation of your chances for a state-funded spot.',
          uniLabel: 'Target University:',
          specLabel: 'Specialty (Coefficients):',
          lblUkr: '🇺🇦 Ukrainian Language:',
          lblMath: '📐 Mathematics:',
          lblHist: '🏛 History of Ukraine:',
          lblFourth: '🇬🇧 English Language (4th Subject):',
          kbResult: 'Predicted Competitive Score (CS)',
          kbSub: 'considering selected specialty coefficients',
          chanceLabel: 'Chance of tuition-free admission:',
          statusHigh: '⚡ High Chance for State-Funded Spot',
          recText: 'For a 100% guarantee of admission, we recommend improving <strong>History of Ukraine</strong> by +8 points using the mistake reviewer.',
          saveTarget: 'Save as Goal & Create Plan with Panda',
          nmtFullLink: 'Take full practice NMT test →'
        },
        modules: {
          badge: '🏛 Full Learning Ecosystem',
          title: '5 Integrated Modules of StrictAI',
          desc: 'No disconnected apps or chaotic chats. Every module communicates with a unified student profile and knowledge base.',
          cardTutorTitle: 'AI Tutor Red Panda',
          cardTutorDesc: '5 unique personalities for every mood. Panda never hands out cheat answers — she uses Socratic dialogue, guides with insightful questions, and explains every problem step-by-step. Voice input, synthesis, and lively expressions.',
          cardTutorCta: 'Go to Lesson →',
          cardNmtTitle: 'NMT Practice Simulator',
          cardNmtDesc: 'Full simulation of the actual exam: countdown timer, 100–200 scale, updated question bank, and generator of similar tasks for mistakes.',
          cardNmtCta: 'Test →',
          cardTrackerTitle: 'Focus Control & Pomodoro',
          cardTrackerDesc: 'Real-time tab-switching detection. If a student drifts to social media, the session pauses and Panda issues a strict warning.',
          cardTrackerCta: 'Tracker →',
          cardKnowledgeTitle: 'Knowledge Map Grades 5–11',
          cardKnowledgeDesc: 'Interactive topic matrix for Math, Language, History, and English. Automatic gap highlighting and targeted review guidance.',
          cardKnowledgeCta: 'Map →',
          cardParentsTitle: 'Parents Hub & Contract',
          cardParentsDesc: 'PIN-code protection, weekly motivation agreement (\'Reward for achieving goal\'), tracking authentic study minutes without breaking trust.',
          cardParentsCta: 'Hub →',
          activePersonaLabel: 'Selected Persona:'
        },
        compare: {
          badge: '⚖️ Fair Comparison of Approaches',
          title: 'Why StrictAI Outperforms Conventional Solutions',
          desc: 'We combined the patience of an individual tutor, AI accessibility, and ironclad anti-distraction discipline.',
          thCriteria: 'Comparison Criterion',
          thStrict: 'StrictAI (Panda Tutor) 🐼',
          thTutor: 'Conventional Tutor 👩‍🏫',
          thBot: 'Generic Chatbot 🤖',
          rowCost: 'Preparation Cost',
          rowCostStrict: 'Affordable for every student',
          rowCostTutor: 'From 4 000 to 12 000 ₴/month',
          rowCostBot: 'Free / subscription',
          rowAvail: '24/7 Availability without delays',
          rowAvailStrict: 'Always online at any time',
          rowAvailTutor: 'Strict schedule 1-2 times/week',
          rowAvailBot: '24/7 round the clock',
          rowAvatar: 'Digital Avatar & Emotions',
          rowAvatarStrict: 'Interactive Red Panda with 5 personas',
          rowAvatarTutor: 'Real human (sometimes tired)',
          rowAvatarBot: 'Dry text canvas with no soul',
          rowTabs: 'Tab-Switching & Distraction Guard',
          rowTabsStrict: 'Ironclad tab-switch detection',
          rowTabsTutor: 'Cannot see student screen online',
          rowTabsBot: 'Zero distraction supervision',
          rowNmt: 'Official NMT Curriculum & Standards',
          rowNmtStrict: 'Official 2024–2025 coefficients and tests',
          rowNmtTutor: 'Depends on qualification',
          rowNmtBot: 'Hallucinates, mixes curricula',
          rowSocrates: 'Cheating Prevention (Socratic Method)',
          rowSocratesStrict: 'Guides step-by-step to the student\'s own answer',
          rowSocratesTutor: 'Explains reasoning process',
          rowSocratesBot: 'Instantly provides ready answers',
          rowParents: 'Parents Hub & Educational Contract',
          rowParentsStrict: 'PIN code, transparent study hours & rewards',
          rowParentsTutor: 'Subjective brief phone calls',
          rowParentsBot: 'No parental portal whatsoever',
          rowGame: 'Gamification & Motivation',
          rowGameStrict: 'Bamboo coins, day streaks, wardrobe items',
          rowGameTutor: 'Usually boring homework drills',
          rowGameBot: 'No gamification at all'
        },
        wardrobe: {
          badge: '🎋 Red Panda Wardrobe',
          title: 'Study, Earn Bamboo, and Level Up Your Avatar',
          desc: 'For every 25 minutes of genuine focus without tab switching and every correctly reviewed mistake, you earn Bamboo Coins (🎋). Unlock new accessories and style your Panda!',
          glasses: '👓 Professor\'s Glasses',
          band: '🔥 Sensei Headband',
          cap: '🎓 Graduation Cap',
          none: '🌿 No Accessories',
          btnRoom: 'Go to Tutor Room',
          balance: 'Current balance:'
        },
        footer: {
          brandDesc: 'Panda Tutor: adaptive preparation for NMT 2025 following official standards, gamification, and ironclad focus.',
          uaBadge: 'Crafted for Ukrainian graduates',
          colNav: 'Navigation',
          colPersonas: 'Tutor Personas',
          colSecurity: 'Security & Privacy',
          copyright: '© 2025–2026 StrictAI EdTech Platform. All rights reserved.',
          version: 'Version 1.0 (Release Candidate)',
          zeroBuild: 'Zero Build Step Architecture'
        }
      },

      tutor: {
        heroTitle: 'Panda Tutor',
        heroSub: 'Learn languages, school subjects, and prepare for NMT in conversation with an AI tutor',
        tabLanguages: 'Languages',
        tabSchool: 'NMT Subjects & School',
        lblLanguage: 'Language',
        lblLevel: 'Level',
        lblSubject: 'Subject',
        lblGoal: 'Grade / Goal',
        personaTitle: 'Tutor Persona',
        personaSub: 'Choose how you want to be taught',
        personaLocked: 'Locked by Parental Control: <b>Strict Teacher</b>',
        btnVoice: 'Voice Audio',
        btnVoiceFemale: 'Female Voice',
        btnVoiceMale: 'Male Voice',
        btnNewLesson: 'New Lesson',
        btnWhiteboard: 'Board / Scratchpad',
        welcomeTitle: 'Ready for a Productive Lesson?',
        welcomeDesc: 'Choose language or subject, level, and persona in the left sidebar, then click the button to start interactive study with Panda!',
        btnStartLesson: 'Start Lesson',
        featSocratic: '✨ Socratic Method',
        featVoice: '🎤 Voice Input',
        featBamboo: '🎋 Bamboo Rewards',
        featNoDistract: '🔒 Zero Distractions',
        chipExercise: 'Give Exercise',
        chipExplainRule: 'Explain Rule',
        chipConversation: 'Let\'s Talk',
        chipCheckText: 'Check My Text',
        chipBlitz: 'NMT Blitz',
        chipSocraticHint: 'Hint (Socrates)',
        inputPlaceholder: 'Write your answer or click a quick action above...',
        btnSend: 'Send',
        wbTitle: 'Knowledge Board & Scratchpad',
        wbScratchpadTitle: 'Your Task Scratchpad',
        wbClear: 'Clear Scratchpad',
        wbCopy: 'Copy to Chat',
        statusReady: 'Panda is ready for the lesson',
        modeLanguages: 'Languages',
        modeSchool: 'NMT Subjects'
      },

      nmt: {
        heroBadge: '🎯 Official UCEQA Standards',
        heroTitle: 'NMT & Exam Simulator',
        heroDesc: 'Test your skills in exam conditions mirroring the actual National Multi-Subject Test. Updated with current official curricula, reference formulas, and scaled 100–200 grading.',
        formatTitle: '1. Choose testing format:',
        modeFull: 'Full NMT Block (120 min)',
        modeSubject: 'Subject Practice (15–30 min)',
        modeExpress: 'Express Diagnostics (5 tasks)',
        subjectTitle: '2. Choose subject:',
        subjAll: 'All Subjects (Comprehensive)',
        subjUkr: 'Ukrainian Language',
        subjMath: 'Mathematics',
        subjHist: 'History of Ukraine',
        subjEng: 'English Language',
        timerModeTitle: '3. Timer control mode (Anti-stress ergonomics):',
        timerClassic: 'Classic Timer',
        timerClassicDesc: 'Countdown of minutes and seconds',
        timerZen: 'Hidden Line (Zen)',
        timerZenDesc: 'No panic seconds — calm focus',
        timerStrict: 'Strict Examiner',
        timerStrictDesc: 'Audio ticks and minute-by-minute monitoring',
        btnStartExam: 'Start Exam',
        pastAttempts: 'Your Past NMT Attempts',
        syncProfile: 'Data synced with profile',
        btnPrev: 'Previous',
        btnNext: 'Next',
        btnClearChoice: 'Clear Choice',
        btnFlag: 'Flag for Review',
        btnFlagActive: 'Flagged Active',
        btnSubmitExam: 'Finish Test & Get Score',
        matrixTitle: 'Question Matrix',
        answered: 'Answered',
        flagged: 'Flagged 🚩',
        skipped: 'Skipped',
        resultsHeadline: 'Congratulations on Finishing the Test!',
        resultsSub: 'Result saved to your profile. Review detailed analytics and work through every challenging topic with the AI tutor.',
        scaledScoreLabel: 'Scaled NMT Score',
        metricAccuracy: 'Answer Accuracy',
        metricMistakes: 'Mistakes Count',
        metricTime: 'Time Spent',
        metricCoins: 'Bamboo Coins Earned',
        btnRetake: 'Take Another Variant',
        reviewTitle: 'Detailed Answers Breakdown',
        refMaterialsTitle: 'Official UCEQA Reference Materials',
        refMaterialsSub: 'Authorized formulas and cheat sheets for certification exams',
        scratchpadTitle: 'Interactive Task Scratchpad',
        scratchpadSub: 'Your draft notes and intermediate equations',
        filterAll: 'All Tasks',
        filterMistakes: 'Mistakes Only ❌',
        filterCorrect: 'Correct Only ✅'
      },

      tracker: {
        heroProtocol: 'Strict Focus Protocol • Anti-Cheat Monitor',
        heroTitle: 'Study Process Tracker',
        heroSub: 'Ironclad focus during lessons: smart timer blocks distractions, detects every tab switch, and awards bamboo coins for genuine study.',
        topFocus: 'Focus Today',
        topSwitches: 'Tab Switches',
        topCoins: 'Session Coins',
        moduleTitle: 'Central Session Module',
        statusReady: 'Ready to Start',
        statusActive: 'Session Active',
        statusPaused: 'Paused',
        modeSelectTitle: '1. Select focus session mode:',
        mode1: 'Pomodoro Sprint',
        mode1Time: '25 minutes',
        mode2: 'Deep Dive',
        mode2Time: '45 minutes',
        mode3: 'NMT Marathon',
        mode3Time: '60 minutes',
        subjectSelectTitle: '2. Select study subject:',
        btnStart: 'Start Focus Session',
        btnPause: 'Pause',
        btnResume: 'Resume',
        btnFinish: 'Finish & Save',
        btnTestBlur: 'Test Distraction Detector',
        questsTitle: 'Daily Plan & Quests',
        questsSub: 'Complete quests and gather bamboo 🎋',
        inputNewQuest: 'Add your custom study goal for today...',
        btnAddQuest: 'Add Quest',
        logTitle: 'Session Discipline Log',
        btnClearLog: 'Clear',
        chartTitle: '7-Day Chart (Mon–Sun)',
        chartNorm: 'Goal: 90 min/day',
        chartTotal: 'Total this week:',
        parentsLink: 'Detailed report in Parents Hub ↗',
        supervisorTitle: 'Live Lesson Supervisor',
        supervisorVoiceBtn: '🔊 Speak',
        supervisorStrictLock: '🔒 Parental Control Active: Forced «Strict Teacher» mode.'
      },

      parents: {
        authTitle: 'Parental Control',
        authSub: 'Access is protected by PIN to maintain confidentiality of settings and analytics.',
        demoHint: 'Demo access for testing:',
        defaultPin: 'Default PIN: 1234',
        btnAutofill: '⚡ Enter 1234',
        dashTitle: 'Academic Performance Dashboard',
        dashSub: 'An objective view of preparation without micromanagement or conflict: topic progress, focus hours, and mutual educational contract.',
        btnChangePin: '🔑 Change PIN',
        btnLock: '🔒 Log Out',
        cardReadinessTitle: 'NMT 2025 Readiness',
        cardDisciplineTitle: 'Discipline Index',
        cardWeakTopicsTitle: 'Student\'s Weak Topics',
        panelStrictTitle: 'Strictness Control Panel',
        panelStrictDesc: 'Manage supervision parameters for your child. Changes apply immediately across all platform modules.',
        lockPersonaLabel: '🔒 Forced «Strict Teacher» Mode',
        lockPersonaDesc: 'Prevents the child from switching the tutor personality to overly casual or joking before NMT.',
        dailyNormLabel: 'Daily focus norm:',
        tabLimitLabel: 'Tab switches limit per session:',
        soundAlertLabel: '🔊 Sound alert on focus loss',
        soundAlertDesc: 'Audible loudspeaker alert if the student drifts to YouTube or games during study.',
        tgDigestLabel: '📱 Weekly Telegram Digests',
        tgDigestDesc: 'Every Sunday at 20:00, the bot delivers an organized digest of scores, focus minutes, and attention areas.',
        btnPreviewTg: 'Preview Sample Weekly Report for Parents',
        contractTitle: 'Educational Contract',
        contractDesc: 'The contract replaces lecturing with a transparent agreement: you define the goal and student\'s reward, while StrictAI tracks authentic progress.',
        contractNameLabel: 'Contract Title / Sprint:',
        contractTargetMins: 'Focus Target (min/week):',
        contractTargetScore: 'Target Avg. NMT Score:',
        contractRewardLabel: '🎁 Parents\' reward upon completion:',
        contractProgressLabel: 'Current fulfillment progress:',
        btnSaveContract: 'Save Contract Terms',
        modalTgTitle: '📱 Preview of Weekly Parent Digest',
        modalTgCopy: '📋 Copy Report Text'
      },

      knowledge: {
        profTarget: 'Target Score NMT 2025',
        btnEditProfile: '✏️ Edit Profile',
        btnDojo: '🎋 Panda Dojo (Skins Shop)',
        mapTitle: 'Interactive Knowledge Map',
        mapSub: 'Tree of school curriculum topics and mandatory NMT modules',
        searchPlaceholder: '🔍 Search by topic title or rule...',
        totalMastery: 'Overall Curriculum Mastery',
        statMastered: 'Mastered Topics (🟢)',
        statProgress: 'In Progress (🟡)',
        statAttention: 'Needs Attention (🔴)',
        allSubjects: 'All Subjects',
        allLevels: 'All Levels',
        filterMastered: '🟢 Mastered',
        filterProgress: '🟡 In Progress',
        filterAttention: '🔴 Needs Attention',
        journalTitle: 'Mistakes Journal (Error Review)',
        journalSub: 'All tasks where inaccuracies occurred during tests are gathered here for review with Panda.',
        btnClearMastered: '🗑️ Clear Mastered',
        dojoTitle: 'Panda Dojo — Avatar Wardrobe',
        dojoSub: 'Buy unique accessories with your earned bamboo coins',
        dojoCatalog: 'Equipment Catalog:',
        editProfileTitle: 'Edit Student Goals & Details',
        editNameLabel: 'Student Full Name:',
        editGradeLabel: 'Grade / School:',
        editUniLabel: 'Target University:',
        editSpecLabel: 'Dream Specialty:',
        editScoreLabel: 'Target NMT Score (100–200):',
        btnSaveProfile: 'Save Changes'
      }
    },

    // =========================================================================
    // 🇵🇱 POLISH
    // =========================================================================
    pl: {
      nav: {
        home: 'Główna',
        tutor: 'Korepetytor AI',
        nmt: 'Symulator NMT',
        tracker: 'Kontrola i skupienie',
        parents: 'Strefa Rodzica',
        knowledge: 'Mapa wiedzy',
        themeDark: 'Ciemny (Głębokie Indygo)',
        themeLight: 'Papierowy (Do czytania)',
        themeToggle: 'Zmień motyw (Ciemny / Papierowy do czytania)',
        streakTitle: 'Twoja codzienna passa nauki',
        streakDays: 'dni',
        bambooTitle: 'Monety bambusowe za skupienie i rozwiązane zadania',
        apiKey: 'Klucz AI',
        apiKeyTitle: 'Ustawienia dostawcy AI (Gemini / OpenAI / Groq)',
        sessionBadge: 'Aktywna sesja skupienia! Kliknij, aby wrócić do timera',
        menuAria: 'Otwórz menu',
        langSelect: 'Język interfejsu',
        langModalTitle: 'Wybierz język platformy'
      },

      focusAlert: {
        title: 'Uwaga! Wykryto rozproszenie!',
        sub: 'Wróć do nauki! Przełączeń kart w sesji: {switches}.',
        toast: '⚠️ Panda zauważyła rozproszenie! Sesja skupienia jest aktywna. Przełączenie karty zarejestrowane.',
        close: '✕'
      },

      apiModal: {
        title: '⚙️ Ustawienia dostawcy AI',
        desc: 'Platforma StrictAI działa zarówno w trybie autonomicznego trenażera, jak i z podłączeniem wybranej sieci neuronowej dla osobistego korepetytora. Klucz jest przechowywany wyłącznie lokalnie w przeglądarce.',
        selectProvider: 'Wybierz dostawcę AI:',
        keyLabel: 'Klucz API:',
        keyHintGemini: 'Pobierz klucz Google AI Studio ↗',
        keyHintOpenAI: 'Pobierz klucz OpenAI ↗',
        keyHintGroq: 'Pobierz klucz GroqCloud ↗',
        keyPlaceholder: 'Wprowadź AIzaSy... lub sk-...',
        privacy: '🔒 Gwarancja prywatności: klucz nie jest przesyłany na zewnętrzne serwery StrictAI i służy do bezpośrednich zapytań do wybranego dostawcy.',
        cancel: 'Anuluj',
        save: 'Zapisz ustawienia',
        success: 'Ustawienia zapisane! Dostawca: {provider}'
      },

      personas: {
        friend: {
          name: 'Dobry Przyjaciel',
          tagline: 'Łagodne wsparcie, zero presji i cierpliwe wyjaśnienia',
          desc: 'Wspiera i chwali za każdy krok',
          badge: 'Cierpliwy',
          greeting: 'Cześć! Jestem tutaj, aby pomóc Ci opanować każdy temat bez stresu. Od czego dziś zaczniemy?'
        },
        strict: {
          name: 'Surowy Nauczyciel',
          tagline: 'Żelazna dyscyplina, precyzja sformułowań, zero lenistwa',
          desc: 'Wymagający, poprawia każdy błąd',
          badge: 'Bez ulg',
          greeting: 'Witam. Czas do NMT ucieka. Żadnych wymówek i otwartych innych kart! Skup się i uzasadnij odpowiedź.'
        },
        joker: {
          name: 'Żartowniś',
          tagline: 'Memy, zabawne skojarzenia i nauka z uśmiechem',
          desc: 'Wyjaśnia z humorem i żartami',
          badge: 'Z humorem',
          greeting: 'O, cześć! Mówią, że granit nauki smakuje lepiej niż młody bambus. Rozłożymy te formuły na czynniki pierwsze tak, by komisja płakała ze szczęścia!'
        },
        motivator: {
          name: 'Motywator',
          tagline: 'Energia zwycięzcy, nacisk na studia bezpłatne i cel 200 punktów',
          desc: 'Stawia wyzwania i świętuje sukcesy',
          badge: 'Napęd 200 pkt',
          greeting: 'Wzrok na cel! Potrafisz znacznie więcej, niż myślisz. Każdy rozwiązany test to krok do wymarzonej uczelni! Do boju!'
        },
        calm: {
          name: 'Spokojny Mentor',
          tagline: 'Podejście zen, struktura, myślenie systemowe i pewność siebie',
          desc: 'Cierpliwie, krok po kroku, bez pośpiechu',
          badge: 'Zen',
          greeting: 'Weź głęboki, spokojny oddech. To, co skomplikowane, staje się proste, gdy podzielimy to na kolejne kroki. Zacznijmy powoli i uważnie.'
        }
      },

      index: {
        hero: {
          badge: 'Korepetytor AI nowej generacji',
          titleHtml: 'Twój osobisty korepetytor z <span>żelazną dyscypliną</span>',
          subtitle: 'Jesteśmy pierwszym ukraińskim serwisem edukacyjnym AI z żywym cyfrowym awatarem Czerwonej Pandy. Panda dopasowuje się do Twojego charakteru, wyjaśnia krok po kroku każdy błąd według oficjalnego programu i zapobiega prokrastynacji podczas lekcji.',
          btnTutor: 'Rozpocznij lekcję z Pandą',
          btnNmt: 'Trenażer NMT 2025',
          statPredicted: 'Śr. przewidywany wynik',
          statBudget: 'Przyjęć na studia bezpłatne',
          statCheating: 'Szans na ściąganie w mediach',
          statPersonas: 'Unikalnych osobowości AI',
          bubble: 'Cześć! Jestem tutaj, aby pomóc Ci zdać NMT na wymarzone 190+ punktów bez stresu. Wybierz mój charakter lub kliknij przycisk poniżej!',
          btnVoice: 'Posłuchaj głosu Pandy',
          btnVoiceStop: 'Zatrzymaj dźwięk',
          btnChat: 'Otwórz czat'
        },
        calc: {
          badge: '📊 Oficjalne współczynniki UCEQA 2024–2025',
          title: 'Kalkulator szans na studia i prognozy NMT',
          desc: 'Poznaj swój dokładny wynik rekrutacyjny na czołowe uczelnie Ukrainy. Przesuwaj suwaki ocen i sprawdzaj szanse na studia bezpłatne w czasie rzeczywistym.',
          uniLabel: 'Uczelnia docelowa:',
          specLabel: 'Kierunek (Współczynniki):',
          lblUkr: '🇺🇦 Język ukraiński:',
          lblMath: '📐 Matematyka:',
          lblHist: '🏛 Historia Ukrainy:',
          lblFourth: '🇬🇧 Język angielski (4. przedmiot):',
          kbResult: 'Przewidywany wynik rekrutacyjny (CS)',
          kbSub: 'uwzględniając współczynniki wybranego kierunku',
          chanceLabel: 'Szansa na studia bezpłatne:',
          statusHigh: '⚡ Wysoka szansa na studia bezpłatne',
          recText: 'Dla 100% gwarancji zalecamy podciągnięcie <strong>Historii Ukrainy</strong> o +8 punktów za pomocą analizatora błędów.',
          saveTarget: 'Zapisz jako cel i stwórz plan z Pandą',
          nmtFullLink: 'Przystąp do pełnego testu próbnego NMT →'
        },
        modules: {
          badge: '🏛 Pełny ekosystem nauki',
          title: '5 zintegrowanych modułów StrictAI',
          desc: 'Żadnych oddzielnych aplikacji czy chaotycznych czatów. Każdy moduł współdziała ze wspólnym profilem ucznia i bazą wiedzy.',
          cardTutorTitle: 'Korepetytor AI Czerwona Panda',
          cardTutorDesc: '5 unikalnych osobowości na każdy nastrój. Panda nie daje gotowych odpowiedzi do ściągania — prowadzi dialog sokratyczny, naprowadza pytaniami i wyjaśnia każdy krok rozwiązania. Wprowadzanie głosowe, udźwiękowienie i żywa mimika.',
          cardTutorCta: 'Przejdź do lekcji →',
          cardNmtTitle: 'Trenażer NMT',
          cardNmtDesc: 'Pełna symulacja prawdziwego egzaminu: odliczanie czasu, skala 100–200 punktów, baza aktualnych zadań i generator podobnych przykładów na błędy.',
          cardNmtCta: 'Test →',
          cardTrackerTitle: 'Kontrola skupienia i Pomodoro',
          cardTrackerDesc: 'Wykrywanie zmiany kart przeglądarki w czasie rzeczywistym. Jeśli uczeń rozproszy się w mediach społecznościowych — sesja zostaje przerwana, a Panda udziela surowego ostrzeżenia.',
          cardTrackerCta: 'Tracker →',
          cardKnowledgeTitle: 'Mapa wiedzy klas 5–11',
          cardKnowledgeDesc: 'Interaktywna matryca tematów z matematyki, języka, historii i angielskiego. Automatyczne wyróżnianie luk i ukierunkowane powtórki.',
          cardKnowledgeCta: 'Mapa →',
          cardParentsTitle: 'Strefa Rodzica i Kontrakt',
          cardParentsDesc: 'Ochrona kodem PIN, cotygodniowa umowa motywacyjna («Nagroda za osiągnięcie celu»), monitorowanie rzeczywistego czasu nauki bez naruszania zaufania.',
          cardParentsCta: 'Strefa →',
          activePersonaLabel: 'Wybrana osobowość:'
        },
        compare: {
          badge: '⚖️ Uczciwe porównanie podejść',
          title: 'Dlaczego StrictAI przewyższa tradycyjne rozwiązania',
          desc: 'Połączyliśmy cierpliwość indywidualnego korepetytora, dostępność AI oraz żelazną dyscyplinę kontroli rozproszeń.',
          thCriteria: 'Kryterium porównania',
          thStrict: 'StrictAI (Panda Korepetytor) 🐼',
          thTutor: 'Zwykły korepetytor 👩‍🏫',
          thBot: 'Zwykły chatbot 🤖',
          rowCost: 'Koszt przygotowania',
          rowCostStrict: 'Dostępne dla każdego ucznia',
          rowCostTutor: 'Od 4 000 do 12 000 ₴/mies.',
          rowCostBot: 'Darmowy / subskrypcja',
          rowAvail: 'Dostępność 24/7 bez spóźnień',
          rowAvailStrict: 'Zawsze online o każdej porze',
          rowAvailTutor: 'Tylko wg grafiku 1-2 razy/tydz.',
          rowAvailBot: 'Całodobowo',
          rowAvatar: 'Cyfrowy awatar i emocje',
          rowAvatarStrict: 'Żywa Czerwona Panda z 5 charakterami',
          rowAvatarTutor: 'Żywy człowiek (czasem zmęczony)',
          rowAvatarBot: 'Suchy tekst bez duszy',
          rowTabs: 'Kontrola kart i rozproszeń',
          rowTabsStrict: 'Żelazne wykrywanie zmiany kart',
          rowTabsTutor: 'Nie widzi ekranu ucznia online',
          rowTabsBot: 'Całkowity brak kontroli',
          rowNmt: 'Program NMT i baza UCEQA',
          rowNmtStrict: 'Oficjalne współczynniki i testy 2024–2025',
          rowNmtTutor: 'Zależy od kwalifikacji',
          rowNmtBot: 'Halucynuje, myli programy',
          rowSocrates: 'Ochrona przed ściąganiem (Metoda Sokratejska)',
          rowSocratesStrict: 'Krok po kroku prowadzi do własnej odpowiedzi',
          rowSocratesTutor: 'Wyjaśnia tok myślenia',
          rowSocratesBot: 'Od razu podaje gotową odpowiedź',
          rowParents: 'Strefa Rodzica i Kontrakt',
          rowParentsStrict: 'Kod PIN, przejrzysty czas i nagrody',
          rowParentsTutor: 'Subiektywne krótkie telefony',
          rowParentsBot: 'Brak panelu dla rodziców',
          rowGame: 'Grywalizacja i motywacja',
          rowGameStrict: 'Monety bambusowe, passa dni, akcesoria',
          rowGameTutor: 'Zwykle nudne zadania domowe',
          rowGameBot: 'Brak grywalizacji'
        },
        wardrobe: {
          badge: '🎋 Garderoba Czerwonej Pandy',
          title: 'Ucz się, zdobywaj bambus i ulepszaj awatar',
          desc: 'Za każde 25 minut uczciwego skupienia bez przełączania kart i każdy poprawnie przeanalizowany błąd otrzymujesz Monety Bambusowe (🎋). Odblokowuj nowe akcesoria i zmieniaj wygląd Pandy!',
          glasses: '👓 Okulary profesora',
          band: '🔥 Opaska senseia',
          cap: '🎓 Czapka absolwenta',
          none: '🌿 Bez akcesoriów',
          btnRoom: 'Przejdź do pokoju korepetytora',
          balance: 'Aktualne saldo:'
        },
        footer: {
          brandDesc: 'Panda Korepetytor: adaptacyjne przygotowanie do NMT 2025 według oficjalnych standardów, grywalizacja i żelazne skupienie.',
          uaBadge: 'Stworzone dla ukraińskich absolwentów',
          colNav: 'Nawigacja',
          colPersonas: 'Osobowości korepetytora',
          colSecurity: 'Bezpieczeństwo i prywatność',
          copyright: '© 2025–2026 StrictAI EdTech Platform. Wszelkie prawa zastrzeżone.',
          version: 'Wersja 1.0 (Release Candidate)',
          zeroBuild: 'Architektura Zero Build Step'
        }
      },

      tutor: {
        heroTitle: 'Panda Korepetytor',
        heroSub: 'Ucz się języków, przedmiotów szkolnych i przygotowuj do NMT w rozmowie z korepetytorem AI',
        tabLanguages: 'Języki',
        tabSchool: 'Przedmioty NMT i szkoła',
        lblLanguage: 'Język',
        lblLevel: 'Poziom',
        lblSubject: 'Przedmiot',
        lblGoal: 'Klasa / Cel',
        personaTitle: 'Osobowość korepetytora',
        personaSub: 'Wybierz sposób prowadzenia nauki',
        personaLocked: 'Zablokowane przez kontrolę rodzicielską: <b>Surowy Nauczyciel</b>',
        btnVoice: 'Udźwiękowienie',
        btnVoiceFemale: 'Głos żeński',
        btnVoiceMale: 'Głos męski',
        btnNewLesson: 'Nowa lekcja',
        btnWhiteboard: 'Tablica / Brudnopis',
        welcomeTitle: 'Gotowy na produktywną lekcję?',
        welcomeDesc: 'Wybierz język lub przedmiot, poziom i charakter w lewym panelu, a następnie naciśnij przycisk, aby rozpocząć naukę z Pandą!',
        btnStartLesson: 'Rozpocznij lekcję',
        featSocratic: '✨ Metoda sokratyczna',
        featVoice: '🎤 Wprowadzanie głosowe',
        featBamboo: '🎋 Bambusowe nagrody',
        featNoDistract: '🔒 Bez rozpraszania',
        chipExercise: 'Daj ćwiczenie',
        chipExplainRule: 'Wyjaśnij zasadę',
        chipConversation: 'Porozmawiajmy',
        chipCheckText: 'Sprawdź tekst',
        chipBlitz: 'Błyskawiczny NMT',
        chipSocraticHint: 'Wskazówka (Sokrates)',
        inputPlaceholder: 'Napisz odpowiedź lub wybierz szybkie działanie powyżej...',
        btnSend: 'Wyślij',
        wbTitle: 'Tablica wiedzy i brudnopis',
        wbScratchpadTitle: 'Twój brudnopis do zadania',
        wbClear: 'Wyczyść brudnopis',
        wbCopy: 'Kopiuj do czatu',
        statusReady: 'Panda jest gotowa do lekcji',
        modeLanguages: 'Języki',
        modeSchool: 'Przedmioty NMT'
      },

      nmt: {
        heroBadge: '🎯 Oficjalne standardy UCEQA',
        heroTitle: 'Symulator NMT i egzaminów',
        heroDesc: 'Sprawdź swoje umiejętności w warunkach bojowych zbliżonych do prawdziwego egzaminu NMT. Zadania zaktualizowane według oficjalnych programów, formuły pomocnicze i przeliczenie na skalę 100–200 punktów.',
        formatTitle: '1. Wybierz format testu:',
        modeFull: 'Pełny blok NMT (120 min)',
        modeSubject: 'Trenażer przedmiotowy (15–30 min)',
        modeExpress: 'Ekspresowa diagnoza (5 zadań)',
        subjectTitle: '2. Wybierz przedmiot:',
        subjAll: 'Wszystkie przedmioty (Kompleksowy)',
        subjUkr: 'Język ukraiński',
        subjMath: 'Matematyka',
        subjHist: 'Historia Ukrainy',
        subjEng: 'Język angielski',
        timerModeTitle: '3. Tryb kontroli czasu (Ergonomia antystresowa):',
        timerClassic: 'Klasyczny timer',
        timerClassicDesc: 'Odliczanie minut i sekund',
        timerZen: 'Ukryta linia (Zen)',
        timerZenDesc: 'Bez paniki sekundowej — spokojne skupienie',
        timerStrict: 'Surowy egzaminator',
        timerStrictDesc: 'Tykanie dźwiękowe i kontrola każdej minuty',
        btnStartExam: 'Rozpocznij egzamin',
        pastAttempts: 'Historia Twoich podejść do NMT',
        syncProfile: 'Dane zsynchronizowane z profilem',
        btnPrev: 'Poprzednie',
        btnNext: 'Następne',
        btnClearChoice: 'Wyczyść wybór',
        btnFlag: 'Oznacz flagą',
        btnFlagActive: 'Flaga aktywna',
        btnSubmitExam: 'Zakończ test i odbierz wynik',
        matrixTitle: 'Mapa zadań',
        answered: 'Odpowiedziano',
        flagged: 'Flaga 🚩',
        skipped: 'Pominięte',
        resultsHeadline: 'Gratulacje z okazji ukończenia testu!',
        resultsSub: 'Wynik zapisany w Twoim profilu. Przejrzyj szczegółowe analizy i przeanalizuj każdy problematyczny temat z korepetytorem AI.',
        scaledScoreLabel: 'Wynik rankingowy NMT',
        metricAccuracy: 'Dokładność odpowiedzi',
        metricMistakes: 'Liczba błędów',
        metricTime: 'Poświęcony czas',
        metricCoins: 'Zdobyte monety bambusowe',
        btnRetake: 'Rozwiąż inny wariant',
        reviewTitle: 'Szczegółowa analiza odpowiedzi',
        refMaterialsTitle: 'Materiały pomocnicze UCEQA',
        refMaterialsSub: 'Dozwolone formuły i tablice na egzamin certyfikacyjny',
        scratchpadTitle: 'Interaktywny brudnopis do obliczeń',
        scratchpadSub: 'Twoje notatki robocze i obliczenia',
        filterAll: 'Wszystkie zadania',
        filterMistakes: 'Tylko błędy ❌',
        filterCorrect: 'Tylko poprawne ✅'
      },

      tracker: {
        heroProtocol: 'Strict Focus Protocol • Kontrola anty-cheat',
        heroTitle: 'Program do śledzenia procesu nauki',
        heroSub: 'Żelazna koncentracja na lekcji: inteligentny timer blokuje rozproszenia, rejestruje każde wyjście z karty i przyznaje monety za uczciwą pracę.',
        topFocus: 'Skupienie dzisiaj',
        topSwitches: 'Zmiana kart',
        topCoins: 'Monety za sesje',
        moduleTitle: 'Główny moduł sesji',
        statusReady: 'Gotowy do startu',
        statusActive: 'Sesja aktywna',
        statusPaused: 'Pauza',
        modeSelectTitle: '1. Wybierz tryb sesji skupienia:',
        mode1: 'Sprint Pomodoro',
        mode1Time: '25 minut',
        mode2: 'Głębokie skupienie',
        mode2Time: '45 minut',
        mode3: 'Maraton NMT',
        mode3Time: '60 minut',
        subjectSelectTitle: '2. Wybierz przedmiot nauki:',
        btnStart: 'Rozpocznij sesję skupienia',
        btnPause: 'Pauza',
        btnResume: 'Wznów',
        btnFinish: 'Zakończ i zapisz',
        btnTestBlur: 'Przetestuj detektor rozproszenia',
        questsTitle: 'Plan dnia i zadania',
        questsSub: 'Wykonuj zadania i zbieraj bambus 🎋',
        inputNewQuest: 'Dodaj własny cel naukowy na dziś...',
        btnAddQuest: 'Dodaj zadanie',
        logTitle: 'Dziennik dyscypliny sesji',
        btnClearLog: 'Wyczyść',
        chartTitle: 'Wykres 7-dniowy (Pn–Nd)',
        chartNorm: 'Norma: 90 min/dzień',
        chartTotal: 'Łącznie w tygodniu:',
        parentsLink: 'Szczegółowy raport w Strefie Rodzica ↗',
        supervisorTitle: 'Nadzorca lekcji na żywo',
        supervisorVoiceBtn: '🔊 Odczytaj',
        supervisorStrictLock: '🔒 Kontrola rodzicielska aktywna: Tryb «Surowy Nauczyciel».'
      },

      parents: {
        authTitle: 'Kontrola rodzicielska',
        authSub: 'Dostęp zabezpieczony kodem PIN w celu ochrony prywatności ustawień i analiz.',
        demoHint: 'Dostęp demonstracyjny:',
        defaultPin: 'Domyślny PIN: 1234',
        btnAutofill: '⚡ Wprowadź 1234',
        dashTitle: 'Pulpit analizy postępów w nauce',
        dashSub: 'Obiektywny obraz przygotowań bez nadopiekuńczości: postępy w tematach NMT, czas skupienia i wspólny kontrakt edukacyjny.',
        btnChangePin: '🔑 Zmień PIN',
        btnLock: '🔒 Wyloguj',
        cardReadinessTitle: 'Gotowość do NMT 2025',
        cardDisciplineTitle: 'Wskaźnik dyscypliny',
        cardWeakTopicsTitle: 'Słabe tematy ucznia',
        panelStrictTitle: 'Panel kontroli dyscypliny',
        panelStrictDesc: 'Zarządzaj parametrami nadzoru nad dzieckiem. Zmiany są stosowane natychmiastowo we wszystkich modułach platformy.',
        lockPersonaLabel: '🔒 Tryb wymuszony «Surowy Nauczyciel»',
        lockPersonaDesc: 'Blokuje dziecku możliwość zmiany charakteru korepetytora na zbyt łagodny lub żartobliwy przed NMT.',
        dailyNormLabel: 'Dzienna norma skupienia:',
        tabLimitLabel: 'Limit przełączeń kart w sesji:',
        soundAlertLabel: '🔊 Sygnał dźwiękowy przy utracie skupienia',
        soundAlertDesc: 'Głośny sygnał ostrzegawczy z głośników, jeśli dziecko otwiera YouTube lub gry podczas nauki.',
        tgDigestLabel: '📱 Cotygodniowe podsumowania w Telegramie',
        tgDigestDesc: 'W każdą niedzielę o 20:00 bot przesyła zorganizowany raport o wynikach, minutach skupienia i obszarach wymagających uwagi.',
        btnPreviewTg: 'Zobacz przykładowy raport tygodniowy dla rodziców',
        contractTitle: 'Kontrakt edukacyjny',
        contractDesc: 'Kontrakt zastępuje pouczanie przejrzystą umową: ustalacie cel i nagrodę dziecka, a StrictAI rejestruje postęp realizacji.',
        contractNameLabel: 'Tytuł kontraktu / Sprint:',
        contractTargetMins: 'Cel skupienia (min/tydzień):',
        contractTargetScore: 'Docelowy śr. wynik NMT:',
        contractRewardLabel: '🎁 Nagroda od rodziców za realizację:',
        contractProgressLabel: 'Aktualny postęp realizacji:',
        btnSaveContract: 'Zapisz warunki kontraktu',
        modalTgTitle: '📱 Podgląd tygodniowego raportu dla rodziców',
        modalTgCopy: '📋 Kopiuj treść raportu'
      },

      knowledge: {
        profTarget: 'Cel na NMT 2025',
        btnEditProfile: '✏️ Edytuj profil',
        btnDojo: '🎋 Dojo Pandy (Sklep ze skórkami)',
        mapTitle: 'Interaktywna Mapa wiedzy',
        mapSub: 'Drzewo tematów programu szkolnego i obowiązkowych modułów NMT',
        searchPlaceholder: '🔍 Szukaj według nazwy tematu lub zasady...',
        totalMastery: 'Ogólne opanowanie programu',
        statMastered: 'Opanowane tematy (🟢)',
        statProgress: 'W trakcie nauki (🟡)',
        statAttention: 'Wymaga uwagi (🔴)',
        allSubjects: 'Wszystkie przedmioty',
        allLevels: 'Wszystkie poziomy',
        filterMastered: '🟢 Opanowane',
        filterProgress: '🟡 W toku',
        filterAttention: '🔴 Wymaga uwagi',
        journalTitle: 'Dziennik błędów (Praca nad błędami)',
        journalSub: 'Wszystkie zadania, w których pojawiły się błędy podczas testów, zebrano tutaj do powtórki z Pandą.',
        btnClearMastered: '🗑️ Wyczyść opanowane',
        dojoTitle: 'Dojo Pandy — Garderoba awatara',
        dojoSub: 'Kupuj unikalne akcesoria za zarobione monety bambusowe',
        dojoCatalog: 'Katalog wyposażenia:',
        editProfileTitle: 'Edycja celów i danych ucznia',
        editNameLabel: 'Imię i nazwisko ucznia:',
        editGradeLabel: 'Klasa lub szkoła:',
        editUniLabel: 'Uczelnia docelowa:',
        editSpecLabel: 'Wymarzony kierunek:',
        editScoreLabel: 'Docelowy wynik NMT (100–200):',
        btnSaveProfile: 'Zapisz zmiany'
      }
    },

    // =========================================================================
    // 🇩🇪 GERMAN
    // =========================================================================
    de: {
      nav: {
        home: 'Startseite',
        tutor: 'KI-Tutor',
        nmt: 'NMT-Simulator',
        tracker: 'Fokus & Kontrolle',
        parents: 'Elternbereich',
        knowledge: 'Wissenskarte',
        themeDark: 'Dunkel (Tiefes Indigo)',
        themeLight: 'Papier (Lesemodus)',
        themeToggle: 'Design wechseln (Dunkel / Warmes Papier zum Lesen)',
        streakTitle: 'Deine tägliche Lernserie',
        streakDays: 'Tage',
        bambooTitle: 'Bambus-Münzen für Fokus und gelöste Aufgaben',
        apiKey: 'KI-Schlüssel',
        apiKeyTitle: 'KI-Anbieter-Einstellungen (Gemini / OpenAI / Groq)',
        sessionBadge: 'Aktive Fokus-Sitzung! Klicken, um zum Timer zurückzukehren',
        menuAria: 'Menü öffnen',
        langSelect: 'Oberflächensprache',
        langModalTitle: 'Plattform-Sprache auswählen'
      },

      focusAlert: {
        title: 'Achtung! Ablenkung erkannt!',
        sub: 'Kehre zum Lernen zurück! Tab-Wechsel in dieser Sitzung: {switches}.',
        toast: '⚠️ Panda hat eine Ablenkung bemerkt! Die Fokus-Sitzung ist aktiv. Tab-Wechsel registriert.',
        close: '✕'
      },

      apiModal: {
        title: '⚙️ KI-Anbieter-Einstellungen',
        desc: 'Die Plattform StrictAI funktioniert sowohl im autonomen Übungsmodus als auch mit Anbindung an Ihr gewähltes neuronales Netzwerk für individuellen Nachhilfeunterricht. Der Schlüssel wird ausschließlich lokal in Ihrem Browser gespeichert.',
        selectProvider: 'KI-Anbieter auswählen:',
        keyLabel: 'API-Schlüssel:',
        keyHintGemini: 'Google AI Studio Schlüssel anfordern ↗',
        keyHintOpenAI: 'OpenAI Schlüssel anfordern ↗',
        keyHintGroq: 'GroqCloud Schlüssel anfordern ↗',
        keyPlaceholder: 'AIzaSy... oder sk-... eingeben',
        privacy: '🔒 Datenschutz garantiert: Der Schlüssel wird nicht an Drittanbieter-Server von StrictAI übertragen und dient ausschließlich direkten Anfragen an den ausgewählten Anbieter.',
        cancel: 'Abbrechen',
        save: 'Einstellungen speichern',
        success: 'Einstellungen gespeichert! Anbieter: {provider}'
      },

      personas: {
        friend: {
          name: 'Guter Freund',
          tagline: 'Sanfte Unterstützung, kein Druck und geduldige Erklärungen',
          desc: 'Unterstützt und lobt jeden Schritt',
          badge: 'Geduldig',
          greeting: 'Hallo! Ich bin hier, um dir zu helfen, jedes Thema stressfrei zu meistern. Womit fangen wir heute an?'
        },
        strict: {
          name: 'Strenger Lehrer',
          tagline: 'Eiserne Disziplin, präzise Formulierungen, null Nachlässigkeit',
          desc: 'Anspruchsvoll, korrigiert jeden Fehler',
          badge: 'Kompromisslos',
          greeting: 'Guten Tag. Die Zeit bis zum NMT vergeht schnell. Keine Ausreden und keine Ablenkungen! Konzentriere dich und begründe deine Antwort.'
        },
        joker: {
          name: 'Witzbold',
          tagline: 'Memes, lustige Assoziationen und Lernen mit einem Lächeln',
          desc: 'Erklärt mit Humor und Witzen',
          badge: 'Humorvoll',
          greeting: 'Oh, hallo! Man sagt, der Granit der Wissenschaft schmeckt besser als junger Bambus. Knacken wir diese Formeln so, dass die Prüfungskommission vor Freude weint!'
        },
        motivator: {
          name: 'Motivator',
          tagline: 'Siegermentalität, Fokus auf Studienförderung und 200-Punkte-Ziel',
          desc: 'Stellt Herausforderungen und feiert Erfolge',
          badge: '200-Punkte-Drive',
          greeting: 'Fokus auf das Ziel! Du schaffst viel mehr, als du denkst. Jeder gelöste Test ist dein Schritt zur Traumuniversität! Packen wir es an!'
        },
        calm: {
          name: 'Ruhiger Mentor',
          tagline: 'Zen-Ansatz, Struktur, systematisches Denken und Zuversicht',
          desc: 'Geduldig, Schritt für Schritt, ohne Eile',
          badge: 'Zen',
          greeting: 'Atme ruhig ein. Schwieriges wird einfach, wenn man es in aufeinanderfolgende Schritte zerlegt. Beginnen wir langsam und achtsam.'
        }
      },

      index: {
        hero: {
          badge: 'KI-Tutor der nächsten Generation',
          titleHtml: 'Dein persönlicher Tutor mit <span>eiserner Disziplin</span>',
          subtitle: 'Wir sind der erste ukrainische KI-Bildungsdienst mit einem eigenen interaktiven digitalen Avatar des Roten Pandas. Der Panda passt sich deinem Charakter an, erklärt jeden Fehler Schritt für Schritt nach dem offiziellen Lehrplan und verhindert Prokrastination während der Lektion.',
          btnTutor: 'Lektion mit Panda starten',
          btnNmt: 'NMT 2025 Simulator',
          statPredicted: 'Durchschn. prognostizierte Punktzahl',
          statBudget: 'Zulassungen zum kostenfreien Studium',
          statCheating: 'Chance auf Spicken in sozialen Medien',
          statPersonas: 'Einzigartige KI-Persönlichkeiten',
          bubble: 'Hallo! Ich bin hier, um dir zu helfen, den NMT stressfrei mit 190+ Punkten zu bestehen. Wähle meinen Charakter oder klicke auf die Schaltfläche unten!',
          btnVoice: 'Pandas Stimme anhören',
          btnVoiceStop: 'Sprachausgabe stoppen',
          btnChat: 'Chat öffnen'
        },
        calc: {
          badge: '📊 Offizielle UCEQA-Koeffizienten 2024–2025',
          title: 'Zulassungschancen- & NMT-Prognoserechner',
          desc: 'Finde deinen genauen Wettbewerbswert für Spitzenuniversitäten der Ukraine heraus. Bewege die Schieberegler und sieh deine Chancen auf einen staatlichen Studienplatz in Echtzeit.',
          uniLabel: 'Zieluniversität:',
          specLabel: 'Fachrichtung (Koeffizienten):',
          lblUkr: '🇺🇦 Ukrainische Sprache:',
          lblMath: '📐 Mathematik:',
          lblHist: '🏛 Geschichte der Ukraine:',
          lblFourth: '🇬🇧 Englische Sprache (4. Fach):',
          kbResult: 'Prognostizierter Wettbewerbswert (WW)',
          kbSub: 'unter Berücksichtigung der Fachkoeffizienten',
          chanceLabel: 'Chance auf kostenfreies Studium:',
          statusHigh: '⚡ Hohe Chance auf Studienplatzförderung',
          recText: 'Für eine 100%ige Zusagegarantie empfehlen wir, <strong>Geschichte der Ukraine</strong> mit dem Fehlertrainer um +8 Punkte zu verbessern.',
          saveTarget: 'Als Ziel speichern & Plan mit Panda erstellen',
          nmtFullLink: 'Vollständigen NMT-Übungstest starten →'
        },
        modules: {
          badge: '🏛 Vollständiges Lern-Ökosystem',
          title: '5 integrierte Module von StrictAI',
          desc: 'Keine unverbundenen Apps oder chaotischen Chats. Jedes Modul interagiert mit einem einheitlichen Schülerprofil und einer Wissensbasis.',
          cardTutorTitle: 'KI-Tutor Roter Panda',
          cardTutorDesc: '5 einzigartige Persönlichkeiten für jede Stimmung. Der Panda liefert keine fertigen Antworten zum Abschreiben – er nutzt den sokratischen Dialog, leitet mit gezielten Fragen an und erklärt jeden Lösungsschritt. Spracheingabe, Sprachausgabe und lebendige Mimik.',
          cardTutorCta: 'Zur Lektion →',
          cardNmtTitle: 'NMT-Übungstrainer',
          cardNmtDesc: 'Vollständige Simulation der realen Prüfung: Countdown-Timer, 100–200-Punkte-Skala, aktuelle Aufgabenbank und Generator ähnlicher Übungen für Fehler.',
          cardNmtCta: 'Test →',
          cardTrackerTitle: 'Fokuskontrolle & Pomodoro',
          cardTrackerDesc: 'Echtzeit-Erkennung von Browser-Tab-Wechseln. Wenn der Schüler zu sozialen Medien abdriftet, wird die Sitzung unterbrochen und Panda spricht eine strenge Warnung aus.',
          cardTrackerCta: 'Tracker →',
          cardKnowledgeTitle: 'Wissenskarte Klassen 5–11',
          cardKnowledgeDesc: 'Interaktive Themenmatrix für Mathematik, Sprache, Geschichte und Englisch. Automatische Hervorhebung von Lücken und gezielte Wiederholungsanleitung.',
          cardKnowledgeCta: 'Karte →',
          cardParentsTitle: 'Elternbereich & Vertrag',
          cardParentsDesc: 'PIN-Code-Schutz, wöchentliche Motivationsvereinbarung (\'Belohnung bei Zielerreichung\'), Nachverfolgung echter Lernminuten ohne Vertrauensbruch.',
          cardParentsCta: 'Bereich →',
          activePersonaLabel: 'Gewählte Persönlichkeit:'
        },
        compare: {
          badge: '⚖️ Fairer Vergleich der Ansätze',
          title: 'Warum StrictAI herkömmliche Lösungen übertrifft',
          desc: 'Wir haben die Geduld eines Einzeltutors, die Zugänglichkeit von KI und die eiserne Disziplin der Ablenkungskontrolle vereint.',
          thCriteria: 'Vergleichskriterium',
          thStrict: 'StrictAI (Panda-Tutor) 🐼',
          thTutor: 'Herkömmlicher Tutor 👩‍🏫',
          thBot: 'Herkömmlicher Chatbot 🤖',
          rowCost: 'Vorbereitungskosten',
          rowCostStrict: 'Erschwinglich für jeden Schüler',
          rowCostTutor: 'Von 4 000 bis 12 000 ₴/Monat',
          rowCostBot: 'Kostenlos / Abonnement',
          rowAvail: '24/7 Verfügbarkeit ohne Verspätung',
          rowAvailStrict: 'Jederzeit online erreichbar',
          rowAvailTutor: 'Nur nach Zeitplan 1-2 Mal/Woche',
          rowAvailBot: 'Rund um die Uhr',
          rowAvatar: 'Digitaler Avatar & Emotionen',
          rowAvatarStrict: 'Lebendiger Roter Panda mit 5 Charakteren',
          rowAvatarTutor: 'Echter Mensch (manchmal müde)',
          rowAvatarBot: 'Trockene Textwand ohne Seele',
          rowTabs: 'Ablenkungs- & Tab-Kontrolle',
          rowTabsStrict: 'Eiserne Erkennung von Tab-Wechseln',
          rowTabsTutor: 'Sieht Schülerbildschirm online nicht',
          rowTabsBot: 'Keinerlei Ablenkungskontrolle',
          rowNmt: 'NMT-Lehrplan & UCEQA-Standards',
          rowNmtStrict: 'Offizielle Koeffizienten & Prüfungen 2024–2025',
          rowNmtTutor: 'Abhängig von Qualifikation',
          rowNmtBot: 'Halluziniert, verwechselt Lehrpläne',
          rowSocrates: 'Schutz vor Abschreiben (Sokratische Methode)',
          rowSocratesStrict: 'Führt Schritt für Schritt zur eigenen Lösung',
          rowSocratesTutor: 'Erklärt den Denkprozess',
          rowSocratesBot: 'Gibt sofort fertige Lösungen aus',
          rowParents: 'Elternbereich & Bildungsvertrag',
          rowParentsStrict: 'PIN-Code, transparente Lernzeit & Belohnungen',
          rowParentsTutor: 'Subjektive kurze Telefonate',
          rowParentsBot: 'Keinerlei Elternzugang',
          rowGame: 'Gamification & Motivation',
          rowGameStrict: 'Bambus-Münzen, Serie-Tage, Zubehör',
          rowGameTutor: 'Meist langweilige Hausaufgaben',
          rowGameBot: 'Keinerlei Gamification'
        },
        wardrobe: {
          badge: '🎋 Garderobe des Roten Pandas',
          title: 'Lerne, verdiene Bambus und verbessere deinen Avatar',
          desc: 'Für jeweils 25 Minuten ehrlichen Fokus ohne Tab-Wechsel und jeden korrekt analysierten Fehler erhältst du Bambus-Münzen (🎋). Schalte neue Accessoires frei und gestalte deinen Panda!',
          glasses: '👓 Professoren-Brille',
          band: '🔥 Sensei-Stirnband',
          cap: '🎓 Doktorhut',
          none: '🌿 Ohne Zubehör',
          btnRoom: 'Zum Tutorenraum gehen',
          balance: 'Aktueller Kontostand:'
        },
        footer: {
          brandDesc: 'Panda-Tutor: adaptive Vorbereitung auf den NMT 2025 nach offiziellen Standards, Gamification und eiserne Konzentration.',
          uaBadge: 'Entwickelt für ukrainische Absolventen',
          colNav: 'Navigation',
          colPersonas: 'Tutor-Persönlichkeiten',
          colSecurity: 'Sicherheit & Datenschutz',
          copyright: '© 2025–2026 StrictAI EdTech Platform. Alle Rechte vorbehalten.',
          version: 'Version 1.0 (Release Candidate)',
          zeroBuild: 'Zero Build Step Architektur'
        }
      },

      tutor: {
        heroTitle: 'Panda-Tutor',
        heroSub: 'Lerne Sprachen, Schulfächer und bereite dich auf den NMT im Gespräch mit einem KI-Tutor vor',
        tabLanguages: 'Sprachen',
        tabSchool: 'NMT-Fächer & Schule',
        lblLanguage: 'Sprache',
        lblLevel: 'Niveau',
        lblSubject: 'Fach',
        lblGoal: 'Klasse / Ziel',
        personaTitle: 'Tutor-Persönlichkeit',
        personaSub: 'Wähle deinen bevorzugten Unterrichtsstil',
        personaLocked: 'Durch Elternkontrolle gesperrt: <b>Strenger Lehrer</b>',
        btnVoice: 'Sprachausgabe',
        btnVoiceFemale: 'Weibliche Stimme',
        btnVoiceMale: 'Männliche Stimme',
        btnNewLesson: 'Neue Lektion',
        btnWhiteboard: 'Tafel / Notizblock',
        welcomeTitle: 'Bereit für eine produktive Lektion?',
        welcomeDesc: 'Wähle Sprache oder Fach, Niveau und Charakter in der linken Leiste und klicke dann auf die Schaltfläche, um das Lernen mit Panda zu beginnen!',
        btnStartLesson: 'Lektion starten',
        featSocratic: '✨ Sokratische Methode',
        featVoice: '🎤 Spracheingabe',
        featBamboo: '🎋 Bambus-Belohnungen',
        featNoDistract: '🔒 Ohne Ablenkung',
        chipExercise: 'Gib eine Übung',
        chipExplainRule: 'Erkläre die Regel',
        chipConversation: 'Lass uns reden',
        chipCheckText: 'Prüfe meinen Text',
        chipBlitz: 'NMT-Blitz',
        chipSocraticHint: 'Hinweis (Sokrates)',
        inputPlaceholder: 'Schreibe deine Antwort oder klicke oben auf eine Schnellaktion...',
        btnSend: 'Senden',
        wbTitle: 'Wissenstafel & Notizblock',
        wbScratchpadTitle: 'Dein Notizblock zur Aufgabe',
        wbClear: 'Notizblock leeren',
        wbCopy: 'In den Chat kopieren',
        statusReady: 'Panda ist bereit für die Lektion',
        modeLanguages: 'Sprachen',
        modeSchool: 'NMT-Fächer'
      },

      nmt: {
        heroBadge: '🎯 Offizielle UCEQA-Zertifizierung',
        heroTitle: 'NMT- & Prüfungssimulator',
        heroDesc: 'Teste deine Fähigkeiten unter Prüfungsbedingungen, die dem echten Nationalen Multisubjekt-Test entsprechen. Aufgaben nach aktuellem Lehrplan, offizielle Formelsammlung und 100–200-Punkte-Skala.',
        formatTitle: '1. Testformat auswählen:',
        modeFull: 'Vollständiger NMT-Block (120 Min.)',
        modeSubject: 'Fachtrainer (15–30 Min.)',
        modeExpress: 'Express-Diagnostik (5 Aufgaben)',
        subjectTitle: '2. Schulfach auswählen:',
        subjAll: 'Alle Fächer (Komplex)',
        subjUkr: 'Ukrainische Sprache',
        subjMath: 'Mathematik',
        subjHist: 'Geschichte der Ukraine',
        subjEng: 'Englische Sprache',
        timerModeTitle: '3. Zeitkontrollmodus (Anti-Stress-Ergonomie):',
        timerClassic: 'Klassischer Timer',
        timerClassicDesc: 'Rückzählung von Minuten und Sekunden',
        timerZen: 'Versteckte Linie (Zen)',
        timerZenDesc: 'Keine Paniksekunden — ruhiger Fokus',
        timerStrict: 'Strenger Prüfer',
        timerStrictDesc: 'Audiosignale und minutengenaue Überwachung',
        btnStartExam: 'Prüfung starten',
        pastAttempts: 'Verlauf deiner NMT-Versuche',
        syncProfile: 'Daten mit Profil synchronisiert',
        btnPrev: 'Vorherige',
        btnNext: 'Nächste',
        btnClearChoice: 'Auswahl aufheben',
        btnFlag: 'Zur Überprüfung markieren',
        btnFlagActive: 'Markierung aktiv',
        btnSubmitExam: 'Test abschließen & Punktzahl erhalten',
        matrixTitle: 'Aufgabenmatrix',
        answered: 'Beantwortet',
        flagged: 'Markiert 🚩',
        skipped: 'Übersprungen',
        resultsHeadline: 'Glückwunsch zum Abschluss des Tests!',
        resultsSub: 'Ergebnis im Profil gespeichert. Sieh dir detaillierte Analysen an und arbeite jedes schwierige Thema mit dem KI-Tutor durch.',
        scaledScoreLabel: 'NMT-Rangpunktzahl',
        metricAccuracy: 'Antwortgenauigkeit',
        metricMistakes: 'Anzahl der Fehler',
        metricTime: 'Verbrauchte Zeit',
        metricCoins: 'Verdiente Bambus-Münzen',
        btnRetake: 'Anderen Test absolvieren',
        reviewTitle: 'Detaillierte Analyse der Antworten',
        refMaterialsTitle: 'UCEQA-Hilfsmaterialien',
        refMaterialsSub: 'Zulässige Formeln und Übersichten für die Abschlussprüfung',
        scratchpadTitle: 'Interaktiver Notizblock für Lösungen',
        scratchpadSub: 'Deine Entwurfsnotizen und Zwischenrechnungen',
        filterAll: 'Alle Aufgaben',
        filterMistakes: 'Nur Fehler ❌',
        filterCorrect: 'Nur Richtige ✅'
      },

      tracker: {
        heroProtocol: 'Strict Focus Protocol • Anti-Cheat-Kontrolle',
        heroTitle: 'Lernprozess-Tracker',
        heroSub: 'Eiserne Konzentration während der Lektion: Der smarte Timer verhindert Ablenkungen, registriert jeden Tab-Wechsel und vergibt Bambus-Münzen für ehrliches Lernen.',
        topFocus: 'Fokus heute',
        topSwitches: 'Tab-Wechsel',
        topCoins: 'Münzen für Sitzungen',
        moduleTitle: 'Zentrales Sitzungsmodul',
        statusReady: 'Startbereit',
        statusActive: 'Sitzung aktiv',
        statusPaused: 'Pausiert',
        modeSelectTitle: '1. Fokus-Sitzungsmodus wählen:',
        mode1: 'Pomodoro-Sprint',
        mode1Time: '25 Minuten',
        mode2: 'Tiefes Eintauchen',
        mode2Time: '45 Minuten',
        mode3: 'NMT-Marathon',
        mode3Time: '60 Minuten',
        subjectSelectTitle: '2. Lernfach wählen:',
        btnStart: 'Fokus-Sitzung starten',
        btnPause: 'Pause',
        btnResume: 'Fortsetzen',
        btnFinish: 'Beenden und speichern',
        btnTestBlur: 'Ablenkungs-Detektor testen',
        questsTitle: 'Tagesplan & Quests',
        questsSub: 'Erfülle Aufgaben und sammle Bambus 🎋',
        inputNewQuest: 'Füge dein persönliches Lernziel für heute hinzu...',
        btnAddQuest: 'Quest hinzufügen',
        logTitle: 'Sitzungs-Disziplin-Protokoll',
        btnClearLog: 'Löschen',
        chartTitle: '7-Tage-Diagramm (Mo–So)',
        chartNorm: 'Tagesziel: 90 Min./Tag',
        chartTotal: 'Gesamt diese Woche:',
        parentsLink: 'Detaillierter Bericht im Elternbereich ↗',
        supervisorTitle: 'Live-Lernbegleiter',
        supervisorVoiceBtn: '🔊 Vorlesen',
        supervisorStrictLock: '🔒 Elternkontrolle aktiv: Modus «Strenger Lehrer» erzwungen.'
      },

      parents: {
        authTitle: 'Elternkontrolle',
        authSub: 'Der Zugang ist durch eine PIN geschützt, um die Vertraulichkeit von Einstellungen und Analysen zu wahren.',
        demoHint: 'Demo-Zugang zum Testen:',
        defaultPin: 'Standard-PIN: 1234',
        btnAutofill: '⚡ 1234 eingeben',
        dashTitle: 'Leistungs- und Analyse-Dashboard',
        dashSub: 'Ein objektiver Überblick über die Vorbereitung ohne Überwachung: Themenfortschritt, Fokuszeiten und gemeinsamer Bildungsvertrag.',
        btnChangePin: '🔑 PIN ändern',
        btnLock: '🔒 Abmelden',
        cardReadinessTitle: 'Bereitschaft für NMT 2025',
        cardDisciplineTitle: 'Disziplin-Index',
        cardWeakTopicsTitle: 'Schwache Themen des Schülers',
        panelStrictTitle: 'Strenge-Kontrollfeld',
        panelStrictDesc: 'Verwalte die Aufsichtsparameter für dein Kind. Änderungen werden sofort für alle Module der Plattform wirksam.',
        lockPersonaLabel: '🔒 Erzwungener Modus «Strenger Lehrer»',
        lockPersonaDesc: 'Verhindert, dass das Kind die Tutorenpersönlichkeit vor dem NMT auf zu locker oder scherzhaft umstellt.',
        dailyNormLabel: 'Tägliches Fokus-Ziel:',
        tabLimitLabel: 'Tab-Wechsel-Limit pro Sitzung:',
        soundAlertLabel: '🔊 Tonsignal bei Fokusverlust',
        soundAlertDesc: 'Lautes Warnsignal über Lautsprecher, falls das Kind während der Lektion YouTube oder Spiele öffnet.',
        tgDigestLabel: '📱 Wöchentliche Zusammenfassungen auf Telegram',
        tgDigestDesc: 'Jeden Sonntag um 20:00 Uhr sendet der Bot eine übersichtliche Zusammenfassung über Punkte, Fokuszeiten und Problemthemen.',
        btnPreviewTg: 'Beispiel eines wöchentlichen Elternberichts ansehen',
        contractTitle: 'Bildungsvertrag',
        contractDesc: 'Der Vertrag ersetzt Belehrungen durch eine transparente Vereinbarung: Sie legen das Ziel und die Belohnung des Schülers fest, und StrictAI erfasst den Fortschritt.',
        contractNameLabel: 'Vertragstitel / Sprint:',
        contractTargetMins: 'Fokus-Ziel (Min./Woche):',
        contractTargetScore: 'Zielwert Ø NMT-Punktzahl:',
        contractRewardLabel: '🎁 Belohnung der Eltern bei Erfüllung:',
        contractProgressLabel: 'Aktueller Erfüllungsfortschritt:',
        btnSaveContract: 'Vertragsbedingungen speichern',
        modalTgTitle: '📱 Vorschau des wöchentlichen Elternberichts',
        modalTgCopy: '📋 Berichtstext kopieren'
      },

      knowledge: {
        profTarget: 'Zielwert NMT 2025',
        btnEditProfile: '✏️ Profil bearbeiten',
        btnDojo: '🎋 Panda Dojo (Skin-Shop)',
        mapTitle: 'Interaktive Wissenskarte',
        mapSub: 'Themenbaum des Lehrplans und der obligatorischen NMT-Module',
        searchPlaceholder: '🔍 Suche nach Themenname oder Regel...',
        totalMastery: 'Gesamte Lehrplanbeherrschung',
        statMastered: 'Beherrschte Themen (🟢)',
        statProgress: 'In Bearbeitung (🟡)',
        statAttention: 'Erfordert Aufmerksamkeit (🔴)',
        allSubjects: 'Alle Fächer',
        allLevels: 'Alle Stufen',
        filterMastered: '🟢 Beherrscht',
        filterProgress: '🟡 In Arbeit',
        filterAttention: '🔴 Erfordert Aufmerksamkeit',
        journalTitle: 'Fehlerprotokoll (Fehleranalyse)',
        journalSub: 'Alle Aufgaben, bei denen während der Tests Ungenauigkeiten auftraten, sind hier zur Wiederholung mit Panda gesammelt.',
        btnClearMastered: '🗑️ Beherrschte löschen',
        dojoTitle: 'Panda Dojo — Avatar-Garderobe',
        dojoSub: 'Kaufe einzigartige Accessoires für verdiente Bambus-Münzen',
        dojoCatalog: 'Ausrüstungskatalog:',
        editProfileTitle: 'Schülerdaten und Ziele bearbeiten',
        editNameLabel: 'Vor- und Nachname des Schülers:',
        editGradeLabel: 'Klasse oder Schule:',
        editUniLabel: 'Wunschuniversität:',
        editSpecLabel: 'Traumfachrichtung:',
        editScoreLabel: 'Ziel-NMT-Punktzahl (100–200):',
        btnSaveProfile: 'Änderungen speichern'
      }
    }
  };

  /**
   * Helper to deeply resolve key paths in object
   */
  function resolvePath(obj, path) {
    if (!obj || !path) return undefined;
    const parts = path.split('.');
    let curr = obj;
    for (const part of parts) {
      if (curr && typeof curr === 'object' && part in curr) {
        curr = curr[part];
      } else {
        return undefined;
      }
    }
    return curr;
  }

  /**
   * Interpolate template string with params: {var} -> value
   */
  function interpolate(str, params) {
    if (typeof str !== 'string' || !params) return str;
    return str.replace(/\{(\w+)\}/g, (match, key) => {
      return key in params ? params[key] : match;
    });
  }

  /**
   * StrictI18n Engine Core Class
   */
  class StrictI18nEngine {
    constructor() {
      this.currentLocale = this._detectInitialLocale();
      this.translations = TRANSLATIONS;
      this.supportedLocales = SUPPORTED_LOCALES;

      // Automatically hook into document when ready
      if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
          // Microtask tick to allow store to load first if scripts execute in sequence
          setTimeout(() => this.init(), 0);
        }
      }
    }

    _detectInitialLocale() {
      // 1. Try StrictStore if loaded
      try {
        if (typeof window !== 'undefined' && window.StrictStore && typeof window.StrictStore.get === 'function') {
          const st = window.StrictStore.get();
          if (st && st.locale && TRANSLATIONS[st.locale]) {
            return st.locale;
          }
        }
      } catch (e) {}

      // 2. Try localStorage
      try {
        if (typeof localStorage !== 'undefined') {
          const saved = localStorage.getItem(STORAGE_LOCALE_KEY);
          if (saved && TRANSLATIONS[saved]) {
            return saved;
          }
        }
      } catch (e) {}

      // 3. Fallback to Ukrainian
      return 'uk';
    }

    init() {
      // Re-check store in case it loaded after i18n
      this.currentLocale = this._detectInitialLocale();
      this._applyHtmlAttributes();
      this.applyToDOM();

      // Listen for store updates to keep in sync
      if (typeof window !== 'undefined' && window.StrictStore && typeof window.StrictStore.subscribe === 'function') {
        window.StrictStore.subscribe((state) => {
          if (state && state.locale && state.locale !== this.currentLocale && TRANSLATIONS[state.locale]) {
            this.setLocale(state.locale, { skipStoreUpdate: true });
          }
        });
      }
    }

    _applyHtmlAttributes() {
      if (typeof document === 'undefined') return;
      document.documentElement.lang = this.currentLocale;
      document.documentElement.setAttribute('data-locale', this.currentLocale);
    }

    getLocale() {
      return this.currentLocale;
    }

    getSupportedLocales() {
      return [...this.supportedLocales];
    }

    /**
     * Translates a key for current locale.
     * @param {string} key - e.g. 'nav.home' or 'personas.strict.greeting'
     * @param {string|object} fallback - Fallback string OR parameters object if fallback omitted
     * @param {object} [params] - Optional interpolation params e.g. { switches: 3 }
     * @returns {string}
     */
    t(key, fallback = '', params = null) {
      if (typeof fallback === 'object' && fallback !== null && params === null) {
        params = fallback;
        fallback = '';
      }

      const activeDict = this.translations[this.currentLocale] || this.translations.uk;
      let val = resolvePath(activeDict, key);

      // Fallback to Ukrainian if missing in active locale
      if (val === undefined && this.currentLocale !== 'uk') {
        val = resolvePath(this.translations.uk, key);
      }

      // If still missing, use provided fallback or key
      if (val === undefined) {
        val = fallback || key;
      }

      if (params && typeof val === 'string') {
        return interpolate(val, params);
      }

      return val;
    }

    /**
     * Sets active locale, updates store, changes <html lang>, re-translates DOM, and fires event
     * @param {string} langCode - 'uk' | 'en' | 'pl' | 'de'
     * @param {object} [options]
     */
    setLocale(langCode, options = {}) {
      if (!this.translations[langCode]) {
        console.warn(`[StrictI18n] Locale "${langCode}" is not supported. Keeping "${this.currentLocale}".`);
        return this.currentLocale;
      }

      this.currentLocale = langCode;

      // Save to localStorage
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_LOCALE_KEY, langCode);
        }
      } catch (e) {}

      // Save to StrictStore
      if (!options.skipStoreUpdate && typeof window !== 'undefined' && window.StrictStore && typeof window.StrictStore.update === 'function') {
        window.StrictStore.update({ locale: langCode });
      }

      this._applyHtmlAttributes();
      this.applyToDOM();

      // Dispatch global event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('strictai:localechange', {
          detail: { locale: langCode }
        }));
      }

      return this.currentLocale;
    }

    /**
     * Returns persona metadata localized for active or given locale
     */
    getPersona(personaId, locale = null) {
      const loc = locale && this.translations[locale] ? locale : this.currentLocale;
      const dict = this.translations[loc] || this.translations.uk;
      const persona = dict.personas && dict.personas[personaId];
      if (!persona) return null;

      return {
        id: personaId,
        name: persona.name,
        tagline: persona.tagline,
        desc: persona.desc,
        badge: persona.badge,
        greeting: persona.greeting
      };
    }

    /**
     * Translates elements across the entire DOM tree
     * Handles:
     * - [data-i18n]: textContent
     * - [data-i18n-html]: innerHTML
     * - [data-i18n-placeholder]: placeholder attribute
     * - [data-i18n-title]: title attribute
     * - [data-i18n-aria-label]: aria-label attribute
     * - Dynamic & existing nodes via automated selector maps
     */
    applyToDOM(root = (typeof document !== 'undefined' ? document : null)) {
      if (!root || typeof root.querySelectorAll !== 'function') return;

      // 1. Explicit data-i18n attributes
      root.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (key) {
          el.textContent = this.t(key, el.textContent.trim());
        }
      });

      root.querySelectorAll('[data-i18n-html]').forEach((el) => {
        const key = el.getAttribute('data-i18n-html');
        if (key) {
          el.innerHTML = this.t(key, el.innerHTML);
        }
      });

      root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) {
          el.placeholder = this.t(key, el.placeholder);
        }
      });

      root.querySelectorAll('[data-i18n-title]').forEach((el) => {
        const key = el.getAttribute('data-i18n-title');
        if (key) {
          el.title = this.t(key, el.title);
        }
      });

      root.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
        const key = el.getAttribute('data-i18n-aria-label');
        if (key) {
          el.setAttribute('aria-label', this.t(key, el.getAttribute('aria-label')));
        }
      });

      // 2. Automated Selector Mapping for platform pages without manual markup
      this._applySelectorMappings(root);

      // 3. Update Personas selector cards on tutor.html if present
      this._applyPersonaCards(root);

      // 4. Update language indicator badges if present
      root.querySelectorAll('.strict-lang-current-label').forEach((el) => {
        const loc = this.supportedLocales.find(l => l.code === this.currentLocale);
        if (loc) el.textContent = `${loc.flag} ${loc.native}`;
      });
    }

    _applySelectorMappings(root) {
      if (!root || typeof root.querySelector !== 'function') return;
      const mappings = [
        // Navbar Links
        { sel: 'a[href="index.html"].nav-link span:last-child', key: 'nav.home' },
        { sel: 'a[href="tutor.html"].nav-link span:last-child', key: 'nav.tutor' },
        { sel: 'a[href="nmt.html"].nav-link span:last-child', key: 'nav.nmt' },
        { sel: 'a[href="tracker.html"].nav-link span:last-child', key: 'nav.tracker' },
        { sel: 'a[href="parents.html"].nav-link span:last-child', key: 'nav.parents' },
        { sel: 'a[href="knowledge.html"].nav-link span:last-child', key: 'nav.knowledge' },
        { sel: '#api-key-btn .desktop-only', key: 'nav.apiKey' },
        { sel: '#theme-toggle-btn', attr: 'title', key: 'nav.themeToggle' },
        { sel: '#api-key-btn', attr: 'title', key: 'nav.apiKeyTitle' },
        { sel: '.nav-badge.streak', attr: 'title', key: 'nav.streakTitle' },
        { sel: '.nav-badge.bamboo', attr: 'title', key: 'nav.bambooTitle' },
        { sel: '#nav-mobile-toggle', attr: 'aria-label', key: 'nav.menuAria' },

        // Index / Landing Page
        { sel: '.hero-badge-pill span:last-child', key: 'index.hero.badge' },
        { sel: '.hero-title', type: 'html', key: 'index.hero.titleHtml' },
        { sel: '.hero-subtitle', key: 'index.hero.subtitle' },
        { sel: '.hero-actions a.btn-primary span:last-child', key: 'index.hero.btnTutor' },
        { sel: '.hero-actions a.btn-secondary span:last-child', key: 'index.hero.btnNmt' },
        { sel: '#hero-voice-btn span:last-child', key: 'index.hero.btnVoice' },
        { sel: '.hero-avatar-showcase a.btn-primary span:last-child', key: 'index.hero.btnChat' },
        { sel: '.hero-stats-row .hero-stat-item:nth-child(1) .hero-stat-lbl', key: 'index.hero.statPredicted' },
        { sel: '.hero-stats-row .hero-stat-item:nth-child(2) .hero-stat-lbl', key: 'index.hero.statBudget' },
        { sel: '.hero-stats-row .hero-stat-item:nth-child(3) .hero-stat-lbl', key: 'index.hero.statCheating' },
        { sel: '.hero-stats-row .hero-stat-item:nth-child(4) .hero-stat-lbl', key: 'index.hero.statPersonas' },
        { sel: '.calc-card .bento-badge', key: 'index.calc.badge' },
        { sel: '.calc-card h2', key: 'index.calc.title' },
        { sel: '.calc-card p', key: 'index.calc.desc' },
        { sel: 'label[for="calc-uni-select"]', key: 'index.calc.uniLabel' },
        { sel: 'label[for="calc-spec-select"]', key: 'index.calc.specLabel' },
        { sel: '#calc-save-target-btn span:last-child', key: 'index.calc.saveTarget' },
        { sel: 'a[href="nmt.html"].btn-secondary.btn-sm', key: 'index.calc.nmtFullLink' },

        // Tutor Page
        { sel: '.tutor-hero-text h1 span:first-child', key: 'tutor.heroTitle' },
        { sel: '.tutor-hero-text p', key: 'tutor.heroSub' },
        { sel: '#tab-mode-languages span:last-child', key: 'tutor.tabLanguages' },
        { sel: '#tab-mode-school span:last-child', key: 'tutor.tabSchool' },
        { sel: '#section-languages-config .tutor-section-header:first-child .tutor-section-title span:first-child', key: 'tutor.lblLanguage' },
        { sel: '#section-languages-config .tutor-section-header:nth-of-type(2) .tutor-section-title span:first-child', key: 'tutor.lblLevel' },
        { sel: '#section-school-config .tutor-section-header:first-child .tutor-section-title span:first-child', key: 'tutor.lblSubject' },
        { sel: '#section-school-config .tutor-section-header:nth-of-type(2) .tutor-section-title span:first-child', key: 'tutor.lblGoal' },
        { sel: '.persona-section-title', key: 'tutor.personaTitle' },
        { sel: '.persona-section-subtitle', key: 'tutor.personaSub' },
        { sel: '#btn-toggle-voice span:last-child', key: 'tutor.btnVoice' },
        { sel: '#btn-voice-female', key: 'tutor.btnVoiceFemale' },
        { sel: '#btn-voice-male', key: 'tutor.btnVoiceMale' },
        { sel: '#btn-new-lesson span:last-child', key: 'tutor.btnNewLesson' },
        { sel: '#btn-toggle-whiteboard span:last-child', key: 'tutor.btnWhiteboard' },
        { sel: '.welcome-title', key: 'tutor.welcomeTitle' },
        { sel: '.welcome-desc', key: 'tutor.welcomeDesc' },
        { sel: '#start-lesson-btn span:first-child', key: 'tutor.btnStartLesson' },
        { sel: '.chip-btn[data-action="exercise"] span:last-child', key: 'tutor.chipExercise' },
        { sel: '.chip-btn[data-action="explain_rule"] span:last-child', key: 'tutor.chipExplainRule' },
        { sel: '.chip-btn[data-action="conversation"] span:last-child', key: 'tutor.chipConversation' },
        { sel: '.chip-btn[data-action="check_text"] span:last-child', key: 'tutor.chipCheckText' },
        { sel: '.chip-btn[data-action="blitz"] span:last-child', key: 'tutor.chipBlitz' },
        { sel: '.chip-btn[data-action="socratic_hint"] span:last-child', key: 'tutor.chipSocraticHint' },
        { sel: '#tutor-user-input', attr: 'placeholder', key: 'tutor.inputPlaceholder' },
        { sel: '#send-message-btn span:first-child', key: 'tutor.btnSend' },
        { sel: '.whiteboard-title span:last-child', key: 'tutor.wbTitle' },
        { sel: '#btn-clear-scratchpad', key: 'tutor.wbClear' },
        { sel: '#btn-copy-scratchpad', key: 'tutor.wbCopy' },
        { sel: '#tutor-presence-text', key: 'tutor.statusReady' },

        // NMT Page
        { sel: '#nmt-setup-view .badge-points span:last-child', key: 'nmt.heroBadge' },
        { sel: '#nmt-setup-view h1', key: 'nmt.heroTitle' },
        { sel: '#btn-start-exam span:last-child', key: 'nmt.btnStartExam' },
        { sel: '#past-exams-list', prevH3: true, key: 'nmt.pastAttempts' },
        { sel: '#btn-prev-q span:last-child', key: 'nmt.btnPrev' },
        { sel: '#btn-next-q span:first-child', key: 'nmt.btnNext' },
        { sel: '#btn-clear-choice span', key: 'nmt.btnClearChoice' },
        { sel: '#flag-btn-text', key: 'nmt.btnFlag' },
        { sel: '#btn-submit-exam-sidebar span:last-child', key: 'nmt.btnSubmitExam' },
        { sel: '#results-headline', key: 'nmt.resultsHeadline' },
        { sel: '#results-subtext', key: 'nmt.resultsSub' },
        { sel: '.scaled-score-label', key: 'nmt.scaledScoreLabel' },
        { sel: '#btn-retake-exam span:last-child', key: 'nmt.btnRetake' },

        // Tracker Page
        { sel: '.tracker-hero-banner h1', key: 'tracker.heroTitle' },
        { sel: '.tracker-hero-banner p', key: 'tracker.heroSub' },
        { sel: '#start-btn-label', key: 'tracker.btnStart' },
        { sel: '#timer-reset-btn span:last-child', key: 'tracker.btnFinish' },
        { sel: '#timer-simulate-blur-btn span:last-child', key: 'tracker.btnTestBlur' },
        { sel: '#add-quest-btn span:last-child', key: 'tracker.btnAddQuest' },
        { sel: '#new-quest-input', attr: 'placeholder', key: 'tracker.inputNewQuest' },
        { sel: '#clear-session-log-btn', key: 'tracker.btnClearLog' },

        // Parents Page
        { sel: '#pin-auth-screen h1', key: 'parents.authTitle' },
        { sel: '#pin-auth-screen p', key: 'parents.authSub' },
        { sel: '#pin-autofill-btn', key: 'parents.btnAutofill' },
        { sel: '.parent-dashboard-header h1', key: 'parents.dashTitle' },
        { sel: '.parent-dashboard-header p', key: 'parents.dashSub' },
        { sel: '#change-pin-btn', key: 'parents.btnChangePin' },
        { sel: '#lock-dashboard-btn', key: 'parents.btnLock' },
        { sel: '#preview-weekly-report-btn span:last-child', key: 'parents.btnPreviewTg' },
        { sel: '#save-contract-btn span:last-child', key: 'parents.btnSaveContract' },

        // Knowledge Page
        { sel: '.knowledge-nav-bar h2', key: 'knowledge.mapTitle' },
        { sel: '.knowledge-nav-bar p', key: 'knowledge.mapSub' },
        { sel: '#topic-search-input', attr: 'placeholder', key: 'knowledge.searchPlaceholder' },
        { sel: '#btn-edit-profile', key: 'knowledge.btnEditProfile' },
        { sel: '#btn-open-dojo span:last-child', key: 'knowledge.btnDojo' },
        { sel: '#btn-clear-mistakes-journal', key: 'knowledge.btnClearMastered' }
      ];

      for (const m of mappings) {
        try {
          const el = root.querySelector(m.sel);
          if (el) {
            if (m.attr) {
              el.setAttribute(m.attr, this.t(m.key, el.getAttribute(m.attr)));
            } else if (m.type === 'html') {
              el.innerHTML = this.t(m.key, el.innerHTML);
            } else {
              el.textContent = this.t(m.key, el.textContent.trim());
            }
          }
        } catch (e) {}
      }
    }

    _applyPersonaCards(root) {
      if (!root || typeof root.querySelector !== 'function') return;
      const personas = ['friend', 'strict', 'joker', 'motivator', 'calm'];
      personas.forEach((pId) => {
        // Hero persona pills on index.html
        const heroPill = root.querySelector(`.persona-switcher-btn[data-persona="${pId}"]`);
        if (heroPill) {
          const p = this.getPersona(pId);
          const icon = pId === 'friend' ? '🐼' : pId === 'strict' ? '🧐' : pId === 'joker' ? '😜' : pId === 'motivator' ? '🔥' : '🧘';
          heroPill.textContent = `${icon} ${p.name}`;
        }

        // Persona cards on tutor.html
        const card = root.querySelector(`.persona-card[data-persona="${pId}"]`);
        if (card) {
          const p = this.getPersona(pId);
          const title = card.querySelector('.persona-title');
          const desc = card.querySelector('.persona-desc');
          const badge = card.querySelector('.persona-badge');
          if (title) title.textContent = p.name;
          if (desc) desc.textContent = p.desc || p.tagline;
          if (badge) badge.textContent = p.badge;
        }
      });
    }

    /**
     * Injects or renders a language switcher widget
     */
    renderLanguageDropdown(container) {
      if (!container) return;
      const current = this.supportedLocales.find(l => l.code === this.currentLocale) || this.supportedLocales[0];

      container.innerHTML = `
        <div class="strict-lang-dropdown" style="position: relative; display: inline-block;">
          <button type="button" class="btn btn-secondary btn-sm strict-lang-btn" id="strict-lang-toggle-btn" style="display: flex; align-items: center; gap: 6px; padding: 6px 10px;">
            <span>${current.flag}</span>
            <span class="strict-lang-code" style="font-weight: 700; text-transform: uppercase;">${current.code}</span>
            <span style="font-size: 0.7rem; opacity: 0.7;">▼</span>
          </button>
          <div class="strict-lang-menu" id="strict-lang-menu" style="display: none; position: absolute; right: 0; top: calc(100% + 6px); background: var(--bg-card, #261742); border: 1px solid var(--border-subtle, rgba(255,255,255,0.15)); border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.4); z-index: 1000; min-width: 150px; overflow: hidden; padding: 4px;">
            ${this.supportedLocales.map(loc => `
              <button type="button" class="strict-lang-item ${loc.code === this.currentLocale ? 'active' : ''}" data-locale="${loc.code}" style="display: flex; align-items: center; gap: 8px; width: 100%; padding: 8px 12px; background: ${loc.code === this.currentLocale ? 'rgba(242,153,74,0.18)' : 'transparent'}; border: none; color: white; cursor: pointer; border-radius: 6px; font-size: 0.88rem; text-align: left;">
                <span style="font-size: 1.1rem;">${loc.flag}</span>
                <span style="font-weight: 600;">${loc.native}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;

      const toggleBtn = container.querySelector('#strict-lang-toggle-btn');
      const menu = container.querySelector('#strict-lang-menu');

      if (toggleBtn && menu) {
        toggleBtn.onclick = (e) => {
          e.stopPropagation();
          menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        };

        container.querySelectorAll('.strict-lang-item').forEach(btn => {
          btn.onclick = () => {
            const loc = btn.dataset.locale;
            this.setLocale(loc);
            menu.style.display = 'none';
          };
        });

        document.addEventListener('click', () => {
          menu.style.display = 'none';
        });
      }
    }
  }

  // Export Singleton on window
  const instance = new StrictI18nEngine();
  if (typeof window !== 'undefined') {
    window.StrictI18n = instance;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = instance;
  }
})();
