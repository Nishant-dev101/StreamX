import mongoose from "mongoose";
import { comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getAllComments = async (req, res, next) => {
  const { videoId } = req.params;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(401, "Invalid Request");
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
    },
  ]);

  if (!comments) {
    throw new ApiError(402, "something went wrong while fetching comments");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, comments, "succesfully fetched the comments"));
};




const AddComment = async (req, res, next) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(401, "Invalid Request");
  }

  if (!content) {
    throw new ApiError(402, "Comment should have a content");
  }

  const createdComment = await comment.create({
    content,
    owner: req.user._id,
    video: videoId,
  });

  if (!createdComment) throw new ApiError(402, "failed to create comment");

  return res
    .status(200)
    .json(new ApiResponse(201, createdComment, "succesfully added Comment"));
};



const updateComment = async (req, res, next) => {
  const { videoId } = req.params;
  const { newContent } = req.body;

  if (!videoId && !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(403, "Invalid Request");
  }

  if (!newContent) throw new ApiError(402, "Comment should contain content");

  const foundComment = await comment.findOne({
    video: videoId,
    owner: req.user._id,
  });

  if (!foundComment) {
    throw new ApiError(402, "You are unauthorised to update Comment");
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
    throw new ApiError(402, "Invalid Request");
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
    throw new ApiError(402, "you are unauthorised to delete Comment");

  return res
    .status(200)
    .json(
      new ApiResponse(201, foundcomment, "succesfully deleted the comment"),
    );
};



export { getAllComments, deleteComment, updateComment, AddComment };
