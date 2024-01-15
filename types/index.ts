// ====== USER PARAMS

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
        imageUrl?: string
        imageKey?: string
        showSolution: boolean
    }
    path: string
}

export type EditQuestionParams = {
    question: {
        _id: string
        name: string
        question: string
        imageUrl?: string
        imageKey?: string
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

export type CreateResponseParams = {
    response: {
        id: string
        response: string
        answer: string
        jsonResponse: string
        jsonAnswer: string
        // correct: boolean
        mark: number
        question: string
        user: string
    }
}

export type CreateAnswerParams = {
    // courseId: string
    answer: {
        answers: Map<string, { answer: string, correct: boolean, mark: number }>
        question: string
        user: string
    }
    path: string
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

export type MathAnswerResults = Map<string, { answer: string, correct: boolean, mark: number }>
