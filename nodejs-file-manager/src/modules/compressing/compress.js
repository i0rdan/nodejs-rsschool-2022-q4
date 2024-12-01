import { resolve } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress } from 'zlib';

export async function compressFile(currDir, pathToFile, newPath) {
	try {
    const br = '.br';
    if (!newPath.includes('.br')) {
      newPath += br;
    }

    const filePath = resolve(currDir, pathToFile);
    const compressPath = resolve(currDir, newPath);
    const readStream = createReadStream(filePath, 'utf8');
    const writableStream = createWriteStream(compressPath);
    const brotliAlg = createBrotliCompress();

    readStream.pipe(brotliAlg).pipe(writableStream);
	} catch (err) {
		throw new Error('Operation failed');
	}
}
