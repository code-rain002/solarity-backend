import { query } from "express";
import { errorResponse, successResponse } from "../../../utils";
import EventModel from "../model";

export const createEventController = async (req, res, next) => {
  try {
    const {
      body: { title, image, friends},
    } = req;
    
    EventModel.create({
      title: title,
      image: image,
      creator: {
        avatar: "/images/library/temp/users/creator1.png",
        name: "monke DAO"
      },
      friends: [
        {
            avatar: "/images/library/temp/users/user1.png",
            name: "Meta",
        }, {
            avatar: "/images/library/temp/users/user2.png",
            name: "Rocco",
        }, {
            avatar: "/images/library/temp/users/user3.png",
            name: "Beka",
        }, {
            avatar: "/images/library/temp/users/user4.png",
            name: "Supa",
        }, {
            avatar: "/images/library/temp/users/user5.png",
            name: "Bella",
        },
      ],
    });

    return successResponse({ res, response: { success: true } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
