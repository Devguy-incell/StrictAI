/**
 * StrictAI Knowledge Base & Content Engine — "Панда-репетитор"
 * Rich pedagogical datasets for 5 Languages & 6 NMT/School Subjects across 9 AI Personas.
 * Fully autonomous (offline) with Socratic methods, interactive tests, Ukrainian grammar,
 * and STRICT Grade & CEFR Level filtering (5-7 клас, 8-9 клас, 10-11 / НМТ 200!, Олімпіада).
 */

(function () {
  'use strict';

  const StrictTutorData = {
    // Mode level descriptions
    levelDescriptions: {
      languages: {
        A1: 'Початківець: перші слова, знайомство та елементарні фрази для побуту.',
        A2: 'Елементарний: базові діалоги, покупки, прості часи та розповідь про себе.',
        B1: 'Середній: подорожі, висловлення власної думки, розбір граматичних часів.',
        B2: 'Впевнений: вільне спілкування, аргументовані дебати, написання есе до НМТ.',
        C1: 'Просунутий: складні ідіоми, академічні тексти та вільне володіння нюансами.',
        C2: 'Досконалий: рівень освіченого носія мови, філологічна точність та стилістика.'
      },
      school: {
        'grade-5-7': '5-7 клас: Базовий шкільний фундамент, дроби, відсотки, основи синтаксису й природа.',
        'grade-8-9': '8-9 клас: Поглиблена програма, підготовка до ДПА, теореми, прогресії та формули.',
        'grade-10-11': '10-11 клас: Комплексна старша школа, профільні теми та аналіз явищ.',
        'nmt-200': 'НМТ 200!: Інтенсивне розв’язування тестів УЦОЯО, пастки, ОДЗ та тест-таймінг.',
        'olympiad': 'Олімпіада: Нестандартні задачі з параметрами, підвищена складність та логіка.'
      }
    },

    // Languages Catalog
    languages: [
      { id: 'english', name: 'English', flag: '🇬🇧', defaultLevel: 'B1' },
      { id: 'deutsch', name: 'Deutsch', flag: '🇩🇪', defaultLevel: 'A2' },
      { id: 'espanol', name: 'Español', flag: '🇪🇸', defaultLevel: 'A1' },
      { id: 'chinese', name: '中文', flag: '🇨🇳', defaultLevel: 'A1' },
      { id: 'ukrainian', name: 'Українська', flag: '🇺🇦', defaultLevel: 'B2' }
    ],

    // School & NMT Catalog
    schoolSubjects: [
      { id: 'math', name: 'Математика', icon: '📐', defaultGrade: 'nmt-200' },
      { id: 'ukr-lang', name: 'Українська мова', icon: '✍️', defaultGrade: 'nmt-200' },
      { id: 'history', name: 'Історія України', icon: '🏛', defaultGrade: 'nmt-200' },
      { id: 'eng-nmt', name: 'Англійська (НМТ)', icon: '📖', defaultGrade: 'nmt-200' },
      { id: 'physics', name: 'Фізика', icon: '⚡', defaultGrade: 'grade-10-11' },
      { id: 'biology', name: 'Біологія', icon: '🧬', defaultGrade: 'grade-10-11' }
    ],

    // Persona Vocabularies & Tonalities (All 9 Personas)
    personaTones: {
      friend: {
        greetingPrefix: 'Привіт, друже! 🐼 Радий бачити тебе на уроці.',
        praise: [
          'Неймовірно! Ти впорався блискуче! 🌟 Обіймаю лапками!',
          'Чудова робота! З кожною правильною відповіддю ти стаєш впевненішим!',
          'Ти просто супер! Цей приклад піддався з першого разу! +10 бамбук-коїнів!'
        ],
        mistakeSupport: [
          'Не хвилюйся, помилки — це найкращі друзі нашого навчання! Давай розберемо разом:',
          'Нічого страшного, зроби спокійний ковток чаю. Спробуймо глянути на це завдання під іншим кутом:',
          'Майже влучив! Трішки не вистачило точності в одній деталі. Ось підказка:'
        ],
        socraticPrefix: 'Давай розплутаємо цей клубок разом, друже. Що ми бачимо в умові першим ділом?',
        signoff: 'Твій друг Панда завжди поруч!'
      },
      strict: {
        greetingPrefix: 'Вітаю. Прошу повної зосередженості. Дисципліна гарантує високий результат.',
        praise: [
          'Відповідь абсолютно правильна. Дотримано всіх вимог та точності термінології. +10 бамбук-коїнів.',
          'Зараховано. Точний розрахунок і чітке обґрунтування. Продовжуємо в тому ж темпі.',
          'Вірно. Ви врахували головну підступну деталь завдання. Не втрачайте пильності.'
        ],
        mistakeSupport: [
          'Помилка. Ви неуважно прочитали умову або проігнорували базове правило. На реальному іспиті це коштувало б балів. Аналізуйте:',
          'Невірно. Спрощення висновків неприпустиме. Перевірте базові визначення:',
          'Відповідь хибна. Ви потрапили у стандартну пастку укладачів тесту. Знайдіть причину:'
        ],
        socraticPrefix: 'Сконцентруйтеся. Яке фундаментальне визначення тут порушено? Назвіть правило.',
        signoff: 'Строгість сьогодні — це твої 200 балів завтра.'
      },
      joker: {
        greetingPrefix: 'Халоу! 🐼 Твій персональний комік-панда на зв’язку! Нудьгу скасовано наказом директора!',
        praise: [
          'Йооой, та ти просто геній! Навіть мої улюблені бамбукові палички аплодують стоячи! 🎋🚀',
          'Є контакт! Базуєш не по-дитячому! Лови бамбук-коїни, ти це заслужив!',
          'Красава! Якби за цей розв’язок давали Оскар, ти б уже стояв на червоній доріжці!'
        ],
        mistakeSupport: [
          'Х’юстон, у нас маленька халепа! 🛸 Твоя відповідь полетіла в іншу галактику. Приземляймося назад:',
          'Ой-ой! Здається, тут пробігав бешкетний кіт і переплутав знаки. Давай виправляти:',
          'Майже, але як кажуть: "не кажи гоп, поки не перевірив формулу"! Дивись, де підступ:'
        ],
        socraticPrefix: 'Ану ввімкни детективний режим! Якщо прибрати зайве, що залишається у сухому залишку?',
        signoff: 'З посмішкою до зірок!'
      },
      motivator: {
        greetingPrefix: 'Привіт, чемпіоне! 🔥 Тільки вперед, до найвищих балів та університету мрії!',
        praise: [
          'ПОТУЖНО! 💥 Оце чемпіонський підхід! Твій потенціал просто зашкалює! +10 коїнів у скарбничку!',
          'В яблучко! Ти розніс це завдання без шансів! Продовжуємо штурм вершин!',
          'Неймовірний прорив! З такою наполегливістю бюджет точно твій!'
        ],
        mistakeSupport: [
          'Тимчасова затримка перед великим ривком! Чемпіони гартуються на складних завданнях. Зберися і тисни далі:',
          'Ні кроку назад! Помилка — це лише паливо для твого прогресу. Розберемо її по кісточках:',
          'Не зупинятися! Кожен розібраний факап наближає тебе до 200 балів. Давай ще раз:'
        ],
        socraticPrefix: 'Уяви фінішну пряму! Який крок дасть тобі вирішальну перевагу в цьому завданні?',
        signoff: 'Перемагає той, хто не здається!'
      },
      calm: {
        greetingPrefix: 'Вітаю. Зроби спокійний вдих. 🧘 Крок за кроком ми розберемо будь-яку складність.',
        praise: [
          'Дуже зважено і вірно. Послідовне мислення завжди приносить чистий результат. +10 бамбук-коїнів.',
          'Правильно. Ти зберіг внутрішній баланс і спокійно знайшов точне рішення.',
          'Чудово. Жодної метушні, тільки ясна логіка. Продовжуємо нашу неспішну подорож знаннями.'
        ],
        mistakeSupport: [
          'Зупинімося тут на мить. Поспіх заважає бачити суть. Спокійно розгляньмо цю неточність:',
          'Все гаразд. Складне стає простим, якщо розібрати його на елементи. Погляньмо уважніше:',
          'Спостережливість приходить із досвідом. Не квапся, давай спокійно перевіримо передумови:'
        ],
        socraticPrefix: 'Відпусти тривогу. Що каже нам первинна логіка цього твердження?',
        signoff: 'Знання ростуть тихо, як бамбуковий гай.'
      },
      socratic: {
        greetingPrefix: 'Вітаю, шукачу істини. 🕵️ Жодних готових шпаргалок. Розплутаймо цей клубок фактів крок за кроком.',
        praise: [
          'Блискуча дедукція! 🔍 Ти самостійно розкрив логічний ланцюжок! +10 бамбук-коїнів!',
          'Точно в ціль! Справжній сократівський підхід: правильне запитання привело до бездоганної відповіді!',
          'Чудово! Ти не просто вгадав, а знайшов першопричину та фундаментальне правило!'
        ],
        mistakeSupport: [
          'Цікава гіпотеза, але докази вказують на інше. 🔍 Давай перевіримо передумову:',
          'Слід завів у глухий кут. Зверни увагу на ключовий факт, який ти випустив з уваги:',
          'Тут криється логічна пастка укладачів тесту. Яке твердження в умові суперечить твоєму варіанту?'
        ],
        socraticPrefix: 'Який перший логічний висновок ти робиш із цих вихідних даних?',
        signoff: 'Істина народжується у чесному діалозі.'
      },
      examiner: {
        greetingPrefix: 'Добрий день. Сесія офіційного оцінювання розпочата. 🎓 Слідкуйте за таймінгом та академічною точністю.',
        praise: [
          'Відповідь відповідає найвищому дескриптору шкали оцінювання! 🎓 +10 бамбук-коїнів.',
          'Точне попадання у ключ УЦОЯО / критерії Band 8.0+. Академічна точність повністю дотримана.',
          'Зараховано за протоколом тестування. Жодного зайвого слова, розрахунок бездоганний.'
        ],
        mistakeSupport: [
          'Зняття балів за критерієм точності. В офіційній сертифікації це коштувало б первинних балів. Розбір:',
          'Порушення екзаменаційного регламенту або неповна аргументація. Зверніть увагу на специфікацію:',
          'Невірно за критеріями оцінювання. Це типова помилка абітурієнтів згідно з офіційним звітом УЦОЯО:'
        ],
        socraticPrefix: 'Який офіційний алгоритм розв’язання передбачено стандартом для цього завдання?',
        signoff: 'Точність, таймінг і критерії — шлях до 200 балів.'
      },
      gamemaster: {
        greetingPrefix: 'Привіт, хоробрий герою! 🚀 Квест активовано, твій магічний інвентар готовий до бою з босами!',
        praise: [
          'КРИТИЧНИЙ УДАР! 💥 Міні-боса подолано одним ударом! Твій досвід зростає, лови +10 бамбукових артефактів!',
          'Епічна перемога! Твоє комбо знань та логіки спрацювало бездоганно! Рівень підвищено!',
          'Легендарний хід! Цей бос теми навіть не встиг контратакувати! +10 коїнів у скарбницю!'
        ],
        mistakeSupport: [
          'Ой, щит пробито! 🛡️ Бос наніс удар підступною пасткою. Перегруповуємося і контратакуємо знову:',
          'Місія під загрозою! Перевір свій інвентар — ти пропустив важливий квестовий предмет в умові:',
          'Спроба відбита, але зелля відродження діє! Аналізуємо вразливу зону боса:'
        ],
        socraticPrefix: 'Поглянь на шкалу вразливості боса! Яку магічну формулу застосуємо зараз?',
        signoff: 'Прокачуй інтелект, здобувай легендарний лут!'
      },
      native: {
        greetingPrefix: 'Hey there! 🗣️ Радий вітати! Сьогодні прокачуємо живу, автентичну мову без нудної шкільної зазубреності.',
        praise: [
          'Sounds super natural! 🌟 Ти звучиш як справжній носій мови на вулицях Лондона чи Берліна! +10 коїнів!',
          'Spot on! Чудова ідіоматика та вимова! Саме так це скажуть у реальному повсякденному житті!',
          'Awesome job! Вільне, невимушене мовлення без штучних книжкових кальок!'
        ],
        mistakeSupport: [
          'Граматично зрозуміло, але носії мови так не кажуть (звучить трохи штучно). Ось більш природний варіант:',
          'Обережно з фальшивими друзями перекладача! У живій розмові це має зовсім інший відтінок. Порівняй:',
          'Тут вкралася типова помилка прямого калькування з рідної мови. Native speaker скаже ось так:'
        ],
        socraticPrefix: 'How would a local barista or tech lead phrase this naturally without sounding like an old grammar book?',
        signoff: 'Fluency comes with daily practice and real conversations!'
      }
    },

    // Pedagogical Knowledge Base by Subject & Language with Explicit Grade/Level
    content: {
      // =======================================================================
      // 1. English (Language Mode)
      // =======================================================================
      english: {
        rules: [
          {
            level: 'A1',
            title: 'Verb "To Be" and Personal Pronouns',
            summary: 'Дієслово "to be" (бути, є) має форми am (I), is (he/she/it), are (you/we/they). В англійському реченні дієслово-зв’язка є обов’язковим!',
            formula: 'I am | He/She/It is | You/We/They are',
            mnemonic: 'Пам’ятай: в українській ми кажемо "Я студент", а в англійській обов’язково "I AM a student"!',
            examples: ['I am from Kyiv.', 'She is a talented student.']
          },
          {
            level: 'A2',
            title: 'Present Simple vs Present Continuous',
            summary: 'Present Simple виражає регулярні дії та факти (always, usually, every day). Present Continuous — дію прямо зараз (now, at the moment).',
            formula: 'Present Simple: V / V-s | Present Continuous: am/is/are + V-ing',
            mnemonic: 'Stative Verbs (like, love, know, understand, want) зазвичай НЕ вживаються в Continuous!',
            examples: [
              'She speaks English fluently. (Факт/навичка)',
              'Listen! She is speaking English right now. (Дія в цю мить)'
            ]
          },
          {
            level: 'B1',
            title: 'Past Simple vs Present Perfect',
            summary: 'Past Simple описує завершену дію в конкретний час у минулому (yesterday, in 2022, 2 days ago). Present Perfect пов’язує минулу дію з теперішнім результатом (already, yet, just, ever).',
            formula: 'Past Simple: V2/ed | Present Perfect: have/has + V3',
            mnemonic: 'Якщо є точний час "коли?" — вживай Past Simple! Якщо важливий результат прямо зараз — Present Perfect!',
            examples: [
              'I lost my keys yesterday. (Минулий факт)',
              'I have lost my keys, so I cannot enter the house now. (Результат)'
            ]
          },
          {
            level: 'B2',
            title: 'First and Second Conditionals',
            summary: '1st Conditional (реальна умова в майбутньому): If + Present Simple, will + V1. 2nd Conditional (уявна умова): If + Past Simple, would + V1.',
            formula: '1st: If it rains, we will stay at home.\n2nd: If I had 1 million dollars, I would travel the world.',
            mnemonic: 'У 2nd Conditional для "I" часто вживають "were": "If I were you..." (Якби я був на твоєму місці).',
            examples: [
              'If you study every day with Panda, you will pass the NMT easily!',
              'If I knew his phone number, I would call him right now.'
            ]
          },
          {
            level: 'C1',
            title: 'Third and Mixed Conditionals & Inversion',
            summary: '3rd Conditional (нереальне минуле): If + Past Perfect, would have + V3. Інверсія додає академічної виразності: "Had I known...", "Rarely have I seen...".',
            formula: 'Inversion: Auxiliary + Subject + Main Verb (Never have I ever...)',
            mnemonic: 'Інверсія працює як запитання за структурою, але є ствердженням!',
            examples: [
              'Had they arrived on time, the project would have succeeded.',
              'Hardly had the bell rung when the students entered.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'eng-q-a1',
            level: 'A1',
            question: 'Complete the sentence: "My brother and I ... students in Kyiv."',
            options: [
              { text: 'is', isCorrect: false },
              { text: 'am', isCorrect: false },
              { text: 'are', isCorrect: true },
              { text: 'be', isCorrect: false }
            ],
            explanation: '"My brother and I" — це множина "we", тому дієслово "to be" має форму "are".'
          },
          {
            id: 'eng-q-a2',
            level: 'A2',
            question: 'Choose the correct preposition: "I usually wake up ... 7 o’clock ... the morning."',
            options: [
              { text: 'at / on', isCorrect: false },
              { text: 'in / at', isCorrect: false },
              { text: 'at / in', isCorrect: true },
              { text: 'on / in', isCorrect: false }
            ],
            explanation: 'З точним часом вживаємо "at" (at 7 o’clock), а з частинами дня — "in" (in the morning).'
          },
          {
            id: 'eng-q-b1',
            level: 'B1',
            question: 'Choose the correct form: "Listen! Somebody ... the violin upstairs."',
            options: [
              { text: 'plays', isCorrect: false },
              { text: 'is playing', isCorrect: true },
              { text: 'played', isCorrect: false },
              { text: 'has played', isCorrect: false }
            ],
            explanation: 'Слово-маркер "Listen!" вказує на дію прямо в момент мовлення (Present Continuous).'
          },
          {
            id: 'eng-q-b2',
            level: 'B2',
            question: 'Choose the conditional form: "If she ... harder, she would have passed the exam last week."',
            options: [
              { text: 'studied', isCorrect: false },
              { text: 'had studied', isCorrect: true },
              { text: 'would study', isCorrect: false },
              { text: 'has studied', isCorrect: false }
            ],
            explanation: 'Це Third Conditional (нереальна дія в минулому): If + Past Perfect (had studied).'
          },
          {
            id: 'eng-q-c1',
            level: 'C1',
            question: 'Choose the inverted structure: "... had the conference begun when the electricity went out."',
            options: [
              { text: 'No sooner', isCorrect: false },
              { text: 'Hardly', isCorrect: true },
              { text: 'Scarcely than', isCorrect: false },
              { text: 'Not only', isCorrect: false }
            ],
            explanation: '"Hardly ... when" є нормативною парною сполукою з інверсією минулого доконаного часу.'
          }
        ],
        blitzQuestions: [
          { level: 'A1', q: 'Яка форма дієслова "to be" вживається із займенником "They"?', a: 'Are (They are).' },
          { level: 'A2', q: 'Який прийменник вживається з днями тижня (Monday, Sunday)?', a: 'Прийменник "on" (on Monday).' },
          { level: 'B1', q: 'Який прийменник вживається після дієслова "interested"?', a: 'Прийменник "in" (interested in something).' },
          { level: 'B2', q: 'У чому різниця між "remember to lock" та "remember locking"?', a: '"Remember to lock" — пам’ятати зробити дію вперед; "remember locking" — спогад про вже виконану дію.' },
          { level: 'C1', q: 'Яка 3-тя форма (Past Participle) дієслова "choose"?', a: 'Chosen (choose — chose — chosen).' }
        ],
        whiteboardFormulas: [
          'Present Simple: S + V(s) | every day, usually',
          'Present Continuous: S + am/is/are + V-ing | now',
          'Past Simple: S + V2/ed | yesterday, ago',
          'Present Perfect: S + have/has + V3 | already, yet',
          '1st Cond: If + Present, will + V1',
          '2nd Cond: If + Past Simple, would + V1',
          '3rd Cond: If + Past Perfect, would have + V3'
        ]
      },

      // =======================================================================
      // 2. Deutsch (Language Mode)
      // =======================================================================
      deutsch: {
        rules: [
          {
            level: 'A1',
            title: 'Артиклі та відмінювання дієслів у Präsens',
            summary: 'В німецькій мові іменники мають три роди: der (чоловічий), die (жіночий), das (середній). Дієслова мають типові закінчення: ich -e, du -st, er/sie/es -t, wir -en.',
            formula: 'ich lerne, du lernst, er/sie/es lernt, wir lernen',
            mnemonic: 'Завжди вчи німецьке слово одразу з його артиклем та множиною!',
            examples: ['Ich heiße Max und ich lerne Deutsch.', 'Das ist ein Buch.']
          },
          {
            level: 'A2',
            title: 'Dativ чи Akkusativ? (Прийменники місця та руху)',
            summary: 'Dativ відповідає на питання "Wo?" (Де? - стан спокою). Akkusativ відповідає на питання "Wohin?" (Куди? - рух/напрямок).',
            formula: 'Dativ (Де?): in dem (im) Park\nAkkusativ (Куди?): in den Park',
            mnemonic: 'Прийменники з Dativ: aus, bei, mit, nach, seit, von, zu. З Akkusativ: durch, für, gegen, ohne, um.',
            examples: [
              'Ich fahre mit dem Bus (mit + Dativ).',
              'Das Buch liegt auf dem Tisch (Wo? - Dativ).'
            ]
          },
          {
            level: 'B1',
            title: 'Perfekt та порядок слів у підрядному реченні (Kausalsätze)',
            summary: 'Perfekt утворюється з haben/sein + Partizip II. У підрядному реченні зі сполучником "weil" (тому що) змінюване дієслово йде на останнє місце!',
            formula: 'Hauptsatz + weil + Subjekt + ... + Verb am Ende',
            mnemonic: '"Weil macht das Verb geil und schickt es ans Ende!"',
            examples: [
              'Ich lerne Deutsch, weil ich in Berlin studieren möchte.',
              'Wir sind nach Hause gefahren.'
            ]
          },
          {
            level: 'B2',
            title: 'Passiv та Konjunktiv II',
            summary: 'Passiv виражає дію над об’єктом (werden + Partizip II). Konjunktiv II виражає ввічливе прохання або нереальну умову (würde + Infinitiv або wäre/hätte).',
            formula: 'Passiv: Das Haus wird gebaut.\nKonjunktiv II: Wenn ich Zeit hätte, käme ich gern.',
            mnemonic: '"Hätte" (якби мав), "wäre" (якби був), "würde" (робив би).',
            examples: [
              'Könnten Sie mir bitte helfen? (Ввічливе прохання)',
              'Der Test wurde pünktlich abgegeben.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'de-q-a1',
            level: 'A1',
            question: 'Вставте правильну форму дієслова "wohnen": "Wo ... du?"',
            options: [
              { text: 'wohne', isCorrect: false },
              { text: 'wohnst', isCorrect: true },
              { text: 'wohnt', isCorrect: false },
              { text: 'wohnen', isCorrect: false }
            ],
            explanation: 'Для займенника 2-ї особи "du" дієслово отримує закінчення -st: "wohnst".'
          },
          {
            id: 'de-q-a2',
            level: 'A2',
            question: 'Вставте правильний артикль: "Ich gehe morgen mit ... Freundin ins Kino."',
            options: [
              { text: 'meine', isCorrect: false },
              { text: 'meiner', isCorrect: true },
              { text: 'meinen', isCorrect: false },
              { text: 'meinem', isCorrect: false }
            ],
            explanation: 'Прийменник "mit" завжди вимагає Dativ. Жіночий рід у Dativ отримує закінчення -er (meiner Freundin).'
          },
          {
            id: 'de-q-b1',
            level: 'B1',
            question: 'Оберіть правильний порядок слів: "Er bleibt heute zu Hause, weil er krank ..."',
            options: [
              { text: 'ist', isCorrect: true },
              { text: 'wird sein', isCorrect: false },
              { text: 'war gewesen', isCorrect: false },
              { text: 'hat', isCorrect: false }
            ],
            explanation: 'У підрядному реченні зі сполучником "weil" відмінюване дієслово стоїть наприкінці речення.'
          }
        ],
        blitzQuestions: [
          { level: 'A1', q: 'Як німецькою звучить ввічливе звертання "Будь ласка"?', a: 'Bitte.' },
          { level: 'A2', q: 'Які допоміжні дієслова використовуються для утворення Perfekt?', a: 'Haben та sein (sein — для руху та зміни стану).' },
          { level: 'B1', q: 'Яке місце займає дієслово у підрядному реченні з "dass" або "weil"?', a: 'Останнє місце в реченні.' }
        ],
        whiteboardFormulas: [
          'Dativ (Wo?): dem (m), der (f), dem (n), den + -n (pl)',
          'Akkusativ (Wohin?): den (m), die (f), das (n), die (pl)',
          'Dativ-Präpositionen: aus, bei, mit, nach, seit, von, zu',
          'Akkusativ-Präpositionen: durch, für, gegen, ohne, um'
        ]
      },

      // =======================================================================
      // 3. Español (Language Mode)
      // =======================================================================
      espanol: {
        rules: [
          {
            level: 'A1',
            title: 'Різниця між дієсловами Ser та Estar',
            summary: 'Ser вживається для постійних рис (походження, професія, риси характеру). Estar — для місцезнаходження та тимчасового стану (настрій, самопочуття).',
            formula: 'SER: DOCTOR (Description, Occupation, Characteristic)\nESTAR: PLACE (Position, Location, Condition)',
            mnemonic: 'How you feel and where you are, always use the verb ESTAR!',
            examples: [
              'Soy ucraniano y soy estudiante. (Ser)',
              'Estoy en Kyiv y estoy contento. (Estar)'
            ]
          },
          {
            level: 'A2',
            title: 'Pretérito Indefinido vs Pretérito Perfecto',
            summary: 'Pretérito Indefinido виражає дію в завершеному відрізку часу (ayer, en 2020). Pretérito Perfecto — у незавершеному періоді (hoy, esta semana, nunca).',
            formula: 'Indefinido: hablé, comí | Perfecto: he hablado, he comido',
            mnemonic: 'Ayer (вчора) -> Indefinido! Hoy (сьогодні) -> Perfecto!',
            examples: [
              'Ayer visité el museo. (Indefinido)',
              'Hoy he tomado un café delicioso. (Perfecto)'
            ]
          },
          {
            level: 'B1',
            title: 'Presente de Subjuntivo (Базове вживання)',
            summary: 'Subjuntivo вживається для вираження бажання, сумніву, поради або емоцій після слів Quiero que..., Es necesario que...',
            formula: 'Verbo de deseo + que + Subjuntivo (hablar -> hable, comer -> coma)',
            mnemonic: 'Закінчення міняються навпаки: для -ar стає -e, для -er/-ir стає -a!',
            examples: ['Quiero que estudies todos los días.']
          }
        ],
        quizzes: [
          {
            id: 'es-q-a1',
            level: 'A1',
            question: 'Оберіть правильну форму: "¿Dónde ... la biblioteca nacional?"',
            options: [
              { text: 'es', isCorrect: false },
              { text: 'está', isCorrect: true },
              { text: 'son', isCorrect: false },
              { text: 'están', isCorrect: false }
            ],
            explanation: 'Для розташування об’єктів у просторі завжди вживається Estar (está).'
          },
          {
            id: 'es-q-a2',
            level: 'A2',
            question: 'Вставте правильну форму минулого часу: "Ayer nosotros ... una película interesante."',
            options: [
              { text: 'vimos', isCorrect: true },
              { text: 'hemos visto', isCorrect: false },
              { text: 'vemos', isCorrect: false },
              { text: 'veíamos', isCorrect: false }
            ],
            explanation: 'Слово-маркер "ayer" (вчора) вимагає вживання Pretérito Indefinido: "vimos".'
          }
        ],
        blitzQuestions: [
          { level: 'A1', q: 'Як іспанською сказати "Привіт" та "Дякую"?', a: '¡Hola! та ¡Gracias!' },
          { level: 'A2', q: 'Яке закінчення мають дієслова 1-ї дієвідміни в інфінітиві?', a: 'Закінчення -ar (hablar, cantar).' }
        ],
        whiteboardFormulas: [
          'SER: yo soy, tú eres, él es, nosotros somos, ellos son',
          'ESTAR: yo estoy, tú estás, él está, nosotros estamos, ellos están',
          'Subjuntivo: cambiar -ar por -e, -er/-ir por -a'
        ]
      },

      // =======================================================================
      // 4. Chinese (中文 - Language Mode)
      // =======================================================================
      chinese: {
        rules: [
          {
            level: 'A1',
            title: '4 тони китайської мови (Pinyin) та базовий порядок слів',
            summary: 'Китайська мова тональна: зміна тону змінює значення слова. Порядок слів: Підмет + Присудок + Додаток.',
            formula: '1-й: ā (рівний), 2-й: á (висхідний), 3-й: ǎ (спадно-висхідний), 4-й: à (різкий спадний)',
            mnemonic: '1-й тон — як спів ноти, 2-й — здивоване "Що?", 3-й — задумливе "Гм...", 4-й — рішуче "Ні!".',
            examples: ['你好 (Nǐ hǎo) — Привіт!', '谢谢 (Xièxie) — Дякую!']
          },
          {
            level: 'A2',
            title: 'Часова частка 了 (le) та модальне дієслово 想 (xiǎng)',
            summary: 'Частка 了 після дієслова позначає завершення дії. 想 виражає бажання ("хотіти / планувати").',
            formula: 'Підмет + 想 + Дієслово | Підмет + Дієслово + 了',
            mnemonic: '了 — не просто минулий час, а маркер реалізованої зміни стану!',
            examples: ['我已经吃饱了 (Wǒ yǐjīng chī bǎo le) — Я вже наївся.']
          }
        ],
        quizzes: [
          {
            id: 'zh-q-a1',
            level: 'A1',
            question: 'Як китайською перекладається вираз "Дякую"?',
            options: [
              { text: 'Nǐ hǎo (你好)', isCorrect: false },
              { text: 'Xièxie (谢谢)', isCorrect: true },
              { text: 'Zàijiàn (再见)', isCorrect: false },
              { text: 'Duìbuqǐ (对不起)', isCorrect: false }
            ],
            explanation: 'Xièxie (谢谢) означає "Дякую".'
          },
          {
            id: 'zh-q-a2',
            level: 'A2',
            question: 'Яка частка перетворює стверджувальне речення на загальне запитання?',
            options: [
              { text: '吗 (ma)', isCorrect: true },
              { text: '的 (de)', isCorrect: false },
              { text: '了 (le)', isCorrect: false },
              { text: '呢 (ne)', isCorrect: false }
            ],
            explanation: 'Частка 吗 (ma) ставиться в кінці для утворення питання (Nǐ hǎo ma?).'
          }
        ],
        blitzQuestions: [
          { level: 'A1', q: 'Скільки основних тонів має стандартний путунхуа?', a: '4 основні тони + 1 легкий нейтральний тон.' },
          { level: 'A2', q: 'Як сказати "до побачення" китайською?', a: '再见 (Zàijiàn).' }
        ],
        whiteboardFormulas: [
          '1-й тон: ā, 2-й: á, 3-й: ǎ, 4-й: à',
          'Базова структура: Хто + Коли + Де + Робить що'
        ]
      },

      // =======================================================================
      // 5. Ukrainian Language (General & Level Mode)
      // =======================================================================
      ukrainian: {
        rules: [
          {
            level: 'A1',
            title: 'Алфавіт, наголос та рід іменників',
            summary: 'В українській мові 33 літери. Іменники поділяються на чоловічий, жіночий та середній рід.',
            formula: 'Він (ч.р.), Вона (ж.р.), Воно (с.р.)',
            mnemonic: 'Іменники на -о, -е, -я (теля) зазвичай середнього роду!',
            examples: ['Стіл (він), книга (вона), вікно (воно).']
          },
          {
            level: 'B1',
            title: 'Апостроф та спрощення в групах приголосних',
            summary: 'Апостроф ставиться після губних [б, п, в, м, ф] перед я, ю, є, ї. Спрощення відбувається у групах стн -> сн, здн -> зн.',
            formula: 'МаВПа БУФ + я, ю, є, ї -> б’ю, п’ять, м’ясо',
            mnemonic: 'Винятки без апострофа: свято, тьмяний, духмяний, морквяний.',
            examples: ['М’ята, солов’ї, чесний, тижневий.']
          },
          {
            level: 'B2',
            title: 'Новий український правопис 2019: ключові зміни',
            summary: 'Слова з першою частиною "пів" пишуться окремо: пів яблука, пів Києва, пів години.',
            formula: 'пів + іменник у Р.в. = окремо',
            mnemonic: 'Разом пишемо лише слова, що є єдиним поняттям: півкуля, півмісяць, півострів!',
            examples: ['пів міста, пів Європи, пів аркуша.']
          }
        ],
        quizzes: [
          {
            id: 'ukr-q-b1',
            level: 'B1',
            question: 'Укажіть слово, у якому обов’язково пишеться апостроф:',
            options: [
              { text: 'св..ято', isCorrect: false },
              { text: 'духм..яний', isCorrect: false },
              { text: 'торф..яний', isCorrect: true },
              { text: 'моркв..яний', isCorrect: false }
            ],
            explanation: 'У слові "торф’яний" перед губним [ф] є звук [р], тому апостроф пишеться за правилом.'
          },
          {
            id: 'ukr-q-b2',
            level: 'B2',
            question: 'Як за новим правописом 2019 року пишеться вираз "пів/години"?',
            options: [
              { text: 'півгодини (разом)', isCorrect: false },
              { text: 'пів години (окремо)', isCorrect: true },
              { text: 'пів-години (через дефіс)', isCorrect: false },
              { text: 'пів’години (з апострофом)', isCorrect: false }
            ],
            explanation: 'Незмінюваний числівник "пів" зі значенням "половина" пишеться окремо з наступним іменником.'
          }
        ],
        blitzQuestions: [
          { level: 'B1', q: 'Назвіть літери, після яких ставиться апостроф за правилом МаВПа БУФ.', a: 'Б, П, В, М, Ф та Р.' },
          { level: 'B2', q: 'Як правильно писати "пів Києва"?', a: 'Окремо: пів Києва.' }
        ],
        whiteboardFormulas: [
          'МаВПа БУФ + я, ю, є, ї',
          'Винятки: свято, тьмяний, духмяний, морквяний',
          'Новий правопис: пів яблука, пів міста (окремо)'
        ]
      },

      // =======================================================================
      // 6. Math (School & NMT Mode) — STRICT GRADE ISOLATION
      // =======================================================================
      math: {
        rules: [
          // GRADE 5-7: ABSOLUTELY NO LOGARITHMS, DERIVATIVES, OR INTEGRALS!
          {
            grade: 'grade-5-7',
            title: 'Звичайні та десяткові дроби: спільний знаменник',
            summary: 'Щоб додати чи відняти звичайні дроби з різними знаменниками, їх зводять до спільного знаменника за допомогою НСК знаменників.',
            formula: 'a/b ± c/d = (a·d ± c·b) / (b·d)',
            mnemonic: 'Знаменник — це на скільки частин поділили торт, а чисельник — скільки шматочків взяли!',
            examples: [
              '1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2.',
              '0.25 + 0.75 = 1.00.'
            ]
          },
          {
            grade: 'grade-5-7',
            title: 'Відсотки, пропорції та сума кутів трикутника',
            summary: 'Відсоток — це сота частина числа (1% = 0.01). Основна властивість пропорції: добуток крайніх членів дорівнює добутку середніх. Сума кутів будь-якого трикутника дорівнює 180°.',
            formula: 'Якщо a/b = c/d, то a·d = b·c | ∠A + ∠B + ∠C = 180°',
            mnemonic: 'Трикутник на площині завжди містить рівно 180 градусів!',
            examples: [
              '20% від 150 = 150 · 0.20 = 30.',
              'Якщо кути 50° і 60°, третій кут = 180° - 110° = 70°.'
            ]
          },

          // GRADE 8-9
          {
            grade: 'grade-8-9',
            title: 'Квадратні рівняння, дискримінант та теорема Вієта',
            summary: 'Для зведеного квадратного рівняння x² + px + q = 0 сума коренів дорівнює -p, а добуток дорівнює q. Для загального ax² + bx + c = 0 розраховують D = b² - 4ac.',
            formula: 'D = b² - 4ac | x₁,₂ = (-b ± √D) / (2a) | x₁ + x₂ = -p, x₁ · x₂ = q',
            mnemonic: 'Якщо D > 0 — два різні корені, D = 0 — один подвійний, D < 0 — дійсних коренів немає.',
            examples: [
              'x² - 5x + 6 = 0: корені 2 та 3 (2+3=5, 2·3=6).'
            ]
          },
          {
            grade: 'grade-8-9',
            title: 'Теорема Піфагора та арифметична прогресія',
            summary: 'У прямокутному трикутнику квадрат гіпотенузи дорівнює сумі квадратів катетів: c² = a² + b². В арифметичній прогресії кожен наступний член збільшується на різницю d.',
            formula: 'c² = a² + b² | a_n = a_1 + (n - 1)·d',
            mnemonic: 'Піфагорові штани: єгипетський трикутник має сторони 3, 4, 5!',
            examples: [
              'Катети 6 і 8 см -> гіпотенуза √(36 + 64) = √100 = 10 см.'
            ]
          },

          // NMT-200 / GRADE 10-11 / OLYMPIAD
          {
            grade: 'nmt-200',
            title: 'Логарифмічні рівняння та область допустимих значень (ОДЗ)',
            summary: 'При розв’язуванні логарифмічних рівнянь найперший крок — ОДЗ: підлогарифмічний вираз > 0, основа > 0 та основа ≠ 1. Сторонні корені обов’язково відкидаються!',
            formula: 'log_a(x) = b <=> x = a^b (a > 0, a ≠ 1, x > 0)',
            mnemonic: 'Головна пастка НМТ: розв’язати квадратне рівняння і забути перевірити ОДЗ логарифма!',
            examples: [
              'log₂(x - 3) = 3 => ОДЗ: x > 3 => x - 3 = 8 => x = 11.'
            ]
          },
          {
            grade: 'nmt-200',
            title: 'Похідна функції та геометричний зміст',
            summary: 'Похідна функції в точці дорівнює кутовому коефіцієнту дотичної до графіка функції в цій точці: k = tg α = f’(x₀).',
            formula: '(xⁿ)’ = n·xⁿ⁻¹ | (sin x)’ = cos x | k = f’(x₀)',
            mnemonic: 'Швидкість зміни функції — це і є її похідна!',
            examples: [
              'f(x) = 3x² - 4x => f’(x) = 6x - 4. При x₀ = 2: f’(2) = 8.'
            ]
          }
        ],
        quizzes: [
          // 5-7 клас: STRICTLY NO ADVANCED CALCULUS
          {
            id: 'math-q-57-1',
            grade: 'grade-5-7',
            question: 'Обчисліть значення виразу: 3/4 + 1/2. Запишіть результат у вигляді десяткового дробу або правильного мішаного числа.',
            options: [
              { text: '1.25 (або 1 ціла 1/4)', isCorrect: true },
              { text: '4/6', isCorrect: false },
              { text: '0.85', isCorrect: false },
              { text: '1.5', isCorrect: false }
            ],
            explanation: 'Зводимо до спільного знаменника 4: 1/2 = 2/4. Тоді 3/4 + 2/4 = 5/4 = 1.25.'
          },
          {
            id: 'math-q-57-2',
            grade: 'grade-5-7',
            question: 'У трикутнику два кути дорівнюють 45° та 65°. Знайдіть градусну міру третього кута.',
            options: [
              { text: '70°', isCorrect: true },
              { text: '80°', isCorrect: false },
              { text: '90°', isCorrect: false },
              { text: '60°', isCorrect: false }
            ],
            explanation: 'Сума кутів будь-якого трикутника становить 180°. Третій кут = 180° - (45° + 65°) = 180° - 110° = 70°.'
          },
          {
            id: 'math-q-57-3',
            grade: 'grade-5-7',
            question: 'Ціна товару становила 400 грн, а потім знизилася на 15%. Яка нова ціна товару?',
            options: [
              { text: '340 грн', isCorrect: true },
              { text: '360 грн', isCorrect: false },
              { text: '385 грн', isCorrect: false },
              { text: '320 грн', isCorrect: false }
            ],
            explanation: '15% від 400 грн становить 400 · 0.15 = 60 грн. Нова ціна: 400 - 60 = 340 грн.'
          },

          // 8-9 клас
          {
            id: 'math-q-89-1',
            grade: 'grade-8-9',
            question: 'Гіпотенуза прямокутного трикутника дорівнює 10 см, а один із катетів — 6 см. Знайдіть площу трикутника.',
            options: [
              { text: '24 см²', isCorrect: true },
              { text: '48 см²', isCorrect: false },
              { text: '30 см²', isCorrect: false },
              { text: '60 см²', isCorrect: false }
            ],
            explanation: 'За теоремою Піфагора другий катет b = √(10² - 6²) = √64 = 8 см. Площа S = (6 · 8) / 2 = 24 см².'
          },
          {
            id: 'math-q-89-2',
            grade: 'grade-8-9',
            question: 'Знайдіть суму коренів квадратного рівняння x² - 7x + 10 = 0 за теоремою Вієта.',
            options: [
              { text: '7', isCorrect: true },
              { text: '-7', isCorrect: false },
              { text: '10', isCorrect: false },
              { text: '3', isCorrect: false }
            ],
            explanation: 'За теоремою Вієта для x² + px + q = 0 сума коренів дорівнює -p: x₁ + x₂ = -(-7) = 7.'
          },

          // 10-11 / NMT-200 / Olympiad
          {
            id: 'math-q-nmt-1',
            grade: 'nmt-200',
            question: 'Розв’яжіть рівняння: log₂(x - 3) + log₂(x - 1) = 3. У відповідь запишіть дійсний корінь.',
            options: [
              { text: 'x = 5 (корінь x = -1 сторонній через ОДЗ)', isCorrect: true },
              { text: 'x = 5 та x = -1', isCorrect: false },
              { text: 'x = 4', isCorrect: false },
              { text: 'Рівняння не має коренів', isCorrect: false }
            ],
            explanation: 'ОДЗ: x - 3 > 0 і x - 1 > 0 => x > 3. log₂((x-3)(x-1)) = 3 => x² - 4x + 3 = 8 => x² - 4x - 5 = 0. Корені 5 та -1. Корінь -1 не входить в ОДЗ, тому єдиний корінь x = 5.'
          },
          {
            id: 'math-q-nmt-2',
            grade: 'nmt-200',
            question: 'Знайдіть значення похідної функції f(x) = 3x⁴ - 5x² + 7 у точці x₀ = 1.',
            options: [
              { text: '2', isCorrect: true },
              { text: '5', isCorrect: false },
              { text: '7', isCorrect: false },
              { text: '-2', isCorrect: false }
            ],
            explanation: 'Похідна: f’(x) = 12x³ - 10x. Підставляємо x₀ = 1: f’(1) = 12(1) - 10(1) = 2.'
          }
        ],
        blitzQuestions: [
          { grade: 'grade-5-7', q: 'Чому дорівнює сума кутів будь-якого трикутника на площині?', a: '180 градусів.' },
          { grade: 'grade-5-7', q: 'Як знайти 25% від числа 200?', a: 'Поділити на 4 (або помножити на 0.25): 50.' },
          { grade: 'grade-5-7', q: 'Чому дорівнює НСК чисел 4 і 6?', a: '12.' },
          { grade: 'grade-8-9', q: 'Як записується теорема Піфагора для сторін a, b та гіпотенузи c?', a: 'a² + b² = c².' },
          { grade: 'grade-8-9', q: 'Чому дорівнює дискримінант квадратного рівняння ax² + bx + c = 0?', a: 'D = b² - 4ac.' },
          { grade: 'nmt-200', q: 'Чому дорівнює sin²α + cos²α для будь-якого кута α?', a: '1 (основна тригонометрична тотожність).' },
          { grade: 'nmt-200', q: 'Чому дорівнює log_a(1) для будь-якої основи a > 0, a ≠ 1?', a: 'log_a(1) = 0.' },
          { grade: 'nmt-200', q: 'Чому дорівнює похідна функції sin(x)?', a: 'cos(x).' }
        ],
        whiteboardFormulas: [
          '5-7: 180° в трикутнику | a/b = c/d => a·d = b·c',
          '8-9: D = b² - 4ac | a² + b² = c² | a_n = a_1 + (n-1)d',
          'НМТ 200: log_a(xy) = log_a x + log_a y | (xⁿ)’ = n·xⁿ⁻¹ | sin²x + cos²x = 1'
        ]
      },

      // =======================================================================
      // 7. Ukrainian Language (School & NMT) — STRICT GRADE ISOLATION
      // =======================================================================
      'ukr-lang': {
        rules: [
          // GRADE 5-7
          {
            grade: 'grade-5-7',
            title: 'Частини мови та префікси пре-, при-, прі-',
            summary: 'Префікс пре- виражає найвищий ступінь ознаки (можна замінити словом "дуже": прекрасний = дуже красивий). Префікс при- вказує на наближення, приєднання, неповноту дії (приїхати, приклеїти). Префікс прі- вживається лише у трьох словах: прізвище, прірва, прізвисько.',
            formula: 'пре- = дуже | при- = наближення | прі- = прізвище, прірва, прізвисько',
            mnemonic: 'Прізвище біля прірви дало йому прізвисько — лише 3 слова з прі-!',
            examples: ['Премудрий (дуже мудрий), присісти (неповнота дії), прізвище.']
          },
          {
            grade: 'grade-5-7',
            title: 'Головні та другорядні члени речення',
            summary: 'Граматична основа — підмет (Хто? Що?) і присудок (Що робить підмет?). Другорядні: додаток (непрямі відмінки), означення (Який? Чий?), обставина (Де? Куди? Як?).',
            formula: 'Підмет (підкреслюємо _) + Присудок (підкреслюємо =)',
            mnemonic: 'Означення хвилясте (~), обставина штрих-пунктир (_._._).',
            examples: ['Золоте сонце лагідно зігріває землю.']
          },

          // GRADE 8-9
          {
            grade: 'grade-8-9',
            title: 'Однорідні члени речення та відокремлені обставини',
            summary: 'Однорідні члени відповідають на одне питання і залежать від одного слова. Відокремлені обставини, виражені дієприслівниковим зворотом, завжди виділяються комами.',
            formula: 'Дієприслівниковий зворот (що роблячи? що зробивши?) = завжди коми!',
            mnemonic: 'Дієприслівник робить додаткову дію того ж підмета!',
            examples: ['Побачивши панда-вчителя, учень щиро посміхнувся.']
          },

          // NMT-200
          {
            grade: 'nmt-200',
            title: 'Нормативні наголоси УЦОЯО та лексичні антикальки',
            summary: 'Наголоси, які найчастіше зустрічаються в тестах НМТ. Також усуваємо кальки: брати участь (а не приймати участь), протягом години (а не на протязі).',
            formula: 'чорнОзем, одинАдцять, експЕрт, мерЕжа, фОльга, вИпадок',
            mnemonic: 'Віршик НМТ: "Трапився вИпадок — чорнОзем упав на килимок! ДочкА взяла експЕрта, перевірили мерЕжу!"',
            examples: ['чорнОзем, дочкА, експЕрт, одинАдцять, фОльга.']
          }
        ],
        quizzes: [
          // 5-7 клас
          {
            id: 'ukr-q-57-1',
            grade: 'grade-5-7',
            question: 'У якому рядку в усіх словах пишеться префікс пре-?',
            options: [
              { text: 'пр..чудовий, пр..мудрий, пр..великий', isCorrect: true },
              { text: 'пр..їхати, пр..сісти, пр..милий', isCorrect: false },
              { text: 'пр..звище, пр..рва, пр..красний', isCorrect: false },
              { text: 'пр..нести, пр..летіти, пр..дорожній', isCorrect: false }
            ],
            explanation: 'Префікс пре- пишеться зі значенням найвищого ступеня ознаки ("дуже"): пречудовий, премудрий, превеликий.'
          },
          {
            id: 'ukr-q-57-2',
            grade: 'grade-5-7',
            question: 'Укажіть речення, у якому виділене слово є підметом:',
            options: [
              { text: 'Яскраве **сонце** зійшло над Карпатами.', isCorrect: true },
              { text: 'Ми зустріли **сонце** на вершині гори.', isCorrect: false },
              { text: 'Квіти тягнуться до **сонця**.', isCorrect: false },
              { text: 'Усе навколо залите **сонцем**.', isCorrect: false }
            ],
            explanation: 'У реченні "Сонце зійшло" слово "сонце" відповідає на питання "Що?" у називному відмінку і виконує дію.'
          },

          // 8-9 клас
          {
            id: 'ukr-q-89-1',
            grade: 'grade-8-9',
            question: 'Пунктуаційну помилку при відокремленій обставині допущено в рядку:',
            options: [
              { text: 'Вийшовши з бібліотеки пішов дощ.', isCorrect: true },
              { text: 'Вийшовши з бібліотеки, хлопець розгорнув нову книгу.', isCorrect: false },
              { text: 'Слухаючи пояснення вчителя, учні робили записи.', isCorrect: false },
              { text: 'Зробивши вправу, ми перевірили відповіді.', isCorrect: false }
            ],
            explanation: 'Дієприслівниковий зворот вимагає, щоб додаткова дія виконувалася тим самим суб’єктом (дощ не міг вийти з бібліотеки).'
          },

          // NMT-200
          {
            id: 'ukr-q-nmt-1',
            grade: 'nmt-200',
            question: 'Укажіть рядок, у якому в усіх словах наголос падає на другий склад:',
            options: [
              { text: 'чорнозем, дочка, експерт', isCorrect: true },
              { text: 'випадок, чорнозем, дочка', isCorrect: false },
              { text: 'чорнозем, одинадцять, експерт', isCorrect: false },
              { text: 'фольга, мережа, жалюзі', isCorrect: false }
            ],
            explanation: 'За нормами УЦОЯО: чорнОзем, дочкА, експЕрт (на 2-й склад). У слові вИпадок — на 1-й, одинАдцять — на 3-й.'
          },
          {
            id: 'ukr-q-nmt-2',
            grade: 'nmt-200',
            question: 'Лексичну помилку допущено в рядку:',
            options: [
              { text: 'приймати участь у тестуванні', isCorrect: true },
              { text: 'брати участь у змаганнях', isCorrect: false },
              { text: 'протягом навчального року', isCorrect: false },
              { text: 'скасувати зустріч', isCorrect: false }
            ],
            explanation: 'Нормативна українська форма — "брати участь". Конструкція "приймати участь" є грубою калькою.'
          }
        ],
        blitzQuestions: [
          { grade: 'grade-5-7', q: 'Які три слова в українській мові мають префікс прі-?', a: 'Прізвище, прірва, прізвисько.' },
          { grade: 'grade-5-7', q: 'На які питання відповідає іменник?', a: 'Хто? Що?' },
          { grade: 'grade-8-9', q: 'Чим зазвичай виражається відокремлена обставина?', a: 'Дієприслівником або дієприслівниковим зворотом.' },
          { grade: 'nmt-200', q: 'На який склад падає наголос у слові "випадок"?', a: 'На перший склад: вИпадок.' },
          { grade: 'nmt-200', q: 'Як правильно: "на протязі години" чи "протягом години"?', a: 'Протягом години (або впродовж години).' }
        ],
        whiteboardFormulas: [
          '5-7: пре- = дуже | при- = наближення | прі- (3 слова)',
          '8-9: Дієприслівниковий зворот = дія того самого підмета',
          'НМТ 200: чорнОзем, вИпадок, одинАдцять, фОльга, експЕрт'
        ]
      },

      // =======================================================================
      // 8. History of Ukraine — STRICT GRADE ISOLATION
      // =======================================================================
      history: {
        rules: [
          // GRADE 5-7
          {
            grade: 'grade-5-7',
            title: 'Заснування Києва, князі Русі та Запорозька Січ',
            summary: 'Київ заснували брати Кий, Щек, Хорив та їхня сестра Либідь. Князь Володимир Великий охрестив Русь у 988 р., а Ярослав Мудрий збудував Софійський собор та уклав "Руську Правду". Першу Запорозьку Січ заснував Дмитро Вишневецький у 1556 р. на Хортиці. Козацькі клейноди: булава, бунчук, корогва, печатка.',
            formula: '988 — Хрещення Русі | 1556 — Заснування Січі на Хортиці',
            mnemonic: 'Володимир хрестив (988), Ярослав Мудрий розбудовував (1019-1054), Вишневецький збудував першу Січ (1556)!',
            examples: ['Булава — символ гетьманської влади.']
          },

          // GRADE 8-9
          {
            grade: 'grade-8-9',
            title: 'Національно-визвольна війна та українське відродження XIX ст.',
            summary: 'Національно-визвольна війна під проводом Богдана Хмельницького (1648–1657 рр.): битви на Жовтих Водах, Корсуні, Пилявцях. У XIX ст. відродження започаткували "Русалка Дністровая" (1837) та Кирило-Мефодіївське братство (1845–1847) за участі Т. Шевченка.',
            formula: '1648 — Жовті Води | 1837 — Русалка Дністровая | 1845 — Кирило-Мефодіївці',
            mnemonic: '1648 — рік козацької слави і створення Гетьманщини!',
            examples: ['Зборівський договір 1649 р. визначив кордони трьох воєводств: Київського, Брацлавського, Чернігівського.']
          },

          // NMT-200
          {
            grade: 'nmt-200',
            title: 'ХХ століття: Визвольні змагання, Голодомор та Незалежність',
            summary: 'Українська революція: IV Універсал (22 січня 1918 р. — незалежність УНР), бій під Крутами (29 січня 1918 р.). Голодомор 1932–1933 рр. — геноцид українців. Чорнобиль (26 квітня 1986 р.). Акт проголошення незалежності України — 24 серпня 1991 р.',
            formula: '1918 — IV Універсал і Крути | 1932-1933 — Голодомор | 1991 — Незалежність',
            mnemonic: 'Ланцюжок державності: 1918 (IV Універсал) -> 1991 (24 серпня Акт незалежності)!',
            examples: ['Бій під Крутами зупинив наступ більшовиків на Київ, дозволивши укласти Берестейський мир.']
          }
        ],
        quizzes: [
          // 5-7 клас
          {
            id: 'hist-q-57-1',
            grade: 'grade-5-7',
            question: 'У якому році князь Володимир Великий охрестив Русь, запровадивши християнство як державну релігію?',
            options: [
              { text: '988 рік', isCorrect: true },
              { text: '882 рік', isCorrect: false },
              { text: '1054 рік', isCorrect: false },
              { text: '1240 рік', isCorrect: false }
            ],
            explanation: 'У 988 році князь Володимир Великий здійснив хрещення киян у водах річки Почайни.'
          },
          {
            id: 'hist-q-57-2',
            grade: 'grade-5-7',
            question: 'Хто заснував першу Запорозьку Січ на острові Мала Хортиця близько 1556 року?',
            options: [
              { text: 'Дмитро (Байда) Вишневецький', isCorrect: true },
              { text: 'Богдан Хмельницький', isCorrect: false },
              { text: 'Петро Конашевич-Сагайдачний', isCorrect: false },
              { text: 'Іван Мазепа', isCorrect: false }
            ],
            explanation: 'У 1556 році князь Дмитро Вишневецький спорудив дерев’яно-земляний замок на острові Мала Хортиця.'
          },

          // 8-9 клас
          {
            id: 'hist-q-89-1',
            grade: 'grade-8-9',
            question: 'Яка битва була першою перемогою козацького війська на початку Національно-визвольної війни у травні 1648 року?',
            options: [
              { text: 'Битва на Жовтих Водах', isCorrect: true },
              { text: 'Корсунська битва', isCorrect: false },
              { text: 'Пилявецька битва', isCorrect: false },
              { text: 'Берестецька битва', isCorrect: false }
            ],
            explanation: 'У травні 1648 року в урочищі Жовті Води військо Богдана Хмельницького здобуло першу блискучу перемогу над коронним військом.'
          },

          // NMT-200
          {
            id: 'hist-q-nmt-1',
            grade: 'nmt-200',
            question: 'Коли відбувся героїчний бій під Крутами київських курсантів та гімназистів проти більшовицьких військ Муравйова?',
            options: [
              { text: '29 січня 1918 року', isCorrect: true },
              { text: '22 січня 1919 року', isCorrect: false },
              { text: '1 листопада 1918 року', isCorrect: false },
              { text: '25 жовтня 1917 року', isCorrect: false }
            ],
            explanation: '29 січня 1918 року біля залізничної станції Крути відбувся бій українських юнаків проти наступаючих червоногвардійців.'
          },
          {
            id: 'hist-q-nmt-2',
            grade: 'nmt-200',
            question: 'Яка знаменна подія сталася в Україні 24 серпня 1991 року?',
            options: [
              { text: 'Ухвалення Акта проголошення незалежності України', isCorrect: true },
              { text: 'Прийняття Конституції України', isCorrect: false },
              { text: 'Проведення Всеукраїнського референдуму', isCorrect: false },
              { text: 'Декларація про державний суверенітет України', isCorrect: false }
            ],
            explanation: '24 серпня 1991 року Верховна Рада УРСР конституційною більшістю ухвалила Акт проголошення незалежності України.'
          }
        ],
        blitzQuestions: [
          { grade: 'grade-5-7', q: 'Як звали братів та сестру — легендарних засновників Києва?', a: 'Кий, Щек, Хорив та сестра Либідь.' },
          { grade: 'grade-5-7', q: 'Що таке булава в українському козацтві?', a: 'Головний клейнод, символ верховної влади гетьмана або кошового отамана.' },
          { grade: 'grade-8-9', q: 'У якому році вийшов друком альманах "Русалка Дністровая"?', a: 'У 1837 році в Будапешті.' },
          { grade: 'nmt-200', q: 'Якого числа і року Верховна Рада ухвалила Конституцію України?', a: '28 червня 1996 року.' },
          { grade: 'nmt-200', q: 'У якому році сталася катастрофа на Чорнобильській АЕС?', a: '26 квітня 1986 року.' }
        ],
        whiteboardFormulas: [
          '5-7: 988 — Хрещення Русі | 1556 — Січ на Хортиці',
          '8-9: 1648 — Жовті Води | 1837 — Русалка Дністровая',
          'НМТ 200: 29.01.1918 — Крути | 24.08.1991 — Незалежність України'
        ]
      },

      // =======================================================================
      // 9. English for NMT (School & NMT Mode) — STRICT GRADE ISOLATION
      // =======================================================================
      'eng-nmt': {
        rules: [
          // GRADE 5-7
          {
            grade: 'grade-5-7',
            title: 'Present Simple and Plural Nouns',
            summary: 'Present Simple: дія відбувається щодня (every day, usually). У 3-й особі однини (he, she, it) додається закінчення -s або -es. Множина іменників: book -> books, але child -> children, man -> men.',
            formula: 'He/She/It + V-s | Irregular plurals: child -> children',
            mnemonic: 'He, she, it любить літеру -S на хвості дієслова!',
            examples: ['She likes apples.', 'They play football every Sunday.']
          },

          // GRADE 8-9
          {
            grade: 'grade-8-9',
            title: 'Past Simple vs Past Continuous & Comparison of Adjectives',
            summary: 'Past Continuous (was/were + V-ing) виражає тривалу дію в минулому, яку перервала коротка дія в Past Simple (V2). Порівняння прикметників: fast - faster - the fastest; interesting - more interesting.',
            formula: 'While I was studying (тривала дія), the phone rang (коротка дія).',
            mnemonic: 'While завжди любить Continuous (-ing)!',
            examples: ['While they were walking in the park, it began to rain.']
          },

          // NMT-200
          {
            grade: 'nmt-200',
            title: 'Gerund after Prepositions & Conditionals in NMT Cloze Tests',
            summary: 'Після сталих фраз із прийменниками (look forward to, succeed in, interested in) завжди вживається Gerund (V-ing), а не інфінітив! У 3rd Conditional: If + had + V3, would have + V3.',
            formula: 'look forward to + V-ing | If + had V3, would have V3',
            mnemonic: '"To" у виразі "look forward to" є прийменником, а не часткою інфінітива!',
            examples: [
              'I am looking forward to meeting you at university.',
              'If I had studied harder, I would have scored 200.'
            ]
          }
        ],
        quizzes: [
          // 5-7 клас
          {
            id: 'eng-nmt-q-57-1',
            grade: 'grade-5-7',
            question: 'Choose the correct form: "My sister usually ... to school by bicycle."',
            options: [
              { text: 'goes', isCorrect: true },
              { text: 'go', isCorrect: false },
              { text: 'is going', isCorrect: false },
              { text: 'went', isCorrect: false }
            ],
            explanation: '"My sister" — це 3-тя особа однини (she), тому в Present Simple додаємо -es: "goes".'
          },
          {
            id: 'eng-nmt-q-57-2',
            grade: 'grade-5-7',
            question: 'What is the correct plural form of the noun "child"?',
            options: [
              { text: 'children', isCorrect: true },
              { text: 'childs', isCorrect: false },
              { text: 'childrens', isCorrect: false },
              { text: 'childes', isCorrect: false }
            ],
            explanation: 'Іменник "child" має неправильну форму множини: "children".'
          },

          // 8-9 клас
          {
            id: 'eng-nmt-q-89-1',
            grade: 'grade-8-9',
            question: 'Choose the correct tense pair: "While we ... dinner, our guests ... at the door."',
            options: [
              { text: 'were having / knocked', isCorrect: true },
              { text: 'had / were knocking', isCorrect: false },
              { text: 'have had / knock', isCorrect: false },
              { text: 'were having / were knocking', isCorrect: false }
            ],
            explanation: 'Тривала фонова дія вживається в Past Continuous (were having), а дія, що перервала її, — у Past Simple (knocked).'
          },

          // NMT-200
          {
            id: 'eng-nmt-q-nmt-1',
            grade: 'nmt-200',
            question: 'Choose the correct form: "I am really looking forward to ... my student card in September."',
            options: [
              { text: 'receiving', isCorrect: true },
              { text: 'receive', isCorrect: false },
              { text: 'have received', isCorrect: false },
              { text: 'be received', isCorrect: false }
            ],
            explanation: 'Сталий вираз "look forward to" вимагає після себе герундія (V-ing): "looking forward to receiving".'
          }
        ],
        blitzQuestions: [
          { grade: 'grade-5-7', q: 'Яке закінчення додається до дієслова у Present Simple для he/she/it?', a: 'Закінчення -s або -es.' },
          { grade: 'grade-8-9', q: 'Яка вищий ступінь порівняння прикметника "good"?', a: 'Better (good - better - the best).' },
          { grade: 'nmt-200', q: 'Яка форма дієслова вживається після виразу "look forward to"?', a: 'Герундій (V-ing).' }
        ],
        whiteboardFormulas: [
          '5-7: He/She/It + V-s | irregular plurals',
          '8-9: While + Past Continuous, Past Simple',
          'НМТ 200: look forward to + V-ing | 3rd Cond: had V3 -> would have V3'
        ]
      },

      // =======================================================================
      // 10. Physics — STRICT GRADE ISOLATION
      // =======================================================================
      physics: {
        rules: [
          // GRADE 5-7
          {
            grade: 'grade-5-7',
            title: 'Швидкість руху, маса та густина речовини',
            summary: 'Швидкість рівномірного руху показує, який шлях проходить тіло за одиницю часу: v = s / t. Густина показує масу речовини в одиниці об’єму: ρ = m / V.',
            formula: 'v = s / t | ρ = m / V | F_тяж = m · g',
            mnemonic: 'Трикутник швидкості: затули пальцем s — отримаєш v · t!',
            examples: ['Автомобіль проїхав 120 км за 2 год -> швидкість v = 120 / 2 = 60 км/год.']
          },

          // GRADE 8-9
          {
            grade: 'grade-8-9',
            title: 'Другий закон Ньютона та Закон Ома',
            summary: 'Прискорення тіла прямо пропорційне прикладеній силі та обернено пропорційне масі: F = m · a. Закон Ома: сила струму прямо пропорційна напрузі й обернено пропорційна опору: I = U / R.',
            formula: 'F = m · a | I = U / R | P = U · I',
            mnemonic: '1 Ньютон = 1 кг · м/с². Закон Ома: U = I · R (Ура!).',
            examples: ['Тіло масою 4 кг під дією сили 12 Н рухається з прискоренням a = 12 / 4 = 3 м/с².']
          },

          // NMT-200 / GRADE 10-11
          {
            grade: 'nmt-200',
            title: 'Фотоефект та коливальний контур (Формула Томсона)',
            summary: 'Рівняння Ейнштейна для фотоефекту: hν = A_вих + (m·v²)/2. Період власних коливань в ідеальному коливальному контурі визначається формулою Томсона: T = 2π√(L·C).',
            formula: 'hν = A_вих + E_k | T = 2π√(LC) | E = hν',
            mnemonic: 'Томсон: "Два Пі під коренем Лілія і Калина (LC)"!',
            examples: ['При збільшенні ємності конденсатора у 4 рази період коливань збільшиться у 2 рази.']
          }
        ],
        quizzes: [
          // 5-7 клас
          {
            id: 'phys-q-57-1',
            grade: 'grade-5-7',
            question: 'Велосипедист подолав дистанцію 45 км за 3 години. Яка середня швидкість його руху?',
            options: [
              { text: '15 км/год', isCorrect: true },
              { text: '135 км/год', isCorrect: false },
              { text: '42 км/год', isCorrect: false },
              { text: '20 км/год', isCorrect: false }
            ],
            explanation: 'Швидкість обчислюється за формулою v = s / t = 45 км / 3 год = 15 км/год.'
          },

          // 8-9 клас
          {
            id: 'phys-q-89-1',
            grade: 'grade-8-9',
            question: 'Яка сила діє на візок масою 5 кг, якщо він рухається з прискоренням 2 м/с²?',
            options: [
              { text: '10 Н', isCorrect: true },
              { text: '2.5 Н', isCorrect: false },
              { text: '7 Н', isCorrect: false },
              { text: '25 Н', isCorrect: false }
            ],
            explanation: 'За ІІ законом Ньютона F = m · a = 5 кг · 2 м/с² = 10 Н.'
          },
          {
            id: 'phys-q-89-2',
            grade: 'grade-8-9',
            question: 'Резистор опором 20 Ом підключено до джерела напруги 100 В. Яка сила струму тече через резистор?',
            options: [
              { text: '5 А', isCorrect: true },
              { text: '2000 А', isCorrect: false },
              { text: '0.2 А', isCorrect: false },
              { text: '80 А', isCorrect: false }
            ],
            explanation: 'За законом Ома для ділянки кола I = U / R = 100 В / 20 Ом = 5 А.'
          },

          // 10-11 / NMT
          {
            id: 'phys-q-nmt-1',
            grade: 'nmt-200',
            question: 'Як зміниться період вільних електромагнітних коливань у контурі, якщо індуктивність котушки збільшити в 4 рази?',
            options: [
              { text: 'Збільшиться в 2 рази', isCorrect: true },
              { text: 'Збільшиться в 4 рази', isCorrect: false },
              { text: 'Зменшиться в 2 рази', isCorrect: false },
              { text: 'Не зміниться', isCorrect: false }
            ],
            explanation: 'За формулою Томсона T = 2π√(LC). Якщо L збільшити в 4 рази, то під коренем √4 = 2, отже період T збільшиться вдвічі.'
          }
        ],
        blitzQuestions: [
          { grade: 'grade-5-7', q: 'За якою формулою обчислюється швидкість рівномірного руху?', a: 'v = s / t.' },
          { grade: 'grade-8-9', q: 'Як записується закон Ома для ділянки кола?', a: 'I = U / R.' },
          { grade: 'grade-8-9', q: 'В яких одиницях СІ вимірюється робота та енергія?', a: 'У Джоулях (Дж).' },
          { grade: 'nmt-200', q: 'Чому дорівнює швидкість світла у вакуумі?', a: 'Приблизно 3·10⁸ м/с.' }
        ],
        whiteboardFormulas: [
          '5-7: v = s / t | ρ = m / V | F = mg',
          '8-9: F = ma | I = U / R | P = UI',
          'НМТ 200: T = 2π√(LC) | hν = A_вих + E_k'
        ]
      },

      // =======================================================================
      // 11. Biology — STRICT GRADE ISOLATION
      // =======================================================================
      biology: {
        rules: [
          // GRADE 5-7
          {
            grade: 'grade-5-7',
            title: 'Будова рослинної клітини та основи фотосинтезу',
            summary: 'Рослинна клітина відрізняється від тваринної наявністю целюлозної клітинної стінки, пластид (хлоропластів) та великої центральної вакуолі. Завдяки хлоропластам рослини здійснюють фотосинтез: виробляють органічні речовини та кисень за участі світла.',
            formula: 'Вуглекислий газ + Вода + Світло -> Глюкоза + Кисень (O₂)',
            mnemonic: 'Хлорофіл — зелений пігмент життя, що ловить сонячні промені!',
            examples: ['Кисень, яким ми дихаємо, є продуктом фотосинтезу рослин.']
          },

          // GRADE 8-9
          {
            grade: 'grade-8-9',
            title: 'Кровоносна система людини, серце та мітоз',
            summary: 'Серце людини чотирикамерне: 2 передсердя і 2 шлуночки. Велике коло кровообігу починається з лівого шлуночка (аорта) і закінчується у правому передсерді. Мітоз забезпечує утворення соматичних клітин з ідентичним диплоїдним набором хромосом (2n).',
            formula: 'Лівий шлуночок -> Аорта -> Тіло -> Праве передсердя (Велике коло)',
            mnemonic: 'Артерії несуть кров ВІД серця, вени — ДО серця!',
            examples: ['У результаті мітозу з однієї материнської клітини утворюються дві генетично ідентичні дочірні клітини (2n).']
          },

          // NMT-200 / GRADE 10-11
          {
            grade: 'nmt-200',
            title: 'Молекулярна генетика (ДНК, транскрипція, трансляція) та закони Менделя',
            summary: 'Принцип комплементарності ДНК: Аденін - Тимін (А=Т), Гуанін - Цитозин (Г≡Ц). У РНК замість тиміну входить урацил (А=У). І закон Менделя — закон одноманітності гібридів першого покоління. ІІ закон — розщеплення за фенотипом 3:1.',
            formula: 'ДНК комплементарність: А=Т, Г≡Ц | РНК: А=У, Г≡Ц',
            mnemonic: 'Аптека-Ти, Город-Церква (А-Т, Г-Ц)!',
            examples: ['Якщо ланцюг ДНК: АТГ-ЦГА, то комплементарний ланцюг: ТАЦ-ГЦТ.']
          }
        ],
        quizzes: [
          // 5-7 клас
          {
            id: 'bio-q-57-1',
            grade: 'grade-5-7',
            question: 'Яка органела характерна виключно для клітин рослин і забезпечує процес фотосинтезу?',
            options: [
              { text: 'Хлоропласт', isCorrect: true },
              { text: 'Мітохондрія', isCorrect: false },
              { text: 'Ядро', isCorrect: false },
              { text: 'Рибосома', isCorrect: false }
            ],
            explanation: 'Хлоропласти містять пігмент хлорофіл і забезпечують фотосинтез у рослинних клітинах.'
          },
          {
            id: 'bio-q-57-2',
            grade: 'grade-5-7',
            question: 'Який життєво необхідний газ виділяють зелені рослини в атмосферу під час фотосинтезу?',
            options: [
              { text: 'Кисень (O₂)', isCorrect: true },
              { text: 'Вуглекислий газ (CO₂)', isCorrect: false },
              { text: 'Азот (N₂)', isCorrect: false },
              { text: 'Водень (H₂)', isCorrect: false }
            ],
            explanation: 'Під час світлової фази фотосинтезу в результаті фотолізу води виділяється кисень O₂.'
          },

          // 8-9 клас
          {
            id: 'bio-q-89-1',
            grade: 'grade-8-9',
            question: 'З якої камери серця людини починається велике коло кровообігу?',
            options: [
              { text: 'З лівого шлуночка (через аорту)', isCorrect: true },
              { text: 'З правого шлуночка', isCorrect: false },
              { text: 'З лівого передсердя', isCorrect: false },
              { text: 'З правого передсердя', isCorrect: false }
            ],
            explanation: 'Велике коло кровообігу починається з найпотужнішого лівого шлуночка серця і несе артеріальну кров до всіх органів через аорту.'
          },

          // 10-11 / NMT
          {
            id: 'bio-q-nmt-1',
            grade: 'nmt-200',
            question: 'У молекулі ДНК частка гуанілових нуклеотидів (Г) становить 30%. Яка частка аденілових нуклеотидів (А) у цій молекулі?',
            options: [
              { text: '20%', isCorrect: true },
              { text: '30%', isCorrect: false },
              { text: '40%', isCorrect: false },
              { text: '70%', isCorrect: false }
            ],
            explanation: 'За правилом Чаргаффа: Г = Ц = 30%, разом Г + Ц = 60%. На частку А + Т залишається 100% - 60% = 40%. Оскільки А = Т, частка А = 40% / 2 = 20%.'
          }
        ],
        blitzQuestions: [
          { grade: 'grade-5-7', q: 'Який пігмент надає зеленого кольору листям рослин?', a: 'Хлорофіл.' },
          { grade: 'grade-8-9', q: 'Скільки камер має серце людини?', a: 'Чотири камери (два передсердя і два шлуночки).' },
          { grade: 'grade-8-9', q: 'Які клітини крові відповідають за зсідання крові та утворення тромбів?', a: 'Тромбоцити.' },
          { grade: 'nmt-200', q: 'Який нуклеотид комплементарний аденіну в молекулі РНК?', a: 'Урацил (У).' }
        ],
        whiteboardFormulas: [
          '5-7: CO₂ + H₂O + світло -> C₆H₁₂O₆ + O₂',
          '8-9: Велике коло: Лівий шлуночок -> Аорта -> Праве передсердя',
          'НМТ 200: Правило Чаргаффа: А = Т, Г = Ц | А+Т+Г+Ц = 100%'
        ]
      }
    },

    // =========================================================================
    // Dynamic Filter & Query Methods (Strict Grade / Level Separation)
    // =========================================================================

    /**
     * Returns an HTML badge displaying whether the content matches the grade or level.
     */
    getGradeBadge(gradeOrLevel, mode) {
      if (!gradeOrLevel) return '';
      if (mode === 'languages' || ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(gradeOrLevel)) {
        return `<span class="badge-grade-match">✅ Рівень: ${gradeOrLevel}</span>`;
      }
      if (gradeOrLevel === 'grade-5-7') {
        return `<span class="badge-grade-match">✅ Програма: 5–7 клас</span>`;
      }
      if (gradeOrLevel === 'grade-8-9') {
        return `<span class="badge-grade-match">✅ Програма: 8–9 клас</span>`;
      }
      if (gradeOrLevel === 'nmt-200' || gradeOrLevel === 'grade-10-11') {
        return `<span class="badge-grade-match">✅ Програма: 10–11 клас (НМТ 200!)</span>`;
      }
      if (gradeOrLevel === 'olympiad') {
        return `<span class="badge-grade-match">✅ Програма: Олімпіада</span>`;
      }
      return `<span class="badge-grade-match">✅ Рівень: ${gradeOrLevel}</span>`;
    },

    /**
     * Resolves the active grade or level from DOM/Controller if not explicitly passed
     */
    _resolveActiveGradeOrLevel(subjectId, gradeOrLevel) {
      if (gradeOrLevel) return gradeOrLevel;

      if (typeof document !== 'undefined') {
        const activeGoalBtn = document.querySelector('#school-goals-wrap .pill-btn.active');
        if (activeGoalBtn && activeGoalBtn.dataset.goal) {
          return activeGoalBtn.dataset.goal;
        }
        const activeLevelBtn = document.querySelector('#language-levels-grid .circle-level-btn.active');
        if (activeLevelBtn && activeLevelBtn.dataset.level) {
          return activeLevelBtn.dataset.level;
        }
      }

      if (typeof window !== 'undefined' && window.StrictTutorControllerInstance) {
        const ctrl = window.StrictTutorControllerInstance;
        return (ctrl.mode === 'languages') ? ctrl.level : ctrl.goal;
      }

      const raw = this.content[subjectId];
      return (raw && raw.defaultGrade) ? raw.defaultGrade : 'nmt-200';
    },

    /**
     * Retrieves quizzes strictly filtered by grade (5-7, 8-9, nmt-200, olympiad) or CEFR level.
     * NEVER falls back between 5-7 and senior NMT!
     */
    getQuizzes(subjectId, gradeOrLevel) {
      const data = this.content[subjectId] || this.content.math;
      if (!data || !data.quizzes) return [];

      const target = this._resolveActiveGradeOrLevel(subjectId, gradeOrLevel);
      const is57 = target === 'grade-5-7';
      const is89 = target === 'grade-8-9';
      const isSenior = target === 'grade-10-11' || target === 'nmt-200';
      const isOlympiad = target === 'olympiad';

      let filtered = data.quizzes.filter(q => {
        const g = q.grade || q.level;
        if (is57) return g === 'grade-5-7';
        if (is89) return g === 'grade-8-9';
        if (isSenior) return g === 'nmt-200' || g === 'grade-10-11';
        if (isOlympiad) return g === 'olympiad' || g === 'nmt-200';
        return g === target;
      });

      // Strict fallback: never mix 5-7 with 10-11 / nmt-200!
      if (filtered.length === 0) {
        if (is57) {
          filtered = data.quizzes.filter(q => (q.grade || q.level) === 'grade-5-7');
        } else if (is89) {
          filtered = data.quizzes.filter(q => (q.grade || q.level) === 'grade-8-9' || (q.grade || q.level) === 'grade-5-7');
        } else if (isSenior || isOlympiad) {
          filtered = data.quizzes.filter(q => (q.grade || q.level) === 'nmt-200' || (q.grade || q.level) === 'grade-10-11');
        } else {
          // Languages fallback: closest CEFR
          const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
          const idx = levels.indexOf(target);
          if (idx !== -1) {
            filtered = data.quizzes.filter(q => {
              const qIdx = levels.indexOf(q.level || q.grade);
              return qIdx !== -1 && Math.abs(qIdx - idx) <= 1;
            });
          }
        }
      }

      return filtered.length > 0 ? filtered : data.quizzes;
    },

    /**
     * Retrieves rules strictly filtered by grade or CEFR level.
     */
    getRules(subjectId, gradeOrLevel) {
      const data = this.content[subjectId] || this.content.math;
      if (!data || !data.rules) return [];

      const target = this._resolveActiveGradeOrLevel(subjectId, gradeOrLevel);
      const is57 = target === 'grade-5-7';
      const is89 = target === 'grade-8-9';
      const isSenior = target === 'grade-10-11' || target === 'nmt-200';
      const isOlympiad = target === 'olympiad';

      let filtered = data.rules.filter(r => {
        const g = r.grade || r.level;
        if (is57) return g === 'grade-5-7';
        if (is89) return g === 'grade-8-9';
        if (isSenior) return g === 'nmt-200' || g === 'grade-10-11';
        if (isOlympiad) return g === 'olympiad' || g === 'nmt-200';
        return g === target;
      });

      if (filtered.length === 0) {
        if (is57) {
          filtered = data.rules.filter(r => (r.grade || r.level) === 'grade-5-7');
        } else if (is89) {
          filtered = data.rules.filter(r => (r.grade || r.level) === 'grade-8-9' || (r.grade || r.level) === 'grade-5-7');
        } else if (isSenior || isOlympiad) {
          filtered = data.rules.filter(r => (r.grade || r.level) === 'nmt-200' || (r.grade || r.level) === 'grade-10-11');
        }
      }

      return filtered.length > 0 ? filtered : data.rules;
    },

    /**
     * Retrieves blitz questions strictly filtered by grade or CEFR level.
     */
    getBlitz(subjectId, gradeOrLevel) {
      const data = this.content[subjectId] || this.content.math;
      if (!data || !data.blitzQuestions) return [];

      const target = this._resolveActiveGradeOrLevel(subjectId, gradeOrLevel);
      const is57 = target === 'grade-5-7';
      const is89 = target === 'grade-8-9';
      const isSenior = target === 'grade-10-11' || target === 'nmt-200';
      const isOlympiad = target === 'olympiad';

      let filtered = data.blitzQuestions.filter(b => {
        const g = b.grade || b.level;
        if (is57) return g === 'grade-5-7';
        if (is89) return g === 'grade-8-9';
        if (isSenior) return g === 'nmt-200' || g === 'grade-10-11';
        if (isOlympiad) return g === 'olympiad' || g === 'nmt-200';
        return g === target;
      });

      if (filtered.length === 0) {
        if (is57) {
          filtered = data.blitzQuestions.filter(b => (b.grade || b.level) === 'grade-5-7');
        } else if (is89) {
          filtered = data.blitzQuestions.filter(b => (b.grade || b.level) === 'grade-8-9' || (b.grade || b.level) === 'grade-5-7');
        } else if (isSenior || isOlympiad) {
          filtered = data.blitzQuestions.filter(b => (b.grade || b.level) === 'nmt-200' || (b.grade || b.level) === 'grade-10-11');
        }
      }

      return filtered.length > 0 ? filtered : data.blitzQuestions;
    },

    /**
     * Dynamic Subject Content Resolver.
     * When legacy or controller code calls `content.quizzes`, `content.rules`, or `content.blitzQuestions`,
     * getters intercept and automatically return ONLY the quizzes/rules/blitz matching the student's active grade/level!
     */
    getSubjectContent(subjectId, gradeOrLevel) {
      const raw = this.content[subjectId] || this.content.math;
      const self = this;

      return {
        ...raw,
        get quizzes() {
          return self.getQuizzes(subjectId, gradeOrLevel);
        },
        get rules() {
          return self.getRules(subjectId, gradeOrLevel);
        },
        get blitzQuestions() {
          return self.getBlitz(subjectId, gradeOrLevel);
        },
        rawQuizzes: raw.quizzes,
        rawRules: raw.rules,
        rawBlitz: raw.blitzQuestions
      };
    },

    // Socratic Mistake Solver generator
    generateMistakeReviewLesson(mistakeObj, personaId = 'friend') {
      const tone = this.personaTones[personaId] || this.personaTones.friend;
      const topic = mistakeObj.topic || 'Ключове завдання тесту';
      const question = mistakeObj.question || '';
      const userAns = mistakeObj.userAns || '';
      const correctAns = mistakeObj.correctAns || '';
      const explanation = mistakeObj.explanation || '';

      let opening = '';
      if (personaId === 'strict') {
        opening = `Сконцентруйтеся. Ми аналізуємо ваше слабке місце з теми **«${topic}»**.\n\n` +
                  `Ось завдання, де ви припустилися неточності:\n` +
                  `> *"${question}"*\n\n` +
                  `Ваша попередня відповідь була: **"${userAns}"**.\n` +
                  `Нормативна правильна відповідь: **"${correctAns}"**.\n\n` +
                  `За методом Сократа запитую: чому ви обрали саме цей варіант і яке фундаментальне обмеження проігнорували?`;
      } else if (personaId === 'joker') {
        opening = `О, привіт-привіт! 🐼 Бачу, тут у нас підступний паркан, об який ти спіткнувся в тренажері з теми **«${topic}»**!\n\n` +
                  `Завданнячко ось яке:\n` +
                  `> *"${question}"*\n\n` +
                  `Ти натиснув: *"${userAns}"*, але правильний ключ від цієї скрині: *"${correctAns}"*! 🔑\n\n` +
                  `Давай включимо детективів і розберемося, куди ж дивилися твої очі, коли ти це обирав? Що скажеш?`;
      } else if (personaId === 'motivator') {
        opening = `Чемпіоне! 🔥 Саме робота над такими помилками робить із тебе абітурієнта на 200 балів! Тема: **«${topic}»**.\n\n` +
                  `Ось той виклик, який кинув тобі тест:\n` +
                  `> *"${question}"*\n\n` +
                  `Твоя відповідь: *"${userAns}"* ➔ Цільовий результат: *"${correctAns}"*.\n\n` +
                  `Зробимо один правильний підхід! Що було головною підказкою в умові?`;
      } else if (personaId === 'calm') {
        opening = `Вітаю. Зроби спокійний вдих. 🧘 Ми прийшли сюди, щоб перетворити запитання з теми **«${topic}»** на твою впевнену силу.\n\n` +
                  `Погляньмо уважно на формулювання:\n` +
                  `> *"${question}"*\n\n` +
                  `Твій попередній варіант: *"${userAns}"*.\n` +
                  `Точний розв'язок: *"${correctAns}"*.\n\n` +
                  `Розкладімо це завдання на прості кроки. З чого починається аналіз?`;
      } else if (personaId === 'socratic') {
        opening = `Увага на докази! 🕵️ Тема розслідування: **«${topic}»**.\n\n` +
                  `Ось зафіксоване протиріччя:\n` +
                  `> *"${question}"*\n\n` +
                  `Твоя гіпотеза: *"${userAns}"* ➔ Встановлена істина: *"${correctAns}"*.\n\n` +
                  `Яке саме твердження в умові або базове визначення викриває хибність первинної версії?`;
      } else if (personaId === 'examiner') {
        opening = `Офіційний розбір апеляції з теми: **«${topic}»**.\n\n` +
                  `Тестове завдання специфікації УЦОЯО / IELTS:\n` +
                  `> *"${question}"*\n\n` +
                  `Ваш вибір: *"${userAns}"* (0 балів за шкалою) ➔ Еталонний ключ: *"${correctAns}"*.\n\n` +
                  `Згідно з критеріями оцінювання: сформулюйте нормативне правило, порушене у вашій відповіді.`;
      } else if (personaId === 'gamemaster') {
        opening = `Бос локації **«${topic}»** контратакував! 🚀 Твій щит зламано на цьому завданні:\n\n` +
                  `> *"${question}"*\n\n` +
                  `Твоє закляття: *"${userAns}"* (Промах!) ➔ Вразливе місце боса: *"${correctAns}"*! ⚔️\n\n` +
                  `Швидко перегрупуй магію: яку формулу або артефакт знань використаємо для повторного удару?`;
      } else if (personaId === 'native') {
        opening = `Hey there! 🗣️ Розбираємо нюанс із теми **«${topic}»**, на якому часто ловлять навіть досвідчених спікерів!\n\n` +
                  `Ось наше речення:\n` +
                  `> *"${question}"*\n\n` +
                  `Твій варіант: *"${userAns}"* ➔ Як це звучить природно для носія мови: *"${correctAns}"*.\n\n` +
                  `Давай відчуємо різницю: чому саме цей зворот є автентичним у живій мові?`;
      } else {
        // friend
        opening = `Привіт, сонечко! 🐼 Я поруч, щоб разом спокійно розібрати питання з теми **«${topic}»**, де ти трохи заплутався в тесті!\n\n` +
                  `Ось це завдання:\n` +
                  `> *"${question}"*\n\n` +
                  `Ти відповів: *"${userAns}"*, але насправді правильна відповідь: *"${correctAns}"*.\n\n` +
                  `Не бійся помилитися ще раз, ми вчимося! Як ти міркував, коли вибирав свою відповідь?`;
      }

      return {
        text: opening,
        mistakeMeta: mistakeObj,
        explanation: explanation
      };
    },

    // 8 Immersive Real-Life Roleplay Scenarios
    roleplayScenarios: [
      {
        id: 'cafe_order',
        title: "☕ Кав'ярня в Лондоні / Берліні",
        icon: '☕',
        mode: 'languages',
        location: "Затишна кав'ярня «Red Bamboo» у центрі Лондона / Берліна",
        plotHook: "Бариста переплутав замовлення і додав горіховий сироп, на який у вас алергія. Потрібно ввічливо попросити замінити напій і замовити круасан.",
        missions: [
          'Ввічливо повідомити баристі про помилку з горіховим сиропом та наявність алергії',
          'Попросити приготувати новий напій на вівсяному молоці (oat milk / Hafermilch)',
          'Дозамовити свіжий круасан та дізнатися фінальну суму замовлення'
        ],
        openingPromptUk: "Ви підходите до барної стійки. Бариста з посмішкою простягає вам склянку з горіховим лате. Ваше завдання — ввічливо пояснити ситуацію та отримати правильний напій.",
        openingTargetPhrase: {
          english: "Hi there! Here is your double hazelnut latte with extra whipped cream. Anything else for you today?",
          deutsch: "Hallo! Hier ist dein doppelter Haselnuss-Latte mit extra Schlagsahne. Möchtest du noch etwas dazu?",
          espanol: "¡Hola! Aquí tienes tu café con leche de avellana doble con extra de nata. ¿Deseas algo más hoy?",
          chinese: "你好！这是您的双份榛果拿铁加鲜奶油。您今天还需要别的点心吗？",
          ukrainian: "Привіт! Ось ваше подвійне лате з горіховим сиропом та вершками. Бажаєте ще щось сьогодні?"
        },
        sampleExchanges: [
          {
            userUk: "Вибачте, але здається, сталася помилка. У мене сильна алергія на горіхи...",
            userTarget: {
              english: "Excuse me, I'm afraid there has been a mistake. I'm actually severely allergic to nuts.",
              deutsch: "Entschuldigung, ich fürchte, hier liegt ein Missverständnis vor. Ich bin stark allergisch gegen Nüsse.",
              espanol: "Disculpe, me temo que hay un error. Soy muy alérgico a los frutos secos.",
              chinese: "不好意思，我想可能弄错了。我对坚果严重过敏。",
              ukrainian: "Перепрошую, здається, сталася помилка. У мене сильна алергія на горіхи."
            },
            tutorResponseUk: "Ой, перепрошую! Я негайно приготую новий напій на чистому посуді. Яке молоко ви віддаєте перевагу?",
            tutorResponseTarget: {
              english: "Oh gosh, I am so sorry! Let me remake that for you right away. What milk would you prefer?",
              deutsch: "Oh je, das tut mir schrecklich leid! Ich mache das sofort frisch für dich. Welche Milch möchtest du?",
              espanol: "¡Vaya, lo siento muchísimo! Te lo preparo de nuevo ahora mismo. ¿Qué tipo de leche prefieres?",
              chinese: "哎呀，真对不起！我马上给您重新做一杯。您喜欢哪种牛奶？",
              ukrainian: "Ой, перепрошую! Я негайно перероблю напій для вас. Яке молоко ви оберете?"
            }
          }
        ]
      },
      {
        id: 'airport_customs',
        title: '✈️ Аеропорт та Паспортний контроль',
        icon: '✈️',
        mode: 'languages',
        location: 'Міжнародний термінал аеропорту Хітроу / Франкфурт',
        plotHook: 'Ваш стикувальний рейс затримали, офіцер прикордонної служби запитує мету візиту, тривалість перебування та бронь готелю.',
        missions: [
          'Чітко назвати мету візиту (освітня конференція, навчання або туризм)',
          'Пояснити ситуацію із затримкою стикувального рейсу та показати квитки',
          'Підтвердити наявність броні готелю та достатньої суми коштів'
        ],
        openingPromptUk: 'Суворий офіцер прикордонного контролю сканує ваш паспорт та пильно дивиться на вас. Відповідайте спокійно та впевнено!',
        openingTargetPhrase: {
          english: "Good evening. Passport and landing card, please. What is the main purpose of your visit to the UK and how long will you stay?",
          deutsch: "Guten Abend. Ihren Pass und die Einreisekarte, bitte. Was ist der Zweck Ihrer Einreise und wie lange beabsichtigen Sie zu bleiben?",
          espanol: "Buenas tardes. Pasaporte y tarjeta de embarque, por favor. ¿Cuál es el propósito principal de su viaje y cuánto tiempo se quedará?",
          chinese: "您好。请出示您的护照和入境卡。您入境的主要目的是什么？预计停留多久？",
          ukrainian: "Добрий вечір. Ваш паспорт та посадковий талон, будь ласка. Яка головна мета вашого візиту та на скільки днів ви прибули?"
        },
        sampleExchanges: [
          {
            userUk: "Я прибув на міжнародну освітню конференцію та планую перебувати тут 7 днів.",
            userTarget: {
              english: "I am here to attend an international educational tech conference, and I plan to stay for 7 days.",
              deutsch: "Ich bin hier, um an einer internationalen Bildungskonferenz teilzunehmen, und plane 7 Tage zu bleiben.",
              espanol: "He venido para asistir a una conferencia educativa internacional y me quedaré durante 7 días.",
              chinese: "我是来参加国际教育科技会议的，预计停留7天。",
              ukrainian: "Я прибув для участі у міжнародній освітній конференції та планую залишитися на 7 днів."
            },
            tutorResponseUk: "Зрозуміло. Де саме ви зупиняєтеся і чи є у вас зворотний квиток?",
            tutorResponseTarget: {
              english: "Understood. Where will you be staying, and do you already hold a confirmed return ticket?",
              deutsch: "Verstanden. Wo werden Sie übernachten und haben Sie bereits ein bestätigtes Rückflugticket?",
              espanol: "¿Dónde se alojará y dispone ya de billete de vuelta confirmado?",
              chinese: "好的。请问您住在哪里？是否已经预订了确认的回程机票？",
              ukrainian: "Зрозуміло. Де саме ви плануєте зупинитися і чи маєте вже підтверджений зворотний квиток?"
            }
          }
        ]
      }
    ],

    getRoleplayScenarios(mode) {
      if (!mode) return this.roleplayScenarios;
      return this.roleplayScenarios.filter(s => s.mode === mode);
    },

    getRoleplayById(id) {
      return this.roleplayScenarios.find(s => s.id === id) || null;
    },

    generateBilingualResponse(userText, config = {}) {
      const lang = (config.language || 'english').toLowerCase();
      const level = (config.level || 'A1').toUpperCase();
      const persona = config.persona || 'friend';
      const tone = this.personaTones[persona] || this.personaTones.friend;
      const text = String(userText || '').trim();

      const langIsoMap = {
        english: 'en-US',
        deutsch: 'de-DE',
        espanol: 'es-ES',
        chinese: 'zh-CN',
        ukrainian: 'uk-UA'
      };
      const isoCode = langIsoMap[lang] || 'en-US';

      const sampleVocabByLang = {
        english: [
          { word: 'fluency', ipa: '/ˈfluː.ən.si/', lang: 'en-US', translation: 'вільне володіння мовою' },
          { word: 'comprehension', ipa: '/ˌkɒm.prɪˈhen.ʃən/', lang: 'en-US', translation: 'розуміння на слух та зміст' },
          { word: 'opportunity', ipa: '/ˌɒp.əˈtjuː.nə.ti/', lang: 'en-US', translation: 'можливість / шанс' }
        ],
        deutsch: [
          { word: 'Aussprache', ipa: '/ˈaʊ̯sˌʃpʁaːxə/', lang: 'de-DE', translation: 'вимова' },
          { word: 'Wortschatz', ipa: '/ˈvɔʁtˌʃats/', lang: 'de-DE', translation: 'словниковий запас' },
          { word: 'Selbstvertrauen', ipa: '/ˈzɛlpstfɛɐ̯ˌtʁaʊ̯ən/', lang: 'de-DE', translation: 'впевненість у собі' }
        ],
        espanol: [
          { word: 'pronunciación', ipa: '/pɾonunθjaˈsjon/', lang: 'es-ES', translation: 'вимова' },
          { word: 'vocabulario', ipa: '/bokaβuˈlaɾjo/', lang: 'es-ES', translation: 'словниковий запас' },
          { word: 'fluidez', ipa: '/flwiˈðeθ/', lang: 'es-ES', translation: 'вільне володіння' }
        ],
        chinese: [
          { word: '发音 (fāyīn)', ipa: '/fa˥ in˥/', lang: 'zh-CN', translation: 'вимова' },
          { word: '词汇 (cíhuì)', ipa: '/tsʰɯ˧˥ xweɪ˥˩/', lang: 'zh-CN', translation: 'словниковий запас' },
          { word: '流利 (liúlì)', ipa: '/ljou˧˥ li˥˩/', lang: 'zh-CN', translation: 'вільне мовлення' }
        ],
        ukrainian: [
          { word: 'орфоепія', ipa: '/ɔrfɔˈɛpʲijɐ/', lang: 'uk-UA', translation: 'правила нормативної вимови' },
          { word: 'синтаксис', ipa: '/ˈsɪntɐksɪs/', lang: 'uk-UA', translation: 'будова речень та словосполучень' },
          { word: 'лексикон', ipa: '/lɛksɪˈkɔn/', lang: 'uk-UA', translation: 'багатство словникового запасу' }
        ]
      };

      const vocab = sampleVocabByLang[lang] || sampleVocabByLang.english;
      const tonePraise = tone.praise[Math.floor(Math.random() * tone.praise.length)];

      const targetReplies = {
        english: "That is a great point! Let's build upon that idea: how would you describe your daily study routine?",
        deutsch: "Sehr gut formuliert! Bauen wir darauf auf: Wie sieht dein typischer Lerntag aus?",
        espanol: "¡Muy bien expresado! Desarrollemos más la idea: ¿cómo describirías tu rutina de estudio diaria?",
        chinese: "说得非常好！我们继续深入练习：你能描述一下你平时每天的学习作息吗？",
        ukrainian: "Чудова думка! Розвиньмо її далі: як ти плануєш свій щоденний розклад підготовки до тестування?"
      };

      const targetTranslationsUk = {
        english: "Це чудова думка! Розвиймо цю ідею далі: як би ти описав свій щоденний розпорядок навчання?",
        deutsch: "Дуже гарно сформульовано! Як виглядає твій типовий день навчання?",
        espanol: "Дуже добре висловлено! Як би ти описав свій щоденний розклад занять?",
        chinese: "Чудово сказано! Як би ти описав свій щоденний розпорядок навчання?",
        ukrainian: "Чудова думка! Як ти плануєш свій щоденний розклад підготовки до тестування?"
      };

      const replyTarget = targetReplies[lang] || targetReplies.english;
      const replyUk = targetTranslationsUk[lang] || targetTranslationsUk.english;
      const teacherExplanationUk = `Твоя відповідь показує чудовий прогрес на рівні **${level}**. Звертай особливу увагу на порядок слів у підрядних реченнях та узгодження часів!`;

      const formattedText =
`🐼 **Коментар репетитора (${persona}):**
${tonePraise}

> *«${replyTarget}»*
*(Переклад: ${replyUk})*

📖 **Граматична порада українською:**
${teacherExplanationUk}

📌 **Ключові слова для вимови (натисніть 🗣️ для прослуховування):**
${vocab.map(v => `- **${v.word}** \`${v.ipa}\` — ${v.translation}`).join('\n')}`;

      return {
        roleplayPrompt: replyTarget,
        roleplayTranslationUk: replyUk,
        teacherExplanationUk: teacherExplanationUk,
        corrections: [],
        targetLanguageSamples: [
          { phrase: replyTarget, ipa: '', translationUk: replyUk }
        ],
        vocabularyWords: vocab,
        missionCompleted: true,
        nextMissionStep: 1,
        fullFormattedText: formattedText
      };
    }
  };

  // Export Singleton on window
  window.StrictTutorData = StrictTutorData;

})();
