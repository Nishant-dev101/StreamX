

import React, { useEffect, useState } from 'react'
import { Plyr } from 'plyr-react'
import 'plyr-react/plyr.css'
import { PALETTE } from '../utils/styles'
import { getVideoById } from '../services/videos.service'
import Loading from './loading'
import Error from './error'
import { useNavigate } from 'react-router-dom'
import { getUserChannelProfile } from '../services/auth.service'
import { toggleSubscription } from '../services/subscription.service'
import { getVideoLikes, toggleLike } from '../services/like.service'
import { Bookmark, Check, ThumbsUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { addVideoToPlaylist, getUserPlaylists } from '../services/playlist.service'



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

   const navigate = useNavigate()
  const [video, setVideo] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [likesLoading, setLikesLoading] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [saveLoading, setSaveLoading] = useState(false)
  const [savedPlaylist, setSavedPlaylist] = useState('')
  const { user } = useAuth()


  console.log(videoId)

  // fetchVideo by Id
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

  useEffect(() => {
    const fetchVideoLikes = async () => {
      try {
        setLikesLoading(true)
        const response = await getVideoLikes(videoId)
        const likes = response?.data?.data

        setLikesCount(likes?.likesCount ?? 0)
        setLiked(Boolean(likes?.isLiked))
      } catch (error) {
        console.error('Error fetching video likes:', error)
        setLikesCount(0)
        setLiked(false)
      } finally {
        setLikesLoading(false)
      }
    }

    if (videoId) {
      fetchVideoLikes()
    }
  }, [videoId])

  // fetch channelProfile
  useEffect(() => {

    const fetchChannelProfile = async () => {
      try {
        setProfileLoading(true)
        console.log("into the fetchUserProfile", video.owner._id)
        const response = await getUserChannelProfile(video?.owner?._id)
        console.log(response)
        setProfile(response.data.data)
        setError(null)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load channel profile')
        console.error('Error fetching channel profile:', err)
      } finally {
        setProfileLoading(false)
      }
    }

    if (video?.owner?._id) {
      fetchChannelProfile()
    }


  }, [video?.owner?._id])



  // const channelName = video.owner?.[0]?.userName || 'Unknown creator'

  const handleToggleSubscription = async () => {
    console.log("prifile at toggleSub", profile)
    setProfile(prev => ({
      ...prev,
      isSubscribed: !prev.isSubscribed,
      subscribersCount: prev.isSubscribed ?
        prev.subscribersCount - 1 :
        prev.subscribersCount + 1
    }))
    try {
      const res = await toggleSubscription(profile?._id)

    } catch (error) {
      console.log(error)
    }
  }

  const handleToggleLike = async () => {
    if (!user || likesLoading) return

    setLikesLoading(true)

    try {
      await toggleLike(videoId)
      const response = await getVideoLikes(videoId)
      const likes = response?.data?.data

      setLikesCount(likes?.likesCount ?? 0)
      setLiked(likes?.isLiked ?? false)
    } catch (error) {
      console.error('Error toggling video like:', error)
    } finally {
      setLikesLoading(false)
    }
  }

  const handleSaveClick = async () => {
    if (!user || saveLoading) return

    if (saveOpen) {
      setSaveOpen(false)
      return
    }

    try {
      setSaveLoading(true)
      const response = await getUserPlaylists()
      setPlaylists(response?.data?.data ?? [])
      setSaveOpen(true)
    } catch (error) {
      console.error('Error loading playlists:', error)
    } finally {
      setSaveLoading(false)
    }
  }

  const handleSaveToPlaylist = async (playlistId) => {
    try {
      setSaveLoading(true)
      await addVideoToPlaylist(playlistId, videoId)
      setSavedPlaylist(playlistId)
      setTimeout(()=> setSaveOpen(false),500)
    } catch (error) {
      console.error('Error saving video to playlist:', error)
    } finally {
      setSaveLoading(false)
    }
  }

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

  if (error) return <div className="aspect-[16/9] w-full bg-black">
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

    <div className="relative overflow-visible rounded-md border border-white/10 bg-[#111111]/95 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
      <div className="overflow-hidden rounded-t-md">
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
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="space-y-4">
          <h1 className="text-xl font-semibold leading-tight sm:text-2xl" style={{ color: PALETTE.ink }}>
            {video.title}
          </h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-4">
              <p className="text-sm" style={{ color: PALETTE.muted }}>
                {video.views ?? 0} views • {formatVideoDate(video.createdAt)}
              </p>
              <div className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate(`/channelProfile/${video.owner._id}`)}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: PALETTE.accent }}

                >
                  {video.owner?.avatar ? (
                    <img
                      src={video.owner.avatar}
                      alt={video.owner.userName || 'Channel'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold" style={{ color: PALETTE.ink }}>
                      {video.owner[0]?.userName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold" style={{ color: PALETTE.ink }}>
                    {video.owner?.userName || 'Unknown Channel'}
                  </p>
                  <p className="text-xs" style={{ color: PALETTE.muted }}>
                    @{video?.owner?.userName || 'unknown'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition duration-200"
                style={{
                  backgroundColor: profile?.isSubscribed ? PALETTE.card : PALETTE.accent,
                  color: 'white',
                  borderColor: PALETTE.line
                }}
                disabled={!user || profileLoading}
                onMouseEnter={(e) => (e.target.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.target.style.opacity = '1')}
                onClick={() => handleToggleSubscription()}
              >
                {profileLoading ? 'Loading...' : profile?.isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
              <div className="flex items-center gap-2 text-sm" style={{ color: PALETTE.muted }}>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!user || likesLoading}
                  onClick={handleToggleLike}
                >
                  <ThumbsUp size={21} className={liked ? 'fill-orange-400 text-orange-400' : 'text-white'} />
                  <span>{likesLoading ? '...' : likesCount}</span>
                </button>
               
                <div className="relative">
                  <button
                    type="button"
                    disabled={!user || saveLoading}
                    onClick={handleSaveClick}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Bookmark size={18} />
                    <span>{saveLoading ? 'Saving...' : 'Save'}</span>
                  </button>

                  {saveOpen && (
                    <div className="absolute right-0 top-12 z-20 min-w-56 max-w-[calc(100vw-2rem)] rounded-xl border p-2 shadow-xl" style={{ backgroundColor: PALETTE.surface, borderColor: PALETTE.line }}>
                      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: PALETTE.muted }}>Save to playlist</p>
                      <div className="max-h-64 overflow-y-auto">
                        {playlists.length ? playlists.map((playlist) => (
                          <button
                            key={playlist._id}
                            type="button"
                            onClick={() => handleSaveToPlaylist(playlist._id)}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                            style={{ color: PALETTE.ink }}
                          >
                            <span className="truncate pr-3">{playlist.name}</span>
                            {savedPlaylist === playlist._id && <Check size={16} className="flex-shrink-0" style={{ color: PALETTE.success }} />}
                          </button>
                        )) : (
                          <p className="px-3 py-2 text-sm" style={{ color: PALETTE.muted }}>Create a playlist first.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
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