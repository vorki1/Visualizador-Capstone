<template>
    <h1>Este es el homeview de la pagina principal</h1>
    <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-btn block color="primary"
          @click="irAAreas">
          Ver Áreas
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const irAAreas = () => {
  router.push('/areas')
}
</script>