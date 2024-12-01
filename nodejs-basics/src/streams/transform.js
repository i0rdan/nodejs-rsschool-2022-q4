import { Transform } from 'node:stream';

const transform = async () => {
    const myTransform = new Transform({
        transform(data, _, callback) {
            callback(null, data.reverse() + '\n');
        },
    });

    process.stdin
        .pipe(myTransform)
        .pipe(process.stdout);
};

await transform();