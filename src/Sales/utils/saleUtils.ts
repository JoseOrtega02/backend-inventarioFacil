import mongoose, { ObjectId } from "mongoose";
import tableModel from "../../Tables/models/tableModel.js";
import { Sale, UserTotalSales } from "../models/saleModel.js";
interface IItem extends Document {
    name: string;
    stock: number;
    price: number;
    _id: mongoose.Types.ObjectId;
}

const getItem = async(itemId:string,table:any)=>{
    const itemIndex = table.items.findIndex((x: { _id: string; }) => x._id ==  itemId);
        const item = table.items[itemIndex] as unknown as IItem
        if (!item) throw new Error(`Item with id ${itemId} not found in table ${table._id}`);
        return item
}
const getTable= async (tableId:ObjectId,session:mongoose.ClientSession)=>{
    const table = await tableModel.findById(tableId).session(session);
    if (!table) throw new Error(`Table with id ${tableId} not found`);
    return table
}
export const processSale = async (saleItems:[],session:mongoose.ClientSession) => {
    let totalAmount = 0;

    for (const saleItem of saleItems) {
        const { tableId, itemId, quantity } = saleItem;

        // Find the table and the specific item
        const table = await getTable(tableId,session)

        const item = await getItem(itemId,table)

        // Check stock
        if (item.stock < quantity) throw new Error(`Insufficient stock for item ${itemId}`);

        // Update stock
        item.stock -= quantity;

        // Calculate total price for this item
        const itemTotal = item.price * quantity;
        totalAmount += itemTotal;

        // Update the item in the table
        await table.save({ session });
    }

    return totalAmount;
};

export const saveSale = async (ownerId: mongoose.Types.ObjectId | undefined, saleItems: [], totalAmount: number,session:mongoose.ClientSession) => {
    const saleItemsM = []
    for (const saleItem of saleItems) {
        const { tableId, itemId, quantity } = saleItem;
        const table = await getTable(tableId,session)
        const item = await getItem(itemId,table)
        const itemSave = {
            itemId: itemId,
            tableId: tableId,
            quantity: quantity,
            price: item.price
        }
        saleItemsM.push(itemSave)
    }
    const newSale = new Sale({ items: saleItemsM, totalAmount });

    // Find or create the user sales record
    let userSales = await UserTotalSales.findOne({ owner: ownerId }).session(session);
    if (!userSales) {
        userSales = new UserTotalSales({ owner: ownerId, sales: [] });
    }

    userSales.sales.push(newSale);
    await userSales.save({session});

    return newSale;
};

