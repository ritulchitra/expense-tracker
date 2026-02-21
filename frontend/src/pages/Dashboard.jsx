import React, { lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'
import { BarChart3, Wallet, TrendingUp, Users } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'

const StatCard = ({ icon: Icon, title, value, trend, color }) => (
  <div className="card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        {trend && (
          <p
            className={`text-sm font-semibold mt-2 ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend > 0 ? '+' : ''}{trend}% from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
)

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth)

  const stats = [
    {
      icon: Wallet,
      title: 'Total Expenses',
      value: formatCurrency(2500),
      trend: 12,
      color: 'bg-blue-500',
    },
    {
      icon: TrendingUp,
      title: 'This Month',
      value: formatCurrency(850),
      trend: -5,
      color: 'bg-green-500',
    },
    {
      icon: BarChart3,
      title: 'Average Daily',
      value: formatCurrency(28.33),
      trend: 8,
      color: 'bg-purple-500',
    },
    {
      icon: Users,
      title: 'Categories',
      value: '12',
      trend: null,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Here's your expense overview for today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Expense Trend
          </h2>
          <Suspense fallback={<div>Loading chart...</div>}>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Chart Placeholder</p>
            </div>
          </Suspense>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Recent Expenses
          </h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between pb-3 border-b last:border-b-0"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    Expense #{item}
                  </p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
                <p className="font-semibold text-gray-900">
                  ${(Math.random() * 100).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
