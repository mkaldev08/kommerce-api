const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execSync } = require('node:child_process');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true, force: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function resolveRuntimeTargetDir(projectRoot, packageName) {
  const segments = packageName.split('/');
  return path.join(projectRoot, 'build', 'runtime-modules', ...segments);
}

function downloadNpmPackage(packageName, version, targetDir) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kommerce-runtime-'));

  try {
    const tarballName = execSync(`npm pack ${packageName}@${version} --silent`, {
      cwd: tempDir,
      encoding: 'utf8',
    })
      .trim()
      .split('\n')
      .pop();

    if (!tarballName) {
      throw new Error(`[runtime-deps] npm pack did not return tarball for ${packageName}@${version}`);
    }

    execSync(`tar -xzf ${tarballName}`, { cwd: tempDir, stdio: 'inherit' });

    const extractedPackageDir = path.join(tempDir, 'package');
    if (!fs.existsSync(extractedPackageDir)) {
      throw new Error(`[runtime-deps] could not extract ${packageName}@${version}`);
    }

    copyDir(extractedPackageDir, targetDir);
    console.log(`[runtime-deps] Downloaded ${packageName}@${version} -> ${targetDir}`);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function downloadLibsqlWinPackage(version, targetDir) {
  downloadNpmPackage('@libsql/win32-x64-msvc', version, targetDir);
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

function prepareSharpWinRuntimeModules() {
  const projectRoot = process.cwd();
  const pnpmStoreDir = path.join(projectRoot, 'node_modules', '.pnpm');
  const sharpStoreEntry = fs
    .readdirSync(pnpmStoreDir)
    .find((entry) => entry.startsWith('sharp@'));

  if (!sharpStoreEntry) {
    throw new Error('[runtime-deps] Could not locate sharp package in pnpm store');
  }

  const sharpPackageJson = readJson(
    path.join(projectRoot, 'node_modules', '.pnpm', sharpStoreEntry, 'node_modules', 'sharp', 'package.json'),
  );

  const sharpVersion = sharpPackageJson.version;
  const sharpWinVersion = sharpPackageJson.optionalDependencies?.['@img/sharp-win32-x64'];
  const sharpLibvipsWinVersion = sharpPackageJson.devDependencies?.['@img/sharp-libvips-win32-x64'];

  if (!sharpVersion || !sharpWinVersion || !sharpLibvipsWinVersion) {
    throw new Error('[runtime-deps] Could not resolve sharp runtime package versions');
  }

  const runtimePackages = [
    { name: '@img/sharp-win32-x64', version: sharpWinVersion },
    { name: '@img/sharp-libvips-win32-x64', version: sharpLibvipsWinVersion },
  ];

  const sharpTargetDir = resolveRuntimeTargetDir(projectRoot, 'sharp');
  const sharpSourceDir = path.join(
    projectRoot,
    'node_modules',
    '.pnpm',
    `sharp@${sharpVersion}`,
    'node_modules',
    'sharp',
  );

  if (!fs.existsSync(sharpSourceDir)) {
    throw new Error(`[runtime-deps] Expected source dir not found: ${sharpSourceDir}`);
  }

  copyDir(sharpSourceDir, sharpTargetDir);
  console.log(`[runtime-deps] Prepared ${sharpTargetDir}`);

  for (const runtimePackage of runtimePackages) {
    const targetDir = resolveRuntimeTargetDir(projectRoot, runtimePackage.name);
    downloadNpmPackage(runtimePackage.name, runtimePackage.version, targetDir);
  }
}

prepareLibsqlWinBinary();
prepareSharpWinRuntimeModules();
