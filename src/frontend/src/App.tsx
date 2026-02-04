import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/queries/useCallerProfile';
import DashboardPage from './pages/DashboardPage';
import DrawPage from './pages/DrawPage';
import GalleryPage from './pages/GalleryPage';
import PaintingDetailPage from './pages/PaintingDetailPage';
import AppHeader from './components/layout/AppHeader';
import ProfileSetupModal from './components/profile/ProfileSetupModal';
import { Toaster } from 'sonner';

function Layout() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {isAuthenticated && <AppHeader />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster position="top-center" />
    </div>
  );
}

function AuthenticatedDashboard() {
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return <ProfileSetupModal />;
  }

  return <DashboardPage />;
}

function IndexPage() {
  const { identity } = useInternetIdentity();
  if (!identity) {
    return <DashboardPage />;
  }
  return <AuthenticatedDashboard />;
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: AuthenticatedDashboard,
});

const drawRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/draw',
  component: DrawPage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gallery',
  component: GalleryPage,
});

const paintingDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/painting/$paintingId',
  component: PaintingDetailPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  drawRoute,
  galleryRoute,
  paintingDetailRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}
