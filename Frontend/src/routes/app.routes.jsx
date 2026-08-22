import { createBrowserRouter } from "react-router-dom";

import { Login } from "../pages/Login"
import { Register } from "../pages/Register"
import MainLayout from "../Layouts/mainLayout"
import LikedVideosPage from "../pages/LikedVideosPage"
import Home from "../pages/Home"
import { ProtectedRoute } from "../components/ProtectedRoute"
import UserPage from "../pages/UserPage"
import Playlist from "../pages/Playlist"
import PlaylistDetail from "../pages/PlaylistDetail"
import VideoPlayPage from "../pages/VideoPlayPage"
import Subscriptions from "../pages/Subscriptions"
import ChannelProfile from "../pages/ChannelProfile";
import UpdateUserProfile from "../pages/updateUserProfile";
import UpdateVideos from "../pages/updateVideos";
import UpdateVideoDetails from "../pages/updateVideoDetails";
import SearchedVideos from "../pages/SearchedVideos";
import UpdateTweets from "../pages/UpdateTweets";

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
       path: "update-profile",
       element: <ProtectedRoute><UpdateUserProfile/></ProtectedRoute>
      },
      {
       path: "update-videos",
       element: <ProtectedRoute><UpdateVideos/></ProtectedRoute>
      },
      {
       path: "update-tweets",
       element: <ProtectedRoute><UpdateTweets/></ProtectedRoute>
      },
      {
       path: "update-details/:videoId",
       element: <ProtectedRoute><UpdateVideoDetails/></ProtectedRoute>
      },
       {
        path: "playlist",
        element: <ProtectedRoute><Playlist/></ProtectedRoute>
       },
      {
       path: "playlist/:playlistId",
       element: <ProtectedRoute><PlaylistDetail/></ProtectedRoute>
      },
       {
        path: "channelProfile/:userId",
        element: <ChannelProfile/>
        },
        {
         path: "search",
         element: <SearchedVideos/>
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