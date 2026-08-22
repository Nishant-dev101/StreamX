import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import uploadOnCloudinary from "../utils/clodinary.js"
import { pipeline } from "stream"

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


const uploadAVideo = async (req, res, next) => {
    const { title, description } = req.body;
    
    

    if (!title || !description || !req.files?.thumbnail || !req.files?.videoFile) {
        return res.status(400).json(new ApiError(400, "All video details (title, description, thumbnail, videoFile) are required"));
    }

    const videoFileLocalPath = req.files.videoFile[0].path;
    const thumbnailLocalPath = req.files.thumbnail[0].path;

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile || !thumbnailFile) {
        return res.status(500).json(new ApiError(500, "Error occurred while uploading files to Cloudinary"));
    }

    const document = await Video.create({
        videoFile: videoFile.url,
        title: title,
        description: description,
        thumbnail: thumbnailFile.url,
        owner: req.user?._id,
        duration: videoFile.duration,
        ispublised: true
    });

    return res.status(201).json(
        new ApiResponse(200, document, "Successfully uploaded video")
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

     const video = await Video.findOne(
        {
        _id: videoId,
            owner: req.user._id
        }
     )
    
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
      
    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        return res.status(400).json(new ApiError(400, "Invalid video ID"))
    }

     const video = await Video.findOne(
        { 
          _id: videoId,
          owner: req.user._id
        }
     )

     if (!video) {
        return res.status(404).json(new ApiError(404, "could not find the requested video"))
     }

     if (video.owner.toString() !== req.user._id.toString()) {
          return res.status(403).json(new ApiError(403, " unauthorised request to delete this video" ))
     }

     const deleteResponse = await Video.deleteOne({ 
        _id: videoId,
        owner: req.user._id
    })

     if (!deleteResponse.acknowledged) {
        return res.status(500).json(new ApiError(500, " failed to delete Video "))
     }

     return res.status(200)
     .json(
        new ApiResponse(200, {}, " successfully deleted video ")
     )
}


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
     

export { 
    getAllVideos, 
    getSearchedVideos,
    uploadAVideo,
    updateVideo,
    deleteVideo,
    togglePublisedStatus,
    getVideoById,
    getUserVideos
}