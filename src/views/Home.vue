<template>
  <div class="wrapper">
    <div class="text-h4">Bem vindo ao RVendas. </div>
    <div class="text-h5">{{ currentDate }}</div>
  </div>

  <!-- <div class="wrapper">
    <q-card class="q-card">
      Vendas do dia: {{ dailySales }} <br>
      Vendas do mês: {{ monthlySales }} <br>
      Total de pedidos: {{ totalOrders }} <br>
      Total de produtos: {{ totalProducts }} <br>
      Total de clientes: {{ totalClients }} <br>
    </q-card>
  </div> -->
</template>

<script setup>
import { ref } from 'vue'

const currentDate = ref(new Date().toLocaleString())
// const dailySales = (Math.random() * 1000).toFixed(2)
// const monthlySales = (Math.random() * 1000).toFixed(2)
// const totalOrders = Math.floor(Math.random() * 100)
// const totalProducts = Math.floor(Math.random() * 100)
// const totalClients = Math.floor(Math.random() * 100)

setInterval(() => {
  currentDate.value = new Date().toLocaleString()
}, 200)

</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 20px;
  margin-top: 20px;
}

.q-card {
  padding: 20px;
}
</style>