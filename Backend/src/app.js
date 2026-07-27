import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


 app.use(
   cors({
     origin: process.env.FRONTEND_URL || "http://localhost:5173",
     credentials: true,
   }),
 );

app.on("error", (error) => {
  console.error("error", error);
  throw error;
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Ensure extended parsing for nested objects
app.use(express.static("public"));
app.use(cookieParser());

// Routes

import userRoutes from './routes/user.Routes.js';
console.log("video Routes");

import videoRoutes from './routes/video.Routes.js';
import playlistRoutes from './routes/playlist.Routes.js';
import commentRoutes from './routes/comment.Routes.js'
import likeRoutes from './routes/like.Routes.js'
import tweetRoutes from './routes/tweet.Routes.js'
import subscriptionsRoutes from './routes/subscriptions.Routes.js'
import dashboardRoutes from './routes/dashboard.Routes.js'

app.use(userRoutes)
app.use(videoRoutes)
app.use(playlistRoutes)
app.use(commentRoutes)
app.use(likeRoutes)
app.use(tweetRoutes)
app.use(subscriptionsRoutes)
app.use(dashboardRoutes)

export default app;
