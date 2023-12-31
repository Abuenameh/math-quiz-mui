import {getCourseById} from "@/lib/actions/course.actions";
import {CourseForm} from "@/components/CourseForm";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {IQuestion} from "@/lib/database/models/question.model";
import {getQuestionById, getQuestionsByCourse} from "@/lib/actions/question.actions";
import {QuestionForm} from "@/components/QuestionForm";

type EditQuestionProps = {
    params: {
        courseId: string
        questionId: string
    }
}

const EditCourse = async ({ params: { questionId } }: EditQuestionProps) => {
    const question = await getQuestionById(questionId);
    const courseId = question.courseId;

    return (
        <>
            <Box bgcolor={"primary.light"} className={"bg-dotted-pattern bg-cover bg-center py-5 md:py-5 text-center sm:text-left"} component={"section"}>
                <Box className={"wrapper"}>
                    <Typography variant={"h3"} className={""} fontWeight={"bold"}>Edit Question</Typography>
                </Box>
            </Box>

            <Box className="wrapper my-8">
                <QuestionForm
                    type="Edit"
                    courseId={courseId}
                    question={question}
                    questionId={questionId}
                />
            </Box>
        </>
    )
}

export default EditCourse