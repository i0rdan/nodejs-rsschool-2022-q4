import { Button, mouse } from "@nut-tree/nut-js";

export async function drawCircle(width: number): Promise<void> {
  const {x, y} = await mouse.getPosition();
  let angle = 0;

  for (angle; angle < Math.PI * 2; angle += 0.01) {
    mouse.move([{x: x + width * Math.cos(angle), y: y + width * Math.sin(angle)}]);
    if (angle === 0) {
      await mouse.pressButton(Button.LEFT);
    }
  }

  await mouse.releaseButton(Button.LEFT);
};
