require('dotenv').config();

const knexQue = require('knex')({
    client: "mysql",
    connection: {
      host: process.env.Q_HOST,
      port: process.env.Q_PORT,
      user: process.env.Q_USER,
      password: process.env.Q_PASSWORD,
      database: process.env.Q_DB,
    }
  });

const deleteQueue1 = () => {
  return knexQue('opd_2').del()
};
const deleteQueue2 = () => {
    return knexQue('opd_queue_systems').del()
};
const deleteQueue3 = () => {
  return knexQue('opd_mr').del()
};

exports.index = async (req, res, next) => {
  try {
    const del1 = await deleteQueue1();
    const del2 = await deleteQueue2();
    const del3 = await deleteQueue3();
    console.log(del1, del2, del3)
  } catch (error) {
    console.log(JSON.stringify(error));
  }
};
