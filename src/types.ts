export interface Entry {
  id: string
  fecha: string      // DD/MM/YYYY
  horas: number
  descripcion: string
  mes: string        // "Julio 2026"
  timestamp: string
}

export interface NewEntry {
  fecha: string
  horas: number
  descripcion: string
  mes: string
}
