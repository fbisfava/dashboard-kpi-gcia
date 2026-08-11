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
    hero: { col: 18, fmt: 'pct', up: false, th: [0.05, 0.10] },
    groups: [
      {
        id: 'base', name: 'Cuentas',
        kpis: [
          { name: 'Cuentas inhabilitadas o DV',  col: 15, fmt: 'int',   up: false, th: [500, 1000] },
          { name: 'Cuentas habilitadas',          col: 16, fmt: 'int',   up: true,  th: [10000, 5000], floor: 90000 },
          { name: 'Cuentas totales',              col: 17, fmt: 'int',   up: true,  th: [15000, 8000], floor: 102000 },
          { name: 'Ratio IH sobre totales',       col: 18, fmt: 'pct',  up: false, th: [0.05, 0.10], hero: true },
          { name: 'Q clientes que pasan a AB',    col: 19, fmt: 'int',   up: false, th: [50, 100] },
          { name: 'Monto que pasa a AB',          col: 20, fmt: 'money', up: false, th: [5000000, 15000000] },
          { name: 'Score Veraz promedio',          col: 24, fmt: 'num',  up: true  },
        ]
      },
      {
        id: 'refin', name: 'Refinanciaciones',
        kpis: [
          { name: 'Q de refinanciaciones',                col: 21, fmt: 'int', up: null },
          { name: 'Score Veraz promedio refinanciaciones', col: 44, fmt: 'num', up: true },
          { name: 'FPD Refinanciaciones',                 col: 45, fmt: 'int', up: false },
          { name: '% FPD refinanciaciones',               col: 46, fmt: 'pct', up: false },
        ]
      },
      {
        id: 'prestamos', name: 'Préstamos',
        kpis: [
          { name: 'Q préstamos',                          col: 47, fmt: 'int', up: null },
          { name: 'FPD préstamos',                        col: 48, fmt: 'int', up: false },
          { name: '% FPD préstamos',                      col: 49, fmt: 'pct', up: false },
          { name: 'Cuentas con préstamo activo',          col: 50, fmt: 'int', up: true },
          { name: '% cuentas hab. con préstamo activo',   col: 51, fmt: 'pct', up: true, fixedTh: { green: 0.25, yellow: 0.20 } },
        ]
      },
      {
        id: 'cura', name: 'Tasas de cura',
        kpis: [
          { name: 'Tasa de cura préstamos T2', col: 52, fmt: 'pct', up: true },
          { name: 'Tasa de cura TC T2',        col: 53, fmt: 'pct', up: true },
          { name: 'Tasa de cura refin. T2',    col: 54, fmt: 'pct', up: true },
          { name: 'Tasa de cura préstamos T3', col: 55, fmt: 'pct', up: true },
          { name: 'Tasa de cura TC T3',        col: 56, fmt: 'pct', up: true },
          { name: 'Tasa de cura refin. T3',    col: 57, fmt: 'pct', up: true },
          { name: 'Tasa de cura préstamos T4', col: 58, fmt: 'pct', up: true },
          { name: 'Tasa de cura TC T4',        col: 59, fmt: 'pct', up: true },
          { name: 'Tasa de cura refin. T4',    col: 60, fmt: 'pct', up: true },
        ]
      },
    ]
  },
  {
    id: 'rollrates', name: 'Roll Rates', icon: 'RR',
    kpis: [
      { name: 'RR 1-30 Préstamos',            col: 25, fmt: 'pct', up: false, th: [0.10, 0.20] },
      { name: 'RR 1-30 TC',                   col: 26, fmt: 'pct', up: false, th: [0.10, 0.20] },
      { name: 'RR 1-30 Total',                col: 29, fmt: 'pct', up: false, th: [0.10, 0.20], hero: true },
      { name: 'RR Directo 90-120d Préstamos', col: 27, fmt: 'pct', up: false, th: [0.05, 0.15] },
      { name: 'RR Directo 90-120d TC',        col: 28, fmt: 'pct', up: false, th: [0.05, 0.15] },
      { name: 'RR Directo 90-120d Total',     col: 30, fmt: 'pct', up: false, th: [0.05, 0.15] },
    ]
  },
  {
    id: 'vintage', name: 'Vintage', icon: 'V',
    kpis: [
      { name: 'Vintage >90 prést. a 6 meses',    col: 31, fmt: 'pct', up: false, th: [0.03, 0.06], hero: true },
      { name: 'Vintage >90 prést. a 12 meses',   col: 32, fmt: 'pct', up: false, th: [0.05, 0.10] },
      { name: 'Vintage >30 prést. a 6 meses',    col: 66, fmt: 'pct', up: false },
      { name: 'Vintage >30 prést. a 12 meses',   col: 67, fmt: 'pct', up: false },
    ]
  },
  {
    id: 'altas', name: 'Altas', icon: 'A',
    kpis: [
      { name: 'Cantidad de altas en el mes',      col: 61, fmt: 'int', up: true, hero: true },
      { name: 'Altas sobre aprobados',            col: 62, fmt: 'pct', up: true },
      { name: 'Altas TC',                         col: 63, fmt: 'int', up: true },
      { name: 'Altas SPP',                        col: 64, fmt: 'int', up: true },
      { name: '% altas TC con uso en primer mes', col: 65, fmt: 'pct', up: true },
    ]
  },
  {
    id: 'siisa', name: 'Originación SIISA', icon: 'OS',
    kpis: [
      { name: 'N° Solicitantes General',       col: 33, fmt: 'int', up: true,  th: [1000, 500] },
      { name: 'Tasa Aprobación General',       col: 34, fmt: 'pct', up: true,  th: [0.50, 0.35], hero: true },
      { name: 'Tasa Rechazo General',          col: 35, fmt: 'pct', up: false, th: [0.40, 0.60] },
      { name: 'N° Solicitantes Tarjeta',       col: 36, fmt: 'int', up: true,  th: [500, 250] },
      { name: 'Tasa Aprobación Tarjeta',       col: 37, fmt: 'pct', up: true,  th: [0.50, 0.35] },
      { name: 'Tasa Rechazo Tarjeta',          col: 38, fmt: 'pct', up: false, th: [0.40, 0.60] },
      { name: 'N° Solicitantes Préstamo',      col: 39, fmt: 'int', up: true,  th: [500, 250] },
      { name: 'Tasa Aprobación Préstamo',      col: 40, fmt: 'pct', up: true,  th: [0.50, 0.35] },
      { name: 'Tasa Rechazo Préstamo',         col: 41, fmt: 'pct', up: false, th: [0.40, 0.60] },
      { name: 'Rechazos Política Zonas Prést.', col: 42, fmt: 'int', up: false, th: [20, 50] },
      { name: 'Tasa de conversión Veraz',      col: 43, fmt: 'pct', up: true,  th: null },
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
  prestAct:  'https://app.powerbi.com/groups/10b65904-3676-44aa-8109-fd57736e93c8/reports/130d37b0-c2ed-4d09-b8dc-986445088d8e/ReportSection4d8b9bf0d3200c0c05ab?experience=power-bi',
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

const SQL_REFIN = `SELECT
    p.[Prést. Nro Cuenta],
    p.[Prést. Fecha Procesado],
    p.[Prést. Periodo Ingrreso],
    p.[Prést. 1er Per. Vto.],
    p.[Prést. Cód. Línea],
    p.[Prést. Cód. Plan],
    p.[Prést. Imp. Capital],
    cci.[Score Veraz Nro (Ap)],
    l.[Nro Cuenta]                                       AS Match_Liquidaciones,
    l.[Fecha_Plazo_Pago],
    l.[Saldo (Imp. Resumen-PG-NC+ND)],
    l.[Cerrada],
    CASE
        WHEN l.[Nro Cuenta] IS NULL THEN 'Sin resumen'
        WHEN l.[Fecha_Plazo_Pago] >= CAST(GETDATE() AS DATE) THEN 'No venció'
        WHEN l.[Saldo (Imp. Resumen-PG-NC+ND)] > 0 AND l.[Cerrada] = 0 THEN 'Default'
        ELSE 'OK'
    END AS FPD_status,
    CASE
        WHEN l.[Nro Cuenta] IS NULL THEN NULL
        WHEN l.[Fecha_Plazo_Pago] >= CAST(GETDATE() AS DATE) THEN NULL
        WHEN l.[Saldo (Imp. Resumen-PG-NC+ND)] > 0 AND l.[Cerrada] = 0 THEN 1
        ELSE 0
    END AS FPD_flag
FROM [dbo].[Préstamos] p
LEFT JOIN [dbo].[Liquidaciones y recaudación diaria expandida por cuenta v2] l
    ON p.[Prést. Nro Cuenta] = l.[Nro Cuenta]
    AND l.[Periodo Cobranza] = p.[Prést. 1er Per. Vto.]
LEFT JOIN [dbo].[Créditos y Cobranzas Indicadores] cci
    ON p.[Prést. Nro Cuenta] = cci.[Nro Cuenta]
    AND cci.[Período Cobranza] = p.[Prést. Periodo Ingrreso]
WHERE p.[Prést. Cód. Línea] IN ('RF1', 'RF2', 'RF3', 'RF4', 'EP1', 'EP2', 'PPV', 'D1W', 'D2W')
    AND p.[Prést. 1er Per. Vto.] >= 202401
    AND p.[Prést. Fecha Procesado] > 0`;

const SQL_PREST = `SELECT
    p.[Prést. Nro Cuenta],
    p.[Prést. Fecha Procesado],
    p.[Prést. Periodo Ingrreso],
    p.[Prést. 1er Per. Vto.],
    p.[Prést. Cód. Línea],
    p.[Prést. Cód. Plan],
    p.[Prést. Imp. Capital],
    l.[Nro Cuenta]                                       AS Match_Liquidaciones,
    l.[Fecha_Plazo_Pago],
    l.[Saldo (Imp. Resumen-PG-NC+ND)],
    l.[Cerrada],
    CASE
        WHEN l.[Nro Cuenta] IS NULL THEN 'Sin resumen'
        WHEN l.[Fecha_Plazo_Pago] >= CAST(GETDATE() AS DATE) THEN 'No venció'
        WHEN l.[Saldo (Imp. Resumen-PG-NC+ND)] > 0 AND l.[Cerrada] = 0 THEN 'Default'
        ELSE 'OK'
    END AS FPD_status,
    CASE
        WHEN l.[Nro Cuenta] IS NULL THEN NULL
        WHEN l.[Fecha_Plazo_Pago] >= CAST(GETDATE() AS DATE) THEN NULL
        WHEN l.[Saldo (Imp. Resumen-PG-NC+ND)] > 0 AND l.[Cerrada] = 0 THEN 1
        ELSE 0
    END AS FPD_flag
FROM [dbo].[Préstamos] p
LEFT JOIN [dbo].[Liquidaciones y recaudación diaria expandida por cuenta v2] l
    ON p.[Prést. Nro Cuenta] = l.[Nro Cuenta]
    AND l.[Periodo Cobranza] = p.[Prést. 1er Per. Vto.]
WHERE p.[Prést. Cód. Línea] NOT IN ('RF1', 'RF2', 'RF3', 'RF4', 'EP1', 'EP2', 'PPV', 'D1W', 'D2W')
    AND p.[Prést. 1er Per. Vto.] >= 202401
    AND p.[Prést. Fecha Procesado] > 0`;

const SQL_CURA = `DECLARE @PeriodoDesde INT = 202401;
DECLARE @PeriodoHasta INT = 202606;
DECLARE @PeriodoHastaExt INT =
    CASE WHEN @PeriodoHasta % 100 = 12 THEN (@PeriodoHasta / 100 + 1) * 100 + 1 ELSE @PeriodoHasta + 1 END;
DECLARE @MesAbsolutoActual INT =
    (YEAR(GETDATE()) * 12 + MONTH(GETDATE()) - 1);

IF OBJECT_ID('tempdb..#Tramo') IS NOT NULL DROP TABLE #Tramo;
SELECT
    L.[Nro Cuenta]                                             AS NroCuenta,
    L.[Periodo Cobranza]                                       AS Periodo,
    L.[Imp Resumen Total $ (Ap)]                               AS ImpRiesgo,
    CASE
        WHEN (CASE L.[Tramo] WHEN 'T1' THEN 0 WHEN 'T2' THEN 30
                              WHEN 'T3' THEN 60 WHEN 'T4' THEN 90 END
              + L.[Dias_atraso_del_tramo]) <= 30 THEN 'T1'
        WHEN (CASE L.[Tramo] WHEN 'T1' THEN 0 WHEN 'T2' THEN 30
                              WHEN 'T3' THEN 60 WHEN 'T4' THEN 90 END
              + L.[Dias_atraso_del_tramo]) <= 60 THEN 'T2'
        WHEN (CASE L.[Tramo] WHEN 'T1' THEN 0 WHEN 'T2' THEN 30
                              WHEN 'T3' THEN 60 WHEN 'T4' THEN 90 END
              + L.[Dias_atraso_del_tramo]) <= 90 THEN 'T3'
        ELSE 'T4'
    END                                                        AS TramoReal
INTO #Tramo
FROM [dbo].[Liquidaciones y recaudación diaria expandida por cuenta v2] L
WHERE L.[Periodo Cobranza] BETWEEN @PeriodoDesde AND @PeriodoHastaExt;
CREATE UNIQUE CLUSTERED INDEX IX_Tramo ON #Tramo (NroCuenta, Periodo);

IF OBJECT_ID('tempdb..#ConRefi') IS NOT NULL DROP TABLE #ConRefi;
;WITH NumerosRefi AS (
    SELECT TOP (36) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) - 1 AS n FROM sys.all_objects
),
PrestamosRefiConPlazo AS (
    SELECT
        P.[Prést. Nro Cuenta]                                  AS NroCuenta,
        P.[Prést. Fecha Procesado] / 100                       AS PeriodoOrigenYYYYMM,
        TRY_CAST(SUBSTRING(P.[Prést. Cód. Plan],
            PATINDEX('%[0-9]%', P.[Prést. Cód. Plan]),
            LEN(P.[Prést. Cód. Plan])) AS INT)                 AS PlazoOriginalMeses
    FROM [dbo].[Préstamos] P
    WHERE P.[Prést. Fecha Procesado] > 0
      AND P.[Prést. Cód. Línea] IN ('RF1','RF2','RF3','RF4','EP1','EP2','PPV','D1W','D2W')
),
ExpandidoRefi AS (
    SELECT PP.NroCuenta,
        (PP.PeriodoOrigenYYYYMM / 100 * 12 + PP.PeriodoOrigenYYYYMM % 100 - 1 + Nu.n) AS MesAbsoluto
    FROM PrestamosRefiConPlazo PP JOIN NumerosRefi Nu ON Nu.n < PP.PlazoOriginalMeses + 1
    WHERE PP.PlazoOriginalMeses IS NOT NULL
      AND (PP.PeriodoOrigenYYYYMM / 100 * 12 + PP.PeriodoOrigenYYYYMM % 100 - 1 + Nu.n) <= @MesAbsolutoActual
)
SELECT DISTINCT NroCuenta,
    (MesAbsoluto / 12) * 100 + (MesAbsoluto % 12) + 1 AS Periodo
INTO #ConRefi FROM ExpandidoRefi
WHERE (MesAbsoluto / 12) * 100 + (MesAbsoluto % 12) + 1 BETWEEN @PeriodoDesde AND @PeriodoHasta;
CREATE CLUSTERED INDEX IX_ConRefi ON #ConRefi (NroCuenta, Periodo);

IF OBJECT_ID('tempdb..#CCI') IS NOT NULL DROP TABLE #CCI;
SELECT C.[Nro Cuenta] AS NroCuenta, C.[Período Cobranza] AS Periodo,
    C.[Estado General (Ap)] AS Estado,
    C.[Imp Resumen TC $ (Ap)] AS ImpTC,
    C.[Imp Resumen PF $ (Ap)] + C.[Imp Resumen FN $ (Ap)] AS ImpPrestamo
INTO #CCI FROM [dbo].[Créditos y Cobranzas Indicadores] C
WHERE C.[Período Cobranza] BETWEEN @PeriodoDesde AND @PeriodoHastaExt;
CREATE CLUSTERED INDEX IX_CCI ON #CCI (NroCuenta, Periodo);

IF OBJECT_ID('tempdb..#Producto') IS NOT NULL DROP TABLE #Producto;
SELECT T.NroCuenta, T.Periodo,
    CASE
        WHEN RF.NroCuenta IS NOT NULL THEN 'Refinanciación'
        WHEN ISNULL(CCI.ImpTC,0) > 0 AND ISNULL(CCI.ImpPrestamo,0) > 0 THEN 'Mixta'
        WHEN ISNULL(CCI.ImpTC,0) > 0 THEN 'Solo TC'
        WHEN ISNULL(CCI.ImpPrestamo,0) > 0 THEN 'Solo Préstamo'
        ELSE 'Sin clasificar'
    END AS Producto
INTO #Producto FROM #Tramo T
LEFT JOIN #ConRefi RF  ON RF.NroCuenta = T.NroCuenta AND RF.Periodo = T.Periodo
LEFT JOIN #CCI     CCI ON CCI.NroCuenta = T.NroCuenta AND CCI.Periodo = T.Periodo;
CREATE UNIQUE CLUSTERED INDEX IX_Producto ON #Producto (NroCuenta, Periodo);

IF OBJECT_ID('tempdb..#Transicion') IS NOT NULL DROP TABLE #Transicion;
SELECT A.NroCuenta, A.Periodo AS PeriodoOrigen, A.TramoReal AS TramoOrigen,
    A.ImpRiesgo AS ImpRiesgoOrigen, P.Producto,
    COALESCE(B.TramoReal, CASE WHEN CCI.Estado = 'AB' THEN 'AB' ELSE 'T1' END) AS DestinoMesSiguiente
INTO #Transicion FROM #Tramo A
JOIN #Producto P ON P.NroCuenta = A.NroCuenta AND P.Periodo = A.Periodo
LEFT JOIN #Tramo B ON B.NroCuenta = A.NroCuenta
   AND B.Periodo = CASE WHEN A.Periodo % 100 = 12 THEN (A.Periodo / 100 + 1) * 100 + 1 ELSE A.Periodo + 1 END
LEFT JOIN #CCI CCI ON CCI.NroCuenta = A.NroCuenta
   AND CCI.Periodo = CASE WHEN A.Periodo % 100 = 12 THEN (A.Periodo / 100 + 1) * 100 + 1 ELSE A.Periodo + 1 END
WHERE A.TramoReal IN ('T2','T3','T4') AND A.Periodo BETWEEN @PeriodoDesde AND @PeriodoHasta;

SELECT PeriodoOrigen, Producto, TramoOrigen,
    COUNT(*) AS Q_Total,
    SUM(CASE WHEN DestinoMesSiguiente = 'T1' THEN 1 ELSE 0 END) AS Q_Curo,
    CAST(SUM(CASE WHEN DestinoMesSiguiente = 'T1' THEN 1.0 ELSE 0 END) / NULLIF(COUNT(*),0) AS DECIMAL(6,4)) AS TasaCura_Cantidad,
    SUM(ImpRiesgoOrigen) AS Monto_Total,
    SUM(CASE WHEN DestinoMesSiguiente = 'T1' THEN ImpRiesgoOrigen ELSE 0 END) AS Monto_Curo,
    CAST(SUM(CASE WHEN DestinoMesSiguiente = 'T1' THEN ImpRiesgoOrigen ELSE 0 END) / NULLIF(SUM(ImpRiesgoOrigen),0) AS DECIMAL(6,4)) AS TasaCura_Monto
FROM #Transicion GROUP BY PeriodoOrigen, Producto, TramoOrigen
ORDER BY PeriodoOrigen, Producto, CASE TramoOrigen WHEN 'T2' THEN 1 WHEN 'T3' THEN 2 WHEN 'T4' THEN 3 END;`;

const SQL_ALTAS = `SELECT
    YEAR([Cuenta Fecha Alta]) AS Año,
    MONTH([Cuenta Fecha Alta]) AS Mes,
    CASE
        WHEN [Cuenta Cód. Categoría] IS NULL OR [Cuenta Cód. Categoría] = ''
            THEN 'TC - Tarjeta de Crédito Fava'
        ELSE [Cuenta Cód. Categoría]
    END AS Categoría,
    COUNT(*) AS Cantidad_Altas
FROM [Cuentas Actual]
WHERE [Cuenta Fecha Alta] >= '2024-01-01'
  AND [Cuenta Fecha Alta] < '2025-12-31'
GROUP BY
    YEAR([Cuenta Fecha Alta]),
    MONTH([Cuenta Fecha Alta]),
    CASE
        WHEN [Cuenta Cód. Categoría] IS NULL OR [Cuenta Cód. Categoría] = ''
            THEN 'TC - Tarjeta de Crédito Fava'
        ELSE [Cuenta Cód. Categoría]
    END
ORDER BY Año, Mes, Categoría;`;

const SQL_ALTAS_USO = `WITH CuentasFiltradas AS (
    SELECT
        [Cuenta Nro],
        [Cuenta Fecha Alta],
        CASE
            WHEN [Cuenta Cód. Categoría] IS NULL OR [Cuenta Cód. Categoría] = ''
                THEN 'TC - Tarjeta de Crédito Fava'
            ELSE [Cuenta Cód. Categoría]
        END AS Categoría,
        CONVERT(VARCHAR(6), [Cuenta Fecha Alta], 112) AS PeriodoAlta,
        CONVERT(VARCHAR(6), DATEADD(MONTH, 1, [Cuenta Fecha Alta]), 112) AS PeriodoSiguiente
    FROM [Cuentas Actual]
    WHERE [Cuenta Fecha Alta] >= '2026-01-01'
      AND [Cuenta Fecha Alta] < '2026-08-01'
),
CCIRelevante AS (
    SELECT [Nro Cuenta], [Período Cobranza], [Imp Resumen Total $ (Ap)]
    FROM [Créditos y Cobranzas Indicadores]
    WHERE [Período Cobranza] >= '202601' AND [Período Cobranza] <= '202609'
),
CuentasConUso AS (
    SELECT
        cf.[Cuenta Nro], cf.[Cuenta Fecha Alta], cf.Categoría,
        MAX(CASE
            WHEN cci.[Período Cobranza] IN (cf.PeriodoAlta, cf.PeriodoSiguiente)
                 AND cci.[Imp Resumen Total $ (Ap)] > 0
            THEN 1 ELSE 0
        END) AS UsoEnPrimeros2Meses
    FROM CuentasFiltradas cf
    LEFT JOIN CCIRelevante cci ON cci.[Nro Cuenta] = cf.[Cuenta Nro]
        AND cci.[Período Cobranza] IN (cf.PeriodoAlta, cf.PeriodoSiguiente)
    GROUP BY cf.[Cuenta Nro], cf.[Cuenta Fecha Alta], cf.Categoría
)
SELECT
    YEAR([Cuenta Fecha Alta]) AS Año,
    MONTH([Cuenta Fecha Alta]) AS Mes,
    Categoría,
    COUNT(*) AS Cantidad_Altas,
    SUM(UsoEnPrimeros2Meses) AS Altas_Con_Uso,
    CAST(SUM(UsoEnPrimeros2Meses) AS FLOAT) / COUNT(*) AS Pct_Uso
FROM CuentasConUso
GROUP BY YEAR([Cuenta Fecha Alta]), MONTH([Cuenta Fecha Alta]), Categoría
ORDER BY Año, Mes, Categoría;`;

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
  21: { def: 'Cantidad de refinanciaciones realizadas en el período.', sql: SQL_REFIN },
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
  // ORIGINACIÓN (SIISA)
  43: { def: 'Cantidad de altas de clientes dividido cantidad de informes Veraz consumidos.' },
  // CUENTAS Y CARTERA — nuevos (Refinanciaciones)
  44: { def: 'Score Veraz promedio de las refinanciaciones del mes.', sql: SQL_REFIN },
  45: { def: 'First payment default de refinanciaciones: cantidad de cuentas que no pagaron la primera cuota de su refinanciación.', sql: SQL_REFIN },
  46: { def: 'FPD Refinanciaciones / Cantidad de refinanciaciones del mes.' },
  // Préstamos
  47: { def: 'Cantidad de préstamos otorgados en el mes.', sql: SQL_PREST },
  48: { def: 'First payment default de préstamos: cantidad de cuentas que no pagaron la primera cuota de su préstamo.', sql: SQL_PREST },
  49: { def: 'FPD Préstamos / Cantidad de préstamos del mes.' },
  50: { def: 'Cantidad de cuentas con al menos un préstamo vigente.',
        link: { url: _U.prestAct, label: 'Indicadores generales' } },
  51: { def: 'Cuentas con préstamo activo / Cuentas habilitadas.' },
  // Tasas de cura
  52: { def: '% de monto de préstamos en Tramo 2 (31–60 días de atraso) que retornan al Tramo 1 en el mes siguiente.', sql: SQL_CURA },
  53: { def: '% de monto de Tarjeta de Crédito en Tramo 2 (31–60 días de atraso) que retorna al Tramo 1 en el mes siguiente.', sql: SQL_CURA },
  54: { def: '% de monto de refinanciaciones en Tramo 2 (31–60 días de atraso) que retorna al Tramo 1 en el mes siguiente.', sql: SQL_CURA },
  55: { def: '% de monto de préstamos en Tramo 3 (61–90 días de atraso) que retornan al Tramo 1 en el mes siguiente.', sql: SQL_CURA },
  56: { def: '% de monto de Tarjeta de Crédito en Tramo 3 (61–90 días de atraso) que retorna al Tramo 1 en el mes siguiente.', sql: SQL_CURA },
  57: { def: '% de monto de refinanciaciones en Tramo 3 (61–90 días de atraso) que retorna al Tramo 1 en el mes siguiente.', sql: SQL_CURA },
  58: { def: '% de monto de préstamos en Tramo 4 (91–120 días de atraso) que retornan al Tramo 1 en el mes siguiente.', sql: SQL_CURA },
  59: { def: '% de monto de Tarjeta de Crédito en Tramo 4 (91–120 días de atraso) que retorna al Tramo 1 en el mes siguiente.', sql: SQL_CURA },
  60: { def: '% de monto de refinanciaciones en Tramo 4 (91–120 días de atraso) que retorna al Tramo 1 en el mes siguiente.', sql: SQL_CURA },
  // ALTAS
  61: { def: 'Cantidad de clientes dados de alta en el mes.', sql: SQL_ALTAS },
  62: { def: 'Altas del mes / Aprobados por SIISA en el mes.' },
  63: { def: 'Cantidad de altas de Tarjeta de Crédito en el mes.', sql: SQL_ALTAS },
  64: { def: 'Cantidad de altas de Préstamo Personal (SPP) en el mes.', sql: SQL_ALTAS },
  65: { def: '% de tarjetas de crédito dadas de alta que registraron al menos un consumo durante el primer mes de vida.', sql: SQL_ALTAS_USO },
  // VINTAGE >30
  66: { def: '% de importe atrasado 30 días o más a los 6 meses de la cosecha de préstamo.',
        link: { url: _U.vintage, label: 'Rol y Vintage Préstamos › Vintage (30 días)' } },
  67: { def: '% de importe atrasado 30 días o más a los 12 meses de la cosecha de préstamo.',
        link: { url: _U.vintage, label: 'Rol y Vintage Préstamos › Vintage (30 días)' } },
};

// ─── STATE ────────────────────────────────────────────────────────────────────
const state = {
  raw: [],
  filtered: [],
  tab: 'home',
  charts: [],
  subTabs: {}
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
    const allKpis = cat.groups ? cat.groups.flatMap(g => g.kpis) : cat.kpis;
    for (const kpi of allKpis) {
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

function breachesFloor(val, kpi) {
  return kpi.floor !== undefined && val !== null && val < kpi.floor;
}

function semaphoreColor(val, kpi, stats, mmDelta) {
  if (val === null || kpi.up === null) return 'gray';
  if (kpi.fixedTh) {
    const { green, yellow } = kpi.fixedTh;
    return kpi.up
      ? (val >= green ? 'green' : val >= yellow ? 'yellow' : 'red')
      : (val <= green ? 'green' : val <= yellow ? 'yellow' : 'red');
  }
  if (breachesFloor(val, kpi)) return 'red';
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
  const f = v => fmtVal(v, kpi.fmt);
  if (kpi.fixedTh) {
    const { green, yellow } = kpi.fixedTh;
    return kpi.up
      ? `Objetivo de negocio\nVerde: ≥ ${f(green)}\nAmarillo: ${f(yellow)} – ${f(green - 0.0001)}\nRojo: < ${f(yellow)}`
      : `Objetivo de negocio\nVerde: ≤ ${f(green)}\nAmarillo: ${f(green)} – ${f(yellow - 0.0001)}\nRojo: > ${f(yellow)}`;
  }
  const velocityLine = badVelocity(kpi, mmDelta)
    ? `Variación m/m: ${mmDelta >= 0 ? '+' : ''}${(mmDelta * 100).toFixed(2)}pp — supera 1.5pp`
    : null;
  const floorLine = kpi.floor !== undefined ? `Piso de negocio: ${f(kpi.floor)}` : null;
  if (!stats) {
    const lines = ['Datos insuficientes para calcular SMA (menos de 4 períodos)'];
    if (floorLine) lines.push(floorLine);
    if (velocityLine) lines.push(velocityLine);
    return lines.join('\n');
  }
  const { sma, sd, n } = stats;
  const lines = [
    `SMA${n} = ${f(sma)}`,
    kpi.up ? `Alerta (−1 DS): ${f(Math.max(0, sma - sd))}` : `Alerta (+1 DS): ${f(sma + sd)}`,
    kpi.up ? `Crítico (−2 DS): ${f(Math.max(0, sma - 2 * sd))}` : `Crítico (+2 DS): ${f(sma + 2 * sd)}`,
  ];
  if (floorLine) lines.push(floorLine);
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
let _smTipEl = null;
let _smTipTimer = null;

function initTooltip() {
  _tipEl = document.createElement('div');
  _tipEl.id = 'kpi-tooltip';
  document.body.appendChild(_tipEl);

  _tipEl.addEventListener('mouseover', () => clearTimeout(_tipTimer));
  _tipEl.addEventListener('mouseout', (e) => {
    if (!_tipEl.contains(e.relatedTarget)) _scheduleHide();
  });

  _tipEl.addEventListener('click', (e) => {
    const toggle = e.target.closest('.ktip-sql-toggle');
    if (toggle) {
      const wrap = _tipEl.querySelector('.ktip-sql-wrap');
      if (!wrap) return;
      const show = wrap.style.display === 'none' || !wrap.style.display;
      wrap.style.display = show ? 'block' : 'none';
      toggle.textContent = show ? 'Ocultar query' : 'Ver query';
      if (_tipEl._anchor) _positionTip(_tipEl._anchor);
      return;
    }
    const copyBtn = e.target.closest('.ktip-copy-btn');
    if (copyBtn) {
      const sql = _tipEl.querySelector('.ktip-sql')?.textContent || '';
      navigator.clipboard.writeText(sql).then(() => {
        copyBtn.textContent = '✓';
        copyBtn.classList.add('copied');
        setTimeout(() => { copyBtn.textContent = '⧉'; copyBtn.classList.remove('copied'); }, 1500);
      });
    }
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

  // ── Tooltip de semáforo ──
  _smTipEl = document.createElement('div');
  _smTipEl.id = 'sm-tooltip';
  document.body.appendChild(_smTipEl);

  document.addEventListener('mouseover', (e) => {
    const sm = e.target.closest('.semaphore[data-sm-tip]');
    if (!sm) return;
    clearTimeout(_smTipTimer);
    const lines = sm.dataset.smTip.split('\n');
    _smTipEl.innerHTML = lines.map((l, i) =>
      `<div class="${i === 0 ? 'smt-header' : 'smt-line'}">${escapeHtml(l)}</div>`
    ).join('');
    _smTipEl.style.display = 'block';
    _positionSmTip(sm);
  });

  document.addEventListener('mouseout', (e) => {
    const sm = e.target.closest('.semaphore[data-sm-tip]');
    if (sm && !sm.contains(e.relatedTarget)) {
      _smTipTimer = setTimeout(() => { if (_smTipEl) _smTipEl.style.display = 'none'; }, 120);
    }
  });
}

function _scheduleHide() {
  _tipTimer = setTimeout(() => { if (_tipEl) _tipEl.style.display = 'none'; }, 160);
}

function _showTip(anchor, info) {
  let html = `<div class="ktip-def">${escapeHtml(info.def)}</div>`;
  if (info.link || info.sql) {
    html += `<div class="ktip-source"><span class="ktip-label">Fuente: </span>`;
    if (info.link) {
      html += `<a class="ktip-link" href="${escapeAttr(info.link.url)}" target="_blank" rel="noopener">${escapeHtml(info.link.label)}</a>`;
    }
    if (info.sql) {
      if (info.link) html += ` · `;
      html += `<button class="ktip-sql-toggle">Ver query</button>`;
    }
    html += `</div>`;
  }
  if (info.sql) {
    html += `<div class="ktip-sql-wrap" style="display:none"><button class="ktip-copy-btn" title="Copiar query">⧉</button><pre class="ktip-sql"></pre></div>`;
  }
  _tipEl.innerHTML = html;
  if (info.sql) _tipEl.querySelector('.ktip-sql').textContent = info.sql;
  _tipEl._anchor = anchor;
  _tipEl.style.display = 'block';
  _positionTip(anchor);
}

function _positionSmTip(anchor) {
  const rect = anchor.getBoundingClientRect();
  const tipW = _smTipEl.offsetWidth;
  const tipH = _smTipEl.offsetHeight;
  const vw = window.innerWidth;
  let top = rect.top - tipH - 8;
  let left = rect.left + rect.width / 2 - tipW / 2;
  if (left + tipW > vw - 8) left = vw - tipW - 8;
  if (left < 8) left = 8;
  if (top < 8) top = rect.bottom + 8;
  _smTipEl.style.top = Math.max(8, top) + 'px';
  _smTipEl.style.left = left + 'px';
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
    const allKpis = cat.groups ? cat.groups.flatMap(g => g.kpis) : cat.kpis;
    const hero = allKpis.find(k => k.hero) || allKpis[0];
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
          <div class="kpi-header-right">${heroInfoBtn}<div class="semaphore ${sm}" data-sm-tip="${tip}"></div></div>
        </div>
        <div class="kpi-value">${fmtVal(last, hero.fmt)}</div>
        <div class="kpi-deltas">
          ${deltaTag(dM, hero.up, 'm/m', hero.fmt)}
          ${deltaTag(dY, hero.up, 'a/a', hero.fmt)}
        </div>
        <div class="sparkline-container"><canvas></canvas></div>
      </div>`;
  }
  // Extra card: FPD préstamos (col 48) — ocupa el slot libre del grid
  const fpdPKpi  = { col: 48, fmt: 'int', up: false };
  const fpdPLast  = getLastVal(data, 48);
  const fpdPPrev  = getPrevVal(data, 48);
  const fpdPYoy   = getYoYVal(data, 48);
  const fpdPdM    = getDelta(fpdPLast, fpdPPrev, 'int');
  const fpdPdY    = getDelta(fpdPLast, fpdPYoy, 'int');
  const fpdPStats = computeSMA12(data, 48);
  const fpdPSm    = semaphoreColor(fpdPLast, fpdPKpi, fpdPStats, fpdPdM);
  const fpdPTip   = escapeAttr(semaphoreTitle(fpdPKpi, fpdPStats, fpdPdM));
  html += `
    <div class="summary-card extra-card" data-tab="cuentas" data-subtab="prestamos">
      <div class="cat-label">Préstamos</div>
      <div class="kpi-card-header">
        <div class="kpi-name">FPD préstamos</div>
        <div class="kpi-header-right"><button class="kpi-info-btn" data-kpi-col="48" aria-label="Información">i</button><div class="semaphore ${fpdPSm}" data-sm-tip="${fpdPTip}"></div></div>
      </div>
      <div class="kpi-value">${fmtVal(fpdPLast, 'int')}</div>
      <div class="kpi-deltas">
        ${deltaTag(fpdPdM, false, 'm/m', 'int')}
        ${deltaTag(fpdPdY, false, 'a/a', 'int')}
      </div>
      <div class="sparkline-container"><canvas></canvas></div>
    </div>`;

  html += '</div>';
  html += buildAltasPieSection(data, true);
  el('content').innerHTML = html;

  document.querySelectorAll('.summary-card:not(.extra-card)').forEach(card => {
    card.addEventListener('click', () => switchTab(card.dataset.tab));
  });
  document.querySelectorAll('.summary-card.extra-card').forEach(card => {
    card.addEventListener('click', () => {
      if (card.dataset.subtab) state.subTabs[card.dataset.tab] = card.dataset.subtab;
      switchTab(card.dataset.tab);
    });
  });

  const allSummaryCanvases = document.querySelectorAll('.summary-card .sparkline-container canvas');
  const catSparkDefs = [
    ...CATEGORIES.map(cat => {
      const allKpis = cat.groups ? cat.groups.flatMap(g => g.kpis) : cat.kpis;
      return allKpis.find(k => k.hero) || allKpis[0];
    }),
    fpdPKpi
  ];
  allSummaryCanvases.forEach((canvas, i) => {
    if (catSparkDefs[i]) createSparkline(canvas, getLast12(data, catSparkDefs[i].col));
  });

  initAltasPie(data);
}

// ─── RENDERING: CATEGORY ─────────────────────────────────────────────────────
function renderCategory(catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat) return;
  const data = state.filtered;
  if (!data.length) { el('content').innerHTML = '<div class="no-data">No hay datos disponibles.</div>'; return; }

  // Resolve active KPIs (groups or flat list)
  let kpis;
  let subTabHtml = '';
  if (cat.groups) {
    const activeId = state.subTabs[catId] || cat.groups[0].id;
    const activeGroup = cat.groups.find(g => g.id === activeId) || cat.groups[0];
    kpis = activeGroup.kpis;
    subTabHtml = `<div class="subtab-bar">` +
      cat.groups.map(g =>
        `<button class="subtab${g.id === activeGroup.id ? ' active' : ''}" data-group="${g.id}">${g.name}</button>`
      ).join('') +
      `</div>`;
  } else {
    kpis = cat.kpis;
  }

  let html = subTabHtml;

  if (catId === 'altas') {
    html += buildAltasPieSection(data);
  }

  html += '<div class="kpi-grid">';
  for (const kpi of kpis) {
    html += renderKPICard(kpi, data);
  }
  html += '</div>';

  html += '<div class="charts-section"><h2 class="section-title">Serie Histórica</h2><div class="chart-grid">';
  for (const kpi of kpis) {
    html += `<div class="chart-box"><h3>${kpi.name}</h3><div class="chart-wrapper"><canvas id="chart-${kpi.col}"></canvas></div></div>`;
  }
  html += '</div></div>';

  el('content').innerHTML = html;

  // Sub-tab click handlers
  if (cat.groups) {
    el('content').querySelectorAll('.subtab').forEach(btn => {
      btn.addEventListener('click', () => {
        state.subTabs[catId] = btn.dataset.group;
        destroyCharts();
        renderCategory(catId);
      });
    });
  }

  document.querySelectorAll('.kpi-card .sparkline-container canvas').forEach((canvas, i) => {
    if (kpis[i]) createSparkline(canvas, getLast12(data, kpis[i].col));
  });

  for (const kpi of kpis) {
    const canvas = document.getElementById(`chart-${kpi.col}`);
    if (canvas) createFullChart(canvas, kpi, data);
  }

  if (catId === 'altas') {
    initAltasPie(data);
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
        <div class="kpi-header-right">${infoBtn}<div class="semaphore ${sm}" data-sm-tip="${tip}"></div></div>
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
  _altasPie = null;
}

function createSparkline(canvas, values) {
  if (!values.length) return;
  const color = '#CC0000';
  const n = values.length;
  const pointRadii = values.map((_, i) => i === n - 1 ? 3 : 0);
  const ch = new Chart(canvas, {
    type: 'line',
    data: {
      labels: values.map(() => ''),
      datasets: [{
        data: values,
        borderColor: color,
        borderWidth: 1.5,
        fill: true,
        backgroundColor: (ctx) => {
          const { chartArea, ctx: c } = ctx.chart;
          if (!chartArea) return color + '00';
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, color + '55');
          g.addColorStop(1, color + '00');
          return g;
        },
        pointRadius: pointRadii,
        pointHoverRadius: pointRadii,
        pointBackgroundColor: color,
        pointBorderColor: '#2a2a2a',
        pointBorderWidth: 1.5,
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

// ─── ALTAS PIE CHART ─────────────────────────────────────────────────────────
const COL_ALTAS_TC  = 63;
const COL_ALTAS_SPP = 64;
let _altasPie = null;
let _cselDocListenerBound = false;

function buildAltasPieSection(data, showFpdRefin = false) {
  const months = data.filter(d => d.vals[COL_ALTAS_TC] != null && d.vals[COL_ALTAS_SPP] != null);
  if (!months.length) return '';
  const opts = months.map(d => `<div class="csel-option" data-value="${d.label}">${d.label}</div>`).join('');

  // FPD Refinanciaciones card (col 45)
  const fpdRKpi   = { col: 45, fmt: 'int', up: false };
  const fpdR      = getLastVal(data, 45);
  const fpdRPrev  = getPrevVal(data, 45);
  const fpdRYoy   = getYoYVal(data, 45);
  const fpdRdM    = getDelta(fpdR, fpdRPrev, 'int');
  const fpdRdY    = getDelta(fpdR, fpdRYoy, 'int');
  const fpdRStats = computeSMA12(data, 45);
  const fpdRSm    = semaphoreColor(fpdR, fpdRKpi, fpdRStats, fpdRdM);
  const fpdRTip   = escapeAttr(semaphoreTitle(fpdRKpi, fpdRStats, fpdRdM));

  const fpdRefinCard = showFpdRefin ? `
        <div class="kpi-card pie-side-kpi-card">
          <div class="kpi-card-header">
            <div class="kpi-name">FPD Refinanciaciones</div>
            <div class="kpi-header-right"><button class="kpi-info-btn" data-kpi-col="45" aria-label="Información">i</button><div class="semaphore ${fpdRSm}" data-sm-tip="${fpdRTip}"></div></div>
          </div>
          <div class="kpi-value">${fmtVal(fpdR, 'int')}</div>
          <div class="kpi-deltas">
            ${deltaTag(fpdRdM, false, 'm/m', 'int')}
            ${deltaTag(fpdRdY, false, 'a/a', 'int')}
          </div>
          <div class="sparkline-container"><canvas id="sparkline-fpd-refin"></canvas></div>
        </div>` : '';

  return `
    <div class="charts-section">
      <div class="pie-and-side">
        <div>
          <h2 class="section-title">Composición de Altas</h2>
          <div class="pie-section">
            <div class="pie-filter">
              <span class="pie-filter-label">Mes:</span>
              <div class="csel" id="pie-month-sel">
                <div class="csel-trigger">
                  <span class="csel-label">—</span>
                  <span class="csel-arrow">▾</span>
                </div>
                <div class="csel-panel">${opts}</div>
              </div>
            </div>
            <div class="pie-row">
              <div class="pie-wrapper"><canvas id="chart-pie-altas"></canvas></div>
              <div class="pie-total-card">
                <div class="pie-total-label">Total de altas</div>
                <div class="pie-total-num" id="pie-total-num">—</div>
                <div class="kpi-deltas" id="pie-total-deltas"></div>
                <div class="pie-total-month" id="pie-total-month"></div>
              </div>
            </div>
          </div>
        </div>
        ${fpdRefinCard}
      </div>
    </div>`;
}

function initAltasPie(data) {
  const wrapper = document.getElementById('pie-month-sel');
  if (!wrapper) return;

  const trigger = wrapper.querySelector('.csel-trigger');
  const panel   = wrapper.querySelector('.csel-panel');
  const label   = wrapper.querySelector('.csel-label');
  const options = wrapper.querySelectorAll('.csel-option');

  function selectOpt(opt) {
    options.forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    wrapper.dataset.value = opt.dataset.value;
    label.textContent = opt.dataset.value;
    wrapper.classList.remove('open');
  }

  if (options.length) selectOpt(options[options.length - 1]);
  drawAltasPie(data, false);

  trigger.addEventListener('click', e => { e.stopPropagation(); wrapper.classList.toggle('open'); });
  if (!_cselDocListenerBound) {
    _cselDocListenerBound = true;
    document.addEventListener('click', () => {
      const w = document.getElementById('pie-month-sel');
      if (w) w.classList.remove('open');
    });
  }
  options.forEach(opt => opt.addEventListener('click', e => {
    e.stopPropagation(); selectOpt(opt); drawAltasPie(data, true);
  }));

  const sparkCanvas = document.getElementById('sparkline-fpd-refin');
  if (sparkCanvas) createSparkline(sparkCanvas, getLast12(data, 45));
}

function drawAltasPie(data, animate) {
  const wrapper = document.getElementById('pie-month-sel');
  const canvas  = document.getElementById('chart-pie-altas');
  if (!wrapper || !canvas) return;

  const selectedValue = wrapper.dataset.value;
  const rowIdx  = data.findIndex(d => d.label === selectedValue);
  const row     = rowIdx >= 0 ? data[rowIdx] : null;
  const prevRow = rowIdx > 0   ? data[rowIdx - 1]  : null;
  const yoyRow  = rowIdx >= 12 ? data[rowIdx - 12] : null;

  const tc       = row?.vals[COL_ALTAS_TC]  ?? 0;
  const spp      = row?.vals[COL_ALTAS_SPP] ?? 0;
  const total    = tc + spp;
  const prevTot  = prevRow ? (prevRow.vals[COL_ALTAS_TC]  ?? 0) + (prevRow.vals[COL_ALTAS_SPP]  ?? 0) : null;
  const yoyTot   = yoyRow  ? (yoyRow.vals[COL_ALTAS_TC]   ?? 0) + (yoyRow.vals[COL_ALTAS_SPP]   ?? 0) : null;
  const dM = total > 0 && prevTot != null ? getDelta(total, prevTot, 'int') : null;
  const dY = total > 0 && yoyTot  != null ? getDelta(total, yoyTot,  'int') : null;

  // Update total card with optional animation
  const numEl     = document.getElementById('pie-total-num');
  const deltasEl  = document.getElementById('pie-total-deltas');
  const monthEl   = document.getElementById('pie-total-month');

  const numText    = total > 0 ? Math.round(total).toLocaleString('es-AR') : '—';
  const deltasHtml = deltaTag(dM, true, 'm/m', 'int') + deltaTag(dY, true, 'a/a', 'int');

  if (numEl) {
    if (animate) {
      numEl.classList.add('pie-num-out');
      setTimeout(() => {
        numEl.textContent = numText;
        numEl.classList.remove('pie-num-out');
        if (deltasEl) deltasEl.innerHTML = deltasHtml;
      }, 180);
    } else {
      numEl.textContent = numText;
      if (deltasEl) deltasEl.innerHTML = deltasHtml;
    }
  }
  if (monthEl) monthEl.textContent = selectedValue;

  if (_altasPie) {
    const idx = state.charts.indexOf(_altasPie);
    if (idx >= 0) state.charts.splice(idx, 1);
    _altasPie.destroy();
    _altasPie = null;
  }

  _altasPie = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Altas TC', 'Altas SPP'],
      datasets: [{
        data: [tc, spp],
        backgroundColor: ['#CC0000', '#9ca3af'],
        borderWidth: 2,
        borderColor: '#1e1e1e'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: '#aaaaaa', font: { size: 13 }, padding: 16 } },
        tooltip: {
          backgroundColor: '#2a2a2a',
          titleColor: '#ffffff',
          bodyColor: '#cccccc',
          borderColor: '#444444',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: ctx => {
              const v = ctx.parsed;
              const pct = total > 0 ? (v / total * 100).toFixed(1) : '0.0';
              return `${ctx.label}: ${v.toLocaleString('es-AR')} (${pct}%)`;
            }
          }
        }
      }
    }
  });
  state.charts.push(_altasPie);
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
      <h3>No se pudo acceder a los datos</h3>
      <p>Verificá tu conexión e intentá recargar la página.</p>
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
