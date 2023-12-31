import {model, models, Schema, Types} from "mongoose";
import {IDeclaration} from "@/lib/database/models/declaration.model";

export interface IQuestion {
    _id: Types.ObjectId;
    // _id: string;
    // id: string;
    name: string;
    question: string;
    // answers: string[];
    // correctAnswer: string;
    declarations: (Types.ObjectId | IDeclaration)[];
    course: Types.ObjectId;
    // type: { _id: string; name: string; };
}

const QuestionSchema = new Schema({
    // id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    question: { type: String, required: true },
    // answers: { type: [String], required: true },
    // correctAnswer: { type: String, required: true },
    declarations: [{ type: Schema.Types.ObjectId, ref: "Declaration", required: true }],
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    // type: { type: Schema.Types.ObjectId, ref: "Type", required: true },
})

const Question = models.Question || model("Question", QuestionSchema);

export default Question;