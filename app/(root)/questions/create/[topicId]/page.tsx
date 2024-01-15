import {QuestionForm} from "@/components/QuestionForm";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {SearchParamProps} from "@/types";
import {getNextQuestionNumber} from "@/lib/actions/question.actions";
// import {Box, Typography} from "@mui/material";

const CreateQuestion = async ({params: {topicId}}: SearchParamProps) => {
    const num = await getNextQuestionNumber(topicId);

    return (
        <>
            <Box bgcolor={"primary.light"}
                 className={"bg-dotted-pattern bg-cover bg-center py-5 md:py-5 text-center sm:text-left"}
                 component={"section"}>
                <Box className={"wrapper"}>
                    <Typography variant={"h3"} className={""} fontWeight={"bold"}>Create Question</Typography>
                </Box>
            </Box>

            <Box className={"wrapper my-8"}>
                <QuestionForm type={"Create"} topicId={topicId} num={num}/>
            </Box>
        </>
    );
};

export default CreateQuestion;