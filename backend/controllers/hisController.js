const axios = require('axios')
const base_api = 'https://canceranywhere.com/caw-gateway-production/';
const config = require('../config/index')

const token = `Basic ${config.TOKEN_API}`
const db = require('../config/db')
const knex = db.knexBuilder


const uploadData =(params)=>{
    return axios.post(base_api+`patient`, params, {
        headers: { Authorization: token },
    })
}

const sendCancer =(params)=>{
    return axios.post(base_api+`cancer`, params, {
        headers: { Authorization: token },
    })
}

const updatePerson = async (params) =>{
    try {
        const sql = await knex('zdata_person').where('id', params).update({
            ca_person_check: 1
          })
          return sql
    } catch (error) {
        
    }
}
const updatePersonCancer = async (params) =>{
    try {
        const sql = await knex('zdata_person').where('id', params).update({
            cancer_check: 1
          })
          return sql
    } catch (error) {
        
    }
}

const personHis = async () => {
    try {
        const sql = await knex.select('*').from('v_person_ca').where('cancer_check', '0')
        return sql

    } catch (error) {
        console.error(error)
    }
}

const personHisCA = async () => {
    try {
        const sql = await knex.select('*').from('v_person_ca').where('ca_person_check', '1')
        return sql
    } catch (error) {
        console.error(error)
    }
}

exports.getPerson = async (req, res, next) => {

    try {
        const data = await personHis()
        console.log('getPerson')
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

exports.getPersonCA = async (req, res, next) => {

    try {
        const data = await personHisCA()
        console.log('getPersonCA')
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

exports.sendData = async (req, res, next) => {

    try {
        const cancerRes ={
            cid : req.body.cid,
            visit_date : req.body.visit_date,
            behaviour_code : req.body.behaviour_code,
            finance_support_code: req.body.finance_support_code,
            icd10_code : req.body.diagnosis_drg
        } 
        // console.log(req.body)
        if(req.body.area_code == '380410'){
            req.body.area_code = '380404'
            req.body.permanent_area_code = '380404'
        }
        if(!req.body.area_code){
            req.body.area_code = '999999'
            req.body.permanent_area_code = '999999'
        }
        // console.log(req.body)
        const result = await uploadData(req.body)
        // console.log(result.data)
        if(result.data.message === "DONE"){
            // console.log('person')
            const val = await updatePerson(req.body.person_id)
            // console.log('val',val)
            const cancerApi = await sendCancer(cancerRes)
            // console.log('cancer', cancerApi.data)
            
            if(cancerApi.data.message === "DONE"){
                const valCancer = await updatePersonCancer(req.body.person_id)
                // console.log(val)
                    return res.status(200).json({
                        message: 'success',
                        status: 'ok'
                    })
                }else{
                    return res.status(400).json({
                        message: 'success',
                        status: 'no_cancer'
                    })
                }
           
            
        }else{
            return res.status(200).json({
                message: 'success',
                status: 'not_person'
            })
        }

    } catch (error) {
        let err
        let errorText = []
        if(error.response){
            err = error.response.data
            if(err){
                Object.keys(err).map((val,index)=>{
                    errorText.push(`${Object.keys(err)[index]} : ${Object.values(err)[index]}`)
                })
                console.log(errorText.toString())
            }
        }
        res.status(400).json({
                message: 'error',
                data: errorText.toString()
        })
    }
}
