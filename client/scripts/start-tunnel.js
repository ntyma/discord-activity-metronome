// scripts/start-tunnel.js
import { spawn } from 'child_process';
import fs from 'fs';

// Path to your vite.config.js
const viteConfigPath = './vite.config.js';

// Function to update allowedHosts
function updateAllowedHosts(hostname) {
  let config = fs.readFileSync(viteConfigPath, 'utf8');

  // Regex to replace allowedHosts line if it exists, otherwise add one
  if (config.includes('allowedHosts')) {
    config = config.replace(
      /allowedHosts:\s*\[.*?\]/,
      `allowedHosts: ['${hostname}']`
    );
  } else {
    config = config.replace(
      /server:\s*{([\s\S]*?)}/,
      `server: { $1, allowedHosts: ['${hostname}'] }`
    );
  }

  fs.writeFileSync(viteConfigPath, config);
  console.log(`✅ Updated vite.config.js with allowed host: ${hostname}`);
}

// Step 1: Start Cloudflare tunnel
const cloudflared = spawn('cloudflared', ['tunnel', '--url', 'http://localhost:5173']);

cloudflared.stdout.on('data', (data) => {
  const output = data.toString();

  // Detect the public URL
  const match = output.match(/https:\/\/([a-zA-Z0-9-]+\.trycloudflare\.com)/);
  if (match) {
    const hostname = match[1];
    updateAllowedHosts(hostname);
  }

  // Forward Cloudflare logs to console
  process.stdout.write(output);
});

cloudflared.stderr.on('data', (data) => {
  process.stderr.write(data);
});

cloudflared.on('close', (code) => {
  console.log(`cloudflared exited with code ${code}`);
});
