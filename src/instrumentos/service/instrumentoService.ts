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
    console.log(response)
    return response.data
}

export async function obtenerInfoInstrumento(id: number) {
    const response = await api.get(
        `/instrumento/info-instrumento?id=${id}`
    )

    return response.data
}

export async function obtenerHistorico(
    id: number,
    minutos: number
) {
    const response = await api.get(
        `/instrumento/histogram?id=${id}&minutos=${minutos}`
    )

    return response.data
}