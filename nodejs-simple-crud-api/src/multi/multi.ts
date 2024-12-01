import cluster, { Worker } from "cluster";
import http from "http";
import { config } from "dotenv";
import { cpus } from "os";

import { User } from "../interfaces/User";

const PORT = config().parsed?.NODE_PORT || 8080;
const workers: Worker[] = [];
let currWorkerNum = 0;

cluster.setupPrimary({ exec: 'build/index' });
if (cluster.isPrimary) {
  cpus().forEach((_, i) => {
    const worker = cluster.fork({ workerPort: Number(PORT) + i + 1 });
    workers.push(worker);
  });

  http
    .createServer(async (req, res) => {
      req.pipe(http.request(
        `http://localhost:${Number(PORT) + currWorkerNum + 1}${req.url}`, 
        { method: req.method, headers: req.headers },
        (resp) => resp.pipe(res)
      ));

      if (currWorkerNum === cpus().length - 1) {
        currWorkerNum = 0;
      } else {
        currWorkerNum += 1;
      }
    })
    .listen(PORT, () => {
      console.log(`Main process started on ${PORT}`);
    });
} else {
  import('../index');
}

cluster.on('listening', (worker, address) => {
  console.log(`Worker ${worker.id} listening on ${address.port} port`);
});

cluster.on('message', (_, message: User[]) => {
  workers.forEach((w) => w.send(message));
});
