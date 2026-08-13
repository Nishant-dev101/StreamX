

import React, { useEffect, useState } from 'react'
import { Plyr } from 'plyr-react'
import 'plyr-react/plyr.css'
import { PALETTE } from '../utils/styles'
import { getVideoById } from '../services/videos.service'
import Loading from './loading'
import Error from './error'



const formatVideoDate = (createdAt) => {
  if (!createdAt) return ''
  const date = new Date(createdAt)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}


const VideoPlayer = ({ videoId }) => {

  
  const [video, setVideo] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')


  console.log(videoId)


  useEffect(() => {
    console.log("into useEffect VideoPlayer")

    const fetchVideo = async () => {
      try {
        setLoading(true)
        const res = await getVideoById(videoId)
        console.log(res)
        setVideo(res?.data?.data)
      } catch (error) {
        console.log(error)
        const msg = error?.response?.data?.message || "something went wrong"
        setError(msg)
      } finally {
        setLoading(false)
      }
    }

    if (videoId) {
      fetchVideo()
    }
  }, [videoId])

  // const channelName = video.owner?.[0]?.userName || 'Unknown creator'

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


   
  if (loading) return <Loading />

  if (error) return   <div className="aspect-[16/9] w-full bg-black">
                                 <Error error={error}></Error>
                                    </div>

  if (!video) {
    return (
      <div className="rounded-md border border-white/10 bg-[#111111]/95 p-6 text-center text-sm text-white/80">
        Loading video data...
      </div>
    )
  }

  return (

    <div className="overflow-hidden rounded-md border border-white/10 bg-[#111111]/95 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
      <div className="aspect-[16/9] w-full bg-black">
        <Plyr
          
          source={{
            type: 'video',
            sources: [
              {
                src: video?.videoFile,
                type: 'video/mp4',
              },
            ],
          }}
          options={options}
        />
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="space-y-4">
          <h1 className="text-xl font-semibold leading-tight sm:text-2xl" style={{ color: PALETTE.ink }}>
            {video.title}
          </h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm" style={{ color: PALETTE.muted }}>
                {video.views ?? 0} views • {formatVideoDate(video.createdAt)}
              </p>
              <p className="text-sm" style={{ color: PALETTE.muted }}>
                Uploaded by Unknown user
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition duration-200"
                style={{ backgroundColor: PALETTE.accent, color: PALETTE.ink }}
              >
                Subscribe
              </button>
              <div className="flex items-center gap-2 text-sm" style={{ color: PALETTE.muted }}>
                <span className="rounded-full bg-white/10 px-3 py-2">Like</span>
                <span className="rounded-full bg-white/10 px-3 py-2">Save</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg px-3 py-2" style={{ backgroundColor: PALETTE.card }}>
          <p className="text-sm leading-7" style={{ color: PALETTE.muted }}>
            {video.description || 'No description available for this video.'}
          </p>
        </div>
      </div>
    </div>

  )
}

export default VideoPlayer