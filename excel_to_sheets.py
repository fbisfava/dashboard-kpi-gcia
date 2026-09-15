"""
Convierte el Excel local al formato que espera Google Sheets para el dashboard.
Uso: python excel_to_sheets.py
Genera: para_importar_sheets.csv (en la misma carpeta)
"""
import openpyxl
import csv
from datetime import datetime

EXCEL_PATH  = r"C:\Users\bistolfi.federico\Downloads\KPI's Gerencia Financiera ..xlsx"
OUTPUT_PATH = r"C:\Users\bistolfi.federico\Downloads\para_importar_sheets.csv"
SHEET_NAME  = "DATOS RIESGO Y RECUPERO"

# Mapeo: (nombre columna GSheets, columna Excel 1-indexed)
# El ORDEN define el número de columna en el CSV (y en app.js: kpi.col = posición 1-indexed aquí).
# IMPORTANTE: los números de columna Excel fueron actualizados para reflejar la estructura actual del archivo.
COLUMNS = [
    # ── FECHA ──────────────────────────────────────────────────────────────────
    ("Año-Mes",                                    1),   # A

    # ── COBRANZA (dashboard cols 1-6) ─────────────────────────────────────────
    ("Cobranza Mes Sin PP",                         2),   # B
    ("Cobranza Mes Con PP",                         3),   # C
    ("Cobranza del mes promedio",                   4),   # D
    ("Cobranza 90 dias Sin PP",                     5),   # E
    ("Cobranza 90 dias Con PP",                     6),   # F
    ("Cobranza 90 dias promedio",                   7),   # G

    # ── MOROSIDAD TC (dashboard cols 7-10) ────────────────────────────────────
    ("Morosidad 1-60d Montos TC",                   8),   # H
    ("Morosidad 1-60d Q casos TC",                  9),   # I
    ("Morosidad +60d Montos TC",                   10),   # J
    ("Morosidad +60d Q casos TC",                  11),   # K

    # ── MOROSIDAD PRÉSTAMOS (dashboard cols 11-14) ────────────────────────────
    ("Morosidad 1-60d Montos Prést.",              12),   # L
    ("Morosidad 1-60d Q casos Prést.",             13),   # M
    ("Morosidad +60d Montos Prést.",               14),   # N
    ("Morosidad +60d Q casos Prést.",              15),   # O

    # ── CUENTAS Y CARTERA base (dashboard cols 15-18) ─────────────────────────
    ("Cuentas inhabilitadas o DV",                 16),   # P
    ("Cuentas habilitadas",                        17),   # Q
    ("Cuentas totales",                            18),   # R
    ("Ratio IH sobre totales",                     19),   # S

    # ── CUENTAS Y CARTERA — AB (dashboard cols 19-20) ─────────────────────────
    ("Q clientes que pasan a AB",                  31),   # AE
    ("Monto que pasa a AB",                        32),   # AF

    # ── CUENTAS Y CARTERA — Refinanciaciones (dashboard cols 21-23) ───────────
    ("Q de refinanciaciones",                      34),   # AH
    ("(reservado)",                               None),
    ("(reservado)",                               None),

    # ── SCORE VERAZ CARTERA (dashboard col 24) ────────────────────────────────
    ("Score Veraz promedio",                       70),   # BR

    # ── ROLL RATES (dashboard cols 25-30) ─────────────────────────────────────
    ("RR 1-30 Préstamos",                          71),   # BS
    ("RR 1-30 TC",                                 72),   # BT
    ("RR Directo 90-120d Préstamos",               73),   # BU
    ("RR Directo 90-120d TC",                      74),   # BV
    ("RR 1-30 Total",                              75),   # BW
    ("RR Directo 90-120d Total",                   76),   # BX

    # ── VINTAGE >90 (dashboard cols 31-32) ────────────────────────────────────
    ("Vintage >90 prést. a 6 meses",               79),   # CA
    ("Vintage >90 prést. a 12 meses",              80),   # CB

    # ── ORIGINACIÓN SIISA (dashboard cols 33-43) ──────────────────────────────
    ("N° Solicitantes General",                    81),   # CC
    ("Tasa Aprobación General",                    83),   # CE
    ("Tasa Rechazo General",                       84),   # CF
    ("N° Solicitantes Tarjeta",                    85),   # CG
    ("Tasa Aprobación Tarjeta",                    86),   # CH
    ("Tasa Rechazo Tarjeta",                       87),   # CI
    ("N° Solicitantes Préstamo",                   88),   # CJ
    ("Tasa Aprobación Préstamo",                   89),   # CK
    ("Tasa Rechazo Préstamo",                      90),   # CL
    ("Rechazos Política Zonas Prést.",             91),   # CM
    ("Tasa de conversión Veraz",                   92),   # CN

    # ── CUENTAS Y CARTERA — Refinanciaciones (dashboard cols 44-46) ──────────
    ("Score Veraz promedio refinanciaciones",      33),   # AG
    ("FPD Refinanciaciones",                       35),   # AI
    ("% FPD refinanciaciones",                     36),   # AJ

    # ── CUENTAS Y CARTERA — Préstamos (dashboard cols 47-51) ─────────────────
    ("Q préstamos",                                37),   # AK
    ("FPD préstamos",                              38),   # AL
    ("% FPD préstamos",                            39),   # AM
    ("Cuentas con préstamo activo",                49),   # AW
    ("% cuentas hab. con préstamo activo",         50),   # AX

    # ── TASAS DE CURA (dashboard cols 52-60) ──────────────────────────────────
    ("Tasa de cura préstamos T2",                  40),   # AN
    ("Tasa de cura TC T2",                         41),   # AO
    ("Tasa de cura refin. T2",                     42),   # AP
    ("Tasa de cura préstamos T3",                  43),   # AQ
    ("Tasa de cura TC T3",                         44),   # AR
    ("Tasa de cura refin. T3",                     45),   # AS
    ("Tasa de cura préstamos T4",                  46),   # AT
    ("Tasa de cura TC T4",                         47),   # AU
    ("Tasa de cura refin. T4",                     48),   # AV

    # ── ORIGINACIÓN ALTAS (dashboard cols 61-65) ──────────────────────────────
    ("Cantidad de altas en el mes",                53),   # BA
    ("Altas sobre aprobados",                      66),   # BN
    ("Altas TC",                                   67),   # BO
    ("Altas SPP",                                  68),   # BP
    ("% altas TC con uso en primer mes",           69),   # BQ

    # ── VINTAGE >30 (dashboard cols 66-67) ────────────────────────────────────
    ("Vintage >30 prést. a 6 meses",               77),   # BY
    ("Vintage >30 prést. a 12 meses",              78),   # BZ

    # ── RECUPERO — COMPOSICIÓN REFINANCIACIONES (dashboard cols 68-69) ────────
    ("Composición refi TC",                        93),   # CO
    ("Composición refi Préstamos",                 94),   # CP

    # ── RECUPERO — GESTIÓN Y COBRANZA (dashboard cols 70-78) ─────────────────
    ("Clientes en mora",                           95),   # CQ
    ("Clientes en mora mes c gestion",             96),   # CR
    ("Clientes en mora c gestion positiva",        97),   # CS
    ("Cuentas con gestion x mes",                  98),   # CT
    ("Tasa de clientes en mora gestionados",       99),   # CU
    ("Tasa de cumplimiento de promesas",          100),   # CV
    ("Tasa de contacto efectivo",                 101),   # CW
    ("Tasa de conversion de gestion a pago",      102),   # CX
    ("Intensidad de gestion",                     103),   # CY

    # ── NUEVOS — BAJAS Y PÉRDIDAS (dashboard cols 79-89) ─────────────────────
    ("Perdida hacia IH",                           20),   # T
    ("Perdida hacia DV",                           21),   # U
    ("Perdida hacia BJ",                           22),   # V
    ("Baja desde IH",                              23),   # W
    ("Baja desde DV",                              24),   # X
    ("Bajas totales",                              25),   # Y
    ("Bajas Tarjeta de Crédito",                   26),   # Z
    ("Bajas Solo Créditos",                        27),   # AA
    ("Bajas Solo Débitos",                         28),   # AB
    ("Bajas SPP",                                  29),   # AC
    ("Bajas Tarjeta Créd. Empresario",             30),   # AD

    # ── NUEVOS — ALTAS POR TIPO (dashboard cols 90-97) ───────────────────────
    ("Altas TC (detalle)",                         54),   # BB
    ("Altas BFC",                                  55),   # BC
    ("Altas CSR",                                  56),   # BD
    ("Altas SBE",                                  57),   # BE
    ("Altas SCR",                                  58),   # BF
    ("Altas SDE",                                  59),   # BG
    ("Altas SPP (tipo)",                           60),   # BH
    ("Altas TCE",                                  61),   # BI

    # ── NUEVOS — REHABILITADAS (dashboard cols 98-101) ───────────────────────
    ("Rehabilitadas desde IH",                     62),   # BJ
    ("Rehabilitadas desde DV",                     63),   # BK
    ("Rehabilitadas desde BJ",                     64),   # BL
    ("Rehabilitadas desde AB",                     65),   # BM
]


def fmt_date(val):
    if val is None:
        return ""
    if isinstance(val, datetime):
        return val.strftime("%Y-%m")
    s = str(val)
    try:
        return datetime.strptime(s[:10], "%Y-%m-%d").strftime("%Y-%m")
    except ValueError:
        return s


def fmt_value(val):
    if val is None:
        return ""
    if isinstance(val, float):
        return repr(val)
    return str(val)


def main():
    wb = openpyxl.load_workbook(EXCEL_PATH, data_only=True)
    ws = wb[SHEET_NAME]

    # Find last data row
    last_row = 2
    for r in range(3, 200):
        if ws.cell(row=r, column=1).value is not None:
            last_row = r
        else:
            break

    print(f"Leyendo filas 3 a {last_row} ({last_row - 2} períodos)")

    headers = [name for name, _ in COLUMNS]
    rows_out = [headers]

    for r in range(3, last_row + 1):
        row = []
        for name, excel_col in COLUMNS:
            if excel_col is None:
                row.append("")
                continue
            cell = ws.cell(row=r, column=excel_col)
            val  = cell.value
            if name == "Año-Mes":
                row.append(fmt_date(val))
            else:
                row.append(fmt_value(val))
        rows_out.append(row)

    with open(OUTPUT_PATH, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerows(rows_out)

    print(f"Archivo generado: {OUTPUT_PATH}")
    print(f"  {len(rows_out)-1} filas de datos, {len(headers)} columnas")
    print("\nPara importar en Google Sheets:")
    print("  Archivo → Importar → Subir → elegir 'para_importar_sheets.csv'")
    print("  Tipo de importación: 'Reemplazar hoja de cálculo actual'")
    print("  Separador: coma (detectado automáticamente)")
    print("  Desmarcar 'Convertir texto en números, fechas y fórmulas'")


if __name__ == "__main__":
    main()
