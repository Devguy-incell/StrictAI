/**
 * StrictAI - Карта знань, Профіль учня та Додзьо Панди (Сторінка 6)
 * window.StrictKnowledgeController
 */

(function () {
  'use strict';

  // Accessories catalog configuration
  const DOJO_CATALOG = [
    {
      id: 'none',
      name: 'Класична Панда',
      icon: '🐼',
      price: 0,
      description: 'Базовий вигляд Червоної Панди. Природна кмітливість, пухнастий хвіст та відкритість до нових знань.',
      boost: 'Базовий фокус'
    },
    {
      id: 'glasses',
      name: 'Окуляри професора',
      icon: '👓',
      price: 50,
      description: 'Круглі інтелігентні окуляри в золотій оправі. Допомагають миттєво бачити ОДЗ та приховані пастки УЦОЯО.',
      boost: '+10 до уваги до деталей'
    },
    {
      id: 'sensei_band',
      name: 'Пов\'язка Сенсея',
      icon: '🥋',
      price: 100,
      description: 'Бойова червона стрічка майстра. Надихає на максимальну швидкість мислення та залізну концентрацію.',
      boost: '+15 до бойового духу'
    },
    {
      id: 'graduation_cap',
      name: 'Шапочка випускника',
      icon: '🎓',
      price: 150,
      description: 'Академічна конфедератка випускника найкращого університету. Візуалізація омріяного зарахування на бюджет.',
      boost: '+20 до впевненості'
    },
    {
      id: 'cyber_visor',
      name: 'Кібер-візор НМТ 200',
      icon: '🥽',
      price: 250,
      description: 'Легендарний неоновий візор майбутнього інженера. Підсвічує правильні формули та сканує логічні помилки.',
      boost: '+25 до харизми та 200 балів'
    }
  ];

  class StrictKnowledgeController {
    constructor() {
      this.selectedSubjectFilter = 'all';
      this.selectedStatusFilter = 'all';
      this.searchQuery = '';
      this.previewAccessory = null;

      document.addEventListener('DOMContentLoaded', () => this.init());
    }

    init() {
      if (window.StrictComponents) {
        window.StrictComponents.initPage('knowledge');
      }

      // Internationalization listener
      window.addEventListener('strictai:localechange', () => {
        if (window.StrictI18n) window.StrictI18n.applyToDOM();
      });
      if (window.StrictI18n) {
        window.StrictI18n.applyToDOM();
      }

      this._bindProfileEvents();
      this._bindMapFilters();
      this._bindDojoShop();
      this._bindMistakesJournal();

      // Subscribe to store updates for reactive sync
      if (window.StrictStore) {
        window.StrictStore.subscribe(() => {
          this.renderProfile();
          this.renderSkillTree();
          this.renderMistakesJournal();
        });
      }

      this.renderProfile();
      this.renderSkillTree();
      this.renderMistakesJournal();
    }

    // ----------------------------------------------------
    // PROFILE RENDERING & EDITING
    // ----------------------------------------------------
    renderProfile() {
      if (!window.StrictStore) return;
      const state = window.StrictStore.get();
      const st = state.student || {};
      const nmt = state.nmt || {};

      // Name & Badges
      const nameEl = document.getElementById('prof-student-name');
      if (nameEl) nameEl.textContent = st.name || 'Олександр Коваленко';

      const gradeEl = document.getElementById('prof-grade-badge');
      if (gradeEl) gradeEl.textContent = st.grade || '11 клас (Випускник — НМТ)';

      const coinsEl = document.getElementById('prof-coins-badge');
      if (coinsEl) coinsEl.textContent = `${st.bambooCoins || 340} бамбук-коїнів`;

      const streakEl = document.getElementById('prof-streak-badge');
      if (streakEl) streakEl.textContent = `${st.streakDays || 12} днів стріку`;

      // Target Uni & Specialty
      const uniEl = document.getElementById('prof-target-uni');
      if (uniEl) uniEl.textContent = st.targetUni || 'КПІ ім. Ігоря Сікорського';

      const specEl = document.getElementById('prof-target-spec');
      if (specEl) specEl.textContent = st.targetSpecialty || '121 Інженерія програмного забезпечення';

      // Predicted scores
      const preds = nmt.predictedScores || { 'Українська мова': 176, 'Математика': 172, 'Історія України': 168, 'Англійська мова': 181 };
      const predUkr = document.getElementById('pred-ukr');
      const predMath = document.getElementById('pred-math');
      const predHist = document.getElementById('pred-hist');
      const predEng = document.getElementById('pred-eng');

      if (predUkr) predUkr.textContent = preds['Українська мова'] || 176;
      if (predMath) predMath.textContent = preds['Математика'] || 172;
      if (predHist) predHist.textContent = preds['Історія України'] || 168;
      if (predEng) predEng.textContent = preds['Англійська мова'] || 181;

      // Target score & Progress
      const targetScore = st.targetScore || 184;
      const targetScoreEl = document.getElementById('prof-target-score');
      if (targetScoreEl) targetScoreEl.textContent = `${targetScore} бали`;

      const scoresArray = Object.values(preds);
      const currentAvg = scoresArray.length ? (scoresArray.reduce((a, b) => a + b, 0) / scoresArray.length) : 174;
      const roundedAvg = Math.round(currentAvg * 10) / 10;

      const avgEl = document.getElementById('prof-current-avg');
      if (avgEl) avgEl.textContent = roundedAvg.toFixed(1);

      const gap = Math.max(0, targetScore - roundedAvg);
      const gapEl = document.getElementById('prof-gap-score');
      if (gapEl) {
        gapEl.textContent = gap === 0 ? 'Ціль досягнуто! 🎉' : `+${gap.toFixed(1)} б.`;
      }

      const bar = document.getElementById('prof-target-progress-bar');
      if (bar) {
        // Percentage relative to 100-200 scale
        const pct = Math.min(100, Math.max(10, Math.round(((roundedAvg - 100) / (targetScore - 100)) * 100)));
        bar.style.width = `${pct}%`;
      }

      // Render Avatar in profile card
      if (window.PandaAvatar) {
        const avatarBox = document.getElementById('profile-panda-avatar');
        if (avatarBox) {
          const persona = state.tutor?.persona || 'friend';
          const acc = st.equippedAccessory || 'glasses';
          window.PandaAvatar.render(avatarBox, { persona: persona, accessory: acc, state: 'idle' });
        }
      }
    }

    _bindProfileEvents() {
      // Edit Profile Modal
      const editBtn = document.getElementById('btn-edit-profile');
      const modal = document.getElementById('edit-profile-modal');
      const closeBtn = document.getElementById('btn-close-edit-modal');
      const saveBtn = document.getElementById('btn-save-profile');

      const nameInp = document.getElementById('input-edit-name');
      const gradeInp = document.getElementById('input-edit-grade');
      const uniInp = document.getElementById('input-edit-uni');
      const specInp = document.getElementById('input-edit-spec');
      const scoreInp = document.getElementById('input-edit-score');

      const openModal = () => {
        const st = window.StrictStore.get().student;
        if (nameInp) nameInp.value = st.name || '';
        if (gradeInp) gradeInp.value = st.grade || '';
        if (uniInp) uniInp.value = st.targetUni || '';
        if (specInp) specInp.value = st.targetSpecialty || '';
        if (scoreInp) scoreInp.value = st.targetScore || 184;

        modal.classList.add('active');
        if (window.StrictComponents) window.StrictComponents.playBeep('click');
      };

      const closeModal = () => modal.classList.remove('active');

      if (editBtn) editBtn.addEventListener('click', openModal);
      if (closeBtn) closeBtn.addEventListener('click', closeModal);

      modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          const nextName = nameInp.value.trim() || 'Олександр Коваленко';
          const nextGrade = gradeInp.value.trim() || '11 клас (Випускник — НМТ)';
          const nextUni = uniInp.value.trim() || 'КПІ ім. Ігоря Сікорського';
          const nextSpec = specInp.value.trim() || '121 Інженерія програмного забезпечення';
          const nextScore = Math.min(200, Math.max(100, parseInt(scoreInp.value) || 184));

          window.StrictStore.update({
            student: {
              name: nextName,
              grade: nextGrade,
              targetUni: nextUni,
              targetSpecialty: nextSpec,
              targetScore: nextScore
            }
          });

          if (window.StrictComponents) {
            window.StrictComponents.playBeep('success');
            window.StrictComponents.toast('Профіль успішно оновлено!', 'success');
          }
          closeModal();
        });
      }

      // Click avatar container opens Dojo
      const avatarContainer = document.getElementById('profile-panda-avatar');
      if (avatarContainer) {
        avatarContainer.addEventListener('click', () => this.openDojoShop());
      }

      const openDojoBtn = document.getElementById('btn-open-dojo');
      if (openDojoBtn) {
        openDojoBtn.addEventListener('click', () => this.openDojoShop());
      }
    }

    // ----------------------------------------------------
    // SKILL TREE & KNOWLEDGE GRAPH
    // ----------------------------------------------------
    renderSkillTree() {
      const container = document.getElementById('skill-tree-container');
      if (!container || !window.StrictStore) return;

      const state = window.StrictStore.get();
      const topics = state.knowledge?.topics || [];

      // Update Summary metrics
      this._updateSummaryMetrics(topics);

      // Filter topics
      let filtered = topics;

      if (this.selectedSubjectFilter !== 'all') {
        filtered = filtered.filter(t => t.subject === this.selectedSubjectFilter);
      }

      if (this.selectedStatusFilter !== 'all') {
        filtered = filtered.filter(t => t.status === this.selectedStatusFilter);
      }

      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        filtered = filtered.filter(t => t.title.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q));
      }

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 48px; text-align: center; background: var(--bg-surface); border-radius: var(--radius-xl); border: 1px solid var(--border-subtle);">
            <div style="font-size: 2.2rem; margin-bottom: 12px;">🔍</div>
            <h3 style="margin-bottom: 8px;">Тем не знайдено</h3>
            <p style="font-size: 0.95rem;">Спробуйте змінити фільтри предметів чи очистити пошуковий запит.</p>
          </div>
        `;
        return;
      }

      const subjectIcons = {
        'Математика': '📐',
        'Українська мова': '📚',
        'Історія України': '🏛️',
        'Англійська мова': '🇬🇧'
      };

      const statusLabels = {
        mastered: { text: '🟢 Опановано', class: 'mastered' },
        progress: { text: '🟡 В процесі', class: 'progress' },
        attention: { text: '🔴 Потребує уваги', class: 'attention' }
      };

      container.innerHTML = filtered.map(t => {
        const sInfo = statusLabels[t.status] || statusLabels.progress;
        const icon = subjectIcons[t.subject] || '📝';

        return `
          <div class="topic-node-card ${sInfo.class}">
            <div class="topic-card-header">
              <div class="topic-subject-badge">
                <span>${icon}</span>
                <span>${t.subject}</span>
                <span>•</span>
                <span>${t.grade}</span>
              </div>
              <div class="topic-mastery-gauge ${sInfo.class}">
                ${t.mastery}%
              </div>
            </div>

            <div class="topic-title">
              ${t.title}
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.84rem; color: var(--text-muted);">
              <span>${sInfo.text}</span>
              <span>${t.questionsCount || 40} тренувальних завдань</span>
            </div>

            <div class="score-progress-track" style="height: 6px;">
              <div class="score-progress-bar" style="width: ${t.mastery}%; background: ${t.status === 'mastered' ? 'var(--accent-success)' : (t.status === 'progress' ? '#F59E0B' : 'var(--accent-danger)')};"></div>
            </div>

            <div class="topic-card-footer">
              <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="StrictKnowledgeController.studyWithTutor('${t.subject}', '${encodeURIComponent(t.title)}')">
                <span>🐼</span>
                <span>Вивчати з Пандою</span>
              </button>

              <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="StrictKnowledgeController.testTopic('${t.subject}')">
                <span>📝</span>
                <span>Закріпити тестом</span>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    _updateSummaryMetrics(topics) {
      const totalMasteryEl = document.getElementById('map-total-mastery');
      const countMasteredEl = document.getElementById('map-count-mastered');
      const countProgressEl = document.getElementById('map-count-progress');
      const countAttentionEl = document.getElementById('map-count-attention');

      if (!topics.length) return;

      const sum = topics.reduce((acc, t) => acc + (t.mastery || 0), 0);
      const avg = Math.round((sum / topics.length) * 10) / 10;

      const mastered = topics.filter(t => t.status === 'mastered').length;
      const progress = topics.filter(t => t.status === 'progress').length;
      const attention = topics.filter(t => t.status === 'attention').length;

      if (totalMasteryEl) totalMasteryEl.textContent = `${avg}%`;
      if (countMasteredEl) countMasteredEl.textContent = `${mastered} тем`;
      if (countProgressEl) countProgressEl.textContent = `${progress} тем`;
      if (countAttentionEl) countAttentionEl.textContent = `${attention} тем`;
    }

    _bindMapFilters() {
      // Subject filters
      const subjectBtns = document.querySelectorAll('#map-subject-filters .filter-pill');
      subjectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          subjectBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.selectedSubjectFilter = btn.dataset.subject;
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
          this.renderSkillTree();
        });
      });

      // Status filters
      const statusBtns = document.querySelectorAll('#map-status-filters .filter-pill');
      statusBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          statusBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.selectedStatusFilter = btn.dataset.status;
          if (window.StrictComponents) window.StrictComponents.playBeep('click');
          this.renderSkillTree();
        });
      });

      // Search input
      const searchInp = document.getElementById('topic-search-input');
      if (searchInp) {
        searchInp.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.trim();
          this.renderSkillTree();
        });
      }
    }

    // ----------------------------------------------------
    // PANDA DOJO (AVATAR CUSTOMIZATION SHOP)
    // ----------------------------------------------------
    openDojoShop() {
      const modal = document.getElementById('dojo-shop-modal');
      if (!modal) return;

      const st = window.StrictStore.get().student;
      this.previewAccessory = st.equippedAccessory || 'glasses';

      this._renderDojoPreview();
      this._renderDojoCatalog();

      modal.classList.add('active');
      if (window.StrictComponents) window.StrictComponents.playBeep('click');
    }

    _bindDojoShop() {
      const closeBtn = document.getElementById('btn-close-dojo');
      const modal = document.getElementById('dojo-shop-modal');

      const closeModal = () => modal?.classList.remove('active');
      if (closeBtn) closeBtn.addEventListener('click', closeModal);

      modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    _renderDojoPreview() {
      const container = document.getElementById('dojo-preview-avatar');
      const coinsEl = document.getElementById('dojo-coins-balance');
      const nameEl = document.getElementById('dojo-current-skin-name');
      const descEl = document.getElementById('dojo-current-skin-desc');

      if (!container || !window.StrictStore) return;

      const state = window.StrictStore.get();
      const st = state.student;
      if (coinsEl) coinsEl.textContent = st.bambooCoins || 340;

      const curAccId = this.previewAccessory || st.equippedAccessory || 'glasses';
      const itemData = DOJO_CATALOG.find(i => i.id === curAccId) || DOJO_CATALOG[0];

      if (nameEl) nameEl.textContent = itemData.name;
      if (descEl) descEl.textContent = `${itemData.description} (${itemData.boost})`;

      if (window.PandaAvatar) {
        window.PandaAvatar.render(container, {
          persona: state.tutor?.persona || 'friend',
          accessory: curAccId,
          state: 'idle'
        });
      }
    }

    _renderDojoCatalog() {
      const container = document.getElementById('dojo-items-container');
      if (!container || !window.StrictStore) return;

      const st = window.StrictStore.get().student;
      const equipped = st.equippedAccessory || 'glasses';
      const unlocked = new Set(st.unlockedAccessories || ['none', 'glasses']);
      const balance = st.bambooCoins || 0;

      container.innerHTML = DOJO_CATALOG.map(item => {
        const isEquipped = equipped === item.id;
        const isUnlocked = unlocked.has(item.id) || item.price === 0;
        const canAfford = balance >= item.price;

        let actionBtnHtml = '';
        if (isEquipped) {
          actionBtnHtml = `<button class="btn btn-outline btn-sm" disabled style="width: 100%; border-color: var(--accent-success); color: var(--accent-success);">✅ Одягнено</button>`;
        } else if (isUnlocked) {
          actionBtnHtml = `<button class="btn btn-primary btn-sm" style="width: 100%;" onclick="StrictKnowledgeController.equipAccessory('${item.id}')">Одягнути</button>`;
        } else {
          actionBtnHtml = `<button class="btn ${canAfford ? 'btn-accent-gradient' : 'btn-secondary'} btn-sm" style="width: 100%;" ${canAfford ? '' : 'disabled'} onclick="StrictKnowledgeController.buyAccessory('${item.id}', ${item.price})">Купити за ${item.price} 🎋</button>`;
        }

        return `
          <div class="dojo-item-card ${isEquipped ? 'equipped' : ''}">
            <div class="dojo-item-icon">${item.icon}</div>
            <div class="dojo-item-name">${item.name}</div>
            <div class="dojo-item-desc">${item.description}</div>
            <div class="dojo-price-badge">
              <span>🎋</span>
              <span>${item.price === 0 ? 'Безкоштовно' : `${item.price} коїнів`}</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 6px; width: 100%; margin-top: auto;">
              <button class="btn btn-secondary btn-sm" style="width: 100%; font-size: 0.8rem;" onclick="StrictKnowledgeController.previewItem('${item.id}')">
                👁️ Приміряти
              </button>
              ${actionBtnHtml}
            </div>
          </div>
        `;
      }).join('');
    }

    // ----------------------------------------------------
    // MISTAKES JOURNAL (РОБОТА НАД ПОМИЛКАМИ)
    // ----------------------------------------------------
    renderMistakesJournal() {
      const container = document.getElementById('journal-mistakes-container');
      if (!container || !window.StrictStore) return;

      const state = window.StrictStore.get();
      const mistakes = state.nmt?.mistakesQueue || [];

      if (mistakes.length === 0) {
        container.innerHTML = `
          <div style="padding: 48px; text-align: center; background: var(--bg-input); border-radius: var(--radius-xl); border: 1px dashed var(--border-subtle);">
            <div style="font-size: 2.2rem; margin-bottom: 12px;">🎉</div>
            <h3 style="margin-bottom: 6px;">Журнал помилок порожній!</h3>
            <p style="font-size: 0.95rem; color: var(--text-muted); max-width: 500px; margin: 0 auto;">
              Чудова робота! Усі минулі неточності вже засвоєно або ти ще не проходив нові тренувальні блоки НМТ.
            </p>
          </div>
        `;
        return;
      }

      container.innerHTML = mistakes.map((m, idx) => {
        const mistakePayload = encodeURIComponent(JSON.stringify(m));
        return `
          <div class="mistake-card" style="border-left-color: var(--accent-danger);">
            <div class="mistake-header-row">
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span class="badge-tag" style="background: var(--bg-surface); font-weight: 700;">${m.subject}</span>
                <span class="badge-tag">${m.topic}</span>
              </div>
              <button class="btn btn-outline btn-sm" style="font-size: 0.8rem;" onclick="StrictKnowledgeController.resolveMistake('${m.id}')">
                ✅ Позначити як засвоєно
              </button>
            </div>

            <div style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary); line-height: 1.5;">
              ${m.question}
            </div>

            <div class="mistake-answers-row">
              <div class="ans-box user">
                <div style="font-size: 0.78rem; text-transform: uppercase; font-weight: 700; opacity: 0.8; margin-bottom: 4px;">Твоя попередня помилка:</div>
                <div style="font-weight: 700;">${m.userAns}</div>
              </div>

              <div class="ans-box correct">
                <div style="font-size: 0.78rem; text-transform: uppercase; font-weight: 700; opacity: 0.8; margin-bottom: 4px;">Правильна відповідь:</div>
                <div style="font-weight: 700;">${m.correctAns}</div>
              </div>
            </div>

            <div class="mistake-explanation-box">
              <div style="font-weight: 700; color: var(--accent-primary); margin-bottom: 4px; font-size: 0.85rem;">
                💡 Детальне правило УЦОЯО:
              </div>
              <div>${m.explanation}</div>
            </div>

            <button class="tutor-bridge-btn" onclick="StrictKnowledgeController.reviewWithPanda('${mistakePayload}')">
              <span>🐼</span>
              <span>Розібрати цю тему з Пандою-репетитором</span>
            </button>
          </div>
        `;
      }).join('');
    }

    _bindMistakesJournal() {
      const clearBtn = document.getElementById('btn-clear-mistakes-journal');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (confirm('Очистити всі завдання з журналу помилок?')) {
            window.StrictStore.update({
              nmt: { mistakesQueue: [] }
            });
            if (window.StrictComponents) {
              window.StrictComponents.toast('Журнал помилок очищено!', 'info');
            }
          }
        });
      }
    }

    // ----------------------------------------------------
    // STATIC GLOBAL ACTIONS
    // ----------------------------------------------------
    static studyWithTutor(subject, encodedTopic) {
      const topic = decodeURIComponent(encodedTopic);
      if (window.StrictStore) {
        window.StrictStore.update({
          tutor: {
            nmtSubject: subject,
            category: 'nmt'
          }
        });
      }
      window.location.href = `tutor.html?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`;
    }

    static testTopic(subject) {
      let subjKey = 'all';
      if (subject.includes('Матем')) subjKey = 'math';
      else if (subject.includes('Мов') || subject.includes('Україн')) subjKey = 'ukrainian';
      else if (subject.includes('Істор')) subjKey = 'history';
      else if (subject.includes('Англ')) subjKey = 'english';

      window.location.href = `nmt.html?subject=${subjKey}`;
    }

    static previewItem(accessoryId) {
      const inst = window._strictKnowledgeInstance;
      if (inst) {
        inst.previewAccessory = accessoryId;
        inst._renderDojoPreview();
        if (window.StrictComponents) window.StrictComponents.playBeep('click');
      }
    }

    static equipAccessory(accessoryId) {
      if (!window.StrictStore) return;
      window.StrictStore.update((st) => ({
        ...st,
        student: {
          ...st.student,
          equippedAccessory: accessoryId
        }
      }));

      const inst = window._strictKnowledgeInstance;
      if (inst) {
        inst.previewAccessory = accessoryId;
        inst._renderDojoPreview();
        inst._renderDojoCatalog();
      }

      if (window.StrictComponents) {
        window.StrictComponents.playBeep('success');
        window.StrictComponents.toast('Аксесуар успішно одягнено на Панду! 🐼', 'success');
      }
    }

    static buyAccessory(accessoryId, price) {
      if (!window.StrictStore) return;
      const st = window.StrictStore.get().student;
      const currentCoins = st.bambooCoins || 0;

      if (currentCoins < price) {
        if (window.StrictComponents) {
          window.StrictComponents.playBeep('alert');
          window.StrictComponents.toast('Недостатньо бамбук-коїнів! Проходь фокус-сесії та складай тести, щоб заробити ще 🎋', 'warning');
        }
        return;
      }

      const unlocked = [...(st.unlockedAccessories || ['none', 'glasses'])];
      if (!unlocked.includes(accessoryId)) {
        unlocked.push(accessoryId);
      }

      window.StrictStore.update((prev) => ({
        ...prev,
        student: {
          ...prev.student,
          bambooCoins: currentCoins - price,
          unlockedAccessories: unlocked,
          equippedAccessory: accessoryId
        }
      }));

      const inst = window._strictKnowledgeInstance;
      if (inst) {
        inst.previewAccessory = accessoryId;
        inst._renderDojoPreview();
        inst._renderDojoCatalog();
      }

      if (window.StrictComponents) {
        window.StrictComponents.playBeep('success');
        window.StrictComponents.toast(`Успішно придбано за ${price} 🎋 та одягнено!`, 'success');
      }
    }

    static resolveMistake(mistakeId) {
      if (!window.StrictStore) return;
      const st = window.StrictStore.get();
      const updated = (st.nmt?.mistakesQueue || []).filter(m => m.id !== mistakeId);
      window.StrictStore.update({
        nmt: { mistakesQueue: updated }
      });
      if (window.StrictComponents) {
        window.StrictComponents.toast('Завдання позначено як засвоєне! ✅', 'info');
      }
    }

    static reviewWithPanda(encodedPayload) {
      try {
        const mistakeObj = JSON.parse(decodeURIComponent(encodedPayload));
        if (window.StrictStore) {
          window.StrictStore.sendMistakeToTutor(mistakeObj);
        }
        if (window.StrictComponents) {
          window.StrictComponents.toast('Відкриваємо розбір помилки з репетитором...', 'info');
        }
        setTimeout(() => {
          window.location.href = 'tutor.html?review=1';
        }, 350);
      } catch (e) {
        console.error(e);
        window.location.href = 'tutor.html';
      }
    }

    static openDojoShop() {
      const inst = window._strictKnowledgeInstance;
      if (inst) inst.openDojoShop();
    }
  }

  // Export Singleton on window
  const knCtrl = new StrictKnowledgeController();
  window.StrictKnowledgeController = StrictKnowledgeController;
  window._strictKnowledgeInstance = knCtrl;

})();
