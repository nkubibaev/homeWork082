import { NavLink, Route, Routes } from 'react-router-dom';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';

const HomePage = () => {
  return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Music App
        </Typography>

        <Typography color="text.secondary">
          Select an artist to see albums.
        </Typography>
      </Box>
  );
};

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

        <Container maxWidth="lg">
          <Routes>
            <Route
                path="/"
                element={<HomePage />}
            />
          </Routes>
        </Container>
      </>
  );
};

export default App;