import express from 'express';
import artistsRouter from './routes/artists.js';
import albumsRouter from './routes/albums.js';
import tracksRouter from './routes/tracks.js';
import usersRouter from './routes/users.js';
import trackHistoryRouter from './routes/trackHistory.js';

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
    res.json({
        message: 'Music API is running',
    });
});

app.use('/artists', artistsRouter);
app.use('/albums', albumsRouter);
app.use('/tracks', tracksRouter);
app.use('/users', usersRouter);
app.use('/track_history', trackHistoryRouter);

export default app;