import {TopicForm} from "@/components/TopicForm";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {SearchParamProps} from "@/types";
// import {Box, Typography} from "@mui/material";

const CreateTopic = ({ params: { courseId } }: SearchParamProps) => {
    return (
        <>
            <Box bgcolor={"primary.light"} className={"bg-dotted-pattern bg-cover bg-center py-5 md:py-5 text-center sm:text-left"} component={"section"}>
                <Box className={"wrapper"}>
                    <Typography variant={"h3"} className={""} fontWeight={"bold"}>Create Topic</Typography>
                </Box>
            </Box>

            <Box className={"wrapper my-8"}>
                <TopicForm courseId={courseId} type={"Create"}/>
            </Box>
        </>
    );
};

export default CreateTopic;