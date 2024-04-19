<template>
  <q-tabs
    v-model="tab"
    align="justify"
    active-color="teal-14"
  >
    <q-toggle
      v-model="sudo"
      color="teal-14"
    >
      <q-tooltip
        anchor="top middle"
        self="bottom middle"
      >
        modo administrador
      </q-tooltip>
    </q-toggle>
    <q-tab
      :ripple="false"
      name="home"
      label="Página Inicial"
      @click="changeRoute('/')"
    />
    <q-tab
      :ripple="false"
      name="products"
      label="Produtos"
      @click="changeRoute('/products')"
    />
    <q-tab
      :ripple="false"
      name="customers"
      label="Clientes"
      @click="changeRoute('/customers')"
    />
    <q-tab
      :ripple="false"
      name="orders"
      label="Pedidos"
      @click="changeRoute('/orders')"
    />
  </q-tabs>
  <RouterView />
  <q-dialog
    v-model="sudo"
    persistent
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">Modo Administrador</div>
        <q-input label="Usuário" />
        <q-input
          label="Senha"
          type="password"
        />

        <q-btn
          label="Entrar"
          color="green"
          class="q-mt-md"
        />

        <q-btn
          label="Cancelar"
          color="red"
          class="q-ml-md q-mt-md"
          @click="sudo = false"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

</template>

<script setup>
import {
  ref,
  watch
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

const route = useRoute()
const router = useRouter()
const tab = ref('home')
const sudo = ref(false)

function changeRoute(path) {
  router.push(path)
}

watch(() => route.path, (newPath) => {
  if (newPath === '/')
    return tab.value = 'home'

  if (newPath === '/products')
    return tab.value = 'products'

  if (newPath === '/customers')
    return tab.value = 'customers'
}, { immediate: true })
</script>
