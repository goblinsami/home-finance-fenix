
/* eslint-disable */
import axios from 'axios'
export function mainComposable() {
  /*   const urlProd = 'https://pure-spire-45336.herokuapp.com/expenses' */
  const urlProd = 'https://mysterious-dusk-76452.herokuapp.com/expenses'

  async function _getExpensesFromDB() {
    try {
      // let local = "http://127.0.0.1:3000/expenses.json";
      const res = await axios.get(`${urlProd}.json`)
      return res.data
    } catch (error) {
      console.log(error)
    }
  }
  async function _createExpense(obj) {
    try {
      await axios.post(`${urlProd}`, obj);
    } catch (error) {
      console.log(error);
    }
  }
  async function _deleteExpenseFromDB(id) {
    try {
      await axios.delete(`${urlProd}/${id}`);
    } catch (error) {
      console.log(error);
    }
  }
  async function _editExpenseFromDB(id, obj) {
    try {
      await axios.patch(`${urlProd}/${id}`, obj);
    } catch (error) {
      console.log(error);
    }
  }
  return {
    _editExpenseFromDB,
    _getExpensesFromDB,
    _createExpense,
    _deleteExpenseFromDB
  }
}
