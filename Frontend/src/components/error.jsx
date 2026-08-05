

import {PALETTE, TYPOGRAPHY} from '../utils/styles'
import React from 'react'

const Error = ({ error }) => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <p style={{ color: PALETTE.error }}>{error}</p>
        </div>
    )
}

export default Error