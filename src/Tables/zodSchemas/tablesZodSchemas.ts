import {z} from "zod"
import { itemSchema } from "./itemsZodSchemas.js";
const objectIdRegex = /^[a-fA-F0-9]{24}$/;
export const createTableSchema = z.object({
    tableName: z.string().min(1,{ message: "Must not be empty" }).max(15,{message: "must be less than 15 characters"}),
    userId: z.string().regex(objectIdRegex,{message: "invalid Id"})
})
export const deleteTableSchema = z.object({
    tableId: z.string().regex(objectIdRegex,{message: "invalid Id"}),
    userId: z.string().regex(objectIdRegex,{message: "invalid Id"})
})
export const getTablesSchema = z.object({
    userId: z.string().regex(objectIdRegex,{message: "invalid Id"})
})
export const updateTableSchema =z.object({
    tableId: z.string().regex(objectIdRegex,{message: "invalid Id"}),
    userId: z.string().regex(objectIdRegex,{message: "invalid Id"}),
    newTable:z.object({
        tableName: z.string().min(1,{ message: "Must not be empty" }).max(15,{message: "must be less than 15 characters"}),
        items: z.array(itemSchema)
    })
})