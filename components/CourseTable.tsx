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
import {deleteCourse, getCourseById} from "@/lib/actions/course.actions";
import { Add } from '@mui/icons-material';
import {ITopic} from "@/lib/database/models/topic.model";
import {deleteTopic, getTopicsByCourse} from "@/lib/actions/topic.actions";
import {useUser} from "@clerk/nextjs";
import {CurrentQuestion} from "@/components/CurrentQuestion";

function CourseToolbar() {
    const router = useRouter();
    const { user } = useUser();

    const isAdmin = user?.publicMetadata.isAdmin as boolean || false;

    return (
        <GridToolbarContainer className={"m-2"}>
            {isAdmin && <Button variant={"contained"} startIcon={<Add />} onClick={() => router.push("/courses/create")}>Add Course</Button>}
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
    const { user } = useUser();

    const isAdmin = user?.publicMetadata.isAdmin as boolean || false;

    const onEditClick = useCallback(
        (id: GridRowId) => () => {
            router.push(`/courses/${id}/edit`)
        },
        [router],
    );

    const onDeleteClick = useCallback(
        (id: GridRowId) => async () => {
            const courseTopics = await getTopicsByCourse(id as string) as ITopic[];

            courseTopics.forEach((topic) => {
                deleteTopic({topicId: topic._id.toString("hex"), path: ""})
            })

            const course = await getCourseById(id as string);
            confirmDialog("Confirm deletion", `Do you really want to delete the course ${course.code}?`, async () => {
                await deleteCourse({ courseId: id as string, path: "/courses" })
            });
        },
        [],
    );

    const columns: GridColDef[] = [
        { field: "code", headerName: "Course code", width: 150 },
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
        <>
            <CurrentQuestion />
            <Box className={"h-[30rem]"}>
        <DataGrid columns={columns} rows={rows} disableRowSelectionOnClick disableColumnFilter disableColumnSelector disableDensitySelector slots={{ toolbar: CourseToolbar }} initialState={{
            filter: {
                filterModel: {
                    items: [],
                    quickFilterExcludeHiddenColumns: true,
                },
            },
            sorting: { sortModel: [{ field: "code", sort: "asc" }] },
        }} columnVisibilityModel={{
            actions: isAdmin
        }} onRowClick={onRowClick}/>
            </Box>
            </>
    );
};
