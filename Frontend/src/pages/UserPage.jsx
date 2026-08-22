import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PALETTE, TYPOGRAPHY } from '../utils/styles'
import { getUserVideos } from '../services/videos.service'
import { getUserTweets } from '../services/tweet.service'
import Loading from '../components/loading'
import Error from '../components/error'
import VideoTray from '../components/videoTray'
import Tweets from '../components/Tweets'

const UserPage = () => {
  const { user } = useAuth()
  const [videos, setVideos] = useState([])
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ activeTab , setActiveTab ] = useState('videos')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserContent = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch user videos
        if (user?._id) {
          const videoRes = await getUserVideos(user._id)
          console.log(videoRes)
          setVideos(videoRes?.data?.data || [])

          // Fetch user tweets
          const tweetsRes = await getUserTweets()
          console.log(tweetsRes)
          setTweets(tweetsRes?.data?.data || [])
        }
      } catch (err) {
        console.error(err)
        setError('something went wrong while fetching user content.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserContent()
  }, [user?._id])


  if (loading) return <Loading/>

  if(error) return <Error error = {error} />
  
  

  return (
    <div
      className=" mt-4"
      style={{
        backgroundColor: PALETTE.page,
        minHeight: "100vh",
        color: PALETTE.ink,
      }}
    >
      {/* Profile Header */}
      <div
        className="border-b border-white/10 pb-8"
        style={{ backgroundColor: PALETTE.card }}
      >
        <div className="max-w-7xl mx-auto px-6 pt-8">
          <div className="flex gap-6 items-start">
            {/* Avatar */}
            <div className="flex-shrink">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.userName}
                  className="h-32 w-32 rounded-full object-cover"
                />
              ) : (
                <div
                  className="h-32 w-32 rounded-full flex items-center justify-center text-4xl font-bold text-white"
                  style={{ backgroundColor: PALETTE.accent }}
                >
                  {user?.userName?.[0]?.toUpperCase()}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 pt-4">
              <h1
                className="text-4xl font-bold mb-2"
                style={{ color: PALETTE.ink }}
              >
                {user?.userName}
              </h1>
              <p className="text-lg" style={{ color: PALETTE.muted }}>
                @{user?.userName}
              </p>
              <div className="mt-4 flex gap-8">
                <div>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: PALETTE.accent }}
                  >
                    {videos.length}
                  </p>
                  <p className="text-sm" style={{ color: PALETTE.muted }}>
                    Videos
                  </p>
                </div>
                <div>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: PALETTE.accent }}
                  >
                    {tweets.length}
                  </p>
                  <p className="text-sm" style={{ color: PALETTE.muted }}>
                    Tweets
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto flex gap-2 flex-col">
              <button
                type="button"
                onClick={() => navigate("/update-profile")}
                className="w-full rounded-xl border px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/10 sm:w-auto"
                style={{ borderColor: PALETTE.line, color: PALETTE.ink }}
                onMouseEnter={(event) =>
                  (event.currentTarget.style.borderColor = PALETTE.accent)
                }
                onMouseLeave={(event) =>
                  (event.currentTarget.style.borderColor = PALETTE.line)
                }
              >
                Update Profile
              </button>
              <button
                type="button"
                onClick={() => navigate("/update-videos")}
                className="w-full rounded-xl border px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/10 sm:w-auto"
                style={{ borderColor: PALETTE.line, color: PALETTE.ink }}
                onMouseEnter={(event) =>
                  (event.currentTarget.style.borderColor = PALETTE.accent)
                }
                onMouseLeave={(event) =>
                  (event.currentTarget.style.borderColor = PALETTE.line)
                }
              >
                Update Videos
              </button>
              
                <button
                type="button"
                onClick={() => navigate("/update-tweets")}
                className="w-full rounded-xl border px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/10 sm:w-auto"
                style={{ borderColor: PALETTE.line, color: PALETTE.ink }}
                onMouseEnter={(event) =>
                  (event.currentTarget.style.borderColor = PALETTE.accent)
                }
                onMouseLeave={(event) =>
                  (event.currentTarget.style.borderColor = PALETTE.line)
                }
              >
                Update Videos
              </button>
             
              
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-8 flex-start my-4 mx-8 p-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab("videos")}
          className={activeTab == "videos" && "border-b-2 border-accent"}
        >
          Videos
        </button>
        <button
          onClick={() => setActiveTab("tweets")}
          className={activeTab == "tweets" && "border-b-2 border-accent"}
        >
          Tweets
        </button>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Videos Section */}
        <div className="mb-12">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: PALETTE.ink, fontFamily: TYPOGRAPHY.font }}
          >
            {activeTab == "videos" && "Videos"}
            {activeTab == "tweets" && "Tweets"}
          </h2>
          {activeTab == "videos" && <VideoTray videos={videos} />}
          {activeTab == "tweets" && <Tweets tweets={tweets} />}
        </div>
      </div>

      {error && (
        <div className="fixed bottom-6 right-6 bg-red-500 text-white px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}

export default UserPage
