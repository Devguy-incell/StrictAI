/**
 * StrictAI — Parental Control Hub Controller (parents.js)
 * Implements 4-digit PIN protection, NMT readiness prediction dashboard,
 * discipline analytics, weak topics diagnosis with lesson assignment,
 * strictness toggles, and educational contract management.
 */

(function () {
  'use strict';

  class ParentsHubController {
    constructor() {
      this.currentPinInput = '';
      this.isAuthenticated = false;

      // DOM Elements
      this.els = {};

      document.addEventListener('DOMContentLoaded', () => this.init());
    }

    init() {
      // 1. Initialize Global Header & Anti-Distraction Guard
      if (window.StrictComponents) {
        window.StrictComponents.initPage('parents');
      }

      this._cacheElements();
      this._bindPinEvents();
      this._bindDashboardEvents();
      this._bindModals();

      // Check if already authenticated in this tab session
      if (sessionStorage.getItem('strictai_parents_auth') === 'true') {
        this._unlockDashboard(false);
      } else {
        this._lockDashboard();
      }

      // Reactive store listener
      if (window.StrictStore) {
        window.StrictStore.subscribe((state) => {
          if (this.isAuthenticated) {
            this._renderDashboard(state);
          }
        });
      }
    }

    _cacheElements() {
      this.els = {
        // PIN Screen
        pinAuthScreen: document.getElementById('pin-auth-screen'),
        pinDots: document.querySelectorAll('.pin-dot-indicator'),
        pinKeypad: document.getElementById('pin-keypad'),
        pinAutofillBtn: document.getElementById('pin-autofill-btn'),

        // Main Dashboard
        dashboardContent: document.getElementById('parent-dashboard-content'),
        dashStudentName: document.getElementById('dash-student-name'),
        dashStudentGrade: document.getElementById('dash-student-grade'),
        lockDashboardBtn: document.getElementById('lock-dashboard-btn'),
        changePinBtn: document.getElementById('change-pin-btn'),

        // Card 1: NMT Prediction
        predictedScoreTotal: document.getElementById('predicted-score-total'),
        targetUniText: document.getElementById('target-uni-text'),
        nmtSubjectsBars: document.getElementById('nmt-subjects-bars'),

        // Card 2: Discipline Index
        disciplineIndexPercent: document.getElementById('discipline-index-percent'),
        parentFocusToday: document.getElementById('parent-focus-today'),
        parentFocusWeek: document.getElementById('parent-focus-week'),
        parentTabSwitchesText: document.getElementById('parent-tab-switches-text'),

        // Card 3: Weak Topics
        weakTopicsContainer: document.getElementById('weak-topics-container'),

        // Strictness Controls
        toggleStrictLock: document.getElementById('toggle-strict-lock'),
        sliderDailyGoal: document.getElementById('slider-daily-goal'),
        sliderGoalValue: document.getElementById('slider-goal-value'),
        sliderMaxSwitches: document.getElementById('slider-max-switches'),
        sliderSwitchesValue: document.getElementById('slider-switches-value'),
        toggleSoundAlert: document.getElementById('toggle-sound-alert'),
        toggleTelegramNotify: document.getElementById('toggle-telegram-notify'),
        previewWeeklyReportBtn: document.getElementById('preview-weekly-report-btn'),

        // Educational Contract
        contractTitleInput: document.getElementById('contract-title-input'),
        contractTargetMins: document.getElementById('contract-target-mins'),
        contractTargetScore: document.getElementById('contract-target-score'),
        contractRewardInput: document.getElementById('contract-reward-input'),
        contractProgressText: document.getElementById('contract-progress-text'),
        contractProgressFill: document.getElementById('contract-progress-fill'),
        saveContractBtn: document.getElementById('save-contract-btn'),

        // Modals
        tgModal: document.getElementById('telegram-preview-modal'),
        closeTgModalBtn: document.getElementById('close-tg-modal-btn'),
        confirmTgModalBtn: document.getElementById('confirm-tg-modal-btn'),
        copyTgReportBtn: document.getElementById('copy-tg-report-btn'),

        changePinModal: document.getElementById('change-pin-modal'),
        closePinModalBtn: document.getElementById('close-pin-modal-btn'),
        cancelChangePinBtn: document.getElementById('cancel-change-pin-btn'),
        saveNewPinBtn: document.getElementById('save-new-pin-btn'),
        currentPinInput: document.getElementById('current-pin-input'),
        newPinInput: document.getElementById('new-pin-input'),
        confirmPinInput: document.getElementById('confirm-pin-input')
      };
    }

    // ==================== 1. PIN AUTH PROTECTION ====================

    _bindPinEvents() {
      // Keypad button clicks
      if (this.els.pinKeypad) {
        this.els.pinKeypad.addEventListener('click', (e) => {
          const btn = e.target.closest('.pin-key-btn');
          if (!btn) return;

          const key = btn.dataset.key;
          this._handlePinKey(key);
        });
      }

      // Keyboard listener
      window.addEventListener('keydown', (e) => {
        if (this.isAuthenticated) return;

        if (e.key >= '0' && e.key <= '9') {
          this._handlePinKey(e.key);
        } else if (e.key === 'Backspace') {
          this._handlePinKey('backspace');
        } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
          this._handlePinKey('clear');
        }
      });

      // Quick 1-click Demo Autofill
      if (this.els.pinAutofillBtn) {
        this.els.pinAutofillBtn.addEventListener('click', () => {
          const store = window.StrictStore ? window.StrictStore.get() : null;
          const pin = store && store.parental && store.parental.pinCode ? store.parental.pinCode : '1234';
          
          this.currentPinInput = pin;
          this._updatePinDots();
          this._validatePin();
        });
      }
    }

    _handlePinKey(key) {
      if (key === 'clear') {
        this.currentPinInput = '';
        this._updatePinDots();
        if (window.StrictComponents) window.StrictComponents.playBeep('click');
        return;
      }

      if (key === 'backspace') {
        this.currentPinInput = this.currentPinInput.slice(0, -1);
        this._updatePinDots();
        if (window.StrictComponents) window.StrictComponents.playBeep('click');
        return;
      }

      if (this.currentPinInput.length < 4) {
        this.currentPinInput += key;
        this._updatePinDots();
        if (window.StrictComponents) window.StrictComponents.playBeep('click');

        if (this.currentPinInput.length === 4) {
          setTimeout(() => this._validatePin(), 120);
        }
      }
    }

    _updatePinDots() {
      this.els.pinDots.forEach((dot, idx) => {
        if (idx < this.currentPinInput.length) {
          dot.classList.add('filled');
        } else {
          dot.classList.remove('filled', 'error');
        }
      });
    }

    _validatePin() {
      const store = window.StrictStore ? window.StrictStore.get() : null;
      const expectedPin = store && store.parental && store.parental.pinCode ? store.parental.pinCode : '1234';

      if (this.currentPinInput === expectedPin) {
        // Success
        this._unlockDashboard(true);
      } else {
        // Error
        this.els.pinDots.forEach(d => d.classList.add('error'));
        if (window.StrictComponents) {
          window.StrictComponents.playBeep('alert');
          window.StrictComponents.toast('Невірний PIN-код! Спробуйте ще раз (Демо: 1234)', 'error');
        }

        setTimeout(() => {
          this.currentPinInput = '';
          this._updatePinDots();
        }, 600);
      }
    }

    _unlockDashboard(playSuccessSound = false) {
      this.isAuthenticated = true;
      sessionStorage.setItem('strictai_parents_auth', 'true');

      if (this.els.pinAuthScreen) this.els.pinAuthScreen.style.display = 'none';
      if (this.els.dashboardContent) this.els.dashboardContent.style.display = 'block';

      if (playSuccessSound && window.StrictComponents) {
        window.StrictComponents.playBeep('success');
        window.StrictComponents.toast('Доступ надано! Ласкаво просимо до кабінету батьків.', 'success');
      }

      const store = window.StrictStore ? window.StrictStore.get() : null;
      if (store) this._renderDashboard(store);
    }

    _lockDashboard() {
      this.isAuthenticated = false;
      this.currentPinInput = '';
      sessionStorage.removeItem('strictai_parents_auth');

      if (this.els.pinAuthScreen) this.els.pinAuthScreen.style.display = 'block';
      if (this.els.dashboardContent) this.els.dashboardContent.style.display = 'none';
      this._updatePinDots();
    }

    // ==================== 2. DASHBOARD DATA RENDERING ====================

    _renderDashboard(state) {
      // Student Header
      if (this.els.dashStudentName) {
        this.els.dashStudentName.textContent = state.student.name || 'Олександр Коваленко';
      }
      if (this.els.dashStudentGrade) {
        this.els.dashStudentGrade.textContent = `${state.student.grade || '11 клас'} • Ціль: ${state.student.targetScore || 184} б.`;
      }

      // Card 1: NMT Prediction
      this._renderNmtPrediction(state);

      // Card 2: Discipline & Focus
      this._renderDisciplineAnalytics(state);

      // Card 3: AI Weak Topics Diagnosis
      this._renderWeakTopics(state);

      // Strictness Controls Settings
      this._syncStrictnessControls(state);

      // Educational Contract
      this._renderContract(state);
    }

    _renderNmtPrediction(state) {
      const scores = state.nmt.predictedScores || {
        'Українська мова': 176,
        'Математика': 172,
        'Історія України': 168,
        'Англійська мова': 181
      };

      const values = Object.values(scores);
      const avgScore = Math.round(values.reduce((a, b) => a + b, 0) / values.length) || 174;

      if (this.els.predictedScoreTotal) {
        this.els.predictedScoreTotal.textContent = avgScore;
      }

      if (this.els.targetUniText) {
        this.els.targetUniText.textContent = `${state.student.targetUni} (${state.student.targetSpecialty})`;
      }

      if (!this.els.nmtSubjectsBars) return;

      const subjectEntries = Object.entries(scores);
      this.els.nmtSubjectsBars.innerHTML = subjectEntries.map(([subj, score]) => {
        const percent = Math.min(100, Math.round((score / 200) * 100));
        let fillClass = 'medium';
        if (score >= 180) fillClass = 'high';
        else if (score < 165) fillClass = 'low';

        return `
          <div class="nmt-subject-row">
            <div class="nmt-sub-info">
              <span>${subj}</span>
              <span style="font-family: var(--font-mono); font-weight: 700;">${score} / 200</span>
            </div>
            <div class="nmt-sub-bar-bg">
              <div class="nmt-sub-bar-fill ${fillClass}" style="width: ${percent}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    _renderDisciplineAnalytics(state) {
      const todayMins = state.tracker.focusMinutesToday || 65;
      const weekly = state.tracker.weeklyMinutes || [75, 90, 60, 105, 80, 45, 65];
      const weeklyTotal = weekly.reduce((a, b) => a + b, 0);
      const tabSwitches = state.tracker.tabSwitchesToday || 0;
      const maxAllowed = state.parental.maxAllowedTabSwitches || 3;

      if (this.els.parentFocusToday) {
        this.els.parentFocusToday.textContent = `${todayMins} хв`;
      }
      if (this.els.parentFocusWeek) {
        this.els.parentFocusWeek.textContent = `${weeklyTotal} хв`;
      }
      if (this.els.parentTabSwitchesText) {
        this.els.parentTabSwitchesText.textContent = `${tabSwitches} з ${maxAllowed}`;
        this.els.parentTabSwitchesText.style.color = tabSwitches > maxAllowed ? 'var(--accent-danger)' : 'var(--accent-warning)';
      }

      // Calculate Discipline Index %
      let penalty = tabSwitches * 3;
      if (tabSwitches > maxAllowed) penalty += 15;
      const disciplineIndex = Math.max(70, Math.min(100, 100 - penalty));

      if (this.els.disciplineIndexPercent) {
        this.els.disciplineIndexPercent.textContent = `${disciplineIndex}%`;
      }
    }

    _renderWeakTopics(state) {
      if (!this.els.weakTopicsContainer) return;

      // Extract attention topics from knowledge graph
      const topics = (state.knowledge && state.knowledge.topics ? state.knowledge.topics : [])
        .filter(t => t.status === 'attention')
        .slice(0, 3);

      const fallbackTopics = [
        { subject: 'Математика', title: 'Рівняння з параметром (Завдання 22 НМТ)', mastery: 42 },
        { subject: 'Українська мова', title: 'Нормативні наголоси (Орфоепічний мінімум)', mastery: 62 },
        { subject: 'Історія України', title: 'Українська революція 1917–1921 рр.', mastery: 58 }
      ];

      const listToDisplay = topics.length > 0 ? topics : fallbackTopics;

      this.els.weakTopicsContainer.innerHTML = listToDisplay.map((topic, idx) => `
        <div class="weak-topic-card">
          <div class="weak-topic-left">
            <span class="weak-topic-badge">${topic.subject}</span>
            <div>
              <div style="font-weight: 700; font-size: 0.9rem;">${topic.title}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">
                Засвоєно: <strong style="color: var(--accent-danger);">${topic.mastery || 50}%</strong> (критична зона помилок)
              </div>
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm assign-lesson-btn" data-topic-index="${idx}" data-topic-title="${topic.title}" data-topic-subject="${topic.subject}">
            <span>➕</span>
            <span>Призначити урок</span>
          </button>
        </div>
      `).join('');

      // Bind Assign Lesson Action
      this.els.weakTopicsContainer.querySelectorAll('.assign-lesson-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const title = btn.dataset.topicTitle;
          const subject = btn.dataset.topicSubject;
          this._handleAssignExtraLesson(title, subject, btn);
        });
      });
    }

    _handleAssignExtraLesson(topicTitle, subject, btnEl) {
      if (!window.StrictStore) return;

      const store = window.StrictStore.get();
      const newQuest = {
        id: 'quest-parent-assigned-' + Date.now(),
        title: `⚡ Пріоритет від батьків: Додатковий урок з Пандою — "${topicTitle}" (${subject})`,
        reward: 60,
        completed: false,
        link: 'tutor.html'
      };

      const quests = [newQuest, ...(store.tracker.dailyQuests || [])];

      window.StrictStore.update({
        tracker: {
          dailyQuests: quests
        }
      });

      btnEl.classList.remove('btn-secondary');
      btnEl.classList.add('btn-primary');
      btnEl.disabled = true;
      btnEl.innerHTML = `<span>✓</span><span>Урок призначено!</span>`;

      if (window.StrictComponents) {
        window.StrictComponents.playBeep('success');
        window.StrictComponents.toast(`🎯 Урок з теми "${topicTitle}" призначено та додано до плану дитини!`, 'success');
      }
    }

    _syncStrictnessControls(state) {
      // Toggle Forced Strict Persona
      if (this.els.toggleStrictLock) {
        this.els.toggleStrictLock.checked = !!(state.parental && state.parental.strictLockPersona);
      }

      // Slider Daily Goal
      if (this.els.sliderDailyGoal && this.els.sliderGoalValue) {
        const goal = state.tracker.dailyGoalMinutes || 90;
        this.els.sliderDailyGoal.value = goal;
        this.els.sliderGoalValue.textContent = `${goal} хв / день`;
      }

      // Slider Max Tab Switches
      if (this.els.sliderMaxSwitches && this.els.sliderSwitchesValue) {
        const maxSw = state.parental.maxAllowedTabSwitches || 3;
        this.els.sliderMaxSwitches.value = maxSw;
        this.els.sliderSwitchesValue.textContent = `${maxSw} ${maxSw === 1 ? 'раз' : (maxSw < 5 ? 'рази' : 'разів')}`;
      }

      // Sound Alert
      if (this.els.toggleSoundAlert) {
        this.els.toggleSoundAlert.checked = state.parental ? state.parental.soundAlertOnBlur !== false : true;
      }

      // Telegram Notifications
      if (this.els.toggleTelegramNotify) {
        this.els.toggleTelegramNotify.checked = state.parental ? state.parental.telegramNotifications !== false : true;
      }
    }

    _renderContract(state) {
      const contract = (state.parental && state.parental.contract) ? state.parental.contract : {
        title: 'Тижневий спринт підготовки до НМТ 2025',
        targetMinutesWeek: 450,
        targetMinScore: 175,
        reward: 'Нова гра у Steam або похід у кіно з друзями на вихідних',
        progressPercent: 78
      };

      if (this.els.contractTitleInput) this.els.contractTitleInput.value = contract.title;
      if (this.els.contractTargetMins) this.els.contractTargetMins.value = contract.targetMinutesWeek;
      if (this.els.contractTargetScore) this.els.contractTargetScore.value = contract.targetMinScore;
      if (this.els.contractRewardInput) this.els.contractRewardInput.value = contract.reward;

      // Calculate progress from actual weekly focus minutes
      const weekly = state.tracker.weeklyMinutes || [75, 90, 60, 105, 80, 45, 65];
      const actualWeeklyMins = weekly.reduce((a, b) => a + b, 0);
      const targetMins = contract.targetMinutesWeek || 450;
      const progressPercent = Math.min(100, Math.round((actualWeeklyMins / targetMins) * 100));

      if (this.els.contractProgressText) {
        this.els.contractProgressText.textContent = `${progressPercent}% (${actualWeeklyMins} / ${targetMins} хв)`;
      }
      if (this.els.contractProgressFill) {
        this.els.contractProgressFill.style.width = `${progressPercent}%`;
      }
    }

    // ==================== 3. USER INTERACTION HANDLERS ====================

    _bindDashboardEvents() {
      // Lock / Logout button
      if (this.els.lockDashboardBtn) {
        this.els.lockDashboardBtn.addEventListener('click', () => {
          this._lockDashboard();
          if (window.StrictComponents) {
            window.StrictComponents.playBeep('click');
            window.StrictComponents.toast('Кабінет батьків заблоковано.', 'info');
          }
        });
      }

      // Strict Lock Persona Toggle
      if (this.els.toggleStrictLock) {
        this.els.toggleStrictLock.addEventListener('change', () => {
          const isStrict = this.els.toggleStrictLock.checked;
          if (window.StrictStore) {
            window.StrictStore.update((st) => ({
              ...st,
              parental: {
                ...st.parental,
                strictLockPersona: isStrict
              },
              tutor: {
                ...st.tutor,
                persona: isStrict ? 'strict' : st.tutor.persona
              }
            }));
          }

          if (window.StrictComponents) {
            window.StrictComponents.playBeep('click');
            if (isStrict) {
              window.StrictComponents.toast('🔒 Примусовий режим "Суворий викладач" активовано! Учень не зможе його змінити.', 'warning');
            } else {
              window.StrictComponents.toast('Обмеження знято: учень може обирати інший характер Панди.', 'info');
            }
          }
        });
      }

      // Daily Goal Slider
      if (this.els.sliderDailyGoal && this.els.sliderGoalValue) {
        this.els.sliderDailyGoal.addEventListener('input', () => {
          const val = parseInt(this.els.sliderDailyGoal.value, 10);
          this.els.sliderGoalValue.textContent = `${val} хв / день`;
        });

        this.els.sliderDailyGoal.addEventListener('change', () => {
          const val = parseInt(this.els.sliderDailyGoal.value, 10);
          if (window.StrictStore) {
            window.StrictStore.update({
              tracker: { dailyGoalMinutes: val }
            });
          }
          if (window.StrictComponents) {
            window.StrictComponents.playBeep('click');
            window.StrictComponents.toast(`Денну норму оновлено: ${val} хв / день`, 'success');
          }
        });
      }

      // Max Tab Switches Slider
      if (this.els.sliderMaxSwitches && this.els.sliderSwitchesValue) {
        this.els.sliderMaxSwitches.addEventListener('input', () => {
          const val = parseInt(this.els.sliderMaxSwitches.value, 10);
          this.els.sliderSwitchesValue.textContent = `${val} ${val === 1 ? 'раз' : (val < 5 ? 'рази' : 'разів')}`;
        });

        this.els.sliderMaxSwitches.addEventListener('change', () => {
          const val = parseInt(this.els.sliderMaxSwitches.value, 10);
          if (window.StrictStore) {
            window.StrictStore.update((st) => ({
              ...st,
              parental: {
                ...st.parental,
                maxAllowedTabSwitches: val
              }
            }));
          }
          if (window.StrictComponents) {
            window.StrictComponents.playBeep('click');
            window.StrictComponents.toast(`Ліміт відволікань оновлено: ${val} разів`, 'success');
          }
        });
      }

      // Sound Alert Toggle
      if (this.els.toggleSoundAlert) {
        this.els.toggleSoundAlert.addEventListener('change', () => {
          const enabled = this.els.toggleSoundAlert.checked;
          if (window.StrictStore) {
            window.StrictStore.update((st) => ({
              ...st,
              parental: { ...st.parental, soundAlertOnBlur: enabled }
            }));
          }
        });
      }

      // Telegram Notifications Toggle
      if (this.els.toggleTelegramNotify) {
        this.els.toggleTelegramNotify.addEventListener('change', () => {
          const enabled = this.els.toggleTelegramNotify.checked;
          if (window.StrictStore) {
            window.StrictStore.update((st) => ({
              ...st,
              parental: { ...st.parental, telegramNotifications: enabled }
            }));
          }
        });
      }

      // Save Contract
      if (this.els.saveContractBtn) {
        this.els.saveContractBtn.addEventListener('click', () => {
          const title = this.els.contractTitleInput.value.trim() || 'Тижневий спринт підготовки до НМТ 2025';
          const mins = parseInt(this.els.contractTargetMins.value, 10) || 450;
          const score = parseInt(this.els.contractTargetScore.value, 10) || 175;
          const reward = this.els.contractRewardInput.value.trim() || 'Винагорода';

          if (window.StrictStore) {
            window.StrictStore.update((st) => ({
              ...st,
              parental: {
                ...st.parental,
                contract: {
                  ...st.parental.contract,
                  title: title,
                  targetMinutesWeek: mins,
                  targetMinScore: score,
                  reward: reward
                }
              }
            }));
          }

          if (window.StrictComponents) {
            window.StrictComponents.playBeep('success');
            window.StrictComponents.toast('Умови освітнього контракту успішно оновлено та збережено!', 'success');
          }
        });
      }
    }

    // ==================== 4. MODALS & REPORT PREVIEW ====================

    _bindModals() {
      // Telegram Report Preview Modal
      if (this.els.previewWeeklyReportBtn && this.els.tgModal) {
        this.els.previewWeeklyReportBtn.addEventListener('click', () => {
          this.els.tgModal.classList.add('active');
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
        });

        const closeTg = () => this.els.tgModal.classList.remove('active');
        if (this.els.closeTgModalBtn) this.els.closeTgModalBtn.addEventListener('click', closeTg);
        if (this.els.confirmTgModalBtn) this.els.confirmTgModalBtn.addEventListener('click', closeTg);
        this.els.tgModal.addEventListener('click', (e) => {
          if (e.target === this.els.tgModal) closeTg();
        });

        if (this.els.copyTgReportBtn) {
          this.els.copyTgReportBtn.addEventListener('click', () => {
            const reportText = `📊 Тижневий звіт успішності учня: Олександр Коваленко
📅 Період: 04.11 – 10.11.2024
⏱ Чистий час у фокусі: 515 хвилин
👁 Дисципліна: 2 відволікання (Індекс: 94%)
🎯 Прогнозований бал НМТ: 174 / 200
🎋 Зароблено бамбук-коїнів: +185
🔍 Слабкі зони: Рівняння з параметром, Складні наголоси
🐼 Порада Панди: Відмінна старанність! Підтвердіть обіцяну винагороду.`;

            navigator.clipboard.writeText(reportText).then(() => {
              if (window.StrictComponents) {
                window.StrictComponents.toast('Текст звіту скопійовано в буфер обміну!', 'success');
              }
            }).catch(() => {
              if (window.StrictComponents) {
                window.StrictComponents.toast('Звіт готовий до перегляду.', 'info');
              }
            });
          });
        }
      }

      // Change PIN Modal
      if (this.els.changePinBtn && this.els.changePinModal) {
        this.els.changePinBtn.addEventListener('click', () => {
          this.els.currentPinInput.value = '';
          this.els.newPinInput.value = '';
          this.els.confirmPinInput.value = '';
          this.els.changePinModal.classList.add('active');
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
        });

        const closePinModal = () => this.els.changePinModal.classList.remove('active');
        if (this.els.closePinModalBtn) this.els.closePinModalBtn.addEventListener('click', closePinModal);
        if (this.els.cancelChangePinBtn) this.els.cancelChangePinBtn.addEventListener('click', closePinModal);
        this.els.changePinModal.addEventListener('click', (e) => {
          if (e.target === this.els.changePinModal) closePinModal();
        });

        if (this.els.saveNewPinBtn) {
          this.els.saveNewPinBtn.addEventListener('click', () => {
            const store = window.StrictStore ? window.StrictStore.get() : null;
            const currentStoredPin = store && store.parental && store.parental.pinCode ? store.parental.pinCode : '1234';

            const currVal = this.els.currentPinInput.value.trim();
            const newVal = this.els.newPinInput.value.trim();
            const confVal = this.els.confirmPinInput.value.trim();

            if (currVal !== currentStoredPin) {
              if (window.StrictComponents) {
                window.StrictComponents.playBeep('alert');
                window.StrictComponents.toast('Поточний PIN-код введено невірно!', 'error');
              }
              return;
            }

            if (!/^\d{4}$/.test(newVal)) {
              if (window.StrictComponents) {
                window.StrictComponents.playBeep('alert');
                window.StrictComponents.toast('Новий PIN-код повинен складатися рівно з 4 цифр!', 'warning');
              }
              return;
            }

            if (newVal !== confVal) {
              if (window.StrictComponents) {
                window.StrictComponents.playBeep('alert');
                window.StrictComponents.toast('Нові PIN-коди не співпадають!', 'error');
              }
              return;
            }

            // Save new PIN
            if (window.StrictStore) {
              window.StrictStore.update((st) => ({
                ...st,
                parental: {
                  ...st.parental,
                  pinCode: newVal
                }
              }));
            }

            closePinModal();
            if (window.StrictComponents) {
              window.StrictComponents.playBeep('success');
              window.StrictComponents.toast('Новий PIN-код успішно встановлено!', 'success');
            }
          });
        }
      }
    }
  }

  // Instantiate controller
  window.ParentsHub = new ParentsHubController();

})();
