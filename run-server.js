const { exec } = require('child_process');

// Запуск сервера
const serverProcess = exec('npx ts-node server/server.ts', (error, stdout, stderr) => {
  if (error) {
    console.error(`Ошибка запуска сервера: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});

// Прослушиваем вывод сервера
serverProcess.stdout.on('data', (data) => {
  console.log(`Сервер: ${data}`);
});

serverProcess.stderr.on('data', (data) => {
  console.error(`Ошибки сервера: ${data}`);
});