import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  Home,
  TrendingUp,
  Settings,
  BarChart3,
  Wallet,
  X,
} from 'lucide-react'
import { setSidebarOpen } from '@/store/slices/uiSlice'

const Sidebar = () => {
  const location = useLocation()
  const { sidebarOpen } = useSelector((state) => state.ui)
  const dispatch = useDispatch()

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Expenses', path: '/expenses', icon: Wallet },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Reports', path: '/reports', icon: TrendingUp },
    { label: 'Settings', path: '/settings', icon: Settings },
  ]

  const isActive = (path) => location.pathname === path

  const closeSidebar = () => dispatch(setSidebarOpen(false))

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-dark text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-700">
          <h1 className="text-xl font-bold">Menu</h1>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1 hover:bg-gray-700 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 text-center">
            © 2024 Expense Tracker v1.0.0
          </p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
