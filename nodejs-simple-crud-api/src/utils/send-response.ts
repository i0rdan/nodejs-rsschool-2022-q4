import { IncomingMessage, ServerResponse } from "http";

export function sendResponse(
  res: ServerResponse<IncomingMessage>,
  message: string,
  code: number
): void {
  res.writeHead(code);
  res.end(message);
}
