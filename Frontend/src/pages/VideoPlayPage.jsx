

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import VideoPlayer from '../components/videoPlayer'
import CommentBox from '../components/CommentBox'
import { getVideoById, getVideos } from '../services/videos.service'
import Loading from '../components/loading'
import Error from '../components/error'
import { PALETTE } from '../utils/styles'



const RecommendedVideo = ({ video }) => {
  const { thumbnail, title, owner, views, duration } = video
  const channel = owner?.[0]?.userName || 'Unknown creator'

  return (
    <div className="flex gap-3 overflow-hidden rounded-2xl border border-white/10 p-3 transition duration-200 hover:border-red-500/30" style={{ backgroundColor: PALETTE.surface }}>
      <div className="min-w-[150px] overflow-hidden rounded-xl bg-black">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="h-20 w-full object-cover" />
        ) : (
          <div className="h-20 w-full bg-[#141414]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-5" style={{ color: PALETTE.ink }}>
          {title}
        </p>
        <p className="mt-1 text-[0.78rem]" style={{ color: PALETTE.muted }}>
          {channel}
        </p>
        <p className="mt-1 text-[0.72rem]" style={{ color: PALETTE.subtle }}>
          {views ?? 0} views • {duration ? `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}` : '0:00'}
        </p>
      </div>
    </div>
  )
}

const VideoPlayPage = () => {
 

  const [recommended, setRecommended] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { id } = useParams()

  console.log(id)

 

  if (loading) return <Loading />
  if (error) return <Error error={error} />


  

  return (
    <main
      className="w-full min-h-screen px-4 py-4 sm:px-4"
      style={{
        background: `radial-gradient(circle at 10% 6%, ${PALETTE.accent}22 0%, transparent 28%), linear-gradient(135deg, ${PALETTE.page} 0%, #070707 100%)`,
      }}
    >
      <div className="mx-auto w-full max-w-[1600px] space-y-4">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-6">
            <VideoPlayer videoId={id}/>
           
            <CommentBox videoId={id} />
          </section>

          <aside className="space-y-4">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-2xl border border-white/10 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.24)]" style={{ backgroundColor: PALETTE.surface }}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold" style={{ color: PALETTE.ink }}>
                    Up next
                  </h2>
                  <span className="text-sm" style={{ color: PALETTE.muted }}>
                    {recommended.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {recommended.slice(0, 6).map((item) => (
                    <RecommendedVideo key={item._id || item.id} video={item} />
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default VideoPlayPage