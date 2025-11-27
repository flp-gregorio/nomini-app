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

const router = createBrowserRouter([
  // GROUP 1: Standalone Pages
  {
    path: "/",
    element: (
      <>
        <Home />
        <PageTitleComponent title="Home" />
      </>
    ),
  },
  {
    path: "login",
    element: (
      <>
        <Login />
        <PageTitleComponent title="Login" />
      </>
    ),
  },
  {
    path: "register",
    element: (
      <>
        <Register />
        <PageTitleComponent title="Register" />
      </>
    ),
  },

  // GROUP 2: Layout Pages (Header + Footer + Content)
  {
    element: <LayoutSystemComponent />, // Wraps all children below
    children: [
      {
        path: "about",
        element: (
          <>
            <About />
            <PageTitleComponent title="About" />
          </>
        ),
      },
      {
        path: "winners",
        element: (
          <>
            <Winners />
            <PageTitleComponent title="Winners" />
          </>
        ),
      },
      {
        path: "nominees",
        element: (
          <RequireAuth>
            <>
              <Nominees />
              <PageTitleComponent title="Nominees" />
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
              <PageTitleComponent title="Profile" />
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
              <PageTitleComponent title="Leaderboard" />
            </>
          </RequireAuth>
        ),
      },

      {
        path: "404",
        element: (
          <>
            <NotFound />
            <PageTitleComponent title="404" />
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