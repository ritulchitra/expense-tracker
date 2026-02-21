# Project Structure Documentation

## Complete File Tree

```
expense-tracker/frontend/
│
├── .vscode/
│   ├── settings.json              # VSCode editor settings
│   └── extensions.json            # Recommended VSCode extensions
│
├── public/
│   └── vite.svg                   # Vite logo asset
│
├── src/
│   ├── api/
│   │   ├── index.js               # Axios instance with interceptors
│   │   ├── authAPI.js             # Authentication endpoints
│   │   └── expenseAPI.js          # Expense management endpoints
│   │
│   ├── components/
│   │   ├── Header.jsx             # Top navigation bar
│   │   ├── Sidebar.jsx            # Sidebar navigation
│   │   └── ProtectedRoute.jsx     # Route protection wrapper
│   │
│   ├── contexts/
│   │   └── ErrorBoundary.jsx      # Error boundary component
│   │
│   ├── hooks/
│   │   ├── useCustom.js           # Custom hooks (useForm, useAsync, etc.)
│   │   └── index.js               # Hooks exports
│   │
│   ├── lib/
│   │   └── [shadcn/ui components] # UI component library
│   │
│   ├── pages/
│   │   ├── Login.jsx              # Login page (public route)
│   │   ├── Dashboard.jsx          # Dashboard (protected)
│   │   ├── Expenses.jsx           # Expenses CRUD (protected)
│   │   ├── Analytics.jsx          # Analytics charts (protected)
│   │   ├── Reports.jsx            # Reports page (protected)
│   │   ├── Settings.jsx           # User settings (protected)
│   │   └── NotFound.jsx           # 404 page
│   │
│   ├── store/
│   │   ├── index.js               # Redux store configuration
│   │   └── slices/
│   │       ├── authSlice.js       # Auth state management
│   │       ├── expenseSlice.js    # Expense state management
│   │       └── uiSlice.js         # UI state management
│   │
│   ├── utils/
│   │   ├── helpers.js             # Utility functions (string, date, etc.)
│   │   └── constants.js           # Application constants
│   │
│   ├── App.jsx                    # Main app component with routing
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Global styles & Tailwind directives
│
├── .env                           # Environment variables (local)
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── .prettierrc                    # Prettier formatting config
├── .prettierignore                # Prettier ignore rules
├── CONTRIBUTING.md                # Contribution guidelines
├── index.html                     # HTML entry point
├── package.json                   # Project dependencies
├── package-lock.json              # Locked dependency versions
├── postcss.config.js              # PostCSS configuration
├── README.md                      # Project documentation
├── tailwind.config.js             # Tailwind CSS configuration
└── vite.config.js                 # Vite build configuration
```

## Key Files Explanation

### Configuration Files

#### `vite.config.js`

- Vite build configuration
- React plugin setup
- Absolute import alias (@)
- Dev server settings (port 3000, auto-open)

#### `tailwind.config.js`

- Tailwind CSS theme customization
- Custom colors, spacing, borders
- Plugin configuration

#### `postcss.config.js`

- PostCSS processing pipeline
- Tailwind CSS and autoprefixer plugins

#### `package.json`

- Project metadata and dependencies
- NPM scripts (dev, build, preview)
- Version information

### Source Files Structure

#### `src/main.jsx`

- React app entry point
- Redux Provider setup
- React Router initialization

#### `src/App.jsx`

- Main application component
- Route definitions
- Layout components
- Lazy-loaded pages

#### `src/index.css`

- Tailwind directives (@tailwind)
- Global styles
- Custom component layering
- Animations and scrollbar styling

### State Management

#### `src/store/index.js`

Configures Redux store with multiple slices:

- `authSlice`: User authentication state
- `expenseSlice`: Expense data management
- `uiSlice`: UI state (sidebar, theme, notifications)

### API Integration

#### `src/api/index.js`

- Axios instance creation
- Base URL configuration
- Request interceptors (token injection)
- Response interceptors (401 handling)

### Components

#### `src/components/`

Reusable components:

- **Header.jsx**: Logout, user info, navigation
- **Sidebar.jsx**: Menu navigation (responsive)
- **ProtectedRoute.jsx**: Route authentication wrapper

### Pages

#### `src/pages/`

Page-level components (route pages):

- **Login.jsx**: Authentication entry point
- **Dashboard.jsx**: Main dashboard with stats
- **Expenses.jsx**: CRUD operations for expenses
- **Analytics.jsx**: Data visualization with Recharts
- **Reports.jsx**: Report generation and download
- **Settings.jsx**: User preferences and account settings
- **NotFound.jsx**: 404 error page

### Hooks

#### `src/hooks/`

Custom React hooks:

- **useForm**: Form state and validation management
- **useNotification**: Toast notification management
- **useAsync**: Async operation with loading states
- **useLocalStorage**: Browser localStorage persistence

### Utilities

#### `src/utils/helpers.js`

Helper functions categorized:

- String utilities (capitalize, truncate, slugify)
- Number utilities (formatCurrency, calculatePercentage)
- Date utilities (formatDate, getDaysDifference)
- Validation utilities (isEmail, isStrongPassword)
- Array utilities (removeDuplicates, groupBy)
- Object utilities (deepClone, mergeObjects)
- Browser utilities (isMobile, copyToClipboard)

#### `src/utils/constants.js`

Application constants:

- API endpoints
- Expense categories
- HTTP status codes
- Notification types
- Date formats
- Currency codes
- Color palette
- Storage keys
- Error/success messages

## Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Redux Action (if state update needed)
    ↓
Reducer Updates Store
    ↓
Connected Component Re-renders
    ↓
UI Updated
```

## Routing Structure

```
/ (redirects to /dashboard)
│
├── /login (public)
│
├── /dashboard (protected)
├── /expenses (protected)
├── /analytics (protected)
├── /reports (protected)
├── /settings (protected)
│
└── /* (404 Not Found)
```

## Import Aliases

All imports use the `@` alias for cleaner paths:

```js
// ✅ Good (using alias)
import Dashboard from '@/pages/Dashboard'
import { useForm } from '@/hooks'

// ❌ Old way
import Dashboard from '../../../pages/Dashboard'
import { useForm } from '../../../hooks'
```

## Environment Variables

Accessed via `import.meta.env`:

```js
const apiUrl = import.meta.env.VITE_API_BASE_URL
const appName = import.meta.env.VITE_APP_NAME
```

## Development Guidelines

### Creating a New Page

1. Create file in `src/pages/YourPage.jsx`
2. Define component and styles
3. Add route in `src/App.jsx`
4. Add navigation in `src/components/Sidebar.jsx`

### Creating a New Component

1. Create file in `src/components/YourComponent.jsx`
2. Use named export
3. Keep component focused
4. Document with JSDoc comments

### Creating a New Redux Slice

1. Create file in `src/store/slices/yourSlice.js`
2. Define initial state, reducers, and actions
3. Import and add to store configuration
4. Use with `useDispatch` and `useSelector`

### Adding API Endpoints

1. Create service in `src/api/yourAPI.js`
2. Use the configured axios instance
3. Export functions with meaningful names
4. Use in components or thunks

## Performance Optimization

- **Code Splitting**: Routes are lazy-loaded
- **Asset Optimization**: Vite handles minification
- **Bundle Analysis**: Check `dist/` after build
- **Caching**: Use cache headers in production

## Testing Flow

- Pages lazy-load with Suspense fallback
- Error Boundary catches React errors
- Protected routes redirect to login
- API interceptors handle authentication
- Notifications provide user feedback
