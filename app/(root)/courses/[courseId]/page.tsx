import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {getCourseById} from "@/lib/actions/course.actions";
import {SearchParamProps} from "@/types";
import {TopicTable} from "@/components/TopicTable";
import {getTopicsByCourse} from "@/lib/actions/topic.actions";
import {ITopic} from "@/lib/database/models/topic.model";

const CourseDetails = async ({params: {courseId}}: SearchParamProps) => {
    const course = await getCourseById(courseId);
    const topics: ITopic[] = await getTopicsByCourse(courseId);

    return (
        <>
            <Box bgcolor={"primary.light"}
                 className={"bg-dotted-pattern bg-cover bg-center py-5 md:py-5 text-center sm:text-left"}
                 component={"section"}>
                <Box className={"wrapper"}>
                    <Typography variant={"h3"} className={""}
                                fontWeight={"bold"}>{course.code}: {course.title}</Typography>
                </Box>
            </Box>

            <Box id="topics" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
                <TopicTable topics={topics}/>
            </Box>
        </>
    )
}

export default CourseDetails;