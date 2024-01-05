'use server'

import {
    CreateDeclarationParams,
    DeleteDeclarationParams,
} from "@/types";
import {connectToDatabase} from "@/lib/database";
import {handleError} from "@/lib/utils";
import Question, {IQuestion} from "@/lib/database/models/question.model";
import Declaration from "@/lib/database/models/declaration.model";

export const createDeclaration = async ({ declaration }: CreateDeclarationParams) => {
    try {
        await connectToDatabase();

        const newDeclaration = await Declaration.create({...declaration});

        return JSON.parse(JSON.stringify(newDeclaration));
    } catch (error) {
        handleError(error);
    }
}

export async function getDeclarationsByQuestion(questionId: string) {
    try {
        await connectToDatabase()

        const conditions = { question: questionId }

        const declarationsQuery = Declaration.find(conditions)
            .sort({ symbol: 'asc' })
            .populate<{question: IQuestion}>({path: "question", model: Question})

        const declarations = await declarationsQuery;

        return JSON.parse(JSON.stringify(declarations));
    } catch (error) {
        handleError(error)
    }
}

export async function deleteDeclaration({ declarationId }: DeleteDeclarationParams) {
    try {
        await connectToDatabase()

        await Declaration.findByIdAndDelete(declarationId)
        // if (deletedDeclaration) revalidatePath(path)
    } catch (error) {
        handleError(error)
    }
}

export async function deleteDeclarationsByQuestion(questionId: string) {
    try {
        await connectToDatabase()

        const conditions = { question: questionId }

        await Declaration.deleteMany(conditions);
    } catch (error) {
        handleError(error)
    }
}

