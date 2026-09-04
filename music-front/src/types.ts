export type UserRole = 'admin' | 'user';

export interface User {
    _id: string;
    username: string;
    token: string;
    role: UserRole;
}

export interface Artist {
    _id: string;
    name: string;
    photo: string | null;
    information: string | null;
    user: string;
    isPublished: boolean;
}

export interface Album {
    _id: string;
    name: string;
    artist: string;
    year: number;
    image: string | null;
    user: string;
    isPublished: boolean;
}

export interface Track {
    _id: string;
    name: string;
    album: string;
    trackNumber: number;
    duration: string;
    youtubeUrl: string | null;
    user: string;
    isPublished: boolean;
}

export interface TrackHistory {
    _id: string;
    user: string;
    track: string;
    artist: string;
    datetime: string;
}