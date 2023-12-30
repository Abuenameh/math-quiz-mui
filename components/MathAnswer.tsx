import {ChangeEvent, Key, useRef, useState} from "react";
import Box from "@mui/material/Box";
import {MathfieldElement} from "mathlive";

type MathAnswerProps = {
    key: Key
    display: "inline" | "block"
    id: string
    answer: string
    mark: number
}

export const MathAnswer = ( { display, id, answer, mark }: MathAnswerProps ) => {
    const responseRef = useRef<MathfieldElement>(null);
    const answerRef = useRef<MathfieldElement>(null);
    const [correct, setCorrect] = useState(false);

    const responseStyle = {
        display: display === "inline" ? "inline-block" : display === "block" ? "block" : "auto",
        width: display === "inline" ? "5em" : "auto",
        height: display === "block" ? "5em" : "auto",
        marginTop: display === "block" ? "1em" : "auto",
    }
    const answerStyle = {
        display: display === "inline" ? "inline-block" : display === "block" ? "block" : "auto",
        width: display === "inline" ? "5em" : "auto",
        height: display === "block" ? "5em" : "auto",
        marginLeft: display === "inline" ? "0.5em" : "auto",
        marginTop: display === "block" ? "1em" : "auto",
    }

    const onChange = (e: ChangeEvent<MathfieldElement>) => {
        if (responseRef.current && answerRef.current) {
            console.log(responseRef.current.expression.toString())
            console.log(answerRef.current.expression.toString())
            setCorrect(responseRef.current.expression.simplify().isEqual(answerRef.current.expression.simplify()));
        }
    }

    return (
        <>
            <math-field ref={responseRef} id={id} style={responseStyle} onInput={onChange}></math-field>
            <math-field ref={answerRef} style={answerStyle}>{answer}</math-field>
            {correct.toString()}
        </>
    );
};
