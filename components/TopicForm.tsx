'use client'

import {ICourse} from "@/lib/database/models/course.model";
import {FormContainer, TextFieldElement, useForm, useFormState} from "react-hook-form-mui";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";
import {createCourse, editCourse} from "@/lib/actions/course.actions";
import Box from "@mui/material/Box";
import {Types} from "mongoose";
import {createTopic, editTopic} from "@/lib/actions/topic.actions";
import {ITopic} from "@/lib/database/models/topic.model";
import {useUser} from "@clerk/nextjs";

type TopicFormProps = {
    type: "Create" | "Edit"
    courseId: string
    topic?: ITopic,
    topicId?: string
}

type TopicProps = {
    num: number,
    name: string,
    description: string,
}

export const TopicForm = ({ type, courseId, topic, topicId }: TopicFormProps) => {
    const router = useRouter();
    const { user } = useUser();
    const formContext = useForm<TopicProps>({
        defaultValues: {
            num: topic?.num || undefined,
            name: topic?.name || "",
            description: topic?.description || "",
        },
    });
    const { reset} = formContext;
    const { isSubmitting } = useFormState(formContext);

    const isAdmin = user?.publicMetadata.isAdmin as boolean || false;

    if (!isAdmin) {
        router.push(`/courses/${courseId}`);
        return <></>;
    }

    const onSubmit = async (data: TopicProps) => {
        if (type === "Create") {
            try {
                const newTopic = await createTopic({
                    topic: { ...data, course: courseId },
                    path: "/courses/${courseId}",
                });

                if (newTopic) {
                    // reset();
                    router.push(`/courses/${courseId}`);
                }
            } catch (error) {
                console.log(error)
            }
        }

        if (type === "Edit") {
            if (!topicId) {
                router.back();
                return;
            }

            try {
                const editedTopic = await editTopic({
                    topic: { _id: topicId, ...data },
                    path: `/courses/${courseId}`
                });

                if (editedTopic) {
                    // reset();
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
        <FormContainer formContext={formContext} onSuccess={onSubmit}>
            <Stack spacing={3}>
                <Box className={"flex flex-col gap-5 md:flex-row"}>
                    <Box className={"w-50"}>
                        <TextFieldElement name={"num"} label={"Topic number"} required/>
                    </Box>
                    <Box className={"w-full"}>
                        <TextFieldElement fullWidth name={"name"} label={"Topic name"} required/>
                    </Box>
                </Box>
                <Box className={"w-full"}>
                    <TextFieldElement fullWidth name={"description"} label={"Topic description"} multiline/>
                </Box>
                <Button disabled={isSubmitting} type={"submit"} variant={"contained"} size={"large"}
                        className={"button col.span-2 w-full"}>
                    {isSubmitting ? "Submitting..." : `${type} Topic`}
                </Button>
            </Stack>
        </FormContainer>
        </>
    )
};