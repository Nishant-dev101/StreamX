
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, Bell, PlaySquare, UserRound, Users } from 'lucide-react'
import { getSubscribedChannels } from '../services/subscription.service'
import { PALETTE, TYPOGRAPHY } from '../utils/styles'
import Loading from '../components/loading'
import Error from '../components/error'

const Subscriptions = () => {
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await getSubscribedChannels()
        console.log(res)
        setChannels(res?.data?.data || [])
      } catch (err) {
        console.error(err)
        setError(err?.response?.data?.message || 'Something went wrong while fetching subscriptions.')
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  return (
    <div
      className="min-h-screen px-4 py-6 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'transparent', color: PALETTE.ink, fontFamily: TYPOGRAPHY.font }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="mt-2 text-3xl font-bold" style={{ color: PALETTE.ink }}>
              Subscriptions
            </h1>
          </div>

          <div
            className="flex items-center gap-2 rounded-full border px-3 py-2 text-sm"
            style={{ borderColor: PALETTE.line, backgroundColor: 'transparent', color: PALETTE.muted }}
          >
            <Bell size={16} color={PALETTE.accent} />
            <span>{channels.length} channels</span>
          </div>
        </div>

        {channels.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed p-10 text-center"
            style={{ borderColor: PALETTE.line, backgroundColor: 'transparent' }}
          >
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: `${PALETTE.accent}22` }}
            >
              <UserRound size={28} color={PALETTE.accent} />
            </div>
            <h2 className="text-xl font-semibold" style={{ color: PALETTE.ink }}>
              No subscriptions yet
            </h2>
            <p className="mt-2 text-sm" style={{ color: PALETTE.muted }}>
              Follow channels you like to see them here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {channels.map((channel) => (
              <button
                key={channel?._id}
                type="button"
                onClick={() => navigate(`/channelProfile/${channel._id}`)}
                className="group rounded-[28px] border p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-white/15"
                style={{
                  borderColor: 'rgba(255,255,255,0.08)',
                  backgroundColor: PALETTE.card,
                  boxShadow: 'none',
                }}
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex-shrink-0">
                    {channel.avatar ? (
                      <img
                        src={channel.avatar}
                        alt={channel.userName}
                        className="h-32 w-32 rounded-full object-cover ring-2 ring-white/10 sm:h-36 sm:w-36"
                      />
                    ) : (
                    
                      <div
                        className="flex h-32 w-32 items-center justify-center rounded-full text-4xl font-bold sm:h-36 sm:w-36"
                        style={{ backgroundColor: PALETTE.accent, color: PALETTE.ink }}
                      >
                       
                        {channel?.userName[0].toUpperCase()}
                      </div> 
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-3xl font-bold" style={{ color: PALETTE.ink }}>
                        {channel?.userName}
                      </h2>
                      <BadgeCheck size={18} color={PALETTE.blue} />
                    </div>

                    <p className="mt-1 text-base" style={{ color: PALETTE.muted }}>
                      @{channel?.userName}
                    </p>

                    

                    <p className="mt-4 max-w-xl text-sm leading-6" style={{ color: PALETTE.muted }}>
                      
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <span
                        className="rounded-full border px-4 py-2 text-sm font-medium"
                        style={{ borderColor: PALETTE.line, backgroundColor: 'rgba(255,255,255,0.02)', color: PALETTE.ink }}
                      >
                        Subscribed
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Subscriptions