import { DRAWING_COMMANDS_MAP } from "../constants/drawing-commands";
import { drawCircle } from "./draw-circle";
import { drawRectangle } from "./draw-rectangle";

export async function mouseDrawing(
  command: string,
  width: number,
  height: number
): Promise<string> {
  const returnedCommand = `${command} \0`;
  switch (command) {
    case DRAWING_COMMANDS_MAP.DRAW_CIRCLE:
      await drawCircle(width);
      return returnedCommand;
    case DRAWING_COMMANDS_MAP.DRAW_RECTANGLE:
      await drawRectangle(width, height);
      return returnedCommand;
    case DRAWING_COMMANDS_MAP.DRAW_SQUARE:
      await drawRectangle(width, width);
      return returnedCommand;
    default:
      return '';
  }
};
