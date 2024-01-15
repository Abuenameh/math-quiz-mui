import {model, models, Schema, Types} from "mongoose";
import {ITopic} from "@/lib/database/models/topic.model";

export interface IQuestion {
    _id: Types.ObjectId;
    num: number;
    name: string;
    question: string;
    layouts?: string;
    imageUrl?: string;
    imageKey?: string;
    showSolution: boolean;
    current: boolean;
    topic: Types.ObjectId | ITopic;
}

const QuestionSchema = new Schema({
    num: {type: Number, required: true},
    name: {type: String, required: true},
    question: {type: String, required: true},
    layouts: {type: String},
    imageUrl: {type: String},
    imageKey: {type: String},
    showSolution: {type: Boolean, default: false},
    current: {type: Boolean, default: false},
    topic: {type: Schema.Types.ObjectId, ref: "Topic", required: true},
})

const Question = models.Question || model("Question", QuestionSchema);

export default Question;