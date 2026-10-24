#!/usr/bin/env node

/**
 * Cloudflare Tunnel Sharable Link Generator
 * Runs a temporary quick tunnel to expose the local dev server
 * and outputs a shareable https://*.trycloudflare.com link.
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

// Parse target port from arguments or default to 3000
function getTargetPort() {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port' || args[i] === '-p') {
      const p = parseInt(args[i + 1], 10);
      if (!isNaN(p)) return p;
    }
    const num = parseInt(args[i], 10);
    if (!isNaN(num) && num > 0 && num <= 65535) {
      return num;
    }
  }
  return parseInt(process.env.PORT, 10) || 3000;
}

// Copy text to clipboard across platforms
function copyToClipboard(text) {
  try {
    if (process.platform === 'win32') {
      const proc = spawn('clip');
      proc.stdin.write(text);
      proc.stdin.end();
      return true;
    } else if (process.platform === 'darwin') {
      const proc = spawn('pbcopy');
      proc.stdin.write(text);
      proc.stdin.end();
      return true;
    } else {
      exec(`echo "${text}" | xclip -selection clipboard`, () => {});
      return true;
    }
  } catch {
    return false;
  }
}

// Check if local server is active on the given port
function checkLocalServer(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(800);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      resolve(false);
    });
    socket.connect(port, '127.0.0.1');
  });
}

function isValidBinary(filePath) {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).size > 10000000;
  } catch {
    return false;
  }
}

// Find cloudflared executable or fallback to npx
function resolveCloudflared(targetPort) {
  const targetUrl = `http://localhost:${targetPort}`;
  const tunnelArgs = ['tunnel', '--url', targetUrl];
  const isWin = process.platform === 'win32';
  const binName = isWin ? 'cloudflared.exe' : 'cloudflared';

  // 1. Explicit environment override
  if (process.env.CLOUDFLARED_BIN && isValidBinary(process.env.CLOUDFLARED_BIN)) {
    return { cmd: process.env.CLOUDFLARED_BIN, args: tunnelArgs, isShell: false };
  }

  // 2. Check local project node_modules or bin
  const localCandidates = [
    path.join(__dirname, 'bin', binName),
    path.join(__dirname, 'node_modules', '.bin', binName),
    path.join(__dirname, 'node_modules', 'cloudflared', 'bin', binName),
  ];
  for (const candidate of localCandidates) {
    if (isValidBinary(candidate)) {
      return { cmd: candidate, args: tunnelArgs, isShell: false };
    }
  }

  // 3. Check Windows user cache (where npx or untun cached the binary)
  if (isWin && process.env.LOCALAPPDATA) {
    // Check npm-cache/_npx
    const npxCacheDir = path.join(process.env.LOCALAPPDATA, 'npm-cache', '_npx');
    if (fs.existsSync(npxCacheDir)) {
      try {
        const subdirs = fs.readdirSync(npxCacheDir);
        for (const dir of subdirs) {
          const cachedBin = path.join(npxCacheDir, dir, 'node_modules', 'cloudflared', 'bin', 'cloudflared.exe');
          if (isValidBinary(cachedBin)) {
            return { cmd: cachedBin, args: tunnelArgs, isShell: false };
          }
        }
      } catch {}
    }

    // Check temp node-untun
    const untunDir = path.join(process.env.LOCALAPPDATA, 'Temp', 'node-untun');
    if (fs.existsSync(untunDir)) {
      try {
        const files = fs.readdirSync(untunDir);
        for (const file of files) {
          if (file.startsWith('cloudflared') && file.endsWith('.exe')) {
            const untunBin = path.join(untunDir, file);
            if (isValidBinary(untunBin)) {
              return { cmd: untunBin, args: tunnelArgs, isShell: false };
            }
          }
        }
      } catch {}
    }

    // Check Program Files
    const progCandidates = [
      path.join(process.env['ProgramFiles'] || 'C:\\Program Files', 'cloudflared', 'cloudflared.exe'),
      path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'cloudflared', 'cloudflared.exe'),
    ];
    for (const prog of progCandidates) {
      if (isValidBinary(prog)) {
        return { cmd: prog, args: tunnelArgs, isShell: false };
      }
    }
  }

  // 4. Fallback to npx
  const npxCmd = isWin ? 'npx.cmd' : 'npx';
  return {
    cmd: npxCmd,
    args: ['--yes', 'cloudflared', 'tunnel', '--url', targetUrl],
    isShell: isWin,
  };
}

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

async function main() {
  const port = getTargetPort();

  console.log(`\n${colors.bold}${colors.cyan}======================================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}             CLOUDFLARE TEMPORARY SHAREABLE LINK                      ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}======================================================================${colors.reset}`);
  console.log(`${colors.dim}Target Port:  ${colors.reset}${colors.bold}${port}${colors.reset}`);
  console.log(`${colors.dim}Target URL:   ${colors.reset}http://localhost:${port}`);

  // Check if local dev server is responding
  const isServerRunning = await checkLocalServer(port);
  if (!isServerRunning) {
    console.log(`\n${colors.yellow}[!] Warning: Next.js server is not currently detected on port ${port}.${colors.reset}`);
    console.log(`${colors.dim}    Make sure 'npm run dev' is running in another terminal so clients can view the site.${colors.reset}`);
  } else {
    console.log(`${colors.green}[+] Local server is active and responding.${colors.reset}`);
  }

  console.log(`\n${colors.cyan}Connecting to Cloudflare network... Please wait...${colors.reset}\n`);

  const { cmd, args, isShell } = resolveCloudflared(port);

  let child;
  try {
    child = spawn(cmd, args, {
      shell: isShell,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (err) {
    console.error(`${colors.red}Failed to start cloudflared:${colors.reset}`, err.message);
    process.exit(1);
  }

  let foundUrl = null;
  let copied = false;

  function handleData(data) {
    const text = data.toString();
    const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
    if (match && !foundUrl) {
      foundUrl = match[0];
      copied = copyToClipboard(foundUrl);

      console.log(`${colors.bold}${colors.green}======================================================================${colors.reset}`);
      console.log(`${colors.bold}${colors.green}              TEMPORARY SHARABLE LINK IS READY!                       ${colors.reset}`);
      console.log(`${colors.bold}${colors.green}======================================================================${colors.reset}\n`);
      console.log(`  ${colors.bold}Public Link:  ${colors.cyan}${foundUrl}${colors.reset}`);
      console.log(`  ${colors.bold}Local Server: ${colors.reset}http://localhost:${port}`);
      console.log(`  ${colors.bold}Clipboard:    ${colors.green}${copied ? 'Copied to clipboard automatically!' : 'Available to copy above'}${colors.reset}\n`);
      console.log(`${colors.dim}  Instructions:${colors.reset}`);
      console.log(`${colors.dim}  1. Send the Public Link above to your client to preview the website.${colors.reset}`);
      console.log(`${colors.dim}  2. Keep this terminal window open while sharing.${colors.reset}`);
      console.log(`${colors.yellow}${colors.bold}  3. Press [Ctrl + C] in this terminal when you want to stop sharing.${colors.reset}\n`);
      console.log(`${colors.bold}${colors.green}======================================================================${colors.reset}\n`);
    }
  }

  child.stdout.on('data', handleData);
  child.stderr.on('data', handleData);

  child.on('error', (err) => {
    console.error(`\n${colors.red}Tunnel process error:${colors.reset}`, err.message);
  });

  child.on('close', (code) => {
    if (!foundUrl) {
      console.error(`\n${colors.red}Cloudflare tunnel exited early with code ${code}.${colors.reset}`);
      console.error(`If this persists, try running: ${colors.bold}npx cloudflared tunnel --url http://localhost:${port}${colors.reset}`);
    } else {
      console.log(`\n${colors.cyan}[+] Cloudflare tunnel session closed.${colors.reset}`);
    }
    process.exit(code || 0);
  });

  // Graceful shutdown on Ctrl+C or kill signals
  function cleanup() {
    console.log(`\n${colors.yellow}Stopping Cloudflare tunnel...${colors.reset}`);
    if (child && !child.killed) {
      if (process.platform === 'win32' && child.pid) {
        try {
          exec(`taskkill /pid ${child.pid} /t /f`, () => {
            console.log(`${colors.green}[+] Tunnel stopped safely. Share session ended.${colors.reset}`);
            process.exit(0);
          });
          return;
        } catch {}
      }
      child.kill('SIGINT');
    }
    console.log(`${colors.green}[+] Tunnel stopped safely. Share session ended.${colors.reset}`);
    process.exit(0);
  }

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

main();
