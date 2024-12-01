import { unzip } from 'zlib';
import { createReadStream, createWriteStream } from 'fs';

const decompress = async () => {
    const fileToUnzip = 'src/zip/files/archive.gz';
    const unzippedFile = 'src/zip/files/fileToCompress.txt';

    const source = createReadStream(fileToUnzip);
    const destination = createWriteStream(unzippedFile);

    source.on('data', (bufData) => {
        unzip(bufData, (err, data) => {
            if (err) {
                throw err;
            }
            destination.write(data);
        });
    });
};

await decompress();