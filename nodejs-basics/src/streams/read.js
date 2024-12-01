import { createReadStream } from 'fs';

const read = async () => {
    const filePath = 'src/streams/files/fileToRead.txt';
    const readableStream = createReadStream(filePath, { encoding: 'utf-8' });

    readableStream.on('data', (data) => {
        process.stdout.write(data);
    });

    readableStream.on('error', (error) => {
        throw error;
    });
};

await read();