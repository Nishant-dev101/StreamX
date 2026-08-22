

import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserChannelProfile } from '../services/auth.service'
import Loading from '../components/loading'
import Error from '../components/error'
import { PALETTE } from '../utils/styles'
import VideoTray from '../components/videoTray'
import { useAuth } from '../contexts/AuthContext'
import { toggleSubscription } from '../services/subscription.service'

const ChannelProfile = () => {
  const { userId } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('videos')
  const { user } = useAuth()
  const navigate = useNavigate()

  

  useEffect(() => {
        const fetchChannelProfile = async () => {
      try {
        setLoading(true)
        const response = await getUserChannelProfile(userId)

        setProfile(response.data.data)
        setError(null)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load channel profile')
        console.error('Error fetching channel profile:', err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchChannelProfile()
    }
  }, [userId])

  const handleToggleSubscription = async () => {
                
              if(!user) return
              
            setProfile( prev => ({
               ...prev,
                isSubscribed: !prev.isSubscribed,
                subscribersCount: prev.isSubscribed ?
                                    prev.subscribersCount -1 :
                                    prev.subscribersCount + 1      
            }))
    try {
         const res = await toggleSubscription(userId)
         
    } catch (error) {
       console.log(error)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error error={error} />
  if (!profile) return <Error error="Channel not found" />

  const { fullName, userName, avatar, subscribersCount, videos = [], Tweets = [] } = profile

  return (
    <main
      className="w-full min-h-screen px-4 py-8"
      style={{
        background: `radial-gradient(circle at 10% 6%, ${PALETTE.accent}22 0%, transparent 28%), linear-gradient(135deg, ${PALETTE.page} 0%, #070707 100%)`,
      }}
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Profile Header */}
        <div className="mb-8 rounded-2xl border border-white/10 p-8" style={{ backgroundColor: PALETTE.surface }}>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {/* Profile Info */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
              {/* Avatar */}
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-red-500/30 bg-gradient-to-br from-red-500/20 to-transparent flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt={fullName} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-red-500/30 to-transparent flex items-center justify-center">
                    <span className="text-4xl font-bold" style={{ color: PALETTE.accent }}>
                      {fullName?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Channel Details */}
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: PALETTE.muted }}>
                  @{userName}
                </p>
                <h1 className="text-3xl font-bold md:text-4xl" style={{ color: PALETTE.ink }}>
                  {fullName}
                </h1>
                <div className="mt-2 flex flex-wrap gap-4 text-sm" style={{ color: PALETTE.subtle }}>
                  <span>
                    <span className="font-semibold" style={{ color: PALETTE.accent }}>
                      {subscribersCount}
                    </span>{' '}
                    subscribers
                  </span>
                  <span>•</span>
                  <span>
                    <span className="font-semibold" style={{ color: PALETTE.accent }}>
                      {videos.length}
                    </span>{' '}
                    videos
                  </span>
                  <span>•</span>
                  <span>
                    <span className="font-semibold" style={{ color: PALETTE.accent }}>
                      {Tweets.length}
                    </span>{' '}
                    tweets
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
           
         
            <button
              className= 'rounded-full border px-8 py-3 font-semibold transition-all duration-200'
              style={{
                backgroundColor: profile.isSubscribed ? PALETTE.card : PALETTE.accent,
                color: 'white',
                borderColor: PALETTE.line
                
              }}
              onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.target.style.opacity = '1')}
              onClick={ () => handleToggleSubscription()}
            >
              { profile.isSubscribed ? 'Subscribed' : 'Subscribe' }
            </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-white/10">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('videos')}
              className={`pb-3 text-lg font-semibold transition-colors ${
                activeTab === 'videos'
                  ? 'border-b-2'
                  : 'border-b-2 border-transparent'
              }`}
              style={{
                color: activeTab === 'videos' ? PALETTE.accent : PALETTE.muted,
                borderBottomColor: activeTab === 'videos' ? PALETTE.accent : 'transparent',
              }}
            >
              Videos ({videos.length})
            </button>
            <button
              onClick={() => setActiveTab('tweets')}
              className={`pb-3 text-lg font-semibold transition-colors ${
                activeTab === 'tweets'
                  ? 'border-b-2'
                  : 'border-b-2 border-transparent'
              }`}
              style={{
                color: activeTab === 'tweets' ? PALETTE.accent : PALETTE.muted,
                borderBottomColor: activeTab === 'tweets' ? PALETTE.accent : 'transparent',
              }}
            >
              Tweets ({Tweets.length})
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div>
          {activeTab === 'videos' && (
            <div className="space-y-6">
              {videos.length > 0 ? (
                <div className="">
                    <VideoTray videos={videos}/>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 p-8 text-center" style={{ backgroundColor: PALETTE.surface }}>
                  <p style={{ color: PALETTE.muted }}>No videos uploaded yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tweets' && (
            <div className="space-y-4">
              {Tweets.length > 0 ? (
                <div className="space-y-4">
                  {Tweets.map((tweet) => (
                    <div
                      key={tweet._id}
                      className="rounded-2xl border border-white/10 p-4 transition-all duration-200 hover:border-red-500/30"
                      style={{ backgroundColor: PALETTE.surface }}
                    >
                      <p className="text-base leading-relaxed" style={{ color: PALETTE.ink }}>
                        {tweet.content}
                      </p>
                      <p className="mt-2 text-xs" style={{ color: PALETTE.subtle }}>
                        {new Date(tweet.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 p-8 text-center" style={{ backgroundColor: PALETTE.surface }}>
                  <p style={{ color: PALETTE.muted }}>No tweets posted yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default ChannelProfile