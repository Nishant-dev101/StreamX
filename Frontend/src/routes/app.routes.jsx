import { createBrowserRouter } from "react-router-dom";

import { Login } from "../pages/Login"
import { Register } from "../pages/Register"
import MainLayout from "../Layouts/mainLayout"
import LikedVideosPage from "../pages/LikedVideosPage"
import Home from "../pages/Home"
import { ProtectedRoute } from "../components/ProtectedRoute"
import UserPage from "../pages/UserPage"
import Playlist from "../pages/Playlist"
import VideoPlayPage from "../pages/VideoPlayPage"
import Subscriptions from "../pages/Subscriptions"
import ChannelProfile from "../pages/ChannelProfile";

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
        element: <ProtectedRoute><UserPage/></ProtectedRoute>
       },
       {
        path: "playlist",
        element: <ProtectedRoute><Playlist/></ProtectedRoute>
       },
       {
        path: "channelProfile/:userId",
        element: <ChannelProfile/>
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
    path: "/video/videoPlayerPage/:id",
    element: <VideoPlayPage />
  }
]);