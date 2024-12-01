import { IncomingMessage, ServerResponse } from "http";
import { validate } from "uuid";

import { User } from "../interfaces/User";
import { store } from "../store/store";
import {
  ERRORS_MAP, HTTP_STATUS_CODES_MAP
} from "../utils/constants/constants";
import { getIdFromUrl } from "../utils/get-id-from-url";
import { sendResponse } from "../utils/send-response";

export function handlePutRoutes(req: IncomingMessage, res: ServerResponse<IncomingMessage>): void {
  const userId = getIdFromUrl(req.url);
  if (userId) {
    let body = '';
    req
      .on('data', (chunk: string) => {
        body += chunk.toString();
      })
      .on('end', () => {
        if (!validate(userId)) {
          sendResponse(
            res,
            ERRORS_MAP.NOT_UUID,
            HTTP_STATUS_CODES_MAP.BAD_REQUEST
          );
        } else {
          try {
            const parsedBody = body ? JSON.parse(body) : {};
            const newUser = { id: userId } as any;
            ['username', 'age', 'hobbies'].forEach((f) => {
              if (parsedBody[f]) {
                newUser[f] = parsedBody[f];
              }
            });
            const updatedUser = JSON.stringify(store.updateUser(newUser as User));
            sendResponse(
              res,
              updatedUser,
              HTTP_STATUS_CODES_MAP.OK
            );
          } catch {
            sendResponse(
              res,
              ERRORS_MAP.NO_USER,
              HTTP_STATUS_CODES_MAP.NOT_FOUND
            );
          }
        }
      });
  } else {
    sendResponse(
      res,
      ERRORS_MAP.NO_ENDPOINT,
      HTTP_STATUS_CODES_MAP.NOT_FOUND
    );
  }
}
