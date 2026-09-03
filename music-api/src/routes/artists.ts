import { Router } from 'express';
import mongoose from 'mongoose';
import Artist from '../models/Artist.js';
import { imagesUpload } from '../multer.js';
import { getAuthUser, optionalAuth, requireAuth } from '../middleware/auth.js';

const artistsRouter = Router();

artistsRouter.use(optionalAuth);

artistsRouter.get('/', async (req, res) => {
    try {
        const user = getAuthUser(req);

        let filter: Record<string, unknown> = {};

        if (!user) {
            filter = { isPublished: true };
        } else if (user.role !== 'admin') {
            filter = {
                $or: [
                    { isPublished: true },
                    { isPublished: false, user: user._id }
                ]
            };
        }

        const artists = await Artist.find(filter).sort({ name: 1 });

        res.send(artists);
    } catch (error) {
        console.error(error);

        res.status(500).send({
            error: 'Internal server error',
        });
    }
});

artistsRouter.get('/:id', async (req, res) => {
    try {
        const { id = null } = req.params;

        if (id === null || !mongoose.isValidObjectId(id)) {
            res.status(400).send({
                message: 'Invalid artist ID',
            });

            return;
        }

        const user = getAuthUser(req);

        let filter: Record<string, unknown> = {
            _id: id,
        };

        if (!user) {
            filter = {
                _id: id,
                isPublished: true,
            };
        } else if (user.role !== 'admin') {
            filter = {
                _id: id,
                $or: [
                    { isPublished: true },
                    { isPublished: false, user: user._id }
                ]
            };
        }

        const artist = await Artist.findOne(filter);

        if (!artist) {
            res.status(404).send({
                message: 'Artist not found',
            });

            return;
        }

        res.send(artist);
    } catch (error) {
        console.error(error);

        res.status(500).send({
            error: 'Internal server error',
        });
    }
});

artistsRouter.post('/', requireAuth, imagesUpload.single('photo'),
    async (req, res) => {
        try {
            const user = getAuthUser(req);

            if (!user) {
                res.status(401).send({
                    message: 'Authentication required',
                });

                return;
            }

            const { name = null, information = null } = req.body;

            if (typeof name !== 'string' || !name.trim()) {
                res.status(400).send({
                    message: 'Name is required',
                });

                return;
            }

            const photo = req.file?.filename
                ? `/images/${req.file.filename}`
                : null;

            const artist = await Artist.create({
                name: name.trim(),
                photo,
                information,
                user: user._id,
                isPublished: false,
            });

            res.status(201).send(artist);
        } catch (error) {
            console.error(error);

            res.status(500).send({
                error: 'Internal server error',
            });
        }
    },
);


export default artistsRouter;