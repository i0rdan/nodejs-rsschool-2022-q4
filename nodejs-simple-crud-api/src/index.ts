import cluster from "cluster";
import { config } from "dotenv";
import { createServer } from "http";

import { User } from "./interfaces/User";
import { handleMainRoute } from "./routing/main-route";
import { store } from "./store/store";

const envPort = config().parsed?.NODE_PORT || 8080;
const PORT = process.env.workerPort || envPort;

export const server = createServer((req, res) => {
  handleMainRoute(req, res);
  if (process.env.workerPort) {
    setImmediate(() => cluster.worker?.send(store.getAllUsers()));
  }
});
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}!`);
});

if (process.env.workerPort) {
  process.on('message', (message: User[]) => {
    store.setUsers(message);
  });
}
