/**
 * StrictAI Global Reactive Store
 * Manages all platform states: student profile, tutor config, tracker, NMT, knowledge graph, and parental controls.
 * Persists to localStorage under 'strictai_state_v1'.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'strictai_state_v1';

  // 9 Signature Personas Metadata
  const PERSONAS_META = {
    friend: {
      id: 'friend',
      name: 'Добрий друг',
      tagline: 'М’яка підтримка, жодного тиску та терпляче пояснення',
      icon: '🐼',
      badge: 'Терплячий',
      greeting: 'Привіт! Я поруч, щоб допомогти тобі розібратися з будь-якою темою без жодного стресу. З чого почнемо сьогодні?',
      voicePitch: 1.1,
      voiceRate: 0.95,
      avatarClass: 'persona-friend'
    },
    strict: {
      id: 'strict',
      name: 'Суворий викладач',
      tagline: 'Залізна дисципліна, точність формулювань, нуль лінощів',
      icon: '🧐',
      badge: 'Без поблажок',
      greeting: 'Вітаю. Час до НМТ спливає. Жодних виправдань та сторонніх вкладок! Сконцентруйся та доведи свою відповідь.',
      voicePitch: 0.85,
      voiceRate: 1.05,
      avatarClass: 'persona-strict'
    },
    joker: {
      id: 'joker',
      name: 'Жартівник',
      tagline: 'Мемологія, кумедні асоціації та навчання з усмішкою',
      icon: '😜',
      badge: 'З гумором',
      greeting: 'О, привіт! Кажуть, що граніт науки смакує краще за молодий бамбук. Розкладемо ці формули по поличках так, щоб комісія плакала від радості!',
      voicePitch: 1.2,
      voiceRate: 1.15,
      avatarClass: 'persona-joker'
    },
    motivator: {
      id: 'motivator',
      name: 'Мотиватор',
      tagline: 'Енергія переможця, фокус на бюджет та рекордні 200 балів',
      icon: '🔥',
      badge: 'Драйв 200 балів',
      greeting: 'Увага на ціль! Ти можеш значно більше, ніж думаєш. Кожен розібраний тест — це твій крок до омріяного вишу! Погнали!',
      voicePitch: 1.05,
      voiceRate: 1.1,
      avatarClass: 'persona-motivator'
    },
    calm: {
      id: 'calm',
      name: 'Спокійний ментор',
      tagline: 'Дзен-підхід, структура, системне мислення та впевненість',
      icon: '🧘',
      badge: 'Дзен',
      greeting: 'Зроби спокійний вдих. Складне стає елементарним, коли розкласти його на послідовні кроки. Почнімо повільно й вдумливо.',
      voicePitch: 0.95,
      voiceRate: 0.9,
      avatarClass: 'persona-calm'
    },
    socratic: {
      id: 'socratic',
      name: 'Сократівський детектив',
      tagline: 'Навчає через навідні питання, розвиває логіку без готових шпаргалок',
      icon: '🕵️',
      badge: 'Без шпаргалок',
      greeting: 'Вітаю у детективному бюро істини! Жодних готових відповідей. Я ставитиму запитання, а ти розкриєш справу самостійно. З чого почнемо наше розслідування?',
      voicePitch: 0.95,
      voiceRate: 1.0,
      avatarClass: 'persona-socratic'
    },
    examiner: {
      id: 'examiner',
      name: 'Екзаменатор УЦОЯО / IELTS',
      tagline: 'Офіційні критерії оцінювання, таймінг та академічна точність',
      icon: '🎓',
      badge: 'Стандарт 200',
      greeting: 'Добрий день. Сесія офіційного оцінювання розпочата. Слідкуйте за таймінгом, обґрунтовуйте кожен крок за критеріями тестування. До виконання!',
      voicePitch: 0.9,
      voiceRate: 1.05,
      avatarClass: 'persona-examiner'
    },
    gamemaster: {
      id: 'gamemaster',
      name: 'Ігровий Гейм-майстер',
      tagline: 'Перетворює кожну тему на RPG-квест із місіями та босами',
      icon: '🚀',
      badge: 'RPG-квест',
      greeting: 'Привіт, мандрівнику! Твій персонаж увійшов у підземелля знань. Кожне завдання — це бій з босом за рідкісні бамбукові коїни. Готовий прийняти квест?',
      voicePitch: 1.15,
      voiceRate: 1.1,
      avatarClass: 'persona-gamemaster'
    },
    native: {
      id: 'native',
      name: 'Носій мови (Native)',
      tagline: 'Жива розмовна практика мовою оригіналу + пояснення українською',
      icon: '🗣️',
      badge: 'Жива розмова',
      greeting: 'Hello and welcome! Сьогодні говоримо як справжні native speakers: жива ідіоматика, сучасний сленг та впевненість, а всі складні правила розберемо рідною мовою. Ready?',
      voicePitch: 1.0,
      voiceRate: 1.0,
      avatarClass: 'persona-native'
    }
  };

  const PERSONA_META = PERSONAS_META;

  // Multi-lingual translations for all 9 Personas (uk, en, pl, de)
  const PERSONA_TRANSLATIONS = {
    uk: {
      friend: { name: 'Добрий друг', tagline: 'М’яка підтримка, жодного тиску та терпляче пояснення', badge: 'Терплячий', greeting: 'Привіт! Я поруч, щоб допомогти тобі розібратися з будь-якою темою без жодного стресу. З чого почнемо сьогодні?' },
      strict: { name: 'Суворий викладач', tagline: 'Залізна дисципліна, точність формулювань, нуль лінощів', badge: 'Без поблажок', greeting: 'Вітаю. Час до НМТ спливає. Жодних виправдань та сторонніх вкладок! Сконцентруйся та доведи свою відповідь.' },
      joker: { name: 'Жартівник', tagline: 'Мемологія, кумедні асоціації та навчання з усмішкою', badge: 'З гумором', greeting: 'О, привіт! Кажуть, що граніт науки смакує краще за молодий бамбук. Розкладемо ці формули по поличках так, щоб комісія плакала від радості!' },
      motivator: { name: 'Мотиватор', tagline: 'Енергія переможця, фокус на бюджет та рекордні 200 балів', badge: 'Драйв 200 балів', greeting: 'Увага на ціль! Ти можеш значно більше, ніж думаєш. Кожен розібраний тест — це твій крок до омріяного вишу! Погнали!' },
      calm: { name: 'Спокійний ментор', tagline: 'Дзен-підхід, структура, системне мислення та впевненість', badge: 'Дзен', greeting: 'Зроби спокійний вдих. Складне стає елементарним, коли розкласти його на послідовні кроки. Почнімо повільно й вдумливо.' },
      socratic: { name: 'Сократівський детектив', tagline: 'Навчає через навідні питання, розвиває логіку без готових шпаргалок', badge: 'Без шпаргалок', greeting: 'Вітаю у детективному бюро істини! Жодних готових відповідей. Я ставитиму запитання, а ти розкриєш справу самостійно. З чого почнемо наше розслідування?' },
      examiner: { name: 'Екзаменатор УЦОЯО / IELTS', tagline: 'Офіційні критерії оцінювання, таймінг та академічна точність', badge: 'Стандарт 200', greeting: 'Добрий день. Сесія офіційного оцінювання розпочата. Слідкуйте за таймінгом, обґрунтовуйте кожен крок за критеріями тестування. До виконання!' },
      gamemaster: { name: 'Ігровий Гейм-майстер', tagline: 'Перетворює кожну тему на RPG-квест із місіями та босами', badge: 'RPG-квест', greeting: 'Привіт, мандрівнику! Твій персонаж увійшов у підземелля знань. Кожне завдання — це бій з босом за рідкісні бамбукові коїни. Готовий прийняти квест?' },
      native: { name: 'Носій мови (Native)', tagline: 'Жива розмовна практика мовою оригіналу + пояснення українською', badge: 'Жива розмова', greeting: 'Hello and welcome! Сьогодні говоримо як справжні native speakers: жива ідіоматика, сучасний сленг та впевненість, а всі складні правила розберемо рідною мовою. Ready?' }
    },
    en: {
      friend: { name: 'Kind Friend', tagline: 'Gentle support, zero pressure, and patient explanations', badge: 'Patient', greeting: 'Hi! I\'m here to help you master any topic completely stress-free. Where shall we start today?' },
      strict: { name: 'Strict Teacher', tagline: 'Ironclad discipline, precise phrasing, zero slacking', badge: 'No Excuses', greeting: 'Greetings. Time until NMT is ticking away. No excuses and no extra tabs! Focus and justify your answer.' },
      joker: { name: 'Joker', tagline: 'Memes, humorous analogies, and learning with a smile', badge: 'Witty', greeting: 'Oh, hello! They say the granite of science tastes better than fresh bamboo shoots. Let\'s conquer these formulas so smoothly that the exam board weeps with joy!' },
      motivator: { name: 'Motivator', tagline: 'Winner\'s drive, focus on tuition-free spots, and a 200 score target', badge: '200 Score Drive', greeting: 'Eyes on the prize! You can do so much more than you think. Every solved test is your leap toward your dream university! Let\'s go!' },
      calm: { name: 'Calm Mentor', tagline: 'Zen approach, structure, systemic thinking, and confidence', badge: 'Zen', greeting: 'Take a calm deep breath. The complex becomes elementary when broken down into sequential steps. Let us begin slowly and mindfully.' },
      socratic: { name: 'Socratic Detective', tagline: 'Guides through leading questions, builds critical logic without cheat sheets', badge: 'Logic & Inquiry', greeting: 'Welcome to the Detective Bureau of Truth! No ready-made answers. I ask the questions, and you solve the mystery step-by-step. Ready to investigate?' },
      examiner: { name: 'Examiner (NMT / IELTS)', tagline: 'Official scoring criteria, strict timing, and academic precision', badge: '200 Benchmark', greeting: 'Good day. Official evaluation session has started. Monitor your timer, ground each step in exam standards. Begin!' },
      gamemaster: { name: 'RPG Game Master', tagline: 'Turns every subject into an epic quest with boss battles and XP', badge: 'RPG Quest', greeting: 'Greetings, adventurer! You have entered the Dungeon of Knowledge. Every question is a boss fight for rare bamboo coins. Accept the quest?' },
      native: { name: 'Native Speaker', tagline: 'Authentic conversational fluency + native language grammar breakdowns', badge: 'Native Fluency', greeting: 'Hello and welcome! Let\'s speak like real native speakers: authentic idioms, modern flow, and confident phrasing with clear explanations. Ready?' }
    },
    pl: {
      friend: { name: 'Dobry Przyjaciel', tagline: 'Łagodne wsparcie, zero presji i cierpliwe wyjaśnienia', badge: 'Cierpliwy', greeting: 'Cześć! Jestem tutaj, aby pomóc Ci opanować każdy temat bez stresu. Od czego dziś zaczniemy?' },
      strict: { name: 'Surowy Nauczyciel', tagline: 'Żelazna dyscyplina, precyzja sformułowań, zero lenistwa', badge: 'Bez ulg', greeting: 'Witam. Czas do NMT ucieka. Żadnych wymówek i otwartych innych kart! Skup się i uzasadnij odpowiedź.' },
      joker: { name: 'Żartowniś', tagline: 'Memy, zabawne skojarzenia i nauka z uśmiechem', badge: 'Z humorem', greeting: 'O, cześć! Mówią, że granit nauki smakuje lepiej niż młody bambus. Rozłożymy te formuły na czynniki pierwsze tak, by komisja płakała ze szczęścia!' },
      motivator: { name: 'Motywator', tagline: 'Energia zwycięzcy, nacisk na studia bezpłatne i cel 200 punktów', badge: 'Napęd 200 pkt', greeting: 'Wzrok na cel! Potrafisz znacznie więcej, niż myślisz. Każdy rozwiązany test to krok do wymarzonej uczelni! Do boju!' },
      calm: { name: 'Spokojny Mentor', tagline: 'Podejście zen, struktura, myślenie systemowe i pewność siebie', badge: 'Zen', greeting: 'Weź głęboki, spokojny oddech. To, co skomplikowane, staje się proste, gdy podzielimy to na kolejne kroki. Zacznijmy powoli i uważnie.' },
      socratic: { name: 'Detektyw Sokratejski', tagline: 'Uczy przez pytania naprowadzające, rozwija logikę bez gotowców', badge: 'Logika i dociekanie', greeting: 'Witaj w Biurze Prawdy! Żadnych gotowych odpowiedzi na tacy. Zadaję pytania, a Ty sam rozwiązujesz zagadkę krok po kroku. Zaczynamy śledztwo?' },
      examiner: { name: 'Egzaminator CKE / IELTS', tagline: 'Oficjalne kryteria oceniania, dyscyplina czasowa i precyzja akademicka', badge: 'Standard 200', greeting: 'Dzień dobry. Rozpoczynamy oficjalną sesję egzaminacyjną. Pilnuj czasu i precyzyjnie uzasadniaj każdy krok. Do dzieła!' },
      gamemaster: { name: 'Mistrz Gry RPG', tagline: 'Zmienia każdy temat w epicki quest z misjami i bossami', badge: 'Quest RPG', greeting: 'Witaj, poszukiwaczu przygód! Wkroczyłeś do lochów wiedzy. Każde zadanie to walka z bossem o rzadkie bambusowe monety. Przyjmujesz quest?' },
      native: { name: 'Native Speaker', tagline: 'Prawdziwa praktyka językowa w oryginale + gramatyka po ukraińsku', badge: 'Żywa rozmowa', greeting: 'Hello and welcome! Mówimy dzisiaj jak prawdziwi native speakerzy: żywe zwroty, współczesny slang i pewność siebie. Ready?' }
    },
    de: {
      friend: { name: 'Guter Freund', tagline: 'Sanfte Unterstützung, kein Druck und geduldige Erklärungen', badge: 'Geduldig', greeting: 'Hallo! Ich bin hier, um dir zu helfen, jedes Thema stressfrei zu meistern. Womit fangen wir heute an?' },
      strict: { name: 'Strenger Lehrer', tagline: 'Eiserne Disziplin, präzise Formulierungen, null Nachlässigkeit', badge: 'Kompromisslos', greeting: 'Guten Tag. Die Zeit bis zum NMT vergeht schnell. Keine Ausreden und keine Ablenkungen! Konzentriere dich und begründe deine Antwort.' },
      joker: { name: 'Witzbold', tagline: 'Memes, lustige Assoziationen und Lernen mit einem Lächeln', badge: 'Humorvoll', greeting: 'Oh, hallo! Man sagt, der Granit der Wissenschaft schmeckt besser als junger Bambus. Knacken wir diese Formeln so, dass die Prüfungskommission vor Freude weint!' },
      motivator: { name: 'Motivator', tagline: 'Siegermentalität, Fokus auf Studienförderung und 200-Punkte-Ziel', badge: '200-Punkte-Drive', greeting: 'Fokus auf das Ziel! Du schaffst viel mehr, als du denkst. Jeder gelöste Test ist dein Schritt zur Traumuniversität! Packen wir es an!' },
      calm: { name: 'Ruhiger Mentor', tagline: 'Zen-Ansatz, Struktur, systematisches Denken und Zuversicht', badge: 'Zen', greeting: 'Atme ruhig ein. Schwieriges wird einfach, wenn man es in aufeinanderfolgende Schritte zerlegt. Beginnen wir langsam und achtsam.' },
      socratic: { name: 'Sokratischer Detektiv', tagline: 'Lehrt durch gezielte Leitfragen, schärft die Logik ohne Spickzettel', badge: 'Logik & Erkenntnis', greeting: 'Willkommen im Detektivbüro der Wahrheit! Keine vorgekauten Antworten. Ich stelle die Fragen und du löst den Fall selbstständig. Womit beginnen wir?' },
      examiner: { name: 'Prüfer (NMT / IELTS)', tagline: 'Offizielle Bewertungskriterien, strenges Timing und akademische Präzision', badge: 'Standard 200', greeting: 'Guten Tag. Die offizielle Prüfungssitzung ist eröffnet. Achte auf das Zeitlimit und begründe jeden Schritt nach Bewertungsstandards. An die Arbeit!' },
      gamemaster: { name: 'RPG Game Master', tagline: 'Verwandelt jedes Thema in eine epische Quest mit Missionen und Bosskämpfen', badge: 'RPG-Quest', greeting: 'Sei gegrüßt, Abenteurer! Du hast das Verlies des Wissens betreten. Jede Aufgabe ist ein Bosskampf um seltene Bambus-Münzen. Nimmst du die Quest an?' },
      native: { name: 'Muttersprachler (Native)', tagline: 'Lebendige Sprachpraxis in der Originalsprache + ukrainische Erklärungen', badge: 'Freies Sprechen', greeting: 'Hello and welcome! Heute sprechen wir wie echte Native Speaker: authentische Redewendungen, moderner Slang und Selbstvertrauen. Ready?' }
    }
  };

  // Full Initial Default State (Ukrainian)
  const DEFAULT_STATE = {
    theme: 'dark',
    locale: 'uk',

    student: {
      name: 'Олександр Коваленко',
      grade: '11 клас (Випускник — НМТ)',
      targetUni: 'КПІ ім. Ігоря Сікорського',
      targetSpecialty: '121 Інженерія програмного забезпечення',
      targetScore: 184,
      streakDays: 12,
      bambooCoins: 340,
      equippedAccessory: 'glasses',
      unlockedAccessories: ['none', 'glasses', 'sensei_band', 'graduation_cap']
    },

    tutor: {
      category: 'languages', // 'languages' | 'nmt' | 'school'
      language: 'English',
      level: 'A1',
      nmtSubject: 'Математика',
      persona: 'friend',
      voiceEnabled: true,
      voiceGender: 'female',
      apiKey: '',
      apiProvider: 'gemini', // 'gemini' | 'openai' | 'groq' | 'mock'
      chatHistory: [
        {
          id: 'msg-init-1',
          sender: 'tutor',
          text: 'Привіт, Олександре! Сьогодні працюємо над показниковими рівняннями та параметрами до НМТ. Готовий розібрати приклад?',
          timestamp: Date.now() - 3600000,
          type: 'text'
        }
      ],
      pendingMistakeReview: null,
      activeRoleplayId: null,
      roleplayMissionStep: 0,
      savedSession: {
        active: false,
        messages: [],
        mode: 'languages',
        language: 'english',
        level: 'A1',
        subject: 'math',
        persona: 'friend',
        roleplayId: null,
        updatedAt: null
      },
      lessonHistory: [
        {
          id: 'lesson-demo-1',
          title: '☕ Замовлення круасана та кави в Лондоні (A1)',
          category: 'languages',
          language: 'english',
          level: 'A1',
          subject: null,
          roleplayId: 'cafe_order',
          persona: 'friend',
          date: 'Вчора, 18:40',
          durationMinutes: 18,
          messagesCount: 8,
          summary: 'Успішно замовлено Flat White та круасан без цукру, опановано конструкції "Could I have..." та ввічливі запитання.',
          completed: true
        },
        {
          id: 'lesson-demo-2',
          title: '📐 Параметри та показникові рівняння (НМТ Математика)',
          category: 'school',
          language: null,
          level: null,
          subject: 'math',
          grade: 'nmt-200',
          roleplayId: null,
          persona: 'strict',
          date: 'Сьогодні, 12:15',
          durationMinutes: 24,
          messagesCount: 12,
          summary: 'Розібрано ОДЗ у логарифмічних виразах (Завдання 21 НМТ), виявлено та виправлено помилку з відкиданням стороннього кореня.',
          completed: true
        }
      ]
    },

    tracker: {
      isSessionActive: false,
      sessionMode: 'pomodoro25', // 'pomodoro25', 'deep50', 'exam120'
      sessionSecondsLeft: 1500,
      focusMinutesToday: 65,
      dailyGoalMinutes: 90,
      tabSwitchesToday: 2,
      sessionTabSwitches: 0,
      weeklyMinutes: [75, 90, 60, 105, 80, 45, 65],
      focusLogs: [
        {
          id: 'log-1',
          subject: 'Математика (Параметри)',
          durationMinutes: 25,
          tabSwitches: 0,
          timestamp: 'Сьогодні, 14:30',
          status: 'completed'
        },
        {
          id: 'log-2',
          subject: 'Українська мова (Орфоепія)',
          durationMinutes: 25,
          tabSwitches: 1,
          timestamp: 'Сьогодні, 16:15',
          status: 'warning'
        },
        {
          id: 'log-3',
          subject: 'Історія України (Повоєнна відбудова)',
          durationMinutes: 15,
          tabSwitches: 1,
          timestamp: 'Вчора, 19:00',
          status: 'interrupted'
        }
      ],
      dailyQuests: [
        {
          id: 'quest-1',
          title: 'Пройти 25 хв фокус-сесії без жодного перемикання вкладок',
          reward: 50,
          completed: true,
          link: 'tracker.html'
        },
        {
          id: 'quest-2',
          title: 'Розібрати 3 помилки з Математики разом із Пандою',
          reward: 40,
          completed: false,
          link: 'tutor.html'
        },
        {
          id: 'quest-3',
          title: 'Скласти тренувальний блок НМТ з Історії України',
          reward: 70,
          completed: false,
          link: 'nmt.html'
        },
        {
          id: 'quest-4',
          title: 'Закрити тему "Складнопідрядні речення" у Карті знань',
          reward: 60,
          completed: false,
          link: 'knowledge.html'
        }
      ]
    },

    nmt: {
      predictedScores: {
        'Українська мова': 176,
        'Математика': 172,
        'Історія України': 168,
        'Англійська мова': 181
      },
      completedExams: [
        {
          id: 'exam-1',
          title: 'НМТ-2024: Демонстраційний варіант',
          date: '08.11.2024',
          score: 174,
          maxScore: 200,
          accuracy: 87,
          mistakesCount: 4
        },
        {
          id: 'exam-2',
          title: 'Математика: Інтенсив (Алгебра і початки аналізу)',
          date: '04.11.2024',
          score: 168,
          maxScore: 200,
          accuracy: 84,
          mistakesCount: 5
        },
        {
          id: 'exam-3',
          title: 'Українська мова: Синтаксис і пунктуація',
          date: '01.11.2024',
          score: 182,
          maxScore: 200,
          accuracy: 91,
          mistakesCount: 2
        }
      ],
      mistakesQueue: [
        {
          id: 'mistake-math-1',
          subject: 'Математика',
          topic: 'Логарифмічні та показникові рівняння',
          question: 'Розв’яжіть рівняння: log₂(x - 3) + log₂(x - 1) = 3. У відповідь запишіть суму коренів.',
          userAns: 'x = 5 та x = -1 (сума 4)',
          correctAns: 'x = 5 (корінь -1 сторонній через ОДЗ)',
          explanation: 'При розв’язуванні рівняння log₂(x-3)(x-1) = 3 маємо x² - 4x + 3 = 8 => x² - 4x - 5 = 0 => (x-5)(x+1)=0. Обов’язково враховуємо область допустимих значень: x > 3. Отже, корінь x = -1 є стороннім, єдиний розв’язок x = 5.'
        },
        {
          id: 'mistake-ukr-1',
          subject: 'Українська мова',
          topic: 'Наголоси у складних випадках (Програма НМТ)',
          question: 'Укажіть рядок, у якому в усіх словах наголос падає на другий склад:',
          userAns: 'випадок, чорнозем, дочка',
          correctAns: 'чорнозем, дочка, експерт',
          explanation: 'Слово «вИпадок» має наголос на першому складі (вИ-па-док). Слова «чорнОзем», «дочкА», «експЕрт» мають нормативний наголос за чинним словником УЦОЯО.'
        },
        {
          id: 'mistake-hist-1',
          subject: 'Історія України',
          topic: 'Українські землі у складі Речі Посполитої (XVI ст.)',
          question: 'Яку подію пов’язують із датою 1569 рік?',
          userAns: 'Берестейська церковна унія',
          correctAns: 'Люблінська унія (створення Речі Посполитої)',
          explanation: 'Люблінська унія була укладена 1 липня 1569 року (об’єднання Королівства Польського та Великого князівства Литовського). Берестейська церковна унія відбулася в 1596 році.'
        }
      ]
    },

    knowledge: {
      topics: [
        // Математика
        { id: 'math-1', subject: 'Математика', title: 'Показникові та логарифмічні вирази', grade: '11 клас', mastery: 68, status: 'attention', questionsCount: 45 },
        { id: 'math-2', subject: 'Математика', title: 'Планіметрія: Трикутники та чотирикутники', grade: '7-9 класи', mastery: 88, status: 'mastered', questionsCount: 60 },
        { id: 'math-3', subject: 'Математика', title: 'Стереометрія: Піраміда і призма', grade: '10-11 класи', mastery: 54, status: 'progress', questionsCount: 38 },
        { id: 'math-4', subject: 'Математика', title: 'Похідна та її геометричний зміст', grade: '10 клас', mastery: 79, status: 'mastered', questionsCount: 52 },
        { id: 'math-5', subject: 'Математика', title: 'Рівняння з параметром (Завдання 22 НМТ)', grade: '11 клас', mastery: 42, status: 'attention', questionsCount: 28 },

        // Українська мова
        { id: 'ukr-1', subject: 'Українська мова', title: 'Нормативні наголоси (Орфоепічний мінімум)', grade: '5-11 класи', mastery: 62, status: 'attention', questionsCount: 110 },
        { id: 'ukr-2', subject: 'Українська мова', title: 'Складнопідрядні речення та види підрядності', grade: '9 клас', mastery: 85, status: 'mastered', questionsCount: 48 },
        { id: 'ukr-3', subject: 'Українська мова', title: 'Розділові знаки при відокремлених членах', grade: '8 клас', mastery: 74, status: 'progress', questionsCount: 40 },
        { id: 'ukr-4', subject: 'Українська мова', title: 'Лексичні помилки та кальки з російської', grade: '10-11 класи', mastery: 91, status: 'mastered', questionsCount: 65 },

        // Історія України
        { id: 'hist-1', subject: 'Історія України', title: 'Русь-Україна за перших князів', grade: '7 клас', mastery: 94, status: 'mastered', questionsCount: 50 },
        { id: 'hist-2', subject: 'Історія України', title: 'Національно-визвольна війна під проводом Б. Хмельницького', grade: '8 клас', mastery: 82, status: 'mastered', questionsCount: 55 },
        { id: 'hist-3', subject: 'Історія України', title: 'Українська революція 1917–1921 рр.', grade: '10 клас', mastery: 58, status: 'attention', questionsCount: 64 },
        { id: 'hist-4', subject: 'Історія України', title: 'Відновлення незалежності України (1985–1991)', grade: '11 клас', mastery: 76, status: 'progress', questionsCount: 42 },

        // Англійська мова
        { id: 'eng-1', subject: 'Англійська мова', title: 'Conditionals (0, 1, 2, 3 and Mixed)', grade: '10-11 класи', mastery: 86, status: 'mastered', questionsCount: 45 },
        { id: 'eng-2', subject: 'Англійська мова', title: 'Passive Voice in Complex Sentences', grade: '9-10 класи', mastery: 72, status: 'progress', questionsCount: 38 },
        { id: 'eng-3', subject: 'Англійська мова', title: 'Phrasal Verbs & Idioms for B2', grade: '11 клас', mastery: 64, status: 'attention', questionsCount: 75 }
      ]
    },

    parental: {
      pinCode: '1234',
      strictLockPersona: false,
      maxAllowedTabSwitches: 3,
      soundAlertOnBlur: true,
      telegramNotifications: true,
      contract: {
        title: 'Тижневий спринт підготовки до НМТ 2025',
        targetMinutesWeek: 450,
        targetMinScore: 175,
        reward: 'Нова гра у Steam або квитки в кіно на вихідних із друзями',
        progressPercent: 78
      }
    }
  };

  // Helper for deep merging defaults with stored state safely
  function deepMerge(target, source) {
    if (!source || typeof source !== 'object') return target;
    const output = Object.assign({}, target);
    for (const key of Object.keys(source)) {
      if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (key in target) {
          output[key] = deepMerge(target[key], source[key]);
        } else {
          output[key] = source[key];
        }
      } else {
        output[key] = source[key];
      }
    }
    return output;
  }

  // State Management Class
  class StrictStoreManager {
    constructor() {
      this.listeners = new Set();
      this.state = this._loadState();
      this._applyTheme(this.state.theme);

      // Synchronize across browser tabs
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            this.state = deepMerge(DEFAULT_STATE, JSON.parse(e.newValue));
            this._notifyListeners();
          } catch (err) {
            console.error('StrictStore sync error:', err);
          }
        }
      });
    }

    _loadState() {
      try {
        const storage = (typeof window !== 'undefined' && window.localStorage) ? window.localStorage : null;
        if (!storage) return JSON.parse(JSON.stringify(DEFAULT_STATE));
        const raw = storage.getItem(STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
        const parsed = JSON.parse(raw);
        return deepMerge(DEFAULT_STATE, parsed);
      } catch (err) {
        console.warn('Failed to parse localStorage state, resetting to defaults', err);
        return JSON.parse(JSON.stringify(DEFAULT_STATE));
      }
    }

    _saveState() {
      try {
        const storage = (typeof window !== 'undefined' && window.localStorage) ? window.localStorage : null;
        if (storage) {
          storage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        }
      } catch (err) {
        console.error('StrictStore save error:', err);
      }
    }

    _applyTheme(theme) {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
      }
    }

    _notifyListeners() {
      for (const listener of this.listeners) {
        try {
          listener(this.state);
        } catch (err) {
          console.error('StrictStore listener error:', err);
        }
      }
    }

    // Public API Methods
    get() {
      return this.state;
    }

    update(fnOrPartial) {
      if (typeof fnOrPartial === 'function') {
        const next = fnOrPartial(this.state);
        if (next && typeof next === 'object') {
          this.state = deepMerge(this.state, next);
        }
      } else if (typeof fnOrPartial === 'object') {
        this.state = deepMerge(this.state, fnOrPartial);
      }

      if (this.state.theme) {
        this._applyTheme(this.state.theme);
      }

      this._saveState();
      this._notifyListeners();
      return this.state;
    }

    subscribe(listener) {
      this.listeners.add(listener);
      // Immediately call with current state
      try {
        listener(this.state);
      } catch (e) {
        console.error(e);
      }
      return () => this.listeners.delete(listener);
    }

    resetToDefaults() {
      this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      this._applyTheme(this.state.theme);
      this._saveState();
      this._notifyListeners();
      return this.state;
    }

    // High-Level Domain Actions
    addFocusMinutes(mins, subject = 'Загальний фокус') {
      return this.update((st) => {
        const currentMins = (st.tracker.focusMinutesToday || 0) + mins;
        const weekly = [...(st.tracker.weeklyMinutes || [0, 0, 0, 0, 0, 0, 0])];
        weekly[weekly.length - 1] = currentMins;

        const newLog = {
          id: 'log-' + Date.now(),
          subject: subject,
          durationMinutes: mins,
          tabSwitches: st.tracker.sessionTabSwitches || 0,
          timestamp: 'Сьогодні, ' + new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
          status: (st.tracker.sessionTabSwitches || 0) === 0 ? 'completed' : 'warning'
        };

        const logs = [newLog, ...(st.tracker.focusLogs || [])].slice(0, 10);

        // Award bamboo coins (1 coin per 2 minutes of focus)
        const earnedCoins = Math.max(5, Math.floor(mins / 2));
        const totalCoins = (st.student.bambooCoins || 0) + earnedCoins;

        return {
          ...st,
          student: {
            ...st.student,
            bambooCoins: totalCoins
          },
          tracker: {
            ...st.tracker,
            focusMinutesToday: currentMins,
            weeklyMinutes: weekly,
            focusLogs: logs,
            sessionTabSwitches: 0
          }
        };
      });
    }

    recordTabSwitch(reason = 'Перемикання вкладки під час уроку') {
      return this.update((st) => {
        const todayCount = (st.tracker.tabSwitchesToday || 0) + 1;
        const sessionCount = (st.tracker.sessionTabSwitches || 0) + 1;

        return {
          ...st,
          tracker: {
            ...st.tracker,
            tabSwitchesToday: todayCount,
            sessionTabSwitches: sessionCount
          }
        };
      });
    }

    addCoins(amount, reason = 'Виконання завдання') {
      return this.update((st) => {
        const current = st.student.bambooCoins || 0;
        return {
          ...st,
          student: {
            ...st.student,
            bambooCoins: Math.max(0, current + amount)
          }
        };
      });
    }

    recordExamResult(examObj) {
      return this.update((st) => {
        const exams = [examObj, ...(st.nmt.completedExams || [])];
        const predicted = { ...st.nmt.predictedScores };

        if (examObj.subject && examObj.score) {
          // Adjust predicted score slightly toward the new exam score
          const prev = predicted[examObj.subject] || 160;
          predicted[examObj.subject] = Math.round(prev * 0.7 + examObj.score * 0.3);
        }

        // Prepend new mistakes to mistakesQueue without duplicates (up to 15 items)
        let mistakesQueue = [...(st.nmt.mistakesQueue || [])];
        if (Array.isArray(examObj.newMistakes) && examObj.newMistakes.length > 0) {
          const existingIds = new Set(mistakesQueue.map(m => m.id));
          const uniqueNew = examObj.newMistakes.filter(m => m && m.id && !existingIds.has(m.id));
          mistakesQueue = [...uniqueNew, ...mistakesQueue].slice(0, 15);
        }

        return {
          ...st,
          nmt: {
            ...st.nmt,
            completedExams: exams,
            predictedScores: predicted,
            mistakesQueue: mistakesQueue
          }
        };
      });
    }

    sendMistakeToTutor(mistakeObj) {
      return this.update((st) => {
        const promptText = `Пандо, допоможи розібрати мою помилку з теми "${mistakeObj.topic}" (${mistakeObj.subject}).\n\nПитання: "${mistakeObj.question}"\nМоя відповідь була: "${mistakeObj.userAns}".\nПравильна відповідь: "${mistakeObj.correctAns}".\n\nПоясни, будь ласка, логіку правильного розв'язку та де саме я помилився!`;

        const newMsg = {
          id: 'msg-' + Date.now(),
          sender: 'user',
          text: promptText,
          timestamp: Date.now(),
          type: 'mistake_review',
          mistakeMeta: mistakeObj
        };

        const chat = [...(st.tutor.chatHistory || []), newMsg];

        return {
          ...st,
          tutor: {
            ...st.tutor,
            nmtSubject: mistakeObj.subject || st.tutor.nmtSubject,
            chatHistory: chat,
            pendingMistakeReview: mistakeObj
          }
        };
      });
    }

    getPersonaMeta(personaId, locale) {
      const base = PERSONAS_META[personaId] || PERSONAS_META.friend;
      const targetLocale = locale || (this.state && this.state.locale) || 'uk';

      let localized = null;
      if (PERSONA_TRANSLATIONS[targetLocale] && PERSONA_TRANSLATIONS[targetLocale][base.id]) {
        localized = PERSONA_TRANSLATIONS[targetLocale][base.id];
      } else if (typeof window !== 'undefined' && window.StrictI18n && typeof window.StrictI18n.getPersona === 'function') {
        localized = window.StrictI18n.getPersona(base.id, targetLocale);
      }

      if (localized) {
        return Object.assign({}, base, localized);
      }
      return base;
    }

    getAllPersonas(locale) {
      const keys = Object.keys(PERSONAS_META);
      return keys.map((key) => this.getPersonaMeta(key, locale));
    }

    saveLessonToHistory(lessonObj) {
      return this.update((st) => {
        const history = [lessonObj, ...(st.tutor.lessonHistory || [])].slice(0, 30);
        return {
          ...st,
          tutor: {
            ...st.tutor,
            lessonHistory: history
          }
        };
      });
    }

    archiveCurrentLesson(title, summary) {
      return this.update((st) => {
        const msgs = st.tutor.chatHistory || [];
        if (msgs.length <= 1) return st;
        const lesson = {
          id: 'lesson-' + Date.now(),
          title: title || (st.tutor.category === 'languages' ? `Урок ${st.tutor.language} (${st.tutor.level})` : `Урок ${st.tutor.nmtSubject}`),
          category: st.tutor.category,
          language: st.tutor.language,
          level: st.tutor.level,
          subject: st.tutor.nmtSubject,
          roleplayId: st.tutor.activeRoleplayId || null,
          persona: st.tutor.persona,
          date: 'Сьогодні, ' + new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
          durationMinutes: Math.max(5, Math.round(msgs.length * 1.5)),
          messagesCount: msgs.length,
          summary: summary || 'Пройдено розбір матеріалу та практичні вправи з ШІ-репетитором.',
          completed: true
        };
        const history = [lesson, ...(st.tutor.lessonHistory || [])].slice(0, 30);
        return {
          ...st,
          tutor: {
            ...st.tutor,
            lessonHistory: history
          }
        };
      });
    }

    setRoleplay(roleplayId, missionStep = 0) {
      return this.update((st) => ({
        ...st,
        tutor: {
          ...st.tutor,
          activeRoleplayId: roleplayId,
          roleplayMissionStep: missionStep
        }
      }));
    }
  }

  // Export Singleton on window
  window.StrictStore = new StrictStoreManager();

})();
