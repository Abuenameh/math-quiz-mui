import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getCourseById } from "@/lib/actions/course.actions";
import { SearchParamProps } from "@/types";
import {CourseTable} from "@/components/CourseTable";
import {QuestionTable} from "@/components/QuestionTable";
import {IQuestion} from "@/lib/database/models/question.model";
import {getQuestionById} from "@/lib/actions/question.actions";
import {Math} from "@/components/Math";
import {Question} from "@/components/Question";
import dynamic from "next/dynamic";
import {currentUser} from "@clerk/nextjs";
import {getAnswerByQuestionAndUser} from "@/lib/actions/answer.actions";
import {IAnswer} from "@/lib/database/models/answer.model";
import {getDeclarationsByQuestion} from "@/lib/actions/declaration.actions";
import {IDeclaration} from "@/lib/database/models/declaration.model";

const QuestionPage = async ({ params: { questionId } }: SearchParamProps) => {
    const RealtimeComponent = dynamic(() => import("@/components/RealtimeComponent"), {
        ssr: false
    })
    const question = await getQuestionById(questionId);
    const topic = question.topic;
    const course = topic.course;

    const user = await currentUser();
    const userId = user?.publicMetadata.userId as string;
    // console.log("Clerk user",user)

    console.log("Question page")
    const declarations = await getDeclarationsByQuestion(questionId) as IDeclaration[];
    const answer = await getAnswerByQuestionAndUser(questionId, userId) as IAnswer;

    return (
<>
    <Box bgcolor={"primary.light"} className={"bg-dotted-pattern bg-cover bg-center py-5 md:py-5 text-center sm:text-left"} component={"section"}>
        <Box className={"wrapper"}>
            <Typography variant={"h3"} className={""} fontWeight={"bold"}>{course.code}: {course.title}</Typography>
            <Typography variant={"h4"} className={""} fontWeight={"bold"}>{topic.name}</Typography>
            <Typography variant={"h5"} className={""} fontWeight={"bold"}>{question.name}</Typography>
        </Box>
    </Box>

    <Box id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <RealtimeComponent>
        <Question question={question} declarations={declarations} answer={answer} userId={userId} isAdmin={user?.publicMetadata.isAdmin as boolean || false} isPowerPoint={user?.publicMetadata.isPowerPoint as boolean || false}/>
        </RealtimeComponent>
    </Box>
</>
    )
}

export default QuestionPage;