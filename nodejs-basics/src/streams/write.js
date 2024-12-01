import { createWriteStream } from 'fs';

const write = async () => {
    const filePath = 'src/streams/files/fileToWrite.txt';
    const writableStream = createWriteStream(filePath, { encoding: 'utf-8' });
    process.stdin.on('data', (data) => {
        writableStream.write(data, (err) => {
            if (err) throw err;
        });
    });
};

await write();