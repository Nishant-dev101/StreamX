

import { useEffect, useState } from 'react'
import { useRef } from 'react'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'
import { PALETTE } from '../utils/styles'
import { getVideoById, updateVideoView } from '../services/videos.service'
import Loading from './loading'
import Error from './error'
import { useNavigate } from 'react-router-dom'
import { getUserChannelProfile } from '../services/auth.service'
import { toggleSubscription } from '../services/subscription.service'
import { getVideoLikes, toggleLike } from '../services/like.service'
import { Bookmark, Check, ThumbsUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { addVideoToPlaylist, getUserPlaylists } from '../services/playlist.service'
import Hls from "hls.js";



const formatVideoDate = (createdAt) => {
  if (!createdAt) return ''
  const date = new Date(createdAt)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const playerOptions = {
  controls: [
    'play-large',
    'restart',
    'rewind',
    'play',
    'fast-forward',
    'progress',
    'current-time',
    'duration',
    'mute',
    'volume',
    'captions',
    'settings',
    'pip',
    'airplay',
    'fullscreen',
  ],
  keyboard: {
    focused: true,
    global: true,
  },
  clickToPlay: true,
  seekTime: 10,
  settings: ['captions', 'quality', 'speed'],
  tooltips: {
    controls: true,
    seek: true,
  },
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

 const videoElRef = useRef(null);
 const plyrRef = useRef(null);
 const countViewRef = useRef(false)

useEffect(() => {
  const media = videoElRef.current;
  if (!media || !video?.videoFileHLS) return;

  media.crossOrigin = 'anonymous';
  let hls;
  let destroyed = false;

  const updateQuality = (newQuality) => {
    if (newQuality === 0) {
      hls.currentLevel = -1; 
    } else {
      hls.levels.forEach((level, i) => {
        if (level.height === newQuality) hls.currentLevel = i;
      });
    }
  };

  const createPlyr = (qualityOptions) => {
    if (destroyed) return;
    plyrRef.current = new Plyr(media, {
      ...playerOptions,
      controls: [
        'play-large', 'play', 'progress', 'current-time',
        'mute', 'volume', 'captions', 'settings',
        'pip', 'airplay', 'fullscreen',
      ],
      settings: qualityOptions ? ['quality', 'speed'] : ['speed'],
      ...(qualityOptions && {
        quality: {
          default: 0, 
          options: qualityOptions,
          forced: true,
          onChange: updateQuality,
        },
        i18n: { qualityLabel: { 0: 'Auto' } },
      }),
    });
  };

  if (Hls.isSupported()) {
    hls = new Hls();
    hls.loadSource(video.videoFileHLS);
    hls.attachMedia(media);

    hls.on(Hls.Events.MANIFEST_PARSED, (_e, data) => {
      const heights = [...new Set(data.levels.map(l => l.height))].sort((a, b) => b - a);
      createPlyr([0, ...heights]); // [Auto, 1080, 720, 480, ...]
      media.play(); 
    });

    
    hls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => {
      if (!plyrRef.current) return;
      const height = hls.levels[data.level]?.height;
      if (height) plyrRef.current.quality = height;
    });

    hls.on(Hls.Events.ERROR, (_e, data) => {
      if (!data.fatal) return;
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          hls.startLoad();
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          hls.recoverMediaError();
          break;
        default:
          hls.destroy();
      }
    });
  } else if (media.canPlayType('application/vnd.apple.mpegurl')) {
    
    media.src = video.videoFileHLS;
    createPlyr(null);
  }

  return () => {
    destroyed = true;
    plyrRef.current?.destroy();
    hls?.destroy();
    media.removeAttribute('src');
    media.load();
  };
}, [video?.videoFileHLS]);

   // handle increase Views
    const handleViewsUpdate = ()=> {
      console.log("into updateviews")
           const videoPlayer = videoElRef.current
            if(!videoPlayer || countViewRef.current == true) return;
            console.log("after check")

             if(videoPlayer.currentTime > 10 ){
               countViewRef.current = true;
               setVideo((prev) => ({...prev, views: prev.views + 1}))
               updateVideoView(video._id)
             } 
    }

  // fetchVideo by Id
  useEffect(() => {
    console.log("into useEffect VideoPlayer")

    const fetchVideo = async () => {
      try {
        setLoading(true)
        setProfileLoading(true)
        setProfile(null)
        const res = await getVideoById(videoId)
        console.log(res)
        const nextVideo = res?.data?.data

        if (nextVideo?.owner?._id) {
          const profileResponse = await getUserChannelProfile(nextVideo.owner._id)
          setVideo(nextVideo)
          setProfile(profileResponse?.data?.data)
        } else {
          setVideo(nextVideo)
        }
      } catch (error) {
        console.log(error)
        const msg = error?.response?.data?.message || "something went wrong"
        setError(msg)
      } finally {
        setLoading(false)
        setProfileLoading(false)
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
      await toggleSubscription(profile?._id)

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
      <div className="w-full bg-black">
        <div className="relative h-[75vh] w-full bg-black">
          <video
            ref={videoElRef}
            onTimeUpdate={handleViewsUpdate}
            className="h-full w-full object-contain"
            playsInline
          />
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="space-y-4">
          <h1
            className="text-xl font-semibold leading-tight sm:text-2xl"
            style={{ color: PALETTE.ink }}
          >
            {video.title}
          </h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-4">
              <p className="text-sm" style={{ color: PALETTE.muted }}>
                {video.views ?? 0} views • {formatVideoDate(video.createdAt)}
              </p>
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate(`/channelProfile/${video.owner._id}`)}
              >
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full"
                  style={{ backgroundColor: PALETTE.accent }}
                >
                  {video.owner?.avatar ? (
                    <img
                      src={video.owner.avatar}
                      alt={video.owner.userName || "Channel"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      className="text-sm font-semibold"
                      style={{ color: PALETTE.ink }}
                    >
                      {video.owner[0]?.userName?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: PALETTE.ink }}
                  >
                    {video.owner?.userName || "Unknown Channel"}
                  </p>
                  {/* <p className="text-xs" style={{ color: PALETTE.muted }}>
                    @{video?.owner?.userName || "unknown"}
                  </p> */}
                  <p className="text-xs" style={{ color: PALETTE.muted }}>
                    {profile?.subscribersCount ?? 0} subscribers
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition duration-200"
                style={{
                  backgroundColor: profile?.isSubscribed
                    ? PALETTE.card
                    : PALETTE.accent,
                  color: "white",
                  borderColor: PALETTE.line,
                }}
                disabled={!user || profileLoading}
                onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
                onClick={() => handleToggleSubscription()}
              >
                {profileLoading
                  ? "Loading..."
                  : profile?.isSubscribed
                    ? "Subscribed"
                    : "Subscribe"}
              </button>
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: PALETTE.muted }}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!user || likesLoading}
                  onClick={handleToggleLike}
                >
                  <ThumbsUp
                    size={21}
                    className={
                      liked ? "fill-orange-400 text-orange-400" : "text-white"
                    }
                  />
                  <span>{likesLoading ? "..." : likesCount}</span>
                </button>

                <div className="relative">
                  <button
                    type="button"
                    disabled={!user || saveLoading}
                    onClick={handleSaveClick}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Bookmark size={18} />
                    <span>{saveLoading ? "Saving..." : "Save"}</span>
                  </button>

                  {saveOpen && (
                    <div
                      className="absolute right-0 top-12 z-20 min-w-56 max-w-[calc(100vw-2rem)] rounded-xl border p-2 shadow-xl"
                      style={{
                        backgroundColor: PALETTE.surface,
                        borderColor: PALETTE.line,
                      }}
                    >
                      <p
                        className="px-3 py-2 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: PALETTE.muted }}
                      >
                        Save to playlist
                      </p>
                      <div className="max-h-64 overflow-y-auto">
                        {playlists.length ? (
                          playlists.map((playlist) => (
                            <button
                              key={playlist._id}
                              type="button"
                              onClick={() => handleSaveToPlaylist(playlist._id)}
                              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                              style={{ color: PALETTE.ink }}
                            >
                              <span className="truncate pr-3">
                                {playlist.name}
                              </span>
                              {savedPlaylist === playlist._id && (
                                <Check
                                  size={16}
                                  className="flex-shrink-0"
                                  style={{ color: PALETTE.success }}
                                />
                              )}
                            </button>
                          ))
                        ) : (
                          <p
                            className="px-3 py-2 text-sm"
                            style={{ color: PALETTE.muted }}
                          >
                            Create a playlist first.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="rounded-lg px-3 py-2"
          style={{ backgroundColor: PALETTE.card }}
        >
          <p className="text-sm leading-7" style={{ color: PALETTE.muted }}>
            {video.description || "No description available for this video."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer