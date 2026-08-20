import { List, ListItem, ListItemText, Typography } from '@mui/material';
import type { Track } from '../types';

interface Props {
    tracks: Track[];
}

const TrackList = ({ tracks }: Props) => {
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
                    >
                        {track.duration}
                    </Typography>
                </ListItem>
            ))}
        </List>
    );
};

export default TrackList;