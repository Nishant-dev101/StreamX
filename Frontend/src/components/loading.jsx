

import React from 'react'
import { PALETTE, TYPOGRAPHY } from '../utils/styles'


const Loading = () => {

  return (
    <div className="h-screen flex items-center justify-center px-4 py-2 sm:px-6"
      style={{
        background: `radial-gradient(circle at top left, ${PALETTE.accent}22 0%, transparent 35%), linear-gradient(135deg, ${PALETTE.page} 0%, #111111 100%)`,
        fontFamily: TYPOGRAPHY.font,
      }}>

      <div className="flex-col gap-4 w-full flex items-center justify-center">
        <div
          className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"
        >
          <div
            className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
          ></div>
        </div>
      </div>


    </div>
  )
}

export default Loading