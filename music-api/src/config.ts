import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootPath: string = path.dirname(
    fileURLToPath(import.meta.url),
);

const config = {
    rootPath,
    publicPath: path.join(rootPath, '../public'),
};

export default config;