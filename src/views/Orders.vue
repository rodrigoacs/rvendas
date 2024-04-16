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
    v-model:pagination="pagination"
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
        color="green-14"
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

          <template v-slot:body-cell-quantity="props">
            <q-td :props="props">
              <q-input
                v-model.number="props.row.quantity"
                type="number"
                dense
                outlined
                @update:model-value="updatePrice(props.row)"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-product="props">
            <q-td :props="props">
              <q-select
                v-model="props.row.product"
                :options="products"
                dense
                outlined
                @update:model-value="productId => updatePaymentMethods(props.row, productId) || updatePrice(props.row)"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-payment_method="props">
            <q-td :props="props">
              <q-select
                v-model="props.row.payment_method"
                :options="props.row.availablePaymentMethods"
                dense
                outlined
                @update:model-value="updatePrice(props.row)"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-unit_price="props">
            <q-td :props="props">
              <q-input
                v-model="props.row.unit_price"
                readonly
                dense
                outlined
              />
            </q-td>
          </template>

          <template v-slot:body-cell-total_price="props">
            <q-td :props="props">
              <q-input
                v-model="props.row.total_price"
                readonly
                dense
                outlined
              />
            </q-td>
          </template>
        </q-table>

        <q-btn
          color="green-14"
          label="Adicionar Produto"
          @click="addNewRow"
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
          color="green-14"
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
import { ref, onMounted } from 'vue'

const newRowModel = {
  id: 0,
  quantity: 1,
  name: '',
  payment_method: '',
  unit_price: 0,
  total_price: 0
}

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

function addNewRow() {
  newOrderRows.value.push({ ...newRowModel })
}

const loading = ref(false)
const filter = ref('')
const IsAddDialogOpen = ref(false)
const freightValue = ref(0)
const discountValue = ref(0)
const totalPrice = ref(0)
const newOrderRows = ref([])
const pagination = ref({ sortBy: 'codigo', descending: false, page: 1, rowsPerPage: 0 })

const newOrderColumns = ref([
  { name: 'quantity', label: 'Quantidade', align: 'left', field: 'quantity', format: (val, row) => row.quantity },
  { name: 'product', label: 'Produto', align: 'left', field: 'product', format: (val, row) => row.product },
  { name: 'payment_method', label: 'Forma de Pagamento', align: 'left', field: 'payment_method', format: (val, row) => row.payment_method },
  { name: 'unit_price', label: 'Preço Unitário', align: 'left', field: 'unit_price', format: (val, row) => row.unit_price },
  { name: 'total_price', label: 'Preço Total', align: 'left', field: 'total_price', format: (val, row) => row.total_price }
])

const products = ref([])
const paymentOptions = ref({})
const productPrices = ref([])

let selectedProduct = ref(null)

function updatePrice(row) {
  const selectedPaymentMethod = row.availablePaymentMethods.findIndex(method => method.value === row.payment_method.value)
  row.unit_price = productPrices.value[selectedProduct.value][selectedPaymentMethod] || 0
  row.total_price = row.unit_price * row.quantity
}

function updatePaymentMethods(row, productId) {
  selectedProduct = productId

  row.availablePaymentMethods = paymentOptions.value[productId.value] || []
}

function fetchProducts() {
  fetch('http://35.247.196.137/product')
    .then(response => response.json())
    .then(data => {
      products.value = data.map(item => ({
        label: item.name,
        value: item.id
      }))
      data.forEach(item => {
        paymentOptions.value[item.id] = item.forma_de_pagamento.map(method => ({
          label: method,
          value: method
        })),
          productPrices.value[item.id] = item.price
      })
    })
    .catch(error => {
      console.error('Failed to fetch products:', error)
      throw error
    })
}

onMounted(fetchProducts)

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

const observation = ref('')

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
