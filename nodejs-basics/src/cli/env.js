import { env } from 'process';

const parseEnv = () => {
    const prefix = 'RSS_';
    const parsedArgs = Object.entries(env)
        .filter(([key]) => key.startsWith(prefix))
        .map(([key, value]) => key + '=' + value)
        .join('; ');
    console.log(parsedArgs);
};

parseEnv();