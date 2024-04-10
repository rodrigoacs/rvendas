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
        <q-btn
          color="primary"
          label="Adicionar Produto"
          class="add-btn"
          @click="IsAddDialogOpen = true"
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

    <q-dialog
      v-model="IsEditDialogOpen"
      persistent
    >
      <q-card class="q-card">
        <q-card-section>
          <div class="text-h6">Editar Produto</div>
          <q-form
            @submit.prevent="saveChanges"
            @reset="resetForm"
          >
            <q-input
              class="q-mt-md"
              filled
              v-model="editableRow.name"
              label="Nome do produto"
            />
            <q-input
              class="q-mt-md"
              type="number"
              filled
              v-model="editableRow.stock"
              label="Estoque"
            />
            <q-input
              class="q-mt-md"
              filled
              mask="####.##"
              v-model="editableRow.price"
              label="Preço"
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

    <q-dialog
      v-model="IsAddDialogOpen"
      persistent
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">Adicionar Produto</div>
        </q-card-section>

        <q-card-section>
          <q-form>
            <q-input
              class="q-mb-md"
              filled
              label="Nome do Produto"
            />
            <q-input
              class="q-mb-md"
              type="number"
              filled
              label="Estoque"
            />
            <q-input
              class="q-mb-md"
              filled
              mask="####.##"
              label="Preço"
            />

            <div class="q-mt-md">
              <q-btn
                label="Salvar"
                type="submit"
                color="primary"
              />
              <q-btn
                label="Cancelar"
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

const IsEditDialogOpen = ref(false)
const IsAddDialogOpen = ref(false)
const editableRow = reactive({ id: '', name: '', stock: 0, price: 0 })

const columns = [
  { name: 'id', align: 'center', label: 'Código', field: 'id', sortable: true, },
  { name: 'name', required: true, label: 'Produto', align: 'left', field: 'name', sortable: true },
  { name: 'forma_de_pagamento', align: 'center', label: 'Forma de Pagamento', field: 'forma_de_pagamento' },
  { name: 'price', align: 'center', label: 'Preço', field: 'price', sortable: true },
  { name: 'actions', align: 'center', label: 'Actions', field: 'actions' }
]

// fit width column
columns[0].style = 'width: 100px'
columns[1].style = 'width: 300px'
columns[2].style = 'width: 100px'
columns[3].style = 'width: 50px'
columns[4].style = 'width: 50px'

const rows = ref([])

const filter = ref('')

onMounted(async () => {
  const response = await fetch('http://35.247.196.137/product')
  const data = await response.json()
  rows.value = data.map(row => ({
    id: row.id,
    name: row.name,
    price: row.price[0],
    priceOptions: row.price.map(option => ({ label: option, value: option })),
    selectedPayment: row.forma_de_pagamento[0],
    paymentOptions: row.forma_de_pagamento.map(option => ({ label: option, value: option })),
  }))
})

function editRow(row) {
  Object.assign(editableRow, row)
  IsEditDialogOpen.value = true
}

function saveChanges() {
  const body = {
    name: editableRow.name,
    stock: editableRow.stock,
    price: editableRow.price,
    selectedPayment: editableRow.selectedPayment.value || editableRow.selectedPayment,
  }

  fetch(`http://35.247.196.137/product/${editableRow.id}`, {
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

  IsEditDialogOpen.value = false
}

function resetForm() {
  IsEditDialogOpen.value = false
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

.q-card {
  width: 80rem;
}

.add-btn {
  width: 180px;
}
</style>