'use client'

import {ICourse} from "@/lib/database/models/course.model";
import {FormContainer, TextFieldElement, useForm, useFormState} from "react-hook-form-mui";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";
import {createCourse, editCourse} from "@/lib/actions/course.actions";
import Box from "@mui/material/Box";

type CourseFormProps = {
    type: "Create" | "Edit"
    course?: ICourse,
    courseId?: string
}

type CourseProps = {
    code: string,
    title: string,
}

export const CourseForm = ({ type, course, courseId }: CourseFormProps) => {
    const router = useRouter();
    const { reset, control } = useForm();
    const { isSubmitting } = useFormState({control});

    const onSubmit = async (data: CourseProps) => {
        if (type === "Create") {
            try {
                const newCourse = await createCourse({
                    course: { ...data },
                    path: "/courses",
                });

                if (newCourse) {
                    reset();
                    router.push(`/courses/${newCourse._id}`);
                }
            } catch (error) {
                console.log(error)
            }
        }

        if (type === "Edit") {
            if (!courseId) {
                router.back();
                return;
            }

            try {
                const editedCourse = await editCourse({
                    course: { ...data, _id: courseId },
                    path: `/courses`
                });

                if (editedCourse) {
                    reset();
                    router.back();
                    // router.push(`/courses/${editedCourse._id}`);
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <>
        <FormContainer defaultValues={{code: course ? course.code : "", title: course ? course.title : ""}} onSuccess={onSubmit}>
            <Stack spacing={3}>
                <Box className={"flex flex-col gap-5 md:flex-row"}>
                    <Box className={"w-50"}>
                        <TextFieldElement validation={{
                            pattern: {
                                value: /^[A-Z]{4}[0-9]{4}$/,
                                message: "Please enter a valid course code"
                            }
                        }} name={"code"} label={"Course code"} required/>
                    </Box>
                    <Box className={"w-full"}>
                        <TextFieldElement fullWidth name={"title"} label={"Course title"} required/>
                    </Box>
                </Box>
                <Button disabled={isSubmitting} type={"submit"} variant={"contained"} size={"large"}
                        className={"button col.span-2 w-full"}>
                    {isSubmitting ? "Submitting..." : `${type} Course`}
                </Button>
            </Stack>
        </FormContainer>
        </>
    )
};