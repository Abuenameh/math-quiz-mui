import {CourseTable} from "@/components/CourseTable";
import {getAllCourses} from "@/lib/actions/course.actions";
// import {Box, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// import {DataTableDemo} from "@/components/shared/DataTableDemo.tsx.bak";

const CoursesPage = async () => {
    const courses = await getAllCourses();

    return (
        <>
                <Box bgcolor={"primary.light"} className={"bg-dotted-pattern bg-cover bg-center py-5 md:py-5 text-center sm:text-left"} component={"section"}>
                    <Box className={"wrapper"}>
<Typography variant={"h3"} className={""} fontWeight={"bold"}>Courses</Typography>
                    </Box>
                </Box>

            <Box id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
                <CourseTable courses={courses}/>
            </Box>
        </>
    );
};

export default CoursesPage;