import {model, models, Schema, Document} from "mongoose";

export interface ICourse extends Document {
    _id: string;
    code: string;
    title: string;
    questions: string[];
}

const CourseSchema = new Schema({
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    questions: { type: [Schema.Types.ObjectId], ref: "Question" },
})

const Course = models.Course || model("Course", CourseSchema);

export default Course;