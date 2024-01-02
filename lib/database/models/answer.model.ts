import {model, models, Schema, Types} from "mongoose";
import {IQuestion} from "@/lib/database/models/question.model";
import {IUser} from "@/lib/database/models/user.model";

export interface IAnswer {
    _id: Types.ObjectId;
    answers: Types.Map<{answer: string, correct: boolean, mark: number}>;
    question: Types.ObjectId | IQuestion;
    user: Types.ObjectId | IUser;
}

const AnswerSchema = new Schema({
    answers: { type: Map, of: {String, Boolean, Number}, required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Answer = models.Answer || model("Answer", AnswerSchema);

export default Answer;
