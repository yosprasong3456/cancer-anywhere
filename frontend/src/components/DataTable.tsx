import React from "react";
import {
  DataGrid,
  gridPageCountSelector,
  GridPagination,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import MuiPagination from "@mui/material/Pagination";
import { TablePaginationProps } from "@mui/material/TablePagination";

import styled from "@emotion/styled";
import { DataGridProps } from "@mui/x-data-grid";
import { Box, Paper } from "@mui/material";
type Props = {
  rows: any;
  columns: any;
  // setValue?: any;
  setPersonData?: any;
};

interface CMDataGridProp extends DataGridProps {
  showOutline?: boolean;
  theme?: any;
}

const CMDataGrid = styled(DataGrid)<CMDataGridProp>(
  ({ showOutline, theme }) => ({
    "& .MuiDataGrid-cell:focus": {
      outline: showOutline ? "solid #2196f3 1px" : "solid #2196f3 0px",
    },
    "& .MuiDataGrid-row:nth-of-type(even)": {
      // backgroundColor: "#f5f5f5",
      "&:hover": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? "#000 !important"
            : "#e0f7fa!important",
      },
    },
    "& .MuiDataGrid-row:nth-of-type(odd)": {
      // backgroundColor: "#ffffff",
      "&:hover": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? "#000 !important"
            : "#e0f7fa!important",
      },
    },
    "& .MuiDataGrid-selectedRowCount": {
      display: "none",
    },
    "& .MuiDataGrid-footerContainer": {
      justifyContent: "end",
    },
  })
);

function DataTable({ rows, columns, setPersonData = 0 }: Props) {
  return (
    <Paper sx={{ width: { xs: "100%", md: "80%" } }}>
      <CMDataGrid
        sx={{
          // backgroundColor: "white",
          // padding: 1,
          height: "65vh",
          // "& .MuiDataGrid-cell:focus": { outline: "solid #2196f3 0px" },
        }}
        getRowId={(row) => row.hn}
        onRowClick={(e) => {
          setPersonData ? setPersonData(e.row) : console.log("1");
        }}
        rows={rows}
        columns={columns}
        // componentsProps={{
        //   toolbar: {
        //     onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
        //       setValue(event?.target.value),
        //     clearSearch: () => setValue(""),
        //   },
        // }}
        // pageSize={25}
        // rowsPerPageOptions={[5, 10]}
      />
    </Paper>
  );
}

export default DataTable;
