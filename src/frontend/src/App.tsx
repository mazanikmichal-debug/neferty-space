import { Layout } from "@/components/Layout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BackendProvider } from "@/context/BackendContext";
import LoginPage from "@/pages/LoginPage";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Outlet,
  RouterProvider,
  createBrowserHistory,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const HomePage = lazy(() => import("@/pages/HomePage"));
const GalleryPage = lazy(() => import("@/pages/GalleryPage"));
const MintPage = lazy(() => import("@/pages/MintPage"));
const MarketplacePage = lazy(() => import("@/pages/MarketplacePage"));
const RatingPage = lazy(() => import("@/pages/RatingPage"));
const MyCollectionPage = lazy(() => import("@/pages/MyCollectionPage"));

const LoadingScreen = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground animate-pulse">
      Načítavam...
    </span>
  </div>
);

function ProtectedLayout() {
  const { isAuthenticated, isInitializing } = useInternetIdentity();
  if (isInitializing) return <LoadingScreen />;
  if (!isAuthenticated) {
    router.navigate({ to: "/login", replace: true });
    return null;
  }
  return (
    <Layout>
      <Suspense fallback={<LoadingScreen />}>
        <Outlet />
      </Suspense>
    </Layout>
  );
}

const rootRoute = createRootRoute();

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: ProtectedLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<LoadingScreen />}>
      <HomePage />
    </Suspense>
  ),
});

const mintRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/mint",
  component: () => (
    <Suspense fallback={<LoadingScreen />}>
      <MintPage />
    </Suspense>
  ),
});

const galleryRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/gallery",
  component: () => (
    <Suspense fallback={<LoadingScreen />}>
      <GalleryPage />
    </Suspense>
  ),
});

const marketplaceRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/marketplace",
  component: () => (
    <Suspense fallback={<LoadingScreen />}>
      <MarketplacePage />
    </Suspense>
  ),
});

const ratingRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/rating",
  component: () => (
    <Suspense fallback={<LoadingScreen />}>
      <RatingPage />
    </Suspense>
  ),
});

const myCollectionRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/my-collection",
  component: () => (
    <Suspense fallback={<LoadingScreen />}>
      <MyCollectionPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedRoute.addChildren([
    homeRoute,
    mintRoute,
    galleryRoute,
    marketplaceRoute,
    ratingRoute,
    myCollectionRoute,
  ]),
]);

const router = createRouter({
  routeTree,
  history: createBrowserHistory(),
  defaultNotFoundComponent: () => {
    router.navigate({ to: "/", replace: true });
    return null;
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <BackendProvider>
        <RouterProvider router={router} />
      </BackendProvider>
    </ThemeProvider>
  );
}
