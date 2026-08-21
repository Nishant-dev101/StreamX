import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/clodinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import bcrypt from "bcrypt"; 




const registerUser = async (req, res, next) => {
       
  const { fullName, username, email, password } = req.body;

  console.log(req.body);
  

  

  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    return res.status(400).json(new ApiError(400, "All fields are Required"));
  }

     console.log("before creating user");
     console.log(User.collection.name);
     console.log(User.db.name);


  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

   console.log("after creating user");

  if (existedUser) {
    //  res.send(new ApiResponse(500,[],"user already exists"))
    return res.status(409).json(new ApiError(409, "User with email or userName already exists"))
  }  
  console.log(req.file);
  
   let avatar;

   if (req?.file) {
    
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
      return res.status(400).json(new ApiError(400, "Avatar file Required"));
    }

    avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar)
      return res
        .status(400)
        .json(
          new ApiError(400, "Something went wrong while uploading avatar file"),
        );
  }
     
    const hashedPassword = await bcrypt.hash(password, 10)

 
     
   let user
   try{   
      user = await User.create({
      fullName,
      avatar: avatar?.url ||  "",
      email,
      password: hashedPassword,
      userName: username.toLowerCase()
    })
 
   } catch (error) {
      console.log(error)
      return res.status(500).json(new ApiError(500, "Something went wrong while registering the user"))
   }
     const accessToken = generateAccessToken(user._id);
     const refreshToken = generateRefreshToken(user._id);

     user.refreshToken = refreshToken;
     await user.save({ validateBeforeSave: false });

    const createdUser = await User.findById(user._id).select(
      '-password -refreshToken'
   )

   const options = {
     httpOnly: true,
     secure: true,
     sameSite: "None",
   }

   if(!createdUser){
      return res.status(500).json(new ApiError(500, "Something went wrong while registering the user"))
   }

  return res
     .status(200)
     .cookie("accessToken", accessToken,options)
     .cookie("refreshToken", refreshToken, options)
     .json(
      new ApiResponse(200, createdUser, "User registered succesfully")
      )



  




};


const loginUser =  async (req, res, next) => {
    
  const { email, password } = req.body;
  console.log(req.body);
 
  console.log("hi there");
  
  
   
 if(!email) {
   return res.status(400).json(new ApiError(400, "Email is required"))
 }

   const validUser = await User.findOne({
     email
   })

   console.log("valid user");
   
    
   if (!validUser) {
      return res.status(404).json(new ApiError(404, "User does not exists"))
   }

    const isPasswordvalid = await bcrypt.compare(password, validUser.password)
    
    console.log(isPasswordvalid);
  
  if(!isPasswordvalid){
    return res.status(401).json(new ApiError(401, "Incorrect Password"))
  }
    
   const accessToken = generateAccessToken(validUser._id)
   const refreshToken = generateRefreshToken(validUser._id)
    
    console.log("after token");
    console.log(accessToken);
    
    
  const loggedInUser = await User.findById(validUser._id).select(
    "-password -refreshToken"
  )

  if (!loggedInUser) {
    return res.status(500).json(new ApiError(500, "Something went wrong while logging in the user"))
  }

  const options = {
    httpOnly : true,
    secure: true,
    sameSite: "None"
  }


  return res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
       200,
       loggedInUser,
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
  return res.status(401).json(new ApiError(401, "unauthorised request"))
  }
  
  const decodedToken = jwt.verify(incomingRefreshToken, 
    process.env.REFRESH_TOKEN_SECRET)
  
      const user = await User.findById(decodedToken._id)
  
      if(!user){
        return res.status(401).json(new ApiError(401, "Invalid refresh Token"))
      }
      
  
   if (incomingRefreshToken !== user.refreshToken) {
    return res.status(401).json(new ApiError(401, "Invalid refresh Token"))
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
      return res.status(400).json(new ApiError(400, "old password is not defined"))
    }

    const validuser = await User.findById(req.user._id)
    console.log(validuser);
    console.log("checkpoint")
    
    
      const ispasswordvalid = await validuser.isPasswordCorrect(oldPassword)

      if(!ispasswordvalid){
        return res.status(401).json(new ApiError(401, "Incorrect old Password"))
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

   const { fullName, userName } = req.body

   if ( !fullName || !userName) {
       return res.status(400).json(new ApiError(
      400, "All fields are required"
       ))
      }

      const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
          $set: {
            fullName,
            userName
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
      return res.status(400).json(new ApiError(400, " Avatar file Missing "))
     }

     const response = await uploadOnCloudinary(avatarFilepath)

     if(!response.url){
        return res.status(500).json(new ApiError(500, " Error while uploading avatar File "))
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
      return res.status(400).json(new ApiError(400, "UserCoverImage file Missing "))
     }

     const response = await uploadOnCloudinary(UserCoverImage)

     if(!response.url){
        return res.status(500).json(new ApiError(500, " Error while uploading UserCoverImage File "))
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
       
     const { userId } = req.params

     console.log("userid in getUserProfile ", userId)
     console.log("typeof:", typeof userId);

      if (!userId) {
         return res.status(400).json(new ApiError(400, "User ID is required"));
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
         return res.status(400).json(new ApiError(400, "Invalid User ID format"));
      }

       const viewerId = req.user?._id;

     try {
       const channel = await User.aggregate([
         {
           $match: {
             _id: new mongoose.Types.ObjectId(userId),
           },
         },
         {
           $lookup: {
             from: "videos",
             localField: "_id",
             foreignField: "owner",
             as: "videos",
             pipeline: [
               {
                 $match: {
                   ispublised: true,
                 },
               },
               {
                 $lookup: {
                   from: "users",
                   localField: "owner",
                   foreignField: "_id",
                   as: "owner",
                   pipeline: [
                     {
                       $project: {
                         userName: 1,
                         fullName: 1,
                         avatar: 1,
                       },
                     },
                   ],
                 },
               },
             ],
           },
         },
         {
           $lookup: {
             from: "tweets",
             localField: "_id",
             foreignField: "owner",
             as: "Tweets",
           },
         },

         {
           $lookup: {
             from: "subscriptions",
             localField: "_id",
             foreignField: "channel",
             as: "subscribers",
             pipeline: [
               {
                 $project: {
                   subscriber: 1,
                 },
               },
             ],
           },
         },
         {
           $lookup: {
             from: "subscriptions",
             localField: "_id",
             foreignField: "subscriber",
             as: "subscribedTo",
             pipeline: [
               {
                 $project: {
                   channel: 1,
                 },
               },
             ],
           },
         },
         {
           $addFields: {
             subscribersCount: {
               $size: "$subscribers",
             },
             channelsSubscribedToCount: {
               $size: "$subscribedTo",
             },
             isSubscribed: {
               $cond: [
                 Boolean(viewerId),
                 { $in: [viewerId, "$subscribers.subscriber"] },
                 false,
               ],
             },
           },
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
             subscribedTo: 1,
             videos: 1,
             Tweets: 1,
           },
         },
       ]);

       if(!channel?.length){
        return res.status(404).json(new ApiError(404, "User channel not found"));
       }

      return res
      .status(200)
      .json( 
        new ApiResponse(200, channel[0], "User channel fetched successfully")
      )
     } catch (error) {
       return res.status(500).json(new ApiError(500, "Error fetching channel profile: " + error.message));
     }
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
  return res.status(500).json(new ApiError(500, error.message))
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
