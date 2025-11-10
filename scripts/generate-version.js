
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

function generate() {
  const repoRoot = path.resolve(url.fileURLToPath(new URL('..', import.meta.url)));
  const pkgPath = path.join(repoRoot, 'package.json');
  const outDir = path.join(repoRoot, 'src', 'generated');
  const outFile = path.join(outDir, 'version.ts');

  if (!fs.existsSync(pkgPath)) {
    console.error('package.json not found at', pkgPath);
    process.exit(1);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const version = pkg.version || '0.0.0';

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const contents = `// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.\nexport const VERSION = '${version}';\n`;

  fs.writeFileSync(outFile, contents, 'utf8');
  // Make the file readable
  try {
    fs.chmodSync(outFile, 0o644);
  } catch (e) {
    // ignore on platforms that don't support chmod in this way
  }
  // Log lightly for visibility in CI
  console.log('Wrote', outFile);
}

generate();
