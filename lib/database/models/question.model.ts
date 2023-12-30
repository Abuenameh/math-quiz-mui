import {model, models, Schema, Types} from "mongoose";

export interface IQuestion {
    _id: Types.ObjectId;
    // _id: string;
    // id: string;
    name: string;
    question: string;
    // answers: string[];
    // correctAnswer: string;
    declarations: string[][];
    course: string;
    // type: { _id: string; name: string; };
}

const QuestionSchema = new Schema({
    // id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    question: { type: String, required: true },
    // answers: { type: [String], required: true },
    // correctAnswer: { type: String, required: true },
    declarations: { type: [[String]], required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    // type: { type: Schema.Types.ObjectId, ref: "Type", required: true },
})

const Question = models.Question || model("Question", QuestionSchema);

export default Question;