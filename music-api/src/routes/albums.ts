import { Router } from 'express';
import mongoose from 'mongoose';
import Album  from '../models/Album.js';
import Artist from '../models/Artist.js';

const albumsRouter = Router();

albumsRouter.get('/', async (req, res) => {
    try {
        const { artist } = req.query;

        if (artist !== undefined) {
            if (
                typeof artist !== 'string' ||
                !mongoose.isValidObjectId(artist)
            ) {
                res.status(400).send({
                    error: 'Invalid artist ID',
                });

                return;
            }

            const albums = await Album.find({
                artist,
            });

            res.send(albums);

            return;
        }

        const albums = await Album.find();

        res.send(albums);
    } catch (error) {
        console.error(error);

        res.status(500).send({
            message: 'Internal server error',
        });
    }
});

albumsRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            res.status(400).send({
                message: 'Invalid album ID',
            });

            return;
        }

        const album = await Album.findById(id);

        if (!album) {
            res.status(404).send({
                message: 'Album not found',
            });

            return;
        }

        const artist = await Artist.findById(album.artist);

        if (!artist) {
            res.status(404).send({
                message: 'Artist not found',
            });

            return;
        }

        res.send({
            ...album.toObject(),
            artist,
        });
    } catch (error) {
        console.error(error);

        res.status(500).send({
            message: 'Internal server error',
        });
    }
});

albumsRouter.post('/', async (req, res) => {
    try {
        const { name, artist, year, image } = req.body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            res.status(400).send({
                message: 'Name is required',
            });

            return;
        }

        if (!artist || !mongoose.isValidObjectId(artist)) {
            res.status(400).send({
                message: 'Valid artist ID is required',
            });

            return;
        }

        if (year === undefined || year === null || typeof year !== 'number') {
            res.status(400).send({
                message: 'Year is required',
            });

            return;
        }

        const existingArtist = await Artist.findById(artist);

        if (!existingArtist) {
            res.status(400).send({
                message: 'Artist not found',
            });

            return;
        }

        const album = await Album.create({
            name: name.trim(),
            artist,
            year,
            image,
        });

        res.status(201).send(album);
    } catch (error) {
        console.error(error);

        res.status(500).send({
            message: 'Internal server error',
        });
    }
});

export default albumsRouter;