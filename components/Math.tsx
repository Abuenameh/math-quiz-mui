'use client'

// import {BlockMath, InlineMath} from "react-katex";
import regexifyString from "regexify-string";
import "mathlive";
import {MathfieldElement} from "mathlive";
import {MathAnswer, MathAnswerProps} from "@/components/MathAnswer";
import Box from "@mui/material/Box";
import {ResponseProps} from "@/components/Question";
import {Actions} from "usehooks-ts";
import { MathJax } from "better-react-mathjax";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement>;
        }
    }
}

type MathProps = {
    question: string
    responses: Omit<Map<string, ResponseProps>, "set" | "clear" | "delete">
    answered: boolean
    correct: Omit<Map<string, boolean>, "set" | "clear" | "delete">
    hadFocus: boolean
    showSolution: boolean
    isAdmin: boolean
    isPowerPoint: boolean
    responseActions: Actions<string, ResponseProps>
}

// function toMath({
//                     // text,
//     question,
//                     responses,
//                     // savedResponses,
//                     // submitted,
//     answered,
//                     correct,
//                     hadFocus,
//                     showSolution,
//     // userId,
//                     isAdmin,
//                     isPowerPoint,
//                     responseActions,
//                     // updateResponse
//                 }: MathProps) {
//     return
//     return regexifyString({
//         pattern: /⟬([^⟦][^⟭]*)⟭|⦗([^⟦][^⦘]*)⦘|⟬⟦(\d+),([^,]+),(\d+)⟧([^⟭]*)⟭|⦗⟦(\d+),([^,]+),(\d+)⟧([^⦘]*)⦘/gm,
//         decorator: (match, index, result) => {
//             if (result?.[1] !== undefined) {
//                 return <InlineMath key={index}>{result?.[1]}</InlineMath>;
//             } else if (result?.[2] !== undefined) {
//                 return <BlockMath key={index}>{result?.[2]}</BlockMath>;
//             } else if (result?.[6] !== undefined) {
//                 const id = result?.[4] || index.toString();
//                 const props: MathAnswerProps = {
//                     display: "inline-block",
//                     id: id,
//                     answer: result[6],
//                     size: Number(result?.[3]) || 5,
//                     mark: Number(result?.[5]) || 0,
//                     // responses: responses,
//                     response: responses.get(id)?.response || "",
//                     responses: responses,
//                     answered: answered,
//                     correct: correct.get(id) || false,
//                     hadFocus: hadFocus,
//                     // submitted: submitted,
//                     showSolution: showSolution,
//                     // hasSavedResponse: response !== undefined,
//                     // correct: responses?.get(id)?.correct || false,
//                     isAdmin: isAdmin,
//                     isPowerPoint: isPowerPoint,
//                     responseActions: responseActions,
//                     // updateResponse: updateResponse
//                 }
//                 return <MathAnswer key={index} {...props} />
//             } else if (result?.[10] !== undefined) {
//                 const id = result?.[8] || index.toString();
//                 const props: MathAnswerProps = {
//                     display: "block",
//                     id: id,
//                     answer: result[10],
//                     size: Number(result?.[7]) || 5,
//                     mark: Number(result?.[9]) || 0,
//                     // responses: responses,
//                     response: responses.get(id)?.response || "",
//                     responses: responses,
//                     answered: answered,
//                     correct: correct.get(id) || false,
//                     hadFocus: hadFocus,
//                     // submitted: submitted,
//                     showSolution: showSolution,
//                     // hasSavedResponse: response !== undefined,
//                     // correct: responses?.get(id)?.correct || false,
//                     isAdmin: isAdmin,
//                     isPowerPoint: isPowerPoint,
//                     responseActions: responseActions,
//                 }
//                 return <MathAnswer key={index} {...props} />
//             } else {
//                 return <>{match}</>;
//             }
//         },
//         input: question
//     })
// }

export const Math = ({question,
                         responses,
                         answered,
                         correct,
                         hadFocus,
                         showSolution,
                         isAdmin,
                         isPowerPoint,
                         responseActions}: MathProps) => {
    return (
        <>
            <Box className={"whitespace-pre-wrap"}>
                <MathJax>{regexifyString({
                    pattern: /\\{(.*?),(\d*),(\d*),(?:\\\((.*?)\\\)\\}|\\\[(.*?)\\]\\})/gm,
                    decorator: (match, index, result) => {
                        const id = result?.[1] || index.toString();
                        const props: MathAnswerProps = {
                            display: result?.[4] ? "inline-block" : "block",
                            id: id,
                            answer: result?.[4] || result?.[5] || "",
                            size: Number(result?.[3]) || 5,
                            mark: Number(result?.[2]) || 0,
                            response: responses.get(id)?.response || "",
                            answered: answered,
                            correct: correct.get(id) || false,
                            hadFocus: hadFocus,
                            showSolution: showSolution,
                            isAdmin: isAdmin,
                            isPowerPoint: isPowerPoint,
                            responseActions: responseActions,
                        }
                        return <MathAnswer key={index} {...props} />
                    },
                    input: question
                })}</MathJax>
                {/*{toMath(props)}*/}
            </Box>
        </>
    );
};
