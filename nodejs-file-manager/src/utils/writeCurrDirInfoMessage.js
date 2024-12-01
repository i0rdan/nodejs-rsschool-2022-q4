import { stdout } from 'process';

export function writeCurrDirInfoMessage(path) {
	stdout.write(`You are currently in ${path} \n`);
}
