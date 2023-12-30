'use client'

import {ICourse} from "@/lib/database/models/course.model";
import {FormContainer, TextFieldElement, useForm, useFormState} from "react-hook-form-mui";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";
import {createCourse, editCourse} from "@/lib/actions/course.actions";
import {IQuestion} from "@/lib/database/models/question.model";
import {createQuestion, editQuestion} from "@/lib/actions/question.actions";
import Box from "@mui/material/Box";
import {ChangeEvent, useRef, useState} from "react";
import {IconButton, Input, SvgIcon, TextField} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Add } from "@mui/icons-material";

type QuestionFormProps = {
    type: "Create" | "Edit"
    courseId: string
    question?: IQuestion
    questionId?: string
}

type QuestionProps = {
    courseId: string,
    name: string,
    question: string,
    // declarations: string[][],
}

export const QuestionForm = ({ type, courseId, question, questionId }: QuestionFormProps) => {
    const router = useRouter();
    const questionRef = useRef<HTMLInputElement>(null);
    const { reset, control } = useForm();
    const { isSubmitting } = useFormState({control});
    const [declarationCounter, setDeclarationCounter] = useState(question?.declarations?.length || 0);
    // const [declarations, setDeclarations] = useState([{symbol: "", domain: ""}]);
    const [declarations, setDeclarations] = useState<{id: number, symbol: string, domain: string}[]>(question?.declarations?.map((declaration, index) => {
        return {
            id: index,
            symbol: declaration[0],
            domain: declaration[1],
        }
    }) || []);

//     if (question && question.declarations) {
//         setDeclarations(question.declarations.map((declaration, index) => {
//             return {
//                 id: index,
//                 symbol: declaration[0],
//                 domain: declaration[1],
//             }
//         }));
// // setDeclarations(initialDeclarations);
// //         setDeclarationCounter(question.declarations.length)
// //         setDeclarationCounter(1)
//     }
    //
    const onSubmit = async (data: QuestionProps) => {
        const declArray = declarations.map((declaration, index) =>
            [declaration.symbol, declaration.domain]
        )
        console.log(declArray)

        if (type === "Create") {
            try {
                const newQuestion = await createQuestion({
                    question: { name: data.name, question: data.question, declarations: declArray, course: courseId },
                    path: `/courses/${courseId}`,
                });

                if (newQuestion) {
                    reset();
                    router.push(`/courses/${courseId}`);
                }
            } catch (error) {
                console.log(error)
            }
        }

        if (type === "Edit") {
            if (!questionId) {
                router.back();
                return;
            }

            try {
                const editedQuestion = await editQuestion({
                    question: { name: data.name, question: data.question, declarations: declArray, course: courseId, _id: questionId },
                    path: `/courses/${courseId}`,
                });

                if (editedQuestion) {
                    reset();
                    router.back();
                    // router.push(`/courses/${editedQuestion._id}`);
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const onAddDeclaration = () => {
        setDeclarationCounter((counter) => {
            setDeclarations([...declarations, {id: counter, symbol: "", domain: ""}]);
            return counter + 1
        })
    }

    const onDeleteDeclaration = (index: number) => {
        const newDeclarations = [...declarations];
        newDeclarations.splice(index, 1);
        setDeclarations(newDeclarations);
    }

    const onChangeDeclarationSymbol = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) => {
        const { value } = e.target;
        const newDeclarations = [...declarations];
        newDeclarations[index].symbol = value;
        setDeclarations(newDeclarations);
    }

    const onChangeDeclarationDomain = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) => {
        const { value } = e.target;
        const newDeclarations = [...declarations];
        newDeclarations[index].domain = value;
        setDeclarations(newDeclarations);
    }

    const copyTextToClipboard = async (text: string) => {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(text);
        } else {
            return document.execCommand('copy', true, text);
        }
    }

    const initialDeclarations: Record<string, string> = {};
    declarations.forEach((declaration, index) => {
        initialDeclarations[`declarations.${index}.symbol`] = declaration.symbol;
        initialDeclarations[`declarations.${index}.domain`] = declaration.domain;
    })

    return (
        <>
        <FormContainer defaultValues={{name: question ? question.name : "", question: question ? question.question : "", ...initialDeclarations}} onSuccess={onSubmit}>
            <Stack spacing={3}>
            <Box className={"flex flex-col gap-5 md:flex-row"}>
            </Box>
                <Box className={"w-full"}>
                    <TextFieldElement fullWidth name={"name"} label={"Question name"} required/>
                </Box>
                <Box className={"w-full"}>
                    <Box className={"flex flex-row gap-2 pb-5"}>
                        <Button variant={"contained"} size={"small"} onClick={() => {copyTextToClipboard("‵"); questionRef.current?.focus();}}><SvgIcon sx={{fontSize: "0.75rem"}}>
                            <svg width="24" height="24" version="1.1" viewBox="0 0 6.35 6.35"
                                 xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                <g transform="translate(-21.696)">
                                    <path d="m22.176 0h2.2151l3.175 6.35h-1.4275z" strokeWidth=".024612"/>
                                </g>
                            </svg>
                        </SvgIcon></Button>
                        <Button variant={"contained"} size={"small"} onClick={() => {copyTextToClipboard("′"); questionRef.current?.focus();}}><SvgIcon sx={{fontSize: "0.75rem"}}>
                            <svg width="24" height="24" version="1.1" viewBox="0 0 6.35 6.35"
                                 xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                <g transform="translate(-23.019 .26458)">
                                    <path d="m23.499 6.0854 3.175-6.35h2.2151l-3.9626 6.35z" strokeWidth=".024612"/>
                                </g>
                            </svg>
                        </SvgIcon></Button>
                        <Button variant={"contained"} size={"small"} onClick={() => {copyTextToClipboard("‶"); questionRef.current?.focus();}}><SvgIcon sx={{fontSize: "1.1rem"}}>
                            <svg width="24" height="24" version="1.1" viewBox="0 0 6.35 6.35"
                                 xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                <g transform="translate(-21.431)">
                                    <path
                                        d="m24.141 1.0307h1.496l2.1443 4.2886h-0.96411zm-2.7095 0h1.496l2.1443 4.2886h-0.96411z"
                                        strokeWidth=".016623"/>
                                </g>
                            </svg>
                        </SvgIcon></Button>
                        <Button variant={"contained"} size={"small"} onClick={() => {copyTextToClipboard("″"); questionRef.current?.focus();}}><SvgIcon sx={{fontSize: "1.1rem"}}>
                            <svg width="24" height="24" version="1.1" viewBox="0 0 6.35 6.35"
                                 xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                <g transform="translate(-23.548 -43.392)">
                                    <path
                                        d="m26.377 48.64 2.0738-4.1476h1.4468l-2.5882 4.1476zm-2.8294 0 2.0738-4.1476h1.4468l-2.5882 4.1476z"
                                        strokeWidth=".016076"/>
                                </g>
                            </svg>
                        </SvgIcon></Button>
                        <Button variant={"contained"} size={"small"} onClick={() => {copyTextToClipboard("‷"); questionRef.current?.focus();}}><SvgIcon sx={{fontSize: "1.5rem"}}>
                            <svg width="24" height="24" version="1.1" viewBox="0 0 6.35 6.35"
                                 xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                <g transform="matrix(.044116 0 0 .044116 -1.4707 -3.5016)">
                                    <path
                                        d="m119.33 117.21h23.813l34.131 68.262h-15.346zm-42.862 0h23.812l34.131 68.262h-15.346zm-43.127 0h23.812l34.131 68.262h-15.346z"
                                        strokeWidth=".26458"/>
                                </g>
                            </svg>
                        </SvgIcon></Button>
                        <Button variant={"contained"} size={"small"} onClick={() => {copyTextToClipboard("‴"); questionRef.current?.focus();}}><SvgIcon sx={{fontSize: "1.5rem"}}>
                            <svg width="24" height="24" version="1.1" viewBox="0 0 6.35 6.35"
                                 xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                <g transform="translate(46.567)">
                                    <path
                                        d="m-42.007 4.6096h-0.64501l1.4346-2.8692h1.0009zm-3.9145 0h-0.64501l1.4346-2.8692h1.0009zm1.9573 0h-0.64501l1.4346-2.8692h1.0009z"
                                        strokeWidth=".011121"/>
                                </g>
                            </svg>
                        </SvgIcon></Button>
                    </Box>
                    <TextFieldElement inputRef={questionRef} multiline fullWidth name={"question"} label={"Question text"} required/>
                </Box>
                {declarations.map((declaration, index) => (
                    <Box key={declaration.id} className={"flex flex-col gap-5 w-full md:flex-row"}>
                        <TextFieldElement
                            className={"w-32"}
                            // value={declaration.symbol}
                            parseError={(value) => {
                                return <></>
                            }}
                            name={`declarations.${index}.symbol`}
                            label={"Symbol"}
                            onChange={(e) => onChangeDeclarationSymbol(e, index)}
                            required
                        />
                        <TextFieldElement
                            fullWidth
                            // value={declaration.domain}
                            parseError={(value) => {
                                return <></>
                            }}
                            name={`declarations.${index}.domain`}
                            label={"Domain"}
                            onChange={(e) => onChangeDeclarationDomain(e, index)}
                            required
                        />
                        <IconButton color={"error"}
                                    onClick={() => onDeleteDeclaration(index)}><DeleteIcon/></IconButton>
                    </Box>
                ))}
                <Button onClick={onAddDeclaration}>Add Declaration</Button>
            <Button disabled={isSubmitting} type={"submit"} variant={"contained"} size={"large"} className={"button col.span-2 w-full"}>
                {isSubmitting ? "Submitting..." : `${type} Question`}
            </Button>
            </Stack>
        </FormContainer>
        </>
    )
};