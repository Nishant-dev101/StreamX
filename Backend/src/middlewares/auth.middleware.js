import { ApiError } from "../utils/apiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const verifyJWT = async (req, res, next) => {

try {
  console.log(req.cookies)
  console.log("after req.cookies");
  
  
      const token = req.cookies.accessToken || 
      req.header("Authorization")?.replace("Bearer ", "")
       console.log("after accestoken")
       console.log(token);
       
      if(!token){
        return res.status(401).json(new ApiError(401, "Unauthorized request"))
      }
    
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
      const user = await User.findById(decodedToken?._id).select(" -password -refreshToken ")
    
      if (!user) {
        return res.status(401).json(new ApiError(401, "Invalid Access Token"))
      }
       
      req.user = user;
      next()
} catch (error) {
  return res.status(401).json(new ApiError(401, error.message))
}

}

export const optionalVerifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "")

    if (token) {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      req.user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    }
  } catch (error) {
    req.user = undefined
  }

  next()
}