<template>
  <q-table
    flat
    bordered
    ref="tableRef"
    title="Pedidos"
    :rows="rows"
    :columns="columns"
    row-key="id"
    :loading="loading"
    :filter="filter"
    binary-state-sort
    @request="onRequest"
    class="q-table"
  >
    <template v-slot:top-right>
      <q-input
        borderless
        dense
        debounce="300"
        v-model="filter"
        placeholder="Pesquisar"
      />
      <q-btn
        color="primary"
        label="Adicionar Pedido"
        @click="IsAddDialogOpen = true"
      >
      </q-btn>
    </template>

    <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            icon="fa-solid fa-pen-to-square"
            flat
            @click="editRow(props.row)"
          />
        </q-td>
      </template>
  </q-table>
</template>

<script setup>
import { ref } from 'vue'

const rows = ref([
  { id: 1, codigo: '0001', nome: 'João', produtos: '2', precos: 'R$ 100,00', fretes: 'R$ 10,00', data: '01/01/2021', },
  { id: 2, codigo: '0002', nome: 'Maria', produtos: '3', precos: 'R$ 150,00', fretes: 'R$ 15,00', data: '02/01/2021', },
  { id: 3, codigo: '0003', nome: 'José', produtos: '1', precos: 'R$ 50,00', fretes: 'R$ 5,00', data: '03/01/2021', },
  { id: 4, codigo: '0004', nome: 'Ana', produtos: '4', precos: 'R$ 200,00', fretes: 'R$ 20,00', data: '04/01/2021', },
  { id: 5, codigo: '0005', nome: 'Carlos', produtos: '5', precos: 'R$ 250,00', fretes: 'R$ 25,00', data: '05/01/2021', },
  { id: 6, codigo: '0006', nome: 'Marta', produtos: '6', precos: 'R$ 300,00', fretes: 'R$ 30,00', data: '06/01/2021', },
  { id: 7, codigo: '0007', nome: 'Pedro', produtos: '7', precos: 'R$ 350,00', fretes: 'R$ 35,00', data: '07/01/2021', },
  { id: 8, codigo: '0008', nome: 'Paula', produtos: '8', precos: 'R$ 400,00', fretes: 'R$ 40,00', data: '08/01/2021', },
  { id: 9, codigo: '0009', nome: 'Ricardo', produtos: '9', precos: 'R$ 450,00', fretes: 'R$ 45,00', data: '09/01/2021', },
  { id: 10, codigo: '0010', nome: 'Roberta', produtos: '10', precos: 'R$ 500,00', fretes: 'R$ 50,00', data: '10/01/2021', }

])

const columns = ref([
  { name: 'codigo', label: 'Código', align: 'left', field: 'codigo', sortable: true },
  { name: 'nome', label: 'Nome', align: 'left', field: 'nome', sortable: true },
  { name: 'produtos', label: 'Produtos', align: 'left', field: 'produtos', sortable: true },
  { name: 'precos', label: 'Preços', align: 'left', field: 'precos', sortable: true },
  { name: 'fretes', label: 'Fretes', align: 'left', field: 'fretes', sortable: true },
  { name: 'data', label: 'Data', align: 'left', field: 'data', sortable: true },
  { name: 'actions', label: 'Ações', align: 'center', sortable: false }
])


</script>

<style scoped>
.q-table {
  margin-top: 20px;
}

.q-card {
  width: 80rem;
}
</style>
