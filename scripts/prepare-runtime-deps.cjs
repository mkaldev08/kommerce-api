const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execSync } = require('node:child_process');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true, force: true });
}

function downloadLibsqlWinPackage(version, targetDir) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kommerce-libsql-'));

  try {
    const tarballName = execSync(`npm pack @libsql/win32-x64-msvc@${version} --silent`, {
      cwd: tempDir,
      encoding: 'utf8',
    })
      .trim()
      .split('\n')
      .pop();

    if (!tarballName) {
      throw new Error('[runtime-deps] npm pack did not return tarball name');
    }

    execSync(`tar -xzf ${tarballName}`, { cwd: tempDir, stdio: 'inherit' });

    const extractedPackageDir = path.join(tempDir, 'package');
    if (!fs.existsSync(extractedPackageDir)) {
      throw new Error('[runtime-deps] could not extract @libsql/win32-x64-msvc package');
    }

    copyDir(extractedPackageDir, targetDir);
    console.log(`[runtime-deps] Downloaded ${targetDir}`);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function prepareLibsqlWinBinary() {
  const projectRoot = process.cwd();
  const pnpmStoreDir = path.join(projectRoot, 'node_modules', '.pnpm');

  if (!fs.existsSync(pnpmStoreDir)) {
    throw new Error(`[runtime-deps] Missing pnpm store dir: ${pnpmStoreDir}`);
  }

  const winPackagePrefix = '@libsql+win32-x64-msvc@';
  const entry = fs
    .readdirSync(pnpmStoreDir)
    .find((name) => name.startsWith(winPackagePrefix));

  const optionalDeps = JSON.parse(
    fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'),
  ).optionalDependencies ?? {};

  const winPackageVersion = optionalDeps['@libsql/win32-x64-msvc'];
  if (!winPackageVersion) {
    throw new Error(
      '[runtime-deps] Missing optional dependency @libsql/win32-x64-msvc in package.json',
    );
  }

  const targetDir = path.join(
    projectRoot,
    'build',
    'runtime-modules',
    '@libsql',
    'win32-x64-msvc',
  );

  if (!entry) {
    downloadLibsqlWinPackage(winPackageVersion, targetDir);
    return;
  }

  const sourceDir = path.join(
    pnpmStoreDir,
    entry,
    'node_modules',
    '@libsql',
    'win32-x64-msvc',
  );

  if (!fs.existsSync(sourceDir)) {
    throw new Error(`[runtime-deps] Expected source dir not found: ${sourceDir}`);
  }

  copyDir(sourceDir, targetDir);
  console.log(`[runtime-deps] Prepared ${targetDir}`);
}

prepareLibsqlWinBinary();
