import { useEffect, useState } from 'react'
import { ArrowLeft, X } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import VideoCard from '../components/VideoCard'
import Error from '../components/error'
import Loading from '../components/loading'
import { getPlaylistById, removeVideoFromPlaylist } from '../services/playlist.service'
import { PALETTE, TYPOGRAPHY } from '../utils/styles'

const PlaylistDetail = () => {
  const { playlistId } = useParams()
  const navigate = useNavigate()
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await getPlaylistById(playlistId)
        setPlaylist(response?.data?.data)
      } catch (err) {
        setError(err?.response?.data?.message || 'Could not load this playlist')
      } finally {
        setLoading(false)
      }
    }

    loadPlaylist()
  }, [playlistId])

  const handleRemoveVideo = async (videoId) => {
    try {
      await removeVideoFromPlaylist(playlistId, videoId)
      setPlaylist((current) => ({
        ...current,
        videos: current.videos.filter((video) => video._id !== videoId),
      }))
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not remove video')
    }
  }

  if (loading) return <Loading />
  if (error || !playlist) return <Error error={error || 'Playlist not found'} />

  return (
    <section className="mt-6 w-full" style={{ fontFamily: TYPOGRAPHY.font }}>
      <button type="button" onClick={() => navigate('/playlist')} className="mb-5 inline-flex items-center gap-2 text-sm" style={{ color: PALETTE.accentLight }}>
        <ArrowLeft size={17} />
        Back to playlists
      </button>

      <header className="mb-6 rounded-2xl border p-5" style={{ background: `linear-gradient(135deg, ${PALETTE.card}, ${PALETTE.surface})`, borderColor: PALETTE.line }}>
        <p className="text-sm uppercase tracking-[0.2em]" style={{ color: PALETTE.accentLight }}>Playlist</p>
        <h1 className="mt-1 text-2xl font-semibold" style={{ color: PALETTE.ink }}>{playlist.name}</h1>
        <p className="mt-2 text-sm" style={{ color: PALETTE.muted }}>{playlist.description}</p>
        <p className="mt-2 text-xs" style={{ color: PALETTE.subtle }}>{playlist.videos?.length ?? 0} videos</p>
      </header>

      {error && <p className="mb-4 text-sm" style={{ color: PALETTE.error }}>{error}</p>}

      {playlist.videos?.length ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {playlist.videos.map((video) => {
            return (
              <div key={video._id} className="relative">
                <VideoCard video={video} />
                <button type="button" onClick={() => handleRemoveVideo(video._id)} className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white hover:bg-red-500" aria-label={`Remove ${video.title} from ${playlist.name}`}>
                  <X size={16} />
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed p-10 text-center text-sm" style={{ color: PALETTE.muted, borderColor: PALETTE.line }}>This playlist is empty.</p>
      )}
    </section>
  )
}

export default PlaylistDetail
