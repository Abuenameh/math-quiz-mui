'use client'

import {InlineMath, BlockMath} from "react-katex";
import regexifyString from "regexify-string";
import "@abuenameh/mathlive";
import "@abuenameh/compute-engine"
import {MathfieldElement} from "@abuenameh/mathlive";
import {MathAnswer} from "@/components/MathAnswer";
import Box from "@mui/material/Box";
import {useAbly} from "ably/react";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement>;
        }
    }
}

function toMath(text: string) {
    return regexifyString({
        // pattern: /\$([^\w\$][^\$]*)\$|\$\$([^\w\$][^\$]*)\$\$/gim,
        pattern: /‵([^‷′]*)′|‶([^‷″]*)″|‵‷(?:\[([^,]+),(\d+)])?([^‴]*)‴′|‶‷(?:\[([^,]+),(\d+)])?([^‴]*)‴″/gm,
        decorator: (match, index, result) => {
            // console.log(result)
            if (result?.[1] !== undefined) {
                return <InlineMath key={index}>{result?.[1]}</InlineMath>;
            }
            else if (result?.[2] !== undefined) {
                return <BlockMath key={index}>{result?.[2]}</BlockMath>;
            }
            else if (result?.[5] !== undefined) {
                return <MathAnswer key={index} display="inline" id={result?.[3]} answer={result?.[5]} mark={Number(result?.[4])} />
                // return <math-field key={index} style={{display: "inline-block", width: "5em"}}>{result?.[5]}</math-field>
            }
            else if (result?.[8] !== undefined) {
                return <MathAnswer key={index} display="block" id={result?.[3]} answer={result?.[8]} mark={Number(result?.[4])} />
                // return <math-field key={index} style={{display: "block", height: "5em"}}>{result?.[8]}</math-field>
            }
            else {
                return <>{match}</>;
            }
        },
        input: text
    })
}

export const Math = ( { text }: { text: string }) => {
    return (
        <Box>
            {toMath(text)}
        </Box>
    );
};
