/**
 * StrictAI — Tutor Studio Controller ("Панда-репетитор")
 * Handles sidebar settings, avatar synchronization, reactive chat stream,
 * speech recognition/synthesis, interactive quiz cards, and Socratic reviews.
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
      this.persona = 'friend';
      this.voiceEnabled = true;
      this.voiceGender = 'female';
      this.isLessonStarted = false;
      this.isVoiceRecording = false;
      this.speechRecognition = null;
      this.whiteboardOpen = false;
      this.messageCount = 0;

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

      // 2. Cache DOM Elements
      this._cacheDom();

      // 3. Load State from StrictStore
      this._loadInitialState();

      // 4. Initialize Red Panda Avatar
      this._initAvatar();

      // 5. Initialize Speech Recognition
      this._initSpeechRecognition();

      // 6. Bind Event Listeners
      this._bindEvents();

      // 7. Subscribe to global Store changes (parental lock, coins, streak)
      this._subscribeStore();

      // 8. Check for pending mistake review from NMT page or query params
      this._checkPendingMistakes();

      // 9. Initial UI Render
      this._renderAllSettings();
      this._renderWhiteboardFormulas();

      console.log('StrictAI Tutor Studio successfully initialized.');
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
        tutorStatusTitle: document.getElementById('tutor-status-title'),
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

        // Viewport & Messages
        viewport: document.getElementById('tutor-chat-viewport'),
        welcomeScreen: document.getElementById('tutor-welcome-screen'),
        startLessonBtn: document.getElementById('start-lesson-btn'),
        messagesList: document.getElementById('tutor-messages-list'),

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
        btnCopyScratchpad: document.getElementById('btn-copy-scratchpad')
      };
    }

    _loadInitialState() {
      if (!window.StrictStore) return;
      const st = window.StrictStore.get();
      const urlParams = new URLSearchParams(window.location.search);
      const hasUrlParams = urlParams.has('subject') || urlParams.has('topic') || urlParams.has('mode') || urlParams.has('review') || urlParams.has('reviewMistake') || urlParams.has('pendingMistakeReview');

      if (!hasUrlParams && (!st.tutor || !st.tutor.pendingMistakeReview)) {
        // Default clean state matching user mockup screenshot: Англійська, A1, Добрий друг
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

        // Check language name mapping
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

        // Check subject name mapping
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

      // Check Parental Lock
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

      // 6. Persona Cards
      const personaCards = document.querySelectorAll('#persona-selector-grid .persona-card');
      personaCards.forEach(card => {
        card.onclick = () => {
          const personaId = card.dataset.persona;
          this.setPersona(personaId);
        };
      });

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

      // 8. Start Lesson Button
      if (this.dom.startLessonBtn) {
        this.dom.startLessonBtn.onclick = () => this.startLesson();
      }

      // 9. Quick Action Chips
      if (this.dom.chipsBar) {
        this.dom.chipsBar.onclick = (e) => {
          const btn = e.target.closest('.chip-btn');
          if (!btn) return;
          const action = btn.dataset.action;
          this.handleQuickAction(action);
        };
      }

      // 10. Voice Record Button
      if (this.dom.voiceInputBtn) {
        this.dom.voiceInputBtn.onclick = () => this.toggleVoiceRecording();
      }

      // 11. Send Message Button & Enter Key
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

      // 12. Scratchpad Actions
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

      // Check URL search params (e.g. from nmt.html, knowledge.html, parents.html)
      const urlParams = new URLSearchParams(window.location.search);
      const isReviewParam = urlParams.get('review') === '1' || urlParams.get('reviewMistake') || urlParams.get('pendingMistakeReview');

      // 1. Mistake Review Mode (NMT Mistakes Review)
      if (mistake || isReviewParam) {
        const mistakeData = mistake || (st.nmt && st.nmt.mistakesQueue ? st.nmt.mistakesQueue[0] : null);
        if (mistakeData) {
          // Switch to School / NMT mode and the corresponding subject
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

          // Start lesson with Socratic review automatically
          setTimeout(() => {
            this.startLessonWithMistakeReview(mistakeData);
          }, 350);
          return;
        }
      }

      // 2. Navigation from Knowledge Map (knowledge.html) or Parent Quests (parents.html)
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
    // UI State Setters & Renderers
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

      // Dynamic Level Description
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

      // Dynamic Goal Description
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

    _renderStatusTitle() {
      const personaNames = {
        friend: 'Добрий друг',
        strict: 'Суворий викладач',
        joker: 'Жартівник',
        motivator: 'Мотиватор',
        calm: 'Спокійний ментор'
      };

      const languageUkrainianNames = {
        english: 'Англійська',
        deutsch: 'Німецька',
        espanol: 'Іспанська',
        chinese: 'Китайська',
        ukrainian: 'Українська'
      };

      if (this.mode === 'languages') {
        const langUkr = languageUkrainianNames[this.language] || this.languageName;
        if (this.dom.statusSubjectText) this.dom.statusSubjectText.textContent = langUkr;
        if (this.dom.statusLevelText) this.dom.statusLevelText.textContent = this.level;
        if (this.dom.statusModeBadge) this.dom.statusModeBadge.textContent = 'Мови';
      } else {
        if (this.dom.statusSubjectText) this.dom.statusSubjectText.textContent = this.subjectName;
        if (this.dom.statusLevelText) this.dom.statusLevelText.textContent = this.goalName;
        if (this.dom.statusModeBadge) this.dom.statusModeBadge.textContent = 'Предмети НМТ';
      }

      if (this.dom.statusPersonaText) {
        this.dom.statusPersonaText.textContent = personaNames[this.persona] || 'Добрий друг';
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

      // Controls State
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
      if (!this.voiceEnabled && window.PandaAvatar) {
        window.PandaAvatar.stopSpeaking();
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
        // Map language code based on current subject
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
    // Lesson & Chat Flow
    // =========================================================================

    startLesson() {
      this.isLessonStarted = true;
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

      // Generate Persona Greeting
      const greetingText = this._generateInitialGreeting();
      this.appendMessage({
        sender: 'tutor',
        text: greetingText,
        type: 'text'
      });

      if (this.dom.presenceText) {
        this.dom.presenceText.textContent = 'Урок триває • Активна сесія';
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

    restartLesson() {
      if (window.StrictComponents) {
        window.StrictComponents.playBeep('click');
      }
      if (confirm('Бажаєте перезапустити урок та очистити поточний діалог?')) {
        this.startLesson();
        if (window.StrictComponents) {
          window.StrictComponents.toast('Розпочато новий урок!', 'info');
        }
      }
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
        this.startLesson();
      }

      // Append student message
      this.appendMessage({
        sender: 'user',
        text: text,
        type: 'text'
      });

      this.dom.userInput.value = '';

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
      }, 700);
    }

    _finishPandaReply(replyText) {
      if (this.dom.presenceText) {
        this.dom.presenceText.textContent = 'Панда готова до уроку';
      }
      if (window.PandaAvatar) {
        window.PandaAvatar.setState('idle');
      }

      this.appendMessage({
        sender: 'tutor',
        text: replyText,
        type: 'text'
      });

      // Track study engagement & award focus minutes
      this.messageCount++;
      if (this.messageCount % 3 === 0 && window.StrictStore) {
        const subName = this.mode === 'languages' ? this.languageName : this.subjectName;
        window.StrictStore.addFocusMinutes(3, subName);
      }
    }

    _synthesizeAutonomousResponse(userText, activeKey) {
      const lower = userText.toLowerCase();
      const content = window.StrictTutorData ? window.StrictTutorData.getSubjectContent(activeKey) : null;
      const tone = window.StrictTutorData ? window.StrictTutorData.personaTones[this.persona] : null;

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

      // Natural response based on persona
      if (this.persona === 'strict') {
        return `Ваше формулювання прийнято. У контексті теми **«${this.mode === 'languages' ? this.languageName : this.subjectName}»** важливо пам’ятати: будь-яке твердження має спиратися на правило або теорему. Пропоную виконати перевірочну вправу для контролю засвоєння.`;
      } else if (this.persona === 'joker') {
        return `О, ловлю твою думку на льоту! 🚀 Якби ця тема була піцою, ти щойно відкусив найсмачніший шматочок з сирним бортиком! Натискай кнопку «Дай вправу», щоб закріпити цей тріумф!`;
      } else if (this.persona === 'motivator') {
        return `Відмінний хід думок! 🔥 Ти бачиш суть завдання і не боїшся заглиблюватися в деталі. Саме так куються 200 балів на НМТ! Продовжуємо штурм вершин — давай ще одну вправу!`;
      } else if (this.persona === 'calm') {
        return `Дуже ясна та виважена репліка. 🧘 Коли розум спокійний, інформація вкладається у довготривалу пам’ять значно надійніше. Зробимо ще один крок уперед?`;
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
        calm: 'Ти спокійний дзен-ментор Червона Панда, навчаєш повільно, без поспіху й тривоги.'
      };

      const systemPrompt = `Ти — ${personaInstructions[this.persona] || personaInstructions.friend}. Предмет: ${this.mode === 'languages' ? this.languageName : this.subjectName}. Рівень/Клас: ${this.mode === 'languages' ? this.level : this.goalName}. Відповідай виключно природною українською мовою з літературною точністю. Використовуй сократівський підхід.`;

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
        this.startLesson();
      }

      const activeKey = this.mode === 'languages' ? this.language : this.subject;
      const content = window.StrictTutorData ? window.StrictTutorData.getSubjectContent(activeKey) : null;
      if (!content) return;

      if (action === 'exercise') {
        // Send interactive quiz
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
        // Send rule explanation
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
    // Message Rendering & Speech
    // =========================================================================

    appendMessage({ sender, text, htmlExtra = '', type = 'text', mistakeMeta = null }) {
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
          </div>
          ${speakBtnHtml}
        </div>
      `;

      // Hook up Speak button
      if (sender === 'tutor') {
        const speakBtn = row.querySelector('.btn-speak-msg');
        if (speakBtn) {
          speakBtn.onclick = () => {
            const cleanText = text.replace(/<[^>]*>/g, '').replace(/[*#`_]/g, '');
            if (window.PandaAvatar && window.PandaAvatar.isSpeaking) {
              window.PandaAvatar.stopSpeaking();
              speakBtn.innerHTML = '<span>🔊</span> <span>Озвучити</span>';
            } else if (window.PandaAvatar) {
              speakBtn.innerHTML = '<span>⏹</span> <span>Зупинити</span>';
              let speechLang = 'uk-UA';
              if (this.mode === 'languages') {
                if (this.language === 'english') speechLang = 'en-US';
                else if (this.language === 'deutsch') speechLang = 'de-DE';
                else if (this.language === 'espanol') speechLang = 'es-ES';
                else if (this.language === 'chinese') speechLang = 'zh-CN';
              }
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
      }

      this.dom.messagesList.appendChild(row);
      this._scrollToBottom();

      // Trigger automatic TTS if enabled
      if (sender === 'tutor' && this.voiceEnabled && window.PandaAvatar) {
        const cleanText = text.replace(/<[^>]*>/g, '').replace(/[*#`_]/g, '');
        let speechLang = 'uk-UA';
        if (this.mode === 'languages') {
          if (this.language === 'english') speechLang = 'en-US';
          else if (this.language === 'deutsch') speechLang = 'de-DE';
          else if (this.language === 'espanol') speechLang = 'es-ES';
          else if (this.language === 'chinese') speechLang = 'zh-CN';
        }
        window.PandaAvatar.speak(cleanText, {
          persona: this.persona,
          gender: this.voiceGender,
          lang: speechLang
        });
      }
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

      // Bind Quiz Option Click Handlers
      setTimeout(() => {
        const cardEl = this.dom.messagesList.querySelector(`#quiz-${quizObj.id || Date.now()}`) ||
                       this.dom.messagesList.querySelector('.quiz-card:last-child');
        if (!cardEl) return;

        const optionBtns = cardEl.querySelectorAll('.quiz-option-btn');
        const feedbackBox = cardEl.querySelector('.quiz-feedback-box');

        optionBtns.forEach(btn => {
          btn.onclick = () => {
            // Disable all buttons in this quiz card
            optionBtns.forEach(b => b.disabled = true);

            const isCorrect = btn.dataset.correct === 'true';
            btn.classList.add(isCorrect ? 'correct' : 'wrong');

            // Find and highlight correct answer
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
      // Headings
      out = out.replace(/^### (.*$)/gim, '<h4>$1</h4>');
      out = out.replace(/^## (.*$)/gim, '<h4>$1</h4>');
      // Bold & Italic
      out = out.replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>');
      out = out.replace(/\*(.*?)\*/gim, '<i>$1</i>');
      // Blockquotes
      out = out.replace(/^> (.*$)/gim, '<blockquote style="border-left: 3px solid var(--accent-primary); padding-left: 10px; margin: 8px 0; color: var(--text-secondary);">$1</blockquote>');
      // Inline Code
      out = out.replace(/`(.*?)`/gim, '<code>$1</code>');
      // Newlines to <br> or paragraphs
      out = out.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
      return out;
    }

    _scrollToBottom() {
      if (this.dom.viewport) {
        this.dom.viewport.scrollTop = this.dom.viewport.scrollHeight;
      }
    }

    // =========================================================================
    // Store Sync Helpers
    // =========================================================================

    _syncStoreCategory() {
      if (!window.StrictStore) return;
      window.StrictStore.update(st => ({
        tutor: {
          ...st.tutor,
          category: this.mode === 'school' ? 'nmt' : 'languages'
        }
      }));
    }

    _syncStoreLanguage() {
      if (!window.StrictStore) return;
      window.StrictStore.update(st => ({
        tutor: {
          ...st.tutor,
          language: this.languageName
        }
      }));
    }

    _syncStoreLevel() {
      if (!window.StrictStore) return;
      window.StrictStore.update(st => ({
        tutor: {
          ...st.tutor,
          level: this.level
        }
      }));
    }

    _syncStoreSubject() {
      if (!window.StrictStore) return;
      window.StrictStore.update(st => ({
        tutor: {
          ...st.tutor,
          nmtSubject: this.subjectName
        }
      }));
    }

    _syncStorePersona() {
      if (!window.StrictStore) return;
      window.StrictStore.update(st => ({
        tutor: {
          ...st.tutor,
          persona: this.persona
        }
      }));
    }

    _syncStoreVoice() {
      if (!window.StrictStore) return;
      window.StrictStore.update(st => ({
        tutor: {
          ...st.tutor,
          voiceEnabled: this.voiceEnabled,
          voiceGender: this.voiceGender
        }
      }));
    }
  }

  // Instantiate and mount on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    window.StrictTutorController = new StrictTutorController();
    window.StrictTutorController.init();
  });

})();
