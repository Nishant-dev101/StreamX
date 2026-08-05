import React, { useState } from 'react'
import { PALETTE, TYPOGRAPHY } from '../utils/styles'




function formatDuration(duration) {
  const totalSeconds = Math.floor(duration);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function FormatPublishedDate(createdAt) {
  console.log(createdAt)
  const created = new Date(createdAt);
  const now = new Date();
  const diffInDays = Math.floor(
    (now - created)  / (1000 * 60 * 60 * 24)
  );
  const rtf = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  return rtf.format(-diffInDays, "day")

}




const VideoCard = ({ video }) => {
  const { thumbnail, title, owner, views, duration } = video
  const { card, ink, muted, active, railText, accent } = PALETTE
  const [isHovered, setIsHovered] = useState(false)

  
 
 

  return (
    <article className="group p-3 rounded-md cursor-pointer"  style={{ backgroundColor: isHovered ? card : 'transparent' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
        <div
        className="relative overflow-hidden rounded-md transition-colors duration-200"
       
         >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-65 object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="h-65 w-full" style={{ backgroundColor: active }} />
        )}

        <span
          className="absolute right-2 bottom-2 rounded-sm bg-black/60 px-2 py-0.5 text-[0.65rem]"
          style={{ color: railText }}
        >
          {formatDuration(duration)}
        </span>
      </div>

      <div className="mt-2 flex gap-3">
        <div
          className="h-9 w-9 flex-shrink-0 rounded-full"
          style={{ backgroundColor: accent }}
        />

        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: ink, fontFamily: TYPOGRAPHY.font }}>
            {title}
          </p>
          <p className="text-xs" style={{ color: muted }}>
            {owner[0].userName}
           </p>
          <p className="text-xs" style={{ color: muted }}>
            {views} views • {FormatPublishedDate(video.createdAt)}
           </p>
        </div>
      </div>
    </article>
  )
}

export default VideoCard


