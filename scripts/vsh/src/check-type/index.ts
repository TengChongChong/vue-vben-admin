import type { CAC } from 'cac';

import path from 'node:path';

import {
  execa,
  findMonorepoRoot,
  getPackages,
  getStagedFiles,
} from '@vben/node-utils';

interface CheckTypeCommandOptions {
  staged?: boolean;
}

const TYPECHECK_SCRIPT = 'typecheck';
const TYPECHECK_FILE_RE = /\.(?:tsx?|vue)$/;

function toPosixRelative(file: string, root: string) {
  return path.relative(root, file).replaceAll('\\', '/');
}

async function resolveTypecheckFilters(files: string[]) {
  const root = findMonorepoRoot();
  const { packages } = await getPackages();
  const packagesWithTypecheck = new Set(
    packages
      .filter((pkg) => pkg.packageJson.scripts?.[TYPECHECK_SCRIPT])
      .map((pkg) => pkg.packageJson.name),
  );
  const filters = new Set<string>();

  for (const file of files) {
    const relFile = toPosixRelative(file, root);
    if (!TYPECHECK_FILE_RE.test(relFile)) {
      continue;
    }

    const owner = packages
      .filter((pkg) => {
        const pkgDir = toPosixRelative(pkg.dir, root);
        return relFile === pkgDir || relFile.startsWith(`${pkgDir}/`);
      })
      .toSorted(
        (left, right) =>
          toPosixRelative(right.dir, root).length -
          toPosixRelative(left.dir, root).length,
      )[0];

    if (!owner) {
      continue;
    }

    const packageName = owner.packageJson.name;
    if (packagesWithTypecheck.has(packageName)) {
      filters.add(packageName);
      continue;
    }

    filters.add(`...${packageName}`);
  }

  return [...filters];
}

async function runTypecheck({ staged }: CheckTypeCommandOptions) {
  const root = findMonorepoRoot();

  if (!staged) {
    await execa('pnpm', ['exec', 'turbo', 'run', TYPECHECK_SCRIPT], {
      cwd: root,
      stdio: 'inherit',
    });
    return;
  }

  const stagedFiles = await getStagedFiles();
  if (stagedFiles.length === 0) {
    return;
  }

  const hasRelevantFiles = stagedFiles.some((file) =>
    TYPECHECK_FILE_RE.test(toPosixRelative(file, root)),
  );
  if (!hasRelevantFiles) {
    return;
  }

  const filters = await resolveTypecheckFilters(stagedFiles);
  if (filters.length === 0) {
    return;
  }

  await execa(
    'pnpm',
    [
      'exec',
      'turbo',
      'run',
      TYPECHECK_SCRIPT,
      ...filters.flatMap((filter) => ['--filter', filter]),
    ],
    {
      cwd: root,
      stdio: 'inherit',
    },
  );
}

function defineCheckTypeCommand(cac: CAC) {
  cac
    .command('check-type')
    .usage('Run TypeScript checks for the monorepo.')
    .option('--staged', 'Only typecheck packages affected by staged files.')
    .action(runTypecheck);
}

export { defineCheckTypeCommand };
