import {ChangeEvent, Key, MutableRefObject, RefObject, useContext, useEffect, useRef, useState} from "react";
import Box from "@mui/material/Box";
import {MathfieldElement} from "@abuenameh/mathlive";
import {SolutionContext} from "@/components/Question";
import {useAbly, useChannel} from "ably/react";
import * as Ably from "ably"
import {MathAnswerResults} from "@/types";
import {CircularProgress, Container, Skeleton} from "@mui/material";
import Typography from "@mui/material/Typography";

export type MathAnswerProps = {
    display: "inline-block" | "block"
    id: string
    answer: string
    mark: number
    responses: MathAnswerResults
    response: string
    submitted: boolean
    showSolution: boolean
    hasSavedResponse: boolean
    correct: boolean
    isAdmin: boolean
    updateResponse: (id: string, response: string, correct: boolean, mark: number) => void
}

export const MathAnswer = ( { display, id, answer, mark, response, submitted, showSolution, hasSavedResponse, correct, isAdmin, updateResponse }: MathAnswerProps ) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const responseRef = useRef<MathfieldElement>(null);
    const answerRef = useRef<MathfieldElement>(null);

    const editable = !submitted && !hasSavedResponse && !isAdmin;
    const actuallyShowSolution =  (submitted || hasSavedResponse) && showSolution;

    console.log("response", response, responseRef)
    const responseStyle ={
        display: (submitted && isAdmin) ? "none" : display,
        width: (display === "inline-block") && (editable || isAdmin) ? "5em" : "auto",
        height: (display === "block") && (editable || isAdmin) ? "5em" : "auto",
        // marginTop: display === "block" ? "1em" : "auto",
        color: actuallyShowSolution ? (correct ? "green" : "red") : "black",
    };
    const answerStyle = {
        display: !actuallyShowSolution ? "none" : display,
        marginLeft: display === "inline-block" ? "0.5em" : "auto",
        marginTop: display === "block" ? "0.5em" : "auto",
    };

    const onChange = (e: ChangeEvent<MathfieldElement>) => {
        if (responseRef.current && answerRef.current) {
            updateResponse(id, responseRef.current.getValue(), responseRef.current.expression.simplify().isEqual(answerRef.current.expression.simplify()), mark);
        }
    }

    return (
        <>
            <Box className={`${display} border-2 p-2 ${display === "block" ? "mt-5" : ""} bg-gray-100`}>
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
