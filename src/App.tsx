import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { EntryForm } from './components/EntryForm'
import { EntriesTable } from './components/EntriesTable'
import { PasswordGate } from './components/PasswordGate'
import { getEntries } from './lib/sheets'
import { generateMonthOptions, currentMonthLabel } from './lib/months'
import type { Entry } from './types'

const MONTH_OPTIONS = generateMonthOptions()

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [selectedMonth, setSelectedMonth] = useState(currentMonthLabel())
  const [loadingEntries, setLoadingEntries] = useState(true)

  const fetchEntries = useCallback(async () => {
    setLoadingEntries(true)
    try {
      const data = await getEntries()
      setEntries(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al cargar las entradas')
    } finally {
      setLoadingEntries(false)
    }
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  return (
    <PasswordGate>
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Horas VED</h1>
          <p className="text-sm text-gray-500">Virtual Ed Global · Tomás Gaitán</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <EntryForm onEntryAdded={fetchEntries} />

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-600">Ver mes</h2>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {MONTH_OPTIONS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {loadingEntries ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-gray-400 text-sm">
            Cargando...
          </div>
        ) : (
          <EntriesTable entries={entries} selectedMonth={selectedMonth} />
        )}
      </main>
    </div>
    </PasswordGate>
  )
}
