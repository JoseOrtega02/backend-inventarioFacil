import createHttpError from "http-errors"
import userModel from "../Users/models/userModel.js"
import { Types } from "mongoose"


export const verifyUser = async (userId:Types.ObjectId | undefined) =>{
    const user= await  userModel.findById(userId).exec()
    if(!user){
        throw createHttpError(401,"Unauthorized")
    }else{
        return user
    }
}