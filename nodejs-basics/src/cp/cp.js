import { spawn } from 'child_process';

const spawnChildProcess = async (...args) => {
    spawn('node', ['src/cp/files/script.js', ...args], {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
    })
        .on('message', (data) => {
            console.log(data);
        })
        .on('error', (err) => {
            throw err;
        })
        .on('exit', () => {
            console.log('Canceled');
        });
};

// put arguments into function
spawnChildProcess('first', 'second', 'third');