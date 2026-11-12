/**
 * StrictAI Landing Page Controller (index.html)
 * - Red Panda Avatar Hero interactivity with Voice Speech
 * - NMT 2024-2025 Competitive Score & Admission Calculator
 * - Real-time metrics sync with StrictStore
 * - Interactive Panda Wardrobe preview
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Global Header & Navigation
    if (window.StrictComponents) {
      window.StrictComponents.initPage('index');
    }

    const store = window.StrictStore ? window.StrictStore.get() : null;

    // 2. Initialize Hero Red Panda Avatar
    const heroMount = document.getElementById('hero-panda-mount');
    let currentPersona = store ? store.tutor.persona : 'friend';
    let currentAccessory = store ? store.student.equippedAccessory : 'glasses';

    if (heroMount && window.PandaAvatar) {
      window.PandaAvatar.render(heroMount, {
        persona: currentPersona,
        accessory: currentAccessory,
        state: 'idle'
      });
    }

    // Persona Switcher Pills in Hero
    const heroBubble = document.getElementById('hero-panda-bubble');
    const heroPersonaPills = document.querySelectorAll('#hero-persona-pills .persona-switcher-btn');
    const heroVoiceBtn = document.getElementById('hero-voice-btn');
    const bentoCurrentPersonaEl = document.getElementById('bento-current-persona');

    function updateHeroPersonaUI(personaId) {
      currentPersona = personaId;

      // Update pills active state
      heroPersonaPills.forEach(btn => {
        if (btn.dataset.persona === personaId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update avatar visuals
      if (window.PandaAvatar) {
        window.PandaAvatar.setPersona(personaId);
      }

      // Update speech bubble text
      const meta = window.StrictStore ? window.StrictStore.getPersonaMeta(personaId) : null;
      if (meta && heroBubble) {
        heroBubble.innerHTML = `<strong>${meta.icon} ${meta.name}:</strong> «${meta.greeting}»`;
      }

      // Update bento badge
      if (bentoCurrentPersonaEl && meta) {
        bentoCurrentPersonaEl.textContent = `${meta.name} ${meta.icon}`;
      }

      // Sync to store
      if (window.StrictStore) {
        window.StrictStore.update((st) => ({
          ...st,
          tutor: {
            ...st.tutor,
            persona: personaId
          }
        }));
      }
    }

    heroPersonaPills.forEach(btn => {
      btn.addEventListener('click', () => {
        const personaId = btn.dataset.persona;
        if (window.StrictComponents) window.StrictComponents.playBeep('click');
        updateHeroPersonaUI(personaId);
      });
    });

    // Voice button trigger
    if (heroVoiceBtn) {
      heroVoiceBtn.addEventListener('click', () => {
        if (!window.PandaAvatar) return;

        if (window.PandaAvatar.isSpeaking) {
          window.PandaAvatar.stopSpeaking();
          heroVoiceBtn.innerHTML = '<span>🔊</span><span>Послухати голос Панди</span>';
          return;
        }

        const meta = window.StrictStore ? window.StrictStore.getPersonaMeta(currentPersona) : null;
        const textToSpeak = meta ? meta.greeting : 'Привіт! Я твій персональний репетитор Червона Панда.';

        heroVoiceBtn.innerHTML = '<span>⏹</span><span>Зупинити озвучення</span>';

        window.PandaAvatar.speak(textToSpeak, {
          persona: currentPersona,
          onStart: () => {
            heroVoiceBtn.innerHTML = '<span>⏹</span><span>Зупинити озвучення</span>';
          },
          onEnd: () => {
            heroVoiceBtn.innerHTML = '<span>🔊</span><span>Послухати голос Панди</span>';
          }
        });
      });
    }

    // Set initial active pill
    if (currentPersona) {
      updateHeroPersonaUI(currentPersona);
    }

    // 3. Interactive NMT Calculator
    const uniSelect = document.getElementById('calc-uni-select');
    const specSelect = document.getElementById('calc-spec-select');
    const rangeUkr = document.getElementById('range-ukr');
    const rangeMath = document.getElementById('range-math');
    const rangeHist = document.getElementById('range-hist');
    const rangeFourth = document.getElementById('range-fourth');

    const valUkr = document.getElementById('val-ukr');
    const valMath = document.getElementById('val-math');
    const valHist = document.getElementById('val-hist');
    const valFourth = document.getElementById('val-fourth');

    const kbResultEl = document.getElementById('calc-kb-result');
    const chancePctEl = document.getElementById('calc-chance-pct');
    const chanceFillEl = document.getElementById('calc-chance-fill');
    const statusBadgeEl = document.getElementById('calc-status-badge');
    const recTextEl = document.getElementById('calc-recommendation-text');
    const saveTargetBtn = document.getElementById('calc-save-target-btn');

    // Universities threshold configuration
    const UNI_DATA = {
      kpi: { name: 'КПІ ім. Ігоря Сікорського', targetScore: 182, minBudget: 178 },
      knu: { name: 'КНУ ім. Тараса Шевченка', targetScore: 184, minBudget: 180 },
      ukma: { name: 'НаУКМА', targetScore: 187, minBudget: 183 },
      lnu: { name: 'ЛНУ ім. Івана Франка', targetScore: 178, minBudget: 174 },
      khnu: { name: 'ХНУ ім. В. Н. Каразіна', targetScore: 174, minBudget: 170 },
      nmu: { name: 'НМУ ім. О. О. Богомольця', targetScore: 180, minBudget: 176 }
    };

    // Specialty subject coefficients (k1=Ukr, k2=Math, k3=Hist, k4=Fourth)
    const SPEC_COEFFS = {
      '121': { k1: 0.3, k2: 0.5, k3: 0.2, k4: 0.3, fourthName: '🇬🇧 Англійська мова / Фізика' },
      '122': { k1: 0.3, k2: 0.5, k3: 0.2, k4: 0.3, fourthName: '🇬🇧 Англійська мова / Фізика' },
      '081': { k1: 0.35, k2: 0.25, k3: 0.4, k4: 0.25, fourthName: '🇬🇧 Іноземна мова' },
      '222': { k1: 0.35, k2: 0.4, k3: 0.25, k4: 0.5, fourthName: '🧬 Біологія / Хімія' },
      '073': { k1: 0.35, k2: 0.35, k3: 0.3, k4: 0.25, fourthName: '🇬🇧 Іноземна мова' },
      '035': { k1: 0.45, k2: 0.2, k3: 0.25, k4: 0.4, fourthName: '🇬🇧 Англійська мова' }
    };

    function recalculateAdmissionScore() {
      if (!rangeUkr || !rangeMath || !rangeHist || !rangeFourth) return;

      const sUkr = parseFloat(rangeUkr.value);
      const sMath = parseFloat(rangeMath.value);
      const sHist = parseFloat(rangeHist.value);
      const sFourth = parseFloat(rangeFourth.value);

      if (valUkr) valUkr.textContent = sUkr;
      if (valMath) valMath.textContent = sMath;
      if (valHist) valHist.textContent = sHist;
      if (valFourth) valFourth.textContent = sFourth;

      const specKey = specSelect ? specSelect.value : '121';
      const coeffs = SPEC_COEFFS[specKey] || SPEC_COEFFS['121'];

      const fourthLabel = document.getElementById('label-fourth-subject');
      if (fourthLabel) {
        fourthLabel.textContent = `${coeffs.fourthName} (4-й предмет):`;
      }

      // Weighted sum formula: (k1*P1 + k2*P2 + k3*P3 + k4*P4) / (k1 + k2 + k3 + k4)
      const numerator = (coeffs.k1 * sUkr) + (coeffs.k2 * sMath) + (coeffs.k3 * sHist) + (coeffs.k4 * sFourth);
      const denominator = coeffs.k1 + coeffs.k2 + coeffs.k3 + coeffs.k4;
      const kb = numerator / denominator;
      const formattedKb = kb.toFixed(1);

      if (kbResultEl) kbResultEl.textContent = formattedKb;

      // Calculate admission chance
      const uniKey = uniSelect ? uniSelect.value : 'kpi';
      const uni = UNI_DATA[uniKey] || UNI_DATA.kpi;

      let chance = Math.round(((kb - (uni.minBudget - 15)) / ((uni.targetScore + 8) - (uni.minBudget - 15))) * 100);
      chance = Math.max(8, Math.min(99, chance));

      if (chancePctEl) chancePctEl.textContent = `${chance}%`;
      if (chanceFillEl) {
        chanceFillEl.style.width = `${chance}%`;
        if (chance >= 75) {
          chanceFillEl.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
        } else if (chance >= 50) {
          chanceFillEl.style.background = 'linear-gradient(135deg, #F2994A 0%, #EB5757 100%)';
        } else {
          chanceFillEl.style.background = 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)';
        }
      }

      if (statusBadgeEl) {
        if (chance >= 80) {
          statusBadgeEl.style.background = 'rgba(16, 185, 129, 0.15)';
          statusBadgeEl.style.color = 'var(--accent-success)';
          statusBadgeEl.textContent = `🔥 Гарантований шанс на бюджет (${uni.name})`;
        } else if (chance >= 55) {
          statusBadgeEl.style.background = 'rgba(242, 153, 74, 0.15)';
          statusBadgeEl.style.color = 'var(--accent-primary)';
          statusBadgeEl.textContent = `⚡ Середній шанс на бюджет / Гарантований контракт (${uni.name})`;
        } else {
          statusBadgeEl.style.background = 'rgba(244, 63, 94, 0.15)';
          statusBadgeEl.style.color = 'var(--accent-danger)';
          statusBadgeEl.textContent = `⚠️ Необхідно посилити підготовку (+${Math.max(4, Math.round(uni.minBudget - kb))} балів до прохідного)`;
        }
      }

      // Dynamic guidance text
      if (recTextEl) {
        const lowestSubject = [
          { name: 'Математику', val: sMath, key: 'math' },
          { name: 'Українську мову', val: sUkr, key: 'ukr' },
          { name: 'Історію України', val: sHist, key: 'hist' },
          { name: '4-й предмет', val: sFourth, key: 'fourth' }
        ].sort((a, b) => a.val - b.val)[0];

        recTextEl.innerHTML = `Панда-репетитор рекомендує підтягнути <strong>${lowestSubject.name}</strong> (зараз ${lowestSubject.val} б.) на <strong>+10-15 балів</strong>, щоб увійти в топ-10% рейтингу вступників.`;
      }
    }

    [rangeUkr, rangeMath, rangeHist, rangeFourth].forEach(slider => {
      if (slider) {
        slider.addEventListener('input', recalculateAdmissionScore);
      }
    });

    if (uniSelect) uniSelect.addEventListener('change', recalculateAdmissionScore);
    if (specSelect) specSelect.addEventListener('change', recalculateAdmissionScore);

    recalculateAdmissionScore();

    // Save Target Button
    if (saveTargetBtn) {
      saveTargetBtn.addEventListener('click', () => {
        const uniKey = uniSelect ? uniSelect.value : 'kpi';
        const uni = UNI_DATA[uniKey] || UNI_DATA.kpi;
        const specName = specSelect ? specSelect.options[specSelect.selectedIndex].text.split('(')[0].trim() : '121 Інженерія програмного забезпечення';
        const kb = kbResultEl ? parseFloat(kbResultEl.textContent) : 180;

        if (window.StrictStore) {
          window.StrictStore.update((st) => ({
            ...st,
            student: {
              ...st.student,
              targetUni: uni.name,
              targetSpecialty: specName,
              targetScore: Math.round(kb)
            }
          }));
        }

        if (window.StrictComponents) {
          window.StrictComponents.playBeep('success');
          window.StrictComponents.toast(`Ціль збережено: ${uni.name} (${Math.round(kb)} б.)! Панда адаптувала твій план.`, 'success');
        }
      });
    }

    // 4. Interactive Panda Wardrobe Showcase
    const wardrobeMount = document.getElementById('wardrobe-avatar-mount');
    const wardrobeBambooVal = document.getElementById('wardrobe-bamboo-val');
    const accBtnGlasses = document.getElementById('acc-btn-glasses');
    const accBtnBand = document.getElementById('acc-btn-band');
    const accBtnCap = document.getElementById('acc-btn-cap');
    const accBtnNone = document.getElementById('acc-btn-none');

    let wardrobeAccessory = store ? store.student.equippedAccessory : 'glasses';

    function renderWardrobeAvatar(acc) {
      if (!wardrobeMount) return;
      wardrobeAccessory = acc;

      // Draw avatar in wardrobe container
      const frame = document.createElement('div');
      wardrobeMount.innerHTML = '';
      wardrobeMount.appendChild(frame);

      // Create a dedicated avatar instance for wardrobe
      const wardrobeAvatar = new window.PandaAvatar.constructor();
      wardrobeAvatar.render(frame, {
        persona: currentPersona,
        accessory: acc,
        state: 'celebrating'
      });

      // Update button styles
      [accBtnGlasses, accBtnBand, accBtnCap, accBtnNone].forEach(btn => {
        if (btn) btn.classList.remove('active');
      });

      if (acc === 'glasses' && accBtnGlasses) accBtnGlasses.classList.add('active');
      if (acc === 'sensei_band' && accBtnBand) accBtnBand.classList.add('active');
      if (acc === 'graduation_cap' && accBtnCap) accBtnCap.classList.add('active');
      if (acc === 'none' && accBtnNone) accBtnNone.classList.add('active');

      // Update store
      if (window.StrictStore) {
        window.StrictStore.update((st) => ({
          ...st,
          student: {
            ...st.student,
            equippedAccessory: acc
          }
        }));
      }

      // Also update hero avatar if rendered
      if (window.PandaAvatar) {
        window.PandaAvatar.setAccessory(acc);
      }
    }

    if (wardrobeMount && window.PandaAvatar) {
      renderWardrobeAvatar(wardrobeAccessory);
    }

    if (accBtnGlasses) accBtnGlasses.onclick = () => { if (window.StrictComponents) window.StrictComponents.playBeep('click'); renderWardrobeAvatar('glasses'); };
    if (accBtnBand) accBtnBand.onclick = () => { if (window.StrictComponents) window.StrictComponents.playBeep('click'); renderWardrobeAvatar('sensei_band'); };
    if (accBtnCap) accBtnCap.onclick = () => { if (window.StrictComponents) window.StrictComponents.playBeep('click'); renderWardrobeAvatar('graduation_cap'); };
    if (accBtnNone) accBtnNone.onclick = () => { if (window.StrictComponents) window.StrictComponents.playBeep('click'); renderWardrobeAvatar('none'); };

    // 5. Sync live values from StrictStore
    if (window.StrictStore) {
      window.StrictStore.subscribe((st) => {
        const focusMinsEl = document.getElementById('bento-focus-mins');
        if (focusMinsEl) {
          const unit = window.StrictI18n ? window.StrictI18n.t('tracker.minutesShort', 'хв') : 'хв';
          focusMinsEl.textContent = `${st.tracker.focusMinutesToday || 0} ${unit}`;
        }
        if (wardrobeBambooVal) {
          const coinsLabel = window.StrictI18n ? window.StrictI18n.t('index.wardrobe.coinsLabel', 'коїнів') : 'коїнів';
          wardrobeBambooVal.textContent = `🎋 ${st.student.bambooCoins || 0} ${coinsLabel}`;
        }
      });
    }

    // 6. Hero Stats Localized Labels
    const HERO_STATS_LABELS = {
      uk: ['Сер. прогнозований бал', 'Вступників на бюджет', 'Шансів списати у соцмережах', 'Унікальних характерів ШІ'],
      en: ['Avg. Predicted Score', 'State-Funded Admissions', 'Chances to Cheat on Socials', 'Unique AI Personas'],
      pl: ['Śr. prognozowany wynik', 'Przyjęć na studia dzienne', 'Szans na ściąganie w sieci', 'Unikalnych charakterów AI'],
      de: ['Prognostizierte Punktzahl', 'Studienplatz-Quote', 'Chancen zum Schummeln', 'Einzigartige KI-Charaktere']
    };

    function updateHeroStatsLabels(locale) {
      const loc = locale || (window.StrictStore ? window.StrictStore.get().locale : 'uk') || 'uk';
      const labels = HERO_STATS_LABELS[loc] || HERO_STATS_LABELS.uk;
      const statLabels = document.querySelectorAll('.hero-stats-row .hero-stat-lbl');
      statLabels.forEach((el, idx) => {
        if (labels[idx]) {
          el.textContent = labels[idx];
        }
      });
    }
    updateHeroStatsLabels();

    // 7. Listen for i18n locale change
    window.addEventListener('strictai:localechange', (e) => {
      const newLoc = (e && e.detail && e.detail.locale) || (window.StrictStore ? window.StrictStore.get().locale : 'uk');
      
      // Re-apply hero persona UI with new locale texts
      updateHeroPersonaUI(currentPersona);
      
      // Update voice button text
      if (heroVoiceBtn && (!window.PandaAvatar || !window.PandaAvatar.isSpeaking)) {
        const btnVoiceText = window.StrictI18n ? window.StrictI18n.t('index.hero.btnVoice', 'Послухати голос Панди') : 'Послухати голос Панди';
        heroVoiceBtn.innerHTML = `<span>🔊</span><span>${btnVoiceText}</span>`;
      }

      // Update hero stats labels
      updateHeroStatsLabels(newLoc);

      // Re-apply i18n DOM mappings if StrictI18n is loaded
      if (window.StrictI18n && typeof window.StrictI18n.applyToDOM === 'function') {
        window.StrictI18n.applyToDOM();
      }
    });
  });
})();
