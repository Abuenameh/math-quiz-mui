'use client'

import {ICourse} from "@/lib/database/models/course.model";
import {CheckboxElement, FormContainer, TextFieldElement, useForm, useFormState} from "react-hook-form-mui";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";
import {createCourse, editCourse} from "@/lib/actions/course.actions";
import {IQuestion} from "@/lib/database/models/question.model";
import {createQuestion, editQuestion} from "@/lib/actions/question.actions";
import Box from "@mui/material/Box";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {IconButton, Input, SvgIcon, TextField} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {Add, CheckBox} from "@mui/icons-material";
import { Types } from "mongoose";
import Declaration, {IDeclaration} from "@/lib/database/models/declaration.model";
import {createDeclaration, deleteDeclaration, getDeclarationsByQuestion} from "@/lib/actions/declaration.actions";
import {useUser} from "@clerk/nextjs";
import {CurrentQuestion} from "@/components/CurrentQuestion";
import {FileUploader} from "@/components/FileUploader";
import {useUploadThing} from "@/lib/uploadthing";
import {InlineMath} from "react-katex";
import insertTextAtCursor from "insert-text-at-cursor";

type QuestionFormProps = {
    type: "Create" | "Edit"
    topicId: string
    question?: IQuestion
    questionId?: string
}

type QuestionProps = {
    // courseId: string,
    name: string,
    question: string,
    imageUrl?: string,
    imageKey?: string,
    showSolution: boolean,
    // declarations: string[][],
}

export const QuestionForm = ({ type, topicId, question, questionId }: QuestionFormProps) => {
    const router = useRouter();
    const { user } = useUser();
    const questionRef = useRef<HTMLInputElement>(null);
    const formContext = useForm<QuestionProps>({
        defaultValues: {
            name: question?.name || "",
            question: question?.question || "",
            showSolution: question?.showSolution || false,
        },
    });
    const { reset, setValue } = formContext;
    const { isSubmitting } = useFormState(formContext);
    const [declarationCounter, setDeclarationCounter] = useState(0);
    const [declarations, setDeclarations] = useState<{id: number, symbol: string, domain: string}[]>([]);
    const [file, setFile] = useState<File|undefined>(undefined)
    const [imageUrl, setImageUrl] = useState("");

    const { startUpload } = useUploadThing('imageUploader')

    useEffect(() => {
        const fetchDeclarations = async () => {
            if (questionId) {
                console.log("fetching question declarations")
                const questionDeclarations = await getDeclarationsByQuestion(questionId) as IDeclaration[];
                setDeclarations(questionDeclarations.map((declaration, index) => {
                    return {
                        id: index,
                        symbol: declaration.symbol,
                        domain: declaration.domain,
                    }
                }));
                setDeclarationCounter(questionDeclarations.length)
                questionDeclarations.forEach((declaration, index) => {
                    setValue<any>(`declarations.${index}.symbol`, declaration.symbol);
                    setValue<any>(`declarations.${index}.domain`, declaration.domain);
                })
            }
        }

        fetchDeclarations().catch(console.error)

        setImageUrl(question?.imageUrl || "");
    }, [question?.imageUrl, questionId, setValue])

    // const questionDeclarations = await getDeclarationsByQuestion(questionId);

    const isAdmin = user?.publicMetadata.isAdmin as boolean || false;

    if (!isAdmin) {
        router.push(`/topics/${topicId}`);
        return <></>;
    }

    const onSubmit = async (data: QuestionProps) => {
        if (file) {
            const uploadedImages = await startUpload([file])

            if (!uploadedImages) {
                return
            }

            data.imageUrl = uploadedImages[0].url
            data.imageKey = uploadedImages[0].key
        }

        if (type === "Create") {
            try {
                console.log(topicId)
                const newQuestion = await createQuestion({
                    question: { ...data, topic: topicId },
                    path: `/topics/${topicId}`,
                });

                if (newQuestion) {
                    declarations.forEach((declaration) => {
                        createDeclaration({ declaration: {...declaration, question: newQuestion._id.toString("hex")}, path: ""})
                    })

                    // reset();
                    router.push(`/topics/${topicId}`);
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
                const questionDeclarations = await getDeclarationsByQuestion(questionId) as IDeclaration[];

                questionDeclarations.forEach((declaration, index) => {
                    deleteDeclaration({declarationId: declaration._id.toString("hex"), path: ""})
                })

                const editedQuestion = await editQuestion({
                    question: { _id: questionId,  ...data },
                    path: `/topics/${topicId}`,
                });

                if (editedQuestion) {
                    declarations.forEach((declaration) => {
                        createDeclaration({ declaration: {...declaration, question: questionId}, path: ""})
                    })

                    // reset();
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

    const insertText = (text: string) => {
        questionRef.current && insertTextAtCursor(questionRef.current, text);
    }

    return (
        <>
            <CurrentQuestion />
        <FormContainer formContext={formContext} onSuccess={onSubmit}>
            <Stack spacing={3}>
            <Box className={"flex flex-col gap-5 md:flex-row"}>
            </Box>
                <Box className={"w-full"}>
                    <TextFieldElement fullWidth name={"name"} label={"Question name"} required/>
                </Box>
                <Box className={"w-full"}>
                    <TextFieldElement inputRef={questionRef} multiline fullWidth name={"question"} label={"Question text"} required/>
                    <Box className={"flex flex-row gap-2 pt-5"}>
                        <Button sx={{textTransform: "none"}} variant={"contained"} size={"large"} onClick={() => {insertText("⟬⟭")}}>⟬ <InlineMath>x</InlineMath> ⟭</Button>
                        <Button sx={{textTransform: "none"}} variant={"contained"} size={"large"} onClick={() => {insertText("⦗⦘")}}>⦗ <InlineMath>x</InlineMath> ⦘</Button>
                        <Button variant={"contained"} size={"large"} onClick={() => {insertText("⟬⟦,⟧⟭")}}>⟬ ⬜ ⟭</Button>
                        <Button variant={"contained"} size={"large"} onClick={() => {insertText("⦗⟦,⟧⦘")}}>⦗ ⬜ ⦘</Button>
                        {/*<Button variant={"contained"} size={"small"} onClick={() => {copyTextToClipboard("‵"); questionRef.current?.focus();}}><SvgIcon sx={{fontSize: "0.75rem"}}>*/}
                        {/*    <svg width="24" height="24" version="1.1" viewBox="0 0 6.35 6.35"*/}
                        {/*         xmlns="http://www.w3.org/2000/svg" fill="currentColor">*/}
                        {/*        <g transform="translate(-21.696)">*/}
                        {/*            <path d="m22.176 0h2.2151l3.175 6.35h-1.4275z" strokeWidth=".024612"/>*/}
                        {/*        </g>*/}
                        {/*    </svg>*/}
                        {/*</SvgIcon></Button>*/}
                        {/*<Button variant={"contained"} size={"small"} onClick={() => {copyTextToClipboard("′"); questionRef.current?.focus();}}><SvgIcon sx={{fontSize: "0.75rem"}}>*/}
                        {/*    <svg width="24" height="24" version="1.1" viewBox="0 0 6.35 6.35"*/}
                        {/*         xmlns="http://www.w3.org/2000/svg" fill="currentColor">*/}
                        {/*        <g transform="translate(-23.019 .26458)">*/}
                        {/*            <path d="m23.499 6.0854 3.175-6.35h2.2151l-3.9626 6.35z" strokeWidth=".024612"/>*/}
                        {/*        </g>*/}
                        {/*    </svg>*/}
                        {/*</SvgIcon></Button>*/}
                        {/*<Button variant={"contained"} size={"small"} onClick={() => {copyTextToClipboard("‶"); questionRef.current?.focus();}}><SvgIcon sx={{fontSize: "1.1rem"}}>*/}
                        {/*    <svg width="24" height="24" version="1.1" viewBox="0 0 6.35 6.35"*/}
                        {/*         xmlns="http://www.w3.org/2000/svg" fill="currentColor">*/}
                        {/*        <g transform="translate(-21.431)">*/}
                        {/*            <path*/}
                        {/*                d="m24.141 1.0307h1.496l2.1443 4.2886h-0.96411zm-2.7095 0h1.496l2.1443 4.2886h-0.96411z"*/}
                        {/*                strokeWidth=".016623"/>*/}
                        {/*        </g>*/}
                        {/*    </svg>*/}
                        {/*</SvgIcon></Button>*/}
                        {/*<Button variant={"contained"} size={"small"} onClick={() => {copyTextToClipboard("″"); questionRef.current?.focus();}}><SvgIcon sx={{fontSize: "1.1rem"}}>*/}
                        {/*    <svg width="24" height="24" version="1.1" viewBox="0 0 6.35 6.35"*/}
                        {/*         xmlns="http://www.w3.org/2000/svg" fill="currentColor">*/}
                        {/*        <g transform="translate(-23.548 -43.392)">*/}
                        {/*            <path*/}
                        {/*                d="m26.377 48.64 2.0738-4.1476h1.4468l-2.5882 4.1476zm-2.8294 0 2.0738-4.1476h1.4468l-2.5882 4.1476z"*/}
                        {/*                strokeWidth=".016076"/>*/}
                        {/*        </g>*/}
                        {/*    </svg>*/}
                        {/*</SvgIcon></Button>*/}
                        {/*<Button variant={"contained"} size={"small"} onClick={() => {copyTextToClipboard("‷"); questionRef.current?.focus();}}><SvgIcon sx={{fontSize: "1.5rem"}}>*/}
                        {/*    <svg width="24" height="24" version="1.1" viewBox="0 0 6.35 6.35"*/}
                        {/*         xmlns="http://www.w3.org/2000/svg" fill="currentColor">*/}
                        {/*        <g transform="matrix(.044116 0 0 .044116 -1.4707 -3.5016)">*/}
                        {/*            <path*/}
                        {/*                d="m119.33 117.21h23.813l34.131 68.262h-15.346zm-42.862 0h23.812l34.131 68.262h-15.346zm-43.127 0h23.812l34.131 68.262h-15.346z"*/}
                        {/*                strokeWidth=".26458"/>*/}
                        {/*        </g>*/}
                        {/*    </svg>*/}
                        {/*</SvgIcon></Button>*/}
                        {/*<Button variant={"contained"} size={"small"} onClick={() => {copyTextToClipboard("‴"); questionRef.current?.focus();}}><SvgIcon sx={{fontSize: "1.5rem"}}>*/}
                        {/*    <svg width="24" height="24" version="1.1" viewBox="0 0 6.35 6.35"*/}
                        {/*         xmlns="http://www.w3.org/2000/svg" fill="currentColor">*/}
                        {/*        <g transform="translate(46.567)">*/}
                        {/*            <path*/}
                        {/*                d="m-42.007 4.6096h-0.64501l1.4346-2.8692h1.0009zm-3.9145 0h-0.64501l1.4346-2.8692h1.0009zm1.9573 0h-0.64501l1.4346-2.8692h1.0009z"*/}
                        {/*                strokeWidth=".011121"/>*/}
                        {/*        </g>*/}
                        {/*    </svg>*/}
                        {/*</SvgIcon></Button>*/}
                    </Box>
                </Box>
                {declarations.map((declaration, index) => (
                    <Box key={declaration.id} className={"flex flex-col gap-5 w-full md:flex-row"}>
                        <TextFieldElement
                            className={"w-32"}
                            parseError={(value) => {
                                return <></>
                            }}
                            name={`declarations.${declaration.id}.symbol`}
                            label={"Symbol"}
                            onChange={(e) => onChangeDeclarationSymbol(e, index)}
                            required
                        />
                        <TextFieldElement
                            fullWidth
                            parseError={(value) => {
                                return <></>
                            }}
                            name={`declarations.${declaration.id}.domain`}
                            label={"Domain"}
                            onChange={(e) => onChangeDeclarationDomain(e, index)}
                            required
                        />
                        <IconButton color={"error"}
                                    onClick={() => onDeleteDeclaration(index)}><DeleteIcon/></IconButton>
                    </Box>
                ))}
                <Button onClick={onAddDeclaration}>Add Declaration</Button>
                    <FileUploader setImageUrl={setImageUrl} imageUrl={imageUrl} setFile={setFile}/>
                <CheckboxElement name={"showSolution"} label={"Show Solution"}/>
            <Button disabled={isSubmitting} type={"submit"} variant={"contained"} size={"large"} className={"button col.span-2 w-full"}>
                {isSubmitting ? "Submitting..." : `${type === "Edit" ? "Save" : type} Question`}
            </Button>
            </Stack>
        </FormContainer>
        </>
    )
};