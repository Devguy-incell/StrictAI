/**
 * StrictAI Missed Lesson Notification System & Global Navigation
 * File: js/notifications.js
 */

(function() {
    window.StrictNotifications = {
        init() {
            console.log('[StrictNotifications] Initializing missed lesson monitor...');
            this.ensureStore();
            this.setupAudioContext();
            this.checkScheduleLoop();
            setInterval(() => this.checkScheduleLoop(), 60000);
        },

        ensureStore() {
            let data = {};
            try {
                data = JSON.parse(localStorage.getItem('strictai_notifications') || '{"alerts":[], "settings": {"lessonTime": "17:00", "enabled": true}}');
            } catch(e) {
                data = { alerts: [], settings: { lessonTime: "17:00", enabled: true } };
            }
            window.StrictNotificationsData = data;
        },

        saveStore() {
            try {
                localStorage.setItem('strictai_notifications', JSON.stringify(window.StrictNotificationsData));
            } catch(e) {}
            window.dispatchEvent(new CustomEvent('strictai:notifications-updated', { detail: window.StrictNotificationsData }));
        },

        setupAudioContext() {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.audioCtx = new AudioCtx();
                }
            } catch(e) {
                console.warn('[StrictNotifications] Web Audio not supported', e);
            }
        },

        playChime() {
            try {
                if (!this.audioCtx) {
                    const AudioCtx = window.AudioContext || window.webkitAudioContext;
                    if (AudioCtx) this.audioCtx = new AudioCtx();
                }
                if (this.audioCtx) {
                    if (this.audioCtx.state === 'suspended') {
                        this.audioCtx.resume();
                    }
                    const osc = this.audioCtx.createOscillator();
                    const gain = this.audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(587.33, this.audioCtx.currentTime); // D5
                    osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.3); // A5
                    gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.8);
                    osc.connect(gain);
                    gain.connect(this.audioCtx.destination);
                    osc.start();
                    osc.stop(this.audioCtx.currentTime + 0.8);
                }
            } catch(e) {
                console.warn('[StrictNotifications] Audio chime playback error', e);
            }
        },

        requestBrowserPermission() {
            if (window.Notification) {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification('StrictAI', { body: 'Дозвіл на сповіщення успішно активовано! 🔔' });
                    }
                });
            }
        },

        triggerMissedLessonAlert(opts) {
            this.ensureStore();
            const now = new Date();
            const currentTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            let subject = 'Математика / NMT';
            let scheduledTime = '17:00';
            let studentName = 'Антон';

            if (typeof opts === 'string') {
                subject = opts || subject;
            } else if (opts && typeof opts === 'object') {
                if (opts.subject) subject = opts.subject;
                if (opts.scheduledTime) scheduledTime = opts.scheduledTime;
                if (opts.studentName) studentName = opts.studentName;
            }

            const alertObj = {
                id: 'notif_' + Date.now(),
                title: '⚠️ Пропущено плановий урок!',
                message: `Учень ${studentName} не розпочав заняття з ${subject} о ${scheduledTime}. Батькам надіслано сповіщення у Батьківський контроль.`,
                time: currentTimeStr,
                scheduledTime: scheduledTime,
                studentName: studentName,
                timestamp: Date.now(),
                read: false,
                subject: subject
            };

            window.StrictNotificationsData.alerts.unshift(alertObj);
            if (window.StrictNotificationsData.alerts.length > 50) {
                window.StrictNotificationsData.alerts.pop();
            }
            this.saveStore();

            this.playChime();

            // Show UI toast if window.StrictComponents.toast exists
            if (window.StrictComponents && typeof window.StrictComponents.toast === 'function') {
                window.StrictComponents.toast(`🔔 Пропущено плановий урок: ${subject} (${scheduledTime}) — ${studentName}`, 'warning');
            }

            if (window.Notification && Notification.permission === 'granted') {
                try {
                    new Notification('⚠️ Пропущено плановий урок StrictAI!', {
                        body: `Панда чекає на заняття (${subject}, ${scheduledTime}). Учень: ${studentName}.`,
                        icon: 'favicon.ico'
                    });
                } catch(e) {}
            }

            window.dispatchEvent(new CustomEvent('strictai:missed-lesson', { detail: alertObj }));
            console.warn('[StrictNotifications] MISSED LESSON ALERT:', alertObj.message);
            return alertObj;
        },

        checkScheduleLoop() {
            this.ensureStore();
            if (!window.StrictNotificationsData.settings.enabled) return;

            const lessonTime = window.StrictNotificationsData.settings.lessonTime || "17:00";
            const [targetHour, targetMinute] = lessonTime.split(':').map(Number);

            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            if (currentHour === targetHour && currentMinute === targetMinute) {
                const todayKey = now.toISOString().split('T')[0];
                if (localStorage.getItem('strictai_last_checked_' + todayKey) !== 'true') {
                    localStorage.setItem('strictai_last_checked_' + todayKey, 'true');
                    const stats = JSON.parse(localStorage.getItem('strictai_stats') || '{}');
                    const lastActive = stats.lastActiveDate || '';
                    if (lastActive !== todayKey) {
                        this.triggerMissedLessonAlert('Українська мова / NMT');
                    }
                }
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.StrictNotifications.init());
    } else {
        window.StrictNotifications.init();
    }
})();
