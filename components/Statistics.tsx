'use client'

import {useEffect, useRef, useState} from "react";
import {getAnswersByUser} from "@/lib/actions/answer.actions";
import {Box, CircularProgress} from "@mui/material";
import Typography from "@mui/material/Typography";
import {IAnswer} from "@/lib/database/models/answer.model";
import {ITopic} from "@/lib/database/models/topic.model";
import {ICourse} from "@/lib/database/models/course.model";
import {IQuestion} from "@/lib/database/models/question.model";
import {CourseMarksTable} from "@/components/CourseMarksTable";
import {TopicMarksTable} from "@/components/TopicMarksTable";
import {CurrentQuestion} from "@/components/CurrentQuestion";

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

    useEffect(() => {
        const fetchStatistics = async () => {
            const answers = await getAnswersByUser(userId) as IAnswer[];
            if (answers.length === 0) {
                setNoStats(true);
            } else {
                mark.current = 0;
                totalMark.current = 0;
                courseMarks.current = new Map<string, MarkStats>();
                topicMarks.current = new Map<string, MarkStats>();
                answers.map((answer) => {
                    const question = answer.question as IQuestion;
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
                    Object.entries(answer.answers).forEach(([, value]) => {
                        if (value.correct) {
                            mark.current += value.mark;
                            courseMarks.current.get(courseKey)!.mark += value.mark;
                            topicMarks.current.get(topicKey)!.mark += value.mark;
                        }
                        totalMark.current += value.mark;
                        courseMarks.current.get(courseKey)!.totalMark += value.mark;
                        topicMarks.current.get(topicKey)!.totalMark += value.mark;
                    })
                })
                console.log(courseMarks.current, topicMarks.current)
            }
            setLoaded(true);
        }
        if (userId) {
            fetchStatistics().catch(console.error);
        }
    }, [userId])

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
