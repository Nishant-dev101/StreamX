import React, { useEffect, useState } from 'react'
import VideoTray from '../components/videoTray'
import Loading from '../components/loading'
import Error from '../components/error'
import { getLikedVideos } from '../services/videos.service'
import { PALETTE, TYPOGRAPHY } from '../utils/styles'
import { useAuth } from '../contexts/AuthContext'

const LikedVideosPage = () => {
  const [videos, setVideos] = useState([])
  const [videoCount, setVideoCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()



  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        setLoading(true)
        const res = await getLikedVideos()
        console.log(res.data.data)
        setVideos(res?.data?.data ?? [])
        setVideoCount(res?.data?.data?.length)

      } catch (err) {
        console.error(err)
        const message = err?.response?.data?.message || 'An error occurred while fetching liked videos.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchLikedVideos()
  }, [])
  


  if (loading) return <Loading />
  if (error) return <Error error={error} />
  console.log(videos)
 



  return (
    <section className="mt-6 w-full">
      <div
        className="mb-6 rounded-2xl border p-5 shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${PALETTE.card} 0%, ${PALETTE.surface} 100%)`,
          borderColor: PALETTE.line,
          color: PALETTE.ink,
          fontFamily: TYPOGRAPHY.font,
        }}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em]" style={{ color: PALETTE.accentLight }}>
              Library
            </p>
            <h2 className="mt-1 text-2xl font-semibold" style={{ color: PALETTE.ink }}>
              Liked videos
            </h2>
            <p className="mt-2 text-sm" style={{ color: PALETTE.muted }}>
              Your saved favorites, all in one place.
            </p>
          </div>

          <div
            className="inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-medium"
            style={{ backgroundColor: `${PALETTE.accent}22`, color: PALETTE.railText }}
          >
            {videoCount} {videoCount === 1 ? 'video' : 'videos'}
          </div>
        </div>
      </div>

      {videos.length > 0 ? (
        <VideoTray key= {videos._id} videos={videos} />
      ) : (
        <div
          className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border px-6 py-10 text-center"
          style={{ borderColor: PALETTE.line, backgroundColor: PALETTE.card }}
        >
          <p className="text-lg font-medium" style={{ color: PALETTE.ink }}>
            No liked videos yet
          </p>
          <p className="mt-2 max-w-md text-sm" style={{ color: PALETTE.muted }}>
            Start exploring and tap the heart on videos you want to revisit later.
          </p>
        </div>
      )}
    </section>
  )
}

export default LikedVideosPage