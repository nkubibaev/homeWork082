import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Artist } from '../types';

interface Props {
    artist: Artist;
}

const ArtistCard = ({ artist }: Props) => {
    return (
        <Card>
            <CardActionArea
                component={Link}
                to={`/artists/${artist._id}`}
            >
                {artist.photo !== null ? (
                    <CardMedia
                        component="img"
                        height="240"
                        image={`http://localhost:8000${artist.photo}`}
                        alt={artist.name}
                    />
                ) : (
                    <CardMedia
                        component="div"
                        sx={{
                            height: 240,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'grey.200',
                        }}
                    >
                        <Typography color="text.secondary">
                            No image
                        </Typography>
                    </CardMedia>
                )}

                <CardContent>
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