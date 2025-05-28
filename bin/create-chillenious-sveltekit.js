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
    const totalFiles = files.filter(file =>
        !file.includes('node_modules') &&
        !file.includes('.git') &&
        !isBinaryFile(file)
    ).length;

    let processedFiles = 0;

    for (const file of files) {
        // Skip binary files, node_modules, and .git
        if (file.includes('node_modules') || file.includes('.git') || isBinaryFile(file)) continue;

        try {
            const content = await fs.readFile(file, 'utf8');
            let newContent = content;

            // Replace all template variables
            for (const [key, value] of Object.entries(variables)) {
                const regex = new RegExp(`{{${key}}}`, 'g');
                newContent = newContent.replace(regex, value);
            }

            if (newContent !== content) {
                await fs.writeFile(file, newContent, 'utf8');
            }

            processedFiles++;

            // Small delay every 10 files to let spinner animate
            if (processedFiles % 10 === 0) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        } catch (error) {
            // Skip files that can't be read as text
            continue;
        }
    }
}

async function getAllFiles(dir) {
    const files = [];

    async function traverse(currentDir) {
        const items = await fs.readdir(currentDir);

        for (const item of items) {
            // Skip hidden files and directories except specific ones
            if (item.startsWith('.') &&
                !['env.example', '.eslintrc', '.gitignore', '.npmrc'].includes(item)) {
                continue;
            }

            const fullPath = path.join(currentDir, item);
            const stat = await fs.stat(fullPath);

            if (stat.isDirectory()) {
                await traverse(fullPath);
            } else {
                files.push(fullPath);
            }
        }
    }

    await traverse(dir);
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
        const originalCwd = process.cwd();
        process.chdir(projectDir);

        execSync('git init', {stdio: 'pipe'});
        await new Promise(resolve => setTimeout(resolve, 100));

        execSync('git add .', {stdio: 'pipe'});
        await new Promise(resolve => setTimeout(resolve, 100));

        execSync(`git commit -m "Initial commit for ${projectName}"`, {stdio: 'pipe'});

        process.chdir(originalCwd);
        return true;
    } catch (error) {
        return false;
    }
}

async function copyTemplateAsync(src, dest, spinner) {
    try {
        const stats = await fs.stat(src);

        if (stats.isDirectory()) {
            await fs.ensureDir(dest);
            const files = await fs.readdir(src);

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const srcPath = path.join(src, file);
                const destPath = path.join(dest, file);

                await copyTemplateAsync(srcPath, destPath, spinner);

                // Update spinner text occasionally
                if (i % 5 === 0) {
                    spinner.text = `Copying template files... (${file})`;
                    await new Promise(resolve => setTimeout(resolve, 10));
                }
            }
        } else {
            await fs.copy(src, dest);
        }
    } catch (error) {
        throw new Error(`Failed to copy ${src} to ${dest}: ${error.message}`);
    }
}

async function installDependencies(packageManager, spinner) {
    return new Promise((resolve) => {
        const child = require('child_process').spawn(packageManager, ['install'], {
            stdio: 'pipe',
            shell: true
        });

        let output = '';

        child.stdout.on('data', (data) => {
            output += data.toString();
            const lines = output.split('\\n');
            const lastLine = lines[lines.length - 2] || '';
            if (lastLine.includes('Installing') || lastLine.includes('adding')) {
                spinner.text = `Installing dependencies... ${lastLine.substring(0, 50)}`;
            }
        });

        child.stderr.on('data', (data) => {
            output += data.toString();
        });

        child.on('close', (code) => {
            resolve(code === 0);
        });
    });
}

async function createProject(projectName, options) {
    console.log(chalk.blue('🚀 Welcome to Chillenious SvelteKit!'));
    console.log(chalk.gray('Creating a new SvelteKit application with monorepo structure.\\n'));

    // Get project name if not provided
    if (!projectName) {
        const response = await prompts({
            type: 'text',
            name: 'projectName',
            message: 'What is your project name?',
            initial: 'my-monorepo-with-sveltekit',
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
    if (await fs.pathExists(targetDir)) {
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
        await fs.remove(targetDir);
    }

    // Create spinner with better configuration
    const spinner = ora({
        text: 'Initializing project...',
        spinner: process.platform === 'win32' ? 'line' : 'dots',
        stream: process.stderr,
        isEnabled: true
    });

    spinner.start();

    try {
        // Check template directory
        const templateDir = path.join(__dirname, '..', 'template');

        if (!(await fs.pathExists(templateDir))) {
            spinner.fail('Template directory not found');
            console.log(chalk.red('Error: Template files are missing. Please reinstall the package.'));
            process.exit(1);
        }

        // Copy template files with progress
        spinner.text = 'Copying template files...';
        await copyTemplateAsync(templateDir, targetDir, spinner);
        await new Promise(resolve => setTimeout(resolve, 200));

        // Prepare template variables
        const templateVars = {
            PROJECT_NAME: normalizedProjectName,
            PROJECT_NAME_CAMEL: toCamelCase(normalizedProjectName),
            PROJECT_NAME_PASCAL: toPascalCase(normalizedProjectName),
            PROJECT_NAME_TITLE: projectTitle
        };

        // Replace template variables in all files
        spinner.text = 'Processing template variables...';
        await replaceTemplateVariables(targetDir, templateVars);
        await new Promise(resolve => setTimeout(resolve, 200));

        spinner.succeed('Project structure created!');

        // Success message
        console.log();
        console.log(chalk.green('🎉 Project created successfully!'));
        console.log();
        console.log(chalk.bold('Next steps:'));
        console.log(chalk.cyan(`  cd ${normalizedProjectName}`));
        console.log(chalk.cyan(`  pnpm install`));
        console.log(chalk.cyan('  pnpm web        # start development server'));
        console.log(chalk.cyan('  pnpm cli hello  # run test CLI tool'));
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
        if (await fs.pathExists(targetDir)) {
            console.log(chalk.yellow('Cleaning up...'));
            await fs.remove(targetDir);
        }

        process.exit(1);
    }
}

// Handle process interruption
process.on('SIGINT', async () => {
    console.log(chalk.red('\nProject creation cancelled.'));

    // Clean up any partial work
    const projectName = process.argv[2];
    if (projectName) {
        const targetDir = path.resolve(process.cwd(), toKebabCase(projectName));
        if (await fs.pathExists(targetDir)) {
            console.log(chalk.yellow('Cleaning up partial installation...'));
            await fs.remove(targetDir);
        }
    }

    process.exit(1);
});

// Handle uncaught errors
process.on('uncaughtException', async (error) => {
    console.error(chalk.red('Unexpected error:'), error.message);
    process.exit(1);
});

program.parse();
