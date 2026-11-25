# StrictAI Mobile Application — Architecture & Launch Roadmap

## 1. Two-Branch Ecosystem Architecture

StrictAI operates across two cleanly isolated deployment targets sharing a unified core (`tokens.css`, `icons.js`, `strictpass-3d.js`, `firebase-auth-core.js`, `firestore.rules`):

1. **`site-diagnostic` (Web Funnel & Diagnostic Entry)**:
   - Public SEO landing, initial NMT/CEFR diagnostic radar, and StrictPass showcase.
   - Issues signed HMAC-SHA256 Handoff Tokens (`?ht=ht1.<payload>.<sig>&sid=...`) via `StrictAuth.createHandoffToken()` for seamless transition into the mobile app.
2. **`strictai-mobile-app` (Full-Featured Mobile Application — `ua.strictai.mobile`)**:
   - Complete 5-tab daily study, Socratic tutoring, ranked anti-cheat testing, focus & knowledge mastery, StrictPass wallet, and parent governance workspace.
   - Built with zero-build standalone React 18 (`react-runtime.js`), Capacitor 6 native shell (`capacitor.config.json`), and offline-first Service Worker (`sw.js`).

## 2. Swiss Industrial Design System & Dual Themes

- **Themes**:
  - `Studio Platinum` (`data-theme="light"`, default): `#F6F6F7` canvas, `#FFFFFF` machined surfaces, `#09090B` architectural ink, `#E4E4E7` 1px hairlines.
  - `Anodized Matte` (`data-theme="dark"`): `#09090B` canvas, `#121215` surfaces, `#FAFAFA` ink, `#27272A` borders.
- **Zero-Emoji / Zero-Slop Guarantee**:
  - 100% custom 1.75px stroke geometric SVGs via `window.StrictIcons`.
  - Zero neon gradients, zero stock illustrations, zero Unicode emojis across code, data, and UI.
- **Responsive Viewport & Studio Shell**:
  - `<= 768px` (iOS / Android / Mobile Web): Native edge-to-edge `100dvh` layout with `env(safe-area-inset-*)` padding, fixed `56px` top bar, overscroll-contained body, bottom sheets (`cubic-bezier(0.32, 0.72, 0, 1)`), and fixed `64px` 5-tab navigation bar.
  - `> 768px` (Desktop Review Workspace): Precision `412×880` mobile device shell (toggleable to `820px` tablet mode) with a studio toolbar for theme switching, `?ht=` Handoff import testing, and `17:00` missed-lesson simulation.

## 3. Core Functional Modules

| Module | Global API | Responsibility |
| --- | --- | --- |
| `js/app-curriculum.js` | `window.StrictCurriculum` | 5 languages (CEFR A1-C2 + roleplay), 4 school/NMT subjects strictly isolated by grade band (`5-7`, `8-9`, `NMT 200`, `Olympiad`), 9 tutor personas, 20+ NMT/CAT questions across 4 AI-resilient formats (`context_case`, `visual_schema`, `find_the_bug`, `llm_trap`), and 20s micro-verifications. |
| `js/app-anticheat.js` | `window.StrictMobileAntiCheat` | DPI-aware `<canvas>` anti-OCR renderer (light/dark adaptive, procedural geometry/tables/steps, watermark + Bezier mesh, zoom modal), 45s per-question guard, 2-strike blur lock, `MutationObserver` AI-extension shield, and pointer/touch cadence biometrics (`Trust Score`). |
| `js/app-state.js` | `window.StrictMobileStore` | Bridges `StrictAuth` (Firebase v10 + Verified Vault) with reactive app state, 4-step onboarding, `?ht=` Handoff hydration, anti-cheat auto-verified quests (zero manual checkoff), `17:00` missed-lesson guard, multi-child family state, salted SHA-256 Parent PIN, and StrictPass SKU persistence. |
| `js/app-views-study.js` | `window.StrictMobileViewsStudy` | Tab 1 (`Сьогодні`), Tab 2 (`Репетитор` with roleplay & persona lock), Tab 3 (`Іспити` with CAT, canvas anti-OCR, 20s micro-verification, and error handoff). |
| `js/app-views-control.js` | `window.StrictMobileViewsControl` | Tab 4 (`Фокус & Мапа`), Tab 5A (`Гаманець StrictPass` with 3D-tilt `.webp` die-cut cards across 27 SKUs & sponsor sharing), Tab 5B (`Батьківський кабінет` with PIN gate, biometrics, lecture assignments, weekly contract). |
| `js/app-main.js` | Boot & Root Shell | Studio toolbar, responsive device frame, onboarding flow, top bar, 5-tab bar, shared `window.StrictUI` (`Icon`, `Sheet`, `Toast`). |

## 4. Security & Anti-Cheat Model

1. **Salted SHA-256 Parent Governance**: Parent PINs are never hardcoded; `StrictAuth.hashSecret` and `StrictAuth.verifySecret` compute `sha256$<salt>$<digest>` in WebCrypto and sync `pinHash` to Firestore (`families/{familyId}`).
2. **Proof-Based Quest Unlocking**: Daily quests cannot be ticked manually; only `completeFocusSprint`, `completeTutorTopic`, and `completeExamRun` unlock XP and mark parent-assigned lectures as `completed` with a `verifiedSessionId` matching `firestore.rules`.
3. **Client-Side Anti-OCR & Extension Isolation**: Exam stems, data tables, and diagrams render onto high-DPI `<canvas>` with theme-matched anti-OCR mesh lines and session watermarks while `MutationObserver` monitors DOM injections.

## 5. Capacitor Native Build & Launch Roadmap

### Phase A — Capacitor Native Wrapping (iOS & Android)
```bash
npm install
npx cap add ios
npx cap add android
npm run cap:sync
npx cap open ios
npx cap open android
```

### Phase B — Production Cloud Wiring
1. Provision Firebase Auth (Google, Apple, GitHub, Email/Password) and deploy `firestore.rules`.
2. Supply production `window.STRICT_FIREBASE_CONFIG` or configure via the in-app Cloud Settings sheet.
3. Connect server-side payment webhook (`strictPassOrders/{orderId}` -> `entitlementTier` + `strictPassVerified` Admin SDK update).
4. Add native Capacitor plugins (`@capacitor/haptics`, `@capacitor/local-notifications` for `17:00` schedule alerts, `@capacitor/app` for `appStateChange` focus enforcement).
