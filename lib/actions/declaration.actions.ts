'use server'

import {
    CreateCourseParams, CreateDeclarationParams,
    CreateQuestionParams, DeleteCourseParams, DeleteDeclarationParams,
    DeleteQuestionParams,
    EditCourseParams,
    EditQuestionParams
} from "@/types";
import {connectToDatabase} from "@/lib/database";
import Course from "@/lib/database/models/course.model";
import {revalidatePath} from "next/cache";
import {handleError} from "@/lib/utils";
import Question from "@/lib/database/models/question.model";
import {Types} from "mongoose";
import Declaration from "@/lib/database/models/declaration.model";

export const createDeclaration = async ({ declaration }: CreateDeclarationParams) => {
    try {
        await connectToDatabase();

        // const course = await Course.findById(question.courseId)
        // if (!course) throw new Error('Course not found')

        const newDeclaration = await Declaration.create({...declaration});
        // revalidatePath(path)

        return JSON.parse(JSON.stringify(newDeclaration));
    } catch (error) {
        handleError(error);
    }
}

export async function deleteDeclaration({ declarationId }: DeleteDeclarationParams) {
    try {
        await connectToDatabase()

        const deletedDeclaration = await Declaration.findByIdAndDelete(declarationId)
        // if (deletedDeclaration) revalidatePath(path)
    } catch (error) {
        handleError(error)
    }
}

