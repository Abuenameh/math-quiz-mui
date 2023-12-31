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
import {useRouter} from "next/navigation";
import { Box, Button } from "@mui/material";
import {confirmDialog} from "@/components/ConfirmDialog";
import {deleteCourse} from "@/lib/actions/course.actions";
import { Add } from '@mui/icons-material';
import {router} from "next/client";
import {Types} from "mongoose";
// import Button from "@mui/material/Button";

function CourseToolbar() {
    const router = useRouter();

    return (
        <GridToolbarContainer className={"m-2"}>
            <Button variant={"contained"} startIcon={<Add />} onClick={() => router.push("/courses/create")}>Add Course</Button>
            <div className={"flex-1"} />
            <GridToolbarQuickFilter />
        </GridToolbarContainer>
    );
}

interface CourseTableProps {
    courses: ICourse[]
}

export const CourseTable = ({courses}: CourseTableProps) => {
    const router = useRouter();

    const onEditClick = useCallback(
        (id: GridRowId) => () => {
            router.push(`/courses/${id}/edit`)
        },
        [router],
    );

    const onDeleteClick = useCallback(
        (id: GridRowId) => () => {
            confirmDialog("Confirm deletion", "Do you really want to delete this course?", async () => {
                await deleteCourse({ courseId: id as string, path: "/courses" })
            });
        },
        [],
    );

    const columns: GridColDef[] = [
        { field: "code", headerName: "Course code", width: 100 },
        { field: "title", headerName: "Course title", flex: 1 },
        { field: "actions", type: "actions", getActions: (params) => [
                <GridActionsCellItem key={params.id} label={"Edit"} icon={<EditIcon/>} onClick={onEditClick(params.id)}/>,
                <GridActionsCellItem key={params.id} label={"Delete"} icon={<DeleteIcon/>} color={"error"} onClick={onDeleteClick(params.id)}/>,
            ]}
    ];

    const rows = courses.map((course) => ({
        id: course._id.toString("hex"),
        code: course.code,
        title: course.title
    }));

    const onRowClick = async (params: GridRowParams) => {
        router.push(`/courses/${params.id}`);
    };

    return (
            <Box className={"h-96"}>
        <DataGrid columns={columns} rows={rows} disableRowSelectionOnClick disableColumnFilter disableColumnSelector disableDensitySelector slots={{ toolbar: CourseToolbar }} initialState={{
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
