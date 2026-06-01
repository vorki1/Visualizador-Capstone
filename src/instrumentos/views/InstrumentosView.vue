<template>
    <h1>
        Instrumentos de
        {{ sistema }}
    </h1>

    <ul>
        <li
            v-for="instrumento in instrumentos"
            :key="instrumento.Identificador"
        >
            {{ instrumento.Nombre_TAG }}
        </li>
    </ul>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import {
    obtenerInstrumentos
} from '../service/instrumentoService'

const route = useRoute()

const sistema = String(
    route.params.sistema
)


const instrumentos = ref<any[]>([])

onMounted(async () => {
    instrumentos.value =
        await obtenerInstrumentos(
            sistema
        )

    console.log(instrumentos.value)
})
</script>