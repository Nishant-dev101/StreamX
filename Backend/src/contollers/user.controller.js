import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/clodinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";


const generateAccessAndRefreshToken =  async (userid) => {
        try {
          const user = await User.findOne(userid)
          const accessToken = await user.generateAccessToken()
          const refreshToken = await user.generateRefreshToken()

          user.refreshToken = refreshToken
           await user.save({validateBeforeSave: false}) // does need all required values lke password
           
           return { accessToken , refreshToken}
        } catch (error) {
           throw new ApiError(500, "Something went wrong while defining tokens")
        }
}

const registerUser = async (req, res, next) => {
       
  const { fullName, userName, email, password } = req.body;

  console.log(req.body);
  

  

  if (
    [fullName, userName, email, password].some((field) => field?.trim() === "")
  ) {
    return res.status(400).json(new ApiError(400, "All fields are Required"));
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (existedUser) {
    //  res.send(new ApiResponse(500,[],"user already exists"))
    return res.status(409).json(new ApiError(409, "User with email or userName already exists"))
  }  
  console.log(req.files);
  

  const avatarLocalPath = req.file?.path

  if (!avatarLocalPath) {
      return res.status(400).json(new ApiError(400, "Avatar file Required"))
  }

   const avatar = await uploadOnCloudinary(avatarLocalPath)
  
   if(!avatar) return res.status(400).json(new ApiError(400, "Something went wrong while uploading avatar file"))  
     
    const hashedPassword = await bcrypt.hash(password, 10)

     
   let user
   try{   
      user = await User.create({
      fullName,
      avatar: avatar?.url,
      email,
      password: hashedPassword,
      userName: userName.toLowerCase()
    })
 
   } catch (error) {
      return res.status(500).json(new ApiError(500, error.message))
   }

    const createdUser = await User.findById(user._id).select(
      '-password -refreshToken'
   )

   if(!createdUser){
      return res.status(500).json(new ApiError(500, "Something went wrong while registering the user"))
   }

  return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered succesfully")
   )



  




};

const loginUser =  async (req, res, next) => {
    
  const { userName, email, password } = req.body;
  console.log(req.body);
  console.log("hi there");
  
  
   
 if(!(userName || email)) {
    throw new ApiError(400, "Username or Email is required")
 }

   const validUser = await User.findOne({
    $or: [{userName}, {email}]
   })
   console.log("valid user");
   
    
   if (!validUser) {
      throw new ApiError(404, "User with this userName and email does not exists")
   }

  const ispasswordvalid = await validUser.isPasswordCorrect(password)
  console.log(ispasswordvalid);
  
  if(!ispasswordvalid){
    throw new ApiError(401, "Password Does not match")
  }
 
    const { accessToken , refreshToken } = await generateAccessAndRefreshToken(validUser._id)
    console.log("after token");
    console.log(accessToken);
    
    
  const loggedInUser = await User.findOne(validUser._id).select(
    " -password -refreshToken"
  )

  const options = {
    httpOnly : true,
    secure: true
  }


  return res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
       200,
      {
       user: loggedInUser, refreshToken,accessToken
      },
      "User logged In Succesfully"
    )
  )
}

 
const logOutUser = async (req, res, next) => {
   
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: null
        }
      },
      {
        new: true  // resturn the new value that is changed
      }
    )

         const options = {
           httpOnly: true,
           secure: true,
         };

         return res.status(200)
         .clearCookie("accessToken", options)
         .clearCookie("refreshToken", options)
         .json( new ApiResponse(
          200,
          user,
          "Logged Out Succesfully"
         ))
}



const refreshAccesToken = async ( req, res, next ) => {


  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken // for cookies sent from mobile apps
  
  if(!incomingRefreshToken){
  throw new ApiError(401, "unauthorised request")
  }
  
  const decodedToken = jwt.verify(incomingRefreshToken, 
    process.env.REFRESH_TOKEN_SECRET)
  
      const user = await User.findById(decodedToken._id)
  
      if(!user){
        throw new ApiError(401, "Invalid refresh Token")
      }
      
  
   if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Invalid refresh Token")
   }

    const options = {
    httpOnly : true,
    secure: true
  }
  
   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
  
  return res.status(200)
  .cookie("acceesToken", accessToken, options)
  .cookie("refrehToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      { 
        accessToken, 
        refreshToken
      },
      "Acces token refreshed "
    )
  )





}


const changeCurrentPassword = async ( req, res, next ) => {

    const { oldPassword, newPassword} = req.body

    if (!oldPassword) {
      throw new ApiError(401, "old password is not defined")
    }

    const validuser = await User.findById(req.user._id)
    console.log(validuser);
    console.log("checkpoint")
    
    
      const ispasswordvalid = await validuser.isPasswordCorrect(oldPassword)

      if(!ispasswordvalid){
            throw new ApiError(401, "Incorrect old Password")
      }

      validuser.password = newPassword
      await validuser.save({validateBeforeSave: false})

      return res.status(200)
      .json(
        new ApiResponse(
        200,
        { },
        "password changed succesfully"
        )
      )
    
}
  
const getCurrentUser = async ( req, res, next) => {
  console.log(req.user);
  
//  const user = req.user
   return res.status(200)
   .json(
    new ApiResponse(
      200,
       req.user,
       "User fetched Succesfully"

    )
   )
}

const updateUserDetails = async ( req, res, next) => {

   const { fullName, email } = req.body

   if ( !fullName || !email ) {
       throw new ApiError(
        401, "All fields are required"
       )
      }

      const user =await User.findByIdAndUpdate(
        req.user?._id,
        {
          $set: {
            fullName,
            email
          }
        },
        {new : true}

      ).select("-password")

      return res.status(200)
      .json(
        new ApiResponse(
          200,
          user,
          " Account Details Edited Succesfully "
        )

      )
}


const updateUserAvatar = async (req, res, next) => {
   
     const avatarFilepath = req.file?.path   // file and not files because only one 
                                             // file uploaded in multer at middleware
 
     if(!avatarFilepath){
      throw new ApiError( 400, " Avatar file Missing ")
     }

     const response = await uploadOnCloudinary(avatarFilepath)

     if(!response.url){
        throw new ApiError( 400, " Error while uploading avatar File ")
     }

     const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
       $set: {
           avatar : response.url
       }
      },
      { new: true }

    ).select("-password -refreshToken")

    return res.status(200)
    .json(
      new ApiResponse(
        200,
        {user},
        "Avatar Image Updated Successfully"
      )
    )
}

const updateUserCoverImage = async (req, res, next) => {
   
     const UserCoverImage = req.file?.path
 
     if(!UserCoverImage){
      throw new ApiError( 400, "UserCoverImage file Missing ")
     }

     const response = await uploadOnCloudinary(UserCoverImage)

     if(!response.url){
        throw new ApiError( 400, " Error while uploading UserCoverImage File ")
     }

     const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
       $set: {
           coverImage : response.url
       }
      },
      { new: true }

    ).select("-password -refreshToken")

    return res.status(200)
    .json(
      new ApiResponse(
        200,
        {user},
        "CoverImage Updated Successfully"
      )
    )

}


const getUserChannelProfile = async ( req, res, next ) => {
       
     const { username } = req.params

      if (!username?.trim()) {
         throw new ApiError(400, " username is Missing ");
      }
        let channel;
     try {
       channel = await User.aggregate([
          {
           $match: {
             userName: username.toLowerCase()
           },
          },
          {
           $lookup: {
             from: "subscriptions",
             localField: "_id",
             foreignField: "channel",
             as: "subscribers",
             pipeline: [{
              $project: {
                subscriber: 1
              }
             }]
           }
          },
          {
           $lookup: {
             from: "subscriptions",
             localField: "_id",
             foreignField: "subscriber",
             as: "subscribedTo",
             pipeline: [{
              $project: {
                channel: 1
              }
             }]
          }},
          {
            $addFields: {
             subscribersCount: {
               $size: "$subscribers"
             },
               channelsSubscribedToCount: {
               $size: "$subscribedTo"
               },
               isSubscribed: {
               $cond: {
                 if: {$in: [req.user._id, "$subscribers.subscriber"]},
                 then: true,
                 else: false
               }
               }
             }
           },
           {
             $project: {
               fullName: 1,
               userName: 1,
               subscribersCount: 1,
               channelsSubscribedToCount: 1,
               isSubscribed: 1,
               avatar: 1,
               coverImage: 1,
               email: 1,
               subscribedTo: 1
                
             }
           }
          
          
       ])
     } catch (error) {
       throw new ApiError(401, error.message)
     }

      if(!channel?.length){
        throw new ApiError(404, "channnel does not exists")
      }

      return res
      .status(200)
      .json( 
        new ApiResponse(200, channel[0], "User channel fetched succesfully")
      )
    }


const getWatchHistory = async ( req, res, next) => {
      
       try {
         const user =  await User.aggregate([
              {
               $match: {
                 _id: new mongoose.Types.ObjectId(req.user._id)
               }
              },
              {
                $lookup: {
                 from : "videos",
                 localField: "watchHistory",
                 foreignField: "_id",
                 as: 'watchHistory' ,
                 pipeline: [
                   {
                     $lookup: { 
                       from: "users",
                       localfield: "owner",
                       foreignfield: "_id",
                       as: "owner",
                       pipeline: [
                         {
                           $project: {
                             fullName: 1,
                             userName: 1,
                             avatar: 1
                           }
                         }
                       ]
                     }
                   }
                 ]
                }
              }
           ])
      
          return res 
          .status(200)
          .json(
            new ApiResponse(
              200,
              user[0].watchHistory,
              "Watch History fetched succesfully"
            )
          )
} catch (error) {
        throw new ApiError(400, error.message)
       } 
    }


export {
  changeCurrentPassword,
  refreshAccesToken,
  getCurrentUser,
  registerUser,
  logOutUser,
  loginUser,
  updateUserDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory
}
