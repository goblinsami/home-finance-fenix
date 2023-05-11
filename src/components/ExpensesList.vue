<script setup>
import { CATEGORIES } from 'src/consts'
import { ref } from 'vue'
import FormInput from '../components/FormInput.vue'

const emit = defineEmits(['delete-item', 'edit-item'])

const categories = ref(CATEGORIES)
const showDeleteDialog = ref(false)
const showEditDialog = ref(false)

const selectedExpense = ref(null)

const props = defineProps(['data'])
const categoryStyle = (expense) => {
  return `background-color: ${categories.value.find(el => el.name === expense.category).color}60`
}

const deleteItem = (expense) => {
  showDeleteDialog.value = true
  selectedExpense.value = expense
}

const confirmDelete = () => {
  console.log(selectedExpense.value)
  emit('delete-item', selectedExpense.value)
}

const editExpense = (expense) => {
  selectedExpense.value = expense
  showEditDialog.value = true
}
const handleEdit = () => {
  showEditDialog.value = false
  emit('edit-item')
}

</script>

<template>
  <q-list bordered separator>
    <q-item clickable v-ripple v-for="(expense, index) in props.data" :key="index" :style="categoryStyle(expense)"
      @dblclick="editExpense(expense)">
      <q-item-section>
        <q-item-label> {{ expense.price }} €</q-item-label>
        <q-item-label caption><strong>{{ expense.concept }}</strong></q-item-label>
        <q-item-label caption>{{ expense.date }}</q-item-label>
        <q-item-label caption>{{ expense.category }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn @click="deleteItem(expense)" round icon="close" flat />
      </q-item-section>
    </q-item>
  </q-list>
  <button @click="showDeleteDialog = !showDeleteDialog"></button>

  <q-dialog v-model="showDeleteDialog">
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="primary" text-color="white" />
        <span class="q-ml-sm text-bold">¿Quieres eliminar este gasto de {{ selectedExpense.category }} de {{
          selectedExpense.price }}
          €?</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn label="Aceptar" color="primary" v-close-popup @click="confirmDelete()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="showEditDialog">
    <q-card>
      <q-card-section class="row justify-center">
        <div class="text-h5 q-ma-none">Editar</div>
      </q-card-section>
      <FormInput :expense="selectedExpense" :isEdit="true" @editItem="handleEdit" />
    </q-card>
  </q-dialog>
</template>

<style lang="postcss" scoped>
</style>
