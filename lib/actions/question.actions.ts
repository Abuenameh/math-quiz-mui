'use server'

import {
    CreateCourseParams,
    CreateQuestionParams,
    DeleteQuestionParams,
    EditCourseParams,
    EditQuestionParams
} from "@/types";
import {connectToDatabase} from "@/lib/database";
import Course, {ICourse} from "@/lib/database/models/course.model";
import {revalidatePath} from "next/cache";
import {handleError} from "@/lib/utils";
import Question from "@/lib/database/models/question.model";
import {Types} from "mongoose";
import Declaration, {IDeclaration} from "@/lib/database/models/declaration.model";
import {createDeclaration, deleteDeclaration} from "@/lib/actions/declaration.actions";
import Topic, {ITopic} from "@/lib/database/models/topic.model";

export const createQuestion = async ({ question, path }: CreateQuestionParams) => {
    try {
        await connectToDatabase();

        const newQuestion = await Question.create({...question});
        revalidatePath(path)

        return JSON.parse(JSON.stringify(newQuestion));
    } catch (error) {
        handleError(error);
    }
}

export async function getQuestionById(questionId: string) {
    try {
        await connectToDatabase();

        const question = await Question.findById(questionId)
            .populate<{topic: ITopic}>({path: "topic", model: Topic, populate: {path: "course", model: Course}})

        if (!question) {
            throw new Error('Question not found');
        }

        return JSON.parse(JSON.stringify(question));
    } catch (error) {
        handleError(error);
    }
}

export async function editQuestion({ question, path }: EditQuestionParams) {
    try {
        await connectToDatabase()

        const questionToEdit = await Question.findById(question._id)
        if (!questionToEdit) {
            throw new Error('Question not found')
        }
        console.log(questionToEdit)

        const editedQuestion = await Question.findByIdAndUpdate(
            question._id,
            { ...question },
            { new: true }
        )
        revalidatePath(path)

        return JSON.parse(JSON.stringify(editedQuestion))
    } catch (error) {
        handleError(error)
    }
}

export async function getQuestionsByTopic(topicId: string) {
    try {
        await connectToDatabase()

        const conditions = { topic: topicId }

        const questionsQuery = Question.find(conditions)
            .sort({ name: 'asc' })
            .populate<{topic: ITopic}>({path: "topic", model: Topic, populate: {path: "course", model: Course}})

        const questions = await questionsQuery;

        return JSON.parse(JSON.stringify(questions));
    } catch (error) {
        handleError(error)
    }
}

export async function deleteQuestion({ questionId, path }: DeleteQuestionParams) {
    try {
        await connectToDatabase()

        const deletedQuestion = await Question.findByIdAndDelete(questionId)
        if (deletedQuestion) revalidatePath(path)
    } catch (error) {
        handleError(error)
    }
}
