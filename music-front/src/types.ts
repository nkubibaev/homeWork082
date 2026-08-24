export interface Artist {
    _id: string;
    name: string;
    photo: string | null;
    information: string | null;
}

export interface Album {
    _id: string;
    name: string;
    artist: string;
    year: number;
    image: string | null;
}

export interface Track {
    _id: string;
    name: string;
    album: string;
    trackNumber: number;
    duration: string;
    youtubeUrl: string | null;
}