import {model, models, Schema, Types} from "mongoose";
import {IDeclaration} from "@/lib/database/models/declaration.model";
import {ICourse} from "@/lib/database/models/course.model";
import {ITopic} from "@/lib/database/models/topic.model";

export interface IQuestion {
    _id: Types.ObjectId;
    name: string;
    question: string;
    imageUrl?: string;
    imageKey?: string;
    showSolution: boolean;
    current: boolean;
    topic: Types.ObjectId | ITopic;
}

const QuestionSchema = new Schema({
    name: { type: String, required: true },
    question: { type: String, required: true },
    imageUrl: { type: String },
    imageKey: { type: String },
    showSolution: { type: Boolean, default: false },
    current: { type: Boolean, default: false },
    topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
})

const Question = models.Question || model("Question", QuestionSchema);

export default Question;