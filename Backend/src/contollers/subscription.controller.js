import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";


const toggleSubscription = async (req, res) => {
  
  const { channelId } = req.params;
  // TODO: toggle subscription

  const isSubscribed = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });

  if (!isSubscribed) {
    const response = await Subscription.create({
      channel: channelId,
      subscriber: req.user._id,
    });

    if (!response) throw new ApiError(402, "something went wrong");
    return res
      .status(200)
      .json(
        new ApiResponse(201, response, "succesfully toggled subscription")
      );
  
    } else {
    const response = await Subscription.deleteOne({
      channel: channelId,
      subscriber: req.user._id,
    });

    if (!response) throw new ApiError(402, "Somethimg went wrong");

    return res
      .status(200)
      .json(new ApiResponse(201, response, "succesfully toggled subscription"));
  }
};



// controller to return subscriber list of a channel


const getUserChannelSubscribers = async (req, res) => {
    
  const { channelId } = req.params;

    if (!channelId || !mongoose.Types.ObjectId.isValid(channelId)) {
       throw new ApiError(401, "Invalid Request")
    }

   const subscribers = await Subscription.aggregate([
     {
       $match: {
         channel: new mongoose.Types.ObjectId(channelId),
       },
     },
     {
       $lookup: {
         from: "users",
         localField: "subscriber",
         foreignField: "_id",
         as: "subscriber",
         pipeline: [
           {
             $project: {
               userName: 1,
               coverImage: 1,
               avatar: 1,
               email: 1,
             },
           },
         ],
       },
     },
     {
      $unwind: "$subscriber"
     },
      {
       $group: {
         _id: null,
         subscribers: { $push: "$subscriber" },
       },
     },
   ]);

    if(!subscribers) throw new ApiError(402, "something went wrong while fetching subscribers")

     return res
     .status(200)
     .json(
      new ApiResponse(201, subscribers[0].subscribers, "successfully fetched the subscribers ")
     )
};


// controller to return channel list to which user has subscribed

const getSubscribedChannels = async (req, res) => {
  

    const channelsSubscribedTo = await Subscription.aggregate([
      {
        $match: {
          subscriber: req.user?._id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "channel",
          foreignField: "_id",
          as: "channel",
          pipeline: [
            {
              $project: {
                coverImage: 1,
                avatar: 1,
                userName: 1,
                email: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$channel"
      },
      {
        $group: {
          _id: null,
          channelsSubscribedTo : { $push : "$channel"}
        }
      }
    ])

    if(!channelsSubscribedTo) throw new ApiError(402, "something went wrong")

      return res
      .status(200)
      .json(
        new ApiResponse(201, channelsSubscribedTo[0].channelsSubscribedTo, "successfully fetched subscribed channels")
      )

};

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
