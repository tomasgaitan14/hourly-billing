# hourly-billing

## Descripción

App para registrar horas trabajadas para VED (Virtual Ed Global) y visualizarlas por mes. A fin de mes, el usuario filtra en Google Sheets y descarga el reporte manualmente para enviarlo al cliente.

## Contexto

VED — cliente freelance. Las horas se reportan mensualmente en formato tabla (Fecha | Horas | Descripción | Total).

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- Google Sheets como base de datos (vía Apps Script Web App)
- Deploy: Vercel (pendiente)

## Proyectos relacionados

Ninguno. App standalone.

## Google Sheets

- **Sheet:** [Horas VED](https://docs.google.com/spreadsheets/d/1FvKzWen6a3WrGxaz2nSrBEN-UWGSQye4iJz_oMYyOn8/edit)
- **Sheet ID:** `1FvKzWen6a3WrGxaz2nSrBEN-UWGSQye4iJz_oMYyOn8`
- **Tab:** `Horas`
- **Columnas:** Fecha | Horas | Descripción | Mes | Timestamp

## Apps Script

- **ID de implementación:** `AKfycbx6F-5cC8qp2O96C5c4VyXMT2HW5-cLC6KZO3DsTiQrQ4pcgy1zUtmiN-wloZYjkKKbpg`
- **Web App URL:** `https://script.google.com/macros/s/AKfycbx6F-5cC8qp2O96C5c4VyXMT2HW5-cLC6KZO3DsTiQrQ4pcgy1zUtmiN-wloZYjkKKbpg/exec`
- **Código fuente:** `apps-script/Code.gs`
- **Acceso:** Cualquiera (sin login)
- **Ejecuta como:** cuenta de Google del dueño

> Si se necesita actualizar el script, hacer una Nueva implementación (no editar la existente) y actualizar la URL en `.env.local` y en Vercel env vars.

## Estado actual

App funcional corriendo local. Pendiente verificación en browser y deploy a Vercel.

## Decisiones tomadas

- Sin login ni backend propio — Apps Script actúa como pseudo-API
- Sin Supabase — Google Sheets es la única persistencia
- Vite puro (no Next.js) — app utilitaria sin necesidad de SSR
- El reporte final (Word/Excel para VED) se genera filtrando en Sheets y descargando manualmente

## Próximos pasos

- [ ] Verificar en browser (Claude in Chrome)
- [ ] Deploy a Vercel
- [ ] Agregar `VITE_SCRIPT_URL` como env var en Vercel

## Archivos clave

- `src/lib/sheets.ts` — calls al Apps Script
- `src/lib/months.ts` — generación de opciones de mes y formato de fechas
- `src/components/EntryForm.tsx` — formulario de carga
- `src/components/EntriesTable.tsx` — tabla filtrada por mes
- `apps-script/Code.gs` — código del backend en Google Apps Script
- `.env.local` — URL del Web App (gitignored)
- `.env.example` — template sin valores
