import type { Entry } from '../types'

const HOURLY_RATE_USD = 35

interface Props {
  entries: Entry[]
  selectedMonth: string
}

function parseFecha(fecha: string): number {
  const [dd, mm, yyyy] = fecha.split('/')
  return new Date(`${yyyy}-${mm}-${dd}`).getTime()
}

export function EntriesTable({ entries, selectedMonth }: Props) {
  const filtered = entries
    .filter(e => e.mes === selectedMonth)
    .sort((a, b) => parseFecha(a.fecha) - parseFecha(b.fecha))
  const total = filtered.reduce((sum, e) => sum + Number(e.horas), 0)
  const totalUSD = total * HOURLY_RATE_USD

  if (filtered.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-gray-400 text-sm">
        No hay entradas para {selectedMonth}.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">{selectedMonth}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
            {total % 1 === 0 ? total : total.toFixed(2)} hs
          </span>
          <span className="text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            ≈ ${totalUSD % 1 === 0 ? totalUSD : totalUSD.toFixed(2)} USD
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Fecha</th>
              <th className="px-6 py-3 text-left font-medium">Horas</th>
              <th className="px-6 py-3 text-left font-medium">Descripción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(entry => (
              <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 whitespace-nowrap text-gray-700">{entry.fecha}</td>
                <td className="px-6 py-3 whitespace-nowrap text-gray-700 font-medium">{entry.horas}</td>
                <td className="px-6 py-3 text-gray-600">{entry.descripcion}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-semibold text-gray-800">
              <td className="px-6 py-3">TOTAL</td>
              <td className="px-6 py-3">{total % 1 === 0 ? total : total.toFixed(2)}</td>
              <td className="px-6 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
