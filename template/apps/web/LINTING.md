# Linting & Formatting Setup

This SvelteKit project is configured with modern linting and formatting tools to ensure code quality and consistency.

## Tools Used

- **ESLint 9** with flat config for linting JavaScript, TypeScript, and Svelte files
- **Prettier** with Svelte and Tailwind CSS plugins for code formatting
- **TypeScript ESLint** for TypeScript-specific rules
- **Svelte ESLint Plugin** for Svelte-specific linting rules

## Available Scripts

```bash
# Lint all files and report issues
bun run lint

# Lint and auto-fix issues where possible
bun run lint:fix

# Format all files with Prettier
bun run format

# Check if files are properly formatted (useful for CI)
bun run format:check
```

## VS Code Integration

The project includes VS Code configuration files:

- `.vscode/settings.json` - Editor settings for optimal development experience
- `.vscode/extensions.json` - Recommended extensions for SvelteKit development

### Key Features

- **Auto-format on save** - Files are automatically formatted when saved
- **ESLint integration** - Linting errors are shown inline in the editor
- **Tailwind CSS IntelliSense** - Auto-completion for Tailwind classes in Svelte files
- **TypeScript support** - Enhanced TypeScript development experience

## Configuration Files

- `eslint.config.js` - ESLint configuration with flat config format
- `prettier.config.js` - Prettier formatting configuration
- `.prettierignore` - Files and directories to exclude from formatting

## Key Rules

### ESLint Rules

- **TypeScript**: Strict type checking with recommended rules
- **Svelte**: Svelte-specific linting rules for best practices
- **Import sorting**: Consistent import organization
- **No console logs**: Warnings for console.log (errors/warnings allowed)

### Prettier Formatting

- **Single quotes** for JavaScript/TypeScript
- **2 spaces** for indentation
- **Semicolons** required
- **100 character** line width
- **ES5 trailing commas**
- **Tailwind class sorting** automatic

## Recommended Development Workflow

1. **Install recommended extensions** when prompted by VS Code
2. **Enable format on save** (included in settings)
3. **Run linting before commits**:
   ```bash
   bun run lint
   bun run format:check
   ```
4. **Fix issues automatically** where possible:
   ```bash
   bun run lint:fix
   bun run format
   ```

## Integration with Biome

This project uses ESLint and Prettier instead of Biome for the web application. The root `biome.json` excludes the `apps/web/**/*` directory to avoid conflicts.

## Troubleshooting

### ESLint Issues

- Ensure TypeScript files are included in `tsconfig.json`
- Check that file extensions are properly configured
- Verify `import.meta.dirname` is available (Node.js 20.11+)

### Prettier Issues

- Verify plugins are installed correctly
- Check `.prettierignore` if files aren't being formatted
- Ensure VS Code is using the workspace Prettier configuration

### VS Code Issues

- Reload the window after installing extensions
- Check that the Svelte extension is enabled
- Verify ESLint extension is using the flat config format 