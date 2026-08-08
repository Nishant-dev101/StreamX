import { createBrowserRouter } from "react-router-dom";

import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import MainLayout from "../Layouts/mainLayout";
import LikedVideosPage from "../pages/LikedVideosPage";
import Home from "../pages/Home";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Subscriptions from "../pages/subscriptions";
import UserProfile from "../pages/UserPofile";
import Playlist from "../pages/Playlist";
import VideoPlayPage from "../pages/VideoPlayPage";

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
        path: "liked-videos",
        element: <ProtectedRoute><LikedVideosPage /></ProtectedRoute>,
      },
       {
        path: "subscriptions",
        element: <ProtectedRoute><Subscriptions/></ProtectedRoute>
       },
       {
        path: "user",
        element: <ProtectedRoute><UserProfile/></ProtectedRoute>
       },
       {
        path: "playlist",
        element: <ProtectedRoute><Playlist/></ProtectedRoute>
       }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },{
    path: "/video/videoPlayer/:id",
    element: <VideoPlayPage />
  }
]);