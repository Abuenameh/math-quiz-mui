'use client'

import {useParams, useRouter} from "next/navigation";
import {useCallback} from "react";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRowId,
    GridRowParams,
    GridToolbarContainer,
    GridToolbarQuickFilter
} from "@mui/x-data-grid";
import {confirmDialog} from "@/components/ConfirmDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {Box, Button} from "@mui/material";
import {IQuestion} from "@/lib/database/models/question.model";
import {Add} from "@mui/icons-material";
import {deleteQuestion, getQuestionById, setCurrentQuestion} from "@/lib/actions/question.actions";
import {useChannel} from "ably/react";
import {deleteDeclaration, getDeclarationsByQuestion} from "@/lib/actions/declaration.actions";
import {IDeclaration} from "@/lib/database/models/declaration.model";
import {useUser} from "@clerk/nextjs";
import {CurrentQuestion} from "@/components/CurrentQuestion";
import {deleteAnswersByQuestion} from "@/lib/actions/answer.actions";

function QuestionToolbar() {
    const router = useRouter();
    const params = useParams()
    const {user} = useUser();

    const isAdmin = user?.publicMetadata.isAdmin as boolean || false;

    return (
        <GridToolbarContainer className={"m-2"}>
            {isAdmin && <Button variant={"contained"} startIcon={<Add/>}
                                onClick={() => router.push(`/questions/create/${params.topicId}`)}>Add
                Question</Button>}
            <div className={"flex-1"}/>
            <GridToolbarQuickFilter/>
        </GridToolbarContainer>
    );
}

interface QuestionTableProps {
    topicId: string
    questions: IQuestion[]
}

export const QuestionTable = ({topicId, questions}: QuestionTableProps) => {
    const router = useRouter();
    const {user} = useUser();
    const {channel: currentQuestionChannel} = useChannel("current-question");

    const isAdmin = user?.publicMetadata.isAdmin as boolean || false;

    const onEditClick = useCallback(
        (id: GridRowId) => () => {
            router.push(`/questions/${id}/edit`)
        },
        [router],
    );

    const onDeleteClick = useCallback(
        (id: GridRowId) => async () => {
            const questionDeclarations = await getDeclarationsByQuestion(id as string) as IDeclaration[];

            questionDeclarations.forEach((declaration) => {
                deleteDeclaration({declarationId: declaration._id.toString("hex"), path: ""})
            })

            const question = await getQuestionById(id as string);
            confirmDialog("Confirm deletion", `Do you really want to delete the question ${question.name}?`, async () => {
                await deleteQuestion({questionId: id as string, path: `/topics/${topicId}`})
            });
        },
        [topicId],
    );

    const onDeleteAnswersClick = useCallback(
        (id: GridRowId) => async () => {
            const question = await getQuestionById(id as string);
            confirmDialog("Confirm deletion", `Do you really want to delete all answers to the question ${question.name}?`, async () => {
                await deleteAnswersByQuestion(id as string)
            });
        },
        [],
    );

    const columns: GridColDef[] = [
        {field: "name", headerName: "Name", width: 200},
        {field: "question", headerName: "Question", flex: 1},
        {
            field: "actions", type: "actions", getActions: (params) => [
                <GridActionsCellItem key={params.id} label={"Edit"} icon={<EditIcon/>}
                                     onClick={onEditClick(params.id)}/>,
                <GridActionsCellItem key={params.id} label={"Delete"} icon={<DeleteIcon/>} color={"error"}
                                     onClick={onDeleteClick(params.id)}/>,
                <GridActionsCellItem key={params.id} label={"Delete all answers"} icon={<DeleteIcon/>} color={"error"}
                                     onClick={onDeleteAnswersClick(params.id)} showInMenu={true}/>,
            ]
        }
    ];

    const removeAnswers = (question: string): string => {
        return question.replace(/⟬⟦.*⟭|⦗⟦.*⦘/gim, "");
    }

    const rows = questions.map((question) => ({
        id: question._id,
        name: question.name,
        question: removeAnswers(question.question)
    }));

    const onRowClick = async (params: GridRowParams) => {
        if (isAdmin) {
            console.log("Setting current question")
            await setCurrentQuestion(params.id.toString())
            try {
                await currentQuestionChannel.publish({})
            } catch (e) {
                console.error(e)
            }
        }

        router.push(`/questions/${params.id}`);
    };

    return (
        <>
            <CurrentQuestion/>
            <Box className={"h-[30rem]"}>
                <DataGrid columns={columns} rows={rows} disableRowSelectionOnClick disableColumnFilter
                          disableColumnSelector disableDensitySelector slots={{toolbar: QuestionToolbar}}
                          initialState={{
                              filter: {
                                  filterModel: {
                                      items: [],
                                      quickFilterExcludeHiddenColumns: true,
                                  },
                              },
                              sorting: {sortModel: [{field: "name", sort: "asc"}]},
                          }} columnVisibilityModel={{
                    actions: isAdmin
                }} onRowClick={onRowClick}/>
            </Box>
        </>
    );
};
