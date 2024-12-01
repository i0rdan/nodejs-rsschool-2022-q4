import { readdir } from "fs";

const list = async () => {
    const path = 'src/fs/files';
    const customError = new Error('FS operation failed');

    readdir(path, (readDirError, files) => {
        if (readDirError) {
            throw customError;
        }
        files.forEach((fName) => {
            console.log(fName);
        });
        console.info('FS operation completed');
    });
};

await list();