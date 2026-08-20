import mongoose from "mongoose";
import { comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";


const getAllComments = async (req, res, next) => {
  const { videoId } = req.params;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json( new  ApiError(400, "Invalid Request"))
  }

  const comments = await comment.aggregate([
    {
      $match: { video: new mongoose.Types.ObjectId(videoId) },
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
              fullName: 1,

              coverImage: 1,
              avatar: 1,
              userName: 1,
            },
          },
        ],
      },
    },{
      $sort: { createdAt: -1 },
    }
  ]);

  if (!comments) {
    return res.status(500).json(new ApiError(500, "something went wrong while fetching comments"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "succesfully fetched the comments"));
};




const AddComment = async (req, res, next) => {
  const { videoId } = req.params;
  const { content } = req.body;
  console.log("landed in add comment controller", req.body, content);

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json(new ApiError(400, "Invalid Request"));
  }

  if (!content) {
    return res.status(400).json(new ApiError(400, "Comment should have a content"));
  }

  const createdComment = await comment.create({
    content,
    owner: req.user._id,
    video: videoId,
  });

  if (!createdComment) return res.status(500).json(new ApiError(500, "failed to create comment"));

  return res
    .status(200)
    .json(new ApiResponse(201, createdComment, "succesfully added Comment"));
};



const updateComment = async (req, res, next) => {
  const { videoId } = req.params;
  const { newContent } = req.body;

  if (!videoId && !mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json(new ApiError(400, "Invalid Request"));
  }

  if (!newContent) return res.status(400).json(new ApiError(400, "Comment should contain content"));

  const foundComment = await comment.findOne({
    video: videoId,
    owner: req.user._id,
  });

  if (!foundComment) {
    return res.status(403).json(new ApiError(403, "You are unauthorised to update Comment"));
  }

  foundComment.content = newContent;

  const updatedComment = foundComment.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(201, updatedComment, "succesfully updated the comment"),
    );
};



const deleteComment = async (req, res, next) => {
  const { commentId } = req.params;

  if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json(new ApiError(400, "Invalid Request"));
  }

  const foundcomment = await comment.findOneAndDelete(
    {
      owner: req.user._id,
      _id: commentId,
    },
    {
      new: true,
    },
  );
  console.log(foundcomment);

  if (!foundcomment)
    return res.status(403).json(new ApiError(403, "you are unauthorised to delete Comment"));

  return res
    .status(200)
    .json(
      new ApiResponse(201, foundcomment, "succesfully deleted the comment"),
    );
};



export { getAllComments, deleteComment, updateComment, AddComment };
