import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    items: [
        {
            tableId: { type: mongoose.Schema.Types.ObjectId, required: true },
            itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

const userTotalSalesSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, required: true },
    sales: [saleSchema]
});

export const Sale = mongoose.model('Sale', saleSchema);
export const UserTotalSales = mongoose.model('UserTotalSales', userTotalSalesSchema);
