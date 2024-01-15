'use server'

import {CreateResponseParams} from "@/types";
import {connectToDatabase} from "@/lib/database";
import Response from "@/lib/database/models/response.model";
import {handleError} from "@/lib/utils";
import Question, {IQuestion} from "@/lib/database/models/question.model";
import {ITopic} from "@/lib/database/models/topic.model";
import {ICourse} from "@/lib/database/models/course.model";

export const createResponse = async ({response}: CreateResponseParams) => {
    try {
        await connectToDatabase();

        // const conditions = {id: response.id, question: response.question, user: response.user}

        const newResponse = await Response.create({...response});
        // revalidatePath(path)

        return JSON.parse(JSON.stringify(newResponse));
    } catch (error) {
        handleError(error);
    }
}

export async function getResponsesByQuestionAndUser(questionId: string, userId: string) {
    try {
        await connectToDatabase();

        const conditions = userId ? {question: questionId, user: userId} : {question: questionId}

        const responses = await Response.find(conditions);

        return JSON.parse(JSON.stringify(responses));
    } catch (error) {
        handleError(error);
    }
}

export async function getResponseByIdQuestionAndUser(id: string, questionId: string, userId: string) {
    try {
        await connectToDatabase();

        const conditions = {id:id, question: questionId, user: userId}

        const response = await Response.findOne(conditions);

        return JSON.parse(JSON.stringify(response));
    } catch (error) {
        handleError(error);
    }
}

export async function getResponsesByUser(userId: string) {
    try {
        await connectToDatabase();

        const conditions = {user: userId}

        const responses = await Response.find(conditions)
            .populate<{ question: IQuestion, topic: ITopic, course: ICourse }>({
                path: "question",
                model: Question,
                populate: {path: "topic", model: "Topic", populate: {path: "course", model: "Course"}}
            });

        return JSON.parse(JSON.stringify(responses));
    } catch (error) {
        handleError(error);
    }
}

export async function deleteResponsesByQuestion(questionId: string) {
    try {
        await connectToDatabase();

        const conditions = {question: questionId}

        await Response.deleteMany(conditions);
    } catch (error) {
        handleError(error);
    }
}

