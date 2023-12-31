import {model, models, Schema, Types} from "mongoose";
import {IAnswer} from "@/lib/database/models/answer.model";

export interface IUser {
    _id: Types.ObjectId;
    clerkId: string;
    username: string;
    firstName: string;
    lastName: string;
    photo: string;
    answers: IAnswer[];
}

const UserSchema = new Schema({
    clerkId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    photo: { type: String },
    answers: { type: Schema.Types.ObjectId, ref: "Answer" },
})

const User = models.User || model("User", UserSchema);

export default User;