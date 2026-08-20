import {
    AppBar,
    Button,
    Container,
    Toolbar,
    Typography,
} from '@mui/material';

import {
    NavLink,
    Route,
    Routes,
} from 'react-router-dom';

import ArtistsPage from './pages/ArtistsPage';

const App = () => {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Music App
                    </Typography>

                    <Button
                        color="inherit"
                        component={NavLink}
                        to="/"
                    >
                        Artists
                    </Button>
                </Toolbar>
            </AppBar>

            <Container
                maxWidth="lg"
                sx={{ py: 4 }}
            >
                <Routes>
                    <Route
                        path="/"
                        element={<ArtistsPage />}
                    />
                </Routes>
            </Container>
        </>
    );
};

export default App;