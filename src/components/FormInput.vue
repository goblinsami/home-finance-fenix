<script setup>
import { ref, onMounted } from 'vue'
import { CATEGORIES } from 'src/consts'
import moment from 'moment'
import { mainComposable } from '../composables/main'

const props = defineProps(['expense', 'isEdit'])

const emit = defineEmits(['add-item', 'edit-item'])

const categories = ref(CATEGORIES)
const today = ref(moment().format('YYYY/MM/DD'))
const { _editExpenseFromDB } = mainComposable()

const formData = ref({
  price: null,
  concept: null,
  category: null,
  date: null
})
const addItem = () => {
  console.log('as')
  if (props.isEdit) {
    _editExpenseFromDB(props.expense.id, formData.value)
    emit('edit-item', formData.value)
  } else {
    emit('add-item', formData.value)

  }
}

onMounted(() => {
  formData.value.date = today.value
  if (props.expense) {
    formData.value = props.expense
  }
  console.log(props.isEdit)
})
</script>

<template>
  <article class="q-px-lg">
    <q-input v-model="formData.price" label="Añade Gastos €" type="number" />
    <q-input v-model="formData.concept" label="Contepto" type="text" />

    <q-select v-model="formData.category" :options="categories.map(el => el.name)" label="Categoría" />

    <q-input flat v-model="formData.date" mask="date" :rules="['date']">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date first-day-of-week="1" v-model="formData.date">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <div class="row justify-center q-my-sm">
      <q-btn outline style="color: gray" :icon="props.isEdit ? 'edit' : 'add'" @click="addItem()" class="q-my-sm" />
    </div>
  </article>
</template>

<style lang="postcss" scoped>
</style>
