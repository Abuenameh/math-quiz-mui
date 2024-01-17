'use client'

import {CheckboxElement, FormContainer, TextFieldElement, useForm, useFormState} from "react-hook-form-mui";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import {useRouter} from "next/navigation";
import {IQuestion} from "@/lib/database/models/question.model";
import {createQuestion, editQuestion} from "@/lib/actions/question.actions";
import Box from "@mui/material/Box";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {IDeclaration} from "@/lib/database/models/declaration.model";
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
    num?: number
    question?: IQuestion
    questionId?: string
}

type QuestionProps = {
    num: number,
    name: string,
    question: string,
    layouts?: string,
    imageUrl?: string,
    imageKey?: string,
    showSolution: boolean,
}

export const QuestionForm = ({type, topicId, num, question, questionId}: QuestionFormProps) => {
    const router = useRouter();
    const {user} = useUser();
    const questionRef = useRef<HTMLInputElement>(null);
    const formContext = useForm<QuestionProps>({
        defaultValues: {
            num: question?.num || num || undefined,
            name: question?.name || "",
            question: question?.question || "",
            layouts: question?.layouts || "",
            showSolution: question?.showSolution || false,
        },
    });
    const {setValue} = formContext;
    const {isSubmitting} = useFormState(formContext);
    const [, setDeclarationCounter] = useState(0);
    const [declarations, setDeclarations] = useState<{ id: number, symbol: string, domain: string }[]>([]);
    const [file, setFile] = useState<File | undefined>(undefined)
    const [imageUrl, setImageUrl] = useState("");

    const {startUpload} = useUploadThing('imageUploader')

    useEffect(() => {
        const fetchDeclarations = async () => {
            if (questionId) {
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
                // console.log(topicId)
                const newQuestion = await createQuestion({
                    question: {...data, topic: topicId},
                    path: `/topics/${topicId}`,
                });

                if (newQuestion) {
                    declarations.forEach((declaration) => {
                        createDeclaration({
                            declaration: {...declaration, question: newQuestion._id.toString("hex")},
                            path: ""
                        })
                    })

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

                questionDeclarations.forEach((declaration) => {
                    deleteDeclaration({declarationId: declaration._id.toString("hex"), path: ""})
                })

                const editedQuestion = await editQuestion({
                    question: {_id: questionId, ...data},
                    path: `/topics/${topicId}`,
                });

                if (editedQuestion) {
                    declarations.forEach((declaration) => {
                        createDeclaration({declaration: {...declaration, question: questionId}, path: ""})
                    })

                    router.back();
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
        const {value} = e.target;
        const newDeclarations = [...declarations];
        newDeclarations[index].symbol = value;
        setDeclarations(newDeclarations);
    }

    const onChangeDeclarationDomain = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) => {
        const {value} = e.target;
        const newDeclarations = [...declarations];
        newDeclarations[index].domain = value;
        setDeclarations(newDeclarations);
    }

    const insertText = (text: string) => {
        questionRef.current && insertTextAtCursor(questionRef.current, text);
    }

    return (
        <>
            <CurrentQuestion/>
            <FormContainer formContext={formContext} onSuccess={onSubmit}>
                <Stack spacing={3}>
                    <Box className={"flex flex-col gap-5 md:flex-row"}>
                    <Box className={"w-50"}>
                        <TextFieldElement name={"num"} label={"Question number"} required/>
                    </Box>
                    <Box className={"w-full"}>
                        <TextFieldElement fullWidth name={"name"} label={"Question name"} required/>
                    </Box>
                    </Box>
                    <Box className={"w-full"}>
                        <TextFieldElement inputRef={questionRef} multiline fullWidth name={"question"}
                                          label={"Question text"} required/>
                        {/*<Box className={"flex flex-row gap-2 pt-5"}>*/}
                        {/*    <Button sx={{textTransform: "none"}} variant={"contained"} size={"large"} onClick={() => {*/}
                        {/*        insertText("⟬⟭")*/}
                        {/*    }}>⟬ <InlineMath>x</InlineMath> ⟭</Button>*/}
                        {/*    <Button sx={{textTransform: "none"}} variant={"contained"} size={"large"} onClick={() => {*/}
                        {/*        insertText("⦗⦘")*/}
                        {/*    }}>⦗ <InlineMath>x</InlineMath> ⦘</Button>*/}
                        {/*    <Button variant={"contained"} size={"large"} onClick={() => {*/}
                        {/*        insertText("⟬⟦,,⟧⟭")*/}
                        {/*    }}>⟬ ⬜ ⟭</Button>*/}
                        {/*    <Button variant={"contained"} size={"large"} onClick={() => {*/}
                        {/*        insertText("⦗⟦,,⟧⦘")*/}
                        {/*    }}>⦗ ⬜ ⦘</Button>*/}
                        {/*</Box>*/}
                    </Box>
                    {declarations.map((declaration, index) => (
                        <Box key={declaration.id} className={"flex flex-col gap-5 w-full md:flex-row"}>
                            <TextFieldElement
                                className={"w-32"}
                                parseError={() => {
                                    return <></>
                                }}
                                name={`declarations.${declaration.id}.symbol`}
                                label={"Symbol"}
                                onChange={(e) => onChangeDeclarationSymbol(e, index)}
                                required
                            />
                            <TextFieldElement
                                fullWidth
                                parseError={() => {
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
                    <Box className={"w-full"}>
                    <TextFieldElement name={"layouts"} label={"Virtual keyboard layout"} multiline fullWidth/>
                    </Box>
                    <CheckboxElement name={"showSolution"} label={"Show Solution"}/>
                    <Button disabled={isSubmitting} type={"submit"} variant={"contained"} size={"large"}
                            className={"button col.span-2 w-full"}>
                        {isSubmitting ? "Submitting..." : `${type === "Edit" ? "Save" : type} Question`}
                    </Button>
                </Stack>
            </FormContainer>
        </>
    )
};