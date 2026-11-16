/**
 * StrictAI Placement Test Controller (window.StrictPlacement)
 * Comprehensive Diagnostic Testing Engine supporting CEFR (A1–C2) & NMT/School Matrix.
 * 
 * Strict academic integrity & anti-cheat architecture:
 * - 9 Subjects (English, Deutsch, Español, Chinese, Polish, Math, Ukrainian, History, Biology/Physics)
 * - 2 Diagnostic Modes: Standard Matrix (8 questions) & AI Adaptive Placement (5 steps with Red Panda)
 * - 4 AI-Resilient Question Formats:
 *     1. 📊 Кейс курсу StrictAI (aiType: 'case_study', aiBadge: '📊 Кейс курсу StrictAI')
 *     2. 📐 Багатокомпонентна візуальна схема (Canvas) (aiType: 'visual_diagram', aiBadge: '📐 Багатокомпонентна візуальна схема (Canvas)')
 *     3. 🐞 Пошук багів у розв'язку (Find the Bug) (aiType: 'find_bug', aiBadge: '🐞 Пошук багів у розв\'язку (Find the Bug)')
 *     4. 🪤 Пастка для LLM (Інформаційний шум) (aiType: 'llm_trap', aiBadge: '🪤 Пастка для LLM (Інформаційний шум)')
 * - Anti-Cheat Engine Integration (window.StrictAntiCheat):
 *     * Event & context lockdown (enableSecurityLocks / enableBrowserLockdown)
 *     * Tab-blur & focus tracking (startFocusTracking with 2-strike question forfeiture)
 *     * AI Extension mutation shield (initMutationObserver / startExtensionShield)
 *     * Extension attack simulator trigger (#btn-simulate-ai-extension -> simulateAIExtension)
 *     * Biometric Telemetry HUD (#placement-telemetry-hud -> renderTelemetryHUD)
 *     * Manual & blitz micro-verification modal (#btn-trigger-micro-verify & fast click < 4s)
 *     * 45-second per-question countdown hard timer with progress bar
 *     * Back-navigation lockdown (#btn-quiz-prev: 🔒 Назад заборонено)
 * - NO TTS / Voice Synthesis: pure reading & dialogue text analysis without audio
 * - Full i18n synchronization on view transitions
 */

(function (root) {
  'use strict';

  // Deterministic Mulberry32-based PRNG from seed string
  function createPRNG(seedStr) {
    let h = 1779033703 ^ (seedStr ? seedStr.length : 0);
    const str = String(seedStr || 'STRICT_SEED_2026');
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
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

  // Master Question Repository with 4 AI-Resilient Formats + Zero Audio
  const QUESTION_BANK = {
    // -------------------------------------------------------------
    // ENGLISH
    // -------------------------------------------------------------
    'english': [
      // Standard curriculum questions (Grammar, Vocab, Text Practice, Logic)
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
        id: 'eng-txt-1',
        skillCategory: 'listening', // mapped to text/practice analysis (no audio)
        level: 'A2',
        template: 'Read the official station announcement: "Attention passengers on platform three. The direct express train to {city} will depart at exactly quarter past five." Where does the train depart to, and at what time?',
        options: ['To {city} at 5:15', 'To {city} at 5:45', 'To London at 4:15', 'Cancelled due to repairs'],
        correctAnswer: 'To {city} at 5:15',
        explanation: '"Quarter past five" означає 5:15 (п\'ятнадцять хвилин на шосту).'
      },
      {
        id: 'eng-txt-2',
        skillCategory: 'listening', // mapped to text/practice analysis (no audio)
        level: 'B2',
        template: 'Read the technical project log: "{name} noted that unanticipated firmware compatibility conflicts forced the laboratory in {city} to postpone the system launch." What caused the postponement?',
        options: ['Unanticipated firmware compatibility conflicts', 'Insufficient budget funding', 'Absence of the lead engineer', 'Power grid failure in {city}'],
        correctAnswer: 'Unanticipated firmware compatibility conflicts',
        explanation: 'У тексті прямо зазначено: "unanticipated firmware compatibility conflicts".'
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

      // 4 AI-Resilient Question Formats for English:
      {
        id: 'eng-ai-case-1',
        skillCategory: 'logic',
        level: 'B2',
        aiType: 'case_study',
        aiBadge: '📊 Кейс курсу StrictAI',
        template: 'Analyze the StrictAI Microservice Auth Incident Table:\n' +
          '• Row 1: JWT Session validation latency = 12ms (SLA < 20ms)\n' +
          '• Row 2: Refresh token rotation interval = 3600s\n' +
          '• Row 3: Biometric entropy filter p99 = 240ms (High variance)\n' +
          '• Row 4: Total sync chain p99 computed as max(12ms, 240ms) = 240ms\n' +
          'Which row contains the critical architectural calculation flaw?',
        options: [
          'Row 4: In a synchronous chain, latency percentiles are additive/compound, not simply max()',
          'Row 1: Latency of 12ms exceeds RFC standards',
          'Row 2: Refresh interval is too short for web tokens',
          'Row 3: Garbage collection cannot cause variance'
        ],
        correctAnswer: 'Row 4: In a synchronous chain, latency percentiles are additive/compound, not simply max()',
        explanation: 'Перцентилі затримки (p99) для послідовного ланцюга мікросервісів не можна обчислювати як max() — затримки накопичуються у хвості розподілу.',
        microVerificationPrompt: 'Why can cumulative p99 latency in a pipeline not be calculated using simple max()?',
        microVerificationExpectedKeywords: ['additive', 'cumulative', 'tail', 'sum', 'pipeline', 'послідовн']
      },
      {
        id: 'eng-ai-vis-1',
        skillCategory: 'logic',
        level: 'B2',
        aiType: 'visual_diagram',
        aiBadge: '📐 Багатокомпонентна візуальна схема (Canvas)',
        requiresCanvas: true,
        visualDiagram: {
          type: 'node_graph',
          nodes: [
            { id: 'alpha', label: 'α (Start/Trust)', x: 120, y: 110, color: '#2cbb5d' },
            { id: 'beta', label: 'β (Watch/Blur)', x: 290, y: 50, color: '#ffa116' },
            { id: 'gamma', label: 'γ (Verify Blitz)', x: 460, y: 110, color: '#38bdf8' },
            { id: 'delta', label: 'δ (Locked)', x: 290, y: 170, color: '#ef4743' }
          ],
          edges: [
            { from: 'alpha', to: 'beta', weight: 'blur_1' },
            { from: 'beta', to: 'alpha', weight: 'verify_ok' },
            { from: 'beta', to: 'gamma', weight: 'ai_ext' },
            { from: 'gamma', to: 'delta', weight: 'fail' },
            { from: 'beta', to: 'delta', weight: 'blur_2' }
          ]
        },
        template: 'Examine the Anti-Cheat State Machine rendered on the Canvas above. Nodes represent security states (α: Trust, β: Watch, γ: Check, δ: Locked). Based solely on the topological edges, which statement is mathematically correct?',
        options: [
          'State δ (Locked) is an absorbing sink state with no outgoing transitions',
          'State α can transition directly to γ in a single hop',
          'There is a cyclic path from state δ back to state α upon verification',
          'State β has 3 incoming edges and 0 outgoing edges'
        ],
        correctAnswer: 'State δ (Locked) is an absorbing sink state with no outgoing transitions',
        explanation: 'На діаграмі зі стану δ (Locked) немає жодної вихідної стрілки — це термінальний/поглинаючий стан блокування.',
        microVerificationPrompt: 'Explain why state δ is considered a sink (absorbing) node in this directed graph:',
        microVerificationExpectedKeywords: ['sink', 'absorbing', 'no outgoing', 'terminal', 'поглинаючий', 'вихідних']
      },
      {
        id: 'eng-ai-bug-1',
        skillCategory: 'grammar',
        level: 'B2',
        aiType: 'find_bug',
        aiBadge: '🐞 Пошук багів у розв\'язку (Find the Bug)',
        template: 'Analyze the student\'s step-by-step grammatical analysis of: "If we had left earlier yesterday, we would not be stuck in traffic right now."\n' +
          '• Step 1: Identified structure as Mixed Conditional (Past condition + Present result).\n' +
          '• Step 2: Applied conditional inversion: "Had we left earlier yesterday..."\n' +
          '• Step 3: Transformed result clause to past perfect: "...we would not have been stuck in traffic right now."\n' +
          '• Step 4: Punctuation and word order validated.\n' +
          'On which step was a fatal grammatical rule broken?',
        options: [
          'Step 3: Fatal flaw! The present time marker "right now" requires "would not be", not "would not have been"',
          'Step 1: The original sentence is a standard Third Conditional, not mixed',
          'Step 2: Inversion is disallowed with mixed conditionals in formal English',
          'Step 4: A semicolon is required instead of a comma'
        ],
        correctAnswer: 'Step 3: Fatal flaw! The present time marker "right now" requires "would not be", not "would not have been"',
        explanation: 'У змішаних умовних реченнях (Mixed Conditionals), якщо наслідок стосується теперішнього часу ("right now"), дієслово має форму "would + bare infinitive" (would not be). Форма "would not have been" суперечить маркеру "right now".',
        microVerificationPrompt: 'Why does the adverbial phrase "right now" prohibit the use of "would not have been"?',
        microVerificationExpectedKeywords: ['right now', 'present', 'теперішн', 'mixed', 'would be']
      },
      {
        id: 'eng-ai-trap-1',
        skillCategory: 'logic',
        level: 'C1',
        aiType: 'llm_trap',
        aiBadge: '🪤 Пастка для LLM (Інформаційний шум)',
        template: 'Within StrictAI testing telemetry with 45 cluster nodes, 120-minute test cycles, and a 0.98 validity index, an evaluator function Ψ(x, y) is defined as:\n' +
          '• If x > y: Ψ(x, y) = x² - 2y\n' +
          '• If x ≤ y: Ψ(x, y) = 3y - x\n' +
          'Disregarding all cluster numbers, compute the exact result of Ψ(3, 5) + Ψ(4, 2):',
        options: [
          '24 (since 12 + 12 = 24)',
          '16 (due to applying condition 1 to both pairs)',
          '1 420 (the statistical sample noise)',
          '28'
        ],
        correctAnswer: '24 (since 12 + 12 = 24)',
        explanation: 'Для (3, 5): 3 ≤ 5 => 3*(5) - 3 = 12. Для (4, 2): 4 > 2 => 4² - 2*(2) = 16 - 4 = 12. Сума: 12 + 12 = 24. Числа 45, 120, 0.98 — інформаційний шум.',
        microVerificationPrompt: 'Which branch of Ψ was evaluated for the pair (3, 5) and what was its intermediate value?',
        microVerificationExpectedKeywords: ['12', '3y - x', '3*5 - 3', 'second', 'x <= y']
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
        id: 'de-v-1',
        skillCategory: 'vocab',
        level: 'B1',
        template: 'Was bedeutet die deutsche Redewendung "jemandem die Daumen drücken"?',
        options: ['Jemandem viel Erfolg und Glück wünschen', 'Jemanden scharf kritisieren', 'Große Angst vor Prüfungen haben', 'Mit jemandem streiten'],
        correctAnswer: 'Jemandem viel Erfolg und Glück wünschen',
        explanation: '"Die Daumen drücken" — тримати кулаки / бажати успіху.'
      },
      {
        id: 'de-txt-1',
        skillCategory: 'listening',
        level: 'A2',
        template: 'Lesen Sie die Durchsage am Hauptbahnhof: "Sehr geehrte Fahrgäste. Der Regionalexpress nach {city} fährt heute ausnahmsweise von Gleis vier ab." Welche Durchsage erhalten die Reisenden?',
        options: ['Der Zug nach {city} fährt von Gleis 4 ab', 'Der Zug nach Berlin fällt heute aus', 'Gleis 4 ist wegen Bauarbeiten gesperrt', 'Der Zug hat zwei Stunden Verspätung'],
        correctAnswer: 'Der Zug nach {city} fährt von Gleis 4 ab',
        explanation: 'У тексті чітко сказано: "fährt heute ausnahmsweise von Gleis vier ab".'
      },
      {
        id: 'de-r-1',
        skillCategory: 'logic',
        level: 'B2',
        template: 'Textanalyse: "Das duale Ausbildungssystem in Deutschland verknüpft praxisnahe Betriebsarbeit mit fundierter Berufsschultheorie. Unternehmen sichern sich so gezielt qualifizierte Nachwuchskräfte." Was ist der Hauptvorteil für Unternehmen?',
        options: ['Gezielte Ausbildung qualifizierter Nachwuchskräfte', 'Verringerung der Arbeitszeit auf 20 Stunden', 'Vollständiger Verzicht auf Prüfungen', 'Sofortiger Ausstieg aus der Digitalisierung'],
        correctAnswer: 'Gezielte Ausbildung qualifizierter Nachwuchskräfte',
        explanation: 'Головна перевага для компаній — цільова підготовка кваліфікованих молодих кадрів.'
      },

      // 4 AI-Resilient Question Formats for Deutsch:
      {
        id: 'de-ai-case-1',
        skillCategory: 'logic',
        level: 'B2',
        aiType: 'case_study',
        aiBadge: '📊 Кейс курсу StrictAI',
        template: 'StrictAI Fallstudie (Lokalisierungs-Audit):\nIn einer Tabelle der Sprachplattform StrictAI wurden vier Regelungen zur Prüfungsordnung aufgeführt. In welchem Absatz liegt ein semantischer Paronym-Fehler vor?\n• Satz 1: Alle Teilnehmer müssen die Richtlinien strikt beachten.\n• Satz 2: Das biometrische System garantiert absolute Vertraulichkeit.\n• Satz 3: Die Studierenden wenden effektvolle mathematische Formeln an, um die Prüfungszeit zu optimieren.\n• Satz 4: Beim Verlassen des Tabs wird die Frage unwiderruflich gesperrt.',
        options: [
          'Satz 3: Paronym-Fehler — es muss «effektive» (wirksame) heißen, nicht «effektvolle» (äußerlich eindrucksvolle)',
          'Satz 1: «beachten» muss durch «besehen» ersetzt werden',
          'Satz 2: «Vertraulichkeit» ist unpassend',
          'Satz 4: Der Konjunktiv ist zwingend erforderlich'
        ],
        correctAnswer: 'Satz 3: Paronym-Fehler — es muss «effektive» (wirksame) heißen, nicht «effektvolle» (äußerlich eindrucksvolle)',
        explanation: 'Пароніми «effektvoll» (ефектний, вражаючий зовнішньо) та «effektiv» (ефективний, дієвий). Для математичних алгоритмів коректне лише «effektive Formeln».',
        microVerificationPrompt: 'Erklären Sie kurz den Bedeutungsunterschied zwischen «effektiv» und «effektvoll»:',
        microVerificationExpectedKeywords: ['effektiv', 'effektvoll', 'wirksam', 'wirkung', 'дієвий', 'паронім']
      },
      {
        id: 'de-ai-vis-1',
        skillCategory: 'logic',
        level: 'B2',
        aiType: 'visual_diagram',
        aiBadge: '📐 Багатокомпонентна візуальна схема (Canvas)',
        requiresCanvas: true,
        visualDiagram: {
          type: 'node_graph',
          nodes: [
            { id: 'alpha', label: 'α (Start)', x: 120, y: 110, color: '#2cbb5d' },
            { id: 'beta', label: 'β (Watch)', x: 290, y: 50, color: '#ffa116' },
            { id: 'gamma', label: 'γ (Check)', x: 460, y: 110, color: '#38bdf8' },
            { id: 'delta', label: 'δ (Locked)', x: 290, y: 170, color: '#ef4743' }
          ],
          edges: [
            { from: 'alpha', to: 'beta', weight: 'tab_blur' },
            { from: 'beta', to: 'alpha', weight: 'ok' },
            { from: 'beta', to: 'gamma', weight: 'ai_ext' },
            { from: 'gamma', to: 'delta', weight: 'fail' },
            { from: 'beta', to: 'delta', weight: 'blur_2' }
          ]
        },
        template: 'Betrachten Sie das auf dem Canvas gerenderte Zustandsdiagramm des Anti-Cheat-Systems. Welche Aussage über den Zustand δ (Locked) trifft formal zu?',
        options: [
          'Zustand δ ist ein absorbierender Endzustand ohne ausgehende Kanten',
          'Zustand δ führt bei bestandener Überprüfung automatisch zu α zurück',
          'Zwischen Zustand α und γ gibt es eine direkte einstufige Verbindung',
          'Der Graph enthält einen Hamiltonkreis durch alle vier Knoten'
        ],
        correctAnswer: 'Zustand δ ist ein absorbierender Endzustand ohne ausgehende Kanten',
        explanation: 'На Canvas-схемі стан δ не має жодного вихідного ребра — це поглинаючий термінальний стан блокування.',
        microVerificationPrompt: 'Warum wird Zustand δ als absorbierender Endzustand bezeichnet?',
        microVerificationExpectedKeywords: ['absorbierend', 'keine ausgehende', 'endzustand', 'поглинаючий']
      },
      {
        id: 'de-ai-bug-1',
        skillCategory: 'grammar',
        level: 'B2',
        aiType: 'find_bug',
        aiBadge: '🐞 Пошук багів у розв\'язку (Find the Bug)',
        template: 'Fehleranalyse bei der Passivtransformation:\nAusgangssatz: "Man hat alle Berichte vor der Konferenz geprüft."\nSchritt 1: Subjekt "Man" wird eliminiert.\nSchritt 2: Akkusativobjekt "alle Berichte" wird zum Nominativsubjekt.\nSchritt 3: Bildung des Perfekt Passivs: "Alle Berichte sind vor der Konferenz geprüft worden sein."\nSchritt 4: Wortstellung im Hauptsatz überprüft.\nIn welchem Schritt liegt der grammatische Fehler?',
        options: [
          'Schritt 3: Fehlerhafte Passivform! Perfekt Passiv lautet "sind geprüft worden", das finale "sein" ist grob fehlerhaft',
          'Schritt 1: "Man" muss als "von man" erhalten bleiben',
          'Schritt 2: Das Objekt muss im Akkusativ verbleiben',
          'Schritt 4: Das Partizip II muss am Satzanfang stehen'
        ],
        correctAnswer: 'Schritt 3: Fehlerhafte Passivform! Perfekt Passiv lautet "sind geprüft worden", das finale "sein" ist grob fehlerhaft',
        explanation: 'Формула Perfekt Passiv у німецькій мові: sein + Partizip II + worden. Додавання додаткового "sein" є грубою помилкою.',
        microVerificationPrompt: 'Wie lautet die korrekte Perfekt-Passiv-Form von «prüfen» im Plural?',
        microVerificationExpectedKeywords: ['sind geprüft worden', 'worden', 'geprüft worden']
      },
      {
        id: 'de-ai-trap-1',
        skillCategory: 'logic',
        level: 'B2',
        aiType: 'llm_trap',
        aiBadge: '🪤 Пастка для LLM (Інформаційний шум)',
        template: 'Im Rahmen des StrictAI-Serverclusters (48 Serverknoten, 180 Minuten Prüfungsdauer, Validitätskoeffizient 0.95) gilt für einen internen Operator Ω(a, b):\n' +
          '• Falls a > b: Ω(a, b) = a² - 2b\n' +
          '• Falls a ≤ b: Ω(a, b) = 3b - a\n' +
          'Berechnen Sie ohne Beachtung der Serveranzahl den exakten Wert von Ω(3, 5) + Ω(4, 2):',
        options: [
          '24 (da 12 + 12 = 24)',
          '16 (durch fehlerhafte Zweigwahl)',
          '48 (Serverknotenwert)',
          '30'
        ],
        correctAnswer: '24 (da 12 + 12 = 24)',
        explanation: 'Для (3, 5): 3 ≤ 5 => 3*(5) - 3 = 12. Для (4, 2): 4 > 2 => 4² - 2*(2) = 12. Сума: 12 + 12 = 24. Решта чисел — шум.',
        microVerificationPrompt: 'Welcher Rechenschritt ergab 12 für das Paar Ω(4, 2)?',
        microVerificationExpectedKeywords: ['4^2 - 4', '16 - 4', '12', 'a^2 - 2b']
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
        id: 'es-v-1',
        skillCategory: 'vocab',
        level: 'B1',
        template: '¿Qué significa la expresión idiomática "dar en el clavo"?',
        options: ['Acertar con exactitud', 'Construir un mueble', 'Equivocarse totalmente', 'Llegar tarde'],
        correctAnswer: 'Acertar con exactitud',
        explanation: '"Dar en el clavo" означає точно влучити в суть, правильно вгадати.'
      },
      {
        id: 'es-txt-1',
        skillCategory: 'listening',
        level: 'A2',
        template: 'Lea el aviso sonoro del aeropuerto: "Atención señores pasajeros con destino a {city}, su vuelo embarcará de inmediato por la puerta número doce." ¿A qué puerta deben acudir los pasajeros?',
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
      },

      // 4 AI-Resilient Question Formats for Espanol:
      {
        id: 'es-ai-case-1',
        skillCategory: 'logic',
        level: 'B2',
        aiType: 'case_study',
        aiBadge: '📊 Кейс курсу StrictAI',
        template: 'Caso de Estudio StrictAI (Auditoría de Protocolo):\nEn la normativa antifraude de la plataforma se leen cuatro cláusulas. ¿En cuál se ha incurrido en un error léxico de paronimia?\n• Cláusula 1: Todo estudiante debe acatar las normas de integridad académica.\n• Cláusula 2: El sistema garantiza la absoluta seguridad de los datos biométricos.\n• Cláusula 3: Los alumnos aplican algoritmos efectistas para maximizar su puntuación en tiempo real.\n• Cláusula 4: En caso de abandono de pestaña, la pregunta quedará bloqueada.',
        options: [
          'Cláusula 3: Error de paronimia — se debe emplear «efectivos» o «eficaces» (que logran el resultado), no «efectistas» (que buscan impresionar)',
          'Cláusula 1: «Acatar» no rige con normas',
          'Cláusula 2: Debe decir «seguranza»',
          'Cláusula 4: Requiere subjuntivo forzoso'
        ],
        correctAnswer: 'Cláusula 3: Error de paronimia — se debe emplear «efectivos» o «eficaces» (que logran el resultado), no «efectistas» (que buscan impresionar)',
        explanation: 'Пароніми «efectista» (розрахований на зовнішній ефект) та «efectivo / eficaz» (дієвий). Для математичних алгоритмів правильно «efectivos».',
        microVerificationPrompt: 'Diferencie el significado entre «efectista» y «efectivo» en este contexto:',
        microVerificationExpectedKeywords: ['efectivo', 'efectista', 'impresionar', 'eficaz', 'resultado']
      },
      {
        id: 'es-ai-vis-1',
        skillCategory: 'logic',
        level: 'B2',
        aiType: 'visual_diagram',
        aiBadge: '📐 Багатокомпонентна візуальна схема (Canvas)',
        requiresCanvas: true,
        visualDiagram: {
          type: 'node_graph',
          nodes: [
            { id: 'alpha', label: 'α (Inicio)', x: 120, y: 110, color: '#2cbb5d' },
            { id: 'beta', label: 'β (Alerta)', x: 290, y: 50, color: '#ffa116' },
            { id: 'gamma', label: 'γ (Verificación)', x: 460, y: 110, color: '#38bdf8' },
            { id: 'delta', label: 'δ (Bloqueado)', x: 290, y: 170, color: '#ef4743' }
          ],
          edges: [
            { from: 'alpha', to: 'beta', weight: 'cambio_tab' },
            { from: 'beta', to: 'alpha', weight: 'ok' },
            { from: 'beta', to: 'gamma', weight: 'ia_ext' },
            { from: 'gamma', to: 'delta', weight: 'fallo' },
            { from: 'beta', to: 'delta', weight: 'reincidencia' }
          ]
        },
        template: 'Analice el grafo dirigido de estados de seguridad renderizado en el Canvas. ¿Cuál de las siguientes afirmaciones es topológicamente verdadera?',
        options: [
          'El estado δ (Bloqueado) es un estado sumidero (absorbente) sin aristas salientes',
          'Es posible transitar directamente de α a γ en un solo paso',
          'Existe un ciclo orientado que permite retornar de δ a α',
          'El estado β carece de transiciones hacia δ'
        ],
        correctAnswer: 'El estado δ (Bloqueado) es un estado sumidero (absorbente) sin aristas salientes',
        explanation: 'Вузол δ (Bloqueado) на схемі є поглинаючим станом без жодного вихідного ребра.',
        microVerificationPrompt: '¿Por qué el nodo δ se clasifica como un estado absorbente en la teoría de grafos?',
        microVerificationExpectedKeywords: ['absorbente', 'sumidero', 'sin aristas salientes', 'terminal']
      },
      {
        id: 'es-ai-bug-1',
        skillCategory: 'grammar',
        level: 'B2',
        aiType: 'find_bug',
        aiBadge: '🐞 Пошук багів у розв\'язку (Find the Bug)',
        template: 'Detección de fallo en oraciones condicionales irreales:\nFrase a transformar: "Si {name} hubiera estudiado con más constancia, habría obtenido la beca."\n• Paso 1: Identificación de condicional de pasado (imposible).\n• Paso 2: Análisis de la prótasis: "Si + hubiera estudiado" (Pluscuamperfecto de Subjuntivo).\n• Paso 3: Transformación alternativa de la apódosis: "...hubiera obtenido la beca en vez de habría obtenido."\n• Paso 4: Alteración errónea: "Si {name} habría estudiado, hubiera obtenido la beca."\n¿En qué paso se rompe flagrantemente la gramática española?',
        options: [
          'Paso 4: Error fatal! El condicional "habría estudiado" jamás debe introducirse en la cláusula con "Si"',
          'Paso 1: La oración es un condicional real de presente',
          'Paso 2: "Hubiera estudiado" es incorrecto en la prótasis',
          'Paso 3: La variante en -ra no está permitida en la apódosis'
        ],
        correctAnswer: 'Paso 4: Error fatal! El condicional "habría estudiado" jamás debe introducirse en la cláusula con "Si"',
        explanation: 'В іспанській мові в підрядному реченні умови після сполучника "Si" ніколи не вживається простий або складний умовний спосіб (Condicional). Допустимий лише Subjuntivo.',
        microVerificationPrompt: '¿Por qué la construcción «Si habría estudiado» es un error gramatical grave en español?',
        microVerificationExpectedKeywords: ['si no admite condicional', 'subjuntivo', 'condicional', 'hubiera estudiado']
      },
      {
        id: 'es-ai-trap-1',
        skillCategory: 'logic',
        level: 'B2',
        aiType: 'llm_trap',
        aiBadge: '🪤 Пастка для LLM (Інформаційний шум)',
        template: 'En el marco del sistema de telemetría de StrictAI (con 52 nodos de cómputo, 90 minutos de examen y coeficiente de fiabilidad 0.99), se define el operador formal Φ(x, y):\n' +
          '• Si x > y: Φ(x, y) = x² - 2y\n' +
          '• Si x ≤ y: Φ(x, y) = 3y - x\n' +
          'Ignorando las estadísticas de nodos y minutos, determine el valor exacto de Φ(3, 5) + Φ(4, 2):',
        options: [
          '24 (12 + 12 = 24)',
          '16 (aplicando erróneamente la primera condición)',
          '52 (número de nodos)',
          '28'
        ],
        correctAnswer: '24 (12 + 12 = 24)',
        explanation: 'Φ(3, 5) = 3*(5) - 3 = 12. Φ(4, 2) = 4² - 2*(2) = 12. 12 + 12 = 24.',
        microVerificationPrompt: '¿Qué valor arrojó Φ(3, 5) y qué rama de la definición se aplicó?',
        microVerificationExpectedKeywords: ['12', '3y - x', 'segunda', 'x <= y']
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
        id: 'zh-txt-1',
        skillCategory: 'listening',
        level: 'A2',
        template: '阅读校园广播文本："请各位同学注意，明天上午八点三十分，我们在学校正门集合出发。" 根据广播，大家明天上午几点在校门口集合？',
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
      },

      // 4 AI-Resilient Question Formats for Chinese:
      {
        id: 'zh-ai-case-1',
        skillCategory: 'logic',
        level: 'B2',
        aiType: 'case_study',
        aiBadge: '📊 Кейс курсу StrictAI',
        template: 'StrictAI 案例分析（微服务延迟分析报告）：\n在 StrictAI 中文学习平台的 4 项服务监控数据中，有一项存在计算逻辑谬误：\n1. 身份认证与 Token 校验：平均 12ms，p99 45ms（符合 SLA）\n2. Canvas 防抓取图层渲染：平均 35ms，p99 80ms\n3. 生物特征熵值计算：平均 18ms，p99 210ms\n4. 总体同步执行链 p99：审计结论标注为 210ms（直接取 max）\n请问哪一项结论存在错误？',
        options: [
          '第 4 项错误：在串行调用链路中，p99 延迟会在长尾端累加，不能简单取单个最大值 max()',
          '第 1 项错误：12ms 延迟过高',
          '第 2 项错误：画布渲染不需要消耗 CPU',
          '第 3 项错误：熵值计算不会产生波动'
        ],
        correctAnswer: '第 4 项错误：在串行调用链路中，p99 延迟会在长尾端累加，不能简单取单个最大值 max()',
        explanation: 'У послідовному конвеєрі загальна затримка p99 не дорівнює max(p99), а накопичується і значно перевищує 210 мс.',
        microVerificationPrompt: '为什么串行微服务链路的 p99 不能简单用 max() 计算？',
        microVerificationExpectedKeywords: ['串行', '累加', '长尾', 'max', 'p99']
      },
      {
        id: 'zh-ai-vis-1',
        skillCategory: 'logic',
        level: 'B2',
        aiType: 'visual_diagram',
        aiBadge: '📐 Багатокомпонентна візуальна схема (Canvas)',
        requiresCanvas: true,
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
            { from: 'beta', to: 'alpha', weight: 'ok' },
            { from: 'beta', to: 'gamma', weight: 'ai_ext' },
            { from: 'gamma', to: 'delta', weight: 'fail' },
            { from: 'beta', to: 'delta', weight: '2nd_blur' }
          ]
        },
        template: '请观察上方 Canvas 绘制的反作弊状态机有向图。依据图论结构，关于状态 δ (Locked) 的正确描述是：',
        options: [
          '状态 δ 是一个没有出边的吸收终止态（Sink State），无法自动跳转解锁',
          '状态 δ 存在直接返回初始态 α 的转移弧',
          '状态 α 与 γ 之间存在一步直达的有向边',
          '图中所有 4 个节点构成完全强连通分量'
        ],
        correctAnswer: '状态 δ 是一个没有出边的吸收终止态（Sink State），无法自动跳转解锁',
        explanation: 'Стан δ (Locked) є термінальним поглинаючим станом без жодного вихідного ребра.',
        microVerificationPrompt: '在图论中，为什么状态 δ 被称作吸收态（Sink State）？',
        microVerificationExpectedKeywords: ['出边', '没有出边', '吸收态', '终止', 'sink']
      },
      {
        id: 'zh-ai-bug-1',
        skillCategory: 'grammar',
        level: 'B2',
        aiType: 'find_bug',
        aiBadge: '🐞 Пошук багів у розв\'язку (Find the Bug)',
        template: '语法病句分析步骤纠错：\n原句："通过这次严格的防作弊测试，使同学们更加深刻地认识到了学术诚信的重要性。"\n• 步骤 1：分析句子主干，寻找主语和谓语。\n• 步骤 2：判断介词短语 "通过……" 充当状语。\n• 步骤 3：判断 "使……" 引领兼语从句。\n• 步骤 4：结论认为句子结构完整无缺，完全符合汉语语法。\n请指出哪一步的分析结论存在严重错误？',
        options: [
          '步骤 4 错误：原句滥用介词 "通过" 与 "使"，导致整句彻底缺失主语（典型成分残缺病句）',
          '步骤 1 错误：主语是 "测试"',
          '步骤 2 错误："通过" 不能引导介宾短语',
          '步骤 3 错误："认识" 是主语'
        ],
        correctAnswer: '步骤 4 错误：原句滥用介词 "通过" 与 "使"，导致整句彻底缺失主语（典型成分残缺病句）',
        explanation: 'Конструкція "通过……使……" одночасно перетворює обидві частини на обставину та залежну конструкцію, призводячи до відсутності підмета в реченні.',
        microVerificationPrompt: '为什么 "通过……使……" 连用会导致句子缺少主语？',
        microVerificationExpectedKeywords: ['缺少主语', '主语残缺', '通过', '使', '介词']
      },
      {
        id: 'zh-ai-trap-1',
        skillCategory: 'logic',
        level: 'B2',
        aiType: 'llm_trap',
        aiBadge: '🪤 Пастка для LLM (Інформаційний шум)',
        template: '在 StrictAI 智能评测平台中（系统包含 64 个计算节点，测试时长 120 分钟，有效性系数 0.98），定义形式二元算子 ⨁(x, y)：\n' +
          '• 若 x > y，则：⨁(x, y) = x² - 2y\n' +
          '• 若 x ≤ y，则：⨁(x, y) = 3y - x\n' +
          '忽略节点数量和时长等干扰数据，计算 ⨁(3, 5) + ⨁(4, 2) 的精确值：',
        options: [
          '24（因为 12 + 12 = 24）',
          '16（因错误应用第一条规则）',
          '64（节点干扰数）',
          '28'
        ],
        correctAnswer: '24（因为 12 + 12 = 24）',
        explanation: '⨁(3, 5) = 15 - 3 = 12. ⨁(4, 2) = 16 - 4 = 12. 12 + 12 = 24.',
        microVerificationPrompt: '算子 ⨁(3, 5) 的中间计算结果是多少？依据哪条规则？',
        microVerificationExpectedKeywords: ['12', '3y - x', '第二条', '3*5 - 3']
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
        id: 'pl-txt-1',
        skillCategory: 'listening',
        level: 'A2',
        template: 'Przeczytaj komunikat na dworcu: "Uwaga podróżni. Pociąg pospieszny do {city} odjedzie z toru pierwszego przy peronie drugim o godzinie szesnastej trzydzieści." Z którego peronu odjedzie pociąg ekspresowy?',
        options: ['Z peronu 2 o godzinie 16:30', 'Z peronu 1 o godzinie 15:30', 'Z peronu 3 o godzinie 17:00', 'Pociąg został odwołany'],
        correctAnswer: 'Z peronu 2 o godzinie 16:30',
        explanation: 'У тексті зазначено: "przy peronie drugim o godzinie szesnastej trzydzieści (16:30)".'
      },
      {
        id: 'pl-r-1',
        skillCategory: 'logic',
        level: 'B2',
        template: 'Tekst: "Krakowski park technologiczny przyciąga innowacyjne startupy dzięki ścisłej współpracy z Akademią Górniczo-Hutniczą i Uniwersytetem Jagiellońskim." Co stanowi kluczowy czynnik sukcesu?',
        options: ['Ścisła współpraca z czołowymi uczelniami', 'Całkowity brak podatków miejskich', 'Likwidacja tradycyjnych bibliotek', 'Zamknięcie ruchu tramwajowego'],
        correctAnswer: 'Ścisła współpraca z czołowymi uczelniami',
        explanation: 'Головний фактор успіху парку — тісна співпраця з університетами.'
      },

      // 4 AI-Resilient Question Formats for Polish:
      {
        id: 'pl-ai-case-1',
        skillCategory: 'logic',
        level: 'B2',
        aiType: 'case_study',
        aiBadge: '📊 Кейс курсу StrictAI',
        template: 'Analiza studium przypadku StrictAI (Audyt regulaminu akademickiego):\nW czterech punktach regulaminu platformy zbadano użycie słownictwa. W którym punkcie występuje błąd paronimiczny?\n• Punkt 1: Każdy uczestnik zobowiązany jest przestrzegać zasad uczciwości.\n• Punkt 2: System telemetryczny gwarantuje pełne bezpieczeństwo danych.\n• Punkt 3: Studenci wdrażają efektowne metody optymalizacji czasu pracy w celu uzyskania wysokiego wyniku.\n• Punkt 4: Po dwukrotnym opuszczeniu karty pytanie zostaje zablokowane.',
        options: [
          'Punkt 3: Błąd paronimiczny — należy użyć «efektywne» (skuteczne, wydajne), a nie «efektowne» (robiące wrażenie wizualne)',
          'Punkt 1: «przestrzegać» wymaga biernika',
          'Punkt 2: Słowo «telemetryczny» jest niepoprawne',
          'Punkt 4: Wymagana forma czasu przyszłego złożonego'
        ],
        correctAnswer: 'Punkt 3: Błąd paronimiczny — należy użyć «efektywne» (skuteczne, wydajne), a nie «efektowne» (robiące wrażenie wizualne)',
        explanation: 'Пароніми «efektowny» (який справляє сильне враження) та «efektywny» (дієвий, результативний). Для математичних алгоритмів правильно лише «efektywne metody».',
        microVerificationPrompt: 'Wyjaśnij różnicę znaczeniową między słowami «efektywny» a «efektowny»:',
        microVerificationExpectedKeywords: ['efektywny', 'efektowny', 'skuteczny', 'wrażenie', 'paronim']
      },
      {
        id: 'pl-ai-vis-1',
        skillCategory: 'logic',
        level: 'B2',
        aiType: 'visual_diagram',
        aiBadge: '📐 Багатокомпонентна візуальна схема (Canvas)',
        requiresCanvas: true,
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
            { from: 'beta', to: 'alpha', weight: 'ok' },
            { from: 'beta', to: 'gamma', weight: 'ai_ext' },
            { from: 'gamma', to: 'delta', weight: 'fail' },
            { from: 'beta', to: 'delta', weight: '2nd_blur' }
          ]
        },
        template: 'Przeanalizuj graf skierowany automatu anty-cheat wyświetlony na płótnie Canvas. Które twierdzenie topologiczne jest w pełni poprawne?',
        options: [
          'Stan δ (Locked) jest stanem pochłaniającym (ściekowym) bez krawędzi wychodzących',
          'Ze stanu δ można powrócić bezpośrednio do α bez dodatkowej weryfikacji',
          'Między stanem α a γ istnieje bezpośrednie przejście w jednym kroku',
          'Wszystkie 4 wierzchołki tworzą jeden silnie spójny cykl'
        ],
        correctAnswer: 'Stan δ (Locked) jest stanem pochłaniającym (ściekowym) bez krawędzi wychodzących',
        explanation: 'Вузол δ (Locked) є поглинаючим термінальним вузлом без вихідних ребер.',
        microVerificationPrompt: 'Dlaczego w teorii automatów stan δ określany jest jako stan pochłaniający?',
        microVerificationExpectedKeywords: ['pochłaniający', 'ściekowy', 'brak krawędzi wychodzących', 'terminalny']
      },
      {
        id: 'pl-ai-bug-1',
        skillCategory: 'grammar',
        level: 'B2',
        aiType: 'find_bug',
        aiBadge: '🐞 Пошук багів у розв\'язку (Find the Bug)',
        template: 'Analiza błędu w transformacji imiesłowowego równoważnika zdania:\nZdanie wyjściowe: "Idąc do uniwersytetu, rozpadał się ulewny majowy deszcz."\n• Krok 1: Wskazano imiesłów przysłówkowy współczesny na -ąc ("idąc").\n• Krok 2: Wskazano podmiot zdania nadrzędnego: "deszcz".\n• Krok 3: Sprawdzono tożsamość wykonawcy czynności: deszcz "szedł" do uniwersytetu.\n• Krok 4: Wniosek: konstrukcja jest całkowicie poprawna w języku polskim.\nW którym kroku popełniono błąd merytoryczny?',
        options: [
          'Krok 4: Konstrukcja jest rażącym błędem składniowym! Wykonawcą czynności imiesłowu musi być podmiot zdania głównego, a deszcz nie mógł iść do uniwersytetu',
          'Krok 1: Forma "idąc" nie jest imiesłowem',
          'Krok 2: Podmiotem jest uniwersytet',
          'Krok 3: Deszcz może wykonywać czynność chodzenia metaforycznie'
        ],
        correctAnswer: 'Krok 4: Konstrukcja jest rażącym błędem składniowym! Wykonawcą czynności imiesłowu musi być podmiot zdania głównego, a deszcz nie mógł iść do uniwersytetu',
        explanation: 'Дієприслівниковий зворот вимагає, щоб дія додаткова стосувалася виконавця головної дії (підмета). Дощ не йшов до університету.',
        microVerificationPrompt: 'Jaka zasada składniowa została złamana w zdaniu z imiesłowem «Idąc do uniwersytetu...»?',
        microVerificationExpectedKeywords: ['tożsamość podmiotu', 'wykonawca czynności', 'imiesłów', 'podmiot']
      },
      {
        id: 'pl-ai-trap-1',
        skillCategory: 'logic',
        level: 'B2',
        aiType: 'llm_trap',
        aiBadge: '🪤 Пастка для LLM (Інформаційний шум)',
        template: 'W systemie telemetrycznym StrictAI (obejmującym 40 klastrów, 100 minut egzaminu oraz współczynnik rzetelności 0.97) zdefiniowano binarny operator formalny ⨂(x, y):\n' +
          '• Jeśli x > y: ⨂(x, y) = x² - 2y\n' +
          '• Jeśli x ≤ y: ⨂(x, y) = 3y - x\n' +
          'Pomijając liczbę klastrów oraz czas, oblicz dokładną wartość wyrażenia ⨂(3, 5) + ⨂(4, 2):',
        options: [
          '24 (ponieważ 12 + 12 = 24)',
          '16 (błędna selekcja pierwszej reguły)',
          '40 (szum informacyjny)',
          '28'
        ],
        correctAnswer: '24 (ponieważ 12 + 12 = 24)',
        explanation: '3 ≤ 5 => 3*(5) - 3 = 12. 4 > 2 => 16 - 4 = 12. 12 + 12 = 24.',
        microVerificationPrompt: 'Podaj wynik cząstkowy dla pary ⨂(3, 5) oraz wybraną regułę:',
        microVerificationExpectedKeywords: ['12', '3y - x', 'druga', '3*5 - 3']
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
        skillCategory: 'listening', // practice task without audio
        level: 'Середній (150+)',
        template: 'Прямокутний трикутник має катети {num1} см та {num2} см. Знайдіть довжину гіпотенузи:',
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
            text: `Прямокутний трикутник має катети ${choice.a} см та ${choice.b} см. Знайдіть довжину гіпотенузи за теоремою Піфагора:`,
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
      },

      // 4 AI-Resilient Question Formats for Math:
      {
        id: 'math-ai-case-1',
        skillCategory: 'logic',
        level: 'Достатній (175+)',
        aiType: 'case_study',
        aiBadge: '📊 Кейс курсу StrictAI',
        template: 'Аудит розрахунків бізнес-моделі платформи StrictAI:\n' +
          'У фінансовій таблиці наведено витрати та клієнтів за 4 каналами залучення:\n' +
          '1. Пошуковий трафік: Витрати 45 000 грн, 1 500 кліків, Конверсія 4%, 60 клієнтів, CAC = 750 грн\n' +
          '2. YouTube освітній канал: Витрати 32 000 грн, 800 кліків, Конверсія 5%, 40 клієнтів, CAC = 800 грн\n' +
          '3. Таргетовані соцмережі: Витрати 60 000 грн, 2 000 кліків, Конверсія 2.5%, 50 клієнтів, CAC = 30 грн\n' +
          '4. Партнерська програма: Витрати 28 000 грн, 700 кліків, Конверсія 5%, 35 клієнтів, CAC = 800 грн\n' +
          'У якому рядку допущено грубу помилку розрахунку вартості залучення клієнта (CAC = Витрати / Клієнти)?',
        options: [
          'Рядок 3: розраховано CPC (60 000 / 2 000 = 30 грн) замість реального CAC (60 000 / 50 = 1 200 грн)',
          'Рядок 1: CAC мав би становити 900 грн, а не 750 грн',
          'Рядок 2: помилка в підрахунку клієнтів (800 * 5% = 48, а не 40)',
          'Рядок 4: CAC має дорівнювати 700 грн'
        ],
        correctAnswer: 'Рядок 3: розраховано CPC (60 000 / 2 000 = 30 грн) замість реального CAC (60 000 / 50 = 1 200 грн)',
        explanation: 'У рядку 3 бюджет розділено на кліки (60 000 / 2000 = 30 грн, тобто CPC), а не на клієнтів (60 000 / 50 = 1 200 грн). Стандартні LLM часто плутають CPC та CAC.',
        microVerificationPrompt: 'Яким має бути істинне значення CAC для рядка 3 та яка формула застосовується?',
        microVerificationExpectedKeywords: ['1200', '1 200', 'cac', 'витрати на клієнтів', 'cpc', 'кліки']
      },
      {
        id: 'math-ai-vis-1',
        skillCategory: 'logic',
        level: 'Достатній (175+)',
        aiType: 'visual_diagram',
        aiBadge: '📐 Багатокомпонентна візуальна схема (Canvas)',
        requiresCanvas: true,
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
          title: 'Графік ПОХІДНОЇ y = f\'(x)'
        },
        template: 'На наведеному полотні Canvas зображено графік ПОХІДНОЇ функції y = f\'(x), визначеної на проміжку [-4; 5]. Користуючись графіком похідної, визначте кількість точок ЛОКАЛЬНОГО МІНІМУМУ самої функції y = f(x):',
        options: [
          '1 точка мінімуму (точка x = 1, де похідна змінює знак з мінуса на плюс)',
          '2 точки мінімуму (точки x = -3 та x = 4)',
          '3 точки мінімуму (всі нулі похідної)',
          'Жодної точки мінімуму (функція монотонна)'
        ],
        correctAnswer: '1 точка мінімуму (точка x = 1, де похідна змінює знак з мінуса на плюс)',
        explanation: 'Точка локального мінімуму f(x) утворюється там, де похідна f\'(x) змінює знак з «-» на «+». Похідна від\'ємна на (-3; 1) і додатна на (1; 4). Лише в точці x = 1 є зміна знаку з «-» на «+».',
        microVerificationPrompt: 'Яка умова на зміну знаку похідної f\'(x) визначає точку локального мінімуму?',
        microVerificationExpectedKeywords: ['з мінуса на плюс', '- на +', 'від\'ємн на додатн', 'зростання']
      },
      {
        id: 'math-ai-bug-1',
        skillCategory: 'grammar',
        level: 'Достатній (175+)',
        aiType: 'find_bug',
        aiBadge: '🐞 Пошук багів у розв\'язку (Find the Bug)',
        template: 'Пошук алгебраїчного багу в розв\'язанні рівняння √(x² - 6x + 9) = 5 - x:\n' +
          '• Крок 1: Згортання формули квадрата різниці: √((x - 3)²) = 5 - x\n' +
          '• Крок 2: Звільнення від кореня і квадрата: x - 3 = 5 - x\n' +
          '• Крок 3: Перенесення змінних: 2x = 8, корінь x = 4\n' +
          '• Крок 4: Перевірка: √(16 - 24 + 9) = √1 = 1; 5 - 4 = 1. Число 4 є єдиним коренем.\n' +
          'На якому кроці допущено принципову теоретичну помилку тотожності?',
        options: [
          'Крок 2: груба помилка тотожності! За правилом √(a²) = |a|, тому мало бути |x - 3| = 5 - x',
          'Крок 1: невірно згорнуто формулу квадрата різниці',
          'Крок 3: неправильно перенесено доданки (мало бути 2x = 2)',
          'Крок 4: число 4 не задовольняє ОДЗ'
        ],
        correctAnswer: 'Крок 2: груба помилка тотожності! За правилом √(a²) = |a|, тому мало бути |x - 3| = 5 - x',
        explanation: 'Фундаментальна властивість кореня: √(a²) = |a|. Ігнорування модуля є критичною алгебраїчною помилкою.',
        microVerificationPrompt: 'Чому рівність √(a²) = a є хибною без урахування модуля?',
        microVerificationExpectedKeywords: ['модуль', '|a|', 'від\'ємн', 'знак', 'невід\'ємн']
      },
      {
        id: 'math-ai-trap-1',
        skillCategory: 'logic',
        level: 'Високий (190–200 НМТ)',
        aiType: 'llm_trap',
        aiBadge: '🪤 Пастка для LLM (Інформаційний шум)',
        template: 'У контексті системи тестування StrictAI (де задіяно 45 серверів, 120 хвилин тесту, коефіцієнт валідності 0.98 та середня вибірка 1 420 учнів) визначено формальний бінарний оператор курсу Λ(x, y):\n' +
          '• Якщо x > y, то: Λ(x, y) = x² - 2y\n' +
          '• Якщо x ≤ y, то: Λ(x, y) = 3y - x\n' +
          'Не звертаючи уваги на статистичні показники серверів, обчисліть точне значення виразу: Λ(3, 5) + Λ(4, 2).',
        options: [
          '24 (оскільки 12 + 12 = 24)',
          '16 (через помилкове застосування першої умови до обох пар)',
          '1 420 (значення статистичної вибірки)',
          '28'
        ],
        correctAnswer: '24 (оскільки 12 + 12 = 24)',
        explanation: 'Для (3, 5): 3 ≤ 5 => 3*(5) - 3 = 12. Для (4, 2): 4 > 2 => 4² - 2*(2) = 16 - 4 = 12. Сума: 12 + 12 = 24. Числа 45, 120, 0.98, 1420 — інформаційний шум.',
        microVerificationPrompt: 'Покажіть проміжний результат для пари Λ(3, 5): яка з двох гілок була використана?',
        microVerificationExpectedKeywords: ['12', '3y - x', 'друга', '3*5 - 3', 'x <= y']
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
        id: 'ukr-txt-1',
        skillCategory: 'listening', // practice task without audio
        level: 'Середній (150+)',
        template: 'Прочитайте фрагмент: «Яблуневий цвіт біля бабусиної хати щедро вигравав у променях весняного сонця». Укажіть слово, у якому звуків БІЛЬШЕ, ніж букв:',
        options: [
          'Яблуневий (буква Я на початку позначає 2 звуки [йа])',
          'Цвіт',
          'Хати',
          'Сонця'
        ],
        correctAnswer: 'Яблуневий (буква Я на початку позначає 2 звуки [йа])',
        explanation: 'Буква "я" на початку слова позначає 2 звуки [й][а], отже у слові "яблуневий" 9 букв і 10 звуків.'
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
      },

      // 4 AI-Resilient Question Formats for Ukrainian:
      {
        id: 'ukr-ai-case-1',
        skillCategory: 'vocab',
        level: 'Достатній (175+)',
        aiType: 'case_study',
        aiBadge: '📊 Кейс курсу StrictAI',
        template: 'Редагування регламенту академічної доброчесності StrictAI:\n' +
          'Перед вами витяг із 4 пунктів внутрішнього регламенту платформи. У якому пункті допущено лексичну помилку вживання пароніма?\n' +
          '• Пункт 1: Кожен слухач курсу має неухильно дотримуватися вимог академічної доброчесності.\n' +
          '• Пункт 2: Система біометричного моніторингу гарантує абсолютну безпеку персональних даних.\n' +
          '• Пункт 3: Для розв’язання складних завдань студенти впроваджують ефектні математичні моделі оптимізації.\n' +
          '• Пункт 4: У разі повторного виходу з вкладки доступ до тесту скасовується без права апеляції.',
        options: [
          'Пункт 3: лексична помилка — треба «ефективні моделі» (дієві), а не «ефектні» (ті, що справляють враження)',
          'Пункт 1: треба «слідкувати вимогам» замість «дотримуватися вимог»',
          'Пункт 2: треба «безпечність» замість «безпеку»',
          'Пункт 4: помилка в керуванні — треба «скасовується за відсутності апеляції»'
        ],
        correctAnswer: 'Пункт 3: лексична помилка — треба «ефективні моделі» (дієві), а не «ефектні» (ті, що справляють враження)',
        explanation: 'Пароніми «ефектний» (вражаючий) та «ефективний» (дієвий, результативний). Для математичних алгоритмів правильно вживати «ефективні моделі».',
        microVerificationPrompt: 'Поясніть різницю між словами «ефектний» та «ефективний» у цьому контексті.',
        microVerificationExpectedKeywords: ['ефективний', 'дієвий', 'результат', 'враження', 'паронім']
      },
      {
        id: 'ukr-ai-vis-1',
        skillCategory: 'logic',
        level: 'Достатній (175+)',
        aiType: 'visual_diagram',
        aiBadge: '📐 Багатокомпонентна візуальна схема (Canvas)',
        requiresCanvas: true,
        visualDiagram: {
          type: 'node_graph',
          nodes: [
            { id: 'alpha', label: '[Головна частина]', x: 120, y: 110, color: '#2cbb5d' },
            { id: 'beta', label: '(Підрядна з\'ясувальна)', x: 290, y: 50, color: '#ffa116' },
            { id: 'gamma', label: '(Підрядна причини)', x: 460, y: 110, color: '#38bdf8' },
            { id: 'delta', label: '[Супідрядна частина]', x: 290, y: 170, color: '#ef4743' }
          ],
          edges: [
            { from: 'alpha', to: 'beta', weight: 'питання: у чому?' },
            { from: 'beta', to: 'gamma', weight: 'послідовне' },
            { from: 'alpha', to: 'delta', weight: 'однорідне' }
          ]
        },
        template: 'На наведеному Canvas-полотні зображено синтаксичну схему багаторівневого складного речення. Яке твердження є істинним щодо синтаксичного зв\'язку між частинами?',
        options: [
          'Від головної частини до першої підрядної ставиться питання непрямого відмінка («у чому?»), що визначає з\'ясувальний підрядний зв\'язок',
          'Усі підрядні частини приєднані безсполучниковим зв\'язком',
          'Речення є складносурядним з протиставним сполучником',
          'Підрядні частини мають суто часове значення'
        ],
        correctAnswer: 'Від головної частини до першої підрядної ставиться питання непрямого відмінка («у чому?»), що визначає з\'ясувальний підрядний зв\'язок',
        explanation: 'Питання непрямого відмінка від присудка головної частини вказує на підрядну з\'ясувальну частину.',
        microVerificationPrompt: 'Яке питання ставимо до підрядної з\'ясувальної частини речення?',
        microVerificationExpectedKeywords: ['питання відмінка', 'у чому', 'в чому', 'що', 'з\'ясувальн']
      },
      {
        id: 'ukr-ai-bug-1',
        skillCategory: 'grammar',
        level: 'Достатній (175+)',
        aiType: 'find_bug',
        aiBadge: '🐞 Пошук багів у розв\'язку (Find the Bug)',
        template: 'Пошук помилки в синтаксичному розборі речення:\n' +
          '«Учитель переконаний, що наполеглива праця обов’язково приведе учня до омріяного результату на тестуванні».\n' +
          '• Крок 1: Виділено граматичні основи: «учитель переконаний» та «праця приведе».\n' +
          '• Крок 2: З’ясовано засіб зв’язку: підрядний сполучник «що».\n' +
          '• Крок 3: Визначено вид підрядної частини: це підрядна частина причини, оскільки пояснює почуття вчителя.\n' +
          '• Крок 4: Пунктуація: між частинами перед «що» ставиться кома.\n' +
          'На якому кроці зроблено помилковий висновок?',
        options: [
          'Крок 3: помилка — від головної частини ставимо питання «у чому переконаний?», отже це підрядна з’ясувальна, а не причини',
          'Крок 1: слово «переконаний» є додатком, а не частиною присудка',
          'Крок 2: слово «що» є сполучним словом (займенником), а не сполучником',
          'Крок 4: кому перед «що» ставити не потрібно'
        ],
        correctAnswer: 'Крок 3: помилка — від головної частини ставимо питання «у чому переконаний?», отже це підрядна з’ясувальна, а не причини',
        explanation: 'Питання «у чому?» визначає підрядну з\'ясувальну частину, а не причини.',
        microVerificationPrompt: 'Яке синтаксичне питання ставимо від головної частини до підрядної у цьому реченні?',
        microVerificationExpectedKeywords: ['у чому', 'в чому', 'з\'ясувальн', 'питання відмінка']
      },
      {
        id: 'ukr-ai-trap-1',
        skillCategory: 'vocab',
        level: 'Достатній (175+)',
        aiType: 'llm_trap',
        aiBadge: '🪤 Пастка для LLM (Інформаційний шум)',
        template: 'У художньому описі старовинної чернігівської майстерні ложкарів читаємо: «Майстер сидів на колоді і вправно бив байдики, готуючи рівні чурбачки з липи для своїх підмайстрів». Яке значення має дія в описаному контексті?',
        options: [
          'Виконував первинну заготовку: розколював липову деревину на цурпалки (байдики) для виточування ложок',
          'Ледарював, байдикував і ухилявся від справжньої роботи',
          'Вибивав ритм молотком для налаштування верстата',
          'Карав недбайливих учнів за погано виконану роботу'
        ],
        correctAnswer: 'Виконував первинну заготовку: розколював липову деревину на цурпалки (байдики) для виточування ложок',
        explanation: 'LLM бачать ідіому «бити байдики» і рефлекторно обирають варіант «ледарювати». Проте в прямому історично-ремісничому значенні байдики — це дерев’яні цурпалки-заготовки для посуду чи ложок.',
        microVerificationPrompt: 'Що буквально означало слово «байдик» у давніх деревообробних ремеслах?',
        microVerificationExpectedKeywords: ['заготовка', 'цурпалок', 'брусок', 'деревина', 'дерево', 'ложка']
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
        id: 'hist-txt-1',
        skillCategory: 'listening', // practice task without audio
        level: 'Високий (190–200 НМТ)',
        template: 'Прочитайте цитату: «Хай буде Україна вільною. Не одділяючись від всієї Росії, хай народ український на своїй землі має право сам порядкувати своїм життям». До якого документа Центральної Ради належить ця цитата?',
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
      },

      // 4 AI-Resilient Question Formats for History:
      {
        id: 'hist-ai-case-1',
        skillCategory: 'logic',
        level: 'Високий (190–200 НМТ)',
        aiType: 'case_study',
        aiBadge: '📊 Кейс курсу StrictAI',
        template: 'Аудит статей українсько-московських договорів другої половини XVII ст.:\n' +
          'У таблиці зіставлено умови міждержавних угод Гетьманщини. У якому рядку допущено фактичну історичну помилку щодо умов або підписанта?\n' +
          '1. Березневі статті (1654, Б. Хмельницький): Заборона дипломатичних зносин з Польщею та Османською імперією\n' +
          '2. Переяславські статті (1659, Ю. Хмельницький): Московські воєводи у 5 містах, заборона обирати гетьмана без царя\n' +
          '3. Глухівські статті (1669, Д. Многогрішний): Реєстр 30 000 осіб, податки збирають московські воєводи\n' +
          '4. Коломацькі статті (1687, І. Мазепа): Заборона гетьману позбавляти старшину посад без суду, заохочення мішаних шлюбів',
        options: [
          'Рядок 3: помилка — за Глухівськими статтями податки збирала українська старшина, а не московські воєводи',
          'Рядок 1: Березневі статті підписано 1656 року',
          'Рядок 2: Переяславські статті підписав Іван Виговський',
          'Рядок 4: пункт про заохочення мішаних шлюбів з’явився лише в Решетилівських статтях'
        ],
        correctAnswer: 'Рядок 3: помилка — за Глухівськими статтями податки збирала українська старшина, а не московські воєводи',
        explanation: 'Глухівські статті 1669 р. Дем’яна Многогрішного повернули збір податків до рук козацької старшини (на відміну від Московських статей Брюховецького 1665 р.).',
        microVerificationPrompt: 'Хто збирав податки за Глухівськими статтями 1669 року: московські воєводи чи козацька старшина?',
        microVerificationExpectedKeywords: ['старшина', 'козацька', 'українська', 'не воєводи']
      },
      {
        id: 'hist-ai-vis-1',
        skillCategory: 'logic',
        level: 'Достатній (175+)',
        aiType: 'visual_diagram',
        aiBadge: '📐 Багатокомпонентна візуальна схема (Canvas)',
        requiresCanvas: true,
        visualDiagram: {
          type: 'node_graph',
          nodes: [
            { id: 'alpha', label: 'Жовті Води (05.1648)', x: 120, y: 110, color: '#2cbb5d' },
            { id: 'beta', label: 'Корсунь (05.1648)', x: 290, y: 50, color: '#ffa116' },
            { id: 'gamma', label: 'Пилявці (09.1648)', x: 460, y: 110, color: '#38bdf8' },
            { id: 'delta', label: 'Зборів (08.1649)', x: 290, y: 170, color: '#ef4743' }
          ],
          edges: [
            { from: 'alpha', to: 'beta', weight: 'травень 1648' },
            { from: 'beta', to: 'gamma', weight: 'осінь 1648' },
            { from: 'gamma', to: 'delta', weight: 'літо 1649' }
          ]
        },
        template: 'На наведеному Canvas-кресленні зображено хронологічний вектор битв Визвольної війни 1648–1649 рр. Яка битва завершилася підписанням договору про 40-тисячний реєстр козаків та визнання козацького самоврядування у трьох воєводствах?',
        options: [
          'Зборівська битва (серпень 1649 р.) -> Зборівський мирний договір',
          'Битва під Жовтими Водами',
          'Корсунська битва',
          'Битва під Пилявцями'
        ],
        correctAnswer: 'Зборівська битва (серпень 1649 р.) -> Зборівський мирний договір',
        explanation: 'Зборівський договір (серпень 1649) закріпив 40 тис. реєстру та Гетьманщину в межах Київського, Чернігівського і Брацлавського воєводств.',
        microVerificationPrompt: 'Укажіть чисельність козацького реєстру за Зборівським договором 1649 року:',
        microVerificationExpectedKeywords: ['40', '40 000', '40 тисяч', 'зборівськ']
      },
      {
        id: 'hist-ai-bug-1',
        skillCategory: 'grammar',
        level: 'Достатній (175+)',
        aiType: 'find_bug',
        aiBadge: '🐞 Пошук багів у розв\'язку (Find the Bug)',
        template: 'Пошук хронологічної помилки в подіях Української революції 1918 року:\n' +
          '• Крок 1: Лютий 1918 р. — підписання Брест-Литовського мирного договору між УНР і державами Четверного союзу.\n' +
          '• Крок 2: Березень–квітень 1918 р. — звільнення України від більшовиків військами УНР за підтримки німецько-австрійських армій.\n' +
          '• Крок 3: 29 квітня 1918 р. — Українська Центральна Рада одностайно обрала Павла Скоропадського гетьманом України.\n' +
          '• Крок 4: Травень 1918 р. — оприлюднення «Закону про тимчасовий державний устрій України» та перейменування на Українську Державу.\n' +
          'Знайдіть крок, де допущено грубу історичну неточність:',
        options: [
          'Крок 3: Центральна Рада не обирала Скоропадського — його проголосив Всеукраїнський з’їзд хліборобів, а Раду було розігнано',
          'Крок 1: Берестейський мир було підписано в січні, а не в лютому',
          'Крок 2: австро-угорські війська не брали участі у звільненні',
          'Крок 4: держава продовжувала офіційно називатися УНР'
        ],
        correctAnswer: 'Крок 3: Центральна Рада не обирала Скоропадського — його проголосив Всеукраїнський з’їзд хліборобів, а Раду було розігнано',
        explanation: '29 квітня 1918 р. Центральну Раду було усунуто внаслідок перевороту, а Павла Скоропадського гетьманом проголосив З\'їзд хліборобів.',
        microVerificationPrompt: 'Який орган проголосив П. Скоропадського гетьманом 29 квітня 1918 року?',
        microVerificationExpectedKeywords: ['хлібороб', 'з\'їзд хліборобів', 'не центральна рада', 'переворот']
      },
      {
        id: 'hist-ai-trap-1',
        skillCategory: 'logic',
        level: 'Високий (190–200 НМТ)',
        aiType: 'llm_trap',
        aiBadge: '🪤 Пастка для LLM (Інформаційний шум)',
        template: 'Прочитайте уривок із відозви: «Український народе! Впали пута... Волею народу утворилася Українська Держава на українських землях давньої австро-угорської монархії. З нинішнім днем Українська Національна Рада обняла власть у столичнім місті Львові і на цілій території... Як колись за часів Богдана Хмельницького, встаньмо всі як один!». Яку подію започаткував цей документ?',
        options: [
          'Листопадовий зрив / повстання у Львові та проголошення ЗУНР (1 листопада 1918 р.)',
          'Початок Національно-визвольної війни під проводом Б. Хмельницького (1648 р.)',
          'Проголошення І Універсалу Української Центральної Ради (1917 р.)',
          'Взяття Львова козацькими полками Максима Кривоноса'
        ],
        correctAnswer: 'Листопадовий зрив / повстання у Львові та проголошення ЗУНР (1 листопада 1918 р.)',
        explanation: 'Згадка Богдана Хмельницького є лише риторичним порівнянням. Текст говорить про Українську Національну Раду, Львів та колишню австро-угорську монархію — це проголошення влади у Львові 1 листопада 1918 р. (ЗУНР). Багато LLM чіпляються за слово «Хмельницький».',
        microVerificationPrompt: 'Які ключові слова в документі (крім Хмельницького) вказують на 1918 рік і Львів?',
        microVerificationExpectedKeywords: ['львів', 'австро-угорськ', 'національна рада', 'зунр', '1918']
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
        id: 'bio-txt-1',
        skillCategory: 'listening', // practice task without audio
        level: 'Достатній (175+)',
        template: 'Лабораторний аналіз показав, що у фрагменті дволанцюгової ДНК частка тиміну (Т) становить 20% від загальної кількості нуклеотидів. Визначте відсоткову частку гуанілових нуклеотидів (Г) за правилом Чаргаффа:',
        options: ['30%', '20%', '40%', '10%'],
        correctAnswer: '30%',
        explanation: 'За правилом Чаргаффа: Т = А = 20% (разом 40%). На пару Г + Ц залишається 60%, отже частка гуаніну Г = 30%.'
      },
      {
        id: 'bio-r-1',
        skillCategory: 'logic',
        level: 'Високий (190–200 НМТ)',
        template: 'Тіло масою 2 кг рухається рівномірно прямолінійно зі швидкістю 6 м/с. Чому дорівнює його кінетична енергія?',
        options: ['36 Дж', '12 Дж', '72 Дж', '18 Дж'],
        correctAnswer: '36 Дж',
        explanation: '$E_k = \\frac{m v^2}{2} = \\frac{2 \\cdot 6^2}{2} = 36$ Дж.'
      },

      // 4 AI-Resilient Question Formats for Biology & Physics:
      {
        id: 'bio-ai-case-1',
        skillCategory: 'logic',
        level: 'Високий (190–200 НМТ)',
        aiType: 'case_study',
        aiBadge: '📊 Кейс курсу StrictAI',
        template: 'Аудит теплового балансу мікропроцесорного стенду StrictAI:\n' +
          'У таблиці наведено дані тепловиділення 4 модулів обчислювального блоку:\n' +
          '• Модуль 1: Потужність 40 Вт, ККД перетворення 85%, Тепловтрати = 6 Вт\n' +
          '• Модуль 2: Потужність 60 Вт, ККД перетворення 80%, Тепловтрати = 12 Вт\n' +
          '• Модуль 3: Потужність 100 Вт, ККД перетворення 90%, Тепловтрати = 90 Вт\n' +
          '• Модуль 4: Потужність 50 Вт, ККД перетворення 70%, Тепловтрати = 15 Вт\n' +
          'У якому рядку аудиту допущено грубу фізико-математичну помилку розрахунку тепловтрат $Q_{loss} = P \\cdot (1 - \\eta)$?',
        options: [
          'Рядок 3: розраховано корисну потужність (100 * 0.90 = 90 Вт) замість втрат тепла (100 * 0.10 = 10 Вт)',
          'Рядок 1: тепловтрати мали становити 10 Вт',
          'Рядок 2: ККД 80% неможливий для кремнієвих чіпів',
          'Рядок 4: тепловтрати мають дорівнювати 25 Вт'
        ],
        correctAnswer: 'Рядок 3: розраховано корисну потужність (100 * 0.90 = 90 Вт) замість втрат тепла (100 * 0.10 = 10 Вт)',
        explanation: 'Для Модуля 3 тепловтрати становлять $100 \\cdot (1 - 0.90) = 10$ Вт. Аудитор помилково записав корисну потужність 90 Вт.',
        microVerificationPrompt: 'Як розраховуються втрати потужності $Q_{loss}$ за заданим ККД $\\eta$?',
        microVerificationExpectedKeywords: ['p * (1 - eta)', '1 - ккд', '10 вт', 'втрати']
      },
      {
        id: 'bio-ai-vis-1',
        skillCategory: 'logic',
        level: 'Достатній (175+)',
        aiType: 'visual_diagram',
        aiBadge: '📐 Багатокомпонентна візуальна схема (Canvas)',
        requiresCanvas: true,
        visualDiagram: {
          type: 'circuit',
          r1: 6,
          r2: 3,
          r3: 4,
          switchState: 'open'
        },
        template: 'На наведеному графічному полотні Canvas подано схему ділянки електричного кола. Опори резисторів: R₁ = 6 Ом, R₂ = 3 Ом (з\'єднані паралельно), послідовно до них підключено резистор R₃ = 4 Ом. Ключ розімкнено. Визначте еквівалентний опір ділянки кола між клемами A і B:',
        options: [
          'R_екв = 6 Ом (2 Ом від паралельної пари + 4 Ом від R₃)',
          'R_екв = 13 Ом (просте додавання 6 + 3 + 4)',
          'R_екв = 2 Ом (опір R₃ не враховується)',
          'R_екв = 9 Ом'
        ],
        correctAnswer: 'R_екв = 6 Ом (2 Ом від паралельної пари + 4 Ом від R₃)',
        explanation: 'Паралельне з’єднання R₁ та R₂: $R_{12} = \\frac{6 \\cdot 3}{6 + 3} = 2$ Ом. Послідовно з R₃: $R_{zag} = 2 + 4 = 6$ Ом.',
        microVerificationPrompt: 'За якою формулою знайдено еквівалентний опір паралельної пари 6 Ом та 3 Ом?',
        microVerificationExpectedKeywords: ['(r1*r2)/(r1+r2)', 'добуток на суму', '2 ом', '18/9']
      },
      {
        id: 'bio-ai-bug-1',
        skillCategory: 'grammar',
        level: 'Достатній (175+)',
        aiType: 'find_bug',
        aiBadge: '🐞 Пошук багів у розв\'язку (Find the Bug)',
        template: 'Пошук багу в генетичному розрахунку дигібридного схрещування:\n' +
          'Схрещуються дигетерозиготні особини $AaBb \\times AaBb$ (незалежне успадкування).\n' +
          '• Крок 1: Кожен із батьків утворює по 4 типи гамет ($AB, Ab, aB, ab$) у рівних пропорціях (по 25%).\n' +
          '• Крок 2: Побудовано решітку Пеннета на 16 комірок ($4 \\times 4$).\n' +
          '• Крок 3: Розраховано розщеплення за фенотипом: 9 : 3 : 3 : 1.\n' +
          '• Крок 4: Зроблено висновок: частка особин, що є повністю гомозиготними за обома ознаками ($AABB, AAbb, aaBB, aabb$), становить 50% ($8/16$).\n' +
          'На якому кроці допущено математичну помилку?',
        options: [
          'Крок 4: Повних гомозигот у решітці всього 4 типи з 16 ($4/16 = 25\\%$), а не 50%',
          'Крок 1: Дигетерозигота утворює лише 2 типи гамет',
          'Крок 2: Решітка Пеннета має складати 8 комірок',
          'Крок 3: Розщеплення за фенотипом має бути 1 : 2 : 1'
        ],
        correctAnswer: 'Крок 4: Повних гомозигот у решітці всього 4 типи з 16 ($4/16 = 25\\%$), а не 50%',
        explanation: 'Повні гомозиготи по діагоналі: AABB (1), AAbb (1), aaBB (1), aabb (1) — разом 4 особини з 16 ($25\\%$), а не 50%.',
        microVerificationPrompt: 'Скільки комірок із 16 у решітці Пеннета займають особини генотипу AABB та aabb разом?',
        microVerificationExpectedKeywords: ['2', '2/16', '1/8', 'дві комірки']
      },
      {
        id: 'bio-ai-trap-1',
        skillCategory: 'logic',
        level: 'Високий (190–200 НМТ)',
        aiType: 'llm_trap',
        aiBadge: '🪤 Пастка для LLM (Інформаційний шум)',
        template: 'В експериментальному реакторі термодинамічної лабораторії StrictAI (де об’єм камери 48 л, тиск 101.3 кПа, 32 датчики температури та постійна Авогадро $6.02 \\cdot 10^{23}$) визначено специфічний коефіцієнт теплопереносу $\\Omega(x, y)$:\n' +
          '• Якщо x > y: $\\Omega(x, y) = x^2 - 2y$\n' +
          '• Якщо x ≤ y: $\\Omega(x, y) = 3y - x$\n' +
          'Не зважаючи на тиск, датчики та постійні величини, знайдіть точне значення: $\\Omega(3, 5) + \\Omega(4, 2)$.',
        options: [
          '24 (оскільки 12 + 12 = 24)',
          '16 (внаслідок хибного вибору формули)',
          '48 (об\'єм камери реактора)',
          '32'
        ],
        correctAnswer: '24 (оскільки 12 + 12 = 24)',
        explanation: '$\\Omega(3, 5) = 15 - 3 = 12$. $\\Omega(4, 2) = 16 - 4 = 12$. Сума: 12 + 12 = 24. Усі інші фізичні величини — шум.',
        microVerificationPrompt: 'Яке значення дав розрахунок $\\Omega(4, 2)$?',
        microVerificationExpectedKeywords: ['12', '4^2 - 4', '16 - 4', 'x^2 - 2y']
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
      this.currentQuestionIndex = 0; // Required by anti-cheat tracker contract
      this.score = 0;
      this.answered = false;
      this.answers = {}; // Tracks choices or '__forfeited__'
      this.questionStartTime = 0;
      this.microVerifying = false;

      // 4-Skill counters (Note: 'listening' is mapped to text/practice analysis without audio)
      this.skillStats = {
        grammar: { correct: 0, total: 0 },
        vocab: { correct: 0, total: 0 },
        listening: { correct: 0, total: 0 }, // Practice / Text Analysis
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
              if (window.StrictComponents && typeof window.StrictComponents.playBeep === 'function') {
                window.StrictComponents.playBeep('click');
              }
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
          if (window.StrictComponents && typeof window.StrictComponents.playBeep === 'function') {
            window.StrictComponents.playBeep('click');
          }
        });
      });

      // Regenerate Seed button
      const seedBtn = document.getElementById('btn-regenerate-seed');
      if (seedBtn) {
        seedBtn.addEventListener('click', () => {
          this.generateNewSeed();
          if (window.StrictComponents && typeof window.StrictComponents.playBeep === 'function') {
            window.StrictComponents.playBeep('click');
          }
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

      // Ensure anti-cheat buttons are wired up
      this._bindAntiCheatControls();
    }

    _bindAntiCheatControls() {
      // Connect AI Extension Simulation button (#btn-simulate-ai-extension)
      const simBtn = document.getElementById('btn-simulate-ai-extension');
      if (simBtn) {
        simBtn.onclick = () => {
          if (window.StrictAntiCheat) {
            if (typeof window.StrictAntiCheat.simulateAIExtension === 'function') {
              window.StrictAntiCheat.simulateAIExtension();
            } else if (typeof window.StrictAntiCheat.simulateExtensionAttack === 'function') {
              window.StrictAntiCheat.simulateExtensionAttack('Monica AI Assistant');
            }
          }
        };
      }

      // Connect Manual Micro-Verification button (#btn-trigger-micro-verify)
      const verifyBtn = document.getElementById('btn-trigger-micro-verify');
      if (verifyBtn) {
        verifyBtn.onclick = () => {
          if (window.StrictAntiCheat && typeof window.StrictAntiCheat.openMicroVerificationModal === 'function') {
            window.StrictAntiCheat.openMicroVerificationModal({
              prompt: '⚡ Ручна верифікація знань: Коротко в 1 реченні поясніть хід вашої думки або вибір відповіді:'
            });
          }
        };
      }
    }

    startTest() {
      if (window.StrictComponents && typeof window.StrictComponents.playBeep === 'function') {
        window.StrictComponents.playBeep('click');
      }

      this.currentIndex = 0;
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.answered = false;
      this.answers = {};
      this.skillStats = {
        grammar: { correct: 0, total: 0 },
        vocab: { correct: 0, total: 0 },
        listening: { correct: 0, total: 0 }, // Practice / Text Analysis
        logic: { correct: 0, total: 0 }
      };
      this.aiCurrentLevelIndex = 2; // B1 / Middle
      this.aiStepHistory = [];

      // 1. Generate Questions with 4 AI-Resilient Formats
      this.testQuestions = this.generateQuestionsForSubject(this.currentSubject, this.currentMode, this.currentSeed);

      // 2. Anti-Cheat Engine: Security Lockdown
      if (window.StrictAntiCheat) {
        if (typeof window.StrictAntiCheat.enableSecurityLocks === 'function') {
          window.StrictAntiCheat.enableSecurityLocks();
        } else if (typeof window.StrictAntiCheat.enableBrowserLockdown === 'function') {
          window.StrictAntiCheat.enableBrowserLockdown();
        }
      }

      // 3. Anti-Cheat Engine: Tab/Window Focus Tracking with 2-Strike Forfeiture
      if (window.StrictAntiCheat && typeof window.StrictAntiCheat.startFocusTracking === 'function') {
        window.StrictAntiCheat.startFocusTracking((violationCount) => {
          if (violationCount >= 2) {
            if (window.StrictComponents && typeof window.StrictComponents.toast === 'function') {
              window.StrictComponents.toast('🚨 Порушення 2/2: Питання анульовано через вихід з вкладки!', 'error');
            }
            this.answers[this.currentQuestionIndex] = '__forfeited__';
            this.nextQuestion();
          }
        });
      }

      // 4. Anti-Cheat Engine: AI Extension MutationObserver
      if (window.StrictAntiCheat) {
        if (typeof window.StrictAntiCheat.initMutationObserver === 'function') {
          window.StrictAntiCheat.initMutationObserver();
        } else if (typeof window.StrictAntiCheat.startExtensionShield === 'function') {
          window.StrictAntiCheat.startExtensionShield();
        }
      }

      // 5. Anti-Cheat Engine: Biometric Telemetry HUD
      const hudEl = document.getElementById('placement-telemetry-hud');
      if (hudEl && window.StrictAntiCheat && typeof window.StrictAntiCheat.renderTelemetryHUD === 'function') {
        window.StrictAntiCheat.renderTelemetryHUD(hudEl);
      }

      // 6. Anti-Cheat Engine: Biometrics Tracker
      if (window.StrictAntiCheat && typeof window.StrictAntiCheat.startBiometricsTracker === 'function') {
        window.StrictAntiCheat.startBiometricsTracker(document.getElementById('placement-quiz-view') || document.body);
      }

      // 7. Transition views
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

      // 8. Update quiz header
      const subMeta = this.SUBJECTS[this.currentSubject];
      const badge = document.getElementById('quiz-subject-badge');
      if (badge) badge.textContent = `${subMeta.icon} ${subMeta.name}`;

      const modeTitle = document.getElementById('quiz-mode-title');
      if (modeTitle) {
        modeTitle.textContent = this.currentMode === 'ai'
          ? '🤖 Жива ШІ-Діагностика з Пандою (AI Adaptive)'
          : '🌍 Міжнародний стандарт (CEFR / УЦОЯО Matrix)';
      }

      // 9. Synchronize translations on entering test
      if (window.StrictI18n && typeof window.StrictI18n.applyTranslations === 'function') {
        window.StrictI18n.applyTranslations();
      }

      this.renderCurrentQuestion();
    }

    /**
     * Procedural generator that constructs test questions including the 4 AI-Resilient Formats
     */
    generateQuestionsForSubject(subjectId, mode, seed) {
      const prng = createPRNG(seed || this.currentSeed || Date.now().toString());
      const subMeta = this.SUBJECTS[subjectId] || this.SUBJECTS.english;
      const pool = QUESTION_BANK[subjectId] || QUESTION_BANK.english;

      const seenIds = new Set(getSeenQuestionIds());
      const unseenPool = pool.filter((q) => !seenIds.has(q.id));
      const activePool = unseenPool.length >= 5 ? unseenPool : pool;

      const selectedTemplates = [];
      const requiredAiTypes = ['case_study', 'visual_diagram', 'find_bug', 'llm_trap'];

      // Always include the 4 AI-Resilient Question Formats
      for (const aiType of requiredAiTypes) {
        const matching = activePool.filter((q) => q.aiType === aiType);
        if (matching.length > 0) {
          const item = matching[Math.floor(prng() * matching.length)];
          if (!selectedTemplates.some((t) => t.id === item.id)) {
            selectedTemplates.push(item);
          }
        }
      }

      // If any AI type is missing from active pool, check full subject pool or fallbacks
      for (const aiType of requiredAiTypes) {
        if (!selectedTemplates.some((t) => t.aiType === aiType)) {
          const fallback = pool.find((q) => q.aiType === aiType);
          if (fallback && !selectedTemplates.some((t) => t.id === fallback.id)) {
            selectedTemplates.push(fallback);
          }
        }
      }

      // Ensure foundational skills coverage (grammar, vocab, practice/reading, logic)
      const foundationalCategories = ['grammar', 'vocab', 'listening', 'logic'];
      for (const cat of foundationalCategories) {
        const catItems = activePool.filter((q) => q.skillCategory === cat && !q.aiType);
        if (catItems.length > 0) {
          const item = catItems[Math.floor(prng() * catItems.length)];
          if (!selectedTemplates.some((t) => t.id === item.id)) {
            selectedTemplates.push(item);
          }
        }
      }

      // Total count: 8 for CEFR/NMT, 5 for AI Adaptive
      const targetCount = mode === 'ai' ? 5 : 8;

      // If we have more than targetCount, shuffle and slice, while guaranteeing at least 2 AI types in AI mode, or all 4 in CEFR mode
      let finalTemplates = [];
      if (mode === 'ai') {
        const aiItems = selectedTemplates.filter(q => q.aiType);
        const regularItems = selectedTemplates.filter(q => !q.aiType);
        finalTemplates = [
          ...shuffleWithPRNG(aiItems, prng).slice(0, 3),
          ...shuffleWithPRNG(regularItems, prng).slice(0, 2)
        ];
      } else {
        // CEFR: ensure 4 AI items + 4 regular items
        const aiItems = selectedTemplates.filter(q => q.aiType);
        const regularItems = selectedTemplates.filter(q => !q.aiType);
        finalTemplates = [
          ...aiItems.slice(0, 4),
          ...regularItems.slice(0, 4)
        ];
      }

      // Fill up if still less than targetCount
      if (finalTemplates.length < targetCount) {
        const remainderPool = shuffleWithPRNG(pool, prng);
        for (const item of remainderPool) {
          if (finalTemplates.length >= targetCount) break;
          if (!finalTemplates.some((t) => t.id === item.id)) {
            finalTemplates.push(item);
          }
        }
      }

      // Remember seen IDs
      markQuestionsSeen(finalTemplates.map((q) => q.id));

      // Synthesize dynamic parameters
      return finalTemplates.map((template, idx) => {
        return this._instantiateQuestion(template, prng, subMeta, idx);
      });
    }

    // Alias for backward compatibility
    generateUniqueTest(subjectId, mode, seed) {
      return this.generateQuestionsForSubject(subjectId, mode, seed);
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
          aiType: template.aiType || null,
          aiBadge: template.aiBadge || null,
          requiresCanvas: !!template.requiresCanvas,
          visualDiagram: template.visualDiagram || null,
          solutionSteps: template.solutionSteps || null,
          microVerificationPrompt: template.microVerificationPrompt || null,
          microVerificationExpectedKeywords: template.microVerificationExpectedKeywords || [],
          question: dyn.text,
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

      const text = (template.template || template.statement || '')
        .replace(/\{name\}/g, name)
        .replace(/\{city\}/g, city)
        .replace(/\{year\}/g, year)
        .replace(/\{num\}/g, num);

      // Shuffle options while keeping track of correct answer
      const rawOptions = (template.options || []).map((opt) => {
        const optStr = typeof opt === 'string' ? opt : (opt.text || opt.label || '');
        return optStr
          .replace(/\{name\}/g, name)
          .replace(/\{city\}/g, city)
          .replace(/\{year\}/g, year)
          .replace(/\{num\}/g, num);
      });

      const targetAnswer = (template.correctAnswer || (template.options && template.options[0]) || '')
        .toString()
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
        skillCategory: template.skillCategory || 'grammar',
        level: template.level || 'B2',
        aiType: template.aiType || null,
        aiBadge: template.aiBadge || null,
        requiresCanvas: !!template.requiresCanvas,
        visualDiagram: template.visualDiagram || null,
        solutionSteps: template.solutionSteps || null,
        microVerificationPrompt: template.microVerificationPrompt || null,
        microVerificationExpectedKeywords: template.microVerificationExpectedKeywords || [],
        question: text,
        options: shuffledOpts,
        correctIndex: correctIdx,
        explanation: template.explanation || ''
      };
    }

    renderCurrentQuestion() {
      const q = this.testQuestions[this.currentIndex];
      if (!q) return;

      this.answered = false;
      this.currentQuestionIndex = this.currentIndex;
      this.questionStartTime = performance.now();

      // 1. One-way 45-Second Hard Timer with Progress Fill
      if (window.StrictAntiCheat && typeof window.StrictAntiCheat.startQuestionTimer === 'function') {
        window.StrictAntiCheat.startQuestionTimer({
          countdownEl: document.getElementById('question-timer-countdown'),
          fillEl: document.getElementById('question-timer-progress-fill'),
          durationSec: 45,
          onExpire: () => {
            if (window.StrictComponents && typeof window.StrictComponents.toast === 'function') {
              window.StrictComponents.toast('⏱️ 45с вичерпано! Перехід до наступного...', 'info');
            }
            this.nextQuestion();
          }
        });
      }

      // 2. Lock Back Button (#btn-quiz-prev: 🔒 Назад заборонено)
      const prevBtn = document.getElementById('btn-quiz-prev');
      if (prevBtn) {
        prevBtn.disabled = true;
        prevBtn.innerHTML = '🔒 Назад заборонено';
        prevBtn.style.opacity = '0.45';
        prevBtn.style.cursor = 'not-allowed';
        prevBtn.title = 'Повернення до попередніх питань заблоковано правилами доброчесності StrictAI';
      }

      // 3. AI Badge (#q-ai-badge)
      const aiBadgeEl = document.getElementById('q-ai-badge');
      if (aiBadgeEl) {
        if (q.aiBadge || q.aiType) {
          aiBadgeEl.textContent = q.aiBadge || `🛡️ ${q.aiType}`;
          aiBadgeEl.style.display = 'inline-flex';
        } else {
          aiBadgeEl.style.display = 'none';
        }
      }

      // 4. Multi-Component Protection Canvas (#question-protection-canvas)
      const canvasEl = document.getElementById('question-protection-canvas');
      const needsCanvas = q.requiresCanvas || q.aiType === 'visual_diagram' || !!q.visualDiagram;
      if (canvasEl) {
        if (needsCanvas) {
          canvasEl.style.display = 'block';
          if (window.StrictAntiCheat && typeof window.StrictAntiCheat.renderQuestionCanvas === 'function') {
            window.StrictAntiCheat.renderQuestionCanvas(canvasEl, q, {
              theme: 'dark',
              sessionId: this.currentSeed
            });
          }
        } else {
          canvasEl.style.display = 'none';
        }
      }

      // 5. Hide any audio boxes if they still exist in the DOM (Zero TTS policy)
      const audioBox = document.getElementById('quiz-audio-box');
      if (audioBox) audioBox.style.display = 'none';
      const audioBtn = document.getElementById('btn-audio-pronounce') || document.getElementById('btn-play-question-audio');
      if (audioBtn) audioBtn.style.display = 'none';

      // 6. Update progress bar & label
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

      // 7. Question difficulty badge
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

      // 8. Context box
      const contextEl = document.getElementById('quiz-question-context');
      if (contextEl) {
        if (q.context) {
          contextEl.textContent = q.context;
          contextEl.style.display = 'block';
        } else {
          contextEl.style.display = 'none';
        }
      }

      // 9. Question prompt
      const questionText = document.getElementById('quiz-question-text') || document.getElementById('question-text');
      if (questionText) {
        questionText.textContent = q.question;
      }

      // 10. Reset feedback commentary box
      const commentEl = document.getElementById('quiz-feedback-box') || document.getElementById('quiz-panda-comment');
      if (commentEl) {
        commentEl.style.display = 'none';
        commentEl.innerHTML = '';
      }

      // 11. Speech bubble in hero
      const heroSpeech = document.getElementById('placement-panda-speech');
      if (heroSpeech) {
        heroSpeech.textContent = `«${this._getPandaPromptComment(q)}»`;
      }
      this._renderMiniPanda('#quiz-panda-mini', 'idle');

      // 12. Render options container
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
                ✨ ШІ-Аналіз: Додай коротке пояснення свого вибору (необов'язково):
              </label>
              <input type="text" id="ai-user-written-answer" placeholder="Наприклад: Обрано варіант 3, бо при p99 затримки підсумовуються..." style="width: 100%; box-sizing: border-box; background: var(--bg-primary, #1E1035); border: 1px solid var(--border-card, rgba(255, 255, 255, 0.18)); border-radius: 10px; padding: 10px 14px; font-size: 0.9rem; color: var(--text-main, #FFFFFF); outline: none;">
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
      if (q.aiType === 'case_study') {
        return 'Уважно проаналізуй таблицю кейсу. Тут прихована тонкість розрахунку або паронім!';
      } else if (q.aiType === 'visual_diagram') {
        return 'Поглянь на полотно Canvas. Визнач топологічні властивості або характер графіка.';
      } else if (q.aiType === 'find_bug') {
        return 'Розглянь кожен крок розв\'язку під мікроскопом. На якому кроці зламано фундаментальне правило?';
      } else if (q.aiType === 'llm_trap') {
        return 'Обережно: тут є пастка для ШІ з числовим шумом! Зосередься виключно на математичному правилі.';
      }

      if (this.currentMode === 'ai') {
        const sub = this.SUBJECTS[this.currentSubject];
        const currentLvl = sub.levels[this.aiCurrentLevelIndex] || 'B1';
        return `Я уважно слідкую за твоїм мисленням! Діагностичний рівень: ${currentLvl}. Оцінюю точність та аргументацію.`;
      }

      return 'Прочитай фрагмент вдумливо та обери найбільш обґрунтовану відповідь.';
    }

    handleOptionSelect(selectedIndex) {
      if (this.answered) return;

      const elapsedSec = (performance.now() - this.questionStartTime) / 1000;
      const q = this.testQuestions[this.currentIndex];

      // Anti-Cheat Speed Check: if answered in < 4.0 seconds, trigger 20-second blitz modal
      if (elapsedSec < 4.0 && !this.microVerifying) {
        this.microVerifying = true;
        if (window.StrictAntiCheat && typeof window.StrictAntiCheat.openMicroVerificationModal === 'function') {
          window.StrictAntiCheat.openMicroVerificationModal({
            prompt: q.microVerificationPrompt || '⚡ Швидка відповідь (<4с)! Підтвердіть розв\'язання одним коротким реченням:',
            expectedKeywords: q.microVerificationExpectedKeywords || []
          }).then((verifyResult) => {
            this.microVerifying = false;
            this._commitOptionSelect(selectedIndex, verifyResult);
          }).catch(() => {
            this.microVerifying = false;
            this._commitOptionSelect(selectedIndex, null);
          });
          return;
        }
      }

      this._commitOptionSelect(selectedIndex, null);
    }

    _commitOptionSelect(selectedIndex, verifyResult) {
      if (this.answered) return;
      this.answered = true;

      // Stop Question Timer immediately upon selection
      if (window.StrictAntiCheat && typeof window.StrictAntiCheat.stopQuestionTimer === 'function') {
        window.StrictAntiCheat.stopQuestionTimer();
      }

      this.answers[this.currentQuestionIndex] = selectedIndex;
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

      // Audio/Beep effect
      if (window.StrictComponents && typeof window.StrictComponents.playBeep === 'function') {
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
            if (marker) marker.innerHTML = '✓';
          } else if (idx === selectedIndex && !isCorrect) {
            btn.classList.add('incorrect');
            if (marker) marker.innerHTML = '✕';
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

      // Micro-verification badge
      let verifyNote = '';
      if (verifyResult && verifyResult.passed) {
        verifyNote = ' <span style="color:#2cbb5d; font-size:0.85rem;">[⚡ Мікро-верифікацію пройдено успішно]</span>';
      }

      // Feedback commentary box & Adaptive Difficulty adjustment
      const commentEl = document.getElementById('quiz-feedback-box') || document.getElementById('quiz-panda-comment');
      const heroSpeech = document.getElementById('placement-panda-speech');
      const sub = this.SUBJECTS[this.currentSubject];

      let feedbackHTML = '';
      let speechText = '';

      if (this.currentMode === 'ai') {
        if (isCorrect) {
          this.aiCurrentLevelIndex = Math.min(sub.levels.length - 1, this.aiCurrentLevelIndex + 1);
          const nextLvl = sub.levels[this.aiCurrentLevelIndex];
          feedbackHTML = `<span style="color: var(--accent-bamboo, #22C55E); font-weight: 700;">🎯 Бездоганно!</span> Правильна відповідь.${aiWrittenBonus}${verifyNote} Підвищую складність до рівня <b>${nextLvl}</b>!`;
          speechText = `«Бездоганно! Підвищую складність до рівня ${nextLvl}.»`;
          if (commentEl) commentEl.style.borderLeftColor = 'var(--accent-bamboo, #22C55E)';
          this._renderMiniPanda('#quiz-panda-mini', 'celebrating');
        } else {
          this.aiCurrentLevelIndex = Math.max(0, this.aiCurrentLevelIndex - 1);
          const nextLvl = sub.levels[this.aiCurrentLevelIndex];
          feedbackHTML = `<span style="color: var(--accent-orange, #F2994A); font-weight: 700;">💡 Є неточність:</span> Правильна відповідь: «${q.options[q.correctIndex]}». ${q.explanation}${verifyNote} Адаптую складність до <b>${nextLvl}</b>.`;
          speechText = `«Не засмучуйся, розберемо цю помилку. Адаптую рівень до ${nextLvl}.»`;
          if (commentEl) commentEl.style.borderLeftColor = 'var(--accent-orange, #F2994A)';
          this._renderMiniPanda('#quiz-panda-mini', 'thinking');
        }
      } else {
        if (isCorrect) {
          feedbackHTML = `<span style="color: var(--accent-bamboo, #22C55E); font-weight: 700;">✅ Чудово!</span> Правильна відповідь.${verifyNote} ${q.explanation}`;
          speechText = `«Правильно! Рухаємось далі.»`;
          if (commentEl) commentEl.style.borderLeftColor = 'var(--accent-bamboo, #22C55E)';
          this._renderMiniPanda('#quiz-panda-mini', 'celebrating');
        } else {
          feedbackHTML = `<span style="color: #F43F5E; font-weight: 700;">❌ Помилка.</span> Правильна відповідь: «${q.options[q.correctIndex]}».${verifyNote} ${q.explanation}`;
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

    nextQuestion() {
      if (window.StrictComponents && typeof window.StrictComponents.playBeep === 'function') {
        window.StrictComponents.playBeep('click');
      }

      if (this.currentIndex + 1 < this.testQuestions.length) {
        this.currentIndex += 1;
        this.renderCurrentQuestion();
      } else {
        this.finishTest();
      }
    }

    finishTest() {
      // 1. Stop Anti-Cheat Question Timer
      if (window.StrictAntiCheat && typeof window.StrictAntiCheat.stopQuestionTimer === 'function') {
        window.StrictAntiCheat.stopQuestionTimer();
      }

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

      // 2. Synchronize translations on entering results
      if (window.StrictI18n && typeof window.StrictI18n.applyTranslations === 'function') {
        window.StrictI18n.applyTranslations();
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
        desc = `Ви демонструєте впевнене володіння ключовими конструкціями з високим рівнем академічної стійкості. Рекомендовано закріпити граматичні нюанси та розширити спеціальну лексику в ШІ-Репетиторі.`;
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
        pandaText.textContent = `Пишаюся твоїми зусиллями! Твій рівень — «${res.level}». Захист від ШІ підтвердив абсолютну академічну доброчесність результату. Дані вже збережено в профіль. Почнімо тренування!`;
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
      if (window.StrictComponents && typeof window.StrictComponents.playBeep === 'function') {
        window.StrictComponents.playBeep('success');
      }

      const sub = this.SUBJECTS[this.currentSubject];
      const isLang = sub.type === 'language' || sub.category === 'lang';
      const cleanLevel = isLang ? (this.determinedResult?.level?.split(' ')[0] || 'B1') : 'B2';

      const url = `tutor.html?subject=${encodeURIComponent(this.currentSubject)}&level=${encodeURIComponent(cleanLevel)}&mode=${isLang ? 'languages' : 'school'}`;
      window.location.href = url;
    }

    retakeTest() {
      if (window.StrictComponents && typeof window.StrictComponents.playBeep === 'function') {
        window.StrictComponents.playBeep('click');
      }

      // Stop any running timer
      if (window.StrictAntiCheat && typeof window.StrictAntiCheat.stopQuestionTimer === 'function') {
        window.StrictAntiCheat.stopQuestionTimer();
      }

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
      console.log('[StrictPlacement] Diagnostic controller with Anti-Cheat initialized.');
    });
  }

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
