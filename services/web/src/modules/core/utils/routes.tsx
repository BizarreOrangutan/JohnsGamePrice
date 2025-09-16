import Home from '../../../pages/Home.tsx';
import About from '../../../pages/About.tsx';
import NotFound from '../../../pages/NotFound.tsx';
import Search from '../../../pages/Search.tsx';
import Analytics from '../../../pages/Analytics.tsx';

export const routes = {
  '/': <Home />,
  '/about': <About />,
  '/search': <Search />,
  '/analytics/:id': <Analytics />,
  '*': <NotFound />,
};
