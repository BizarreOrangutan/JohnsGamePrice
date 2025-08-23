import Home from '../../../pages/Home.tsx';
import About from '../../../pages/About.tsx';
import NotFound from '../../../pages/NotFound.tsx';

export const routes = {
  '/': <Home />,
  '/about': <About />,
  '*': <NotFound />,
};
