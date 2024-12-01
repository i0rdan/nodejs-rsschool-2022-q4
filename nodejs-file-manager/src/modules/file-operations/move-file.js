import { copyFile } from './copy-file.js';
import { removeFile } from './remove-file.js';

export async function moveFile(currDir, fileName, newName) {
	try {
    await copyFile(currDir, fileName, newName);
    await removeFile(currDir, fileName);
	} catch (err) {
		throw new Error('Operation failed');
	}
}
