import { argv } from 'process';

const parseArgs = () => {
    const formatArtgs = argv.slice(2).reduce((prev, curr) => {
        if (curr.startsWith('--')) {
            return prev + curr.slice(2) + ' is ';
        }
        return prev + curr + ', ';
    }, '');
    console.log(formatArtgs.substring(0, formatArtgs.length - 2));
};

parseArgs();