import express, { Router } from 'express';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { UserFields } from '../types.js';

const usersRouter: Router = express.Router();

usersRouter.post('/', async (req, res) => {
    const displayName = req.body.displayName
        ? req.body.displayName
        : req.body.username;

    const userData: UserFields = {
        username: req.body.username,
        password: req.body.password,
        token: randomUUID(),
        role: 'user',
        displayName,
        avatar: null,
        googleID: null,
    };

    try {
        const user = new User(userData);

        await user.save();

        res.send(user);
    } catch (e) {
        if (e instanceof Error) {
            return res.status(400).send({
                message: e.message,
            });
        }

        res.sendStatus(500);
    }
});

usersRouter.post('/sessions', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username,
    });

    if (!user) {
        return res.status(400).send({
            message: 'Invalid data',
        });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
        return res.status(400).send({
            message: 'Invalid data',
        });
    }

    user.token = randomUUID();

    await user.save();

    res.send(user);
});

usersRouter.delete('/sessions', async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({
            message: 'Authorization token is required',
        });
    }

    const user = await User.findOne({ token });

    if (!user) {
        return res.status(401).send({
            message: 'Invalid authorization token',
        });
    }

    user.token = randomUUID();

    await user.save();

    res.sendStatus(204);
});

export default usersRouter;