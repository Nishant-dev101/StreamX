import mongoose from "mongoose"



const commentSchema = mongoose.Schema({
   
   content: {
    type: String,
    required: true
   },
   video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video"
   },
   owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
   }

}, {timestamps: true})





export const comment = mongoose.model("Comment", commentSchema)