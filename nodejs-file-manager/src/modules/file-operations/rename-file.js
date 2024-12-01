import { resolve } from 'path';
import { rename } from 'fs/promises';

export async function renameFile(currDir, fileName, newName) {
	try {
    const filePath = resolve(currDir, fileName);
    const newFilePath = resolve(currDir, newName);
    await rename(filePath, newFilePath);
	} catch (err) {
		throw new Error('Operation failed');
	}	
}
