'use client'

import {ICourse} from "@/lib/database/models/course.model";
import {FormContainer, TextFieldElement, useForm, useFormState} from "react-hook-form-mui";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";
import {createCourse, updateCourse} from "@/lib/actions/course.actions";

type CourseFormProps = {
    type: "Create" | "Update"
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

        if (type === "Update") {
            if (!courseId) {
                router.back();
                return;
            }

            try {
                const updatedCourse = await updateCourse({
                    course: { ...data, _id: courseId },
                    path: `/courses`
                });

                if (updatedCourse) {
                    reset();
                    router.back();
                    // router.push(`/courses/${updatedCourse._id}`);
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
            <div className={"flex flex-col gap-5 md:flex-row"}>
                <div className={"w-50"}>
                    <TextFieldElement validation={{ pattern: {value: /^[A-Z]{4}[0-9]{4}$/, message: "Please enter a valid course code"}}} name={"code"} label={"Course code"} required/>
                </div>
                <div className={"w-full"}>
                    <TextFieldElement fullWidth name={"title"} label={"Course title"} required/>
                </div>
            </div>
            <Button disabled={isSubmitting} type={"submit"} variant={"contained"} size={"large"} className={"button col.span-2 w-full"}>
                {isSubmitting ? "Submitting..." : `${type} Course`}
            </Button>
            </Stack>
        </FormContainer>
        </>
    )
};