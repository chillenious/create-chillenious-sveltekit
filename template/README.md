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

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SvelteKit** team for the amazing framework
- **Lucia** for secure authentication primitives
- **TailwindCSS** for the utility-first approach
- **DaisyUI** for beautiful components

---

**Built with ❤️ using create-chillenious-sveltekit**
