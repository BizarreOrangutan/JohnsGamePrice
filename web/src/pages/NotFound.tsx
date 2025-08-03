import { Link } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

const NotFound = () => {
  return (
    <Container>
      <Typography variant="h1">The page is not found!</Typography>
      <Link to={'/'}>
        <Button>Go back</Button>
      </Link>
    </Container>
  );
};

export default NotFound;
