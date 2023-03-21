import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PersonData from "../components/PersonData";
import {
  getPersonSearch,
  personHisSelector,
  resetSearch,
  sendPersonOne,
} from "../store/slices/personHisSlice";
import { useAppDispatch } from "../store/store";

type Props = {};

const SearchPerson = (props: Props) => {
  const dispatch = useAppDispatch();
  const personHisReducer = useSelector(personHisSelector);

  const [inputHn, setInputHn] = useState("");
  useEffect(() => {
    if (inputHn.length >= 8) {
      dispatch(getPersonSearch(inputHn));
    }
    if (inputHn == "") {
      dispatch(resetSearch());
    }
  }, [inputHn]);

  const onSendData = async (params: string) => {
    const sending = await dispatch(sendPersonOne(params));
    if (sending.payload.message === "success") {
      enqueueSnackbar(`เพิ่มข้อมูลสำเร็จ!`, {
        variant: "success",
      });
      dispatch(resetSearch());
      setInputHn("");
    } else {
      enqueueSnackbar(`เพิ่มข้อมูลล้มเหลว!`, {
        variant: "error",
      });
      dispatch(resetSearch());
      setInputHn("");
    }
  };

  return (
    <Container sx={{ marginTop: 3 }}>
      <TextField
        fullWidth
        label="ค้นหาด้วย HN .."
        id=""
        value={inputHn}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setInputHn(event.target.value);
        }}
        autoFocus
      />
      <>
        {inputHn.length < 8 ? (
          <Typography m={2}>HN ต้องไม่น้อยกว่า 8 ตัว</Typography>
        ) : null}
        {personHisReducer.searching ? (
          <Typography>Loading</Typography>
        ) : personHisReducer.personSearch == "" ? (
          <Typography>ไม่พบข้อมูล</Typography>
        ) : null}
        {personHisReducer.personSearch
          ? personHisReducer.personSearch.map((data: any, index: number) => {
              return (
                <Box key={index} mt={2} textAlign="center">
                  <Typography>HN : {data.hn}</Typography>
                  <Typography>
                    ชื่อ-นามสกุล : {data.name} {data.last_name}
                  </Typography>
                  <Button
                    sx={{ margin: 2 }}
                    variant="contained"
                    onClick={() => onSendData(data)}
                  >
                    ส่งข้อมูลผู้ป่วย
                  </Button>
                </Box>
              );
            })
          : null}
      </>
      {/* {personHisReducer.errorSearch && <Typography>ไม่พบข้อมูล</Typography>} */}
    </Container>
  );
};

export default SearchPerson;
