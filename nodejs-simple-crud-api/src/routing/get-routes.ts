import { IncomingMessage, ServerResponse } from "http";
import { validate } from "uuid";

import { store } from "../store/store";
import {
  BASIC_ENDPOINT, HTTP_STATUS_CODES_MAP, ERRORS_MAP,
} from "../utils/constants/constants";
import { getIdFromUrl } from "../utils/get-id-from-url";
import { sendResponse } from "../utils/send-response";

export function handleGetRoutes(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
): void {
  const userId = getIdFromUrl(req.url);
  if (req.url === BASIC_ENDPOINT) {
    const allUsers = JSON.stringify(store.getAllUsers());
    sendResponse(res, allUsers, HTTP_STATUS_CODES_MAP.OK);
  } else if (userId) {
    if (!validate(userId)) {
      sendResponse(
        res,
        ERRORS_MAP.NOT_UUID,
        HTTP_STATUS_CODES_MAP.BAD_REQUEST
      );
      return;
    }
    try {
      const user = JSON.stringify(store.getUserById(userId));
      sendResponse(res, user, HTTP_STATUS_CODES_MAP.OK);
    } catch {
      sendResponse(
        res,
        ERRORS_MAP.NO_USER,
        HTTP_STATUS_CODES_MAP.NOT_FOUND
      );
    }
  } else {
    sendResponse(
      res,
      ERRORS_MAP.NO_ENDPOINT,
      HTTP_STATUS_CODES_MAP.NOT_FOUND
    );
  }
}
