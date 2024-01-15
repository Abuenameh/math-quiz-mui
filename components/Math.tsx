'use client'

import {BlockMath, InlineMath} from "react-katex";
import regexifyString from "regexify-string";
import "mathlive";
import {MathfieldElement} from "mathlive";
import {MathAnswer, MathAnswerProps} from "@/components/MathAnswer";
import Box from "@mui/material/Box";
import {ResponseProps} from "@/components/Question";
import {Actions} from "usehooks-ts";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement>;
        }
    }
}

type MathProps = {
    // text: string
    question: string
    responses: Omit<Map<string, ResponseProps>, "set" | "clear" | "delete">
    // responses: MathAnswerResults
    // savedResponses: MathAnswerResults
    answered: boolean
    correct: Omit<Map<string, boolean>, "set" | "clear" | "delete">
    hadFocus: boolean
    // submitted: boolean
    showSolution: boolean
    // userId: string
    isAdmin: boolean
    isPowerPoint: boolean
    responseActions: Actions<string, ResponseProps>
    // updateResponse: (id: string, response: string, correct: boolean, mark: number) => void
}

function toMath({
                    // text,
    question,
                    responses,
                    // savedResponses,
                    // submitted,
    answered,
                    correct,
                    hadFocus,
                    showSolution,
    // userId,
                    isAdmin,
                    isPowerPoint,
                    responseActions,
                    // updateResponse
                }: MathProps) {
    return regexifyString({
        pattern: /⟬([^⟦][^⟭]*)⟭|⦗([^⟦][^⦘]*)⦘|⟬⟦([^,]+),(\d+)⟧([^⟭]*)⟭|⦗⟦([^,]+),(\d+)⟧([^⦘]*)⦘/gm,
        decorator: (match, index, result) => {
            if (result?.[1] !== undefined) {
                return <InlineMath key={index}>{result?.[1]}</InlineMath>;
            } else if (result?.[2] !== undefined) {
                return <BlockMath key={index}>{result?.[2]}</BlockMath>;
            } else if (result?.[5] !== undefined) {
                const id = result?.[3] || index.toString();
                const props: MathAnswerProps = {
                    display: "inline-block",
                    id: id,
                    answer: result[5],
                    mark: Number(result?.[4]) || 0,
                    // responses: responses,
                    response: responses.get(id)?.response || "",
                    responses: responses,
                    answered: answered,
                    correct: correct.get(id) || false,
                    hadFocus: hadFocus,
                    // submitted: submitted,
                    showSolution: showSolution,
                    // hasSavedResponse: response !== undefined,
                    // correct: responses?.get(id)?.correct || false,
                    isAdmin: isAdmin,
                    isPowerPoint: isPowerPoint,
                    responseActions: responseActions,
                    // updateResponse: updateResponse
                }
                return <MathAnswer key={index} {...props} />
            } else if (result?.[8] !== undefined) {
                const id = result?.[6] || index.toString();
                const props: MathAnswerProps = {
                    display: "block",
                    id: id,
                    answer: result[8],
                    mark: Number(result?.[7]) || 0,
                    // responses: responses,
                    response: responses.get(id)?.response || "",
                    responses: responses,
                    answered: answered,
                    correct: correct.get(id) || false,
                    hadFocus: hadFocus,
                    // submitted: submitted,
                    showSolution: showSolution,
                    // hasSavedResponse: response !== undefined,
                    // correct: responses?.get(id)?.correct || false,
                    isAdmin: isAdmin,
                    isPowerPoint: isPowerPoint,
                    responseActions: responseActions,
                }
                return <MathAnswer key={index} {...props} />
            } else {
                return <>{match}</>;
            }
        },
        input: question
    })
}

export const Math = (props: MathProps) => {
    return (
        <>
            <Box>
                {toMath(props)}
            </Box>
        </>
    );
};
