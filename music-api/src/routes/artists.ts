import { Router } from 'express';
import  Artist  from '../models/Artist.js';

const artistsRouter = Router();

artistsRouter.get('/', async (_req, res) => {
    try {
        const artists = await Artist.find();
        res.send(artists);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            error: 'Internal server error',
        });
    }
});

artistsRouter.post('/', async (req, res) => {
    try {
        const { name, photo, information } = req.body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            res.status(400).send({
                message: 'Name is required',
            });

            return;
        }

        const artist = await Artist.create({
            name: name.trim(),
            photo,
            information,
        });

        res.status(201).send(artist);
    } catch (error) {
        console.error(error);

        res.status(500).send({
            message: 'Internal server error',
        });
    }
});

export default artistsRouter;