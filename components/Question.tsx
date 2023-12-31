'use client'

import {Math} from "@/components/Math";
import { IQuestion } from "@/lib/database/models/question.model";
import {createContext, useState} from "react";
import * as Ably from "ably";
import {AblyProvider, useAbly} from "ably/react";
import dynamic from "next/dynamic";

export const SolutionContext = createContext(false);


const AblyQuestion = ({ question }: { question: string }) => {
    const [showSolution, setShowSolution] = useState(false);

    const ably = useAbly();

    ably.connection.connect();

    return (
        <SolutionContext.Provider value={showSolution}>
            <Math text={question}></Math>
        </SolutionContext.Provider>
    )
}

export const Question = ({ question }: { question: string }) => {
    const RealtimeComponent = dynamic(() => import("@/components/RealtimeComponent"), {
        ssr: false
    })

    return (
        <>
            <RealtimeComponent>
                <Math text={question}></Math>
                {/*<AblyQuestion question={question} />*/}
            </RealtimeComponent>
        </>
    );
};
