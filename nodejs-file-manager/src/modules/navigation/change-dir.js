import { readdir } from 'fs/promises';
import { resolve } from 'path';

export async function changeDir(currDir, additional) {
  try {
    const newPath = resolve(currDir, additional);
    await readdir(newPath);
    return newPath;
  } catch (err) {
    throw new Error('Operation failed');
  }
}
