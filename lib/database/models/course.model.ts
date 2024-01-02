import {model, models, Schema, Types} from "mongoose";

export interface ICourse {
    _id: Types.ObjectId;
    code: string;
    title: string;
}

const CourseSchema = new Schema({
    code: { type: String, required: true },
    title: { type: String, required: true },
})

const Course = models.Course || model("Course", CourseSchema);

export default Course;