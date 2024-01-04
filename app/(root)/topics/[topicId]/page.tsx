import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getCourseById } from "@/lib/actions/course.actions";
import { SearchParamProps } from "@/types";
import {CourseTable} from "@/components/CourseTable";
import {QuestionTable} from "@/components/QuestionTable";
import {IQuestion} from "@/lib/database/models/question.model";
import {getAnsweredQuestionsByTopic, getQuestionsByTopic} from "@/lib/actions/question.actions";
import dynamic from "next/dynamic";
import {TopicTable} from "@/components/TopicTable";
import {getTopicById, getTopicsByCourse} from "@/lib/actions/topic.actions";
import {ITopic} from "@/lib/database/models/topic.model";
import {currentUser} from "@clerk/nextjs";

const CourseDetails = async ({ params: { topicId } }: SearchParamProps) => {
    const RealtimeComponent = dynamic(() => import("@/components/RealtimeComponent"), {
        ssr: false
    })

    const user = await currentUser();
    const userId = user?.publicMetadata?.userId as string;
    const isAdmin = user?.publicMetadata.isAdmin as boolean || false;
    console.log(userId)

    const topic = await getTopicById(topicId);
    const questions: IQuestion[] = isAdmin ? await getQuestionsByTopic(topicId) :  await getAnsweredQuestionsByTopic(topicId, userId);
    const course = await topic.course;

    return (
<>
    <Box bgcolor={"primary.light"} className={"bg-dotted-pattern bg-cover bg-center py-5 md:py-5 text-center sm:text-left"} component={"section"}>
        <Box className={"wrapper"}>
            <Typography variant={"h3"} className={""} fontWeight={"bold"}>{course.code}: {course.title}</Typography>
            <Typography variant={"h4"} className={""} fontWeight={"bold"}>{topic.name}</Typography>
        </Box>
    </Box>

    <Box id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <RealtimeComponent>
        <QuestionTable topicId={topicId} questions={questions}/>
        </RealtimeComponent>
    </Box>
</>
    )
}

export default CourseDetails;