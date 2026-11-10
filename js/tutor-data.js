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
    }
  };

  // Export Singleton on window
  window.StrictTutorData = StrictTutorData;

})();
