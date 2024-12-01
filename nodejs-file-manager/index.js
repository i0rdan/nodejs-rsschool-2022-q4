import { argv, stdin, stdout } from 'process';
import { homedir } from 'os';

import { writeCurrDirInfoMessage } from './src/utils/writeCurrDirInfoMessage.js';
import { routerController } from './router.js';

const userName = argv.slice(2)[0].slice(2);
const welcome = `Welcome to the File Manager, ${userName}! \n`;

stdout.write(welcome);
writeCurrDirInfoMessage(homedir());

stdin
  .on('data', async (data) => {
    await routerController(data);
  });

process
  .on('exit', () => {
    console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
  })
  .on('uncaughtException', (err) => {
    console.error(err.message)
  })
  .on('SIGINT', () => {
    process.exit(0);
  });
