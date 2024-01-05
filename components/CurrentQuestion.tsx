'use client'

import {
    clearCurrentQuestion,
    getCurrentQuestion,
} from "@/lib/actions/question.actions";
import {useParams, useRouter} from "next/navigation";
import {useUser} from "@clerk/nextjs";
import {useEffect, useRef} from "react";
import {useChannel} from "ably/react";
import * as Ably from "ably";

export const CurrentQuestion = () => {
    const router = useRouter();
    const params = useParams();
    const {user} = useUser();
    const cleared = useRef(false);

    const { channel: currentQuestionChannel } = useChannel("current-question", () => {
        const gotoCurrentQuestion = async () => {
            const currentQuestion = await getCurrentQuestion();
            if (currentQuestion && params.questionId !== currentQuestion) {
                router.push(`/questions/${currentQuestion}`)
            }
            else if (!currentQuestion && params.questionId) {
                router.back()
            }
        }

        gotoCurrentQuestion().catch(console.error);
    })

    useEffect(() => {
        const gotoCurrentQuestion = async () => {
            const currentQuestion = await getCurrentQuestion();
            if (currentQuestion && params.questionId !== currentQuestion) {
                router.push(`/questions/${currentQuestion}`)
            }
        }

        if (user?.publicMetadata.isAdmin && !params.questionId && !cleared.current) {
            cleared.current = true;
            clearCurrentQuestion().catch(console.error);
            currentQuestionChannel.publish("current-question", {}).catch(console.error);
        }
        else if (!user?.publicMetadata.isAdmin) {
            gotoCurrentQuestion().catch(console.error);
        }
    }, [currentQuestionChannel, params, params.questionId, router, user?.publicMetadata.isAdmin])

    return (
        <></>
    );
};
