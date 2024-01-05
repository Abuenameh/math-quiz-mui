'use client'

import {InlineMath, BlockMath} from "react-katex";
import regexifyString from "regexify-string";
import "mathlive";
import {MathfieldElement} from "mathlive";
import {MathAnswer, MathAnswerProps} from "@/components/MathAnswer";
import Box from "@mui/material/Box";
import {MathAnswerResults} from "@/types";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement>;
        }
    }
}

type MathProps = {
    text: string
    responses: MathAnswerResults
    savedResponses: MathAnswerResults
    submitted: boolean
    showSolution: boolean
    isAdmin: boolean
    isPowerPoint: boolean
    updateResponse: (id: string, response: string, correct: boolean, mark: number) => void
}

function toMath({text, responses, savedResponses, submitted, showSolution, isAdmin, isPowerPoint, updateResponse}: MathProps) {
    return regexifyString({
        pattern: /⟬([^⟦][^⟭]*)⟭|⦗([^⟦][^⦘]*)⦘|⟬⟦([^,]+),(\d+)⟧([^⟭]*)⟭|⦗⟦([^,]+),(\d+)⟧([^⦘]*)⦘/gm,
        decorator: (match, index, result) => {
            if (result?.[1] !== undefined) {
                return <InlineMath key={index}>{result?.[1]}</InlineMath>;
            }
            else if (result?.[2] !== undefined) {
                return <BlockMath key={index}>{result?.[2]}</BlockMath>;
            }
            else if (result?.[5] !== undefined) {
                const id = result?.[3] || index.toString();
                const response = savedResponses?.get(id)?.answer;
                const props: MathAnswerProps = {
                    display: "inline-block",
                    id: id,
                    answer: result[5],
                    mark: Number(result?.[4]) || 0,
                    responses: responses,
                    response: response || "",
                    submitted: submitted,
                    showSolution: showSolution,
                    hasSavedResponse: response !== undefined,
                    correct: responses?.get(id)?.correct || false,
                    isAdmin: isAdmin,
                    isPowerPoint: isPowerPoint,
                    updateResponse: updateResponse
                }
                return <MathAnswer key={index} {...props} />
            }
            else if (result?.[8] !== undefined) {
                const id = result?.[6] || index.toString();
                const response = savedResponses?.get(id)?.answer;
                const props: MathAnswerProps = {
                    display: "block",
                    id: id,
                    answer: result[8],
                    mark: Number(result?.[7]) || 0,
                    responses: responses,
                    response: response || "",
                    submitted: submitted,
                    showSolution: showSolution,
                    hasSavedResponse: response !== undefined,
                    correct: responses?.get(id)?.correct || false,
                    isAdmin: isAdmin,
                    isPowerPoint: isPowerPoint,
                    updateResponse: updateResponse
                }
                return <MathAnswer key={index} {...props} />
            }
            else {
                return <>{match}</>;
            }
        },
        input: text
    })
}

export const Math = ( props: MathProps) => {
    return (
        <>
        <Box>
            {toMath(props)}
        </Box>
        </>
    );
};
