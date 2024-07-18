import { createAccount, createOrg, createProfile, createUserTables, isOrgPresent } from "./databaseActions/userDetailAction.mjs";
import { ERROR_MESSAGES, INTERNAL_SERVER_ERROR, SUCCESS_MESSAGES, SUCCESS_STATUS, sendResponse } from "./utils/commonUtil.mjs";
import bcrypt from 'bcrypt'
import { MAX_SESSION_LIMIT, MAX_SESSION_TIME } from "./utils/tableDetails.mjs";
const saltRounds = 10;
export const createOrgAPI = async (req, res) =>{
    try{
        const { orgName } = req.body;
        await isOrgPresent(orgName)
        await createOrg(orgName);
        return sendResponse(res,{status: SUCCESS_STATUS, 'message': SUCCESS_MESSAGES['ORG_CREATED']})
      }
      catch(error){
        return sendResponse(res,ERROR_MESSAGES[error])
      }
}

export const createUserTablesAPI = async (req, res) =>{ 
    try{
        await createUserTables();
        sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['TABLE_CREATED']})
    }catch(e){
        console.log(e)
        sendResponse(res,{status: INTERNAL_SERVER_ERROR, 'message': SUCCESS_MESSAGES['TABLE_NOT_CREATED']});
    }
}

export const createProfileAPI = async (req, res)=>{
    const { orgId, profileName, permissions } = req.body;
    try{
        await createProfile({orgId, profileName, permissions });
        sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['PROFILE_CREATED']})
    }catch(e){
        console.log(e)
        sendResponse(res,{status: INTERNAL_SERVER_ERROR, 'message': SUCCESS_MESSAGES['PROFILE_NOT_CREATED']});
    }
}

export const createAccountAPI = async (req, res)=>{
    const { 
        orgName, 
        password,
        maxSessionLimit,
        maxSessionTime,
    } = req.body;
    try{
        if(maxSessionLimit > MAX_SESSION_LIMIT){
            throw 'MAX_SESSION_LIMIT_ERROR'
        }
        if(maxSessionTime > MAX_SESSION_TIME){
            throw 'MAX_SESSION_TIME_ERROR'
        }
        bcrypt.hash(password, saltRounds, async (err, encrptedPassword) => {
            if(err){
                console.log(err);
                throw "INTERNAL_SERVER_ERROR"
            }
            await isOrgPresent(orgName);
            await createAccount({...req.body,password: encrptedPassword})
            return sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES.ACCOUNT_CREATED})
        });
    }catch(error){
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}