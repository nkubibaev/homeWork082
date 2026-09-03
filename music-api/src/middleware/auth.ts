import type { Request, RequestHandler, Response, NextFunction } from 'express';
import type { HydratedDocument } from 'mongoose';
import User from '../models/User.js';
import type { UserFields } from '../types.js';

export interface AuthRequest extends Request {
    user: HydratedDocument<UserFields> | null;
}

export const findUserByToken = async (token: string | null) => {
    if (!token) {
        return null;
    }

    return User.findOne({ token });
};

export const optionalAuth: RequestHandler = async (
    req,
    _res,
    next,
) => {
    try {
        const token = req.headers.authorization ?? null;
        const user = await findUserByToken(token);

        (req as AuthRequest).user = user;

        next();
    } catch (error) {
        next(error);
    }
};

export const requireAuth: RequestHandler = async (
    req,
    res,
    next,
) => {
    try {
        const token = req.headers.authorization ?? null;
        const user = await findUserByToken(token);

        if (user === null) {
            res.status(401).send({
                message: 'Invalid or missing authorization token',
            });
            return;
        }

        (req as AuthRequest).user = user;

        next();
    } catch (error) {
        next(error);
    }
};

export const requireAdmin: RequestHandler = (
    req,
    res,
    next,
) => {
    const authRequest = req as AuthRequest;

    if (authRequest.user === null || authRequest.user.role !== 'admin') {
        res.status(403).send({
            message: 'Administrator access required',
        });
        return;
    }

    next();
};

export const getAuthUser = (req: Request) => {
    return (req as AuthRequest).user;
};