

import React from 'react'
import { Plyr } from 'plyr-react'
import 'plyr-react/plyr.css'
import { PALETTE } from '../utils/styles'

const VideoPlayer = ({ video }) => {
  const options = {
    controls: [
      'play-large',
      'play',
      'progress',
      'current-time',
      'mute',
      'volume',
      'settings',
      'fullscreen',
    ],
    settings: ['quality', 'speed'],
  }

  if (!video?.videoFile) {
    return (
      <div className="flex h-full min-h-[240px] items-center justify-center rounded-2xl bg-black/70 text-center px-4 py-10 sm:min-h-[320px]">
        <p style={{ color: PALETTE.muted }}>Loading video player...</p>
      </div>
    )
  }

  return (
    <Plyr
      source={{
        type: 'video',
        sources: [
          {
            src: video.videoFile,
            type: 'video/mp4',
          },
        ],
      }}
      options={options}
    />
  )
}

export default VideoPlayer