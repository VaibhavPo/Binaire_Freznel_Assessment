#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const entryScript = join(projectRoot, 'src', 'index.jsx');

// Spawn tsx to execute JSX in ESM cleanly
const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const child = spawn(
  cmd,
  ['tsx', entryScript, ...process.argv.slice(2)],
  {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  }
);

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
