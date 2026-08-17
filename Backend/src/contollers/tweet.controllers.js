import mongoose from "mongoose";
import { tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const createTweet = async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;

  if (!content) return res.status(403).json(new ApiError(403, "content should not be empty"));

  const createdtweet = await tweet.create({
    content,
    owner: req.user._id,
  });

  if (!createdtweet) {
    return res.status(402).json(new ApiError(402, "something went wrong"));
  }

  return res
    .status(202)
    .json(new ApiResponse(201, createdtweet, "successfully created tweet"));
};



const getUserTweets = async (req, res) => {
  // TODO: get user tweets

  const tweets = await tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user._id),
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
              coverImage: 1,
            },
          },
        ],
      },
    },
  ]);

  if (!tweets) {
    return res.status(402).json(new ApiError(402, "could not find the tweets"));
  }

  return res
    .status(200)
    .json(new ApiResponse(201, tweets, "succesfully fetched all tweets"));
};




const updateTweet = async (req, res) => {
  const { tweetId } = req.params;
  const { newContent } = req.body;

  if (!tweetId || !mongoose.Types.ObjectId.isValid(tweetId)) {
    return res.status(402).json(new ApiError(402, "Invalid request"));
  }

   const foundTweet = await tweet.findById(tweetId)

   if (!foundTweet) {
     return res.status(404).json(new ApiError(404, "requested Tweet does not exists"));
   }

   if (foundTweet.owner.toString() !== (req.user._id).toString()) {
    return res.status(403).json(new ApiError(403, "unauthorised Request"));
   }
  const updatedTweet = await tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content: newContent,
      },
    },
    { new: true },
  );

  if (!updatedTweet) {
    return res.status(402).json(new ApiError(402, "something went wrong while updating tweet"));
  }

  return res
    .status(200)
    .json(new ApiResponse(201, updatedTweet, "succesfully updated the tweet"));
};



const deleteTweet = async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  if (!tweetId || !mongoose.Types.ObjectId.isValid(tweetId)) {
    return res.status(402).json(new ApiError(402, "Invalid request"));
  }

  const foundTweet = await tweet.findById(tweetId)

   if (!foundTweet) {
     return res.status(404).json(new ApiError(404, "requested Tweet does not exists"));
   }
   
   if (foundTweet.owner.toString() !== (req.user._id).toString()) {
    return res.status(403).json(new ApiError(403, "unauthorised Request"));
   }

  const deletedResponse = await tweet.findByIdAndDelete(tweetId);

  if (!deletedResponse) {
    return res.status(404).json(new ApiError(404, "somethinng went wrong"));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(201, deletedResponse, "succesfully deleted the tweet"),
    );
};

export { 
    createTweet,
    getUserTweets, 
    updateTweet, 
    deleteTweet 
   }
