/* ==========================================================================
   StrictAI Mobile — Anti-OCR Canvas Question Renderer & Ranked Exam Guard
   Zero emojis. Zero JSX. Exposes window.StrictMobileAntiCheat.
   Compatible with firestore.rules isValidAntiCheatSummary validator.
   ========================================================================== */

(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.StrictMobileAntiCheat = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var FONT_SANS = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  var FONT_MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

  var EXTENSION_SIGNATURES = [
    'monica',
    'sider',
    'merlin',
    'maxai',
    'chatgpt-sidebar',
    'liner-ai',
    'harpa',
    'data-strict-sim-extension'
  ];

  var THEMES = {
    light: {
      bg: '#FFFFFF',
      subtleBg: '#F6F6F7',
      headerFill: '#EFEFF1',
      primaryInk: '#09090B',
      secondaryInk: '#52525B',
      mutedInk: '#71717A',
      border: '#E4E4E7',
      borderStrong: '#D4D4D8',
      accent: '#B45309',
      accentBg: 'rgba(180, 83, 9, 0.08)',
      accentBorder: 'rgba(180, 83, 9, 0.30)',
      meshStroke: 'rgba(9, 9, 11, 0.045)',
      watermarkInk: 'rgba(9, 9, 11, 0.045)',
      gridLine: 'rgba(9, 9, 11, 0.08)',
      axisInk: '#52525B',
      okInk: '#15803D'
    },
    dark: {
      bg: '#121215',
      subtleBg: '#1A1A1F',
      headerFill: '#1F1F26',
      primaryInk: '#FAFAFA',
      secondaryInk: '#A1A1AA',
      mutedInk: '#71717A',
      border: '#27272A',
      borderStrong: '#3F3F46',
      accent: '#F59E0B',
      accentBg: 'rgba(245, 158, 11, 0.12)',
      accentBorder: 'rgba(245, 158, 11, 0.34)',
      meshStroke: 'rgba(250, 250, 250, 0.05)',
      watermarkInk: 'rgba(250, 250, 250, 0.045)',
      gridLine: 'rgba(250, 250, 250, 0.08)',
      axisInk: '#A1A1AA',
      okInk: '#22C55E'
    }
  };

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function hashString(str) {
    var s = String(str || 'strictai');
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function createRng(seedValue) {
    var state = (seedValue >>> 0) || 123456789;
    return function () {
      state = (state + 0x6D2B79F5) | 0;
      var t = Math.imul(state ^ (state >>> 15), 1 | state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function drawRoundedRect(ctx, x, y, w, h, r) {
    var radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function breakLongWord(ctx, word, maxWidth) {
    var parts = [];
    var current = '';
    for (var i = 0; i < word.length; i++) {
      var next = current + word.charAt(i);
      if (current && ctx.measureText(next).width > maxWidth) {
        parts.push(current);
        current = word.charAt(i);
      } else {
        current = next;
      }
    }
    if (current) {
      parts.push(current);
    }
    return parts;
  }

  function wrapText(ctx, text, maxWidth, font) {
    if (text === null || text === undefined) {
      return [];
    }
    var raw = String(text);
    if (!raw.trim()) {
      return [];
    }
    if (font) {
      ctx.font = font;
    }
    var safeWidth = Math.max(40, maxWidth);
    var paragraphs = raw.split(/\r?\n/);
    var lines = [];

    for (var p = 0; p < paragraphs.length; p++) {
      var para = paragraphs[p].trim();
      if (!para) {
        if (lines.length > 0) {
          lines.push('');
        }
        continue;
      }
      var words = para.split(/\s+/);
      var currentLine = '';

      for (var w = 0; w < words.length; w++) {
        var word = words[w];
        var candidate = currentLine ? (currentLine + ' ' + word) : word;
        if (ctx.measureText(candidate).width <= safeWidth) {
          currentLine = candidate;
        } else {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = '';
          }
          if (ctx.measureText(word).width > safeWidth) {
            var chunks = breakLongWord(ctx, word, safeWidth);
            for (var c = 0; c < chunks.length - 1; c++) {
              lines.push(chunks[c]);
            }
            currentLine = chunks[chunks.length - 1] || '';
          } else {
            currentLine = word;
          }
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
    }

    return lines;
  }

  function normalizeTableData(tableData) {
    if (!tableData) {
      return null;
    }
    var headers = [];
    var rows = [];

    if (Array.isArray(tableData)) {
      if (tableData.length === 0) {
        return null;
      }
      headers = Array.isArray(tableData[0]) ? tableData[0].map(String) : [];
      for (var i = 1; i < tableData.length; i++) {
        if (Array.isArray(tableData[i])) {
          rows.push(tableData[i].map(String));
        }
      }
    } else if (typeof tableData === 'object') {
      var rawHeaders = tableData.headers || tableData.columns || [];
      headers = Array.isArray(rawHeaders) ? rawHeaders.map(String) : [];
      var rawRows = Array.isArray(tableData.rows) ? tableData.rows : [];
      for (var r = 0; r < rawRows.length; r++) {
        if (Array.isArray(rawRows[r])) {
          rows.push(rawRows[r].map(String));
        }
      }
    }

    var colCount = headers.length;
    for (var j = 0; j < rows.length; j++) {
      if (rows[j].length > colCount) {
        colCount = rows[j].length;
      }
    }
    if (colCount === 0) {
      return null;
    }

    return {
      headers: headers,
      rows: rows,
      colCount: colCount,
      caption: tableData.caption ? String(tableData.caption) : ''
    };
  }

  function computeTableLayout(ctx, table, contentWidth) {
    var colCount = table.colCount;
    var headerFont = '600 11px ' + FONT_SANS;
    var cellFont = '500 11.5px ' + FONT_MONO;
    var cellPadX = 8;
    var cellPadY = 7;

    var naturalWidths = [];
    for (var c = 0; c < colCount; c++) {
      ctx.font = headerFont;
      var maxW = table.headers[c] ? ctx.measureText(table.headers[c]).width : 24;
      ctx.font = cellFont;
      for (var r = 0; r < table.rows.length; r++) {
        var val = table.rows[r][c] !== undefined ? String(table.rows[r][c]) : '';
        var w = ctx.measureText(val).width;
        if (w > maxW) {
          maxW = w;
        }
      }
      naturalWidths.push(Math.max(44, maxW + cellPadX * 2));
    }

    var sumNatural = 0;
    for (var k = 0; k < naturalWidths.length; k++) {
      sumNatural += naturalWidths[k];
    }

    var colWidths = [];
    var usedWidth = 0;
    for (var c2 = 0; c2 < colCount; c2++) {
      var colW = c2 === colCount - 1
        ? contentWidth - usedWidth
        : Math.max(46, Math.round((naturalWidths[c2] / sumNatural) * contentWidth));
      colWidths.push(colW);
      usedWidth += colW;
    }

    var headerLineH = 14;
    var headerLines = [];
    var headerMaxLines = 1;
    if (table.headers.length > 0) {
      for (var hc = 0; hc < colCount; hc++) {
        var hText = table.headers[hc] !== undefined ? table.headers[hc] : '';
        var hWrapped = wrapText(ctx, hText, colWidths[hc] - cellPadX * 2, headerFont);
        headerLines.push(hWrapped);
        if (hWrapped.length > headerMaxLines) {
          headerMaxLines = hWrapped.length;
        }
      }
    }
    var headerHeight = table.headers.length > 0 ? (headerMaxLines * headerLineH + cellPadY * 2) : 0;

    var bodyLineH = 15;
    var rowLayouts = [];
    var totalBodyHeight = 0;
    for (var rr = 0; rr < table.rows.length; rr++) {
      var cells = [];
      var maxCellLines = 1;
      for (var cc = 0; cc < colCount; cc++) {
        var cellVal = table.rows[rr][cc] !== undefined ? table.rows[rr][cc] : '';
        var cWrapped = wrapText(ctx, cellVal, colWidths[cc] - cellPadX * 2, cellFont);
        cells.push(cWrapped);
        if (cWrapped.length > maxCellLines) {
          maxCellLines = cWrapped.length;
        }
      }
      var rowH = maxCellLines * bodyLineH + cellPadY * 2;
      rowLayouts.push({ cells: cells, height: rowH });
      totalBodyHeight += rowH;
    }

    return {
      colWidths: colWidths,
      headerFont: headerFont,
      cellFont: cellFont,
      headerLines: headerLines,
      headerLineH: headerLineH,
      headerHeight: headerHeight,
      rowLayouts: rowLayouts,
      bodyLineH: bodyLineH,
      cellPadX: cellPadX,
      cellPadY: cellPadY,
      totalHeight: headerHeight + totalBodyHeight
    };
  }

  function renderTableBlock(ctx, table, layout, x, y, width, theme) {
    ctx.save();
    drawRoundedRect(ctx, x, y, width, layout.totalHeight, 8);
    ctx.fillStyle = theme.bg;
    ctx.fill();
    ctx.clip();

    var curY = y;
    if (layout.headerHeight > 0) {
      ctx.fillStyle = theme.headerFill;
      ctx.fillRect(x, curY, width, layout.headerHeight);

      ctx.font = layout.headerFont;
      ctx.fillStyle = theme.primaryInk;
      ctx.textBaseline = 'top';
      var hx = x;
      for (var c = 0; c < layout.colWidths.length; c++) {
        var lines = layout.headerLines[c] || [];
        for (var l = 0; l < lines.length; l++) {
          ctx.fillText(lines[l], hx + layout.cellPadX, curY + layout.cellPadY + l * layout.headerLineH);
        }
        hx += layout.colWidths[c];
      }
      curY += layout.headerHeight;

      ctx.strokeStyle = theme.borderStrong;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, curY + 0.5);
      ctx.lineTo(x + width, curY + 0.5);
      ctx.stroke();
    }

    for (var r = 0; r < layout.rowLayouts.length; r++) {
      var row = layout.rowLayouts[r];
      if (r % 2 === 1) {
        ctx.fillStyle = theme.subtleBg;
        ctx.fillRect(x, curY, width, row.height);
      }

      ctx.font = layout.cellFont;
      ctx.fillStyle = theme.primaryInk;
      ctx.textBaseline = 'top';
      var cx = x;
      for (var cc = 0; cc < layout.colWidths.length; cc++) {
        var cLines = row.cells[cc] || [];
        for (var cl = 0; cl < cLines.length; cl++) {
          ctx.fillText(cLines[cl], cx + layout.cellPadX, curY + layout.cellPadY + cl * layout.bodyLineH);
        }
        cx += layout.colWidths[cc];
      }

      curY += row.height;
      if (r < layout.rowLayouts.length - 1) {
        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, curY + 0.5);
        ctx.lineTo(x + width, curY + 0.5);
        ctx.stroke();
      }
    }

    // Vertical column rules
    var vx = x;
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 1;
    for (var vc = 0; vc < layout.colWidths.length - 1; vc++) {
      vx += layout.colWidths[vc];
      ctx.beginPath();
      ctx.moveTo(vx + 0.5, y);
      ctx.lineTo(vx + 0.5, y + layout.totalHeight);
      ctx.stroke();
    }

    ctx.restore();

    drawRoundedRect(ctx, x + 0.5, y + 0.5, width - 1, layout.totalHeight - 1, 8);
    ctx.strokeStyle = theme.borderStrong;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawArrowHead(ctx, fromX, fromY, toX, toY, size, color) {
    var angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - size * Math.cos(angle - Math.PI / 6), toY - size * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - size * Math.cos(angle + Math.PI / 6), toY - size * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function renderParabolaDiagram(ctx, diagram, boxX, boxY, boxW, boxH, theme) {
    var params = (diagram && diagram.params) || {};
    var a = typeof params.a === 'number' && params.a !== 0 ? params.a : 1;
    var hasPQ = typeof params.p === 'number' && typeof params.q === 'number';
    var p = hasPQ ? params.p : (typeof params.b === 'number' ? -params.b / (2 * a) : 2);
    var b = hasPQ ? (-2 * a * p) : (typeof params.b === 'number' ? params.b : -4);
    var q = hasPQ ? params.q : (typeof params.c === 'number' ? (a * p * p + b * p + params.c) : -1);
    var c = hasPQ ? (a * p * p + q) : (typeof params.c === 'number' ? params.c : 3);

    var plotPadL = 28;
    var plotPadR = 20;
    var plotPadT = 30;
    var plotPadB = 22;
    var pw = boxW - plotPadL - plotPadR;
    var ph = boxH - plotPadT - plotPadB;
    var ox = boxX + plotPadL;
    var oy = boxY + plotPadT;

    var disc = b * b - 4 * a * c;
    var roots = [];
    if (disc >= 0) {
      var sqrtD = Math.sqrt(disc);
      var r1 = (-b - sqrtD) / (2 * a);
      var r2 = (-b + sqrtD) / (2 * a);
      roots = r1 <= r2 ? [r1, r2] : [r2, r1];
    }

    var halfSpanX = roots.length === 2 ? Math.max(2.5, Math.abs(roots[1] - p) + 1.5) : 3.5;
    var xMin = Math.min(0, p - halfSpanX);
    var xMax = Math.max(0, p + halfSpanX);
    if (xMax - xMin < 6) {
      xMin -= 1;
      xMax += 1;
    }

    function evalY(xVal) {
      return a * (xVal - p) * (xVal - p) + q;
    }

    var yCandidates = [0, q, evalY(xMin), evalY(xMax)];
    var yMin = Math.min.apply(null, yCandidates);
    var yMax = Math.max.apply(null, yCandidates);
    var ySpan = Math.max(4, yMax - yMin);
    yMin -= ySpan * 0.14;
    yMax += ySpan * 0.18;

    function mapX(xv) {
      return ox + ((xv - xMin) / (xMax - xMin)) * pw;
    }
    function mapY(yv) {
      return oy + ph - ((yv - yMin) / (yMax - yMin)) * ph;
    }

    // Subtle coordinate grid
    ctx.save();
    ctx.strokeStyle = theme.gridLine;
    ctx.lineWidth = 1;
    var gxStep = Math.max(1, Math.round((xMax - xMin) / 6));
    for (var gx = Math.ceil(xMin); gx <= Math.floor(xMax); gx += gxStep) {
      var px = Math.round(mapX(gx)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(px, oy);
      ctx.lineTo(px, oy + ph);
      ctx.stroke();
    }
    var gyStep = Math.max(1, Math.round((yMax - yMin) / 5));
    for (var gy = Math.ceil(yMin); gy <= Math.floor(yMax); gy += gyStep) {
      var py = Math.round(mapY(gy)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(ox, py);
      ctx.lineTo(ox + pw, py);
      ctx.stroke();
    }

    // Axes
    var axisX = clamp(mapX(0), ox + 8, ox + pw - 8);
    var axisY = clamp(mapY(0), oy + 8, oy + ph - 8);
    ctx.strokeStyle = theme.axisInk;
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(ox, axisY);
    ctx.lineTo(ox + pw, axisY);
    ctx.moveTo(axisX, oy + ph);
    ctx.lineTo(axisX, oy);
    ctx.stroke();

    drawArrowHead(ctx, ox, axisY, ox + pw, axisY, 6, theme.axisInk);
    drawArrowHead(ctx, axisX, oy + ph, axisX, oy, 6, theme.axisInk);

    ctx.font = '600 10px ' + FONT_MONO;
    ctx.fillStyle = theme.secondaryInk;
    ctx.textBaseline = 'middle';
    ctx.fillText('x', ox + pw - 8, axisY - 9);
    ctx.fillText('y', axisX + 8, oy + 6);
    ctx.fillText('0', axisX - 10, axisY + 9);

    // Clip curve inside plot area
    ctx.save();
    ctx.beginPath();
    ctx.rect(ox, oy, pw, ph);
    ctx.clip();

    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 2.25;
    ctx.beginPath();
    var steps = 80;
    for (var s = 0; s <= steps; s++) {
      var xv = xMin + (s / steps) * (xMax - xMin);
      var yv = evalY(xv);
      var cx = mapX(xv);
      var cy = mapY(yv);
      if (s === 0) {
        ctx.moveTo(cx, cy);
      } else {
        ctx.lineTo(cx, cy);
      }
    }
    ctx.stroke();
    ctx.restore();

    // Vertex marker
    var vx = mapX(p);
    var vy = mapY(q);
    if (vy >= oy - 4 && vy <= oy + ph + 4) {
      ctx.fillStyle = theme.bg;
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(vx, vy, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = '600 10px ' + FONT_MONO;
      ctx.fillStyle = theme.primaryInk;
      var vLabel = 'V(' + Number(p.toFixed(1)) + '; ' + Number(q.toFixed(1)) + ')';
      var vLabelY = a > 0 ? Math.min(oy + ph - 8, vy + 13) : Math.max(oy + 10, vy - 13);
      ctx.fillText(vLabel, clamp(vx - 20, ox + 4, ox + pw - 68), vLabelY);
    }

    // Root markers
    for (var ri = 0; ri < roots.length; ri++) {
      var rx = mapX(roots[ri]);
      var ry = mapY(0);
      if (rx >= ox + 4 && rx <= ox + pw - 4) {
        ctx.fillStyle = theme.primaryInk;
        ctx.beginPath();
        ctx.arc(rx, ry, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '500 9.5px ' + FONT_MONO;
        ctx.fillStyle = theme.secondaryInk;
        ctx.fillText('x' + (ri + 1) + '=' + Number(roots[ri].toFixed(1)), clamp(rx - 14, ox + 2, ox + pw - 42), ry - 10);
      }
    }

    // Parameter legend pill at top-right
    var paramText = hasPQ
      ? ('a=' + a + '  p=' + p + '  q=' + q)
      : ('a=' + a + '  b=' + b + '  c=' + c);
    ctx.font = '600 10px ' + FONT_MONO;
    var pWidth = ctx.measureText(paramText).width + 12;
    drawRoundedRect(ctx, boxX + boxW - pWidth - 10, boxY + 8, pWidth, 18, 4);
    ctx.fillStyle = theme.bg;
    ctx.fill();
    ctx.strokeStyle = theme.borderStrong;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = theme.accent;
    ctx.textBaseline = 'middle';
    ctx.fillText(paramText, boxX + boxW - pWidth - 4, boxY + 17);

    ctx.restore();
  }

  function renderTriangleDiagram(ctx, diagram, boxX, boxY, boxW, boxH, theme) {
    var params = (diagram && diagram.params) || {};
    var isRight = Boolean(params.rightAngle) || params.kind === 'right';
    var vertices = Array.isArray(params.vertices) && params.vertices.length === 3
      ? params.vertices
      : ['A', 'B', 'C'];
    var sides = params.sides || {};
    var angles = params.angles || {};

    var cx = boxX + boxW / 2;
    var baseY = boxY + boxH - 28;
    var topY = boxY + 38;
    var spanW = Math.min(210, boxW - 96);

    var pA;
    var pB;
    var pC;

    if (isRight) {
      pC = { x: cx - spanW * 0.44, y: baseY };
      pB = { x: cx + spanW * 0.48, y: baseY };
      pA = { x: pC.x, y: topY };
    } else {
      pA = { x: cx - spanW * 0.48, y: baseY };
      pB = { x: cx + spanW * 0.48, y: baseY };
      pC = { x: cx - spanW * 0.10, y: topY };
    }

    ctx.save();

    // Right-angle square marker or angle arc
    if (isRight) {
      var sq = 13;
      ctx.strokeStyle = theme.accent;
      ctx.fillStyle = theme.accentBg;
      ctx.lineWidth = 1.5;
      ctx.fillRect(pC.x, pC.y - sq, sq, sq);
      ctx.beginPath();
      ctx.moveTo(pC.x, pC.y - sq);
      ctx.lineTo(pC.x + sq, pC.y - sq);
      ctx.lineTo(pC.x + sq, pC.y);
      ctx.stroke();
    } else {
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pA.x, pA.y, 20, -Math.atan2(pA.y - pC.y, pC.x - pA.x), 0);
      ctx.stroke();
    }

    // Optional altitude dashed line
    if (params.altitude && !isRight) {
      ctx.save();
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = theme.secondaryInk;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(pC.x, pC.y);
      ctx.lineTo(pC.x, pA.y);
      ctx.stroke();
      ctx.restore();

      ctx.strokeStyle = theme.secondaryInk;
      ctx.lineWidth = 1;
      ctx.strokeRect(pC.x, pA.y - 8, 8, 8);
      if (params.heightLabel) {
        ctx.font = '600 10.5px ' + FONT_MONO;
        ctx.fillStyle = theme.secondaryInk;
        ctx.fillText(String(params.heightLabel), pC.x + 6, (pC.y + pA.y) / 2);
      }
    }

    // Triangle fill & outline
    ctx.beginPath();
    ctx.moveTo(pA.x, pA.y);
    ctx.lineTo(pB.x, pB.y);
    ctx.lineTo(pC.x, pC.y);
    ctx.closePath();
    ctx.fillStyle = theme.bg;
    ctx.globalAlpha = 0.45;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = theme.primaryInk;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Vertex dots & labels
    var pts = isRight ? [pA, pB, pC] : [pA, pB, pC];
    var offsets = isRight
      ? [{ dx: -14, dy: -6 }, { dx: 8, dy: 4 }, { dx: -15, dy: 4 }]
      : [{ dx: -15, dy: 4 }, { dx: 8, dy: 4 }, { dx: -4, dy: -13 }];

    ctx.font = '700 11.5px ' + FONT_MONO;
    for (var i = 0; i < 3; i++) {
      ctx.fillStyle = theme.primaryInk;
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(String(vertices[i]), pts[i].x + offsets[i].dx, pts[i].y + offsets[i].dy);
    }

    // Side labels
    var sideAB = sides.AB || sides.c || sides[2] || (isRight ? 'c' : 'c');
    var sideBC = sides.BC || sides.a || sides[0] || (isRight ? 'b' : 'a');
    var sideAC = sides.AC || sides.b || sides[1] || (isRight ? 'a' : 'b');

    ctx.font = '600 11px ' + FONT_MONO;
    ctx.fillStyle = theme.accent;
    ctx.textBaseline = 'middle';

    if (isRight) {
      ctx.fillText(String(sideAC), pC.x - 36, (pA.y + pC.y) / 2);
      ctx.fillText(String(sideBC), (pC.x + pB.x) / 2 - 12, pB.y + 14);
      ctx.fillText(String(sideAB), (pA.x + pB.x) / 2 + 10, (pA.y + pB.y) / 2 - 8);
    } else {
      ctx.fillText(String(sideAC), (pA.x + pC.x) / 2 - 28, (pA.y + pC.y) / 2 - 4);
      ctx.fillText(String(sideBC), (pB.x + pC.x) / 2 + 10, (pB.y + pC.y) / 2 - 4);
      ctx.fillText(String(sideAB), (pA.x + pB.x) / 2 - 10, pA.y + 14);
    }

    // Angle labels if provided
    var angleLabel = angles.A || angles.alpha || (isRight ? '90 deg' : 'alpha');
    if (angleLabel) {
      ctx.font = '500 10px ' + FONT_MONO;
      ctx.fillStyle = theme.secondaryInk;
      if (isRight) {
        ctx.fillText(String(angles.B || angles.beta || ''), pB.x - 44, pB.y - 11);
        ctx.fillText(String(angles.A || angles.alpha || ''), pA.x + 8, pA.y + 22);
      } else {
        ctx.fillText(String(angleLabel), pA.x + 22, pA.y - 10);
      }
    }

    ctx.restore();
  }

  function drawResistorBox(ctx, cx, cy, w, h, label, valueText, theme) {
    ctx.save();
    ctx.fillStyle = theme.bg;
    ctx.strokeStyle = theme.primaryInk;
    ctx.lineWidth = 1.75;
    drawRoundedRect(ctx, cx - w / 2, cy - h / 2, w, h, 3);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 10.5px ' + FONT_MONO;
    ctx.fillStyle = theme.primaryInk;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(label, cx, cy);

    if (valueText) {
      ctx.font = '600 10px ' + FONT_MONO;
      ctx.fillStyle = theme.accent;
      ctx.fillText(valueText, cx, cy - h / 2 - 10);
    }
    ctx.restore();
  }

  function renderCircuitDiagram(ctx, diagram, boxX, boxY, boxW, boxH, theme) {
    var params = (diagram && diagram.params) || {};
    var uVal = params.U !== undefined ? String(params.U) : (params.E !== undefined ? String(params.E) : '12 В');
    var r1Val = params.R1 !== undefined ? String(params.R1) : '4 Ом';
    var r2Val = params.R2 !== undefined ? String(params.R2) : '8 Ом';
    var isParallel = params.mode === 'parallel';

    var leftX = boxX + 58;
    var rightX = boxX + boxW - 44;
    var topY = boxY + 48;
    var botY = boxY + boxH - 28;
    var midY = (topY + botY) / 2;

    ctx.save();
    ctx.strokeStyle = theme.primaryInk;
    ctx.lineWidth = 1.75;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Top wire, bottom wire, right wire, left wire (leaving gap for battery)
    ctx.beginPath();
    // Left top to battery+
    ctx.moveTo(leftX, midY - 8);
    ctx.lineTo(leftX, topY);
    // Top wire
    ctx.lineTo(rightX, topY);
    // Right wire
    ctx.lineTo(rightX, botY);
    // Bottom wire
    ctx.lineTo(leftX, botY);
    // Left bottom to battery-
    ctx.lineTo(leftX, midY + 8);
    ctx.stroke();

    // DC Battery / Source Symbol
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.moveTo(leftX - 14, midY - 8);
    ctx.lineTo(leftX + 14, midY - 8);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 3.2;
    ctx.moveTo(leftX - 8, midY + 8);
    ctx.lineTo(leftX + 8, midY + 8);
    ctx.stroke();

    ctx.font = '700 10.5px ' + FONT_MONO;
    ctx.fillStyle = theme.accent;
    ctx.textBaseline = 'middle';
    ctx.fillText('+', leftX + 14, midY - 12);
    ctx.fillStyle = theme.secondaryInk;
    ctx.fillText('-', leftX + 14, midY + 12);
    ctx.fillStyle = theme.primaryInk;
    ctx.fillText('U=' + uVal, boxX + 10, midY);

    if (isParallel) {
      var branchX = (leftX + rightX) / 2 + 12;
      ctx.strokeStyle = theme.primaryInk;
      ctx.lineWidth = 1.75;
      ctx.beginPath();
      ctx.moveTo(branchX, topY);
      ctx.lineTo(branchX, botY);
      ctx.stroke();

      // Junction nodes
      ctx.fillStyle = theme.primaryInk;
      ctx.beginPath();
      ctx.arc(branchX, topY, 3.2, 0, Math.PI * 2);
      ctx.arc(branchX, botY, 3.2, 0, Math.PI * 2);
      ctx.fill();

      drawResistorBox(ctx, branchX, midY, 22, 40, 'R1', '', theme);
      drawResistorBox(ctx, rightX, midY, 22, 40, 'R2', '', theme);

      ctx.font = '600 10px ' + FONT_MONO;
      ctx.fillStyle = theme.accent;
      ctx.fillText(r1Val, branchX - 42, midY - 12);
      ctx.fillText(r2Val, rightX - 42, midY - 12);
    } else {
      var r1X = leftX + (rightX - leftX) * 0.38;
      var r2X = leftX + (rightX - leftX) * 0.76;
      drawResistorBox(ctx, r1X, topY, 44, 18, 'R1', 'R1 = ' + r1Val, theme);
      drawResistorBox(ctx, r2X, topY, 44, 18, 'R2', 'R2 = ' + r2Val, theme);
    }

    // Current arrow on top left wire
    var arrowX1 = leftX + 18;
    var arrowX2 = leftX + 42;
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(arrowX1, topY - 11);
    ctx.lineTo(arrowX2, topY - 11);
    ctx.stroke();
    drawArrowHead(ctx, arrowX1, topY - 11, arrowX2, topY - 11, 5.5, theme.accent);
    ctx.font = '700 10px ' + FONT_MONO;
    ctx.fillStyle = theme.accent;
    ctx.fillText(params.I ? ('I=' + params.I) : 'I', arrowX1, topY - 21);

    ctx.restore();
  }

  function renderTimelineDiagram(ctx, diagram, boxX, boxY, boxW, boxH, theme) {
    var params = (diagram && diagram.params) || {};
    var events = Array.isArray(params.events)
      ? params.events
      : (Array.isArray(diagram && diagram.events) ? diagram.events : [
        { date: '1917', label: 'Центральна Рада' },
        { date: '1918', label: 'IV Універсал' },
        { date: '1919', label: 'Акт Злуки' }
      ]);

    var count = clamp(events.length, 2, 5);
    var axisY = boxY + Math.round(boxH * 0.56);
    var startX = boxX + 26;
    var endX = boxX + boxW - 22;

    ctx.save();
    ctx.strokeStyle = theme.axisInk;
    ctx.lineWidth = 1.75;
    ctx.beginPath();
    ctx.moveTo(startX, axisY);
    ctx.lineTo(endX, axisY);
    ctx.stroke();
    drawArrowHead(ctx, startX, axisY, endX, axisY, 6, theme.axisInk);

    var span = endX - startX - 24;
    for (var i = 0; i < count; i++) {
      var ev = events[i] || {};
      var tx = count === 1
        ? (startX + span / 2)
        : (startX + 16 + (i / (count - 1)) * (span - 24));
      var above = i % 2 === 0;
      var stemEndY = above ? (axisY - 26) : (axisY + 26);

      // Stem line
      ctx.strokeStyle = theme.borderStrong;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(tx, axisY);
      ctx.lineTo(tx, stemEndY);
      ctx.stroke();

      // Tick node
      ctx.fillStyle = theme.bg;
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(tx, axisY, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      var dateText = String(ev.date || ev.year || ('T' + (i + 1)));
      var labelText = String(ev.label || ev.title || '');
      if (labelText.length > 18) {
        labelText = labelText.slice(0, 17) + '..';
      }

      ctx.font = '700 10.5px ' + FONT_MONO;
      ctx.fillStyle = theme.accent;
      var dateW = ctx.measureText(dateText).width;
      ctx.font = '500 10px ' + FONT_SANS;
      var labelW = ctx.measureText(labelText).width;
      var pillW = Math.max(dateW, labelW) + 12;
      var pillX = clamp(tx - pillW / 2, boxX + 8, boxX + boxW - pillW - 8);
      var pillY = above ? (stemEndY - 32) : (stemEndY + 4);

      drawRoundedRect(ctx, pillX, pillY, pillW, 28, 5);
      ctx.fillStyle = theme.bg;
      ctx.fill();
      ctx.strokeStyle = theme.borderStrong;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.textBaseline = 'top';
      ctx.font = '700 10px ' + FONT_MONO;
      ctx.fillStyle = theme.accent;
      ctx.fillText(dateText, pillX + 6, pillY + 3);

      ctx.font = '500 9.5px ' + FONT_SANS;
      ctx.fillStyle = theme.primaryInk;
      ctx.fillText(labelText, pillX + 6, pillY + 15);
    }

    ctx.restore();
  }

  function renderDiagramBlock(ctx, diagram, x, y, width, height, theme) {
    var dType = String(diagram.type || diagram.kind || 'parabola').toLowerCase();

    ctx.save();
    drawRoundedRect(ctx, x, y, width, height, 8);
    ctx.fillStyle = theme.subtleBg;
    ctx.fill();
    ctx.strokeStyle = theme.borderStrong;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Micro technical label
    ctx.font = '600 9.5px ' + FONT_MONO;
    ctx.fillStyle = theme.mutedInk;
    ctx.textBaseline = 'top';
    ctx.fillText('SCHEMA · ' + dType.toUpperCase(), x + 10, y + 8);

    if (dType === 'parabola') {
      renderParabolaDiagram(ctx, diagram, x, y, width, height, theme);
    } else if (dType === 'triangle' || dType === 'right_triangle') {
      renderTriangleDiagram(ctx, diagram, x, y, width, height, theme);
    } else if (dType === 'circuit') {
      renderCircuitDiagram(ctx, diagram, x, y, width, height, theme);
    } else if (dType === 'timeline') {
      renderTimelineDiagram(ctx, diagram, x, y, width, height, theme);
    } else {
      renderParabolaDiagram(ctx, diagram, x, y, width, height, theme);
    }

    ctx.restore();
  }

  function computeDerivationLayout(ctx, steps, contentWidth) {
    var list = Array.isArray(steps) ? steps : [];
    var stepFont = '500 12.5px ' + FONT_SANS;
    var lineH = 17;
    var cardPadY = 9;
    var badgeSpace = 34;
    var cards = [];
    var totalH = 0;

    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      var text = '';
      if (typeof item === 'string') {
        text = item;
      } else if (item && typeof item === 'object') {
        var head = item.title ? (item.title + ': ') : '';
        text = head + (item.text || item.expression || item.formula || item.code || '');
      }
      var lines = wrapText(ctx, text, contentWidth - badgeSpace - 14, stepFont);
      if (lines.length === 0) {
        lines = ['-'];
      }
      var cardH = Math.max(36, lines.length * lineH + cardPadY * 2);
      cards.push({
        num: String((item && item.step) ? item.step : (i + 1)),
        lines: lines,
        height: cardH
      });
      totalH += cardH + (i < list.length - 1 ? 6 : 0);
    }

    return {
      font: stepFont,
      lineH: lineH,
      cardPadY: cardPadY,
      badgeSpace: badgeSpace,
      cards: cards,
      totalHeight: totalH
    };
  }

  function renderDerivationBlock(ctx, layout, x, y, width, theme) {
    var curY = y;
    for (var i = 0; i < layout.cards.length; i++) {
      var card = layout.cards[i];
      drawRoundedRect(ctx, x, curY, width, card.height, 7);
      ctx.fillStyle = theme.subtleBg;
      ctx.fill();
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Step number badge
      drawRoundedRect(ctx, x + 9, curY + 8, 20, 20, 5);
      ctx.fillStyle = theme.accentBg;
      ctx.fill();
      ctx.strokeStyle = theme.accentBorder;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '700 11px ' + FONT_MONO;
      ctx.fillStyle = theme.accent;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(card.num, x + 19, curY + 18);

      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = layout.font;
      ctx.fillStyle = theme.primaryInk;
      for (var l = 0; l < card.lines.length; l++) {
        ctx.fillText(card.lines[l], x + 36, curY + layout.cardPadY + l * layout.lineH);
      }

      curY += card.height + 6;
    }
  }

  function computeTrapRuleLayout(ctx, trapRule, contentWidth) {
    var title = 'УМОВА / ОПЕРАТОР';
    var ruleText = '';
    if (typeof trapRule === 'string') {
      ruleText = trapRule;
    } else if (trapRule && typeof trapRule === 'object') {
      title = String(trapRule.title || trapRule.operator || title);
      ruleText = String(trapRule.rule || trapRule.condition || trapRule.note || '');
    }
    var ruleFont = '500 12px ' + FONT_MONO;
    var lines = wrapText(ctx, ruleText, contentWidth - 26, ruleFont);
    var lineH = 16.5;
    var height = 28 + Math.max(1, lines.length) * lineH + 10;

    return {
      title: title,
      font: ruleFont,
      lines: lines,
      lineH: lineH,
      height: height
    };
  }

  function renderTrapRuleBlock(ctx, layout, x, y, width, theme) {
    ctx.save();
    drawRoundedRect(ctx, x, y, width, layout.height, 7);
    ctx.fillStyle = theme.accentBg;
    ctx.fill();
    ctx.strokeStyle = theme.accentBorder;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Left accent indicator bar
    drawRoundedRect(ctx, x, y, 3.5, layout.height, 2);
    ctx.fillStyle = theme.accent;
    ctx.fill();

    ctx.font = '700 9.5px ' + FONT_MONO;
    ctx.fillStyle = theme.accent;
    ctx.textBaseline = 'top';
    ctx.fillText(layout.title, x + 13, y + 9);

    ctx.font = layout.font;
    ctx.fillStyle = theme.primaryInk;
    for (var i = 0; i < layout.lines.length; i++) {
      ctx.fillText(layout.lines[i], x + 13, y + 26 + i * layout.lineH);
    }
    ctx.restore();
  }

  function drawAntiOcrLayer(ctx, width, height, sessionToken, seedKey, theme) {
    var rng = createRng(hashString(String(sessionToken || 'SESSION') + '|' + String(seedKey || 'Q')));
    var tokenLabel = 'STRICTAI · ' + String(sessionToken || 'LOCAL').slice(0, 18);

    ctx.save();

    // 1. Subtle low-alpha Bezier interference mesh
    ctx.strokeStyle = theme.meshStroke;
    ctx.lineWidth = 0.85;
    var curveCount = 8;
    for (var i = 0; i < curveCount; i++) {
      var y1 = rng() * height;
      var y2 = rng() * height;
      var cx1 = width * (0.2 + rng() * 0.3);
      var cy1 = rng() * height;
      var cx2 = width * (0.5 + rng() * 0.35);
      var cy2 = rng() * height;
      ctx.beginPath();
      ctx.moveTo(-8, y1);
      ctx.bezierCurveTo(cx1, cy1, cx2, cy2, width + 8, y2);
      ctx.stroke();
    }

    // 2. Micro noise speckles
    ctx.fillStyle = theme.meshStroke;
    for (var d = 0; d < 16; d++) {
      ctx.fillRect(Math.round(rng() * width), Math.round(rng() * height), 1.5, 1.5);
    }

    // 3. Diagonal faint repeating watermark
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-0.36);
    ctx.font = '600 10.5px ' + FONT_MONO;
    ctx.fillStyle = theme.watermarkInk;
    ctx.textBaseline = 'middle';
    var stepX = 185;
    var stepY = 74;
    for (var wy = -height; wy <= height; wy += stepY) {
      for (var wx = -width; wx <= width; wx += stepX) {
        ctx.fillText(tokenLabel, wx + ((wy / stepY) % 2 === 0 ? 0 : 65), wy);
      }
    }
    ctx.restore();

    ctx.restore();
  }

  function renderQuestionToCanvas(canvasEl, question, options) {
    if (!canvasEl || typeof canvasEl.getContext !== 'function') {
      return { width: 0, height: 0 };
    }

    var opts = options || {};
    var q = question || {};
    var themeName = opts.theme === 'dark' ? 'dark' : 'light';
    if (!opts.theme && typeof document !== 'undefined' && document.documentElement) {
      if (document.documentElement.getAttribute('data-theme') === 'dark') {
        themeName = 'dark';
      }
    }
    var theme = THEMES[themeName] || THEMES.light;

    var rawContainerW = (typeof opts.containerWidth === 'number' && opts.containerWidth > 0)
      ? opts.containerWidth
      : (canvasEl.parentElement && canvasEl.parentElement.clientWidth ? canvasEl.parentElement.clientWidth : 360);
    var logicalWidth = clamp(Math.round(rawContainerW), 320, 680);
    var scaleFactor = (typeof opts.scaleFactor === 'number' && opts.scaleFactor > 0)
      ? clamp(opts.scaleFactor, 0.75, 3)
      : 1;
    var dpr = (typeof window !== 'undefined' && window.devicePixelRatio)
      ? clamp(window.devicePixelRatio, 1, 3)
      : 1;

    var ctx = canvasEl.getContext('2d');
    if (!ctx) {
      return { width: 0, height: 0 };
    }

    // Pass 1: Measure layout in logical CSS pixels
    var padX = 16;
    var padTop = 16;
    var padBottom = 14;
    var contentWidth = logicalWidth - padX * 2;

    var formatText = String(q.formatLabel || q.format || 'ТЕСТ').toUpperCase();
    var topicText = String(q.topic || q.topicLabel || q.subjectLabel || 'НМТ').trim();

    ctx.font = '700 10px ' + FONT_MONO;
    var formatPillW = Math.min(contentWidth, Math.ceil(ctx.measureText(formatText).width) + 16);
    ctx.font = '500 10.5px ' + FONT_SANS;
    var topicPillW = topicText ? Math.min(contentWidth, Math.ceil(ctx.measureText(topicText).width) + 16) : 0;

    var pillsWrapped = topicPillW > 0 && (formatPillW + 8 + topicPillW > contentWidth);
    var headerHeight = pillsWrapped ? 50 : 24;

    var stemText = q.questionText || q.prompt || q.stem || q.text || '';
    var stemFont = (logicalWidth < 350 ? '600 14px ' : '600 15px ') + FONT_SANS;
    var stemLineH = logicalWidth < 350 ? 20 : 21.5;
    var stemLines = wrapText(ctx, stemText, contentWidth, stemFont);
    var stemHeight = stemLines.length * stemLineH;

    var curHeight = padTop + headerHeight + 10 + 1 + 12 + stemHeight;

    var table = normalizeTableData(q.tableData);
    var tableLayout = table ? computeTableLayout(ctx, table, contentWidth) : null;
    if (tableLayout) {
      curHeight += 12 + tableLayout.totalHeight;
    }

    var hasDiagram = Boolean(q.diagram && typeof q.diagram === 'object');
    var diagramH = 186;
    if (hasDiagram) {
      curHeight += 12 + diagramH;
    }

    var hasSteps = Array.isArray(q.derivationSteps) && q.derivationSteps.length > 0;
    var stepsLayout = hasSteps ? computeDerivationLayout(ctx, q.derivationSteps, contentWidth) : null;
    if (stepsLayout) {
      curHeight += 12 + stepsLayout.totalHeight;
    }

    var hasTrapRule = Boolean(q.trapRule);
    var trapLayout = hasTrapRule ? computeTrapRuleLayout(ctx, q.trapRule, contentWidth) : null;
    if (trapLayout) {
      curHeight += 12 + trapLayout.height;
    }

    // Footer anti-OCR line
    curHeight += 14 + 14 + padBottom;
    var logicalHeight = Math.ceil(curHeight);

    // Pass 2: Resize backing store cleanly for Retina & scaleFactor
    var effectiveScale = dpr * scaleFactor;
    canvasEl.width = Math.round(logicalWidth * effectiveScale);
    canvasEl.height = Math.round(logicalHeight * effectiveScale);

    if (scaleFactor !== 1) {
      canvasEl.style.width = Math.round(logicalWidth * scaleFactor) + 'px';
      canvasEl.style.height = Math.round(logicalHeight * scaleFactor) + 'px';
    } else {
      canvasEl.style.width = '100%';
      canvasEl.style.height = 'auto';
    }

    ctx.setTransform(effectiveScale, 0, 0, effectiveScale, 0, 0);

    // Background
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, logicalWidth, logicalHeight);

    var y = padTop;

    // Header Pills
    drawRoundedRect(ctx, padX, y, formatPillW, 22, 5);
    ctx.fillStyle = theme.accentBg;
    ctx.fill();
    ctx.strokeStyle = theme.accentBorder;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = '700 10px ' + FONT_MONO;
    ctx.fillStyle = theme.accent;
    ctx.textBaseline = 'middle';
    ctx.fillText(formatText, padX + 8, y + 11, formatPillW - 14);

    if (topicText) {
      var tx = pillsWrapped ? padX : (padX + formatPillW + 8);
      var ty = pillsWrapped ? (y + 26) : y;
      drawRoundedRect(ctx, tx, ty, topicPillW, 22, 5);
      ctx.fillStyle = theme.subtleBg;
      ctx.fill();
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '500 10.5px ' + FONT_SANS;
      ctx.fillStyle = theme.secondaryInk;
      ctx.fillText(topicText, tx + 8, ty + 11, topicPillW - 14);
    }

    y += headerHeight + 10;

    // Divider hairline
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padX, y + 0.5);
    ctx.lineTo(logicalWidth - padX, y + 0.5);
    ctx.stroke();
    y += 13;

    // Question Stem
    ctx.font = stemFont;
    ctx.fillStyle = theme.primaryInk;
    ctx.textBaseline = 'top';
    for (var sl = 0; sl < stemLines.length; sl++) {
      ctx.fillText(stemLines[sl], padX, y + sl * stemLineH);
    }
    y += stemHeight;

    // Visual Blocks
    if (tableLayout) {
      y += 12;
      renderTableBlock(ctx, table, tableLayout, padX, y, contentWidth, theme);
      y += tableLayout.totalHeight;
    }

    if (hasDiagram) {
      y += 12;
      renderDiagramBlock(ctx, q.diagram, padX, y, contentWidth, diagramH, theme);
      y += diagramH;
    }

    if (stepsLayout) {
      y += 12;
      renderDerivationBlock(ctx, stepsLayout, padX, y, contentWidth, theme);
      y += stepsLayout.totalHeight;
    }

    if (trapLayout) {
      y += 12;
      renderTrapRuleBlock(ctx, trapLayout, padX, y, contentWidth, theme);
      y += trapLayout.height;
    }

    // Footer status strip
    y += 14;
    ctx.font = '500 9.5px ' + FONT_MONO;
    ctx.fillStyle = theme.mutedInk;
    ctx.textBaseline = 'top';
    var sessionShort = String(opts.sessionToken || 'LOCAL').slice(0, 14);
    ctx.fillText('ANTI-OCR CANVAS · ' + sessionShort, padX, y);

    // Anti-OCR protection mesh & diagonal watermark
    drawAntiOcrLayer(ctx, logicalWidth, logicalHeight, opts.sessionToken, q.id || stemText, theme);

    return {
      width: Math.round(logicalWidth * scaleFactor),
      height: Math.round(logicalHeight * scaleFactor)
    };
  }

  /* ========================================================================
     Ranked Exam Guard & Biometrics Engine
     ======================================================================== */

  function sanitizeStringList(list, maxItems, maxLen) {
    var out = [];
    if (!Array.isArray(list)) {
      return out;
    }
    for (var i = 0; i < list.length; i++) {
      var s = String(list[i] || '').trim();
      if (!s) {
        continue;
      }
      if (s.length > maxLen) {
        s = s.slice(0, maxLen);
      }
      out.push(s);
    }
    if (out.length > maxItems) {
      out = out.slice(out.length - maxItems);
    }
    return out;
  }

  function inspectNodeForExtension(node) {
    if (!node || node.nodeType !== 1) {
      return null;
    }
    if (typeof node.hasAttribute === 'function' && node.hasAttribute('data-strict-sim-extension')) {
      return 'data-strict-sim-extension';
    }

    var idStr = (node.id ? String(node.id) : '').toLowerCase();
    var classStr = (typeof node.className === 'string' ? node.className : '').toLowerCase();
    var tagStr = (node.tagName ? String(node.tagName) : '').toLowerCase();
    var combined = idStr + ' ' + classStr + ' ' + tagStr;

    for (var i = 0; i < EXTENSION_SIGNATURES.length; i++) {
      var sig = EXTENSION_SIGNATURES[i];
      if (combined.indexOf(sig) !== -1) {
        return sig;
      }
    }

    if (typeof node.querySelector === 'function') {
      var probeChild = node.querySelector('[data-strict-sim-extension]');
      if (probeChild) {
        return 'data-strict-sim-extension';
      }
    }

    return null;
  }

  function createExamGuard(callbacks) {
    var cb = callbacks || {};
    var active = false;
    var observer = null;

    var state = {
      sessionStartAt: 0,
      questionStartAt: 0,
      questionFirstInputAt: 0,
      firstClickSeconds: null,
      pointerDistance: 0,
      questionPointerDistance: 0,
      pointerSamples: 0,
      questionPointerSamples: 0,
      pointerInflections: 0,
      lastPointer: null,
      lastVectorAngle: null,
      keyTimestamps: [],
      pasteDetected: false,
      automationFlag: false,
      automationReasons: [],
      auditLog: [],
      tabBlurCount: 0,
      focusLossCount: 0,
      appSwitchCount: 0,
      strikeCount: 0,
      extensionDetected: false,
      copyAttempts: 0,
      lastBlurSource: null,
      lastBlurAt: 0,
      suppressProbeObserver: false
    };

    function pushAudit(entry) {
      var msg = String(entry || '').trim();
      if (!msg) {
        return;
      }
      if (msg.length > 200) {
        msg = msg.slice(0, 200);
      }
      state.auditLog.push(msg);
      if (state.auditLog.length > 20) {
        state.auditLog = state.auditLog.slice(state.auditLog.length - 20);
      }
    }

    function pushAutomationReason(reason) {
      var msg = String(reason || '').trim();
      if (!msg) {
        return;
      }
      if (msg.length > 200) {
        msg = msg.slice(0, 200);
      }
      if (state.automationReasons.indexOf(msg) === -1) {
        state.automationReasons.push(msg);
        if (state.automationReasons.length > 20) {
          state.automationReasons = state.automationReasons.slice(state.automationReasons.length - 20);
        }
      }
    }

    function computeEntropy() {
      if (state.pointerSamples < 2 && state.pointerDistance <= 0) {
        return 0;
      }
      var inflectionRatio = state.pointerSamples > 0
        ? (state.pointerInflections / Math.max(1, state.pointerSamples))
        : 0;
      var distComponent = Math.min(45, Math.sqrt(state.pointerDistance) * 1.4);
      var inflectionComponent = Math.min(40, state.pointerInflections * 4.5 + inflectionRatio * 20);
      var sampleComponent = Math.min(15, state.pointerSamples * 0.5);
      return Math.round(clamp(distComponent + inflectionComponent + sampleComponent, 0, 100) * 10) / 10;
    }

    function computeWpm() {
      if (state.keyTimestamps.length < 2) {
        return 0;
      }
      var first = state.keyTimestamps[0];
      var last = state.keyTimestamps[state.keyTimestamps.length - 1];
      var mins = Math.max(0.05, (last - first) / 60000);
      var rawWpm = (state.keyTimestamps.length / 5) / mins;
      return Math.round(clamp(rawWpm, 0, 500) * 10) / 10;
    }

    function computeTrustScore() {
      var score = 100;
      score -= Math.min(45, state.strikeCount * 18);
      if (state.pasteDetected) {
        score -= 12;
      }
      score -= Math.min(20, state.copyAttempts * 5);
      if (state.automationFlag) {
        score -= 25;
      }
      if (state.extensionDetected) {
        score -= 30;
      }
      return Math.round(clamp(score, 0, 100));
    }

    function computeTrustRating(score) {
      if (score >= 85) {
        return 'Verified';
      }
      if (score >= 60) {
        return 'Supervised';
      }
      if (score >= 35) {
        return 'Review Required';
      }
      return 'Flagged';
    }

    function getMetrics() {
      var now = Date.now();
      var elapsed = state.sessionStartAt > 0
        ? Math.round(clamp((now - state.sessionStartAt) / 1000, 0, 86400) * 10) / 10
        : 0;
      var entropy = computeEntropy();
      var trustScore = computeTrustScore();
      var trustRating = computeTrustRating(trustScore);

      return {
        elapsedSeconds: elapsed,
        timeToFirstClick: state.firstClickSeconds === null
          ? null
          : clamp(Number(state.firstClickSeconds), 0, 86400),
        mouseEntropy: entropy,
        mouseDistance: Math.round(clamp(state.pointerDistance, 0, 10000000)),
        mouseInflections: Math.round(clamp(state.pointerInflections, 0, 1000000)),
        wpm: computeWpm(),
        pasteDetected: Boolean(state.pasteDetected),
        automationFlag: Boolean(state.automationFlag),
        automationReasons: sanitizeStringList(state.automationReasons, 20, 200),
        trustScore: trustScore,
        trustRating: String(trustRating).slice(0, 64),
        auditLog: sanitizeStringList(state.auditLog, 20, 200),
        tabBlurCount: Math.round(clamp(state.tabBlurCount, 0, 10000)),
        focusLossCount: Math.round(clamp(state.focusLossCount, 0, 10000)),
        appSwitchCount: Math.round(clamp(state.appSwitchCount, 0, 10000)),
        strikeCount: Math.round(clamp(state.strikeCount, 0, 1000)),
        extensionDetected: Boolean(state.extensionDetected),
        copyAttempts: Math.round(clamp(state.copyAttempts, 0, 10000))
      };
    }

    function emitBiometrics() {
      if (typeof cb.onBiometricsUpdate === 'function') {
        cb.onBiometricsUpdate(getMetrics());
      }
    }

    function handleFocusLoss(source) {
      if (!active) {
        return;
      }
      var now = Date.now();
      // Coalesce paired browser blur + visibilitychange firing together within 250ms
      if (state.lastBlurSource && state.lastBlurSource !== source && (now - state.lastBlurAt) < 250) {
        return;
      }
      state.lastBlurSource = source;
      state.lastBlurAt = now;

      state.tabBlurCount += 1;
      state.focusLossCount += 1;
      state.appSwitchCount += 1;
      state.strikeCount += 1;

      if (state.strikeCount === 1) {
        var warnMsg = 'Попередження 1/2: зафіксовано втрату фокусу. Наступний вихід анулює питання.';
        pushAudit('Strike 1/2: tab blur / focus loss (' + source + ')');
        if (typeof cb.onWarning === 'function') {
          cb.onWarning({
            strike: 1,
            tabBlurCount: state.tabBlurCount,
            focusLossCount: state.focusLossCount,
            message: warnMsg
          });
        }
      } else {
        var forfeitMsg = 'Анулювання питання (Strike ' + state.strikeCount + '/2): повторна втрата фокусу вкладки.';
        pushAudit('Strike ' + state.strikeCount + '/2: question forfeited on ' + source);
        if (typeof cb.onForfeitQuestion === 'function') {
          cb.onForfeitQuestion({
            strike: state.strikeCount,
            tabBlurCount: state.tabBlurCount,
            focusLossCount: state.focusLossCount,
            message: forfeitMsg
          });
        }
      }

      emitBiometrics();
    }

    function onVisibilityChange() {
      if (typeof document !== 'undefined' && document.hidden) {
        handleFocusLoss('visibilitychange');
      }
    }

    function onWindowBlur() {
      handleFocusLoss('window.blur');
    }

    function onCopyOrCut(evt) {
      if (!active) {
        return;
      }
      if (evt && typeof evt.preventDefault === 'function') {
        evt.preventDefault();
      }
      state.copyAttempts += 1;
      pushAudit('Blocked clipboard ' + (evt && evt.type ? evt.type : 'copy') + ' attempt');
      emitBiometrics();
    }

    function onPaste(evt) {
      if (!active) {
        return;
      }
      if (evt && typeof evt.preventDefault === 'function') {
        evt.preventDefault();
      }
      state.pasteDetected = true;
      pushAudit('Blocked clipboard paste attempt');
      emitBiometrics();
    }

    function onContextMenu(evt) {
      if (!active) {
        return;
      }
      if (evt && typeof evt.preventDefault === 'function') {
        evt.preventDefault();
      }
    }

    function recordPointerSample(clientX, clientY, isTap) {
      if (!active) {
        return;
      }
      var now = Date.now();
      if (!state.questionFirstInputAt) {
        state.questionFirstInputAt = now;
      }

      var x = typeof clientX === 'number' ? clientX : 0;
      var y = typeof clientY === 'number' ? clientY : 0;
      state.pointerSamples += 1;
      state.questionPointerSamples += 1;

      if (state.lastPointer) {
        var dx = x - state.lastPointer.x;
        var dy = y - state.lastPointer.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.5 && dist < 4000) {
          state.pointerDistance += dist;
          state.questionPointerDistance += dist;
          var angle = Math.atan2(dy, dx);
          if (state.lastVectorAngle !== null) {
            var diff = Math.abs(angle - state.lastVectorAngle);
            if (diff > Math.PI) {
              diff = Math.PI * 2 - diff;
            }
            if (diff > 0.42 && dist > 2) {
              state.pointerInflections += 1;
            }
          }
          state.lastVectorAngle = angle;
        }
      } else if (isTap) {
        state.pointerInflections += 1;
      }

      state.lastPointer = { x: x, y: y, t: now };
    }

    function onPointerDown(evt) {
      recordPointerSample(evt ? evt.clientX : 0, evt ? evt.clientY : 0, true);
    }

    function onPointerMove(evt) {
      recordPointerSample(evt ? evt.clientX : 0, evt ? evt.clientY : 0, false);
    }

    function onTouchStart(evt) {
      var touch = evt && evt.touches && evt.touches[0];
      recordPointerSample(touch ? touch.clientX : 0, touch ? touch.clientY : 0, true);
    }

    function onKeyDown(evt) {
      if (!active) {
        return;
      }
      var now = Date.now();
      if (!state.questionFirstInputAt) {
        state.questionFirstInputAt = now;
      }
      state.keyTimestamps.push(now);
      if (state.keyTimestamps.length > 60) {
        state.keyTimestamps.shift();
      }

      if (evt && (evt.ctrlKey || evt.metaKey)) {
        var k = String(evt.key || '').toLowerCase();
        if (k === 'c' || k === 'x') {
          if (typeof evt.preventDefault === 'function') {
            evt.preventDefault();
          }
          state.copyAttempts += 1;
          pushAudit('Blocked keyboard copy shortcut');
          emitBiometrics();
        } else if (k === 'v') {
          if (typeof evt.preventDefault === 'function') {
            evt.preventDefault();
          }
          state.pasteDetected = true;
          pushAudit('Blocked keyboard paste shortcut');
          emitBiometrics();
        }
      }
    }

    function handleMutations(mutations) {
      if (!active || state.suppressProbeObserver) {
        return;
      }
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === 'attributes' && m.target) {
          var attrSig = inspectNodeForExtension(m.target);
          if (attrSig) {
            triggerRealExtensionDetected(m.target, attrSig);
          }
        }
        if (m.addedNodes && m.addedNodes.length) {
          for (var j = 0; j < m.addedNodes.length; j++) {
            var added = m.addedNodes[j];
            var sig = inspectNodeForExtension(added);
            if (sig) {
              triggerRealExtensionDetected(added, sig);
            }
          }
        }
      }
    }

    function triggerRealExtensionDetected(node, signature) {
      if (node && node.parentNode) {
        try {
          node.parentNode.removeChild(node);
        } catch (err) {}
      }
      state.extensionDetected = true;
      pushAudit('AI-extension signature blocked: ' + signature);
      if (typeof cb.onExtensionDetected === 'function') {
        cb.onExtensionDetected({
          detected: true,
          blocked: true,
          simulated: false,
          signature: signature,
          timestamp: Date.now()
        });
      }
      emitBiometrics();
    }

    function start() {
      if (active) {
        return;
      }
      active = true;
      var now = Date.now();
      if (!state.sessionStartAt) {
        state.sessionStartAt = now;
      }
      if (!state.questionStartAt) {
        state.questionStartAt = now;
      }
      pushAudit('Exam guard started (2-strike + DOM shield active)');

      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', onVisibilityChange);
        document.addEventListener('copy', onCopyOrCut);
        document.addEventListener('cut', onCopyOrCut);
        document.addEventListener('paste', onPaste);
        document.addEventListener('contextmenu', onContextMenu);
        document.addEventListener('pointerdown', onPointerDown, true);
        document.addEventListener('pointermove', onPointerMove, true);
        document.addEventListener('touchstart', onTouchStart, { passive: true, capture: true });
        document.addEventListener('keydown', onKeyDown, true);

        if (typeof MutationObserver === 'function' && document.documentElement) {
          observer = new MutationObserver(handleMutations);
          observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['id', 'class', 'data-strict-sim-extension']
          });
        }
      }

      if (typeof window !== 'undefined') {
        window.addEventListener('blur', onWindowBlur);
      }

      emitBiometrics();
    }

    function stop() {
      if (!active) {
        return;
      }
      active = false;

      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisibilityChange);
        document.removeEventListener('copy', onCopyOrCut);
        document.removeEventListener('cut', onCopyOrCut);
        document.removeEventListener('paste', onPaste);
        document.removeEventListener('contextmenu', onContextMenu);
        document.removeEventListener('pointerdown', onPointerDown, true);
        document.removeEventListener('pointermove', onPointerMove, true);
        document.removeEventListener('touchstart', onTouchStart, true);
        document.removeEventListener('keydown', onKeyDown, true);
      }

      if (typeof window !== 'undefined') {
        window.removeEventListener('blur', onWindowBlur);
      }

      if (observer) {
        observer.disconnect();
        observer = null;
      }

      pushAudit('Exam guard stopped cleanly');
    }

    function markQuestionStart() {
      state.questionStartAt = Date.now();
      state.questionFirstInputAt = 0;
      state.questionPointerDistance = 0;
      state.questionPointerSamples = 0;
    }

    function recordAnswerTiming(questionId) {
      var now = Date.now();
      var startAt = state.questionStartAt || state.sessionStartAt || now;
      var submitMs = Math.max(0, now - startAt);
      var firstClickMs = state.questionFirstInputAt
        ? Math.max(0, state.questionFirstInputAt - startAt)
        : submitMs;

      state.firstClickSeconds = Math.round(clamp(firstClickMs / 1000, 0, 86400) * 100) / 100;

      var entropy = computeEntropy();
      if (submitMs < 800 && (entropy === 0 || state.questionPointerDistance < 4)) {
        state.automationFlag = true;
        var qTag = questionId ? (' [' + String(questionId).slice(0, 24) + ']') : '';
        pushAutomationReason('Fast submission (' + submitMs + 'ms) with zero pointer entropy' + qTag);
        pushAudit('Automation signal: ' + submitMs + 'ms answer without pointer entropy');
      }

      emitBiometrics();
      return getMetrics();
    }

    function simulateExtensionCheck() {
      var ts = Date.now();
      var signature = 'data-strict-sim-extension';
      var detected = false;
      var blocked = false;

      if (typeof document !== 'undefined' && document.body) {
        state.suppressProbeObserver = true;
        var probe = document.createElement('div');
        probe.setAttribute('data-strict-sim-extension', 'true');
        probe.style.display = 'none';
        document.body.appendChild(probe);

        var matchedSig = inspectNodeForExtension(probe);
        if (matchedSig) {
          detected = true;
          signature = matchedSig;
        }
        if (observer && typeof observer.takeRecords === 'function') {
          observer.takeRecords();
        }
        if (probe.parentNode) {
          probe.parentNode.removeChild(probe);
          blocked = true;
        }
        state.suppressProbeObserver = false;
      } else {
        detected = true;
        blocked = true;
      }

      pushAudit('AI-extension DOM shield verified (probe blocked)');

      var payload = {
        detected: detected,
        blocked: blocked,
        simulated: true,
        signature: signature,
        timestamp: ts
      };

      if (typeof cb.onExtensionDetected === 'function') {
        cb.onExtensionDetected(payload);
      }
      emitBiometrics();

      return {
        detected: detected,
        blocked: blocked,
        signature: signature,
        timestamp: ts
      };
    }

    return {
      start: start,
      stop: stop,
      markQuestionStart: markQuestionStart,
      recordAnswerTiming: recordAnswerTiming,
      simulateExtensionCheck: simulateExtensionCheck,
      getMetrics: getMetrics
    };
  }

  return {
    renderQuestionToCanvas: renderQuestionToCanvas,
    createExamGuard: createExamGuard,
    EXTENSION_SIGNATURES: EXTENSION_SIGNATURES.slice()
  };
});
