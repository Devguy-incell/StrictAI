# StrictAI Mobile Application (PWA + Capacitor)

Повнофункціональний мобільний застосунок екосистеми **StrictAI** для щоденної підготовки до НМТ, інтерактивних занять із ШІ-репетитором, чесного тестування та батьківського контролю. Працює як офлайн-готовий **PWA** (`manifest.webmanifest`, `sw.js`) та нативна оболонка **Capacitor** (`ua.strictai.mobile`).

## 5 основних вкладок

1. **Сьогодні** — персональний план дня, стріки, адаптивні завдання та швидкий старт сесії.
2. **Репетитор** — покроковий ШІ-розбір тем, підказки без готових відповідей та закріплення матеріалу.
3. **Іспити** — симулятор НМТ із захистом **Anti-Cheat / Anti-OCR** на базі `<canvas>` (`js/app-anticheat.js`), таймером і фіксацією втрати фокусу.
4. **Фокус & Мапа** — фокус-таймер навчальних сесій та інтерактивна мапа прогресу по темах (`js/app-curriculum.js`).
5. **StrictPass & Контроль** — 3D-гаманець карток **StrictPass** (27 SKU), керування сімейними місцями та батьківський кабінет із **salted SHA-256 PIN-захистом**.

## Ключові можливості

- **Безшовний онбординг (`?ht=`)**: автоматичний прийом підписаного handoff-токена з діагностичного сайту (`site-diagnostic`) із перенесенням профілю та результатів діагностики.
- **2 індустріальні теми**: `Studio Platinum` (світла) та `Anodized Matte` (темна) (`css/tokens.css`, `css/mobile-app.css`).
- **100% кастомні SVG-іконки**: `js/icons.js`, без сторонніх шрифтів і емодзі.
- **Firebase Auth + Firestore + Offline Vault**: спільне ядро `js/firebase-auth-core.js` та правила `firestore.rules`. Підключення проєкту виконується через `StrictAuth.configureFirebase(...)`.
- **Дорожня карта архітектури**: детальний план розвитку нативних можливостей і бекенду описано в [`docs/MOBILE_APP_ARCHITECTURE.md`](docs/MOBILE_APP_ARCHITECTURE.md).

## Локальний запуск

```bash
python3 -m http.server 8080
```

Або через npm-скрипти (`package.json`):

```bash
npm run check:syntax
npm run check:emoji
```

Для збірки iOS / Android через Capacitor (`capacitor.config.json`, `appId: "ua.strictai.mobile"`):

```bash
npm install
npx cap sync
```
