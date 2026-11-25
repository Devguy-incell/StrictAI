# StrictAI — Діагностичний веб-сайт (Diagnostic-Only Funnel)

Маркетингово-діагностичний сайт екосистеми **StrictAI** для підготовки до НМТ та поглибленого вивчення предметів. Веб-сайт виконує роль вхідної лійки: первинна діагностика знань, підбір тарифу StrictPass, кабінет довіри для батьків та безшовний перехід (`?ht=` handoff) у мобільний застосунок.

## Сторінки (5 HTML-модулів)

- `index.html` — головна сторінка з презентацією методології, інтерактивним прев'ю діагностики та переходом до тесту.
- `diagnostic.html` — 6-етапна адаптивна діагностика знань із формуванням профілю прогалин і передачею результатів у мобільний застосунок.
- `strictpass.html` — 3D-конфігуратор карток **StrictPass** на **27 SKU** (`Tier × Format × Term`) з інтерактивним нахилом (3D-tilt) та `.webp` рендерами в `assets/strictpass/`.
- `parents.html` — сторінка для батьків: прозорість прогресу, контроль часу, фінансові гарантії та сімейний доступ.
- `auth.html` — авторизація, керування сімейними інвайтами, перехід до мобільного застосунку та налаштування Firebase.

## Ключові особливості

- **2 індустріальні теми**: `Studio Platinum` (світла) та `Anodized Matte` (темна) на основі CSS-токенів (`css/tokens.css`, `css/site.css`).
- **100% кастомні SVG-іконки**: власна векторна бібліотека в `js/icons.js` без сторонніх іконкових шрифтів та емодзі.
- **27-SKU 3D-Tilt StrictPass Configurator**: `js/strictpass-3d.js` + `js/site-strictpass.js` із підтримкою всіх 27 комбінацій тарифів.
- **Firebase Auth + Firestore**: синхронізація профілів, діагностик, сімейних груп та замовлень у `js/firebase-auth-core.js` з офлайн-сховищем (IndexedDB / LocalStorage fallback) і правилами безпеки `firestore.rules`.

## Локальний запуск

Збірка не потрібна — достатньо будь-якого статичного HTTP-сервера:

```bash
python3 -m http.server 8081
```

Відкрийте у браузері: `http://localhost:8081/`

## Підключення Firebase-проєкту

У консолі браузера або через скрипт ініціалізації викличте `StrictAuth.configureFirebase(...)` з конфігурацією вашого Firebase-проєкту:

```js
StrictAuth.configureFirebase({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});
```

Правила доступу Firestore описані у файлі `firestore.rules`, конфігурація хостингу — у `firebase.json`.
