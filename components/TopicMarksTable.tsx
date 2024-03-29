import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {MarkStats} from "@/components/Statistics";
import Box from "@mui/material/Box";

export const TopicMarksTable = ({marks}: { marks: MarkStats[] }) => {
    const columns: GridColDef[] = [
        {field: "name", headerName: "Topic name", width: 300},
        {
            field: "description",
            headerName: "Topic description",
            flex: 1,
            renderCell: (params) => (<Box className={"flex min-h-[52px] my-3 items-center whitespace-pre-line"}>{params.value}</Box>)
        },
        {field: "mark", headerName: "Mark", width: 100},
        {field: "total", headerName: "Out of", width: 100},
    ];

    const rows = marks.map((mark, index) => ({
        id: index,
        name: mark.topic.name,
        description: mark.topic.description,
        mark: mark.mark,
        total: mark.totalMark,
    }));

    return (
        <>
            <Box className={"max-h-[20rem]"}>
                <DataGrid getRowHeight={() => 'auto'} sx={{
                    "& .MuiDataGrid-row:hover": {cursor: "default", background: "transparent"},
                    "& .MuiDataGrid-row.Mui-hovered": {background: "transparent"}
                }} columns={columns} rows={rows} disableRowSelectionOnClick disableColumnFilter disableColumnSelector
                          disableDensitySelector
                          initialState={{
                              sorting: {sortModel: [{field: "name", sort: "asc"}]},
                          }}
                />
            </Box>
        </>
    );
};
