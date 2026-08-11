import express from 'express';
import artistsRouter from './routes/artists.js';

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
    res.json({
        message: 'Music API is running',
    });
});

app.use('/artists', artistsRouter);

export default app;