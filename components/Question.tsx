'use client'

import {Math} from "@/components/Math";
import { IQuestion } from "@/lib/database/models/question.model";
import {createContext, useEffect, useRef, useState} from "react";
import * as Ably from "ably";
import {AblyProvider, useAbly, useChannel} from "ably/react";
import dynamic from "next/dynamic";
import Button from "@mui/material/Button";
import {MathfieldElement} from "@abuenameh/mathlive";
import {MathAnswerResults} from "@/types";
import {Types} from "mongoose";
import {createAnswer, getAnswerByQuestionAndUser} from "@/lib/actions/answer.actions";
import {auth, useUser} from "@clerk/nextjs";
import {IAnswer} from "@/lib/database/models/answer.model";
import {useRouter} from "next/navigation";
import {MathAnswer} from "@/components/MathAnswer";
import {editQuestion, getQuestionById} from "@/lib/actions/question.actions";
import {Box, CircularProgress} from "@mui/material";

export const SolutionContext = createContext(false);


export const Question = ({ question, userId, isAdmin }: { question: IQuestion, userId: string, isAdmin: boolean }) => {
    const [loaded, setLoaded] = useState(false);
    const [responses, setResponses] = useState<MathAnswerResults>(new Map());
    const [savedResponses, setSavedResponses] = useState<MathAnswerResults>(new Map());
    const [submitted, setSubmitted] = useState(false)
    const [showSolution, setShowSolution] = useState(question.showSolution)

    const { user,isLoaded } = useUser();
    const [answered, setAnswered] = useState(false);
    const router = useRouter();

    console.log("loaded", loaded,isLoaded)

    const { channel: showSolutionChannel } = useChannel("show-solution", (message: Ably.Types.Message) => {
        const fetchShowSolution = async () => {
            const updatedQuestion = await getQuestionById(question._id.toString("hex"));
            console.log(question, updatedQuestion)
            if (updatedQuestion) {
                if ((!question.showSolution || !submitted) && updatedQuestion.showSolution) {
                    onSubmit().catch(console.error);
                }
                setShowSolution(updatedQuestion.showSolution);
            }
        }

        fetchShowSolution().catch(console.error);
    })

    // console.log("user",user)
    // const userId = user?.publicMetadata.userId as string;
    // const isAdmin = user?.publicMetadata.isAdmin as boolean || false;

    useEffect(() => {
        const fetchAnswer = async () => {
            const answer = await getAnswerByQuestionAndUser(question._id.toString("hex"), userId) as IAnswer;
            console.log("answer",answer)
            if (answer) {
                const responseMap: MathAnswerResults = new Map();
                const savedResponseMap: MathAnswerResults = new Map();
                Object.entries(answer.answers).forEach(([key, value]) => {
                    responseMap.set(key, {answer: value.answer, correct: value.correct, mark: value.mark});
                    savedResponseMap.set(key, {answer: value.answer, correct: value.correct, mark: value.mark});
                })
                // console.log(savedResponses)
                // console.log(savedResponseMap)
                setResponses(responseMap);
                setSavedResponses(savedResponseMap);
                setAnswered(true)
            }
            setLoaded(true)
        }
        fetchAnswer().catch(console.error);
    }, [question._id, userId])

    console.log(question)

    const onSubmit = async () => {
        console.log("onSubmit")
        if (submitted || savedResponses.size > 0) return;
        setSubmitted(true)
        setSavedResponses(new Map(responses));
        await createAnswer({answer: {answers: responses, question: question._id.toString("hex"), user: userId}, path: ""});
    }

    const updateResponse = (id: string, response: string, correct: boolean, mark: number) => {
        const responseMap = new Map(responses);
        responseMap.set(id, {answer: response, correct: correct, mark: mark});
        setResponses(responseMap);
    }

    const onShowSolution = () => {
        if (submitted) return;
        setSubmitted(true);
        editQuestion({question: { _id: question._id.toString("hex"), name: question.name, question: question.question, showSolution: true}, path: ""}).catch(console.error);
        showSolutionChannel.publish({}).catch(console.error);
    }

    return (
        <>
            {/*<RealtimeComponent>*/}
            {loaded ?
                <Math text={question.question} responses={responses} savedResponses={savedResponses} submitted={submitted} showSolution={showSolution} isAdmin={isAdmin} updateResponse={updateResponse}></Math>
                :
                <Box className={"text-center"}><CircularProgress /></Box>
            }
            {/*</RealtimeComponent>*/}
            {loaded && isAdmin ?
                <Button variant={"contained"} disabled={submitted} onClick={onShowSolution}>Show Solution</Button>
            : loaded &&
            <Button variant={"contained"} disabled={submitted || answered} onClick={onSubmit}>{submitted || answered ? "Submitted" : "Submit Answer"}</Button>
            }
        </>
    );
};
