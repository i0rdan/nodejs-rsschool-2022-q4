import { Worker } from 'worker_threads';
import { cpus } from 'os';

const performCalculations = async () => {
    const results = [];
    const path = './src/wt/worker.js';
    const coreCount = cpus().length;
    const startNumber = 10;

    for (let i = 0; i < coreCount; i += 1) {
        const worker = new Worker(path, {
            workerData: { n: startNumber + i },
        });
    
        worker.on('error', () => {
            results.push({ status: 'error', data: null });

            if (i === coreCount - 1) {
                console.log(results);
            }
        });
    
        worker.on('message', (data) => {
            results.push({ status: 'resolved', data });
    
            if (i === coreCount - 1) {
                console.log(results);
            }
        });
    }
};

await performCalculations();