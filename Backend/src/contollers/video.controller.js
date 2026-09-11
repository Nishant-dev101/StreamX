import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { uploadOnCloudinary } from "../utils/clodinary.js"
import { generateHLS } from "../utils/hls.service.js"
import path from "path"
import crypto from "crypto";
import fs from "fs/promises";

const getAllVideos = async (req, res, next) => {
   
    const { page = 1, limit = 10, sortBy = "views", order = 1} = req.query

    const pageInt = parseInt(page)
    const limitInt = parseInt(limit)
    const skip = (pageInt - 1) * limitInt

    const validSortFields = [ "createdAt", "views", "title" ]
    const validsortBY = validSortFields.includes(sortBy)? sortBy : "views";
    const validOrder = order == -1 ? -1 : 1;

    const videos = await Video.aggregate([
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
      {
        $sort: {
          [validsortBY]: validOrder,
        },
      },
    ]);


    return res.status(200).json(
    new ApiResponse(
        200,
         videos,
         " successfully loaded videos "
    )
)
    

}

const getSearchedVideos = async (req, res, next) => {

    const { query, page = 1, limit = 10 } = req.query

    if (!query || !query.trim()) {
      return res.status(400).json(new ApiError(400, "Search query is required"))
    }

    const pageInt = parseInt(page)
    const limitInt = parseInt(limit)
    const skip = (pageInt - 1) * limitInt

    // Use regex for partial and case-insensitive matching
    const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const videos = await Video.find({
      title: { $regex: escapedQuery, $options: "i" },
      ispublised: true
    })
      .populate("owner", "avatar userName fullName")
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limitInt)

    return res.status(200).json(
        new ApiResponse(200, videos, "Fetched videos successfully")
    )

}

const getRecommendedVideos = async (req, res, next) => {
  const { videoId } = req.params

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json(new ApiError(400, "Invalid video ID"))
  }

  const currentVideo = await Video.findById(videoId).select("title description")

  if (!currentVideo) {
    return res.status(404).json(new ApiError(404, "Video not found"))
  }

  const terms = `${currentVideo.title} ${currentVideo.description}`
    .toLowerCase()
    .match(/[a-z0-9]{3,}/g) || []
  const uniqueTerms = [...new Set(terms)].slice(0, 12)

  const recommendations = uniqueTerms.length
    ? await Video.find({
      _id: { $ne: videoId },
      ispublised: true,
      $or: uniqueTerms.flatMap((term) => [
        { title: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
      ]),
    })
      .populate("owner", "avatar userName fullName")
      .sort({ views: -1, createdAt: -1 })
      .limit(12)
    : []

  return res.status(200).json(
    new ApiResponse(200, recommendations, "Recommended videos fetched successfully")
  )
}


const uploadAVideo = async (req, res, next) => {
    const { title, description } = req.body;
    
    

    if (!title || !description || !req.files?.thumbnail || !req.files?.videoFile) {
        return res.status(400).json(new ApiError(400, "All video details (title, description, thumbnail, videoFile) are required"));
    }

    const videoFileLocalPath = req.files.videoFile[0].path;
    const thumbnailLocalPath = req.files.thumbnail[0].path;
    console.log(req.files.videoFile[0].filename)

  
    const videoId = crypto.randomUUID();
    const outputDir = path.join("public", "hls", videoId);

    console.log("before hlsUrl")
    const masterPlaylistPath = await generateHLS(videoFileLocalPath,outputDir)
    
    // const masterPlaylistPath = playlistPath.replace("public", "");
    console.log(masterPlaylistPath)
    const hlsURL = `${req.protocol}://${req.get("host")}/hls/${videoId}/master.m3u8`;
    console.log(hlsURL)

   
    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile || !thumbnailFile) {
        return res.status(500).json(new ApiError(500, "Error occurred while uploading files to Cloudinary"));
    }
     
     let document;
     try {
       document = await Video.create({
        videoFile: videoFile.url,
        videoFileHLS: hlsURL,
        title: title,
        hlsVideoId: videoId,
        description: description,
        thumbnail: thumbnailFile.url,
        owner: req.user?._id,
        duration: videoFile.duration ?? 0,
        ispublised: true
    });
    } catch (error) {
       return next(error)
    }
    return res.status(201).json(
      new ApiResponse(201, document, "Video uploaded and encoded successfully")
    );
}

const updateVideo = async (req, res, next) => {

  const { videoId } = req.params
    const { newTitle, description } = req.body

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json(new ApiError(400, "Invalid video ID"))
  }

    if( !newTitle || !description){
    return res.status(400).json(new ApiError(400, " All fields are required "))
    }

     const video = await Video.findOne({
       _id: videoId,
       owner: req.user._id,
     });
    
     if (!video) {
        return res.status(404).json(new ApiError(404," Video does not exists "))
     }
     
     if (video.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json(new ApiError(403,"Unauthorised request"))
     }

     video.title = newTitle
     video.description = description
     if (req.file) {
      const thumbnail = await uploadOnCloudinary(req.file.path)
      if (!thumbnail) {
        return res.status(500).json(new ApiError(500, " Error occured while updating thumbnail "))
      }
      video.thumbnail = thumbnail.url
     }
     const updatedVideo = await video.save({ validateBeforeSave : false})
     

     return res.status(201)
     .json(
        new ApiResponse(200, updatedVideo, " successfully updated video ")
     )



}


const deleteVideo = async (req, res, next) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid video ID"));
  }

  const video = await Video.findOne({
    _id: videoId,
    owner: req.user._id,
  });

  if (!video) {
    return res
      .status(404)
      .json(new ApiError(404, "Could not find the requested video"));
  }

  const hlsDir = path.join("public", "hls", video.hlsVideoId);
  console.log()

  try {
    fs.rm(hlsDir, {
      recursive: true,
      force: true,
    });
  } catch (error) {
    console.error("Failed to delete HLS files:", error);

    return res
      .status(500)
      .json(new ApiError(500, "Failed to delete HLS files"));
  }

  const deleteResponse = await Video.deleteOne({
    _id: videoId,
    owner: req.user._id,
  });

  if (!deleteResponse.acknowledged) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to delete video"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Successfully deleted video")
    );
};



const togglePublisedStatus = async (req, res, next) => {

  const { videoId } = req.params

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json(new ApiError(400, "Invalid video ID"))
    }

    const video = await Video.findOne({
     _id: videoId,
       owner: req.user._id
    })

    if (!video) {
        return res.status(404).json(new ApiError(404, " unable to find video "))
    }

    video.ispublised = !video.ispublised
    const updatedVideo = await video.save({validateBeforeSave: false})

    return res.status(201)
        .json(
           new ApiResponse(200, updatedVideo, " succesfully toggled publish status ")
        )
    
}


const getVideoById = async (req, res, next) => {
    const { id } = req.params;
     
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json(new ApiResponse(400, null, "Invalid video ID"));
    }


    const video = await Video.findById(id).populate("owner", "avatar userName fullName")
   
    //  const video = await Video.aggregate([
    //     {
    //         $match :{
    //         _id: new mongoose.Types.ObjectId(id)
    //      }
    //     },
    //     {
    //         $lookup: {
    //             from: 'users',
    //             localField: 'owner',
    //             foreignField: '_id',
    //             as: 'owner'
    //         }
    //     }
         
    //  ])

     if(!video){
        return res.status(404).json(new ApiResponse(404, null, "Video not found"));
     }

     return res.status(200).
     json(new ApiResponse(200, video, "Video fetched successfully"));
    }



    const getUserVideos = async (req, res, next) => {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json(new ApiError(400, "Invalid user ID"));
    }

    const videos = await Video.aggregate([
        {
            $match: {
                owner : new mongoose.Types.ObjectId(userId)
            }
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
      {
        $sort: {
          createdAt: -1 
        },
      },
    
    ])

    if (!videos) {
        return res.status(404).json(new ApiError(404, "No videos found for this user"));
    }

    return res.status(200).json(
        new ApiResponse(200, videos, "User videos fetched successfully")
    );
}
     
const updateVideoViews = async (req, res) => {
    const { videoId } = req.params;
    console.log("videoId at updateviews", videoId)
    const video = await Video.findByIdAndUpdate(
        videoId,
        { $inc: { views: 1 } },
        { new: true }
    );

    if (!video) {
        return res
            .status(404)
            .json(new ApiError(404, "Video not found"));
    }
    console.log("after no video error")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { views: video.views },
                "View counted successfully"
            )
        );
};

export { 
    getAllVideos, 
    getSearchedVideos,
    getRecommendedVideos,
    uploadAVideo,
    updateVideo,
    deleteVideo,
    togglePublisedStatus,
    getVideoById,
    getUserVideos,
    updateVideoViews
}