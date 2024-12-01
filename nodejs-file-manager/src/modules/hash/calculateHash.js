import { createHash } from 'crypto';
import { resolve } from 'path';
import { createReadStream } from 'fs';

export async function calculateHash(currDir, pathToFile) {
	try {
    const filePath = resolve(currDir, pathToFile);
		const fileHash = createHash('sha256');
    const input = createReadStream(filePath);
    input.on('readable', () => {
      const data = input.read();
      if (data) {
        fileHash.update(data);
        return;
      }
      console.log(fileHash.digest('hex'));
    });
	} catch (err) {
		throw new Error('Operation failed');
	}
}
