import {model, models, Schema, Types} from "mongoose";

export interface IDeclaration {
    _id: Types.ObjectId;
    symbol: string;
    domain: string;
}

const DeclarationSchema = new Schema({
    symbol: String,
    domain: String,
})

const Declaration = models.Declaration || model("Declaration", DeclarationSchema);

export default Declaration;