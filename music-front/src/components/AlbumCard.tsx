import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Album } from '../types';

interface Props {
    album: Album;
}

const AlbumCard = ({ album }: Props) => {
    return (
        <Card>
            <CardActionArea
                component={Link}
                to={`/albums/${album._id}`}
            >
                {album.image !== null ? (
                    <CardMedia
                        component="img"
                        height="260"
                        image={`http://localhost:8000${album.image}`}
                        alt={album.name}
                    />
                ) : (
                    <CardMedia
                        component="div"
                        sx={{
                            height: 260,
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

                <CardContent>
                    <Typography
                        variant="h6"
                        component="h2"
                        gutterBottom
                    >
                        {album.name}
                    </Typography>

                    <Typography color="text.secondary">
                        {album.year}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default AlbumCard;