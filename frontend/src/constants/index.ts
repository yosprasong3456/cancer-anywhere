export const apiUrl = import.meta.env.VITE_API_KEY;
export const imageUrl = "http://localhost:8081";
export const server = {
  LOGIN_URL: `/users/login`,
  PERSON_HIS_ALL: `/personHis/getPerson`,
  PERSON_HIS_ALL_CA: `/personHis/getPersonCA`,
  SEND_DATA_TO_CA: `/personHis/sendToCA`,
  // REGISTER_URL: `register`,
  // PRODUCT_URL: `product`,
  // TRANSACTION_URL: `transaction`,
  // REPORT_URL: `report`,
  TOKEN_KEY: `token`,
};

export const titleName = (params: string) => {
  const title = [
    {
      code: 1,
      name: "นาย",
      status: "Y",
    },
    {
      code: 2,
      name: "นาง",
      status: "Y",
    },
    {
      code: 3,
      name: "นางสาว",
      status: "Y",
    },
    {
      code: 4,
      name: "เด็กชาย",
      status: "Y",
    },
    {
      code: 5,
      name: "เด็กหญิง",
      status: "Y",
    },
    {
      code: 6,
      name: "พระภิกษุ",
      status: "Y",
    },
    {
      code: 99,
      name: "ไม่ทราบ",
      status: null,
    },
  ];
  let titleName = title.find((val: any) => val.code == params);
  if (titleName?.status === "Y") {
    return titleName?.name;
  } else {
    return "";
  }
};
