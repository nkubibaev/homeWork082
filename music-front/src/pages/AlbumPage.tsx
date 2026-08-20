import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, CircularProgress, Paper } from '@mui/material';
import axiosApi from '../api/axiosApi';
import type { Album, Artist, Track } from '../types';
import TrackList from '../components/TrackList';
import BackButton from '../components/BackButton';
import PageTitle from '../components/PageTitle';

type AlbumResponse = Omit<Album, 'artist'> & {
    artist: Artist;
};

const AlbumPage = () => {
    const { id = null } = useParams();

    const [album, setAlbum] =
        useState<AlbumResponse | null>(null);

    const [tracks, setTracks] =
        useState<Track[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        if (id === null) {
            setError('Album ID is missing');
            setLoading(false);

            return;
        }

        const fetchAlbum = async () => {
            try {
                setLoading(true);
                setError(null);

                const [
                    albumResponse,
                    tracksResponse,
                ] = await Promise.all([
                    axiosApi.get<AlbumResponse>(
                        `/albums/${id}`,
                    ),
                    axiosApi.get<Track[]>(
                        `/tracks?album=${id}`,
                    ),
                ]);

                setAlbum(albumResponse.data);
                setTracks(tracksResponse.data);
            } catch {
                setError(
                    'Failed to load album data',
                );
            } finally {
                setLoading(false);
            }
        };

        void fetchAlbum();
    }, [id]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error !== null) {
        return (
            <Alert severity="error">
                {error}
            </Alert>
        );
    }

    if (album === null) {
        return (
            <Alert severity="error">
                Album not found
            </Alert>
        );
    }

    return (
        <>
            <BackButton
                to={`/artists/${album.artist._id}`}
                text={`Back to ${album.artist.name}`}
            />
            <PageTitle
                title={album.name}
                subtitle={`${album.artist.name} • ${album.year}`}
            />
            <Paper>
                <TrackList tracks={tracks} />
            </Paper>
        </>
    );
};

export default AlbumPage;