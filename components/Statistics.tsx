'use client'

import {useEffect, useRef, useState} from "react";
// import {getAnswersByUser} from "@/lib/actions/answer.actions";
import {Box, CircularProgress, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
// import {IAnswer} from "@/lib/database/models/answer.model";
import {ITopic} from "@/lib/database/models/topic.model";
import {ICourse} from "@/lib/database/models/course.model";
import {IQuestion} from "@/lib/database/models/question.model";
import {CourseMarksTable} from "@/components/CourseMarksTable";
import {TopicMarksTable} from "@/components/TopicMarksTable";
import {CurrentQuestion} from "@/components/CurrentQuestion";
import {useEffectOnce} from "usehooks-ts";
import {getResponsesByUser} from "@/lib/actions/response.actions";
import {IResponse} from "@/lib/database/models/response.model";
import {MathfieldElement} from "mathlive";
import "compute-engine";

export interface MarkStats {
    mark: number;
    totalMark: number;
    course: ICourse;
    topic: ITopic;
}

export const Statistics = ({userId}: { userId: string }) => {
    const [noStats, setNoStats] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const courseMarks = useRef(new Map<string, MarkStats>())
    const topicMarks = useRef(new Map<string, MarkStats>())

    const mark = useRef(0);
    const totalMark = useRef(0);

    // const mathfield1Ref = useRef<MathfieldElement>(null);
    // const mathfield2Ref = useRef<MathfieldElement>(null);
    // const [mathfield1Value, setMathfield1Value] = useState("");
    // const [mathfield2Value, setMathfield2Value] = useState("");
    // const [mathfield1Expression, setMathfield1Expression] = useState("");
    // const [mathfield2Expression, setMathfield2Expression] = useState("");
    // const textfield1Ref = useRef<HTMLInputElement>(null);
    // const textfield2Ref = useRef<HTMLInputElement>(null);
    // const [exprEqual, setExprEqual] = useState(false);

    useEffectOnce(() => {
        const isCorrect = (response: string, answer: string) => {
            const ce = MathfieldElement.computeEngine;
            if (!ce) {
                console.error("Compute engine not loaded");
                return false;
            }
            return ce.box(JSON.parse(response)).isEqual(ce.box(JSON.parse(answer)))
            // return ce.parse(response).simplify().isEqual(ce.parse(answer).simplify())
        }



        const fetchStatistics = async () => {
            const responses = await getResponsesByUser(userId) as IResponse[];
            if (responses.length === 0) {
                setNoStats(true);
            } else {
                mark.current = 0;
                totalMark.current = 0;
                courseMarks.current = new Map<string, MarkStats>();
                topicMarks.current = new Map<string, MarkStats>();
                responses.map((response) => {
                    const question = response.question as IQuestion;
                    const topic = question.topic as ITopic;
                    const course = topic.course as ICourse;
                    const courseKey = course.code + ": " + course.title;
                    const topicKey = course.code + ": " + topic.name;
                    if (!courseMarks.current.has(courseKey)) {
                        courseMarks.current.set(courseKey, {mark: 0, totalMark: 0, course: course, topic: topic})
                    }
                    if (!topicMarks.current.has(topicKey)) {
                        topicMarks.current.set(topicKey, {mark: 0, totalMark: 0, course: course, topic: topic})
                    }
                    if (isCorrect(response.jsonResponse, response.jsonAnswer)) {
                        mark.current += response.mark;
                        courseMarks.current.get(courseKey)!.mark += response.mark;
                        topicMarks.current.get(topicKey)!.mark += response.mark;
                    }
                    totalMark.current += response.mark;
                    courseMarks.current.get(courseKey)!.totalMark += response.mark;
                    topicMarks.current.get(topicKey)!.totalMark += response.mark;
                })
                // console.log(courseMarks.current, topicMarks.current)
            }
            setLoaded(true);
        }
        if (userId) {
            fetchStatistics().catch(console.error);
        }
    })

    // useEffect(() => {
    //     const fetchStatistics = async () => {
    //         const answers = await getAnswersByUser(userId) as IAnswer[];
    //         if (answers.length === 0) {
    //             setNoStats(true);
    //         } else {
    //             mark.current = 0;
    //             totalMark.current = 0;
    //             courseMarks.current = new Map<string, MarkStats>();
    //             topicMarks.current = new Map<string, MarkStats>();
    //             answers.map((answer) => {
    //                 const question = answer.question as IQuestion;
    //                 const topic = question.topic as ITopic;
    //                 const course = topic.course as ICourse;
    //                 const courseKey = course.code + ": " + course.title;
    //                 const topicKey = course.code + ": " + topic.name;
    //                 if (!courseMarks.current.has(courseKey)) {
    //                     courseMarks.current.set(courseKey, {mark: 0, totalMark: 0, course: course, topic: topic})
    //                 }
    //                 if (!topicMarks.current.has(topicKey)) {
    //                     topicMarks.current.set(topicKey, {mark: 0, totalMark: 0, course: course, topic: topic})
    //                 }
    //                 Object.entries(answer.answers).forEach(([, value]) => {
    //                     if (value.correct) {
    //                         mark.current += value.mark;
    //                         courseMarks.current.get(courseKey)!.mark += value.mark;
    //                         topicMarks.current.get(topicKey)!.mark += value.mark;
    //                     }
    //                     totalMark.current += value.mark;
    //                     courseMarks.current.get(courseKey)!.totalMark += value.mark;
    //                     topicMarks.current.get(topicKey)!.totalMark += value.mark;
    //                 })
    //             })
    //             console.log(courseMarks.current, topicMarks.current)
    //         }
    //         setLoaded(true);
    //     }
    //     if (userId) {
    //         fetchStatistics().catch(console.error);
    //     }
    // }, [userId])
    //
    return (
        <>
            <CurrentQuestion/>
            <Box bgcolor={"primary.light"}
                 className={"bg-dotted-pattern bg-cover bg-center py-5 md:py-5 text-center sm:text-left"}
                 component={"section"}>
                <Box className={"wrapper"}>
                    <Typography variant={"h3"} className={""} fontWeight={"bold"}>My Statistics</Typography>
                </Box>
            </Box>
            {/*<Box className={"wrapper"}>*/}
            {/*    <math-field style={{width: "100%"}} ref={mathfield1Ref}*/}
            {/*                onInput={() => {setMathfield1Value(mathfield1Ref.current?.getValue() || "");setMathfield1Expression(mathfield1Ref.current?.expression.simplify().toString())}}/>*/}
            {/*    <math-field style={{width: "100%"}} ref={mathfield2Ref}*/}
            {/*                onInput={() => {setMathfield2Value(mathfield2Ref.current?.getValue() || "");setMathfield2Expression(mathfield2Ref.current?.expression.simplify().toString())}}/>*/}
            {/*    <TextField style={{width: "100%"}} value={mathfield1Value}></TextField>*/}
            {/*    <TextField style={{width: "100%"}} value={mathfield2Value}></TextField>*/}
            {/*    <TextField style={{width: "100%"}} value={mathfield1Expression}></TextField>*/}
            {/*    <TextField style={{width: "100%"}} value={mathfield2Expression}></TextField>*/}
            {/*    /!*<TextField style={{width: "100%"}}></TextField>*!/*/}
            {/*    <div>*/}
            {/*        {mathfield1Ref.current?.expression.isEqual(mathfield2Ref.current?.expression) ? "Equal" : "Not equal"}*/}
            {/*    </div>*/}
            {/*    <TextField style={{width: "100%"}} inputRef={textfield1Ref} onChange={(e) => {setExprEqual(MathfieldElement.computeEngine?.box(JSON.parse(textfield1Ref.current?.value || "[]")).isEqual(MathfieldElement.computeEngine?.box(JSON.parse(textfield2Ref.current?.value || "[]")))||false)}}></TextField>*/}
            {/*    <TextField style={{width: "100%"}} inputRef={textfield2Ref} onChange={(e) => {setExprEqual(MathfieldElement.computeEngine?.box(JSON.parse(textfield1Ref.current?.value || "[]")).isEqual(MathfieldElement.computeEngine?.box(JSON.parse(textfield2Ref.current?.value || "[]")))||false)}}></TextField>*/}
            {/*    <div>*/}
            {/*        {exprEqual ? "Equal" : "Not equal"}*/}
            {/*    </div>*/}
            {/*</Box>*/}
            {loaded ? (noStats ?
                    <div className={"wrapper text-center mt-10"}>
                        <Typography color={"primary"} fontSize={"2rem"}>No questions have been answered</Typography>
                    </div>
                    :
                    <div className={"wrapper mt-10"}>
                        <Typography fontSize={"2.5rem"}>Overall mark: {mark.current} out of {totalMark.current}</Typography>
                        <Typography fontSize={"2rem"} my={5}>Marks by course: </Typography>
                        <CourseMarksTable marks={Array.from(courseMarks.current.values())}/>
                        <Typography fontSize={"2rem"} my={5}>Marks by topic: </Typography>
                        <TopicMarksTable marks={Array.from(topicMarks.current.values())}/>
                    </div>)
                :
                <div className={"wrapper text-center mt-10"}>
                    <CircularProgress/>
                </div>
            }
        </>
    );
};
