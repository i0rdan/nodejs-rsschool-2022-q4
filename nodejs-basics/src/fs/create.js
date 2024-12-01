import { access, writeFile } from "fs";

const create = async () => {
    const createPath = 'src/fs/files/fresh.txt';
    const customError = new Error('FS operation failed');

    access(createPath, (accessError) => {
        if (accessError) {
            writeFile(createPath, 'I am fresh and young', (writeError) => {
                if(writeError) throw customError;
                console.info('Fs operation completed');
            });
            return;
        }
        throw customError;
    });
};

await create();