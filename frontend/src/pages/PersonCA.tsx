import axios from "axios";
import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import DataTable from "../components/DataTable";
import { Box, Button, Container, Grid, Grow, Paper } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { useAppDispatch } from "../store/store";
import { useSelector } from "react-redux";
import Fade from "@mui/material/Fade";
import {
  getPersonHis,
  getPersonHisCA,
  personHisSelector,
  sendDataToCA,
} from "../store/slices/personHisSlice";
import PersonData from "../components/PersonData";
import { titleName } from "../constants";
import ModalPerson from "../components/ModalPerson";
import { enqueueSnackbar } from "notistack";
import Loading from "../components/Loading";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

type Props = {};

function PersonCA({}: Props) {
  const dispatch = useAppDispatch();
  const personHisReducer = useSelector(personHisSelector);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = React.useState(0);
  const [personData, setPersonData]: any = useState(null);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setPersonData(null);
    setValue(newValue);
  };
  useEffect(() => {
    dispatch(getPersonHisCA());
    console.log("redux", personHisReducer.personAll);
  }, [dispatch]);

  const stockColumns: GridColDef[] = [
    {
      headerName: "HN",
      field: "hn",
      width: 100,
    },
    {
      headerName: "เลขบัตรประชาชน",
      field: "cid",
      width: 160,
    },
    {
      headerName: "ชื่อ - นามสกุล",
      field: "name",
      width: 200,
      renderCell: ({ row }: GridRenderCellParams<string>) => (
        <p>
          {titleName(row.title_code)}
          {row.name} {row.last_name}
        </p>
      ),
    },
    {
      headerName: "ICD10",
      field: "diagnosis_drg",
      width: 80,
      renderCell: ({ row }: GridRenderCellParams<string>) => (
        <p>{row.diagnosis_drg}</p>
      ),
    },
    {
      headerName: "",
      field: ".",
      width: 100,
      renderCell: ({ row }: GridRenderCellParams<string>) => (
        <>
          <Button
            variant="text"
            target="_blank"
            rel="noreferrer"
            // onClick={() => console.log(row.person_id.toString())}
            href={`https://his.udch.work/ezmodules/ezmodule/view?id=1627870240082918000&addon=0&tab=&person_id=${row.person_id.toString()}`}
          >
            ประวัติการรักษา
          </Button>
        </>
      ),
    },
  ];

  const personColumns: GridColDef[] = [
    {
      headerName: "HN",
      field: "hn",
      width: 100,
    },
    {
      headerName: "เลขบัตรประชาชน",
      field: "cid",
      width: 160,
    },
    {
      headerName: "ชื่อ - นามสกุล",
      field: "name",
      width: 200,
      renderCell: ({ row }: GridRenderCellParams<string>) => (
        <p>
          {titleName(row.title_code)}
          {row.name} {row.last_name}
        </p>
      ),
    },
    {
      headerName: "ICD10",
      field: "diagnosis_drg",
      width: 80,
      renderCell: ({ row }: GridRenderCellParams<string>) => (
        <p>{row.diagnosis_drg}</p>
      ),
    },
    {
      headerName: "",
      field: ".",
      width: 200,
      renderCell: ({ row }: GridRenderCellParams<string>) => (
        <>
          <Button
            variant="text"
            target="_blank"
            rel="noreferrer"
            // onClick={() => console.log(row.person_id.toString())}
            href={`https://his.udch.work/ezmodules/ezmodule/view?id=1627870240082918000&addon=0&tab=&person_id=${row.person_id.toString()}`}
          >
            ประวัติการรักษา
          </Button>{" "}
          <Button
            color="error"
            variant="text"
            onClick={() => sendOnePerson(row)}
          >
            ส่งซ้ำ
          </Button>
        </>
      ),
    },
  ];

  //https://his.udch.work/ezmodules/ezmodule/view?id=1627870240082918000&addon=0&tab=&person_id

  const doData = (e: any) => {
    const size = window.innerWidth;
    if (size < 900) {
      setOpen(true);
      console.log(e);
      setPersonData(e);
    } else {
      console.log(e);
      setPersonData(e);
    }
  };

  const sendOnePerson = async (params: any) => {
    setLoading(true);
    const val = await dispatch(sendDataToCA(params));
    if (val.payload === "success") {
      enqueueSnackbar(`เพิ่มข้อมูล HN${params.hn} สำเร็จ!`, {
        variant: "success",
      });
      setLoading(false);
      dispatch(getPersonHisCA());
    } else {
      console.log("error", val);
      enqueueSnackbar(`เพิ่มข้อมูล HN${params.hn} ล้มเหลว!`, {
        variant: "error",
      });
      setLoading(false);
      dispatch(getPersonHisCA());
    }
  };

  return (
    <Container>
      <Typography variant="h6" sx={{ pt: 3, textAlign: "start" }}>
        ผู้ป่วยมะเร็งที่ส่ง Cancer Anywhere (API)
      </Typography>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="ส่ง Person & cancer" {...a11yProps(0)} />
            <Tab label="ส่ง Person" {...a11yProps(1)} />
            {/* <Tab label="ผู้ป่วยต่างชาติ" {...a11yProps(1)} />
            <Tab label="รวม" {...a11yProps(2)} /> */}
          </Tabs>
        </Box>
        {value === 0 ? (
          // <Grow in={true}>
          <>
            <Box
              p={1}
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "flex" },
              }}
            >
              {personHisReducer.personCA.length ? (
                <>
                  <DataTable
                    rows={personHisReducer.personCA.filter(
                      (val: any) =>
                        val.ca_person_check == 1 && val.cancer_check == 1
                    )}
                    setPersonData={doData}
                    columns={stockColumns}
                  />
                  <Grid
                    item
                    xs={12}
                    sm={8}
                    md={4}
                    component={Paper}
                    elevation={6}
                    square
                    borderRadius={1}
                    p={1}
                    // sx={{ margin: "auto" }}
                    sx={{
                      width: "35%",
                      mx: 1,
                      display: { xs: "none", sm: "none", md: "flex" },
                    }}
                  >
                    <Box width="100%">
                      <Typography variant="h4">ข้อมูลผู้ป่วย</Typography>
                      {personData && <PersonData personData={personData} />}
                    </Box>
                  </Grid>
                </>
              ) : (
                <>
                  {personHisReducer.isError && <Typography>Error</Typography>}
                  {personHisReducer.isLoadingCA && (
                    <Typography>Loading ..</Typography>
                  )}
                </>
              )}
            </Box>
          </>
        ) : (
          <>
            <Box
              p={1}
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "flex" },
              }}
            >
              {personHisReducer.personCA.length ? (
                <>
                  <DataTable
                    rows={personHisReducer.personCA.filter(
                      (val: any) => val.cancer_check == 0
                    )}
                    setPersonData={doData}
                    columns={personColumns}
                  />
                  <Grid
                    item
                    xs={12}
                    sm={8}
                    md={4}
                    component={Paper}
                    elevation={6}
                    square
                    borderRadius={1}
                    p={1}
                    // sx={{ margin: "auto" }}
                    sx={{
                      width: "35%",
                      mx: 1,
                      display: { xs: "none", sm: "none", md: "flex" },
                    }}
                  >
                    <Box width="100%">
                      <Typography variant="h4">ข้อมูลผู้ป่วย</Typography>
                      {personData && <PersonData personData={personData} />}
                    </Box>
                  </Grid>
                </>
              ) : (
                <>
                  {personHisReducer.isError && <Typography>Error</Typography>}
                  {personHisReducer.isLoadingCA && (
                    <Typography>Loading ..</Typography>
                  )}
                </>
              )}
            </Box>
          </>
        )}
        <ModalPerson open={open} setOpen={setOpen} personData={personData} />
      </Box>
      <Loading open={loading} />
    </Container>
  );
}

export default PersonCA;
