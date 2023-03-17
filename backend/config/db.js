const knex = require("knex")
module.exports ={
  knexBuilder : knex({
    client: "mysql",
    connection: {
      host: "192.168.254.170",
      port: 3306,
      user: "Apisit",
      password: "Apisit@udch",
      database: "rad",
    },
  })
}
