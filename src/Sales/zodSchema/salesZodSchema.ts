import { z } from "zod";
const objectIdRegex = /^[a-fA-F0-9]{24}$/;
const itemSchemaSale = z.object({
  tableId: z.string().regex(objectIdRegex),
  itemId: z.string().regex(objectIdRegex),
  quantity: z.number().int().positive()
})
export const postSaleSchema = z.object({
  saleItems: z.array(itemSchemaSale).nonempty({ message: "Items can't be empty!" }),
  ownerId: z.string().regex(objectIdRegex)
})

