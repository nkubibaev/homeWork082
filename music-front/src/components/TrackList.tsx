import {
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';

import type { Track } from '../types';

interface Props {
    tracks: Track[];
}

const TrackList = ({ tracks }: Props) => {
    return (
        <List>
            {tracks.map((track) => (
                <ListItem
                    key={track._id}
                    divider
                >
                    <Typography
                        sx={{
                            width: 50,
                            fontWeight: 600,
                        }}
                    >
                        {track.trackNumber}.
                    </Typography>

                    <ListItemText
                        primary={track.name}
                        secondary={track.duration}
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default TrackList;