import {useEffect, useRef} from "react";
import Box from "@mui/material/Box";
import {MathfieldElement} from "mathlive";
import {MathAnswerResults} from "@/types";

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
    isPowerPoint: boolean
    updateResponse: (id: string, response: string, correct: boolean, mark: number) => void
}

export const MathAnswer = ({
                               display,
                               id,
                               answer,
                               mark,
                               response,
                               submitted,
                               showSolution,
                               hasSavedResponse,
                               correct,
                               isAdmin,
                               isPowerPoint,
                               updateResponse
                           }: MathAnswerProps) => {
    const responseRef = useRef<MathfieldElement>(null);
    const answerRef = useRef<MathfieldElement>(null);
    const initializedResponse = useRef(false)

    useEffect(() => {
        if (!initializedResponse.current) {
            updateResponse(id, response, correct, mark);
            initializedResponse.current = true
        }
    }, [correct, id, mark, response, updateResponse])

    const editable = !submitted && !hasSavedResponse && !isAdmin && !isPowerPoint;
    const actuallyShowSolution = (submitted || hasSavedResponse) && showSolution;

    const responseStyle = {
        display: (submitted && (isAdmin || isPowerPoint)) ? "none" : display,
        width: (display === "inline-block") && (editable || isAdmin || isPowerPoint) ? "5em" : "auto",
        height: (display === "block") && (editable || isAdmin || isPowerPoint) ? "5em" : "auto",
        color: actuallyShowSolution ? (correct ? "black" : "black") : "auto",
        backgroundColor: actuallyShowSolution ? (correct ? "#81c784" : "#e57373") : "auto",
    };
    const answerStyle = {
        display: !actuallyShowSolution ? "none" : display,
        marginLeft: display === "inline-block" ? "0.5em" : "auto",
        marginTop: display === "block" ? "0.5em" : "auto",
    };

    const onChange = () => {
        if (responseRef.current && answerRef.current) {
            updateResponse(id, responseRef.current.getValue(), responseRef.current.expression.simplify().isEqual(answerRef.current.expression.simplify()), mark);
        }
    }

    return (
        <>
            <Box
                className={`${display} ${display === "block" ? "mt-5" : ""} ${!isAdmin && !isPowerPoint ? "border-2 p-2 bg-gray-100" : ""}`}>
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
