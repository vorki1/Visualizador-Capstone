<template>
  <div class="home-container">
    <!-- Lado izquierdo -->
    <div class="panel-izquierdo">
      <img
        src="../../assets/cmp-logo.png"
        alt="CMP"
        class="logo-cmp"
      />

      <button
        class="btn-acceder"
        @click="irAAreas"
      >
        ACCEDER
      </button>
    </div>

    <!-- Lado derecho -->
    <div class="panel-derecho">
      <img
        src="../../assets/mineria.jpeg"
        alt="Minería"
        class="imagen-mineria"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const irAAreas = () => {
  router.push('/areas')
}
</script>

<style scoped>
.home-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background: #d9d9d9;
}

/* PANEL IZQUIERDO */
.panel-izquierdo {
  width: 50%;
  background: #d9d9d9;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding-top: 40px;
}

/* LOGO */
.logo-cmp {
  width: 80%;
  max-width: 520px;
  object-fit: contain;
}

/* BOTÓN */
.btn-acceder {
  margin-top: 220px;

  width: 200px;
  height: 60px;

  background: #0057a8;
  color: white;

  border: 2px solid black;
  cursor: pointer;

  font-size: 18px;
  font-weight: bold;
  text-decoration: underline;
  letter-spacing: 1px;

  transition: 0.3s;
}

.btn-acceder:hover {
  background: #0069c9;
}

/* PANEL DERECHO */
.panel-derecho {
  width: 50%;
  overflow: hidden;
}

.imagen-mineria {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .home-container {
    flex-direction: column;
  }

  .panel-izquierdo,
  .panel-derecho {
    width: 100%;
  }

  .panel-derecho {
    height: 40vh;
  }

  .logo-cmp {
    width: 70%;
  }

  .btn-acceder {
    margin-top: 100px;
  }
}
</style>