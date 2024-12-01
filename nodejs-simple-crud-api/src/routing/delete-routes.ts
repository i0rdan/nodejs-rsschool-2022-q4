import { IncomingMessage, ServerResponse } from "http";
import { validate } from "uuid";

import { store } from "../store/store";
import { getIdFromUrl } from "../utils/get-id-from-url";
import { sendResponse } from "../utils/send-response";
import {
  HTTP_STATUS_CODES_MAP, ERRORS_MAP,
} from "../utils/constants/constants";

export function handleDeleteRoutes(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
): void {
  const userId = getIdFromUrl(req.url);
  if (userId) {
    if (!validate(userId)) {
      sendResponse(
        res,
        ERRORS_MAP.NOT_UUID,
        HTTP_STATUS_CODES_MAP.BAD_REQUEST
      );
      return;
    }
    try {
      store.deleteUser(userId);
      sendResponse(res, '', HTTP_STATUS_CODES_MAP.NO_CONTENT);
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
