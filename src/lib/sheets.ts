import type { Entry, NewEntry } from '../types'

const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL as string

export async function addEntry(entry: NewEntry): Promise<void> {
  const params = new URLSearchParams({
    action: 'add',
    fecha: entry.fecha,
    horas: String(entry.horas),
    descripcion: entry.descripcion,
    mes: entry.mes,
    timestamp: new Date().toISOString(),
  })

  const res = await fetch(`${SCRIPT_URL}?${params.toString()}`)
  const data = await res.json()

  if (data.status !== 'ok') {
    throw new Error(data.message ?? 'Error al guardar la entrada')
  }
}

export async function getEntries(): Promise<Entry[]> {
  const res = await fetch(`${SCRIPT_URL}?action=list`)
  const data = await res.json()

  if (data.status !== 'ok') {
    throw new Error(data.message ?? 'Error al obtener las entradas')
  }

  return data.entries as Entry[]
}
