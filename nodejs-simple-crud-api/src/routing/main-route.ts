import { IncomingMessage, ServerResponse } from "http";

import {
  ERRORS_MAP, HTTP_STATUS_CODES_MAP
} from "../utils/constants/constants";
import { sendResponse } from "../utils/send-response";
import { handleDeleteRoutes } from "./delete-routes";
import { handleGetRoutes } from "./get-routes";
import { handlePostRoutes } from "./post-routes";
import { handlePutRoutes } from "./put-routes";

export function handleMainRoute(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
): void {
  switch(req.method) {
    case 'GET':
      handleGetRoutes(req, res);
      break;
    case 'DELETE':
      handleDeleteRoutes(req, res);
      break;
    case 'POST':
      handlePostRoutes(req, res);
      break;
    case 'PUT':
      handlePutRoutes(req, res);
      break;
    default: 
      sendResponse(
        res,
        ERRORS_MAP.NO_ENDPOINT,
        HTTP_STATUS_CODES_MAP.NOT_FOUND
      );
      break;
  }
}
