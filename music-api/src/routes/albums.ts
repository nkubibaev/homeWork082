import { Router } from 'express';
import mongoose from 'mongoose';
import Album from '../models/Album.js';
import Artist from '../models/Artist.js';
import { imagesUpload } from '../multer.js';

const albumsRouter = Router();

albumsRouter.get('/', async (req, res) => {
    try {
        const { artist = null } = req.query;

        if (artist !== null) {
            if (typeof artist !== 'string' || !mongoose.isValidObjectId(artist)) {
                res.status(400).send({
                    error: 'Invalid artist ID',
                });

                return;
            }

            const albums = await Album.find({ artist }).sort({ year: -1 });
            res.send(albums);

            return;
        }

        const albums = await Album.find().sort({ year: -1 });
        res.send(albums);
    } catch (error) {
        console.error(error);

        res.status(500).send({
            error: 'Internal server error',
        });
    }
});

albumsRouter.get('/:id', async (req, res) => {
    try {
        const { id = null } = req.params;

        if ( id === null || !mongoose.isValidObjectId(id)) {
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
            error: 'Internal server error',
        });
    }
});

albumsRouter.post('/', imagesUpload.single('image'),
    async (req, res) => {
        try {
            const { name = null, artist = null, year = null } = req.body;
            const image = req.file
                ? `/images/${req.file.filename}`
                : null;

            if (typeof name !== 'string' || !name.trim()) {
                res.status(400).send({
                    message: 'Name is required',
                });

                return;
            }

            if (typeof artist !== 'string' || !mongoose.isValidObjectId(artist)) {
                res.status(400).send({
                    message: 'Valid artist ID is required',
                });

                return;
            }

            const numericYear = typeof year === 'string'
                    ? Number(year)
                    : year;

            if (typeof numericYear !== 'number' || !Number.isInteger(numericYear)) {
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
                year: numericYear,
                image,
            });

            res.status(201).send(album);
        } catch (error) {
            console.error(error);

            res.status(500).send({
                error: 'Internal server error',
            });
        }
    },
);

export default albumsRouter;