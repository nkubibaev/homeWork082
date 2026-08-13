import mongoose from "mongoose";

export interface UserFields {
    username: string;
    password: string;
    token: string;
}

export interface TrackHistoryFields {
    user: mongoose.Types.ObjectId;
    track: mongoose.Types.ObjectId;
    datetime: Date;
}