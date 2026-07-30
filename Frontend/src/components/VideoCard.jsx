import React from 'react'
import { PALETTE, TYPOGRAPHY } from '../utils/styles'

const formatViews = (v) => {
  if (typeof v === 'number') return `${v.toLocaleString()} views`
  return v
}

const formatDuration = (secs = 0) => {
  const s = Number(secs) || 0
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, '0')}`
}

const VideoCard = ({ video }) => {
  const { thumbnail, title, channel, views, duration } = video
  const { card, ink, muted, active, railText } = PALETTE

  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-md" style={{ backgroundColor: card }}>
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-40 object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="h-40 w-full" style={{ backgroundColor: active }} />
        )}

        <span
          className="absolute right-2 bottom-2 rounded-sm bg-black/60 px-2 py-0.5 text-[0.65rem]"
          style={{ color: railText }}
        >
          {formatDuration(duration)}
        </span>
      </div>

      <div className="mt-2 flex gap-3">
        <div
          className="h-9 w-9 flex-shrink-0 rounded-full"
          style={{ backgroundColor: active }}
        />

        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: ink, fontFamily: TYPOGRAPHY.font }}>
            {title}
          </p>
          <p className="mt-1 text-xs" style={{ color: muted }}>
            {channel} • {formatViews(views)}
          </p>
        </div>
      </div>
    </article>
  )
}

export default VideoCard


