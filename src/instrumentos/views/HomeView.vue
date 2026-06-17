<template>
  <div class="home-container">
    <div class="panel-izquierdo">
      <img
        src="../../assets/cmp-logo.png"
        alt="CMP"
        class="logo-cmp"
      />

      <div class="login-box">
        <input
          v-model="usuario"
          type="text"
          placeholder="Usuario"
          class="input-login"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          class="input-login"
        />

        <button class="btn-acceder" @click="ingresarAdmin">
          INGRESAR ADMIN
        </button>

        <button class="btn-usuario" @click="ingresarUsuario">
          INGRESO COMO USUARIO
        </button>

        <p v-if="error" class="error">
          Usuario o contraseña incorrectos
        </p>
      </div>
    </div>

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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const usuario = ref('')
const password = ref('')
const error = ref(false)

function ingresarAdmin() {
  if (
    usuario.value === 'ADMINCMP' &&
    password.value === 'CMP1232026.'
  ) {
    localStorage.setItem('rol', 'admin')
    router.push('/areas')
  } else {
    error.value = true
  }
}

function ingresarUsuario() {
  localStorage.setItem('rol', 'usuario')
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

.panel-izquierdo {
  width: 50%;
  background: #d9d9d9;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
}

.logo-cmp {
  width: 80%;
  max-width: 520px;
  object-fit: contain;
}

.login-box {
  margin-top: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.input-login {
  width: 260px;
  height: 42px;
  padding: 0 12px;
  border: 2px solid #333;
  font-size: 15px;
}

.btn-acceder,
.btn-usuario {
  width: 260px;
  height: 48px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 1px;
}

.btn-acceder {
  background: #0057a8;
  color: white;
  border: 2px solid black;
}

.btn-acceder:hover {
  background: #0069c9;
}

.btn-usuario {
  background: white;
  color: #0057a8;
  border: 2px solid #0057a8;
}

.btn-usuario:hover {
  background: #eef6ff;
}

.error {
  color: #b00020;
  font-weight: bold;
}

.panel-derecho {
  width: 50%;
  overflow: hidden;
}

.imagen-mineria {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

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

  .login-box {
    margin-top: 60px;
  }
}
</style>