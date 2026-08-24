import { Router } from 'express';
import mongoose from 'mongoose';
import Album from '../models/Album.js';
import Track from '../models/Track.js';

const tracksRouter = Router();

tracksRouter.get('/', async (req, res) => {
    try {
        const { album } = req.query;

        if (album != null) {
            if (
                typeof album !== 'string' ||
                !mongoose.isValidObjectId(album)
            ) {
                res.status(400).send({
                    message: 'Invalid album ID',
                });

                return;
            }

            const tracks = await Track.find({ album }).sort({ trackNumber: 1 });
            res.send(tracks);

            return;
        }

        const tracks = await Track.find().sort({ trackNumber: 1 });
        res.send(tracks);
    } catch (error) {
        console.error(error);

        res.status(500).send({
            message: 'Internal server error',
        });
    }
});

tracksRouter.post('/', async (req, res) => {
    try {
        const { name, album, trackNumber, duration, youtubeUrl = null } = req.body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            res.status(400).send({
                message: 'Name is required',
            });

            return;
        }

        if (!album || !mongoose.isValidObjectId(album)) {
            res.status(400).send({
                message: 'Valid album ID is required',
            });

            return;
        }

        if (trackNumber === null ||
            typeof trackNumber !== 'number' ||
            !Number.isInteger(trackNumber) ||
            trackNumber < 1
        ) {
            res.status(400).send({
                message: 'Track number must be a positive integer',
            });

            return;
        }

        if (!duration ||
            typeof duration !== 'string' ||
            !duration.trim()
        ) {
            res.status(400).send({
                message: 'Duration is required',
            });

            return;
        }

        if (
            youtubeUrl !== null &&
            (typeof youtubeUrl !== 'string' || !youtubeUrl.trim())
        ) {
            res.status(400).send({
                message: 'YouTube URL must be a non-empty string',
            });

            return;
        }

        const existingAlbum = await Album.findById(album);

        if (!existingAlbum) {
            res.status(400).send({
                message: 'Album not found',
            });

            return;
        }

        const track = await Track.create({
            name: name.trim(),
            album,
            trackNumber,
            duration: duration.trim(),
            youtubeUrl: youtubeUrl !== null ? youtubeUrl.trim() : null,
        });

        res.status(201).send(track);
    } catch (error) {
        console.error(error);

        res.status(500).send({
            message: 'Internal server error',
        });
    }
});

export default tracksRouter;