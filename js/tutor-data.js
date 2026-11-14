/**
 * StrictAI Knowledge Base & Content Engine — "Панда-репетитор"
 * Rich pedagogical datasets for 5 Languages & 6 NMT/School Subjects across 5 AI Personas.
 * Fully autonomous (offline) with Socratic methods, interactive tests, and Ukrainian grammar.
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
        'grade-5-7': '5-7 клас: Базовий шкільний фундамент, дроби, основи синтаксису й природа.',
        'grade-8-9': '8-9 клас: Поглиблена програма, підготовка до ДПА, теореми та формули.',
        'grade-10-11': '10-11 клас: Комплексна старша школа, профільні теми та аналіз явищ.',
        'nmt-200': 'НМТ 200!: Інтенсивне розв’язування тестів УЦОЯО, пастки та тест-таймінг.'
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

    // Persona Vocabularies & Tonalities
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

    // Pedagogical Knowledge Base by Subject & Language
    content: {
      // 1. English
      english: {
        rules: [
          {
            title: 'Present Simple vs Present Continuous',
            summary: 'Present Simple виражає регулярні, повторювані дії та факти (always, usually, every day). Present Continuous виражає дію, що відбувається просто зараз (now, at the moment) або тимчасову ситуацію.',
            formula: 'Present Simple: V / V-s | Present Continuous: am/is/are + V-ing',
            mnemonic: 'Пам’ятай про Stative Verbs (like, love, know, understand, believe, want) — вони зазвичай НЕ вживаються в Continuous!',
            examples: [
              'She speaks English fluently. (Факт/навичка)',
              'Listen! She is speaking English to the guest right now. (Дія в цю мить)'
            ]
          },
          {
            title: 'First and Second Conditionals',
            summary: 'First Conditional (реальна умова в майбутньому): If + Present Simple, will + V1. Second Conditional (уявна/малоймовірна ситуація в теперішньому або майбутньому): If + Past Simple, would + V1.',
            formula: '1st: If it rains, we will stay at home.\n2nd: If I had 1 million dollars, I would travel the world.',
            mnemonic: 'У 2nd Conditional для займенника "I" часто вживають "were" замість "was": "If I were you..." (Якби я був на твоєму місці).',
            examples: [
              'If you study every day with Panda, you will pass the NMT easily!',
              'If I knew his phone number, I would call him right now.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'eng-q1',
            level: 'B1',
            question: 'Оберіть правильний варіант: "Listen! Somebody ... the violin upstairs."',
            options: [
              { text: 'plays', isCorrect: false },
              { text: 'is playing', isCorrect: true },
              { text: 'played', isCorrect: false },
              { text: 'has played', isCorrect: false }
            ],
            explanation: 'Маркер "Listen!" вказує на дію, яка відбувається безпосередньо в момент мовлення, тому вживаємо Present Continuous (is playing).'
          },
          {
            id: 'eng-q2',
            level: 'B2',
            question: 'Оберіть правильну форму умовного способу: "If she ... harder, she would have passed the exam last week."',
            options: [
              { text: 'studied', isCorrect: false },
              { text: 'had studied', isCorrect: true },
              { text: 'would study', isCorrect: false },
              { text: 'has studied', isCorrect: false }
            ],
            explanation: 'Це Third Conditional (нереальна дія в минулому): If + Past Perfect (had studied), would have + V3.'
          },
          {
            id: 'eng-q3',
            level: 'A2',
            question: 'Оберіть правильний прийменник часу: "I usually wake up ... 7 o’clock ... the morning."',
            options: [
              { text: 'at / on', isCorrect: false },
              { text: 'in / at', isCorrect: false },
              { text: 'at / in', isCorrect: true },
              { text: 'on / in', isCorrect: false }
            ],
            explanation: 'З точним часом вживаємо прийменник "at" (at 7 o’clock), а з частинами дня — "in" (in the morning).'
          }
        ],
        conversationPrompts: [
          'Hello! Tell me about your favorite hobbies and why you enjoy them so much.',
          'If you could travel anywhere in Ukraine or abroad tomorrow, where would you go and why?',
          'What are your main goals for preparing for the NMT exam this year?'
        ],
        blitzQuestions: [
          { q: 'Який прийменник вживається після дієслова "interested"?', a: 'Прийменник "in" (interested in something).' },
          { q: 'У чому різниця між "remember to lock" та "remember locking"?', a: '"Remember to lock" — пам’ятати зробити дію в майбутньому; "remember locking" — пам’ятати спогад про вже зроблену дію.' },
          { q: 'Яка 3-тя форма (Past Participle) неправильного дієслова "choose"?', a: 'Chosen (choose — chose — chosen).' }
        ],
        socraticPrompts: [
          'Look at the time marker in the sentence. Does it indicate a regular habit or an ongoing action right at this moment?',
          'Are we talking about a real possibility in the future, or an imaginary dream in the present?',
          'Is this verb a stative verb describing a state of mind, or an active physical action?'
        ],
        whiteboardFormulas: [
          'Present Simple: S + V(s) | every day, usually, often',
          'Present Continuous: S + am/is/are + V-ing | now, at the moment',
          'Past Simple: S + V2/ed | yesterday, ago, in 2022',
          'Present Perfect: S + have/has + V3 | already, yet, just, ever',
          '1st Conditional: If + Present Simple, will + V1',
          '2nd Conditional: If + Past Simple, would + V1',
          '3rd Conditional: If + Past Perfect, would have + V3'
        ]
      },

      // 2. Deutsch
      deutsch: {
        rules: [
          {
            title: 'Артиклі та відмінки: Akkusativ чи Dativ?',
            summary: 'Dativ відповідає на питання "Wem?" (Кому?) або "Wo?" (Де? - стан спокою). Akkusativ відповідає на питання "Wen/Was?" (Кого/Що?) або "Wohin?" (Куди? - рух/напрямок).',
            formula: 'Dativ (Де?): in dem (im) Park, auf dem Tisch\nAkkusativ (Куди?): in den Park, auf den Tisch',
            mnemonic: 'Прийменники, які завжди вимагають Dativ: aus, bei, mit, nach, seit, von, zu. Прийменники з Akkusativ: durch, für, gegen, ohne, um.',
            examples: [
              'Ich fahre mit dem Bus (mit + Dativ).',
              'Das Geschenk ist für meinen Bruder (für + Akkusativ).'
            ]
          }
        ],
        quizzes: [
          {
            id: 'de-q1',
            level: 'A2',
            question: 'Вставте правильний артикль: "Ich gehe morgen mit ... Freundin ins Kino."',
            options: [
              { text: 'meine', isCorrect: false },
              { text: 'meiner', isCorrect: true },
              { text: 'meinen', isCorrect: false },
              { text: 'meinem', isCorrect: false }
            ],
            explanation: 'Прийменник "mit" завжди вимагає Dativ. Жіночий рід у Dativ отримує закінчення -er (mit meiner Freundin).'
          }
        ],
        conversationPrompts: [
          'Hallo! Wie geht es dir heute und was machst du gern am Wochenende?',
          'Erzähl mir bitte kurz: Warum lernst du Deutsch?'
        ],
        blitzQuestions: [
          { q: 'Які допоміжні дієслова використовуються для утворення Perfekt?', a: 'Дієслова haben та sein (sein вживається для дієслів руху та зміни стану).' }
        ],
        socraticPrompts: [
          'Запитай себе: це рух із пункту А в пункт Б ("Куди?"), чи перебування на одному місці ("Де?")?'
        ],
        whiteboardFormulas: [
          'Dativ (Wem? Wo?): dem (m), der (f), dem (n), den + -n (pl)',
          'Akkusativ (Wen? Wohin?): den (m), die (f), das (n), die (pl)',
          'Dativ-Präpositionen: aus, bei, mit, nach, seit, von, zu',
          'Akkusativ-Präpositionen: durch, für, gegen, ohne, um'
        ]
      },

      // 3. Español
      espanol: {
        rules: [
          {
            title: 'Різниця між дієсловами Ser та Estar',
            summary: 'Обидва означають "бути", але Ser використовується для постійних характеристик (походження, професія, риси характеру), а Estar — для тимчасових станів (настрій, здоров’я) та місцезнаходження.',
            formula: 'SER: DOCTOR (Description, Occupation, Characteristic, Time, Origin, Relationship)\nESTAR: PLACE (Position, Location, Action, Condition, Emotion)',
            mnemonic: 'How you feel and where you are, always use the verb ESTAR!',
            examples: [
              'Soy ucraniano y soy estudiante. (Ser — походження, професія)',
              'Estoy en Kyiv y estoy muy contento. (Estar — місце, емоційний стан)'
            ]
          }
        ],
        quizzes: [
          {
            id: 'es-q1',
            level: 'A1',
            question: 'Оберіть правильну форму: "¿Dónde ... la biblioteca nacional?"',
            options: [
              { text: 'es', isCorrect: false },
              { text: 'está', isCorrect: true },
              { text: 'son', isCorrect: false },
              { text: 'están', isCorrect: false }
            ],
            explanation: 'Для позначення географічного розташування та місцезнаходження предметів завжди вживається дієслово Estar (está).'
          }
        ],
        conversationPrompts: [
          '¡Hola! ¿Cómo te llamas y qué te gusta hacer en tu tiempo libre?',
          '¿Cuál es tu comida española o ucraniana favorita?'
        ],
        blitzQuestions: [
          { q: 'Яке закінчення мають правильні дієслова 1-ї дієвідміни в інфінітиві?', a: 'Закінчення -ar (hablar, cantar, estudiar).' }
        ],
        socraticPrompts: [
          'Це постійна невіддільна риса об’єкта, чи тимчасовий стан або його розташування прямо зараз?'
        ],
        whiteboardFormulas: [
          'SER (постійне): yo soy, tú eres, él es, nosotros somos, ellos son',
          'ESTAR (стан/місце): yo estoy, tú estás, él está, nosotros estamos, ellos están',
          'Regla mnemónica: ¡Para estados y lugares, usa ESTAR sin dudar!'
        ]
      },

      // 4. Chinese (中文)
      chinese: {
        rules: [
          {
            title: '4 тони китайської мови (Pinyin)',
            summary: 'Китайська мова є тональною: однаковий склад, вимовлений іншим тоном, має зовсім інше значення (наприклад: mā - мама, má - коноплі, mǎ - кінь, mà - лаяти).',
            formula: '1-й тон: високий рівний (ā)\n2-й тон: висхідний (á)\n3-й тон: низький спадно-висхідний (ǎ)\n4-й тон: різкий спадний (à)',
            mnemonic: '1-й — спів на одній ноті, 2-й — здивоване "Що?", 3-й — задумливе "Гм...", 4-й — рішуче "Ні!".',
            examples: [
              '你好 (Nǐ hǎo) — Привіт!',
              '谢谢 (Xièxie) — Дякую!'
            ]
          }
        ],
        quizzes: [
          {
            id: 'zh-q1',
            level: 'A1',
            question: 'Як китайською перекладається вираз "Дякую"?',
            options: [
              { text: 'Nǐ hǎo (你好)', isCorrect: false },
              { text: 'Xièxie (谢谢)', isCorrect: true },
              { text: 'Zàijiàn (再见)', isCorrect: false },
              { text: 'Duìbuqǐ (对不起)', isCorrect: false }
            ],
            explanation: 'Xièxie (谢谢) означає "Дякую". Nǐ hǎo — привіт, Zàijiàn — до побачення, Duìbuqǐ — вибачте.'
          }
        ],
        conversationPrompts: [
          'Nǐ hǎo! Nǐ jiào shénme míngzi? (Привіт! Як тебе звати?)',
          'Nǐ xǐhuan zhōngguó cài ma? (Тобі подобається китайська кухня?)'
        ],
        blitzQuestions: [
          { q: 'Яка частка ставиться в кінці стверджувального речення, щоб перетворити його на питальне?', a: 'Питальна частка 吗 (ma).' }
        ],
        socraticPrompts: [
          'Пригадай: порядок слів у китайському реченні зазвичай чіткий — Хто + Коли + Де + Робить що.'
        ],
        whiteboardFormulas: [
          '1-й тон: ā (рівний високий)',
          '2-й тон: á (висхідний)',
          '3-й тон: ǎ (низький зі зламом)',
          '4-й тон: à (різкий спадний)',
          'Базова структура: Підмет + Обставина часу/місця + Присудок + Додаток'
        ]
      },

      // 5. Ukrainian Language (General & School)
      ukrainian: {
        rules: [
          {
            title: 'Апостроф: правила вживання за новим правописом',
            summary: 'Апостроф ставиться перед я, ю, є, ї після губних [б, п, в, м, ф], якщо перед ними немає іншого приголосного (крім р), що належить до кореня.',
            formula: 'МаВПа БУФ + я, ю, є, ї -> б’ю, п’ять, в’юн, м’ясо, торф’яний',
            mnemonic: 'Гасло: "МаВПа БУФ"! Але пам’ятай винятки: свято, тьмяний, духмяний, морквяний (перед губним є інший приголосний).',
            examples: [
              'М’ята, солов’ї, зв’язок, бур’ян (після р перед я, ю, є, ї).',
              'Свято, мавпячий (бо перед в стоїть с, м).'
            ]
          },
          {
            title: 'Спрощення в групах приголосних',
            summary: 'При зміні слів у групах -ждн-, -здн-, -стн-, -стл- середній звук випадає: тиждень - тижневий, проїзд - проїзний, честь - чесний.',
            formula: 'стн -> сн, здн -> зн, стл -> сл',
            mnemonic: 'Слова-винятки, де спрощення НЕ відбувається: шістнадцять, кістлявий, пестливий, хвастливий, хворостняк, запястний.',
            examples: [
              'Корисний (від користь), радісний (від радість).',
              'Винятки: шістнадцять, кістлявий.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ukr-gen-q1',
            level: 'B2',
            question: 'Укажіть слово, у якому на місці пропуску обов’язково пишеться апостроф:',
            options: [
              { text: 'св..ято', isCorrect: false },
              { text: 'духм..яний', isCorrect: false },
              { text: 'торф..яний', isCorrect: true },
              { text: 'моркв..яний', isCorrect: false }
            ],
            explanation: 'У слові "торф’яний" перед губним [ф] стоїть [р], тому апостроф зберігається. У словах свято, духмяний, морквяний перед губним стоїть інший кореневий приголосний.'
          }
        ],
        conversationPrompts: [
          'Привіт! Яка твоя улюблена книга або український твір із програми, і чому?',
          'Які правила нового українського правопису (2019) здаються тобі найцікавішими?'
        ],
        blitzQuestions: [
          { q: 'Як правильно писати "пів яблука" за новим правописом?', a: 'Окремо: "пів яблука", "пів Києва", "пів години".' },
          { q: 'На який склад падає наголос у слові "чорнозем"?', a: 'На другий склад: чорнОзем.' }
        ],
        socraticPrompts: [
          'Чи є перед губним звуком інший приголосний, і чи належить він до кореня?'
        ],
        whiteboardFormulas: [
          'МаВПа БУФ: б, п, в, м, ф + апостроф перед я, ю, є, ї',
          'Винятки без апострофа: свято, тьмяний, духмяний, морквяний',
          'Винятки спрощення: шістнадцять, кістлявий, пестливий, хвастливий, зап’ястний',
          'Новий правопис: пів Києва, пів яблука, пів години (окремо!)'
        ]
      },

      // 6. Math (School & NMT)
      math: {
        rules: [
          {
            title: 'Квадратні рівняння та теорема Вієта',
            summary: 'Для зведеного квадратного рівняння x² + px + q = 0 сума коренів дорівнює другому коефіцієнту з протилежним знаком, а добуток — вільному члену.',
            formula: 'x₁ + x₂ = -p\nx₁ · x₂ = q\nДискримінант: D = b² - 4ac, x = (-b ± √D) / (2a)',
            mnemonic: 'Якщо D > 0 — два корені; D = 0 — один подвійний корінь; D < 0 — дійсних коренів немає.',
            examples: [
              'x² - 5x + 6 = 0: сума 5, добуток 6 -> корені 2 і 3.',
              '2x² - 4x - 6 = 0 -> ділимо на 2: x² - 2x - 3 = 0 -> корені 3 і -1.'
            ]
          },
          {
            title: 'Логарифмічні рівняння та ОДЗ',
            summary: 'При розв’язуванні логарифмічних рівнянь найперший і найважливіший крок — записати Область Допустимих Значень (ОДЗ): підлогарифмічний вираз > 0, основа > 0 та основа ≠ 1.',
            formula: 'log_a(x) = b <=> x = a^b (при a > 0, a ≠ 1, x > 0)',
            mnemonic: 'Головна пастка НМТ: знайти корені за теоремою Вієта й забути відкинути сторонній корінь через ОДЗ!',
            examples: [
              'log₂(x - 3) = 2 => ОДЗ: x > 3 => x - 3 = 2² = 4 => x = 7 (входить в ОДЗ).'
            ]
          }
        ],
        quizzes: [
          {
            id: 'math-q1',
            level: 'nmt-200',
            question: 'Розв’яжіть рівняння: log₂(x - 3) + log₂(x - 1) = 3. У відповідь запишіть суму дійсних коренів.',
            options: [
              { text: '4 (корені 5 та -1)', isCorrect: false },
              { text: '5 (єдиний корінь 5)', isCorrect: true },
              { text: '8', isCorrect: false },
              { text: 'Рівняння не має коренів', isCorrect: false }
            ],
            explanation: 'ОДЗ: x - 3 > 0 і x - 1 > 0 => x > 3. Рівняння: log₂((x-3)(x-1)) = 3 => x² - 4x + 3 = 8 => x² - 4x - 5 = 0. За теоремою Вієта корені x = 5 та x = -1. Оскільки x = -1 не входить в ОДЗ (має бути x > 3), єдиним коренем є x = 5.'
          },
          {
            id: 'math-q2',
            level: 'nmt-200',
            question: 'Знайдіть похідну функції f(x) = 3x⁴ - 5x² + 7 у точці x₀ = 1.',
            options: [
              { text: '2', isCorrect: true },
              { text: '5', isCorrect: false },
              { text: '7', isCorrect: false },
              { text: '-2', isCorrect: false }
            ],
            explanation: 'Похідна: f’(x) = 3 · 4x³ - 5 · 2x + 0 = 12x³ - 10x. Підставляємо x₀ = 1: f’(1) = 12(1)³ - 10(1) = 12 - 10 = 2.'
          },
          {
            id: 'math-q3',
            level: 'grade-8-9',
            question: 'Гіпотенуза прямокутного трикутника дорівнює 10 см, а один із катетів — 6 см. Знайдіть площу трикутника.',
            options: [
              { text: '60 см²', isCorrect: false },
              { text: '48 см²', isCorrect: false },
              { text: '24 см²', isCorrect: true },
              { text: '30 см²', isCorrect: false }
            ],
            explanation: 'За теоремою Піфагора другий катет b = √(10² - 6²) = √(100 - 36) = √64 = 8 см. Площа прямокутного трикутника S = (a · b) / 2 = (6 · 8) / 2 = 24 см².'
          }
        ],
        blitzQuestions: [
          { q: 'Чому дорівнює sin²α + cos²α?', a: 'Основна тригонометрична тотожність: sin²α + cos²α = 1.' },
          { q: 'Як знайти координати вершини параболи y = ax² + bx + c?', a: 'x₀ = -b / (2a), y₀ = y(x₀).' },
          { q: 'Чому дорівнює log_a(1) для будь-якої допустимої основи a?', a: 'log_a(1) = 0, оскільки a⁰ = 1.' }
        ],
        socraticPrompts: [
          'Яка область допустимих значень (ОДЗ) у цьому рівнянні? Чи є обмеження на знаменник чи підкореневий вираз?',
          'Спробуй розкласти ліву частину на множники або використати теорему Вієта. Які два числа в добутку дають вільний член?',
          'Чи можна тут застосувати формулу скороченого множення, щоб значно спростити вираз?'
        ],
        whiteboardFormulas: [
          'D = b² - 4ac | x₁,₂ = (-b ± √D) / (2a)',
          'Теорема Вієта: x₁ + x₂ = -b/a, x₁ · x₂ = c/a',
          'Похідні: (xⁿ)’ = n·xⁿ⁻¹, (sin x)’ = cos x, (cos x)’ = -sin x',
          'Тригонометрія: sin²α + cos²α = 1, tg α = sin α / cos α',
          'Логарифми: log_a(xy) = log_a x + log_a y, log_a(xⁿ) = n·log_a x'
        ]
      },

      // 7. Ukrainian Language (NMT Special)
      'ukr-lang': {
        rules: [
          {
            title: 'Нормативні наголоси до НМТ (Словник УЦОЯО)',
            summary: 'Наголоси є одним із найпопулярніших завдань НМТ. Необхідно твердо запам’ятати слова з нормативним наголосом, які часто плутають у розмовному мовленні.',
            formula: '1-й склад: вИпадок, фОльга, крОїти, дрОва\n2-й склад: чорнОзем, одинАдцять, експЕрт, мерЕжа, новИй, піснИй\n3-й склад: кіломЕтр, докумЕнт, фартУх, жалюзІ',
            mnemonic: 'Віршик від Панди: "У нас трапився вИпадок — чорнОзем упав на килимок! ДочкА взяла експЕрта, розкрили всі конвЕрти!"',
            examples: [
              'чорнОзем, одинАдцять, чотирнАдцять, мерЕжа, руслО, фОльга, вИпадок.'
            ]
          },
          {
            title: 'Чергування У-В, І-Й (Милозвучність)',
            summary: 'Прийменники та префікси у/в, і/й чергуються для уникнення збігу приголосних або голосних.',
            formula: 'Між приголосними: У, І (він у хаті, день і ніч)\nМіж голосними: В, Й (вона в озері, яблука й груші)',
            mnemonic: 'Українська мова прагне чергування голосних і приголосних, як у музиці!',
            examples: [
              'Він пішов у театр (після приголосного ш перед т).',
              'Вона пішла в аптеку (після голосної а перед голосною а).'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ukr-nmt-q1',
            level: 'nmt-200',
            question: 'Укажіть рядок, у якому в усіх словах наголос падає на другий склад:',
            options: [
              { text: 'випадок, чорнозем, дочка', isCorrect: false },
              { text: 'чорнозем, експерт, одинадцять', isCorrect: false },
              { text: 'чорнозем, дочка, експерт', isCorrect: true },
              { text: 'фольга, мережа, жалюзі', isCorrect: false }
            ],
            explanation: 'Слова "чорнОзем", "дочкА", "експЕрт" мають нормативний наголос на другому складі за чинною програмою НМТ. У слові "вИпадок" наголос на першому складі, "одинАдцять" — на третьому, "жалюзІ" — на останньому.'
          },
          {
            id: 'ukr-nmt-q2',
            level: 'nmt-200',
            question: 'Лексичну помилку допущено в рядку:',
            options: [
              { text: 'брати участь у змаганнях', isCorrect: false },
              { text: 'приймати участь у конференції', isCorrect: true },
              { text: 'надати допомогу', isCorrect: false },
              { text: 'відчинити кватирку', isCorrect: false }
            ],
            explanation: 'В українській мові правильно вживати "брати участь". Конструкція "приймати участь" є калькою з російської ("принимать участие").'
          }
        ],
        blitzQuestions: [
          { q: 'На який склад падає наголос у слові "випадок"?', a: 'На перший склад: вИпадок.' },
          { q: 'Як правильно: "на протязі години" чи "протягом години"?', a: 'Нормативно: "протягом години" або "впродовж години". "На протязі" — це на вітрі.' }
        ],
        socraticPrompts: [
          'Промов це слово вголос. Чи відчуваєш ти ритміку, рекомендовану орфоепічним мінімумом УЦОЯО?',
          'Чи не є цей вираз прямою калькою? Як би це сказав класик української літератури?'
        ],
        whiteboardFormulas: [
          'Наголоси НМТ: вИпадок, фОльга, чорнОзем, експЕрт, одинАдцять, мерЕжа',
          'Милозвучність: між приголосними — У, І; між голосними — В, Й',
          'Антикальки: брати участь (не приймати), скасувати (не відмінити), протягом (не на протязі)'
        ]
      },

      // 8. History of Ukraine
      history: {
        rules: [
          {
            title: 'Ключові дати української державності для НМТ',
            summary: 'Хронологічні зв’язки дозволяють безпомилково визначати епоху та передумови історичних подій.',
            formula: '882 — утворення Русі князем Олегом\n988 — хрещення Русі Володимиром Великим\n1019-1054 — правління Ярослава Мудрого\n1199 — утворення Галицько-Волинської держави Романом Мстиславичем\n1569 — Люблінська унія\n1648 — початок Національно-визвольної війни Б. Хмельницького\n1991 (24 серпня) — Акт проголошення незалежності України',
            mnemonic: 'Пам’ятай ланцюжок: Володимир хрестив (988), Ярослав будував Софію і закони (1019-1054), Роман об’єднав Галичину і Волинь (1199).',
            examples: [
              'Люблінська унія (1569) об’єднала Польщу і Литву в Річ Посполиту.',
              'Берестейська церковна унія відбулася в 1596 році.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'hist-q1',
            level: 'nmt-200',
            question: 'Яку подію пов’язують із датою 1 липня 1569 року?',
            options: [
              { text: 'Берестейська церковна унія', isCorrect: false },
              { text: 'Люблінська унія (утворення Речі Посполитої)', isCorrect: true },
              { text: 'Кревська унія', isCorrect: false },
              { text: 'Битва під Оршею', isCorrect: false }
            ],
            explanation: '1 липня 1569 року була укладена Люблінська унія між Великим князівством Литовським і Королівством Польським, у результаті якої виникла федеративна держава — Річ Посполита.'
          },
          {
            id: 'hist-q2',
            level: 'nmt-200',
            question: 'Хто з діячів очолив Українську Центральну Раду в березні 1917 року?',
            options: [
              { text: 'Володимир Винниченко', isCorrect: false },
              { text: 'Михайло Грушевський', isCorrect: true },
              { text: 'Симон Петлюра', isCorrect: false },
              { text: 'Павло Скоропадський', isCorrect: false }
            ],
            explanation: 'Головою Української Центральної Ради 20 (7) березня 1917 року було обрано видатного історика та громадського діяча Михайла Грушевського.'
          }
        ],
        blitzQuestions: [
          { q: 'В якому році князь Володимир Великий запровадив християнство як державну релігію Русі?', a: 'У 988 році.' },
          { q: 'Яка битва Національно-визвольної війни відбулася в травні 1648 року?', a: 'Битва на Жовтих Водах (перша перемога козаків над польським військом).' }
        ],
        socraticPrompts: [
          'Яке століття описує завдання? Хто в цей період був головним геополітичним суперником або союзником України?',
          'Згадай причини події: що передувало підписанню цього універсалу чи договору?'
        ],
        whiteboardFormulas: [
          '882: об’єднання Києва й Новгорода Олегом',
          '988: Хрещення Русі князем Володимиром',
          '1199: об’єднання Волині й Галичини Романом Мстиславичем',
          '1569: Люблінська унія -> Річ Посполита',
          '1648: Жовті Води, Корсунь, Пилявці (тріумф Хмельницького)',
          '1918 (22 січня): IV Універсал -> Незалежність УНР'
        ]
      },

      // 9. English for NMT
      'eng-nmt': {
        rules: [
          {
            title: 'Use of English: Passive Voice & Phrasal Verbs',
            summary: 'На НМТ особливу увагу приділяють граматичній точності в завданнях на вибір слова (Multiple Choice Cloze) та правильному вживанню прийменників.',
            formula: 'Passive: be + Past Participle (V3)\nPhrasal: give up (кидати), look forward to + V-ing (чекати з нетерпінням), depend on (залежати від)',
            mnemonic: 'Після виразу "look forward to" завжди вживається герундій (V-ing), а не інфінітив!',
            examples: [
              'The new laboratory was built last year. (Passive)',
              'I am really looking forward to seeing you at university. (Gerund)'
            ]
          }
        ],
        quizzes: [
          {
            id: 'eng-nmt-q1',
            level: 'nmt-200',
            question: 'Choose the correct form: "I am really looking forward to ... my student card."',
            options: [
              { text: 'receive', isCorrect: false },
              { text: 'receiving', isCorrect: true },
              { text: 'have received', isCorrect: false },
              { text: 'be received', isCorrect: false }
            ],
            explanation: 'Стала фраза "look forward to" вимагає після себе герундія (V-ing): looking forward to receiving.'
          }
        ],
        blitzQuestions: [
          { q: 'Which preposition is used with the verb "depend"?', a: 'Preposition "on" (depend on somebody/something).' }
        ],
        socraticPrompts: [
          'Is the subject performing the action, or is the action being performed upon the subject?'
        ],
        whiteboardFormulas: [
          'Passive Voice: S + be + V3 (Past Participle)',
          'Patterns: look forward to + V-ing, succeed in + V-ing',
          'Prepositions: depend on, interested in, proud of, keen on'
        ]
      },

      // 10. Physics
      physics: {
        rules: [
          {
            title: 'Другий закон Ньютона та імпульс тіла',
            summary: 'Прискорення тіла прямо пропорційне рівнодійній усіх сил, прикладених до тіла, і обернено пропорційне його масі.',
            formula: 'F = m · a\nІмпульс тіла: p = m · v\nЗакон збереження імпульсу: m₁v₁ + m₂v₂ = const',
            mnemonic: 'Сила вимірюється в Ньютонах: 1 Н = 1 кг · м / с².',
            examples: [
              'Тіло масою 2 кг під дією сили 10 Н отримує прискорення a = F/m = 10/2 = 5 м/с².'
            ]
          }
        ],
        quizzes: [
          {
            id: 'phys-q1',
            level: 'grade-10-11',
            question: 'Яка сила діє на тіло масою 4 кг, якщо воно рухається з прискоренням 2.5 м/с²?',
            options: [
              { text: '1.6 Н', isCorrect: false },
              { text: '10 Н', isCorrect: true },
              { text: '6.5 Н', isCorrect: false },
              { text: '15 Н', isCorrect: false }
            ],
            explanation: 'За ІІ законом Ньютона F = m · a = 4 кг · 2.5 м/с² = 10 Н.'
          }
        ],
        blitzQuestions: [
          { q: 'В яких одиницях СІ вимірюється робота та енергія?', a: 'У Джоулях (Дж).' },
          { q: 'Як записується закон Ома для ділянки кола?', a: 'I = U / R (Сила струму прямо пропорційна напрузі й обернено пропорційна опору).' }
        ],
        socraticPrompts: [
          'Які сили діють уздовж осі руху? Чи всі одиниці переведено в систему СІ (кг, м, с)?'
        ],
        whiteboardFormulas: [
          'II закон Ньютона: F = m · a',
          'Кінетична енергія: E_k = (m · v²) / 2',
          'Потенціальна енергія: E_p = m · g · h',
          'Закон Ома: I = U / R | Потужність: P = U · I',
          'Робота: A = F · s · cos(α)'
        ]
      },

      // 11. Biology
      biology: {
        rules: [
          {
            title: 'Будова клітини: Мітохондрії та Хлоропласти',
            summary: 'Мітохондрії — двомембранні органели, "енергетичні станції" клітини, де відбувається синтез АТФ під час кисневого етапу дихання. Хлоропласти містять хлорофіл і забезпечують фотосинтез у рослин.',
            formula: 'Фотосинтез: 6CO₂ + 6H₂O -> C₆H₁₂O₆ + 6O₂ (за участі світла)',
            mnemonic: 'Мітохондрії мають власну кільцеву ДНК і рибосоми (теорія ендосимбіозу)!',
            examples: [
              'У м’язових клітинах серця мітохондрій значно більше, оскільки потрібна безперервна енергія.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'bio-q1',
            level: 'grade-10-11',
            question: 'Яка органела еукаріотичної клітини відповідає за клітинне дихання та синтез більшості молекул АТФ?',
            options: [
              { text: 'Комплекс Гольджі', isCorrect: false },
              { text: 'Мітохондрія', isCorrect: true },
              { text: 'Рибосома', isCorrect: false },
              { text: 'Лізосома', isCorrect: false }
            ],
            explanation: 'Мітохондрія є енергетичною станцією клітини, де в процесі окисного фосфорилювання синтезується аденозинтрифосфат (АТФ).'
          }
        ],
        blitzQuestions: [
          { q: 'Скільки хромосом містить нормальна соматична клітина людини?', a: '46 хромосом (23 пари).' },
          { q: 'Які судини несуть кров від серця до органів?', a: 'Артерії.' }
        ],
        socraticPrompts: [
          'Згадай функцію цієї структури: вона пов’язана зі збереженням енергії чи з її виробництвом?'
        ],
        whiteboardFormulas: [
          'Фотосинтез: 6CO₂ + 6H₂O + світло -> C₆H₁₂O₆ + 6O₂',
          'Дихання: C₆H₁₂O₆ + 6O₂ -> 6CO₂ + 6H₂O + 38 АТФ',
          'Закони Менделя: I — одноманітності, II — розщеплення (3:1), III — незалежного комбінування'
        ]
      }
    },

    // Method to get active content pack
    getSubjectContent(subjectId) {
      return this.content[subjectId] || this.content.math;
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
          },
          {
            userUk: "Можна, будь ласка, на вівсяному молоці? І ще один шоколадний круасан, скільки з мене?",
            userTarget: {
              english: "Could I have oat milk instead, please? Also, I'd love a chocolate croissant. How much is that altogether?",
              deutsch: "Könnte ich bitte Hafermilch bekommen? Und noch ein Schokocroissant, wie viel macht das zusammen?",
              espanol: "¿Podría ser con leche de avena, por favor? Y también un cruasán de chocolate, ¿cuánto es en total?",
              chinese: "可以换成燕麦奶吗？另外请再给我一个巧克力可颂，一共多少钱？",
              ukrainian: "Можна, будь ласка, на вівсяному молоці? Також візьму шоколадний круасан. Скільки це разом?"
            },
            tutorResponseUk: "Чудовий вибір! Вівсяне лате та свіжий теплий круасан. Разом £6.20 / 6,50 €.",
            tutorResponseTarget: {
              english: "Perfect choice! One oat latte and a warm croissant. That comes to £6.20 altogether. Card or cash?",
              deutsch: "Sehr gerne! Ein Hafer-Latte und ein warmes Croissant. Das macht zusammen 6,50 Euro. Karte oder bar?",
              espanol: "¡Excelente elección! Un latte con avena y un cruasán caliente. Son 5,80 euros en total. ¿Tarjeta o efectivo?",
              chinese: "好的没问题！一杯燕麦拿铁和一个热可颂。一共是48元。请问刷卡还是现金？",
              ukrainian: "Чудовий вибір! Одне вівсяне лате та теплий круасан. Разом 180 гривень. Оплата карткою чи готівкою?"
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
      },
      {
        id: 'it_interview',
        title: '💼 IT-Співбесіда в міжнародний стартап',
        icon: '💼',
        mode: 'languages',
        location: 'Відеодзвінок Google Meet з Lead Engineer та HR',
        plotHook: 'Презентувати свій навчальний pet-проєкт і відповісти на питання про командну роботу та вирішення багів.',
        missions: [
          'Зробити стислий elevator pitch про себе та свій стек технологій',
          'Описати технічний челендж чи складний баг та спосіб його розв\'язання',
          'Поставити зустрічне запитання про процеси код-рев\'ю та CI/CD у команді'
        ],
        openingPromptUk: 'Тімлід та HR приєднуються до дзвінка з доброзичливою посмішкою. Покажіть свої технічні знання та вірне володіння термінологією!',
        openingTargetPhrase: {
          english: "Hey there! Thanks for jumping on the call. We loved your GitHub portfolio. Could you walk us through the architecture of your favorite project?",
          deutsch: "Hallo und willkommen zum Interview! Wir haben dein GitHub-Profil gesehen. Kannst du uns kurz die Architektur deines aktuellen Projekts erklären?",
          espanol: "¡Hola! Gracias por unirte a la llamada. Vimos tu repositorio en GitHub. ¿Podrías explicarnos la arquitectura de tu proyecto favorito?",
          chinese: "你好！很高兴在面试中见到你。我们看了你的 GitHub 项目，非常感兴趣。你能给我们介绍一下你最得意的项目架构吗？",
          ukrainian: "Привіт! Дякую, що приєднався до співбесіди. Ми ознайомилися з твоїм GitHub. Розкажи детальніше про архітектуру свого улюбленого проєкту?"
        },
        sampleExchanges: [
          {
            userUk: "Мій проєкт — це освітня веб-платформа на React та Node.js з базою даних PostgreSQL.",
            userTarget: {
              english: "My project is an educational web app built with React, Node.js, and PostgreSQL, focusing on responsive UI and low latency.",
              deutsch: "Mein Projekt ist eine interaktive Bildungsplattform auf Basis von React, Node.js und PostgreSQL mit Fokus auf schnelle Ladezeiten.",
              espanol: "Mi proyecto es una plataforma educativa desarrollada con React, Node.js y PostgreSQL, centrada en una interfaz ágil.",
              chinese: "我的项目是一个基于 React、Node.js 和 PostgreSQL 构建的在线教育平台，重点优化了响应速度和低延迟。",
              ukrainian: "Мій проєкт — це освітня веб-платформа на базі React, Node.js та PostgreSQL, оптимізована для швидкої роботи."
            },
            tutorResponseUk: "Чудовий стек! А з якими складними технічними проблемами ти зіткнувся під час розробки?",
            tutorResponseTarget: {
              english: "Impressive stack! What was the most challenging technical roadblock you encountered, and how did you resolve it?",
              deutsch: "Starker Stack! Was war die größte technische Hürde und wie hast du sie gelöst?",
              espanol: "¡Gran combinación! ¿Cuál fue el mayor reto técnico que encontraste y cómo lo solucionaste?",
              chinese: "技术栈很扎实！在开发过程中你遇到的最大技术难题是什么，又是如何解决的？",
              ukrainian: "Чудовий стек! А яка технічна проблема була найскладнішою і як саме вдалося її вирішити?"
            }
          }
        ]
      },
      {
        id: 'hotel_overbooking',
        title: '🏨 Готель: Овербукінг номера',
        icon: '🏨',
        mode: 'languages',
        location: 'Рецепція готелю 4* у центрі міста о 23:00',
        plotHook: 'Ваш стандартний номер зайнятий — домогтися безкоштовного переселення у люкс зі сніданком.',
        missions: [
          'Надати номер підтвердженої броні та ввічливо висловити здивування ситуацією',
          'Категорично відхилити пропозицію ночувати в приміському мотелі',
          'Домовитися про безкоштовний апгрейд до Deluxe Suite та безкоштовний сніданок'
        ],
        openingPromptUk: 'Втомлений адміністратор рецепції розгублено дивиться в екран і повідомляє про відсутність вільних стандартних номерів. Захистіть свої права!',
        openingTargetPhrase: {
          english: "I am extremely sorry, but due to an unexpected system overbooking, our standard rooms are full tonight. We might have to redirect you to our partner motel 15 km away...",
          deutsch: "Es tut mir aufrichtig leid, aber wegen einer Systemüberbuchung sind alle Standardzimmer heute Nacht belegt. Wir müssten Sie in ein Partnerhotel am Stadtrand verlegen...",
          espanol: "Lo siento muchísimo, pero debido a un sobrecupo inesperado no nos queda ninguna habitación estándar libre. Tendríamos que trasladarle a un motel a 15 km...",
          chinese: "非常抱歉，先生/女士，由于系统突发超额订房，我们今晚所有的标准间都已客满。我们可能需要安排您去15公里外的另一家合作酒店...",
          ukrainian: "Мені дуже прикро, але через технічний овербукінг усі наші одномісні номери сьогодні зайняті. Ми можемо запропонувати партнерський мотель за 15 кілометрів..."
        },
        sampleExchanges: [
          {
            userUk: "Я бронював і оплачував цей номер три тижні тому. Поїздка в інший готель опівночі для мене неприйнятна.",
            userTarget: {
              english: "I booked and pre-paid this room three weeks ago. Traveling to another hotel at midnight is completely out of the question.",
              deutsch: "Ich habe dieses Zimmer vor drei Wochen gebucht und bezahlt. Mitten in der Nacht in ein anderes Hotel zu fahren, kommt nicht infrage.",
              espanol: "Reservé y pagué esta habitación hace tres semanas. Trasladarme a otro hotel a medianoche es inaceptable.",
              chinese: "我三周前就预订并支付了这间房。半夜再去别的酒店对我来说是绝对无法接受的。",
              ukrainian: "Я забронював та сплатив цей номер три тижні тому. Їхати до іншого закладу опівночі є неприйнятним."
            },
            tutorResponseUk: "Я цілком розумію ваше обурення. Дозвольте мені зв'язатися з керуючим і знайти гідне рішення прямо зараз.",
            tutorResponseTarget: {
              english: "I completely understand your frustration. Let me speak with my manager immediately to find a better solution on-site.",
              deutsch: "Ich verstehe Ihren Ärger vollkommen. Lassen Sie mich sofort mit dem Schichtleiter sprechen, um hier vor Ort eine Lösung zu finden.",
              espanol: "Entiendo perfectamente su molestia. Permítame consultar ahora mismo con el director para solucionarlo aquí mismo.",
              chinese: "我完全理解您的心情。请稍等，我立刻向值班经理申请，看看能否为您在店内妥善解决。",
              ukrainian: "Я повністю розумію вашу ситуацію. Дозвольте мені зараз зв'язатися з керуючим, щоб знайти рішення на місці."
            }
          }
        ]
      },
      {
        id: 'doctor_visit',
        title: '🏥 Візит до лікаря за кордоном',
        icon: '🏥',
        mode: 'languages',
        location: 'Приватна медична клініка невідкладної допомоги',
        plotHook: 'Описати симптоми застуди, зрозуміти рекомендації лікаря та рецепт.',
        missions: [
          'Точно описати симптоми (температура, біль у горлі, скільки днів триває)',
          'Запитати про правильне дозування ліків та можливі побічні ефекти',
          'Уточнити питання щодо медичного страхування та отримання довідки'
        ],
        openingPromptUk: 'Лікар сідає навпроти вас із медичною карткою. Чітко та послідовно опишіть своє самопочуття.',
        openingTargetPhrase: {
          english: "Good day. Please have a seat. What seems to be troubling you today, and how long have you been experiencing these symptoms?",
          deutsch: "Guten Tag. Nehmen Sie bitte Platz. Welche Beschwerden haben Sie genau und seit wann treten diese Symptome auf?",
          espanol: "Buenos días. Tome asiento, por favor. ¿Qué molestias tiene hoy y desde hace cuántos días siente estos síntomas?",
          chinese: "您好，请坐。请问您今天哪里感觉不舒服？这些症状持续多长时间了？",
          ukrainian: "Доброго дня. Сідайте, будь ласка. Розкажіть, що саме вас турбує і скільки днів уже тривають ці симптоми?"
        },
        sampleExchanges: [
          {
            userUk: "У мене вже три дні сильний біль у горлі, кашель і температура близько 38.5.",
            userTarget: {
              english: "I have had a severe sore throat, dry cough, and a fever of around 38.5 degrees for three days now.",
              deutsch: "Ich habe seit drei Tagen starke Halsschmerzen, Reizhusten und Fieber um die 38,5 Grad.",
              espanol: "Tengo un dolor de garganta intenso, tos seca y fiebre de unos 38,5 grados desde hace tres días.",
              chinese: "我嗓子剧烈疼痛、咳嗽，并且发烧38.5度已经持续三天了。",
              ukrainian: "У мене вже три дні сильний біль у горлі, сухий кашель та температура близько 38.5 градусів."
            },
            tutorResponseUk: "Зрозумів. Я огляну горло та послухаю легені. Чи маєте ви алергію на якісь антибіотики?",
            tutorResponseTarget: {
              english: "I see. Let me examine your throat and listen to your chest. Do you have any known allergies to antibiotics?",
              deutsch: "Verstehe. Ich werde Ihren Hals untersuchen und die Lunge abhören. Sind bei Ihnen Antibiotika-Allergien bekannt?",
              espanol: "Entendido. Voy a examinarle la garganta y auscultarle el pecho. ¿Tiene alguna alergia conocida a antibióticos?",
              chinese: "明白了。我来检查一下您的咽喉并听一下心肺。您对青霉素或其他抗生素过敏吗？",
              ukrainian: "Зрозумів. Я огляну ваше горло та послухаю легені. Чи маєте ви відомі алергії на антибіотики?"
            }
          }
        ]
      },
      {
        id: 'gadget_return',
        title: '💻 Повернення гаджета по гарантії',
        icon: '💻',
        mode: 'languages',
        location: 'Магазин електроніки та сервісна зона',
        plotHook: 'Ноутбук перестав заряджатися напередодні іспиту — домогтися миттєвої заміни.',
        missions: [
          'Пред\'явити фіскальний чек і детально описати проблему із заряджанням',
          'Відмовитися від 21-денного очікування, наголосивши на терміновості через іспит',
          'Домогтися негайної заміни на новий пристрій або надання підмінної моделі'
        ],
        openingPromptUk: 'Менеджер сервісної зони бере ноутбук і заявляє, що за регламентом пристрій забирають на 21 день. Час впевнених аргументів!',
        openingTargetPhrase: {
          english: "Hello. I see the charging LED isn't turning on. However, our standard warranty policy requires a mandatory 21-day lab inspection before any replacement.",
          deutsch: "Guten Tag. Ich sehe, die Lade-LED leuchtet nicht. Laut Garantiebestimmungen muss das Gerät jedoch zuerst für 21 Tage in die zentrale Werkstatt eingeschickt werden.",
          espanol: "Hola. Veo que el indicador de carga no enciende. Sin embargo, cualquier cambio requiere un peritaje técnico obligatorio de 21 días.",
          chinese: "您好。我看到充电指示灯确实不亮。但根据售后条例，换机前必须先交由实验室检测21个工作日。",
          ukrainian: "Вітаю. Бачу, що індикатор живлення не реагує. Проте за гарантійними правилами діагностика триває 21 день до будь-якої заміни."
        },
        sampleExchanges: [
          {
            userUk: "Я придбав цей ноутбук лише три дні тому, і післязавтра у мене державний іспит. 21 день очікування зірве моє тестування.",
            userTarget: {
              english: "I purchased this laptop just three days ago, and my state exam is the day after tomorrow. A 21-day wait will ruin my test preparation.",
              deutsch: "Ich habe diesen Laptop erst vor drei Tagen gekauft und übermorgen steht meine Staatsprüfung an. Eine 21-tägige Wartezeit ist unzumutbar.",
              espanol: "Compré este portátil hace solo tres días y pasado mañana tengo mi examen estatal. Esperar 21 días arruinaría mis exámenes.",
              chinese: "这台笔记本我才买了三天，后天就是全国统考。等21天会彻底耽误我的考试。",
              ukrainian: "Я придбав цей ноутбук лише три дні тому, а післязавтра у мене державний іспит. 21 день очікування зірве мою підготовку."
            },
            tutorResponseUk: "Я розумію критичність ситуації. Оскільки пристрій куплено менше 14 днів тому, я оформлю пряму заміну на складі.",
            tutorResponseTarget: {
              english: "I understand how urgent this is. Since the device was purchased within 14 days, I can authorize an immediate direct replacement from our warehouse.",
              deutsch: "Ich verstehe die Dringlichkeit vollkommen. Da der Kauf innerhalb von 14 Tagen erfolgte, veranlasse ich einen sofortigen Sofortaustausch ab Lager.",
              espanol: "Comprendo la urgencia. Como fue adquirido hace menos de 14 días, autorizaré un reemplazo directo e inmediato desde el almacén.",
              chinese: "我十分理解情况紧急。鉴于购买尚在14天无忧退换期内，我将直接为您办理仓库现货换新手续。",
              ukrainian: "Я розумію всю терміновість. Оскільки пристрій куплений менше 14 днів тому, я оформлюю пряму заміну зі складу."
            }
          }
        ]
      },
      {
        id: 'nmt_history_tribunal',
        title: '🏛️ Історичний дебат (НМТ Історія)',
        icon: '🏛️',
        mode: 'school',
        location: 'Засідання наукової комісії УЦОЯО',
        plotHook: 'Довести причинно-наслідковий зв\'язок між подіями та розпізнати історичну цитату.',
        missions: [
          'Сформулювати 2 головні геополітичні передумови укладення Люблінської унії 1569 р.',
          'Охарактеризувати статус українських земель у складі Корони Польської після рішень Сейму',
          'Розпізнати постать або цитату джерела та навести точне датування події'
        ],
        openingPromptUk: 'Голова екзаменаційної комісії відкриває слухання. Захистіть історичну точність свого розв\'язку перед експертами!',
        openingTargetPhrase: {
          ukrainian: "Вітаю на історичних слуханнях! У завданні 17 ви стверджували, що приєднання українських земель до Польщі відбулося внаслідок Люблінської унії 1569 року. Які геополітичні передумови змусили шляхту Великого князівства Литовського піти на цю угоду?",
          english: "Welcome to the historical panel! Defend your stance regarding the Lublin Union of 1569 and the geopolitical drivers of the Lithuanian nobility.",
          deutsch: "Willkommen zum historischen Kolloquium! Begründen Sie die Ursachen und Folgen der Union von Lublin im Jahr 1569.",
          espanol: "¡Bienvenido al panel histórico! Exponga los antecedentes y consecuencias de la Unión de Lublin de 1569.",
          chinese: "欢迎参加乌克兰历史答辩！请详细论述1569年卢布林联合的背景及立陶宛大公国妥协的原因。"
        },
        sampleExchanges: [
          {
            userUk: "Головною передумовою була Лівонська війна: ВКЛ зазнавало нищівних ударів від Московського царства і потребувало польської військової допомоги.",
            userTarget: {
              ukrainian: "Головною передумовою була важка Лівонська війна: ВКЛ вело виснажливу боротьбу проти Московії і критично потребувало польської військової допомоги.",
              english: "The primary driver was the Livonian War: the Grand Duchy of Lithuania suffered devastating pressure from Muscovy and desperately needed Polish military alliance.",
              deutsch: "Die Hauptursache war der Livländische Krieg: Das Großfürstentum Litauen geriet durch Moskau unter Druck und benötigte dringend polnische Militärhilfe.",
              espanol: "El motivo principal fue la Guerra Livona: el Gran Ducado sufría el ataque de Moscovia y necesitaba con urgencia apoyo militar polaco.",
              chinese: "主要原因是利沃尼亚战争：立陶宛大公国受到莫斯科公国的沉重军事打击，急需波兰王国的军事援助。"
            },
            tutorResponseUk: "Абсолютно вірно! А які саме українські воєводства відійшли до складу Польщі за універсалами короля Сигізмунда II Августа?",
            tutorResponseTarget: {
              ukrainian: "Блискуча точність! А які саме українські воєводства відійшли безпосередньо до складу Корони Польської за рішеннями 1569 року?",
              english: "Spot-on historical accuracy! And which Ukrainian voivodeships specifically were transferred to the Polish Crown under Sigismund II Augustus?",
              deutsch: "Präzise Antwort! Und welche ukrainischen Woiwodschaften wurden 1569 direkt der polnischen Krone einverleibt?",
              espanol: "¡Exacto! ¿Y qué voivodatos ucranianos pasaron formalmente a la Corona polaca en 1569?",
              chinese: "非常准确！那么在1569年齐格蒙特二世法令下，究竟哪些乌克兰省份直接并入了波兰王国？"
            }
          }
        ]
      },
      {
        id: 'nmt_stem_defense',
        title: '🔬 Інженерний хакатон (Математика / Фізика)',
        icon: '🔬',
        mode: 'school',
        location: 'Лабораторія КПІ ім. Ігоря Сікорського',
        plotHook: 'Знайти помилку в розрахунках траєкторії та захистити правильну формулу.',
        missions: [
          'Виявити сторонній корінь через ОДЗ підкореневого виразу або логарифма (x > 3)',
          'Перерахувати траєкторію за допомогою геометричного змісту похідної',
          'Захистити фізичну стійкість розрахунку перед комісією інженерів'
        ],
        openingPromptUk: 'Головний ментор вказує на голографічну дошку з формулою: система видає помилку на 14-й секунді польоту. Де в рівнянні log₂(x-3) + log₂(x-1) = 3 криється помилка?',
        openingTargetPhrase: {
          ukrainian: "Колего, увага на дисплей телеметрії! Автопілот дає збій, тому що алгоритм отримав корені x = 5 та x = -1. Поясніть журі, чому x = -1 є фатальною помилкою?",
          english: "Look at the telemetry, engineer! The algorithm yielded roots x = 5 and x = -1. Explain to the jury why root -1 causes a system crash?",
          deutsch: "Achtung auf das Telemetrie-Display! Der Algorithmus hat x = 5 und x = -1 berechnet. Warum ist x = -1 mathematisch unzulässig?",
          espanol: "¡Atención a la telemetría! El algoritmo arrojó x = 5 y x = -1. ¿Por qué la raíz -1 es inadmisible?",
          chinese: "请看遥测屏幕！算法得出了 x = 5 和 x = -1 两个根。请向评委解释为什么 x = -1 会导致系统报错？"
        },
        sampleExchanges: [
          {
            userUk: "Корінь x = -1 є стороннім через область допустимих значень: під знаком логарифма має бути строга нерівність x - 3 > 0, отже x > 3.",
            userTarget: {
              ukrainian: "Корінь x = -1 є стороннім через ОДЗ: вирази під логарифмами повинні бути додатними: x - 3 > 0 (x > 3) та x - 1 > 0 (x > 1). Отже, спільна ОДЗ: x > 3, тому корінь -1 сторонній.",
              english: "The root x = -1 is strictly extraneous because of the domain of definition: arguments of logarithms must be positive (x - 3 > 0 => x > 3). Hence, x = 5 is the sole valid solution.",
              deutsch: "Die Lösung x = -1 ist eine Scheinlösung, da der Numerus positiv sein muss: x - 3 > 0, also x > 3. Nur x = 5 liegt im Definitionsbereich.",
              espanol: "La solución x = -1 es extraña según el dominio de definición: x - 3 > 0 implica x > 3. Por tanto, solo x = 5 es válida.",
              chinese: "根 x = -1 是增根！因为真数必须严格大于零：x - 3 > 0 即 x > 3。因此唯一的有效解是 x = 5。"
            },
            tutorResponseUk: "Ідеальний захист! ОДЗ враховано бездоганно. Тепер знайдіть кутовий коефіцієнт дотичної до траєкторії в цій точці.",
            tutorResponseTarget: {
              ukrainian: "Ідеальний математичний захист! ОДЗ зберегло наш безпілотник. Тепер знайдіть значення похідної f'(5) для коригування курсу.",
              english: "Outstanding defense! Accounting for the domain saved the drone. Now determine the derivative at point x = 5 to stabilize flight angle.",
              deutsch: "Hervorragende Argumentation! Jetzt bestimmen Sie die Ableitung f'(5) zur Kurskorrektur.",
              espanol: "¡Defensa impecable! Ahora calcule la derivada f'(5) para ajustar el ángulo de ataque.",
              chinese: "完美的答辩！正确排除增根拯救了飞行器。接下来请计算点 x = 5 处的导数值以校准飞行角度。"
            }
          }
        ]
      }
    ],

    // Helper to query scenarios
    getRoleplayScenarios(mode) {
      if (!mode) return this.roleplayScenarios;
      return this.roleplayScenarios.filter(s => s.mode === mode);
    },

    getRoleplayById(id) {
      return this.roleplayScenarios.find(s => s.id === id) || null;
    },

    /**
     * Autonomous Bilingual Pedagogical Generator
     * Provides structured, rich educational feedback:
     * - Explanations & grammar comments in clear Ukrainian (or current locale)
     * - Dialogue responses, model phrases & examples in target language (English, Deutsch, Español, 中文, Українська)
     * - Key vocabulary with official IPA transcriptions, ISO language code, and translations for speech buttons
     */
    generateBilingualResponse(userText, config = {}) {
      const lang = (config.language || 'english').toLowerCase();
      const level = (config.level || 'A1').toUpperCase();
      const persona = config.persona || 'friend';
      const roleplayId = config.roleplayId || null;
      const missionStep = Math.max(0, parseInt(config.missionStep || 0, 10));
      const tone = this.personaTones[persona] || this.personaTones.friend;
      const text = String(userText || '').trim();

      // Language ISO mapper for speech synthesis & polyglot TTS
      const langIsoMap = {
        english: 'en-US',
        deutsch: 'de-DE',
        espanol: 'es-ES',
        chinese: 'zh-CN',
        ukrainian: 'uk-UA'
      };
      const isoCode = langIsoMap[lang] || 'en-US';

      // -------------------------------------------------------------
      // 1. Roleplay Scenario Handling
      // -------------------------------------------------------------
      if (roleplayId) {
        const scenario = this.getRoleplayById(roleplayId);
        if (scenario) {
          const currentMission = scenario.missions[missionStep] || scenario.missions[scenario.missions.length - 1];
          const isFinalStep = missionStep >= scenario.missions.length - 1;
          const userLower = text.toLowerCase();

          // Evaluate mission criteria based on scenario & step
          let stepPassed = false;
          let roleplayReply = '';
          let roleplayReplyUk = '';
          let teacherGrammarUk = '';
          let vocab = [];

          if (roleplayId === 'cafe_order') {
            vocab = [
              { word: lang === 'deutsch' ? 'Hafermilch' : (lang === 'espanol' ? 'leche de avena' : (lang === 'chinese' ? '燕麦奶 (yànmài nǎi)' : 'oat milk')), ipa: lang === 'deutsch' ? '/ˈhaːfɐmɪlç/' : (lang === 'espanol' ? '/ˈletʃe ðe aˈβena/' : (lang === 'chinese' ? '/jɛn˥˩ maɪ˥˩ naɪ˨˩˦/' : '/oʊt mɪlk/')), lang: isoCode, translation: 'вівсяне молоко' },
              { word: lang === 'deutsch' ? 'allergisch' : (lang === 'espanol' ? 'alérgico' : (lang === 'chinese' ? '过敏 (guòmǐn)' : 'allergic')), ipa: lang === 'deutsch' ? '/aˈlɛʁɡɪʃ/' : (lang === 'espanol' ? '/aˈleɾxiko/' : (lang === 'chinese' ? '/kwɔ˥˩ min˨˩˦/' : '/əˈlɜː.dʒɪk/')), lang: isoCode, translation: 'алергічний' },
              { word: lang === 'deutsch' ? 'Croissant' : (lang === 'espanol' ? 'cruasán' : (lang === 'chinese' ? '可颂 (kěsòng)' : 'croissant')), ipa: lang === 'deutsch' ? '/kʁwaˈsɑ̃ː/' : (lang === 'espanol' ? '/kɾwaˈsan/' : (lang === 'chinese' ? '/kʰɤ˨˩˦ sʊŋ˥˩/' : '/krwɑːˈsɒ̃/')), lang: isoCode, translation: 'круасан' }
            ];

            if (missionStep === 0) {
              stepPassed = /allerg|mistake|wrong|error|fehle|nuss|nüss|avellana|坚果|过敏|помилк|алерг/i.test(userLower);
              roleplayReply = lang === 'deutsch'
                ? "Oh, Entschuldigung! Das tut mir leid! Ich bereite deinen Kaffee sofort frisch zu. Möchtest du Hafermilch oder laktosefreie Milch?"
                : (lang === 'espanol'
                  ? "¡Vaya, lo siento mucho! Te lo preparo de nuevo ahora mismo. ¿Prefieres leche de avena o de soja?"
                  : (lang === 'chinese'
                    ? "真对不起！我马上给您重新做一杯。请问您换成燕麦奶还是豆奶？"
                    : "Oh, I am terribly sorry! Let me remake this drink right away. Would you prefer oat milk or almond milk?"));
              roleplayReplyUk = "Ой, мені дуже прикро! Я негайно перероблю напій. Ви бажаєте вівсяне молоко чи інше?";
              teacherGrammarUk = "Чудово! Ти ввічливо повідомив про алергію. Зверни увагу на ввічливі конструкції: «I'm afraid there has been a mistake» або «Could you please remake this?».";
            } else if (missionStep === 1) {
              stepPassed = /oat|hafer|avena|燕麦|вівсян/i.test(userLower);
              roleplayReply = lang === 'deutsch'
                ? "Sehr gerne, ein Latte mit Hafermilch! Möchtest du noch ein frisches Schokocroissant oder einen Muffin dazu?"
                : (lang === 'espanol'
                  ? "¡Perfecto, café con leche de avena! ¿Te gustaría también un cruasán recién horneado?"
                  : (lang === 'chinese'
                    ? "好的，燕麦奶拿铁马上来！您需要再加一个刚出炉的可颂吗？"
                    : "Excellent, one oat milk latte coming right up! Would you like a warm croissant or pastry with that?"));
              roleplayReplyUk = "Чудово, лате на вівсяному молоці готується! Бажаєте ще свіжий круасан або випічку?";
              teacherGrammarUk = "Влучний вибір! При замовленні напій + молоко вживаємо прийменник «with» («latte with oat milk») або «Could I have oat milk, please?».";
            } else {
              stepPassed = true;
              roleplayReply = lang === 'deutsch'
                ? "Wunderbar! Ein Hafer-Latte und ein Croissant. Das macht zusammen 6,20 €. Bitte sehr!"
                : (lang === 'espanol'
                  ? "¡Aquí tienes! Café de avena y cruasán. Son 5,50 € en total. ¡Que aproveche!"
                  : (lang === 'chinese'
                    ? "您的燕麦拿铁和热可颂好了！一共是45元。请慢用！"
                    : "Here you go! One hot oat latte and a fresh croissant. That comes to £5.80 in total. Enjoy your day!"));
              roleplayReplyUk = "Ось ваше замовлення: гаряче вівсяне лате та свіжий круасан. З вас £5.80 / 6,20 €. Смачного!";
              teacherGrammarUk = "Місію кав'ярні повністю виконано! Ти успішно застосував лексику повсякденного спілкування, ввічливі запитання та числівники.";
            }
          } else if (roleplayId === 'airport_customs') {
            vocab = [
              { word: lang === 'deutsch' ? 'Zweck' : (lang === 'espanol' ? 'propósito' : (lang === 'chinese' ? '目的 (mùdì)' : 'purpose of visit')), ipa: lang === 'deutsch' ? '/tsvɛk/' : (lang === 'espanol' ? '/pɾoˈposito/' : (lang === 'chinese' ? '/mu˥˩ ti˥˩/' : '/ˈpɜː.pəs əv ˈvɪz.ɪt/')), lang: isoCode, translation: 'мета візиту' },
              { word: lang === 'deutsch' ? 'Bordkarte' : (lang === 'espanol' ? 'tarjeta de embarque' : (lang === 'chinese' ? '登机牌 (dēngjīpái)' : 'boarding pass')), ipa: lang === 'deutsch' ? '/ˈbɔʁtˌkaʁtə/' : (lang === 'espanol' ? '/taɾˈxeta ðe emˈbaɾke/' : (lang === 'chinese' ? '/təŋ˥ tɕi˥ pʰaɪ˧˥/' : '/ˈbɔː.dɪŋ ˌpɑːs/')), lang: isoCode, translation: 'посадковий талон' },
              { word: lang === 'deutsch' ? 'Anschlussflug' : (lang === 'espanol' ? 'vuelo de conexión' : (lang === 'chinese' ? '中转航班 (zhōngzhuǎn)' : 'connecting flight')), ipa: lang === 'deutsch' ? '/ˈanʃlʊsˌfluːk/' : (lang === 'espanol' ? '/ˈbwelo ðe konekˈsjon/' : (lang === 'chinese' ? '/ʈʂʊŋ˥ ʈʂwɛn˨˩˦/' : '/kəˈnek.tɪŋ flaɪt/')), lang: isoCode, translation: 'стикувальний рейс' }
            ];

            stepPassed = true;
            roleplayReply = lang === 'deutsch'
              ? "Vielen Dank. Ihre Dokumente sind in Ordnung. Gute Weiterreise und viel Erfolg beim Aufenthalt!"
              : (lang === 'espanol'
                ? "Muchas gracias. Todo está en regla. Le deseo una estancia muy agradable."
                : (lang === 'chinese'
                  ? "好的，您的证件和入境材料均已核验无误。祝您旅途愉快！"
                  : "Thank you. Your documents and itinerary are fully verified. Welcome and enjoy your stay!"));
            roleplayReplyUk = "Дякую. Ваші документи та маршрут перевірено. Вітаємо та бажаємо успішного перебування!";
            teacherGrammarUk = "Відмінна офіційна мова! При проходженні митниці важливо вживати чіткі дієслова: «I am here to attend...», «I have a confirmed hotel reservation».";
          } else {
            // General scenarios fallback with rich pedagogical output
            vocab = [
              { word: lang === 'deutsch' ? 'Bestätigung' : (lang === 'espanol' ? 'confirmación' : (lang === 'chinese' ? '确认 (quèrèn)' : 'confirmation')), ipa: lang === 'deutsch' ? '/bəˈʃtɛːtɪɡʊŋ/' : (lang === 'espanol' ? '/komfiɾmaˈsjon/' : (lang === 'chinese' ? '/tɕʰɥɛ˥˩ ʐən˥˩/' : '/ˌkɒn.fəˈmeɪ.ʃən/')), lang: isoCode, translation: 'підтвердження' },
              { word: lang === 'deutsch' ? 'Lösung' : (lang === 'espanol' ? 'solución' : (lang === 'chinese' ? '解决 (jiějué)' : 'solution')), ipa: lang === 'deutsch' ? '/ˈløːzʊŋ/' : (lang === 'espanol' ? '/soluˈsjon/' : (lang === 'chinese' ? '/tɕjɛ˨˩˦ tɕɥɛ˧˥/' : '/səˈluː.ʃən/')), lang: isoCode, translation: 'рішення / розв\'язок' }
            ];
            stepPassed = true;
            roleplayReply = lang === 'deutsch'
              ? "Ausgezeichnet argumentiert! Wir haben Ihre Position vollständig verstanden und akzeptiert."
              : (lang === 'espanol'
                ? "¡Excelente explicación! Sus argumentos han quedado perfectamente claros."
                : (lang === 'chinese'
                  ? "非常出色的阐述！您的论点完全符合逻辑且令人信服。"
                  : "Brilliantly explained! Your argument is coherent, polite, and persuasive."));
            roleplayReplyUk = "Чудово аргументовано! Ваша відповідь є послідовною, ввічливою та переконливою.";
            teacherGrammarUk = "Прекрасна робота в рольовому режимі! Застосовано доречні лексичні звороти та природний ритм мовлення.";
          }

          const nextStep = stepPassed ? (isFinalStep ? missionStep : missionStep + 1) : missionStep;
          const tonePraise = tone.praise[Math.floor(Math.random() * tone.praise.length)];

          const formattedText =
`🗣️ **Співрозмовник [${scenario.location}]:**
> *«${roleplayReply}»*
*(Переклад: ${roleplayReplyUk})*

🐼 **Порада вчителя (${persona}):**
${tonePraise}
${teacherGrammarUk}

🎯 **Місія ${missionStep + 1}/3:** ${currentMission} ${stepPassed ? '✅ *(Виконано!)*' : '⏳ *(У процесі)*'}

📌 **Корисні слова для вимови:**
${vocab.map(v => `- **${v.word}** \`${v.ipa}\` — ${v.translation}`).join('\n')}`;

          return {
            roleplayPrompt: roleplayReply,
            roleplayTranslationUk: roleplayReplyUk,
            teacherExplanationUk: teacherGrammarUk,
            corrections: [],
            targetLanguageSamples: [
              { phrase: roleplayReply, ipa: '', translationUk: roleplayReplyUk }
            ],
            vocabularyWords: vocab,
            missionCompleted: stepPassed,
            nextMissionStep: nextStep,
            fullFormattedText: formattedText
          };
        }
      }

      // -------------------------------------------------------------
      // 2. Open Conversational & Grammar Tutor Handling
      // -------------------------------------------------------------
      const tonePrefix = tone.greetingPrefix || 'Привіт!';
      const tonePraise = tone.praise[Math.floor(Math.random() * tone.praise.length)];

      // Sample vocabularies by language for open practice
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

      // Dialogue continuation line by language
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

      const teacherExplanationUk = `Твоя відповідь показує чудовий прогрес на рівні **${level}**. Звертай особливу увагу на порядок слів у підрядних реченнях та узгодження часів. Регулярна практика формує швидку мовну реакцію без перекладу подумки!`;

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
        nextMissionStep: missionStep + 1,
        fullFormattedText: formattedText
      };
    }
  };

  // Export Singleton on window
  window.StrictTutorData = StrictTutorData;

})();
