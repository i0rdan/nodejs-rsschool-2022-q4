import { unlink } from "fs";

const remove = async () => {
    const deletePath = 'src/fs/files/fileToRemove.txt';
    const customError = new Error('FS operation failed');

    unlink(deletePath, (removeError) => {
        if (removeError) {
            throw customError;
        }
        console.info('FS operation completed');
    });
};

await remove();