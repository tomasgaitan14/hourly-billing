import { useState } from 'react'
import toast from 'react-hot-toast'
import { addEntry } from '../lib/sheets'
import { generateMonthOptions, currentMonthLabel, todayISODate, formatDateDisplay } from '../lib/months'
import type { NewEntry } from '../types'

interface Props {
  onEntryAdded: () => void
}

const MONTH_OPTIONS = generateMonthOptions()
const HOUR_OPTIONS = [0.45, 0.5, 1, 1.5, 2, 3]

export function EntryForm({ onEntryAdded }: Props) {
  const [fecha, setFecha] = useState(todayISODate())
  const [horas, setHoras] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [mes, setMes] = useState(currentMonthLabel())
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const horasNum = parseFloat(horas)
    if (isNaN(horasNum) || horasNum <= 0) {
      toast.error('Las horas deben ser un número mayor a 0')
      return
    }
    if (!descripcion.trim()) {
      toast.error('La descripción no puede estar vacía')
      return
    }

    const entry: NewEntry = {
      fecha: formatDateDisplay(fecha),
      horas: horasNum,
      descripcion: descripcion.trim(),
      mes,
    }

    setLoading(true)
    try {
      await addEntry(entry)
      toast.success('Entrada guardada')
      setHoras('')
      setDescripcion('')
      setFecha(todayISODate())
      onEntryAdded()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Cargar horas</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mes de reporte</label>
          <select
            value={mes}
            onChange={e => setMes(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {MONTH_OPTIONS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de la actividad</label>
          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Horas</label>
          <div className="flex gap-2 flex-wrap">
            {HOUR_OPTIONS.map(h => (
              <button
                key={h}
                type="button"
                onClick={() => setHoras(String(h))}
                className={`px-5 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  horas === String(h)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <input
            type="text"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Ej: Reunión de seguimiento con equipo VED"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium px-6 py-2 rounded-lg text-sm transition-colors"
      >
        {loading ? 'Guardando...' : 'Guardar entrada'}
      </button>
    </form>
  )
}
