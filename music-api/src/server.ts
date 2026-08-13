import express from 'express';
import mongoose from 'mongoose';

import artistsRouter from './routes/artists.js';
import albumsRouter from './routes/albums.js';
import tracksRouter from './routes/tracks.js';
import usersRouter from './routes/users.js';
import trackHistoryRouter from './routes/trackHistory.js';

const app = express();

app.use(express.json());

app.use('/artists', artistsRouter);
app.use('/albums', albumsRouter);
app.use('/tracks', tracksRouter);
app.use('/users', usersRouter);
app.use('/track_history', trackHistoryRouter);

const PORT = 8000;

const start = async () => {
    try {
        await mongoose.connect(
            'mongodb://127.0.0.1:27017/music-api',
        );

        console.log('MongoDB connected');

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (e) {
        console.error('Failed to start server:', e);
    }
};

start();