import { resolve } from 'path';
import { createReadStream } from 'fs';

export async function readFileContent(currDir, pathToFile) {
	try {
    const filePath = resolve(currDir, pathToFile);
    const stream = createReadStream(filePath, 'utf8');
    stream.on('data', data => process.stdout.write(data));
	} catch (err) {
		throw new Error('Operation failed');
	}
}
