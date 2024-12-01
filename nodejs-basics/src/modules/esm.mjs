import { sep } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { release, version } from 'os';
import { createServer as createServerHttp } from 'http';

import * as aJson from './files/a.json' assert { type: "json" };
import * as bJson from './files/b.json' assert { type: "json" };

import './files/c.js';

const random = Math.random();
export const unknownObject = random > 0.5 ? aJson : bJson;

console.log(`Release ${release()}`);
console.log(`Version ${version()}`);
console.log(`Path segment separator is "${sep}"`);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(`Path to current file is ${__filename}`);
console.log(`Path to current directory is ${__dirname}`);

export const myServer = createServerHttp((_, res) => {
    res.end('Request accepted');
});

const PORT = 3000;

console.log(unknownObject);

myServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log('To terminate it, use Ctrl+C combination');
});