import {z} from "zod"
export const itemSchema = z.object({
    name: z.string().min(1,{message:"must not be empty"}).max(30,{message:"must be lower than 30 characters"}),
    price: z.number().nonnegative().finite(),
    stock: z.number().int().nonnegative().finite()
})
const objectIdRegex = /^[a-fA-F0-9]{24}$/;

export const addItemSchema= z.object({
    tableId: z.string().regex(objectIdRegex),
    items: z.array(itemSchema)
})
export const deleteItemSchema = z.object({
    tableId: z.string().regex(objectIdRegex),
    itemId:z.string().regex(objectIdRegex),
})
export const updateItemSchema = z.object({
    tableId: z.string().regex(objectIdRegex),
    itemId: z.string().regex(objectIdRegex),
    newItem: itemSchema
})
export const getItemSchema =z.object({
    tableId: z.string().regex(objectIdRegex),
})