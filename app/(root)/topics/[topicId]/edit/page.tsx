import {getCourseById} from "@/lib/actions/course.actions";
import {CourseForm} from "@/components/CourseForm";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {IQuestion} from "@/lib/database/models/question.model";
import {getQuestionById} from "@/lib/actions/question.actions";
import {QuestionForm} from "@/components/QuestionForm";
import {getTopicById} from "@/lib/actions/topic.actions";
import {TopicForm} from "@/components/TopicForm";

type EditTopicProps = {
    params: {
        topicId: string
    }
}

const EditTopic = async ({ params: { topicId } }: EditTopicProps) => {
    const topic = await getTopicById(topicId);
    const courseId = topic.courseId;

    return (
        <>
            <Box bgcolor={"primary.light"} className={"bg-dotted-pattern bg-cover bg-center py-5 md:py-5 text-center sm:text-left"} component={"section"}>
                <Box className={"wrapper"}>
                    <Typography variant={"h3"} className={""} fontWeight={"bold"}>Edit Topic</Typography>
                </Box>
            </Box>

            <Box className="wrapper my-8">
                <TopicForm
                    type="Edit"
                    courseId={courseId}
                    topic={topic}
                    topicId={topicId}
                />
            </Box>
        </>
    )
}

export default EditTopic