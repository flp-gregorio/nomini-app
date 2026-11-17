import { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import PageTitleComponent from "../components/PageTitleComponent";
import About from "../pages/About";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Home from "../pages/Home";
import Leaderboard from "../pages/Leaderboard";
import Nominees from "../pages/Nominees";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import Winners from "../pages/Winners";
import RequireAuth from "../components/RequireAuth.tsx";
import LayoutSystemComponent from "../components/Layouts/LayoutSystemComponent";
import LazyAdmin from "./LazyAdmin";

const router = createBrowserRouter([
  // GROUP 1: Standalone Pages
  {
    path: "/",
    element: (
      <>
        <Home />
        <PageTitleComponent title="Nomini - The Game Awards 2026" />
      </>
    ),
  },
  {
    path: "login",
    element: (
      <>
        <Login />
        <PageTitleComponent title="Nomini - Login" />
      </>
    ),
  },
  {
    path: "register",
    element: (
      <>
        <Register />
        <PageTitleComponent title="Nomini - Register" />
      </>
    ),
  },

  // GROUP 2: Layout Pages (Header + Footer + Content)
  {
    element: <LayoutSystemComponent />,
    children: [
      {
        path: "about",
        element: (
          <>
            <About />
            <PageTitleComponent title="Nomini - About (TGA 2026)" />
          </>
        ),
      },
      {
        path: "winners",
        element: (
          <>
            <Winners />
            <PageTitleComponent title="Nomini - Winners (TGA 2026)" />
          </>
        ),
      },
      {
        path: "nominees",
        element: (
          <RequireAuth>
            <>
              <Nominees />
              <PageTitleComponent title="Nomini - 2026 Nominees" />
            </>
          </RequireAuth>
        ),
      },
      {
        path: "profile",
        element: (
          <RequireAuth>
            <>
              <Profile />
              <PageTitleComponent title="Nomini - Profile" />
            </>
          </RequireAuth>
        ),
      },
      {
        path: "leaderboard",
        element: (
          <RequireAuth>
            <>
              <Leaderboard />
              <PageTitleComponent title="Nomini - Leaderboard (TGA 2026)" />
            </>
          </RequireAuth>
        ),
      },
      {
        path: "admin",
        element: (
          <RequireAuth>
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-[65vh]">
                  <div className="text-zinc-300 text-lg font-barlow uppercase tracking-widest animate-pulse">
                    Loading admin panel...
                  </div>
                </div>
              }
            >
              <LazyAdmin />
              <PageTitleComponent title="Nomini - Admin (TGA 2026)" />
            </Suspense>
          </RequireAuth>
        ),
      },

      {
        path: "404",
        element: (
          <>
            <NotFound />
            <PageTitleComponent title="Nomini - 404" />
          </>
        ),
      },
      {
        path: "*",
        element: <Navigate to={"404"} />,
      },
    ],
  },
]);

export default router;