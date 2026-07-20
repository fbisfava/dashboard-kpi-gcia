/* ==========================================================================
   Dashboard KPI — Gerencia Financiera — Riesgo y Recupero v2
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
      { name: 'Cobranza Mes Sin PP',       col: 1,  fmt: 'pct', up: true,  th: [0.85, 0.70] },
      { name: 'Cobranza Mes Con PP',       col: 2,  fmt: 'pct', up: true,  th: [0.90, 0.75] },
      { name: 'Cobranza del mes promedio', col: 3,  fmt: 'pct', up: true,  th: [0.90, 0.75], hero: true },
      { name: 'Cobranza 90 dias Sin PP',   col: 4,  fmt: 'pct', up: true,  th: [0.85, 0.70] },
      { name: 'Cobranza 90 dias Con PP',   col: 5,  fmt: 'pct', up: true,  th: [0.90, 0.75] },
      { name: 'Cobranza 90 dias promedio', col: 6,  fmt: 'pct', up: true,  th: [0.90, 0.75] },
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
      { name: 'Tasa de conversión Veraz',            col: 43, fmt: 'pct', up: true,  th: null },
    ]
  }
];

const CHART_COLORS = [
  '#CC0000','#ef4444','#f97316','#eab308','#22c55e',
  '#06b6d4','#8b5cf6','#ec4899','#f43f5e','#a3e635'
];

const MONTHS_ES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

// ─── KPI INFO (definiciones y fuentes) ────────────────────────────────────────
const _U = {
  cob:       'https://app.powerbi.com/groups/cb50998e-dd3e-4d25-a7f7-278020578424/reports/987a4bbb-7f63-4381-a795-219f711db072/bf70ed61e3bc2be2ce21?experience=power-bi',
  mora:      'https://app.powerbi.com/groups/719b86fa-614d-4963-bcd5-6b54f696c415/reports/f13717cb-4865-4abb-a6af-5ccfc9cdba66/ebab275b130cbbde91d6?experience=power-bi',
  scores:    'https://app.powerbi.com/groups/719b86fa-614d-4963-bcd5-6b54f696c415/reports/f13717cb-4865-4abb-a6af-5ccfc9cdba66/985145cf483c77c119d8?experience=power-bi',
  refin:     'https://app.powerbi.com/groups/cb50998e-dd3e-4d25-a7f7-278020578424/reports/987a4bbb-7f63-4381-a795-219f711db072/ReportSection53b58aab50493cc20c5d?experience=power-bi',
  evolPrest: 'https://app.powerbi.com/groups/719b86fa-614d-4963-bcd5-6b54f696c415/reports/f13717cb-4865-4abb-a6af-5ccfc9cdba66/21d0dc48003d71ee37a1?experience=power-bi',
  evolTC:    'https://app.powerbi.com/groups/719b86fa-614d-4963-bcd5-6b54f696c415/reports/f13717cb-4865-4abb-a6af-5ccfc9cdba66/9b2dbda7132221e24c90?experience=power-bi',
  evolTotal: 'https://app.powerbi.com/groups/719b86fa-614d-4963-bcd5-6b54f696c415/reports/f13717cb-4865-4abb-a6af-5ccfc9cdba66/54b95042560cc73675c1?experience=power-bi',
  vintage:   'https://app.powerbi.com/groups/b8be9f80-a741-4b8e-8c61-62623fa0a135/reports/9f911f8f-9c87-4a42-be84-bb87caf392f9/eaa444092ecc0e271d0c?experience=power-bi',
};

const SQL_IH = `WITH stock_mensual AS (
    SELECT
        [Periodo Calendario],
        SUM(CASE WHEN [Estado Gral.] IN ('IH', 'DV') THEN 1 ELSE 0 END) AS cuentas_ih,
        SUM(CASE WHEN [Estado Gral.] NOT IN ('IH', 'DV', 'AB', 'BJ') THEN 1 ELSE 0 END) AS cuentas_habilitadas
    FROM [Cuentas Stock Mensual]
    WHERE [Periodo Calendario] >= 202401
    GROUP BY [Periodo Calendario]
),
ratios AS (
    SELECT
        [Periodo Calendario],
        cuentas_ih,
        cuentas_habilitadas,
        cuentas_ih + cuentas_habilitadas AS cuentas_activas,
        CAST(cuentas_ih AS DECIMAL(18,6)) / NULLIF(cuentas_ih + cuentas_habilitadas, 0) AS ratio_ih_sobre_activas
    FROM stock_mensual
),
bandas AS (
    SELECT
        [Periodo Calendario],
        cuentas_ih,
        cuentas_habilitadas,
        cuentas_activas,
        ratio_ih_sobre_activas,
        AVG(ratio_ih_sobre_activas) OVER (
            ORDER BY [Periodo Calendario]
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS media_acumulada,
        STDEVP(ratio_ih_sobre_activas) OVER (
            ORDER BY [Periodo Calendario]
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS desvio_std_acumulado
    FROM ratios
)
SELECT
    [Periodo Calendario],
    cuentas_ih,
    cuentas_habilitadas,
    cuentas_activas,
    CAST(ROUND(ratio_ih_sobre_activas * 100.0, 2) AS DECIMAL(10, 2)) AS ratio_ih_sobre_activas_pct,
    CAST(ROUND(media_acumulada * 100.0, 2) AS DECIMAL(10, 2)) AS media_acumulada_pct,
    CASE
        WHEN ratio_ih_sobre_activas < media_acumulada - (2 * desvio_std_acumulado)
          OR ratio_ih_sobre_activas > media_acumulada + (2 * desvio_std_acumulado)
        THEN 'Sí'
        ELSE 'No'
    END AS [Fuera de rango]
FROM bandas
ORDER BY [Periodo Calendario];`;

const SQL_AB = `WITH CC_Ordenado AS (
    SELECT
        [Nro Cuenta],
        [Período Cobranza],
        [Estado General (Ap)],
        LAG([Estado General (Ap)]) OVER (
            PARTITION BY [Nro Cuenta]
            ORDER BY [Período Cobranza]
        ) AS Estado_Periodo_Anterior
    FROM [Créditos y Cobranzas Indicadores] WITH (NOLOCK)
),
Nuevos_Pases_AB AS (
    SELECT
        [Nro Cuenta],
        [Período Cobranza]
    FROM CC_Ordenado
    WHERE [Estado General (Ap)] = 'AB'
      AND (Estado_Periodo_Anterior <> 'AB' OR Estado_Periodo_Anterior IS NULL)
)
SELECT
    LEFT(CAST(NPA.[Período Cobranza] AS VARCHAR(6)), 4) + '-' +
    RIGHT(CAST(NPA.[Período Cobranza] AS VARCHAR(6)), 2)     AS [Mes pase a AB],
    COUNT(NPA.[Nro Cuenta])                                   AS [Cantidad de Cuentas],
    FORMAT(SUM(CR.[Imp. Saldo Vdo FN (Fin Mes)] + CR.[Imp. Saldo Vdo TC (Fin Mes)]), 'N2', 'es-AR') AS [Monto Total a AB]
FROM Nuevos_Pases_AB NPA
INNER JOIN [Cuentas Riesgo] CR WITH (NOLOCK)
    ON NPA.[Nro Cuenta] = CR.[Nro Cuenta]
    AND CR.[Periodo] = NPA.[Período Cobranza]
WHERE LEFT(CAST(NPA.[Período Cobranza] AS VARCHAR(6)), 4) = '2026'
GROUP BY
    LEFT(CAST(NPA.[Período Cobranza] AS VARCHAR(6)), 4) + '-' +
    RIGHT(CAST(NPA.[Período Cobranza] AS VARCHAR(6)), 2)
ORDER BY [Mes pase a AB] ASC;`;

const KPI_INFO = {
  // COBRANZA
  1:  { def: '% importe cobrado del mes de cuentas sin préstamo activo.',
        link: { url: _U.cob, label: 'Cobranza segmentada › Mes › Sin PP' } },
  2:  { def: '% cobrado del mes de cuentas con préstamo activo.',
        link: { url: _U.cob, label: 'Cobranza segmentada › Mes › Con PP' } },
  3:  { def: '% importe cobrado promedio ponderado entre cobranza del mes de cuentas sin préstamo personal y cuentas con préstamo.',
        link: { url: _U.cob, label: 'Cobranza segmentada › MES › Total' } },
  4:  { def: '% importe cobrado de cuentas sin préstamo activo pasados 90 días del mes de emisión del resumen.',
        link: { url: _U.cob, label: 'Cobranza segmentada › 90 días › Sin PP' } },
  5:  { def: '% importe cobrado de cuentas con préstamo activo pasados 90 días del mes de emisión del resumen.',
        link: { url: _U.cob, label: 'Cobranza segmentada › 90 días › Con PP' } },
  6:  { def: '% importe cobrado promedio ponderado entre cobranza 90 días de cuentas sin préstamo personal y cuentas con préstamo activo.',
        link: { url: _U.cob, label: 'Cobranza segmentada › 90 días › Total' } },
  // MOROSIDAD — TC (tabla TC + PF)
  7:  { def: 'Proporción del saldo total de Tarjeta de Crédito que se encuentra en situación de mora entre 1 y 60 días (tramos 0-30 y 30-60 días). Se calcula como la suma de los saldos en esos tramos dividido el saldo total de cartera TC al cierre del mes.',
        link: { url: _U.mora, label: 'Datos cartera para riesgo › Dist. de Saldos según estado de mora — tabla TC + PF' } },
  8:  { def: 'Proporción de cuentas de Tarjeta de Crédito que se encuentran en situación de mora entre 1 y 60 días (tramos 0-30 y 30-60 días) sobre el total de cuentas TC activas al cierre del mes.',
        link: { url: _U.mora, label: 'Datos cartera para riesgo › Dist. de Saldos según estado de mora — tabla TC + PF' } },
  9:  { def: 'Proporción del saldo total de Tarjeta de Crédito que se encuentra en mora mayor a 60 días (tramos 60-90, 90-120, 120-150, 150-180 y más de 180 días) sobre el saldo total de cartera TC al cierre del mes.',
        link: { url: _U.mora, label: 'Datos cartera para riesgo › Dist. de Saldos según estado de mora — tabla TC + PF' } },
  10: { def: 'Proporción de cuentas de Tarjeta de Crédito en mora mayor a 60 días (tramos 60-90, 90-120, 120-150, 150-180 y más de 180 días) sobre el total de cuentas TC activas al cierre del mes.',
        link: { url: _U.mora, label: 'Datos cartera para riesgo › Dist. de Saldos según estado de mora — tabla TC + PF' } },
  // MOROSIDAD — Préstamos (tabla FN)
  11: { def: 'Proporción del saldo total de Préstamos Personales que se encuentra en mora entre 1 y 60 días (tramos 0-30 y 30-60 días) sobre el saldo total de cartera de préstamos al cierre del mes.',
        link: { url: _U.mora, label: 'Datos cartera para riesgo › Dist. de Saldos según estado de mora — tabla FN' } },
  12: { def: 'Proporción de préstamos en mora entre 1 y 60 días (tramos 0-30 y 30-60 días) sobre el total de préstamos vigentes al cierre del mes.',
        link: { url: _U.mora, label: 'Datos cartera para riesgo › Dist. de Saldos según estado de mora — tabla FN' } },
  13: { def: 'Proporción del saldo total de Préstamos Personales en mora mayor a 60 días (tramos 60-90, 90-120, 120-150, 150-180 y más de 180 días) sobre el saldo total de cartera de préstamos al cierre del mes.',
        link: { url: _U.mora, label: 'Datos cartera para riesgo › Dist. de Saldos según estado de mora — tabla FN' } },
  14: { def: 'Proporción de préstamos en mora mayor a 60 días (tramos 60-90, 90-120, 120-150, 150-180 y más de 180 días) sobre el total de préstamos vigentes al cierre del mes.',
        link: { url: _U.mora, label: 'Datos cartera para riesgo › Dist. de Saldos según estado de mora — tabla FN' } },
  // CUENTAS Y CARTERA
  15: { def: 'Cuentas en estado inhabilitado o deuda vencida.', sql: SQL_IH },
  16: { def: 'Cuentas que no se encuentran en estado inhabilitado, deuda vencida, abogados, o baja.', sql: SQL_IH },
  17: { def: 'Sumatoria entre cuentas habilitadas y cuentas inhabilitadas o DV.', sql: SQL_IH },
  18: { def: 'Cuentas inhabilitadas o DV dividido cuentas totales.', sql: SQL_IH },
  19: { def: "Cantidad de clientes que migran a estado 'Abogados' en el mes en curso.", sql: SQL_AB },
  20: { def: "Sumatoria de monto adeudado de las cuentas al momento de pasar a estado 'AB'.", sql: SQL_AB },
  21: { def: 'Cantidad de refinanciaciones realizadas en el período.',
        link: { url: _U.refin, label: 'Cobranza segmentada › General' } },
  24: { def: 'Score Veraz promedio de la cartera de clientes activos.',
        link: { url: _U.scores, label: 'Datos cartera para riesgo › Scores' } },
  // ROLL RATES
  25: { def: '% del saldo de préstamos sin atrasos el mes anterior que tiene entre 1 y 30 días de atraso en el mes actual.',
        link: { url: _U.evolPrest, label: 'Datos cartera para riesgo › Evolución cartera (importes) de préstamos' } },
  26: { def: '% del saldo de Tarjeta de Crédito sin atrasos el mes anterior que tiene entre 1 y 30 días de atraso en el mes actual.',
        link: { url: _U.evolTC, label: 'Datos cartera para riesgo › Evolución cartera (importes) de tarjeta' } },
  27: { def: 'Porcentaje del saldo de préstamos que se encontraba al día (sin atrasos) hace 4 meses y que actualmente registra entre 90 y 120 días de mora. Mide la tasa de deterioro directo desde situación normal hasta mora avanzada en un horizonte de 4 meses.',
        link: { url: _U.evolPrest, label: 'Datos cartera para riesgo › Evolución cartera (importes) de préstamos' } },
  28: { def: 'Porcentaje del saldo de Tarjeta de Crédito que se encontraba al día (sin atrasos) hace 4 meses y que actualmente registra entre 90 y 120 días de mora. Mide la tasa de deterioro directo desde situación normal hasta mora avanzada en un horizonte de 4 meses.',
        link: { url: _U.evolTC, label: 'Datos cartera para riesgo › Evolución cartera (importes) de tarjeta' } },
  29: { def: 'Promedio ponderado por saldo entre el Roll Rate 1-30 días de Tarjeta de Crédito y el de Préstamos. Mide la proporción del saldo total de ambos productos que pasó de estar al día a registrar entre 1 y 30 días de atraso en el mes actual.',
        link: { url: _U.evolTotal, label: 'Datos cartera para riesgo › Evolución cartera (importes) general' } },
  30: { def: 'Promedio ponderado por saldo entre el Roll Rate Directo 90-120 días de Tarjeta de Crédito y el de Préstamos. Mide la proporción del saldo total de ambos productos que transitó directamente desde situación normal a mora entre 90 y 120 días en un período de 4 meses.',
        link: { url: _U.evolTotal, label: 'Datos cartera para riesgo › Evolución cartera (importes) general' } },
  // VINTAGE
  31: { def: '% de importe atrasado más de 90 días a los 6 meses de la cosecha de préstamo.',
        link: { url: _U.vintage, label: 'Rol y Vintage Préstamos › Vintage (90 días)' } },
  32: { def: '% de importe atrasado más de 90 días a los 12 meses de la cosecha de préstamo.',
        link: { url: _U.vintage, label: 'Rol y Vintage Préstamos › Vintage (90 días)' } },
};

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
        let s = raw.replace(/^\$\s*/, '').trim();
        // Si termina en coma + 1-2 dígitos, la coma es separador decimal (ej: "571,07" → 571.07)
        if (/,\d{1,2}$/.test(s)) {
          s = s.replace(/\./g, '').replace(',', '.');
        } else {
          s = s.replace(/,/g, '');
        }
        const n = parseFloat(s);
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

// Computes SMA over last N (up to 12) non-null values + sample SD.
function computeSMA12(data, col) {
  const vals = [];
  for (let i = data.length - 1; i >= 0 && vals.length < 12; i--) {
    if (data[i].vals[col] !== null) vals.unshift(data[i].vals[col]);
  }
  if (vals.length < 4) return null;
  const n = vals.length;
  const sma = vals.reduce((s, v) => s + v, 0) / n;
  const sd = n > 1 ? Math.sqrt(vals.reduce((s, v) => s + (v - sma) ** 2, 0) / (n - 1)) : 0;
  return { sma, sd, n };
}

function badVelocity(kpi, mmDelta) {
  if (kpi.fmt !== 'pct' || kpi.up === null || mmDelta === null) return false;
  return kpi.up ? mmDelta < -0.015 : mmDelta > 0.015;
}

function semaphoreColor(val, kpi, stats, mmDelta) {
  if (val === null || kpi.up === null) return 'gray';
  if (!stats) {
    return badVelocity(kpi, mmDelta) ? 'yellow' : 'gray';
  }
  const { sma, sd } = stats;
  let color;
  if (kpi.up) {
    color = val < sma - 2 * sd ? 'red' : val < sma - sd ? 'yellow' : 'green';
  } else {
    color = val > sma + 2 * sd ? 'red' : val > sma + sd ? 'yellow' : 'green';
  }
  if (color === 'green' && badVelocity(kpi, mmDelta)) color = 'yellow';
  return color;
}

function semaphoreTitle(kpi, stats, mmDelta) {
  if (kpi.up === null) return 'Sin umbral automático (requiere criterio de gestión)';
  const velocityLine = badVelocity(kpi, mmDelta)
    ? `Variación m/m: ${mmDelta >= 0 ? '+' : ''}${(mmDelta * 100).toFixed(2)}pp — supera 1.5pp`
    : null;
  if (!stats) {
    const lines = ['Datos insuficientes para calcular SMA (menos de 4 períodos)'];
    if (velocityLine) lines.push(velocityLine);
    return lines.join('\n');
  }
  const { sma, sd, n } = stats;
  const f = v => fmtVal(v, kpi.fmt);
  const lines = [
    `SMA${n} = ${f(sma)}`,
    kpi.up ? `Alerta (−1 DS): ${f(sma - sd)}` : `Alerta (+1 DS): ${f(sma + sd)}`,
    kpi.up ? `Crítico (−2 DS): ${f(sma - 2 * sd)}` : `Crítico (+2 DS): ${f(sma + 2 * sd)}`,
  ];
  if (velocityLine) lines.push(velocityLine);
  return lines.join('\n');
}

function escapeAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── KPI TOOLTIP ──────────────────────────────────────────────────────────────
let _tipEl = null;
let _tipTimer = null;

function initTooltip() {
  _tipEl = document.createElement('div');
  _tipEl.id = 'kpi-tooltip';
  document.body.appendChild(_tipEl);

  _tipEl.addEventListener('mouseover', () => clearTimeout(_tipTimer));
  _tipEl.addEventListener('mouseout', (e) => {
    if (!_tipEl.contains(e.relatedTarget)) _scheduleHide();
  });

  _tipEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.ktip-sql-toggle');
    if (!btn) return;
    const pre = _tipEl.querySelector('.ktip-sql');
    if (!pre) return;
    const show = pre.style.display === 'none' || !pre.style.display;
    pre.style.display = show ? 'block' : 'none';
    btn.textContent = show ? 'Ocultar query' : 'Ver query';
    if (_tipEl._anchor) _positionTip(_tipEl._anchor);
  });

  document.addEventListener('mouseover', (e) => {
    const btn = e.target.closest('.kpi-info-btn');
    if (!btn) return;
    clearTimeout(_tipTimer);
    const col = parseInt(btn.dataset.kpiCol);
    const info = KPI_INFO[col];
    if (!info) return;
    _showTip(btn, info);
  });

  document.addEventListener('mouseout', (e) => {
    const btn = e.target.closest('.kpi-info-btn');
    if (btn && !btn.contains(e.relatedTarget)) _scheduleHide();
  });

  // Evita que el click en el ícono active la navegación de la summary-card
  document.addEventListener('click', (e) => {
    if (e.target.closest('.kpi-info-btn')) e.stopPropagation();
  }, true);
}

function _scheduleHide() {
  _tipTimer = setTimeout(() => { if (_tipEl) _tipEl.style.display = 'none'; }, 160);
}

function _showTip(anchor, info) {
  let html = `<div class="ktip-def">${escapeHtml(info.def)}</div>`;
  html += `<div class="ktip-source"><span class="ktip-label">Fuente: </span>`;
  if (info.link) {
    html += `<a class="ktip-link" href="${escapeAttr(info.link.url)}" target="_blank" rel="noopener">${escapeHtml(info.link.label)}</a>`;
  }
  if (info.sql) {
    if (info.link) html += ` · `;
    html += `<button class="ktip-sql-toggle">Ver query</button>`;
  }
  html += `</div>`;
  if (info.sql) {
    html += `<pre class="ktip-sql" style="display:none"></pre>`;
  }
  _tipEl.innerHTML = html;
  if (info.sql) _tipEl.querySelector('.ktip-sql').textContent = info.sql;
  _tipEl._anchor = anchor;
  _tipEl.style.display = 'block';
  _positionTip(anchor);
}

function _positionTip(anchor) {
  const rect = anchor.getBoundingClientRect();
  const tipW = _tipEl.offsetWidth;
  const tipH = _tipEl.offsetHeight;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let top = rect.bottom + 6;
  let left = rect.left;
  if (left + tipW > vw - 8) left = vw - tipW - 8;
  if (top + tipH > vh - 8) top = rect.top - tipH - 6;
  _tipEl.style.top = Math.max(8, top) + 'px';
  _tipEl.style.left = Math.max(8, left) + 'px';
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
    const dM   = getDelta(last, prev, hero.fmt);
    const dY   = getDelta(last, yoy, hero.fmt);
    const stats = computeSMA12(data, hero.col);
    const sm   = semaphoreColor(last, hero, stats, dM);
    const tip  = escapeAttr(semaphoreTitle(hero, stats, dM));
    const spark = getLast12(data, hero.col);

    const heroInfoBtn = KPI_INFO[hero.col]
      ? `<button class="kpi-info-btn" data-kpi-col="${hero.col}" aria-label="Información">i</button>`
      : '';
    html += `
      <div class="summary-card" data-tab="${cat.id}">
        <div class="cat-label">${cat.name}</div>
        <div class="kpi-card-header">
          <div class="kpi-name">${hero.name}</div>
          <div class="kpi-header-right">${heroInfoBtn}<div class="semaphore ${sm}" title="${tip}"></div></div>
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
  const last  = getLastVal(data, kpi.col);
  const prev  = getPrevVal(data, kpi.col);
  const yoy   = getYoYVal(data, kpi.col);
  const dM    = getDelta(last, prev, kpi.fmt);
  const stats = computeSMA12(data, kpi.col);
  const sm    = semaphoreColor(last, kpi, stats, dM);
  const tip   = escapeAttr(semaphoreTitle(kpi, stats, dM));
  const dY    = getDelta(last, yoy, kpi.fmt);
  const infoBtn = KPI_INFO[kpi.col]
    ? `<button class="kpi-info-btn" data-kpi-col="${kpi.col}" aria-label="Información">i</button>`
    : '';

  return `
    <div class="kpi-card">
      <div class="kpi-card-header">
        <div class="kpi-name">${kpi.name}</div>
        <div class="kpi-header-right">${infoBtn}<div class="semaphore ${sm}" title="${tip}"></div></div>
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

  initTooltip();

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
