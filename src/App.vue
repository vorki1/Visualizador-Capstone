
<script setup lang="ts">

import TablaAlertas from './components/Tabla.vue'
</script>

<template>

  <h1>Dashboard</h1>

  <TablaAlertas />
  <router-view />
</template>

<style>
  h1 {
    color: #42b983;
    line-height: 1.5;
  }
</style>