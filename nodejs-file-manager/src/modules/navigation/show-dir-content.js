import { readdir } from 'fs/promises';

export async function showDirContent(currDir) {
	try {
    const fileType = 'File';
    const dirType = 'Directory';
    const files = await readdir(currDir, { withFileTypes: true });
    const dirContent = files.map((file) => ({
      Name: file.name,
      Type: file.isFile() ? fileType : dirType,
    }));
    const sortedFiles = dirContent
      .filter((f) => f.Type === fileType)
      .sort((a, b) => a > b);
    const sortedDirs = dirContent
      .filter((f) => f.Type === dirType)
      .sort((a, b) => a > b);

    console.table(sortedDirs.concat(sortedFiles));
	} catch (err) {
		throw new Error('Operation failed');
	}
}
