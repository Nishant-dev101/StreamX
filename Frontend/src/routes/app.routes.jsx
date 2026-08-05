import { createBrowserRouter } from "react-router-dom";

import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import MainLayout from "../Layouts/mainLayout";
import LikedVideosPage from "../pages/LikedVideosPage";
import VideoTray from "../components/videoTray";
import Home from "../pages/Home";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home/>,
      },
      {
        path: "likedVideos",
        element: <ProtectedRoute><LikedVideosPage /></ProtectedRoute>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);