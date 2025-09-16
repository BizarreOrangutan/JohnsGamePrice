import { createBrowserRouter } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import AppAppBar from '../components/AppAppBar.tsx';

import { routes } from './routes.tsx';

const AppAppBarWrapper = () => {
  return (
    <>
      <AppAppBar />
      <Outlet />
    </>
  );
};

export const Router = createBrowserRouter([
  {
    element: <AppAppBarWrapper />,
    children: Object.entries(routes).map(([path, element]) => ({ path, element })),
  },
]);
