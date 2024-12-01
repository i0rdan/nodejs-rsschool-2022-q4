import { access, rename } from "fs";

const rename = async () => {
    const currPath = 'src/fs/files/wrongFilename.txt';
    const newPath = 'src/fs/files/properFilename.md';
    const customError = new Error('FS operation failed');

    access(newPath, (accessError) => {
        if (accessError) {
            rename(currPath, newPath, function(err) {
                if (err) {
                    throw customError;
                }
                console.info('FS operation completed');
            });
            return;
        }
        throw customError;
    });
};

await rename();