// String utilities

export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const truncate = (str, length = 30) => {
  if (!str) return ''
  return str.length > length ? str.substring(0, length) + '...' : str
}

export const slugify = (str) => {
  if (!str) return ''
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Number utilities

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export const formatNumber = (num, decimals = 2) => {
  return Number(num).toFixed(decimals)
}

export const calculatePercentage = (value, total) => {
  if (total === 0) return 0
  return ((value / total) * 100).toFixed(2)
}

// Date utilities

export const formatDate = (date, format = 'MMM DD, YYYY') => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')

  const formats = {
    'YYYY-MM-DD': `${year}-${month}-${day}`,
    'MMM DD, YYYY': `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    'MM/DD/YYYY': `${month}/${day}/${year}`,
    'HH:mm': `${hours}:${minutes}`,
    'YYYY-MM-DD HH:mm': `${year}-${month}-${day} ${hours}:${minutes}`,
  }

  return formats[format] || d.toString()
}

export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2 - d1)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Validation utilities

export const isEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return re.test(password)
}

export const isPhoneNumber = (phone) => {
  const re = /^[\d\s\-\+\(\)]+$/
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10
}

// Array utilities

export const removeDuplicates = (arr, key = null) => {
  if (!key) {
    return [...new Set(arr)]
  }
  const seen = new Set()
  return arr.filter((item) => {
    const value = item[key]
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}

export const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    const groupKey = item[key]
    acc[groupKey] = acc[groupKey] || []
    acc[groupKey].push(item)
    return acc
  }, {})
}

export const sortBy = (arr, key, order = 'asc') => {
  return [...arr].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1
    return 0
  })
}

// Object utilities

export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

export const mergeObjects = (target, source) => {
  return { ...target, ...source }
}

export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, prop) => current?.[prop], obj)
}

// Browser utilities

export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}

export const downloadFile = (content, filename, type = 'text/plain') => {
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:' + type + ';charset=utf-8,' + encodeURIComponent(content)
  )
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
