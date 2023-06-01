require('dotenv').config();

const knex = require("knex")

module.exports ={
  knexBuilder : knex({
    client: "mysql",
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
  })
}

// module.exports ={
//   queDB : knex1({
//     client: "mysql",
//     connection: {
//       host: process.env.Q_HOST,
//       port: process.env.Q_PORT,
//       user: process.env.Q_USER,
//       password: process.env.Q_PASSWORD,
//       database: process.env.Q_DB,
//     },
//   })
// }
