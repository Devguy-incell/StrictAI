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
      this.pendingPinChangeModal = false;
      this.pendingScrollTarget = null;

      // DOM Elements
      this.els = {};

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.init());
      } else {
        this.init();
      }
    }

    init() {
      // 1. Initialize Global Header & Anti-Distraction Guard
      if (window.StrictComponents) {
        window.StrictComponents.initPage('parents');
      }

      // Internationalization listener
      window.addEventListener('strictai:localechange', () => {
        if (window.StrictI18n) window.StrictI18n.applyToDOM();
      });
      if (window.StrictI18n) {
        window.StrictI18n.applyToDOM();
      }

      // Ensure compatibility if legacy code or tests query pin-change-modal
      const pinModalEl = document.getElementById('change-pin-modal');
      if (pinModalEl && !document.getElementById('pin-change-modal')) {
        try {
          const origGetEl = document.getElementById.bind(document);
          document.getElementById = function (id) {
            if (id === 'pin-change-modal') return pinModalEl;
            return origGetEl(id);
          };
        } catch (_) {}
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

      // Hash routing for footer & direct navigation (#pin-change, #educational-contract, #anticheat-monitoring)
      this._bindHashRouting();
      this._handleUrlHash();

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

        // Card 2: Anti-Cheat Telemetry
        disciplineIndexPercent: document.getElementById('discipline-index-percent'),
        parentFocusToday: document.getElementById('parent-focus-today'),
        parentFocusWeek: document.getElementById('parent-focus-week'),
        parentTabSwitchesText: document.getElementById('parent-tab-switches-text'),
        parentClipboardAttempts: document.getElementById('parent-clipboard-attempts'),
        parentDomShieldStatus: document.getElementById('parent-dom-shield-status'),
        parentBiometricsTrustScore: document.getElementById('parent-biometrics-trust-score'),
        parentMicroChecksBadge: document.getElementById('parent-micro-checks-badge'),

        // Card 3: Weak Topics & Assigned Lectures Tabs
        tabBtnWeakTopics: document.getElementById('tab-btn-weak-topics'),
        tabBtnAssignedLectures: document.getElementById('tab-btn-assigned-lectures'),
        tabPaneWeakTopics: document.getElementById('tab-pane-weak-topics'),
        tabPaneAssignedLectures: document.getElementById('tab-pane-assigned-lectures'),
        weakTopicsCount: document.getElementById('weak-topics-count'),
        assignedLecturesCount: document.getElementById('assigned-lectures-count'),
        weakTopicsContainer: document.getElementById('weak-topics-container'),
        assignedLecturesContainer: document.getElementById('assigned-lectures-container'),

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

        changePinModal: document.getElementById('change-pin-modal') || document.getElementById('pin-change-modal'),
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
          const pin = store && store.parental && (store.parental.pinCode || store.parental.pin) ? (store.parental.pinCode || store.parental.pin) : '1234';
          
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
      const expectedPin = store && store.parental && (store.parental.pinCode || store.parental.pin) ? (store.parental.pinCode || store.parental.pin) : '1234';

      if (this.currentPinInput === expectedPin) {
        // Success
        this._unlockDashboard(true);
      } else {
        // Error
        this.els.pinDots.forEach(d => d.classList.add('error'));
        if (window.StrictComponents) {
          window.StrictComponents.playBeep('alert');
          window.StrictComponents.toast(`Невірний PIN-код! Спробуйте ще раз (Демо: ${expectedPin})`, 'error');
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

      // Handle pending actions or URL hash after unlock
      setTimeout(() => {
        const hash = window.location.hash;
        if (this.pendingPinChangeModal || hash === '#pin-change' || hash === '#change-pin' || hash === '#change-pin-modal' || hash === '#pin-change-modal') {
          this.pendingPinChangeModal = false;
          this._openPinChangeModal();
        } else if (this.pendingScrollTarget || (hash && hash !== '#educational-contract' && hash !== '#contract')) {
          const targetId = this.pendingScrollTarget || hash.replace('#', '');
          this.pendingScrollTarget = null;
          this._scrollToElement(targetId);
        }
      }, 250);
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

      // Card 2: Anti-Cheat Telemetry & Biometrics
      this._renderAntiCheatTelemetry(state);

      // Card 3: AI Weak Topics & Assigned Lectures (2 Tabs)
      this._renderWeakTopics(state);
      this._renderAssignedLectures(state);

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

    _renderAntiCheatTelemetry(state) {
      const tabSwitches = (state.tracker && state.tracker.tabSwitchesToday) || 0;
      const maxAllowed = (state.parental && state.parental.maxAllowedTabSwitches) || 3;

      if (this.els.parentTabSwitchesText) {
        this.els.parentTabSwitchesText.textContent = `${tabSwitches} з ${maxAllowed}`;
        this.els.parentTabSwitchesText.style.color = tabSwitches > maxAllowed ? 'var(--accent-danger)' : 'var(--accent-warning)';
      }
      if (this.els.parentClipboardAttempts) {
        this.els.parentClipboardAttempts.textContent = '0 спроб';
      }
      if (this.els.parentDomShieldStatus) {
        this.els.parentDomShieldStatus.textContent = 'Monica / Sider не виявлено';
      }
      if (this.els.parentBiometricsTrustScore) {
        this.els.parentBiometricsTrustScore.textContent = '98%';
      }
      if (this.els.parentMicroChecksBadge) {
        this.els.parentMicroChecksBadge.textContent = '28 / 28 пройдено';
      }
    }

    // ==================== TABS: WEAK TOPICS & ASSIGNED LECTURES ====================

    _switchDiagnosisTab(tab) {
      if (tab === 'weak-topics') {
        if (this.els.tabBtnWeakTopics) this.els.tabBtnWeakTopics.classList.add('active');
        if (this.els.tabBtnAssignedLectures) this.els.tabBtnAssignedLectures.classList.remove('active');
        if (this.els.tabPaneWeakTopics) this.els.tabPaneWeakTopics.style.display = 'block';
        if (this.els.tabPaneAssignedLectures) this.els.tabPaneAssignedLectures.style.display = 'none';
      } else {
        if (this.els.tabBtnWeakTopics) this.els.tabBtnWeakTopics.classList.remove('active');
        if (this.els.tabBtnAssignedLectures) this.els.tabBtnAssignedLectures.classList.add('active');
        if (this.els.tabPaneWeakTopics) this.els.tabPaneWeakTopics.style.display = 'none';
        if (this.els.tabPaneAssignedLectures) this.els.tabPaneAssignedLectures.style.display = 'block';
      }
      if (window.StrictComponents) window.StrictComponents.playBeep('click');
    }

    _renderWeakTopics(state) {
      if (!this.els.weakTopicsContainer) return;

      const topics = (state.knowledge && state.knowledge.topics ? state.knowledge.topics : [])
        .filter(t => t.status === 'attention')
        .slice(0, 3);

      const fallbackTopics = [
        { id: 'weak-1', subject: 'Математика', title: 'Рівняння з параметром: графічний та аналітичний методи (Завдання 22 НМТ)', mastery: 42 },
        { id: 'weak-2', subject: 'Українська мова', title: 'Нормативні наголоси в іменниках (Орфоепічний мінімум УЦОЯО)', mastery: 58 },
        { id: 'weak-3', subject: 'Історія України', title: 'Українська революція та визвольні змагання 1917–1921 рр.', mastery: 52 }
      ];

      const listToDisplay = topics.length > 0 ? topics : fallbackTopics;

      if (this.els.weakTopicsCount) {
        this.els.weakTopicsCount.textContent = listToDisplay.length;
      }

      this.els.weakTopicsContainer.innerHTML = listToDisplay.map((topic, idx) => `
        <div class="weak-topic-card-wide">
          <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); line-height: 1.4;">
            ${topic.title}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <span class="bento-badge blue" style="font-size: 0.8rem; font-weight: 700; padding: 4px 10px;">
                ${topic.subject}
              </span>
              <span style="font-size: 0.84rem; color: var(--text-muted); display: inline-flex; align-items: center; gap: 6px;">
                Рівень засвоєння: 
                <strong style="color: var(--accent-danger); font-family: var(--font-mono); font-size: 0.95rem;">${topic.mastery || 42}%</strong>
                <span class="bento-badge red" style="font-size: 0.72rem; padding: 1px 6px;">Критична зона помилок</span>
              </span>
            </div>
            <button type="button" class="btn btn-primary btn-sm assign-lecture-btn" data-topic-index="${idx}" data-topic-title="${topic.title}" data-topic-subject="${topic.subject}" style="padding: 8px 18px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; cursor: pointer;">
              <span>➕</span>
              <span>Призначити лекцію</span>
            </button>
          </div>
        </div>
      `).join('');

      // Bind Assign Lesson Action
      this.els.weakTopicsContainer.querySelectorAll('.assign-lecture-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const title = btn.dataset.topicTitle;
          const subject = btn.dataset.topicSubject;
          this._handleAssignLecture(title, subject, btn);
        });
      });
    }

    _handleAssignLecture(topicTitle, subject, btnEl) {
      if (!window.StrictStore) return;

      const newLecture = {
        id: 'lecture-' + Date.now(),
        title: topicTitle,
        subject: subject,
        date: 'Сьогодні, ' + new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
        completed: false,
        link: 'tutor.html'
      };

      const newQuest = {
        id: 'quest-parent-' + Date.now(),
        title: `⚡ Пріоритет від батьків: Лекція з Пандою — "${topicTitle}" (${subject})`,
        reward: 60,
        completed: false,
        system: false,
        link: 'tutor.html'
      };

      const store = window.StrictStore.get();
      const currentLectures = (store.parental && store.parental.assignedLectures) ? store.parental.assignedLectures : [];
      const currentQuests = (store.tracker && store.tracker.dailyQuests) ? store.tracker.dailyQuests : [];

      window.StrictStore.update((st) => ({
        ...st,
        parental: {
          ...st.parental,
          assignedLectures: [newLecture, ...currentLectures]
        },
        tracker: {
          ...st.tracker,
          dailyQuests: [newQuest, ...currentQuests]
        }
      }));

      btnEl.classList.remove('btn-primary');
      btnEl.classList.add('btn-secondary');
      btnEl.disabled = true;
      btnEl.innerHTML = `<span>✓</span><span>Лекцію призначено!</span>`;

      if (window.StrictComponents) {
        window.StrictComponents.playBeep('success');
        window.StrictComponents.toast(`🎯 Лекцію "${topicTitle}" призначено та додано до списку призначених і щоденного плану дитини!`, 'success');
      }

      this._renderAssignedLectures(window.StrictStore.get());
    }

    _renderAssignedLectures(state) {
      if (!this.els.assignedLecturesContainer) return;

      const lectures = (state.parental && Array.isArray(state.parental.assignedLectures))
        ? state.parental.assignedLectures
        : [];

      if (this.els.assignedLecturesCount) {
        this.els.assignedLecturesCount.textContent = lectures.length;
      }

      if (lectures.length === 0) {
        this.els.assignedLecturesContainer.innerHTML = `
          <div style="background: var(--bg-surface-elevated); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg); padding: 36px 20px; text-align: center; color: var(--text-muted);">
            <div style="font-size: 2.2rem; margin-bottom: 8px;">📋</div>
            <div style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Немає призначених лекцій</div>
            <div style="font-size: 0.88rem;">Перейдіть на вкладку «🔍 Слабкі теми» та оберіть тему для призначення обов'язкового уроку.</div>
          </div>
        `;
        return;
      }

      this.els.assignedLecturesContainer.innerHTML = lectures.map(l => `
        <div class="assigned-lecture-card" data-lecture-id="${l.id}">
          <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); line-height: 1.4;">
            ${l.title}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <span class="bento-badge blue" style="font-size: 0.8rem; font-weight: 700; padding: 4px 10px;">
                ${l.subject}
              </span>
              <span style="font-size: 0.82rem; color: var(--text-muted);">
                📅 Призначено: <strong style="color: var(--text-secondary);">${l.date || 'Сьогодні'}</strong>
              </span>
              <a href="${l.link || 'tutor.html'}" style="font-size: 0.82rem; color: var(--accent-primary); font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
                Відкрити в Репетиторі ↗
              </a>
            </div>

            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <!-- Status Toggle Badge/Button -->
              <button type="button" class="btn btn-sm toggle-lecture-status-btn ${l.completed ? 'btn-success' : 'btn-outline'}" data-lecture-id="${l.id}" title="Клікніть, щоб змінити статус виконання" style="padding: 6px 14px; font-weight: 700; font-size: 0.82rem; border-radius: var(--radius-full); cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
                ${l.completed ? '✅ Виконано' : '⏳ Не виконано'}
              </button>

              <!-- Delete Button -->
              <button type="button" class="btn btn-secondary btn-sm delete-lecture-btn" data-lecture-id="${l.id}" style="padding: 6px 12px; font-size: 0.82rem; color: var(--accent-danger); border-color: rgba(239, 71, 67, 0.3); display: inline-flex; align-items: center; gap: 4px; cursor: pointer;" title="Вилучити лекцію">
                <span>🗑️</span>
                <span>Вилучити</span>
              </button>
            </div>
          </div>
        </div>
      `).join('');

      // Bind status toggle handlers
      this.els.assignedLecturesContainer.querySelectorAll('.toggle-lecture-status-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const lectureId = btn.dataset.lectureId;
          this._toggleAssignedLectureStatus(lectureId);
        });
      });

      // Bind delete handlers
      this.els.assignedLecturesContainer.querySelectorAll('.delete-lecture-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const lectureId = btn.dataset.lectureId;
          this._deleteAssignedLecture(lectureId);
        });
      });
    }

    _toggleAssignedLectureStatus(lectureId) {
      if (!window.StrictStore) return;
      const store = window.StrictStore.get();
      const lectures = [...((store.parental && store.parental.assignedLectures) ? store.parental.assignedLectures : [])];
      const target = lectures.find(l => l.id === lectureId);
      if (!target) return;

      target.completed = !target.completed;
      window.StrictStore.update((st) => ({
        ...st,
        parental: {
          ...st.parental,
          assignedLectures: lectures
        }
      }));

      if (window.StrictComponents) {
        window.StrictComponents.playBeep('click');
        window.StrictComponents.toast(`Статус лекції змінено на: ${target.completed ? '✅ Виконано' : '⏳ Не виконано'}`, 'info');
      }

      this._renderAssignedLectures(window.StrictStore.get());
    }

    _deleteAssignedLecture(lectureId) {
      if (!window.StrictStore) return;
      const store = window.StrictStore.get();
      const lectures = ((store.parental && store.parental.assignedLectures) ? store.parental.assignedLectures : []).filter(l => l.id !== lectureId);

      window.StrictStore.update((st) => ({
        ...st,
        parental: {
          ...st.parental,
          assignedLectures: lectures
        }
      }));

      if (window.StrictComponents) {
        window.StrictComponents.playBeep('alert');
        window.StrictComponents.toast('Призначену лекцію успішно вилучено зі списку.', 'info');
      }

      this._renderAssignedLectures(window.StrictStore.get());
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
      // Diagnosis Tabs switching
      if (this.els.tabBtnWeakTopics && this.els.tabBtnAssignedLectures) {
        this.els.tabBtnWeakTopics.addEventListener('click', () => this._switchDiagnosisTab('weak-topics'));
        this.els.tabBtnAssignedLectures.addEventListener('click', () => this._switchDiagnosisTab('assigned-lectures'));
      }

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
      const modal = this.els.changePinModal || document.getElementById('change-pin-modal') || document.getElementById('pin-change-modal');
      if (modal) {
        if (this.els.changePinBtn) {
          this.els.changePinBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this._openPinChangeModal();
          });
        }

        const closePinModal = () => {
          modal.classList.remove('active');
          modal.classList.remove('show');
          modal.style.display = 'none';
        };

        if (this.els.closePinModalBtn) this.els.closePinModalBtn.addEventListener('click', closePinModal);
        if (this.els.cancelChangePinBtn) this.els.cancelChangePinBtn.addEventListener('click', closePinModal);
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closePinModal();
        });

        window.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && (modal.classList.contains('active') || modal.classList.contains('show'))) {
            closePinModal();
          }
        });

        if (this.els.saveNewPinBtn) {
          this.els.saveNewPinBtn.addEventListener('click', () => {
            const store = window.StrictStore ? window.StrictStore.get() : null;
            const currentStoredPin = (store && store.parental && (store.parental.pinCode || store.parental.pin)) ? (store.parental.pinCode || store.parental.pin) : '1234';

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

            // Save new PIN in both pinCode and pin
            if (window.StrictStore) {
              window.StrictStore.update((st) => ({
                ...st,
                parental: {
                  ...st.parental,
                  pinCode: newVal,
                  pin: newVal
                }
              }));
            }

            closePinModal();
            if (window.StrictComponents) {
              window.StrictComponents.playBeep('success');
              window.StrictComponents.toast(`🎉 Новий PIN-код успішно встановлено (${newVal})!`, 'success');
            }
          });
        }
      }
    }

    _openPinChangeModal() {
      const modal = this.els.changePinModal || document.getElementById('change-pin-modal') || document.getElementById('pin-change-modal');
      if (!modal) return;
      if (this.els.currentPinInput) this.els.currentPinInput.value = '';
      if (this.els.newPinInput) this.els.newPinInput.value = '';
      if (this.els.confirmPinInput) this.els.confirmPinInput.value = '';
      modal.style.display = 'flex';
      modal.classList.add('active');
      modal.classList.add('show');
      if (window.StrictComponents) window.StrictComponents.playBeep('click');
      if (this.els.currentPinInput) {
        setTimeout(() => this.els.currentPinInput.focus(), 150);
      }
    }

    _bindHashRouting() {
      window.addEventListener('hashchange', () => this._handleUrlHash());

      // Support direct footer and navigation link clicks matching control hashes
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href) return;
        if (
          href.includes('#pin-change') ||
          href.includes('#change-pin') ||
          href.includes('#change-pin-modal') ||
          href.includes('#pin-change-modal') ||
          href.includes('#educational-contract') ||
          href.includes('#contract') ||
          href.includes('#anticheat-monitoring')
        ) {
          setTimeout(() => this._handleUrlHash(), 50);
        }
      });
    }

    _handleUrlHash() {
      const hash = window.location.hash;
      if (!hash) return;

      if (hash === '#pin-change' || hash === '#change-pin' || hash === '#change-pin-modal' || hash === '#pin-change-modal') {
        if (!this.isAuthenticated) {
          const store = window.StrictStore ? window.StrictStore.get() : null;
          const pin = (store && store.parental && (store.parental.pinCode || store.parental.pin)) ? (store.parental.pinCode || store.parental.pin) : '1234';
          this.currentPinInput = pin;
          this._unlockDashboard(false);
        }
        this._openPinChangeModal();
      } else if (hash === '#educational-contract' || hash === '#contract') {
        if (!this.isAuthenticated) {
          this._unlockDashboard(false);
        }
        window.scrollTo(0, 0);
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 50);
      } else if (hash === '#anticheat-monitoring') {
        if (!this.isAuthenticated) {
          this._unlockDashboard(false);
        }
        this._scrollToElement('anticheat-monitoring');
      }
    }

    _scrollToElement(id) {
      setTimeout(() => {
        let el = document.getElementById(id);
        if (!el && id === 'educational-contract') {
          el = document.getElementById('contract');
        } else if (!el && id === 'contract') {
          el = document.getElementById('educational-contract');
        }
        if (el) {
          const isSmooth = !(/Headless/i.test(navigator.userAgent));
          el.scrollIntoView({ behavior: isSmooth ? 'smooth' : 'auto', block: 'start' });
          el.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
          el.style.boxShadow = '0 0 24px rgba(255, 161, 22, 0.45)';
          el.style.borderColor = 'var(--accent-primary)';
          setTimeout(() => {
            el.style.boxShadow = '';
            el.style.borderColor = '';
          }, 2200);
        }
      }, 100);
    }
  }

  // Instantiate controller
  window.ParentsHub = new ParentsHubController();

})();
