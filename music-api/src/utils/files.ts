import path from 'node:path';
import { promises as fs } from 'node:fs';
import config from '../config.js';

export const removeImage = async (imagePath: string | null) => {
    if (!imagePath) {
        return;
    }

    const relativePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const filePath = path.join(config.publicPath, relativePath);

    try {
        await fs.unlink(filePath);
    } catch (error) {
        if (error instanceof Error && 'code' in error && error.code !== 'ENOENT' ) {
            throw error;
        }
    }
};