import mongoose from "mongoose"


const videoSchema = mongoose.Schema({
    videoFile:{
        type: String,
        required: true,  
    },
    videoFileHLS: {
        type:String,
        required: true
    },
    hlsVideoId :{
         type: String,
         required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true,  
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    ispublised: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

export const Video = mongoose.model("Video", videoSchema)