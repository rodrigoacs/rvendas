<template>
  <div>
    <q-table
      flat
      bordered
      ref="tableRef"
      title="Clientes"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :filter="filter"
      binary-state-sort
      @request="onRequest"
      class="q-table"
      v-model:pagination="pagination"
      hide-bottom

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
            style="width: 100%; width: 300px"
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
          color="teal-14"
          label="Adicionar Cliente"
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
      <q-card>
        <q-card-section>
          <div class="text-h6">Editar Cliente</div>
        </q-card-section>

        <q-card-section>
          <q-form
            @submit.prevent="saveChanges"
            @reset="resetForm"
          >
            <q-input
              filled
              v-model="editableRow.name"
              label="Customer Name"
            />
            <q-input
              filled
              v-model="editableRow.email"
              label="Email"
            />
            <q-input
              filled
              v-model="editableRow.phone"
              label="Phone"
            />

            <div class="q-mt-md">
              <q-btn
                label="Save"
                type="submit"
                color="green"
              />
              <q-btn
                label="Cancel"
                type="reset"
                flat
                color="red"
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
      <q-card class="q-card">
        <q-card-section>
          <div class="text-h6">Adicionar Cliente</div>
        </q-card-section>

        <q-card-section>
          <q-form>
            <q-input
              class="q-mb-md"
              filled
              v-model="editableRow.name"
              label="Nome"
            />
            <q-input
              class="q-mb-md"
              filled
              v-model="editableRow.street_address"
              label="Rua"
            />
            <q-input
              class="q-mb-md"
              filled
              v-model="editableRow.neighborhood"
              label="Bairro"
            />
            <q-input
              class="q-mb-md"
              filled
              v-model="editableRow.house_number"
              label="Numero"
            />
            <q-input
              class="q-mb-md"
              filled
              v-model="editableRow.phone_number"
              label="Telefone"
            />

            <div class="q-mt-md">
              <q-btn
                label="Salvar"
                type="submit"
                color="green"
              />
              <q-btn
                label="Cancelar"
                flat
                color="red"
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
import { ref, onMounted } from 'vue'

const rows = ref([])
const IsEditDialogOpen = ref(false)
const IsAddDialogOpen = ref(false)
const editableRow = ref({})
const filter = ref('')
const loading = ref(false)
const pagination = ref({ sortBy: 'id', descending: false, page: 1, rowsPerPage: 0 })


const columns = [
  { name: 'id', label: 'Código', align: 'left', field: 'id' },
  { name: 'name', label: 'Nome', align: 'left', field: 'name' },
  { name: 'street_address', label: 'Rua', align: 'left', field: 'street_address' },
  { name: 'neighborhood', label: 'Bairro', align: 'left', field: 'neighborhood' },
  { name: 'house_number', label: 'Numero', align: 'left', field: 'house_number' },
  { name: 'phone_number', label: 'Telefone', align: 'left', field: 'phone_number' },
  { name: 'actions', align: 'center', label: 'Editar', field: 'actions' }
]

columns[0].style = 'width: 100px'
columns[1].style = 'width: 300px'
columns[2].style = 'width: 100px'
columns[3].style = 'width: 50px'
columns[4].style = 'width: 50px'
columns[5].style = 'width: 100px'
columns[6].style = 'width: 50px'


function editRow(row) {
  Object.assign(editableRow, row)
  IsEditDialogOpen.value = true
}

onMounted(async () => {
  const response = await fetch('http://35.247.196.137/customer')
  const data = await response.json()
  rows.value = data.map(row => ({
    id: row.id,
    name: row.name,
    street_address: row.street_address,
    neighborhood: row.neighborhood,
    house_number: row.house_number,
    phone_number: row.phone_number
  }))
})

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