# create-chillenious-sveltekit

> Create a simple monorepo with a structure for CLI tools and a Sveltekit web app, using PNPM to manage dependencies.

[![npm version](https://badge.fury.io/js/create-chillenious-sveltekit.svg)](https://www.npmjs.com/package/create-chillenious-sveltekit)
[![Downloads](https://img.shields.io/npm/dm/create-chillenious-sveltekit.svg)](https://www.npmjs.com/package/create-chillenious-sveltekit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start

```bash
# Create a new project
npx create-chillenious-sveltekit my-awesome-app

# Or with npm
npm create chillenious-sveltekit my-awesome-app

# Or with yarn
yarn create chillenious-sveltekit my-awesome-app

# Or with pnpm
pnpm create chillenious-sveltekit my-awesome-app
```

## 📖 Usage

### Interactive Mode

Run without arguments for interactive setup:

```bash
npx create-chillenious-sveltekit
```

You'll be prompted for:
- Project name
- Additional features (examples, database setup)
- Configuration options

### Command Line Arguments

```bash
npx create-chillenious-sveltekit [project-name] [options]
```

#### Options

| Flag | Description | Default |
|------|-------------|---------|
| `--skip-install` | Skip automatic dependency installation | `false` |
| `--skip-git` | Skip git repository initialization | `false` |
| `-h, --help` | Show help information | - |
| `-V, --version` | Show version number | - |

#### Examples

```bash
# Create project with custom name
npx create-chillenious-sveltekit my-music-app

# Skip dependency installation
npx create-chillenious-sveltekit my-app --skip-install

# Skip git initialization
npx create-chillenious-sveltekit my-app --skip-git

# Skip both
npx create-chillenious-sveltekit my-app --skip-install --skip-git
```

## 🏗️ Generated Project Structure

```
my-awesome-app/
├── apps/
│   └── web/                    # SvelteKit web application
│       ├── src/
│       │   ├── lib/
│       │   │   ├── lucia/      # Authentication system
│       │   │   ├── stores/     # Svelte stores
│       │   │   └── util/       # Utilities
│       │   ├── routes/         # SvelteKit routes
│       │   ├── app.html        # HTML template
│       │   └── app.css         # Global styles
│       ├── static/             # Static assets
│       ├── package.json
│       ├── svelte.config.js
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       └── vite.config.ts
├── packages/
│   ├── datastore/              # Data layer utilities
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── logger/                 # Shared logging
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── tools/
│   └── cli/                    # Command-line tools
│       ├── src/
│       ├── bin/
│       ├── package.json
│       └── tsconfig.json
├── package.json                # Root workspace config
├── pnpm-workspace.yaml         # Workspace definition
├── tsconfig.json               # TypeScript config
├── .eslintrc                   # ESLint config
├── .gitignore                  # Git ignore rules
├── prettier.config.js          # Prettier config
└── README.md                   # Project documentation
```

## 🔧 Customization

### Template Variables

The generator replaces these variables throughout the template:

- `{{PROJECT_NAME}}` - Kebab-case project name (e.g., `my-awesome-app`)
- `{{PROJECT_NAME_TITLE}}` - Title case name (e.g., `My Awesome App`)
- `{{PROJECT_NAME_CAMEL}}` - CamelCase name (e.g., `myAwesomeApp`)
- `{{PROJECT_NAME_PASCAL}}` - PascalCase name (e.g., `MyAwesomeApp`)

### File Processing

The generator processes all text files and:

- Replaces template variables
- Updates package names and de
