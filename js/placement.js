/**
 * StrictAI Placement Test Controller (window.StrictPlacement)
 * Comprehensive Diagnostic Testing Engine supporting CEFR (A1–C2) & NMT/School Matrix.
 * Features:
 * - 9 Subjects (English, Deutsch, Español, Chinese, Polish, Math, Ukrainian, History, Biology/Physics)
 * - 2 Diagnostic Modes: CEFR / NMT Standard (8 questions) & AI Adaptive Placement (5 steps with Red Panda)
 * - Procedural Question Generator with cryptographic seed & variation templates (0% repetitions)
 * - Audio Listening via StrictPolyglotTTS & Web Speech API
 * - 4-Skill Mastery Evaluation (Grammar/Theory, Vocab/Formulas, Listening/Practice, Logic/Reading)
 * - Seamless integration with StrictStore and 1-click jump to AI Tutor
 */

(function (root) {
  'use strict';

  // PRNG (Mulberry32-based deterministic random from string seed)
  function createPRNG(seedStr) {
    let h = 1779033703 ^ seedStr.length;
    for (let i = 0; i < seedStr.length; i++) {
      h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }

  // Shuffle array using PRNG
  function shuffleWithPRNG(array, prng) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(prng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Common dynamic substitution pools
  const NAMES_EN = ['Anna', 'Oliver', 'Sophia', 'Lucas', 'Emma', 'David', 'Elena', 'Max'];
  const NAMES_UA = ['Олена', 'Тарас', 'Софія', 'Богдан', 'Оксана', 'Максим', 'Юлія', 'Данило', 'Анна', 'Артем'];
  const CITIES_EN = ['London', 'Edinburgh', 'Manchester', 'Dublin', 'Bristol'];
  const CITIES_DE = ['Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt', 'Wien'];
  const CITIES_ES = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Granada'];
  const CITIES_PL = ['Warszawie', 'Krakowie', 'Wrocławiu', 'Gdańsku', 'Poznaniu'];
  const CITIES_UA = ['Києві', 'Львові', 'Харкові', 'Одесі', 'Дніпрі', 'Чернівцях'];

  // Master Subject Metadata
  const SUBJECTS = {
    'english': {
      id: 'english',
      name: 'Англійська мова',
      shortName: 'English',
      type: 'language',
      category: 'lang',
      langCode: 'en-US',
      flag: '🇬🇧',
      icon: '🇬🇧',
      levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    },
    'deutsch': {
      id: 'deutsch',
      name: 'Німецька мова',
      shortName: 'Deutsch',
      type: 'language',
      category: 'lang',
      langCode: 'de-DE',
      flag: '🇩🇪',
      icon: '🇩🇪',
      levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    },
    'espanol': {
      id: 'espanol',
      name: 'Іспанська мова',
      shortName: 'Español',
      type: 'language',
      category: 'lang',
      langCode: 'es-ES',
      flag: '🇪🇸',
      icon: '🇪🇸',
      levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    },
    'chinese': {
      id: 'chinese',
      name: 'Китайська мова',
      shortName: '中文',
      type: 'language',
      category: 'lang',
      langCode: 'zh-CN',
      flag: '🇨🇳',
      icon: '🇨🇳',
      levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    },
    'polish': {
      id: 'polish',
      name: 'Польська мова',
      shortName: 'Polski',
      type: 'language',
      category: 'lang',
      langCode: 'pl-PL',
      flag: '🇵🇱',
      icon: '🇵🇱',
      levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    },
    'math': {
      id: 'math',
      name: 'Математика',
      shortName: 'Математика',
      type: 'school',
      category: 'school',
      langCode: 'uk-UA',
      flag: '📐',
      icon: '📐',
      levels: ['Початковий (120+)', 'Середній (150+)', 'Достатній (175+)', 'Високий (190–200 НМТ)']
    },
    'ukr-lang': {
      id: 'ukr-lang',
      name: 'Українська мова',
      shortName: 'Українська мова',
      type: 'school',
      category: 'school',
      langCode: 'uk-UA',
      flag: '✍️',
      icon: '✍️',
      levels: ['Початковий (120+)', 'Середній (150+)', 'Достатній (175+)', 'Високий (190–200 НМТ)']
    },
    'history': {
      id: 'history',
      name: 'Історія України',
      shortName: 'Історія України',
      type: 'school',
      category: 'school',
      langCode: 'uk-UA',
      flag: '🏛️',
      icon: '🏛️',
      levels: ['Початковий (120+)', 'Середній (150+)', 'Достатній (175+)', 'Високий (190–200 НМТ)']
    },
    'biology': {
      id: 'biology',
      name: 'Біологія та Фізика',
      shortName: 'Біологія',
      type: 'school',
      category: 'school',
      langCode: 'uk-UA',
      flag: '🧬',
      icon: '🧬',
      levels: ['Початковий (120+)', 'Середній (150+)', 'Достатній (175+)', 'Високий (190–200 НМТ)']
    }
  };

  // Master Parameterized Question Templates Pool
  const QUESTION_BANK = {
    // -------------------------------------------------------------
    // ENGLISH
    // -------------------------------------------------------------
    'english': [
      {
        id: 'eng-g-1',
        skillCategory: 'grammar',
        level: 'A2',
        template: 'Yesterday, {name} _____ to the library in {city} to prepare for the test.',
        options: ['went', 'goes', 'has gone', 'is going'],
        correctAnswer: 'went',
        explanation: 'Past Simple вживається для завершених дій у минулому зі словом-маркером "yesterday".'
      },
      {
        id: 'eng-g-2',
        skillCategory: 'grammar',
        level: 'B1',
        template: '{name} has been living in {city} _____ {year}.',
        options: ['since', 'for', 'during', 'from'],
        correctAnswer: 'since',
        explanation: 'Прийменник "since" вказує на точну точку початку дії у Present Perfect Continuous.'
      },
      {
        id: 'eng-g-3',
        skillCategory: 'grammar',
        level: 'B2',
        template: 'If {name} _____ the train earlier, they would not have missed the keynote in {city}.',
        options: ['had taken', 'took', 'would take', 'takes'],
        correctAnswer: 'had taken',
        explanation: 'Third Conditional (нереальна умова в минулому): If + Past Perfect, would + have + V3.'
      },
      {
        id: 'eng-g-4',
        skillCategory: 'grammar',
        level: 'C1',
        template: 'Hardly _____ entered the conference hall when the presentation began.',
        options: ['had the speaker', 'the speaker had', 'did the speaker', 'the speaker did'],
        correctAnswer: 'had the speaker',
        explanation: 'Negative inversion: речення з "Hardly" вимагає зворотної структури допоміжного дієслова (Had + Subject + V3).'
      },
      {
        id: 'eng-v-1',
        skillCategory: 'vocab',
        level: 'B1',
        template: 'The flight to {city} had to be _____ due to severe atmospheric turbulence.',
        options: ['delayed', 'denied', 'decayed', 'disguised'],
        correctAnswer: 'delayed',
        explanation: '"Delayed" означає затриманий через негоду.'
      },
      {
        id: 'eng-v-2',
        skillCategory: 'vocab',
        level: 'B2',
        template: 'Which English idiom means "to face a grim or difficult situation with courage"?',
        options: ['To bite the bullet', 'To spill the beans', 'To beat around the bush', 'To break the ice'],
        correctAnswer: 'To bite the bullet',
        explanation: '"Bite the bullet" — мужньо зціпити зуби та зустріти неминучі труднощі.'
      },
      {
        id: 'eng-v-3',
        skillCategory: 'vocab',
        level: 'C1',
        template: 'The research panel insisted that the team _____ their claims with empirical measurements.',
        options: ['substantiate', 'deteriorate', 'fabricate', 'confiscate'],
        correctAnswer: 'substantiate',
        explanation: '"Substantiate" означає довести або підтвердити емпіричними фактами.'
      },
      {
        id: 'eng-l-1',
        skillCategory: 'listening',
        level: 'A2',
        template: 'Where does the announcement state the express train is departing to, and at what time?',
        audioText: 'Attention passengers on platform three. The direct express train to {city} will depart at exactly quarter past five.',
        audioLang: 'en-US',
        options: ['To {city} at 5:15', 'To {city} at 5:45', 'To London at 4:15', 'Cancelled due to repairs'],
        correctAnswer: 'To {city} at 5:15',
        explanation: '"Quarter past five" означає 5:15.'
      },
      {
        id: 'eng-l-2',
        skillCategory: 'listening',
        level: 'B2',
        template: 'According to the recorded dialogue, what caused the project delay?',
        audioText: 'Despite rigorous planning, {name} noted that unanticipated firmware compatibility conflicts forced the laboratory to postpone launch.',
        audioLang: 'en-US',
        options: ['Unanticipated firmware compatibility conflicts', 'Insufficient budget funding', 'Absence of the lead engineer', 'Power grid failure'],
        correctAnswer: 'Unanticipated firmware compatibility conflicts',
        explanation: 'В аудіо чітко зазначено: "unanticipated firmware compatibility conflicts".'
      },
      {
        id: 'eng-r-1',
        skillCategory: 'logic',
        level: 'B1',
        template: 'Read the short excerpt: "Urban microgrids installed in {city} have successfully curtailed electricity transmission losses by {num}%, demonstrating that localized renewable storage strengthens community resilience during blackouts." What is the main conclusion?',
        options: ['Localized storage reduces transmission loss and bolsters resilience', 'Microgrids are too hazardous for urban zones', 'Transmission losses increased during peak hours', 'Renewable energy requires coal backups'],
        correctAnswer: 'Localized storage reduces transmission loss and bolsters resilience',
        explanation: 'Текст прямо стверджує, що локалізовані мікромережі скорочують втрати та підвищують стійкість.'
      },
      {
        id: 'eng-r-2',
        skillCategory: 'logic',
        level: 'C1',
        template: 'Read the statement: "While algorithmic heuristics excel at high-velocity quantitative synthesis, nuanced ethical discernment and hermeneutic context evaluation remain irrevocably human prerogatives." What does the author argue?',
        options: ['Ethical discernment and contextual nuance remain human domains', 'Algorithms have fully supplanted ethical deliberation', 'Quantitative synthesis is best performed manually', 'Heuristics cannot process numerical data'],
        correctAnswer: 'Ethical discernment and contextual nuance remain human domains',
        explanation: 'Автор наголошує на невіддільній людській ролі в етичному та контекстуальному аналізі.'
      }
    ],

    // -------------------------------------------------------------
    // DEUTSCH
    // -------------------------------------------------------------
    'deutsch': [
      {
        id: 'de-g-1',
        skillCategory: 'grammar',
        level: 'A2',
        template: '{name} _____ gestern mit dem ICE nach {city} gefahren.',
        options: ['ist', 'hat', 'wird', 'war'],
        correctAnswer: 'ist',
        explanation: 'Дієслова переміщення утворюють Perfekt із допоміжним дієсловом "sein" (ist gefahren).'
      },
      {
        id: 'de-g-2',
        skillCategory: 'grammar',
        level: 'B1',
        template: '{name} lernt fleißig Deutsch, weil er an der Universität in {city} studieren _____.',
        options: ['möchte', 'möchten', 'will möchte', 'gemocht'],
        correctAnswer: 'möchte',
        explanation: 'У підрядному реченні з "weil" відмінюване дієслово стоїть на останньому місці.'
      },
      {
        id: 'de-g-3',
        skillCategory: 'grammar',
        level: 'B2',
        template: 'Wenn {name} mehr freie Zeit gehabt hätte, _____ er den Fortgeschrittenenkurs erfolgreich abgeschlossen.',
        options: ['hätte', 'würde', 'war', 'wäre'],
        correctAnswer: 'hätte',
        explanation: 'Konjunktiv II минулого часу: hätte + Partizip II.'
      },
      {
        id: 'de-g-4',
        skillCategory: 'grammar',
        level: 'C1',
        template: 'Es wird erwartet, dass sämtliche Forschungsberichte bis morgen früh von den Gutachtern _____ werden.',
        options: ['überprüft', 'überprüfen', 'überprüften', 'zu überprüfen'],
        correctAnswer: 'überprüft',
        explanation: 'Пасивний стан (Vorgangspassiv): Partizip II + werden.'
      },
      {
        id: 'de-v-1',
        skillCategory: 'vocab',
        level: 'B1',
        template: 'Was bedeutet die deutsche Redewendung "jemandem die Daumen drücken"?',
        options: ['Jemandem viel Erfolg und Glück wünschen', 'Jemanden scharf kritisieren', 'Große Angst vor Prüfungen haben', 'Mit jemandem streiten'],
        correctAnswer: 'Jemandem viel Erfolg und Glück wünschen',
        explanation: '"Die Daumen drücken" — тримати кулаки / бажати успіху.'
      },
      {
        id: 'de-v-2',
        skillCategory: 'vocab',
        level: 'B2',
        template: 'Welche feste Nomen-Verb-Verbindung bedeutet "sich entscheiden"?',
        options: ['Eine Entscheidung treffen', 'Zur Verfügung stehen', 'Kritik üben', 'In Betracht ziehen'],
        correctAnswer: 'Eine Entscheidung treffen',
        explanation: '"Eine Entscheidung treffen" є усталеним синонімом до "sich entscheiden".'
      },
      {
        id: 'de-l-1',
        skillCategory: 'listening',
        level: 'A2',
        template: 'Welche Durchsage hören die Reisenden am Hauptbahnhof?',
        audioText: 'Sehr geehrte Fahrgäste. Der Regionalexpress nach {city} fährt heute ausnahmsweise von Gleis vier ab.',
        audioLang: 'de-DE',
        options: ['Der Zug nach {city} fährt von Gleis 4 ab', 'Der Zug nach Berlin fällt heute aus', 'Gleis 4 ist wegen Bauarbeiten gesperrt', 'Der Zug hat zwei Stunden Verspätung'],
        correctAnswer: 'Der Zug nach {city} fährt von Gleis 4 ab',
        explanation: 'В оголошенні чітко сказано: "fährt heute ausnahmsweise von Gleis vier ab".'
      },
      {
        id: 'de-r-1',
        skillCategory: 'logic',
        level: 'B2',
        template: 'Textanalyse: "Das duale Ausbildungssystem in Deutschland verknüpft praxisnahe Betriebsarbeit mit fundierter Berufsschultheorie. Unternehmen sichern sich so gezielt qualifizierte Nachwuchskräfte." Was ist der Hauptvorteil für Unternehmen?',
        options: ['Gezielte Ausbildung qualifizierter Nachwuchskräfte', 'Verringerung der Arbeitszeit auf 20 Stunden', 'Vollständiger Verzicht auf Prüfungen', 'Sofortiger Ausstieg aus der Digitalisierung'],
        correctAnswer: 'Gezielte Ausbildung qualifizierter Nachwuchskräfte',
        explanation: 'Головна перевага для компаній — цільова підготовка кваліфікованих молодих кадрів.'
      }
    ],

    // -------------------------------------------------------------
    // ESPANOL
    // -------------------------------------------------------------
    'espanol': [
      {
        id: 'es-g-1',
        skillCategory: 'grammar',
        level: 'A1',
        template: '{name} _____ muy alegre hoy porque aprobó el examen de admisión en {city}.',
        options: ['está', 'es', 'hay', 'tiene'],
        correctAnswer: 'está',
        explanation: 'Тимчасовий емоційний стан позначається дієсловом "estar".'
      },
      {
        id: 'es-g-2',
        skillCategory: 'grammar',
        level: 'B1',
        template: 'El profesor duda que los alumnos _____ todas las tareas antes del viernes.',
        options: ['terminen', 'terminan', 'terminaron', 'terminar'],
        correctAnswer: 'terminen',
        explanation: 'Дієслова сумніву (dudar que) вимагають умовного способу Subjuntivo.'
      },
      {
        id: 'es-g-3',
        skillCategory: 'grammar',
        level: 'B2',
        template: 'Si {name} _____ estudiado con mayor constancia, habría obtenido la máxima beca en {city}.',
        options: ['hubiera', 'habría', 'haya', 'tuviera'],
        correctAnswer: 'hubiera',
        explanation: 'Нереальна умова в минулому: Si + Pluscuamperfecto de Subjuntivo (hubiera estudiado).'
      },
      {
        id: 'es-v-1',
        skillCategory: 'vocab',
        level: 'B1',
        template: '¿Qué significa la expresión idiomática "dar en el clavo"?',
        options: ['Acertar con exactitud', 'Construir un mueble', 'Equivocarse totalmente', 'Llegar tarde'],
        correctAnswer: 'Acertar con exactitud',
        explanation: '"Dar en el clavo" означає точно влучити в суть, правильно вгадати.'
      },
      {
        id: 'es-l-1',
        skillCategory: 'listening',
        level: 'A2',
        template: '¿A qué puerta deben acudir los pasajeros según el aviso sonoro?',
        audioText: 'Atención señores pasajeros con destino a {city}, su vuelo embarcará de inmediato por la puerta número doce.',
        audioLang: 'es-ES',
        options: ['Puerta número 12 con destino a {city}', 'Puerta número 21', 'Puerta número 2', 'Vuelo cancelado'],
        correctAnswer: 'Puerta número 12 con destino a {city}',
        explanation: '"Doce" означає 12.'
      },
      {
        id: 'es-r-1',
        skillCategory: 'logic',
        level: 'B2',
        template: 'Comprensión de lectura: "La transición hacia matrices energéticas fotovoltaicas en el sur de España ha reducido la huella de carbono un {num}%, posicionando a la región como referente europeo." ¿Cuál es el impacto primordial?',
        options: ['Reducción sustancial de la huella de carbono', 'Aumento de las tarifas domésticas', 'Cierre de universidades tecnológicas', 'Abandono de la red de transporte'],
        correctAnswer: 'Reducción sustancial de la huella de carbono',
        explanation: 'Головний підсумок — істотне скорочення вуглецевого сліду.'
      }
    ],

    // -------------------------------------------------------------
    // CHINESE
    // -------------------------------------------------------------
    'chinese': [
      {
        id: 'zh-g-1',
        skillCategory: 'grammar',
        level: 'A1',
        template: '请问，图书馆在_____？',
        options: ['哪里', '什么', '谁', '多少'],
        correctAnswer: '哪里',
        explanation: '"哪里" (nǎlǐ) — питальне слово "де / куди".'
      },
      {
        id: 'zh-g-2',
        skillCategory: 'grammar',
        level: 'A2',
        template: '{name}昨天在书店买了两_____中文教材。',
        options: ['本', '张', '支', '个'],
        correctAnswer: '本',
        explanation: 'Лічильне слово для книг і підручників — 本 (běn).'
      },
      {
        id: 'zh-v-1',
        skillCategory: 'vocab',
        level: 'B1',
        template: '成语"画蛇添足"常用来比喻什么？',
        options: ['做了多余的事情反而弄糟了局面', '绘画技巧非常高超', '行动极其迅速', '热爱自然保护动物'],
        correctAnswer: '做了多余的事情反而弄糟了局面',
        explanation: '"画蛇添足" (прималювати змії ноги) означає зіпсувати справу зайвими діями.'
      },
      {
        id: 'zh-l-1',
        skillCategory: 'listening',
        level: 'A2',
        template: '根据广播，大家明天上午几点在校门口集合？',
        audioText: '请各位同学注意，明天上午八点三十分，我们在学校正门集合出发。',
        audioLang: 'zh-CN',
        options: ['上午 8:30', '上午 9:00', '下午 2:30', '上午 7:00'],
        correctAnswer: '上午 8:30',
        explanation: '"八点三十分" — це 8:30 ранку.'
      },
      {
        id: 'zh-r-1',
        skillCategory: 'logic',
        level: 'B2',
        template: '阅读短文："人工智能技术的普及极大地提升了语言学习者的个性化辅导效率，让每位学生都能依照自身节奏掌握新技能。" 本文强调的核心要点是什么？',
        options: ['提升个性化辅导效率并支持自主节奏', '彻底取消学校常规考试', '禁止使用任何线上学习工具', '减少外语课程总学时'],
        correctAnswer: '提升个性化辅导效率并支持自主节奏',
        explanation: 'Ключовий висновок — підвищення ефективності персонального навчання у власному темпі.'
      }
    ],

    // -------------------------------------------------------------
    // POLISH
    // -------------------------------------------------------------
    'polish': [
      {
        id: 'pl-g-1',
        skillCategory: 'grammar',
        level: 'A2',
        template: 'Wczoraj {name} spotkał się z nowym _____ w kawiarni w {city}.',
        options: ['kolegą', 'kolega', 'kolegę', 'koledze'],
        correctAnswer: 'kolegą',
        explanation: 'Прийменник "z" вимагає орудного відмінка (Narzędnik): z kolegą.'
      },
      {
        id: 'pl-g-2',
        skillCategory: 'grammar',
        level: 'B1',
        template: 'Gdybym miał więcej wolnego czasu, z pewnością _____ na zaawansowany kurs w {city}.',
        options: ['zapisałbym się', 'zapiszę się', 'zapisałem się', 'będę zapisać'],
        correctAnswer: 'zapisałbym się',
        explanation: 'Умовний спосіб (Tryb przypuszczający): zapisałbym się.'
      },
      {
        id: 'pl-v-1',
        skillCategory: 'vocab',
        level: 'B1',
        template: 'Co w języku polskim oznacza frazeologizm "mieć urwanie głowy"?',
        options: ['Mieć mnóstwo pilnych obowiązków i pośpiechu', 'Mieć silny ból głowy', 'Zgubić kapelusz na wietrze', 'Być całkowicie wypoczętym'],
        correctAnswer: 'Mieć mnóstwo pilnych obowiązków i pośpiechu',
        explanation: '"Mieć urwanie głowy" — мати безліч термінових справ і клопоту.'
      },
      {
        id: 'pl-l-1',
        skillCategory: 'listening',
        level: 'A2',
        template: 'Z którego peronu odjedzie pociąg ekspresowy do {city}?',
        audioText: 'Uwaga podróżni. Pociąg pospieszny do {city} odjedzie z toru pierwszego przy peronie drugim o godzinie szesnastej trzydzieści.',
        audioLang: 'pl-PL',
        options: ['Z peronu 2 o godzinie 16:30', 'Z peronu 1 o godzinie 15:30', 'Z peronu 3 o godzinie 17:00', 'Pociąg został odwołany'],
        correctAnswer: 'Z peronu 2 o godzinie 16:30',
        explanation: 'В аудіо чітко чутно: "przy peronie drugim o godzinie szesnastej trzydzieści (16:30)".'
      },
      {
        id: 'pl-r-1',
        skillCategory: 'logic',
        level: 'B2',
        template: 'Tekst: "Krakowski park technologiczny przyciąga innowacyjne startupy dzięki ścisłej współpracy z Akademią Górniczo-Hutniczą i Uniwersytetem Jagiellońskim." Co stanowi kluczowy czynnik sukcesu?',
        options: ['Ścisła współpraca z czołowymi uczelniami', 'Całkowity brak podatków miejskich', 'Likwidacja tradycyjnych bibliotek', 'Zamknięcie ruchu tramwajowego'],
        correctAnswer: 'Ścisła współpraca z czołowymi uczelniami',
        explanation: 'Головний фактор успіху парку — тісна співпраця з університетами.'
      }
    ],

    // -------------------------------------------------------------
    // MATHEMATICS
    // -------------------------------------------------------------
    'math': [
      {
        id: 'math-t-1',
        skillCategory: 'grammar',
        level: 'Середній (150+)',
        template: 'Укажіть правильну тотожність для логарифма добутку двох додатних чисел $x$ і $y$ за основою $a$ ($a > 0, a \\neq 1$):',
        options: [
          '$\\log_a(x \\cdot y) = \\log_a x + \\log_a y$',
          '$\\log_a(x \\cdot y) = \\log_a x \\cdot \\log_a y$',
          '$\\log_a(x \\cdot y) = \\log_a x - \\log_a y$',
          '$\\log_a(x \\cdot y) = y \\cdot \\log_a x$'
        ],
        correctAnswer: '$\\log_a(x \\cdot y) = \\log_a x + \\log_a y$',
        explanation: 'Логарифм добутку дорівнює сумі логарифмів співмножників.'
      },
      {
        id: 'math-t-2',
        skillCategory: 'grammar',
        level: 'Достатній (175+)',
        template: 'Яка з наведених функцій є парною на всій області визначення $\\mathbb{R}$?',
        options: [
          '$f(x) = x^2 + \\cos x$',
          '$f(x) = x^3 + \\sin x$',
          '$f(x) = 2x + 1$',
          '$f(x) = x^5 - x$'
        ],
        correctAnswer: '$f(x) = x^2 + \\cos x$',
        explanation: '$f(-x) = (-x)^2 + \\cos(-x) = x^2 + \\cos x = f(x)$, отже функція парна.'
      },
      {
        id: 'math-f-1',
        skillCategory: 'vocab',
        level: 'Достатній (175+)',
        template: 'Знайдіть похідну функції $f(x) = {a}x^{num} - {b}x$:',
        dynamicFn: (prng) => {
          const a = Math.floor(prng() * 3) + 2; // 2..4
          const num = Math.floor(prng() * 2) + 3; // 3..4
          const b = Math.floor(prng() * 5) + 3; // 3..7
          const coef = a * num;
          const power = num - 1;
          const correct = `$f'(x) = ${coef}x^{${power}} - ${b}$`;
          const d1 = `$f'(x) = ${a}x^{${power}} - ${b}$`;
          const d2 = `$f'(x) = ${coef}x^{${num}} - ${b}x$`;
          const d3 = `$f'(x) = ${coef}x^{${power}} + ${b}$`;
          return {
            text: `Знайдіть похідну функції $f(x) = ${a}x^{${num}} - ${b}x$:`,
            options: [correct, d1, d2, d3],
            correctAnswer: correct,
            explanation: `За правилом диференціювання: $(${a}x^{${num}})' = ${coef}x^{${power}}$, а $(${b}x)' = ${b}$.`
          };
        }
      },
      {
        id: 'math-f-2',
        skillCategory: 'vocab',
        level: 'Середній (150+)',
        template: 'Чому дорівнює площа трикутника зі сторонами $a$ і $b$ та кутом $30^\\circ$ між ними?',
        options: [
          '$S = \\frac{1}{4} a b$',
          '$S = \\frac{1}{2} a b$',
          '$S = \\frac{\\sqrt{3}}{4} a b$',
          '$S = a b$'
        ],
        correctAnswer: '$S = \\frac{1}{4} a b$',
        explanation: '$S = \\frac{1}{2} a b \\sin 30^\\circ = \\frac{1}{2} a b \\cdot \\frac{1}{2} = \\frac{1}{4} a b$.'
      },
      {
        id: 'math-p-1',
        skillCategory: 'listening',
        level: 'Середній (150+)',
        template: 'Знайдіть довжину гіпотенузи прямокутного трикутника з катетами {num1} см та {num2} см:',
        audioText: 'Уважно прослухайте задачу: прямокутний трикутник має катети {num1} сантиметрів та {num2} сантиметрів. Знайдіть довжину гіпотенузи.',
        audioLang: 'uk-UA',
        dynamicFn: (prng) => {
          const triples = [
            { a: 3, b: 4, c: 5 },
            { a: 6, b: 8, c: 10 },
            { a: 5, b: 12, c: 13 },
            { a: 8, b: 15, c: 17 }
          ];
          const choice = triples[Math.floor(prng() * triples.length)];
          const correct = `${choice.c} см`;
          return {
            text: `Знайдіть довжину гіпотенузи прямокутного трикутника з катетами ${choice.a} см та ${choice.b} см:`,
            audioText: `У прямокутному трикутнику катети дорівнюють ${choice.a} та ${choice.b} сантиметрів. Обчисліть гіпотенузу за теоремою Піфагора.`,
            options: [correct, `${choice.c + 2} см`, `${choice.c - 1} см`, `${choice.a + choice.b} см`],
            correctAnswer: correct,
            explanation: `За теоремою Піфагора: $c = \\sqrt{${choice.a}^2 + ${choice.b}^2} = \\sqrt{${choice.a * choice.a + choice.b * choice.b}} = ${choice.c}$ см.`
          };
        }
      },
      {
        id: 'math-l-1',
        skillCategory: 'logic',
        level: 'Високий (190–200 НМТ)',
        template: 'У коробці лежать {white} білих і {black} чорних кульок. Яка ймовірність того, що навмання вийнята кулька виявиться білою?',
        dynamicFn: (prng) => {
          const white = Math.floor(prng() * 3) + 3; // 3..5
          const black = Math.floor(prng() * 4) + 5; // 5..8
          const total = white + black;
          const correct = `$\\frac{${white}}{${total}}$`;
          const d1 = `$\\frac{${black}}{${total}}$`;
          const d2 = `$\\frac{${white}}{${black}}$`;
          const d3 = `$\\frac{1}{${total}}$`;
          return {
            text: `У коробці лежать ${white} білих і ${black} чорних кульок. Яка ймовірність витягнути навмання білу кульку?`,
            options: [correct, d1, d2, d3],
            correctAnswer: correct,
            explanation: `Класична ймовірність: $P = \\frac{m}{n} = \\frac{${white}}{${total}}$.`
          };
        }
      }
    ],

    // -------------------------------------------------------------
    // UKRAINIAN LANGUAGE
    // -------------------------------------------------------------
    'ukr-lang': [
      {
        id: 'ukr-t-1',
        skillCategory: 'grammar',
        level: 'Середній (150+)',
        template: 'Спрощення в групах приголосних НА ПИСЬМІ відбувається в усіх словах рядка:',
        options: [
          'проїз..ний, корис..ний, тиж..невий',
          'шіс..надцять, хвас..ливий, зап\'яс..ний',
          'контрас..ний, пес..ливий, випус..ний',
          'балас..ний, форпос..ний, захис..ний'
        ],
        correctAnswer: 'проїз..ний, корис..ний, тиж..невий',
        explanation: 'Спрощення на письмі закріплене в словах: проїзний, корисний, тижневий. У словах "шістнадцять", "зап\'ястний", "хвастливий" спрощення лише у вимові.'
      },
      {
        id: 'ukr-t-2',
        skillCategory: 'grammar',
        level: 'Достатній (175+)',
        template: 'Граматичну помилку у побудові речення з дієприслівниковим зворотом допущено в рядку:',
        options: [
          'Вийшовши з університету, пішов сильний травневий дощ.',
          'Повернувшись додому, {name} одразу взявся за підготовку до НМТ.',
          'Переглядаючи конспект, студенти повторили ключові формули.',
          'Працюючи над проектом, ми використали сучасні джерела.'
        ],
        correctAnswer: 'Вийшовши з університету, пішов сильний травневий дощ.',
        explanation: 'Дія дієприслівника має стосуватися підмета речення. Дощ не міг "вийти з університету".'
      },
      {
        id: 'ukr-v-1',
        skillCategory: 'vocab',
        level: 'Достатній (175+)',
        template: 'Наголос на ДРУГОМУ складі падає в усіх словах рядка (згідно з програмою НМТ):',
        options: [
          'чорнОзем, квартАл, експЕрт',
          'вИпадок, фенОмен, дочкА',
          'руслО, фідЕр, кОлія',
          'напІй, цЕнтнер, жАль'
        ],
        correctAnswer: 'чорнОзем, квартАл, експЕрт',
        explanation: 'Нормативний наголос за чинною програмою УЦОЯО: чорнОзем, квартАл, експЕрт.'
      },
      {
        id: 'ukr-v-2',
        skillCategory: 'vocab',
        level: 'Середній (150+)',
        template: 'Лексичну помилку допущено у словосполученні:',
        options: [
          'приймати участь у дебатах',
          'брати участь у змаганнях',
          'завдати непоправних збитків',
          'протягом навчального року'
        ],
        correctAnswer: 'приймати участь у дебатах',
        explanation: 'Нормативний вислів — "брати участь". Конструкція "приймати участь" є калькою з російської.'
      },
      {
        id: 'ukr-l-1',
        skillCategory: 'listening',
        level: 'Середній (150+)',
        template: 'Укажіть слово з озвученого фрагмента, у якому звуків БІЛЬШЕ, ніж букв:',
        audioText: 'Яблуневий цвіт біля бабусиної хати щедро вигравав у променях весняного сонця.',
        audioLang: 'uk-UA',
        options: [
          'Яблуневий (буква Я на початку позначає 2 звуки [йа])',
          'Цвіт',
          'Хати',
          'Сонця'
        ],
        correctAnswer: 'Яблуневий (буква Я на початку позначає 2 звуки [йа])',
        explanation: 'Буква "я" на початку слова дає два звуки [й][а], тому в слові "яблуневий" 9 букв і 10 звуків.'
      },
      {
        id: 'ukr-r-1',
        skillCategory: 'logic',
        level: 'Високий (190–200 НМТ)',
        template: 'Прочитайте мікротекст: "Мовна стійкість спільноти вимірюється не пасивним знанням граматичних правил, а послідовним вибором рідної мови у публічному просторі, цифрових продуктах та повсякденному спілкуванні." Яка провідна думка?',
        options: [
          'Мовна стійкість проявляється в активному щоденному вжитку мови',
          'Граматичні правила не мають жодного значення для освіти',
          'Цифрові сервіси руйнують традиційну мовну культуру',
          'Мову слід вивчати лише в академічних установах'
        ],
        correctAnswer: 'Мовна стійкість проявляється в активному щоденному вжитку мови',
        explanation: 'Автор акцентує, що мовна стійкість виявляється у практичному виборі мови в житті та медіа.'
      }
    ],

    // -------------------------------------------------------------
    // HISTORY OF UKRAINE
    // -------------------------------------------------------------
    'history': [
      {
        id: 'hist-t-1',
        skillCategory: 'grammar',
        level: 'Середній (150+)',
        template: 'Укажіть рік укладення Люблінської унії, внаслідок якої Королівство Польське та Велике князівство Литовське об\'єдналися в Річ Посполиту:',
        options: ['1569 р.', '1596 р.', '1648 р.', '1556 р.'],
        correctAnswer: '1569 р.',
        explanation: 'Люблінська унія була підписана 1 липня 1569 року.'
      },
      {
        id: 'hist-t-2',
        skillCategory: 'grammar',
        level: 'Достатній (175+)',
        template: 'Яку подію української історії 1918 року пов\'язують із проголошенням самостійності та незалежності Української Народної Республіки?',
        options: [
          'Ухвалення IV Універсалу Української Центральної Ради',
          'Підписання Брест-Литовського мирного договору',
          'Гетьманський переворот Павла Скоропадського',
          'Утворення Західноукраїнської Народної Республіки (ЗУНР)'
        ],
        correctAnswer: 'Ухвалення IV Універсалу Української Центральної Ради',
        explanation: 'IV Універсал (22 січня 1918 р.) проголосив УНР "самостійною, ні від кого незалежною, вільною, суверенною державою українського народу".'
      },
      {
        id: 'hist-v-1',
        skillCategory: 'vocab',
        level: 'Середній (150+)',
        template: 'Як називалося велике багатогалузеве господарство польської та української шляхти XVI–XVIII ст., засноване на панщинній праці селян та орієнтоване на ринок?',
        options: ['Фільварок', 'Вотчина', 'Паланка', 'Слобода'],
        correctAnswer: 'Фільварок',
        explanation: 'Фільварок — товарне господарство, продукція якого йшла на внутрішній та європейський ринки.'
      },
      {
        id: 'hist-l-1',
        skillCategory: 'listening',
        level: 'Високий (190–200 НМТ)',
        template: 'До якого документа Центральної Ради належить озвучена цитата?',
        audioText: 'Хай буде Україна вільною. Не одділяючись від всієї Росії, хай народ український на своїй землі має право сам порядкувати своїм життям.',
        audioLang: 'uk-UA',
        options: [
          'I Універсал УЦР (червень 1917 р.)',
          'II Універсал УЦР',
          'III Універсал УЦР',
          'IV Універсал УЦР'
        ],
        correctAnswer: 'I Універсал УЦР (червень 1917 р.)',
        explanation: 'Цитата належить до I Універсалу, що проголосив автономію України у складі федеративної республіки.'
      },
      {
        id: 'hist-r-1',
        skillCategory: 'logic',
        level: 'Високий (190–200 НМТ)',
        template: 'Установіть правильну хронологічну послідовність битв Національно-визвольної війни під проводом Богдана Хмельницького:',
        options: [
          'Жовті Води -> Корсунь -> Пилявці -> Зборів',
          'Зборів -> Жовті Води -> Корсунь -> Берестечко',
          'Берестечко -> Пилявці -> Корсунь -> Батіг',
          'Батіг -> Зборів -> Жовті Води -> Пилявці'
        ],
        correctAnswer: 'Жовті Води -> Корсунь -> Пилявці -> Зборів',
        explanation: 'Хронологія перемог 1648–1649 рр.: Жовті Води (травень 1648), Корсунь (травень 1648), Пилявці (вересень 1648), Зборів (серпень 1649).'
      }
    ],

    // -------------------------------------------------------------
    // BIOLOGY & PHYSICS
    // -------------------------------------------------------------
    'biology': [
      {
        id: 'bio-t-1',
        skillCategory: 'grammar',
        level: 'Середній (150+)',
        template: 'Яке розщеплення за фенотипом очікується у потомстві F2 при моногібридному схрещуванні гетерозигот за умови повного домінування (II закон Менделя)?',
        options: ['3 : 1', '1 : 2 : 1', '9 : 3 : 3 : 1', '1 : 1'],
        correctAnswer: '3 : 1',
        explanation: 'За другим законом Менделя (розщеплення ознак) розщеплення за фенотипом дорівнює 3:1 (75% домінантних, 25% рецесивних).'
      },
      {
        id: 'bio-t-2',
        skillCategory: 'grammar',
        level: 'Достатній (175+)',
        template: 'Який процес є ключовою подією світлової фази фотосинтезу в хлоропластах рослин?',
        options: [
          'Фотоліз води з виділенням вільного кисню та синтезом АТФ',
          'Фіксація вуглекислого газу в циклі Кальвіна',
          'Гліколітичне розщеплення глюкози до пірувату',
          'Трансляція матричної РНК на рибосомах'
        ],
        correctAnswer: 'Фотоліз води з виділенням вільного кисню та синтезом АТФ',
        explanation: 'Під дією квантів світла відбувається фотоліз води ($2H_2O \\rightarrow 4H^+ + 4e^- + O_2$) та фотофосфорилювання.'
      },
      {
        id: 'bio-f-1',
        skillCategory: 'vocab',
        level: 'Середній (150+)',
        template: 'За яким фізичним законом зв\'язані сила струму $I$, напруга $U$ та електричний опір $R$ для однорідної ділянки кола?',
        options: [
          'Закон Ома: $I = \\frac{U}{R}$',
          'Закон Джоуля-Ленца: $Q = I^2 R t$',
          'Закон Кулона: $F = k \\frac{q_1 q_2}{r^2}$',
          'Другий закон Ньютона: $F = m a$'
        ],
        correctAnswer: 'Закон Ома: $I = \\frac{U}{R}$',
        explanation: 'Закон Ома для ділянки кола стверджує, що сила струму прямо пропорційна напрузі та обернено пропорційна опору.'
      },
      {
        id: 'bio-l-1',
        skillCategory: 'listening',
        level: 'Достатній (175+)',
        template: 'Визначте відсоткову частку гуанілових нуклеотидів (Г) у досліджуваному фрагменті ДНК:',
        audioText: 'Увага! Лабораторний аналіз показав, що у фрагменті дволанцюгової ДНК частка тиміну становить двадцять відсотків від загальної кількості нуклеотидів. Обчисліть частку гуаніну за правилом Чаргаффа.',
        audioLang: 'uk-UA',
        options: ['30%', '20%', '40%', '10%'],
        correctAnswer: '30%',
        explanation: 'За правилом Чаргаффа: Т = А = 20% (разом 40%). На Г + Ц залишається 60%, отже Г = Ц = 30%.'
      },
      {
        id: 'bio-r-1',
        skillCategory: 'logic',
        level: 'Високий (190–200 НМТ)',
        template: 'Тіло масою 2 кг рухається рівномірно прямолінійно зі швидкістю 6 м/с. Чому дорівнює його кінетична енергія?',
        options: ['36 Дж', '12 Дж', '72 Дж', '18 Дж'],
        correctAnswer: '36 Дж',
        explanation: '$E_k = \\frac{m v^2}{2} = \\frac{2 \\cdot 6^2}{2} = 36$ Дж.'
      }
    ]
  };

  // Helper to retrieve seen question IDs from sessionStorage
  function getSeenQuestionIds() {
    try {
      const raw = sessionStorage.getItem('strictai_seen_placement_q');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function markQuestionsSeen(ids) {
    try {
      const seen = new Set(getSeenQuestionIds());
      ids.forEach((id) => seen.add(id));
      sessionStorage.setItem('strictai_seen_placement_q', JSON.stringify(Array.from(seen)));
    } catch (e) {
      // Ignore sessionStorage quota errors
    }
  }

  // Controller class
  class StrictPlacementController {
    constructor() {
      this.SUBJECTS = SUBJECTS;
      this.currentSubject = 'english';
      this.currentMode = 'cefr'; // 'cefr' or 'ai'
      this.currentSeed = '';
      this.testQuestions = [];
      this.currentIndex = 0;
      this.score = 0;
      this.answered = false;

      // 4-Skill counters
      this.skillStats = {
        grammar: { correct: 0, total: 0 },
        vocab: { correct: 0, total: 0 },
        listening: { correct: 0, total: 0 },
        logic: { correct: 0, total: 0 }
      };

      // AI Mode adaptive tracking
      this.aiCurrentLevelIndex = 2; // Starts at B1 or Middle
      this.aiStepHistory = [];

      this.determinedResult = null;
    }

    init() {
      this._parseUrlParams();
      this.generateNewSeed();
      this.renderSubjectSelector();
      this.renderHistory();
      this._bindEvents();
      this._renderMiniPanda('#quiz-panda-mini', 'idle');
    }

    _parseUrlParams() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        let paramSub = urlParams.get('subject');
        if (paramSub) {
          paramSub = paramSub.toLowerCase();
          const aliasMap = {
            'en': 'english',
            'de': 'deutsch',
            'es': 'espanol',
            'zh': 'chinese',
            'pl': 'polish',
            'uk': 'ukr-lang',
            'hist': 'history',
            'sci': 'biology'
          };
          if (aliasMap[paramSub]) paramSub = aliasMap[paramSub];
          if (this.SUBJECTS[paramSub]) {
            this.currentSubject = paramSub;
          }
        }
        const paramMode = urlParams.get('mode');
        if (paramMode && (paramMode === 'cefr' || paramMode === 'ai')) {
          this.currentMode = paramMode;
        }
      } catch (e) {
        // ignore
      }
    }

    generateNewSeed() {
      const prefix = this.currentMode === 'ai' ? 'AI' : 'CEFR';
      const num = Math.floor(1000 + Math.random() * 9000);
      const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      this.currentSeed = `#${prefix}-${num}-${letter}`;

      const seedEl = document.getElementById('current-seed-label');
      if (seedEl) {
        seedEl.textContent = this.currentSeed;
      }
      return this.currentSeed;
    }

    renderSubjectSelector() {
      const grid = document.getElementById('subject-selector-grid');
      if (!grid) return;

      grid.innerHTML = Object.keys(this.SUBJECTS).map((key) => {
        const subj = this.SUBJECTS[key];
        const isSelected = key === this.currentSubject;

        return `
          <button type="button" class="subject-select-card ${isSelected ? 'active' : ''}" data-subject="${subj.id}">
            <span class="subj-icon">${subj.icon}</span>
            <span class="subj-name">${subj.name}</span>
            <span class="subj-meta">${subj.category === 'lang' ? 'CEFR A1–C2' : 'НМТ 100–200 балів'}</span>
          </button>
        `;
      }).join('');
    }

    _bindEvents() {
      // Subject card selection
      const grid = document.getElementById('subject-selector-grid');
      if (grid) {
        grid.addEventListener('click', (e) => {
          const btn = e.target.closest('.subject-select-card, .subject-btn, .subject-card');
          if (btn) {
            const subjId = btn.dataset.subject || btn.dataset.subjectId;
            if (subjId && this.SUBJECTS[subjId]) {
              this.currentSubject = subjId;
              this.renderSubjectSelector();
              if (window.StrictComponents) window.StrictComponents.playBeep('click');
            }
          }
        });
      }

      // Mode radio selection
      const modeRadios = document.querySelectorAll('input[name="test-mode"]');
      modeRadios.forEach((radio) => {
        radio.addEventListener('change', (e) => {
          this.currentMode = e.target.value;
          this.generateNewSeed();
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
        });
      });

      // Regenerate Seed button
      const seedBtn = document.getElementById('btn-regenerate-seed');
      if (seedBtn) {
        seedBtn.addEventListener('click', () => {
          this.generateNewSeed();
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
          seedBtn.style.transform = 'scale(0.96)';
          setTimeout(() => { seedBtn.style.transform = ''; }, 180);
          if (window.StrictNotifications && typeof window.StrictNotifications.show === 'function') {
            window.StrictNotifications.show({
              title: 'Білет оновлено',
              message: `Згенеровано новий білет ${this.currentSeed}`,
              type: 'info'
            });
          }
        });
      }

      // Start Diagnostic button
      const startBtn = document.getElementById('btn-start-placement');
      if (startBtn) {
        startBtn.addEventListener('click', () => {
          this.startTest();
        });
      }

      // Audio pronounce button
      const audioBtn = document.getElementById('btn-audio-pronounce') || document.getElementById('btn-play-question-audio');
      if (audioBtn) {
        audioBtn.addEventListener('click', () => {
          const q = this.testQuestions[this.currentIndex];
          if (q && q.audioText) {
            this.playAudio(q.audioText, q.audioLang || 'en-US');
          }
        });
      }

      // Next Question button
      const nextBtn = document.getElementById('btn-next-question');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.nextQuestion();
        });
      }

      // Abort button
      const abortBtn = document.getElementById('btn-abort-placement');
      if (abortBtn) {
        abortBtn.addEventListener('click', () => {
          if (confirm('Бажаєте перервати тест і повернутися до вибору предмета?')) {
            this.retakeTest();
          }
        });
      }

      // Save & Go to Tutor button
      const tutorBtn = document.getElementById('btn-save-and-tutor') || document.getElementById('btn-apply-level-tutor');
      if (tutorBtn) {
        tutorBtn.addEventListener('click', () => {
          this.saveResultAndGoToTutor();
        });
      }

      // Retake Test button
      const retakeBtn = document.getElementById('btn-retake-test') || document.getElementById('btn-retake-new-seed');
      if (retakeBtn) {
        retakeBtn.addEventListener('click', () => {
          this.retakeTest();
        });
      }
    }

    startTest() {
      if (window.StrictComponents) window.StrictComponents.playBeep('click');

      this.currentIndex = 0;
      this.score = 0;
      this.answered = false;
      this.skillStats = {
        grammar: { correct: 0, total: 0 },
        vocab: { correct: 0, total: 0 },
        listening: { correct: 0, total: 0 },
        logic: { correct: 0, total: 0 }
      };
      this.aiCurrentLevelIndex = 2; // B1 / Middle
      this.aiStepHistory = [];

      this.testQuestions = this.generateUniqueTest(this.currentSubject, this.currentMode, this.currentSeed);

      // Transition views
      const configView = document.getElementById('placement-config-view');
      const quizView = document.getElementById('placement-quiz-view');
      const resultView = document.getElementById('placement-result-view');

      if (configView) {
        configView.classList.add('hidden');
        configView.style.display = 'none';
      }
      if (resultView) {
        resultView.classList.add('hidden');
        resultView.style.display = 'none';
      }
      if (quizView) {
        quizView.classList.remove('hidden');
        quizView.style.display = 'block';
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Update quiz header
      const subMeta = this.SUBJECTS[this.currentSubject];
      const badge = document.getElementById('quiz-subject-badge');
      if (badge) badge.textContent = `${subMeta.icon} ${subMeta.name}`;

      const modeTitle = document.getElementById('quiz-mode-title');
      if (modeTitle) {
        modeTitle.textContent = this.currentMode === 'ai'
          ? '🤖 Жива ШІ-Діагностика з Пандою (AI Adaptive)'
          : '🌍 Міжнародний стандарт (CEFR / УЦОЯО Matrix)';
      }

      this.renderCurrentQuestion();
    }

    /**
     * Procedural generator that constructs unique test variants with zero repetitions
     */
    generateUniqueTest(subjectId, mode, seed) {
      const prng = createPRNG(seed || this.currentSeed || Date.now().toString());
      const subMeta = this.SUBJECTS[subjectId] || this.SUBJECTS.english;
      const pool = QUESTION_BANK[subjectId] || QUESTION_BANK.english;

      const seenIds = new Set(getSeenQuestionIds());
      const unseenPool = pool.filter((q) => !seenIds.has(q.id));
      const activePool = unseenPool.length >= 5 ? unseenPool : pool;

      const count = mode === 'ai' ? 5 : 8;
      const selectedTemplates = [];

      // Ensure balanced coverage across skill categories
      const categories = ['grammar', 'vocab', 'listening', 'logic'];
      for (const cat of categories) {
        const catItems = activePool.filter((q) => q.skillCategory === cat);
        if (catItems.length > 0) {
          const item = catItems[Math.floor(prng() * catItems.length)];
          if (!selectedTemplates.some((t) => t.id === item.id)) {
            selectedTemplates.push(item);
          }
        }
      }

      // Fill remainder with random items from pool
      const shuffledPool = shuffleWithPRNG(activePool, prng);
      for (const item of shuffledPool) {
        if (selectedTemplates.length >= count) break;
        if (!selectedTemplates.some((t) => t.id === item.id)) {
          selectedTemplates.push(item);
        }
      }

      // If still short, sample from full pool
      if (selectedTemplates.length < count) {
        const fallbackShuffled = shuffleWithPRNG(pool, prng);
        for (const item of fallbackShuffled) {
          if (selectedTemplates.length >= count) break;
          selectedTemplates.push(item);
        }
      }

      // Remember seen IDs
      markQuestionsSeen(selectedTemplates.map((q) => q.id));

      // Synthesize dynamic parameters
      return selectedTemplates.map((template, idx) => {
        return this._instantiateQuestion(template, prng, subMeta, idx);
      });
    }

    _instantiateQuestion(template, prng, subMeta, idx) {
      // If dynamicFn exists, execute it
      if (typeof template.dynamicFn === 'function') {
        const dyn = template.dynamicFn(prng);
        const shuffledOpts = shuffleWithPRNG(dyn.options, prng);
        const correctIdx = shuffledOpts.indexOf(dyn.correctAnswer);
        return {
          id: template.id + '-' + idx,
          skillCategory: template.skillCategory,
          level: template.level,
          question: dyn.text,
          audioText: dyn.audioText || null,
          audioLang: template.audioLang || subMeta.langCode,
          options: shuffledOpts,
          correctIndex: correctIdx >= 0 ? correctIdx : 0,
          explanation: dyn.explanation || ''
        };
      }

      // Otherwise replace placeholders
      const name = subMeta.type === 'language' && subMeta.id !== 'chinese'
        ? NAMES_EN[Math.floor(prng() * NAMES_EN.length)]
        : NAMES_UA[Math.floor(prng() * NAMES_UA.length)];

      let city = CITIES_UA[Math.floor(prng() * CITIES_UA.length)];
      if (subMeta.id === 'english') city = CITIES_EN[Math.floor(prng() * CITIES_EN.length)];
      else if (subMeta.id === 'deutsch') city = CITIES_DE[Math.floor(prng() * CITIES_DE.length)];
      else if (subMeta.id === 'espanol') city = CITIES_ES[Math.floor(prng() * CITIES_ES.length)];
      else if (subMeta.id === 'polish') city = CITIES_PL[Math.floor(prng() * CITIES_PL.length)];

      const year = (2018 + Math.floor(prng() * 6)).toString();
      const num = (15 + Math.floor(prng() * 40)).toString();

      const text = template.template
        .replace(/\{name\}/g, name)
        .replace(/\{city\}/g, city)
        .replace(/\{year\}/g, year)
        .replace(/\{num\}/g, num);

      let audioText = null;
      if (template.audioText) {
        audioText = template.audioText
          .replace(/\{name\}/g, name)
          .replace(/\{city\}/g, city)
          .replace(/\{year\}/g, year)
          .replace(/\{num\}/g, num);
      }

      // Shuffle options while keeping track of correct answer
      const rawOptions = template.options.map((opt) =>
        opt
          .replace(/\{name\}/g, name)
          .replace(/\{city\}/g, city)
          .replace(/\{year\}/g, year)
          .replace(/\{num\}/g, num)
      );

      const targetAnswer = template.correctAnswer
        .replace(/\{name\}/g, name)
        .replace(/\{city\}/g, city)
        .replace(/\{year\}/g, year)
        .replace(/\{num\}/g, num);

      const shuffledOpts = shuffleWithPRNG(rawOptions, prng);
      let correctIdx = shuffledOpts.indexOf(targetAnswer);
      if (correctIdx === -1) {
        correctIdx = 0;
        shuffledOpts[0] = targetAnswer;
      }

      return {
        id: template.id + '-' + idx,
        skillCategory: template.skillCategory,
        level: template.level,
        question: text,
        audioText: audioText,
        audioLang: template.audioLang || subMeta.langCode,
        options: shuffledOpts,
        correctIndex: correctIdx,
        explanation: template.explanation || ''
      };
    }

    renderCurrentQuestion() {
      const q = this.testQuestions[this.currentIndex];
      if (!q) return;

      this.answered = false;

      // Update progress bar & label
      const total = this.testQuestions.length;
      const progressText = document.getElementById('quiz-step-badge') || document.getElementById('quiz-progress-text');
      if (progressText) {
        progressText.textContent = this.currentMode === 'ai'
          ? `ШІ-Крок ${this.currentIndex + 1} з ${total}`
          : `Питання ${this.currentIndex + 1} з ${total}`;
      }

      const progressBar = document.getElementById('quiz-progress-bar');
      if (progressBar) {
        const pct = Math.round(((this.currentIndex) / total) * 100);
        progressBar.style.width = `${Math.max(10, pct)}%`;
      }

      // Question level badge
      const levelBadge = document.getElementById('quiz-difficulty-badge') || document.getElementById('question-level-badge');
      if (levelBadge) {
        const sub = this.SUBJECTS[this.currentSubject];
        if (this.currentMode === 'ai') {
          const currentLvl = sub.levels[this.aiCurrentLevelIndex] || 'B1';
          levelBadge.textContent = `Рівень: ${currentLvl}`;
        } else {
          levelBadge.textContent = q.level ? `Рівень: ${q.level}` : (sub.category === 'lang' ? 'CEFR A1–C2' : 'НМТ');
        }
      }

      // Audio pronounce button & box
      const audioBtn = document.getElementById('btn-audio-pronounce') || document.getElementById('btn-play-question-audio');
      const audioBox = document.getElementById('quiz-audio-box');
      if (q.audioText) {
        if (audioBox) audioBox.style.display = 'flex';
        if (audioBtn) {
          audioBtn.classList.remove('hidden');
          audioBtn.style.display = 'inline-flex';
          audioBtn.innerHTML = '<span>🔊 Прослухати вимову / аудіо фрагмент</span>';
          audioBtn.disabled = false;
        }
      } else {
        if (audioBox) audioBox.style.display = 'none';
        if (audioBtn) {
          audioBtn.classList.add('hidden');
          audioBtn.style.display = 'none';
        }
      }

      // Context box
      const contextEl = document.getElementById('quiz-question-context');
      if (contextEl) {
        if (q.context) {
          contextEl.textContent = q.context;
          contextEl.style.display = 'block';
        } else {
          contextEl.style.display = 'none';
        }
      }

      // Question prompt
      const questionText = document.getElementById('quiz-question-text') || document.getElementById('question-text');
      if (questionText) {
        questionText.textContent = q.question;
      }

      // Reset feedback commentary box
      const commentEl = document.getElementById('quiz-feedback-box') || document.getElementById('quiz-panda-comment');
      if (commentEl) {
        commentEl.style.display = 'none';
        commentEl.innerHTML = '';
      }

      // Speech bubble in hero
      const heroSpeech = document.getElementById('placement-panda-speech');
      if (heroSpeech) {
        heroSpeech.textContent = `«${this._getPandaPromptComment(q)}»`;
      }
      this._renderMiniPanda('#quiz-panda-mini', 'idle');

      // Options container
      const container = document.getElementById('quiz-options-grid') || document.getElementById('question-options-container');
      if (container) {
        const letters = ['A', 'B', 'C', 'D'];
        let html = q.options.map((opt, i) => `
          <button type="button" class="quiz-option-btn option-btn" data-option-index="${i}">
            <span class="option-letter">${letters[i] || (i + 1)}</span>
            <span class="option-text" style="flex: 1; font-weight: 500;">${opt}</span>
            <span class="opt-status-marker" style="width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 700;"></span>
          </button>
        `).join('');

        // If AI mode, inject short student reasoning input
        if (this.currentMode === 'ai') {
          html += `
            <div class="ai-written-box" style="margin-top: 16px; padding: 16px; background: var(--bg-card, #2B184A); border: 1px solid var(--border-card, rgba(255, 255, 255, 0.12)); border-radius: 14px;">
              <label for="ai-user-written-answer" style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--accent-orange, #F2994A); margin-bottom: 8px;">
                ✨ ШІ-Аналіз: Додай коротке пояснення свого вибору або переклад (необов'язково):
              </label>
              <input type="text" id="ai-user-written-answer" placeholder="Наприклад: Використано форму минулого часу, бо дія завершилася..." style="width: 100%; box-sizing: border-box; background: var(--bg-primary, #1E1035); border: 1px solid var(--border-card, rgba(255, 255, 255, 0.18)); border-radius: 10px; padding: 10px 14px; font-size: 0.9rem; color: var(--text-main, #FFFFFF); outline: none;">
            </div>
          `;
        }

        container.innerHTML = html;

        // Bind clicks on options
        const buttons = container.querySelectorAll('.quiz-option-btn, .option-btn');
        buttons.forEach((btn) => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.optionIndex, 10);
            this.handleOptionSelect(idx);
          });
        });
      }

      // Next button state
      const nextBtn = document.getElementById('btn-next-question');
      if (nextBtn) {
        nextBtn.disabled = true;
        const isLast = this.currentIndex === this.testQuestions.length - 1;
        nextBtn.innerHTML = isLast
          ? '<span>Завершити діагностику 🏁</span>'
          : '<span>Далі ➔</span>';
      }
    }

    _getPandaPromptComment(q) {
      if (this.currentMode === 'ai') {
        const sub = this.SUBJECTS[this.currentSubject];
        const currentLvl = sub.levels[this.aiCurrentLevelIndex] || 'B1';
        return `Я уважно слідкую за твоїм мисленням! Поточний діагностичний рівень: ${currentLvl}. Оцінюю точність та аргументацію.`;
      }

      if (q.skillCategory === 'listening') {
        return 'Увімкни аудіо фрагмент та зосередься на деталях: часі, числах чи ключових іменниках.';
      } else if (q.skillCategory === 'grammar') {
        return 'Зверни увагу на узгодження часів, прийменники та порядок слів у реченні.';
      } else if (q.skillCategory === 'vocab') {
        return 'Оціни контекст речення. Вибери найбільш влучне за стилем та значенням слово.';
      } else {
        return 'Прочитай фрагмент вдумливо. Знайди прямий логічний зв\'язок у тексті.';
      }
    }

    handleOptionSelect(selectedIndex) {
      if (this.answered) return;
      this.answered = true;

      const q = this.testQuestions[this.currentIndex];
      const isCorrect = selectedIndex === q.correctIndex;

      // Update skill mastery counters
      const cat = q.skillCategory || 'grammar';
      if (!this.skillStats[cat]) this.skillStats[cat] = { correct: 0, total: 0 };
      this.skillStats[cat].total += 1;
      if (isCorrect) {
        this.skillStats[cat].correct += 1;
        this.score += 1;
      }

      // Play beep sound
      if (window.StrictComponents) {
        window.StrictComponents.playBeep(isCorrect ? 'success' : 'alert');
      }

      // Visual feedback on options
      const container = document.getElementById('quiz-options-grid') || document.getElementById('question-options-container');
      if (container) {
        const buttons = container.querySelectorAll('.quiz-option-btn, .option-btn');
        buttons.forEach((btn) => {
          btn.disabled = true;
          const idx = parseInt(btn.dataset.optionIndex, 10);
          const marker = btn.querySelector('.opt-status-marker');

          if (idx === q.correctIndex) {
            btn.classList.add('correct');
            if (marker) {
              marker.innerHTML = '✓';
            }
          } else if (idx === selectedIndex && !isCorrect) {
            btn.classList.add('incorrect');
            if (marker) {
              marker.innerHTML = '✕';
            }
          }
        });
      }

      // Analyze short written response in AI mode
      let aiWrittenBonus = '';
      if (this.currentMode === 'ai') {
        const input = document.getElementById('ai-user-written-answer');
        if (input && input.value.trim().length > 3) {
          aiWrittenBonus = ' Твоє письмове обґрунтування враховано ШІ-моделлю (+бонусні бали)!';
        }
      }

      // Dynamic Red Panda feedback & Adaptive Difficulty adjustment
      const commentEl = document.getElementById('quiz-feedback-box') || document.getElementById('quiz-panda-comment');
      const heroSpeech = document.getElementById('placement-panda-speech');
      const sub = this.SUBJECTS[this.currentSubject];

      let feedbackHTML = '';
      let speechText = '';

      if (this.currentMode === 'ai') {
        if (isCorrect) {
          this.aiCurrentLevelIndex = Math.min(sub.levels.length - 1, this.aiCurrentLevelIndex + 1);
          const nextLvl = sub.levels[this.aiCurrentLevelIndex];
          feedbackHTML = `<span style="color: var(--accent-bamboo, #22C55E); font-weight: 700;">🎯 Бездоганно!</span> Правильна відповідь.${aiWrittenBonus} Підвищую складність до рівня <b>${nextLvl}</b>!`;
          speechText = `«Бездоганно! Підвищую складність до рівня ${nextLvl}.»`;
          if (commentEl) commentEl.style.borderLeftColor = 'var(--accent-bamboo, #22C55E)';
          this._renderMiniPanda('#quiz-panda-mini', 'celebrating');
        } else {
          this.aiCurrentLevelIndex = Math.max(0, this.aiCurrentLevelIndex - 1);
          const nextLvl = sub.levels[this.aiCurrentLevelIndex];
          feedbackHTML = `<span style="color: var(--accent-orange, #F2994A); font-weight: 700;">💡 Є неточність:</span> Правильна відповідь: «${q.options[q.correctIndex]}». ${q.explanation} Адаптую складність до <b>${nextLvl}</b>.`;
          speechText = `«Не засмучуйся, розберемо цю помилку. Адаптую рівень до ${nextLvl}.»`;
          if (commentEl) commentEl.style.borderLeftColor = 'var(--accent-orange, #F2994A)';
          this._renderMiniPanda('#quiz-panda-mini', 'thinking');
        }
      } else {
        if (isCorrect) {
          feedbackHTML = `<span style="color: var(--accent-bamboo, #22C55E); font-weight: 700;">✅ Чудово!</span> Правильна відповідь. ${q.explanation}`;
          speechText = `«Правильно! Рухаємось далі.»`;
          if (commentEl) commentEl.style.borderLeftColor = 'var(--accent-bamboo, #22C55E)';
          this._renderMiniPanda('#quiz-panda-mini', 'celebrating');
        } else {
          feedbackHTML = `<span style="color: #F43F5E; font-weight: 700;">❌ Помилка.</span> Правильна відповідь: «${q.options[q.correctIndex]}». ${q.explanation}`;
          speechText = `«Тут була пастка: запам'ятай це правило!»`;
          if (commentEl) commentEl.style.borderLeftColor = '#F43F5E';
          this._renderMiniPanda('#quiz-panda-mini', 'thinking');
        }
      }

      if (commentEl) {
        commentEl.innerHTML = feedbackHTML;
        commentEl.style.display = 'block';
      }
      if (heroSpeech) {
        heroSpeech.textContent = speechText;
      }

      // Enable Next button
      const nextBtn = document.getElementById('btn-next-question');
      if (nextBtn) {
        nextBtn.disabled = false;
      }
    }

    playAudio(text, lang) {
      if (!text) return;

      const audioBtn = document.getElementById('btn-audio-pronounce') || document.getElementById('btn-play-question-audio');
      const originalHTML = audioBtn ? audioBtn.innerHTML : '';
      if (audioBtn) {
        audioBtn.innerHTML = '<span>🔊 Відтворення...</span>';
        audioBtn.disabled = true;
      }

      const resetBtn = () => {
        if (audioBtn) {
          audioBtn.innerHTML = originalHTML || '<span>🔊 Прослухати вимову / аудіо фрагмент</span>';
          audioBtn.disabled = false;
        }
      };

      if (window.StrictPolyglotTTS && typeof window.StrictPolyglotTTS.speak === 'function') {
        try {
          window.StrictPolyglotTTS.speak(text, lang || 'en-US', null, resetBtn);
          return;
        } catch (e) {
          console.warn('StrictPolyglotTTS failed, falling back to Web Speech API', e);
        }
      }

      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(text);
          u.lang = lang || 'en-US';
          u.rate = 0.95;
          u.onend = resetBtn;
          u.onerror = resetBtn;
          window.speechSynthesis.speak(u);
        } catch (e) {
          console.warn('SpeechSynthesis invocation error:', e);
          resetBtn();
        }
      } else {
        resetBtn();
      }
    }

    nextQuestion() {
      if (window.StrictComponents) window.StrictComponents.playBeep('click');

      if (this.currentIndex + 1 < this.testQuestions.length) {
        this.currentIndex += 1;
        this.renderCurrentQuestion();
      } else {
        this.finishTest();
      }
    }

    finishTest() {
      const quizView = document.getElementById('placement-quiz-view');
      const resultView = document.getElementById('placement-result-view');

      if (quizView) {
        quizView.classList.add('hidden');
        quizView.style.display = 'none';
      }
      if (resultView) {
        resultView.classList.remove('hidden');
        resultView.style.display = 'block';
      }

      const results = this.calculateResults();
      this.determinedResult = results;
      this.renderResults(results);

      // Render Red Panda celebrating avatar in results view
      if (window.PandaAvatar && typeof window.PandaAvatar.render === 'function') {
        window.PandaAvatar.render('#result-panda-mount', {
          persona: 'friend',
          state: 'celebrating',
          accessory: 'graduation_cap'
        });
      } else {
        this._renderMiniPanda('#result-panda-mount', 'celebrating');
      }

      // Persist results into StrictStore
      this._saveToStore(results);
      this.renderHistory();

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    calculateResults() {
      const sub = this.SUBJECTS[this.currentSubject];
      const total = this.testQuestions.length;
      const score = this.score;
      const rawPct = total > 0 ? (score / total) : 0.8;

      let determinedLevel = 'B1';
      let title = '';
      let desc = '';

      if (sub.type === 'language') {
        if (rawPct <= 0.25) determinedLevel = 'A1';
        else if (rawPct <= 0.45) determinedLevel = 'A2';
        else if (rawPct <= 0.65) determinedLevel = 'B1';
        else if (rawPct <= 0.82) determinedLevel = 'B2';
        else if (rawPct <= 0.93) determinedLevel = 'C1';
        else determinedLevel = 'C2';

        const subtitles = {
          'A1': 'Beginner / Базовий контакт',
          'A2': 'Elementary / Елементарний',
          'B1': 'Intermediate / Середній незалежний',
          'B2': 'Upper-Intermediate / Впевнений користувач',
          'C1': 'Advanced / Просунутий професійний',
          'C2': 'Mastery / Досконалий носій'
        };

        title = `${determinedLevel} (${subtitles[determinedLevel] || determinedLevel})`;
        desc = `Ви демонструєте відмінне розуміння ключових конструкцій. Рекомендовано закріпити граматичні нюанси та розширити спеціальну лексику в ШІ-Репетиторі.`;
      } else {
        // NMT Score Matrix (100–200)
        let nmtScore = Math.round(120 + rawPct * 80);
        if (nmtScore > 200) nmtScore = 200;

        if (nmtScore < 140) {
          determinedLevel = 'Початковий (120+)';
          title = `Початковий рівень (${nmtScore} балів НМТ)`;
          desc = `Базові поняття засвоєно, але є прогалини у складних темах. Панда-репетитор допоможе підняти результат до 170+!`;
        } else if (nmtScore < 165) {
          determinedLevel = 'Середній (150+)';
          title = `Середній рівень (${nmtScore} балів НМТ)`;
          desc = `Впевнена середня база. Зосередьтеся на нестандартних задачах та практиці тестів попередніх років.`;
        } else if (nmtScore < 185) {
          determinedLevel = 'Достатній (175+)';
          title = `Достатній рівень (${nmtScore} балів НМТ)`;
          desc = `Чудовий результат! Більшість завдань НМТ розв\'язуються легко. До омріяних 200 балів залишилося відшліфувати логіку!`;
        } else {
          determinedLevel = 'Високий (190–200 НМТ)';
          title = `Високий рівень (${nmtScore} балів НМТ)`;
          desc = `Блискучий результат! Ви готові до вступу на бюджет у провідні виші України. Підтримуйте форму з ШІ-Пандою!`;
        }
      }

      // Compute skill percentages
      const calcSkill = (cat) => {
        const item = this.skillStats[cat];
        if (item && item.total > 0) {
          return Math.round((item.correct / item.total) * 100);
        }
        return Math.round(65 + rawPct * 30);
      };

      const grammarPct = calcSkill('grammar');
      const vocabPct = calcSkill('vocab');
      const listeningPct = calcSkill('listening');
      const logicPct = calcSkill('logic');

      return {
        subjectId: this.currentSubject,
        subjectName: sub.name,
        mode: this.currentMode,
        seed: this.currentSeed,
        level: determinedLevel,
        title: title,
        description: desc,
        score: score,
        total: total,
        skills: {
          grammar: grammarPct,
          vocab: vocabPct,
          listening: listeningPct,
          logic: logicPct
        }
      };
    }

    renderResults(res) {
      const titleEl = document.getElementById('result-level-title') || document.getElementById('result-level-badge');
      if (titleEl) titleEl.textContent = res.title;

      const descEl = document.getElementById('result-level-desc');
      if (descEl) descEl.textContent = res.description;

      const scorePctEl = document.getElementById('result-score-pct');
      if (scorePctEl) {
        const pct = res.total > 0 ? Math.round((res.score / res.total) * 100) : 0;
        scorePctEl.textContent = `${pct}%`;
      }

      // 4 Progress Bars
      const setBar = (valId, barId, pct) => {
        const valEl = document.getElementById(valId);
        const barEl = document.getElementById(barId);
        if (valEl) valEl.textContent = `${pct}%`;
        if (barEl) barEl.style.width = `${pct}%`;
      };

      setBar('skill-grammar-val', 'skill-grammar-bar', res.skills.grammar);
      setBar('skill-vocab-val', 'skill-vocab-bar', res.skills.vocab);
      setBar('skill-listening-val', 'skill-listening-bar', res.skills.listening);
      setBar('skill-logic-val', 'skill-logic-bar', res.skills.logic);

      // Panda review text
      const pandaText = document.getElementById('result-panda-text') || document.getElementById('result-panda-verdict');
      if (pandaText) {
        pandaText.textContent = `Пишаюся твоїми зусиллями! Твій рівень — «${res.level}». Я вже зберегла ці дані в профіль і згенерувала персональну дорожню карту в ШІ-Репетиторі. Почнімо тренування!`;
      }
    }

    renderHistory() {
      const listEl = document.getElementById('placement-history-list');
      if (!listEl) return;

      if (!window.StrictStore || typeof window.StrictStore.getState !== 'function') return;

      const state = window.StrictStore.getState();
      const history = Array.isArray(state.placementHistory) ? state.placementHistory : [];

      if (history.length === 0) {
        listEl.innerHTML = `
          <div class="history-empty">
            Немає збережених тестів. Пройдіть першу діагностику, щоб отримати сертифікат!
          </div>
        `;
        return;
      }

      listEl.innerHTML = history.slice(0, 5).map((item) => {
        const sub = this.SUBJECTS[item.subjectId] || {};
        const icon = sub.icon || '📚';
        const name = sub.name || item.subjectName || item.subjectId;
        const pct = item.total > 0 ? Math.round((item.score / item.total) * 100) : 100;
        return `
          <div class="history-item">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:1.2rem;">${icon}</span>
              <div>
                <strong>${name}</strong>
                <div style="font-size:0.78rem; color:var(--text-sub); opacity:0.8;">
                  ${item.date || ''} • Білет: ${item.seed || '—'}
                </div>
              </div>
            </div>
            <div style="text-align:right;">
              <span class="cert-badge-pill" style="font-weight:700; color:var(--accent-orange); font-size:0.9rem;">
                ${item.level}
              </span>
              <div style="font-size:0.78rem; color:var(--accent-bamboo, #22C55E); font-weight:600;">
                ${pct}% (${item.score}/${item.total})
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    _saveToStore(res) {
      if (!window.StrictStore || typeof window.StrictStore.update !== 'function') return;

      const sub = this.SUBJECTS[this.currentSubject];
      const isLang = sub.type === 'language' || sub.category === 'lang';

      window.StrictStore.update((st) => {
        const history = Array.isArray(st.placementHistory) ? [...st.placementHistory] : [];
        history.unshift({
          id: 'placement-' + Date.now(),
          date: new Date().toLocaleDateString('uk-UA'),
          subjectId: this.currentSubject,
          subjectName: sub.name,
          mode: this.currentMode,
          seed: this.currentSeed,
          level: res.level,
          score: res.score,
          total: res.total,
          skills: res.skills
        });

        const tutorUpdate = {
          ...st.tutor,
          level: isLang ? res.level.split(' ')[0] : 'B2'
        };

        if (isLang) {
          tutorUpdate.category = 'languages';
          tutorUpdate.language = sub.shortName;
        } else {
          tutorUpdate.category = 'school';
          tutorUpdate.nmtSubject = sub.shortName;
        }

        return {
          ...st,
          placementHistory: history.slice(0, 15),
          tutor: tutorUpdate
        };
      });
    }

    saveResultAndGoToTutor() {
      if (window.StrictComponents) window.StrictComponents.playBeep('success');

      const sub = this.SUBJECTS[this.currentSubject];
      const isLang = sub.type === 'language' || sub.category === 'lang';
      const cleanLevel = isLang ? (this.determinedResult?.level?.split(' ')[0] || 'B1') : 'B2';

      const url = `tutor.html?subject=${encodeURIComponent(this.currentSubject)}&level=${encodeURIComponent(cleanLevel)}&mode=${isLang ? 'languages' : 'school'}`;
      window.location.href = url;
    }

    retakeTest() {
      if (window.StrictComponents) window.StrictComponents.playBeep('click');

      const configView = document.getElementById('placement-config-view');
      const quizView = document.getElementById('placement-quiz-view');
      const resultView = document.getElementById('placement-result-view');

      if (quizView) {
        quizView.classList.add('hidden');
        quizView.style.display = 'none';
      }
      if (resultView) {
        resultView.classList.add('hidden');
        resultView.style.display = 'none';
      }
      if (configView) {
        configView.classList.remove('hidden');
        configView.style.display = 'block';
      }

      this.generateNewSeed();
      this.renderSubjectSelector();
      this.renderHistory();

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    _renderMiniPanda(containerOrSelector, mood = 'idle') {
      const el = typeof containerOrSelector === 'string'
        ? document.querySelector(containerOrSelector)
        : containerOrSelector;
      if (!el) return;

      const eyeL = mood === 'celebrating'
        ? '<path d="M 32 38 Q 38 32 44 38" fill="none" stroke="#1C1022" stroke-width="2.5" stroke-linecap="round"/>'
        : '<circle cx="38" cy="38" r="4.5" fill="#1C1022"/><circle cx="36" cy="36" r="1.5" fill="#FFF"/>';

      const eyeR = mood === 'celebrating'
        ? '<path d="M 56 38 Q 62 32 68 38" fill="none" stroke="#1C1022" stroke-width="2.5" stroke-linecap="round"/>'
        : '<circle cx="62" cy="38" r="4.5" fill="#1C1022"/><circle cx="60" cy="36" r="1.5" fill="#FFF"/>';

      const mouth = mood === 'celebrating'
        ? '<path d="M 46 54 Q 50 61 54 54" fill="#D83A56" stroke="#90142C" stroke-width="1.2"/>'
        : (mood === 'thinking'
          ? '<path d="M 47 54 Q 50 51 53 54" fill="none" stroke="#1C1022" stroke-width="2" stroke-linecap="round"/>'
          : '<path d="M 46 53 Q 50 57 54 53" fill="none" stroke="#1C1022" stroke-width="2" stroke-linecap="round"/>');

      el.innerHTML = `
        <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow">
          <!-- Ears -->
          <polygon points="20,40 10,12 36,24" fill="#E66728" stroke="#873010" stroke-width="2"/>
          <polygon points="18,34 14,18 30,24" fill="#FFFFFF"/>
          <polygon points="80,40 90,12 64,24" fill="#E66728" stroke="#873010" stroke-width="2"/>
          <polygon points="82,34 86,18 70,24" fill="#FFFFFF"/>
          <!-- Head -->
          <circle cx="50" cy="50" r="38" fill="#E66728" stroke="#873010" stroke-width="2"/>
          <!-- Cheeks White Fur -->
          <path d="M 16 52 Q 28 42 36 50 Q 24 68 16 52 Z" fill="#FFFFFF"/>
          <path d="M 84 52 Q 72 42 64 50 Q 76 68 84 52 Z" fill="#FFFFFF"/>
          <!-- Muzzle -->
          <ellipse cx="50" cy="55" rx="15" ry="10" fill="#FFFFFF"/>
          <polygon points="46,49 54,49 50,53" fill="#1C1022"/>
          ${mouth}
          <!-- Eyes -->
          ${eyeL}
          ${eyeR}
          <!-- Glasses -->
          <circle cx="38" cy="38" r="8" fill="rgba(255,255,255,0.2)" stroke="#F2994A" stroke-width="1.8"/>
          <circle cx="62" cy="38" r="8" fill="rgba(255,255,255,0.2)" stroke="#F2994A" stroke-width="1.8"/>
          <path d="M 46 38 L 54 38" stroke="#F2994A" stroke-width="1.8"/>
        </svg>
      `;
    }
  }

  const instance = new StrictPlacementController();

  if (typeof root !== 'undefined') {
    root.StrictPlacement = instance;
  }
  if (typeof window !== 'undefined') {
    window.StrictPlacement = instance;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StrictPlacement: instance, StrictPlacementController };
  }

  // DOMContentLoaded bootstrap
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      if (window.StrictComponents && typeof window.StrictComponents.initPage === 'function') {
        window.StrictComponents.initPage('placement');
      }

      if (window.PandaAvatar && typeof window.PandaAvatar.render === 'function') {
        window.PandaAvatar.render('#placement-panda-mount', { persona: 'examiner', state: 'idle' });
      }

      instance.init();
      console.log('StrictPlacement diagnostic controller initialized successfully.');
    });
  }

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
