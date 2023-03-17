import { Box, Typography } from "@mui/material";
import React from "react";
import { titleName } from "../constants";

type Props = {
  personData: any;
};

const PersonData = ({ personData }: Props) => {
  return (
    <Box textAlign="start" p={1}>
      {/* <Typography sx={{ wordWrap: "anywhere" }}>
      {JSON.stringify(personData)}
    </Typography> */}
      <Typography sx={{ wordWrap: "anywhere", fontSize: 20 }}>
        CID : {personData.cid} <br />
        HN : {personData.hn} <br />
        ชื่อ - นามสกุล : {titleName(personData.title_code)}
        {personData.name} {personData.last_name} <br />
        เพศ : {personData.sex_code ? "ชาย" : "หญิง"} <br />
        เชื้อชาติ : {personData.nationality_code} <br />
        ที่อยู่ : {personData.address_no ? personData.address_no : "- "} หมู่
        {personData.ddress_moo ? personData.ddress_moo : " -"} ต.
        {personData.area_code ? personData.area_code : " -"}
        <br />
        Passport : {personData.passport} <br />
        Email : {personData.email} <br />
        เบอร์โทรศัพท์ : {personData.telephone_1}
        <br />
        Diagnosis : {personData.diagnosis_drg} <br />
        สถานะส่งข้อมูล :{" "}
        {personData.cancer_check > 0 ? (
          <span
            style={{
              backgroundColor: "limegreen",
              padding: 2,
              borderRadius: 5,
              color: "aliceblue",
            }}
          >
            ส่งข้อมูลแล้ว
          </span>
        ) : (
          <span
            style={{
              backgroundColor: "red",
              padding: 2,
              borderRadius: 5,
              color: "aliceblue",
            }}
          >
            ยังไม่ส่งข้อมูล
          </span>
        )}
      </Typography>
    </Box>
  );
};

export default PersonData;
