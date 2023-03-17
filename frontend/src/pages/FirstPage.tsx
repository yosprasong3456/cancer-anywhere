import {
  Grid,
  Typography,
  Button,
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Box,
  Paper,
} from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authSelector } from "../store/slices/authSlice";
import { useAppDispatch } from "../store/store";
import "../App.css";
import { SnackbarProvider, enqueueSnackbar, VariantType } from "notistack";
import {
  getPersonHisCA,
  getPersonHis,
  personHisSelector,
} from "../store/slices/personHisSlice";
type Props = {};

const FirstPage = (props: Props) => {
  const dispatch = useAppDispatch();
  const authReducer = useSelector(authSelector);
  const personHisReducer = useSelector(personHisSelector);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getPersonHis());
    dispatch(getPersonHisCA());
  }, []);

  return (
    <Grid
      container
      spacing={0}
      // align="center"
      // justify="center"
      direction="column"
      style={{
        alignContent: "center",
        justifyContent: "center",
        // height: "80vh",
      }}
    >
      <Grid item sx={{ my: 5 }}>
        {/* <div className="typewriter">
          <h1>{`ยินดีต้อนรับ คุณ ${authReducer.authData.data[0].firstname} ${authReducer.authData.data[0].lastname}`}</h1>
        </div> */}

        <Typography variant="h4" p={2} mb={2} gutterBottom>
          ระบบส่งข้อมูลผู้ป่วยมะเร็งเข้า Cancer Anywhere
        </Typography>
        {/* {authReducer.authData.data[0].avatar ? (
          <img
            style={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              marginBottom: 10,
            }}
            alt=""
            src={authReducer.authData.data[0].avatar}
          />
        ) : (
          <img
            style={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              marginBottom: 10,
            }}
            alt=""
            src="/person.png"
          />
        )} */}

        <p className="typewriter">
          <span style={{ position: "relative", bottom: 8, marginLeft: 10 }}>
            ยินดีต้อนรับ{" "}
          </span>
          {authReducer.authData.data[0].avatar ? (
            <img
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
              }}
              alt="avatar"
              src={authReducer.authData.data[0].avatar}
            />
          ) : (
            <img
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
              }}
              alt="avatar"
              src="/person.png"
            />
          )}
          <span
            style={{ position: "relative", bottom: 8, marginLeft: 10 }}
          >{`คุณ${authReducer.authData.data[0].firstname} ${authReducer.authData.data[0].lastname} 🚀`}</span>
        </p>

        <Grid container spacing={1} sx={{ marginTop: 2 }}>
          <Grid item xs={12} md={6}>
            <Box>
              <img
                src="https://cdn-icons-png.flaticon.com/512/10016/10016926.png"
                alt="icon"
                width={160}
                style={{ marginLeft: 30 }}
              />
            </Box>
            <Paper
              sx={{
                marginTop: -10,
                paddingTop: 8,
                paddingBottom: 2,
                borderRadius: 5,
              }}
              elevation={6}
            >
              <Typography gutterBottom variant="h3" component="div">
                {personHisReducer.personAll.length
                  ? personHisReducer.personAll.length
                  : ""}{" "}
                คน
              </Typography>
              <Typography variant="h5" color="text.secondary">
                ผู้ป่วยมะเร็งรายใหม่
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <img
                src="https://cdn-icons-png.flaticon.com/512/1163/1163784.png"
                alt="icon"
                width={160}
              />
            </Box>
            <Paper
              sx={{
                marginTop: -10,
                paddingTop: 8,
                paddingBottom: 2,
                borderRadius: 5,
              }}
              elevation={6}
            >
              <Typography gutterBottom variant="h3" component="div">
                {personHisReducer.personCA.length
                  ? personHisReducer.personCA.length
                  : ""}{" "}
                คน
              </Typography>
              <Typography variant="h5" color="text.secondary">
                ผู้ป่วยมะเร็งที่ส่งข้อมูลแล้ว
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Typography variant="h5" mt={5}>
          ข้อมูลใน HIS 2023
        </Typography>
      </Grid>
    </Grid>
  );
};

export default FirstPage;
