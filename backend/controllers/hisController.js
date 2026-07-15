const axios = require("axios");
// const base_api = "https://canceranywhere.com/caw-gateway-production/";
const base_api = 'https://canceranywhere.com/caw-gateway-production/'

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
    // const dataCA = await personHisCA();
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
    } คน\n ผู้ป่วยรหัส HN:4${hnToString.substring(2, 4)} \n ส่งข้อมูลได้ที่ : ${config.FRONTEND_URL}`;
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

const getAllPersonSearch = async () =>{
  try {
    const sql = await knex("zdata_person")
    .select([
      knex.raw("CAST(`zdata_person`.`id` AS CHAR charset utf8mb4) AS `person_id`"),
      "zdata_person.hn",
      knex.raw(`
        CASE \`zdata_person\`.\`prename\`
          WHEN '003' THEN 1
          WHEN '005' THEN 2
          WHEN '004' THEN 3
          WHEN '001' THEN 4
          WHEN '002' THEN 5
          WHEN 'พ.ภ' THEN 5
          ELSE 99
        END AS title_code
      `),
      "zdata_person.fname AS name",
      "zdata_person.lname AS last_name",
      knex.raw(`
        CONCAT(
          SUBSTR(\`zdata_person\`.\`birth\`, 7, 4) - 543,
          SUBSTR(\`zdata_person\`.\`birth\`, 4, 2),
          SUBSTR(\`zdata_person\`.\`birth\`, 1, 2)
        ) AS birth_date
      `),
      knex.raw(`
        CONCAT(
          SUBSTR(\`zdata_person\`.\`cid\`, 1, 1), '-',
          SUBSTR(\`zdata_person\`.\`cid\`, 2, 4), '-',
          SUBSTR(\`zdata_person\`.\`cid\`, 6, 5), '-',
          SUBSTR(\`zdata_person\`.\`cid\`, 11, 2), '-',
          SUBSTR(\`zdata_person\`.\`cid\`, 13, 1)
        ) AS cid
      `),
      knex.raw(`
        CASE \`zdata_person\`.\`sex\`
          WHEN 1 THEN 1
          WHEN 2 THEN 2
          ELSE 9
        END AS sex_code
      `),
      knex.raw(`
        CASE \`zdata_person\`.\`nation\`
          WHEN '099' THEN 1
          WHEN 'ไทย' THEN 1
          WHEN '044' THEN 2
          WHEN '056' THEN 3
          WHEN '057' THEN 4
          WHEN '273' THEN 5
          WHEN '097' THEN 8
          WHEN '999' THEN 9
          ELSE 8
        END AS nationality_code
      `),
      "zdata_person.house AS address_no",
      knex.raw("REPLACE(`zdata_person`.`moo`, ' ', '') AS address_moo"),
      knex.raw("IFNULL(`zdata_person`.`tambon`, '999999') AS area_code"),
      "zdata_person.house AS permanent_address_no",
      knex.raw("REPLACE(`zdata_person`.`moo`, ' ', '') AS permanent_address_moo"),
      knex.raw("IFNULL(`zdata_person`.`tambon`, '999999') AS permanent_area_code"),
      "zdata_person.passport",
      "zdata_person.email",
      knex.raw("REPLACE(`zdata_person`.`phone`, '-', '') AS telephone_1"),
      knex.raw("IFNULL(REPLACE(`zdata_person`.`ddeath`, '-', ''), '') AS death_date"),
      knex.raw("'' AS death_cause_code"),
    ])
    .where("zdata_person.rstat", 1)
    .whereNot("zdata_person.user_type", 2)
    // .whereNotLike("zdata_person.fname", "%ทดสอบ%")
    // .whereNotLike("zdata_person.lname", "%ทดสอบ%")
    .where(knex.raw("zdata_person.create_date BETWEEN DATE('2024-08-02') AND DATE('2024-11-14')"))
    return sql;
  } catch (error) {
    console.error(error);
  }
}

const getPersonSearch = async (params) => {
  try {
    console.log('f')
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
    const sql = await knex("zdata_person")
    .select([
      knex.raw("CAST(`zdata_person`.`id` AS CHAR charset utf8mb4) AS `person_id`"),
      "zdata_person.hn",
      knex.raw(`
        CASE \`zdata_person\`.\`prename\`
          WHEN '003' THEN 1
          WHEN '005' THEN 2
          WHEN '004' THEN 3
          WHEN '001' THEN 4
          WHEN '002' THEN 5
          WHEN 'พ.ภ' THEN 5
          ELSE 99
        END AS title_code
      `),
      "zdata_person.fname AS name",
      "zdata_person.lname AS last_name",
      knex.raw(`
        CONCAT(
          SUBSTR(\`zdata_person\`.\`birth\`, 7, 4) - 543,
          SUBSTR(\`zdata_person\`.\`birth\`, 4, 2),
          SUBSTR(\`zdata_person\`.\`birth\`, 1, 2)
        ) AS birth_date
      `),
      knex.raw(`
        CONCAT(
          SUBSTR(\`zdata_person\`.\`cid\`, 1, 1), '-',
          SUBSTR(\`zdata_person\`.\`cid\`, 2, 4), '-',
          SUBSTR(\`zdata_person\`.\`cid\`, 6, 5), '-',
          SUBSTR(\`zdata_person\`.\`cid\`, 11, 2), '-',
          SUBSTR(\`zdata_person\`.\`cid\`, 13, 1)
        ) AS cid
      `),
      knex.raw(`
        CASE \`zdata_person\`.\`sex\`
          WHEN 1 THEN 1
          WHEN 2 THEN 2
          ELSE 9
        END AS sex_code
      `),
      knex.raw(`
        CASE \`zdata_person\`.\`nation\`
          WHEN '099' THEN 1
          WHEN 'ไทย' THEN 1
          WHEN '044' THEN 2
          WHEN '056' THEN 3
          WHEN '057' THEN 4
          WHEN '273' THEN 5
          WHEN '097' THEN 8
          WHEN '999' THEN 9
          ELSE 8
        END AS nationality_code
      `),
      "zdata_person.house AS address_no",
      knex.raw("REPLACE(`zdata_person`.`moo`, ' ', '') AS address_moo"),
      knex.raw("IFNULL(`zdata_person`.`tambon`, '') AS area_code"),
      "zdata_person.house AS permanent_address_no",
      knex.raw("REPLACE(`zdata_person`.`moo`, ' ', '') AS permanent_address_moo"),
      knex.raw("IFNULL(`zdata_person`.`tambon`, '') AS permanent_area_code"),
      "zdata_person.passport",
      "zdata_person.email",
      knex.raw("REPLACE(`zdata_person`.`phone`, '-', '') AS telephone_1"),
      knex.raw("IFNULL(REPLACE(`zdata_person`.`ddeath`, '-', ''), '') AS death_date"),
      knex.raw("'' AS death_cause_code"),
      knex.raw(`
        (SELECT drg.principle_dx
         FROM \`zdata_diagnosis_drg\` \`drg\`
         JOIN \`zdata_visit\` \`vs\` ON (\`drg\`.\`vn\` = \`vs\`.\`vn\` AND \`vs\`.\`rstat\` = 1)
         WHERE \`drg\`.\`rstat\` = 1
         AND \`drg\`.\`person_id\` = \`zdata_person\`.\`id\`
         AND drg.principle_dx LIKE 'C%'
         ORDER BY \`drg\`.\`create_date\`
         LIMIT 1
        ) AS diagnosis_drg
      `),
      knex.raw("'3' AS behaviour_code"),
      knex.raw(`
        (SELECT DATE_FORMAT(\`vs\`.\`visit_date\`, '%Y%m%d')
         FROM \`zdata_visit\` \`vs\`
         JOIN \`zdata_diagnosis\` \`dx\` ON (\`dx\`.\`vn\` = \`vs\`.\`vn\`)
         WHERE \`dx\`.\`rstat\` = 1
         AND \`dx\`.\`ptid\` = \`zdata_person\`.\`id\`
         ORDER BY \`dx\`.\`create_date\`
         LIMIT 1
        ) AS visit_date
      `),
      knex.raw(`
        (SELECT
          CASE \`pi\`.\`per_inscl_hos\`
            WHEN 'CASH' THEN 1
            WHEN 'OFC' THEN 2
            WHEN 'SSS' THEN 3
            WHEN 'UCS' THEN 4
            ELSE 9
          END
         FROM \`zdata_person_inscl\` \`pi\`
         JOIN \`zdata_diagnosis\` \`dx\` ON (\`dx\`.\`vn\` = \`pi\`.\`vn\`)
         WHERE \`dx\`.\`rstat\` = 1
         AND \`dx\`.\`ptid\` = \`zdata_person\`.\`id\`
         ORDER BY \`dx\`.\`create_date\`
         LIMIT 1
        ) AS finance_support_code
      `),
      knex.raw("'12276' AS hos_code"),
      knex.raw("IFNULL(`zdata_person`.`cancer_check`, '0') AS cancer_check"),
      knex.raw("IFNULL(`zdata_person`.`ca_person_check`, '0') AS ca_person_check"),
    ])
    .where("zdata_person.rstat", 1)
    .where("zdata_person.ca_person_check", 0)
    .where("zdata_person.cancer_check", 0)
    .where("zdata_person.hn", "like", "469%")
    .whereNot("zdata_person.user_type", 2)
    .whereRaw("zdata_person.fname NOT LIKE '%ทดสอบ%'")
    .whereRaw("zdata_person.lname NOT LIKE '%ทดสอบ%'")
    .groupBy("zdata_person.id")
    .havingRaw("`diagnosis_drg` BETWEEN 'C00' AND 'C97' OR `diagnosis_drg` BETWEEN 'D37' AND 'D48'")
    .havingRaw("IFNULL(`visit_date`, '') <> ''")
    .orderBy("zdata_person.create_date");
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
    console.log('result',result.data)
    if (result.data.status) {
      // console.log('person')
      const val = await updatePerson(req.body.person_id);
      console.log('update person',val)
      const cancerApi = await sendCancer(cancerRes);
      console.log('cancer', cancerApi.data)

      if (cancerApi.data.status) {
        const valCancer = await updatePersonCancer(req.body.person_id);
        console.log('update cancer',valCancer)
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
    console.log('upload',req.body)
    const result = await uploadData(req.body);
    console.log(result.data);
    if (result.data.message === "Updated" || result.data.message === "Created") {
      // const val = await updatePerson(req.body.person_id);
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
        console.log('gg')

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

exports.personSearchAll = async (req, res, next) => {
  try {
    const person = await personHis();
    // console.log(person);
    // person.map((val)=> uploadData(val))
    
    if (person) {
      cronUpload(person)
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
}
