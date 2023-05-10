
import axios from 'axios'
export function mainComposable () {
  function test () {
    alert('hep')
  }
  async function _getExpensesFromDB () {
    try {
      const urlProd = 'https://pure-spire-45336.herokuapp.com/expenses.json'
      // let local = "http://127.0.0.1:3000/expenses.json";
      const res = await axios.get(urlProd)
      return res.data
    } catch (error) {
      console.log(error)
    }
  }

  return {
    test,
    _getExpensesFromDB
  }
}
