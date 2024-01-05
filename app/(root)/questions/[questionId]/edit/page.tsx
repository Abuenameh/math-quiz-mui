import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {getQuestionById} from "@/lib/actions/question.actions";
import {QuestionForm} from "@/components/QuestionForm";

type EditQuestionProps = {
    params: {
        questionId: string
    }
}

const EditQuestion = async ({params: {questionId}}: EditQuestionProps) => {
    const question = await getQuestionById(questionId);
    const topicId = question.topicId;

    return (
        <>
            <Box bgcolor={"primary.light"}
                 className={"bg-dotted-pattern bg-cover bg-center py-5 md:py-5 text-center sm:text-left"}
                 component={"section"}>
                <Box className={"wrapper"}>
                    <Typography variant={"h3"} className={""} fontWeight={"bold"}>Edit Question</Typography>
                </Box>
            </Box>

            <Box className="wrapper my-8">
                <QuestionForm
                    type="Edit"
                    topicId={topicId}
                    question={question}
                    questionId={questionId}
                />
            </Box>
        </>
    )
}

export default EditQuestion