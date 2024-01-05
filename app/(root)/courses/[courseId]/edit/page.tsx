import {getCourseById} from "@/lib/actions/course.actions";
import {CourseForm} from "@/components/CourseForm";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type EditCourseProps = {
    params: {
        courseId: string
    }
}

const EditCourse = async ({params: {courseId}}: EditCourseProps) => {
    const course = await getCourseById(courseId)

    return (
        <>
            <Box bgcolor={"primary.light"}
                 className={"bg-dotted-pattern bg-cover bg-center py-5 md:py-5 text-center sm:text-left"}
                 component={"section"}>
                <Box className={"wrapper"}>
                    <Typography variant={"h3"} className={""} fontWeight={"bold"}>Edit Course</Typography>
                </Box>
            </Box>

            <Box className="wrapper my-8">
                <CourseForm
                    type="Edit"
                    course={course}
                    courseId={courseId}
                />
            </Box>
        </>
    )
}

export default EditCourse