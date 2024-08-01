import mongoose, {InferSchemaType, model, Schema } from "mongoose";

const itemSchema= new Schema({
    name:{type:String,required:true},
    stock:{type:Number,required:true},
    price:{type:Number,required:true}
})

const tableSchema= new Schema({
    tableName: {type: String,required: true},
    owner: {type:Schema.Types.ObjectId,ref: "Users",required: true},
    items: [{type: itemSchema,required:true,validate: [arrayLimit, '{PATH} excede el límite de 10 elementos']}]
})
function arrayLimit(val:Array<object>) {
    return val.length <= 50;
}
type Table = InferSchemaType<typeof tableSchema>
export default model<Table>("Tables",tableSchema)