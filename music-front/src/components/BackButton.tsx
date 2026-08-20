import { ArrowBack } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

interface Props {
    to: string;
    text: string;
}

const BackButton = ({ to, text }: Props) => {
    return (
        <Button
            component={Link}
            to={to}
            startIcon={<ArrowBack />}
            sx={{ mb: 3 }}
        >
            {text}
        </Button>
    );
};

export default BackButton;