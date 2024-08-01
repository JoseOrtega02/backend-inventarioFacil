import { RequestHandler } from "express";
import createHttpError from "http-errors";
import tableModel from "../models/tableModel.js";
import { verifyUser } from "../../utils/verifyUser.js";
import { validateSchema } from "../../utils/utils.js";
import { createTableSchema, deleteTableSchema, getTablesSchema, updateTableSchema } from "../zodSchemas/tablesZodSchemas.js";
import userModel from "../../Users/models/userModel.js";
import mongoose from "mongoose";

interface createTableBody{
    tableName:string,
    userId:string,
}
export const createTable:RequestHandler<unknown,unknown,createTableBody,unknown> =async (req,res,next) =>{
    const tableName = req.body.tableName
    const userId = req.session.userId
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        if(!tableName || !userId){
            throw createHttpError(400,"missing parameters")
        }
        validateSchema(createTableSchema,{tableName:tableName,userId:userId})
        await verifyUser(userId)
        const user=  await userModel.findById(userId).session(session).exec()
        const newTable = await tableModel.create({
            tableName: tableName,
            owner: user?._id,
            items: []
        })
        user?.tables.push(newTable._id)
        await user?.save({session})
        await session.commitTransaction();
        session.endSession();
        res.status(200).json(newTable)
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error)
    }
}

interface deleteBody{
    tableId:string,
    userId:string
}

export const deleteTable:RequestHandler<unknown,unknown,deleteBody,unknown> =async (req,res,next) =>{
    const tableId = req.body.tableId
    const userId = req.session.userId
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        validateSchema(deleteTableSchema,{tableId:tableId,userId:userId})
        const user =  await verifyUser(userId)
        const table =await tableModel.findById(tableId).session(session).exec()
        if(!table){
            throw createHttpError(404,"table not found")
        }
        user.tables.splice(user.tables.findIndex((id)=>{
            return id === table._id
        }))
        table.deleteOne().session(session).exec()
        user.save({session})
        table.save({session})
        await session.commitTransaction();
        session.endSession();
        res.status(200).send("table deleted succesfully")
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error)
    }
}
interface getTablesBody{
    userId: string
}

export const getTables:RequestHandler<unknown,unknown,getTablesBody,unknown>= async(req,res,next)=>{
    const userId= req.session.userId
    try {
        validateSchema(getTablesSchema,{userId:userId})
        const user= await verifyUser(userId)
        const tables = user.tables
        res.status(200).json(tables)
    } catch (error) {
        next(error)
    }
}

interface updateTableBody {
    tableId:string,
    userId:string,
    newTable: {
        tableName:string,
        items: [object]
    }
}
export const updateTable:RequestHandler<unknown,unknown,updateTableBody,unknown> = async (req,res,next) =>{
    const tableId = req.body.tableId
    const userId = req.session.userId
    const newTable = req.body.newTable
    try {
        validateSchema(updateTableSchema,{...req.body,userId:userId})
        await verifyUser(userId)
        const table = await tableModel.findById(tableId).exec()
        if(!table){
            throw createHttpError(404,"table not found")
        }
        if (!newTable){
            throw createHttpError(400,"missing parameters")
        }
        const updatedTable = await tableModel.findOneAndUpdate(
            { _id: tableId },
            { $set: newTable },
            { new: true }
        ).exec();
        res.status(200).json(updatedTable)
    } catch (error) {
        next(error)
    }
}