'use client'

import {ICourse} from "@/lib/database/models/course.model";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {useCallback} from "react";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRowId,
    GridRowParams,
    GridToolbarContainer, GridToolbarQuickFilter
} from "@mui/x-data-grid";
import {confirmDialog} from "@/components/ConfirmDialog";
import {deleteCourse} from "@/lib/actions/course.actions";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {Box, Button} from "@mui/material";
import {IQuestion} from "@/lib/database/models/question.model";
import {Add} from "@mui/icons-material";
import {deleteQuestion, getQuestionById} from "@/lib/actions/question.actions";
import {Types} from "mongoose";
import {useChannel} from "ably/react";
import {deleteDeclaration, getDeclarationsByQuestion} from "@/lib/actions/declaration.actions";
import {IDeclaration} from "@/lib/database/models/declaration.model";
import {useUser} from "@clerk/nextjs";

function QuestionToolbar() {
    const router = useRouter();
    const params = useParams()
    const { user } = useUser();

    const isAdmin = user?.publicMetadata.isAdmin as boolean || false;

    return (
        <GridToolbarContainer className={"m-2"}>
            {isAdmin && <Button variant={"contained"} startIcon={<Add />} onClick={() => router.push(`/questions/create/${params.topicId}`)}>Add Question</Button>}
            <div className={"flex-1"} />
            <GridToolbarQuickFilter />
        </GridToolbarContainer>
    );
}

interface QuestionTableProps {
    topicId: string
    questions: IQuestion[]
}

export const QuestionTable = ({topicId, questions}: QuestionTableProps) => {
    const router = useRouter();
    const { channel: hideSolutionChannel } = useChannel({channelName:"hide-solution", options:{params: { rewind: "1" }}});
    hideSolutionChannel.params = { rewind: "1" }
    // const { channel } = useChannel("show-solution");
    // channel.setOptions({params: { rewind: "1" }}).catch(console.error);
    const { user } = useUser();

    // const userId = user?.publicMetadata.userId as string;
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

            questionDeclarations.forEach((declaration, index) => {
                deleteDeclaration({declarationId: declaration._id.toString("hex"), path: ""})
            })

            const question = await getQuestionById(id as string);
            confirmDialog("Confirm deletion", `Do you really want to delete the question ${question.name}?`, async () => {
                await deleteQuestion({ questionId: id as string, path: `/topics/${topicId}` })
            });
        },
        [topicId],
    );

    const columns: GridColDef[] = [
        { field: "name", headerName: "Name", width: 200 },
        { field: "question", headerName: "Question", flex: 1 },
        { field: "actions", type: "actions", getActions: (params) => [
                <GridActionsCellItem key={params.id} label={"Edit"} icon={<EditIcon/>} onClick={onEditClick(params.id)}/>,
                <GridActionsCellItem key={params.id} label={"Delete"} icon={<DeleteIcon/>} color={"error"} onClick={onDeleteClick(params.id)}/>,
            ]}
    ];

    const rows = questions.map((question) => ({
        id: question._id,
        name: question.name,
        question: question.question
    }));

    const onRowClick = async (params: GridRowParams) => {
        router.push(`/questions/${params.id}`);
    };

    return (
        <Box className={"h-96"}>
            <DataGrid columns={columns} rows={rows} disableRowSelectionOnClick disableColumnFilter disableColumnSelector disableDensitySelector slots={{ toolbar: QuestionToolbar }} initialState={{
                filter: {
                    filterModel: {
                        items: [],
                        quickFilterExcludeHiddenColumns: true,
                    },
                },
            }} columnVisibilityModel={{
                actions: isAdmin
            }} onRowClick={onRowClick}/>
        </Box>
    );
};
