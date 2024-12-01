import { createWebSocketStream, WebSocketServer } from "ws";

import { httpServer } from "./src/http_server/index";
import { NAVIGATION_COMMANDS_MAP } from "./src/constants/navigation-commands";
import { DRAWING_COMMANDS_MAP } from "./src/constants/drawing-commands";
import { PRINT_COMMANDS_MAP } from "./src/constants/print-commands";
import { mouseNavigation } from "./src/navigation/navigation";
import { mouseDrawing } from "./src/drawing/drawing";
import { printScreen } from "./src/print/print";

const HTTP_PORT = 8181;
const WEB_PORT = 8080;

console.log(`Start static http server on the ${HTTP_PORT} port!`);

httpServer.listen(HTTP_PORT);

console.log(`Start websocket server on the ${WEB_PORT} port!`);

const webSocketServer = new WebSocketServer({port: WEB_PORT});
webSocketServer.on('connection', (ws, request) => {
  const wsStream = createWebSocketStream(ws, {encoding: 'utf-8', decodeStrings: false});
  wsStream.on('data', async (chunk) => {
    const [command, ...args] = chunk.toString().split(' ');
    const [width, height] = args.map((item: string) => parseInt(item));
    let result = '';
    if (Object.values(NAVIGATION_COMMANDS_MAP).includes(command)) {
      result = await mouseNavigation(command, width);
    }
    if (Object.values(DRAWING_COMMANDS_MAP).includes(command)) {
      result = await mouseDrawing(command, width, height);
    }
    if (Object.values(PRINT_COMMANDS_MAP).includes(command)) {
      result = await printScreen();
    }
    ws.send(result);
  });
});

process.on('SIGINT', () => {
  console.log('All servers are closed!');
  webSocketServer.close();
});

process.on('exit', () => {
  console.log('All servers are closed!');
  webSocketServer.close();
});
