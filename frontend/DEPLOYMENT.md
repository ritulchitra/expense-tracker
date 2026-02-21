# Deployment Guide

This guide covers deploying the Expense Tracker React application to production.

## Production Build

### Build Locally

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder:

- All assets are minified
- JSX is transpiled to JavaScript
- CSS is bundled and minified
- Source maps are generated (optional, remove for smaller size)

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── main.[hash].js      # Main JavaScript bundle
│   ├── main.[hash].css     # Main CSS bundle
│   └── react.[hash].js     # React dependency bundle
└── vite.svg
```

## Preview Production Build

Test the production build locally:

```bash
npm run preview
```

This starts a local preview server at `http://localhost:4173`

## Environment Variables for Production

Create `.env.production` with production values:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_NAME=Expense Tracker
VITE_APP_VERSION=1.0.0
```

## Deployment Platforms

### 1. Vercel (Recommended for React)

#### Steps

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Deploy**

   ```bash
   vercel
   ```

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all VITE\_\* variables

#### Vercel Configuration (optional)

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_BASE_URL": "@api_base_url"
  }
}
```

### 2. Netlify

#### Steps

1. **Connect Repository**
   - Go to netlify.com
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Set Environment Variables**
   - Site settings → Build & deploy → Environment
   - Add environment variables

#### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, immutable, max-age=31536000"

[[headers]]
  for = "/"
  [headers.values]
    Cache-Control = "no-cache"
```

### 3. AWS S3 + CloudFront

#### Steps

1. **Build the Application**

   ```bash
   npm run build
   ```

2. **Upload to S3**

   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Create CloudFront Distribution**
   - Point origin to S3 bucket
   - Set default root object to `index.html`
   - Configure error responses to point to `index.html`

#### S3 Configuration

```bash
# Enable versioning
aws s3api put-bucket-versioning \
  --bucket your-bucket-name \
  --versioning-configuration Status=Enabled

# Configure for static website hosting
aws s3 website s3://your-bucket-name \
  --index-document index.html \
  --error-document index.html
```

### 4. Docker Container

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve to run the app
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

Build and run:

```bash
docker build -t expense-tracker:latest .
docker run -p 3000:3000 expense-tracker:latest
```

### 5. GitHub Pages

#### Using GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Update `vite.config.js`:

```js
export default defineConfig({
  base: '/expense-tracker/', // Repository name
  // ... rest of config
})
```

## Performance Optimization for Production

### 1. Enable Gzip Compression

Most hosting platforms (Vercel, Netlify) enable gzip automatically.

For custom deployments, configure your web server:

**Nginx**:

```nginx
gzip on;
gzip_types text/css application/javascript;
gzip_min_length 1000;
```

**Apache**:

```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/javascript
</IfModule>
```

### 2. Browser Caching

Set cache headers for assets:

```
Cache-Control: public, immutable, max-age=31536000
```

For HTML:

```
Cache-Control: no-cache, must-revalidate
```

### 3. Remove Source Maps

In production, source maps expose your code. Either:

- Don't generate them (edit `vite.config.js`)
- Serve them remotely or not at all

```js
export default defineConfig({
  build: {
    sourcemap: false, // Disable source maps
  },
})
```

### 4. Minification

Vite automatically minifies CSS and JavaScript in production.

### 5. Image Optimization

- Use modern formats (WebP)
- Optimize file sizes
- Use lazy loading
- Implement responsive images

## Security Considerations

### 1. HTTPS

Always use HTTPS in production. Most platforms (Vercel, Netlify) provide free SSL certificates.

### 2. CORS Configuration

If API is on different domain, configure CORS headers on backend:

```js
// Headers should allow your frontend domain
Access-Control-Allow-Origin: https://yourdomain.com
```

### 3. Environment Variables

Never commit `.env.production.local`. Use platform-specific environment variable management.

### 4. Content Security Policy

Add CSP headers to prevent XSS:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
```

### 5. Rate Limiting

Implement rate limiting on API endpoints to prevent abuse.

### 6. DDoS Protection

Use services like Cloudflare for DDoS protection.

## Database & Backend

### For Production

1. **Use Production Database**
   - PostgreSQL, MongoDB, etc.
   - Implement proper backups
   - Enable encryption

2. **API Endpoint Configuration**

   ```env
   VITE_API_BASE_URL=https://api.yourdomain.com
   ```

3. **Authentication**
   - Use secure JWT tokens
   - Implement refresh token rotation
   - Store tokens securely (httpOnly cookies preferred)

## Monitoring & Analytics

### 1. Error Tracking

Integrate Sentry for error monitoring:

```bash
npm install @sentry/react
```

Initialize in `main.jsx`:

```js
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: 'production',
})
```

### 2. Performance Monitoring

Use Web Vitals:

```bash
npm install web-vitals
```

### 3. Analytics

Integrate Google Analytics or Plausible:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || []
  function gtag() {
    dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', 'GA_ID')
</script>
```

## Deployment Checklist

- [ ] Production build succeeds without errors
- [ ] Environment variables configured correctly
- [ ] API base URL points to production API
- [ ] HTTPS enabled
- [ ] Gzip compression enabled
- [ ] Browser caching configured
- [ ] Source maps disabled
- [ ] Error tracking integrated
- [ ] Analytics integrated
- [ ] Database backups configured
- [ ] CDN configured (optional)
- [ ] Domain configured
- [ ] SSL certificate configured
- [ ] Monitoring alerts set up
- [ ] Tested on production domain

## Rollback Procedure

### For Vercel/Netlify

- Redeploy previous commit or use platform rollback feature

### For S3/CloudFront

- Restore previous version or revert upload

### For Docker

- Push new image tag and restart container with previous tag

## Continuous Integration/Deployment

### GitHub Actions Example

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## Support

For deployment issues:

1. Check platform documentation
2. Review logs and error messages
3. Verify environment variables
4. Test API connectivity
5. Check firewall/security rules

## Next Steps

After deployment:

1. Monitor application performance
2. Set up alerts for errors
3. Plan regular updates
4. Implement CI/CD pipeline
5. Document deployment process

---

Happy deploying! 🚀
