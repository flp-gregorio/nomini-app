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
        <PageTitleComponent title="CritPick - Home" />
      </>
    ),
  },
  {
    path: "login",
    element: (
      <>
        <Login />
        <PageTitleComponent title="CritPick - Login" />
      </>
    ),
  },
  {
    path: "register",
    element: (
      <>
        <Register />
        <PageTitleComponent title="CritPick - Register" />
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
            <PageTitleComponent title="CritPick - About" />
          </>
        ),
      },
      {
        path: "winners",
        element: (
          <>
            <Winners />
            <PageTitleComponent title="CritPick - Winners" />
          </>
        ),
      },
      {
        path: "nominees",
        element: (
          <RequireAuth>
            <>
              <Nominees />
              <PageTitleComponent title="CritPick - Nominees" />
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
              <PageTitleComponent title="CritPick - Profile" />
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
              <PageTitleComponent title="CritPick - Leaderboard" />
            </>
          </RequireAuth>
        ),
      },

      {
        path: "404",
        element: (
          <>
            <NotFound />
            <PageTitleComponent title="CritPick - 404" />
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