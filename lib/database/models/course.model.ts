import {model, models, Schema, Types} from "mongoose";

export interface ICourse {
    _id: Types.ObjectId;
    code: string;
    title: string;
    questions: Types.ObjectId[];
}

const CourseSchema = new Schema({
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    questions: { type: [Schema.Types.ObjectId], ref: "Question", required: true },
})

const Course = models.Course || model("Course", CourseSchema);

export default Course;