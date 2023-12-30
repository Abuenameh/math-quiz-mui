import {Schema, Document, models, model} from "mongoose";

export interface IType extends Document {
    _id: string;
    name: string;
}

const TypeSchema = new Schema({
    name: { type: String, required: true, unique: true },
})

const Type = models.Type || model("Type", TypeSchema);

export default Type;