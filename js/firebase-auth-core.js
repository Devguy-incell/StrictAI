/**
 * StrictAI Shared Core: Firebase v10 Auth, Firestore Sync, Verified Vault & Handoff Engine
 * Shared across `site-diagnostic` and `mobile-app` branches.
 * Zero external build step required; zero emoji characters.
 */
(function (globalScope) {
  'use strict';

  var FIREBASE_SDK_VERSION = '10.14.1';
  var FIREBASE_CDN_BASE = 'https://www.gstatic.com/firebasejs/' + FIREBASE_SDK_VERSION + '/';
  var STORAGE_KEY_CONFIG = 'strictai_firebase_config';
  var STORAGE_KEY_VAULT = 'strictai_vault_v1';
  var STORAGE_KEY_SESSION = 'strictai_session_uid';
  var STORAGE_KEY_PENDING_SID = 'strictai_pending_diagnostic_sid';
  var IDB_NAME = 'strictai_vault_db';
  var IDB_VERSION = 1;
  var IDB_STORES = ['users', 'diagnostics', 'families', 'strictPassOrders', 'meta'];

  var HANDOFF_HMAC_SECRET = 'strictai-handoff-v1-integrity-key-2026';
  var HANDOFF_TTL_MS = 24 * 60 * 60 * 1000;
  var INVITE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var SEAT_LIMITS = {
    single: 1,
    duo: 2,
    family: 5
  };
  var VALID_PROVIDERS = {
    google: { id: 'google', label: 'Google', emailDomain: 'gmail.com' },
    apple: { id: 'apple', label: 'Apple', emailDomain: 'icloud.com' },
    github: { id: 'github', label: 'GitHub', emailDomain: 'users.noreply.github.com' }
  };

  /* ------------------------------------------------------------------ */
  /* Environment & Safe Storage Primitives                              */
  /* ------------------------------------------------------------------ */

  var memoryStorage = {};

  function hasWindow() {
    return typeof window !== 'undefined';
  }

  function hasDocument() {
    return typeof document !== 'undefined';
  }

  function isOnline() {
    if (typeof navigator === 'undefined') {
      return false;
    }
    return navigator.onLine !== false;
  }

  function storageGet(key) {
    try {
      if (hasWindow() && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (_err) {
      /* fallback to memoryStorage */
    }
    return Object.prototype.hasOwnProperty.call(memoryStorage, key) ? memoryStorage[key] : null;
  }

  function storageSet(key, val) {
    var str = String(val);
    memoryStorage[key] = str;
    try {
      if (hasWindow() && window.localStorage) {
        window.localStorage.setItem(key, str);
      }
    } catch (_err) {
      /* ignore quota or WebView restrictions */
    }
  }

  function storageRemove(key) {
    delete memoryStorage[key];
    try {
      if (hasWindow() && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (_err) {
      /* ignore */
    }
  }

  function cloneData(val) {
    if (val === undefined || val === null) {
      return val;
    }
    return JSON.parse(JSON.stringify(val));
  }

  function createAuthError(code, message) {
    var err = new Error(message || code);
    err.code = code;
    return err;
  }

  function nowIso() {
    return new Date().toISOString();
  }

  /* ------------------------------------------------------------------ */
  /* WebCrypto SHA-256 Hashing, Salting & HMAC Token Signing            */
  /* ------------------------------------------------------------------ */

  function getWebCrypto() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle) {
      return globalThis.crypto;
    }
    if (typeof require === 'function') {
      try {
        var nodeCrypto = require('crypto');
        if (nodeCrypto && nodeCrypto.webcrypto && nodeCrypto.webcrypto.subtle) {
          return nodeCrypto.webcrypto;
        }
      } catch (_err) {
        /* ignore */
      }
    }
    return null;
  }

  function encodeUtf8(str) {
    if (typeof TextEncoder !== 'undefined') {
      return new TextEncoder().encode(str);
    }
    var buf = [];
    for (var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);
      if (code < 0x80) {
        buf.push(code);
      } else if (code < 0x800) {
        buf.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
      } else {
        buf.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
      }
    }
    return new Uint8Array(buf);
  }

  function decodeUtf8(bytes) {
    if (typeof TextDecoder !== 'undefined') {
      return new TextDecoder().decode(bytes);
    }
    var out = '';
    for (var i = 0; i < bytes.length; i++) {
      out += String.fromCharCode(bytes[i]);
    }
    return out;
  }

  function bytesToHex(bytes) {
    var arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    var hex = '';
    for (var i = 0; i < arr.length; i++) {
      var h = arr[i].toString(16);
      hex += h.length === 1 ? '0' + h : h;
    }
    return hex;
  }

  function base64UrlEncodeBytes(bytes) {
    var arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    var bin = '';
    for (var i = 0; i < arr.length; i++) {
      bin += String.fromCharCode(arr[i]);
    }
    var b64;
    if (typeof btoa === 'function') {
      b64 = btoa(bin);
    } else if (typeof Buffer !== 'undefined') {
      b64 = Buffer.from(arr).toString('base64');
    } else {
      throw new Error('Base64 encoding unavailable');
    }
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  function base64UrlDecodeBytes(str) {
    var padded = String(str).replace(/-/g, '+').replace(/_/g, '/');
    while (padded.length % 4 !== 0) {
      padded += '=';
    }
    if (typeof atob === 'function') {
      var bin = atob(padded);
      var out = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) {
        out[i] = bin.charCodeAt(i);
      }
      return out;
    }
    if (typeof Buffer !== 'undefined') {
      return new Uint8Array(Buffer.from(padded, 'base64'));
    }
    throw new Error('Base64 decoding unavailable');
  }

  function base64UrlEncodeJson(obj) {
    return base64UrlEncodeBytes(encodeUtf8(JSON.stringify(obj)));
  }

  function base64UrlDecodeJson(str) {
    return JSON.parse(decodeUtf8(base64UrlDecodeBytes(str)));
  }

  function randomBytes(length) {
    var cryptoApi = getWebCrypto();
    var buf = new Uint8Array(length);
    if (cryptoApi && typeof cryptoApi.getRandomValues === 'function') {
      cryptoApi.getRandomValues(buf);
      return buf;
    }
    for (var i = 0; i < length; i++) {
      buf[i] = Math.floor(Math.random() * 256);
    }
    return buf;
  }

  function randomHex(byteLength) {
    return bytesToHex(randomBytes(byteLength || 8));
  }

  function constantTimeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    var diff = 0;
    for (var i = 0; i < a.length; i++) {
      diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return diff === 0;
  }

  /**
   * Computes a salted SHA-256 hash using WebCrypto.
   * Format: sha256$<saltHex>$<digestHex>
   */
  async function hashSecret(plainText, saltHex) {
    var cryptoApi = getWebCrypto();
    if (!cryptoApi || !cryptoApi.subtle) {
      throw createAuthError('auth/crypto-unavailable', 'WebCrypto SHA-256 is unavailable in this environment');
    }
    var salt = saltHex || randomHex(16);
    var material = encodeUtf8(salt + ':' + String(plainText));
    var digestBuffer = await cryptoApi.subtle.digest('SHA-256', material);
    return 'sha256$' + salt + '$' + bytesToHex(digestBuffer);
  }

  async function verifySecret(plainText, storedHash) {
    if (typeof storedHash !== 'string' || storedHash.indexOf('sha256$') !== 0) {
      return false;
    }
    var parts = storedHash.split('$');
    if (parts.length !== 3 || !parts[1] || !parts[2]) {
      return false;
    }
    var candidate = await hashSecret(plainText, parts[1]);
    return constantTimeEqual(candidate, storedHash);
  }

  async function getHmacKey() {
    var cryptoApi = getWebCrypto();
    if (!cryptoApi || !cryptoApi.subtle) {
      throw createAuthError('auth/crypto-unavailable', 'WebCrypto HMAC is unavailable in this environment');
    }
    return cryptoApi.subtle.importKey(
      'raw',
      encodeUtf8(HANDOFF_HMAC_SECRET),
      { name: 'HMAC', hash: { name: 'SHA-256' } },
      false,
      ['sign', 'verify']
    );
  }

  async function signTextHmac(signingInput) {
    var cryptoApi = getWebCrypto();
    var key = await getHmacKey();
    var sigBuffer = await cryptoApi.subtle.sign('HMAC', key, encodeUtf8(signingInput));
    return base64UrlEncodeBytes(sigBuffer);
  }

  async function verifyTextHmac(signingInput, sigB64Url) {
    if (typeof sigB64Url !== 'string' || !sigB64Url) {
      return false;
    }
    var expected = await signTextHmac(signingInput);
    return constantTimeEqual(expected, sigB64Url);
  }

  /* ------------------------------------------------------------------ */
  /* Local / Emulator IndexedDB + Storage Vault Engine                  */
  /* ------------------------------------------------------------------ */

  function createEmptyVault() {
    return {
      users: {},
      diagnostics: {},
      families: {},
      strictPassOrders: {},
      meta: {}
    };
  }

  function createVaultEngine() {
    var idbPromise = null;
    var txQueue = Promise.resolve();

    function readSyncVault() {
      var raw = storageGet(STORAGE_KEY_VAULT);
      if (!raw) {
        return createEmptyVault();
      }
      try {
        var parsed = JSON.parse(raw);
        var base = createEmptyVault();
        for (var i = 0; i < IDB_STORES.length; i++) {
          var s = IDB_STORES[i];
          if (parsed[s] && typeof parsed[s] === 'object') {
            base[s] = parsed[s];
          }
        }
        return base;
      } catch (_err) {
        return createEmptyVault();
      }
    }

    function writeSyncVault(vault) {
      storageSet(STORAGE_KEY_VAULT, JSON.stringify(vault));
    }

    function openIdb() {
      if (idbPromise) {
        return idbPromise;
      }
      if (typeof indexedDB === 'undefined') {
        idbPromise = Promise.resolve(null);
        return idbPromise;
      }
      idbPromise = new Promise(function (resolve) {
        try {
          var req = indexedDB.open(IDB_NAME, IDB_VERSION);
          req.onupgradeneeded = function (event) {
            var db = event.target.result;
            for (var i = 0; i < IDB_STORES.length; i++) {
              var storeName = IDB_STORES[i];
              if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id' });
              }
            }
          };
          req.onsuccess = function (event) {
            resolve(event.target.result);
          };
          req.onerror = function () {
            resolve(null);
          };
        } catch (_err) {
          resolve(null);
        }
      });
      return idbPromise;
    }

    async function mirrorRecordToIdb(collectionName, id, record) {
      var db = await openIdb();
      if (!db) {
        return;
      }
      await new Promise(function (resolve) {
        try {
          var tx = db.transaction(collectionName, 'readwrite');
          var store = tx.objectStore(collectionName);
          store.put(Object.assign({}, cloneData(record), { id: id }));
          tx.oncomplete = function () { resolve(); };
          tx.onerror = function () { resolve(); };
        } catch (_err) {
          resolve();
        }
      });
    }

    async function hydrateFromIdb() {
      var db = await openIdb();
      if (!db) {
        return;
      }
      var vault = readSyncVault();
      var changed = false;
      for (var i = 0; i < IDB_STORES.length; i++) {
        var storeName = IDB_STORES[i];
        /* eslint-disable no-loop-func */
        var rows = await new Promise(function (resolve) {
          try {
            var tx = db.transaction(storeName, 'readonly');
            var store = tx.objectStore(storeName);
            var req = store.getAll();
            req.onsuccess = function () { resolve(req.result || []); };
            req.onerror = function () { resolve([]); };
          } catch (_err) {
            resolve([]);
          }
        });
        /* eslint-enable no-loop-func */
        for (var j = 0; j < rows.length; j++) {
          var row = rows[j];
          if (row && row.id && !vault[storeName][row.id]) {
            vault[storeName][row.id] = row;
            changed = true;
          }
        }
      }
      if (changed) {
        writeSyncVault(vault);
      }
    }

    async function getDoc(collectionName, id) {
      var vault = readSyncVault();
      var rec = vault[collectionName] && vault[collectionName][id];
      return rec ? cloneData(rec) : null;
    }

    async function setDoc(collectionName, id, data, options) {
      var merge = options && options.merge;
      var vault = readSyncVault();
      if (!vault[collectionName]) {
        vault[collectionName] = {};
      }
      var existing = merge && vault[collectionName][id] ? vault[collectionName][id] : {};
      var next = Object.assign({}, existing, cloneData(data));
      vault[collectionName][id] = next;
      writeSyncVault(vault);
      await mirrorRecordToIdb(collectionName, id, next);
      return cloneData(next);
    }

    async function queryWhere(collectionName, field, value) {
      var vault = readSyncVault();
      var bucket = vault[collectionName] || {};
      var matches = [];
      var keys = Object.keys(bucket);
      for (var i = 0; i < keys.length; i++) {
        var rec = bucket[keys[i]];
        if (rec && rec[field] === value) {
          matches.push({ id: keys[i], data: cloneData(rec) });
        }
      }
      return matches;
    }

    function runTxn(fn) {
      var run = txQueue.then(function () {
        return fn({
          getDoc: getDoc,
          setDoc: setDoc,
          queryWhere: queryWhere
        });
      });
      txQueue = run.catch(function () {
        /* keep queue alive after failed txn */
      });
      return run;
    }

    function resetAll() {
      writeSyncVault(createEmptyVault());
      storageRemove(STORAGE_KEY_SESSION);
      storageRemove(STORAGE_KEY_PENDING_SID);
    }

    return {
      hydrateFromIdb: hydrateFromIdb,
      getDoc: getDoc,
      setDoc: setDoc,
      queryWhere: queryWhere,
      runTxn: runTxn,
      resetAll: resetAll
    };
  }

  /* ------------------------------------------------------------------ */
  /* Firebase v10 Dynamic Config & SDK Loader                           */
  /* ------------------------------------------------------------------ */

  function parseConfigInput(input) {
    if (!input) {
      return null;
    }
    if (typeof input === 'string') {
      try {
        return JSON.parse(input);
      } catch (_err) {
        return null;
      }
    }
    if (typeof input === 'object') {
      return input;
    }
    return null;
  }

  function isValidFirebaseConfig(cfg) {
    if (!cfg || typeof cfg !== 'object') {
      return false;
    }
    var apiKey = typeof cfg.apiKey === 'string' ? cfg.apiKey.trim() : '';
    var projectId = typeof cfg.projectId === 'string' ? cfg.projectId.trim() : '';
    if (!apiKey || !projectId) {
      return false;
    }
    if (apiKey.indexOf('YOUR_') === 0 || projectId.indexOf('YOUR_') === 0) {
      return false;
    }
    return true;
  }

  function readConfiguredFirebaseConfig() {
    if (hasWindow() && isValidFirebaseConfig(window.STRICT_FIREBASE_CONFIG)) {
      return cloneData(window.STRICT_FIREBASE_CONFIG);
    }
    var stored = parseConfigInput(storageGet(STORAGE_KEY_CONFIG));
    if (isValidFirebaseConfig(stored)) {
      return stored;
    }
    return null;
  }

  /* ------------------------------------------------------------------ */
  /* OAuth Account Selector Modal (Zero-Emoji, Dual-Theme, Custom SVG)  */
  /* ------------------------------------------------------------------ */

  function getProviderSvg(providerId) {
    if (providerId === 'google') {
      return (
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<path d="M21.8 12.23c0-.7-.06-1.38-.18-2.03H12v3.84h5.5a4.7 4.7 0 0 1-2.04 3.08v2.56h3.3c1.93-1.78 3.04-4.4 3.04-7.45Z" stroke="currentColor" stroke-width="1.75"/>' +
        '<path d="M12 22c2.75 0 5.06-.91 6.75-2.46l-3.3-2.56c-.91.61-2.08.97-3.45.97-2.65 0-4.9-1.79-5.7-4.2H2.89v2.64A10 10 0 0 0 12 22Z" stroke="currentColor" stroke-width="1.75"/>' +
        '<path d="M6.3 13.75a5.98 5.98 0 0 1 0-3.5V7.61H2.89a10 10 0 0 0 0 8.78l3.41-2.64Z" stroke="currentColor" stroke-width="1.75"/>' +
        '<path d="M12 6.05c1.5 0 2.84.52 3.9 1.53l2.92-2.92A9.96 9.96 0 0 0 12 2 10 10 0 0 0 2.89 7.61l3.41 2.64C7.1 7.84 9.35 6.05 12 6.05Z" stroke="currentColor" stroke-width="1.75"/>' +
        '</svg>'
      );
    }
    if (providerId === 'apple') {
      return (
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<path d="M15.4 3.2c.6-.7 1-1.7.9-2.7-.9.1-2 .6-2.6 1.3-.5.6-1 1.6-.9 2.6 1 .1 2-.5 2.6-1.2Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>' +
        '<path d="M19.5 16.8c-.4 1-.9 1.9-1.6 2.7-.8.9-1.6 1.5-2.6 1.5-.8 0-1.4-.5-2.5-.5-1.1 0-1.8.5-2.6.5-1 0-1.9-.7-2.7-1.6-1.7-2-2.9-5.5-1.4-8.4.8-1.5 2.2-2.4 3.7-2.4 1.1 0 2.1.7 2.8.7.6 0 1.8-.8 3.1-.7.6 0 2.3.2 3.4 1.8-.1.1-2 1.2-2 3.5 0 2.7 2.4 3.7 2.4 3.7Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>' +
        '</svg>'
      );
    }
    return (
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19 3.77 5.07 5.07 0 0 0 18.91 0S17.73-.35 15 1.48a13.38 13.38 0 0 0-7 0C5.27-.35 4.09 0 4.09 0A5.07 5.07 0 0 0 4 3.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 17.13V21" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>'
    );
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function ensureOAuthModalStyles() {
    if (!hasDocument() || document.getElementById('strict-auth-modal-styles')) {
      return;
    }
    var style = document.createElement('style');
    style.id = 'strict-auth-modal-styles';
    style.textContent = [
      '.strict-oauth-backdrop{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(9,9,11,0.58);backdrop-filter:blur(6px);font-family:Inter,system-ui,-apple-system,sans-serif;}',
      '.strict-oauth-card{width:100%;max-width:420px;background:var(--bg-surface,#FFFFFF);color:var(--text-primary,#09090B);border:1px solid var(--border-hairline,#E4E4E7);border-radius:16px;padding:22px;box-shadow:0 24px 60px rgba(0,0,0,0.22);box-sizing:border-box;}',
      '[data-theme="dark"] .strict-oauth-card{background:var(--bg-surface,#121215);color:var(--text-primary,#FAFAFA);border-color:var(--border-hairline,#27272A);}',
      '.strict-oauth-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;}',
      '.strict-oauth-brand{display:flex;align-items:center;gap:10px;font-size:15px;font-weight:600;letter-spacing:-0.01em;}',
      '.strict-oauth-icon{width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;background:var(--bg-subtle,#EFEFF1);border:1px solid var(--border-hairline,#E4E4E7);}',
      '[data-theme="dark"] .strict-oauth-icon{background:var(--bg-subtle,#1A1A1F);border-color:var(--border-hairline,#27272A);}',
      '.strict-oauth-close{width:32px;height:32px;border-radius:8px;border:1px solid var(--border-hairline,#E4E4E7);background:transparent;color:inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;}',
      '.strict-oauth-sub{margin:0 0 14px;font-size:13px;line-height:1.45;opacity:0.78;}',
      '.strict-oauth-list{display:flex;flex-direction:column;gap:8px;margin-bottom:14px;}',
      '.strict-oauth-account{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-radius:10px;border:1px solid var(--border-hairline,#E4E4E7);background:var(--bg-subtle,#EFEFF1);color:inherit;cursor:pointer;text-align:left;font-family:inherit;}',
      '[data-theme="dark"] .strict-oauth-account{background:var(--bg-subtle,#1A1A1F);border-color:var(--border-hairline,#27272A);}',
      '.strict-oauth-account:hover{border-color:var(--text-primary,#09090B);}',
      '.strict-oauth-name{font-size:14px;font-weight:600;display:block;}',
      '.strict-oauth-mail{font-size:12px;opacity:0.72;display:block;}',
      '.strict-oauth-badge{font-size:11px;font-weight:600;padding:3px 8px;border-radius:999px;border:1px solid var(--border-hairline,#E4E4E7);}',
      '.strict-oauth-form{display:flex;flex-direction:column;gap:8px;padding-top:12px;border-top:1px solid var(--border-hairline,#E4E4E7);}',
      '.strict-oauth-input{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:10px;border:1px solid var(--border-hairline,#E4E4E7);background:transparent;color:inherit;font-family:inherit;font-size:13px;}',
      '.strict-oauth-submit{padding:11px 14px;border-radius:10px;border:none;background:var(--accent-ink,#09090B);color:#FFFFFF;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;}',
      '[data-theme="dark"] .strict-oauth-submit{background:#FAFAFA;color:#09090B;}'
    ].join('');
    document.head.appendChild(style);
  }

  function openOAuthAccountSelector(providerMeta, role, existingAccounts) {
    return new Promise(function (resolve, reject) {
      if (!hasDocument() || !document.body) {
        reject(createAuthError('auth/no-document', 'DOM unavailable for OAuth selector'));
        return;
      }
      ensureOAuthModalStyles();

      var roleLabel = role === 'parent' ? 'Батьки' : 'Учень';
      var defaultPreset = role === 'parent'
        ? {
            displayName: 'Ірина Коваленко',
            email: 'iryna.kovalenko@' + providerMeta.emailDomain
          }
        : {
            displayName: 'Олена Коваленко',
            email: 'olena.kovalenko@' + providerMeta.emailDomain
          };

      var candidates = existingAccounts.slice();
      var hasPreset = candidates.some(function (acc) {
        return acc.email === defaultPreset.email;
      });
      if (!hasPreset) {
        candidates.unshift(defaultPreset);
      }

      var backdrop = document.createElement('div');
      backdrop.className = 'strict-oauth-backdrop';
      backdrop.setAttribute('role', 'dialog');
      backdrop.setAttribute('aria-modal', 'true');
      backdrop.setAttribute('aria-label', 'Вхід через ' + providerMeta.label);

      var accountsHtml = candidates.map(function (acc, idx) {
        return (
          '<button type="button" class="strict-oauth-account" data-oauth-idx="' + idx + '">' +
          '<span><span class="strict-oauth-name">' + escapeHtml(acc.displayName) + '</span>' +
          '<span class="strict-oauth-mail">' + escapeHtml(acc.email) + '</span></span>' +
          '<span class="strict-oauth-badge">' + escapeHtml(roleLabel) + '</span>' +
          '</button>'
        );
      }).join('');

      backdrop.innerHTML =
        '<div class="strict-oauth-card">' +
        '<div class="strict-oauth-head">' +
        '<div class="strict-oauth-brand">' +
        '<span class="strict-oauth-icon">' + getProviderSvg(providerMeta.id) + '</span>' +
        '<span>Вхід через ' + escapeHtml(providerMeta.label) + '</span>' +
        '</div>' +
        '<button type="button" class="strict-oauth-close" data-oauth-close aria-label="Закрити">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>' +
        '</button>' +
        '</div>' +
        '<p class="strict-oauth-sub">Оберіть профіль ' + escapeHtml(providerMeta.label) + ' для ролі «' + escapeHtml(roleLabel) + '» або вкажіть іншу адресу.</p>' +
        '<div class="strict-oauth-list">' + accountsHtml + '</div>' +
        '<form class="strict-oauth-form" data-oauth-form>' +
        '<input class="strict-oauth-input" type="text" name="displayName" placeholder="Ім\'я (наприклад, Артем Шевченко)" />' +
        '<input class="strict-oauth-input" type="email" name="email" placeholder="name@' + escapeHtml(providerMeta.emailDomain) + '" required />' +
        '<button type="submit" class="strict-oauth-submit">Продовжити з цим акаунтом</button>' +
        '</form>' +
        '</div>';

      function cleanup() {
        document.removeEventListener('keydown', onKeyDown);
        if (backdrop.parentNode) {
          backdrop.parentNode.removeChild(backdrop);
        }
      }

      function onKeyDown(ev) {
        if (ev.key === 'Escape') {
          cleanup();
          reject(createAuthError('auth/popup-closed-by-user', 'Оператор скасував вибір акаунта'));
        }
      }

      document.addEventListener('keydown', onKeyDown);

      backdrop.addEventListener('click', function (ev) {
        if (ev.target === backdrop || ev.target.closest('[data-oauth-close]')) {
          cleanup();
          reject(createAuthError('auth/popup-closed-by-user', 'Вибір акаунта скасовано'));
          return;
        }
        var btn = ev.target.closest('[data-oauth-idx]');
        if (btn) {
          var index = Number(btn.getAttribute('data-oauth-idx'));
          var picked = candidates[index];
          cleanup();
          resolve({
            email: picked.email,
            displayName: picked.displayName
          });
        }
      });

      var form = backdrop.querySelector('[data-oauth-form]');
      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var emailVal = String(form.elements.email.value || '').trim().toLowerCase();
        var nameVal = String(form.elements.displayName.value || '').trim();
        if (!emailVal || emailVal.indexOf('@') < 1) {
          return;
        }
        if (!nameVal) {
          nameVal = emailVal.split('@')[0];
        }
        cleanup();
        resolve({ email: emailVal, displayName: nameVal });
      });

      document.body.appendChild(backdrop);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Core StrictAuth Engine Factory                                     */
  /* ------------------------------------------------------------------ */

  function createStrictAuthEngine() {
    var vault = createVaultEngine();
    var listeners = [];
    var initPromise = null;
    var firebaseRuntime = null;
    var state = {
      initialized: false,
      mode: 'vault',
      projectId: null,
      user: null,
      family: null,
      latestDiagnostic: null,
      activePass: null
    };

    function sanitizePublicUser(record) {
      if (!record) {
        return null;
      }
      return {
        uid: record.uid,
        email: record.email || null,
        displayName: record.displayName || null,
        provider: record.provider || 'password',
        role: record.role === 'parent' ? 'parent' : 'student',
        emailVerified: Boolean(record.emailVerified),
        familyId: record.familyId || null,
        inviteCode: record.inviteCode || null,
        latestDiagnostic: record.latestDiagnostic ? cloneData(record.latestDiagnostic) : null,
        activePass: record.activePass ? cloneData(record.activePass) : null,
        createdAt: record.createdAt || null,
        updatedAt: record.updatedAt || null
      };
    }

    function sanitizePublicFamily(record) {
      if (!record) {
        return null;
      }
      return {
        familyId: record.familyId,
        inviteCode: record.inviteCode,
        ownerUid: record.ownerUid,
        planSeatType: record.planSeatType || 'family',
        seatLimit: SEAT_LIMITS[record.planSeatType || 'family'] || 5,
        dailyScheduleTime: record.dailyScheduleTime || '17:00',
        contractTerms: record.contractTerms ? cloneData(record.contractTerms) : null,
        hasPin: Boolean(record.pinHash),
        memberUids: Array.isArray(record.memberUids) ? record.memberUids.slice() : [],
        activePass: record.activePass ? cloneData(record.activePass) : null,
        createdAt: record.createdAt || null,
        updatedAt: record.updatedAt || null
      };
    }

    function getSnapshot() {
      return {
        initialized: state.initialized,
        mode: state.mode,
        projectId: state.projectId,
        user: state.user ? cloneData(state.user) : null,
        family: state.family ? cloneData(state.family) : null,
        latestDiagnostic: state.latestDiagnostic ? cloneData(state.latestDiagnostic) : null,
        activePass: state.activePass ? cloneData(state.activePass) : null
      };
    }

    function emitChange() {
      var snap = getSnapshot();
      for (var i = 0; i < listeners.length; i++) {
        try {
          listeners[i](snap.user, snap);
        } catch (_err) {
          /* isolate listener errors */
        }
      }
    }

    async function refreshDerivedStateForUser(uid) {
      if (!uid) {
        state.user = null;
        state.family = null;
        state.activePass = null;
        var pendingSid = storageGet(STORAGE_KEY_PENDING_SID);
        state.latestDiagnostic = pendingSid ? await vault.getDoc('diagnostics', pendingSid) : null;
        return;
      }

      var userRec = await vault.getDoc('users', uid);
      if (!userRec) {
        state.user = null;
        state.family = null;
        state.activePass = null;
        return;
      }

      state.user = sanitizePublicUser(userRec);
      state.activePass = userRec.activePass ? cloneData(userRec.activePass) : null;

      if (userRec.familyId) {
        var fam = await readFamilyRecord(userRec.familyId);
        state.family = fam ? sanitizePublicFamily(fam) : null;
        if (!state.activePass && fam && fam.activePass) {
          state.activePass = cloneData(fam.activePass);
        }
      } else {
        state.family = null;
      }

      if (userRec.latestDiagnostic && userRec.latestDiagnostic.sid) {
        var diagDoc = await readDiagnosticRecord(userRec.latestDiagnostic.sid);
        state.latestDiagnostic = diagDoc || cloneData(userRec.latestDiagnostic);
      } else {
        var pending = storageGet(STORAGE_KEY_PENDING_SID);
        state.latestDiagnostic = pending ? await vault.getDoc('diagnostics', pending) : null;
      }
    }

    /* ---------------- Firestore Sync Helpers (Dual Cloud + Vault) ---------------- */

    function isCloudAuthenticated() {
      return Boolean(
        state.mode === 'firebase' &&
        firebaseRuntime &&
        firebaseRuntime.auth &&
        firebaseRuntime.auth.currentUser
      );
    }

    async function syncDocToCloud(collectionName, docId, data, merge) {
      if (!isCloudAuthenticated()) {
        return;
      }
      var fs = firebaseRuntime.firestoreMod;
      var ref = fs.doc(firebaseRuntime.db, collectionName, docId);
      await fs.setDoc(ref, cloneData(data), { merge: merge !== false });
    }

    async function readDocFromCloud(collectionName, docId) {
      if (state.mode !== 'firebase' || !firebaseRuntime) {
        return null;
      }
      try {
        var fs = firebaseRuntime.firestoreMod;
        var snap = await fs.getDoc(fs.doc(firebaseRuntime.db, collectionName, docId));
        return snap.exists() ? snap.data() : null;
      } catch (_err) {
        return null;
      }
    }

    async function readDiagnosticRecord(sid) {
      if (!sid) {
        return null;
      }
      var cloud = await readDocFromCloud('diagnostics', sid);
      if (cloud) {
        await vault.setDoc('diagnostics', sid, cloud, { merge: true });
        return cloud;
      }
      return vault.getDoc('diagnostics', sid);
    }

    async function readFamilyRecord(familyId) {
      if (!familyId) {
        return null;
      }
      var cloud = await readDocFromCloud('families', familyId);
      if (cloud) {
        await vault.setDoc('families', familyId, cloud, { merge: true });
        return cloud;
      }
      return vault.getDoc('families', familyId);
    }

    /* ---------------- Firebase SDK Dynamic Initialization ---------------- */

    async function tryConnectFirebase(configObj) {
      if (!isValidFirebaseConfig(configObj) || !isOnline() || !hasWindow()) {
        return null;
      }
      try {
        var appMod = await import(FIREBASE_CDN_BASE + 'firebase-app.js');
        var authMod = await import(FIREBASE_CDN_BASE + 'firebase-auth.js');
        var firestoreMod = await import(FIREBASE_CDN_BASE + 'firebase-firestore.js');

        var app = appMod.getApps().length ? appMod.getApp() : appMod.initializeApp(configObj);
        var auth = authMod.getAuth(app);
        var db = firestoreMod.getFirestore(app);

        return {
          app: app,
          auth: auth,
          db: db,
          appMod: appMod,
          authMod: authMod,
          firestoreMod: firestoreMod,
          projectId: configObj.projectId
        };
      } catch (_err) {
        return null;
      }
    }

    async function syncFirebaseAuthUser(fbUser, hints) {
      if (!fbUser) {
        storageRemove(STORAGE_KEY_SESSION);
        await refreshDerivedStateForUser(null);
        emitChange();
        return;
      }
      var cloudProfile = await readDocFromCloud('users', fbUser.uid);
      var localProfile = await vault.getDoc('users', fbUser.uid);
      var existing = cloudProfile || localProfile || {};
      var providerId = (hints && hints.provider) ||
        (fbUser.providerData && fbUser.providerData[0] && fbUser.providerData[0].providerId) ||
        existing.provider ||
        'password';

      var merged = {
        uid: fbUser.uid,
        email: fbUser.email || existing.email || null,
        displayName: (hints && hints.displayName) || fbUser.displayName || existing.displayName || null,
        provider: normalizeProviderName(providerId),
        role: (hints && hints.role) || existing.role || 'student',
        emailVerified: Boolean(fbUser.emailVerified),
        familyId: existing.familyId || null,
        inviteCode: existing.inviteCode || null,
        latestDiagnostic: existing.latestDiagnostic || null,
        activePass: existing.activePass || null,
        createdAt: existing.createdAt || nowIso(),
        updatedAt: nowIso()
      };

      await vault.setDoc('users', fbUser.uid, merged, { merge: true });
      await syncDocToCloud('users', fbUser.uid, merged, true);
      storageSet(STORAGE_KEY_SESSION, fbUser.uid);
      await refreshDerivedStateForUser(fbUser.uid);
      await autoClaimPendingDiagnostic();
      emitChange();
    }

    function normalizeProviderName(raw) {
      var val = String(raw || '').toLowerCase();
      if (val.indexOf('google') !== -1) return 'google';
      if (val.indexOf('apple') !== -1) return 'apple';
      if (val.indexOf('github') !== -1) return 'github';
      return val || 'password';
    }

    async function init(forceReinit) {
      if (initPromise && !forceReinit) {
        return initPromise;
      }

      initPromise = (async function () {
        await vault.hydrateFromIdb();
        var cfg = readConfiguredFirebaseConfig();
        var runtime = await tryConnectFirebase(cfg);

        if (runtime) {
          firebaseRuntime = runtime;
          state.mode = 'firebase';
          state.projectId = runtime.projectId;

          await new Promise(function (resolve) {
            var settled = false;
            runtime.authMod.onAuthStateChanged(runtime.auth, async function (fbUser) {
              await syncFirebaseAuthUser(fbUser);
              if (!settled) {
                settled = true;
                resolve();
              }
            });
          });
        } else {
          firebaseRuntime = null;
          state.mode = 'vault';
          state.projectId = cfg && cfg.projectId ? cfg.projectId : 'strictai-local-vault';
          var savedUid = storageGet(STORAGE_KEY_SESSION);
          await refreshDerivedStateForUser(savedUid);
        }

        state.initialized = true;
        emitChange();
        return getSnapshot();
      })();

      return initPromise;
    }

    async function configureFirebase(configObj) {
      var parsed = parseConfigInput(configObj);
      if (!isValidFirebaseConfig(parsed)) {
        throw createAuthError(
          'firebase/invalid-config',
          'Потрібні коректні поля apiKey та projectId у firebaseConfig'
        );
      }
      storageSet(STORAGE_KEY_CONFIG, JSON.stringify(parsed));
      if (hasWindow()) {
        window.STRICT_FIREBASE_CONFIG = cloneData(parsed);
      }
      await init(true);
      return {
        mode: state.mode,
        projectId: state.projectId,
        connected: state.mode === 'firebase'
      };
    }

    function clearFirebaseConfig() {
      storageRemove(STORAGE_KEY_CONFIG);
      if (hasWindow() && window.STRICT_FIREBASE_CONFIG) {
        delete window.STRICT_FIREBASE_CONFIG;
      }
      firebaseRuntime = null;
      state.mode = 'vault';
      state.projectId = 'strictai-local-vault';
      emitChange();
      return { mode: state.mode };
    }

    function onChange(callback) {
      if (typeof callback !== 'function') {
        throw new TypeError('onChange expects a function');
      }
      listeners.push(callback);
      if (state.initialized) {
        try {
          var snap = getSnapshot();
          callback(snap.user, snap);
        } catch (_err) {
          /* ignore */
        }
      }
      return function unsubscribe() {
        listeners = listeners.filter(function (fn) {
          return fn !== callback;
        });
      };
    }

    /* ---------------- Pending Diagnostic Auto-Claim ---------------- */

    async function autoClaimPendingDiagnostic() {
      var pendingSid = storageGet(STORAGE_KEY_PENDING_SID);
      if (!pendingSid || !state.user) {
        return null;
      }
      var diag = await readDiagnosticRecord(pendingSid);
      if (!diag) {
        storageRemove(STORAGE_KEY_PENDING_SID);
        return null;
      }
      if (!diag.ownerUid || diag.ownerUid === state.user.uid) {
        return claimDiagnostic(pendingSid);
      }
      return null;
    }

    /* ---------------- Authentication Methods ---------------- */

    function validateRole(role) {
      return role === 'parent' ? 'parent' : 'student';
    }

    function validateEmail(email) {
      var normalized = String(email || '').trim().toLowerCase();
      if (!normalized || normalized.indexOf('@') < 1 || normalized.indexOf('.', normalized.indexOf('@')) === -1) {
        throw createAuthError('auth/invalid-email', 'Вкажіть коректну електронну пошту');
      }
      return normalized;
    }

    async function completeVaultLogin(userRecord, isNewUser) {
      storageSet(STORAGE_KEY_SESSION, userRecord.uid);
      await refreshDerivedStateForUser(userRecord.uid);
      await autoClaimPendingDiagnostic();
      emitChange();
      return {
        user: cloneData(state.user),
        isNewUser: Boolean(isNewUser),
        mode: state.mode
      };
    }

    async function signInWithProvider(providerName, options) {
      await init();
      var opts = options || {};
      var key = String(providerName || '').trim().toLowerCase();
      var providerMeta = VALID_PROVIDERS[key];
      if (!providerMeta) {
        throw createAuthError('auth/unsupported-provider', 'Непідтримуваний провайдер: ' + providerName);
      }
      var role = validateRole(opts.role);

      if (state.mode === 'firebase' && firebaseRuntime && !opts.forceVault) {
        try {
          var authMod = firebaseRuntime.authMod;
          var providerInstance;
          if (key === 'google') {
            providerInstance = new authMod.GoogleAuthProvider();
          } else if (key === 'apple') {
            providerInstance = new authMod.OAuthProvider('apple.com');
          } else {
            providerInstance = new authMod.GithubAuthProvider();
          }
          var cred = await authMod.signInWithPopup(firebaseRuntime.auth, providerInstance);
          await syncFirebaseAuthUser(cred.user, { provider: key, role: role });
          if (opts.linkSid) {
            await claimDiagnostic(opts.linkSid);
          }
          return {
            user: cloneData(state.user),
            isNewUser: false,
            mode: state.mode
          };
        } catch (err) {
          var fallbackCodes = [
            'auth/unauthorized-domain',
            'auth/operation-not-supported-in-this-environment',
            'auth/popup-blocked',
            'auth/network-request-failed'
          ];
          if (!err || fallbackCodes.indexOf(err.code) === -1) {
            throw err;
          }
          /* Graceful WebView / unauthorized-domain fallback to Verified Vault */
        }
      }

      var existingForProvider = await vault.queryWhere('users', 'provider', key);
      var accountList = existingForProvider.map(function (item) {
        return item.data;
      });

      var picked;
      if (opts.account && opts.account.email) {
        picked = {
          email: validateEmail(opts.account.email),
          displayName: opts.account.displayName || opts.account.email.split('@')[0]
        };
      } else if (opts.email) {
        picked = {
          email: validateEmail(opts.email),
          displayName: opts.displayName || opts.email.split('@')[0]
        };
      } else if (opts.instant || !hasDocument()) {
        var defaultEmail = role === 'parent'
          ? 'parent.demo@' + providerMeta.emailDomain
          : 'student.demo@' + providerMeta.emailDomain;
        picked = {
          email: defaultEmail,
          displayName: opts.displayName || (role === 'parent' ? 'Ірина Коваленко' : 'Олена Коваленко')
        };
      } else {
        picked = await openOAuthAccountSelector(providerMeta, role, accountList);
      }

      var matches = await vault.queryWhere('users', 'email', picked.email);
      var existing = matches.length ? matches[0].data : null;
      var ts = nowIso();
      var record;
      var isNewUser = false;

      if (existing) {
        record = Object.assign({}, existing, {
          displayName: picked.displayName || existing.displayName,
          provider: key,
          role: opts.role ? role : existing.role,
          emailVerified: true,
          updatedAt: ts
        });
      } else {
        isNewUser = true;
        record = {
          uid: 'uid_' + key + '_' + randomHex(6),
          email: picked.email,
          displayName: picked.displayName,
          provider: key,
          role: role,
          emailVerified: true,
          familyId: null,
          inviteCode: null,
          latestDiagnostic: null,
          activePass: null,
          createdAt: ts,
          updatedAt: ts
        };
      }

      await vault.setDoc('users', record.uid, record, { merge: true });
      var result = await completeVaultLogin(record, isNewUser);
      if (opts.linkSid) {
        await claimDiagnostic(opts.linkSid);
      }
      return result;
    }

    async function registerWithEmail(params) {
      await init();
      var opts = params || {};
      var email = validateEmail(opts.email);
      var password = String(opts.password || '');
      if (password.length < 6) {
        throw createAuthError('auth/weak-password', 'Пароль має містити щонайменше 6 символів');
      }
      var role = validateRole(opts.role);
      var displayName = String(opts.displayName || '').trim() || email.split('@')[0];

      if (state.mode === 'firebase' && firebaseRuntime) {
        var authMod = firebaseRuntime.authMod;
        var cred = await authMod.createUserWithEmailAndPassword(firebaseRuntime.auth, email, password);
        if (displayName && authMod.updateProfile) {
          await authMod.updateProfile(cred.user, { displayName: displayName });
        }
        await syncFirebaseAuthUser(cred.user, {
          provider: 'password',
          role: role,
          displayName: displayName
        });
        return {
          user: cloneData(state.user),
          isNewUser: true,
          mode: state.mode
        };
      }

      var existing = await vault.queryWhere('users', 'email', email);
      if (existing.length > 0) {
        throw createAuthError('auth/email-already-in-use', 'Акаунт із цією поштою вже існує');
      }

      var passwordHash = await hashSecret(password);
      var ts = nowIso();
      var uid = 'uid_pwd_' + randomHex(8);
      var record = {
        uid: uid,
        email: email,
        displayName: displayName,
        provider: 'password',
        role: role,
        emailVerified: false,
        passwordHash: passwordHash,
        familyId: null,
        inviteCode: null,
        latestDiagnostic: null,
        activePass: null,
        createdAt: ts,
        updatedAt: ts
      };

      await vault.setDoc('users', uid, record, { merge: false });
      return completeVaultLogin(record, true);
    }

    async function signInWithEmail(params) {
      await init();
      var opts = params || {};
      var email = validateEmail(opts.email);
      var password = String(opts.password || '');
      if (!password) {
        throw createAuthError('auth/missing-password', 'Введіть пароль');
      }

      if (state.mode === 'firebase' && firebaseRuntime) {
        var cred = await firebaseRuntime.authMod.signInWithEmailAndPassword(
          firebaseRuntime.auth,
          email,
          password
        );
        await syncFirebaseAuthUser(cred.user, { provider: 'password' });
        return {
          user: cloneData(state.user),
          isNewUser: false,
          mode: state.mode
        };
      }

      var matches = await vault.queryWhere('users', 'email', email);
      if (matches.length === 0) {
        throw createAuthError('auth/user-not-found', 'Користувача з такою поштою не знайдено');
      }
      var record = matches[0].data;
      if (!record.passwordHash) {
        throw createAuthError(
          'auth/invalid-credential',
          'Цей акаунт створено через OAuth-провайдера'
        );
      }
      var valid = await verifySecret(password, record.passwordHash);
      if (!valid) {
        throw createAuthError('auth/wrong-password', 'Невірний пароль');
      }
      return completeVaultLogin(record, false);
    }

    async function signOut() {
      await init();
      if (isCloudAuthenticated()) {
        await firebaseRuntime.authMod.signOut(firebaseRuntime.auth);
      }
      storageRemove(STORAGE_KEY_SESSION);
      await refreshDerivedStateForUser(null);
      emitChange();
      return { signedOut: true };
    }

    /* ---------------- Diagnostic Persistence & Atomic Claiming ---------------- */

    async function saveDiagnosticDraft(payload) {
      await init();
      var input = payload || {};
      var sid = input.sid && String(input.sid).indexOf('diag_') === 0
        ? String(input.sid)
        : 'diag_' + Date.now().toString(36) + '_' + randomHex(4);

      var ts = input.createdAt || nowIso();
      var ownerUid = state.user ? state.user.uid : null;

      var record = {
        sid: sid,
        predictedScore: Number(input.predictedScore || 0),
        cefrLevel: input.cefrLevel || 'B1',
        subject: input.subject || 'Математика',
        targetUni: input.targetUni || '',
        weakTopics: Array.isArray(input.weakTopics) ? cloneData(input.weakTopics) : [],
        trustScore: input.trustScore !== undefined ? Number(input.trustScore) : 100,
        unwrappedError: input.unwrappedError ? cloneData(input.unwrappedError) : null,
        answers: Array.isArray(input.answers) ? cloneData(input.answers) : [],
        recommendedTier: input.recommendedTier || 'StrictPass Pro',
        ownerUid: ownerUid,
        claimedAt: ownerUid ? ts : null,
        createdAt: ts,
        updatedAt: nowIso()
      };

      await vault.setDoc('diagnostics', sid, record, { merge: true });

      if (ownerUid) {
        var summary = buildDiagnosticSummary(record);
        await vault.setDoc('users', ownerUid, {
          latestDiagnostic: summary,
          updatedAt: nowIso()
        }, { merge: true });

        await syncDocToCloud('diagnostics', sid, record, true);
        await syncDocToCloud('users', ownerUid, {
          latestDiagnostic: summary,
          updatedAt: nowIso()
        }, true);
        storageRemove(STORAGE_KEY_PENDING_SID);
        await refreshDerivedStateForUser(ownerUid);
      } else {
        storageSet(STORAGE_KEY_PENDING_SID, sid);
        state.latestDiagnostic = cloneData(record);
      }

      emitChange();
      return cloneData(record);
    }

    function buildDiagnosticSummary(record) {
      return {
        sid: record.sid,
        predictedScore: record.predictedScore,
        cefrLevel: record.cefrLevel,
        subject: record.subject,
        targetUni: record.targetUni,
        weakTopics: Array.isArray(record.weakTopics) ? record.weakTopics.slice() : [],
        trustScore: record.trustScore,
        createdAt: record.createdAt
      };
    }

    async function claimDiagnostic(sid) {
      await init();
      if (!sid) {
        throw createAuthError('diagnostic/missing-sid', 'Потрібен ідентифікатор діагностики sid');
      }
      if (!state.user || !state.user.uid) {
        throw createAuthError('auth/requires-login', 'Увійдіть у профіль, щоб закріпити діагностику');
      }

      var uid = state.user.uid;
      var claimedAt = nowIso();
      var claimedRecord = null;

      if (isCloudAuthenticated()) {
        var fs = firebaseRuntime.firestoreMod;
        var diagRef = fs.doc(firebaseRuntime.db, 'diagnostics', sid);
        var userRef = fs.doc(firebaseRuntime.db, 'users', uid);

        claimedRecord = await fs.runTransaction(firebaseRuntime.db, async function (txn) {
          var diagSnap = await txn.get(diagRef);
          var diagData = diagSnap.exists() ? diagSnap.data() : await vault.getDoc('diagnostics', sid);
          if (!diagData) {
            throw createAuthError('diagnostic/not-found', 'Діагностику не знайдено: ' + sid);
          }
          if (diagData.ownerUid && diagData.ownerUid !== uid) {
            throw createAuthError('diagnostic/already-claimed', 'Діагностика належить іншому користувачу');
          }
          var updated = Object.assign({}, diagData, {
            ownerUid: uid,
            claimedAt: diagData.claimedAt || claimedAt,
            updatedAt: claimedAt
          });
          txn.set(diagRef, updated, { merge: true });
          txn.set(userRef, {
            latestDiagnostic: buildDiagnosticSummary(updated),
            updatedAt: claimedAt
          }, { merge: true });
          return updated;
        });
        await vault.setDoc('diagnostics', sid, claimedRecord, { merge: true });
        await vault.setDoc('users', uid, {
          latestDiagnostic: buildDiagnosticSummary(claimedRecord),
          updatedAt: claimedAt
        }, { merge: true });
      } else {
        claimedRecord = await vault.runTxn(async function (txn) {
          var diag = await txn.getDoc('diagnostics', sid);
          if (!diag) {
            throw createAuthError('diagnostic/not-found', 'Діагностику не знайдено: ' + sid);
          }
          if (diag.ownerUid && diag.ownerUid !== uid) {
            throw createAuthError('diagnostic/already-claimed', 'Діагностика належить іншому користувачу');
          }
          var updated = Object.assign({}, diag, {
            ownerUid: uid,
            claimedAt: diag.claimedAt || claimedAt,
            updatedAt: claimedAt
          });
          await txn.setDoc('diagnostics', sid, updated, { merge: true });
          await txn.setDoc('users', uid, {
            latestDiagnostic: buildDiagnosticSummary(updated),
            updatedAt: claimedAt
          }, { merge: true });
          return updated;
        });
      }

      if (storageGet(STORAGE_KEY_PENDING_SID) === sid) {
        storageRemove(STORAGE_KEY_PENDING_SID);
      }

      await refreshDerivedStateForUser(uid);
      emitChange();
      return {
        sid: sid,
        uid: uid,
        diagnostic: cloneData(claimedRecord)
      };
    }

    /* ---------------- Handoff Token & Sponsor Link Engine ---------------- */

    function resolveBaseUrl(customBaseUrl, defaultPath) {
      if (customBaseUrl) {
        return customBaseUrl;
      }
      if (hasWindow() && window.location) {
        var origin = window.location.origin && window.location.origin !== 'null'
          ? window.location.origin
          : '';
        if (origin) {
          return origin + defaultPath;
        }
      }
      return defaultPath;
    }

    function appendQueryParams(baseUrl, params) {
      var pairs = [];
      var keys = Object.keys(params);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
          pairs.push(encodeURIComponent(k) + '=' + encodeURIComponent(String(params[k])));
        }
      }
      if (!pairs.length) {
        return baseUrl;
      }
      var sep = baseUrl.indexOf('?') === -1 ? '?' : '&';
      return baseUrl + sep + pairs.join('&');
    }

    function extractTokenParam(tokenOrUrl, paramName) {
      var raw = String(tokenOrUrl || '').trim();
      if (!raw) {
        return '';
      }
      if (raw.indexOf('://') !== -1 || raw.indexOf('?') !== -1 || raw.indexOf('&') !== -1) {
        var qIdx = raw.indexOf('?');
        var queryStr = qIdx !== -1 ? raw.slice(qIdx + 1) : raw;
        var hashIdx = queryStr.indexOf('#');
        if (hashIdx !== -1) {
          queryStr = queryStr.slice(0, hashIdx);
        }
        var searchParams = new URLSearchParams(queryStr);
        return searchParams.get(paramName) || '';
      }
      return raw;
    }

    async function createHandoffToken(options) {
      await init();
      var opts = options || {};
      var targetDiag = opts.sid
        ? await readDiagnosticRecord(opts.sid)
        : (state.latestDiagnostic || null);

      var nowMs = Date.now();
      var ttlMs = Number(opts.ttlMs || HANDOFF_TTL_MS);
      var payload = {
        v: 1,
        iat: nowMs,
        exp: nowMs + ttlMs,
        nonce: randomHex(6),
        sid: targetDiag ? targetDiag.sid : null,
        diag: targetDiag ? buildDiagnosticSummary(targetDiag) : null,
        profile: state.user ? {
          uid: state.user.uid,
          email: state.user.email,
          displayName: state.user.displayName,
          provider: state.user.provider,
          role: state.user.role,
          familyId: state.user.familyId,
          inviteCode: state.user.inviteCode,
          activePass: state.activePass || state.user.activePass || null
        } : null,
        family: state.family ? {
          familyId: state.family.familyId,
          inviteCode: state.family.inviteCode,
          planSeatType: state.family.planSeatType,
          dailyScheduleTime: state.family.dailyScheduleTime
        } : null
      };

      var encodedPayload = base64UrlEncodeJson(payload);
      var signingInput = 'ht1.' + encodedPayload;
      var signature = await signTextHmac(signingInput);
      var token = signingInput + '.' + signature;

      var baseUrl = resolveBaseUrl(opts.targetUrl, '/mobile-app/');
      var urlParams = { ht: token };
      if (payload.sid) {
        urlParams.sid = payload.sid;
      }
      var url = appendQueryParams(baseUrl, urlParams);

      return {
        token: token,
        sid: payload.sid,
        url: url,
        expiresAt: new Date(payload.exp).toISOString(),
        payload: cloneData(payload)
      };
    }

    async function consumeHandoffToken(tokenOrUrl) {
      await init();
      var raw = String(tokenOrUrl || '').trim();
      var htToken = extractTokenParam(raw, 'ht');
      var sidParam = extractTokenParam(raw, 'sid');

      if (!htToken && sidParam) {
        var existingDiag = await readDiagnosticRecord(sidParam);
        if (!existingDiag) {
          throw createAuthError('handoff/diagnostic-not-found', 'Діагностику для переходу не знайдено');
        }
        storageSet(STORAGE_KEY_PENDING_SID, sidParam);
        state.latestDiagnostic = cloneData(existingDiag);
        if (state.user && (!existingDiag.ownerUid || existingDiag.ownerUid === state.user.uid)) {
          await claimDiagnostic(sidParam);
        }
        emitChange();
        return {
          valid: true,
          sid: sidParam,
          diagnostic: cloneData(existingDiag),
          profile: state.user ? cloneData(state.user) : null,
          importedAt: nowIso()
        };
      }

      var parts = htToken.split('.');
      if (parts.length !== 3 || parts[0] !== 'ht1') {
        throw createAuthError('handoff/invalid-token', 'Некоректний формат токена переходу');
      }

      var signingInput = parts[0] + '.' + parts[1];
      var validSig = await verifyTextHmac(signingInput, parts[2]);
      if (!validSig) {
        throw createAuthError('handoff/invalid-signature', 'Підпис токена переходу пошкоджено');
      }

      var payload;
      try {
        payload = base64UrlDecodeJson(parts[1]);
      } catch (_err) {
        throw createAuthError('handoff/malformed-payload', 'Пошкоджений вміст токена переходу');
      }

      if (!payload || typeof payload.exp !== 'number' || payload.exp < Date.now()) {
        throw createAuthError('handoff/expired-token', 'Термін дії токена переходу вичерпано');
      }

      var importedDiag = null;
      if (payload.diag && payload.sid) {
        var existing = await vault.getDoc('diagnostics', payload.sid);
        importedDiag = Object.assign({}, existing || {}, cloneData(payload.diag), {
          sid: payload.sid,
          updatedAt: nowIso()
        });
        await vault.setDoc('diagnostics', payload.sid, importedDiag, { merge: true });
        storageSet(STORAGE_KEY_PENDING_SID, payload.sid);
        state.latestDiagnostic = cloneData(importedDiag);
      }

      var importedProfile = null;
      if (payload.profile && payload.profile.uid) {
        var prof = payload.profile;
        var currentLocalUser = await vault.getDoc('users', prof.uid);
        var mergedUser = Object.assign({}, currentLocalUser || {}, {
          uid: prof.uid,
          email: prof.email || null,
          displayName: prof.displayName || null,
          provider: prof.provider || 'handoff',
          role: validateRole(prof.role),
          emailVerified: true,
          familyId: prof.familyId || (currentLocalUser && currentLocalUser.familyId) || null,
          inviteCode: prof.inviteCode || (currentLocalUser && currentLocalUser.inviteCode) || null,
          latestDiagnostic: importedDiag ? buildDiagnosticSummary(importedDiag) : (currentLocalUser && currentLocalUser.latestDiagnostic) || null,
          activePass: prof.activePass || (currentLocalUser && currentLocalUser.activePass) || null,
          createdAt: (currentLocalUser && currentLocalUser.createdAt) || nowIso(),
          updatedAt: nowIso()
        });
        await vault.setDoc('users', prof.uid, mergedUser, { merge: true });

        if (!state.user) {
          storageSet(STORAGE_KEY_SESSION, prof.uid);
        }
        importedProfile = sanitizePublicUser(mergedUser);
      }

      if (payload.family && payload.family.familyId) {
        var famExisting = await vault.getDoc('families', payload.family.familyId);
        if (!famExisting) {
          await vault.setDoc('families', payload.family.familyId, {
            familyId: payload.family.familyId,
            inviteCode: payload.family.inviteCode,
            planSeatType: payload.family.planSeatType || 'family',
            dailyScheduleTime: payload.family.dailyScheduleTime || '17:00',
            ownerUid: payload.profile ? payload.profile.uid : null,
            memberUids: payload.profile && payload.profile.uid ? [payload.profile.uid] : [],
            createdAt: nowIso(),
            updatedAt: nowIso()
          }, { merge: true });
        }
      }

      var activeUid = storageGet(STORAGE_KEY_SESSION);
      if (activeUid) {
        await refreshDerivedStateForUser(activeUid);
      }
      if (state.user && importedDiag && (!importedDiag.ownerUid || importedDiag.ownerUid === state.user.uid)) {
        await claimDiagnostic(importedDiag.sid);
      }

      emitChange();
      return {
        valid: true,
        sid: payload.sid || null,
        diagnostic: state.latestDiagnostic ? cloneData(state.latestDiagnostic) : importedDiag,
        profile: state.user ? cloneData(state.user) : importedProfile,
        importedAt: nowIso()
      };
    }

    async function createSponsorLink(options) {
      await init();
      var opts = options || {};
      var sku = String(opts.sku || 'StrictPass_Pro_Single_Season');
      var diagnosticSid = opts.diagnosticSid || (state.latestDiagnostic && state.latestDiagnostic.sid) || null;
      var diag = diagnosticSid ? await readDiagnosticRecord(diagnosticSid) : null;

      var payload = {
        v: 1,
        sku: sku,
        diagnosticSid: diagnosticSid,
        studentName: (state.user && state.user.displayName) || opts.studentName || 'Учень StrictAI',
        predictedScore: diag ? diag.predictedScore : null,
        cefrLevel: diag ? diag.cefrLevel : null,
        subject: diag ? diag.subject : null,
        targetUni: diag ? diag.targetUni : null,
        weakTopics: diag && Array.isArray(diag.weakTopics) ? diag.weakTopics.slice(0, 4) : [],
        inviteCode: (state.family && state.family.inviteCode) || (state.user && state.user.inviteCode) || null,
        createdAt: nowIso()
      };

      var encoded = base64UrlEncodeJson(payload);
      var signingInput = 'sp1.' + encoded;
      var sig = await signTextHmac(signingInput);
      var token = signingInput + '.' + sig;

      var baseUrl = resolveBaseUrl(opts.baseUrl, '/parents.html');
      var url = appendQueryParams(baseUrl, { sponsor: token });

      return {
        url: url,
        token: token,
        sku: sku,
        diagnosticSid: diagnosticSid,
        payload: payload
      };
    }

    async function consumeSponsorLink(urlOrToken) {
      var token = extractTokenParam(urlOrToken, 'sponsor');
      var parts = token.split('.');
      if (parts.length !== 3 || parts[0] !== 'sp1') {
        throw createAuthError('sponsor/invalid-token', 'Некоректне посилання для батьків');
      }
      var validSig = await verifyTextHmac(parts[0] + '.' + parts[1], parts[2]);
      if (!validSig) {
        throw createAuthError('sponsor/invalid-signature', 'Підпис спонсорського посилання недійсний');
      }
      return base64UrlDecodeJson(parts[1]);
    }

    /* ---------------- Family Pairing & Salted SHA-256 PIN ---------------- */

    function generateInviteCode() {
      var bytes = randomBytes(6);
      var code = '';
      for (var i = 0; i < 6; i++) {
        code += INVITE_ALPHABET.charAt(bytes[i] % INVITE_ALPHABET.length);
      }
      return 'SA-' + code;
    }

    async function generateUniqueInviteCode() {
      for (var attempt = 0; attempt < 8; attempt++) {
        var candidate = generateInviteCode();
        var existing = await vault.queryWhere('families', 'inviteCode', candidate);
        if (existing.length === 0) {
          return candidate;
        }
      }
      return 'SA-' + randomHex(3).toUpperCase();
    }

    function normalizeInviteCode(code) {
      var cleaned = String(code || '').trim().toUpperCase().replace(/\s+/g, '');
      if (cleaned.indexOf('SA-') !== 0 && cleaned.length === 6) {
        cleaned = 'SA-' + cleaned;
      }
      return cleaned;
    }

    async function createOrUpdateFamily(params) {
      await init();
      if (!state.user || !state.user.uid) {
        throw createAuthError('auth/requires-login', 'Потрібна авторизація для керування сім\'єю');
      }

      var opts = params || {};
      var uid = state.user.uid;
      var userRec = await vault.getDoc('users', uid);
      var existingFam = userRec && userRec.familyId ? await readFamilyRecord(userRec.familyId) : null;

      var seatType = opts.planSeatType || (existingFam && existingFam.planSeatType) || 'family';
      if (!Object.prototype.hasOwnProperty.call(SEAT_LIMITS, seatType)) {
        throw createAuthError('family/invalid-seat-type', 'Невідомий тип місць: ' + seatType);
      }

      var pinHash = existingFam ? existingFam.pinHash || null : null;
      if (opts.newPin !== undefined && opts.newPin !== null && String(opts.newPin) !== '') {
        var pinStr = String(opts.newPin).trim();
        if (!/^\d{4,8}$/.test(pinStr)) {
          throw createAuthError('family/invalid-pin', 'PIN має містити від 4 до 8 цифр');
        }
        pinHash = await hashSecret(pinStr);
      }

      var familyId = existingFam ? existingFam.familyId : 'fam_' + randomHex(6);
      var inviteCode = existingFam && existingFam.inviteCode
        ? existingFam.inviteCode
        : await generateUniqueInviteCode();

      var members = existingFam && Array.isArray(existingFam.memberUids)
        ? existingFam.memberUids.slice()
        : [];
      if (members.indexOf(uid) === -1) {
        members.push(uid);
      }

      var ts = nowIso();
      var familyRecord = {
        familyId: familyId,
        inviteCode: inviteCode,
        ownerUid: existingFam ? existingFam.ownerUid : uid,
        planSeatType: seatType,
        dailyScheduleTime: opts.dailyScheduleTime || (existingFam && existingFam.dailyScheduleTime) || '17:00',
        contractTerms: opts.contractTerms !== undefined
          ? cloneData(opts.contractTerms)
          : (existingFam && existingFam.contractTerms ? cloneData(existingFam.contractTerms) : null),
        pinHash: pinHash,
        memberUids: members,
        activePass: (existingFam && existingFam.activePass) || state.activePass || null,
        createdAt: existingFam ? existingFam.createdAt : ts,
        updatedAt: ts
      };

      await vault.setDoc('families', familyId, familyRecord, { merge: true });
      await vault.setDoc('users', uid, {
        familyId: familyId,
        inviteCode: inviteCode,
        updatedAt: ts
      }, { merge: true });

      await syncDocToCloud('families', familyId, familyRecord, true);
      await syncDocToCloud('users', uid, {
        familyId: familyId,
        inviteCode: inviteCode,
        updatedAt: ts
      }, true);

      await refreshDerivedStateForUser(uid);
      emitChange();
      return sanitizePublicFamily(familyRecord);
    }

    async function verifyParentPin(pin) {
      await init();
      if (!state.user || !state.user.familyId) {
        return false;
      }
      var fam = await readFamilyRecord(state.user.familyId);
      if (!fam || !fam.pinHash) {
        return false;
      }
      var pinStr = String(pin === undefined || pin === null ? '' : pin).trim();
      if (!pinStr) {
        return false;
      }
      return verifySecret(pinStr, fam.pinHash);
    }

    async function findFamilyByInviteCode(normalizedCode) {
      if (isCloudAuthenticated()) {
        try {
          var fs = firebaseRuntime.firestoreMod;
          var q = fs.query(
            fs.collection(firebaseRuntime.db, 'families'),
            fs.where('inviteCode', '==', normalizedCode)
          );
          var snap = await fs.getDocs(q);
          if (!snap.empty) {
            var firstDoc = snap.docs[0].data();
            await vault.setDoc('families', firstDoc.familyId, firstDoc, { merge: true });
            return firstDoc;
          }
        } catch (_err) {
          /* fall back to local Vault */
        }
      }
      var localMatches = await vault.queryWhere('families', 'inviteCode', normalizedCode);
      return localMatches.length ? localMatches[0].data : null;
    }

    async function joinFamilyByCode(inviteCode) {
      await init();
      if (!state.user || !state.user.uid) {
        throw createAuthError('auth/requires-login', 'Увійдіть у профіль, щоб приєднатися до сім\'ї');
      }
      var normalized = normalizeInviteCode(inviteCode);
      if (!/^SA-[A-Z0-9]{6}$/.test(normalized)) {
        throw createAuthError('family/invalid-code', 'Некоректний сімейний код (очікується SA-XXXXXX)');
      }

      var fam = await findFamilyByInviteCode(normalized);
      if (!fam) {
        throw createAuthError('family/not-found', 'Сім\'ю з кодом ' + normalized + ' не знайдено');
      }

      var uid = state.user.uid;
      var members = Array.isArray(fam.memberUids) ? fam.memberUids.slice() : [];
      var limit = SEAT_LIMITS[fam.planSeatType || 'family'] || 5;

      if (members.indexOf(uid) === -1) {
        if (members.length >= limit) {
          throw createAuthError(
            'family/seat-limit-reached',
            'У тарифі ' + fam.planSeatType + ' досягнуто ліміту учнів (' + limit + ')'
          );
        }
        members.push(uid);
      }

      var ts = nowIso();
      var updatedFam = Object.assign({}, fam, {
        memberUids: members,
        updatedAt: ts
      });

      await vault.setDoc('families', fam.familyId, updatedFam, { merge: true });
      await vault.setDoc('users', uid, {
        familyId: fam.familyId,
        inviteCode: fam.inviteCode,
        activePass: fam.activePass || state.activePass || null,
        updatedAt: ts
      }, { merge: true });

      await syncDocToCloud('families', fam.familyId, updatedFam, true);
      await syncDocToCloud('users', uid, {
        familyId: fam.familyId,
        inviteCode: fam.inviteCode,
        activePass: fam.activePass || state.activePass || null,
        updatedAt: ts
      }, true);

      await refreshDerivedStateForUser(uid);
      emitChange();
      return {
        joined: true,
        family: sanitizePublicFamily(updatedFam)
      };
    }

    /* ---------------- StrictPass Orders & Subscription State ---------------- */

    async function activateStrictPass(params) {
      await init();
      var opts = params || {};
      var ts = nowIso();
      var orderId = 'ord_' + Date.now().toString(36) + '_' + randomHex(4);
      var cycle = opts.cycle || 'season';
      var durationDays = cycle === 'annual' ? 365 : (cycle === 'season' ? 240 : 30);
      var expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

      var activePass = {
        orderId: orderId,
        tier: opts.tier || 'StrictPass',
        seatType: opts.seatType || 'single',
        cycle: cycle,
        priceUah: Number(opts.priceUah !== undefined ? opts.priceUah : 800),
        status: 'active',
        activatedAt: ts,
        expiresAt: expiresAt
      };

      var orderRecord = Object.assign({}, activePass, {
        uid: state.user ? state.user.uid : null,
        familyId: state.user ? state.user.familyId : null,
        createdAt: ts
      });

      await vault.setDoc('strictPassOrders', orderId, orderRecord, { merge: false });
      await syncDocToCloud('strictPassOrders', orderId, orderRecord, false);

      if (state.user && state.user.uid) {
        var uid = state.user.uid;
        await vault.setDoc('users', uid, {
          activePass: activePass,
          updatedAt: ts
        }, { merge: true });
        await syncDocToCloud('users', uid, {
          activePass: activePass,
          updatedAt: ts
        }, true);

        if (state.user.familyId) {
          var fam = await readFamilyRecord(state.user.familyId);
          if (fam) {
            var famUpdate = {
              activePass: activePass,
              planSeatType: activePass.seatType,
              updatedAt: ts
            };
            await vault.setDoc('families', fam.familyId, famUpdate, { merge: true });
            await syncDocToCloud('families', fam.familyId, famUpdate, true);
          }
        }
        await refreshDerivedStateForUser(uid);
      } else {
        state.activePass = cloneData(activePass);
      }

      emitChange();
      return {
        order: cloneData(orderRecord),
        activePass: cloneData(activePass)
      };
    }

    return {
      init: init,
      onChange: onChange,
      getState: getSnapshot,
      getCurrentUser: function () {
        return state.user ? cloneData(state.user) : null;
      },
      getFirebaseStatus: function () {
        return {
          mode: state.mode,
          projectId: state.projectId,
          online: isOnline(),
          hasCustomConfig: Boolean(readConfiguredFirebaseConfig())
        };
      },
      configureFirebase: configureFirebase,
      clearFirebaseConfig: clearFirebaseConfig,
      signInWithProvider: signInWithProvider,
      registerWithEmail: registerWithEmail,
      signInWithEmail: signInWithEmail,
      signOut: signOut,
      saveDiagnosticDraft: saveDiagnosticDraft,
      claimDiagnostic: claimDiagnostic,
      getLatestDiagnostic: function () {
        return state.latestDiagnostic ? cloneData(state.latestDiagnostic) : null;
      },
      createHandoffToken: createHandoffToken,
      consumeHandoffToken: consumeHandoffToken,
      createSponsorLink: createSponsorLink,
      consumeSponsorLink: consumeSponsorLink,
      createOrUpdateFamily: createOrUpdateFamily,
      verifyParentPin: verifyParentPin,
      joinFamilyByCode: joinFamilyByCode,
      getFamily: function () {
        return state.family ? cloneData(state.family) : null;
      },
      activateStrictPass: activateStrictPass,
      hashSecret: hashSecret,
      verifySecret: verifySecret,
      _resetVaultForTests: function () {
        vault.resetAll();
        initPromise = null;
        firebaseRuntime = null;
        state.initialized = false;
        state.mode = 'vault';
        state.projectId = 'strictai-local-vault';
        state.user = null;
        state.family = null;
        state.latestDiagnostic = null;
        state.activePass = null;
      }
    };
  }

  var StrictAuth = createStrictAuthEngine();
  globalScope.StrictAuth = StrictAuth;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = StrictAuth;
  }
})(typeof window !== 'undefined' ? window : globalThis);
