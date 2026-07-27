

import jwt from "jsonwebtoken";

const generateAccessToken = (userId) => {
    
    return jwt.sign(
        {
            _id: userId,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // e.g. "15m"
        }
    );
};

const generateRefreshToken = (userId) => {
    
    return jwt.sign(
        {
            _id: userId,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // e.g. "7d"
        }
    );
};

export {
    generateAccessToken,
    generateRefreshToken,
};