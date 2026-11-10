/**
 * StrictAI Global Components & System Handlers
 * - Navigation header generation across all 6 platform pages
 * - Anti-distraction tab-switch detector with Web Audio API sound alert
 * - Theme switcher (Dark / Warm Paper)
 * - Toast notification system
 * - AI Provider API Key configuration modal
 */

(function () {
  'use strict';

  class StrictComponentsController {
    constructor() {
      this.audioCtx = null;
      this.lastBlurTime = 0;
      this._initAudioContext();
      this._initFocusGuard();
    }

    _initAudioContext() {
      // Lazy init audio context on first user gesture
      const initAudio = () => {
        if (!this.audioCtx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) {
            this.audioCtx = new AudioContextClass();
          }
        }
        document.removeEventListener('click', initAudio);
        document.removeEventListener('keydown', initAudio);
      };
      document.addEventListener('click', initAudio, { once: true });
      document.addEventListener('keydown', initAudio, { once: true });
    }

    _ensureAudioCtx() {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    }

    /**
     * Synthesizes audio feedback via Web Audio API without external audio files
     */
    playBeep(type = 'click') {
      try {
        const ctx = this._ensureAudioCtx();
        if (!ctx) return;

        const now = ctx.currentTime;

        if (type === 'alert') {
          // Harsh alert tone for tab switching / rule violation
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gainNode = ctx.createGain();

          osc1.type = 'sawtooth';
          osc2.type = 'square';
          osc1.frequency.setValueAtTime(440, now);
          osc1.frequency.exponentialRampToValueAtTime(220, now + 0.35);

          osc2.frequency.setValueAtTime(480, now);
          osc2.frequency.exponentialRampToValueAtTime(240, now + 0.35);

          gainNode.gain.setValueAtTime(0.25, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

          osc1.connect(gainNode);
          osc2.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.35);
          osc2.stop(now + 0.35);

        } else if (type === 'success') {
          // Melodic uplifting triad
          [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.15, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.3);
          });

        } else if (type === 'tick') {
          // Soft short tick
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.04);

        } else {
          // Standard tactile click
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(600, now);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.06);
        }
      } catch (err) {
        console.warn('StrictComponents audio error:', err);
      }
    }

    /**
     * Anti-Distraction Guard (Strict Tab-Switching & Window Blur Monitor)
     */
    _initFocusGuard() {
      const handleDistraction = (reason) => {
        if (!window.StrictStore) return;
        const state = window.StrictStore.get();

        // Only enforce while focus session is active
        if (!state.tracker || !state.tracker.isSessionActive) return;

        // Debounce double firing (e.g. visibilitychange + blur within 1s)
        const now = Date.now();
        if (now - this.lastBlurTime < 1000) return;
        this.lastBlurTime = now;

        // Record violation in store
        window.StrictStore.recordTabSwitch(reason);

        // Sound alert if enabled
        if (state.parental && state.parental.soundAlertOnBlur) {
          this.playBeep('alert');
        }

        // Show warning banner
        this._showFocusWarningBanner();

        // Toast notice
        this.toast(`⚠️ Панда помітила відволікання! Сесія фокусу активна. Перемикання вкладок зафіксовано.`, 'warning');
      };

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          handleDistraction('Перемикання вкладки браузера');
        }
      });

      window.addEventListener('blur', () => {
        handleDistraction('Втрата фокусу вікна');
      });
    }

    _showFocusWarningBanner() {
      let banner = document.getElementById('focus-alert-banner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'focus-alert-banner';
        banner.className = 'focus-alert-banner';
        document.body.appendChild(banner);
      }

      const store = window.StrictStore ? window.StrictStore.get() : null;
      const switches = store ? store.tracker.sessionTabSwitches : 1;

      banner.innerHTML = `
        <span>🚨</span>
        <div>
          <strong>Увага! Відволікання зафіксовано!</strong>
          <div style="font-size: 0.82rem; opacity: 0.9;">Повернися до підготовки! За сесію: ${switches} перемикань.</div>
        </div>
        <button id="close-warning-btn" style="color: white; margin-left: 12px; font-weight: bold; padding: 4px 8px;">✕</button>
      `;

      banner.classList.add('active');

      const closeBtn = banner.querySelector('#close-warning-btn');
      if (closeBtn) {
        closeBtn.onclick = () => banner.classList.remove('active');
      }

      clearTimeout(this._bannerTimeout);
      this._bannerTimeout = setTimeout(() => {
        banner.classList.remove('active');
      }, 5000);
    }

    /**
     * Initializes the standard header across all platform pages
     */
    initPage(activePageId = 'index') {
      const header = document.getElementById('app-header');
      if (!header) return;

      const store = window.StrictStore ? window.StrictStore.get() : {
        theme: 'dark',
        student: { streakDays: 12, bambooCoins: 340 },
        tracker: { isSessionActive: false, sessionSecondsLeft: 1500 }
      };

      const pages = [
        { id: 'index', title: 'Головна', url: 'index.html', icon: '🏠' },
        { id: 'tutor', title: 'AI-Репетитор', url: 'tutor.html', icon: '🐼' },
        { id: 'nmt', title: 'Тренажер НМТ', url: 'nmt.html', icon: '📝' },
        { id: 'tracker', title: 'Контроль & Фокус', url: 'tracker.html', icon: '⏱' },
        { id: 'parents', title: 'Батьківський кабінет', url: 'parents.html', icon: '🛡' },
        { id: 'knowledge', title: 'Карта знань', url: 'knowledge.html', icon: '🗺' }
      ];

      const navLinksHtml = pages.map(p => {
        const isActive = p.id === activePageId ? 'active' : '';
        return `
          <li>
            <a href="${p.url}" class="nav-link ${isActive}">
              <span>${p.icon}</span>
              <span>${p.title}</span>
            </a>
          </li>
        `;
      }).join('');

      const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
      };

      const isSession = store.tracker && store.tracker.isSessionActive;
      const sessionBadgeHtml = isSession ? `
        <a href="tracker.html" class="nav-badge session-active" title="Активна фокус-сесія! Клацніть, щоб повернутися до таймера">
          <span>⏱</span>
          <span id="nav-session-timer">${formatTime(store.tracker.sessionSecondsLeft || 1500)}</span>
        </a>
      ` : '';

      header.className = 'strict-navbar';
      header.innerHTML = `
        <div class="strict-container nav-inner">
          <a href="index.html" class="nav-brand">
            <div class="nav-brand-badge">🐼</div>
            <div>Strict<span class="nav-brand-highlight">AI</span></div>
          </a>

          <ul class="nav-links" id="nav-links-menu">
            ${navLinksHtml}
          </ul>

          <div class="nav-actions">
            ${sessionBadgeHtml}

            <div class="nav-badge streak" title="Твій поточний щоденний стрік занять">
              <span>🔥</span>
              <span id="nav-streak-counter">${store.student.streakDays || 12} дн.</span>
            </div>

            <div class="nav-badge bamboo" title="Бамбук-коїни за фокус та розібрані завдання">
              <span>🎋</span>
              <span id="nav-bamboo-counter">${store.student.bambooCoins || 340}</span>
            </div>

            <button class="theme-toggle-btn" id="theme-toggle-btn" title="Змінити тему (Темна / Паперова для читання)">
              ${store.theme === 'light' ? '☀️' : '🌙'}
            </button>

            <button class="btn btn-secondary btn-sm" id="api-key-btn" title="Налаштування AI провайдера (Gemini / OpenAI / Groq)">
              <span>⚙️</span>
              <span class="desktop-only">AI Ключ</span>
            </button>

            <button class="nav-mobile-btn" id="nav-mobile-toggle" aria-label="Відкрити меню">
              ☰
            </button>
          </div>
        </div>
      `;

      // Event Listeners
      const themeBtn = header.querySelector('#theme-toggle-btn');
      if (themeBtn) {
        themeBtn.onclick = () => {
          this.playBeep('click');
          const current = window.StrictStore.get().theme;
          const next = current === 'dark' ? 'light' : 'dark';
          window.StrictStore.update({ theme: next });
          themeBtn.textContent = next === 'light' ? '☀️' : '🌙';
          this.toast(`Тему перемкнено на: ${next === 'light' ? 'Паперова (для читання)' : 'Темна (глибокий індиго)'}`, 'info');
        };
      }

      const mobileToggle = header.querySelector('#nav-mobile-toggle');
      const navMenu = header.querySelector('#nav-links-menu');
      if (mobileToggle && navMenu) {
        mobileToggle.onclick = () => {
          navMenu.classList.toggle('mobile-open');
        };
      }

      const apiKeyBtn = header.querySelector('#api-key-btn');
      if (apiKeyBtn) {
        apiKeyBtn.onclick = () => {
          this.playBeep('click');
          this.openApiKeyModal();
        };
      }

      // Sync store badges when store updates
      if (window.StrictStore) {
        window.StrictStore.subscribe((state) => {
          const streakEl = document.getElementById('nav-streak-counter');
          const bambooEl = document.getElementById('nav-bamboo-counter');
          const sessionEl = document.getElementById('nav-session-timer');

          if (streakEl) streakEl.textContent = `${state.student.streakDays || 0} дн.`;
          if (bambooEl) bambooEl.textContent = `${state.student.bambooCoins || 0}`;
          if (sessionEl && state.tracker.isSessionActive) {
            sessionEl.textContent = formatTime(state.tracker.sessionSecondsLeft || 0);
          }
        });
      }
    }

    /**
     * Modal dialog for AI API Key configuration
     */
    openApiKeyModal() {
      let modalBackdrop = document.getElementById('strict-api-modal');
      if (!modalBackdrop) {
        modalBackdrop = document.createElement('div');
        modalBackdrop.id = 'strict-api-modal';
        modalBackdrop.className = 'strict-modal-backdrop';
        document.body.appendChild(modalBackdrop);
      }

      const store = window.StrictStore ? window.StrictStore.get() : null;
      const currentProvider = store ? store.tutor.apiProvider : 'gemini';
      const currentKey = store ? store.tutor.apiKey : '';

      modalBackdrop.innerHTML = `
        <div class="strict-modal">
          <div class="modal-header">
            <div class="modal-title">⚙️ Налаштування AI Провайдера</div>
            <div class="modal-close-btn" id="modal-close-btn">&times;</div>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.92rem; margin-bottom: 18px; color: var(--text-secondary);">
              Платформа <strong>StrictAI</strong> працює як у режимі автономного тренажера, так і з підключенням обраної нейромережі для індивідуального репетитора. Ключ зберігається виключно локально у вашому браузері.
            </p>

            <div class="form-group">
              <label class="form-label">Оберіть AI Провайдера:</label>
              <select class="form-select" id="api-provider-select">
                <option value="gemini" ${currentProvider === 'gemini' ? 'selected' : ''}>Google Gemini (1.5 Flash / Pro) — Рекомендовано</option>
                <option value="openai" ${currentProvider === 'openai' ? 'selected' : ''}>OpenAI (GPT-4o / GPT-4o-mini)</option>
                <option value="groq" ${currentProvider === 'groq' ? 'selected' : ''}>Groq (Llama-3.3 70B — блискавична швидкість)</option>
                <option value="openrouter" ${currentProvider === 'openrouter' ? 'selected' : ''}>OpenRouter (Будь-яка відкрита модель)</option>
                <option value="mock" ${currentProvider === 'mock' ? 'selected' : ''}>Автономний інтелектуальний режим (Без API-ключа)</option>
              </select>
            </div>

            <div class="form-group" id="api-key-group">
              <label class="form-label">
                <span>API Ключ:</span>
                <span id="key-hint" style="font-size: 0.8rem; color: var(--text-muted); cursor: pointer;">Отримати ключ Gemini ↗</span>
              </label>
              <div style="position: relative;">
                <input type="password" id="api-key-input" class="form-input" placeholder="Введіть AIzaSy... або sk-..." value="${currentKey}">
                <button type="button" id="toggle-key-visibility" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.9rem;">👁</button>
              </div>
            </div>

            <div style="padding: 12px 16px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-md); font-size: 0.85rem; color: var(--accent-success);">
              🔒 <strong>Конфіденційність гарантовано:</strong> ключ не передається на сторонні сервери StrictAI і використовується для прямих запитів до обраного провайдера.
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" id="modal-cancel-btn">Скасувати</button>
            <button class="btn btn-primary btn-sm" id="modal-save-btn">Зберегти налаштування</button>
          </div>
        </div>
      `;

      modalBackdrop.classList.add('active');

      const close = () => {
        modalBackdrop.classList.remove('active');
      };

      modalBackdrop.querySelector('#modal-close-btn').onclick = close;
      modalBackdrop.querySelector('#modal-cancel-btn').onclick = close;

      modalBackdrop.onclick = (e) => {
        if (e.target === modalBackdrop) close();
      };

      const keyInput = modalBackdrop.querySelector('#api-key-input');
      const toggleVisBtn = modalBackdrop.querySelector('#toggle-key-visibility');
      if (toggleVisBtn && keyInput) {
        toggleVisBtn.onclick = () => {
          keyInput.type = keyInput.type === 'password' ? 'text' : 'password';
        };
      }

      const providerSelect = modalBackdrop.querySelector('#api-provider-select');
      const keyHint = modalBackdrop.querySelector('#key-hint');
      const keyGroup = modalBackdrop.querySelector('#api-key-group');

      providerSelect.onchange = () => {
        if (providerSelect.value === 'mock') {
          keyGroup.style.display = 'none';
        } else {
          keyGroup.style.display = 'block';
          if (providerSelect.value === 'gemini') {
            keyHint.textContent = 'Отримати ключ Google AI Studio ↗';
          } else if (providerSelect.value === 'openai') {
            keyHint.textContent = 'Отримати ключ OpenAI ↗';
          } else if (providerSelect.value === 'groq') {
            keyHint.textContent = 'Отримати ключ GroqCloud ↗';
          }
        }
      };

      if (keyHint) {
        keyHint.onclick = () => {
          let url = 'https://aistudio.google.com/app/apikey';
          if (providerSelect.value === 'openai') url = 'https://platform.openai.com/api-keys';
          if (providerSelect.value === 'groq') url = 'https://console.groq.com/keys';
          window.open(url, '_blank');
        };
      }

      modalBackdrop.querySelector('#modal-save-btn').onclick = () => {
        const provider = providerSelect.value;
        const key = keyInput.value.trim();

        if (window.StrictStore) {
          window.StrictStore.update((st) => ({
            ...st,
            tutor: {
              ...st.tutor,
              apiProvider: provider,
              apiKey: key
            }
          }));
        }

        this.playBeep('success');
        this.toast(`Налаштування збережено! Провайдер: ${provider.toUpperCase()}`, 'success');
        close();
      };
    }

    /**
     * Toast notification trigger
     */
    toast(message, type = 'info') {
      let container = document.getElementById('strict-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'strict-toast-container';
        container.className = 'strict-toast-container';
        document.body.appendChild(container);
      }

      const toastEl = document.createElement('div');
      toastEl.className = `strict-toast ${type}`;

      const iconMap = {
        success: '✅',
        warning: '⚠️',
        error: '❌',
        info: 'ℹ️'
      };

      toastEl.innerHTML = `
        <span style="font-size: 1.15rem;">${iconMap[type] || 'ℹ️'}</span>
        <span>${message}</span>
      `;

      container.appendChild(toastEl);

      setTimeout(() => {
        toastEl.style.opacity = '0';
        toastEl.style.transform = 'translateY(10px)';
        toastEl.style.transition = 'all 0.3s ease';
        setTimeout(() => toastEl.remove(), 300);
      }, 3500);
    }
  }

  // Export Singleton on window
  window.StrictComponents = new StrictComponentsController();

})();
