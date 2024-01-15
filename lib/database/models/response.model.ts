import {model, models, Schema, Types} from "mongoose";
import {IQuestion} from "@/lib/database/models/question.model";
import {IUser} from "@/lib/database/models/user.model";

export interface IResponse {
    _id: Types.ObjectId;
    id: string;
    response: string;
    answer: string;
    jsonResponse: string;
    jsonAnswer: string;
    // correct: boolean;
    mark: number;
    question: Types.ObjectId | IQuestion;
    user: Types.ObjectId | IUser;
}

const ResponseSchema = new Schema({
    id: {type: String, required: true},
    response: {type: String},
    answer: {type: String, required: true},
    jsonResponse: {type: String},
    jsonAnswer: {type: String, required: true},
    // correct: {type: Boolean, default: false},
    mark: {type: Number, default: 0},
    question: {type: Schema.Types.ObjectId, ref: "Question", required: true},
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
});

const Response = models.Response || model("Response", ResponseSchema);

export default Response;
