import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';

import type { Artist } from '../types';

interface Props {
    artist: Artist;
}

const ArtistCard = ({ artist }: Props) => {
    return (
        <Card
            elevation={2}
            sx={{
                height: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                },
            }}
        >
            <CardActionArea
                component={Link}
                to={`/artists/${artist._id}`}
                sx={{ height: '100%' }}
            >
                {artist.photo !== null ? (
                    <CardMedia
                        component="img"
                        height="280"
                        image={`http://localhost:8000${artist.photo}`}
                        alt={artist.name}
                        sx={{
                            objectFit: 'cover',
                        }}
                    />
                ) : (
                    <CardMedia
                        component="div"
                        sx={{
                            height: 280,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'grey.200',
                        }}
                    >
                        <Typography color="text.secondary">
                            No image
                        </Typography>
                    </CardMedia>
                )}

                <CardContent
                    sx={{
                        py: 2.5,
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h2"
                    >
                        {artist.name}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default ArtistCard;