import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getCourseById } from "@/lib/actions/course.actions";
import { SearchParamProps } from "@/types";
import {CourseTable} from "@/components/CourseTable";
import {QuestionTable} from "@/components/QuestionTable";
import {IQuestion} from "@/lib/database/models/question.model";
import {getQuestionsByCourse} from "@/lib/actions/question.actions";

const CourseDetails = async ({ params: { courseId } }: SearchParamProps) => {
    const course = await getCourseById(courseId);
    const questions: IQuestion[] = await getQuestionsByCourse(courseId);

    return (
<>
    <Box bgcolor={"primary.light"} className={"bg-dotted-pattern bg-cover bg-center py-5 md:py-5 text-center sm:text-left"} component={"section"}>
        <Box className={"wrapper"}>
            <Typography variant={"h3"} className={""} fontWeight={"bold"}>{course.code}: {course.title}</Typography>
        </Box>
    </Box>

    <Box id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <QuestionTable courseId={courseId} questions={questions}/>
    </Box>
</>
    )
}

export default CourseDetails;