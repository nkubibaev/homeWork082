import express, { Router } from 'express';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { UserFields } from '../types.js';
import { imagesUpload } from '../multer.js';
import config from '../config.js';

const usersRouter: Router = express.Router();

const client = new OAuth2Client(config.google.clientId);

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

usersRouter.post('/google', async (req, res) => {
    const credential = req.body.credential;

    if (typeof credential !== 'string' || !credential) {
        return res.status(400).send({
            message: 'Google credential is required',
        });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: config.google.clientId,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return res.status(400).send({
                message: 'Invalid Google credential',
            });
        }

        const googleID = payload.sub;
        const email = payload.email;
        const displayName = payload.name;
        const avatar = payload.picture;

        if (!googleID || !email || !displayName) {
            return res.status(400).send({
                message: 'Google account data is incorrect',
            });
        }

        let user = await User.findOne({
            googleID,
        });

        if (!user) {
            user = new User({
                username: email,
                password: randomUUID(),
                token: randomUUID(),
                role: 'user',
                displayName,
                avatar: avatar ? avatar : null,
                googleID
            });

            await user.save();
        } else {
            user.token = randomUUID();

            await user.save();
        }

        res.send(user);
    } catch (e) {
        console.error(e);

        return res.status(400).send({
            message: 'Invalid Google credential',
        });
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