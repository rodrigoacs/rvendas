<template>
  <div>
    <q-table
      flat
      bordered
      ref="tableRef"
      title="Produtos"
      :rows="rows"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :loading="loading"
      :filter="filter"
      binary-state-sort
      @request="onRequest"
      class="q-table"
    >
      <template v-slot:body-cell-forma_de_pagamento="props">
        <q-td :props="props">
          <q-select
            v-model="props.row.selectedPayment"
            :options="props.row.paymentOptions"
            @update:model-value="val => updatePrice(props.row, val)"
            dense
            options-dense
            outlined
            style="width: 100%; max-width: 300px"
          />
        </q-td>
      </template>

      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Pesquisar"
        />
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

    <q-dialog
      v-model="isDialogOpen"
      persistent
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">Editar Produto</div>
        </q-card-section>

        <q-card-section>
          <q-form
            @submit.prevent="saveChanges"
            @reset="resetForm"
          >
            <q-input
              filled
              v-model="editableRow.name"
              label="Product Name"
            />
            <q-input
              type="number"
              filled
              v-model="editableRow.stock"
              label="Stock"
            />
            <q-input
              filled
              mask="####.##"
              v-model="editableRow.price"
              label="Price"
            />

            <div class="q-mt-md">
              <q-btn
                label="Save"
                type="submit"
                color="primary"
              />
              <q-btn
                label="Cancel"
                type="reset"
                flat
                color="primary"
                v-close-popup
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'

const isDialogOpen = ref(false)
const editableRow = reactive({ id: '', name: '', stock: 0, price: 0 })

const columns = [
  { name: 'id', align: 'center', label: 'Código', field: 'id', sortable: true },
  { name: 'name', required: true, label: 'Produto', align: 'left', field: 'name', sortable: true },
  { name: 'stock', align: 'center', label: 'Estoque', field: 'stock', sortable: true },
  { name: 'forma_de_pagamento', align: 'center', label: 'Forma de Pagamento', field: 'forma_de_pagamento' },
  { name: 'price', align: 'center', label: 'Preço', field: 'price', sortable: true },
  { name: 'actions', align: 'center', label: 'Actions', field: 'actions' }
]

const rows = ref([])

const filter = ref('')

const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 5
})

const loading = ref(false)

function onRequest({ pagination, filter }) {
  loading.value = true
  console.log(filter)
  // fetch(`http://localhost:3000/product?_page=${pagination.page}&_limit=${pagination.rowsPerPage}&_sort=${pagination.sortBy}&_order=${pagination.descending ? 'desc' : 'asc'}&q=${filter}`)
  //   .then(response => response.json())
  //   .then(data => {
  //     rows.value = data.map(row => ({
  //       id: row.id,
  //       name: row.name,
  //       stock: row.stock,
  //       price: row.price[0],
  //       priceOptions: row.price.map(option => ({ label: option, value: option })),
  //       selectedPayment: row.forma_de_pagamento[0],
  //       paymentOptions: row.forma_de_pagamento.map(option => ({ label: option, value: option })),
  //     }))
  //     loading.value = false
  //   })
}

onMounted(async () => {
  const response = await fetch('http://localhost:3000/product')
  const data = await response.json()
  rows.value = data.map(row => ({
    id: row.id,
    name: row.name,
    stock: row.stock,
    price: row.price[0],
    priceOptions: row.price.map(option => ({ label: option, value: option })),
    selectedPayment: row.forma_de_pagamento[0],
    paymentOptions: row.forma_de_pagamento.map(option => ({ label: option, value: option })),
  }))
})

function editRow(row) {
  Object.assign(editableRow, row)
  isDialogOpen.value = true
}

function saveChanges() {
  const body = {
    name: editableRow.name,
    stock: editableRow.stock,
    price: editableRow.price,
    selectedPayment: editableRow.selectedPayment.value || editableRow.selectedPayment,
  }

  fetch(`http://localhost:3000/product/${editableRow.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(() => {
    const priceIndex = editableRow.paymentOptions.findIndex(option => option.value === body.selectedPayment)
    editableRow.priceOptions[priceIndex] = { label: parseFloat(editableRow.price), value: parseFloat(editableRow.price) }

    const index = rows.value.findIndex(row => row.id === editableRow.id)
    rows.value[index] = { ...editableRow }
  })

  isDialogOpen.value = false
}

function resetForm() {
  isDialogOpen.value = false
}

function updatePrice(row, selectedValue) {
  const priceIndex = row.paymentOptions.findIndex(option => option.value === selectedValue.value)
  const price = row.priceOptions[priceIndex].value
  row.price = price
}


</script>


<style scoped>
.q-table {
  margin-top: 20px;
}
</style>