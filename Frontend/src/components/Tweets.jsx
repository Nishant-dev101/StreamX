


import React from 'react'
import { PALETTE, TYPOGRAPHY } from '../utils/styles'

const Tweets = ({tweets}) => {
  return (
    <div>
          
          {tweets.length > 0 ? (
            <div className="space-y-4">
              {tweets.map((tweet) => (
                <div
                  key={tweet._id}
                  className="rounded-lg border border-white/10 p-6"
                  style={{ backgroundColor: PALETTE.card }}
                >
                  <div className="flex gap-4">
                    {/* Tweet Author Avatar */}
                    <div className="flex-shrink-0">
                      {tweet.owner?.[0]?.avatar ? (
                        <img
                          src={tweet.owner[0].avatar}
                          alt={tweet.owner[0].userName}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-white"
                          style={{ backgroundColor: PALETTE.accent }}
                        >
                          {tweet.owner?.[0]?.userName?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Tweet Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold" style={{ color: PALETTE.ink }}>
                          {tweet.owner?.[0]?.userName}
                        </p>
                        <p style={{ color: PALETTE.muted }} className="text-sm">
                          {new Date(tweet.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p style={{ color: PALETTE.muted }} className="text-sm leading-6">
                        {tweet.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: PALETTE.muted }}>No tweets posted yet.</p>
          )}
        </div>
  )
}

export default Tweets