import { createGzip } from 'zlib';
import { pipeline } from 'stream';
import { createReadStream, createWriteStream } from 'fs';

const compress = async () => {
    const fileToCompress = 'src/zip/files/fileToCompress.txt';
    const compressedFile = 'src/zip/files/archive.gz';

    const gzip = createGzip();
    const source = createReadStream(fileToCompress);
    const destination = createWriteStream(compressedFile);

    pipeline(source, gzip, destination, (err) => {
        if (err) {
            throw err;
        }
    });
};

await compress();