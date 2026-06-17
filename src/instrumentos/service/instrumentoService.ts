import { api } from './api'

export async function obtenerAreas() {
    const response = await api.get('/instrumento/areas')

    return response.data.areas
}

export async function obtenerSubareas(area: number) {
    const response = await api.get(
        `/instrumento/areas/${area}/subareas`
    )

    return response.data.subareas
}

export async function obtenerSistemas(subarea: string) {
    const response = await api.get(
        `/instrumento/subareas/${subarea}/sistemas`
    )

    return response.data
}

export async function obtenerInstrumentos(sistema: string) {
    const response = await api.get(
        `/instrumento/sistemas/${sistema}/instrumentos`
    )
    return response.data
}

export interface InformacionGeneral {
    Identificador: number
    Nombre_TAG: string
    Descripcion: string
    Area: number
    Subarea: string
    Sistema: string
    TAG_OPC: string
    Unidad_de_Ingenieria: string
}
export async function obtenerInfoInstrumento(id: number): Promise<InformacionGeneral> {
    const response = await api.get(`/instrumento/${id}`)
    //console.log(response.data.informacion_general[0])
    return response.data.informacion_general[0]
}
export async function obtenerHistoricoInstrumento(
    id: number,
    minutos: number
) {
    const response = await api.get(
        `/instrumento/${id}/historico?minutos=${minutos}`
    )

    return response.data
}
export async function obtenerAlertasInstrumentos() {
    const response = await api.get(
        '/alertas/tabla-alertas-instrumentos'
    )

    return response.data
}

export async function obtenerAlertas(
  soloActivas = true,
  page = 1,
  limit = 100
) {
  const response = await api.get('/alertas/', {
    params: {
      solo_activas: soloActivas,
      page,
      limit
    }
  })

  return response.data
}

export async function obtenerEstadisticasAlertas() {
  const response = await api.get('/alertas/estadisticas')
  return response.data
}