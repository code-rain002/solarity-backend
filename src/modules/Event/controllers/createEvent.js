import { query } from "express";
import { errorResponse, successResponse } from "../../../utils";
import EventModel from "../model";

export const createEventController = async (req, res, next) => {
  try {
    const {
      body: { title, image, friends, type, isPrivate},
    } = req;
    console.log("title,", title)
    console.log("title,", req.body)
    EventModel.create({
      title: title,
      image: image,
      type: type,
      creator: {
        avatar: "/images/library/temp/users/creator1.png",
        name: "monke DAO"
      },
      friends: friends,
      isPrivate: isPrivate
    });

    return successResponse({ res, response: { success: true } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
