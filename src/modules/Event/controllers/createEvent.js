import { query } from "express";
import { errorResponse, successResponse } from "../../../utils";
import EventModel from "../model";

export const createEventController = async (req, res, next) => {
  try {
    const {
      body: { title, image, friends, type, isPrivate, creator},
    } = req;
    console.log("creator,", creator)
    EventModel.create({
      title: title,
      image: image,
      type: type,
      creator: creator,
      friends: friends,
      isPrivate: isPrivate
    });

    return successResponse({ res, response: { success: true } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
