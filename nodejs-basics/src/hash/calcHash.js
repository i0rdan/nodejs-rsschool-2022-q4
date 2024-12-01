import { createHash } from 'crypto';
import { createReadStream } from 'fs';

const calculateHash = async () => {
    const path = 'src/hash/files/fileToCalculateHashFor.txt';
    const fileHash = createHash('sha256');
    const input = createReadStream(path);
    input.on('readable', () => {
        const data = input.read();
        if (data) {
            fileHash.update(data);
            return;
        }
        console.log(fileHash.digest('hex'));
    });
};

await calculateHash();