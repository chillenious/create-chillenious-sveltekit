# {{PROJECT_NAME_TITLE}}

A modern full-stack application built with SvelteKit, featuring monorepo architecture.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm web

# Build for production
pnpm build
```

## 📦 What's Included

- **🎯 SvelteKit** - Modern web framework with SSR/SPA support
- **🔐 Lucia Authentication** - Secure session-based auth setup
- **📦 Monorepo Structure** - Organized with pnpm workspaces
- **🎨 TailwindCSS + DaisyUI** - Beautiful, responsive design system
- **🛠️ TypeScript** - Full type safety throughout the stack
- **🧪 Development Tools** - ESLint, Prettier, and CLI utilities
- **⚡ Fast Development** - Hot module replacement and instant updates

## 🏗️ Project Structure

```
{{PROJECT_NAME}}/
├── apps/
│   └── web/                 # SvelteKit web application
│       ├── src/
│       │   ├── lib/         # Shared components and utilities
│       │   │   ├── lucia/   # Authentication logic
│       │   │   └── stores/  # Svelte stores
│       │   └── routes/      # SvelteKit routes
│       └── static/          # Static assets
├── packages/
│   ├── datastore/          # Data layer and database utilities
│   └── logger/             # Shared logging functionality
├── tools/
│   └── cli/                # Command-line tools and scripts
└── package.json            # Root workspace configuration
```

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `pnpm web` | Start development server |
| `pnpm build` | Build all packages for production |
| `pnpm cli` | Run CLI tools |
| `pnpm format` | Format code with Prettier |
| `pnpm lint` | Lint code with ESLint |
| `pnpm clean` | Clean all build artifacts |

## 🔧 Development

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **pnpm** 9+

### Getting Started

1. **Clone and install**:
   ```bash
   git clone <your-repo-url>
   cd {{PROJECT_NAME}}
   pnpm install
   ```

2. **Start development**:
   ```bash
   pnpm web
   ```
   Open [http://localhost:8080](http://localhost:8080) in your browser.

3. **Build for production**:
   ```bash
   pnpm build
   ```

### Environment Setup

Create a `.env` file in `apps/web/`:

```env
# Database (if using)
DATABASE_URL="your-database-url"

# Authentication
AUTH_SECRET="your-secret-key"

# Optional: External APIs
API_KEY="your-api-key"
```

## 🔐 Authentication

This project includes a complete authentication setup using **Lucia**:

- **Session-based authentication** with secure cookies
- **Password hashing** using scrypt
- **User registration and login** flows
- **Protected routes** and middleware
- **Type-safe** user sessions

### Auth Features

- ✅ Secure session management
- ✅ Password hashing and verification
- ✅ CSRF protection
- ✅ TypeScript integration
- ✅ Cookie-based sessions

## 🎨 Styling

### TailwindCSS + DaisyUI

- **Utility-first** CSS framework
- **Component library** with DaisyUI
- **Dark/light mode** support
- **Responsive design** out of the box
- **Custom themes** easily configurable

### Customization

Update `apps/web/tailwind.config.js`:

```js
export default {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-secondary',
      }
    }
  },
  daisyui: {
    themes: ['light', 'dark', 'cupcake']
  }
}
```

## 📱 Features

### Web Application (`apps/web`)

- **Modern SvelteKit** setup with TypeScript
- **File-based routing** with nested layouts
- **Server-side rendering** with client hydration
- **API routes** for backend functionality
- **Form actions** with progressive enhancement

### Shared Packages

- **`@{{PROJECT_NAME}}/logger`** - Centralized logging with Winston
- **`@{{PROJECT_NAME}}/datastore`** - Database utilities and models

### CLI Tools (`tools/cli`)

- **Development utilities** built with oclif
- **Code generation** and scaffolding
- **Database migrations** and seeding
- **Custom commands** for your workflow

## 🚀 Deployment

### Build Production

```bash
# Build all packages
pnpm build

# Preview production build
pnpm preview
```

### Deployment Options

**Recommended platforms:**

- **Vercel** - Zero-config deployment with SvelteKit adapter
- **Netlify** - Static site hosting with edge functions
- **Node.js** - Self-hosted with adapter-node
- **Docker** - Containerized deployment

### Docker Example

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "build"]
```

## 🧪 Testing

### Setup Testing (Optional)

```bash
# Add testing dependencies
pnpm add -D vitest @testing-library/svelte jsdom

# Add test script to package.json
"test": "vitest"
```

### Example Test

```typescript
import { render, screen } from '@testing-library/svelte'
import Component from './Component.svelte'

test('renders correctly', () => {
  render(Component)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

## 📚 Learn More

### SvelteKit Resources

- [SvelteKit Documentation](https://kit.svelte.dev/)
- [Svelte Tutorial](https://svelte.dev/tutorial)
- [SvelteKit Examples](https://github.com/sveltejs/kit/tree/master/examples)

### Authentication with Lucia

- [Lucia Documentation](https://lucia-auth.com/)
- [Authentication Guide](https://lucia-auth.com/guides/email-and-password/sveltekit)

### Styling Resources

- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature-name`
3. **Make your changes** and add tests
4. **Run linting**: `pnpm lint`
5. **Format code**: `pnpm format`
6. **Commit changes**: `git commit -m 'Add feature'`
7. **Push to branch**: `git push origin feature-name`
8. **Submit a pull request**

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SvelteKit** team for the amazing framework
- **Lucia** for secure authentication primitives
- **TailwindCSS** for the utility-first approach
- **DaisyUI** for beautiful components
- **The open source community** for inspiration and tools

---

**Built with ❤️ using create-chillenious-sveltekit**
