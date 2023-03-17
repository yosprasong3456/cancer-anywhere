// import * as bcrypt from 'bcrypt';
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const config = require('../config/index')
const db = require('../config/db')
const knex = db.knexBuilder

const getProfile = (params) => {
  return (
    knex
      .select(
        "username",
        "password_hash",
        "title",
        "firstname",
        "lastname",
        "fullname_eng",
        "position",
        knex.raw('CONCAT(avatar_base_url,"/",avatar_path) AS avatar')
      )
      .from("user")
      // .innerJoin('`profile` ON(user_id=id)')
      .innerJoin(`profile`, "user_id", "id")

      .where("username", params)
  );
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const data = await getProfile(username);
    if (data.length) {
      // console.log('sql', sql)
      const match = await bcrypt.compare(
        password,
        data[0].password_hash.replace("$2y$", "$2a$")
      );
      if (match) {
        delete data[0].password_hash;

        data[0].token = genToken(data[0].username)
        res.status(200).json({
          message: "success",
          data: data,
        });
      } else {
        throw error();
      }
    } else {
      throw error();
    }
  } catch (error) {
    res.status(400).json({
      error: {
        message: "error", 
        message: error.message,
      },
    });
  }
};


const genToken =(params)=>{
  return jwt.sign(
    {user: params},
    config.TOKEN_KEY,
    {
      expiresIn: "6h"
    }
  )
  }


exports.checklogin = async (req, res, next) => {
  const checkHeader = req.headers.authorization
  console.log()
  if(checkHeader){
    const header = req.headers.authorization.split(' ')
    console.log(header)
    const token = header[1]
  
    const user = jwt.decode(token, config.TOKEN_KEY)
    const data = await getProfile(user.user);
    console.log(data[0].username)
    data[0].token = genToken(data[0].username)
    return res.status(200).json({
      message: 'success',
      data: data
  })
  }else{
    return res.status(401).json({
      message: 'no_token'
  })
  }
}


