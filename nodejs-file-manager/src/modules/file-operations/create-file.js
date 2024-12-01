import { resolve } from 'path';
import { writeFile } from 'fs/promises';

export async function createFile(currDir, fileName) {
	try {
    const filePath = resolve(currDir, fileName);
    await writeFile(filePath, '', { flag: 'wx' });
	} catch (err) {
		throw new Error('Operation failed');
	}
}
