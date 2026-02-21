import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    category: null,
    dateRange: null,
  },
}

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    fetchExpensesStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchExpensesSuccess: (state, action) => {
      state.loading = false
      state.items = action.payload
    },
    fetchExpensesFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    addExpense: (state, action) => {
      state.items.push(action.payload)
    },
    updateExpense: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    deleteExpense: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    setFilters: (state, action) => {
      state.filters = action.payload
    },
    clearExpenses: (state) => {
      state.items = []
    },
  },
})

export const {
  fetchExpensesStart,
  fetchExpensesSuccess,
  fetchExpensesFailure,
  addExpense,
  updateExpense,
  deleteExpense,
  setFilters,
  clearExpenses,
} = expenseSlice.actions

export default expenseSlice.reducer
