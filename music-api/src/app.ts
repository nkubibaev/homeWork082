import express from 'express';
import artistsRouter from './routes/artists.js';
import albumsRouter from './routes/albums.js';

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
    res.json({
        message: 'Music API is running',
    });
});

app.use('/artists', artistsRouter);
app.use('/albums', albumsRouter);

export default app;