// ====== USER PARAMS
import {Types} from "mongoose";
import {IDeclaration} from "@/lib/database/models/declaration.model";
import {MathfieldElement} from "@abuenameh/mathlive";
import {MutableRefObject, RefObject} from "react";

export type CreateUserParams = {
    clerkId: string
    firstName: string
    lastName: string
    username: string
    photo: string
}

export type UpdateUserParams = {
    firstName: string
    lastName: string
    username: string
    photo: string
}

export type CreateCourseParams = {
    // courseId: string
    course: {
    code: string
    title: string
    }
    path: string
}

export type EditCourseParams = {
    course: {
        _id: string
    code: string
        title: string
    }
    path: string
}

export type DeleteCourseParams = {
    courseId: string
    path: string
}

export type GetAllCoursesParams = {
    query: string
    limit: number
    page: number
}

export type CreateTopicParams = {
    topic: {
        course: string
        num: number
        name: string
        description: string
    }
    path: string
}

export type EditTopicParams = {
    topic: {
        _id: string
        num: number
        name: string
        description: string
    }
    path: string
}

export type DeleteTopicParams = {
    topicId: string
    path: string
}

export type CreateQuestionParams = {
    question: {
        topic: string
        name: string
        question: string
        showSolution: boolean
    }
    path: string
}

export type EditQuestionParams = {
    question: {
        _id: string
        name: string
        question: string
        showSolution: boolean
    }
    path: string
}

export type DeleteQuestionParams = {
    questionId: string
    path: string
}

export type CreateDeclarationParams = {
    // courseId: string
    declaration: {
        symbol: string
        domain: string
        question: string
    }
    path: string
}

export type DeleteDeclarationParams = {
    declarationId: string
    path: string
}

export type CreateAnswerParams = {
    // courseId: string
    answer: {
        answers: Map<string, {answer: string, correct: boolean, mark: number}>
        question: string
        user: string
    }
    path: string
}

// ====== EVENT PARAMS
export type CreateEventParams = {
    userId: string
    event: {
        title: string
        description: string
        location: string
        imageUrl: string
        startDateTime: Date
        endDateTime: Date
        categoryId: string
        price: string
        isFree: boolean
        url: string
    }
    path: string
}

export type UpdateEventParams = {
    userId: string
    event: {
        _id: string
        title: string
        imageUrl: string
        description: string
        location: string
        startDateTime: Date
        endDateTime: Date
        categoryId: string
        price: string
        isFree: boolean
        url: string
    }
    path: string
}

export type DeleteEventParams = {
    eventId: string
    path: string
}

export type GetAllEventsParams = {
    query: string
    category: string
    limit: number
    page: number
}

export type GetEventsByUserParams = {
    userId: string
    limit?: number
    page: number
}

export type GetRelatedEventsByCategoryParams = {
    categoryId: string
    eventId: string
    limit?: number
    page: number | string
}

export type Event = {
    _id: string
    title: string
    description: string
    price: string
    isFree: boolean
    imageUrl: string
    location: string
    startDateTime: Date
    endDateTime: Date
    url: string
    organizer: {
        _id: string
        firstName: string
        lastName: string
    }
    category: {
        _id: string
        name: string
    }
}

// ====== CATEGORY PARAMS
export type CreateTypeParams = {
    typeID: string
    typeName: string
}

// ====== ORDER PARAMS
export type CheckoutOrderParams = {
    eventTitle: string
    eventId: string
    price: string
    isFree: boolean
    buyerId: string
}

export type CreateOrderParams = {
    stripeId: string
    eventId: string
    buyerId: string
    totalAmount: string
    createdAt: Date
}

export type GetOrdersByEventParams = {
    eventId: string
    searchString: string
}

export type GetOrdersByUserParams = {
    userId: string | null
    limit?: number
    page: string | number | null
}

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
    params: string
    key: string
    value: string | null
}

export type RemoveUrlQueryParams = {
    params: string
    keysToRemove: string[]
}

export type SearchParamProps = {
    params: { courseId: string, topicId: string, questionId: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export type MathAnswerResults = Map<string, {answer: string, correct: boolean, mark: number}>
//     {
//     [key: string]: { answer: string, correct: boolean }
// }