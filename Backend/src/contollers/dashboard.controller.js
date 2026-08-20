import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"





const getChannelStats = async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    
     const videos = await User.aggregate([
       {
         $match: {
           _id: req.user._id,
         },
       },

       //  video views

       {
         $lookup: {
           from: "videos",
           localField: "_id",
           foreignField: "owner",
           as: "videos",
         },
       },

       // subscribers Count

       {
         $lookup: {
           from: "subscriptions",
           localField: "_id",
           foreignField: "channel",
           as: "subscribers",
           pipeline: [
             {
               $count: "subscriberCount",
             },
           ],
         },
       },

       // total likes
       {
         $lookup: {
           from: "videos",
           localField: "_id",
           foreignField: "owner",
           as: "videos",
           pipeline: [
             {
               $lookup: {
                 from: "likes",
                 localField: "_id",
                 foreignField: "video",
                 as: "likedVideos",
                 pipeline: [
                   {
                     $count: "totalLikesOnThisVideo",
                   },
                 ],
               },
             },
           ],
         },
       },

       {
         $addFields: {
           totalViews: { $sum: "$videos.views" },
           totalVideos: { $size: "$videos" },
           totalSubscribers: "$subscribers.subscriberCount",

           totalLikes: {
             $sum: {
               $map: {
                 input: "$videos",
                 as: "video",
                 in: {
                   $ifNull: [
                     {
                       $arrayElemAt: [
                         "$$video.likedVideos.totalLikesOnThisVideo",
                         0,
                       ],
                     },
                     0,
                   ],
                 },
               },
             },
           },
         },
       },
       {
        $project: {
          totalViews: 1,
          totalLikes: 1,
          totalVideos: 1,
          totalSubscribers: 1
        }
       }
     ]);


      return res.status(200)
      .json(
        new ApiResponse(201, videos, "succesfully fetched the views")
      )

}

const getChannelVideos = async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    console.log(req.user._id);
    
      const videos = await Video.aggregate([
        {
            $match: {
                owner : req.user._id
            }
        }
      ])
    if (!videos) {
        return res.status(404).json(new ApiError(404, "could not find any videos"))
    }

    return res
    .status(200)
    .json(
        new ApiResponse(201, videos, "succesfully fetched the videos")
    )
}

export {
    getChannelStats, 
    getChannelVideos
    }