import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootPath: string = path.dirname(
    fileURLToPath(import.meta.url),
);

const config = {
    rootPath,
    publicPath: path.join(rootPath, '../public'),
    mongoDbUrl: 'mongodb://127.0.0.1:27017/music-api',
    google: { clientId: '819995782381-4a084he3pmr2d710ij0ekc4d3giqua96.apps.googleusercontent.com', }
};

export default config;