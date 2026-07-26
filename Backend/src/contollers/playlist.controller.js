import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"



const createPlaylist = async (req, res) => {
    
    const {name, description} = req.body

    if (!name) {
        throw new ApiError(401, "Playlist name is required")
    }

        const playlist =  await Playlist.create({
        name,
        description,
        owner: req.user?._id,
        videos: [] // Default value for videos
    })
   
    

    if (!playlist) {
        throw new ApiError(403, "something went wrong while creating playlist")
    }

    return res.status(200)
    .json(
        new ApiResponse(201, playlist, "successfully created the playlist")
    )
    
}

const getUserPlaylists = async (req, res) => {
  

    const playlists = await Playlist.find({
         owner : req.user._id
    })
    
    if (!playlists) {
        throw new ApiError(401, " something went wrong while creating playlist ")
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
        throw new ApiError(402, "Invalid request")
    }

    const playlist = await Playlist.findById(playlistId)

    console.log(playlist);
    
    if (!playlist) {
        throw new ApiError(402, "something went wrong while fetching the playlist")
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
        throw new ApiError(402, "Invalid Request")
    }
    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
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
        throw new ApiError(402, "Something went wrong while adding video to playlist")
    }
    
    return res.status(200)
    .json(
        new ApiResponse(201, playlist, "succesfully added video to playlist")
    )
}

const removeVideoFromPlaylist = async (req, res) => {
    const {playlistId, videoId} = req.params;

    if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId) || !videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(402, "Invalid Request");
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { videos: videoId } },
        { new: true } // Return the updated document
    );

    if (!playlist) {
        throw new ApiError(402, "Something went wrong while removing the video");
    }

    return res.status(200).json(
        new ApiResponse(201, playlist, "Successfully removed video from playlist")
    );
    // TODO: remove video from playlist

}

const deletePlaylist = async (req, res) => {
    const {playlistId} = req.params

 if(!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)){
    throw new ApiError(403, " Invalid Request ")
 }

 const deletedResponse = await Playlist.deleteOne({
    _id: playlistId
 })

 if(!deletedResponse){
    throw new ApiError(402, "something went wrong while deleting video")
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
        throw new ApiError(402, "Invalid Request")
    }
    if (!name || !description) {
        throw new ApiError(402, "All fields are required")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
              name,
              description

            }
        },
        { new: true}
    )

    if (!playlist) {
        throw new ApiError(402, "something went wrong while updating playlist")
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