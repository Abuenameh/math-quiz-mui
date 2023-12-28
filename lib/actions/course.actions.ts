'use server'

import {CreateCourseParams, GetAllCoursesParams, UpdateCourseParams} from "@/types";
import {handleError} from "@/lib/utils";
import {connectToDatabase} from "@/lib/database";
import Course from "@/lib/database/models/course.model";
import {revalidatePath} from "next/cache";

export const createCourse = async ({ course, path }: CreateCourseParams) => {
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

export async function updateCourse({ course: course, path }: UpdateCourseParams) {
    try {
        await connectToDatabase()

        const courseToUpdate = await Course.findById(course._id)
        if (!courseToUpdate) {
            throw new Error('Course not found')
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            course._id,
            { ...course },
            { new: true }
        )
        revalidatePath(path)

        return JSON.parse(JSON.stringify(updatedCourse))
    } catch (error) {
        handleError(error)
    }
}

export async function deleteCourse({ courseId, path }: DeleteCourseParams) {
    try {
        await connectToDatabase()

        const deletedCourse = await Course.findByIdAndDelete(courseId)
        if (deletedCourse) revalidatePath(path)
    } catch (error) {
        handleError(error)
    }
}

export async function getAllCourses({ query, limit = 6, page }: GetAllCoursesParams) {
    try {
        await connectToDatabase()

        const codeCondition = query ? { code: { $regex: query, $options: 'i' } } : {}
        const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
        const conditions = {
            $and: [codeCondition, titleCondition],
        }

        const skipAmount = (Number(page) - 1) * limit
        const coursesQuery = Course.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const courses = await coursesQuery
        const coursesCount = await Course.countDocuments(conditions)

        return {
            data: JSON.parse(JSON.stringify(courses)),
            totalPages: Math.ceil(coursesCount / limit),
        }
    } catch (error) {
        handleError(error)
    }
}