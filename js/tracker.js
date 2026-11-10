/**
 * StrictAI — Focus Tracker & Discipline Controller (tracker.js)
 * Implements strict timer logic, distraction detection, 7-day activity chart,
 * daily quests, and live synchronization with Red Panda Avatar & StrictStore.
 */

(function () {
  'use strict';

  // Constants & Initial Configurations
  const CIRCLE_CIRCUMFERENCE = 753.98; // 2 * Math.PI * 120

  const MODES_CONFIG = {
    pomodoro25: { seconds: 1500, label: 'Помодоро Спринт (25 хв)', defaultCoins: 25 },
    deep45: { seconds: 2700, label: 'Глибоке занурення (45 хв)', defaultCoins: 45 },
    exam60: { seconds: 3600, label: 'Марафон НМТ (60 хв)', defaultCoins: 60 }
  };

  const SUBJECT_ICONS = {
    'Математика': '📐',
    'Українська мова': '🇺🇦',
    'Історія України': '📜',
    'Англійська мова': '🇬🇧',
    'Домашнє завдання': '📚'
  };

  class StrictTrackerController {
    constructor() {
      this.timerInterval = null;
      this.currentMode = 'pomodoro25';
      this.selectedSubject = 'Математика';
      this.totalDuration = 1500;
      this.secondsLeft = 1500;
      this.isRunning = false;
      this.isPaused = false;
      this.sessionStartTime = null;
      this.sessionDistractionCount = 0;
      this.sessionLogs = [];

      // DOM Elements cache
      this.els = {};

      document.addEventListener('DOMContentLoaded', () => this.init());
    }

    init() {
      // 1. Initialize Global Header & Anti-Distraction Guard
      if (window.StrictComponents) {
        window.StrictComponents.initPage('tracker');
      }

      this._cacheElements();
      this._bindEvents();
      this._loadInitialState();
      this._initPandaSupervisor();
      this._renderDailyQuests();
      this._renderWeeklyChart();
      this._renderEventLogs();

      // Subscribe to reactive store changes (e.g. from parent tab switches or other tabs)
      if (window.StrictStore) {
        window.StrictStore.subscribe((state) => {
          this._handleStoreUpdate(state);
        });
      }
    }

    _cacheElements() {
      this.els = {
        topFocusTime: document.getElementById('top-focus-time'),
        topTabSwitches: document.getElementById('top-tab-switches'),
        topCoins: document.getElementById('top-coins'),
        sessionStatusBadge: document.getElementById('session-status-badge'),
        modeButtons: document.querySelectorAll('.mode-card-btn'),
        subjectPills: document.querySelectorAll('.subject-pill'),
        progressRing: document.getElementById('timer-progress-ring'),
        displayDigits: document.getElementById('timer-display-digits'),
        activeSubjectBadge: document.getElementById('timer-active-subject'),
        stateDesc: document.getElementById('timer-state-desc'),
        startToggleBtn: document.getElementById('timer-start-toggle-btn'),
        startBtnLabel: document.getElementById('start-btn-label'),
        resetBtn: document.getElementById('timer-reset-btn'),
        simulateBlurBtn: document.getElementById('timer-simulate-blur-btn'),
        questList: document.getElementById('quest-items-list'),
        newQuestInput: document.getElementById('new-quest-input'),
        addQuestBtn: document.getElementById('add-quest-btn'),
        pandaContainer: document.getElementById('tracker-panda-container'),
        pandaQuote: document.getElementById('panda-supervisor-quote'),
        pandaSupervisorName: document.getElementById('panda-supervisor-name'),
        pandaVoiceBtn: document.getElementById('panda-speak-voice-btn'),
        strictLockBanner: document.getElementById('strict-persona-lock-banner'),
        eventsFeed: document.getElementById('tracker-events-feed'),
        clearLogBtn: document.getElementById('clear-session-log-btn'),
        weeklyChartBars: document.getElementById('weekly-chart-bars'),
        weeklyTotalMins: document.getElementById('weekly-total-mins'),
        chartDailyNormLabel: document.getElementById('chart-daily-norm-label')
      };
    }

    _bindEvents() {
      // Mode buttons selection
      this.els.modeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          if (this.isRunning) {
            if (!confirm('Фокус-сесія активна! Зміна режиму перерве поточний таймер. Продовжити?')) {
              return;
            }
            this.stopSession(false);
          }

          this.els.modeButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          this.currentMode = btn.dataset.mode;
          this.totalDuration = parseInt(btn.dataset.seconds, 10) || 1500;
          this.secondsLeft = this.totalDuration;

          this._updateTimerDisplay();
          this._setPandaQuote('ready');
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
        });
      });

      // Subject pills selection
      this.els.subjectPills.forEach((pill) => {
        pill.addEventListener('click', () => {
          this.els.subjectPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.selectedSubject = pill.dataset.subject;

          const icon = SUBJECT_ICONS[this.selectedSubject] || '📚';
          if (this.els.activeSubjectBadge) {
            this.els.activeSubjectBadge.innerHTML = `<span>${icon}</span><span>${this.selectedSubject}</span>`;
          }

          if (this.isRunning) {
            this.logEvent('info', `Предмет змінено на: ${this.selectedSubject}`);
          }
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
        });
      });

      // Start / Pause toggle
      if (this.els.startToggleBtn) {
        this.els.startToggleBtn.addEventListener('click', () => {
          if (!this.isRunning) {
            this.startSession();
          } else if (this.isPaused) {
            this.resumeSession();
          } else {
            this.pauseSession();
          }
        });
      }

      // Reset / Stop early button
      if (this.els.resetBtn) {
        this.els.resetBtn.addEventListener('click', () => {
          if (!this.isRunning && this.secondsLeft === this.totalDuration) {
            if (window.StrictComponents) {
              window.StrictComponents.toast('Таймер вже скинуто до початкового стану.', 'info');
            }
            return;
          }

          const elapsedSecs = this.totalDuration - this.secondsLeft;
          if (elapsedSecs >= 60) {
            if (confirm(`Завершити поточну сесію та зберегти ${Math.round(elapsedSecs / 60)} хв фокусу?`)) {
              this.completeSession(true);
            }
          } else {
            if (confirm('Скинути сесію без збереження (минуло менше ніж 1 хв)?')) {
              this.stopSession(false);
            }
          }
        });
      }

      // Simulation of Tab Blur / Distraction button
      if (this.els.simulateBlurBtn) {
        this.els.simulateBlurBtn.addEventListener('click', () => {
          this.triggerDistractionSimulation();
        });
      }

      // Add custom quest
      if (this.els.addQuestBtn && this.els.newQuestInput) {
        this.els.addQuestBtn.addEventListener('click', () => this._handleAddNewQuest());
        this.els.newQuestInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') this._handleAddNewQuest();
        });
      }

      // Panda voice read aloud
      if (this.els.pandaVoiceBtn && this.els.pandaQuote) {
        this.els.pandaVoiceBtn.addEventListener('click', () => {
          const text = this.els.pandaQuote.textContent.trim();
          if (window.PandaAvatar) {
            window.PandaAvatar.speak(text);
          }
        });
      }

      // Clear session logs
      if (this.els.clearLogBtn) {
        this.els.clearLogBtn.addEventListener('click', () => {
          this.sessionLogs = [];
          this._renderEventLogs();
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
        });
      }
    }

    _loadInitialState() {
      const store = window.StrictStore ? window.StrictStore.get() : null;
      if (!store) return;

      const dailyGoal = store.tracker.dailyGoalMinutes || 90;
      const todayMins = store.tracker.focusMinutesToday || 0;
      const switchesToday = store.tracker.tabSwitchesToday || 0;
      const maxSwitches = store.parental.maxAllowedTabSwitches || 3;

      if (this.els.topFocusTime) {
        this.els.topFocusTime.textContent = `${todayMins} / ${dailyGoal} хв`;
      }
      if (this.els.topTabSwitches) {
        this.els.topTabSwitches.textContent = `${switchesToday} / ${maxSwitches}`;
        this.els.topTabSwitches.style.color = switchesToday > maxSwitches ? 'var(--accent-danger)' : 'var(--accent-warning)';
      }
      if (this.els.topCoins) {
        this.els.topCoins.textContent = `+${store.student.bambooCoins || 340} 🎋`;
      }
      if (this.els.chartDailyNormLabel) {
        this.els.chartDailyNormLabel.textContent = `Норма: ${dailyGoal} хв/день`;
      }

      // Parental strict persona lock indicator
      if (store.parental && store.parental.strictLockPersona) {
        if (this.els.strictLockBanner) this.els.strictLockBanner.style.display = 'block';
      }

      // Check if session was active in store
      if (store.tracker.isSessionActive && store.tracker.sessionSecondsLeft) {
        this.secondsLeft = store.tracker.sessionSecondsLeft;
        this.totalDuration = MODES_CONFIG[store.tracker.sessionMode]?.seconds || 1500;
        this.currentMode = store.tracker.sessionMode || 'pomodoro25';
        this.startSession(true);
      } else {
        this._updateTimerDisplay();
      }
    }

    _initPandaSupervisor() {
      if (!window.PandaAvatar || !this.els.pandaContainer) return;

      const store = window.StrictStore ? window.StrictStore.get() : null;
      let personaId = store ? store.tutor.persona : 'friend';

      // If parental lock is on, enforce strict teacher persona
      if (store && store.parental && store.parental.strictLockPersona) {
        personaId = 'strict';
      }

      const meta = window.StrictStore ? window.StrictStore.getPersonaMeta(personaId) : { name: 'Панда-наставник' };
      if (this.els.pandaSupervisorName) {
        this.els.pandaSupervisorName.textContent = `${meta.name} (${meta.badge || 'Наставник'})`;
      }

      window.PandaAvatar.render(this.els.pandaContainer, {
        persona: personaId,
        state: 'idle',
        accessory: store ? store.student.equippedAccessory : 'glasses'
      });
    }

    _handleStoreUpdate(state) {
      const dailyGoal = state.tracker.dailyGoalMinutes || 90;
      const todayMins = state.tracker.focusMinutesToday || 0;
      const switchesToday = state.tracker.tabSwitchesToday || 0;
      const maxSwitches = state.parental.maxAllowedTabSwitches || 3;

      if (this.els.topFocusTime) {
        this.els.topFocusTime.textContent = `${todayMins} / ${dailyGoal} хв`;
      }
      if (this.els.topTabSwitches) {
        this.els.topTabSwitches.textContent = `${switchesToday} / ${maxSwitches}`;
        this.els.topTabSwitches.style.color = switchesToday > maxSwitches ? 'var(--accent-danger)' : 'var(--accent-warning)';
      }
      if (this.els.topCoins) {
        this.els.topCoins.textContent = `${state.student.bambooCoins || 340} 🎋`;
      }

      // Parental strict persona lock indicator
      if (this.els.strictLockBanner) {
        this.els.strictLockBanner.style.display = state.parental.strictLockPersona ? 'block' : 'none';
      }

      // If new tab switches occurred while running, register visual alert
      if (this.isRunning && state.tracker.sessionTabSwitches > this.sessionDistractionCount) {
        this.sessionDistractionCount = state.tracker.sessionTabSwitches;
        this._onTabDistractionDetected('Перемикання вкладки під час активного фокусу');
      }

      this._renderWeeklyChart();
    }

    // ==================== TIMER CORE LOGIC ====================

    startSession(isResumeFromStore = false) {
      this.isRunning = true;
      this.isPaused = false;
      this.sessionStartTime = Date.now();
      this.sessionDistractionCount = 0;

      // Update UI button states
      if (this.els.startToggleBtn) {
        this.els.startToggleBtn.className = 'btn btn-secondary btn-timer-primary';
      }
      if (this.els.startBtnLabel) {
        this.els.startBtnLabel.textContent = 'Призупинити сесію';
      }
      if (this.els.sessionStatusBadge) {
        this.els.sessionStatusBadge.className = 'bento-badge green';
        this.els.sessionStatusBadge.textContent = '● Сесія активна';
      }
      if (this.els.stateDesc) {
        this.els.stateDesc.className = 'timer-state-label active';
        this.els.stateDesc.textContent = 'Сесія активна — вкладка під контролем';
      }
      if (this.els.progressRing) {
        this.els.progressRing.classList.add('strict-active');
        this.els.progressRing.classList.remove('warning-distracted');
      }

      // Sync active state with global store
      if (window.StrictStore) {
        window.StrictStore.update({
          tracker: {
            isSessionActive: true,
            sessionMode: this.currentMode,
            sessionSecondsLeft: this.secondsLeft,
            sessionTabSwitches: 0
          }
        });
      }

      // Panda reaction
      if (window.PandaAvatar) {
        window.PandaAvatar.setState('idle');
      }
      this._setPandaQuote('focus');

      if (!isResumeFromStore) {
        this.logEvent('start', `Старт фокус-сесії: ${MODES_CONFIG[this.currentMode]?.label || this.currentMode} (${this.selectedSubject})`);
        if (window.StrictComponents) {
          window.StrictComponents.playBeep('success');
          window.StrictComponents.toast(`Фокус-сесію розпочато! Панда пильнує твою вкладку. Предмет: ${this.selectedSubject}.`, 'success');
        }
      }

      // Clear any previous interval
      clearInterval(this.timerInterval);

      // Start countdown interval
      this.timerInterval = setInterval(() => {
        this.tick();
      }, 1000);

      this._updateTimerDisplay();
    }

    pauseSession() {
      if (!this.isRunning || this.isPaused) return;

      this.isPaused = true;
      clearInterval(this.timerInterval);

      if (this.els.startToggleBtn) {
        this.els.startToggleBtn.className = 'btn btn-primary btn-timer-primary';
      }
      if (this.els.startBtnLabel) {
        this.els.startBtnLabel.textContent = '▶ Продовжити';
      }
      if (this.els.sessionStatusBadge) {
        this.els.sessionStatusBadge.className = 'bento-badge orange';
        this.els.sessionStatusBadge.textContent = '❚❚ На паузі';
      }
      if (this.els.stateDesc) {
        this.els.stateDesc.className = 'timer-state-label paused';
        this.els.stateDesc.textContent = 'Сесію призупинено';
      }

      // Sync with store
      if (window.StrictStore) {
        window.StrictStore.update({
          tracker: {
            sessionSecondsLeft: this.secondsLeft
          }
        });
      }

      // Panda reaction
      if (window.PandaAvatar) {
        window.PandaAvatar.setState('thinking');
      }
      this._setPandaQuote('pause');
      this.logEvent('pause', `Пауза сесії (залишилося ${this._formatMinutes(this.secondsLeft)})`);

      if (window.StrictComponents) {
        window.StrictComponents.playBeep('click');
      }
    }

    resumeSession() {
      if (!this.isRunning || !this.isPaused) return;

      this.isPaused = false;

      if (this.els.startToggleBtn) {
        this.els.startToggleBtn.className = 'btn btn-secondary btn-timer-primary';
      }
      if (this.els.startBtnLabel) {
        this.els.startBtnLabel.textContent = 'Призупинити сесію';
      }
      if (this.els.sessionStatusBadge) {
        this.els.sessionStatusBadge.className = 'bento-badge green';
        this.els.sessionStatusBadge.textContent = '● Сесія активна';
      }
      if (this.els.stateDesc) {
        this.els.stateDesc.className = 'timer-state-label active';
        this.els.stateDesc.textContent = 'Сесія активна — вкладка під контролем';
      }

      // Panda reaction
      if (window.PandaAvatar) {
        window.PandaAvatar.setState('idle');
      }
      this._setPandaQuote('focus');
      this.logEvent('info', `Сесію відновлено`);

      this.timerInterval = setInterval(() => {
        this.tick();
      }, 1000);

      if (window.StrictComponents) {
        window.StrictComponents.playBeep('click');
      }
    }

    tick() {
      if (this.secondsLeft > 0) {
        this.secondsLeft--;
        this._updateTimerDisplay();

        // Update document title dynamically
        const m = Math.floor(this.secondsLeft / 60).toString().padStart(2, '0');
        const s = (this.secondsLeft % 60).toString().padStart(2, '0');
        document.title = `[${m}:${s}] ${this.selectedSubject} • StrictAI Focus`;

        // Periodically sync seconds left (every 5 seconds) to avoid localStorage thrashing
        if (this.secondsLeft % 5 === 0 && window.StrictStore) {
          window.StrictStore.update({
            tracker: {
              sessionSecondsLeft: this.secondsLeft
            }
          });
        }
      } else {
        // Natural countdown completion
        this.completeSession(false);
      }
    }

    completeSession(earlySave = false) {
      clearInterval(this.timerInterval);
      this.isRunning = false;
      this.isPaused = false;

      const elapsedSeconds = this.totalDuration - this.secondsLeft;
      const completedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

      // Calculate earned bamboo coins: 1 coin per 2 minutes, minimum 10 bonus
      const baseCoins = MODES_CONFIG[this.currentMode]?.defaultCoins || 25;
      const earnedCoins = earlySave ? Math.max(5, Math.floor(completedMinutes / 2)) : baseCoins;

      // Update store
      if (window.StrictStore) {
        window.StrictStore.addFocusMinutes(completedMinutes, this.selectedSubject);
        window.StrictStore.update({
          tracker: {
            isSessionActive: false,
            sessionSecondsLeft: this.totalDuration,
            sessionTabSwitches: 0
          }
        });
      }

      // UI updates
      this._resetTimerUI();
      if (this.els.sessionStatusBadge) {
        this.els.sessionStatusBadge.className = 'bento-badge green';
        this.els.sessionStatusBadge.textContent = '✓ Спринт завершено!';
      }
      if (this.els.stateDesc) {
        this.els.stateDesc.className = 'timer-state-label active';
        this.els.stateDesc.textContent = `Успішно завершено! +${earnedCoins} бамбук-коїнів 🎋`;
      }

      // Panda celebration
      if (window.PandaAvatar) {
        window.PandaAvatar.setState('celebrating');
      }
      this._setPandaQuote('completed', completedMinutes, earnedCoins);

      // Log event
      this.logEvent('completed', `Сесія успішно завершена! Зараховано ${completedMinutes} хв фокусу (+${earnedCoins} 🎋 коїнів).`);

      if (window.StrictComponents) {
        window.StrictComponents.playBeep('success');
        window.StrictComponents.toast(`🎉 Чудова робота! Зараховано +${completedMinutes} хв фокусу та +${earnedCoins} 🎋 коїнів!`, 'success');
      }

      // Check daily quest completion
      this._checkQuestCompletionOnSessionEnd();
      this._renderWeeklyChart();
    }

    stopSession(save = false) {
      clearInterval(this.timerInterval);
      this.isRunning = false;
      this.isPaused = false;
      this.secondsLeft = this.totalDuration;

      if (window.StrictStore) {
        window.StrictStore.update({
          tracker: {
            isSessionActive: false,
            sessionSecondsLeft: this.totalDuration,
            sessionTabSwitches: 0
          }
        });
      }

      this._resetTimerUI();
      this._updateTimerDisplay();
      this._setPandaQuote('ready');

      this.logEvent('info', 'Сесію скинуто користувачем');
      if (window.StrictComponents) window.StrictComponents.playBeep('click');
    }

    _resetTimerUI() {
      document.title = 'StrictAI — Трекер концентрації та фокус-сесій';
      if (this.els.startToggleBtn) {
        this.els.startToggleBtn.className = 'btn btn-primary btn-timer-primary';
      }
      if (this.els.startBtnLabel) {
        this.els.startBtnLabel.textContent = 'Почати фокус-сесію';
      }
      if (this.els.sessionStatusBadge) {
        this.els.sessionStatusBadge.className = 'bento-badge purple';
        this.els.sessionStatusBadge.textContent = 'Готовий до старту';
      }
      if (this.els.progressRing) {
        this.els.progressRing.classList.remove('strict-active', 'warning-distracted');
      }
    }

    _updateTimerDisplay() {
      const minutes = Math.floor(this.secondsLeft / 60).toString().padStart(2, '0');
      const seconds = (this.secondsLeft % 60).toString().padStart(2, '0');

      if (this.els.displayDigits) {
        this.els.displayDigits.textContent = `${minutes}:${seconds}`;
      }

      // Calculate SVG progress ring offset
      if (this.els.progressRing) {
        const progress = this.secondsLeft / this.totalDuration;
        const offset = CIRCLE_CIRCUMFERENCE * (1 - progress);
        this.els.progressRing.style.strokeDashoffset = offset.toFixed(2);
      }
    }

    _formatMinutes(seconds) {
      const m = Math.ceil(seconds / 60);
      return `${m} хв`;
    }

    // ==================== ANTI-DISTRACTION DETECTION & SIMULATION ====================

    triggerDistractionSimulation() {
      if (window.StrictComponents) {
        window.StrictComponents.playBeep('alert');
      }

      // Increment tab switches in store
      if (window.StrictStore) {
        window.StrictStore.recordTabSwitch('Тестова симуляція втрати фокусу');
      }

      this._onTabDistractionDetected('⚡ Тест детектора відволікання (Симуляція уходу зі вкладки)');
    }

    _onTabDistractionDetected(reason) {
      // Visual danger state on progress circle
      if (this.els.progressRing) {
        this.els.progressRing.classList.add('warning-distracted');
        setTimeout(() => {
          if (this.els.progressRing) this.els.progressRing.classList.remove('warning-distracted');
        }, 4000);
      }

      if (this.els.stateDesc) {
        this.els.stateDesc.className = 'timer-state-label warning';
        this.els.stateDesc.textContent = '⚠️ Втрата фокусу! Поверніться до навчання!';
      }

      // Panda strict warning face
      if (window.PandaAvatar) {
        window.PandaAvatar.setState('strict-warning');
        setTimeout(() => {
          if (this.isRunning && window.PandaAvatar) window.PandaAvatar.setState('idle');
        }, 5000);
      }

      this._setPandaQuote('distracted');

      // Log event to live feed
      this.logEvent('warning', `⚠️ ВІДВОЛІКАННЯ: ${reason}! Зафіксовано системою.`);

      if (window.StrictComponents) {
        window.StrictComponents.toast(`🚨 Панда зафіксувала відволікання! Поверніться до уроку.`, 'error');
      }
    }

    // ==================== PANDA SUPERVISOR QUOTES ====================

    _setPandaQuote(type, mins = 0, coins = 0) {
      if (!this.els.pandaQuote) return;

      const quotes = {
        ready: [
          '«Я уважно стежу за твоїм фокусом! Увімкни таймер, закрий зайві вкладки з соцмережами — і покажи свій максимум!»',
          '«Дисципліна б’є талант. 25 хвилин чесної концентрації дадуть більше, ніж 3 години прокрастинації!»',
          '«Твій омріяний ЗВО чекає на тебе. Почнімо сьогоднішній спринт без жодного виправдання!»'
        ],
        focus: [
          '«Ти у фокусі! Я дивлюся за кожним рухом курсора. Жодного YouTube чи месенджерів до сигналу таймера!»',
          '«Глибоке занурення активовано. Сконцентруйся на завданнях — кожна хвилина наближає тебе до 200 балів!»',
          '«Ти молодець, тримай темп! Я фіксую кожну хвилину чистої уваги.»'
        ],
        pause: [
          '«Сесію призупинено. Зроби ковток води, розімни плечі, але не заходь у стрічку новин — втратиш запал!»',
          '«Коротка пауза на роздуми. Чекаю на твоє повернення до бою!»'
        ],
        distracted: [
          '«ГЕЙ! Куди це ти перемкнувся?! Я все бачу! Негайно повернися до підготовки до НМТ!»',
          '«Стороння вкладка зафіксована в журналі дисципліни! Батьки побачать це у щотижневому звіті. До роботи!»',
          '«Прокрастинація краде твій бюджет! Зосередься на поточному завданні!»'
        ],
        completed: [
          `«Блискуче! Ти відпрацював повні ${mins} хв без компромісів. Заслужені +${coins} бамбук-коїнів 🎋 вже у твоєму профілі!»`,
          `«Гордість бере за таку дисципліну! Справжній студент-бюджетник. Відпочинь 5 хвилин і рухайся далі!»`
        ]
      };

      const pool = quotes[type] || quotes.ready;
      const quote = pool[Math.floor(Math.random() * pool.length)];
      this.els.pandaQuote.textContent = quote;
    }

    // ==================== LIVE LOGGING ====================

    logEvent(type, text) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const logItem = {
        id: 'ev-' + Date.now() + Math.random(),
        type: type, // 'start', 'warning', 'completed', 'pause', 'info'
        text: text,
        time: timeStr
      };

      this.sessionLogs.unshift(logItem);
      this._renderEventLogs();
    }

    _renderEventLogs() {
      if (!this.els.eventsFeed) return;

      const store = window.StrictStore ? window.StrictStore.get() : null;
      const historyLogs = store && store.tracker.focusLogs ? store.tracker.focusLogs : [];

      let combined = [...this.sessionLogs];

      // If empty session logs, populate with recent store logs
      if (combined.length === 0 && historyLogs.length > 0) {
        combined = historyLogs.map(l => ({
          type: l.status === 'completed' ? 'completed' : (l.status === 'warning' ? 'warning' : 'pause'),
          text: `${l.subject}: фокус ${l.durationMinutes} хв (${l.tabSwitches} перемикань)`,
          time: l.timestamp
        }));
      }

      if (combined.length === 0) {
        this.els.eventsFeed.innerHTML = `
          <div style="text-align: center; padding: 24px 10px; color: var(--text-muted); font-size: 0.88rem;">
            Поки що немає записів. Запустіть фокус-сесію, щоб бачити живий лог подій.
          </div>
        `;
        return;
      }

      const iconMap = {
        start: '🚀',
        completed: '✅',
        warning: '🚨',
        pause: '⏸️',
        info: 'ℹ️'
      };

      this.els.eventsFeed.innerHTML = combined.slice(0, 15).map(item => `
        <div class="log-entry-item ${item.type}">
          <div class="log-entry-icon">${iconMap[item.type] || '•'}</div>
          <div class="log-entry-content">
            <div>${item.text}</div>
            <div class="log-entry-time">${item.time}</div>
          </div>
        </div>
      `).join('');
    }

    // ==================== DAILY QUESTS ====================

    _renderDailyQuests() {
      if (!this.els.questList) return;

      const store = window.StrictStore ? window.StrictStore.get() : null;
      const quests = store && store.tracker.dailyQuests ? store.tracker.dailyQuests : [];

      this.els.questList.innerHTML = quests.map(q => `
        <div class="quest-card-item ${q.completed ? 'completed' : ''}" data-quest-id="${q.id}">
          <div class="quest-left-side">
            <div class="quest-checkbox" title="Відзначити виконання квесту">
              ${q.completed ? '✓' : ''}
            </div>
            <div>
              <div class="quest-title-text" style="font-weight: 600; font-size: 0.94rem;">
                ${q.title}
              </div>
              ${q.link ? `<a href="${q.link}" style="font-size: 0.78rem; color: var(--accent-primary);">Перейти до виконання ↗</a>` : ''}
            </div>
          </div>
          <div class="quest-reward-pill">
            <span>+${q.reward || 30}</span>
            <span>🎋</span>
          </div>
        </div>
      `).join('');

      // Add click handlers for checkboxes
      this.els.questList.querySelectorAll('.quest-card-item').forEach(item => {
        const questId = item.dataset.questId;
        const checkbox = item.querySelector('.quest-checkbox');

        checkbox.addEventListener('click', (e) => {
          e.stopPropagation();
          this._toggleQuest(questId);
        });
      });
    }

    _toggleQuest(questId) {
      if (!window.StrictStore) return;

      const store = window.StrictStore.get();
      const quests = [...(store.tracker.dailyQuests || [])];
      const target = quests.find(q => q.id === questId);

      if (!target) return;

      const wasCompleted = target.completed;
      target.completed = !wasCompleted;

      // Award or deduct bamboo coins
      const reward = target.reward || 30;
      if (!wasCompleted) {
        window.StrictStore.addCoins(reward, `Виконання квесту: "${target.title}"`);
        if (window.StrictComponents) {
          window.StrictComponents.playBeep('success');
          window.StrictComponents.toast(`Квест виконано! Отримано +${reward} бамбук-коїнів 🎋`, 'success');
        }
      } else {
        window.StrictStore.addCoins(-reward, `Скасування квесту`);
      }

      window.StrictStore.update({
        tracker: {
          dailyQuests: quests
        }
      });

      this._renderDailyQuests();
    }

    _handleAddNewQuest() {
      const text = this.els.newQuestInput.value.trim();
      if (!text) {
        if (window.StrictComponents) window.StrictComponents.toast('Введіть текст навчальної цілі!', 'warning');
        return;
      }

      const newQuest = {
        id: 'quest-custom-' + Date.now(),
        title: text,
        reward: 40,
        completed: false,
        link: ''
      };

      if (window.StrictStore) {
        const store = window.StrictStore.get();
        const quests = [...(store.tracker.dailyQuests || []), newQuest];
        window.StrictStore.update({
          tracker: {
            dailyQuests: quests
          }
        });
      }

      this.els.newQuestInput.value = '';
      this._renderDailyQuests();

      if (window.StrictComponents) {
        window.StrictComponents.playBeep('success');
        window.StrictComponents.toast('Нову ціль додано до щоденного плану! Нагорода: +40 🎋', 'success');
      }
    }

    _checkQuestCompletionOnSessionEnd() {
      if (!window.StrictStore) return;

      const store = window.StrictStore.get();
      const quests = [...(store.tracker.dailyQuests || [])];

      // Quest 1: 25 min focus without tab switches
      const quest1 = quests.find(q => q.id === 'quest-1');
      if (quest1 && !quest1.completed && this.sessionDistractionCount === 0 && (this.totalDuration - this.secondsLeft >= 1500)) {
        quest1.completed = true;
        window.StrictStore.addCoins(quest1.reward || 50, 'Виконання щоденного квесту без відволікань');
        window.StrictStore.update({ tracker: { dailyQuests: quests } });
        this._renderDailyQuests();
      }
    }

    // ==================== 7-DAY ACTIVITY CHART ====================

    _renderWeeklyChart() {
      if (!this.els.weeklyChartBars) return;

      const store = window.StrictStore ? window.StrictStore.get() : null;
      const weeklyMinutes = store && store.tracker.weeklyMinutes ? store.tracker.weeklyMinutes : [75, 90, 60, 105, 80, 45, 65];
      const dailyGoal = store && store.tracker.dailyGoalMinutes ? store.tracker.dailyGoalMinutes : 90;

      const daysLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
      const maxVal = Math.max(120, ...weeklyMinutes, dailyGoal + 20);

      // Total minutes
      const totalWeekly = weeklyMinutes.reduce((sum, v) => sum + v, 0);
      if (this.els.weeklyTotalMins) {
        this.els.weeklyTotalMins.textContent = `${totalWeekly} хв`;
      }

      // Height of target dashed line in percentage
      const targetPercent = Math.min(100, Math.round((dailyGoal / maxVal) * 100));

      const barsHtml = weeklyMinutes.map((mins, idx) => {
        const heightPercent = Math.max(8, Math.min(100, Math.round((mins / maxVal) * 100)));
        const isReached = mins >= dailyGoal;
        const isCurrentDay = idx === 6; // Sunday/Today

        let barClass = 'chart-bar-pillar';
        if (isCurrentDay) barClass += ' current';
        else if (isReached) barClass += ' reached';

        return `
          <div class="chart-col">
            <div class="${barClass}" style="height: ${heightPercent}%;">
              <div class="chart-bar-tooltip">
                ${mins} хв ${isReached ? '✓ норма' : ''}
              </div>
            </div>
            <span class="chart-col-label ${isCurrentDay ? 'today' : ''}">
              ${daysLabels[idx]}
            </span>
          </div>
        `;
      }).join('');

      this.els.weeklyChartBars.innerHTML = `
        <div class="chart-target-line" style="bottom: ${targetPercent}%;">
          <span class="chart-target-tag">${dailyGoal} хв</span>
        </div>
        ${barsHtml}
      `;
    }
  }

  // Instantiate controller
  window.StrictTracker = new StrictTrackerController();

})();
