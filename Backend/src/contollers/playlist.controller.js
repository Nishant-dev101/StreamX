import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"



const createPlaylist = async (req, res) => {
    
    const {name, description} = req.body

    if (!name) {
        return res.status(400).json(new ApiError(400, "Playlist name is required"))
    }

        const playlist =  await Playlist.create({
        name,
        description,
        owner: req.user?._id,
        videos: [] // Default value for videos
    })
   
    

    if (!playlist) {
        return res.status(500).json(new ApiError(500, "something went wrong while creating playlist"))
    }

    return res.status(200)
    .json(
        new ApiResponse(201, playlist, "successfully created the playlist")
    )
    
}

const getUserPlaylists = async (req, res) => {
  

        const playlists = await Playlist.find({
            owner : req.user._id
        }).populate({
           path: "videos",
           populate: { path: "owner", select: "avatar userName fullName" }
        })
    
    if (!playlists) {
        return res.status(500).json(new ApiError(500, " something went wrong while creating playlist "))
    }

    return res.status(200)
    .json(
            new ApiResponse(201,playlists, "succesfully fetched playlists" )
        )

    //TODO: get user playlists
}

const getPlaylistById = async (req, res) => {
   
    const {playlistId} = req.params
   
    if(!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)){
        return res.status(400).json(new ApiError(400, "Invalid request"))
    }

    const playlist = await Playlist.findOne({
        _id: playlistId,
        owner: req.user._id
    }).populate({
        path: "videos",
        populate: { path: "owner", select: "avatar userName fullName" }
    })

    console.log(playlist);
    
    if (!playlist) {
        return res.status(404).json(new ApiError(404, "something went wrong while fetching the playlist"))
    }


    return res.status(200)
    .json(
        new ApiResponse(201, playlist, "succesfully fetched Playlist")
    )
}

const addVideoToPlaylist = async (req, res) => {
    const {playlistId, videoId} = req.params

    console.log(playlistId, videoId);
    
    
    if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId) || !videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
        return res.status(400).json(new ApiError(400, "Invalid Request"))
    }
        const playlist = await Playlist.findOneAndUpdate(
            { _id: playlistId, owner: req.user._id },
      {
        $addToSet: {
          videos: videoId
        },
      },
      {
        new: true,
      },
    );

    if (!playlist) {
        return res.status(404).json(new ApiError(404, "Something went wrong while adding video to playlist"))
    }
    
    return res.status(200)
    .json(
        new ApiResponse(201, playlist, "succesfully added video to playlist")
    )
}

const removeVideoFromPlaylist = async (req, res) => {
    const {playlistId, videoId} = req.params;

    if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId) || !videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
        return res.status(400).json(new ApiError(400, "Invalid Request"));
    }

    const playlist = await Playlist.findOneAndUpdate(
        { _id: playlistId, owner: req.user._id },
        { $pull: { videos: videoId } },
        { new: true } // Return the updated document
    );

    if (!playlist) {
        return res.status(404).json(new ApiError(404, "Something went wrong while removing the video"));
    }

    return res.status(200).json(
        new ApiResponse(201, playlist, "Successfully removed video from playlist")
    );
    // TODO: remove video from playlist

}

const deletePlaylist = async (req, res) => {
    const {playlistId} = req.params

 if(!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)){
    return res.status(400).json(new ApiError(400, " Invalid Request "))
 }

 const deletedResponse = await Playlist.deleteOne({
     _id: playlistId,
     owner: req.user._id
 })

 if(!deletedResponse){
    return res.status(500).json(new ApiError(500, "something went wrong while deleting video"))
 }
 
 return res.status(200)
 .json(
    new ApiResponse(201, [], "succesfully deleted the playlist")
 )
    // TODO: delete playlist
}

const updatePlaylist = async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    
    if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
        return res.status(400).json(new ApiError(400, "Invalid Request"))
    }
    if (!name || !description) {
        return res.status(400).json(new ApiError(400, "All fields are required"))
    }

    const playlist = await Playlist.findOneAndUpdate(
        { _id: playlistId, owner: req.user._id },
        {
            $set: {
              name,
              description

            }
        },
        { new: true}
    )

    if (!playlist) {
        return res.status(404).json(new ApiError(404, "something went wrong while updating playlist"))
    }

    return res.status(200)
    .json(
        new ApiResponse(201, playlist, "succesfully Updated the playlist")
    )

}

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}