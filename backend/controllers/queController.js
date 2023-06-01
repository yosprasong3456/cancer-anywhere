const db = require("../config/db");
const knex = db.queDB;

const deleteQueue1 = () => {
  return knex('opd_2').del()
};
const deleteQueue2 = () => {
    return knex('opd_queue_systems').del()
  };

exports.index = async (req, res, next) => {
  try {
    const del1 = await deleteQueue1();
    const del2 = await deleteQueue2();
  } catch (error) {
    console.log(JSON.stringify(error));
  }
};
