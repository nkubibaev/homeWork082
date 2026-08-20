import multer, { type StorageEngine } from 'multer';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { randomUUID } from 'node:crypto';
import config from './config.js';

const imageStorage: StorageEngine = multer.diskStorage({
    destination: async (_req, _file, callback) => {
        const destDir: string = path.join(config.publicPath, 'images');
        await fs.mkdir(destDir, {
            recursive: true,
        });

        callback(null, destDir);
    },
    filename: (_req, file, callback) => {
        const extension: string = path.extname(file.originalname);

        callback(null,`${randomUUID()}${extension}`);
    },
});


export const imagesUpload = multer({ storage: imageStorage });