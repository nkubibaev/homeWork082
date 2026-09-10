import express, { Router } from 'express';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { UserFields } from '../types.js';
import { imagesUpload } from '../multer.js';

const usersRouter: Router = express.Router();

usersRouter.post('/', imagesUpload.single('avatar'), async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const displayName = req.body.displayName;

    if (
        typeof username !== 'string' ||
        !username.trim() ||
        typeof password !== 'string' ||
        !password.trim() ||
        typeof displayName !== 'string' ||
        !displayName.trim()
    ) {
        return res.status(400).send({
            message: 'Username, password and display name are required',
        });
    }

    const userData: UserFields = {
        username: username.trim(),
        password,
        token: randomUUID(),
        role: 'user',
        displayName: displayName.trim(),
        avatar: req.file ? `/images/${req.file.filename}` : null,
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