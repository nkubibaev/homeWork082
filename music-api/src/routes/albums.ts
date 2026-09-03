import { Router } from 'express';
import mongoose from 'mongoose';
import Album from '../models/Album.js';
import Artist from '../models/Artist.js';
import { imagesUpload } from '../multer.js';
import { getAuthUser, optionalAuth, requireAuth } from '../middleware/auth.js';

const albumsRouter = Router();
albumsRouter.use(optionalAuth);

const canViewEntity = (
    user: ReturnType<typeof getAuthUser>,
    entity: {
        isPublished: boolean;
        user: mongoose.Types.ObjectId;
    },
) => {
    if (!user) {
        return entity.isPublished;
    }

    if (user.role === 'admin') {
        return true;
    }

    return ( entity.isPublished ||  entity.user.equals(user._id));
};

albumsRouter.get('/', async (req, res) => {
    try {
        const user = getAuthUser(req);
        const { artist = null } = req.query;

        if (artist !== null && (typeof artist !== 'string' || !mongoose.isValidObjectId(artist))) {
            res.status(400).send({
                error: 'Invalid artist ID',
            });

            return;
        }

        let filter: Record<string, unknown> = {};

        if (!user) {
            filter = {
                isPublished: true,
            };
        } else if (user.role !== 'admin') {
            filter = {
                $or: [
                    { isPublished: true },
                    { isPublished: false, user: user._id }
                ]
            };
        }

        if (artist !== null) {
            filter.artist = artist;
        }

        const albums = await Album.find(filter).sort({ year: -1 });

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

        if (id === null || !mongoose.isValidObjectId(id)) {
            res.status(400).send({
                message: 'Invalid album ID',
            });

            return;
        }

        const user = getAuthUser(req);
        const album = await Album.findById(id);

        if (album === null || !canViewEntity(user, album)) {
            res.status(404).send({
                message: 'Album not found',
            });

            return;
        }

        const artist = await Artist.findById(album.artist);

        if (artist === null || !canViewEntity(user, artist)) {
            res.status(404).send({
                message: 'Artist not found',
            });

            return;
        }

        res.send({ ...album.toObject(), artist });
    } catch (error) {
        console.error(error);

        res.status(500).send({
            error: 'Internal server error',
        });
    }
});

albumsRouter.post('/', requireAuth, imagesUpload.single('image'),
    async (req, res) => {
        try {
            const user = getAuthUser(req);

            if (!user) {
                res.status(401).send({
                    message: 'Authentication required',
                });

                return;
            }

            const { name = null, artist = null, year = null } = req.body;

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

            const numericYear = typeof year === 'string' ? Number(year) : year;

            if ( typeof numericYear !== 'number' || !Number.isInteger(numericYear)) {
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

            if (!canViewEntity(user, existingArtist)) {
                res.status(403).send({
                    message: 'Artist is not available for this user',
                });

                return;
            }

            const image = req.file?.filename
                ? `/images/${req.file.filename}`
                : null;

            const album = await Album.create({
                name: name.trim(),
                artist,
                year: numericYear,
                image,
                user: user._id,
                isPublished: false,
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