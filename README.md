# StreamX

A full-stack video streaming platform built with the MERN stack, featuring adaptive video streaming using HLS.

## Features

- User authentication with JWT access & refresh tokens
- Upload and manage videos
- Adaptive video streaming with HLS
- Multiple video quality options (360p, 720p, 1080p)
- Like, comment and subscribe functionality
- View count tracking
- Channel profiles and subscriptions
- Personalized dashboard with video statistics
- Responsive video player UI

## Tech Stack

Frontend: React, Tailwind CSS, HLS.js, Plyr  
Backend:Node.js, Express.js, MongoDB, Mongoose  
Authentication: JWT, Cookies  
Video Processing: FFmpeg  
Media Storage: Cloudinary

## HLS Streaming

Videos are processed with FFmpeg into multiple quality levels and served using HLS.


Video Upload
     ->
   FFmpeg
     ->
360p | 720p | 1080p
     ->
HLS Playlists & Segments
     ->
HLS.js / Video Player

 ScreenShots: 
 
  Adaptive streaming playback
  
 <img width="1902" height="918" alt="Screenshot 2026-09-09 223300" src="https://github.com/user-attachments/assets/77c1da25-d59f-4b15-afff-b7b03dd669e1" />

 Channel Profile:
 
<img width="1890" height="921" alt="Screenshot 2026-09-11 212726" src="https://github.com/user-attachments/assets/50c4fd20-0058-4107-bd5e-f204cebe4889" />

 Home Page:
 
<img width="1912" height="905" alt="Screenshot 2026-09-11 211600" src="https://github.com/user-attachments/assets/eb052e95-916d-4663-b7f6-bc03006450e6" />

 Manage Videos:
 
<img width="1883" height="911" alt="Screenshot 2026-09-11 211742" src="https://github.com/user-attachments/assets/5c803cdc-dad6-4c0e-8c91-f90857d8eed3" />

