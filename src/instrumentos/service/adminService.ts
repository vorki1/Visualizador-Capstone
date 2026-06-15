import { api } from './api'

export async function iniciarMatrizB() {
  const response = await api.post(`matriz/matriz-b`)
  return response.data
}

export async function obtenerEstadoMatrizB() {
  const response = await api.get(`matriz/matriz-b/estado`)
  return response.data
}

export async function obtenerUltimaActualizacionMatrizBase() {
  const response = await api.get(`matriz/metricas-matriz-base/ultima-actualizacion`)
  return response.data
}
/* ==========================
   IMPORTACIÓN DE EXCEL
========================== */

export async function importarExcel(archivo: File) {
  const formData = new FormData()

  formData.append('archivo', archivo)

  const response = await api.post(
    'admin/importar-excel',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )

  return response.data
}

/* ==========================
   EXPORTACIÓN DE EXCEL
========================== */

export async function exportarExcel() {
  const response = await api.get(
    'admin/exportar-excel'
  )

  return response.data
}