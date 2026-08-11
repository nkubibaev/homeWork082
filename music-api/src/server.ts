import mongoose from 'mongoose';
import app from './app.js';

const port = 8000;
const MONGO_URL = 'mongodb://127.0.0.1:27017/music_app';

const start = async () => {
    try {
        await mongoose.connect(MONGO_URL);

        app.listen(port, () => {
            console.log(`Server started on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

start();