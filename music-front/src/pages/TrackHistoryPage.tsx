import { useEffect, useState } from 'react';
import { Alert, CircularProgress, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import axiosApi from '../api/axiosApi';

interface TrackHistoryItem {
    _id: string;
    artist: {
        _id: string;
        name: string;
    } | null;
    track: {
        _id: string;
        name: string;
        duration: string;
    } | null;
    datetime: string;
}

const TrackHistoryPage = () => {
    const [history, setHistory] =
        useState<TrackHistoryItem[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                setError(null);

                const response =
                    await axiosApi<TrackHistoryItem[]>('/track_history');

                setHistory(response.data);
            } catch (error) {
                console.error(error);

                setError(
                    'Failed to load track history',
                );
            } finally {
                setLoading(false);
            }
        };

        void fetchHistory();
    }, []);

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

    return (
        <>
            <Typography
                variant="h4"
                component="h1"
                sx={{ mb: 3 }}
            >
                Track History
            </Typography>

            {history.length === 0 ? (
                <Alert severity="info">
                    Your track history is empty
                </Alert>
            ) : (
                <Paper>
                    <List disablePadding>
                        {history.map((item) => (
                            <ListItem
                                key={item._id}
                                divider
                                sx={{
                                    px: 3,
                                    py: 2,
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography>
                                            {item.artist?.name ?? 'Unknown artist'}
                                        </Typography>
                                    }
                                    secondary={
                                        item.track?.name ?? 'Unknown track'
                                    }
                                />

                                <Typography
                                    color="text.secondary"
                                >
                                    {new Date(
                                        item.datetime,
                                    ).toLocaleString()}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </>
    );
};

export default TrackHistoryPage;