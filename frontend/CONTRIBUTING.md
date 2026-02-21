# Contributing to Expense Tracker

Thank you for considering contributing to this project! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others and celebrate wins

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Make your changes
5. Commit with clear messages: `git commit -m "feat: add your feature"`
6. Push to your fork: `git push origin feature/your-feature`
7. Submit a Pull Request

## Development Setup

```bash
npm install
npm run dev
```

## Code Style

### General Guidelines

- Use 2 spaces for indentation
- Use single quotes for strings
- Use semicolons
- Maximum line length: 80 characters
- Use meaningful variable names

### Component Guidelines

- Use functional components with hooks
- Use PascalCase for component names
- One component per file
- Keep components small and focused
- Use proper prop validation

### File Structure

```
feature/
├── ComponentName.jsx    # Main component
├── ComponentName.css    # Styles (if needed)
└── index.js            # Exports
```

### Naming Conventions

- **Components**: `PascalCase` (Dashboard.jsx)
- **Functions**: `camelCase` (handleSubmit)
- **Constants**: `UPPER_SNAKE_CASE` (MAX_RETRIES)
- **CSS Classes**: `kebab-case` (btn-primary)
- **File names**: match component names

## JavaScript Best Practices

### Use ES6+ Features

```js
// ✅ Good
const multiply = (a, b) => a * b

// ❌ Avoid
function multiply(a, b) {
  return a * b
}
```

### Destructuring

```js
// ✅ Good
const { name, email } = user

// ❌ Avoid
const name = user.name
const email = user.email
```

### Template Literals

```js
// ✅ Good
const message = `Hello, ${name}!`

// ❌ Avoid
const message = 'Hello, ' + name + '!'
```

### Error Handling

```js
// ✅ Good
try {
  const result = await fetchData()
} catch (error) {
  console.error('Failed to fetch:', error)
}

// ❌ Avoid
fetch('/api/data').then((r) => r.json())
```

## React Best Practices

### Hooks Usage

```js
// ✅ Good
const [count, setCount] = useState(0)
useEffect(() => {
  // side effects
}, [])

// ❌ Avoid
const [state, setState] = useState()
useEffect(() => {
  // without dependencies
})
```

### Props Passing

```js
// ✅ Good
<Component
  title="Title"
  onClick={handleClick}
  isActive={true}
/>

// ❌ Avoid
<Component title={"Title"} {...props} />
```

### Keys in Lists

```js
// ✅ Good
{
  items.map((item) => <div key={item.id}>{item.name}</div>)
}

// ❌ Avoid
{
  items.map((item, index) => <div key={index}>{item.name}</div>)
}
```

## Testing

Before submitting a PR:

- Test your changes thoroughly
- Test on different screen sizes
- Test in different browsers
- Verify no console errors/warnings

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add new expense filter feature
fix: resolve sidebar toggle bug
docs: update README with new API endpoints
style: format code with prettier
refactor: reorganize component structure
chore: update dependencies
```

## Pull Request Process

1. Update README.md if needed
2. Add/update tests if applicable
3. Verify all changes pass linting
4. Keep PR focused on one feature
5. Write clear PR description
6. Link related issues
7. Request review from maintainers

## Documentation

When adding new features:

- Update README.md
- Add JSDoc comments for complex functions
- Document API changes
- Add usage examples

## Performance Considerations

- Avoid unnecessary renders with useMemo/useCallback
- Use lazy loading for routes/components
- Optimize images and assets
- Monitor bundle size
- Profile with React DevTools

## Accessibility

- Use semantic HTML
- Add proper ARIA labels
- Ensure keyboard navigation
- Test with screen readers
- Maintain sufficient color contrast

## Security

- Never commit sensitive data (.env files)
- Validate user input
- Sanitize output
- Use secure HTTP methods
- Keep dependencies updated

## Questions or Issues?

- Open a GitHub issue for bugs/features
- Check existing issues before opening new ones
- Provide detailed reproduction steps
- Include your environment details

## License

By contributing, you agree your changes are under the MIT license.

Thank you for contributing! 🎉
