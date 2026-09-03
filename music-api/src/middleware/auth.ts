import type { HydratedDocument } from 'mongoose';
import type { Request, Response, NextFunction } from 'express';
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

export const optionalAuth = async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction,
) => {
    try {
        const token = req.headers.authorization ?? null;

        req.user = await findUserByToken(token);

        next();
    } catch (error) {
        next(error);
    }
};

export const requireAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const token = req.headers.authorization ?? null;
        const user = await findUserByToken(token);

        if (!user) {
            res.status(401).send({
                message: 'Invalid or missing authorization token',
            });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export const requireAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).send({
            message: 'Administrator access required',
        });
        return;
    }

    next();
};