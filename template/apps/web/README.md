# {{PROJECT_NAME_TITLE}} Web App

The main web application built with SvelteKit, featuring authentication, responsive design, and modern development practices.

## 🚀 Quick Start

```bash
# From the root directory
pnpm web

# Or from this directory (apps/web)
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## 🏗️ Project Structure

```
apps/web/
├── src/
│   ├── lib/
│   │   ├── lucia/           # Authentication system
│   │   │   ├── scrypt/      # Password hashing
│   │   │   ├── cookie.ts    # Cookie management
│   │   │   ├── core.ts      # Lucia core configuration
│   │   │   ├── crypto.ts    # Cryptographic utilities
│   │   │   ├── database.ts  # Database adapter interface
│   │   │   └── index.ts     # Main auth exports
│   │   ├── stores/          # Svelte stores
│   │   │   ├── index.ts     # Store exports
│   │   │   └── use-shared-store.ts  # Shared store utilities
│   │   └── util/            # Utility functions
│   │       └── binary.ts    # Binary data helpers
│   ├── routes/              # SvelteKit routes
│   │   ├── +layout.server.ts    # Root layout server load
│   │   ├── +layout.svelte       # Root layout component
│   │   └── +page.svelte         # Home page
│   ├── app.html            # HTML template
│   ├── app.css             # Global styles
│   └── custom.css          # Custom CSS additions
├── static/                 # Static assets
├── package.json           # Dependencies and scripts
├── svelte.config.js       # SvelteKit configuration
├── tailwind.config.js     # TailwindCSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## 🔐 Authentication System

### Lucia Integration

This app uses **Lucia** for secure, session-based authentication:

```typescript
// lib/lucia/index.ts
import { Lucia } from './core'
import type { DatabaseUser, DatabaseSession } from './database'

// Type-safe user and session handling
export interface User {
  id: string
  // Add your user properties
}

export interface Session {
  id: string
  userId: string
  expiresAt: Date
  fresh: boolean
}
```

### Key Features

- **🔒 Secure sessions** with HTTP-only cookies
- **🔑 Password hashing** using scrypt algorithm
- **🛡️ CSRF protection** built-in
- **📱 Device management** with session tracking
- **⚡ Fast validation** with optimized queries

### Authentication Flow

1. **Registration/Login** → Password hashed with scrypt
2. **Session creation** → Secure cookie set
3. **Request validation** → Automatic session checks
4. **Logout** → Session invalidation

### Usage Examples

```typescript
// In a server load function (+page.server.ts)
import { lucia } from '$lib/lucia'

export const load = async ({ cookies }) => {
  const sessionId = lucia.readSessionCookie(cookies.get('session'))
  if (!sessionId) return { user: null }
  
  const { user, session } = await lucia.validateSession(sessionId)
  return { user, session }
}

// In an action (+page.server.ts)
export const actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData()
    const email = data.get('email')
    const password = data.get('password')
    
    // Verify user and create session
    const session = await lucia.createSession(userId, {})
    const cookie = lucia.createSessionCookie(session.id)
    cookies.set(cookie.name, cookie.value, cookie.attributes)
  }
}
```

## 🎨 Styling & Design

### TailwindCSS + DaisyUI

The app uses a modern design system:

```javascript
// tailwind.config.js
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      // Custom theme extensions
    }
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: ['light', 'dark', 'cupcake', 'cyberpunk']
  }
}
```

### Design System

- **🎨 DaisyUI Components** - Pre-built, accessible components
- **📱 Responsive Design** - Mobile-first approach
- **🌙 Dark Mode** - Built-in theme switching
- **🎯 Utility Classes** - Rapid development with Tailwind
- **⚡ Custom Components** - Reusable Svelte components

### Available Themes

Switch themes dynamically:

```svelte
<script>
  import { browser } from '$app/environment'
  
  function setTheme(theme) {
    if (browser) {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }
</script>

<select on:change={(e) => setTheme(e.target.value)}>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
  <option value="cupcake">Cupcake</option>
  <option value="cyberpunk">Cyberpunk</option>
</select>
```

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm check` | Run Svelte type checking |
| `pnpm check:watch` | Type check in watch mode |

### Development Server

```bash
# Start with custom port
pnpm dev --port 3000

# Start with host binding
pnpm dev --host

# Start with HTTPS
pnpm dev --https
```

### Environment Variables

Create `.env` in this directory:

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost/db"

# Authentication
AUTH_SECRET="your-super-secure-secret-key"

# Optional: External APIs
PUBLIC_API_URL="https://api.example.com"
PRIVATE_API_KEY="your-private-key"

# Development
VITE_DEV_MODE=true
```

### Adding New Routes

SvelteKit uses file-based routing:

```
src/routes/
├── +layout.svelte          # Root layout
├── +page.svelte           # Home page (/)
├── about/
│   └── +page.svelte       # About page (/about)
├── auth/
│   ├── login/
│   │   └── +page.svelte   # Login (/auth/login)
│   └── register/
│       └── +page.svelte   # Register (/auth/register)
└── dashboard/
    ├── +layout.svelte     # Dashboard layout
    ├── +page.svelte       # Dashboard home (/dashboard)
    └── profile/
        └── +page.svelte   # Profile (/dashboard/profile)
```

### Server-Side Features

```typescript
// +page.server.ts - Server load function
export const load = async ({ params, url, cookies }) => {
  // Server-side data loading
  return {
    data: await fetchData(),
    user: await getUser(cookies)
  }
}

// +page.server.ts - Form actions
export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData()
    // Handle form submission
  },
  
  create: async ({ request }) => {
    // Named action
  }
}
```

## 📦 State Management

### Svelte Stores

The app includes shared store utilities:

```typescript
// lib/stores/use-shared-store.ts
import { writable, readable } from 'svelte/store'

// Create shared stores
export const user = writable(null)
export const theme = writable('light')
export const notifications = writable([])

// Usage in components
import { user } from '$lib/stores'

$: if ($user) {
  console.log('User logged in:', $user.email)
}
```

### Global State

```typescript
// lib/stores/index.ts
export const pageTitle = () => writable('{{PROJECT_NAME_TITLE}}')
export const isLoading = writable(false)
export const currentUser = writable(null)
```

## 🚀 Building & Deployment

### Production Build

```bash
# Build the application
pnpm build

# Preview the build
pnpm preview
```

### Deployment Options

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
pnpm build
netlify deploy --prod --dir=build
```

#### Node.js Server

```bash
# Build for Node.js
pnpm build

# Start the server
node build
```

#### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "build"]
```

### Adapter Configuration

Update `svelte.config.js` for your deployment target:

```javascript
import adapter from '@sveltejs/adapter-auto' // Auto-detect
// import adapter from '@sveltejs/adapter-vercel' // Vercel
// import adapter from '@sveltejs/adapter-netlify' // Netlify
// import adapter from '@sveltejs/adapter-node' // Node.js

export default {
  kit: {
    adapter: adapter()
  }
}
```

## 🧪 Testing

### Component Testing

```bash
# Add testing dependencies
pnpm add -D vitest @testing-library/svelte jsdom
```

```typescript
// src/lib/components/__tests__/Button.test.ts
import { render, screen } from '@testing-library/svelte'
import Button from '../Button.svelte'

test('renders button with text', () => {
  render(Button, { props: { text: 'Click me' } })
  expect(screen.getByRole('button')).toHaveTextContent('Click me')
})
```

### E2E Testing

```bash
# Add Playwright
pnpm add -D @playwright/test
npx playwright install
```

```typescript
// tests/homepage.spec.ts
import { test, expect } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('{{PROJECT_NAME_TITLE}}')
})
```

## 🔧 Configuration

### TypeScript

The app uses strict TypeScript configuration:

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": false,
    "strictNullChecks": false
  }
}
```

### Vite Configuration

```typescript
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'

export default {
  plugins: [
    sveltekit(),
    tailwindcss()
  ],
  server: {
    host: true // Allow external connections
  }
}
```

## 📚 Learn More

### SvelteKit Resources

- [SvelteKit Documentation](https://kit.svelte.dev/)
- [Svelte Tutorial](https://svelte.dev/tutorial)
- [SvelteKit FAQ](https://kit.svelte.dev/faq)

### Authentication

- [Lucia Auth Docs](https://lucia-auth.com/)
- [SvelteKit Auth Guide](https://lucia-auth.com/guides/email-and-password/sveltekit)

### Styling

- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)
- [Svelte Styling Guide](https://svelte.dev/docs#component-format-style)

## 🐛 Troubleshooting

### Common Issues

**Build fails with TypeScript errors:**
```bash
pnpm check
# Fix any type errors before building
```

**Authentication not working:**
- Check `AUTH_SECRET` environment variable
- Verify database connection
- Check cookie settings in production

**Styles not loading:**
- Verify TailwindCSS is processing correctly
- Check `app.css` imports
- Ensure DaisyUI plugin is configured

**Development server issues:**
```bash
# Clear SvelteKit cache
rm -rf .svelte-kit

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

## 🤝 Contributing

When working on the web app:

1. **Follow naming conventions** - Use kebab-case for files
2. **Type everything** - Leverage TypeScript fully
3. **Test components** - Add tests for new features
4. **Document APIs** - Use JSDoc for functions
5. **Optimize images** - Use appropriate formats and sizes

---

**Part of the {{PROJECT_NAME_TITLE}} monorepo** | Built with SvelteKit + Lucia + TailwindCSS
