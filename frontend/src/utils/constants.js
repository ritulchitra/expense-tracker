// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh',
  },
  EXPENSES: {
    LIST: '/expenses',
    CREATE: '/expenses',
    UPDATE: (id) => `/expenses/${id}`,
    DELETE: (id) => `/expenses/${id}`,
    STATISTICS: '/expenses/statistics',
    EXPORT: '/expenses/export',
  },
}

// Expense categories
export const EXPENSE_CATEGORIES = [
  'food',
  'transportation',
  'entertainment',
  'utilities',
  'healthcare',
  'shopping',
  'education',
  'other',
]

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
}

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
}

// Default pagination
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  PAGE_SIZE: 20,
  SORT_BY: 'createdAt',
  SORT_ORDER: 'desc',
}

// Date formats
export const DATE_FORMATS = {
  SHORT: 'MM/DD/YYYY',
  LONG: 'MMMM DD, YYYY',
  ISO: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
}

// Currency codes
export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$' },
  EUR: { code: 'EUR', symbol: '€' },
  GBP: { code: 'GBP', symbol: '£' },
  JPY: { code: 'JPY', symbol: '¥' },
  INR: { code: 'INR', symbol: '₹' },
}

// Colors for charts and UI
export const COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#8b5cf6',
  ACCENT: '#ec4899',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  DARK: '#1f2937',
  LIGHT: '#f9fafb',
  CHART: [
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#10b981',
    '#06b6d4',
    '#f87171',
    '#a78bfa',
  ],
}

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_STATE: 'sidebarOpen',
}

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized. Please log in.',
  FORBIDDEN: 'Forbidden. You do not have permission.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
}

// Success messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Saved successfully!',
  DELETED: 'Deleted successfully!',
  CREATED: 'Created successfully!',
  UPDATED: 'Updated successfully!',
  LOGGED_IN: 'Logged in successfully!',
  LOGGED_OUT: 'Logged out successfully!',
}
