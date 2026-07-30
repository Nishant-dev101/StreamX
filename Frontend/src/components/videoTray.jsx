

import React from 'react'
import { PALETTE } from '../utils/styles'
import VideoCard from './VideoCard'

const mockVideos = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `Sample video title ${i + 1}`,
  channel: `Channel ${i + 1}`,
  views: (i + 1) * 10000,
  duration: 60 + i * 15,
  thumbnail: `https://picsum.photos/seed/video${i + 1}/640/360`,
}))

const VideoTray = () => {
  const { ink } = PALETTE

  return (
    <section className="mt-6 w-full">
      <h2 className="mb-4 text-lg font-semibold" style={{ color: ink }}>
        Trending
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mockVideos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </section>
  )
}

export default VideoTray