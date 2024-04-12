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
        class="btn"
      >
      </q-btn>
    </template>

    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          label="⚙️"
          flat
          @click="editRow(props.row)"
        />
      </q-td>
    </template>
  </q-table>

  <q-dialog v-model="IsAddDialogOpen">
    <q-card class="q-card">
      <q-card-section>
        <div class="text-h6">Novo Pedido</div>
      </q-card-section>
      <q-card-section>
        <q-table
          flat
          bordered
          title="Produtos"
          :rows="newOrderRows"
          :columns="newOrderColumns"
          row-key="id"
          binary-state-sort
          @request="onRequest"
          class="q-table"
          :rows-per-page-options="[0]"
        >
        </q-table>
        <q-btn
          color="primary"
          label="Adicionar Produto"
          @click="row => newOrderRows.push({ id: newOrderRows.length + 1, quantity: 1, name: 'Produto', unit_price: '', total_price: '' })"
          class="btn add-product-btn"
        ></q-btn>
      </q-card-section>

      <q-card-section class="order-footer">
        <div>
          <q-select
            v-model="selectedClient"
            :options="clients"
            label="Cliente"
            dense
            options-dense
            outlined
          />

          <q-input
            v-model="clientInfo"
            dense
            outlined
            readonly
          />

          <q-input
            v-model="observation"
            dense
            outlined
            label="Observações"
          />
        </div>
        <div>

          <q-input
            v-model="freightValue"
            label="Valor do Frete"
            type="number"
            dense
          />

          <q-input
            v-model="totalPrice"
            label="Valor Total"
            type="number"
            dense
            readonly
          >
          </q-input>

          <q-input
            v-model="discountValue"
            label="Valor com Desconto"
            type="number"
            dense
          />
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          class="btn"
          color="primary"
          label="Salvar"
          @click="saveOrder"
        />
        <q-btn
          class="btn"
          color="red"
          label="Cancelar"
          @click="IsAddDialogOpen = false"
        />
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

const rows = ref([
  { id: 1, codigo: '1', nome: 'João', produtos: '2', precos: 'R$ 100,00', fretes: 'R$ 10,00', data: '01/01/2021', },
  { id: 2, codigo: '2', nome: 'Maria', produtos: '3', precos: 'R$ 150,00', fretes: 'R$ 15,00', data: '02/01/2021', },
  { id: 3, codigo: '3', nome: 'José', produtos: '1', precos: 'R$ 50,00', fretes: 'R$ 5,00', data: '03/01/2021', },
  { id: 4, codigo: '4', nome: 'Ana', produtos: '4', precos: 'R$ 200,00', fretes: 'R$ 20,00', data: '04/01/2021', },
  { id: 5, codigo: '5', nome: 'Carlos', produtos: '5', precos: 'R$ 250,00', fretes: 'R$ 25,00', data: '05/01/2021', },
  { id: 6, codigo: '6', nome: 'Marta', produtos: '6', precos: 'R$ 300,00', fretes: 'R$ 30,00', data: '06/01/2021', },
  { id: 7, codigo: '7', nome: 'Pedro', produtos: '7', precos: 'R$ 350,00', fretes: 'R$ 35,00', data: '07/01/2021', },
  { id: 8, codigo: '8', nome: 'Paula', produtos: '8', precos: 'R$ 400,00', fretes: 'R$ 40,00', data: '08/01/2021', },
  { id: 9, codigo: '9', nome: 'Ricardo', produtos: '9', precos: 'R$ 450,00', fretes: 'R$ 45,00', data: '09/01/2021', },
  { id: 10, codigo: '10', nome: 'Roberta', produtos: '10', precos: 'R$ 500,00', fretes: 'R$ 50,00', data: '10/01/2021', }
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

const loading = ref(false)
const filter = ref('')
const IsAddDialogOpen = ref(false)
const freightValue = ref(0)
const discountValue = ref(0)

const totalPrice = ref(0)

const newOrderRows = ref([])

const newOrderColumns = ref([
  { name: 'quantity', label: 'Quantidade', align: 'left', field: 'quantity' },
  { name: 'product', label: 'Produto', align: 'left', field: 'name' },
  { name: 'payment_method', label: 'Forma de Pagamento', align: 'left', field: 'payment_method' },
  { name: 'unit_price', label: 'Preço Unitário', align: 'left', field: 'unit_price' },
  { name: 'total_price', label: 'Preço Total', align: 'left', field: 'total_price' },
])

const selectedClient = ref('')

const clients = ref([
  { label: 'João' },
  { label: 'Maria' },
  { label: 'José' },
  { label: 'Ana' },
  { label: 'Carlos' },
  { label: 'Marta' },
  { label: 'Pedro' },
  { label: 'Paula' },
  { label: 'Ricardo' },
  { label: 'Roberta' },
])

const clientInfo = ref('rua 1, bairro 1, nº 1')
</script>

<style scoped>
.q-table {
  margin-top: 20px;
}

.q-card {
  width: 80rem;
  max-width: 100rem !important;
}

.btn {
  width: 180px;
}

.add-product-btn {
  margin-top: 20px;
  margin-left: calc(50% - 90px);
}

.order-footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
}

.order-footer * {
  width: 100%;
  max-width: 38rem;
}

.order-footer div {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
