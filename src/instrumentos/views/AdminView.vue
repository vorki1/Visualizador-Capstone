<template>
  <div class="admin-view">
    <header class="admin-header">
      <button class="btn-volver" @click="volver">
        ←
      </button>

      <div>
        <h1>Panel de Administración</h1>
        <p>Control de procesos internos del sistema</p>
      </div>
    </header>

    <main class="admin-grid">
      <!-- SECCIÓN MATRIZ B -->
      <section class="admin-card">
        <h2>Matriz B</h2>

        <div class="estado-box">
          <span>Estado actual:</span>

          <strong
            :class="estadoMatrizB ? 'estado-proceso' : 'estado-libre'"
          >
            {{ estadoMatrizB ? 'En proceso' : 'Disponible' }}
          </strong>
        </div>

        <p class="descripcion">
          Desde aquí puedes ejecutar la construcción de la Matriz B en segundo plano.
        </p>

        <button
          class="btn-principal"
          :disabled="estadoMatrizB || cargando"
          @click="ejecutarMatrizB"
        >
          {{ estadoMatrizB ? 'Matriz B en proceso...' : 'Ejecutar Matriz B' }}
        </button>

        <button class="btn-secundario" @click="cargarEstado">
          Actualizar estado
        </button>

        <p v-if="mensaje" class="mensaje">
          {{ mensaje }}
        </p>
      </section>

      <!-- SECCIÓN ÚLTIMA ACTUALIZACIÓN -->
      <section class="admin-card">
        <h2>Última actualización</h2>

        <p class="descripcion">
            Estado del archivo de métricas de la Matriz B.
        </p>

        <div
            class="tag-actualizacion"
            :class="existeArchivoMetricas ? 'tag-ok' : 'tag-error'"
        >
            <span class="punto"></span>

            <span v-if="existeArchivoMetricas">
            Última actualización: {{ ultimaActualizacion }}
            </span>

            <span v-else>
            Archivo de métricas no disponible
            </span>
        </div>
        </section>

      <!-- SECCIÓN IMPORTAR EXCEL -->
      <section class="admin-card">
        <h2>Importar Excel</h2>

        <p class="descripcion">
          Espacio reservado para subir archivos Excel al sistema.
        </p>

        <input
          type="file"
          accept=".xlsx,.xls"
          class="input-file"
          @change="seleccionarArchivo"
        />

        <div v-if="archivoSeleccionado" class="archivo-box">
          Archivo seleccionado: {{ archivoSeleccionado.name }}
        </div>

        <button class="btn-principal" disabled>
          Subir Excel próximamente
        </button>
      </section>

      <!-- SECCIÓN EXPORTAR EXCEL -->
      <section class="admin-card">
        <h2>Exportar Excel</h2>

        <p class="descripcion">
          Espacio reservado para descargar información del sistema en formato Excel.
        </p>

        <button class="btn-principal" disabled>
          Exportar Excel próximamente
        </button>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  iniciarMatrizB,
  obtenerEstadoMatrizB,
  obtenerUltimaActualizacionMatrizBase
} from '../service/adminService'

const router = useRouter()

const estadoMatrizB = ref(false)
const cargando = ref(false)
const mensaje = ref('')
const ultimaActualizacion = ref('')
const existeArchivoMetricas = ref(false)
const archivoSeleccionado = ref<File | null>(null)

function volver() {
  router.back()
}

async function cargarEstado() {
  try {
    const data = await obtenerEstadoMatrizB()
    estadoMatrizB.value = data.matriz_b_en_proceso
  } catch (error) {
    console.error(error)
    mensaje.value = 'No se pudo obtener el estado de la Matriz B'
  }
}

async function cargarUltimaActualizacion() {
  try {
    const data = await obtenerUltimaActualizacionMatrizBase()

    existeArchivoMetricas.value = data.existe

    ultimaActualizacion.value =
      data.fecha_ultima_actualizacion_formateada || 'Sin fecha disponible'
  } catch (error) {
    console.error(error)
    existeArchivoMetricas.value = false
    ultimaActualizacion.value = ''
  }
}

async function ejecutarMatrizB() {
  try {
    cargando.value = true
    mensaje.value = ''

    const data = await iniciarMatrizB()

    mensaje.value = data.mensaje
    await cargarEstado()
  } catch (error) {
    console.error(error)
    mensaje.value = 'Error al iniciar la Matriz B'
  } finally {
    cargando.value = false
  }
}

function seleccionarArchivo(event: Event) {
  const input = event.target as HTMLInputElement

  if (input.files && input.files.length > 0) {
    archivoSeleccionado.value = input.files[0]
  }
}

onMounted(async () => {
  await cargarEstado()
  await cargarUltimaActualizacion()
})
</script>

<style scoped>
.admin-view {
  min-height: 100vh;
  background: #f4f6f8;
  padding: 32px;
}

.admin-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.admin-header h1 {
  margin: 0;
  font-size: 32px;
  color: #1f2937;
}

.admin-header p {
  margin: 4px 0 0;
  color: #6b7280;
}

.btn-volver {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background: #1f2937;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.admin-card {
  background: white;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.admin-card h2 {
  margin-top: 0;
  color: #111827;
}

.descripcion {
  color: #6b7280;
  margin-bottom: 20px;
}

.estado-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 16px;
}

.estado-libre {
  color: #16a34a;
}

.estado-proceso {
  color: #dc2626;
}

.btn-principal,
.btn-secundario {
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}

.btn-principal {
  background: #2563eb;
  color: white;
}

.btn-principal:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-secundario {
  background: #e5e7eb;
  color: #111827;
}

.mensaje {
  margin-top: 16px;
  background: #eff6ff;
  color: #1d4ed8;
  padding: 12px;
  border-radius: 10px;
}

.fecha-box,
.archivo-box {
  background: #f9fafb;
  padding: 14px;
  border-radius: 12px;
  color: #374151;
  margin-bottom: 16px;
}

.input-file {
  width: 100%;
  margin-bottom: 16px;
}

@media (max-width: 900px) {
  .admin-grid {
    grid-template-columns: 1fr;
  }
}
.tag-actualizacion {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.tag-ok {
  background: #dcfce7;
  color: #166534;
}

.tag-error {
  background: #fee2e2;
  color: #991b1b;
}

.punto {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: currentColor;
}
</style>