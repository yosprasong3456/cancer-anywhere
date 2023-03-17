const db = require('../config/db')
const knex = db.knexBuilder

const personHis = async () => {
    try {
        const sql = await knex.select('*').from('v_pateint_cn')
        const data = sql
        // console.log('sql', sql)
        return data

        // return axios.get(base_api+`patient`, {
        //     headers: { Authorization: token },
        // })
    } catch (error) {
        console.error(error)
    }
}

exports.index = async (req, res, next) => {
    try {
        const data = await personHis()
        res.status(200).json({
            message: 'success',
            data: data
            
        })
    } catch (error) {
        res.status(400).json({
            error: {
                message: 'error',
                message: error.message
            }
        })
    }
}

exports.pushToCA = async (req, res, next) => {
    try {
        const data = await personHis()
        console.log(data)
        // res.status(200).json({
        //     message: 'success',
        //     data: data
            
        // })
    } catch (error) {
        res.status(400).json({
            error: {
                message: 'error',
                message: error.message
            }
        })
    }
}

// exports.showRegistedById = async (req, res, next) => {
//     try {
//         const { id } = req.params
//         const data = await showRegistedById(id)
//         res.status(200).json({
//             data: data.data
//         })
//     } catch (error) {
//         res.status(400).json({
//             error: {
//                 message: error.message
//             }
//         })
//     }
    
// }


// exports.addPerson = async (req, res, next) => {
//     try {
//         const data = req.body
//         const json = JSON.stringify(data);
//         const call = await addPerson(json)
//         console.log('v',call)
//         res.status(200).json({
//             message: 'addPerson',
//             data: call.data
//         })
//     } catch (error) {
//         res.status(400).json({
//             error: {
//                 message: error.message
//             }
//         })
//     }
// }
// exports.addCancer = async (req, res, next) => {
//     try {
//         const data = req.body
//         const json = JSON.stringify(data);
//         const call = await addCancer(json)
//         console.log('v',call)
//         res.status(200).json({
//             message: 'addCancer',
//             data: call.data
//         })
//     } catch (error) {
//         res.status(400).json({
//             error: {
//                 message: error.message
//             }
//         })
//     }
//  }

// exports.addTreatment = async (req, res, next) => {
//     try {
//         const data = req.body
//         const json = JSON.stringify(data);
//         const treatment = await addTreatment(json)
//         console.log('v',treatment)
//         res.status(200).json({
//             message: 'addTreatment',
//             data: treatment.data
//         })
//     } catch (error) {
//         res.status(400).json({
//             error: {
//                 message: error.message
//             }
//         })
//     }
//  }