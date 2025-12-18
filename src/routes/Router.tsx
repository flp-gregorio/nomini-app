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
import Admin from "../pages/Admin";
import RequireAuth from "../components/RequireAuth.tsx";
import LayoutSystemComponent from "../components/Layouts/LayoutSystemComponent";

const router = createBrowserRouter([
  // GROUP 1: Standalone Pages
  {
    path: "/",
    element: (
      <>
        <Home />
        <PageTitleComponent title="Nomini - Home" />
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
  {
    path: "admin",
    element: (
      <>
        <Admin />
        <PageTitleComponent title="Nomini - Admin" />
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
            <PageTitleComponent title="Nomini - About" />
          </>
        ),
      },
      {
        path: "winners",
        element: (
          <>
            <Winners />
            <PageTitleComponent title="Nomini - Winners" />
          </>
        ),
      },
      {
        path: "nominees",
        element: (
          <RequireAuth>
            <>
              <Nominees />
              <PageTitleComponent title="Nomini - Nominees" />
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
              <PageTitleComponent title="Nomini - Leaderboard" />
            </>
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