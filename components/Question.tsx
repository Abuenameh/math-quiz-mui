'use client'

import {Math} from "@/components/Math";
import { IQuestion } from "@/lib/database/models/question.model";
import {createContext, useEffect, useRef, useState} from "react";
import * as Ably from "ably";
import {AblyProvider, useAbly, useChannel} from "ably/react";
import dynamic from "next/dynamic";
import Button from "@mui/material/Button";
import {MathfieldElement} from "mathlive";
import {MathAnswerResults} from "@/types";
import {Types} from "mongoose";
import {createAnswer, getAnswerByQuestionAndUser} from "@/lib/actions/answer.actions";
import {auth, useUser} from "@clerk/nextjs";
import {IAnswer} from "@/lib/database/models/answer.model";
import {useRouter} from "next/navigation";
import {MathAnswer} from "@/components/MathAnswer";
import {editQuestion, getQuestionById, setCurrentQuestion} from "@/lib/actions/question.actions";
import {Box, CircularProgress} from "@mui/material";
import {CurrentQuestion} from "@/components/CurrentQuestion";
import Image from "next/image";
import {getDeclarationsByQuestion} from "@/lib/actions/declaration.actions";
import {IDeclaration} from "@/lib/database/models/declaration.model";
// import {ComputeEngine} from "compute-engine";
import "compute-engine";
// import {useChannels} from "@/components/ChannelProvider";
import message from "ably/src/common/lib/types/message";

export const SolutionContext = createContext(false);


export const Question = ({ question, declarations, answer, userId, isAdmin, isPowerPoint }: { question: IQuestion, declarations: IDeclaration[], answer: IAnswer, userId: string, isAdmin: boolean, isPowerPoint: boolean }) => {
    const [loaded, setLoaded] = useState(false);
    const [responses, setResponses] = useState<MathAnswerResults>(new Map());
    const [savedResponses, setSavedResponses] = useState<MathAnswerResults>(new Map());
    const [submitted, setSubmitted] = useState(false)
    const [showSolution, setShowSolution] = useState(question.showSolution)

    const { user,isLoaded } = useUser();
    const [answered, setAnswered] = useState(false);
    const router = useRouter();

    // MathfieldElement.computeEngine?.pushScope();
    // MathfieldElement.computeEngine?.declare("P","Predicates")

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

    // const channels = useChannels()

    // useEffect(() => {
    //     channels.solution?.channel.subscribe((message) => {
    //             const fetchShowSolution = async () => {
    //                 const updatedQuestion = await getQuestionById(question._id.toString("hex"));
    //                 console.log(question, updatedQuestion)
    //                 if (updatedQuestion) {
    //                     if ((!question.showSolution || !submitted) && updatedQuestion.showSolution) {
    //                         onSubmit().catch(console.error);
    //                     }
    //                     setShowSolution(updatedQuestion.showSolution);
    //                 }
    //             }
    //
    //             fetchShowSolution().catch(console.error);
    //     })
    //
    //     return () => {
    //         channels.solution?.channel.unsubscribe();
    //     }
    // }, [])

    // console.log("user",user)
    // const userId = user?.publicMetadata.userId as string;
    // const isAdmin = user?.publicMetadata.isAdmin as boolean || false;

    if (!loaded) {
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

        const ce = MathfieldElement.computeEngine;
        console.log("ce", declarations)
        // if (!ce) return;
        if (ce) {
            ce.pushScope();
            declarations.forEach((declaration) => {
                // console.log("declaration", declaration)
                // try {
                // @ts-ignore
                ce.declare(declaration.symbol, declaration.domain);
                // ce.assume(["Element", "P", "Integers"])
                // console.log(ce.assumptions)
                // }
                // catch (e) {
                //     console.error(e)
                // }
            })
        }

        setLoaded(true);
    }

    // useEffect(() => {
    //     const fetchAnswer = async () => {
    //         const answer = await getAnswerByQuestionAndUser(question._id.toString("hex"), userId) as IAnswer;
    //         // console.log("answer",answer)
    //         if (answer) {
    //             const responseMap: MathAnswerResults = new Map();
    //             const savedResponseMap: MathAnswerResults = new Map();
    //             Object.entries(answer.answers).forEach(([key, value]) => {
    //                 responseMap.set(key, {answer: value.answer, correct: value.correct, mark: value.mark});
    //                 savedResponseMap.set(key, {answer: value.answer, correct: value.correct, mark: value.mark});
    //             })
    //             // console.log(savedResponses)
    //             // console.log(savedResponseMap)
    //             setResponses(responseMap);
    //             setSavedResponses(savedResponseMap);
    //             setAnswered(true)
    //         }
    //         setLoaded(true)
    //     }
    //
    //     const makeDeclarations = async () => {
    //         const ce = MathfieldElement.computeEngine;
    //         // const ce2 = new ComputeEngine();
    //         // console.log(ce2.declare("M","Integers"));
    //         // console.log(ce2.assume(["Element","L","Integers"]))
    //         // console.log("ce2", ce2.assumptions)
    //         // console.log(ce2?.context?.ids)
    //         if (!ce) return;
    //         ce.pushScope();
    //         // ce?.forget(undefined);
    //         const declarations = await getDeclarationsByQuestion(question._id.toString("hex")) as IDeclaration[];
    //         // console.log("declarations", declarations)
    //         // ce.assume(["Element", "P", "Predicates"])
    //         // ce.assume(["Element", "x", "Booleans"])
    //         // const qwe = "Q(x)"
    //         // console.log(ce.parse(qwe))
    //         // console.log(ce.parse(qwe).toString())
    //         console.log(ce.context?.ids)
    //         declarations.forEach((declaration) => {
    //             // console.log("declaration", declaration)
    //             // try {
    //             // @ts-ignore
    //             // ce.declare(declaration.symbol, declaration.domain);
    //             // ce.assume(["Element", "P", "Integers"])
    //             // console.log(ce.assumptions)
    //             // }
    //             // catch (e) {
    //             //     console.error(e)
    //             // }
    //         })
    //         console.log("Question assumptions", ce.assumptions)
    //     }
    //
    //     fetchAnswer().then(makeDeclarations).catch(console.error);
    //
    //     return () => {
    //         MathfieldElement.computeEngine?.popScope();
    //     }
    // }, [question._id, userId])

    // console.log(question)

    const onSubmit = async () => {
        console.log("onSubmit", document.hasFocus())
        if (submitted || savedResponses.size > 0) return;
        setSubmitted(true)
        if (isAdmin || isPowerPoint || !document.hasFocus()) return;
        setSavedResponses(new Map(responses));
        await createAnswer({answer: {answers: responses, question: question._id.toString("hex"), user: userId}, path: ""});
    }

    const updateResponse = (id: string, response: string, correct: boolean, mark: number) => {
        const responseMap = new Map(responses);
        responseMap.set(id, {answer: response, correct: correct, mark: mark});
        setResponses(responseMap);
    }

    const onShowSolution = () => {
        console.log("onShowSolution")
        if (submitted) return;
        setSubmitted(true);
        editQuestion({question: { ...question, _id: question._id.toString("hex"), showSolution: true}, path: ""}).catch(console.error);
        // channels.solution?.channel?.publish({}).catch(console.error);
        showSolutionChannel.publish({}).catch(console.error);
    }

    return (
        <>
            <CurrentQuestion />
            {loaded ?
                <>
                {question.imageUrl && <div className={""}><Image src={question.imageUrl!} alt={"question image"} width={250} height={250} className={"w-full max-h-96 object-contain object-center"}/></div>}
                <Math text={question.question} responses={responses} savedResponses={savedResponses} submitted={submitted} showSolution={showSolution} isAdmin={isAdmin} isPowerPoint={isPowerPoint} updateResponse={updateResponse}></Math>
                </>
                :
                <Box className={"text-center"}><CircularProgress /></Box>
            }
            {!isPowerPoint && (loaded && isAdmin ?
                <Button variant={"contained"} disabled={submitted} onClick={onShowSolution}>Show Solution</Button>
            : loaded &&
            <Button variant={"contained"} disabled={submitted || answered} onClick={onSubmit}>{submitted || answered ? "Submitted" : "Submit Answer"}</Button>)
            }
        </>
    );
};
