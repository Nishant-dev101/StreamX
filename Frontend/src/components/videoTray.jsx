

import React from 'react'
import { PALETTE } from '../utils/styles'
import VideoCard from './VideoCard'



const VideoTray = ({ videos }) => {
  const { ink } = PALETTE

  return (
 
      

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:grid-cols-3">
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    
  )
}

export default VideoTray