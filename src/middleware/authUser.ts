import { RequestHandler } from "express";
import { MiddlewareOptions } from "mongoose";
import userModel from "../Users/models/userModel.js";
import createHttpError from "http-errors";
import { z } from "zod";
import { validateSchema } from "../utils/utils.js";
const objectIdRegex = /^[a-fA-F0-9]{24}$/;
export const userIdSchema = z.string().regex(objectIdRegex)

export const authUser:RequestHandler=async (req,res,next) =>{
    
    if (req.session.userId) {
        validateSchema(userIdSchema,req.session.userId)
        next();
    } else {
        next(createHttpError(401, "User not authenticated"));
    }
}