import {
    access, readdir, mkdirSync, copyFileSync,
} from "fs";

const copy = async () => {
    const pathToCopy = 'src/fs/files';
    const newPath = 'src/fs/files_copy';
    const customError = new Error('FS operation failed');

    access(newPath, (accessError) => {
        if (accessError) {
            readdir(pathToCopy, (readDirError, files) => {
                if (!readDirError) {
                    try {
                        mkdirSync(newPath);
                        files.forEach((fName) => {
                            copyFileSync(`${pathToCopy}/${fName}`, `${newPath}/${fName}`);
                        });
                        console.info('FS operation completed');
                        return;
                    } catch {
                        throw customError;
                    }
                }
                throw customError;
            });
            return;
        }
        throw customError;
    });
};

copy();