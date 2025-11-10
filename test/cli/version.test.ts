import { test, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

test('CLI generated version matches package.json', async () => {
  const repoRoot = path.resolve(__dirname, '..', '..');
  // Run generator to ensure generated file is up-to-date
  execSync('node ./scripts/generate-version.js', { cwd: repoRoot, stdio: 'ignore' });

  // Dynamically import the generated version module
  const generatedPath = path.join(repoRoot, 'src', 'generated', 'version');
  const generated = await import(generatedPath);
  const generatedVersion = generated.VERSION;

  // Read package.json
  const pkgRaw = fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8');
  const pkg = JSON.parse(pkgRaw) as { version?: string };

  expect(generatedVersion).toBe(pkg.version);
});
