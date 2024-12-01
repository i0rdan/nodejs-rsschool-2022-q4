import { readFile } from "fs";

const read = async () => {
    const path = 'src/fs/files/fileToRead.txt';
    const customError = new Error('FS operation failed');

    readFile(path, 'utf8', (readFileError, content) => {
        if (readFileError) {
            throw customError;
        }
        console.log(content);
        console.info('FS operation completed');
    });
};

await read();