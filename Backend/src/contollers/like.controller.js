import mongoose from "mongoose"
import { comment } from "../models/comment.model.js"
import { Like } from "../models/like.model.js"
import { tweet } from "../models/tweet.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"





const toggleVideoLike = async (req, res) => {
   
    const {videoId} = req.params
    //TODO: toggle like on video
    console.log(videoId);
    
       if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
        return res.status(400).json(new ApiError(400, "Invalid Request"))
       }
        
      const like = await Like.findOne({video: videoId, likedBy: req.user._id})
     
      
        var createdLike
      
      if(!like){
          createdLike = await Like.create({
            likedBy: req.user._id,
            video: videoId
          })
        } else {
           createdLike = await Like.deleteOne({
            likedBy: req.user._id,
            video: videoId
          })
        }

        return res
        .status(200)
        .json(
            new ApiResponse(201, createdLike, "succesfully toggled like")
        )
}

const toggleCommentLike = async (req, res) => {
    
  const {commentId} = req.params
   console.log(commentId);
    //TODO: toggle like on comment
      if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json(new ApiError(400, "Invalid Request"))
       }
  
      const foundComment = await Like.findOne({comment: commentId, likedBy: req.user._id})
      
      var createdComment
  
      
      
      if(!foundComment){
          createdComment = await Like.create({
            likedBy: req.user._id,
            comment: commentId
          })
          console.log("after created comment");
          
        } else {
           createdComment = await Like.deleteOne({
            likedBy: req.user._id,
            comment: commentId
          })
        }
        console.log("after validating commentID 333");

        return res
        .status(200)
        .json(
            new ApiResponse(201, createdComment, "succesfully toggled like")
        )

}

const toggleTweetLike = async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if (!tweetId|| !mongoose.Types.ObjectId.isValid(tweetId)) {
        return res.status(400).json(new ApiError(400, "Invalid Request"))
       }

      const foundTweet = await Like.findOne({tweet: tweetId, likedBy: req.user._id})

      
      var createdTweet
      
      if(!foundTweet){
          createdTweet = await Like.create({
            likedBy: req.user._id,
            tweet: tweetId
          })
        } else {
           createdTweet = await Like.deleteOne({
            tweet: tweetId,
            likedBy: req.user._id
           })
        }

        if (!createdTweet) {
          return res.status(500).json(new ApiError(500, "something went wrong"))
        }

        return res
        .status(200)
        .json(
            new ApiResponse(201, createdTweet, "succesfully toggled like")
        )
}


const getLikedVideos = async (req, res) => {
  //TODO: get all liked videos
  const videos = await Like.aggregate([
    {
      $match: {
        likedBy: req.user._id,
        video: {
          $exists: true,
        },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
        pipeline: [
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
                    email: 1,
                    avatar: 1,
                    coverImage: 1,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $unwind: "$videoDetails",
    },
    {
      $replaceRoot: {
        newRoot: "$videoDetails",
      },
    },
  ]);

  if(!videos) return res.status(404).json(new ApiError(404, "could not find liked videos"))

  return res
  .status(200)
  .json( 
    new ApiResponse(200, videos, "succesfully fetched liked videos")
  )
}

const getVideoLikes = async (req, res) => {
  const { videoId } = req.params

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json(new ApiError(400, "Invalid video ID"))
  }

  const [video, likesCount, viewerLike] = await Promise.all([
    Video.exists({ _id: videoId }),
    Like.countDocuments({ video: videoId }),
    req.user?._id
      ? Like.exists({ video: videoId, likedBy: req.user._id })
      : null,
  ])

  if (!video) {
    return res.status(404).json(new ApiError(404, "Video not found"))
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videoId,
        likesCount,
        isLiked: Boolean(viewerLike),
      },
      "Video likes fetched successfully",
    ),
  )
}

export { 
     toggleVideoLike,
     toggleCommentLike,
     toggleTweetLike,
     getLikedVideos,
     getVideoLikes,
 };
