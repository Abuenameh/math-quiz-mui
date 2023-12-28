import {CourseForm} from "@/components/CourseForm";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// import {Box, Typography} from "@mui/material";

const CreateCourse = () => {
    return (
        <>
            <Box bgcolor={"primary.light"} className={"bg-dotted-pattern bg-cover bg-center py-5 md:py-5 text-center sm:text-left"} component={"section"}>
                <Box className={"wrapper"}>
                    <Typography variant={"h3"} className={""} fontWeight={"bold"}>Create Course</Typography>
                </Box>
            </Box>

            <Box className={"wrapper my-8"}>
                <CourseForm type={"Create"}/>
            </Box>
        </>
    );
};

export default CreateCourse;