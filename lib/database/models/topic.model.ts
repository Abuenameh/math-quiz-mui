import {model, models, Schema, Types} from "mongoose";
import {ICourse} from "@/lib/database/models/course.model";

export interface ITopic {
    _id: Types.ObjectId;
    num: number;
    name: string;
    description?: string;
    course: Types.ObjectId | ICourse;
}

const TopicSchema = new Schema({
    num: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String },
    course: { type: Types.ObjectId, ref: "Course", required: true }
})

const Topic = models.Topic || model("Topic", TopicSchema);

export default Topic;