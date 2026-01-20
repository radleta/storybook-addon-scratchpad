#!/usr/bin/env node
import 'dotenv/config';
import { spawn, execSync } from 'child_process';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const version = process.argv[2];
const isWindows = process.platform === 'win32';

if (!version || !['8', '9', '10'].includes(version)) {
  console.error('Usage: node scripts/run-storybook.js <8|9|10>');
  process.exit(1);
}

// Default ports: 16008, 16009, 16010
const defaultPort = 16000 + parseInt(version);
const envKey = `STORYBOOK_${version}_PORT`;
const port = parseInt(process.env[envKey] || String(defaultPort));
const pidFile = join(__dirname, `../.storybook-${version}.pid`);
const cwd = join(__dirname, `../e2e/storybook-${version}`);

// Kill existing process if PID file exists
if (existsSync(pidFile)) {
  try {
    const pid = parseInt(readFileSync(pidFile, 'utf8').trim());
    console.log(`Killing existing Storybook ${version} (PID: ${pid})...`);

    if (isWindows) {
      // On Windows, use taskkill with /T to kill process tree
      try {
        execSync(`taskkill /PID ${pid} /T /F`, { stdio: 'ignore' });
      } catch (err) {
        // Process might already be dead, ignore
      }
    } else {
      // On Unix, kill the process group
      try {
        process.kill(-pid, 'SIGTERM');
      } catch (err) {
        try {
          process.kill(pid, 'SIGTERM');
        } catch (err2) {
          // Process might already be dead, ignore
        }
      }
    }

    // Give it a moment to terminate
    await new Promise(resolve => setTimeout(resolve, 1500));
  } catch (err) {
    // Process might already be dead, ignore
  }
  try {
    unlinkSync(pidFile);
  } catch (err) {
    // Ignore
  }
}

console.log(`Starting Storybook ${version} on port ${port}...`);
console.log(`Working directory: ${cwd}`);

const child = spawn('npx', ['storybook', 'dev', '-p', String(port)], {
  cwd,
  stdio: 'inherit',
  shell: true,
  detached: !isWindows, // On Unix, detach to create process group
});

// Save PID
writeFileSync(pidFile, String(child.pid));
console.log(`Storybook ${version} started with PID: ${child.pid}`);
console.log(`PID saved to: ${pidFile}`);
console.log(`\nPress Ctrl+C to stop Storybook\n`);

// Keep the process running to show output
// The child process will keep running even if this parent exits
child.on('exit', (code) => {
  console.log(`\nStorybook ${version} exited with code ${code}`);
  try {
    unlinkSync(pidFile);
  } catch (err) {
    // Ignore
  }
  process.exit(code || 0);
});

// Handle graceful shutdown
const shutdown = () => {
  console.log(`\nStopping Storybook ${version}...`);
  if (isWindows) {
    try {
      execSync(`taskkill /PID ${child.pid} /T /F`, { stdio: 'ignore' });
    } catch (err) {
      // Ignore
    }
  } else {
    child.kill('SIGTERM');
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
