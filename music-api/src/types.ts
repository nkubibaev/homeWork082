import mongoose from "mongoose";

export type UserRole = 'admin' | 'user';

export interface UserFields {
    username: string;
    password: string;
    token: string;
    role: UserRole;
    displayName: string;
    avatar: string | null;
    googleID: string | null;
}

export interface TrackHistoryFields {
    user: mongoose.Types.ObjectId;
    track: mongoose.Types.ObjectId;
    artist: mongoose.Types.ObjectId;
    datetime: Date;
}