import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Trash2, Edit2, Filter } from 'lucide-react'
import {
  addExpense,
  deleteExpense,
  updateExpense,
} from '@/store/slices/expenseSlice'
import { useForm, useNotification } from '@/hooks'
import { formatDate, formatCurrency } from '@/utils/helpers'

const ExpenseForm = ({ onSubmit, onCancel, initialData = null }) => {
  const { values, errors, handleChange, handleBlur, handleSubmit } = useForm(
    initialData || {
      description: '',
      amount: '',
      category: 'food',
      date: new Date().toISOString().split('T')[0],
    },
    onSubmit
  )

  const categories = [
    'food',
    'transportation',
    'entertainment',
    'utilities',
    'healthcare',
    'shopping',
    'education',
    'other',
  ]

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {initialData ? 'Edit Expense' : 'Add New Expense'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={values.amount}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.00"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={values.category}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={values.date}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="btn-primary flex-1"
          >
            {initialData ? 'Update Expense' : 'Add Expense'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

const Expenses = () => {
  const dispatch = useDispatch()
  const { showNotification } = useNotification()
  const { items: expenses } = useSelector((state) => state.expenses)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const handleAddExpense = (values) => {
    dispatch(
      addExpense({
        id: Date.now(),
        ...values,
      })
    )
    showNotification('Expense added successfully', 'success')
    setShowForm(false)
  }

  const handleUpdateExpense = (values) => {
    dispatch(updateExpense({ id: editingId, ...values }))
    showNotification('Expense updated successfully', 'success')
    setEditingId(null)
  }

  const handleDeleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      dispatch(deleteExpense(id))
      showNotification('Expense deleted successfully', 'success')
    }
  }

  const totalAmount = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount || 0),
    0
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        )}
      </div>

      {showForm && (
        <ExpenseForm
          onSubmit={handleAddExpense}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingId && (
        <ExpenseForm
          initialData={expenses.find((e) => e.id === editingId)}
          onSubmit={handleUpdateExpense}
          onCancel={() => setEditingId(null)}
        />
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Recent Expenses
          </h2>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold">Total:</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No expenses yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-gray-900">
                      {expense.description}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatDate(expense.date, 'MMM DD, YYYY')}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setEditingId(expense.id)}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Expenses
