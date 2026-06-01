<script setup lang="ts">
import { ref, computed } from 'vue'
import datosJson from '../../data/tabla_alertas.json'

interface Alerta {
  Identificador: number
  Alerta_Cambio_Brusco: string
  Alerta_Oscilacion: string
  Alerta_Senal_Congelada: string
}

const alertas = ref<Alerta[]>(datosJson)

const filtroIdentificador = ref<number | null>(null)
const filtroCambioBrusco = ref<string | null>(null)
const filtroOscilacion = ref<string | null>(null)
const filtroCongelada = ref<string | null>(null)

const headers = [
  {
    title: 'Identificador',
    key: 'Identificador'
  },
  {
    title: 'Cambio Brusco',
    key: 'Alerta_Cambio_Brusco'
  },
  {
    title: 'Oscilación',
    key: 'Alerta_Oscilacion'
  },
  {
    title: 'Señal Congelada',
    key: 'Alerta_Senal_Congelada'
  }
]

const alertasFiltradas = computed(() => {
  return alertas.value.filter(alerta => {

    const idOK =
      filtroIdentificador.value === null ||
      alerta.Identificador === filtroIdentificador.value

    const cambioOK =
      filtroCambioBrusco.value === null ||
      alerta.Alerta_Cambio_Brusco === filtroCambioBrusco.value

    const oscilacionOK =
      filtroOscilacion.value === null ||
      alerta.Alerta_Oscilacion === filtroOscilacion.value

    const congeladaOK =
      filtroCongelada.value === null ||
      alerta.Alerta_Senal_Congelada === filtroCongelada.value

    return (
      idOK &&
      cambioOK &&
      oscilacionOK &&
      congeladaOK
    )
  })
})

const identificadoresDisponibles = computed(() => {

  const valores = [
    ...new Set(
      alertasFiltradas.value.map(
        a => a.Identificador
      )
    )
  ]

  return [
    { title: 'Todos', value: null },
    ...valores.map(v => ({
      title: v.toString(),
      value: v
    }))
  ]
})

const cambiosDisponibles = computed(() => {

  const valores = [
    ...new Set(
      alertasFiltradas.value.map(
        a => a.Alerta_Cambio_Brusco
      )
    )
  ]

  return [
    { title: 'Todos', value: null },
    ...valores.map(v => ({
      title: v,
      value: v
    }))
  ]
})

const oscilacionesDisponibles = computed(() => {

  const valores = [
    ...new Set(
      alertasFiltradas.value.map(
        a => a.Alerta_Oscilacion
      )
    )
  ]

  return [
    { title: 'Todos', value: null },
    ...valores.map(v => ({
      title: v,
      value: v
    }))
  ]
})

const congeladasDisponibles = computed(() => {

  const valores = [
    ...new Set(
      alertasFiltradas.value.map(
        a => a.Alerta_Senal_Congelada
      )
    )
  ]

  return [
    { title: 'Todos', value: null },
    ...valores.map(v => ({
      title: v,
      value: v
    }))
  ]
})

const filtroTexto = (
  itemTitle: string,
  queryText: string
) => {

  return itemTitle
    .toLowerCase()
    .includes(
      queryText.toLowerCase()
    )
}
</script>

<template>

  <v-card>

    <v-card-title>
      Monitor de Alertas
    </v-card-title>

    <v-card-text>

      <v-row>

        <v-col cols="12" md="3">
          <v-autocomplete
            v-model="filtroIdentificador"
            :items="identificadoresDisponibles"
            item-title="title"
            item-value="value"
            label="Identificador"
            clearable
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-autocomplete
            v-model="filtroCambioBrusco"
            :items="cambiosDisponibles"
            item-title="title"
            item-value="value"
            label="Cambio Brusco"
            :custom-filter="filtroTexto"
            clearable
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-autocomplete
            v-model="filtroOscilacion"
            :items="oscilacionesDisponibles"
            item-title="title"
            item-value="value"
            label="Oscilación"
            :custom-filter="filtroTexto"
            clearable
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-autocomplete
            v-model="filtroCongelada"
            :items="congeladasDisponibles"
            item-title="title"
            item-value="value"
            label="Señal Congelada"
            :custom-filter="filtroTexto"
            clearable
            variant="outlined"
            density="compact"
          />
        </v-col>

      </v-row>

    </v-card-text>

    <v-data-table
      :headers="headers"
      :items="alertasFiltradas"
      fixed-header
      height="500"
    >

      <template #item.Alerta_Cambio_Brusco="{ item }">
        <span :class="item.Alerta_Cambio_Brusco">
          {{ item.Alerta_Cambio_Brusco }}
        </span>
      </template>

      <template #item.Alerta_Oscilacion="{ item }">
        <span :class="item.Alerta_Oscilacion">
          {{ item.Alerta_Oscilacion }}
        </span>
      </template>

      <template #item.Alerta_Senal_Congelada="{ item }">
        <span :class="item.Alerta_Senal_Congelada">
          {{ item.Alerta_Senal_Congelada }}
        </span>
      </template>

    </v-data-table>

  </v-card>

</template>

<style scoped>

:deep(.v-data-table tbody td) {
  color: black;
}

:deep(.v-data-table thead th) {
  color: black;
  font-weight: bold;
}

.NORMAL{
  background-color:#d4edda;
  padding:6px 12px;
  border-radius:4px;
}

.PREVENTIVO{
  background-color:#fff3cd;
  padding:6px 12px;
  border-radius:4px;
}

.CRITICO{
  background-color:#f8d7da;
  padding:6px 12px;
  border-radius:4px;
  font-weight:bold;
}

.EMERGENCIA{
  background-color:#dc3545;
  color:white;
  padding:6px 12px;
  border-radius:4px;
  font-weight:bold;
}

</style>