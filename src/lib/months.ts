const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export function generateMonthOptions(): string[] {
  const options: string[] = []
  const now = new Date()

  // Genera los últimos 3 meses + mes actual + próximo mes
  for (let i = -3; i <= 1; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    options.push(`${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`)
  }

  return options
}

// Calcula el mes de facturación según la fecha (ciclo 26 al 25)
// Día 1-25 → mes actual | Día 26-31 → mes siguiente
export function getBillingMonth(isoDate: string): string {
  const [yyyy, mm, dd] = isoDate.split('-').map(Number)
  if (dd >= 26) {
    const next = new Date(yyyy, mm, 1) // mm es 1-based, new Date lo trata como índice del mes siguiente
    return `${MONTH_NAMES[next.getMonth()]} ${next.getFullYear()}`
  }
  return `${MONTH_NAMES[mm - 1]} ${yyyy}`
}

// Devuelve el período de facturación legible: "26/07/2026 – 25/08/2026"
export function getBillingPeriod(monthLabel: string): string {
  const [monthName, yearStr] = monthLabel.split(' ')
  const year = parseInt(yearStr)
  const monthIndex = MONTH_NAMES.indexOf(monthName) // 0-based

  const prevIndex = monthIndex === 0 ? 11 : monthIndex - 1
  const prevYear = monthIndex === 0 ? year - 1 : year

  const fromMonth = String(prevIndex + 1).padStart(2, '0')
  const toMonth = String(monthIndex + 1).padStart(2, '0')

  return `26/${fromMonth}/${prevYear} – 25/${toMonth}/${year}`
}

export function currentMonthLabel(): string {
  const now = new Date()
  const isoDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  return getBillingMonth(isoDate)
}

export function todayISODate(): string {
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  return `${now.getFullYear()}-${mm}-${dd}`
}

export function formatDateDisplay(isoDate: string): string {
  const [y, m, d] = isoDate.split('-')
  return `${d}/${m}/${y}`
}
