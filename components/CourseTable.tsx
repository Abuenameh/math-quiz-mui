'use client'

import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRowId, GridRowParams,
    GridToolbar,
    GridToolbarContainer, GridToolbarQuickFilter
} from '@mui/x-data-grid';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {ICourse} from "@/lib/database/models/course.model";
import {useCallback} from "react";
import type {} from "@mui/x-data-grid/themeAugmentation";
import {useRouter} from "next/navigation";
import { Box } from "@mui/material";
import {confirmDialog, ConfirmDialog} from "@/components/ConfirmDialog";
import {deleteCourse} from "@/lib/actions/course.actions";

function FilterToolbar() {
    return (
        <GridToolbarContainer>
            <div className={"flex-1"} />
            <GridToolbarQuickFilter />
        </GridToolbarContainer>
    );
}

interface CourseTableProps {
    data: ICourse[]
}

export const CourseTable = ({data}: CourseTableProps) => {
    const router = useRouter();

    const onUpdateClick = useCallback(
        (id: GridRowId) => () => {
            router.push(`/courses/${id}/update`)
        },
        [],
    );

    const onDeleteClick = useCallback(
        (id: GridRowId) => () => {
            confirmDialog("Confirm deletion", "Do you really want to delete this course?", async () => {
                await deleteCourse({ courseId: id, path: "/courses" })
            });
        },
        [],
    );

    const columns: GridColDef[] = [
        { field: "code", headerName: "Course code", width: 100 },
        { field: "title", headerName: "Course title", flex: 1 },
        { field: "actions", type: "actions", getActions: (params) => [
                <GridActionsCellItem key={params.id} label={"Edit"} icon={<EditIcon/>} onClick={onUpdateClick(params.id)}/>,
                <GridActionsCellItem key={params.id} label={"Delete"} icon={<DeleteIcon/>} color={"error"} onClick={onDeleteClick(params.id)}/>,
            ]}
    ];

    const rows = data.map((course) => ({
        id: course._id,
        code: course.code,
        title: course.title
    }));

    const onRowClick = async (params: GridRowParams) => {
        router.push(`/courses/${params.id}`);
    };

    return (
            <Box className={"h-96"}>
        <DataGrid columns={columns} rows={rows} disableColumnFilter disableColumnSelector disableDensitySelector slots={{ toolbar: FilterToolbar }} initialState={{
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
