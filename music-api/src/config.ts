import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootPath: string = path.dirname(
    fileURLToPath(import.meta.url),
);

const config = {
    rootPath,
    publicPath: path.join(rootPath, '../public'),
    mongoDbUrl: 'mongodb://127.0.0.1:27017/music-api'
};

export default config;