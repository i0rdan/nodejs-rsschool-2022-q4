import { resolve } from 'path';
import { rm } from 'fs/promises';

export async function removeFile(currDir, pathToFile) {
	try {
    const filePath = resolve(currDir, pathToFile);
    await rm(filePath);
	} catch (err) {
		throw new Error('Operation failed');
	}
}
