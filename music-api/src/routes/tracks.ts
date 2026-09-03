import { Router } from 'express';
import mongoose from 'mongoose';
import Album from '../models/Album.js';
import Artist from '../models/Artist.js';
import Track from '../models/Track.js';
import { getAuthUser, optionalAuth, requireAuth } from '../middleware/auth.js';

const tracksRouter = Router();
tracksRouter.use(optionalAuth);

const canViewEntity = (
    user: ReturnType<typeof getAuthUser>,
    entity: { isPublished: boolean, user: mongoose.Types.ObjectId },
) => {
    if (!user) {
        return entity.isPublished;
    }

    if (user.role === 'admin') {
        return true;
    }

    return (entity.isPublished || entity.user.equals(user._id));
};

tracksRouter.get('/', async (req, res) => {
    try {
        const user = getAuthUser(req);
        const { album = null } = req.query;

        if (album !== null) {
            if (typeof album !== 'string' || !mongoose.isValidObjectId(album)) {
                res.status(400).send({
                    message: 'Invalid album ID',
                });

                return;
            }

            const existingAlbum = await Album.findById(album);

            if (existingAlbum === null || !canViewEntity(user, existingAlbum)) {
                res.status(404).send({
                    message: 'Album not found',
                });

                return;
            }
        }

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

        if (album !== null) {
            filter.album = album;
        }

        const tracks = await Track.find(filter).sort({ trackNumber: 1 });

        res.send(tracks);
    } catch (error) {
        console.error(error);

        res.status(500).send({
            error: 'Internal server error',
        });
    }
});

tracksRouter.post('/', requireAuth, async (req, res) => {
        try {
            const user = getAuthUser(req);

            if (!user) {
                res.status(401).send({
                    message: 'Authentication required',
                });

                return;
            }

            const {
                name = null,
                album = null,
                trackNumber = null,
                duration = null,
                youtubeUrl = null,
            } = req.body;

            if (typeof name !== 'string' || !name.trim()) {
                res.status(400).send({
                    message: 'Name is required',
                });

                return;
            }

            if (typeof album !== 'string' || !mongoose.isValidObjectId(album)) {
                res.status(400).send({
                    message: 'Valid album ID is required',
                });

                return;
            }

            const numericTrackNumber = typeof trackNumber === 'string' ? Number(trackNumber) : trackNumber;

            if (typeof numericTrackNumber !== 'number' ||
                !Number.isInteger(numericTrackNumber) ||
                numericTrackNumber < 1
            ) {
                res.status(400).send({
                    message:
                        'Track number must be a positive integer',
                });

                return;
            }

            if (typeof duration !== 'string' || !duration.trim()) {
                res.status(400).send({
                    message: 'Duration is required',
                });

                return;
            }

            if (youtubeUrl !== null && (typeof youtubeUrl !== 'string' || !youtubeUrl.trim())) {
                res.status(400).send({
                    message:
                        'YouTube URL must be a non-empty string',
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

            if (!canViewEntity(user, existingAlbum)) {
                res.status(403).send({
                    message:
                        'Album is not available for this user',
                });

                return;
            }

            const existingArtist = await Artist.findById(existingAlbum.artist);

            if (!existingArtist) {
                res.status(400).send({
                    message: 'Artist not found',
                });

                return;
            }

            if (!canViewEntity(user, existingArtist)) {
                res.status(403).send({
                    message:
                        'Artist is not available for this user',
                });

                return;
            }

            const track = await Track.create({
                name: name.trim(),
                album,
                trackNumber: numericTrackNumber,
                duration: duration.trim(),
                youtubeUrl:
                    youtubeUrl === null
                        ? null
                        : youtubeUrl.trim(),
                user: user._id,
                isPublished: false,
            });

            res.status(201).send(track);
        } catch (error) {
            console.error(error);

            res.status(500).send({
                error: 'Internal server error',
            });
        }
    },
);

export default tracksRouter;