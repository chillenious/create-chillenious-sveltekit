# {{PROJECT_NAME_TITLE}}

A modern full-stack application built with SvelteKit, featuring monorepo architecture and optimized for Bun.

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run web
```

## 🛠️ Available Commands

| Command             | Description               |
| ------------------- | ------------------------- |
| `bun run web`       | Start development server  |
| `bun run cli`       | Run CLI tools             |
| `bun run format`    | Format code with Prettier |
| `bun run lint`      | Lint code with ESLint     |
| `bun run clean:all` | Clean all build artifacts |

## 🔧 Development

### Prerequisites

- **Node.js** 24+
- **Bun** 1.1.34+

### Configuration

This project uses `bunfig.toml` for Bun-specific configuration. Key settings include:

- **Native TypeScript support**: No ts-node required
- **Built-in environment variables**: Using `bun --env-file`
- **Optimized package management**: Peer dependencies installed by default
- **Bun shell**: Cross-platform shell scripting

## 📦 Local Development Database (PostgreSQL with Docker)

This project uses Docker Compose to manage local PostgreSQL databases for development and testing, along with PgAdmin for database administration.

**Prerequisites:**

- Docker Desktop (or Docker Engine + Docker Compose) installed and running.

**Configuration Files:**

- `.env`: Configure your main development database. Copy from `.env.example` if it doesn't exist (`cp .env.example .env`).
  Key variables: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT`, `POSTGRES_DATA_DIR`.
- `.env.test`: Configure your test database. Copy from `.env.example` if it doesn't exist and modify it (`cp .env.example .env.test`).
  Key variables: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` (use a different name, e.g., `{{PROJECT_NAME}}_test_db`), `POSTGRES_PORT` (use a different port, e.g., `5433`, to avoid conflicts if running both dev and test DBs simultaneously), `POSTGRES_DATA_DIR` (use a different path, e.g., `./.pgdata_test`).

**Development Database Commands (uses `docker-compose.yml` and `.env`):**

- **Start the development database and PgAdmin:**

  ```bash
  bun run db:dev:up
  ```

  - Development PostgreSQL will be accessible on your host at the port specified by `POSTGRES_PORT` in `.env` (default: `5432`).
  - PgAdmin for the development database will be accessible at `http://localhost:${PGADMIN_PORT}` (from `.env`, default: `http://localhost:5050`).
  - When connecting to PostgreSQL from PgAdmin:
    - Host name/address: `postgres` (service name in `docker-compose.yml`)
    - Port: `5432` (internal port of the PostgreSQL container)
    - Maintenance database: Value of `POSTGRES_DB` from `.env`
    - Username: Value of `POSTGRES_USER` from `.env`
    - Password: Value of `POSTGRES_PASSWORD` from `.env`

- **Stop the development database and PgAdmin:**

  ```bash
  bun run db:dev:down
  ```

- **Stop and remove data volumes (deletes your local development database data):**

  ```bash
  bun run db:dev:down && docker-compose -f docker-compose.yml rm -sfv
  ```

- **View logs for development services:**

  ```bash
  docker-compose -f docker-compose.yml logs -f # Tail logs for all services
  docker-compose -f docker-compose.yml logs -f postgres # Tail logs for postgres
  docker-compose -f docker-compose.yml logs -f pgladmin # Tail logs for pgadmin
  ```

- **Seed the development database:**
  ```bash
  bun run seed:dev
  ```

**Test Database Commands (uses `docker-compose.test.yml` and `.env.test`):**

- **Start the test database and PgAdmin:**

  ```bash
  bun run db:test:up
  ```

  - Test PostgreSQL will be accessible on your host at the port specified by `POSTGRES_PORT` in `.env.test` (e.g., `5433`).
  - PgAdmin for the test database will be accessible at `http://localhost:${PGADMIN_PORT}` (from `.env.test`, e.g., `http://localhost:5051`).
  - Connection details for PgAdmin are similar to development, but use service name `postgres_test` and credentials/DB name from `.env.test`.

- **Stop the test database and PgAdmin:**

  ```bash
  bun run db:test:down
  ```

- **Reset the test database (stops, removes data volumes, and restarts):**

  ```bash
  bun run db:test:reset
  ```

- **Stop and remove data volumes (deletes your local test database data, if not using reset):**

  ```bash
  bun run db:test:down && docker-compose -f docker-compose.test.yml rm -sfv
  ```

- **View logs for test services:**

  ```bash
  docker-compose -f docker-compose.test.yml logs -f
  ```

- **Seed the test database:**
  ```bash
  bun run seed:test
  ```

**General Seeding Command (Placeholder):**

- **Seed the database (environment typically determined by other means or a flag):**
  ```bash
  bun run db:seed
  ```
  You will need to implement the logic for this script, potentially using arguments to specify the environment (dev/test) or the specific seeders to run.

## 🧪 Testing

### Datastore Integration Tests (`packages/datastore`)

The `packages/datastore` package contains integration tests that run against a dedicated test PostgreSQL database.

**Prerequisites:**

1.  **Configure Test Database:** Ensure your `.env.test` file in the project root is correctly set up (see "Local Development Database" section).
2.  **Start Test Database:** Before running tests, bring up the test database services:
    ```bash
    bun run db:test:up
    # Or, for a completely clean environment:
    # bun run db:test:reset
    ```

**Run tests:**

Bun's built-in test runner is used for datastore integration tests.

To run all tests in the project (including datastore integration tests), from the **project root**:

```bash
bun test
```

To run tests for a specific package (e.g., `@{{PROJECT_NAME}}/datastore`), from the **project root**:

```bash
bun run --cwd packages/datastore test
```

To run a specific test file within a package (e.g., `user.test.ts` in `@{{PROJECT_NAME}}/datastore`), from the **project root**:

```bash
bun run --cwd packages/datastore test user.test.ts
```

**After Testing:**

Don't forget to bring down the test database to free up resources:

```bash
bun run db:test:down
```

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

## 📦 What's Included

- **🎯 SvelteKit** - Modern web framework with SSR/SPA support
- **🔐 Lucia Authentication** - Secure session-based auth setup
- **📦 Monorepo Structure** - Organized with Bun workspaces
- **🎨 TailwindCSS v4 + DaisyUI** - Beautiful, responsive design system
- **🛠️ TypeScript** - Full type safety throughout the stack
- **🧪 Development Tools** - ESLint, Prettier, Biome, and CLI utilities
- **⚡ Fast Development** - Hot module replacement and instant updates
- **🐳 Docker Compose** - Local PostgreSQL database with PgAdmin
- **🏃 Bun Runtime** - Fast JavaScript runtime and package manager

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SvelteKit** team for the amazing framework
- **Lucia** for secure authentication primitives
- **TailwindCSS** for the utility-first approach
- **DaisyUI** for beautiful components
- **Bun** for the blazing-fast runtime

---

**Built with ❤️ using create-chillenious-sveltekit**
