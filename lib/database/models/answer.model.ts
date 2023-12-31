import {model, models, Schema, Types} from "mongoose";

export interface IAnswer {
    _id: Types.ObjectId;
    question: string;
    answers: string[];
    mark: number;
}

const AnswerSchema = new Schema({
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    answers: { type: [String], required: true },
    mark: { type: Number, required: true },
});

const Answer = models.Answer || model("Answer", AnswerSchema);

export default Answer;
