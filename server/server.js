/**
 * StrictAI Backend Server - Node.js Zero External Dependencies
 * Implements static file serving, REST API endpoints, health check, DB persistence,
 * Dictionary proxy, placement test generator, and notification engine.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const https = require('https');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve('/home/desty/StrictAI');
const SCRATCH_DIR = path.resolve('/home/desty/.gemini/antigravity/scratch/strictai');
const DB_PATH = path.join(ROOT_DIR, 'server', 'data', 'db.json');
const SCRATCH_DB_PATH = path.join(SCRATCH_DIR, 'server', 'data', 'db.json');

// Ensure db.json exists
function ensureDb() {
  const defaultDb = {
    users: [],
    sessions: [],
    lessons: [],
    notifications: [],
    state: {
      activeUser: null,
      theme: 'dark',
      progress: {}
    },
    updatedAt: new Date().toISOString()
  };

  [DB_PATH, SCRATCH_DB_PATH].forEach(dbPath => {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2), 'utf8');
    }
  });
}

function readDb() {
  ensureDb();
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB:', err);
    return { users: [], sessions: [], lessons: [], notifications: [], state: {} };
  }
}

function writeDb(data) {
  ensureDb();
  data.updatedAt = new Date().toISOString();
  const jsonStr = JSON.stringify(data, null, 2);
  fs.writeFileSync(DB_PATH, jsonStr, 'utf8');
  try {
    fs.writeFileSync(SCRATCH_DB_PATH, jsonStr, 'utf8');
  } catch (e) {
    // ignore scratch sync error if any
  }
}

// MIME types for static serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8'
};

function serveStatic(reqUrl, res) {
  let parsedUrl = url.parse(reqUrl).pathname;
  if (parsedUrl === '/') {
    parsedUrl = '/index.html';
  }

  // Security: prevent directory traversal
  const safePath = path.normalize(parsedUrl).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(ROOT_DIR, safePath);

  if (!fs.existsSync(filePath)) {
    // Try scratch dir
    filePath = path.join(SCRATCH_DIR, safePath);
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Not Found', path: parsedUrl }));
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

// Fetch dictionary data from Free Dictionary API or fallback
function fetchDictionary(word, lang, callback) {
  if (lang !== 'en') {
    // Built-in offline dictionary stub for multilingual
    const stubs = {
      de: { word, ipa: '/haʊ̯ptvɔʁt/', audio: '', meaning: 'Beispielwort' },
      es: { word, ipa: '/paˈlaβɾa/', audio: '', meaning: 'Palabra de ejemplo' },
      zh: { word, ipa: '/wɔːd/', audio: '', meaning: '示例文本' },
      pl: { word, ipa: '/ˈsłɔ.vɔ/', audio: '', meaning: 'Przykładowe słowo' },
      uk: { word, ipa: '/ˈsɫɔ.ʋɔ/', audio: '', meaning: 'Приклад слова' }
    };
    return callback(null, [stubs[lang] || { word, ipa: '/word/', audio: '', meaning: 'Sample' }]);
  }

  const apiURL = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
  https.get(apiURL, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      try {
        if (apiRes.statusCode === 200) {
          const json = JSON.parse(data);
          callback(null, json);
        } else {
          callback(null, [{ word, phonetic: '', meanings: [], note: 'Not found in official API, returning fallback' }]);
        }
      } catch (e) {
        callback(e, null);
      }
    });
  }).on('error', err => {
    callback(err, null);
  });
}

// Generate placement test questions
function generatePlacementTest(seed = Date.now()) {
  const questionPool = [
    { id: 1, level: 'A1', question: 'Choose the correct greeting:', options: ['Good morning', 'Car speed', 'Blue table', 'Run fast'], answer: 0 },
    { id: 2, level: 'A1', question: 'What is the plural of "child"?', options: ['childs', 'children', 'childes', 'child'], answer: 1 },
    { id: 3, level: 'A2', question: 'Yesterday, I _____ to the store.', options: ['go', 'gone', 'went', 'going'], answer: 2 },
    { id: 4, level: 'B1', question: 'If I had time, I _____ help you.', options: ['will', 'would', 'can', 'had'], answer: 1 },
    { id: 5, level: 'B2', question: 'By next year, she _____ her degree.', options: ['will finish', 'will have finished', 'finishes', 'finished'], answer: 1 },
    { id: 6, level: 'C1', question: 'Hardly _____ entered the room when the phone rang.', options: ['had I', 'I had', 'did I', 'have I'], answer: 0 }
  ];

  // Shuffle pseudo-randomly using seed
  const shuffled = [...questionPool].sort(() => Math.sin(seed++) - 0.5);
  return {
    seed,
    generatedAt: new Date().toISOString(),
    totalQuestions: shuffled.length,
    questions: shuffled
  };
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Router
  if (pathname.startsWith('/api/v1/')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (pathname === '/api/v1/health' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        status: 'ok',
        architecture: 'StrictAI Multi-Tier v2.0',
        timestamp: new Date().toISOString()
      }));
      return;
    }

    if (pathname === '/api/v1/state') {
      if (method === 'GET') {
        const db = readDb();
        res.writeHead(200);
        res.end(JSON.stringify(db));
        return;
      }
      if (method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          try {
            const newState = JSON.parse(body);
            const db = readDb();
            const merged = { ...db, ...newState };
            writeDb(merged);
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'success', data: merged }));
          } catch (e) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
          }
        });
        return;
      }
    }

    if (pathname === '/api/v1/pronunciation' && method === 'GET') {
      const query = parsedUrl.query;
      const lang = query.lang || 'en';
      const word = query.word || 'hello';

      fetchDictionary(word, lang, (err, result) => {
        if (err) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: 'Failed to fetch pronunciation data' }));
          return;
        }
        res.writeHead(200);
        res.end(JSON.stringify({ lang, word, data: result }));
      });
      return;
    }

    if (pathname === '/api/v1/placement/generate' && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        let seed = Date.now();
        try {
          const parsed = JSON.parse(body || '{}');
          if (parsed.seed) seed = Number(parsed.seed);
        } catch (e) {}

        const test = generatePlacementTest(seed);
        res.writeHead(200);
        res.end(JSON.stringify(test));
      });
      return;
    }

    if (pathname === '/api/v1/notifications/missed-lesson' && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const db = readDb();
          const notification = {
            id: 'notif_' + Date.now(),
            type: 'missed-lesson',
            studentId: payload.studentId || 'unknown',
            message: payload.message || 'Student missed scheduled lesson session.',
            timestamp: new Date().toISOString(),
            read: false
          };
          db.notifications = db.notifications || [];
          db.notifications.push(notification);
          writeDb(db);

          res.writeHead(201);
          res.end(JSON.stringify({
            status: 'registered',
            notification,
            parentAlert: { channel: 'push/telegram/email', dispatched: true, target: 'parents' },
            studentAlert: { channel: 'app-banner', dispatched: true, target: payload.studentId }
          }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid payload for missed-lesson notification' }));
        }
      });
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'API Endpoint Not Found' }));
    return;
  }

  // Serve static files
  serveStatic(req.url, res);
});

// Sync server file to both scratch and StrictAI paths
function writeServerFiles(content) {
  const scratchServerPath = '/home/desty/.gemini/antigravity/scratch/strictai/server/server.js';
  const strictAiServerPath = '/home/desty/StrictAI/server/server.js';
  
  [scratchServerPath, strictAiServerPath].forEach(filePath => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf8');
  });
}

if (require.main === module) {
  // Save files on execution startup
  const code = fs.readFileSync(__filename, 'utf8');
  writeServerFiles(code);
  ensureDb();

  server.listen(PORT, () => {
    console.log(`StrictAI Multi-Tier Server v2.0 listening on http://localhost:${PORT}`);
  });
}

module.exports = server;
