const jwt = require('jsonwebtoken')

const config = require('../config/index')

const verifyToken = (req, res, next)=>{
    // const header = req.headers.authorization.split(' ')
    const checkHeader = req.headers.authorization
    if(checkHeader){
        const header = req.headers.authorization.split(' ')
        const token = header[1]
        if(!token){
            return res.status(403).send({message: 'no_token'})
        }
    
        try {
            const decoded = jwt.verify(token, config.TOKEN_KEY)
            req.user = decoded
        } catch(error){
            return res.status(401).send({message: 'no_token'})
        }
        return next()
    }else{
        return res.status(401).send({message: 'no_token'})
    }
    
}
module.exports = verifyToken

// const getUser = (req,res,next)=>{
//     const header = req.headers.authorization.split(' ')
//     const token = header[1]
//     const user = jwt.decode(token, config.TOKEN_KEY)
//     console.log(user)
// }
// module.exports = getUser

