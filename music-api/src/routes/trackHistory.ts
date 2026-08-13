import express, { Router } from 'express';
import User from '../models/User.js';
import Track from '../models/Track.js';
import TrackHistory from '../models/TrackHistory.js';

const trackHistoryRouter: Router = express.Router();

trackHistoryRouter.post('/', async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).send({
                message: 'No token present',
            });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).send({
                message: 'Wrong token',
            });
        }

        const track = await Track.findById(req.body.track);

        if (!track) {
            return res.status(400).send({
                message: 'Track not found',
            });
        }

        const trackHistory = new TrackHistory({
            user: user._id,
            track: track._id,
            datetime: new Date(),
        });

        await trackHistory.save();

        res.send(trackHistory);
    } catch (e) {
        if (e instanceof Error) {
            return res.status(400).send({
                message: e.message,
            });
        }

        res.sendStatus(500);
    }
});

export default trackHistoryRouter;