import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm, useNotification } from '@/hooks'
import { setTheme } from '@/store/slices/uiSlice'
import { Moon, Sun, Bell, Lock, User } from 'lucide-react'

const SettingSection = ({ icon: Icon, title, description, children }) => (
  <div className="card border-l-4 border-primary">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        {children}
      </div>
    </div>
  </div>
)

const Settings = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { theme } = useSelector((state) => state.ui)
  const { showNotification } = useNotification()

  const { values, handleChange, handleSubmit } = useForm(
    {
      name: user?.name || '',
      email: user?.email || '',
      currency: 'USD',
      language: 'en',
    },
    (values) => {
      showNotification('Settings saved successfully!', 'success')
    }
  )

  const handleThemeChange = (newTheme) => {
    dispatch(setTheme(newTheme))
    showNotification(
      `Theme changed to ${newTheme}`,
      'success',
      2000
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account and application preferences
        </p>
      </div>

      <div className="space-y-6">
        <SettingSection
          icon={User}
          title="Profile Information"
          description="Update your personal and account details"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  name="currency"
                  value={values.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  name="language"
                  value={values.language}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </form>
        </SettingSection>

        <SettingSection
          icon={Sun}
          title="Appearance"
          description="Customize the look and feel of your application"
        >
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Current theme: <span className="font-semibold">{theme}</span></p>
            <div className="flex gap-3">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  theme === 'light'
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-300 hover:border-primary'
                }`}
              >
                <Sun className="w-5 h-5" />
                Light Mode
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-300 hover:border-primary'
                }`}
              >
                <Moon className="w-5 h-5" />
                Dark Mode
              </button>
            </div>
          </div>
        </SettingSection>

        <SettingSection
          icon={Bell}
          title="Notifications"
          description="Control how and when you receive notifications"
        >
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-gray-700">Email notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-gray-700">Push notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-gray-700">Weekly report</span>
            </label>
          </div>
        </SettingSection>

        <SettingSection
          icon={Lock}
          title="Security"
          description="Manage your password and security settings"
        >
          <button className="btn-primary">
            Change Password
          </button>
        </SettingSection>
      </div>
    </div>
  )
}

export default Settings
