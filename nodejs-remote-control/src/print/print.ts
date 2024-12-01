import { mouse, Region, screen } from "@nut-tree/nut-js";
import Jimp from 'jimp';

import { PRINT_COMMANDS_MAP } from "../constants/print-commands";

export async function printScreen(): Promise<string> {
  const { x, y } = await mouse.getPosition();
  const regionToGrab = new Region(Math.max(0, x - 100), Math.max(0, y - 100), 200, 200);
  const grabbedRegion = await screen.grabRegion(regionToGrab);
  const { data, width, height } = await grabbedRegion.toRGB();
  const image = new Jimp({ data, width, height });
  const base64buffer = await image.getBufferAsync(Jimp.MIME_PNG);

  return `${PRINT_COMMANDS_MAP.PRINT_SCREEN} ${base64buffer.toString('base64')}`;
};
