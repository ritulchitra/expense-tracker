# Testing Guide

This guide covers testing strategies and best practices for the Expense Tracker application.

## Testing Strategy

The application uses a multi-layered testing approach:

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test feature workflows
3. **E2E Tests**: Test complete user journeys
4. **Manual Testing**: Exploratory and usability testing

## Unit Testing Setup

### Jest + React Testing Library

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest @babel/preset-react
```

Create `jest.config.js`:

```js
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}
```

Create `src/setupTests.js`:

```js
import '@testing-library/jest-dom'
```

## Testing Components

### Example: Testing a Button Component

```js
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '@/components/Button'

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    userEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('disables button when disabled prop is true', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByText('Click')).toBeDisabled()
  })
})
```

## Testing Redux

### Example: Testing Auth Slice

```js
import { configureStore } from '@reduxjs/toolkit'
import authReducer, { loginSuccess, logout } from '@/store/slices/authSlice'

describe('Auth Slice', () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    })
  })

  test('handles loginSuccess action', () => {
    const userData = {
      user: { id: 1, name: 'John' },
      token: 'token123',
    }

    store.dispatch(loginSuccess(userData))
    const state = store.getState().auth

    expect(state.isAuthenticated).toBe(true)
    expect(state.user.name).toBe('John')
    expect(state.token).toBe('token123')
  })

  test('handles logout action', () => {
    store.dispatch(logout())
    const state = store.getState().auth

    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })
})
```

## Testing Hooks

### Example: Testing useForm Hook

```js
import { renderHook, act } from '@testing-library/react'
import { useForm } from '@/hooks'

describe('useForm Hook', () => {
  test('initializes with default values', () => {
    const { result } = renderHook(() =>
      useForm({ name: '', email: '' }, jest.fn())
    )

    expect(result.current.values.name).toBe('')
    expect(result.current.values.email).toBe('')
  })

  test('updates values on change', () => {
    const { result } = renderHook(() => useForm({ name: '' }, jest.fn()))

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John' },
      })
    })

    expect(result.current.values.name).toBe('John')
  })

  test('calls onSubmit handler', () => {
    const onSubmit = jest.fn()
    const { result } = renderHook(() => useForm({ name: 'John' }, onSubmit))

    act(() => {
      result.current.handleSubmit({
        preventDefault: jest.fn(),
      })
    })

    expect(onSubmit).toHaveBeenCalledWith({ name: 'John' })
  })
})
```

## Testing API Calls

### Mocking Axios

```js
jest.mock('@/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))
```

### Example: Testing API Service

```js
import api from '@/api'
import { expenseAPI } from '@/api/expenseAPI'

jest.mock('@/api')

describe('Expense API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getExpenses fetches data', async () => {
    const mockData = [{ id: 1, description: 'Lunch', amount: 15 }]

    api.get.mockResolvedValue({ data: mockData })

    const result = await expenseAPI.getExpenses()

    expect(api.get).toHaveBeenCalledWith('/expenses', { params: undefined })
    expect(result.data).toEqual(mockData)
  })

  test('createExpense posts data', async () => {
    const expenseData = { description: 'Dinner', amount: 25 }
    const mockResponse = { id: 1, ...expenseData }

    api.post.mockResolvedValue({ data: mockResponse })

    const result = await expenseAPI.createExpense(expenseData)

    expect(api.post).toHaveBeenCalledWith('/expenses', expenseData)
    expect(result.data.id).toBe(1)
  })
})
```

## E2E Testing with Cypress

### Installation

```bash
npm install --save-dev cypress
npx cypress open
```

### Example: Login Flow Test

Create `cypress/e2e/auth.cy.js`:

```js
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  })

  it('logs in user with valid credentials', () => {
    cy.get('input[name="email"]').type('demo@example.com')
    cy.get('input[name="password"]').type('demo@123')
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/dashboard')
    cy.get('h1').should('contain', 'Welcome')
  })

  it('shows error with invalid credentials', () => {
    cy.get('input[name="email"]').type('wrong@email.com')
    cy.get('input[name="password"]').type('wrongpass')
    cy.get('button[type="submit"]').click()

    cy.contains('Login failed').should('be.visible')
  })

  it('preserves login state on page reload', () => {
    cy.login('demo@example.com', 'demo@123')
    cy.visit('http://localhost:3000/dashboard')
    cy.reload()
    cy.url().should('include', '/dashboard')
  })
})
```

### Example: Expense Management Test

Create `cypress/e2e/expenses.cy.js`:

```js
describe('Expense Management', () => {
  beforeEach(() => {
    cy.login('demo@example.com', 'demo@123')
    cy.visit('http://localhost:3000/expenses')
  })

  it('adds new expense', () => {
    cy.get('button').contains('Add Expense').click()
    cy.get('input[name="description"]').type('Coffee')
    cy.get('input[name="amount"]').type('5.50')
    cy.get('select[name="category"]').select('food')
    cy.get('button').contains('Add Expense').click()

    cy.contains('Coffee').should('be.visible')
    cy.contains('$5.50').should('be.visible')
  })

  it('edits existing expense', () => {
    cy.get('button[aria-label="Edit"]').first().click()
    cy.get('input[name="description"]').clear().type('Updated')
    cy.get('button').contains('Update Expense').click()

    cy.contains('Updated').should('be.visible')
  })

  it('deletes expense', () => {
    cy.get('button[aria-label="Delete"]').first().click()
    cy.get('button').contains('Delete').click()

    cy.contains('Deleted successfully').should('be.visible')
  })
})
```

Create `cypress/support/commands.js`:

```js
Cypress.Commands.add('login', (email, password) => {
  cy.visit('http://localhost:3000/login')
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/dashboard')
})
```

## Manual Testing Checklist

### Functional Testing

- [ ] Login/Logout functionality works
- [ ] Protected routes redirect to login
- [ ] All CRUD operations work correctly
- [ ] Form validation works
- [ ] Error messages display correctly
- [ ] Loading states show appropriately
- [ ] Notifications appear and dismiss

### UI/UX Testing

- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Navigation is intuitive
- [ ] Colors have sufficient contrast
- [ ] Fonts are readable
- [ ] Spacing is consistent
- [ ] Hover states are visible
- [ ] Animations are smooth

### Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers

### Performance Testing

- [ ] Page loads quickly
- [ ] No console errors
- [ ] No memory leaks
- [ ] Images are optimized
- [ ] Bundle size is reasonable

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] ARIA labels present
- [ ] Color not only indicator
- [ ] Focus visible

## Continuous Integration Testing

### GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install
        run: npm install

      - name: Lint
        run: npm run lint

      - name: Unit Tests
        run: npm run test:unit

      - name: E2E Tests
        run: npm run test:e2e
```

## Testing Best Practices

### 1. Test Behavior, Not Implementation

```js
// ✅ Good
test('form submits when button is clicked', () => {
  // ...
})

// ❌ Bad
test('state.isSubmitting becomes true', () => {
  // ...
})
```

### 2. Use Descriptive Test Names

```js
// ✅ Good
test('displays email error message when email format is invalid', () => {
  // ...
})

// ❌ Bad
test('email validation', () => {
  // ...
})
```

### 3. Test User Interactions

```js
// ✅ Good
userEvent.type(emailInput, 'test@example.com')
userEvent.click(submitButton)

// ❌ Bad
fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
```

### 4. Avoid Testing Implementation Details

```js
// ✅ Good
expect(screen.getByText('Success')).toBeInTheDocument()

// ❌ Bad
expect(component.state.showMessage).toBe(true)
```

## Code Coverage

Generate coverage report:

```bash
npm run test:coverage
```

Target coverage:

- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

## Common Testing Patterns

### Testing Async Operations

```js
test('fetches data on mount', async () => {
  render(<Component />)

  expect(screen.getByText('Loading...')).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument()
  })
})
```

### Testing Redux Connected Components

```js
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import authReducer from '@/store/slices/authSlice'

const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: initialState,
  })
}

test('component renders with Redux state', () => {
  const store = createMockStore({
    auth: { isAuthenticated: true, user: { name: 'John' } },
  })

  render(
    <Provider store={store}>
      <Component />
    </Provider>
  )
})
```

## Debugging Tests

### Debug Utilities

```js
import { render, screen } from '@testing-library/react'

render(<Component />)

// Print entire DOM
screen.debug()

// Print specific element
screen.debug(screen.getByRole('button'))

// Log all available queries
console.log(screen.logTestingPlaygroundURL())
```

## Resources

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

Happy testing! 🧪
