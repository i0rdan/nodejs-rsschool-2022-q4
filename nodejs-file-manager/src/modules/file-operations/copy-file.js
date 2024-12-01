import { resolve } from 'path';
import { createReadStream, createWriteStream } from 'fs';

export async function copyFile(currDir, pathToFile, newPath) {
	try {
    const filePath = resolve(currDir, pathToFile);
    const newCopyPath = resolve(currDir, newPath);
    const readStream = createReadStream(filePath, 'utf8');
    const writableStream = createWriteStream(newCopyPath);

    readStream.pipe(writableStream);
	} catch (err) {
		throw new Error('Operation failed');
	}
}
