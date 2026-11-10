/**
 * StrictAI Digital Avatar — "Червона Панда" (Red Panda Tutor)
 * Interactive Vector SVG Avatar with dynamic expressions, accessories,
 * animated speech mouth movements, and Web Speech API synthesis.
 */

(function () {
  'use strict';

  class PandaAvatarController {
    constructor() {
      this.currentPersona = 'friend';
      this.currentState = 'idle';
      this.currentAccessory = 'glasses';
      this.container = null;
      this.isSpeaking = false;
      this.speechSynth = window.speechSynthesis || null;
      this.currentUtterance = null;
      this.voices = [];

      this._loadVoices();
      if (this.speechSynth && this.speechSynth.onvoiceschanged !== undefined) {
        this.speechSynth.onvoiceschanged = () => this._loadVoices();
      }
    }

    _loadVoices() {
      if (!this.speechSynth) return;
      this.voices = this.speechSynth.getVoices() || [];
    }

    _findBestVoice(lang = 'uk-UA', gender = 'female') {
      if (!this.voices.length && this.speechSynth) {
        this.voices = this.speechSynth.getVoices() || [];
      }

      // 1. Look for explicit Ukrainian voices
      const ukVoices = this.voices.filter(v => v.lang.startsWith('uk') || v.lang.startsWith('ua'));
      if (ukVoices.length > 0) {
        const matchingGender = ukVoices.find(v => {
          const n = v.name.toLowerCase();
          return gender === 'female' ? (n.includes('female') || n.includes('lesya') || n.includes('oksana') || n.includes('polina')) : (n.includes('male') || n.includes('mykola') || n.includes('taras'));
        });
        return matchingGender || ukVoices[0];
      }

      // 2. Fallback to Polish/Czech or common European Slavic or default
      const fallbackSlavic = this.voices.find(v => v.lang.startsWith('pl') || v.lang.startsWith('sk'));
      if (fallbackSlavic) return fallbackSlavic;

      // 3. System default
      return this.voices.find(v => v.default) || this.voices[0] || null;
    }

    /**
     * Mounts the avatar in a target DOM element
     */
    render(containerOrSelector, options = {}) {
      if (typeof containerOrSelector === 'string') {
        this.container = document.querySelector(containerOrSelector);
      } else {
        this.container = containerOrSelector;
      }

      if (!this.container) {
        console.warn('PandaAvatar: target container not found');
        return;
      }

      const store = window.StrictStore ? window.StrictStore.get() : null;
      this.currentPersona = options.persona || (store ? store.tutor.persona : 'friend');
      this.currentAccessory = options.accessory || (store ? store.student.equippedAccessory : 'glasses');
      this.currentState = options.state || 'idle';

      this._draw();
    }

    setPersona(personaId) {
      this.currentPersona = personaId;
      if (personaId === 'strict' && this.currentAccessory === 'none') {
        this.currentAccessory = 'glasses';
      }
      this._updateVisuals();
    }

    setState(stateName) {
      this.currentState = stateName;
      this._updateVisuals();
    }

    setAccessory(accessoryId) {
      this.currentAccessory = accessoryId;
      this._updateVisuals();
    }

    _updateVisuals() {
      if (!this.container) return;
      this._draw();
    }

    _draw() {
      if (!this.container) return;

      const p = this.currentPersona;
      const s = this.currentState;
      const acc = this.currentAccessory;

      // Frame class based on state
      let frameClass = 'panda-circle-frame';
      if (s === 'strict-warning') frameClass += ' warning-mode';
      else if (p === 'strict') frameClass += ' strict-mode';

      // Eyebrow geometry
      let leftBrowD = 'M 64 68 Q 78 64 90 68';
      let rightBrowD = 'M 110 68 Q 122 64 136 68';

      if (p === 'strict' || s === 'strict-warning') {
        leftBrowD = 'M 64 64 Q 78 72 92 73';
        rightBrowD = 'M 108 73 Q 122 72 136 64';
      } else if (p === 'joker') {
        leftBrowD = 'M 64 63 Q 78 58 90 65';
        rightBrowD = 'M 110 69 Q 122 72 136 71';
      } else if (p === 'motivator') {
        leftBrowD = 'M 64 64 Q 78 69 91 67';
        rightBrowD = 'M 109 67 Q 122 69 136 64';
      } else if (s === 'thinking') {
        leftBrowD = 'M 64 62 Q 78 57 90 63';
        rightBrowD = 'M 110 71 Q 122 74 136 71';
      }

      // Eye shapes
      let leftEyeMarkup = `<circle cx="77" cy="80" r="8" fill="#1C1022" />
                           <circle cx="75" cy="78" r="2.8" fill="#FFFFFF" />
                           <circle cx="79" cy="82" r="1.2" fill="#FFFFFF" />`;
      let rightEyeMarkup = `<circle cx="123" cy="80" r="8" fill="#1C1022" />
                            <circle cx="121" cy="78" r="2.8" fill="#FFFFFF" />
                            <circle cx="125" cy="82" r="1.2" fill="#FFFFFF" />`;

      if (p === 'joker' && (s === 'idle' || s === 'speaking')) {
        rightEyeMarkup = `<path d="M 115 82 Q 123 74 131 82" fill="none" stroke="#1C1022" stroke-width="3.5" stroke-linecap="round" />`;
      } else if (p === 'calm' || s === 'celebrating') {
        leftEyeMarkup = `<path d="M 69 81 Q 77 73 85 81" fill="none" stroke="#1C1022" stroke-width="3" stroke-linecap="round" />`;
        rightEyeMarkup = `<path d="M 115 81 Q 123 73 131 81" fill="none" stroke="#1C1022" stroke-width="3" stroke-linecap="round" />`;
      }

      // Mouth geometry
      let mouthMarkup = '';
      if (s === 'speaking' || this.isSpeaking) {
        mouthMarkup = `<g class="panda-mouth-talking">
          <path d="M 92 108 Q 100 124 108 108 Z" fill="#D83A56" stroke="#90142C" stroke-width="1.5" />
          <path d="M 94 115 Q 100 119 106 115" fill="#FFAAA6" />
        </g>`;
      } else if (s === 'celebrating' || p === 'friend') {
        mouthMarkup = `<path d="M 92 108 Q 100 117 108 108" fill="none" stroke="#1C1022" stroke-width="2.8" stroke-linecap="round" />`;
      } else if (p === 'strict' || s === 'strict-warning') {
        mouthMarkup = `<path d="M 93 111 Q 100 108 107 111" fill="none" stroke="#1C1022" stroke-width="2.8" stroke-linecap="round" />`;
      } else if (p === 'joker') {
        mouthMarkup = `<path d="M 92 109 Q 101 118 111 106" fill="none" stroke="#1C1022" stroke-width="2.8" stroke-linecap="round" />
                       <path d="M 103 112 Q 106 118 109 113 Z" fill="#FF7675" />`;
      } else {
        mouthMarkup = `<path d="M 93 108 Q 100 114 107 108" fill="none" stroke="#1C1022" stroke-width="2.5" stroke-linecap="round" />`;
      }

      // Accessories
      let accessoryMarkup = '';
      if (acc === 'glasses' || p === 'strict') {
        accessoryMarkup = `
          <!-- Professor Round Glasses -->
          <g id="accessory-glasses" stroke="#F2994A" stroke-width="2.5" fill="none">
            <circle cx="77" cy="80" r="14" fill="rgba(255,255,255,0.15)" />
            <circle cx="123" cy="80" r="14" fill="rgba(255,255,255,0.15)" />
            <path d="M 91 80 Q 100 77 109 80" />
            <path d="M 63 80 L 50 76" stroke-linecap="round" />
            <path d="M 137 80 L 150 76" stroke-linecap="round" />
            <!-- Lens Glare -->
            <path d="M 72 73 L 82 83" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-linecap="round" />
            <path d="M 118 73 L 128 83" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-linecap="round" />
          </g>
        `;
      } else if (acc === 'sensei_band' || p === 'motivator') {
        accessoryMarkup = `
          <!-- Sensei Headband -->
          <g id="accessory-band">
            <path d="M 45 56 Q 100 48 155 56 L 154 66 Q 100 58 46 66 Z" fill="#E63946" stroke="#90142C" stroke-width="1.5" />
            <circle cx="100" cy="59" r="6" fill="#FDFDFD" />
            <circle cx="100" cy="59" r="4" fill="#F2994A" />
            <!-- Band Ribbons -->
            <path d="M 152 62 Q 165 66 172 78 Q 166 76 154 67 Z" fill="#E63946" />
          </g>
        `;
      } else if (acc === 'graduation_cap') {
        accessoryMarkup = `
          <!-- Graduation Cap -->
          <g id="accessory-cap">
            <polygon points="100,20 155,34 100,48 45,34" fill="#1C1022" stroke="#F2994A" stroke-width="1.5" />
            <polygon points="65,39 65,49 135,49 135,39" fill="#2B184A" />
            <path d="M 100 34 L 148 44 L 148 58" fill="none" stroke="#F2994A" stroke-width="2" />
            <circle cx="148" cy="60" r="3" fill="#F2994A" />
          </g>
        `;
      } else if (acc === 'cyber_visor') {
        accessoryMarkup = `
          <!-- Cyber Visor NMT 200 -->
          <g id="accessory-visor">
            <path d="M 45 74 Q 100 66 155 74 L 152 88 Q 100 80 48 88 Z" fill="#06B6D4" opacity="0.88" stroke="#22D3EE" stroke-width="2" />
            <line x1="55" y1="81" x2="145" y2="81" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="4,2" />
            <text x="100" y="83" fill="#FFFFFF" font-size="7" font-weight="900" text-anchor="middle" font-family="monospace">NMT 200</text>
          </g>
        `;
      }

      // Cheeks blush
      const blushOpacity = (p === 'friend' || s === 'celebrating') ? '0.45' : '0.2';

      const svgHtml = `
        <div class="${frameClass}" id="panda-frame">
          <svg class="panda-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="furGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#E66728" />
                <stop offset="60%" stop-color="#C8481A" />
                <stop offset="100%" stop-color="#8E2D0E" />
              </linearGradient>
              <linearGradient id="innerEarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FFFFFF" />
                <stop offset="100%" stop-color="#F5DDC7" />
              </linearGradient>
              <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="3" flood-opacity="0.3"/>
              </filter>
            </defs>

            <!-- Ears -->
            <g class="panda-ear-left">
              <path d="M 40 70 Q 22 30 52 28 Q 68 28 66 60 Z" fill="#2B1610" />
              <path d="M 44 64 Q 32 36 52 35 Q 62 36 60 56 Z" fill="url(#innerEarGrad)" />
            </g>

            <g class="panda-ear-right">
              <path d="M 160 70 Q 178 30 148 28 Q 132 28 134 60 Z" fill="#2B1610" />
              <path d="M 156 64 Q 168 36 148 35 Q 138 36 140 56 Z" fill="url(#innerEarGrad)" />
            </g>

            <!-- Head & Body Group -->
            <g class="panda-body-group">
              <!-- Torso / Shoulders -->
              <path d="M 48 165 C 50 142 80 135 100 135 C 120 135 150 142 152 165 C 153 178 150 195 150 195 L 50 195 C 50 195 47 178 48 165 Z" fill="#2A1612" />
              <!-- White chest collar ruffle -->
              <path d="M 85 137 Q 100 152 115 137 Q 100 144 85 137 Z" fill="#FFF2E2" />

              <!-- Head Base -->
              <ellipse cx="100" cy="92" rx="55" ry="48" fill="url(#furGradient)" filter="url(#shadowFilter)" />

              <!-- White Face Markings (Cheeks & Eyebrow spots) -->
              <ellipse cx="64" cy="96" rx="20" ry="16" fill="#FFF6EB" />
              <ellipse cx="136" cy="96" rx="20" ry="16" fill="#FFF6EB" />
              <!-- White brow spots -->
              <ellipse cx="74" cy="62" rx="7" ry="5" fill="#FFF6EB" />
              <ellipse cx="126" cy="62" rx="7" ry="5" fill="#FFF6EB" />

              <!-- Russet Tear Stripes Under Eyes -->
              <path d="M 72 88 Q 69 98 73 108" fill="none" stroke="#A73812" stroke-width="4" stroke-linecap="round" />
              <path d="M 128 88 Q 131 98 127 108" fill="none" stroke="#A73812" stroke-width="4" stroke-linecap="round" />

              <!-- Cute Muzzle (Cream-White) -->
              <ellipse cx="100" cy="103" rx="22" ry="16" fill="#FFF6EB" />

              <!-- Pink Blushing Cheeks -->
              <ellipse cx="58" cy="98" rx="8" ry="5" fill="#FF7675" opacity="${blushOpacity}" />
              <ellipse cx="142" cy="98" rx="8" ry="5" fill="#FF7675" opacity="${blushOpacity}" />

              <!-- Eyes & Blink Group -->
              <g class="panda-eye-blink">
                <g id="panda-left-eye">${leftEyeMarkup}</g>
                <g id="panda-right-eye">${rightEyeMarkup}</g>
              </g>

              <!-- Eyebrows -->
              <path d="${leftBrowD}" fill="none" stroke="#3D1E16" stroke-width="3" stroke-linecap="round" />
              <path d="${rightBrowD}" fill="none" stroke="#3D1E16" stroke-width="3" stroke-linecap="round" />

              <!-- Nose -->
              <path d="M 95 97 Q 100 94 105 97 Q 103 102 100 102 Q 97 102 95 97 Z" fill="#201015" />

              <!-- Mouth -->
              <g id="panda-mouth">
                ${mouthMarkup}
              </g>

              <!-- Equipped Accessory Overlay -->
              ${accessoryMarkup}
            </g>
          </svg>
        </div>

        <!-- Voice Waveform -->
        <div class="voice-wave ${this.isSpeaking ? 'speaking' : ''}" id="panda-voice-wave" title="Голосовий відгук Панди">
          <span class="voice-wave-bar"></span>
          <span class="voice-wave-bar"></span>
          <span class="voice-wave-bar"></span>
          <span class="voice-wave-bar"></span>
          <span class="voice-wave-bar"></span>
          <span class="voice-wave-bar"></span>
          <span class="voice-wave-bar"></span>
        </div>
      `;

      this.container.innerHTML = svgHtml;
    }

    /**
     * Synthesize speech using Web Speech API with expressive pacing and fallback
     */
    speak(text, options = {}) {
      if (!text) return;
      this.stopSpeaking();

      const store = window.StrictStore ? window.StrictStore.get() : null;
      const personaId = options.persona || this.currentPersona;
      const meta = window.StrictStore ? window.StrictStore.getPersonaMeta(personaId) : { voicePitch: 1.0, voiceRate: 1.0 };
      const lang = options.lang || 'uk-UA';
      const gender = options.gender || (store ? store.tutor.voiceGender : 'female');

      this.isSpeaking = true;
      this.setState('speaking');

      const waveEl = this.container ? this.container.querySelector('#panda-voice-wave') : null;
      if (waveEl) waveEl.classList.add('speaking');

      if (options.onStart) options.onStart();

      if (!this.speechSynth) {
        // Fallback timer when speech synthesis is unavailable
        const durationMs = Math.min(8000, Math.max(1500, text.length * 70));
        setTimeout(() => {
          this.stopSpeaking();
          if (options.onEnd) options.onEnd();
        }, durationMs);
        return;
      }

      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.pitch = meta.voicePitch || 1.0;
        utterance.rate = meta.voiceRate || 1.0;

        const bestVoice = this._findBestVoice(lang, gender);
        if (bestVoice) {
          utterance.voice = bestVoice;
        }

        utterance.onend = () => {
          this.isSpeaking = false;
          this.setState('idle');
          if (waveEl) waveEl.classList.remove('speaking');
          if (options.onEnd) options.onEnd();
        };

        utterance.onerror = (err) => {
          console.warn('SpeechSynthesis error:', err);
          this.isSpeaking = false;
          this.setState('idle');
          if (waveEl) waveEl.classList.remove('speaking');
          if (options.onEnd) options.onEnd();
        };

        this.currentUtterance = utterance;
        this.speechSynth.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis invocation failed:', err);
        this.isSpeaking = false;
        this.setState('idle');
      }
    }

    stopSpeaking() {
      if (this.speechSynth && this.speechSynth.speaking) {
        this.speechSynth.cancel();
      }
      this.isSpeaking = false;
      this.setState('idle');
      if (this.container) {
        const waveEl = this.container.querySelector('#panda-voice-wave');
        if (waveEl) waveEl.classList.remove('speaking');
      }
    }
  }

  // Export Singleton on window
  window.PandaAvatar = new PandaAvatarController();

})();
