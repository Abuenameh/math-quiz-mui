import {useRef, useState} from "react";
import Box from "@mui/material/Box";
import {MathfieldElement} from "mathlive";
import {Actions, useEffectOnce} from "usehooks-ts";
import {ResponseProps} from "@/components/Question";

export type MathAnswerProps = {
    display: "inline-block" | "block"
    id: string
    answer: string
    size: number
    mark: number
    response: string
    answered: boolean
    correct: boolean
    hadFocus: boolean
    showSolution: boolean
    isAdmin: boolean
    isPowerPoint: boolean
    responseActions: Actions<string, ResponseProps>
}

export const MathAnswer = ({
                               display,
                               id,
                               answer,
    size,
                               mark,
                               response,
    answered,
                               correct,
    hadFocus,
                               showSolution,
                               isAdmin,
                               isPowerPoint,
                               responseActions,
                           }: MathAnswerProps) => {
    const responseRef = useRef<MathfieldElement>(null);
    const answerRef = useRef<MathfieldElement>(null);
    const [jsonAnswer, setJSONAnswer] = useState("");


    const toExpression = (str: string) => {
        return JSON.stringify(MathfieldElement.computeEngine?.parse(str).simplify().json) || "[]";
    }

    useEffectOnce(() => {
        setJSONAnswer(toExpression(answer));
        // console.log("useEffectOnce",{id: id, response: response, answer: answer, jsonResponse: toExpression(response), jsonAnswer: toExpression(answer), mark: mark})
        responseActions.set(id, {id: id, response: response, answer: answer, jsonResponse: toExpression(response), jsonAnswer: toExpression(answer), mark: mark})
    })

    const editable = !answered && !isAdmin && !isPowerPoint;
    const actuallyShowSolution = answered && showSolution;

    const responseStyle = {
        display: (answered && (isAdmin || isPowerPoint || !hadFocus)) ? "none" : display,
        width: (display === "inline-block") && (editable || isAdmin || isPowerPoint || !hadFocus) ? `${size}em` : "auto",
        height: (display === "block") && (editable || isAdmin || isPowerPoint || !hadFocus ) ? `${size}em` : "auto",
        color: actuallyShowSolution ? (correct ? "black" : "black") : "auto",
        backgroundColor: actuallyShowSolution ? (correct ? "#81c784" : "#e57373") : "auto",
    };
    const answerStyle = {
        display: !actuallyShowSolution ? "none" : display,
        marginLeft: display === "inline-block" && !(answered && (isAdmin || isPowerPoint || !hadFocus)) ? "0.5em" : "auto",
        marginTop: display === "block" && !(answered && (isAdmin || isPowerPoint || !hadFocus)) ? "0.5em" : "auto",
    };

    const onChange = () => {
        if (responseRef.current) {
            // console.log(responseRef.current.expression, responseRef.current.expression.simplify())
            responseActions.set(id, {id: id, response: responseRef.current.getValue(), answer: answer, jsonResponse: JSON.stringify(responseRef.current.expression.simplify().json), jsonAnswer: jsonAnswer, mark: mark})
            // responseActions.set(id, {id: id, response: responseRef.current.expression.simplify().toString(), answer: toExpression(answer), mark: mark})
        }
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
