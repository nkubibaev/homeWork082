import mongoose from "mongoose";

export type UserRole = 'admin' | 'user';

export interface UserFields {
    username: string;
    password: string;
    token: string;
    role: UserRole;
}

export interface TrackHistoryFields {
    user: mongoose.Types.ObjectId;
    track: mongoose.Types.ObjectId;
    artist: mongoose.Types.ObjectId;
    datetime: Date;
}