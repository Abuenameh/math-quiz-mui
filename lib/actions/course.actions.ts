'use server'

import {CreateCourseParams, DeleteCourseParams, EditCourseParams} from "@/types";
import {handleError} from "@/lib/utils";
import {connectToDatabase} from "@/lib/database";
import Course from "@/lib/database/models/course.model";
import {revalidatePath} from "next/cache";

export const createCourse = async ({course, path}: CreateCourseParams) => {
    try {
        await connectToDatabase();

        const newCourse = await Course.create({...course});
        revalidatePath(path)

        return JSON.parse(JSON.stringify(newCourse));
    } catch (error) {
        handleError(error);
    }
}

export async function getCourseById(courseId: string) {
    try {
        await connectToDatabase();

        const course = await Course.findById(courseId);

        if (!course) {
            throw new Error('Course not found');
        }

        return JSON.parse(JSON.stringify(course));
    } catch (error) {
        handleError(error);
    }
}

export async function editCourse({course, path}: EditCourseParams) {
    try {
        await connectToDatabase()

        const courseToEdit = await Course.findById(course._id)
        if (!courseToEdit) {
            throw new Error('Course not found')
        }

        const editedCourse = await Course.findByIdAndUpdate(
            course._id,
            {...course},
            {new: true}
        )
        revalidatePath(path)

        return JSON.parse(JSON.stringify(editedCourse))
    } catch (error) {
        handleError(error)
    }
}

export async function deleteCourse({courseId, path}: DeleteCourseParams) {
    try {
        await connectToDatabase()

        const deletedCourse = await Course.findByIdAndDelete(courseId)
        if (deletedCourse) revalidatePath(path)
    } catch (error) {
        handleError(error)
    }
}

export async function getAllCourses() {
    try {
        await connectToDatabase()

        const conditions = {};

        const coursesQuery = Course.find(conditions)
            .sort({code: 'asc'})

        const courses = await coursesQuery

        return JSON.parse(JSON.stringify(courses));
    } catch (error) {
        handleError(error)
    }
}