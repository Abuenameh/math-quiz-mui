import {model, models, Schema, Types} from "mongoose";
import {IQuestion} from "@/lib/database/models/question.model";

export interface IDeclaration {
    _id: Types.ObjectId;
    symbol: string;
    domain: string;
    question: Types.ObjectId | IQuestion;
}

const DeclarationSchema = new Schema({
    symbol: {type: String, required: true},
    domain: {type: String, required: true},
    question: {type: Schema.Types.ObjectId, ref: "Question", required: true},
})

const Declaration = models.Declaration || model("Declaration", DeclarationSchema);

export default Declaration;