import type { CAC } from 'cac';

import { execSync } from 'node:child_process';

import { execa, execaCommand, getStagedFiles } from '@vben/node-utils';

interface LintCommandOptions {
  /**
   * Format lint problem.
   */
  format?: boolean;
  /**
   * Only lint staged files.
   */
  staged?: boolean;
  /**
   * Number of threads for oxfmt and oxlint (default: 2).
   */
  threads?: number;
}

const CODE_FILE_RE = /\.(?:[cm]?[jt]sx?|vue)$/;
const STYLE_FILE_RE = /\.(?:vue|css|less|scss)$/;

function partitionLintFiles(files: string[]) {
  const codeFiles = files.filter((file) => CODE_FILE_RE.test(file));
  const styleFiles = files.filter((file) => STYLE_FILE_RE.test(file));
  return { codeFiles, styleFiles };
}

function getThreadsArgs(threads?: number) {
  return threads ? ` --threads=${threads}` : ` --threads=2`;
}

async function runLintOnFiles(
  files: string[],
  { format, threads }: Pick<LintCommandOptions, 'format' | 'threads'>,
) {
  const threadsArgs = threads ? ['--threads', String(threads)] : ['--threads', '2'];
  const { codeFiles, styleFiles } = partitionLintFiles(files);
  const subprocesses = [];

  if (codeFiles.length > 0) {
    if (format) {
      subprocesses.push(
        execa('oxfmt', [...threadsArgs, ...codeFiles], { stdio: 'inherit' }),
        execa('oxlint', ['--fix', ...threadsArgs, ...codeFiles], {
          stdio: 'inherit',
        }),
        execa('eslint', ['--cache', '--fix', ...codeFiles], {
          stdio: 'inherit',
        }),
      );
    } else {
      subprocesses.push(
        execa('oxfmt', ['--check', ...threadsArgs, ...codeFiles], {
          stdio: 'inherit',
        }),
        execa('oxlint', [...threadsArgs, ...codeFiles], { stdio: 'inherit' }),
        execa('eslint', ['--cache', ...codeFiles], { stdio: 'inherit' }),
      );
    }
  }

  if (styleFiles.length > 0) {
    subprocesses.push(
      execa(
        'stylelint',
        [...styleFiles, '--cache', ...(format ? ['--fix'] : [])],
        { stdio: 'inherit' },
      ),
    );
  }

  if (subprocesses.length === 0) {
    return;
  }

  await Promise.all(subprocesses);
}

async function runFullLint({ format, threads }: LintCommandOptions) {
  const threadsArg = getThreadsArgs(threads);

  if (format) {
    await execaCommand(`stylelint "**/*.{vue,css,less,scss}" --cache --fix`, {
      stdio: 'inherit',
    });
    await execaCommand(`oxfmt${threadsArg}`, {
      stdio: 'inherit',
    });
    await execaCommand(`oxlint --fix${threadsArg}`, {
      stdio: 'inherit',
    });
    await execaCommand(`eslint . --cache --fix`, {
      stdio: 'inherit',
    });
    return;
  }

  const subprocesses = [
    execaCommand(`oxfmt --check${threadsArg}`, { stdio: 'inherit' }),
    execaCommand(`oxlint${threadsArg}`, { stdio: 'inherit' }),
    execaCommand(`eslint . --cache`, { stdio: 'inherit' }),
    execaCommand(`stylelint "**/*.{vue,css,less,scss}" --cache`, {
      stdio: 'inherit',
    }),
  ];

  try {
    await Promise.all(subprocesses);
  } catch (error) {
    for (const subprocess of subprocesses) {
      try {
        if (process.platform === 'win32' && subprocess.pid) {
          execSync(`taskkill /F /T /PID ${subprocess.pid}`, {
            stdio: 'ignore',
          });
        } else {
          subprocess.kill('SIGKILL');
        }
      } catch {
        // process may have already exited
      }
    }
    await Promise.allSettled(subprocesses);
    throw error;
  }
}

async function runLint(
  files: string[],
  { format, staged, threads }: LintCommandOptions,
) {
  const targetFiles = staged ? await getStagedFiles() : files;

  if (targetFiles.length > 0) {
    await runLintOnFiles(targetFiles, { format, threads });
    return;
  }

  if (!staged) {
    await runFullLint({ format, threads });
  }
}

function defineLintCommand(cac: CAC) {
  cac
    .command('lint [...files]')
    .usage('Batch execute project lint check.')
    .option('--format', 'Format lint problem.')
    .option('--staged', 'Only lint staged files.')
    .option('--threads <count>', 'Number of threads for oxfmt and oxlint.')
    .action(runLint);
}

export { defineLintCommand };
