/* ==========================================================================
   Dashboard KPI — Gerencia Financiera — Riesgo y Recupero
   ========================================================================== */
'use strict';

// ─── CONFIGURATION ────────────────────────────────────────────────────────────
// Para cambiar la fuente de datos, editá SHEET_ID y GID.
// La hoja debe estar compartida como "Cualquiera con el link puede ver"
// Y publicada en la web (Archivo > Compartir > Publicar en la web).
const SHEET_ID = '1AUAE_-pAigMcUgBxUFmoBm6PteJtu0Rs';
const GID = '724187878';

const DATA_URLS = [
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vS356Ye1eHrMv9gPSoOfpRPkNSEWwL7gAvIuC2H750udIcJNqayaGxzxSmBOvhLqg/pub?gid=724187878&single=true&output=csv',
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`
];

// Umbrales de semáforo: [verde, amarillo]. Si higherIsBetter=true → >=verde=verde, >=amarillo=amarillo, else rojo.
// Los valores están en la misma escala que los datos (decimales para %, enteros para cantidades).
const CATEGORIES = [
  {
    id: 'cobranza', name: 'Cobranza', icon: 'C',
    kpis: [
      { name: 'Cobranza TC mes sin PP',      col: 1,  fmt: 'pct', up: true,  th: [0.85, 0.70] },
      { name: 'Cobranza TC mes con PP',       col: 2,  fmt: 'pct', up: true,  th: [0.90, 0.75] },
      { name: 'Cobranza del mes total',       col: 3,  fmt: 'pct', up: true,  th: [0.90, 0.75], hero: true },
      { name: 'Cobranza TC 90 días sin PP',   col: 4,  fmt: 'pct', up: true,  th: [0.85, 0.70] },
      { name: 'Cobranza TC 90 días con PP',   col: 5,  fmt: 'pct', up: true,  th: [0.90, 0.75] },
      { name: 'Cobranza 90 días total',       col: 6,  fmt: 'pct', up: true,  th: [0.90, 0.75] },
    ]
  },
  {
    id: 'morosidad', name: 'Morosidad', icon: 'M',
    kpis: [
      { name: 'Morosidad 1-60d Montos TC',       col: 7,  fmt: 'pct', up: false, th: [0.05, 0.10] },
      { name: 'Morosidad 1-60d Q casos TC',       col: 8,  fmt: 'pct', up: false, th: [0.05, 0.10] },
      { name: 'Morosidad +60d Montos TC',          col: 9,  fmt: 'pct', up: false, th: [0.03, 0.06], hero: true },
      { name: 'Morosidad +60d Q casos TC',          col: 10, fmt: 'pct', up: false, th: [0.03, 0.06] },
      { name: 'Morosidad 1-60d Montos Prést.',     col: 11, fmt: 'pct', up: false, th: [0.05, 0.10] },
      { name: 'Morosidad 1-60d Q casos Prést.',     col: 12, fmt: 'pct', up: false, th: [0.05, 0.10] },
      { name: 'Morosidad +60d Montos Prést.',       col: 13, fmt: 'pct', up: false, th: [0.03, 0.06] },
      { name: 'Morosidad +60d Q casos Prést.',       col: 14, fmt: 'pct', up: false, th: [0.03, 0.06] },
    ]
  },
  {
    id: 'cuentas', name: 'Cuentas y Cartera', icon: 'CC',
    kpis: [
      { name: 'Cuentas inhabilitadas o DV',  col: 15, fmt: 'int',   up: false, th: [500, 1000] },
      { name: 'Cuentas habilitadas',          col: 16, fmt: 'int',   up: true,  th: [10000, 5000] },
      { name: 'Cuentas totales',              col: 17, fmt: 'int',   up: true,  th: [15000, 8000] },
      { name: 'Ratio IH sobre totales',       col: 18, fmt: 'pct',  up: false, th: [0.05, 0.10], hero: true },
      { name: 'Q clientes que pasan a AB',    col: 19, fmt: 'int',   up: false, th: [50, 100] },
      { name: 'Monto que pasa a AB',          col: 20, fmt: 'money', up: false, th: [5000000, 15000000] },
      { name: 'Q de refinanciaciones',        col: 21, fmt: 'int',   up: null,  th: null },
      { name: 'Score Veraz promedio',          col: 24, fmt: 'num',   up: true,  th: [600, 500] },
    ]
  },
  {
    id: 'rollrates', name: 'Roll Rates', icon: 'RR',
    kpis: [
      { name: 'RR 1-30 Préstamos',              col: 25, fmt: 'pct', up: false, th: [0.10, 0.20] },
      { name: 'RR 1-30 TC',                     col: 26, fmt: 'pct', up: false, th: [0.10, 0.20] },
      { name: 'RR 1-30 Total',                  col: 29, fmt: 'pct', up: false, th: [0.10, 0.20], hero: true },
      { name: 'RR Directo 90-120d Préstamos',   col: 27, fmt: 'pct', up: false, th: [0.05, 0.15] },
      { name: 'RR Directo 90-120d TC',           col: 28, fmt: 'pct', up: false, th: [0.05, 0.15] },
      { name: 'RR Directo 90-120d Total',        col: 30, fmt: 'pct', up: false, th: [0.05, 0.15] },
    ]
  },
  {
    id: 'vintage', name: 'Vintage', icon: 'V',
    kpis: [
      { name: 'Vintage >90 prést. a 6 meses',   col: 31, fmt: 'pct', up: false, th: [0.03, 0.06], hero: true },
      { name: 'Vintage >90 prést. a 12 meses',  col: 32, fmt: 'pct', up: false, th: [0.05, 0.10] },
    ]
  },
  {
    id: 'originacion', name: 'Originación (SIISA)', icon: 'O',
    kpis: [
      { name: 'N° Solicitantes General',           col: 33, fmt: 'int', up: true,  th: [1000, 500] },
      { name: 'Tasa Aprobación General',            col: 34, fmt: 'pct', up: true,  th: [0.50, 0.35], hero: true },
      { name: 'Tasa Rechazo General',               col: 35, fmt: 'pct', up: false, th: [0.40, 0.60] },
      { name: 'N° Solicitantes Tarjeta',            col: 36, fmt: 'int', up: true,  th: [500, 250] },
      { name: 'Tasa Aprobación Tarjeta',             col: 37, fmt: 'pct', up: true,  th: [0.50, 0.35] },
      { name: 'Tasa Rechazo Tarjeta',                col: 38, fmt: 'pct', up: false, th: [0.40, 0.60] },
      { name: 'N° Solicitantes Préstamo',           col: 39, fmt: 'int', up: true,  th: [500, 250] },
      { name: 'Tasa Aprobación Préstamo',            col: 40, fmt: 'pct', up: true,  th: [0.50, 0.35] },
      { name: 'Tasa Rechazo Préstamo',               col: 41, fmt: 'pct', up: false, th: [0.40, 0.60] },
      { name: 'Rechazos Política Zonas Prést.',     col: 42, fmt: 'int', up: false, th: [20, 50] },
    ]
  }
];

const CHART_COLORS = [
  '#CC0000','#ef4444','#f97316','#eab308','#22c55e',
  '#06b6d4','#8b5cf6','#ec4899','#f43f5e','#a3e635'
];

const MONTHS_ES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

// ─── STATE ────────────────────────────────────────────────────────────────────
const state = {
  raw: [],
  filtered: [],
  tab: 'home',
  charts: []
};

// ─── DATA LAYER ───────────────────────────────────────────────────────────────
async function fetchData() {
  let lastErr;
  for (const url of DATA_URLS) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (text.startsWith('<!')) throw new Error('HTML response (posiblemente requiere publicar la hoja)');
      return parseCSV(text);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

function parseCSV(text) {
  const lines = text.replace(/\r/g, '').split('\n');
  const rows = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const cells = [];
    let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (ch === ',' && !inQ) {
        cells.push(cur); cur = '';
      } else {
        cur += ch;
      }
    }
    cells.push(cur);
    rows.push(cells);
  }
  if (rows.length < 2) return [];

  const header = rows[0];
  const data = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r[0] || !r[0].trim()) continue;
    const date = parseDate(r[0].trim());
    if (!date) continue;
    const vals = {};
    for (let c = 1; c < r.length; c++) {
      let raw = r[c] ? r[c].trim().replace(/"/g, '') : '';
      if (raw === '' || raw === '-' || raw === '#N/A' || raw === '#¡REF!') {
        vals[c] = null;
      } else if (raw.endsWith('%')) {
        const n = parseFloat(raw.slice(0, -1).replace(/,/g, ''));
        vals[c] = isNaN(n) ? null : n / 100;
      } else {
        const cleaned = raw.replace(/^\$\s*/, '').replace(/,/g, '').trim();
        const n = parseFloat(cleaned);
        vals[c] = isNaN(n) ? null : n;
      }
    }
    data.push({ date, vals, label: fmtDate(date) });
  }
  data.sort((a, b) => a.date - b.date);

  // Auto-normalización: si una columna de % tiene mediana > 1.5, los valores
  // vienen como 84.48 en vez de 0.8448 → dividir por 100.
  const pctCols = new Set();
  for (const cat of CATEGORIES) {
    for (const kpi of cat.kpis) {
      if (kpi.fmt === 'pct') pctCols.add(kpi.col);
    }
  }
  for (const col of pctCols) {
    const colVals = data.map(d => d.vals[col]).filter(v => v !== null);
    if (!colVals.length) continue;
    const sorted = [...colVals].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    if (median > 1.5) {
      data.forEach(d => { if (d.vals[col] !== null) d.vals[col] /= 100; });
    }
  }

  return data;
}

function parseDate(raw) {
  // MM-YYYY
  let m = raw.match(/^(\d{1,2})-(\d{4})$/);
  if (m) return new Date(+m[2], +m[1] - 1, 1);
  // YYYY-MM
  m = raw.match(/^(\d{4})-(\d{1,2})$/);
  if (m) return new Date(+m[1], +m[2] - 1, 1);
  // YYYY-MM-DD or similar
  m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return new Date(+m[1], +m[2] - 1, 1);
  // DD/MM/YYYY
  m = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return new Date(+m[3], +m[2] - 1, 1);
  // Excel serial number
  const num = parseFloat(raw);
  if (!isNaN(num) && num > 30000 && num < 60000) {
    const d = new Date((num - 25569) * 86400000);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }
  // Month name formats (ene-24, may-2024)
  const monthMap = { ene:0,feb:1,mar:2,abr:3,may:4,jun:5,jul:6,ago:7,sep:8,oct:9,nov:10,dic:11,
                     jan:0,apr:3,aug:7,dec:11 };
  m = raw.match(/^([a-záéíóú]+)-?(\d{2,4})$/i);
  if (m) {
    const mi = monthMap[m[1].toLowerCase().substring(0,3)];
    if (mi !== undefined) {
      let y = +m[2]; if (y < 100) y += 2000;
      return new Date(y, mi, 1);
    }
  }
  return null;
}

// ─── FORMAT HELPERS ───────────────────────────────────────────────────────────
function fmtDate(d) {
  return MONTHS_ES[d.getMonth()] + '-' + String(d.getFullYear()).slice(2);
}

function fmtDateLong(d) {
  const m = MONTHS_ES[d.getMonth()];
  return m.charAt(0).toUpperCase() + m.slice(1) + ' ' + d.getFullYear();
}

function fmtVal(v, fmt) {
  if (v === null || v === undefined || isNaN(v)) return 's/d';
  switch (fmt) {
    case 'pct': return (v * 100).toFixed(1) + '%';
    case 'money': return '$' + Math.round(v).toLocaleString('es-AR');
    case 'int': return Math.round(v).toLocaleString('es-AR');
    case 'num': return v.toLocaleString('es-AR', { maximumFractionDigits: 1 });
    default: return String(v);
  }
}

// Para KPIs de porcentaje devuelve diferencia absoluta (pp); para el resto, variación relativa.
function getDelta(curr, prev, fmt) {
  if (curr === null || prev === null) return null;
  if (fmt === 'pct') return curr - prev; // ej: 0.8301 - 0.8202 = 0.0099 → se muestra como +0.99pp
  if (prev === 0) return null;
  return (curr - prev) / Math.abs(prev); // variación relativa para enteros/montos
}

function semaphore(val, kpi) {
  if (val === null || !kpi.th) return 'gray';
  const [g, y] = kpi.th;
  if (kpi.up) {
    if (val >= g) return 'green';
    if (val >= y) return 'yellow';
    return 'red';
  } else {
    if (val <= g) return 'green';
    if (val <= y) return 'yellow';
    return 'red';
  }
}

function deltaClass(delta, higherIsBetter) {
  if (delta === null) return 'neutral';
  if (higherIsBetter === null) return 'neutral';
  if (higherIsBetter) return delta >= 0 ? 'positive' : 'negative';
  return delta <= 0 ? 'positive' : 'negative';
}

function deltaArrow(delta) {
  if (delta === null) return '';
  return delta >= 0 ? '▲' : '▼';
}

// ─── RENDERING: HOME ─────────────────────────────────────────────────────────
function renderHome() {
  const data = state.filtered;
  if (!data.length) { el('content').innerHTML = '<div class="no-data">No hay datos disponibles.</div>'; return; }

  let html = '<div class="home-grid">';
  for (const cat of CATEGORIES) {
    const hero = cat.kpis.find(k => k.hero) || cat.kpis[0];
    const last = getLastVal(data, hero.col);
    const prev = getPrevVal(data, hero.col);
    const yoy  = getYoYVal(data, hero.col);
    const sm   = semaphore(last, hero);
    const dM   = getDelta(last, prev, hero.fmt);
    const dY   = getDelta(last, yoy, hero.fmt);
    const spark = getLast12(data, hero.col);

    html += `
      <div class="summary-card" data-tab="${cat.id}">
        <div class="cat-label">${cat.name}</div>
        <div class="kpi-card-header">
          <div class="kpi-name">${hero.name}</div>
          <div class="semaphore ${sm}" title="Semáforo: verde=OK, amarillo=precaución, rojo=alerta"></div>
        </div>
        <div class="kpi-value">${fmtVal(last, hero.fmt)}</div>
        <div class="kpi-deltas">
          ${deltaTag(dM, hero.up, 'm/m', hero.fmt)}
          ${deltaTag(dY, hero.up, 'a/a', hero.fmt)}
        </div>
        <div class="sparkline-container"><canvas></canvas></div>
      </div>`;
  }
  html += '</div>';
  el('content').innerHTML = html;

  document.querySelectorAll('.summary-card').forEach(card => {
    card.addEventListener('click', () => switchTab(card.dataset.tab));
  });

  document.querySelectorAll('.summary-card .sparkline-container canvas').forEach((canvas, i) => {
    const cat = CATEGORIES[i];
    const hero = cat.kpis.find(k => k.hero) || cat.kpis[0];
    const spark = getLast12(data, hero.col);
    createSparkline(canvas, spark);
  });
}

// ─── RENDERING: CATEGORY ─────────────────────────────────────────────────────
function renderCategory(catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat) return;
  const data = state.filtered;
  if (!data.length) { el('content').innerHTML = '<div class="no-data">No hay datos disponibles.</div>'; return; }

  let html = '<div class="kpi-grid">';
  for (const kpi of cat.kpis) {
    html += renderKPICard(kpi, data);
  }
  html += '</div>';

  html += '<div class="charts-section"><h2 class="section-title">Serie Histórica</h2><div class="chart-grid">';
  for (const kpi of cat.kpis) {
    html += `<div class="chart-box"><h3>${kpi.name}</h3><div class="chart-wrapper"><canvas id="chart-${kpi.col}"></canvas></div></div>`;
  }
  html += '</div></div>';

  el('content').innerHTML = html;

  document.querySelectorAll('.kpi-card .sparkline-container canvas').forEach((canvas, i) => {
    const kpi = cat.kpis[i];
    createSparkline(canvas, getLast12(data, kpi.col));
  });

  for (const kpi of cat.kpis) {
    const canvas = document.getElementById(`chart-${kpi.col}`);
    if (canvas) createFullChart(canvas, kpi, data);
  }
}

function renderKPICard(kpi, data) {
  const last = getLastVal(data, kpi.col);
  const prev = getPrevVal(data, kpi.col);
  const yoy  = getYoYVal(data, kpi.col);
  const sm   = semaphore(last, kpi);
  const dM   = getDelta(last, prev, kpi.fmt);
  const dY   = getDelta(last, yoy, kpi.fmt);

  return `
    <div class="kpi-card">
      <div class="kpi-card-header">
        <div class="kpi-name">${kpi.name}</div>
        <div class="semaphore ${sm}" title="Semáforo: verde=OK, amarillo=precaución, rojo=alerta"></div>
      </div>
      <div class="kpi-value">${fmtVal(last, kpi.fmt)}</div>
      <div class="kpi-deltas">
        ${deltaTag(dM, kpi.up, 'm/m', kpi.fmt)}
        ${deltaTag(dY, kpi.up, 'a/a', kpi.fmt)}
      </div>
      <div class="sparkline-container"><canvas></canvas></div>
    </div>`;
}

function deltaTag(delta, higherIsBetter, label, fmt) {
  if (delta === null) return `<span class="delta neutral"><span class="delta-label">${label}</span> s/d</span>`;
  const cls = deltaClass(delta, higherIsBetter);
  const arrow = deltaArrow(delta);
  let valStr;
  if (fmt === 'pct') {
    valStr = Math.abs(delta * 100).toFixed(2) + 'pp';
  } else if (fmt === 'money') {
    valStr = Math.abs(delta * 100).toFixed(1) + '%';
  } else {
    valStr = Math.abs(delta * 100).toFixed(1) + '%';
  }
  return `<span class="delta ${cls}">${arrow} ${valStr} <span class="delta-label">${label}</span></span>`;
}

// ─── DATA ACCESS ──────────────────────────────────────────────────────────────
function getLastVal(data, col) {
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].vals[col] !== null) return data[i].vals[col];
  }
  return null;
}

function getPrevVal(data, col) {
  let found = false;
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].vals[col] !== null) {
      if (found) return data[i].vals[col];
      found = true;
    }
  }
  return null;
}

function getYoYVal(data, col) {
  let lastIdx = -1;
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].vals[col] !== null) { lastIdx = i; break; }
  }
  if (lastIdx < 0) return null;
  const lastDate = data[lastIdx].date;
  const targetM = lastDate.getMonth();
  const targetY = lastDate.getFullYear() - 1;
  for (const row of data) {
    if (row.date.getMonth() === targetM && row.date.getFullYear() === targetY && row.vals[col] !== null) {
      return row.vals[col];
    }
  }
  return null;
}

function getLast12(data, col) {
  const vals = data.map(d => d.vals[col]).filter(v => v !== null);
  return vals.slice(-12);
}

// ─── CHARTS ───────────────────────────────────────────────────────────────────
function destroyCharts() {
  state.charts.forEach(c => c.destroy());
  state.charts = [];
}

function createSparkline(canvas, values) {
  if (!values.length) return;
  const color = '#CC0000';
  const ch = new Chart(canvas, {
    type: 'line',
    data: {
      labels: values.map(() => ''),
      datasets: [{
        data: values,
        borderColor: color,
        borderWidth: 1.5,
        fill: true,
        backgroundColor: color + '18',
        pointRadius: 0,
        tension: 0.35
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } },
      animation: false, events: []
    }
  });
  state.charts.push(ch);
}

function createFullChart(canvas, kpi, data) {
  const labels = data.map(d => d.label);
  const values = data.map(d => d.vals[kpi.col]);
  const color = CHART_COLORS[kpi.col % CHART_COLORS.length];
  const gridColor = 'rgba(255,255,255,.07)';
  const textColor = '#999999';

  const ch = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: kpi.name,
        data: values,
        borderColor: color,
        backgroundColor: color + '20',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: color,
        spanGaps: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#2a2a2a',
          titleColor: '#ffffff',
          bodyColor: '#cccccc',
          borderColor: '#444444',
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            label: ctx => fmtVal(ctx.parsed.y, kpi.fmt)
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { size: 11 }, maxRotation: 45 }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { size: 11 },
            callback: v => kpi.fmt === 'pct' ? (v * 100).toFixed(0) + '%' :
                           kpi.fmt === 'money' ? '$' + (v/1e6).toFixed(1) + 'M' :
                           v.toLocaleString('es-AR')
          }
        }
      }
    }
  });
  state.charts.push(ch);
}

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
function switchTab(tabId) {
  state.tab = tabId;
  destroyCharts();

  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.tab === tabId);
  });

  const titles = { home: 'Resumen Ejecutivo' };
  CATEGORIES.forEach(c => titles[c.id] = c.name);
  el('pageTitle').textContent = titles[tabId] || tabId;

  if (tabId === 'home') renderHome();
  else renderCategory(tabId);

  // Close mobile sidebar
  el('sidebar').classList.remove('open');
  const ov = document.querySelector('.sidebar-overlay');
  if (ov) ov.classList.remove('show');
}

// ─── DATE FILTER ──────────────────────────────────────────────────────────────
function applyDateFilter() {
  const from = el('dateFrom').value;
  const to = el('dateTo').value;
  let d = state.raw;
  if (from) {
    const fd = new Date(from + '-01');
    d = d.filter(r => r.date >= fd);
  }
  if (to) {
    const td = new Date(to + '-01');
    td.setMonth(td.getMonth() + 1);
    d = d.filter(r => r.date < td);
  }
  state.filtered = d;
  switchTab(state.tab);
}


// ─── UTILITY ──────────────────────────────────────────────────────────────────
function el(id) { return document.getElementById(id); }

function showError(err) {
  el('content').innerHTML = `
    <div class="error-box">
      <h3>Error al cargar datos</h3>
      <p>${err.message || err}</p>
      <p>Para que el dashboard funcione, la hoja de Google Sheets debe estar:</p>
      <ol>
        <li>Compartida como <strong>"Cualquiera con el link puede ver"</strong></li>
        <li>Publicada en la web: <strong>Archivo &gt; Compartir &gt; Publicar en la web</strong> (seleccioná la hoja "DATOS RIESGO Y RECUPERO" y formato "Página web")</li>
      </ol>
      <p>URL de la hoja configurada:</p>
      <p><code>${DATA_URLS[0]}</code></p>
      <p>Si la hoja cambió de URL, editá las constantes <code>SHEET_ID</code> y <code>GID</code> al inicio del archivo <code>app.js</code>.</p>
    </div>`;
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Nav click handlers
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      switchTab(item.dataset.tab);
    });
  });

  // Date filter
  el('dateFrom').addEventListener('change', applyDateFilter);
  el('dateTo').addEventListener('change', applyDateFilter);

  // PDF export
  el('exportBtn').addEventListener('click', () => window.print());

  // Mobile menu
  el('menuToggle').addEventListener('click', () => {
    el('sidebar').classList.toggle('open');
    const ov = document.querySelector('.sidebar-overlay');
    if (ov) ov.classList.toggle('show');
  });

  const overlay = document.querySelector('.sidebar-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      el('sidebar').classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  // Fetch data
  try {
    state.raw = await fetchData();
    state.filtered = [...state.raw];

    // Set last update label
    if (state.raw.length) {
      const last = state.raw[state.raw.length - 1];
      el('lastUpdate').textContent = 'Datos a ' + fmtDateLong(last.date);
      el('lastUpdateHeader').textContent = 'Datos a ' + fmtDateLong(last.date);
    }

    // Set date filter defaults
    if (state.raw.length) {
      const first = state.raw[0].date;
      const last = state.raw[state.raw.length - 1].date;
      el('dateFrom').min = first.toISOString().slice(0, 7);
      el('dateTo').max = last.toISOString().slice(0, 7);
    }

    el('loading').classList.add('hidden');
    renderHome();
  } catch (err) {
    el('loading').classList.add('hidden');
    showError(err);
  }
});
