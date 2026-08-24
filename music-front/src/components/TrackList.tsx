import { Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useState } from 'react';
import type { Track } from '../types';
import { useAuthStore } from '../store/authStore';
import { addTrackToHistory } from '../api/trackHistoryApi';

interface Props {
    tracks: Track[];
}

const TrackList = ({ tracks }: Props) => {
    const user = useAuthStore((state) => state.user);

    const [playingTrackId, setPlayingTrackId] =
        useState<string | null>(null);

    const handlePlay = async (trackId: string) => {
        try {
            setPlayingTrackId(trackId);

            await addTrackToHistory(trackId);
        } catch (error) {
            console.error(error);
        } finally {
            setPlayingTrackId(null);
        }
    };

    return (
        <List disablePadding>
            {tracks.map((track) => (
                <ListItem
                    key={track._id}
                    divider
                    sx={{
                        px: 3,
                        py: 2,
                    }}
                >
                    <Typography
                        sx={{
                            width: 48,
                            fontWeight: 600,
                            color: 'text.secondary',
                        }}
                    >
                        {track.trackNumber}
                    </Typography>

                    <ListItemText
                        primary={track.name}
                    />

                    <Typography
                        color="text.secondary"
                        sx={{
                            mr: user ? 2 : 0,
                        }}
                    >
                        {track.duration}
                    </Typography>

                    {user && (
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => void handlePlay(track._id)}
                            disabled={
                                playingTrackId === track._id
                            }
                        >
                            {playingTrackId === track._id
                                ? 'Playing...'
                                : 'Play'}
                        </Button>
                    )}
                </ListItem>
            ))}
        </List>
    );
};

export default TrackList;