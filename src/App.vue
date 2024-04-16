<template>
  <q-tabs
    v-model="tab"
    align="justify"
    active-color="dark"
  >
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
