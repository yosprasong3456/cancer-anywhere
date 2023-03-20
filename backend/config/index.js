require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    DOMAIN: 'http://192.168.254.153:3000/',
    // SECRET: 'mhIR55QqHYHXoBSASSPqhja5ESjPU86LwvEktCrKTWDJxoScuwCV3weODrEnxPz',
    TOKEN_API: process.env.TOKEN_API,
    TOKEN_KEY: process.env.TOKEN_KEY,
    LINE:process.env.LINE_TOKEN,
    FRONTEND_URL: process.env.FRONTEND,
}

