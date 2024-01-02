'use server'

import {
    CreateCourseParams,
    CreateQuestionParams, CreateTopicParams,
    DeleteQuestionParams, DeleteTopicParams,
    EditCourseParams,
    EditQuestionParams, EditTopicParams
} from "@/types";
import {connectToDatabase} from "@/lib/database";
import Course, {ICourse} from "@/lib/database/models/course.model";
import {revalidatePath} from "next/cache";
import {handleError} from "@/lib/utils";
import Question from "@/lib/database/models/question.model";
import {Types} from "mongoose";
import Declaration, {IDeclaration} from "@/lib/database/models/declaration.model";
import {createDeclaration, deleteDeclaration} from "@/lib/actions/declaration.actions";
import Topic from "@/lib/database/models/topic.model";

export const createTopic = async ({ topic, path }: CreateTopicParams) => {
    try {
        await connectToDatabase();

        const newTopic = await Topic.create({...topic});
        revalidatePath(path)

        return JSON.parse(JSON.stringify(newTopic));
    } catch (error) {
        handleError(error);
    }
}

export async function getTopicById(topicId: string) {
    try {
        await connectToDatabase();

        const topic = await Topic.findById(topicId)
            .populate<{course: ICourse}>({path: "course", model: Course})

        if (!topic) {
            throw new Error('Topic not found');
        }

        return JSON.parse(JSON.stringify(topic));
    } catch (error) {
        handleError(error);
    }
}

export async function editTopic({ topic, path }: EditTopicParams) {
    try {
        await connectToDatabase()

        const topicToEdit = await Topic.findById(topic._id)
        if (!topicToEdit) {
            throw new Error('Topic not found')
        }
        console.log(topicToEdit)

        const editedTopic = await Topic.findByIdAndUpdate(
            topic._id,
            { ...topic },
            { new: true }
        )
        revalidatePath(path)

        return JSON.parse(JSON.stringify(editedTopic))
    } catch (error) {
        handleError(error)
    }
}

export async function getTopicsByCourse(courseId: string) {
    try {
        await connectToDatabase()

        const conditions = { course: courseId }

        const topicsQuery = Topic.find(conditions)
            .sort({ num: 'asc' })
            .populate<{course: ICourse}>({path: "course", model: Course})

        const topics = await topicsQuery;

        return JSON.parse(JSON.stringify(topics));
    } catch (error) {
        handleError(error)
    }
}

export async function deleteTopic({ topicId, path }: DeleteTopicParams) {
    try {
        await connectToDatabase()

        const deletedTopic = await Topic.findByIdAndDelete(topicId)
        if (deletedTopic) revalidatePath(path)
    } catch (error) {
        handleError(error)
    }
}
