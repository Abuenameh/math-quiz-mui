'use server'


import {CreateAnswerParams} from "@/types";
import {connectToDatabase} from "@/lib/database";
import {handleError} from "@/lib/utils";
import Answer from "@/lib/database/models/answer.model";
import {Types} from "mongoose";
import Question, {IQuestion} from "@/lib/database/models/question.model";
import {ICourse} from "@/lib/database/models/course.model";
import {ITopic} from "@/lib/database/models/topic.model";

export const createAnswer = async ({answer}: CreateAnswerParams) => {
    try {
        await connectToDatabase();

        const answerMap = new Types.Map<{ answer: string, correct: boolean, mark: number }>();
        answer.answers.forEach((value, key) => {
            answerMap.set(key, {answer: value.answer, correct: value.correct, mark: value.mark});
        })
        const newAnswer = await Answer.create({answers: answerMap, question: answer.question, user: answer.user});
        // revalidatePath(path)

        return JSON.parse(JSON.stringify(newAnswer));
    } catch (error) {
        handleError(error);
    }
}

export async function getAnswerById(answerId: string) {
    try {
        await connectToDatabase();

        const answer = await Answer.findById(answerId)
            .populate<{ question: IQuestion }>({path: "question", model: Question})

        if (!answer) {
            throw new Error('Answer not found');
        }

        return JSON.parse(JSON.stringify(answer));
    } catch (error) {
        handleError(error);
    }
}

export async function getAnswerByQuestionAndUser(questionId: string, userId: string) {
    try {
        await connectToDatabase();

        const conditions = {question: questionId, user: userId}

        const answer = await Answer.findOne(conditions);

        return JSON.parse(JSON.stringify(answer));
    } catch (error) {
        handleError(error);
    }
}

export async function getAnswersByUser(userId: string) {
    try {
        await connectToDatabase();

        const conditions = {user: userId}

        const answers = await Answer.find(conditions)
            .populate<{ question: IQuestion, topic: ITopic, course: ICourse }>({
                path: "question",
                model: Question,
                populate: {path: "topic", model: "Topic", populate: {path: "course", model: "Course"}}
            });

        return JSON.parse(JSON.stringify(answers));
    } catch (error) {
        handleError(error);
    }
}

export async function deleteAnswersByQuestion(questionId: string) {
    try {
        await connectToDatabase();

        const conditions = {question: questionId}

        await Answer.deleteMany(conditions);
    } catch (error) {
        handleError(error);
    }
}
