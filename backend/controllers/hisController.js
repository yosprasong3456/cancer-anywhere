const axios = require("axios");
const base_api = "https://canceranywhere.com/caw-gateway-production/";
const config = require("../config/index");

const token = `Basic ${config.TOKEN_API}`;
const db = require("../config/db");
const knex = db.knexBuilder;

const lineNotify = require("line-notify-nodejs")(config.LINE);
const dayjs = require("dayjs");
require("dayjs/locale/th");

const today = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

exports.lineNortify = async () => {
  try {
    const data = await personHis();
    const dataCA = await personHisCA();
    console.log(
      "day js DD-MM-YYYY",
      dayjs(today()).locale("th").format("DD MMMM YYYY")
    );
    let day = dayjs(today()).locale("th").format("DD MMMM YYYY");
    const year = day.split(" ");
    day = `${year[0]} ${year[1]} ${parseInt(year[2]) + 543}`;
    let hnNum = parseInt(year[2]) + 543;
    let hnToString = hnNum.toString();
    let message = `\n วันที่ ${day} \n มีผู้ป่วยรายใหม่ ${
      data.length
    } คน\n ผู้ป่วยรหัส HN:4${hnToString.substring(2, 4)}\n ส่งข้อมูลแล้ว ${
      dataCA.length
    } คน \n ส่งข้อมูลได้ที่ : ${config.FRONTEND_URL}`;
    const lineNoti = await lineNotify.notify({ message: message });
    cronUpload(data)
    return null;
  } catch (error) {
    return null;
  }
};

const cronUpload = async (person) =>{
  try {
    let sendData = 0
    let sendError = 0
    if (person.length) {
      person.map(async (val, index) => {
        console.log(val.person_id);
        if (!val.area_code) {
          val.area_code = "999999";
          val.permanent_area_code = "999999";
        }
        const sendPerson = await uploadData(val);
        const cancerBody = {
          cid: val.cid,
          visit_date: val.visit_date,
          behaviour_code: val.behaviour_code,
          finance_support_code: val.finance_support_code,
          icd10_code: val.diagnosis_drg,
        };
        if (sendPerson.data.message === "DONE") {
          const updateP = await updatePerson(val.person_id);
          const sended = await sendCancer(cancerBody);
          console.log(sended.data);
          if (sended.data.message === "DONE") {
            sendData ++
            const updateCancer = await updatePersonCancer(val.person_id);
          }
        } else {
          sendError ++
        }

        if (person.length - 1 == index) {
          cronLineNoti(sendData, sendError);
        }
      });
    } else {
      console.log("cron");
    }
  } catch (error) {
    console.log(error)
  }
}

// exports.cronJobUpload = async () => {
//   try {
//     const person = await personHis();
//     let sendData = [];
//     let sendError = [];
//     if (person.length) {
//       person.map(async (val, index) => {
//         console.log(val.person_id);
//         if (!val.area_code) {
//           val.area_code = "999999";
//           val.permanent_area_code = "999999";
//         }
//         const sendPerson = await uploadData(val);

//         if (sendPerson.data.message === "DONE") {
//           const updateP = await updatePerson(val.person_id);
//           const cancerBody = {
//             cid: val.cid,
//             visit_date: val.visit_date,
//             behaviour_code: val.behaviour_code,
//             finance_support_code: val.finance_support_code,
//             icd10_code: val.diagnosis_drg,
//           };
//           const sended = await sendCancer(cancerBody);
//           console.log(sended.data);
//           if (sended.data.message === "DONE") {
//             sendData.push(index);
//             const updateCancer = await updatePersonCancer(val.person_id);
//           }
//         } else {
//           sendError.push(index);
//         }

//         if (person.length - 1 == index) {
//           cronLineNoti(sendData.length, sendError.length);
//         }
//       });
//       // if (sendData.length) {

//       // }
//     } else {
//       console.log("cron");
//     }

//     return;
//   } catch (error) {
//     console.log(error);
//     return;
//   }
// };

const cronLineNoti = async (count1, count2) => {
  let day = dayjs(today()).locale("th").format("DD MMMM YYYY");
  const year = day.split(" ");
  day = `${year[0]} ${year[1]} ${parseInt(year[2]) + 543}`;
  let message = `\n วันที่ ${day} \n ส่งข้อมูลผู้ป่วยรายใหม่สำเร็จ ${count1} คน\n ส่งข้อมูลผู้ป่วยรายใหม่ล้มเหลว ${count2} คน`;
  try {
    const lineNoti = await lineNotify.notify({ message: message });
    console.log('lineNoti',lineNoti);
  } catch (error) {
    console.log(error);
  }
};

const uploadData = (params) => {
  delete params.death_date
  if (params.area_code == "380410") {
    params.area_code = "380404";
    params.permanent_area_code = "380404";
  }
  if (params.area_code == '843100'){
    params.area_code = "430111";
    params.permanent_area_code = "430111";
  }
  if (!params.area_code) {
    params.area_code = "999999";
    params.permanent_area_code = "999999";
  }
  return axios.post(base_api + `patient`, params, {
    headers: { Authorization: token },
  });
};

const sendCancer = (params) => {
  return axios.post(base_api + `cancer`, params, {
    headers: { Authorization: token },
  });
};

const updatePerson = async (params) => {
  try {
    const sql = await knex("zdata_person").where("id", params).update({
      ca_person_check: 1,
    });
    return sql;
  } catch (error) {}
};
const updatePersonCancer = async (params) => {
  try {
    const sql = await knex("zdata_person").where("id", params).update({
      cancer_check: 1,
    });
    return sql;
  } catch (error) {}
};

const getOnePerson = async (params) => {
  try {
    const sql = await knex
      .select("*")
      .from("v_person_only_ca")
      .where("hn", params);
    return sql;
  } catch (error) {
    console.error(error);
  }
};

const getPersonSearch = async (params) => {
  try {
    const sql = await knex
      .select("*")
      .from("v_person_only_ca")
      .whereLike("hn", params);
    return sql;
  } catch (error) {
    console.error(error);
  }
};

const personHis = async () => {
  try {
    const sql = await knex
      .select("*")
      .from("v_person_ca")
      .where("cancer_check", "0");
    return sql;
  } catch (error) {
    console.error(error);
  }
};

const personHisCA = async () => {
  try {
    const sql = await knex
      .select("*")
      .from("v_person_ca")
      .where("ca_person_check", "1");
    return sql;
  } catch (error) {
    console.error(error);
  }
};

exports.getPerson = async (req, res, next) => {
  try {
    const data = await personHis();
    console.log("getPerson");
    res.status(200).json({
      message: "success",
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: "error",
        message: error.message,
      },
    });
  }
};

exports.getPersonCA = async (req, res, next) => {
  try {
    const data = await personHisCA();
    console.log("getPersonCA");
    res.status(200).json({
      message: "success",
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: "error",
        message: error.message,
      },
    });
  }
};

exports.sendData = async (req, res, next) => {
  try {
    const cancerRes = {
      cid: req.body.cid,
      visit_date: req.body.visit_date,
      behaviour_code: req.body.behaviour_code,
      finance_support_code: req.body.finance_support_code,
      icd10_code: req.body.diagnosis_drg,
    };
    console.log(cancerRes)
    
    // console.log(req.body)
    const result = await uploadData(req.body);
    // console.log(result.data)
    if (result.data.message === "DONE") {
      // console.log('person')
      const val = await updatePerson(req.body.person_id);
      // console.log('val',val)
      const cancerApi = await sendCancer(cancerRes);
      // console.log('cancer', cancerApi.data)

      if (cancerApi.data.message === "DONE") {
        const valCancer = await updatePersonCancer(req.body.person_id);
        // console.log(val)
        return res.status(200).json({
          message: "success",
          status: "ok",
        });
      } else {
        return res.status(400).json({
          message: "success",
          status: "no_cancer",
        });
      }
    } else {
      return res.status(200).json({
        message: "success",
        status: "not_person",
      });
    }
  } catch (error) {
    let err;
    let errorText = [];
    if (error.response) {
      err = error.response.data;
      if (err) {
        Object.keys(err).map((val, index) => {
          errorText.push(
            `${Object.keys(err)[index]} : ${Object.values(err)[index]}`
          );
        });
        console.log(errorText.toString());
      }
    }
    res.status(400).json({
      message: "error",
      data: errorText.toString(),
    });
  }
};

exports.addPersonOnly = async (req, res, next) => {
  try {
    const result = await uploadData(req.body);
    console.log(result.data);
    if (result.data.message === "DONE") {
      const val = await updatePerson(req.body.person_id);
      return res.status(200).json({
        message: "success",
        status: "ok",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "error",
      status: "error",
    });
  }
};

exports.personSearch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const person = await getPersonSearch(`%${id}%`);
    console.log(person);
    if (person) {
      return res.status(200).json({
        message: "success",
        data: person,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "error",
      status: "error",
    });
  }
};
