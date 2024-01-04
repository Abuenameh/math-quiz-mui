import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {MarkStats} from "@/components/Statistics";
import Box from "@mui/material/Box";

export const CourseMarksTable = ({marks}: { marks: MarkStats[] }) => {
    const columns: GridColDef[] = [
        { field: "code", headerName: "Course code", width: 150 },
        { field: "title", headerName: "Course title", flex: 1 },
        { field: "mark", headerName: "Mark", width: 100 },
        { field: "total", headerName: "Out of", width: 100 },
    ];

    const rows = marks.map((mark, index) => ({
        id: index,
        code: mark.course.code,
        title: mark.course.title,
        mark: mark.mark,
            total: mark.totalMark,
    }));

    return (
        <>
            <Box className={"max-h-[20rem]"}>
            <DataGrid sx={{"& .MuiDataGrid-row:hover": {cursor: "default", background: "transparent"}, "& .MuiDataGrid-row.Mui-hovered": {background: "transparent"}}} columns={columns} rows={rows} disableRowSelectionOnClick disableColumnFilter disableColumnSelector disableDensitySelector
                      initialState={{
                          sorting: { sortModel: [{ field: "code", sort: "asc" }] },
                      //     pagination: { paginationModel: { pageSize: 10 } },
                      }}
            />
            </Box>
        </>
    );
};
