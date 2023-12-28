import {getCourseById} from "@/lib/actions/course.actions";
import {CourseForm} from "@/components/CourseForm";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type UpdateCourseProps = {
    params: {
        id: string
    }
}

const UpdateCourse = async ({ params: { id } }: UpdateCourseProps) => {
    const course = await getCourseById(id)

    return (
        <>
            <Box bgcolor={"primary.light"} className={"bg-dotted-pattern bg-cover bg-center py-5 md:py-5 text-center sm:text-left"} component={"section"}>
                <Box className={"wrapper"}>
                    <Typography variant={"h3"} className={""} fontWeight={"bold"}>Update Course</Typography>
                </Box>
            </Box>

            <Box className="wrapper my-8">
                <CourseForm
                    type="Update"
                    course={course}
                    courseId={course._id}
                />
            </Box>
        </>
    )
}

export default UpdateCourse