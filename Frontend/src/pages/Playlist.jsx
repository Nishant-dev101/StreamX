

import { useEffect, useState } from 'react'
import { Edit3, Plus, Trash2, X } from 'lucide-react'
import Loading from '../components/loading'
import Error from '../components/error'
import { createPlaylist, deletePlaylist, getUserPlaylists, updatePlaylist } from '../services/playlist.service'
import { PALETTE, TYPOGRAPHY } from '../utils/styles'
import { useNavigate } from 'react-router-dom'

const Playlist = () => {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const navigate = useNavigate()

  const loadPlaylists = async () => {
    try {
      setLoading(true)
      const response = await getUserPlaylists()
      setPlaylists(response?.data?.data ?? [])
      setError('')
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load your playlists')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlaylists()
  }, [])

  const handleCreate = async (event) => {
    event.preventDefault()
    if (!name.trim() || !description.trim()) return

    try {
      setSaving(true)
      await createPlaylist(name.trim(), description.trim())
      setName('')
      setDescription('')
      setShowCreate(false)
      await loadPlaylists()
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not create playlist')
    } finally {
      setSaving(false)
    }
  }

  const startEditing = (event, playlist) => {
    event.stopPropagation()
    setEditingId(playlist._id)
    setEditName(playlist.name)
    setEditDescription(playlist.description)
  }

  const cancelEditing = (event) => {
    event.stopPropagation()
    setEditingId(null)
  }

  const handleUpdate = async (event, playlistId) => {
    event.preventDefault()
    event.stopPropagation()
    if (!editName.trim() || !editDescription.trim()) return

    try {
      setSaving(true)
      const response = await updatePlaylist(playlistId, editName.trim(), editDescription.trim())
      const updatedPlaylist = response?.data?.data
      setPlaylists((items) => items.map((playlist) => playlist._id === playlistId ? { ...playlist, ...updatedPlaylist } : playlist))
      setEditingId(null)
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not update playlist')
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePlaylist = async (playlistId) => {
    try {
      setError('')
      await deletePlaylist(playlistId)
      setPlaylists((items) => items.filter((playlist) => playlist._id !== playlistId))
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not delete playlist')
    }
  }

  if (loading) return <Loading />
  if (error && !playlists.length) return <Error error={error} />

  return (
    <section className="mt-6 w-full" style={{ fontFamily: TYPOGRAPHY.font }}>
      <div
        className="mb-6 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-end sm:justify-between"
        style={{ background: `linear-gradient(135deg, ${PALETTE.card}, ${PALETTE.surface})`, borderColor: PALETTE.line }}
      >
        <div>
          <p className="text-sm uppercase tracking-[0.2em]" style={{ color: PALETTE.accentLight }}>Library</p>
          <h1 className="mt-1 text-2xl font-semibold" style={{ color: PALETTE.ink }}>Your playlists</h1>
          <p className="mt-2 text-sm" style={{ color: PALETTE.muted }}>Keep the videos you want close.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate((value) => !value)}
          className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: PALETTE.accent }}
        >
          {showCreate ? <X size={17} /> : <Plus size={17} />}
          {showCreate ? 'Cancel' : 'New playlist'}
        </button>
      </div>

      {error && <p className="mb-4 text-sm" style={{ color: PALETTE.error }}>{error}</p>}

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-6 rounded-2xl border p-5" style={{ backgroundColor: PALETTE.card, borderColor: PALETTE.line }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Playlist name"
              className="rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"
              style={{ color: PALETTE.ink, borderColor: PALETTE.line }}
            />
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Description"
              className="rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"
              style={{ color: PALETTE.ink, borderColor: PALETTE.line }}
            />
          </div>
          <button type="submit" disabled={saving} className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" style={{ backgroundColor: PALETTE.accent }}>
            {saving ? 'Creating...' : 'Create playlist'}
          </button>
        </form>
      )}

      {playlists.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border px-6 py-10 text-center" 
        style={{ borderColor: PALETTE.line, backgroundColor: PALETTE.card }}
        >
          <p className="text-lg font-medium" 
          style={{ color: PALETTE.ink }}>
            No playlists yet
            </p>
          <p 
          className="mt-2 text-sm" 
          style={{ color: PALETTE.muted }}>
            Create one here or save a video from the player.
            </p>
        </div>
      ) : (
        <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
          {playlists.map((playlist) => (
            <article
              key={playlist._id}
              className="w-full cursor-pointer rounded-2xl border p-5 transition-colors hover:border-white/30"
              style={{ backgroundColor: PALETTE.card, borderColor: PALETTE.line }}
              onClick={() => navigate(`/playlist/${playlist._id}`)}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold" style={{ color: PALETTE.ink }}>{playlist.name}</h2>
                  <p className="mt-1 text-sm" style={{ color: PALETTE.muted }}>{playlist.description}</p>
                  <p className="mt-2 text-xs" style={{ color: PALETTE.subtle }}>{playlist.videos?.length ?? 0} videos</p>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" 
                  onClick={(event) => startEditing(event, playlist)}
                   className="rounded-full p-2 hover:bg-white/10" 
                   style={{ color: PALETTE.accentLight }} 
                   >
                    <Edit3 size={18} />
                  </button>
                  <button type="button" 
                  onClick={(event) => { event.stopPropagation(); handleDeletePlaylist(playlist._id) }}
                  className="rounded-full p-2 hover:bg-white/10" 
                  style={{ color: PALETTE.error }} >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {editingId === playlist._id && (
                <form 
                onSubmit={(event) => handleUpdate(event, playlist._id)} 
                onClick={(event) => event.stopPropagation()} 
                className="grid gap-3 border-t pt-4 sm:grid-cols-2" 
                style={{ borderColor: PALETTE.line }}>
                 
                  <input 
                  value={editName} 
                  onChange={(event) => setEditName(event.target.value)} 
                  placeholder="Playlist name" className="rounded-lg border bg-transparent px-3 py-2 text-sm outline-none" 
                  style={{ color: PALETTE.ink, borderColor: PALETTE.line }} 
                  />
                 
                  <input
                   value={editDescription} 
                   onChange={(event) => setEditDescription(event.target.value)} 
                   placeholder="Description" className="rounded-lg border bg-transparent px-3 py-2 text-sm outline-none" 
                   style={{ color: PALETTE.ink, borderColor: PALETTE.line }} />
                  
                  <div className="flex gap-2 sm:col-span-2">
                    <button type="submit" 
                    disabled={saving} 
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" 
                    style={{ backgroundColor: PALETTE.accent }}>
                      {saving ? 'Saving...' : 'Save changes'}
                      </button>
                   
                    <button 
                    type="button" 
                    onClick={cancelEditing}
                     className="rounded-lg border px-4 py-2 text-sm" 
                     style={{ color: PALETTE.muted, borderColor: PALETTE.line }}>
                      Cancel
                      </button>
                  </div>
                </form>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Playlist