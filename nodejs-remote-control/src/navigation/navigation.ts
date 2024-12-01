import { down, left, mouse, right, up } from "@nut-tree/nut-js";

import { NAVIGATION_COMMANDS_MAP } from "../constants/navigation-commands";

export async function mouseNavigation(
  command: string,
  width: number
): Promise<string> {
  const { x, y } = await mouse.getPosition();
  const returnedCommand = `${command} \0`;

  switch (command) {
    case NAVIGATION_COMMANDS_MAP.MOUSE_UP:
      await mouse.move(up(width));
      return returnedCommand;
    case NAVIGATION_COMMANDS_MAP.MOUSE_LEFT:
      await mouse.move(left(width));
      return returnedCommand;
    case NAVIGATION_COMMANDS_MAP.MOUSE_DOWN:
      await mouse.move(down(width));
      return returnedCommand;
    case NAVIGATION_COMMANDS_MAP.MOUSE_RIGHT:
      await mouse.move(right(width));
      return returnedCommand;
    case NAVIGATION_COMMANDS_MAP.MOUSE_POSITION:
      return `${command} ${x}px,${y}px \0`;
    default:
      return '';
  }
};
