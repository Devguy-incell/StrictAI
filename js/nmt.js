/**
 * StrictAI - Симулятор НМТ 2025 (Сторінка 3)
 * Full Interactive Exam Controller
 */

(function () {
  'use strict';

  class StrictNMTController {
    constructor() {
      this.selectedMode = 'full'; // 'full' | 'subject' | 'express'
      this.selectedSubject = 'all'; // 'all' | 'ukrainian' | 'math' | 'history' | 'english'
      this.timerMode = 'classic'; // 'classic' | 'zen' | 'strict'

      this.examActive = false;
      this.questions = [];
      this.currentIndex = 0;
      this.userAnswers = {}; // { qId: answerValue }
      this.flaggedQuestions = new Set();

      this.timerInterval = null;
      this.totalSeconds = 120 * 60;
      this.secondsLeft = 120 * 60;
      this.startTime = 0;

      this.lastPandaHintTime = 0;

      document.addEventListener('DOMContentLoaded', () => this.init());
    }

    init() {
      if (window.StrictComponents) {
        window.StrictComponents.initPage('nmt');
      }

      this._bindSetupEvents();
      this._bindExamEvents();
      this._bindDrawers();
      this._renderPastExams();

      // Check URL parameters (e.g. nmt.html?subject=math from knowledge map)
      const urlSubject = new URLSearchParams(window.location.search).get('subject');
      if (urlSubject) {
        this.selectedSubject = urlSubject;
        this.selectedMode = 'subject';

        // Update mode pills in UI
        const modePills = document.querySelectorAll('#nmt-mode-pills .mode-pill-btn');
        modePills.forEach(btn => {
          btn.classList.toggle('active', btn.dataset.mode === 'subject');
        });

        // Update subject pills in UI
        const subjectPills = document.querySelectorAll('#nmt-subject-pills .subject-badge-pill');
        subjectPills.forEach(btn => {
          btn.classList.toggle('active', btn.dataset.subject === urlSubject);
        });
      }

      // Keyboard shortcut: Alt+F for Reference Materials
      document.addEventListener('keydown', (e) => {
        if (e.altKey && (e.key === 'f' || e.key === 'F' || e.key === 'а' || e.key === 'А')) {
          e.preventDefault();
          this.toggleRefDrawer();
        }
      });
    }

    // ----------------------------------------------------
    // SETUP VIEW
    // ----------------------------------------------------
    _bindSetupEvents() {
      // Mode selector pills
      const modePills = document.querySelectorAll('#nmt-mode-pills .mode-pill-btn');
      modePills.forEach(btn => {
        btn.addEventListener('click', () => {
          modePills.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.selectedMode = btn.dataset.mode;
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
        });
      });

      // Subject selector pills
      const subjectPills = document.querySelectorAll('#nmt-subject-pills .subject-badge-pill');
      subjectPills.forEach(btn => {
        btn.addEventListener('click', () => {
          subjectPills.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.selectedSubject = btn.dataset.subject;
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
        });
      });

      // Timer ergonomics radios
      const timerChoices = document.querySelectorAll('.timer-choice');
      timerChoices.forEach(choice => {
        choice.addEventListener('click', () => {
          timerChoices.forEach(c => c.classList.remove('selected'));
          choice.classList.add('selected');
          const radio = choice.querySelector('input[type="radio"]');
          if (radio) {
            radio.checked = true;
            this.timerMode = radio.value;
          }
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
        });
      });

      // Start Exam Button
      const startBtn = document.getElementById('btn-start-exam');
      if (startBtn) {
        startBtn.addEventListener('click', () => this.startExam());
      }

      // Retake Exam Button
      const retakeBtn = document.getElementById('btn-retake-exam');
      if (retakeBtn) {
        retakeBtn.addEventListener('click', () => {
          document.getElementById('nmt-results-view').style.display = 'none';
          document.getElementById('nmt-setup-view').style.display = 'block';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    }

    _renderPastExams() {
      const container = document.getElementById('past-exams-list');
      if (!container) return;

      const store = window.StrictStore ? window.StrictStore.get() : null;
      const exams = (store && store.nmt && store.nmt.completedExams) || [];

      if (exams.length === 0) {
        container.innerHTML = `
          <div style="padding: 24px; text-align: center; color: var(--text-muted);">
            У тебе ще немає завершених тестів. Час скласти перший варіант!
          </div>
        `;
        return;
      }

      container.innerHTML = exams.slice(0, 5).map(ex => {
        const scoreColor = ex.score >= 170 ? 'var(--accent-success)' : (ex.score >= 140 ? 'var(--accent-primary)' : 'var(--accent-danger)');
        return `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; background: var(--bg-input); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 1.3rem;">📋</span>
              <div>
                <div style="font-weight: 700; font-size: 0.96rem;">${ex.title}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${ex.date} • Точність: ${ex.accuracy || 85}%</div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="text-align: right;">
                <div style="font-family: var(--font-mono); font-size: 1.25rem; font-weight: 800; color: ${scoreColor};">${ex.score} <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">/ 200</span></div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">${ex.mistakesCount || 0} помилок</div>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="StrictNMTController.loadDemoReview('${ex.id}')">
                Перегляд
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    // ----------------------------------------------------
    // EXAM INITIATION & TIMER
    // ----------------------------------------------------
    startExam() {
      if (!window.StrictNMTBank) {
        alert('Помилка: Банк завдань не завантажено');
        return;
      }

      // Fetch questions based on mode & subject
      this.questions = window.StrictNMTBank.getQuestionsForMode(this.selectedMode, this.selectedSubject);

      if (!this.questions || this.questions.length === 0) {
        if (window.StrictComponents) {
          window.StrictComponents.toast('Не знайдено завдань для обраного фільтра. Завантажено повний пул.', 'warning');
        }
        this.questions = window.StrictNMTBank.questions;
      }

      // Determine duration
      if (this.selectedMode === 'express') {
        this.totalSeconds = 15 * 60; // 15 mins for 5 questions
      } else if (this.selectedMode === 'subject') {
        this.totalSeconds = 30 * 60; // 30 mins
      } else {
        this.totalSeconds = 120 * 60; // 120 mins full block
      }
      this.secondsLeft = this.totalSeconds;
      this.startTime = Date.now();

      this.currentIndex = 0;
      this.userAnswers = {};
      this.flaggedQuestions.clear();
      this.examActive = true;

      // Switch views
      document.getElementById('nmt-setup-view').style.display = 'none';
      document.getElementById('nmt-results-view').style.display = 'none';
      document.getElementById('nmt-exam-view').style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Setup title
      const titleEl = document.getElementById('exam-active-title');
      const subEl = document.getElementById('exam-active-subtitle');
      if (this.selectedMode === 'express') {
        titleEl.textContent = 'НМТ: Експрес-діагностика знань';
        subEl.textContent = '5 тестових завдань для перевірки готовності';
      } else if (this.selectedMode === 'subject') {
        const subjName = window.StrictNMTBank.subjects[this.selectedSubject]?.name || 'Обраний предмет';
        titleEl.textContent = `Предметний тренажер: ${subjName}`;
        subEl.textContent = 'Поглиблена практика за стандартами УЦОЯО';
      } else {
        titleEl.textContent = 'НМТ-2025: Повний сертифікаційний блок';
        subEl.textContent = 'Українська мова • Математика • Історія України • Англійська мова';
      }

      // Render mini avatar in sidebar
      if (window.PandaAvatar) {
        const miniContainer = document.getElementById('nmt-mini-panda-avatar');
        if (miniContainer) {
          const store = window.StrictStore ? window.StrictStore.get() : null;
          const persona = this.timerMode === 'strict' ? 'strict' : (store?.tutor?.persona || 'friend');
          window.PandaAvatar.render(miniContainer, { persona: persona, state: 'idle' });
        }
      }

      // Apply Timer Mode UI
      this._applyTimerModeUI();
      this._startTimer();

      // Render first question & matrix
      this._renderQuestion(0);
      this._renderMatrix();

      if (window.StrictComponents) {
        window.StrictComponents.playBeep('success');
        window.StrictComponents.toast('Тестування розпочато! Бажаємо успіху 🐼', 'info');
      }
    }

    _applyTimerModeUI() {
      const timerDisplay = document.getElementById('exam-timer-display');
      const zenBar = document.getElementById('exam-zen-progress');
      const toggleZenBtn = document.getElementById('btn-toggle-timer-zen');

      if (this.timerMode === 'zen') {
        timerDisplay.textContent = '🌿 Zen';
        zenBar.style.display = 'block';
        if (toggleZenBtn) toggleZenBtn.textContent = 'Цифровий таймер';
      } else {
        zenBar.style.display = 'none';
        if (toggleZenBtn) toggleZenBtn.textContent = 'Режим Zen';
        this._updateTimerDigits();
      }
    }

    _startTimer() {
      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (!this.examActive) return;

        this.secondsLeft--;

        // Zen progress update
        if (this.timerMode === 'zen') {
          const fill = document.getElementById('exam-zen-fill');
          if (fill) {
            const pct = Math.max(0, (this.secondsLeft / this.totalSeconds) * 100);
            fill.style.width = pct + '%';
          }
        } else {
          this._updateTimerDigits();
        }

        // Strict Examiner Mode Audio Ticks
        if (this.timerMode === 'strict' && this.secondsLeft % 60 === 0 && this.secondsLeft > 0) {
          if (window.StrictComponents) window.StrictComponents.playBeep('tick');
          // Strict hint every 3 minutes
          if (this.secondsLeft % 180 === 0) {
            this._showPandaAdvice('strict');
          }
        }

        // Warning under 5 minutes
        if (this.secondsLeft === 300) {
          if (window.StrictComponents) {
            window.StrictComponents.playBeep('alert');
            window.StrictComponents.toast('Увага: Залишилося 5 хвилин до завершення тесту!', 'warning');
          }
          document.getElementById('exam-timer-display')?.classList.add('warning');
        }

        // Time's up
        if (this.secondsLeft <= 0) {
          clearInterval(this.timerInterval);
          if (window.StrictComponents) {
            window.StrictComponents.playBeep('alert');
            window.StrictComponents.toast('Час вичерпано! Зберігаємо ваші відповіді...', 'info');
          }
          this.submitExam();
        }
      }, 1000);
    }

    _updateTimerDigits() {
      const display = document.getElementById('exam-timer-display');
      if (!display || this.timerMode === 'zen') return;

      const m = Math.floor(this.secondsLeft / 60).toString().padStart(2, '0');
      const s = (this.secondsLeft % 60).toString().padStart(2, '0');
      display.textContent = `${m}:${s}`;
    }

    // ----------------------------------------------------
    // QUESTION RENDERING & INTERACTIONS
    // ----------------------------------------------------
    _renderQuestion(index) {
      if (index < 0 || index >= this.questions.length) return;
      this.currentIndex = index;
      const q = this.questions[index];

      // Update Meta
      document.getElementById('q-counter-badge').textContent = `Завдання ${index + 1} з ${this.questions.length}`;

      const subjMeta = window.StrictNMTBank.subjects[q.subject] || { name: q.subject, icon: '📝' };
      document.getElementById('q-subject-badge').innerHTML = `${subjMeta.icon} ${subjMeta.name}`;
      document.getElementById('q-topic-badge').textContent = q.topic;
      document.getElementById('q-points-badge').textContent = `${q.points} ${q.points === 1 ? 'бал' : (q.points < 5 ? 'бали' : 'балів')}`;

      // Flag button state
      const flagBtn = document.getElementById('q-flag-btn');
      const isFlagged = this.flaggedQuestions.has(q.id);
      flagBtn.classList.toggle('flagged', isFlagged);
      document.getElementById('flag-btn-text').textContent = isFlagged ? 'Прапорець встановлено 🚩' : 'Позначити прапорцем';

      // Question statement
      document.getElementById('q-statement-text').innerHTML = q.question;

      // Question input body
      const inputArea = document.getElementById('q-input-dynamic-area');
      inputArea.innerHTML = '';

      if (q.type === 'single') {
        this._renderSingleChoice(inputArea, q);
      } else if (q.type === 'matching') {
        this._renderMatching(inputArea, q);
      } else if (q.type === 'numeric') {
        this._renderNumeric(inputArea, q);
      }

      // Update Navigation Buttons
      document.getElementById('btn-prev-q').disabled = index === 0;
      const nextBtn = document.getElementById('btn-next-q');
      if (index === this.questions.length - 1) {
        nextBtn.innerHTML = `<span>Перейти до перевірки</span> <span>🏁</span>`;
      } else {
        nextBtn.innerHTML = `<span>Наступне</span> <span>→</span>`;
      }

      // Dynamic Panda Hint
      this._updatePandaHintForQuestion(q);
      this._updateMatrixActiveState();
    }

    _renderSingleChoice(container, q) {
      const currentAns = this.userAnswers[q.id];
      const matrix = document.createElement('div');
      matrix.className = 'options-matrix';

      q.options.forEach(opt => {
        const isSelected = currentAns === opt.key;
        const card = document.createElement('div');
        card.className = `option-card-label ${isSelected ? 'selected' : ''}`;
        card.innerHTML = `
          <div class="option-circle-letter">${opt.key}</div>
          <div class="option-card-text">${opt.text}</div>
        `;

        card.addEventListener('click', () => {
          this.userAnswers[q.id] = opt.key;
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
          this._renderQuestion(this.currentIndex);
          this._renderMatrix();
        });

        matrix.appendChild(card);
      });

      container.appendChild(matrix);
    }

    _renderMatching(container, q) {
      const wrap = document.createElement('div');
      wrap.className = 'matching-task-container';

      // Premises & Choices lists
      const listsGrid = document.createElement('div');
      listsGrid.className = 'matching-lists-grid';

      const colPremises = document.createElement('div');
      colPremises.className = 'matching-column';
      colPremises.innerHTML = `
        <div class="matching-column-title">1–4: Вихідні твердження</div>
        <div class="matching-list">
          ${q.premises.map(p => `
            <div class="matching-item">
              <span class="matching-key-badge">${p.num}</span>
              <span>${p.text}</span>
            </div>
          `).join('')}
        </div>
      `;

      const colChoices = document.createElement('div');
      colChoices.className = 'matching-column';
      colChoices.innerHTML = `
        <div class="matching-column-title">А–Д: Варіанти відповіді</div>
        <div class="matching-list">
          ${q.choices.map(c => `
            <div class="matching-item">
              <span class="matching-key-badge">${c.letter}</span>
              <span>${c.text}</span>
            </div>
          `).join('')}
        </div>
      `;

      listsGrid.appendChild(colPremises);
      listsGrid.appendChild(colChoices);
      wrap.appendChild(listsGrid);

      // Matrix Table for selecting pairs
      const currentMatching = this.userAnswers[q.id] || {};
      const letters = q.choices.map(c => c.letter);

      const tableWrap = document.createElement('div');
      tableWrap.style.overflowX = 'auto';

      let tableHtml = `
        <div style="font-weight: 700; font-size: 0.92rem; margin-top: 10px; color: var(--text-secondary);">
          Таблиця відповідностей: оберіть літеру для кожної цифри
        </div>
        <table class="matching-matrix-table">
          <thead>
            <tr>
              <th class="matrix-cell-head" style="text-align: left; width: 60px;">№</th>
              ${letters.map(l => `<th class="matrix-cell-head">${l}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
      `;

      q.premises.forEach(p => {
        tableHtml += `<tr>`;
        tableHtml += `<td style="font-weight: 700; color: var(--accent-primary); padding: 6px 12px;">${p.num}</td>`;
        letters.forEach(letter => {
          const isSelected = currentMatching[p.num] === letter;
          tableHtml += `
            <td style="text-align: center;">
              <button type="button" class="matrix-btn ${isSelected ? 'selected' : ''}" data-premise="${p.num}" data-letter="${letter}">
                ${isSelected ? '●' : letter}
              </button>
            </td>
          `;
        });
        tableHtml += `</tr>`;
      });

      tableHtml += `</tbody></table>`;
      tableWrap.innerHTML = tableHtml;

      // Event delegation for table buttons
      tableWrap.querySelectorAll('.matrix-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const prem = btn.dataset.premise;
          const lettr = btn.dataset.letter;

          if (!this.userAnswers[q.id]) {
            this.userAnswers[q.id] = {};
          }

          // Toggle or set
          if (this.userAnswers[q.id][prem] === lettr) {
            delete this.userAnswers[q.id][prem];
          } else {
            this.userAnswers[q.id][prem] = lettr;
          }

          if (window.StrictComponents) window.StrictComponents.playBeep('click');
          this._renderQuestion(this.currentIndex);
          this._renderMatrix();
        });
      });

      wrap.appendChild(tableWrap);
      container.appendChild(wrap);
    }

    _renderNumeric(container, q) {
      const wrap = document.createElement('div');
      wrap.className = 'numeric-input-container';

      const currentVal = this.userAnswers[q.id] || '';

      wrap.innerHTML = `
        <div style="font-size: 0.95rem; color: var(--text-secondary);">
          Введіть числове значення відповіді (ціле число або десятковий дріб через кому/крапку):
        </div>
        <input type="text" class="numeric-input-field" id="numeric-answer-box" value="${currentVal}" placeholder="0" autocomplete="off" />
        
        <div class="keypad-helper-row">
          <button type="button" class="keypad-btn" data-key="-">Мінус (-)</button>
          <button type="button" class="keypad-btn" data-key=",">Кома (,)</button>
          <button type="button" class="keypad-btn" data-key="backspace">⌫ Стерти</button>
          <button type="button" class="keypad-btn" data-key="clear">Очистити</button>
        </div>
      `;

      const input = wrap.querySelector('#numeric-answer-box');
      input.addEventListener('input', (e) => {
        this.userAnswers[q.id] = e.target.value.trim();
        this._renderMatrix();
      });

      // Keypad buttons
      wrap.querySelectorAll('.keypad-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.dataset.key;
          if (key === 'clear') {
            input.value = '';
            delete this.userAnswers[q.id];
          } else if (key === 'backspace') {
            input.value = input.value.slice(0, -1);
            this.userAnswers[q.id] = input.value.trim();
          } else {
            input.value += key;
            this.userAnswers[q.id] = input.value.trim();
          }
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
          input.focus();
          this._renderMatrix();
        });
      });

      container.appendChild(wrap);
    }

    _updatePandaHintForQuestion(q) {
      const hintEl = document.getElementById('panda-exam-hint');
      if (!hintEl) return;

      const hints = {
        ukrainian: [
          'У завданнях на наголос вимовляй слово пошепки з природною інтонацією!',
          'Пам’ятай про правило «Кафе «Птах» для префікса С-!',
          'У складносурядних реченнях шукай спільний другорядний член!'
        ],
        math: [
          'Завжди перевіряй ОДЗ логарифмів та знаменників!',
          'Для прямокутного трикутника описаний радіус R завжди дорівнює половині гіпотенузи.',
          'Не забудь перевірити похідну в критичних точках!'
        ],
        history: [
          'Звертай увагу на причинно-наслідкові зв’язки та хронологію подій.',
          'IV Універсал Центральної Ради — це повна суверенна незалежність УНР.',
          'Уважно читай прізвища та посади історичних діячів.'
        ],
        english: [
          'Check the tense markers in the clause before selecting Conditionals.',
          'Collocations matter: we say "take notes", not "make notes" in standard tests.',
          'Look for keywords and synonyms in the reading passage.'
        ]
      };

      const pool = hints[q.subject] || hints.ukrainian;
      hintEl.textContent = pool[Math.floor(Math.random() * pool.length)];
    }

    _showPandaAdvice(type) {
      const hintEl = document.getElementById('panda-exam-hint');
      if (!hintEl) return;

      if (type === 'strict') {
        const strictRemarks = [
          'Час невблаганно спливає! Не зависай на одному завданні — рухайся далі.',
          'Дисципліна на іспиті — це запорука твоїх 190+ балів. Сконцентруйся!',
          'Перевір у чернетці всі розрахунки, не припускайся прикрих арифметичних помилок.'
        ];
        hintEl.textContent = strictRemarks[Math.floor(Math.random() * strictRemarks.length)];
        if (window.PandaAvatar) {
          window.PandaAvatar.setState('strict-warning');
          setTimeout(() => window.PandaAvatar.setState('idle'), 4000);
        }
      }
    }

    // ----------------------------------------------------
    // MATRIX NAVIGATION & FLAG SYSTEM
    // ----------------------------------------------------
    _renderMatrix() {
      const container = document.getElementById('question-bubbles-container');
      const progressText = document.getElementById('matrix-progress-text');
      if (!container) return;

      let answeredCount = 0;
      container.innerHTML = '';

      this.questions.forEach((q, idx) => {
        const isAnswered = this._isQuestionAnswered(q);
        if (isAnswered) answeredCount++;

        const isFlagged = this.flaggedQuestions.has(q.id);
        const isActive = idx === this.currentIndex;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `q-bubble-btn ${isActive ? 'active' : ''} ${isAnswered ? 'answered' : ''} ${isFlagged ? 'flagged' : ''}`;
        btn.textContent = idx + 1;
        btn.title = `Завдання ${idx + 1} (${window.StrictNMTBank.subjects[q.subject]?.name || ''})`;

        btn.addEventListener('click', () => {
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
          this._renderQuestion(idx);
        });

        container.appendChild(btn);
      });

      if (progressText) {
        progressText.textContent = `${answeredCount} / ${this.questions.length} заповнено`;
      }
    }

    _updateMatrixActiveState() {
      const bubbles = document.querySelectorAll('.q-bubble-btn');
      bubbles.forEach((b, idx) => {
        b.classList.toggle('active', idx === this.currentIndex);
      });
    }

    _isQuestionAnswered(q) {
      const ans = this.userAnswers[q.id];
      if (!ans) return false;
      if (q.type === 'single') return typeof ans === 'string' && ans.length > 0;
      if (q.type === 'matching') return typeof ans === 'object' && Object.keys(ans).length > 0;
      if (q.type === 'numeric') return typeof ans === 'string' && ans.trim().length > 0;
      return false;
    }

    _bindExamEvents() {
      // Prev Button
      const prevBtn = document.getElementById('btn-prev-q');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (this.currentIndex > 0) {
            if (window.StrictComponents) window.StrictComponents.playBeep('click');
            this._renderQuestion(this.currentIndex - 1);
          }
        });
      }

      // Next Button
      const nextBtn = document.getElementById('btn-next-q');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (this.currentIndex < this.questions.length - 1) {
            if (window.StrictComponents) window.StrictComponents.playBeep('click');
            this._renderQuestion(this.currentIndex + 1);
          } else {
            // Confirm submit
            if (confirm('Ви дійшли до останнього завдання. Бажаєте завершити тестування та отримати оцінку?')) {
              this.submitExam();
            }
          }
        });
      }

      // Clear Choice Button
      const clearBtn = document.getElementById('btn-clear-choice');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          const q = this.questions[this.currentIndex];
          delete this.userAnswers[q.id];
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
          this._renderQuestion(this.currentIndex);
          this._renderMatrix();
        });
      }

      // Flag for review button
      const flagBtn = document.getElementById('q-flag-btn');
      if (flagBtn) {
        flagBtn.addEventListener('click', () => {
          const q = this.questions[this.currentIndex];
          if (this.flaggedQuestions.has(q.id)) {
            this.flaggedQuestions.delete(q.id);
          } else {
            this.flaggedQuestions.add(q.id);
          }
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
          this._renderQuestion(this.currentIndex);
          this._renderMatrix();
        });
      }

      // Submit from sidebar
      const submitSidebarBtn = document.getElementById('btn-submit-exam-sidebar');
      if (submitSidebarBtn) {
        submitSidebarBtn.addEventListener('click', () => {
          const unanswered = this.questions.filter(q => !this._isQuestionAnswered(q)).length;
          const msg = unanswered > 0
            ? `У вас залишилося ${unanswered} незаповнених завдань. Завершити тест зараз?`
            : 'Всі завдання заповнено! Завершити тестування та розрахувати результат?';
          if (confirm(msg)) {
            this.submitExam();
          }
        });
      }

      // Exit early button
      const exitBtn = document.getElementById('btn-exit-exam');
      if (exitBtn) {
        exitBtn.addEventListener('click', () => {
          if (confirm('Дійсно завершити тестування? Ваші поточні відповіді буде оцінено.')) {
            this.submitExam();
          }
        });
      }

      // Toggle Timer Zen mode
      const toggleZenBtn = document.getElementById('btn-toggle-timer-zen');
      if (toggleZenBtn) {
        toggleZenBtn.addEventListener('click', () => {
          this.timerMode = this.timerMode === 'zen' ? 'classic' : 'zen';
          this._applyTimerModeUI();
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
        });
      }
    }

    // ----------------------------------------------------
    // DRAWERS (REFERENCE MATERIALS & SCRATCHPAD)
    // ----------------------------------------------------
    _bindDrawers() {
      // Open Reference Drawer
      const openRefBtn1 = document.getElementById('btn-open-ref-top');
      const openRefBtn2 = document.getElementById('btn-open-ref-drawer');
      const closeRefBtn = document.getElementById('btn-close-ref-drawer');
      const refDrawer = document.getElementById('ref-materials-drawer');

      const openRef = () => {
        refDrawer.classList.add('active');
        this._renderRefContent('math');
        if (window.StrictComponents) window.StrictComponents.playBeep('click');
      };

      const closeRef = () => {
        refDrawer.classList.remove('active');
      };

      if (openRefBtn1) openRefBtn1.addEventListener('click', openRef);
      if (openRefBtn2) openRefBtn2.addEventListener('click', openRef);
      if (closeRefBtn) closeRefBtn.addEventListener('click', closeRef);

      refDrawer?.addEventListener('click', (e) => {
        if (e.target === refDrawer) closeRef();
      });

      // Reference subject tabs
      const refTabs = document.querySelectorAll('#ref-subject-tabs .drawer-tab-btn');
      refTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          refTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          this._renderRefContent(tab.dataset.refSubject);
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
        });
      });

      // Open Scratchpad Drawer
      const openScratchBtn = document.getElementById('btn-open-scratchpad');
      const closeScratchBtn = document.getElementById('btn-close-scratchpad');
      const scratchDrawer = document.getElementById('scratchpad-drawer');
      const scratchText = document.getElementById('scratchpad-text');
      const clearScratchBtn = document.getElementById('btn-clear-scratchpad');

      // Load scratchpad from localStorage
      if (scratchText) {
        scratchText.value = localStorage.getItem('strictai_scratchpad') || '';
        scratchText.addEventListener('input', (e) => {
          localStorage.setItem('strictai_scratchpad', e.target.value);
        });
      }

      if (clearScratchBtn) {
        clearScratchBtn.addEventListener('click', () => {
          if (scratchText) {
            scratchText.value = '';
            localStorage.removeItem('strictai_scratchpad');
            if (window.StrictComponents) window.StrictComponents.toast('Чернетку очищено', 'info');
          }
        });
      }

      const openScratch = () => {
        scratchDrawer.classList.add('active');
        if (scratchText) scratchText.focus();
        if (window.StrictComponents) window.StrictComponents.playBeep('click');
      };

      const closeScratch = () => {
        scratchDrawer.classList.remove('active');
      };

      if (openScratchBtn) openScratchBtn.addEventListener('click', openScratch);
      if (closeScratchBtn) closeScratchBtn.addEventListener('click', closeScratch);

      scratchDrawer?.addEventListener('click', (e) => {
        if (e.target === scratchDrawer) closeScratch();
      });
    }

    toggleRefDrawer() {
      const drawer = document.getElementById('ref-materials-drawer');
      if (drawer) {
        if (drawer.classList.contains('active')) {
          drawer.classList.remove('active');
        } else {
          drawer.classList.add('active');
          this._renderRefContent('math');
        }
      }
    }

    _renderRefContent(subjectKey) {
      const body = document.getElementById('ref-content-body');
      if (!body || !window.StrictNMTBank) return;

      const refData = window.StrictNMTBank.referenceMaterials[subjectKey];
      if (!refData) {
        body.innerHTML = `<div style="color: var(--text-muted); text-align: center; padding: 20px;">Матеріали відсутні</div>`;
        return;
      }

      body.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
          <h4 style="color: var(--text-primary); font-size: 1.1rem;">${refData.title}</h4>
          <span class="badge-tag" style="background: rgba(16,185,129,0.15); color: var(--accent-success);">${refData.badge}</span>
        </div>

        ${refData.sections.map(sec => `
          <div class="ref-section">
            <div class="ref-section-title">📌 ${sec.title}</div>
            <div class="ref-items-grid">
              ${sec.items.map(item => `
                <div class="ref-item-card">
                  <div class="ref-item-label">${item.label}</div>
                  <div class="ref-item-formula">${item.formula}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      `;
    }

    // ----------------------------------------------------
    // EXAM SUBMISSION & SCORING (100–200 Scale)
    // ----------------------------------------------------
    submitExam() {
      this.examActive = false;
      clearInterval(this.timerInterval);

      let totalRawScore = 0;
      let maxRawScore = 0;
      const questionResults = [];
      const mistakesForStore = [];

      this.questions.forEach(q => {
        maxRawScore += q.points;
        const userAns = this.userAnswers[q.id];
        let earnedPoints = 0;
        let isCorrect = false;

        if (q.type === 'single') {
          isCorrect = userAns === q.correctAnswer;
          earnedPoints = isCorrect ? q.points : 0;
        } else if (q.type === 'matching') {
          const userMatching = userAns || {};
          let matchesCount = 0;
          for (const key of Object.keys(q.correctAnswer)) {
            if (userMatching[key] === q.correctAnswer[key]) {
              matchesCount++;
            }
          }
          earnedPoints = matchesCount; // 1 pt per correct pair
          isCorrect = matchesCount === Object.keys(q.correctAnswer).length;
        } else if (q.type === 'numeric') {
          if (userAns !== undefined && userAns !== null) {
            const cleanUser = userAns.toString().trim().replace(',', '.');
            const cleanCorrect = q.correctAnswer.toString().trim().replace(',', '.');
            isCorrect = Math.abs(parseFloat(cleanUser) - parseFloat(cleanCorrect)) < 0.001;
            earnedPoints = isCorrect ? q.points : 0;
          }
        }

        totalRawScore += earnedPoints;

        const resultItem = {
          question: q,
          userAnswer: userAns,
          earnedPoints: earnedPoints,
          isCorrect: isCorrect
        };
        questionResults.push(resultItem);

        // If mistake, format for AI Tutor Bridge & Queue
        if (!isCorrect) {
          let userAnsFormatted = 'Немає відповіді';
          let correctAnsFormatted = '';

          if (q.type === 'single') {
            userAnsFormatted = userAns ? `Варіант (${userAns})` : 'Пропущено';
            correctAnsFormatted = `Варіант (${q.correctAnswer})`;
          } else if (q.type === 'matching') {
            userAnsFormatted = userAns ? JSON.stringify(userAns) : 'Пропущено';
            correctAnsFormatted = JSON.stringify(q.correctAnswer);
          } else if (q.type === 'numeric') {
            userAnsFormatted = userAns || 'Пропущено';
            correctAnsFormatted = q.correctAnswer;
          }

          mistakesForStore.push({
            id: `mistake-${Date.now()}-${q.id}`,
            subject: window.StrictNMTBank.subjects[q.subject]?.name || q.subject,
            topic: q.topic,
            question: q.question.replace(/<[^>]*>/g, ''),
            userAns: userAnsFormatted,
            correctAns: correctAnsFormatted,
            explanation: q.explanation.replace(/<[^>]*>/g, '')
          });
        }
      });

      // Calculate Official Scaled Score 100-200
      const primarySubject = this.selectedSubject !== 'all' ? this.selectedSubject : 'math';
      const scaledScore = window.StrictNMTBank.calculateScaledScore(primarySubject, totalRawScore, maxRawScore);
      const accuracy = Math.round((totalRawScore / Math.max(1, maxRawScore)) * 100);
      const timeSpentMins = Math.max(1, Math.round((this.totalSeconds - this.secondsLeft) / 60));

      // Bamboo coins reward (1 coin per 2 raw points + bonus for high score)
      const earnedCoins = Math.max(15, Math.round(totalRawScore * 1.5) + (scaledScore >= 180 ? 30 : 10));

      // Save to StrictStore
      if (window.StrictStore) {
        window.StrictStore.recordExamResult({
          id: 'exam-' + Date.now(),
          title: document.getElementById('exam-active-title')?.textContent || 'НМТ-2025 Тренажер',
          date: new Date().toLocaleDateString('uk-UA'),
          score: scaledScore,
          maxScore: 200,
          rawScore: totalRawScore,
          maxRawScore: maxRawScore,
          accuracy: accuracy,
          mistakesCount: mistakesForStore.length,
          newMistakes: mistakesForStore,
          subject: window.StrictNMTBank.subjects[this.selectedSubject]?.name || 'Комплексний блок'
        });

        // Add coins
        window.StrictStore.addCoins(earnedCoins, 'Успішне проходження тесту НМТ');

        // Add focus minutes to tracker
        window.StrictStore.addFocusMinutes(timeSpentMins, 'Симулятор НМТ');
      }

      // Render Results View
      this._renderResultsView({
        scaledScore,
        totalRawScore,
        maxRawScore,
        accuracy,
        timeSpentMins,
        earnedCoins,
        mistakesCount: mistakesForStore.length,
        questionResults
      });
    }

    _renderResultsView(data) {
      document.getElementById('nmt-exam-view').style.display = 'none';
      const resultsView = document.getElementById('nmt-results-view');
      resultsView.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Render Panda Reaction Avatar
      if (window.PandaAvatar) {
        const avatarContainer = document.getElementById('results-panda-avatar');
        if (avatarContainer) {
          const store = window.StrictStore ? window.StrictStore.get() : null;
          const persona = store?.tutor?.persona || 'friend';
          const state = data.scaledScore >= 170 ? 'celebrating' : (data.scaledScore < 130 ? 'strict-warning' : 'idle');
          window.PandaAvatar.render(avatarContainer, { persona: persona, state: state });
        }
      }

      // Update Headings & Verdict
      const verdictBadge = document.getElementById('results-verdict-badge');
      const headline = document.getElementById('results-headline');
      const subtext = document.getElementById('results-subtext');

      if (data.scaledScore >= 180) {
        verdictBadge.innerHTML = `<span>🌟</span> <span>Тріумф! Рівень бюджетного місця</span>`;
        verdictBadge.style.background = 'rgba(16, 185, 129, 0.2)';
        verdictBadge.style.color = 'var(--accent-success)';
        headline.textContent = 'Блискучий результат! Твої шанси на вступ — максимальні!';
        subtext.textContent = 'Ти продемонстрував глибоке володіння матеріалом. Залишилося відшліфувати кілька дрібниць.';
      } else if (data.scaledScore >= 150) {
        verdictBadge.innerHTML = `<span>👍</span> <span>Гарний рівень. Поріг подолано впевнено</span>`;
        headline.textContent = 'Впевнена робота! Але є потенціал рости до 185+!';
        subtext.textContent = 'Зверни увагу на теми з помилками нижче. Панда-репетитор допоможе розібрати тонкі моменти.';
      } else {
        verdictBadge.innerHTML = `<span>⚠️</span> <span>Потрібна увага до базових правил</span>`;
        verdictBadge.style.background = 'rgba(244, 63, 94, 0.2)';
        verdictBadge.style.color = 'var(--accent-danger)';
        headline.textContent = 'Тест складено. Не засмучуйся — помилки вказують шлях!';
        subtext.textContent = 'Кожна помилка — це шанс стати сильнішим. Почни розбір із найпростіших правил просто зараз.';
      }

      // Score dial
      document.getElementById('results-scaled-score').textContent = data.scaledScore;
      document.getElementById('results-raw-score').textContent = `${data.totalRawScore} / ${data.maxRawScore} первинних балів`;

      // Metrics
      document.getElementById('metric-accuracy').textContent = `${data.accuracy}%`;
      document.getElementById('metric-mistakes').textContent = data.mistakesCount;
      document.getElementById('metric-time').textContent = `${data.timeSpentMins} хв`;
      document.getElementById('metric-coins').textContent = `+${data.earnedCoins} 🎋`;

      // Render Mistakes Breakdown Cards
      this._renderMistakeCards(data.questionResults);

      if (window.StrictComponents) {
        window.StrictComponents.playBeep('success');
      }
    }

    _renderMistakeCards(results, filter = 'all') {
      const container = document.getElementById('results-cards-container');
      if (!container) return;

      let filtered = results;
      if (filter === 'mistakes') {
        filtered = results.filter(r => !r.isCorrect);
      } else if (filter === 'correct') {
        filtered = results.filter(r => r.isCorrect);
      }

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="padding: 32px; text-align: center; color: var(--text-muted); background: var(--bg-input); border-radius: var(--radius-lg);">
            У цьому розділі немає завдань для відображення.
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map((res, idx) => {
        const q = res.question;
        const subjMeta = window.StrictNMTBank.subjects[q.subject] || { name: q.subject, icon: '📝' };

        // Format user answer display
        let userDisplay = 'Не надано відповіді';
        let correctDisplay = '';

        if (q.type === 'single') {
          userDisplay = res.userAnswer ? `Варіант [${res.userAnswer}]` : 'Пропущено';
          correctDisplay = `Правильно: [${q.correctAnswer}]`;
        } else if (q.type === 'matching') {
          userDisplay = res.userAnswer ? Object.entries(res.userAnswer).map(([k, v]) => `${k}→${v}`).join(', ') : 'Пропущено';
          correctDisplay = Object.entries(q.correctAnswer).map(([k, v]) => `${k}→${v}`).join(', ');
        } else if (q.type === 'numeric') {
          userDisplay = res.userAnswer || 'Пропущено';
          correctDisplay = q.correctAnswer;
        }

        const borderStatus = res.isCorrect ? 'var(--accent-success)' : 'var(--accent-danger)';

        // JSON serialization for bridge
        const mistakePayload = encodeURIComponent(JSON.stringify({
          subject: subjMeta.name,
          topic: q.topic,
          question: q.question.replace(/<[^>]*>/g, ' '),
          userAns: userDisplay,
          correctAns: correctDisplay,
          explanation: q.explanation.replace(/<[^>]*>/g, ' ')
        }));

        return `
          <div class="mistake-card" style="border-left-color: ${borderStatus};">
            <div class="mistake-header-row">
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span class="badge-tag" style="background: var(--bg-surface);">${subjMeta.icon} ${subjMeta.name}</span>
                <span class="badge-tag">${q.topic}</span>
                <span class="badge-tag ${res.isCorrect ? 'badge-points' : ''}" style="color: ${borderStatus}; font-weight: 700;">
                  ${res.isCorrect ? `✅ Зараховано (+${res.earnedPoints} б.)` : `❌ Помилка (${res.earnedPoints}/${q.points} б.)`}
                </span>
              </div>
              <span style="font-size: 0.82rem; color: var(--text-muted);">Завдання #${idx + 1}</span>
            </div>

            <div style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary); line-height: 1.5;">
              ${q.question}
            </div>

            <div class="mistake-answers-row">
              <div class="ans-box ${res.isCorrect ? 'correct' : 'user'}">
                <div style="font-size: 0.78rem; text-transform: uppercase; font-weight: 700; opacity: 0.8; margin-bottom: 4px;">Твоя відповідь:</div>
                <div style="font-weight: 700;">${userDisplay}</div>
              </div>

              <div class="ans-box correct">
                <div style="font-size: 0.78rem; text-transform: uppercase; font-weight: 700; opacity: 0.8; margin-bottom: 4px;">Еталонна відповідь УЦОЯО:</div>
                <div style="font-weight: 700;">${correctDisplay}</div>
              </div>
            </div>

            <div class="mistake-explanation-box">
              <div style="font-weight: 700; color: var(--accent-primary); margin-bottom: 4px; font-size: 0.85rem;">
                💡 Коментар екзаменатора та пояснення:
              </div>
              <div>${q.explanation}</div>
            </div>

            ${!res.isCorrect ? `
              <button class="tutor-bridge-btn" onclick="StrictNMTController.bridgeToTutor('${mistakePayload}')">
                <span>🐼</span>
                <span>Розібрати цю помилку з Пандою-репетитором</span>
              </button>
            ` : ''}
          </div>
        `;
      }).join('');

      // Filter pills binding
      const filterBtns = document.querySelectorAll('#results-filter-pills .filter-pill');
      filterBtns.forEach(btn => {
        btn.onclick = () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this._renderMistakeCards(results, btn.dataset.filter);
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
        };
      });
    }

    // ----------------------------------------------------
    // BRIDGE TO TUTOR.HTML FOR MISTAKE REVIEW
    // ----------------------------------------------------
    static bridgeToTutor(encodedPayload) {
      try {
        const mistakeObj = JSON.parse(decodeURIComponent(encodedPayload));
        if (window.StrictStore) {
          window.StrictStore.sendMistakeToTutor(mistakeObj);
        }
        if (window.StrictComponents) {
          window.StrictComponents.toast('Помилку передано репетитору! Відкриваємо урок з Пандою...', 'info');
        }
        setTimeout(() => {
          window.location.href = 'tutor.html?review=1';
        }, 350);
      } catch (err) {
        console.error('Bridge to tutor error:', err);
        window.location.href = 'tutor.html';
      }
    }

    static openRefMaterials(subject) {
      const drawer = document.getElementById('ref-materials-drawer');
      if (drawer) {
        drawer.classList.add('active');
        const inst = window._strictNMTInstance;
        if (inst) inst._renderRefContent(subject || 'math');
      }
    }

    static loadDemoReview(examId) {
      if (window.StrictComponents) {
        window.StrictComponents.toast('Завантажено результати тесту ' + examId, 'info');
      }
    }
  }

  // Export Singleton on window
  const nmtCtrl = new StrictNMTController();
  window.StrictNMTController = StrictNMTController;
  window._strictNMTInstance = nmtCtrl;

})();
