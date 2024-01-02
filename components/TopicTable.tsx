'use client'

import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRowId, GridRowParams,
    GridToolbarContainer, GridToolbarQuickFilter
} from '@mui/x-data-grid';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {ICourse} from "@/lib/database/models/course.model";
import {useCallback} from "react";
import {useParams, useRouter} from "next/navigation";
import { Box, Button } from "@mui/material";
import {confirmDialog} from "@/components/ConfirmDialog";
import {deleteCourse, getCourseById} from "@/lib/actions/course.actions";
import { Add } from '@mui/icons-material';
import {router} from "next/client";
import {Types} from "mongoose";
import {ITopic} from "@/lib/database/models/topic.model";
import {deleteTopic, getTopicById} from "@/lib/actions/topic.actions";
import {deleteDeclaration, getDeclarationsByQuestion} from "@/lib/actions/declaration.actions";
import {IDeclaration} from "@/lib/database/models/declaration.model";
import {deleteQuestion, getQuestionsByTopic} from "@/lib/actions/question.actions";
import {IQuestion} from "@/lib/database/models/question.model";
import {useUser} from "@clerk/nextjs";
// import Button from "@mui/material/Button";

function TopicToolbar() {
    const router = useRouter();
    const params = useParams()
    const { user } = useUser();

    const isAdmin = user?.publicMetadata.isAdmin as boolean || false;

    return (
        <GridToolbarContainer className={"m-2"}>
            {isAdmin && <Button variant={"contained"} startIcon={<Add />} onClick={() => router.push(`/topics/create/${params.courseId}`)}>Add Topic</Button>}
            <div className={"flex-1"} />
            <GridToolbarQuickFilter />
        </GridToolbarContainer>
    );
}

interface TopicTableProps {
    courseId: string
    topics: ITopic[]
}

export const TopicTable = ({courseId, topics}: TopicTableProps) => {
    const router = useRouter();
    const { user } = useUser();

    const isAdmin = user?.publicMetadata.isAdmin as boolean || false;

    const onEditClick = useCallback(
        (id: GridRowId) => () => {
            router.push(`/topics/${id}/edit`)
        },
        [router],
    );

    const onDeleteClick = useCallback(
        (id: GridRowId) => async () => {
            const topicQuestions = await getQuestionsByTopic(id as string) as IQuestion[];

            topicQuestions.forEach((question, index) => {
                deleteQuestion({questionId: question._id.toString("hex"), path: ""})
            })

            const topic = await getTopicById(id as string);
            confirmDialog("Confirm deletion", `Do you really want to delete the topic ${topic.name}?`, async () => {
                await deleteTopic({ topicId: id as string, path: "/courses" })
            });
        },
        [],
    );

    const columns: GridColDef[] = [
        { field: "num", headerName: "#", width: 10 },
        { field: "name", headerName: "Topic name", width: 200 },
        { field: "description", headerName: "Topic description", flex: 1 },
        { field: "actions", type: "actions", getActions: (params) => [
                <GridActionsCellItem key={params.id} label={"Edit"} icon={<EditIcon/>} onClick={onEditClick(params.id)}/>,
                <GridActionsCellItem key={params.id} label={"Delete"} icon={<DeleteIcon/>} color={"error"} onClick={onDeleteClick(params.id)}/>,
            ]}
    ];

    const rows = topics.map((topic) => ({
        id: topic._id.toString("hex"),
        num: topic.num,
        name: topic.name,
        description: topic.description
    }));

    const onRowClick = async (params: GridRowParams) => {
        router.push(`/topics/${params.id}`);
    };

    return (
            <Box className={"h-96"}>
        <DataGrid columns={columns} rows={rows} disableRowSelectionOnClick disableColumnFilter disableColumnSelector disableDensitySelector slots={{ toolbar: TopicToolbar }} initialState={{
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
