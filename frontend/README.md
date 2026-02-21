# Expense Tracker - Production-Ready React Boilerplate

A modern, scalable, and production-ready React frontend built with Vite, Redux Toolkit, React Router, Tailwind CSS, and more. This boilerplate implements clean architecture principles and best practices.

## 🎯 Features

✅ **React 18+** with Vite for blazing-fast development  
✅ **Redux Toolkit** for predictable state management  
✅ **React Router v6+** for client-side routing  
✅ **Tailwind CSS** for utility-first styling  
✅ **Recharts** for beautiful data visualization  
✅ **Axios** with centralized API configuration  
✅ **Error Boundary** for graceful error handling  
✅ **Protected Routes** for authentication management  
✅ **Lazy Loading** with React.lazy + Suspense  
✅ **Absolute Imports** using @ alias  
✅ **Environment Variables** with Vite format  
✅ **404 Not Found** page  
✅ **Responsive Design** with mobile-first approach  
✅ **Clean Architecture** with organized folder structure  

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. **Clone or download the project**

```bash
cd expense-tracker/frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment variables**

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=Expense Tracker
VITE_APP_DESCRIPTION=A production-ready expense tracking application
VITE_APP_VERSION=1.0.0
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.jsx      # Top navigation bar
│   ├── Sidebar.jsx     # Sidebar navigation
│   └── ProtectedRoute.jsx # Route protection wrapper
├── pages/              # Page-level components
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Expenses.jsx
│   ├── Analytics.jsx
│   ├── Reports.jsx
│   ├── Settings.jsx
│   └── NotFound.jsx
├── store/              # Redux state management
│   ├── index.js        # Store configuration
│   └── slices/         # Redux slices
│       ├── authSlice.js
│       ├── expenseSlice.js
│       └── uiSlice.js
├── api/                # API configuration & services
│   ├── index.js        # Axios instance with interceptors
│   ├── authAPI.js      # Auth endpoints
│   └── expenseAPI.js   # Expense endpoints
├── hooks/              # Custom React hooks
│   ├── useCustom.js    # Custom hooks (useForm, useAsync, etc.)
│   └── index.js        # Hooks exports
├── utils/              # Utility functions
│   └── helpers.js      # String, number, date, validation helpers
├── contexts/           # React contexts
│   └── ErrorBoundary.jsx # Error boundary component
├── lib/                # UI component library (shadcn/ui)
├── App.jsx             # Main application component
├── main.jsx            # React entry point
└── index.css           # Global styles & Tailwind directives
```

## 🔐 Authentication & Protected Routes

The boilerplate includes a working authentication system with protected routes.

**Login Credentials (Demo):**
- Email: `demo@example.com`
- Password: `demo@123`

Protected routes are wrapped with the `<ProtectedRoute>` component:

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS with a custom configuration. Extend the theme in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      // ... more colors
    },
  },
}
```

### Custom Components

Global component styles are defined using Tailwind's @layer directive in `index.css`:

```css
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all;
  }
}
```

## 📊 State Management (Redux)

The store includes three main slices:

### Auth Slice (`authSlice.js`)
Manages user authentication state:
```js
- user: User object
- isAuthenticated: Boolean
- token: JWT token
- loading: Loading state
- error: Error messages
```

### Expense Slice (`expenseSlice.js`)
Manages expense data:
```js
- items: Array of expenses
- loading: Loading state
- filters: Applied filters
```

### UI Slice (`uiSlice.js`)
Manages UI state:
```js
- sidebarOpen: Sidebar visibility
- theme: Light/dark theme
- notifications: Toast notifications
```

## 🔌 API Integration

Axios is configured with:
- Base URL from environment variables
- Request/response interceptors
- Automatic token injection in headers
- Automatic 401 redirect to login

**Using API services:**

```js
import { expenseAPI } from '@/api/expenseAPI'

const getExpenses = async () => {
  try {
    const response = await expenseAPI.getExpenses()
    console.log(response.data)
  } catch (error) {
    console.error('Error fetching expenses:', error)
  }
}
```

## 🪝 Custom Hooks

### `useForm`
Simplifies form handling with validation:
```js
const { values, errors, handleChange, handleSubmit } = useForm(
  { email: '', password: '' },
  onSubmit
)
```

### `useNotification`
Manages toast notifications:
```js
const { showNotification } = useNotification()
showNotification('Success!', 'success', 3000)
```

### `useAsync`
Handles async operations with loading states:
```js
const { data, loading, error, execute } = useAsync(fetchData)
```

### `useLocalStorage`
Persists data to localStorage:
```js
const [theme, setTheme] = useLocalStorage('theme', 'light')
```

## 📈 Data Visualization

The project includes Recharts for data visualization. Example usage in `Analytics.jsx`:

```jsx
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={monthlyData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="amount" fill="#3b82f6" />
  </BarChart>
</ResponsiveContainer>
```

## ⚙️ Environment Variables

All environment variables are accessed via `import.meta.env`:

```js
const apiUrl = import.meta.env.VITE_API_BASE_URL
const appName = import.meta.env.VITE_APP_NAME
```

Create a `.env.local` file for local overrides:

```env
VITE_API_BASE_URL=http://localhost:3001
```

## 🛡️ Error Handling

### Error Boundary

The app is wrapped with an Error Boundary component that catches React errors:

```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

Shows error details in development mode with a "Try Again" button.

## 🔀 Lazy Loading

Pages are lazy-loaded using `React.lazy()` for code splitting:

```jsx
const Dashboard = lazy(() => import('@/pages/Dashboard'))

<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run preview  # Preview production build
npm run lint     # Run ESLint (if configured)
npm run format   # Format code with Prettier (if configured)
```

## 🚀 Performance Optimization

- **Code Splitting**: Lazy-loaded routes with dynamic imports
- **Tree Shaking**: Vite removes unused code automatically
- **Asset Optimization**: Automatic image and CSS minification
- **Caching**: Cache-busting with content hashing

## 📚 Utility Functions

The `helpers.js` file includes pre-built utilities:

```js
// String utilities
capitalize(str)
truncate(str, length)
slugify(str)

// Number utilities
formatCurrency(amount, currency)
formatNumber(num, decimals)
calculatePercentage(value, total)

// Date utilities
formatDate(date, format)
getDaysDifference(date1, date2)

// Validation utilities
isEmail(email)
isStrongPassword(password)
isPhoneNumber(phone)

// Array utilities
removeDuplicates(arr, key)
groupBy(arr, key)
sortBy(arr, key, order)

// Object utilities
deepClone(obj)
mergeObjects(target, source)
getNestedValue(obj, path)

// Browser utilities
isMobile()
copyToClipboard(text)
downloadFile(content, filename, type)
```

## 🐛 Debugging

### Browser DevTools

1. **Redux DevTools**: Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools-extension)
2. **React DevTools**: Install [React DevTools Extension](https://react-devtools-tutorial.vercel.app/)

In development, Redux actions and state changes are logged to the console.

## 📦 Dependencies

### Core
- **react** (18+): UI library
- **react-dom**: DOM rendering
- **vite**: Build tool
- **@vitejs/plugin-react**: React support for Vite

### State Management
- **@reduxjs/toolkit**: Redux utilities
- **react-redux**: React bindings for Redux

### Routing
- **react-router-dom** (v6+): Client-side routing

### Styling
- **tailwindcss**: Utility-first CSS
- **postcss**: CSS processing
- **autoprefixer**: CSS vendor prefixes

### API
- **axios**: HTTP client

### UI Components
- **lucide-react**: Icon library
- **recharts**: Charts library

### Utilities
- **class-variance-authority**: CSS class composition
- **clsx**: Conditional classnames

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request on GitHub
```

## 📝 Code Style

The project follows these conventions:
- **Components**: PascalCase (Dashboard.jsx)
- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **CSS Classes**: kebab-case

## 📖 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [Axios](https://axios-http.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this in your projects!

## 💡 Tips

- Use the Redux DevTools browser extension to debug state
- Leverage Tailwind's utility classes for rapid styling
- Keep components small and focused on a single responsibility
- Use custom hooks for logic reuse across components
- Implement environment variables for different deployment environments

## ✨ Future Enhancements

- [ ] Add TypeScript support
- [ ] Implement Jest unit tests
- [ ] Add Cypress E2E tests
- [ ] Dark mode toggle
- [ ] Internationalization (i18n)
- [ ] PWA support
- [ ] Offline functionality
- [ ] Real-time notifications with WebSockets

---

Built with ❤️ for modern React development

