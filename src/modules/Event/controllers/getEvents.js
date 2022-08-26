import { query } from "express";
import { errorResponse, successResponse } from "../../../utils";
import EventModel from "../model";

export const getEventsController = async (req, res) => {
  try {
    const {
      query: { isPrivate },
    } = req;
    console.log(req.query);
    const data = await EventModel.find();
    return successResponse({ res, response: { data } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
