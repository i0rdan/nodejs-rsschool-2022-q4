import { readdir } from 'fs/promises';

export async function moveUp(currDir) {
	try {
		const upperDir = currDir.split('\\').slice(0, -1).join('\\');
		await readdir(upperDir);
		return upperDir;
	} catch (err) {
		throw new Error('Operation failed');
	}
}
