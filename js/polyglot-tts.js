/**
 * StrictAI Polyglot TTS & Official Word Audio Module
 * Handles bilingual speech synthesis (ukrainian explanation + target language example)
 * and official pronunciation playback for dictionary words.
 */

(function (root) {
  'use strict';

  class StrictPolyglotTTS {
    constructor() {
      this.synth = typeof window !== 'undefined' && window.speechSynthesis ? window.speechSynthesis : null;
      this.enabled = true;
      this.gender = 'female'; // 'female' | 'male'
      this.rate = 1.0;
      this.pitch = 1.0;
      this.volume = 1.0;
      this.voices = [];
      this.currentAudio = null;

      if (this.synth) {
        this.loadVoices();
        if (typeof this.synth.onvoiceschanged !== 'undefined') {
          this.synth.onvoiceschanged = () => this.loadVoices();
        }
      }
    }

    loadVoices() {
      if (this.synth && typeof this.synth.getVoices === 'function') {
        this.voices = this.synth.getVoices() || [];
      }
    }

    resolveLang(lang) {
      if (!lang) return 'en-US';
      const key = String(lang).trim().toLowerCase();
      const langMap = {
        'english': 'en-US',
        'en': 'en-US',
        'en-us': 'en-US',
        'en-gb': 'en-GB',
        'deutsch': 'de-DE',
        'german': 'de-DE',
        'de': 'de-DE',
        'de-de': 'de-DE',
        'espanol': 'es-ES',
        'spanish': 'es-ES',
        'es': 'es-ES',
        'es-es': 'es-ES',
        'chinese': 'zh-CN',
        'zh': 'zh-CN',
        'zh-cn': 'zh-CN',
        'polish': 'pl-PL',
        'pl': 'pl-PL',
        'pl-pl': 'pl-PL',
        'ukrainian': 'uk-UA',
        'uk': 'uk-UA',
        'uk-ua': 'uk-UA',
        'french': 'fr-FR',
        'fr': 'fr-FR',
        'fr-fr': 'fr-FR',
        'italian': 'it-IT',
        'it': 'it-IT'
      };
      return langMap[key] || (key.length === 2 ? `${key}-${key.toUpperCase()}` : key);
    }

    findVoice(langCode) {
      if (!this.voices || this.voices.length === 0) {
        this.loadVoices();
      }
      const prefix = langCode.slice(0, 2).toLowerCase();
      const isFemale = this.gender === 'female';

      const langMatches = this.voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(prefix));
      if (langMatches.length === 0) return null;

      const genderMatch = langMatches.find(v => {
        const name = (v.name || '').toLowerCase();
        return isFemale ? (name.includes('female') || !name.includes('male')) : name.includes('male');
      });

      return genderMatch || langMatches[0];
    }

    cancel() {
      if (this.currentAudio) {
        try {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        } catch (e) {
          // ignore
        }
        this.currentAudio = null;
      }
      if (this.synth) {
        this.synth.cancel();
      }
    }

    stop() {
      this.cancel();
    }

    setEnabled(enabled) {
      this.enabled = !!enabled;
      if (!this.enabled) {
        this.cancel();
      }
    }

    setGender(gender) {
      if (gender === 'female' || gender === 'male') {
        this.gender = gender;
      }
    }

    setRate(rate) {
      if (typeof rate === 'number' && rate >= 0.1 && rate <= 2.0) {
        this.rate = rate;
      }
    }

    setPitch(pitch) {
      if (typeof pitch === 'number' && pitch >= 0 && pitch <= 2.0) {
        this.pitch = pitch;
      }
    }

    setVolume(volume) {
      if (typeof volume === 'number' && volume >= 0 && volume <= 1.0) {
        this.volume = volume;
      }
    }

    /**
     * Speaks a bilingual explanation: first Ukrainian commentary, then target language example/sentence.
     * @param {string} ukText - Ukrainian commentary / grammar explanation
     * @param {string} targetText - Target language sentence / idiom / phrase
     * @param {string} targetLang - Language code ('en', 'de', 'es', 'zh', 'pl', etc.)
     * @param {Function} [onStart] - Callback when speech starts
     * @param {Function} [onEnd] - Callback when speech ends
     */
    speakBilingual(ukText, targetText, targetLang, onStart, onEnd) {
      if (!this.enabled || !this.synth) {
        if (typeof onEnd === 'function') onEnd();
        return;
      }

      this.cancel();

      const resolvedTargetLang = this.resolveLang(targetLang);

      // 1. Create Ukrainian utterance for explanation
      const ukUtterance = new SpeechSynthesisUtterance(ukText || '');
      ukUtterance.lang = 'uk-UA';
      ukUtterance.rate = this.rate;
      ukUtterance.pitch = this.pitch;
      ukUtterance.volume = this.volume;

      const ukVoice = this.findVoice('uk-UA');
      if (ukVoice) ukUtterance.voice = ukVoice;

      // 2. Create target language utterance for example
      const targetUtterance = new SpeechSynthesisUtterance(targetText || '');
      targetUtterance.lang = resolvedTargetLang;
      targetUtterance.rate = Math.max(0.7, this.rate * 0.95); // slightly clearer/slower for language learners
      targetUtterance.pitch = this.pitch;
      targetUtterance.volume = this.volume;

      const targetVoice = this.findVoice(resolvedTargetLang);
      if (targetVoice) targetUtterance.voice = targetVoice;

      let started = false;
      ukUtterance.onstart = () => {
        if (!started && typeof onStart === 'function') {
          started = true;
          onStart();
        }
      };

      targetUtterance.onend = () => {
        if (typeof onEnd === 'function') onEnd();
      };
      targetUtterance.onerror = () => {
        if (typeof onEnd === 'function') onEnd();
      };

      if (!targetText) {
        ukUtterance.onend = () => {
          if (typeof onEnd === 'function') onEnd();
        };
        this.synth.speak(ukUtterance);
        return;
      }

      // Chain: Ukrainian first, then target language after short pause
      ukUtterance.onend = () => {
        setTimeout(() => {
          if (this.synth) {
            this.synth.speak(targetUtterance);
          } else if (typeof onEnd === 'function') {
            onEnd();
          }
        }, 300);
      };

      this.synth.speak(ukUtterance);
    }

    /**
     * Plays official pronunciation for a dictionary word or idiom with button animation.
     * Uses official audio URL if available (e.g. from StrictDictData), otherwise synthesizes speech.
     * @param {string} word - The word or phrase to pronounce
     * @param {string} lang - Language code
     * @param {HTMLElement} [btnElement] - The button element clicked
     * @param {Function} [onEnd] - Callback when playback finishes
     */
    playOfficialWordAudio(word, lang, btnElement, onEnd) {
      if (!word) {
        if (typeof onEnd === 'function') onEnd();
        return;
      }

      this.cancel();

      let originalHTML = '';
      const finish = () => {
        if (btnElement && originalHTML) {
          btnElement.innerHTML = originalHTML;
          btnElement.classList.remove('playing-audio');
        }
        if (typeof onEnd === 'function') onEnd();
      };

      if (btnElement) {
        originalHTML = btnElement.innerHTML;
        btnElement.innerHTML = `🟢 [Озвучується...]`;
        btnElement.classList.add('playing-audio');
      }

      // Check if official audio exists in StrictDictData
      let officialAudioUrl = '';
      if (typeof window !== 'undefined' && window.StrictDictData && typeof window.StrictDictData.lookup === 'function') {
        const dictEntry = window.StrictDictData.lookup(lang, word);
        if (dictEntry && dictEntry.audio) {
          officialAudioUrl = dictEntry.audio;
        }
      }

      if (officialAudioUrl && typeof Audio !== 'undefined') {
        try {
          const audio = new Audio(officialAudioUrl);
          this.currentAudio = audio;
          audio.onended = () => {
            this.currentAudio = null;
            finish();
          };
          audio.onerror = () => {
            this.currentAudio = null;
            this._speakFallback(word, lang, finish);
          };
          audio.play().catch(() => {
            this.currentAudio = null;
            this._speakFallback(word, lang, finish);
          });
          return;
        } catch (e) {
          // fall through to speech synthesis
        }
      }

      this._speakFallback(word, lang, finish);
    }

    _speakFallback(word, lang, callback) {
      if (!this.synth || !this.enabled) {
        if (typeof callback === 'function') callback();
        return;
      }

      const resolvedLang = this.resolveLang(lang);
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = resolvedLang;
      utterance.rate = Math.max(0.7, this.rate * 0.9);
      utterance.pitch = this.pitch;
      utterance.volume = this.volume;

      const voice = this.findVoice(resolvedLang);
      if (voice) utterance.voice = voice;

      utterance.onend = () => {
        if (typeof callback === 'function') callback();
      };
      utterance.onerror = () => {
        if (typeof callback === 'function') callback();
      };

      this.synth.speak(utterance);
    }

    /**
     * Speaks a single text in a given language.
     * @param {string} text - Text to speak
     * @param {string} [lang='uk-UA'] - Language code
     * @param {Function} [onStart] - Callback when speech starts
     * @param {Function} [onEnd] - Callback when speech ends
     */
    speakSingle(text, lang = 'uk-UA', onStart, onEnd) {
      if (!this.enabled || !this.synth) {
        if (typeof onEnd === 'function') onEnd();
        return;
      }

      this.cancel();

      const resolvedLang = this.resolveLang(lang);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = resolvedLang;
      utterance.rate = this.rate;
      utterance.pitch = this.pitch;
      utterance.volume = this.volume;

      const voice = this.findVoice(resolvedLang);
      if (voice) utterance.voice = voice;

      if (typeof onStart === 'function') {
        utterance.onstart = onStart;
      }
      utterance.onend = () => {
        if (typeof onEnd === 'function') onEnd();
      };
      utterance.onerror = () => {
        if (typeof onEnd === 'function') onEnd();
      };

      this.synth.speak(utterance);
    }

    speak(text, lang, onStart, onEnd) {
      return this.speakSingle(text, lang, onStart, onEnd);
    }
  }

  const instance = new StrictPolyglotTTS();

  if (typeof root !== 'undefined') {
    root.StrictPolyglotTTS = instance;
  }
  if (typeof window !== 'undefined') {
    window.StrictPolyglotTTS = instance;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StrictPolyglotTTS, instance };
  }

  console.log('StrictPolyglotTTS initialized successfully.');
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
