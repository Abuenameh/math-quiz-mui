"use server"

import { CreateTypeParams } from "@/types"
import { handleError } from "@/lib/utils"
import { connectToDatabase } from "@/lib/database"
import Type from "@/lib/database/models/type.model"

export const createType = async ({ typeName }: CreateTypeParams) => {
    try {
        await connectToDatabase();

        const newType = await Type.create({ name: typeName });

        return JSON.parse(JSON.stringify(newType));
    } catch (error) {
        handleError(error)
    }
}

export const getAllTypes = async () => {
    try {
        await connectToDatabase();

        const types = await Type.find();

        return JSON.parse(JSON.stringify(types));
    } catch (error) {
        handleError(error)
    }
}