'use client'

import {Math} from "@/components/Math";
import { IQuestion } from "@/lib/database/models/question.model";
import {useState} from "react";
import * as Ably from "ably";
import {useChannel} from "ably/react";
import Button from "@mui/material/Button";
import {MathfieldElement} from "mathlive";
import {MathAnswerResults} from "@/types";
import {createAnswer} from "@/lib/actions/answer.actions";
import {IAnswer} from "@/lib/database/models/answer.model";
import {editQuestion, getQuestionById} from "@/lib/actions/question.actions";
import {Box, CircularProgress} from "@mui/material";
import {CurrentQuestion} from "@/components/CurrentQuestion";
import Image from "next/image";
import {IDeclaration} from "@/lib/database/models/declaration.model";
import "compute-engine";

export const Question = ({ question, declarations, answer, userId, isAdmin, isPowerPoint }: { question: IQuestion, declarations: IDeclaration[], answer: IAnswer, userId: string, isAdmin: boolean, isPowerPoint: boolean }) => {
    const [loaded, setLoaded] = useState(false);
    const [responses, setResponses] = useState<MathAnswerResults>(new Map());
    const [savedResponses, setSavedResponses] = useState<MathAnswerResults>(new Map());
    const [submitted, setSubmitted] = useState(false)
    const [showSolution, setShowSolution] = useState(question.showSolution)

    const [answered, setAnswered] = useState(false);

    const { channel: showSolutionChannel } = useChannel("show-solution", () => {
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

    if (!loaded) {
        if (answer) {
            const responseMap: MathAnswerResults = new Map();
            const savedResponseMap: MathAnswerResults = new Map();
            Object.entries(answer.answers).forEach(([key, value]) => {
                responseMap.set(key, {answer: value.answer, correct: value.correct, mark: value.mark});
                savedResponseMap.set(key, {answer: value.answer, correct: value.correct, mark: value.mark});
            })
            setResponses(responseMap);
            setSavedResponses(savedResponseMap);
            setAnswered(true)
        }

        const ce = MathfieldElement.computeEngine;
        if (ce) {
            ce.pushScope();
            declarations.forEach((declaration) => {
                // @ts-ignore
                ce.declare(declaration.symbol, declaration.domain);
            })
        }

        setLoaded(true);
    }

    const onSubmit = async () => {
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
        if (submitted) return;
        setSubmitted(true);
        editQuestion({question: { ...question, _id: question._id.toString("hex"), showSolution: true}, path: ""}).catch(console.error);
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
