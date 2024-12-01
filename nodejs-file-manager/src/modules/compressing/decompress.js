import { resolve } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { createBrotliDecompress } from 'zlib';

export async function decompressFile(currDir, pathToFile, newPath) {
	try {
    const filePath = resolve(currDir, pathToFile);
    const decompressPath = resolve(currDir, newPath);
    const readStream = createReadStream(filePath);
    const writableStream = createWriteStream(decompressPath);
    const brotliAlg = createBrotliDecompress();

    readStream.pipe(brotliAlg).pipe(writableStream);
	} catch (err) {
		throw new Error('Operation failed');
	}
}
