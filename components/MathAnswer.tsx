import {useEffect, useRef, useState} from "react";
import Box from "@mui/material/Box";
import {MathfieldElement} from "mathlive";
import {MathAnswerResults} from "@/types";
import {IResponse} from "@/lib/database/models/response.model";
import {createResponse} from "@/lib/actions/response.actions";
import {Actions, useEffectOnce} from "usehooks-ts";
import {ResponseProps} from "@/components/Question";

export type MathAnswerProps = {
    display: "inline-block" | "block"
    // response: IResponse
    id: string
    answer: string
    mark: number
    // responses: MathAnswerResults
    response: string
    responses: Omit<Map<string, ResponseProps>, "set" | "clear" | "delete">
    // submitted: boolean
    answered: boolean
    correct: boolean
    hadFocus: boolean
    showSolution: boolean
    // hasSavedResponse: boolean
    // correct: boolean
    isAdmin: boolean
    isPowerPoint: boolean
    responseActions: Actions<string, ResponseProps>
    // updateResponse: (id: string, response: string, correct: boolean, mark: number) => void
}

export const MathAnswer = ({
                               display,
    // response,
                               id,
                               answer,
                               mark,
                               response,
    responses,
                               // submitted,
    answered,
                               correct,
    hadFocus,
                               showSolution,
                               // hasSavedResponse,
                               // correct,
                               isAdmin,
                               isPowerPoint,
                               responseActions,
                               // updateResponse
                           }: MathAnswerProps) => {
    const responseRef = useRef<MathfieldElement>(null);
    const answerRef = useRef<MathfieldElement>(null);
    const initializedResponse = useRef(false)
    // const [correct, setCorrect] = useState(false);
    // const [dirty, setDirty] = useState(false);
    // const [answered, setAnswered] = useState(!!response);
    const [jsonAnswer, setJSONAnswer] = useState("");


    const toExpression = (str: string) => {
        return MathfieldElement.computeEngine?.parse(str).simplify().toString() || "[]";
    }

    useEffectOnce(() => {
        setJSONAnswer(toExpression(answer));
        // console.log("useEffectOnce",{id: id, response: response, answer: answer, jsonResponse: toExpression(response), jsonAnswer: toExpression(answer), mark: mark})
        responseActions.set(id, {id: id, response: response, answer: answer, jsonResponse: toExpression(response), jsonAnswer: toExpression(answer), mark: mark})
    })

//     useEffect(() => {
//         if (!initializedResponse.current) {
//             if (responseRef.current && answerRef.current) {
//                 const newCorrect = responseRef.current.expression.simplify().isEqual(answerRef.current.expression.simplify());
//                 setCorrect(newCorrect);
//                 updateResponse(id, responseRef.current.getValue(), newCorrect, mark);
//             }
//             // updateResponse(id, response, correct, mark);
//             initializedResponse.current = true
//         }
//     // }, [correct, id, mark, response, updateResponse])
// }, [id, mark, response, updateResponse])

    // const editable = !submitted && !answered && !isAdmin && !isPowerPoint;
    // const actuallyShowSolution = (submitted || answered) && showSolution;

    const editable = !answered && !isAdmin && !isPowerPoint;
    const actuallyShowSolution = answered && showSolution;

    const responseStyle = {
        display: (answered && (isAdmin || isPowerPoint || !hadFocus)) ? "none" : display,
        width: (display === "inline-block") && (editable || isAdmin || isPowerPoint || !hadFocus) ? "5em" : "auto",
        height: (display === "block") && (editable || isAdmin || isPowerPoint || !hadFocus ) ? "5em" : "auto",
        color: actuallyShowSolution ? (correct ? "black" : "black") : "auto",
        backgroundColor: actuallyShowSolution ? (correct ? "#81c784" : "#e57373") : "auto",
    };
    const answerStyle = {
        display: !actuallyShowSolution ? "none" : display,
        marginLeft: display === "inline-block" ? "0.5em" : "auto",
        marginTop: display === "block" ? "0.5em" : "auto",
    };

    // if (submitted && dirty) {
    //     setDirty(false)
    //     console.log("Submitted",submitted)
    //     if (responseRef.current && answerRef.current) {
    //         const newCorrect = responseRef.current.expression.simplify().isEqual(answerRef.current.expression.simplify());
    //         setCorrect(newCorrect);
    //         if (!answered) {
    //             await createResponse({response: {id: id, response: responseRef.current.getValue(), correct: newCorrect, mark: mark, question: response.question.toString("hex"), user: userId}});
    //         }
    //         updateResponse(id, responseRef.current.getValue(), newCorrect, mark);
    //         console.log("updateResponse", id, responseRef.current.getValue(), newCorrect, mark)
    //     }
    // }

    const onChange = () => {
        if (responseRef.current) {
            responseActions.set(id, {id: id, response: responseRef.current.getValue(), answer: answer, jsonResponse: responseRef.current.expression.simplify().toString(), jsonAnswer: jsonAnswer, mark: mark})
            // responseActions.set(id, {id: id, response: responseRef.current.expression.simplify().toString(), answer: toExpression(answer), mark: mark})
        }
        // setDirty(true)
        // if (responseRef.current && answerRef.current) {
        //     // updateResponse(id, responseRef.current.getValue(), responseRef.current.expression.simplify().isEqual(answerRef.current.expression.simplify()), mark);
        // }
    }

    return (
        <>
            <Box
                className={`${display} ${display === "block" ? "mt-5" : ""} ${!isAdmin && !isPowerPoint && hadFocus ? "border-2 p-2 bg-gray-100" : ""}`}>
                {editable ?
                    <math-field ref={responseRef} style={responseStyle} onInput={onChange}
                    >{response}</math-field>
                    :
                    <math-field style={responseStyle} onInput={onChange}
                                read-only={""}>{response}</math-field>
                }
                <math-field ref={answerRef} style={answerStyle} read-only={""}>{answer}</math-field>
            </Box>
        </>
    );
};
