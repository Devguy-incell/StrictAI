/* ==========================================================================
   StrictAI Mobile Application — Curriculum, Personas & NMT/CAT Question Bank
   Module 1: window.StrictCurriculum
   - 5 Languages (CEFR A1-C2) + 4 Roleplay Scenarios with opening prompts
   - 4 School/NMT Subjects (+ English NMT in EXAM_SUBJECTS)
   - Strict Grade-Band Isolation ('grade-5-7', 'grade-8-9', 'nmt-200', 'olympiad')
   - 9 Tutor Methodologies (PERSONAS)
   - Context-aware Tutor Reply Generator (bilingual, persona-locked, verifiable)
   - 24 AI-Resilient NMT & CAT Questions across 4 formats + Micro-Verifications
   - Universities, 20-Node Knowledge Map DAG, CAT Selector, NMT 100-200 Scaler
   ZERO EMOJIS. Uses StrictIcons names only.
   ========================================================================== */

(function (global) {
  'use strict';

  /* ------------------------------------------------------------------------
     1. Languages, CEFR Levels & Roleplay Scenarios
     ------------------------------------------------------------------------ */

  var LANGUAGES = [
    {
      id: 'english',
      name: 'English',
      nativeName: 'English',
      code: 'EN',
      icon: 'globe',
      description: 'Академічна, ІТ-комунікація та підготовка до НМТ з англійської.'
    },
    {
      id: 'deutsch',
      name: 'Deutsch',
      nativeName: 'Deutsch',
      code: 'DE',
      icon: 'globe',
      description: 'Німецька граматика, інженерний та університетський дискурс.'
    },
    {
      id: 'espanol',
      name: 'Español',
      nativeName: 'Español',
      code: 'ES',
      icon: 'globe',
      description: 'Іспанська граматика, часові форми та живі комунікативні сцени.'
    },
    {
      id: 'polski',
      name: 'Polski',
      nativeName: 'Polski',
      code: 'PL',
      icon: 'globe',
      description: 'Польська мова для навчання в університетах, відмінки та стиль.'
    },
    {
      id: 'ukrainian',
      name: 'Українська',
      nativeName: 'Українська',
      code: 'UA',
      icon: 'bookOpen',
      description: 'Нормативна українська мова: орфоепія, синтаксис і діловий стиль.'
    }
  ];

  var CEFR_LEVELS = [
    { id: 'A1', label: 'A1', name: 'A1 Початковий', title: 'Breakthrough', description: 'Базові конструкції, теперішній час, орієнтація у побуті.' },
    { id: 'A2', label: 'A2', name: 'A2 Базовий', title: 'Waystage', description: 'Минулий і майбутній час, порівняння, модальні дієслова.' },
    { id: 'B1', label: 'B1', name: 'B1 Середній', title: 'Threshold', description: 'Умовні речення, пасивний стан, непряма мова, аргументація.' },
    { id: 'B2', label: 'B2', name: 'B2 Вище середнього', title: 'Vantage', description: 'Складні часові узгодження, ідіоматика, академічні есе.' },
    { id: 'C1', label: 'C1', name: 'C1 Просунутий', title: 'Effective Proficiency', description: 'Стилістичний регістр, інверсія, номіналізація, дебати.' },
    { id: 'C2', label: 'C2', name: 'C2 Вільне володіння', title: 'Mastery', description: 'Риторика, прагматична іронія, тонка синтаксична семантика.' }
  ];

  var ROLEPLAY_SCENARIOS = [
    {
      id: 'it-interview',
      title: 'Співбесіда в ІТ',
      subtitle: 'Технічне та поведінкове інтерв\'ю з Lead-інженером',
      icon: 'cpu',
      roleName: 'Engineering Lead',
      context: 'Кандидат проходить перевірку системного мислення, досвіду з багами та англомовної/іноземної аргументації.',
      openingPrompts: {
        english: 'Good afternoon. Before we open the architecture task, tell me about the hardest production bug you diagnosed and how you isolated the root cause.',
        deutsch: 'Guten Tag. Bevor wir die Architekturaufgabe öffnen: Erzählen Sie mir vom schwierigsten Bug, den Sie analysiert haben, und wie Sie die Ursache eingegrenzt haben.',
        espanol: 'Buenas tardes. Antes de pasar al reto técnico, cuéntame cuál ha sido el fallo más complejo que has depurado y cómo aislaste la causa raíz.',
        polski: 'Dzień dobry. Zanim przejdziemy do zadania architektonicznego, opowiedz o najtrudniejszym błędzie, który analizowałeś, i jak znalazłeś jego źródło.',
        ukrainian: 'Вітаю на технічній співбесіді. Перш ніж ми перейдемо до системної задачі, розкажіть про найскладніший інцидент у коді та як ви знайшли першопричину.'
      },
      coachingHints: {
        english: 'Підказка: використайте структуру STAR (Situation, Task, Action, Result) і дієслова у Past Simple (isolated, reproduced, deployed).',
        deutsch: 'Підказка: тримайте дієслово у Präteritum або Perfekt на другій позиції та вживайте технічні зв\'язки (zunächst, anschließend, dadurch).',
        espanol: 'Підказка: поєднайте Pretérito Indefinido для завершених дій із Pretérito Imperfecto для опису контексту системи.',
        polski: 'Підказка: уживайте доконаний вид дієслів для результату (wykryłem, naprawiłem) та орудний відмінок для інструментів.',
        ukrainian: 'Підказка: уникайте кальок на кшталт «приймати участь» — кажіть «брати участь», «локалізувати збій», «усунути першопричину».'
      }
    },
    {
      id: 'airport',
      title: 'Аеропорт і митниця',
      subtitle: 'Паспортний контроль, пересадка та нестандартна перевірка багажу',
      icon: 'radar',
      roleName: 'Border Control Officer',
      context: 'Ситуація на прикордонному контролі з додатковими уточненнями щодо маршруту, бронювання та митної декларації.',
      openingPrompts: {
        english: 'Passport and boarding pass, please. What is the purpose of your visit, how long are you staying, and do you have anything to declare?',
        deutsch: 'Reisepass und Bordkarte, bitte. Was ist der Zweck Ihrer Reise, wie lange bleiben Sie und haben Sie etwas anzumelden?',
        espanol: 'Pasaporte y tarjeta de embarque, por favor. ¿Cuál es el motivo de su viaje, cuánto tiempo se queda y tiene algo que declarar?',
        polski: 'Paszport i kartę pokładową proszę. Jaki jest cel pana lub pani podróży, jak długo pan/pani zostaje i czy ma pan/pani coś do zgłoszenia?',
        ukrainian: 'Ваш паспорт і посадковий талон, будь ласка. Яка мета вашої поїздки, на який термін ви прибули та чи маєте товари для декларування?'
      },
      coachingHints: {
        english: 'Підказка: відповідайте чітко й лаконічно, вживайте "I am attending a conference", "I am staying for five days", "Nothing to declare".',
        deutsch: 'Підказка: зверніть увагу на прийменники тривалості "für fünf Tage" та інфінітивну конструкцію "um ... zu".',
        espanol: 'Підказка: для планів поїздки вживайте конструкцію "Voy a quedarme..." або "Vengo por motivos académicos".',
        polski: 'Підказка: після прийменника "na" для терміну перебування вживається знахідний відмінок (na pięć dni).',
        ukrainian: 'Підказка: уживайте правильну форму часу та родового відмінка: «на п\'ять діб», «з метою навчання», «не підлягає декларуванню».'
      }
    },
    {
      id: 'seminar',
      title: 'Університетський семінар',
      subtitle: 'Захист тези перед науковим керівником і групою',
      icon: 'graduationCap',
      roleName: 'Seminar Professor',
      context: 'Академічна дискусія, де потрібно обґрунтувати методологію дослідження та відповісти на критичне зауваження.',
      openingPrompts: {
        english: 'Your abstract makes a bold claim about causality, yet your sample only covers two semesters. How do you defend the validity of your conclusion?',
        deutsch: 'Ihr Abstract stellt eine starke These zur Kausalität auf, obwohl die Stichprobe nur zwei Semester umfasst. Wie begründen Sie die Validität?',
        espanol: 'Tu resumen plantea una relación causal ambiciosa, pero la muestra solo abarca dos semestres. ¿Cómo defiendes la validez de tu conclusión?',
        polski: 'Twój abstrakt stawia odważną tezę o przyczynowości, mimo że próba obejmuje tylko dwa semestry. Jak obronisz trafność tego wniosku?',
        ukrainian: 'У вашій анотації заявлено жорсткий причинно-наслідковий зв\'язок, хоча вибірка охоплює лише два семестри. Як ви обґрунтуєте валідність висновку?'
      },
      coachingHints: {
        english: 'Підказка: використовуйте академічні маркери поступки ("While the sample is bounded...", "Nevertheless, the control variables indicate...").',
        deutsch: 'Підказка: застосуйте "Obwohl..." (дієслово в кінці підрядного речення) та обережну модальність ("lässt sich schließen").',
        espanol: 'Підказка: після "Aunque..." для доконаного факту ставте Indicativo, а для гіпотези — Subjuntivo.',
        polski: 'Підказка: в академічному мовленні вживайте звороти "Mimo ograniczonej próby...", "Warto jednak zauważyć, że...".',
        ukrainian: 'Підказка: розмежовуйте кореляцію та каузальність і вживайте нормативні конструкції: «попри обмеженість вибірки», «дані свідчать про».'
      }
    },
    {
      id: 'medical',
      title: 'Медична консультація',
      subtitle: 'Прийом у лікаря: точний опис симптомів, алергій і дозування',
      icon: 'activity',
      roleName: 'Attending Physician',
      context: 'Консультація в клініці, де критично важливо точно назвати тривалість симптомів, інтенсивність та протипоказання.',
      openingPrompts: {
        english: 'Please take a seat. When did these symptoms first start, what makes them worse, and are you currently taking any regular medication?',
        deutsch: 'Bitte nehmen Sie Platz. Wann haben diese Beschwerden begonnen, wodurch verschlimmern sie sich und nehmen Sie regelmäßig Medikamente ein?',
        espanol: 'Tome asiento, por favor. ¿Cuándo empezaron estos síntomas, qué los empeora y toma actualmente algún medicamento de forma habitual?',
        polski: 'Proszę usiąść. Kiedy dokładnie pojawiły się te objawy, co je nasila i czy przyjmuje pan/pani na stałe jakieś leki?',
        ukrainian: 'Присідайте, будь ласка. Коли саме з\'явилися перші симптоми, що їх посилює і чи приймаєте ви постійно якісь препарати?'
      },
      coachingHints: {
        english: 'Підказка: для тривалості, що почалася в минулому і триває досі, вживайте Present Perfect Continuous ("I have been experiencing... since Monday").',
        deutsch: 'Підказка: для тривалості до теперішнього моменту вживайте Präsens + "seit" ("Ich habe seit drei Tagen Kopfschmerzen").',
        espanol: 'Підказка: використовуйте конструкцію "Llevo + [час] + gerundio" або "Me duele..." для точної локалізації болю.',
        polski: 'Підказка: поєднуйте прийменник "od" з родовим відмінком ("Od trzech dni mam gorączkę") і точно вказуйте алергії ("Jestem uczulony na...").',
        ukrainian: 'Підказка: правильно формулюйте тривалість («триває третю добу», «температура підвищується ввечері», «алергії не зафіксовано»).'
      }
    }
  ];

  /* ------------------------------------------------------------------------
     2. Language Topics by Language & CEFR Level (Strict Level Isolation)
     ------------------------------------------------------------------------ */

  var LANGUAGE_TOPICS = {
    english: {
      A1: [
        { id: 'en-a1-1', title: 'Present Simple та дієслово to be', summary: 'Побудова стверджень, заперечень і запитань у базовому теперішньому часі.', keyFormula: 'S + V(s/es) | Do/Does + S + V?' },
        { id: 'en-a1-2', title: 'Артиклі a / an / the у побуті', summary: 'Коли предмет називається вперше, а коли є конкретним для співрозмовника.', keyFormula: 'a + consonant sound | an + vowel sound | the + specific' },
        { id: 'en-a1-3', title: 'Злічувані та незлічувані іменники', summary: 'Вживання many/much, some/any та конструкції There is / There are.', keyFormula: 'There is + singular/uncountable | There are + plural' }
      ],
      A2: [
        { id: 'en-a2-1', title: 'Past Simple: правильні та неправильні дієслова', summary: 'Опис завершених подій у минулому з точними маркерами часу.', keyFormula: 'S + V2 / Ved | Did + S + V1?' },
        { id: 'en-a2-2', title: 'Ступені порівняння прикметників', summary: 'Утворення вищого й найвищого ступенів та винятки good/bad/far.', keyFormula: 'short + -er / the -est | more + long / the most + long' },
        { id: 'en-a2-3', title: 'Модальні дієслова must / have to / should', summary: 'Різниця між внутрішнім обов\'язком, зовнішнім правилом та порадою.', keyFormula: 'must + V1 | have to + V1 | should + V1' }
      ],
      B1: [
        { id: 'en-b1-1', title: 'Present Perfect vs Past Simple', summary: 'Розмежування життєвого досвіду та результату зараз із конкретним минулим моментом.', keyFormula: 'have/has + V3 (result) vs V2 + yesterday/in 2022' },
        { id: 'en-b1-2', title: 'First & Second Conditionals', summary: 'Реальні майбутні умови та уявні теперішні ситуації без "will" після "if".', keyFormula: 'If + V1, will + V1 | If + V2/were, would + V1' },
        { id: 'en-b1-3', title: 'Passive Voice у базових часах', summary: 'Фокус на об\'єкті дії у технічних описах та новинах.', keyFormula: 'S + be (tense) + V3 (+ by agent)' }
      ],
      B2: [
        { id: 'en-b2-1', title: 'Mixed Conditionals & Third Conditional', summary: 'Аналіз нереальних наслідків минулих рішень у минулому та теперішньому.', keyFormula: 'If + had + V3, would + V1 (now) / would have + V3 (then)' },
        { id: 'en-b2-2', title: 'Reported Speech та узгодження часів', summary: 'Трансформація тверджень, запитань і модальних дієслів у непрямій мові.', keyFormula: 'said (that) + backshift | asked if/wh- + direct order' },
        { id: 'en-b2-3', title: 'Participle Clauses для академічного письма', summary: 'Скорочення підрядних речень через V-ing та V3 без втрати логіки підмета.', keyFormula: 'Having + V3, S + V... | Driven by data, S + V...' }
      ],
      C1: [
        { id: 'en-c1-1', title: 'Negative Inversion та емфатичні конструкції', summary: 'Винесення заперечних і обмежувальних прислівників на початок речення.', keyFormula: 'Not only + aux + S + V | Seldom + aux + S + V' },
        { id: 'en-c1-2', title: 'Cleft Sentences & Fronting', summary: 'Інформаційний фокус через конструкції It is ... that та What ... is.', keyFormula: 'It was X that triggered Y | What matters is + N/clause' },
        { id: 'en-c1-3', title: 'Nuanced Modality & Hedging', summary: 'Академічна обережність тверджень (might well, arguably, tends to).', keyFormula: 'appears to + V | could conceivably + V' }
      ],
      C2: [
        { id: 'en-c2-1', title: 'Прагматична іронія та стилістичний регістр', summary: 'Керування імпліцитним тоном, літотами та формальними еліпсисами.', keyFormula: 'Were it not for X, Y would + V | Subjunctive bare V' },
        { id: 'en-c2-2', title: 'Синтаксична компресія та номіналізація', summary: 'Перетворення розгорнутих предикацій у точні номінативні групи.', keyFormula: 'Verb clause -> Deverbal Noun + Prepositional Complement' },
        { id: 'en-c2-3', title: 'Риторичний паралелізм і дискурсивні маркери', summary: 'Когезія складного аргументу без надлишкових сполучників.', keyFormula: 'Notwithstanding X, ... | Insofar as X holds, ...' }
      ]
    },
    deutsch: {
      A1: [
        { id: 'de-a1-1', title: 'Порядок слів V2 та Präsens', summary: 'Дієслово завжди на другій позиції у розповідному реченні.', keyFormula: 'Position 1 + Verb (konjugiert) + Subjekt/Objekt' },
        { id: 'de-a1-2', title: 'Артиклі der / die / das та Akkusativ', summary: 'Родова належність іменників і зміна чоловічого роду в знахідному відмінку.', keyFormula: 'der -> den, ein -> einen (Akkusativ maskulin)' },
        { id: 'de-a1-3', title: 'Заперечення nicht та kein', summary: 'Коли заперечуємо іменник без означеного артикля, а коли — дію чи ознаку.', keyFormula: 'kein + Nomen (ohne Art.) | nicht + Verb/Adjektiv' }
      ],
      A2: [
        { id: 'de-a2-1', title: 'Perfekt із haben та sein', summary: 'Утворення розмовного минулого часу та дієслова руху/зміни стану.', keyFormula: 'haben/sein (Pos. 2) + ... + Partizip II (Ende)' },
        { id: 'de-a2-2', title: 'Прийменники з Dativ і Wechselpräpositionen', summary: 'Питання Wo? (Dativ) проти Wohin? (Akkusativ) для простору.', keyFormula: 'Wo? -> Dativ | Wohin? -> Akkusativ' },
        { id: 'de-a2-3', title: 'Сполучники weil, dass, wenn (Nebensatz)', summary: 'Віднесення відмінюваного дієслова в кінець підрядного речення.', keyFormula: 'Hauptsatz, weil + Subjekt + ... + Verb (Ende)' }
      ],
      B1: [
        { id: 'de-b1-1', title: 'Präteritum та Plusquamperfekt у наративі', summary: 'Послідовність дій у минулому та часові підрядні з nachdem.', keyFormula: 'Nachdem + Plusquamperfekt, + Präteritum' },
        { id: 'de-b1-2', title: 'Passiv (Vorgangspassiv) з werden', summary: 'Опис процесів без акценту на виконавцеві та прийменник von/durch.', keyFormula: 'werden (konjugiert) + ... + Partizip II' },
        { id: 'de-b1-3', title: 'Konjunktiv II для ввічливості та нереальних умов', summary: 'Конструкції würde + Infinitiv, hätte, wäre, könnte.', keyFormula: 'Wenn ich Zeit hätte, würde ich + Infinitiv' }
      ],
      B2: [
        { id: 'de-b2-1', title: 'Парні сполучники (Zweiteilige Konnektoren)', summary: 'Структурування аргументів: sowohl... als auch, weder... noch, je... desto.', keyFormula: 'Je + Komparativ + ... + Verb, desto + Komparativ + Verb' },
        { id: 'de-b2-2', title: 'Суб\'єктивна модальність дієслів', summary: 'Ступінь імовірності через müssen,dürften, können, sollen + Infinitiv II.', keyFormula: 'Er dürfte das übersehen haben (імовірно, пропустив)' },
        { id: 'de-b2-3', title: 'Розширені означення (Erweiterte Partizipialattribute)', summary: 'Трансформація відносних підрядних речень у стислі прикметникові блоки.', keyFormula: 'der [gestern getestete] Algorithmus' }
      ],
      C1: [
        { id: 'de-c1-1', title: 'Nominalstil vs Verbalstil', summary: 'Академічне перефразування підрядних речень у іменникові групи з Genitiv.', keyFormula: 'obwohl -> trotz + Genitiv | weil -> aufgrund + Genitiv' },
        { id: 'de-c1-2', title: 'Funktionsverbgefüge в науковому тексті', summary: 'Стійкі сполуки на кшталт in Betracht ziehen, zur Verfügung stellen.', keyFormula: 'Präpositionalphrase + Funktionsverb' },
        { id: 'de-c1-3', title: 'Konjunktiv I у непрямій мові преси', summary: 'Дистанціювання автора від цитованого твердження.', keyFormula: 'Man behauptet, das System sei stabil (Konjunktiv I)' }
      ],
      C2: [
        { id: 'de-c2-1', title: 'Modalpartikeln (doch, ja, eben, wohl)', summary: 'Тонке керування емоційним та епістемічним підтекстом репліки.', keyFormula: 'Mittelfeld position of modal particles' },
        { id: 'de-c2-2', title: 'Складнопідрядні періоди та інверсія тексту', summary: 'Ритміка німецького академічного абзацу та рамкова конструкція.', keyFormula: 'Vorfeld -> linke Satzklammer -> Mittelfeld -> rechte Satzklammer' },
        { id: 'de-c2-3', title: 'Ідіоматична прецизійність та регістр', summary: 'Відбір лексики між офіційним, науковим та публіцистичним стилями.', keyFormula: 'Register-coherent collocations' }
      ]
    },
    espanol: {
      A1: [
        { id: 'es-a1-1', title: 'Різниця між Ser та Estar', summary: 'Постійна ознака/ідентичність (ser) проти стану/розташування (estar).', keyFormula: 'Ser (identidad/origen) vs Estar (ubicación/estado)' },
        { id: 'es-a1-2', title: 'Presente de Indicativo та дієслово Gustar', summary: 'Відмінювання -ar, -er, -ir та непрямий додаток у конструкції подобання.', keyFormula: 'A mí me gusta + singular/inf. | me gustan + plural' },
        { id: 'es-a1-3', title: 'Артиклі el/la/los/las та узгодження роду', summary: 'Базове узгодження іменника та прикметника в роді й числі.', keyFormula: 'el problema (m.) | la mano (f.)' }
      ],
      A2: [
        { id: 'es-a2-1', title: 'Pretérito Indefinido vs Pretérito Perfecto', summary: 'Завершений ізольований факт (ayer) проти досвіду без закритого часового вікна (hoy).', keyFormula: 'hoy/esta semana -> he + participio | ayer -> Indefinido' },
        { id: 'es-a2-2', title: 'Por vs Para у базових контекстах', summary: 'Причина й шлях (por) проти мети, адресата й дедлайну (para).', keyFormula: 'por = causa/medio | para = finalidad/destinatario' },
        { id: 'es-a2-3', title: 'Дієслова зі зміною кореня (e->ie, o->ue) та займенники', summary: 'Прямі й непрямі займенники lo/la/le перед відмінюваним дієсловом.', keyFormula: 'Me lo dices | Se lo envío' }
      ],
      B1: [
        { id: 'es-b1-1', title: 'Indefinido vs Imperfecto в оповіді', summary: 'Фонові обставини й звички (Imperfecto) проти поворотних подій (Indefinido).', keyFormula: 'Mientras leía (Imp.), sonó el teléfono (Indef.)' },
        { id: 'es-b1-2', title: 'Presente de Subjuntivo: базові тригери', summary: 'Вираження волі, сумніву, емоції та мети після que.', keyFormula: 'Quiero que + Subjuntivo | No creo que + Subjuntivo' },
        { id: 'es-b1-3', title: 'Imperativo afirmativo y negativo', summary: 'Спонукальні форми на tú/usted та перехід заперечного наказу у Subjuntivo.', keyFormula: '¡Hazlo! vs ¡No lo hagas!' }
      ],
      B2: [
        { id: 'es-b2-1', title: 'Imperfecto de Subjuntivo та умовні речення II типу', summary: 'Малоймовірні та уявні умови теперішнього й майбутнього.', keyFormula: 'Si + Imperfecto de Subjuntivo, + Condicional Simple' },
        { id: 'es-b2-2', title: 'Перифрази дієслів (Perífrasis verbales)', summary: 'Відтінки тривалості, початку й результату: llevar + gerundio, dejar de, acabar de.', keyFormula: 'Llevo dos años estudiando | Acabo de llegar' },
        { id: 'es-b2-3', title: 'Пасивний стан із se (Pasiva refleja) та ser', summary: 'Уникнення зайвого підмета в інструкціях та аналітиці.', keyFormula: 'Se analizan los datos | Los datos fueron publicados' }
      ],
      C1: [
        { id: 'es-c1-1', title: 'Pluscuamperfecto de Subjuntivo та III тип умови', summary: 'Нереалізовані сценарії минулого та змішані наслідки.', keyFormula: 'Si hubiera + participio, habría + participio / sería...' },
        { id: 'es-c1-2', title: 'Дискурсивні конектори аргументації', summary: 'Використання no obstante, sin embargo, puesto que, a pesar de que (+ Indicativo/Subjuntivo).', keyFormula: 'A pesar de que + Ind. (hecho) vs Subj. (hipótesis)' },
        { id: 'es-c1-3', title: 'Займенникові дієслова зі зміною значення', summary: 'Семантичний контраст: acordar / acordarse, quedar / quedarse, parecer / parecerse.', keyFormula: 'Quedamos a las cinco vs Me quedo en casa' }
      ],
      C2: [
        { id: 'es-c2-1', title: 'Стилістичний вибір режимів у складних підрядних', summary: 'Тонке керування пресупозицією через Indicativo/Subjuntivo у відносних реченнях.', keyFormula: 'Busco un libro que explica (conocido) vs que explique (cualquiera)' },
        { id: 'es-c2-2', title: 'Діалектні та прагматичні нюанси Іспанії й Латинської Америки', summary: 'Voseo, leísmo нормативне та регіональні лексичні дублети.', keyFormula: 'Register-calibrated lexical selection' },
        { id: 'es-c2-3', title: 'Літературний синтаксис та риторична економія', summary: 'Абсолютні дієприкметникові звороти та емфатичні конструкції з lo que.', keyFormula: 'Terminada la sesión, ... | Lo difícil es...' }
      ]
    },
    polski: {
      A1: [
        { id: 'pl-a1-1', title: 'Дієслова być, mieć та відмінювання на -ę/-esz, -m/-sz', summary: 'Знайомство, професія та базові дії в теперішньому часі.', keyFormula: 'Jestem + Narzędnik (kim? czym?): Jestem studentem' },
        { id: 'pl-a1-2', title: 'Орудний відмінок (Narzędnik) та знахідний (Biernik)', summary: 'Назви професій, національностей та прямий об\'єкт дії.', keyFormula: 'Czytam ciekawą książkę (Biernik)' },
        { id: 'pl-a1-3', title: 'Числівники, час та базові питання в місті', summary: 'Узгодження годин і покупок з іменниками.', keyFormula: 'O której godzinie? O piątej' }
      ],
      A2: [
        { id: 'pl-a2-1', title: 'Минулий час (Czas przeszły) з урахуванням роду', summary: 'Різниця закінчень чоловічого/жіночого/середнього родів та особово-чоловічої форми.', keyFormula: '-łem/-łam (ja), -liśmy/-łyśmy (my)' },
        { id: 'pl-a2-2', title: 'Родовий відмінок (Dopełniacz) після заперечення', summary: 'Обов\'язковий перехід прямого додатка в родовий відмінок при "nie".', keyFormula: 'Mam czas (B.) -> Nie mam czasu (D.)' },
        { id: 'pl-a2-3', title: 'Місцевий відмінок (Miejscownik) у просторі', summary: 'Прийменники w, na, o, przy та чергування приголосних.', keyFormula: 'w Polsce, na uniwersytecie, w Krakowie' }
      ],
      B1: [
        { id: 'pl-b1-1', title: 'Вид дієслова (Aspekt dokonany i niedokonany)', summary: 'Процес і повторюваність проти завершеного результату в минулому та майбутньому.', keyFormula: 'pisać (nd.) -> napisać (dk.)' },
        { id: 'pl-b1-2', title: 'Майбутній час складений і простий', summary: 'Конструкція będę + інфінітив/дієприкметник проти доконаного майбутнього.', keyFormula: 'Będę pracować / pracował vs Zrobię to jutro' },
        { id: 'pl-b1-3', title: 'Умовний спосіб (Tryb przypuszczający)', summary: 'Частка -by- та її рухомість при сполучниках щоб (żeby, aby).', keyFormula: 'Chciałbym, żebyś przyszedł' }
      ],
      B2: [
        { id: 'pl-b2-1', title: 'Чоловічо-особова (męskoosobowy) та нечоловічо-особова форми', summary: 'Складне узгодження підмета, прикметника та дієслова у множині.', keyFormula: 'Ci dobrzy studenci przyszli vs Te nowe dane pokazały' },
        { id: 'pl-b2-2', title: 'Безособові конструкції на -no / -to та się', summary: 'Публіцистичний та академічний стиль без називання виконавця.', keyFormula: 'Stwierdzono, że... | Analizuje się wyniki' },
        { id: 'pl-b2-3', title: 'Дієприкметникові та дієприслівникові звороти', summary: 'Одночасність (-ąc) і передування (-łszy/-wszy) у складних реченнях.', keyFormula: 'Przeczytawszy raport, podjął decyzję' }
      ],
      C1: [
        { id: 'pl-c1-1', title: 'Книжні сполучники та академічна аргументація', summary: 'Використання aczkolwiek, mimo iż, zważywszy na, o ile.', keyFormula: 'Zważywszy na powyższe, należy uznać...' },
        { id: 'pl-c1-2', title: 'Керування дієслів і типові українсько-польські пастки', summary: 'Подолання інтерференції (наприклад, szukać + D., używać + D., uczyć się + D.).', keyFormula: 'szukać pracy (D.) | uczyć się języka (D.)' },
        { id: 'pl-c1-3', title: 'Стилістична номіналізація на -nie / -cie', summary: 'Перетворення дієслівних конструкцій у точні термінологічні звороти.', keyFormula: 'wdrożenie systemu mimo opóźnień' }
      ],
      C2: [
        { id: 'pl-c2-1', title: 'Фразеологія, алюзії та регістрова точність', summary: 'Офіційно-діловий, науковий і живий есеїстичний стиль без русизмів та кальок.', keyFormula: 'Precision collocations & pragmatic register' },
        { id: 'pl-c2-2', title: 'Тонкощі пунктуації та порядку слів у періодах', summary: 'Інверсія для тема-рематичного членування висловлення.', keyFormula: 'Temat (znane) -> Remat (nowe, koniec zdania)' },
        { id: 'pl-c2-3', title: 'Риторична критика та переконлива полеміка', summary: 'Поступка, спростування пресупозиції та етичне формулювання незгоди.', keyFormula: 'Trudno nie zgodzić się z tezą, jednak...' }
      ]
    },
    ukrainian: {
      A1: [
        { id: 'ua-a1-1', title: 'Милозвучність: у/в та і/й у базових фразах', summary: 'Чергування прийменників і сполучників між голосними та приголосними.', keyFormula: 'Голосний + В/Й + Голосний | Приголосний + У/І + Приголосний' },
        { id: 'ua-a1-2', title: 'Кличний відмінок у звертаннях', summary: 'Правильні закінчення імен та посад при звертанні.', keyFormula: 'Друже, Олено, пане директоре, колего' },
        { id: 'ua-a1-3', title: 'Базові форми дієслів теперішнього й минулого часу', summary: 'Уникнення суржику в повсякденних діалогах.', keyFormula: 'Читаю, розумію, можу, хотів / хотіла' }
      ],
      A2: [
        { id: 'ua-a2-1', title: 'Правильне узгодження числівників з іменниками', summary: 'Форми після два/три/чотири та п\'ять і більше, а також позначення часу.', keyFormula: '2-4 (Н.в. мн.: три задачі) | 5+ (Р.в. мн.: п\'ять задач)' },
        { id: 'ua-a2-2', title: 'Правопис не з різними частинами мови', summary: 'Базові випадки злитого та окремого написання з іменниками, прикметниками, дієсловами.', keyFormula: 'не + дієслово (окремо, крім неволити/нехтувати)' },
        { id: 'ua-a2-3', title: 'Типові лексичні заміни (не «самий кращий»)', summary: 'Вищий та найвищий ступінь порівняння прикметників без кальок.', keyFormula: 'найкращий, більш точний, менш складний' }
      ],
      B1: [
        { id: 'ua-b1-1', title: 'Дієприкметникові та дієприслівникові звороти', summary: 'Уникнення активних дієприкметників на -учий/-ючий та пунктуація зворотів.', keyFormula: 'Замість «працюючий код» -> «код, що працює» / «робочий код»' },
        { id: 'ua-b1-2', title: 'Керування прийменників по / щодо / через', summary: 'Нормативні конструкції замість канцелярського «по питанню» або «по хворобі».', keyFormula: 'щодо проєкту, через хворобу, за графіком, з математики' },
        { id: 'ua-b1-3', title: 'Складнопідрядні речення та сполучникові зв\'язки', summary: 'Побудова чіткої аргументації зі сполучниками оскільки, попри те що, якщо.', keyFormula: 'Оскільки [причина], то [наслідок]' }
      ],
      B2: [
        { id: 'ua-b2-1', title: 'Орфоепія та нормативні наголоси', summary: 'Складні випадки: випадок, мережа, завдання, бюлетень, перепис.', keyFormula: 'вИпадок, мерЕжа, завдАння, пЕрепис' },
        { id: 'ua-b2-2', title: 'Лексична сполучуваність і пароніми', summary: 'Розрізнення ефективний/ефектний, чисельний/численний, тактовний/тактичний.', keyFormula: 'Ефективний метод vs ефектний виступ' },
        { id: 'ua-b2-3', title: 'Ділове листування та точність термінів', summary: 'Заміна пасивних канцеляризмів активними дієсловами.', keyFormula: 'Замість «рішення було прийнято» -> «команда ухвалила рішення»' }
      ],
      C1: [
        { id: 'ua-c1-1', title: 'Складні випадки Правопису-2019', summary: 'Проєкт, фемінітиви, написання слів з пів, іншомовні компоненти.', keyFormula: 'пів години, пів Києва, проєкт, аудієнція' },
        { id: 'ua-c1-2', title: 'Синтаксична синонімія та пунктуація в безсполучникових реченнях', summary: 'Вибір двокрапки, тире або крапки з комою залежно від логіки змісту.', keyFormula: 'Причина/пояснення -> (:) | Наслідок/протиставлення -> (—)' },
        { id: 'ua-c1-3', title: 'Безособові форми на -но, -то без зайвого агента', summary: 'Правильне використання в аналітичних звітах без додатка у формі «ким».', keyFormula: '«Проєкт затверджено» (без «комісією»)' }
      ],
      C2: [
        { id: 'ua-c2-1', title: 'Риторика, іронія та публіцистичний стиль', summary: 'Тонке інтонування тексту через порядок слів і парцеляцію.', keyFormula: 'Актуальне членування: відоме -> нове' },
        { id: 'ua-c2-2', title: 'Етимологія, архаїзми та стилістична диференціація', summary: 'Точне розмежування книжних, розмовних та нейтральних синонімічних рядів.', keyFormula: 'Register-precise synonymy' },
        { id: 'ua-c2-3', title: 'Редагування складних академічних та юридичних текстів', summary: 'Усунення двозначностей, прихованих тавтологій і синтаксичної громіздкості.', keyFormula: 'Zero ambiguity & zero pleonasm' }
      ]
    }
  };

  /* ------------------------------------------------------------------------
     3. School & NMT Grade Bands, Subjects, and Strict Topic Isolation
     ------------------------------------------------------------------------ */

  var GRADE_BANDS = [
    { id: 'grade-5-7', label: '5-7 класи', name: '5-7 класи', shortLabel: '5-7 кл.', description: 'Фундаментальні поняття, обчислення, логіка без старших формул.' },
    { id: 'grade-8-9', label: '8-9 класи', name: '8-9 класи', shortLabel: '8-9 кл.', description: 'Системна алгебра, геометрія, закони фізики та генетики, ДПА.' },
    { id: 'nmt-200', label: 'НМТ 200', name: 'НМТ 200', shortLabel: 'НМТ 200', description: 'Повна програма УЦОЯО на 200 балів, пастки та ліміт часу.' },
    { id: 'olympiad', label: 'Олімпіада', name: 'Олімпіада', shortLabel: 'Олімпіада', description: 'Нестандартні задачі, інваріанти, теорія чисел і глибокий аналіз.' }
  ];

  var SUBJECTS = [
    { id: 'math', name: 'Математика', title: 'Математика', shortName: 'Матем.', icon: 'sliders', description: 'Алгебра, геометрія, функції, параметри та логічні доведення.' },
    { id: 'ukrainian', name: 'Українська мова', title: 'Українська мова', shortName: 'Укр. мова', icon: 'bookOpen', description: 'Орфоепія, орфографія, синтаксис, пунктуація та лексика.' },
    { id: 'history', name: 'Історія України', title: 'Історія України', shortName: 'Історія', icon: 'layers', description: 'Хронологія, персоналії, документи, пам\'ятки та причинно-наслідкові зв\'язки.' },
    { id: 'bio-phys', name: 'Біологія та Фізика', title: 'Біологія та Фізика', shortName: 'Біо / Фіз', icon: 'cpu', description: 'Клітинна біологія, генетика, механіка, електрика та термодинаміка.' }
  ];

  var EXAM_SUBJECTS = SUBJECTS.concat([
    { id: 'english', name: 'Англійська (НМТ)', title: 'Англійська (НМТ)', shortName: 'Англ. НМТ', icon: 'globe', description: 'Use of English, граматичні трансформації та критичне читання.' }
  ]);

  /* Strictly isolated topic tables per subjectId and gradeBand */
  var SCHOOL_TOPICS = {
    math: {
      'grade-5-7': [
        { id: 'm57-frac', title: 'Звичайні та десяткові дроби', summary: 'Зведення до спільного знаменника, додавання, множення, ділення та перетворення дробів.', keyFormula: 'a/b + c/d = (ad + bc) / (bd)' },
        { id: 'm57-pct', title: 'Відсотки та пропорції', summary: 'Знаходження відсотка від числа, числа за його відсотком, основна властивість пропорції.', keyFormula: 'a / b = c / d  =>  a * d = b * c' },
        { id: 'm57-lin', title: 'Прості лінійні рівняння', summary: 'Розкриття дужок, перенесення доданків зі зміною знака та розв\'язування текстових задач.', keyFormula: 'ax + b = c  =>  x = (c - b) / a (a != 0)' }
      ],
      'grade-8-9': [
        { id: 'm89-quad', title: 'Квадратні рівняння та теорема Вієта', summary: 'Дискримінант, дослідження кількості коренів і швидкий підбір через Вієта.', keyFormula: 'D = b^2 - 4ac | x1 + x2 = -b/a, x1 * x2 = c/a' },
        { id: 'm89-geom', title: 'Теореми Піфагора та Фалеса', summary: 'Прямокутні трикутники, медіана до гіпотенузи, подібність і пропорційні відрізки.', keyFormula: 'a^2 + b^2 = c^2 | m_c = c / 2' },
        { id: 'm89-ineq', title: 'Лінійні та квадратні нерівності', summary: 'Метод інтервалів, параболічна інтерпретація та системи нерівностей.', keyFormula: '(x - x1)(x - x2) <= 0 => x in [x1; x2]' }
      ],
      'nmt-200': [
        { id: 'mnmt-log', title: 'Логарифмічні та показникові рівняння (ОДЗ)', summary: 'Властивості логарифмів, заміна змінної та контроль сторонніх коренів через ОДЗ.', keyFormula: 'log_a(b) + log_a(c) = log_a(bc), b > 0, c > 0' },
        { id: 'mnmt-der', title: 'Похідна, дотична та екстремуми', summary: 'Геометричний зміст похідної, критичні точки, найбільше/найменше значення на відрізку.', keyFormula: 'k = f\'(x0) | f\'(x) = 0' },
        { id: 'mnmt-trig-par', title: 'Тригонометрія та задачі з параметрами', summary: 'Тригонометричні тотожності, графічний метод для параметра на 200 балів НМТ.', keyFormula: 'sin^2(x) + cos^2(x) = 1 | D(a) >= 0' }
      ],
      olympiad: [
        { id: 'moly-num', title: 'Теорія чисел і модульна арифметика', summary: 'Подільність, мала теорема Ферма, порівняння за модулем та діофантові рівняння.', keyFormula: 'a^2 + b^2 == r (mod p)' },
        { id: 'moly-func', title: 'Функціональні рівняння', summary: 'Підстановки Коші, дослідження ін\'єктивності, сюр\'єктивності та симетрій.', keyFormula: 'f(x + y) = f(x) + f(y)' },
        { id: 'moly-inv', title: 'Інваріанти, напівінваріанти та принцип Діріхле', summary: 'Пошук величин, що не змінюються за крок, і доведення неможливості стану.', keyFormula: 'Delta I == 0 (mod m)' }
      ]
    },
    ukrainian: {
      'grade-5-7': [
        { id: 'u57-phon', title: 'Фонетика, апостроф та м\'який знак', summary: 'Чергування звуків, правило «Мавпи Буф» для апострофа та м\'якшення приголосних.', keyFormula: 'б, п, в, м, ф + я, ю, є, ї -> апостроф (крім після іншого приголосного основи)' },
        { id: 'u57-pos', title: 'Іменник, прикметник, числівник', summary: 'Рід, число, відмінки та правопис закінчень без помилок у мовленні.', keyFormula: 'Н.в., Р.в., Д.в., З.в., О.в., М.в., Кл.в.' },
        { id: 'u57-simp', title: 'Просте речення та однорідні члени', summary: 'Виділення граматичної основи, звертання і коми при однорідних членах.', keyFormula: 'Підмет + Присудок | O, O та O' }
      ],
      'grade-8-9': [
        { id: 'u89-zvor', title: 'Дієприкметникові та дієприслівникові звороти', summary: 'Умови відокремлення комами залежно від позиції відносно означуваного слова.', keyFormula: 'Означуване слово, [дієприкм. зворот], ...' },
        { id: 'u89-comp', title: 'Складносурядне та складнопідрядне речення', summary: 'Межі предикативних частин, типи підрядних і пунктуація перед сполучниками.', keyFormula: '[Головне], (що / бо / коли ...)' },
        { id: 'u89-ne', title: 'Правопис НЕ з різними частинами мови', summary: 'Розмежування заперечної частки та префікса при протиставленні чи залежних словах.', keyFormula: 'не + слово, але... (окремо) | не- без протиставлення (разом)' }
      ],
      'nmt-200': [
        { id: 'unmt-stress', title: 'Нормативні наголоси НМТ (повний словник)', summary: 'Складні слова-пастки УЦОЯО: випадок, мережа, перепис, начинка, дрова.', keyFormula: 'вИпадок, мерЕжа, пЕрепис, начИнка, дровА' },
        { id: 'unmt-lex', title: 'Лексичні помилки, пароніми та плеоназми', summary: 'Виявлення прихованої тавтології («перший дебют») та підміни паронімів.', keyFormula: 'ефективний != ефектний | чисельний != численний' },
        { id: 'unmt-multi', title: 'Речення з різними видами зв\'язку та УЦОЯО-пастки', summary: 'Пунктуація на збігу сполучників (і коли, що якщо) та безсполучникові конструкції.', keyFormula: 'Збіг сполучників: кома залежить від наявності «то / так»' }
      ],
      olympiad: [
        { id: 'uoly-etym', title: 'Історична лексикологія та етимологія', summary: 'Давні чергування голосних, повноголосся (-оро-/-оло-) та внутрішня форма слова.', keyFormula: '*or -> -оро- (город) vs старословянське -ра- (град)' },
        { id: 'uoly-hom', title: 'Морфологічна омонімія (прислівник vs прийменник)', summary: 'Розмежування похідних прийменників, прислівників і слів категорії стану.', keyFormula: 'навколо (де? — присл.) vs навколо озера (похідний прийм.)' },
        { id: 'uoly-styl', title: 'Синтаксична синонімія та авторська пунктуація', summary: 'Трансформація конструкцій без зміни комунікативної інтенції тексту.', keyFormula: 'Інверсія + тире як засіб стилістичного акценту' }
      ]
    },
    history: {
      'grade-5-7': [
        { id: 'h57-rus', title: 'Київська Русь: Володимир та Ярослав', summary: 'Запровадження християнства 988 р., розквіт держави, «Руська правда».', keyFormula: '988 р. — Хрещення Русі | 1036 р. — остаточний розгром печенігів' },
        { id: 'h57-gal', title: 'Галицько-Волинська держава', summary: 'Об\'єднання Романом Мстиславовичем 1199 р. та коронація Данила Романовича 1253 р.', keyFormula: '1199 р. — об\'єднання | 1253 р. — коронація в Дорогочині' },
        { id: 'h57-sich', title: 'Виникнення козацтва та перша Січ', summary: 'Дмитро Вишневецький (Байда), Запорозька Січ на Малій Хортиці, козацькі клейноди.', keyFormula: '1556 р. — перша Січ на о. Мала Хортиця' }
      ],
      'grade-8-9': [
        { id: 'h89-khm', title: 'Національно-визвольна війна 1648–1657 рр.', summary: 'Битви під Жовтими Водами, Корсунем, Пилявцями, Зборівський і Білоцерківський договори.', keyFormula: '1649 (40 тис., 3 воєводства) vs 1651 (20 тис., 1 воєводство)' },
        { id: 'h89-ruin', title: 'Руїна та Гетьманщина (Гадяцький договір)', summary: 'Іван Виговський 1658 р., Конотопська битва 1659 р., розкол Гетьманщини.', keyFormula: '1658 р. — Гадяцький договір (Велике Князівство Руське)' },
        { id: 'h89-rev', title: 'Національне відродження XIX століття', summary: '«Руська трійця» («Русалка Дністровая» 1837), Кирило-Мефодіївське братство 1846–1847.', keyFormula: '1837 р. — «Русалка Дністровая» | 1846 р. — Кирило-Мефодіївське братство' }
      ],
      'nmt-200': [
        { id: 'hnmt-1917', title: 'Українська революція 1917–1921 рр. (Універсали УЦР)', summary: 'Чотири Універсали УЦР, ЗУНР 1918 р., Акт Злуки 22 січня 1919 р.', keyFormula: 'III Універсал (11.1917) — УНР у фед. | IV Універсал (01.1918) — незалежність' },
        { id: 'hnmt-soviet', title: 'Тоталітаризм, УПА та Шістдесятники', summary: 'Голодомор 1932–1933, рух опору 1940-х, дисиденти та Українська Гельсінська група.', keyFormula: '1976 р. — УГГ | 1960-ті — Шістдесятники' },
        { id: 'hnmt-indep', title: 'Відновлення незалежності 1991 р. та візуальні пам\'ятки', summary: 'Акт 24 серпня 1991 р., Конституція 1996 р., впізнавання портретів і споруд УЦОЯО.', keyFormula: '24.08.1991 — Акт незалежності | 01.12.1991 — Референдум' }
      ],
      olympiad: [
        { id: 'holy-const', title: 'Конституція Пилипа Орлика 1710 р. у європейському контексті', summary: 'Аналіз поділу гілок влади, обмеження гетьманської влади та історіографічних міфів.', keyFormula: '1710 р. (Бендери) — поділ на законодавчу, виконавчу, судову гілки' },
        { id: 'holy-src', title: 'Критика першоджерел («Руська правда» — Універсали)', summary: 'Верифікація датування, автентичності та політичної термінології документів.', keyFormula: 'Джерело -> Автор -> Мета -> Історичний контекст' },
        { id: 'holy-geo', title: 'Геополітичні договори XVII–XX ст.', summary: 'Порівняльний аналіз Андрусівського перемир\'я, Ризького миру та угод УНР.', keyFormula: '1667 (Андрусове) | 1921 (Рига)' }
      ]
    },
    'bio-phys': {
      'grade-5-7': [
        { id: 'bp57-cell', title: 'Будова клітини та робота з мікроскопом', summary: 'Ядро, цитоплазма, хлоропласти й клітинна стінка рослин vs тварин.', keyFormula: 'Збільшення = Збільшення окуляра * Збільшення об\'єктива' },
        { id: 'bp57-mech', title: 'Рівномірний рух, швидкість і шлях', summary: 'Переведення км/год у м/с та побудова найпростіших графіків руху.', keyFormula: 'v = s / t | 36 км/год = 10 м/с' },
        { id: 'bp57-dens', title: 'Густина речовини та умови плавання тіл', summary: 'Розрахунок маси, об\'єму й густини та порівняння з густиною води.', keyFormula: 'rho = m / V | rho_тіла < rho_рідини => плаває' }
      ],
      'grade-8-9': [
        { id: 'bp89-ohm', title: 'Закон Ома та змішане з\'єднання резисторів', summary: 'Послідовне і паралельне з\'єднання, еквівалентний опір і сила струму.', keyFormula: 'I = U / R | R_пар = (R1 * R2) / (R1 + R2)' },
        { id: 'bp89-gen', title: 'Основи генетики та закони Менделя', summary: 'Домінантні й рецесивні алелі, моногібридне схрещування, решітка Пеннета.', keyFormula: 'Aa x Aa => 1 AA : 2 Aa : 1 aa (3:1 за фенотипом)' },
        { id: 'bp89-opt', title: 'Закони відбивання та заломлення світла', summary: 'Побудова зображень у тонкій лінзі, фокусна відстань і оптична сила.', keyFormula: 'D = 1 / F | 1/F = 1/d + 1/f' }
      ],
      'nmt-200': [
        { id: 'bpnmt-mol', title: 'Молекулярна біологія: ДНК, РНК, генетичний код', summary: 'Реплікація, транскрипція (А-У, Т-А, Г-Ц), старт- і стоп-кодони (УАА, УАГ, УГА).', keyFormula: '5\'-АУГ-...-УАГ-3\' (УАГ = стоп-кодон)' },
        { id: 'bpnmt-dyn', title: 'Динаміка, закони збереження та термодинаміка', summary: 'Другий закон Ньютона, імпульс, енергія, ККД теплового двигуна.', keyFormula: 'F = ma | Q = delta U + A | eta = (T1 - T2) / T1' },
        { id: 'bpnmt-elq', title: 'Електродинаміка та квантова фізика', summary: 'Закон Фарадея, коливальний контур, рівняння Ейнштейна для фотоефекту.', keyFormula: 'h * nu = A_вих + E_k_max' }
      ],
      olympiad: [
        { id: 'bpoly-hw', title: 'Рівновага Гарді-Вайнберга та популяційна динаміка', summary: 'Розрахунок частот алелів (p, q) і гетерозигот (2pq) при доборі.', keyFormula: 'p + q = 1 | p^2 + 2pq + q^2 = 1' },
        { id: 'bpoly-kirc', title: 'Нестандартні електричні кола (Кірхгоф, конденсатори)', summary: 'Симетрія кіл, метод вузлових потенціалів і перерозподіл заряду.', keyFormula: 'Sum I_вх = Sum I_вих | q = C * U' },
        { id: 'bpoly-enz', title: 'Ферментативна кінетика та неінерційні системи відліку', summary: 'Крива Міхаеліса-Ментен та сили інерції у задачах механіки.', keyFormula: 'v = V_max * [S] / (K_m + [S]) | F_ін = -m * a_0' }
      ]
    },
    english: {
      'grade-5-7': [
        { id: 'en57-pres', title: 'Present Simple vs Present Continuous', summary: 'Розпізнавання маркерів регулярності (usually) і моменту мовлення (now).', keyFormula: 'usually -> V1/Vs | right now -> am/is/are + V-ing' },
        { id: 'en57-cnt', title: 'Countable & Uncountable Nouns', summary: 'Базові квантифікатори some/any, much/many, a few/a little.', keyFormula: 'many/few + plural | much/little + uncountable' },
        { id: 'en57-prep', title: 'Прийменники часу й місця (in / on / at)', summary: 'Чіткі пари для годин, днів тижня, місяців і адрес.', keyFormula: 'at 8:00 | on Monday | in May' }
      ],
      'grade-8-9': [
        { id: 'en89-perf', title: 'Present Perfect vs Past Simple', summary: 'Фокус на результаті та досвіді проти точної дати в минулому.', keyFormula: 'already/yet -> have/has V3 | yesterday/2021 -> V2' },
        { id: 'en89-pass', title: 'Passive Voice (Present, Past, Future)', summary: 'Трансформація активних речень у пасивні зі збереженням часу.', keyFormula: 'be (in target tense) + V3' },
        { id: 'en89-cond', title: 'First & Second Conditionals', summary: 'Відсутність will у підрядній частині умови та нереальне теперішнє.', keyFormula: 'If + Present Simple, will + V1' }
      ],
      'nmt-200': [
        { id: 'ennmt-uoe', title: 'Use of English: колокації та прийменники', summary: 'Стійкі пари make/do, capable of, depend on, despite vs although.', keyFormula: 'despite + Noun/V-ing | although + Subject + Verb' },
        { id: 'ennmt-read', title: 'Стратегії Reading Comprehension (пастки НМТ)', summary: 'Виявлення підміни обсягу кванторами (all vs some) та перефразування.', keyFormula: 'Verify claim against exact paragraph scope' },
        { id: 'ennmt-mix', title: 'Mixed Conditionals & Reported Speech', summary: 'Узгодження часів та складні непрямі запитання для тесту НМТ.', keyFormula: 'If + had V3, would V1 (now)' }
      ],
      olympiad: [
        { id: 'enoly-inv', title: 'Повна та часткова інверсія (Not only / Hardly)', summary: 'Точний вибір допоміжного дієслова та корелят hardly...when / no sooner...than.', keyFormula: 'Hardly + had + S + V3 + when + S + V2' },
        { id: 'enoly-cleft', title: 'Cleft Sentences & Subjunctive Mood', summary: 'Високорегістрові структури емфази й умовного способу.', keyFormula: 'It is imperative that + S + (should) + V1' },
        { id: 'enoly-prag', title: 'Академічний дискурс і прагматичний підтекст', summary: 'Розпізнавання пресупозицій, іронії та логічних хиб у текстах C1-C2.', keyFormula: 'Evaluate implied premise before lexical match' }
      ]
    }
  };

  /* ------------------------------------------------------------------------
     4. 9 Tutor Methodologies (PERSONAS)
     ------------------------------------------------------------------------ */

  var PERSONAS = [
    {
      id: 'friend',
      name: 'Дружній наставник',
      shortRole: 'Тепла підтримка й наочні аналогії',
      icon: 'spark',
      styleRule: 'Пояснюй просто, доброзичливо, без тиску, розбивай складне на зрозумілі побутові приклади.',
      buildGreeting: function (ctx) {
        var subjectLabel = resolveContextTitle(ctx);
        return 'Привіт! Я твій дружній наставник. Сьогодні спокійно розберемо «' + subjectLabel + '». Без паніки: зробимо крок за кроком, і все стане прозорим.';
      }
    },
    {
      id: 'strict',
      name: 'Суворий тренер',
      shortRole: 'Жодних поблажок, ОДЗ і точна формалізація',
      icon: 'shield',
      styleRule: 'Вимагай суворої точності, перевіряй ОДЗ, одиниці виміру та граничні випадки. Не давай готової відповіді без обґрунтування.',
      buildGreeting: function (ctx) {
        var subjectLabel = resolveContextTitle(ctx);
        return 'Фокус на дисципліну. Тема: «' + subjectLabel + '». Працюємо без пропусків кроків, перевіряємо кожну умову та ОДЗ. Готуйся до чіткого звіту.';
      }
    },
    {
      id: 'socratic',
      name: 'Сократівський діалог',
      shortRole: 'Навідні запитання замість готових підказок',
      icon: 'radar',
      styleRule: 'Не видавай фінальний результат одразу. Став одне-два точні запитання, щоб учень сам відкрив закономірність.',
      buildGreeting: function (ctx) {
        var subjectLabel = resolveContextTitle(ctx);
        return 'Вітаю у сократівській сесії з теми «' + subjectLabel + '». Я не дам готової відповіді одразу — натомість поставлю запитання, яке виведе тебе на ідею.';
      }
    },
    {
      id: 'examiner',
      name: 'Екзаменатор УЦОЯО',
      shortRole: 'Пастки НМТ, таймінг і критерії балів',
      icon: 'target',
      styleRule: 'Вказуй на типові пастки тестів УЦОЯО, дистрактори у варіантах відповіді та оптимізацію часу до 45 секунд на завдання.',
      buildGreeting: function (ctx) {
        var subjectLabel = resolveContextTitle(ctx);
        return 'Режим екзаменатора УЦОЯО активовано. Тема: «' + subjectLabel + '». Будемо відсіювати типові дистрактори та тримати темп менше хвилини на пункт.';
      }
    },
    {
      id: 'calm',
      name: 'Спокійний ментор',
      shortRole: 'Антистрес-темп без перевантаження',
      icon: 'clock',
      styleRule: 'Знижуй тривожність, структуруй думку короткими тезами, нагадуй про рівне дихання і послідовність.',
      buildGreeting: function (ctx) {
        var subjectLabel = resolveContextTitle(ctx);
        return 'Ми нікуди не поспішаємо. Тема «' + subjectLabel + '» складається з кількох спокійних кроків. Почнемо з найпростішого опорного факту.';
      }
    },
    {
      id: 'motivator',
      name: 'Драйв-мотиватор',
      shortRole: 'Темп, челенджі та фіксація прогресу',
      icon: 'flame',
      styleRule: 'Підтримуй високий темп, акцентуй на кожному проміжному успіху й став короткі виклики для закріплення.',
      buildGreeting: function (ctx) {
        var subjectLabel = resolveContextTitle(ctx);
        return 'Поїхали брати нову висоту! «' + subjectLabel + '» — це прямий буст до твого цільового балу. Тримаємо ритм і закриваємо мікро-челендж.';
      }
    },
    {
      id: 'ironic',
      name: 'Іронічний критик',
      shortRole: 'Гострий розбір типових ляпів і шаблонів',
      icon: 'bug',
      styleRule: 'З легкою інтелігентною іронією підсвічуй класичні помилки, на яких "сиплються" ті, хто вгадує навмання.',
      buildGreeting: function (ctx) {
        var subjectLabel = resolveContextTitle(ctx);
        return 'О, «' + subjectLabel + '» — улюблене місце, де 70% учнів впевнено обирають найгарнішу неправильну відповідь. Подивимося, чи обійдеш ти пастку.';
      }
    },
    {
      id: 'roleplay',
      name: 'Майстер рольових сцен',
      shortRole: 'Живі місії та практичні діалоги',
      icon: 'layers',
      styleRule: 'Подавай матеріал через практичну рольову ситуацію або прикладну інженерно-життєву задачу.',
      buildGreeting: function (ctx) {
        var subjectLabel = resolveContextTitle(ctx);
        return 'Сцена розгорнута. Навіть «' + subjectLabel + '» ми пройдемо як реальний робочий кейс, де від твоєї точності залежить результат місії.';
      }
    },
    {
      id: 'native',
      name: 'Носій мови',
      shortRole: 'Жива ідіоматика та природний синтаксис',
      icon: 'globe',
      styleRule: 'Для мов говори природно на обраному рівні CEFR без підручникової штучності; для предметів тримай академічно чисту термінологію.',
      buildGreeting: function (ctx) {
        var subjectLabel = resolveContextTitle(ctx);
        return 'Вітаю. У темі «' + subjectLabel + '» ми сфокусуємося на природному звучанні та точних формулюваннях без кальок і штучних конструкцій.';
      }
    }
  ];

  function resolveContextTitle(ctx) {
    if (!ctx) return 'Навчальна сесія';
    if (ctx.scenarioId) {
      var sc = findById(ROLEPLAY_SCENARIOS, ctx.scenarioId);
      if (sc) return sc.title;
    }
    if (ctx.topicTitle) return ctx.topicTitle;
    if (ctx.subjectId) {
      var subj = findById(EXAM_SUBJECTS, ctx.subjectId) || findById(LANGUAGES, ctx.subjectId);
      if (subj) return subj.name;
    }
    return 'Навчальна сесія';
  }

  function findById(list, id) {
    if (!list || !id) return null;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function getPersona(id) {
    return findById(PERSONAS, id) || PERSONAS[0];
  }

  /* ------------------------------------------------------------------------
     5. Strict Grade-Band & CEFR Topic Accessor
     ------------------------------------------------------------------------ */

  function normalizeMode(mode) {
    if (mode === 'language' || mode === 'languages' || mode === 'lang') return 'language';
    return 'school';
  }

  function getTopicsFor(mode, subjectOrLangId, levelOrGrade) {
    var normMode = normalizeMode(mode);
    if (normMode === 'language') {
      var langMap = LANGUAGE_TOPICS[subjectOrLangId] || LANGUAGE_TOPICS.english;
      var levelKey = levelOrGrade && langMap[levelOrGrade] ? levelOrGrade : 'A1';
      return langMap[levelKey].slice();
    }
    var subjMap = SCHOOL_TOPICS[subjectOrLangId] || SCHOOL_TOPICS.math;
    var bandKey = levelOrGrade && subjMap[levelOrGrade] ? levelOrGrade : 'nmt-200';
    return subjMap[bandKey].slice();
  }

  /* ------------------------------------------------------------------------
     6. Intelligent Context-Aware Tutor Reply Engine
     ------------------------------------------------------------------------ */

  var LANGUAGE_EXAMPLES = {
    english: {
      A1: { rule: 'У Present Simple до дієслова в 3-й особі однини (he/she/it) додається -s/-es.', ex: 'She checks her schedule every morning. Does she check it at 8:00?' },
      A2: { rule: 'У Past Simple заперечення й запитання будуються через did + початкова форма (V1).', ex: 'We completed two modules yesterday. Did you finish the quiz?' },
      B1: { rule: 'У First Conditional після if не ставимо will — вживаємо Present Simple.', ex: 'If you revise the formula now, you will save 40 seconds on the test.' },
      B2: { rule: 'У Mixed Conditional минула умова може впливати на теперішній результат.', ex: 'If he had verified the constraints earlier, the system would be stable now.' },
      C1: { rule: 'Часткова інверсія виносить допоміжне дієслово перед підметом після Not only / Seldom.', ex: 'Not only did the model converge faster, but it also reduced memory overhead.' },
      C2: { rule: 'Стилістична компресія замінює підрядні речення точними номінативними групами.', ex: 'Notwithstanding the initial variance, the empirical evidence remains compelling.' }
    },
    deutsch: {
      A1: { rule: 'У німецькому розповідному реченні відмінюване дієслово завжди стоїть на 2-му місці.', ex: 'Heute lerne ich Mathematik. Ich habe ein neues Heft.' },
      A2: { rule: 'З дієсловами руху або зміни стану у Perfekt вживається допоміжне sein.', ex: 'Gestern bin ich früh aufgestanden und zur Bibliothek gefahren.' },
      B1: { rule: 'Після сполучників weil, dass, obwohl відмінюване дієслово переноситься в самий кінець.', ex: 'Ich wiederhole die Regeln, weil die Prüfung bald beginnt.' },
      B2: { rule: 'Парний сполучник je... desto будує пропорційну залежність: у першій частині дієслово в кінці, у другій — на другому місці.', ex: 'Je genauer du prüfst, desto sicherer wird das Ergebnis.' },
      C1: { rule: 'У науковому Nominalstil підрядні речення замінюються прийменниками з Genitiv.', ex: 'Aufgrund der geringen Stichprobe ist eine Verallgemeinerung unzulässig.' },
      C2: { rule: 'Модальні частки (doch, ja, wohl) уточнюють ставлення мовця без зміни факту.', ex: 'Das haben wir doch bereits im Seminar ausführlich belegt.' }
    },
    espanol: {
      A1: { rule: 'Ser описує сутнісні ознаки й професію, а Estar — місцезнаходження та тимчасовий стан.', ex: 'Soy estudiante de ingeniería, pero hoy estoy en la biblioteca.' },
      A2: { rule: 'Pretérito Perfecto описує дію у незавершеному періоді (hoy, esta semana), а Indefinido — у закритому минулому (ayer).', ex: 'Esta semana he practicado mucho; ayer resolví diez ejercicios.' },
      B1: { rule: 'Дієслова бажання й сумніву після que вимагають Presente de Subjuntivo.', ex: 'Espero que comprendas la estructura antes del examen.' },
      B2: { rule: 'Умовне речення II типу поєднує Imperfecto de Subjuntivo та Condicional Simple.', ex: 'Si tuvieras más tiempo, analizarías cada hipótesis con calma.' },
      C1: { rule: 'Після a pesar de que вживається Indicativo для доконаного факту або Subjuntivo для гіпотетичної перешкоди.', ex: 'A pesar de que los datos fueron parciales, confirmaron la tendencia.' },
      C2: { rule: 'Вибір Indicativo чи Subjuntivo у відносному реченні показує, чи відомий об\'єкт мовцеві.', ex: 'Buscamos un método que elimine el sesgo sin perder precisión.' }
    },
    polski: {
      A1: { rule: 'Після дієслова być у значенні професії або ролі іменник стоїть в орудному відмінку (Narzędnik).', ex: 'Jestem uczniem liceum i interesuję się fizyką.' },
      A2: { rule: 'При запереченні з "nie" прямий додаток переходить із Biernik у Dopełniacz (родовий відмінок).', ex: 'Mam słownik (B.), ale nie mam nowego słownika (D.).' },
      B1: { rule: 'Доконаний вид дієслова вказує на результат, а недоконаний — на процес або регулярність.', ex: 'Codziennie powtarzam słówka, a dzisiaj napisałem cały test.' },
      B2: { rule: 'Безособові форми на -no / -to описують факт дії в минулому без називання виконавця.', ex: 'W raporcie wykazano trzy istotne błędy metodologiczne.' },
      C1: { rule: 'Після дієслів szukać, używać, uczyć się у польській мові обов\'язковий родовий відмінок (Dopełniacz).', ex: 'Uczę się języka polskiego i szukam rzetelnego podręcznika.' },
      C2: { rule: 'Тема-рематичне членування ставить найважливішу нову інформацію в кінець польського речення.', ex: 'Mimo rozbieżności metodologicznych kluczowy wniosek pozostaje spójny.' }
    },
    ukrainian: {
      A1: { rule: 'Між двома приголосними для милозвучності обираємо «у» та «і», а між голосними — «в» та «й».', ex: 'Вона зайшла в аудиторію й узяла конспект у бібліотеці.' },
      A2: { rule: 'Числівники 2, 3, 4 керують називним відмінком множини (три формули), а 5 і більше — родовим (п\'ять формул).', ex: 'Ми розв\'язали чотири складні задачі та п\'ять тестів.' },
      B1: { rule: 'Активні дієприкметники на -учий/-ючий замінюємо описовими зворотами або нормативними прикметниками.', ex: 'Правильно: «чинне правило», «код, що виконується», а не «діючий».' },
      B2: { rule: 'Запам\'ятайте наголос УЦОЯО: вИпадок, мерЕжа, завдАння, пЕрепис, дровА.', key: '', ex: 'У цьому вИпадку мерЕжа датчиків виконала завдАння точно.' },
      C1: { rule: 'Безособові форми на -но, -то в літературній мові вживаються без вказівки на виконавця в орудному відмінку.', ex: 'Дані перевірено та внесено до реєстру (без «експертом»).' },
      C2: { rule: 'Усувайте приховані плеоназми й тавтологію: не «пам\'ятний сувенір», а «сувенір»; не «прейскурант цін», а «прейскурант».', ex: 'Доповідь була лаконічною, точною та позбавленою стилістичних штампів.' }
    }
  };

  function getPersonaTonePrefix(personaId) {
    switch (personaId) {
      case 'strict':
        return '[Режим суворої перевірки] Без зайвих припущень і скорочень. ';
      case 'socratic':
        return '[Сократівський метод] Перш ніж зафіксувати висновок, запитай себе про умову переходу. ';
      case 'examiner':
        return '[Стандарт УЦОЯО] Фокус на типовій пастці тесту й ліміті часу 45 секунд. ';
      case 'calm':
        return '[Спокійний темп] Розкладаємо матеріал на три прості опори без перевантаження. ';
      case 'motivator':
        return '[Темп переможця] Ще один чіткий крок — і ця тема працюватиме на твій бал. ';
      case 'ironic':
        return '[Критичний погляд] Обережно: тут зазвичай ховається найпопулярніша помилка «на автоматі». ';
      case 'roleplay':
        return '[Ситуаційна місія] Застосуємо правило в реальному сценарії безпосередньо зараз. ';
      case 'native':
        return '[Жива норма] Дивимося на природне вживання без штучних підручникових штампів. ';
      default:
        return '[Дружня підтримка] Тримай ясний орієнтир — розбираємо по суті й без зайвої плутанини. ';
    }
  }

  function findLastActiveExercise(history) {
    if (!history || !history.length) return null;
    for (var i = history.length - 1; i >= 0; i--) {
      if (history[i] && history[i].exercise) {
        return history[i].exercise;
      }
    }
    return null;
  }

  function evaluateUserGuess(userMessage, activeExercise) {
    if (!userMessage || !activeExercise) return null;
    var trimmed = String(userMessage).trim();
    if (!trimmed) return null;

    var lower = trimmed.toLowerCase();
    var options = activeExercise.options || [];
    var matchedIndex = -1;

    // 1. Letter mapping (A/B/C/D or А/Б/В/Г)
    var letterMap = { a: 0, 'а': 0, b: 1, 'б': 1, c: 2, 'в': 2, d: 3, 'г': 3 };
    if (trimmed.length === 1 && letterMap.hasOwnProperty(lower)) {
      matchedIndex = letterMap[lower];
    }

    // 2. Digit 1..4 for option index
    if (matchedIndex === -1 && /^[1-4]$/.test(trimmed)) {
      matchedIndex = parseInt(trimmed, 10) - 1;
    }

    // 3. Direct substring or numeric token match inside options
    if (matchedIndex === -1) {
      for (var i = 0; i < options.length; i++) {
        var optLower = String(options[i]).toLowerCase();
        if (optLower === lower || (lower.length >= 2 && optLower.indexOf(lower) !== -1)) {
          matchedIndex = i;
          break;
        }
      }
    }

    // 4. Numeric match when user types e.g. "x = 5" or "240"
    if (matchedIndex === -1) {
      var numMatch = lower.match(/-?\d+([.,]\d+)?/);
      if (numMatch) {
        var numStr = numMatch[0].replace(',', '.');
        for (var j = 0; j < options.length; j++) {
          var optNums = String(options[j]).replace(',', '.').match(/-?\d+(\.\d+)?/g) || [];
          if (optNums.indexOf(numStr) !== -1) {
            matchedIndex = j;
            break;
          }
        }
      }
    }

    if (matchedIndex === -1 || matchedIndex >= options.length) {
      return null;
    }

    var isCorrect = matchedIndex === activeExercise.correctIndex;
    return {
      isCorrect: isCorrect,
      chosenOption: options[matchedIndex],
      correctOption: options[activeExercise.correctIndex],
      explanation: activeExercise.explanation
    };
  }

  function buildTopicExercise(mode, subjectId, bandOrLevel, topicObj, variantSeed) {
    var seed = variantSeed ? 1 : 0;

    if (normalizeMode(mode) === 'language') {
      if (subjectId === 'english') {
        if (bandOrLevel === 'A1' || bandOrLevel === 'A2') {
          return seed === 0 ? {
            prompt: 'Оберіть граматично правильний варіант для рівня ' + bandOrLevel + ':',
            options: [
              'She does not like noisy rooms.',
              'She do not likes noisy rooms.',
              'She not liking noisy rooms.',
              'She does not likes noisy rooms.'
            ],
            correctIndex: 0,
            explanation: 'Після допоміжного does у запереченні основне дієслово стоїть у базовій формі (like без -s).'
          } : {
            prompt: 'Ізоморфна перевірка (' + bandOrLevel + '): заповніть пропуск "Yesterday he ___ the report early."',
            options: ['finished', 'finish', 'finishing', 'has finish'],
            correctIndex: 0,
            explanation: 'Маркер yesterday однозначно вимагає Past Simple (finished).'
          };
        }
        return seed === 0 ? {
          prompt: 'Оберіть безпомилкове речення для рівня ' + bandOrLevel + ':',
          options: [
            'If she revises the notes today, she will pass easily.',
            'If she will revise the notes today, she passes easily.',
            'If she revised the notes today, she will pass easily.',
            'If she revise the notes today, she would pass.'
          ],
          correctIndex: 0,
          explanation: 'У First Conditional після if використовуємо Present Simple (revises), а в головній частині — will + V1.'
        } : {
          prompt: 'Оберіть природний академічний зв\'язок (' + bandOrLevel + '): "___ the strict deadline, the team delivered."',
          options: ['Despite', 'Although', 'Even though', 'Because'],
          correctIndex: 0,
          explanation: 'Перед іменниковою групою (the strict deadline) вживаємо прийменник Despite, а не сполучник Although.'
        };
      }

      if (subjectId === 'deutsch') {
        return {
          prompt: 'Оберіть правильний порядок слів для Deutsch (' + bandOrLevel + '):',
          options: [
            'Heute löse ich eine neue Aufgabe.',
            'Heute ich löse eine neue Aufgabe.',
            'Ich heute löse eine neue Aufgabe.',
            'Löse heute ich eine neue Aufgabe.'
          ],
          correctIndex: 0,
          explanation: 'Дієслово у розповідному реченні (löse) завжди займає рівно другу синтаксичну позицію.'
        };
      }

      if (subjectId === 'espanol') {
        return {
          prompt: 'Оберіть коректне дієслово для Español (' + bandOrLevel + '): "Madrid ___ en el centro de España."',
          options: ['está', 'es', 'son', 'están'],
          correctIndex: 0,
          explanation: 'Для географічного розташування в іспанській мові завжди використовується дієслово estar.'
        };
      }

      if (subjectId === 'polski') {
        return {
          prompt: 'Оберіть правильний відмінок для Polski (' + bandOrLevel + '): "Nie mam dziś ___."',
          options: ['czasu', 'czas', 'czasem', 'czasie'],
          correctIndex: 0,
          explanation: 'Після заперечення "nie mam" обов\'язково вживається родовий відмінок (Dopełniacz): czasu.'
        };
      }

      return {
        prompt: 'Оберіть нормативне українське словосполучення (' + bandOrLevel + '):',
        options: [
          'брати участь у семінарі',
          'приймати участь у семінарі',
          'самий кращий результат',
          'згідно графіка занять'
        ],
        correctIndex: 0,
        explanation: 'Нормативно: «брати участь», «найкращий», «згідно з графіком».'
      };
    }

    // School / NMT exercises strictly isolated by subjectId + gradeBand
    if (subjectId === 'math') {
      if (bandOrLevel === 'grade-5-7') {
        return seed === 0 ? {
          prompt: 'Задача (5-7 класи): Ціна набору 300 грн. Після знижки 20% його вартість дорівнює:',
          options: ['240 грн', '260 грн', '280 грн', '220 грн'],
          correctIndex: 0,
          explanation: '20% від 300 грн = 300 * 0.2 = 60 грн. Нова ціна: 300 - 60 = 240 грн.'
        } : {
          prompt: 'Ізоморфна задача (5-7 класи): Розв\'яжіть рівняння 3x - 7 = 14.',
          options: ['x = 7', 'x = 21', 'x = 3', 'x = 5'],
          correctIndex: 0,
          explanation: '3x = 14 + 7 = 21, отже x = 21 / 3 = 7.'
        };
      }
      if (bandOrLevel === 'grade-8-9') {
        return seed === 0 ? {
          prompt: 'Задача (8-9 класи): Знайдіть суму коренів рівняння x^2 - 7x + 10 = 0.',
          options: ['7', '-7', '10', '5'],
          correctIndex: 0,
          explanation: 'Дискримінант D = 49 - 40 = 9 > 0. За теоремою Вієта x1 + x2 = -(-7)/1 = 7.'
        } : {
          prompt: 'Ізоморфна задача (8-9 класи): Катети прямокутного трикутника 5 см і 12 см. Знайдіть гіпотенузу.',
          options: ['13 см', '17 см', '14 см', '11 см'],
          correctIndex: 0,
          explanation: 'За теоремою Піфагора c = sqrt(5^2 + 12^2) = sqrt(25 + 144) = sqrt(169) = 13 см.'
        };
      }
      if (bandOrLevel === 'olympiad') {
        return {
          prompt: 'Олімпіадна задача: Яка остача від ділення суми 10^20 + 8 на 9?',
          options: ['0', '1', '2', '8'],
          correctIndex: 0,
          explanation: '10 == 1 (mod 9), тому 10^20 == 1 (mod 9). Сума 1 + 8 = 9 == 0 (mod 9).'
        };
      }
      // nmt-200
      return seed === 0 ? {
        prompt: 'НМТ-перевірка (200 балів): Знайдіть значення x, якщо log_3(x - 2) = 2.',
        options: ['11', '8', '7', '5'],
        correctIndex: 0,
        explanation: 'ОДЗ: x > 2. Переходимо до степеня: x - 2 = 3^2 = 9, отже x = 11 (ОДЗ задовольняє).'
      } : {
        prompt: 'Ізоморфна НМТ-задача: Знайдіть кутовий коефіцієнт дотичної до f(x) = x^3 - 2x у точці x0 = 2.',
        options: ['10', '12', '4', '8'],
        correctIndex: 0,
        explanation: 'f\'(x) = 3x^2 - 2. У точці x0 = 2: k = f\'(2) = 3 * 4 - 2 = 10.'
      };
    }

    if (subjectId === 'ukrainian') {
      if (bandOrLevel === 'grade-5-7') {
        return {
          prompt: 'Тест (5-7 класи): У якому слові потрібно писати апостроф?',
          options: ['п\'ятниця', 'свято', 'морквяний', 'цвях'],
          correctIndex: 0,
          explanation: 'У слові «п\'ятниця» апостроф пишеться після губного «п» перед «я».'
        };
      }
      if (bandOrLevel === 'grade-8-9') {
        return {
          prompt: 'Тест (8-9 класи): У якому варіанті «не» з прикметником пишеться ОКРЕМО?',
          options: [
            'не високий, а низький',
            'невеликий будинок',
            'нещасний випадок',
            'нелегке завдання'
          ],
          correctIndex: 0,
          explanation: 'За наявності протиставлення зі сполучником «а» частка «не» пишеться окремо.'
        };
      }
      return {
        prompt: 'НМТ-перевірка: У якому слові наголос падає на ПЕРШИЙ склад?',
        options: ['випадок', 'завдання', 'мережа', 'дрова'],
        correctIndex: 0,
        explanation: 'Нормативно: вИпадок, але завдАння, мерЕжа, дровА.'
      };
    }

    if (subjectId === 'history') {
      if (bandOrLevel === 'grade-5-7') {
        return {
          prompt: 'Історія (5-7 класи): У якому році відбулася коронація Данила Романовича?',
          options: ['1253 р.', '988 р.', '1199 р.', '1556 р.'],
          correctIndex: 0,
          explanation: 'Данило Галицький прийняв королівську корону в Дорогочині у 1253 році.'
        };
      }
      if (bandOrLevel === 'grade-8-9') {
        return {
          prompt: 'Історія (8-9 класи): Який договір 1649 р. зафіксував реєстр у 40 тисяч козаків?',
          options: ['Зборівський', 'Білоцерківський', 'Гадяцький', 'Андрусівський'],
          correctIndex: 0,
          explanation: 'Зборівський договір серпня 1649 р. встановлював 40-тисячний реєстр та владу гетьмана у 3 воєводствах.'
        };
      }
      return {
        prompt: 'НМТ з історії: Який Універсал УЦР проголосив повну незалежність УНР у січні 1918 року?',
        options: ['IV Універсал', 'I Універсал', 'II Універсал', 'III Універсал'],
        correctIndex: 0,
        explanation: 'IV Універсал УЦР (датований 9/22 січня 1918 р.) проголосив самостійність і незалежність УНР.'
      };
    }

    if (subjectId === 'bio-phys') {
      if (bandOrLevel === 'grade-5-7') {
        return {
          prompt: 'Біологія та Фізика (5-7 класи): Маса тіла 400 г, об\'єм 500 см^3. Чи потоне воно у воді (1 г/см^3)?',
          options: [
            'Ні, бо густина 0.8 г/см^3 < 1 г/см^3',
            'Так, бо густина 1.25 г/см^3 > 1 г/см^3',
            'Потоне наполовину при 2.0 г/см^3',
            'Даних недостатньо'
          ],
          correctIndex: 0,
          explanation: 'rho = m / V = 400 / 500 = 0.8 г/см^3. Оскільки 0.8 < 1.0, тіло плаватиме.'
        };
      }
      if (bandOrLevel === 'grade-8-9') {
        return {
          prompt: 'Фізика (8-9 класи): Напруга 24 В, опір кола 6 Ом. Яка сила струму?',
          options: ['4 А', '144 А', '0.25 А', '18 А'],
          correctIndex: 0,
          explanation: 'За законом Ома для ділянки кола I = U / R = 24 / 6 = 4 А.'
        };
      }
      return {
        prompt: 'НМТ (Біо/Фіз): Який триплет іРНК є стоп-кодоном і НЕ кодує амінокислоти?',
        options: ['УАГ', 'АУГ', 'ГЦЦ', 'ЦУА'],
        correctIndex: 0,
        explanation: 'Стоп-кодони іРНК: УАА, УАГ, УГА. Триплет АУГ кодує метіонін (старт).'
      };
    }

    // english in school/exam mode
    return {
      prompt: 'Англійська (' + bandOrLevel + '): Оберіть правильний варіант: "She is capable ___ solving this proof."',
      options: ['of', 'to', 'for', 'with'],
      correctIndex: 0,
      explanation: 'Прикметник capable уживається з прийменником of + V-ing.'
    };
  }

  function generateTutorReply(params) {
    var cfg = params || {};
    var mode = normalizeMode(cfg.mode);
    var subjectId = cfg.subjectId || (mode === 'language' ? 'english' : 'math');
    var gradeBand = cfg.gradeBand || 'nmt-200';
    var cefrLevel = cfg.cefrLevel || 'B1';
    var persona = getPersona(cfg.personaId);
    var scenario = cfg.scenarioId ? findById(ROLEPLAY_SCENARIOS, cfg.scenarioId) : null;
    var actionType = cfg.actionType || 'explain';
    var userMessage = cfg.userMessage ? String(cfg.userMessage).trim() : '';
    var history = cfg.history || [];

    var levelOrGrade = mode === 'language' ? cefrLevel : gradeBand;
    var topics = getTopicsFor(mode, subjectId, levelOrGrade);
    var activeTopic = topics[0];
    if (cfg.topicTitle) {
      for (var t = 0; t < topics.length; t++) {
        if (topics[t].title === cfg.topicTitle || topics[t].id === cfg.topicTitle) {
          activeTopic = topics[t];
          break;
        }
      }
    }

    var tonePrefix = getPersonaTonePrefix(persona.id);

    // 1. Check if user answered an active exercise from history
    var lastExercise = findLastActiveExercise(history);
    if (userMessage && lastExercise && actionType !== 'scenario') {
      var verdict = evaluateUserGuess(userMessage, lastExercise);
      if (verdict) {
        if (verdict.isCorrect) {
          var praise = persona.id === 'strict'
            ? 'Вірно. Відповідь «' + verdict.correctOption + '» прийнято: обмеження й логіка зійшлися.'
            : persona.id === 'ironic'
              ? 'Ого, жодної осічки: «' + verdict.correctOption + '» — це справді точний вибір, пастку пройдено.'
              : 'Точно в ціль! Варіант «' + verdict.correctOption + '» є правильним.';
          return {
            text: tonePrefix + praise + ' ' + verdict.explanation,
            steps: [
              'Відповідь верифіковано: ' + verdict.correctOption,
              'Ключова формула теми: ' + activeTopic.keyFormula,
              'Тему «' + activeTopic.title + '» зараховано як опрацьовану.'
            ],
            exercise: null,
            noteSummary: activeTopic.title + ' — верифіковано (' + activeTopic.keyFormula + ')',
            topicCompleted: true
          };
        } else {
          return {
            text: tonePrefix + 'Обрано «' + verdict.chosenOption + '», але тут спрацювала типова пастка. ' + verdict.explanation + ' Спробуй ще раз або обери правильний варіант нижче.',
            steps: [
              'Помилковий вибір: ' + verdict.chosenOption,
              'Перевір умову за опорним правилом: ' + activeTopic.keyFormula,
              'Дай повторну відповідь на перевірку.'
            ],
            exercise: lastExercise,
            noteSummary: activeTopic.title + ' — потребує повторної перевірки',
            topicCompleted: false
          };
        }
      }
    }

    // 2. Language Mode + Active Roleplay Scenario
    if (mode === 'language' && (scenario || actionType === 'scenario')) {
      var activeScenario = scenario || ROLEPLAY_SCENARIOS[0];
      var opening = activeScenario.openingPrompts[subjectId] || activeScenario.openingPrompts.english;
      var hint = activeScenario.coachingHints[subjectId] || activeScenario.coachingHints.english;

      var dialogueLine = opening;
      if (userMessage) {
        if (subjectId === 'english') {
          dialogueLine = 'Thanks for clarifying that ("' + userMessage.slice(0, 60) + '"). Let us go one level deeper: what specific constraint or metric would you verify first?';
        } else if (subjectId === 'deutsch') {
          dialogueLine = 'Verstanden. Zu Ihrem Punkt ("' + userMessage.slice(0, 50) + '"): Welche konkrete Maßnahme würden Sie im nächsten Schritt ergreifen?';
        } else if (subjectId === 'espanol') {
          dialogueLine = 'Gracias por tu respuesta ("' + userMessage.slice(0, 50) + '"). Para profundizar, ¿qué detalle técnico comprobarías primero en esta situación?';
        } else if (subjectId === 'polski') {
          dialogueLine = 'Rozumiem. Odnosząc się do tego ("' + userMessage.slice(0, 50) + '"): jaki kolejny krok uznałbyś za najważniejszy w tej sytuacji?';
        } else {
          dialogueLine = 'Дякую за чітку репліку. Продовжуємо сцену: уточніть, будь ласка, який саме аргумент або документ є вирішальним у цій ситуації?';
        }
      }

      var roleExercise = buildTopicExercise('language', subjectId, cefrLevel, activeTopic, false);
      return {
        text: tonePrefix + '[' + activeScenario.roleName + ']: ' + dialogueLine + ' | ' + hint,
        steps: [
          'Сцена: ' + activeScenario.title + ' (рівень ' + cefrLevel + ')',
          'Твоє завдання: дай відповідь мовою сценарію у 1-2 речення',
          hint
        ],
        exercise: actionType === 'exercise' ? roleExercise : null,
        noteSummary: 'Roleplay «' + activeScenario.title + '» (' + subjectId.toUpperCase() + ' ' + cefrLevel + ')',
        topicCompleted: Boolean(userMessage && userMessage.length >= 18)
      };
    }

    // 3. Language Mode (Bilingual Rule + Examples)
    if (mode === 'language') {
      var langSet = LANGUAGE_EXAMPLES[subjectId] || LANGUAGE_EXAMPLES.english;
      var levelData = langSet[cefrLevel] || langSet.B1;
      var langEx = buildTopicExercise('language', subjectId, cefrLevel, activeTopic, actionType === 'similar');

      if (actionType === 'step') {
        return {
          text: tonePrefix + 'Алгоритм для теми «' + activeTopic.title + '» (' + cefrLevel + '): ' + levelData.rule,
          steps: [
            'Крок 1. Визнач ключовий маркер у реченні (' + activeTopic.keyFormula + ').',
            'Крок 2. Застосуй правило: ' + levelData.rule,
            'Крок 3. Звір зі зразком: ' + levelData.ex
          ],
          exercise: null,
          noteSummary: activeTopic.title + ': ' + activeTopic.keyFormula,
          topicCompleted: false
        };
      }

      if (actionType === 'exercise' || actionType === 'check' || actionType === 'similar') {
        return {
          text: tonePrefix + (actionType === 'similar' ? 'Ось схоже тренувальне завдання для закріплення рівня ' : 'Швидка перевірка на рівень ') + cefrLevel + '. Правило: ' + levelData.rule,
          steps: [
            'Прочитай приклад: ' + levelData.ex,
            'Обери правильний варіант у міні-тесті нижче'
          ],
          exercise: langEx,
          noteSummary: activeTopic.title + ' — практика (' + cefrLevel + ')',
          topicCompleted: false
        };
      }

      return {
        text: tonePrefix + 'Тема «' + activeTopic.title + '» (рівень ' + cefrLevel + '). Українське пояснення: ' + levelData.rule + ' Приклад мовою вивчення: "' + levelData.ex + '".',
        steps: [
          'Правило: ' + levelData.rule,
          'Приклад: ' + levelData.ex,
          'Формула: ' + activeTopic.keyFormula
        ],
        exercise: userMessage ? langEx : null,
        noteSummary: activeTopic.title + ' (' + cefrLevel + '): ' + activeTopic.keyFormula,
        topicCompleted: false
      };
    }

    // 4. School / NMT Mode (Strictly Grade-Band Isolated)
    var schoolEx = buildTopicExercise('school', subjectId, gradeBand, activeTopic, actionType === 'similar');
    var bandObj = findById(GRADE_BANDS, gradeBand) || GRADE_BANDS[2];

    if (actionType === 'step') {
      return {
        text: tonePrefix + 'Покроковий розбір теми «' + activeTopic.title + '» (' + bandObj.label + '). ' + activeTopic.summary,
        steps: [
          'Крок 1. Зафіксуй умову та обмеження рівня (' + bandObj.label + ').',
          'Крок 2. Застосуй опорну закономірність: ' + activeTopic.keyFormula + '.',
          'Крок 3. Перевір граничні випадки та одиниці виміру перед фінальною відповіддю.'
        ],
        exercise: null,
        noteSummary: activeTopic.title + ' — 3-кроковий план (' + bandObj.shortLabel + ')',
        topicCompleted: false
      };
    }

    if (actionType === 'exercise' || actionType === 'check' || actionType === 'similar') {
      var intro = actionType === 'similar'
        ? 'Ізоморфне завдання на перенесення навички без зазубрювання (' + bandObj.label + ').'
        : actionType === 'check'
          ? 'Контрольна перевірка знань за темою «' + activeTopic.title + '».'
          : 'Практична вправа з теми «' + activeTopic.title + '» (' + bandObj.label + ').';
      return {
        text: tonePrefix + intro + (persona.id === 'socratic' ? ' Спочатку сформулюй проміжний крок у думках, а потім обери відповідь.' : ''),
        steps: [
          'Опорна формула: ' + activeTopic.keyFormula,
          'Дай відповідь (літера А-Г, номер 1-4 або число) або натисни на варіант.'
        ],
        exercise: schoolEx,
        noteSummary: activeTopic.title + ' — перевірка (' + bandObj.shortLabel + ')',
        topicCompleted: false
      };
    }

    // Default 'explain' or free-form question
    var replyBody = persona.id === 'socratic'
      ? 'Тема «' + activeTopic.title + '» (' + bandObj.label + '). ' + activeTopic.summary + ' Питання до тебе: який перший крок випливає із залежності «' + activeTopic.keyFormula + '»?'
      : 'Розбираємо «' + activeTopic.title + '» у межах програми «' + bandObj.label + '». ' + activeTopic.summary + ' Ключова опора: ' + activeTopic.keyFormula + '.';

    if (userMessage) {
      replyBody = tonePrefix + 'Щодо твого запиту («' + userMessage.slice(0, 70) + '»): ' + replyBody;
    } else {
      replyBody = tonePrefix + replyBody;
    }

    return {
      text: replyBody,
      steps: [
        'Суть: ' + activeTopic.summary,
        'Опора: ' + activeTopic.keyFormula,
        'Натисни «Перевір мене» або «Вправа», щоб закріпити тему.'
      ],
      exercise: userMessage ? schoolEx : null,
      noteSummary: activeTopic.title + ' (' + bandObj.shortLabel + '): ' + activeTopic.keyFormula,
      topicCompleted: false
    };
  }

  /* ------------------------------------------------------------------------
     7. Full AI-Resilient NMT & CAT Question Bank (24 Verified Questions)
     ------------------------------------------------------------------------ */

  var NMT_QUESTIONS = [
    /* --- MATH (7) --- */
    {
      id: 'q-math-57-cc',
      subjectId: 'math',
      gradeBand: 'grade-5-7',
      difficulty: 1,
      format: 'context_case',
      formatLabel: 'Контекстний кейс',
      topic: 'Відсотки та пропорції',
      title: 'Аудит чеку зі знижками',
      questionText: 'За даними таблиці обчисліть підсумкову вартість усього замовлення після врахування знижок у кожному рядку.',
      tableData: {
        headers: ['Позиція', 'Ціна за 1 шт.', 'Кількість', 'Знижка'],
        rows: [
          ['Зошит у клітинку', '24 грн', '5 шт.', '10%'],
          ['Лінійка алюмінієва', '40 грн', '2 шт.', '25%'],
          ['Ручка гелева', '18 грн', '4 шт.', '0%']
        ]
      },
      options: ['232 грн', '240 грн', '252 грн', '272 грн'],
      correctIndex: 1,
      explanation: 'Зошити: 24 * 5 = 120 грн, мінус 10% (12 грн) = 108 грн. Лінійки: 40 * 2 = 80 грн, мінус 25% (20 грн) = 60 грн. Ручки: 18 * 4 = 72 грн. Разом: 108 + 60 + 72 = 240 грн.',
      errorSummary: 'Помилка у застосуванні відсоткових знижок до окремих рядків таблиці.',
      microVerify: {
        question: 'Якщо знижка на товар вартістю 40 грн становить 25%, скільки коштує 1 одиниця?',
        options: ['30 грн', '32 грн', '10 грн'],
        correctIndex: 0,
        hint: '25% — це чверть від 40 грн, тобто 10 грн знижки.'
      }
    },
    {
      id: 'q-math-57-trap',
      subjectId: 'math',
      gradeBand: 'grade-5-7',
      difficulty: 2,
      format: 'llm_trap',
      formatLabel: 'Анти-ШІ пастка',
      topic: 'Дроби та лінійні рівняння',
      title: 'Кастомний оператор напівсуми',
      trapRule: 'Визначено нову операцію: a [*] b = (a + b) / 2 + 1 (напівсума чисел, збільшена на 1).',
      questionText: 'Користуючись заданим правилом зліва направо, обчисліть значення виразу (6 [*] 10) [*] 5.',
      options: ['7', '8', '8.5', '9'],
      correctIndex: 1,
      explanation: 'Спочатку 6 [*] 10 = (6 + 10) / 2 + 1 = 8 + 1 = 9. Далі 9 [*] 5 = (9 + 5) / 2 + 1 = 7 + 1 = 8.',
      errorSummary: 'Порушено порядок дій у дужках або забуто доданок +1 у кастомному операторі.',
      microVerify: {
        question: 'Чому дорівнює проміжний результат 6 [*] 10 за цим самим правилом?',
        options: ['8', '9', '17'],
        correctIndex: 1,
        hint: 'Складіть 6 і 10, поділіть на 2 та додайте 1.'
      }
    },
    {
      id: 'q-math-89-vis',
      subjectId: 'math',
      gradeBand: 'grade-8-9',
      difficulty: 3,
      format: 'visual_schema',
      formatLabel: 'Візуальна схема',
      topic: 'Теореми Піфагора та Фалеса',
      title: 'Медіана до гіпотенузи',
      diagram: {
        type: 'triangle',
        params: {
          points: [[40, 150], [40, 40], [220, 150]],
          labels: ['C', 'A', 'B'],
          sides: ['AC = 6 см', 'BC = 8 см', 'CM — медіана'],
          angleLabel: '90 deg'
        },
        caption: 'Прямокутний трикутник ABC (кут C = 90 deg), AC = 6 см, BC = 8 см.'
      },
      questionText: 'У прямокутному трикутнику ABC з катетами AC = 6 см і BC = 8 см до гіпотенузи AB проведено медіану CM. Знайдіть довжину CM.',
      options: ['4 см', '4.8 см', '5 см', '6 см'],
      correctIndex: 2,
      explanation: 'За теоремою Піфагора гіпотенуза AB = sqrt(6^2 + 8^2) = 10 см. Медіана прямокутного трикутника, проведена до гіпотенузи, дорівнює її половині: CM = 10 / 2 = 5 см.',
      errorSummary: 'Плутанина між висотою до гіпотенузи (4.8 см) та медіаною до гіпотенузи (5 см).',
      microVerify: {
        question: 'Чому дорівнює довжина гіпотенузи AB у цьому трикутнику?',
        options: ['10 см', '14 см', '12 см'],
        correctIndex: 0,
        hint: 'Єгипетський трикутник зі сторонами, кратними 3, 4, 5.'
      }
    },
    {
      id: 'q-math-89-bug',
      subjectId: 'math',
      gradeBand: 'grade-8-9',
      difficulty: 2,
      format: 'find_the_bug',
      formatLabel: 'Знайди помилку',
      topic: 'Лінійні та квадратні нерівності',
      title: 'Аудит квадратної нерівності',
      derivationSteps: [
        '1) Запишемо квадратну нерівність: x^2 - 9 <= 0.',
        '2) Розкладемо ліву частину за формулою різниці квадратів: (x - 3)(x + 3) <= 0.',
        '3) Знайдемо нулі функції: x1 = -3, x2 = 3.',
        '4) Оскільки коефіцієнт при x^2 додатний, запишемо відповідь: (-inf; -3] U [3; +inf).'
      ],
      questionText: 'На якому кроці розв\'язування учень припустився принципової логічної помилки?',
      options: ['Крок 1', 'Крок 2', 'Крок 3', 'Крок 4'],
      correctIndex: 3,
      explanation: 'На кроці 4 для нерівності <= 0 при параболі гілками вгору значення менше або рівні нулю знаходяться всередині проміжку [-3; 3], а не на зовнішніх проміжках.',
      errorSummary: 'Неправильно вибрано знак інтервалу при методі інтервалів для нерівності <= 0.',
      microVerify: {
        question: 'Яке з наведених значень x задовольняє нерівність x^2 - 9 <= 0?',
        options: ['x = 0', 'x = 5', 'x = -4'],
        correctIndex: 0,
        hint: 'Підставте число замість x і перевірте знак виразу.'
      }
    },
    {
      id: 'q-math-nmt-vis',
      subjectId: 'math',
      gradeBand: 'nmt-200',
      difficulty: 4,
      format: 'visual_schema',
      formatLabel: 'Візуальна схема',
      topic: 'Похідна, дотична та екстремуми',
      title: 'Парабола і паралельна дотична',
      diagram: {
        type: 'parabola',
        params: {
          a: 1,
          b: -4,
          c: 3,
          vertex: [2, -1],
          roots: [1, 3],
          highlightPoint: [3, 0],
          xLabel: 'x',
          yLabel: 'f(x)'
        },
        caption: 'Графік f(x) = x^2 - 4x + c з вершиною в точці (2; -1).'
      },
      questionText: 'Вершина параболи f(x) = x^2 - 4x + c лежить у точці (2; -1). Знайдіть параметр c та абсцису x0 точки, у якій дотична до графіка паралельна прямій y = 2x + 5.',
      options: ['c = 3, x0 = 3', 'c = -1, x0 = 2', 'c = 3, x0 = 2', 'c = 5, x0 = 3'],
      correctIndex: 0,
      explanation: 'З умови f(2) = -1 маємо 4 - 8 + c = -1, звідки c = 3. Дотична паралельна y = 2x + 5, отже f\'(x0) = 2. Оскільки f\'(x) = 2x - 4, отримуємо 2x0 - 4 = 2, звідси x0 = 3.',
      errorSummary: 'Забуто прирівняти похідну до кутового коефіцієнта прямої або неточно знайдено c з координат вершини.',
      microVerify: {
        question: 'Чому дорівнює похідна f\'(x) у точці вершини будь-якої гладкої параболи?',
        options: ['0', '2', '-4'],
        correctIndex: 0,
        hint: 'У вершині дотична горизонтальна.'
      }
    },
    {
      id: 'q-math-nmt-bug',
      subjectId: 'math',
      gradeBand: 'nmt-200',
      difficulty: 4,
      format: 'find_the_bug',
      formatLabel: 'Знайди помилку',
      topic: 'Логарифмічні та показникові рівняння (ОДЗ)',
      title: 'Пастка ОДЗ у логарифмах',
      derivationSteps: [
        '1) Запишемо ОДЗ: x - 1 > 0 і x + 1 > 0, отже x > 1.',
        '2) Зведемо суму логарифмів: log_2((x - 1)(x + 1)) = 3.',
        '3) Перейдемо до алгебраїчного рівняння: x^2 - 1 = 8, звідки x^2 = 9.',
        '4) Запишемо фінальну відповідь: x = -3 або x = 3.'
      ],
      questionText: 'У якому кроці допущено критичну помилку формату НМТ для рівняння log_2(x - 1) + log_2(x + 1) = 3?',
      options: ['Крок 1', 'Крок 2', 'Крок 3', 'Крок 4'],
      correctIndex: 3,
      explanation: 'На кроці 4 корінь x = -3 суперечить знайденому на кроці 1 ОДЗ (x > 1). Єдиний корінь — x = 3.',
      errorSummary: 'Ігнорування ОДЗ під час запису фінальної відповіді логарифмічного рівняння.',
      microVerify: {
        question: 'Чому дорівнює значення виразу log_2(8)?',
        options: ['3', '4', '2'],
        correctIndex: 0,
        hint: 'До якого степеня треба піднести 2, щоб отримати 8?'
      }
    },
    {
      id: 'q-math-oly-trap',
      subjectId: 'math',
      gradeBand: 'olympiad',
      difficulty: 5,
      format: 'llm_trap',
      formatLabel: 'Анти-ШІ пастка',
      topic: 'Теорія чисел і модульна арифметика',
      title: 'Модульний оператор другого степеня',
      trapRule: 'Нехай операція a [+] b позначає остачу від ділення (a^2 + b^2) на 7, де результат належить {0, 1, 2, 3, 4, 5, 6}.',
      questionText: 'Знайдіть точне значення виразу ((3 [+] 4) [+] 5).',
      options: ['2', '4', '5', '6'],
      correctIndex: 3,
      explanation: 'Спочатку 3 [+] 4: 3^2 + 4^2 = 9 + 16 = 25; 25 = 3 * 7 + 4, отже остача 4. Далі 4 [+] 5: 4^2 + 5^2 = 16 + 25 = 41; 41 = 5 * 7 + 6, отже остача 6.',
      errorSummary: 'Помилка в повторному взятті квадратів або у діленні з остачею на 7.',
      microVerify: {
        question: 'Яка остача від ділення 25 на 7?',
        options: ['3', '4', '5'],
        correctIndex: 1,
        hint: 'Найближче менше кратне 7 до 25 — це 21.'
      }
    },

    /* --- UKRAINIAN (5) --- */
    {
      id: 'q-ukr-57-cc',
      subjectId: 'ukrainian',
      gradeBand: 'grade-5-7',
      difficulty: 1,
      format: 'context_case',
      formatLabel: 'Контекстний кейс',
      topic: 'Фонетика, апостроф та м\'який знак',
      title: 'Орфографічний аудит апострофа',
      questionText: 'Проаналізуйте таблицю заповнення словника. У якому рядку міститься орфографічна помилка в написанні слова?',
      tableData: {
        headers: ['Рядок', 'Приклади слів', 'Заявлене правило'],
        rows: [
          ['Рядок 1', 'м\'ята, зв\'язок, п\'ятірка', 'Після губних перед я, ю, є, ї'],
          ['Рядок 2', 'свято, морквяний, цвях', 'Перед губним є інший приголосний кореня'],
          ['Рядок 3', 'бур\'ян, між\'ярусний, ін\'єкція', 'Після р / після префікса на приголосний'],
          ['Рядок 4', 'мавпячий, тьмяний, духм\'яний', 'Усі слова пишуться без апострофа']
        ]
      },
      options: ['Рядок 1', 'Рядок 2', 'Рядок 3', 'Рядок 4'],
      correctIndex: 3,
      explanation: 'У рядку 4 слово «духмяний» пишеться БЕЗ апострофа (бо перед губним «м» стоїть приголосний «х», що належить до кореня). Варіант «духм\'яний» — орфографічна помилка.',
      errorSummary: 'Помилкове вживання апострофа у слові «духмяний».',
      microVerify: {
        question: 'Як правильно пишеться прикметник, утворений від основи «дух»?',
        options: ['духмяний', 'духм\'яний', 'духмянний'],
        correctIndex: 0,
        hint: 'Порівняйте зі словами «свято», «тьмяний», «різдвяний».'
      }
    },
    {
      id: 'q-ukr-89-bug',
      subjectId: 'ukrainian',
      gradeBand: 'grade-8-9',
      difficulty: 2,
      format: 'find_the_bug',
      formatLabel: 'Знайди помилку',
      topic: 'Дієприкметникові та дієприслівникові звороти',
      title: 'Пунктуація при зворотах',
      derivationSteps: [
        '1) Вхідне речення: «Незважаючи на дощ, ми пішли в бібліотеку, і, швидко знайшовши підручники почали конспект.»',
        '2) Кома перед «і» стоїть не для поділу однорідних присудків, а відкриває дієприслівниковий зворот.',
        '3) Дієприслівниковий зворот «швидко знайшовши підручники» виділяється комою лише зліва, бо далі йде присудок.',
        '4) Граматична основа речення: «ми пішли, почали».'
      ],
      questionText: 'У якому кроці синтаксичного розбору учень зробив неправдиве твердження щодо пунктуації?',
      options: ['Крок 1', 'Крок 2', 'Крок 3', 'Крок 4'],
      correctIndex: 2,
      explanation: 'Помилка у кроці 3: дієприслівниковий зворот у середині речення обов\'язково виділяється комами з ОБОХ боків (потрібна кома після слова «підручники»).',
      errorSummary: 'Незакритий комою дієприслівниковий зворот у середині речення.',
      microVerify: {
        question: 'Де пропущено кому у фрагменті «швидко знайшовши підручники почали»?',
        options: ['Після слова «підручники»', 'Після слова «швидко»', 'Кома не потрібна'],
        correctIndex: 0,
        hint: 'Де закінчується дія, виражена дієприслівником?'
      }
    },
    {
      id: 'q-ukr-nmt-cc',
      subjectId: 'ukrainian',
      gradeBand: 'nmt-200',
      difficulty: 4,
      format: 'context_case',
      formatLabel: 'Контекстний кейс',
      topic: 'Нормативні наголоси НМТ (повний словник)',
      title: 'Орфоепічний аудит наголосів',
      questionText: 'У таблиці великою літерою позначено наголошений голосний. У якій групі ВСІ три слова мають нормативний наголос НМТ?',
      tableData: {
        headers: ['Група', 'Слово 1', 'Слово 2', 'Слово 3'],
        rows: [
          ['Група А', 'випАдок', 'добУток', 'завдАння'],
          ['Група Б', 'бюлетЕнь', 'дровА', 'зрУчний'],
          ['Група В', 'кИдати', 'літОпис', 'мЕрежа'],
          ['Група Г', 'нАчинка', 'перепИс', 'спинА']
        ]
      },
      options: ['Група А', 'Група Б', 'Група В', 'Група Г'],
      correctIndex: 1,
      explanation: 'У групі Б усі наголоси нормативні: бюлетЕнь, дровА, зрУчний. В інших групах є типові пастки: правильно вИпадок (А), мерЕжа (В), начИнка і пЕрепис (Г).',
      errorSummary: 'Порушення нормативного наголосу у словах зі списку УЦОЯО.',
      microVerify: {
        question: 'Який правильний наголос у слові «випадок» за словником НМТ?',
        options: ['вИпадок', 'випАдок', 'випадОк'],
        correctIndex: 0,
        hint: 'Пригадайте: «щасливий вИпадок».'
      }
    },
    {
      id: 'q-ukr-nmt-trap',
      subjectId: 'ukrainian',
      gradeBand: 'nmt-200',
      difficulty: 3,
      format: 'llm_trap',
      formatLabel: 'Анти-ШІ пастка',
      topic: 'Лексичні помилки, пароніми та плеоназми',
      title: 'Фільтр прихованого плеоназму',
      trapRule: 'Усі речення виглядають граматично злагодженими, проте три з них містять прихований плеоназм (смислове дублювання).',
      questionText: 'Оберіть єдине речення БЕЗ жодної лексичної або стилістичної помилки.',
      options: [
        'Перший дебют молодого інженера відбувся у травні.',
        'Пам\'ятний сувенір нагадував про поїздку до Львова.',
        'Ефективний алгоритм скоротив час обчислень утричі.',
        'Прем\'єра вистави відбулася за вільним прейскурантом цін.'
      ],
      correctIndex: 2,
      explanation: 'Слово «ефективний» (той, що дає результат) вжито точно. В інших реченнях є плеоназми: «перший дебют» (дебют уже є першим виступом), «пам\'ятний сувенір» (сувенір — річ на пам\'ять), «прейскурант цін» (прейскурант — перелік цін).',
      errorSummary: 'Невиявлений плеоназм або плутання паронімів.',
      microVerify: {
        question: 'Чому сполука «прейскурант цін» є лексичною помилкою?',
        options: [
          'Слово «прейскурант» уже означає перелік цін',
          'Слово «прейскурант» не поєднується зі словами у множині',
          'Правильно казати «прейскурант на ціни»'
        ],
        correctIndex: 0,
        hint: 'Перевірте значення іншомовного слова «прейскурант».'
      }
    },
    {
      id: 'q-ukr-oly-bug',
      subjectId: 'ukrainian',
      gradeBand: 'olympiad',
      difficulty: 5,
      format: 'find_the_bug',
      formatLabel: 'Знайди помилку',
      topic: 'Морфологічна омонімія (прислівник vs прийменник)',
      title: 'Омонімія частин мови',
      derivationSteps: [
        '1) Речення: «Навколо панувала тиша, але йти навколо озера було складно.»',
        '2) Друге слово «навколо» керує родовим відмінком іменника («озера») і є непохідним прийменником.',
        '3) Слово «але» з\'єднує частини складносурядного речення — це протиставний сполучник.',
        '4) Слово «складно» у конструкції «було складно» виступає словом категорії стану (предикативним прислівником).'
      ],
      questionText: 'У якому кроці морфологічного аналізу допущено термінологічну неточність?',
      options: ['Крок 1', 'Крок 2', 'Крок 3', 'Крок 4'],
      correctIndex: 1,
      explanation: 'Помилка у кроці 2: «навколо» у поєднанні з іменником справді є прийменником, але це ПОХІДНИЙ прийменник (утворений переходом із прислівника), а не непохідний.',
      errorSummary: 'Плутанина між похідними та непохідними (первинними) прийменниками.',
      microVerify: {
        question: 'До якої групи за походженням належить прийменник «навколо»?',
        options: ['Похідний (від прислівника)', 'Непохідний (первинний)', 'Складений сполучник'],
        correctIndex: 0,
        hint: 'Чи існує самостійне слово, від якого він утворився?'
      }
    },

    /* --- HISTORY (4) --- */
    {
      id: 'q-hist-57-vis',
      subjectId: 'history',
      gradeBand: 'grade-5-7',
      difficulty: 1,
      format: 'visual_schema',
      formatLabel: 'Візуальна схема',
      topic: 'Галицько-Волинська держава',
      title: 'Хронологія княжої доби та Січі',
      diagram: {
        type: 'timeline',
        params: {
          events: [
            { year: '988', label: 'Хрещення Русі' },
            { year: '1036', label: 'Розгром печенігів' },
            { year: '1253', label: 'Подія X' },
            { year: '1556', label: 'Січ на Малій Хортиці' }
          ],
          highlightIndex: 2
        },
        caption: 'Лінія часу: 988 -> 1036 -> 1253 (Подія X) -> 1556.'
      },
      questionText: 'Яка подія на лінії часу прихована під міткою «Подія X» (1253 рік)?',
      options: [
        'Хрещення Русі князем Володимиром',
        'Коронація Данила Романовича (Галицького)',
        'Заснування першої Січі на острові Мала Хортиця',
        'Укладення збірки законів «Руська правда»'
      ],
      correctIndex: 1,
      explanation: 'У 1253 році в Дорогочині відбулася коронація Данила Романовича (Галицького) королівською короною.',
      errorSummary: 'Зміщення хронології Галицько-Волинської держави та Київської Русі.',
      microVerify: {
        question: 'Хто заснував першу укріплену Січ на острові Мала Хортиця у 1556 році?',
        options: ['Дмитро Вишневецький (Байда)', 'Богдан Хмельницький', 'Петро Сагайдачний'],
        correctIndex: 0,
        hint: 'Волинський магнат, відомий у народних думах під прізвиськом Байда.'
      }
    },
    {
      id: 'q-hist-89-cc',
      subjectId: 'history',
      gradeBand: 'grade-8-9',
      difficulty: 3,
      format: 'context_case',
      formatLabel: 'Контекстний кейс',
      topic: 'Національно-визвольна війна 1648–1657 рр.',
      title: 'Порівняння договорів Гетьманщини',
      questionText: 'Проаналізуйте таблицю договорів середини XVII ст. На скільки зменшився козацький реєстр за Білоцерківським договором порівняно зі Зборівським і якою була територіальна умова?',
      tableData: {
        headers: ['Договір', 'Рік', 'Реєстр', 'Територія під владою гетьмана'],
        rows: [
          ['Зборівський', '1649', '40 тис.', 'Київське, Брацлавське, Чернігівське воєводства'],
          ['Білоцерківський', '1651', '20 тис.', 'Лише Київське воєводство'],
          ['Березневі статті', '1654', '60 тис.', 'Військовий союз із Московським царством'],
          ['Гадяцький', '1658', '30 тис.', 'Велике Князівство Руське у складі Речі Посполитої']
        ]
      },
      options: [
        'На 20 тис.; влада гетьмана обмежувалася лише Київським воєводством',
        'На 40 тис.; козаки втрачали всі три воєводства',
        'На 10 тис.; утворювалося Велике Князівство Руське',
        'На 20 тис.; додавалися Подільське та Волинське воєводства'
      ],
      correctIndex: 0,
      explanation: 'За Зборівським договором (1649) реєстр становив 40 тис. у 3 воєводствах, а після Берестечка за Білоцерківським (1651) — скоротився вдвічі (на 20 тис.) і поширювався лише на Київське воєводство.',
      errorSummary: 'Переплутано умови Зборівського, Білоцерківського та Гадяцького договорів.',
      microVerify: {
        question: 'Який гетьман уклав Гадяцький договір у 1658 році?',
        options: ['Іван Виговський', 'Юрій Хмельницький', 'Петро Дорошенко'],
        correctIndex: 0,
        hint: 'Наступник Богдана Хмельницького, переможець під Конотопом.'
      }
    },
    {
      id: 'q-hist-nmt-vis',
      subjectId: 'history',
      gradeBand: 'nmt-200',
      difficulty: 4,
      format: 'visual_schema',
      formatLabel: 'Візуальна схема',
      topic: 'Українська революція 1917–1921 рр. (Універсали УЦР)',
      title: 'Еволюція Універсалів УЦР',
      diagram: {
        type: 'timeline',
        params: {
          events: [
            { year: '06.1917', label: 'I Універсал' },
            { year: '07.1917', label: 'II Універсал' },
            { year: '11.1917', label: 'III Універсал' },
            { year: '01.1918', label: 'IV Універсал' }
          ],
          highlightIndex: 2
        },
        caption: 'Послідовність чотирьох Універсалів Української Центральної Ради.'
      },
      questionText: 'Яке співвідношення між III і IV Універсалами УЦР є історично точним?',
      options: [
        'III Універсал — проголошення УНР у федерації; IV Універсал — повна незалежність УНР',
        'I Універсал — проголошення УНР; III Універсал — повна незалежність УНР',
        'II Універсал — проголошення УНР; IV Універсал — автономія у складі Росії',
        'III Універсал — повна незалежність; IV Універсал — ратифікація Злуки із ЗУНР'
      ],
      correctIndex: 0,
      explanation: 'III Універсал (листопад 1917) проголосив УНР у федеративному зв\'язку з Росією, а IV Універсал (січень 1918) — самостійну, незалежну державу УНР.',
      errorSummary: 'Зміщення змісту I, III та IV Універсалів УЦР.',
      microVerify: {
        question: 'У якому місяці й році було ухвалено IV Універсал УЦР?',
        options: ['Січень 1918 року', 'Листопад 1917 року', 'Січень 1919 року'],
        correctIndex: 0,
        hint: 'Незадовго до бою під Крутами та Берестейського миру.'
      }
    },
    {
      id: 'q-hist-oly-trap',
      subjectId: 'history',
      gradeBand: 'olympiad',
      difficulty: 5,
      format: 'llm_trap',
      formatLabel: 'Анти-ШІ пастка',
      topic: 'Конституція Пилипа Орлика 1710 р. у європейському контексті',
      trapRule: 'Анахронізм-фільтр: у сучасних переказах Конституції 1710 року інколи приписують норми XIX–XX століть.',
      questionText: 'Яке положення ДІЙСНО містилося у «Пактах і Конституції прав і вольностей Війська Запорозького» 1710 року?',
      options: [
        'Поділ влади на законодавчу (Генеральна Рада), виконавчу (гетьман і старшина) та судову (Генеральний суд), і скликання Ради тричі на рік',
        'Запровадження загального рівного виборчого права для всіх мешканців обох статей від 18 років',
        'Націоналізація промислових мануфактур і законодавче закріплення 8-годинного робочого дня',
        'Утворення двопалатного парламенту з пропорційним представництвом усіх губерній'
      ],
      correctIndex: 0,
      explanation: 'Конституція Пилипа Орлика (1710) справді обмежувала гетьманську владу, окреслювала баланс між Генеральною Радою (3 сесії на рік), гетьманом і судом. Інші варіанти — анахронізми XX століття.',
      errorSummary: 'Нерозпізнавання історичного анахронізму в описі документа XVIII ст.',
      microVerify: {
        question: 'У якому місті у квітні 1710 року було проголошено Конституцію Пилипа Орлика?',
        options: ['Бендери', 'Батурин', 'Глухів'],
        correctIndex: 0,
        hint: 'Місто на Дністрі, де перебувала козацька еміграція після 1709 року.'
      }
    },

    /* --- BIOLOGY & PHYSICS (4) --- */
    {
      id: 'q-bp-57-cc',
      subjectId: 'bio-phys',
      gradeBand: 'grade-5-7',
      difficulty: 2,
      format: 'context_case',
      formatLabel: 'Контекстний кейс',
      topic: 'Густина речовини та умови плавання тіл',
      title: 'Лабораторія густини брусків',
      questionText: 'Кожен зразок у таблиці має однакову масу m = 540 г. Обчисліть густину зразка А та зразка Б (густина води 1.0 г/см^3).',
      tableData: {
        headers: ['Зразок', 'Маса (m)', 'Об\'єм (V)', 'Чи тоне у воді?'],
        rows: [
          ['Зразок А', '540 г', '200 см^3', 'Так'],
          ['Зразок Б', '540 г', '600 см^3', 'Ні'],
          ['Зразок В', '540 г', '270 см^3', 'Так']
        ]
      },
      options: [
        'А: 2.7 г/см^3, Б: 0.9 г/см^3',
        'А: 2.0 г/см^3, Б: 1.1 г/см^3',
        'А: 0.37 г/см^3, Б: 1.11 г/см^3',
        'А: 2.7 г/см^3, Б: 1.2 г/см^3'
      ],
      correctIndex: 0,
      explanation: 'За формулою rho = m / V: для А маємо 540 / 200 = 2.7 г/см^3 (> 1, тому тоне); для Б маємо 540 / 600 = 0.9 г/см^3 (< 1, тому плаває).',
      errorSummary: 'Обернено поділено об\'єм на масу замість m / V.',
      microVerify: {
        question: 'Яка формула правильно задає густину речовини?',
        options: ['rho = m / V', 'rho = m * V', 'rho = V / m'],
        correctIndex: 0,
        hint: 'Одиниці густини: г/см^3 або кг/м^3.'
      }
    },
    {
      id: 'q-bp-89-vis',
      subjectId: 'bio-phys',
      gradeBand: 'grade-8-9',
      difficulty: 3,
      format: 'visual_schema',
      formatLabel: 'Візуальна схема',
      topic: 'Закон Ома та змішане з\'єднання резисторів',
      title: 'Струм у змішаному колі',
      diagram: {
        type: 'circuit',
        params: {
          voltage: '12 В',
          resistors: [
            { label: 'R1', value: '2 Ом', mode: 'series' },
            { label: 'R2', value: '6 Ом', mode: 'parallel' },
            { label: 'R3', value: '3 Ом', mode: 'parallel' }
          ],
          target: 'I = ?'
        },
        caption: 'Джерело 12 В; R1 = 2 Ом послідовно з паралельною гілкою (R2 = 6 Ом, R3 = 3 Ом).'
      },
      questionText: 'Визначте загальну силу струму I, що виходить із джерела живлення на схемі.',
      options: ['1.5 А', '2 А', '3 А', '6 А'],
      correctIndex: 2,
      explanation: 'Опір паралельної ділянки R23 = (6 * 3) / (6 + 3) = 18 / 9 = 2 Ом. Загальний опір кола R = R1 + R23 = 2 + 2 = 4 Ом. Струм I = U / R = 12 / 4 = 3 А.',
      errorSummary: 'Пряме додавання опорів паралельної гілки (6 + 3) замість формули добутку на суму.',
      microVerify: {
        question: 'Який еквівалентний опір дають паралельно з\'єднані резистори 6 Ом і 3 Ом?',
        options: ['2 Ом', '9 Ом', '4.5 Ом'],
        correctIndex: 0,
        hint: '1/R = 1/6 + 1/3 = 3/6.'
      }
    },
    {
      id: 'q-bp-nmt-bug',
      subjectId: 'bio-phys',
      gradeBand: 'nmt-200',
      difficulty: 4,
      format: 'find_the_bug',
      formatLabel: 'Знайди помилку',
      topic: 'Молекулярна біологія: ДНК, РНК, генетичний код',
      title: 'Помилка у трансляції кодону',
      derivationSteps: [
        '1) Матричний ланцюг ДНК: 3\'-ТАЦ-ГГА-АТЦ-5\'. Транскрипція за принципом А->У, Т->А, Г->Ц, Ц->Г.',
        '2) Комплементарна молекула іРНК: 5\'-АУГ-ЦЦУ-УАГ-3\'.',
        '3) Перший триплет АУГ є старт-кодоном і кодує амінокислоту метіонін.',
        '4) Останній триплет УАГ кодує амінокислоту тирозин і подовжує поліпептидний ланцюг.'
      ],
      questionText: 'На якому кроці молекулярно-біологічного розбору допущено фактичну помилку?',
      options: ['Крок 1', 'Крок 2', 'Крок 3', 'Крок 4'],
      correctIndex: 3,
      explanation: 'Помилка у кроці 4: триплет УАГ (UAG) є одним із трьох стоп-кодонів (разом з УАА і УГА). Він сигналізує про завершення трансляції та НЕ кодує жодної амінокислоти.',
      errorSummary: 'Стоп-кодон УАГ помилково прийнято за значущий кодон амінокислоти.',
      microVerify: {
        question: 'Який нуклеотид замінює тимін (Т) у молекулі РНК?',
        options: ['Урацил (У)', 'Цитозин (Ц)', 'Гуанін (Г)'],
        correctIndex: 0,
        hint: 'Комплементарна пара для аденіну (А) в РНК.'
      }
    },
    {
      id: 'q-bp-oly-trap',
      subjectId: 'bio-phys',
      gradeBand: 'olympiad',
      difficulty: 5,
      format: 'llm_trap',
      formatLabel: 'Анти-ШІ пастка',
      topic: 'Рівновага Гарді-Вайнберга та популяційна динаміка',
      trapRule: 'Часто плутають частку рецесивного алеля q із часткою рецесивного фенотипу q^2.',
      questionText: 'У популяції, що перебуває у рівновазі Гарді-Вайнберга, рецесивний фенотип (aa) виявляється у 16% особин. Яка частка популяції є гетерозиготними носіями (Aa)?',
      options: ['32%', '40%', '48%', '84%'],
      correctIndex: 2,
      explanation: 'За умовою q^2 = 0.16, звідки частота алеля q = sqrt(0.16) = 0.4. Тоді p = 1 - 0.4 = 0.6. Частка гетерозигот Aa дорівнює 2pq = 2 * 0.6 * 0.4 = 0.48, або 48%.',
      errorSummary: 'Підстановка q^2 = 0.16 замість q = 0.4 у формулу 2pq.',
      microVerify: {
        question: 'Чому дорівнює сума частот алелів p + q у законі Гарді-Вайнберга?',
        options: ['1', '0.5', '2'],
        correctIndex: 0,
        hint: 'Усі алелі цього гена в популяції разом складають 100%.'
      }
    },

    /* --- ENGLISH (4) --- */
    {
      id: 'q-eng-57-cc',
      subjectId: 'english',
      gradeBand: 'grade-5-7',
      difficulty: 1,
      format: 'context_case',
      formatLabel: 'Контекстний кейс',
      topic: 'Present Simple vs Present Continuous',
      title: 'Аудит маркерів часу',
      questionText: 'Перевірте таблицю щоденника. У якому рядку граматичний час дієслова не відповідає маркеру часу?',
      tableData: {
        headers: ['Рядок', 'Маркер часу', 'Речення', 'Заявлений час'],
        rows: [
          ['Row 1', 'Every Tuesday', 'She goes to robotics club.', 'Present Simple'],
          ['Row 2', 'Right now', 'They are testing the drone.', 'Present Continuous'],
          ['Row 3', 'Usually', 'I am drinking tea at 8 AM.', 'Present Continuous'],
          ['Row 4', 'At the moment', 'He is reading a manual.', 'Present Continuous']
        ]
      },
      options: ['Row 1', 'Row 2', 'Row 3', 'Row 4'],
      correctIndex: 2,
      explanation: 'Маркер "Usually" позначає регулярну звичку, тому у Row 3 має бути Present Simple ("I drink tea at 8 AM"), а не Present Continuous.',
      errorSummary: 'Використано Present Continuous для регулярної звички з маркером usually.',
      microVerify: {
        question: 'Яка форма дієслова правильна зі словом "usually"?',
        options: ['I drink', 'I am drinking', 'I drank'],
        correctIndex: 0,
        hint: 'Постійний розклад чи звичка потребує простого теперішнього часу.'
      }
    },
    {
      id: 'q-eng-89-bug',
      subjectId: 'english',
      gradeBand: 'grade-8-9',
      difficulty: 2,
      format: 'find_the_bug',
      formatLabel: 'Знайди помилку',
      topic: 'First & Second Conditionals',
      title: 'Помилка у First Conditional',
      derivationSteps: [
        '1) Тестове речення: "If she will study harder, the exam will be passed easily."',
        '2) У підрядному реченні умови після "If" в First Conditional вживається форма майбутнього часу "will study".',
        '3) Головна частина ("the exam will be passed") коректно побудована у Future Simple Passive.',
        '4) Прислівник "easily" граматично правильно описує спосіб дії "be passed".'
      ],
      questionText: 'У якому кроці аналізу міститься хибне граматичне правило?',
      options: ['Крок 1', 'Крок 2', 'Крок 3', 'Крок 4'],
      correctIndex: 1,
      explanation: 'Помилка у кроці 2: в англійській мові після сполучника "if" у First Conditional не вживається "will" — потрібен Present Simple ("If she studies harder").',
      errorSummary: 'Додано "will" усередину підрядного речення умови (If-clause).',
      microVerify: {
        question: 'Оберіть правильну форму для First Conditional: "If he ___ early, we will catch the train."',
        options: ['arrives', 'will arrive', 'arrived'],
        correctIndex: 0,
        hint: 'Після If у реальному майбутньому ставимо Present Simple.'
      }
    },
    {
      id: 'q-eng-nmt-cc',
      subjectId: 'english',
      gradeBand: 'nmt-200',
      difficulty: 3,
      format: 'context_case',
      formatLabel: 'Контекстний кейс',
      topic: 'Use of English: колокації та прийменники',
      title: 'Карта пропусків Use of English',
      questionText: 'Заповніть послідовно пропуски (1)-(4) з таблиці Use of English, щоб усі чотири колокації були нормативними.',
      tableData: {
        headers: ['Пропуск', 'Контекст у реченні', 'Тип вибору'],
        rows: [
          ['(1)', '___ a decisive impact on the test score', 'make / do'],
          ['(2)', 'Results strongly depend ___ accuracy', 'прийменник'],
          ['(3)', 'Every student is capable ___ steady progress', 'прийменник'],
          ['(4)', '___ the tight deadline, the team succeeded', 'despite / although']
        ]
      },
      options: [
        'make, on, of, despite',
        'do, from, to, although',
        'make, of, for, despite',
        'do, on, of, although'
      ],
      correctIndex: 0,
      explanation: 'Стійкі норми: (1) make an impact, (2) depend on, (3) capable of, (4) despite + іменникова група ("the tight deadline").',
      errorSummary: 'Порушено дієслівну колокацію (make/do) або прийменникове керування.',
      microVerify: {
        question: 'Який прийменник завжди йде після прикметника "capable"?',
        options: ['of', 'to', 'for'],
        correctIndex: 0,
        hint: 'Capable ___ doing something.'
      }
    },
    {
      id: 'q-eng-oly-trap',
      subjectId: 'english',
      gradeBand: 'olympiad',
      difficulty: 5,
      format: 'llm_trap',
      formatLabel: 'Анти-ШІ пастка',
      topic: 'Повна та часткова інверсія (Not only / Hardly)',
      title: 'Синтаксис часткової інверсії',
      trapRule: 'Після заперечних або обмежувальних прислівників на початку речення потрібна часткова інверсія (допоміжне дієслово перед підметом) та точна парна кореляція.',
      questionText: 'Оберіть єдине речення, побудоване граматично бездоганно на рівні C1-C2.',
      options: [
        'Not only did the team verify the sensor data, but it also isolated the latency spike.',
        'Not only the team verified the sensor data, but also it isolated the latency spike.',
        'Hardly the algorithm had finished running than the power dropped.',
        'Under no circumstances you should share the verification hash publicly.'
      ],
      correctIndex: 0,
      explanation: 'У першому варіанті дотримано часткової інверсії ("Not only did the team verify..."). У другому бракує "did", у третьому хибна пара ("Hardly had ... when", а не "than" і без інверсії), у четвертому бракує "should you".',
      errorSummary: 'Відсутня інверсія допоміжного дієслова або неправильна пара для Hardly.',
      microVerify: {
        question: 'Який сполучник правильно поєднується з конструкцією "Hardly had we arrived..."?',
        options: ['when', 'than', 'that'],
        correctIndex: 0,
        hint: 'No sooner... than, але Hardly / Scarcely... ___.'
      }
    }
  ];

  /* ------------------------------------------------------------------------
     8. Universities & 20-Node Knowledge Map DAG
     ------------------------------------------------------------------------ */

  var UNIVERSITIES = [
    {
      id: 'knu',
      name: 'КНУ імені Тараса Шевченка',
      shortName: 'КНУ ім. Шевченка',
      city: 'Київ',
      faculty: 'ФІТ / Кібернетика та комп\'ютерні науки',
      targetScore: 188
    },
    {
      id: 'kpi',
      name: 'НТУУ «КПІ ім. Ігоря Сікорського»',
      shortName: 'КПІ ім. Сікорського',
      city: 'Київ',
      faculty: 'ФІОТ / Інженерія програмного забезпечення',
      targetScore: 185
    },
    {
      id: 'ucu',
      name: 'Український католицький університет',
      shortName: 'УКУ',
      city: 'Львів',
      faculty: 'Факультет прикладних наук (Computer Science)',
      targetScore: 192
    },
    {
      id: 'lpnu',
      name: 'НУ «Львівська політехніка»',
      shortName: 'Львівська політехніка',
      city: 'Львів',
      faculty: 'ІКНІ / Системи штучного інтелекту',
      targetScore: 180
    },
    {
      id: 'karazin',
      name: 'ХНУ імені В.Н. Каразіна',
      shortName: 'ХНУ ім. Каразіна',
      city: 'Харків',
      faculty: 'ФМІ / Прикладна математика та фізика',
      targetScore: 182
    }
  ];

  var KNOWLEDGE_MAP = [
    /* Math (5 nodes) */
    { id: 'km-m-frac', subjectId: 'math', gradeBand: 'grade-5-7', title: 'Дроби, відсотки та пропорції', prereqIds: [], defaultMastery: 86, weightNmt: 14, summary: 'Базові обчислення, знижки, десяткові перетворення.' },
    { id: 'km-m-lin', subjectId: 'math', gradeBand: 'grade-5-7', title: 'Лінійні рівняння та текстові задачі', prereqIds: ['km-m-frac'], defaultMastery: 82, weightNmt: 12, summary: 'Алгебраїчне моделювання простих процесів.' },
    { id: 'km-m-quad', subjectId: 'math', gradeBand: 'grade-8-9', title: 'Квадратні рівняння та нерівності', prereqIds: ['km-m-lin'], defaultMastery: 72, weightNmt: 18, summary: 'Дискримінант, Вієт, метод інтервалів.' },
    { id: 'km-m-log', subjectId: 'math', gradeBand: 'nmt-200', title: 'Логарифми, ОДЗ та похідна', prereqIds: ['km-m-quad'], defaultMastery: 58, weightNmt: 28, summary: 'Ключовий блок НМТ 180+: ОДЗ, дотична, екстремуми.' },
    { id: 'km-m-param', subjectId: 'math', gradeBand: 'olympiad', title: 'Параметри та теорія чисел', prereqIds: ['km-m-log'], defaultMastery: 44, weightNmt: 20, summary: 'Задачі на 195-200 балів і модульна арифметика.' },

    /* Ukrainian (4 nodes) */
    { id: 'km-u-orth', subjectId: 'ukrainian', gradeBand: 'grade-5-7', title: 'Апостроф, м\'який знак і фонетика', prereqIds: [], defaultMastery: 84, weightNmt: 16, summary: 'Орфографічна база без винятків-пасток.' },
    { id: 'km-u-synt', subjectId: 'ukrainian', gradeBand: 'grade-8-9', title: 'Звороти та складне речення', prereqIds: ['km-u-orth'], defaultMastery: 74, weightNmt: 22, summary: 'Пунктуація при дієприслівникових зворотах.' },
    { id: 'km-u-stress', subjectId: 'ukrainian', gradeBand: 'nmt-200', title: 'Наголоси УЦОЯО та плеоназми', prereqIds: ['km-u-synt'], defaultMastery: 62, weightNmt: 26, summary: 'Словник наголосів НМТ і редагування лексики.' },
    { id: 'km-u-hom', subjectId: 'ukrainian', gradeBand: 'olympiad', title: 'Морфологічна омонімія та стиль', prereqIds: ['km-u-stress'], defaultMastery: 48, weightNmt: 14, summary: 'Розмежування прислівників, прийменників і часток.' },

    /* History (4 nodes) */
    { id: 'km-h-rus', subjectId: 'history', gradeBand: 'grade-5-7', title: 'Київська Русь і Королівство Руське', prereqIds: [], defaultMastery: 80, weightNmt: 16, summary: '988-1253 рр., князі та перші джерела.' },
    { id: 'km-h-coss', subjectId: 'history', gradeBand: 'grade-8-9', title: 'Козацтво та договори Гетьманщини', prereqIds: ['km-h-rus'], defaultMastery: 68, weightNmt: 22, summary: 'Зборів, Біла Церква, Гадяч, Руїна.' },
    { id: 'km-h-rev', subjectId: 'history', gradeBand: 'nmt-200', title: 'Українська революція 1917–1921 рр.', prereqIds: ['km-h-coss'], defaultMastery: 59, weightNmt: 28, summary: 'Універсали УЦР, ЗУНР, Акт Злуки, персоналії.' },
    { id: 'km-h-src', subjectId: 'history', gradeBand: 'olympiad', title: 'Конституція 1710 р. і критика джерел', prereqIds: ['km-h-rev'], defaultMastery: 46, weightNmt: 14, summary: 'Верифікація правових документів та анахронізмів.' },

    /* Bio-Phys (4 nodes) */
    { id: 'km-bp-dens', subjectId: 'bio-phys', gradeBand: 'grade-5-7', title: 'Густина, рух і будова клітини', prereqIds: [], defaultMastery: 83, weightNmt: 16, summary: 'Лабораторні обчислення m/V та мікроскопія.' },
    { id: 'km-bp-ohm', subjectId: 'bio-phys', gradeBand: 'grade-8-9', title: 'Закон Ома та змішані кола', prereqIds: ['km-bp-dens'], defaultMastery: 70, weightNmt: 22, summary: 'Еквівалентний опір, послідовне й паралельне з\'єднання.' },
    { id: 'km-bp-mol', subjectId: 'bio-phys', gradeBand: 'nmt-200', title: 'ДНК, транскрипція та стоп-кодони', prereqIds: ['km-bp-ohm'], defaultMastery: 60, weightNmt: 24, summary: 'Генетичний код і молекулярні ланцюги.' },
    { id: 'km-bp-hw', subjectId: 'bio-phys', gradeBand: 'olympiad', title: 'Гарді-Вайнберг та нелінійні кола', prereqIds: ['km-bp-mol'], defaultMastery: 42, weightNmt: 16, summary: 'Частоти алелів 2pq та задачі підвищеної складності.' },

    /* English NMT (3 nodes) */
    { id: 'km-en-tense', subjectId: 'english', gradeBand: 'grade-5-7', title: 'Базові часи та маркери', prereqIds: [], defaultMastery: 85, weightNmt: 18, summary: 'Present Simple/Continuous, Past Simple.' },
    { id: 'km-en-uoe', subjectId: 'english', gradeBand: 'nmt-200', title: 'Use of English і Conditionals', prereqIds: ['km-en-tense'], defaultMastery: 67, weightNmt: 26, summary: 'Колокації, прийменники та умовні речення.' },
    { id: 'km-en-inv', subjectId: 'english', gradeBand: 'olympiad', title: 'Інверсія та академічний дискурс', prereqIds: ['km-en-uoe'], defaultMastery: 50, weightNmt: 16, summary: 'Not only did..., Hardly had... when...' }
  ];

  /* ------------------------------------------------------------------------
     9. Exam Selection, CAT Adaptive Engine & NMT 100-200 Scaler
     ------------------------------------------------------------------------ */

  function getExamQuestions(examMode, subjectId, gradeBand) {
    var mode = examMode || 'full';
    var pool = NMT_QUESTIONS.slice();

    if (mode === 'sprint') {
      var targetSubj = subjectId && subjectId !== 'all' ? subjectId : 'math';
      var subjMatches = [];
      var subjOthers = [];
      for (var i = 0; i < pool.length; i++) {
        if (pool[i].subjectId === targetSubj) {
          if (!gradeBand || pool[i].gradeBand === gradeBand) {
            subjMatches.push(pool[i]);
          } else {
            subjOthers.push(pool[i]);
          }
        }
      }
      var sprintList = subjMatches.concat(subjOthers);
      if (sprintList.length < 5) {
        for (var j = 0; j < pool.length && sprintList.length < 5; j++) {
          if (sprintList.indexOf(pool[j]) === -1) {
            sprintList.push(pool[j]);
          }
        }
      }
      return sprintList.slice(0, 5);
    }

    if (mode === 'cat') {
      if (subjectId && subjectId !== 'all') {
        var filtered = [];
        for (var k = 0; k < pool.length; k++) {
          if (pool[k].subjectId === subjectId) {
            filtered.push(pool[k]);
          }
        }
        return filtered.length >= 4 ? filtered : pool;
      }
      return pool;
    }

    // 'full' -> 10 mixed questions across subjects, prioritizing gradeBand first
    var bandMatches = [];
    var rest = [];
    for (var m = 0; m < pool.length; m++) {
      if (gradeBand && pool[m].gradeBand === gradeBand) {
        bandMatches.push(pool[m]);
      } else {
        rest.push(pool[m]);
      }
    }
    var ordered = [];
    var subjectOrder = ['math', 'ukrainian', 'history', 'bio-phys', 'english'];
    var combined = bandMatches.concat(rest);

    // Interleave across subjects for balanced 10-question full simulation
    var used = {};
    var round = 0;
    while (ordered.length < 10 && round < 5) {
      for (var s = 0; s < subjectOrder.length && ordered.length < 10; s++) {
        var sid = subjectOrder[s];
        for (var c = 0; c < combined.length; c++) {
          var q = combined[c];
          if (!used[q.id] && q.subjectId === sid) {
            ordered.push(q);
            used[q.id] = true;
            break;
          }
        }
      }
      round++;
    }
    for (var r = 0; r < combined.length && ordered.length < 10; r++) {
      if (!used[combined[r].id]) {
        ordered.push(combined[r]);
        used[combined[r].id] = true;
      }
    }
    return ordered.slice(0, 10);
  }

  function selectNextCatQuestion(pool, usedIds, targetDifficulty) {
    var list = Array.isArray(pool) && pool.length ? pool : NMT_QUESTIONS;
    var usedMap = {};
    if (Array.isArray(usedIds)) {
      for (var i = 0; i < usedIds.length; i++) {
        usedMap[usedIds[i]] = true;
      }
    }
    var target = typeof targetDifficulty === 'number' ? Math.max(1, Math.min(5, targetDifficulty)) : 3;

    var bestQuestion = null;
    var bestDistance = 999;

    for (var j = 0; j < list.length; j++) {
      var q = list[j];
      if (usedMap[q.id]) continue;
      var dist = Math.abs((q.difficulty || 3) - target);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestQuestion = q;
      }
    }
    return bestQuestion;
  }

  function convertRawToNmt(correctCount, totalCount) {
    if (!totalCount || totalCount <= 0 || !correctCount || correctCount <= 0) {
      return 100;
    }
    var ratio = Math.max(0, Math.min(1, correctCount / totalCount));
    if (ratio >= 1) return 200;
    if (ratio < 0.12) return 100;
    // Official-inspired non-linear UCEQA scaling curve mapped smoothly to 100..200
    var normalized = (ratio - 0.12) / 0.88;
    var curved = Math.pow(normalized, 0.85);
    var score = Math.round(100 + curved * 100);
    return Math.max(100, Math.min(200, score));
  }

  /* ------------------------------------------------------------------------
     10. Public Export
     ------------------------------------------------------------------------ */

  global.StrictCurriculum = {
    LANGUAGES: LANGUAGES,
    CEFR_LEVELS: CEFR_LEVELS,
    ROLEPLAY_SCENARIOS: ROLEPLAY_SCENARIOS,
    GRADE_BANDS: GRADE_BANDS,
    SUBJECTS: SUBJECTS,
    EXAM_SUBJECTS: EXAM_SUBJECTS,
    PERSONAS: PERSONAS,
    NMT_QUESTIONS: NMT_QUESTIONS,
    UNIVERSITIES: UNIVERSITIES,
    KNOWLEDGE_MAP: KNOWLEDGE_MAP,
    getTopicsFor: getTopicsFor,
    getPersona: getPersona,
    generateTutorReply: generateTutorReply,
    getExamQuestions: getExamQuestions,
    selectNextCatQuestion: selectNextCatQuestion,
    convertRawToNmt: convertRawToNmt
  };
})(typeof window !== 'undefined' ? window : globalThis);
