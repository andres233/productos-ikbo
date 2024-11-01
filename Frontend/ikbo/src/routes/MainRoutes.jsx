import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import { ProtectedRoute } from './ProtectedRoutes';
import ListProducts from 'pages/dashboard/products/ListProducts';
import { Navigate } from 'react-router';
import CreateProductForm from 'pages/dashboard/products/CreateProductForm';
import ListInventaries from 'pages/dashboard/inventary/ListInventaries';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '/',
      element: <Navigate to="/products" replace /> // Redirige a /products
      //element: <ListProducts />
    },
    {
      path: 'products',
      element: <ListProducts />
    },
    {
      path: '/create-product',
      element: <CreateProductForm />
    },
    {
      path: 'inventary/:productId',
      element: <ListInventaries />
    }
  ]
};

export default MainRoutes;
