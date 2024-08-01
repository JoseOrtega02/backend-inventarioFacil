import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    tables: {type: [{ type: Schema.Types.ObjectId, ref: "Tables", required: true }], validate: [arrayLimit, '{PATH} exceeds the limit of 3 tables']}
});

function arrayLimit(val: string | any[]) {
    console.log(val);
    return val.length <= 3;
}

type User = InferSchemaType<typeof userSchema>;

export default model<User>("Users", userSchema);

