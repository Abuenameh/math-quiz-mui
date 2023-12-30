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
import {deleteQuestion, getQuestionsByCourse} from "@/lib/actions/question.actions";
import {Types} from "mongoose";

function QuestionToolbar() {
    const router = useRouter();
    const params = useParams()

    return (
        <GridToolbarContainer className={"m-2"}>
            <Button variant={"contained"} startIcon={<Add />} onClick={() => router.push(`/courses/${params.courseId}/questions/create`)}>Add Question</Button>
            <div className={"flex-1"} />
            <GridToolbarQuickFilter />
        </GridToolbarContainer>
    );
}

interface QuestionTableProps {
    courseId: string
    questions: IQuestion[]
}

export const QuestionTable = ({courseId, questions}: QuestionTableProps) => {
    const router = useRouter();

    const onEditClick = useCallback(
        (id: GridRowId) => () => {
            router.push(`/courses/${courseId}/questions/${id}/edit`)
        },
        [router],
    );

    const onDeleteClick = useCallback(
        (id: GridRowId) => () => {
            confirmDialog("Confirm deletion", "Do you really want to delete this question?", async () => {
                await deleteQuestion({ questionId: id as string, path: `/courses/${courseId}` })
            });
        },
        [courseId],
    );

    const columns: GridColDef[] = [
        { field: "name", headerName: "Name", width: 100 },
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
        router.push(`/courses/${courseId}/questions/${params.id}`);
    };

    return (
        <Box className={"h-96"}>
            <DataGrid columns={columns} rows={rows} disableColumnFilter disableColumnSelector disableDensitySelector slots={{ toolbar: QuestionToolbar }} initialState={{
                filter: {
                    filterModel: {
                        items: [],
                        quickFilterExcludeHiddenColumns: true,
                    },
                },
            }} onRowClick={onRowClick}/>
        </Box>
    );
};
