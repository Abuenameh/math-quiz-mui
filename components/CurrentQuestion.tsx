'use client'

import {SearchParamProps} from "@/types";
import {
    clearCurrentQuestion,
    getCurrentQuestion,
    getQuestionById,
} from "@/lib/actions/question.actions";
import {useParams, useRouter} from "next/navigation";
import {useUser} from "@clerk/nextjs";
import {useEffect, useRef, useState} from "react";
import {useChannel} from "ably/react";
import * as Ably from "ably";
// import {useChannels} from "@/components/ChannelProvider";

export const CurrentQuestion = () => {
    const router = useRouter();
    const params = useParams();
    const {user} = useUser();
    // const [cleared, setCleared] = useState(false);
    const cleared = useRef(false);

    const { channel: currentQuestionChannel } = useChannel("current-question", (message: Ably.Types.Message) => {
        const gotoCurrentQuestion = async () => {
            const currentQuestion = await getCurrentQuestion();
            // console.log(currentQuestion)
            // console.log("params.questionId", params.questionId)
            if (currentQuestion && params.questionId !== currentQuestion) {
                router.push(`/questions/${currentQuestion}`)
            }
            else if (!currentQuestion && params.questionId) {
                router.back()
            }
        }

        gotoCurrentQuestion().catch(console.error);
    })

    // const channels = useChannels();

    // useEffect(() => {
    //     channels.question?.channel?.subscribe((message) => {
    //         const gotoCurrentQuestion = async () => {
    //             const currentQuestion = await getCurrentQuestion();
    //             // console.log(currentQuestion)
    //             // console.log("params.questionId", params.questionId)
    //             if (currentQuestion && params.questionId !== currentQuestion) {
    //                 router.push(`/questions/${currentQuestion}`)
    //             }
    //             else if (!currentQuestion && params.questionId) {
    //                 router.back()
    //             }
    //         }
    //
    //         gotoCurrentQuestion().catch(console.error);
    //     })
    //
    //     return () => {
    //         channels.question?.channel?.unsubscribe();
    //     }
    // }, []);

    useEffect(() => {
        // console.log("Load params",params,user?.publicMetadata.isAdmin, !params.questionId)
        const gotoCurrentQuestion = async () => {
            const currentQuestion = await getCurrentQuestion();
            if (currentQuestion && params.questionId !== currentQuestion) {
                router.push(`/questions/${currentQuestion}`)
            }
        }

        if (user?.publicMetadata.isAdmin && !params.questionId && !cleared.current) {
            // console.log("Cleared", cleared)
            cleared.current = true;
            // setCleared(true)
            clearCurrentQuestion().catch(console.error);
            currentQuestionChannel.publish("current-question", {}).catch(console.error);
            // channels.question?.channel?.publish("current-question", {}).catch(console.error);
        }
        else if (!user?.publicMetadata.isAdmin) {
            gotoCurrentQuestion().catch(console.error);
        }
        // return () => {
        //     console.log("Unload params",params)
        // }
    }, [params, params.questionId, router, user?.publicMetadata.isAdmin])

    return (
        <></>
    );
};
