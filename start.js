const { spawn } = require('child_process');
const path = require('path');

console.log('🎬 Starting CineAI Studio (Server + Client)...\n');

// 1. Start Server
const serverProcess = spawn('node', ['index.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// 2. Start Client
const clientProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

serverProcess.on('error', (err) => {
  console.error('Server process error:', err);
});

clientProcess.on('error', (err) => {
  console.error('Client process error:', err);
});

process.on('SIGINT', () => {
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
});
