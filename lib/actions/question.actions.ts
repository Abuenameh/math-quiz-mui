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

export const createQuestion = async ({ question, path }: CreateQuestionParams) => {
    try {
        await connectToDatabase();

        // const course = await Course.findById(question.courseId)
        // if (!course) throw new Error('Course not found')

        const declarations = await Promise.all(question.declarations.map((declaration, index) => {
            return createDeclaration({declaration: declaration, path: ""})
            // return Declaration.create({...declaration});
        }))

        const newQuestion = await Question.create({name: question.name, question: question.question, course: question.course, declarations: declarations});
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
            .populate<{course: ICourse}>("course")
            .populate<{declarations: IDeclaration[]}>("declarations");

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

        questionToEdit.declarations.forEach((declaration: IDeclaration) => {
            deleteDeclaration({declarationId: declaration._id.toString(), path: ""})
        })

        const declarations = await Promise.all(question.declarations.map((declaration, index) => {
            return createDeclaration({declaration: declaration, path: ""})
            // return Declaration.create({...declaration});
        }))

        const editedQuestion = await Question.findByIdAndUpdate(
            question._id,
            { ...question, declarations: declarations },
            { new: true }
        )
        revalidatePath(path)

        return JSON.parse(JSON.stringify(editedQuestion))
    } catch (error) {
        handleError(error)
    }
}

export async function getQuestionsByCourse(courseId: string) {
    try {
        await connectToDatabase()

        const conditions = { course: courseId }

        const questionsQuery = Question.find(conditions)
            .sort({ name: 'asc' })
            .populate<{course: ICourse}>("course")
            .populate<{declarations: IDeclaration[]}>("declarations");

        const questions = await questionsQuery;

        return JSON.parse(JSON.stringify(questions));
    } catch (error) {
        handleError(error)
    }
}

export async function deleteQuestion({ questionId, path }: DeleteQuestionParams) {
    try {
        await connectToDatabase()

        const question = await getQuestionById(questionId)
        question.declarations.forEach((declaration: IDeclaration) => {
            deleteDeclaration({declarationId: declaration._id.toString(), path: ""})
        })

        const deletedQuestion = await Question.findByIdAndDelete(questionId)
        if (deletedQuestion) revalidatePath(path)
    } catch (error) {
        handleError(error)
    }
}
