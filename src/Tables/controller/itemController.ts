import { RequestHandler } from "express";
import tableModel from "../models/tableModel.js";
import createHttpError from "http-errors";
import { Types } from "mongoose";
import { validateSchema } from "../../utils/utils.js";
import { addItemSchema, deleteItemSchema, getItemSchema, updateItemSchema } from "../zodSchemas/itemsZodSchemas.js";
interface addItemBody{
    tableId:string,
    items:[]
}
export const addItem:RequestHandler<unknown,unknown,addItemBody,unknown> = async(req,res,next) =>{
    const tableId= req.body.tableId
    const items = req.body.items
    try {
        validateSchema(addItemSchema,req.body)
        const table = await tableModel.findById(tableId).exec()
        if (!table){
            throw createHttpError(404,"Table not found")
        }
        if (table.items.length + items.length > 10) {
            throw createHttpError(400, "Excediendo el límite de 10 elementos");
          }
      
          // Agregar nuevos items usando push para desencadenar las validaciones de Mongoose
          items.forEach(item => table.items.push(item));
          await table.save();
        res.status(200).json(table)
    } catch (error) {
        next(error)
    }
}
interface removeItemBody{
    itemId:string,
    tableId:string
}
export const removeItem:RequestHandler<unknown,unknown,removeItemBody,unknown> =async (req,res,next) =>{
    const itemId = req.body.itemId
    const objectId= new Types.ObjectId(itemId)
    const tableId = req.body.tableId
    try {
        validateSchema(deleteItemSchema,req.body)
        const table = await tableModel.findById(tableId).exec()
        if(!table) {
            throw createHttpError(404,"table not found")
        }
        table.items.splice(table.items.findIndex((item)=> {return item._id?.equals(objectId)}))
        await table.save()
        res.status(200).send("Item removed succesfully")
    } catch (error) {
        next(error)
    }
}

interface updateItemBody{
    itemId:string,
    tableId:string,
    newItem:{
        name:string,
        stock:number,
        price:number
    }
}

export const updateItem:RequestHandler<unknown,unknown,updateItemBody,unknown> =async (req,res,next) =>{
    const {itemId,tableId,newItem} = req.body
    const objectId = new Types.ObjectId(itemId)
    try {
        validateSchema(updateItemSchema,req.body)
        const table = await tableModel.findById(tableId).exec()
        if(!table){
            throw createHttpError(404,"table not found")
        }
        const result = await tableModel.updateOne(
            { _id: tableId, "items._id": objectId },
            { $set: { "items.$": newItem } } 
        );
        
        if (result.modifiedCount === 0) {
            throw createHttpError(404, "item not found or not modified");
        }
        res.status(201).send("Item UpDATED SUCESSFULLY")
    } catch (error) {
        next(error)
    }
}
interface getItemsBody{
    tableId:string
}
export const getItems:RequestHandler<unknown,unknown,getItemsBody,unknown> = async (req,res,next) =>{
    const {tableId} = req.body
    try {
        validateSchema(getItemSchema,req.body)
        const table = await tableModel.findById(tableId).exec()
        if (!table){
            throw createHttpError(404,"Table not found")
        }
        res.status(200).json(table)
    } catch (error) {
        next(error)
    }
}