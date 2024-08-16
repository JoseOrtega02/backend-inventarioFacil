import { RequestHandler } from "express";
import { processSale, saveSale } from "../utils/saleUtils.js";
import { verifyUser } from "../../utils/verifyUser.js";
import { UserTotalSales } from "../models/saleModel.js";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { validateSchema } from "../../utils/utils.js";
import { postSaleSchema } from "../zodSchema/salesZodSchema.js";

export const postSale:RequestHandler = async (req,res,next) =>{
    const {  saleItems } = req.body;
    const ownerId = req.session.userId
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        validateSchema(postSaleSchema,{saleItems:saleItems,ownerId:ownerId})
        if(saleItems.length <= 0){
            throw createHttpError(400,"items is empty")
        }
        
         // Process the sale
         const totalAmount = await processSale(saleItems,session);

         // Save the sale
         const newSale = await saveSale(ownerId, saleItems, totalAmount,session);
         await session.commitTransaction();
        session.endSession();
         res.status(201).json({ sale: newSale, totalAmount });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error)
    }finally {
        session.endSession();
    }
}
interface getSaleBody{
    userId:string
}
export const getSale:RequestHandler<unknown,unknown,getSaleBody,unknown> = async (req,res,next) =>{
    const userId = req.session.userId
    try {

        const user = await verifyUser(userId)
        const sale = await  UserTotalSales.findOne({owner:user._id}).exec()
        if (!sale){
            throw createHttpError(404,"Sales not found")
        }
        res.status(200).json(sale)
    } catch (error) {
        next(error)
    }
}

export const deleteSale:RequestHandler =async (req,res,next)=>{
    const userId = req.session.userId
    try {
        const user =await verifyUser(userId)
        const sale = await UserTotalSales.findOneAndDelete({owner:user._id})
        console.log(sale)
        if(!sale){
            throw createHttpError(500,"something went wrong")
        }
        res.status(200).send("Sales deleted succesfully")
    } catch (error) {
        next(error)
    }
}