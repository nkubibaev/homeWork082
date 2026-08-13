import express, { Router } from 'express';
import User from '../models/User.js';
import { UserFields } from '../types.js';

const usersRouter: Router = express.Router();

usersRouter.post('/', async (req, res) => {
    const userData: UserFields = {
        username: req.body.username,
        password: req.body.password,
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

export default usersRouter;