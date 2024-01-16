'use client'

import {Math} from "@/components/Math";
import {IQuestion} from "@/lib/database/models/question.model";
import {useState} from "react";
import {useChannel} from "ably/react";
import Button from "@mui/material/Button";
import {MathfieldElement} from "mathlive";
import {editQuestion} from "@/lib/actions/question.actions";
import {Box, CircularProgress} from "@mui/material";
import {CurrentQuestion} from "@/components/CurrentQuestion";
import Image from "next/image";
import {IDeclaration} from "@/lib/database/models/declaration.model";
import "compute-engine";
import {createResponse, getResponsesByQuestionAndUser} from "@/lib/actions/response.actions";
import {useEffectOnce, useMap} from "usehooks-ts";
import {IResponse} from "@/lib/database/models/response.model";

export type ResponseProps = {
    id: string
    response: string
    answer: string
    jsonResponse: string
    jsonAnswer: string
    // correct: boolean
    mark: number
}


export const Question = ({question, declarations, userId, isAdmin, isPowerPoint}: {
    question: IQuestion,
    declarations: IDeclaration[],
    // answer: IAnswer,
    userId: string,
    isAdmin: boolean,
    isPowerPoint: boolean
}) => {
    const [loaded, setLoaded] = useState(false);
    // const [responses, setResponses] = useState<MathAnswerResults>(new Map());
    // const responses = useRef<MathAnswerResults>(new Map());
    // const [savedResponses, setSavedResponses] = useState<MathAnswerResults>(new Map());
    // const [submitted, setSubmitted] = useState(false)
    const [showSolution, setShowSolution] = useState(userId === "view" ? false : userId === "view_solution" ? true : question.showSolution)

    const [responses, responsesActions] = useMap<string, ResponseProps>()
    const [savedResponses, savedResponsesActions] = useMap<string, ResponseProps>()
    const [correct, correctActions] = useMap<string, boolean>()
    const [answered, setAnswered] = useState(userId === "view_solution");
    const [hadFocus, setHadFocus] = useState(true);

    const {channel: showSolutionChannel} = useChannel("show-solution", () => {
        if (!userId.startsWith("view")) {
            submit();
            setShowSolution(true);
        }
    })

    // const {channel: showSolutionChannel} = useChannel("show-solution", () => {
    //     const fetchShowSolution = async () => {
    //         const updatedQuestion = await getQuestionById(question._id.toString("hex"));
    //         if (updatedQuestion) {
    //             if ((!question.showSolution || !submitted) && updatedQuestion.showSolution) {
    //                 submit().catch(console.error);
    //             }
    //             setShowSolution(updatedQuestion.showSolution);
    //         }
    //     }
    //
    //     fetchShowSolution().catch(console.error);
    // })

    const isCorrect = (jsonResponse: string, jsonAnswer: string) => {
        const ce = MathfieldElement.computeEngine;
        if (!ce) {
            console.error("Compute engine not loaded");
            return false;
        }
        // console.log(jsonResponse)
        // console.log(jsonAnswer)
        return ce.box(JSON.parse(jsonResponse)).isEqual(ce.box(JSON.parse(jsonAnswer)))
        // return ce.parse(jsonResponse).simplify().isEqual(ce.parse(jsonAnswer).simplify())
    }

    useEffectOnce(() => {
        const fetchResponses = async () => {
            if (userId.startsWith("view")) return
            // responsesActions.reset()
            const savedResponses = await getResponsesByQuestionAndUser(question._id.toString("hex"), userId) as IResponse[]
            // console.log("savedResponses", savedResponses)
            savedResponses.forEach((response) => {
                // console.log("forEach", response)
                responsesActions.set(response.id, {
                    id: response.id,
                    response: response.response,
                    answer: response.answer,
                    jsonResponse: response.jsonResponse,
                    jsonAnswer: response.jsonAnswer,
                    // correct: response.correct,
                    mark: response.mark
                })
                savedResponsesActions.set(response.id, {
                    id: response.id,
                    response: response.response,
                    answer: response.answer,
                    jsonResponse: response.jsonResponse,
                    jsonAnswer: response.jsonAnswer,
                    // correct: response.correct,
                    mark: response.mark
                })
                correctActions.set(response.id, isCorrect(response.jsonResponse, response.jsonAnswer))
            })
            setAnswered(savedResponses.length > 0)
        }

        const ce = MathfieldElement.computeEngine;
        if (ce) {
            ce.pushScope();
            declarations.forEach((declaration) => {
                // @ts-ignore
                ce.declare(declaration.symbol, declaration.domain);
            })
        }

        if (question.layouts) {
            window.mathVirtualKeyboard.layouts = JSON.parse(question.layouts)
        }

        fetchResponses().then(() => {
            // console.log(responses)
            // console.log(correct)
            setLoaded(true);
        })
        // setLoaded(true);
    })


    // if (!loaded) {
    //     if (answer) {
    //         const responseMap: MathAnswerResults = new Map();
    //         const savedResponseMap: MathAnswerResults = new Map();
    //         Object.entries(answer.answers).forEach(([key, value]) => {
    //             responseMap.set(key, {answer: value.answer, correct: value.correct, mark: value.mark});
    //             savedResponseMap.set(key, {answer: value.answer, correct: value.correct, mark: value.mark});
    //         })
    //         responses.current = responseMap;
    //         // setResponses(responseMap);
    //         setSavedResponses(savedResponseMap);
    //         setAnswered(true)
    //     }
    //
    //     const ce = MathfieldElement.computeEngine;
    //     if (ce) {
    //         ce.pushScope();
    //         declarations.forEach((declaration) => {
    //             // @ts-ignore
    //             ce.declare(declaration.symbol, declaration.domain);
    //         })
    //     }
    //
    //     setLoaded(true);
    // }

    const submit = () => {
        if (answered) return;
        const hasFocus = document.hasFocus()
        setHadFocus(hasFocus)
        if (!isAdmin && !isPowerPoint && hasFocus) {
            responses.forEach((response) => {
                createResponse({response: {...response, question: question._id.toString("hex"), user: userId}}).catch(console.error)
                correctActions.set(response.id, isCorrect(response.jsonResponse, response.jsonAnswer))
            })
        }
        // setSubmitted(true)
        setAnswered(true)
    }

    // const submit = async () => {
    //     if (submitted || savedResponses.size > 0) return;
    //     setSubmitted(true)
    //     if (isAdmin || isPowerPoint || !document.hasFocus()) return;
    //     setSavedResponses(new Map(responses.current));
    //     await createAnswer({
    //         answer: {answers: responses.current, question: question._id.toString("hex"), user: userId},
    //         path: ""
    //     });
    // }

    // const updateResponse = (id: string, response: string, correct: boolean, mark: number) => {
    //     // const responseMap = new Map(responses);
    //     // responseMap.set(id, {answer: response, correct: correct, mark: mark});
    //     // console.log("responseMap",responseMap)
    //     // setResponses(responseMap);
    //     responses.current.set(id, {answer: response, correct: correct, mark: mark});
    //     console.log("responses.current", responses.current)
    // }

    const onShowSolution = () => {
        if (answered) return;
        // setSubmitted(true);
        setAnswered(true)
        editQuestion({
            question: {...question, _id: question._id.toString("hex"), showSolution: true},
            path: ""
        }).catch(console.error);
        showSolutionChannel.publish({}).catch(console.error);
    }

    // const onShowSolution = () => {
    //     if (submitted) return;
    //     // setSubmitted(true);
    //     setAnswered(true)
    //     editQuestion({
    //         question: {...question, _id: question._id.toString("hex"), showSolution: true},
    //         path: ""
    //     }).catch(console.error);
    //     showSolutionChannel.publish({}).catch(console.error);
    // }

    return (
        <>
            {!userId.startsWith("view") && <CurrentQuestion/>}
            {loaded ?
                <>
                    {question.imageUrl &&
                        <div className={""}><Image src={question.imageUrl!} alt={"question image"} width={250}
                                                   height={250}
                                                   className={"w-full max-h-96 object-contain object-center"}/></div>}
                    <Math question={question.question} responses={savedResponses}
                          answered={answered} showSolution={showSolution} correct={correct} hadFocus={hadFocus} isAdmin={isAdmin}
                          isPowerPoint={isPowerPoint} responseActions={responsesActions}></Math>
                    {/*<Math text={question.question} responses={responses.current} savedResponses={savedResponses}*/}
                    {/*      submitted={submitted} showSolution={showSolution} isAdmin={isAdmin}*/}
                    {/*      isPowerPoint={isPowerPoint} updateResponse={updateResponse}></Math>*/}
                </>
                :
                <Box className={"text-center"}><CircularProgress/></Box>
            }
            {!isPowerPoint && (loaded && isAdmin ?
                <Button variant={"contained"} disabled={answered} onClick={onShowSolution}>Show Solution</Button>
                : loaded &&
                <Button variant={"contained"} disabled={answered}
                        onClick={submit}>{answered ? "Submitted" : "Submit Answer"}</Button>)
            }
        </>
    );
};
