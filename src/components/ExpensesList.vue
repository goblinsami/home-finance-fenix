<script setup>
import { CATEGORIES } from 'src/consts'
import { ref } from 'vue'

const categories = ref(CATEGORIES)

const props = defineProps(['data'])
const categoryStyle = (expense) => {
  return `background-color: ${categories.value.find(el => el.name === expense.category).color}60`
}
</script>

<template>
  <q-list bordered separator>
    <q-item clickable v-ripple v-for="(expense, index) in props.data" :key="index" :style="categoryStyle(expense)">
      <q-item-section>
        <q-item-label> {{ expense.price }} €</q-item-label>
        <q-item-label caption><strong>{{ expense.concept }}</strong></q-item-label>
        <q-item-label caption>{{ expense.date }}</q-item-label>
        <q-item-label caption>{{ expense.category }}</q-item-label>

      </q-item-section>
    </q-item>
  </q-list>
</template>

<style lang="postcss" scoped>
</style>
