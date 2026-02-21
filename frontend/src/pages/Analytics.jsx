import React from 'react'
import { BarChart, PieChart, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

const Analytics = () => {
  const expenseData = [
    { name: 'Food', value: 400, percentage: 28.6 },
    { name: 'Transportation', value: 300, percentage: 21.4 },
    { name: 'Entertainment', value: 250, percentage: 17.9 },
    { name: 'Utilities', value: 200, percentage: 14.3 },
    { name: 'Shopping', value: 250, percentage: 17.8 },
  ]

  const monthlyData = [
    { month: 'Jan', amount: 2000 },
    { month: 'Feb', amount: 2300 },
    { month: 'Mar', amount: 1800 },
    { month: 'Apr', amount: 2700 },
    { month: 'May', amount: 2200 },
    { month: 'Jun', amount: 2500 },
  ]

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Monthly Expenses Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Expenses by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Summary by Category
        </h2>
        <div className="space-y-3">
          {expenseData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="font-medium text-gray-900">{item.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-900">
                  ${item.value}
                </span>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Analytics
