import { Button, down, left, mouse, right, up } from "@nut-tree/nut-js";

export async function drawRectangle(
  width: number,
  height: number
): Promise<void> {
  mouse.config.mouseSpeed = 100;
  await mouse.pressButton(Button.LEFT);
  await mouse.move(down(height));
  await mouse.move(right(width));
  await mouse.move(up(height));
  await mouse.move(left(width));
  await mouse.releaseButton(Button.LEFT);
  mouse.config.mouseSpeed = 1000;
};
