'use server'

import {CreateQuestionParams, DeleteQuestionParams, EditQuestionParams} from "@/types";
import {connectToDatabase} from "@/lib/database";
import Course from "@/lib/database/models/course.model";
import {revalidatePath} from "next/cache";
import {handleError} from "@/lib/utils";
import Question, {IQuestion} from "@/lib/database/models/question.model";
import Topic, {ITopic} from "@/lib/database/models/topic.model";
import Answer from "@/lib/database/models/answer.model";
import { utapi } from "@/app/api/uploadthing/core"

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

        if (question.imageKey !== questionToEdit.imageKey) {
                await utapi.deleteFiles(questionToEdit.imageKey)
        }

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

export async function getAnsweredQuestionsByTopic(topicId: string, userId: string) {
    try {
        await connectToDatabase()

        const conditions = { user: userId }

        const answersQuery = Answer.find(conditions)
            .populate<{question: IQuestion}>({path: "question", model: Question, populate: {path: "topic", model: Topic, populate: {path: "course", model: Course}}})

        const answers = await answersQuery;
        const questions = answers.map(answer => answer.question).filter(question => question.topic._id.toString("hex") === topicId)

        return JSON.parse(JSON.stringify(questions));
    } catch (error) {
        handleError(error)
    }
}

export async function setCurrentQuestion(questionId: string) {
    try {
        await connectToDatabase()

        const questionToEdit = await Question.findById(questionId)
        if (!questionToEdit) {
            throw new Error('Question not found')
        }

        await Question.findByIdAndUpdate(
            questionId,
            { current: true },
            { new: true }
        )
    } catch (error) {
        handleError(error)
    }
}

export async function getCurrentQuestion() {
    try {
        await connectToDatabase()

        const conditions = { current: true }
        const question = await Question.findOne(conditions)
        if (!question) {
            return ""
        }

        return question._id.toString()
    } catch (error) {
        handleError(error)
    }
}

export async function clearCurrentQuestion() {
    try {
        await connectToDatabase()

        await Question.updateMany({ current: true }, { current: false })
    } catch (error) {
        handleError(error)
    }
}

export async function deleteQuestion({ questionId, path }: DeleteQuestionParams) {
    try {
        await connectToDatabase()

        const question = await Question.findById(questionId)
        if (question) {
            const imageKey = question.imageKey
            await utapi.deleteFiles(imageKey)
        }

        const deletedQuestion = await Question.findByIdAndDelete(questionId)
        if (deletedQuestion) revalidatePath(path)
    } catch (error) {
        handleError(error)
    }
}
