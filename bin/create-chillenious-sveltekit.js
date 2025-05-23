#!/usr/bin/env node

import {Command} from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import prompts from 'prompts';
import {execSync} from 'child_process';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
    .name('create-chillenious-sveltekit')
    .description('Create a new SvelteKit application with monorepo structure')
    .version('1.0.0')
    .argument('[project-name]', 'Name of the project to create')
    .option('-t, --template <template>', 'Template to use', 'default')
    .option('--skip-install', 'Skip package installation')
    .option('--skip-git', 'Skip git initialization')
    .action(async (projectName, options) => {
        await createProject(projectName, options);
    });

// Utility functions
function toCamelCase(str) {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

function toPascalCase(str) {
    return str.replace(/(?:^|-)([a-z])/g, (match, letter) => letter.toUpperCase());
}

function toKebabCase(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

async function replaceTemplateVariables(dir, variables) {
    const files = await getAllFiles(dir);

    for (const file of files) {
        // Skip binary files, node_modules, and .git
        if (file.includes('node_modules') || file.includes('.git') || isBinaryFile(file)) continue;

        try {
            let content = fs.readFileSync(file, 'utf8');

            // Replace all template variables
            for (const [key, value] of Object.entries(variables)) {
                const regex = new RegExp(`{{${key}}}`, 'g');
                content = content.replace(regex, value);
            }

            // Replace @riffcraft with @projectname throughout
            content = content.replace(/@riffcraft\//g, `@${variables.PROJECT_NAME}/`);
            // Replace standalone riffcraft references
            content = content.replace(/\briffcraft\b/g, variables.PROJECT_NAME);
            // Replace Riffcraft (capitalized) references
            content = content.replace(/\bRiffcraft\b/g, variables.PROJECT_NAME_TITLE);

            fs.writeFileSync(file, content, 'utf8');
        } catch (error) {
            // Skip files that can't be read as text
            continue;
        }
    }
}

async function getAllFiles(dir) {
    const files = [];

    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);

        for (const item of items) {
            // Skip hidden files and directories except .env.example
            if (item.startsWith('.') && item !== '.env.example' && item !== '.eslintrc' && item !== '.gitignore') {
                continue;
            }

            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                traverse(fullPath);
            } else {
                files.push(fullPath);
            }
        }
    }

    traverse(dir);
    return files;
}

function isBinaryFile(filePath) {
    const binaryExtensions = [
        '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.webp',
        '.woff', '.woff2', '.ttf', '.eot', '.otf',
        '.mp4', '.mp3', '.avi', '.mov', '.wmv',
        '.zip', '.tar', '.gz', '.rar', '.7z',
        '.exe', '.dmg', '.pkg', '.deb', '.rpm'
    ];
    return binaryExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
}

function validateProjectName(name) {
    if (!name || !name.trim()) {
        return 'Project name is required';
    }

    const trimmed = name.trim();

    if (!/^[a-z0-9-_]+$/i.test(trimmed)) {
        return 'Project name should only contain letters, numbers, hyphens, and underscores';
    }

    if (trimmed.length < 2) {
        return 'Project name should be at least 2 characters long';
    }

    if (trimmed.length > 50) {
        return 'Project name should be less than 50 characters long';
    }

    // Check for reserved names
    const reservedNames = ['node', 'npm', 'pnpm', 'yarn', 'test', 'src', 'dist', 'build'];
    if (reservedNames.includes(trimmed.toLowerCase())) {
        return `"${trimmed}" is a reserved name. Please choose a different name.`;
    }

    return true;
}

async function initializeGit(projectDir, projectName) {
    try {
        process.chdir(projectDir);
        execSync('git init', {stdio: 'pipe'});
        execSync('git add .', {stdio: 'pipe'});
        execSync(`git commit -m "Initial commit for ${projectName}"`, {stdio: 'pipe'});
        return true;
    } catch (error) {
        return false;
    }
}

async function createProject(projectName, options) {
    console.log(chalk.blue('🚀 Welcome to SvelteKit!'));
    console.log(chalk.gray('Creating a SvelteKit app with monorepo structure.\n'));

    // Get project name if not provided
    if (!projectName) {
        const response = await prompts({
            type: 'text',
            name: 'projectName',
            message: 'What is your project name?',
            initial: 'my-sveltekit-app',
            validate: validateProjectName
        });

        if (!response.projectName) {
            console.log(chalk.red('Project creation cancelled.'));
            process.exit(1);
        }

        projectName = response.projectName.trim();
    } else {
        const validation = validateProjectName(projectName);
        if (validation !== true) {
            console.log(chalk.red(`Error: ${validation}`));
            process.exit(1);
        }
    }

    // Normalize project name
    const normalizedProjectName = toKebabCase(projectName);
    const projectTitle = projectName.split(/[-_]/).map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');

    const targetDir = path.resolve(process.cwd(), normalizedProjectName);

    // Check if directory exists
    if (fs.existsSync(targetDir)) {
        const response = await prompts({
            type: 'confirm',
            name: 'overwrite',
            message: `Directory ${normalizedProjectName} already exists. Overwrite?`,
            initial: false
        });

        if (!response.overwrite) {
            console.log(chalk.red('Project creation cancelled.'));
            process.exit(1);
        }

        console.log(chalk.yellow('Removing existing directory...'));
        fs.removeSync(targetDir);
    }

    const spinner = ora('Creating project structure...').start();

    try {
        // Copy template files
        const templateDir = path.join(__dirname, '..', 'template');

        if (!fs.existsSync(templateDir)) {
            spinner.fail('Template directory not found');
            console.log(chalk.red('Error: Template files are missing. Please reinstall the package.'));
            process.exit(1);
        }

        fs.copySync(templateDir, targetDir);

        // Prepare template variables
        const templateVars = {
            PROJECT_NAME: normalizedProjectName,
            PROJECT_NAME_CAMEL: toCamelCase(normalizedProjectName),
            PROJECT_NAME_PASCAL: toPascalCase(normalizedProjectName),
            PROJECT_NAME_TITLE: projectTitle
        };

        // Replace template variables in all files
        await replaceTemplateVariables(targetDir, templateVars);

        spinner.succeed('Project structure created!');

        if (!options.skipInstall) {
            const installSpinner = ora('Installing dependencies...').start();

            try {
                process.chdir(targetDir);

                // Check if pnpm is available, fallback to npm
                let packageManager = 'pnpm';
                try {
                    execSync('pnpm --version', {stdio: 'pipe'});
                } catch {
                    packageManager = 'npm';
                }

                execSync(`${packageManager} install`, {stdio: 'pipe'});
                installSpinner.succeed(`Dependencies installed with ${packageManager}!`);
            } catch (error) {
                installSpinner.fail('Failed to install dependencies');
                console.log(chalk.yellow('You can install dependencies manually by running:'));
                console.log(chalk.cyan(`  cd ${normalizedProjectName}`));
                console.log(chalk.cyan('  pnpm install  # or npm install'));
            }
        }

        // Initialize git repository
        if (!options.skipGit) {
            const gitSpinner = ora('Initializing git repository...').start();
            const gitSuccess = await initializeGit(targetDir, normalizedProjectName);

            if (gitSuccess) {
                gitSpinner.succeed('Git repository initialized!');
            } else {
                gitSpinner.warn('Git initialization skipped (git not available)');
            }
        }

        // Success message
        console.log();
        console.log(chalk.green('🎉 Project created successfully!'));
        console.log();
        console.log(chalk.bold('Next steps:'));
        console.log(chalk.cyan(`  cd ${normalizedProjectName}`));
        if (options.skipInstall) {
            console.log(chalk.cyan('  pnpm install  # or npm install'));
        }
        console.log(chalk.cyan('  pnpm web      # start development server'));
        console.log();
        console.log(chalk.bold('What you get:'));
        console.log('  🎯 SvelteKit with TypeScript');
        console.log('  📦 Monorepo with pnpm workspaces');
        console.log('  🎨 TailwindCSS + DaisyUI');
        console.log('  🛠️ CLI tools included');
        console.log('  📝 ESLint & Prettier configured');
        console.log();
        console.log(chalk.bold('Available commands:'));
        console.log(chalk.gray('  pnpm web      # Start web development server'));
        console.log(chalk.gray('  pnpm build    # Build all packages'));
        console.log(chalk.gray('  pnpm cli      # Run CLI tools'));
        console.log(chalk.gray('  pnpm format   # Format code'));
        console.log(chalk.gray('  pnpm lint     # Lint code'));
        console.log();
        console.log('Happy coding! 🚀');

    } catch (error) {
        spinner.fail('Failed to create project');
        console.error(chalk.red('Error details:'), error.message);

        // Clean up on failure
        if (fs.existsSync(targetDir)) {
            fs.removeSync(targetDir);
        }

        process.exit(1);
    }
}

// Handle process interruption
process.on('SIGINT', () => {
    console.log(chalk.red('\nProject creation cancelled.'));
    process.exit(1);
});

program.parse();
