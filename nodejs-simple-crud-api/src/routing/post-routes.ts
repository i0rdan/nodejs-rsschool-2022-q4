import { IncomingMessage, ServerResponse } from "http";

import { store } from "../store/store";
import {
  BASIC_ENDPOINT, ERRORS_MAP, HTTP_STATUS_CODES_MAP,
} from "../utils/constants/constants";
import { createUserFromBody } from "../utils/create-user-from-body";
import { sendResponse } from "../utils/send-response";

export function handlePostRoutes(req: IncomingMessage, res: ServerResponse<IncomingMessage>): void {
  if (req.url === BASIC_ENDPOINT) {
    let body = '';
    req
      .on('data', (chunk: string) => {
        body += chunk.toString();
      })
      .on('end', () => {
        try {
          const parsedBody = body ? JSON.parse(body) : {};
          const newUser = createUserFromBody(parsedBody);
          const addedUser = JSON.stringify(store.addUser(newUser));
          sendResponse(res, addedUser, HTTP_STATUS_CODES_MAP.CREATED);
        } catch {
          sendResponse(
            res,
            ERRORS_MAP.BODY_REQUIRED,
            HTTP_STATUS_CODES_MAP.BAD_REQUEST
          );
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
