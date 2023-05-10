<template>
  <section>
    <article style="background-color: #e0e0e0" class="row justify-center items-center">
      <div class="text-h5 text-bold text-positive">
        Home Finance Fenix
        <q-icon name="bird" size="lg" color="positive" />
      </div>
    </article>
    <article class="row justify-center">
      <div class="q-my-md text-h5 text-bold">
        {{ currentMonth }}
      </div>
      <div class="q-my-md text-h5 q-px-sm">{{ expensesAmount }} €</div>
    </article>
    <article class="bars-container">
      <Bar :key="chartKey" :data="data" :options="options" />
      <div class="row justify-center">
        <q-date v-model="date" minimal @navigation="(a) => changeMonth(a)"
          :events="filteredExpenses().map((el) => el.date)" />
      </div>
      <ul>
        <li v-for="expense in filterExpensesByDay()" :key="expense.id">
          {{ expense.concept }} -- <span class="text-bold" :style="`color: ${categoryColor(expense.category)}`"> {{
            expense.price }}€ {{
    expense.category
  }}</span>
        </li>
      </ul>

      <article class="q-px-xs row justify-center">
        <q-btn :style="setButtonColor(button)" v-for="(button, index) in buttons" :key="index" :label="button.name"
          @click="setActive(button, index)" class="q-ma-sm text-white" />
      </article>
      {{ sortExpenses }}
      {{ setPriceFilter }}
      <q-btn :icon="`keyboard_arrow_${sortExpenses.byDate ? 'up' : 'down'}`" @click="toggleSortByDate()">Ordenar por
        fecha</q-btn>
      <q-btn :icon="`keyboard_arrow_${sortExpenses.byPrice ? 'up' : 'down'}`" @click="toggleSortByPrice()">Ordenar por
        precio €</q-btn>
      {{ filteredExpenses().length }}
      {{ monthExpenses.length }}
      <Doughnut :data="doughnutData" :options="options" />
      <ExpensesList :data="filteredExpenses()" />
    </article>
  </section>
  <div>

  </div>
</template>

<script setup>
import moment from 'moment'
import { ref, onMounted } from 'vue'
import { options } from '../chartConfig.js'
import ExpensesList from '../components/ExpensesList.vue'
import { CATEGORIES } from 'src/consts'

/* import { mainComposable } from '../composables/main' */
import {
  Chart as ChartJS,
  Title,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'
ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend)
/* const { _getExpensesFromDB } = mainComposable() */
const dataSets = ref(null)
const currentMonth = ref(null)
const currentMonthNumber = ref(moment().month())
const expensesAmount = ref(323)
const expenses = ref(null)
const setPriceFilter = ref(false)
const monthExpenses = ref([])

const categories = ref(CATEGORIES)
const sortExpenses = ref({
  byDate: false,
  byPrice: null
})

const chartKey = ref(0)
const date = ref(moment().format('YYYY/MM/DD'))
const hardExpenses = ref([
  {
    id: 11,
    price: 25,
    concept: 'Pizza ',
    category: 'Comida a Domicilio',
    date: '2023/03/08',
    created_at: '2023-03-09T20:09:41.596Z',
    updated_at: '2023-03-09T20:09:41.596Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/11.json'
  },
  {
    id: 12,
    price: 15,
    concept: 'Sirena ',
    category: 'Supermercado',
    date: '2023/03/09',
    created_at: '2023-03-09T20:11:24.794Z',
    updated_at: '2023-03-09T20:11:24.794Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/12.json'
  },
  {
    id: 13,
    price: 6,
    concept: 'Caprabo',
    category: 'Supermercado',
    date: '2023/03/07',
    created_at: '2023-03-09T20:11:38.552Z',
    updated_at: '2023-03-09T20:11:38.552Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/13.json'
  },
  {
    id: 78,
    price: 4,
    concept: 'Cañas terra galega',
    category: 'Restaurante',
    date: '2023/04/09',
    created_at: '2023-04-09T13:46:38.747Z',
    updated_at: '2023-04-09T13:46:38.747Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/78.json'
  },
  {
    id: 15,
    price: 42,
    concept: 'Turuleca ',
    category: 'Restaurante',
    date: '2023/03/09',
    created_at: '2023-03-09T22:12:26.174Z',
    updated_at: '2023-03-09T22:12:26.174Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/15.json'
  },
  {
    id: 18,
    price: 16,
    concept: 'Bacallà mercat de Sants ',
    category: 'Supermercado',
    date: '2023/03/11',
    created_at: '2023-03-11T21:44:22.622Z',
    updated_at: '2023-03-11T21:44:22.622Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/18.json'
  },
  {
    id: 19,
    price: 4,
    concept: 'Formatge llet crua',
    category: 'Supermercado',
    date: '2023/03/11',
    created_at: '2023-03-11T21:44:39.358Z',
    updated_at: '2023-03-11T21:44:39.358Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/19.json'
  },
  {
    id: 20,
    price: 10,
    concept: 'Seitons olives i mes Mercat',
    category: 'Supermercado',
    date: '2023/03/11',
    created_at: '2023-03-11T21:45:24.945Z',
    updated_at: '2023-03-11T21:45:24.945Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/20.json'
  },
  {
    id: 21,
    price: 9,
    concept: 'Gluck aperitivo',
    category: 'Restaurante',
    date: '2023/03/11',
    created_at: '2023-03-11T21:45:41.131Z',
    updated_at: '2023-03-11T21:45:41.131Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/21.json'
  },
  {
    id: 22,
    price: 8,
    concept: 'Gambas Mercat Sants ',
    category: 'Supermercado',
    date: '2023/03/11',
    created_at: '2023-03-11T21:46:06.005Z',
    updated_at: '2023-03-11T21:46:06.005Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/22.json'
  },
  {
    id: 23,
    price: 3,
    concept: 'Verduras Sants',
    category: 'Supermercado',
    date: '2023/03/11',
    created_at: '2023-03-11T21:46:52.459Z',
    updated_at: '2023-03-11T21:46:52.459Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/23.json'
  },
  {
    id: 25,
    price: 4,
    concept: 'Birras comida',
    category: 'Supermercado',
    date: '2023/03/11',
    created_at: '2023-03-12T10:56:47.734Z',
    updated_at: '2023-03-12T10:56:47.734Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/25.json'
  },
  {
    id: 26,
    price: 3,
    concept: 'Turris pan',
    category: 'Supermercado',
    date: '2023/03/11',
    created_at: '2023-03-12T10:57:15.014Z',
    updated_at: '2023-03-12T10:57:15.014Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/26.json'
  },
  {
    id: 27,
    price: 4,
    concept: 'Frutería ',
    category: 'Supermercado',
    date: '2023/03/11',
    created_at: '2023-03-12T10:57:25.316Z',
    updated_at: '2023-03-12T10:57:25.316Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/27.json'
  },
  {
    id: 34,
    price: 40,
    concept: 'Casa blanca',
    category: 'Restaurante',
    date: '2023/03/16',
    created_at: '2023-03-16T21:36:30.379Z',
    updated_at: '2023-03-16T21:36:30.379Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/34.json'
  },
  {
    id: 35,
    price: 25,
    concept: 'Taco munch',
    category: 'Comida a Domicilio',
    date: '2023/03/14',
    created_at: '2023-03-16T21:37:14.078Z',
    updated_at: '2023-03-16T21:37:14.078Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/35.json'
  },
  {
    id: 36,
    price: 39,
    concept: 'Auga',
    category: 'Facturas',
    date: '2023/03/22',
    created_at: '2023-03-22T17:29:34.241Z',
    updated_at: '2023-03-22T17:29:34.241Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/36.json'
  },
  {
    id: 37,
    price: 16,
    concept: 'Carrefour',
    category: 'Supermercado',
    date: '2023/03/21',
    created_at: '2023-03-22T17:29:54.777Z',
    updated_at: '2023-03-22T17:29:54.777Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/37.json'
  },
  {
    id: 38,
    price: 22,
    concept: 'Burrito ',
    category: 'Comida a Domicilio',
    date: '2023/03/19',
    created_at: '2023-03-22T17:30:51.917Z',
    updated_at: '2023-03-22T17:30:51.917Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/38.json'
  },
  {
    id: 39,
    price: 9,
    concept: 'Polo bona carn',
    category: 'Supermercado',
    date: '2023/03/21',
    created_at: '2023-03-22T17:31:32.609Z',
    updated_at: '2023-03-22T17:31:32.609Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/39.json'
  },
  {
    id: 41,
    price: 65,
    concept: 'Endesa',
    category: 'Facturas',
    date: '2023/03/20',
    created_at: '2023-03-22T17:32:42.225Z',
    updated_at: '2023-03-22T17:32:42.225Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/41.json'
  },
  {
    id: 43,
    price: 10,
    concept: 'Lomo y queso',
    category: 'Supermercado',
    date: '2023/03/23',
    created_at: '2023-03-23T22:24:51.865Z',
    updated_at: '2023-03-23T22:24:51.865Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/43.json'
  },
  {
    id: 44,
    price: 4,
    concept: 'Birras',
    category: 'Restaurante',
    date: '2023/03/23',
    created_at: '2023-03-23T22:25:05.504Z',
    updated_at: '2023-03-23T22:25:05.504Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/44.json'
  },
  {
    id: 45,
    price: 6,
    concept: 'Pan y buñuelos',
    category: 'Supermercado',
    date: '2023/03/23',
    created_at: '2023-03-23T22:25:16.980Z',
    updated_at: '2023-03-23T22:25:16.980Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/45.json'
  },
  {
    id: 46,
    price: 1,
    concept: 'Tomates',
    category: 'Supermercado',
    date: '2023/03/23',
    created_at: '2023-03-23T22:25:51.263Z',
    updated_at: '2023-03-23T22:25:51.263Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/46.json'
  },
  {
    id: 47,
    price: 25,
    concept: 'Japones youme',
    category: 'Comida a Domicilio',
    date: '2023/03/24',
    created_at: '2023-03-25T12:31:30.289Z',
    updated_at: '2023-03-25T12:31:30.289Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/47.json'
  },
  {
    id: 48,
    price: 10,
    concept: 'Cañas corts',
    category: 'Restaurante',
    date: '2023/03/24',
    created_at: '2023-03-25T12:31:43.169Z',
    updated_at: '2023-03-25T12:31:43.169Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/48.json'
  },
  {
    id: 49,
    price: 12,
    concept: 'Pollo mercado',
    category: 'Supermercado',
    date: '2023/03/25',
    created_at: '2023-03-25T12:32:22.143Z',
    updated_at: '2023-03-25T12:32:22.143Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/49.json'
  },
  {
    id: 50,
    price: 8,
    concept: 'Gildas y banderillas',
    category: 'Supermercado',
    date: '2023/03/25',
    created_at: '2023-03-25T12:32:43.796Z',
    updated_at: '2023-03-25T12:32:43.796Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/50.json'
  },
  {
    id: 51,
    price: 9,
    concept: 'Cañas gluck',
    category: 'Restaurante',
    date: '2023/03/25',
    created_at: '2023-03-25T12:59:27.134Z',
    updated_at: '2023-03-25T12:59:27.134Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/51.json'
  },
  {
    id: 52,
    price: 11,
    concept: 'Saco semillas',
    category: 'Hogar',
    date: '2023/03/25',
    created_at: '2023-03-25T13:13:44.199Z',
    updated_at: '2023-03-25T13:13:44.199Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/52.json'
  },
  {
    id: 53,
    price: 54,
    concept: 'Las sorrentinas pasta bar',
    category: 'Restaurante',
    date: '2023/03/25',
    created_at: '2023-03-25T22:04:17.577Z',
    updated_at: '2023-03-25T22:04:17.577Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/53.json'
  },
  {
    id: 54,
    price: 15,
    concept: 'Carrefour',
    category: 'Supermercado',
    date: '2023/03/28',
    created_at: '2023-03-28T11:17:14.937Z',
    updated_at: '2023-03-28T11:17:14.937Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/54.json'
  },
  {
    id: 55,
    price: 25,
    concept: 'Cena hamburguesa',
    category: 'Comida a Domicilio',
    date: '2023/03/28',
    created_at: '2023-03-29T12:35:36.716Z',
    updated_at: '2023-03-29T12:35:36.716Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/55.json'
  },
  {
    id: 56,
    price: 6,
    concept: 'Anchoas mercado',
    category: 'Supermercado',
    date: '2023/03/29',
    created_at: '2023-03-29T12:35:49.073Z',
    updated_at: '2023-03-29T12:35:49.073Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/56.json'
  },
  {
    id: 57,
    price: 6,
    concept: 'Fresas mercado',
    category: 'Supermercado',
    date: '2023/03/29',
    created_at: '2023-03-29T12:35:55.178Z',
    updated_at: '2023-03-29T12:35:55.178Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/57.json'
  },
  {
    id: 58,
    price: 3,
    concept: 'Croquetas montero',
    category: 'Supermercado',
    date: '2023/03/29',
    created_at: '2023-03-29T12:36:06.889Z',
    updated_at: '2023-03-29T12:36:06.889Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/58.json'
  },
  {
    id: 59,
    price: 120,
    concept: 'Mundana',
    category: 'Restaurante',
    date: '2023/03/29',
    created_at: '2023-03-29T22:01:17.640Z',
    updated_at: '2023-03-29T22:01:17.640Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/59.json'
  },
  {
    id: 60,
    price: 8,
    concept: 'Carrefour comida',
    category: 'Supermercado',
    date: '2023/03/30',
    created_at: '2023-03-30T13:35:39.982Z',
    updated_at: '2023-03-30T13:35:39.982Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/60.json'
  },
  {
    id: 61,
    price: 4,
    concept: 'Cañas terra',
    category: 'Restaurante',
    date: '2023/03/30',
    created_at: '2023-03-30T13:35:52.097Z',
    updated_at: '2023-03-30T13:35:52.097Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/61.json'
  },
  {
    id: 62,
    price: 25,
    concept: 'Taco munch',
    category: 'Comida a Domicilio',
    date: '2023/04/02',
    created_at: '2023-04-02T20:49:00.491Z',
    updated_at: '2023-04-02T20:49:00.491Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/62.json'
  },
  {
    id: 63,
    price: 33,
    concept: 'Youme',
    category: 'Comida a Domicilio',
    date: '2023/04/02',
    created_at: '2023-04-02T20:49:07.914Z',
    updated_at: '2023-04-02T20:49:07.914Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/63.json'
  },
  {
    id: 64,
    price: 5,
    concept: 'Desayuno LAmetlla ',
    category: 'Restaurante',
    date: '2023/04/02',
    created_at: '2023-04-02T20:49:42.505Z',
    updated_at: '2023-04-02T20:49:42.505Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/64.json'
  },
  {
    id: 65,
    price: 44,
    concept: 'Comida La Serra LAmetlla ',
    category: 'Restaurante',
    date: '2023/04/01',
    created_at: '2023-04-02T20:49:54.108Z',
    updated_at: '2023-04-02T20:49:54.108Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/65.json'
  },
  {
    id: 66,
    price: 36,
    concept: 'Cena La bandarra LAmetlla ',
    category: 'Restaurante',
    date: '2023/03/31',
    created_at: '2023-04-02T20:50:26.903Z',
    updated_at: '2023-04-02T20:50:26.903Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/66.json'
  },
  {
    id: 67,
    price: 10,
    concept: 'Spar LAmetlla ',
    category: 'Supermercado',
    date: '2023/04/01',
    created_at: '2023-04-02T20:50:55.026Z',
    updated_at: '2023-04-02T20:50:55.026Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/67.json'
  },
  {
    id: 68,
    price: 6,
    concept: 'Caprabo',
    category: 'Supermercado',
    date: '2023/04/03',
    created_at: '2023-04-05T14:04:25.622Z',
    updated_at: '2023-04-05T14:04:25.622Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/68.json'
  },
  {
    id: 69,
    price: 20,
    concept: 'Montero',
    category: 'Comida a Domicilio',
    date: '2023/04/05',
    created_at: '2023-04-05T14:04:45.102Z',
    updated_at: '2023-04-05T14:04:45.102Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/69.json'
  },
  {
    id: 70,
    price: 12,
    concept: 'Longanizas e máis embutidos Mercat',
    category: 'Supermercado',
    date: '2023/04/08',
    created_at: '2023-04-08T12:05:02.676Z',
    updated_at: '2023-04-08T12:05:02.676Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/70.json'
  },
  {
    id: 71,
    price: 8,
    concept: 'Froitas Mercat',
    category: 'Supermercado',
    date: '2023/04/08',
    created_at: '2023-04-08T12:05:14.320Z',
    updated_at: '2023-04-08T12:05:14.320Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/71.json'
  },
  {
    id: 72,
    price: 9,
    concept: 'Queixo llet crua',
    category: 'Supermercado',
    date: '2023/04/08',
    created_at: '2023-04-08T12:05:21.673Z',
    updated_at: '2023-04-08T12:05:21.673Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/72.json'
  },
  {
    id: 73,
    price: 9,
    concept: 'Pan tarta turris',
    category: 'Supermercado',
    date: '2023/04/08',
    created_at: '2023-04-08T12:05:52.295Z',
    updated_at: '2023-04-08T12:05:52.295Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/73.json'
  },
  {
    id: 74,
    price: 24,
    concept: 'Tgb',
    category: 'Comida a Domicilio',
    date: '2023/04/07',
    created_at: '2023-04-08T12:06:17.382Z',
    updated_at: '2023-04-08T12:06:17.382Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/74.json'
  },
  {
    id: 75,
    price: 34,
    concept: 'Youme',
    category: 'Comida a Domicilio',
    date: '2023/04/05',
    created_at: '2023-04-08T12:06:33.206Z',
    updated_at: '2023-04-08T12:06:33.206Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/75.json'
  },
  {
    id: 76,
    price: 30,
    concept: 'Cena mi tierra c Fede y Núria ',
    category: 'Restaurante',
    date: '2023/04/08',
    created_at: '2023-04-09T12:44:54.825Z',
    updated_at: '2023-04-09T12:44:54.825Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/76.json'
  },
  {
    id: 77,
    price: 9,
    concept: 'Bonarea domingo',
    category: 'Supermercado',
    date: '2023/04/09',
    created_at: '2023-04-09T12:45:09.455Z',
    updated_at: '2023-04-09T12:45:09.455Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/77.json'
  },
  {
    id: 79,
    price: 8,
    concept: 'Birras pan',
    category: 'Supermercado',
    date: '2023/04/09',
    created_at: '2023-04-09T13:47:02.804Z',
    updated_at: '2023-04-09T13:47:02.804Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/79.json'
  },
  {
    id: 92,
    price: 12,
    concept: 'Caprabo ',
    category: 'Supermercado',
    date: '2023/04/11',
    created_at: '2023-04-11T18:12:17.685Z',
    updated_at: '2023-04-11T18:12:17.685Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/92.json'
  },
  {
    id: 93,
    price: 25,
    concept: 'Frutos secos via dolça',
    category: 'Supermercado',
    date: '2023/04/11',
    created_at: '2023-04-11T18:12:32.568Z',
    updated_at: '2023-04-11T18:12:32.568Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/93.json'
  },
  {
    id: 94,
    price: 32,
    concept: 'Japonés Youme',
    category: 'Comida a Domicilio',
    date: '2023/04/10',
    created_at: '2023-04-11T18:12:58.897Z',
    updated_at: '2023-04-11T18:12:58.897Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/94.json'
  },
  {
    id: 95,
    price: 17,
    concept: 'Cena coreana',
    category: 'Comida a Domicilio',
    date: '2023/04/11',
    created_at: '2023-04-11T20:09:03.263Z',
    updated_at: '2023-04-11T20:09:03.263Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/95.json'
  },
  {
    id: 96,
    price: 32,
    concept: 'Cea youme japo',
    category: 'Comida a Domicilio',
    date: '2023/04/15',
    created_at: '2023-04-15T21:55:53.800Z',
    updated_at: '2023-04-15T21:55:53.800Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/96.json'
  },
  {
    id: 97,
    price: 25,
    concept: 'Comida xemeneia',
    category: 'Restaurante',
    date: '2023/04/23',
    created_at: '2023-04-23T14:34:48.782Z',
    updated_at: '2023-04-23T14:34:48.782Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/97.json'
  },
  {
    id: 98,
    price: 20,
    concept: 'Cena blai impro',
    category: 'Restaurante',
    date: '2023/04/21',
    created_at: '2023-04-23T14:36:44.170Z',
    updated_at: '2023-04-23T14:36:44.170Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/98.json'
  },
  {
    id: 99,
    price: 30,
    concept: 'Fausia',
    category: 'Hogar',
    date: '2023/04/25',
    created_at: '2023-04-25T11:52:03.867Z',
    updated_at: '2023-04-25T11:52:03.867Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/99.json'
  },
  {
    id: 100,
    price: 30,
    concept: 'Fausia',
    category: 'Hogar',
    date: '2023/04/11',
    created_at: '2023-04-25T11:52:12.825Z',
    updated_at: '2023-04-25T11:52:12.825Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/100.json'
  },
  {
    id: 101,
    price: 30,
    concept: 'Fausia',
    category: 'Hogar',
    date: '2023/03/28',
    created_at: '2023-04-25T11:52:19.668Z',
    updated_at: '2023-04-25T11:52:19.668Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/101.json'
  },
  {
    id: 102,
    price: 30,
    concept: 'Fausia',
    category: 'Hogar',
    date: '2023/03/14',
    created_at: '2023-04-25T11:52:30.903Z',
    updated_at: '2023-04-25T11:52:30.903Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/102.json'
  },
  {
    id: 103,
    price: 30,
    concept: 'Fausia',
    category: 'Hogar',
    date: '2023/02/28',
    created_at: '2023-04-25T11:52:38.971Z',
    updated_at: '2023-04-25T11:52:38.971Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/103.json'
  },
  {
    id: 105,
    price: 25,
    concept: 'Cena macao',
    category: 'Comida a Domicilio',
    date: '2023/04/16',
    created_at: '2023-04-25T11:54:29.552Z',
    updated_at: '2023-04-25T11:54:29.552Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/105.json'
  },
  {
    id: 106,
    price: 25,
    concept: 'Burger poke cena casa Fernando ',
    category: 'Comida a Domicilio',
    date: '2023/04/17',
    created_at: '2023-04-25T11:54:48.358Z',
    updated_at: '2023-04-25T11:54:48.358Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/106.json'
  },
  {
    id: 107,
    price: 25,
    concept: 'Telepizza',
    category: 'Comida a Domicilio',
    date: '2023/04/20',
    created_at: '2023-04-25T11:55:11.438Z',
    updated_at: '2023-04-25T11:55:11.438Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/107.json'
  },
  {
    id: 108,
    price: 20,
    concept: 'Montero',
    category: 'Comida a Domicilio',
    date: '2023/04/19',
    created_at: '2023-04-25T11:55:45.286Z',
    updated_at: '2023-04-25T11:55:45.286Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/108.json'
  },
  {
    id: 109,
    price: 28,
    concept: 'Cena youme',
    category: 'Comida a Domicilio',
    date: '2023/04/19',
    created_at: '2023-04-25T12:01:26.307Z',
    updated_at: '2023-04-25T12:01:26.307Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/109.json'
  },
  {
    id: 110,
    price: 0,
    concept: 'Comida chipiron',
    category: 'Restaurante',
    date: '2023/04/06',
    created_at: '2023-04-25T12:01:57.847Z',
    updated_at: '2023-04-25T12:01:57.847Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/110.json'
  },
  {
    id: 111,
    price: 31,
    concept: 'Cena youme',
    category: 'Comida a Domicilio',
    date: '2023/04/25',
    created_at: '2023-04-25T20:31:23.304Z',
    updated_at: '2023-04-25T20:31:23.304Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/111.json'
  },
  {
    id: 146,
    price: 64,
    concept: 'Endesa',
    category: 'Facturas',
    date: '2023/04/26',
    created_at: '2023-04-28T19:19:32.702Z',
    updated_at: '2023-04-28T19:19:32.702Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/146.json'
  },
  {
    id: 147,
    price: 25,
    concept: 'Wifi',
    category: 'Facturas',
    date: '2023/04/15',
    created_at: '2023-04-28T19:19:45.370Z',
    updated_at: '2023-04-28T19:19:45.370Z',
    url: 'https://pure-spire-45336.herokuapp.com/expenses/147.json'
  }
])
const doughnutData = ref({
  labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: [40, 20, 80, 10]
    }
  ]
})
const data = ref({
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  datasets: [
    {
      label: 'Gastos',
      backgroundColor: '#f87979',
      data: dataSets
    }
  ]
})

const buttons = ref(categories.value.map(el => ({ ...el, onOff: false })))
onMounted(async () => {
  /*  expenses.value = await _getExpensesFromDB() */
  transformExpensesToChartData()
  setMonth()
  setDoughnutChart()
  console.log(expenses)
})
const changeMonth = (month) => {
  currentMonthNumber.value = month.month - 1
  setMonth()
  setDoughnutChart()
}

const toggleSortByPrice = () => {
  setPriceFilter.value = true
  sortExpenses.value.byPrice = !sortExpenses.value.byPrice
}
const toggleSortByDate = () => {
  setPriceFilter.value = false
  sortExpenses.value.byDate = !sortExpenses.value.byDate
}

const setDoughnutChart = () => {
  console.log('setDoughnutChart')
  const optionsNames = categories.value.map((el) => el.name)
  const data = []
  const result = []
  const filters = buttons.value.filter(el => el.onOff).map(el => el.name)

  const defaultColors = categories.value.map(el => el.color)
  console.log(defaultColors)
  for (let i = 0; i < defaultColors.length; i++) {
    const categoria = defaultColors[i].name
    if (filters.includes(categoria)) {
      result.push(defaultColors[i].color)
    } else {
      result.push('#cccccc')
    }
  }
  optionsNames.forEach((el) => {
    const element = filteredExpenses()
      .filter((exp) => exp.category === el)
      .map((el) => parseInt(el.price))
      .reduce((acc, curr) => acc + curr, 0)
    data.push(element)
  })
  doughnutData.value = {
    labels: categories.value.map(el => el.name),
    datasets: [
      {
        backgroundColor: defaultColors,
        data: data
      }
    ]
  }
  console.log('data', data)
}
const setActive = (button, index) => {
  /* COLOR DEL BOTÓN AL ACTIVAR LOS FILTROS */
  const saveData = [...filteredExpenses()]
  buttons.value[index].onOff = !buttons.value[index].onOff
  const filters = buttons.value.filter(el => el.onOff).map(el => el.name)
  /* setChartColors(filters, saveData) */
  console.log('active', saveData, filteredExpenses())
  setDoughnutChart()
}

const filterExpensesByDay = () => {
  const array = hardExpenses.value.filter(
    (el) => moment(el.date, 'YYYY/MM/DD').format('YYYY/MM/DD') === date.value
  )
  return array
}

/* const setChartColors = (filters, saveData) => {
  const defaultColors = categories.value
  const result = [] */
/*   const optionsNames = categories.value.map((el) => el.name)
  const data = [] */
/*   optionsNames.forEach((el) => {
    const element = filteredExpenses()
      .filter((exp) => exp.category === el)
      .map((el) => parseInt(el.price))
      .reduce((acc, curr) => acc + curr, 0)
    data.push(element)
  }) */
/*   for (let i = 0; i < defaultColors.length; i++) {
    const categoria = defaultColors[i].name
    console.log(categoria)
    if (filters.includes(categoria)) {
      result.push(defaultColors[i].color)
    } else {
      result.push('#cccccc')
    }
  }
  doughnutData.value = {
    labels: categories.value.map(el => el.name),

    datasets: [
      {
        backgroundColor: categories.value.map(el => el.color),
        data: saveData.value
      }
    ]
  }
  console.log('result', result, saveData)
} */
const filteredExpenses = () => {
  const current = currentMonthNumber.value

  const array = hardExpenses.value.filter(
    (el) => moment(el.date, 'YYYY/MM/DD').month() === current
  )
  monthExpenses.value = array
  const filters = buttons.value.filter(el => el.onOff).map(el => el.name)
  let result = array.filter(expense => filters.includes(expense.category))
  if (!filters.length) {
    result = array
  }
  let sortedArray = !sortExpenses.value.byDate ? result.sort((a, b) => moment(b.date).diff(moment(a.date))) : result.sort((a, b) => moment(a.date).diff(moment(b.date)))

  if (setPriceFilter.value) {
    sortedArray = !sortExpenses.value.byPrice ? result.sort((a, b) => a.price - b.price) : result.sort((a, b) => b.price - a.price)
  }



  return sortedArray
}

const categoryColor = (category) => {
  const color = categories.value.find(el => el.name === category).color

  return color
}
const setButtonColor = (button) => {
  let color = buttons.value.find(el => el.name === button.name).color
  if (button.onOff) {
    color = 'gray'
  }
  return `background: ${color}`
}

const setMonth = () => {
  currentMonth.value = moment()
    .month(currentMonthNumber.value)
    .format('MMMM')
}
const transformExpensesToChartData = () => {
  const result = []
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  /* iteramos sobre el arreglo de meses */
  for (let i = 0; i < months.length; i++) {
    result.push([hardExpenses.value
      .filter(expense => moment(expense.date, 'YYYY/MM/DD').format('MM') === months[i])][0]
      .map(el => el.price).reduce((a, b) => a + b, 0))
  }
  dataSets.value = result
  chartKey.value += 1
}

</script>
<style>
.bars-container {
  padding: 1rem;
  max-width: 500px;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  flex-direction: column;
}
</style>
