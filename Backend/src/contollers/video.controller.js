import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import uploadOnCloudinary from "../utils/clodinary.js"

const getAllVideos = async (req, res, next) => {
   
    const { page = 1, limit = 10, sortBy = "views", order = 1} = req.query

    const pageInt = parseInt(page)
    const limitInt = parseInt(limit)
    const skip = (pageInt - 1) * limitInt

    const validSortFields = [ "createdAt", "views", "title" ]
    const validsortBY = validSortFields.includes(sortBy)? sortBy : "views";
    const validOrder = order == -1 ? -1 : 1;

    const videos = await Video
    .find({
        ispublised: true
    })
    .sort({ [validsortBY]: validOrder})
    .skip(skip)
    .limit(limitInt)

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

    if (!query) {
        throw new ApiError(401, "Query is undefined")
    }

    const pageInt = parseInt(page)
    const limitInt = parseInt(limit)
    const skip = (pageInt - 1) * limitInt

    // Use regex for partial and case-insensitive matching
    const videos = await Video.find({
        title: { $regex: query, $options: "i" } // Case-insensitive search
    })
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
        throw new ApiError(401, "All video details (title, description, thumbnail, videoFile) are required");
    }

    const videoFileLocalPath = req.files.videoFile[0].path;
    const thumbnailLocalPath = req.files.thumbnail[0].path;

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile || !thumbnailFile) {
        throw new ApiError(402, "Error occurred while uploading files to Cloudinary");
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

    const { title } = req.params  // params used when we want to locate exact loaction                            
    const { newTitle, description } = req.body
    console.log(title);
    

    if( !newTitle || !description || !req.file){
    throw new ApiError(401, " All fields are required ")
    }

    const thumbnail = await uploadOnCloudinary(req.file.path)

    if (!thumbnail) {
        throw new ApiError(403, " Error occured while updating thumbail ")
    }
  
    
     const video = await Video.findOne(
        {
            title,
            owner: req.user._id
        }
     )
    
     if (!video) {
        throw new ApiError(401," Video does not exists ")
     }
     
     if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(401,"Unauthorised request")
     }

     video.title = newTitle
     video.description = description,
     video.thumbnail = thumbnail.path
     const updatedVideo = await video.save({ validateBeforeSave : false})
     

     return res.status(201)
     .json(
        new ApiResponse(200, updatedVideo, " successfully updated video ")
     )



}


const deleteVideo = async (req, res, next) => {
      
    const { title } = req.params

    if (!title) {
        throw new ApiError(403, "Give a valid Title")
    }
     
    console.log(title);
    console.log(req.user._id);
    
     const video = await Video.findOne(
        { 
          title,
          owner: req.user._id
        }
     )

     console.log(video);
     

     if (!video) {
        throw new ApiError(401, "could not find the requested video")
     }

     if (video.owner.toString() !== req.user._id.toString()) {
          throw new ApiError(401, " unauthorised request to delete this video" )
     }

     const deleteResponse = await Video.deleteOne({ 
        title, 
        owner: req.user._id
    })

     if (!deleteResponse.acknowledged) {
        throw new ApiError(401, " failed to delete Video ")
     }

     return res.status(200)
     .json(
        new ApiResponse(200, {}, " successfully deleted video ")
     )
}


const togglePublisedStatus = async (req, res, next) => {

    const { title } = req.params

    if (!title) {
        throw new ApiError(401, " Title is invalid ")
    }

    const video = await Video.findOne({
       title,
       owner: req.user._id
    })

    console.log(video);
    

    if (!video) {
        throw new ApiError(401, " unable to find video ")
    }

    video.ispublised = !video.ispublised
    const updatedVideo = await video.save({validateBeforeSave: false})

    return res.status(201)
        .json(
           new ApiResponse(200, updatedVideo, " succesfully toggled publish status ")
        )
    
}

export { 
    getAllVideos, 
    getSearchedVideos,
    uploadAVideo,
    updateVideo,
    deleteVideo,
    togglePublisedStatus 
}