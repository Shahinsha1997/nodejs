import { createAccount, createDepartment, createOrg, createProfile, createUserTables, getAccessibleDepartment, getAccessibleDeptList, getDepartment, getDeptList, getProfileList, getUser, getUserList, isDuplicateModuleFound,  loginUser } from "./databaseActions/userDetailAction.mjs";
import { ERROR_MESSAGES, INTERNAL_SERVER_ERROR, SUCCESS_MESSAGES, SUCCESS_STATUS, convertResAsStr, parseFromLimit, sendResponse } from "./utils/commonUtil.mjs";
import bcrypt from 'bcrypt'
import { MAX_SESSION_LIMIT, MAX_SESSION_TIME } from "./utils/tableDetails.mjs";
import { isAllowedToCreateDept, isAllowedToGetProfileList, isAllowedToGetUsersList } from "./authorizations/userAuthorization.mjs";
const saltRounds = 10;
export const createOrgAPI = async (req, res) =>{
    try{
        const { orgName } = req.body;
        await isDuplicateModuleFound({moduleType: 'ORG', moduleName: orgName})
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
export const getUsersListAPI = async (req, res)=>{
    const { userId:requestingUserId, orgid:orgId } = req.headers;
    const { from, to } = parseFromLimit(req.query)
    const { userId } = req.params;
    try{
        await isAllowedToGetUsersList(requestingUserId);
        let result = [];
        if(userId){
            result = await getUser({orgId, userId });
        }else{
            result = await getUserList({orgId, from, to });
        }
        sendResponse(res,{status: SUCCESS_STATUS, response:result})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}

export const createProfileAPI = async (req, res)=>{
    const { orgId, profileName, permissions } = req.body;
    try{
        await createProfile({orgId, profileName, permissions });
        sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['PROFILE_CREATED']})
    }catch(e){
        console.log(e)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const getProfileListAPI = async (req, res)=>{
    const { userId, orgid:orgId } = req.headers;
    const { from, to } = parseFromLimit(req.query)
    const { profileId } = req.params;
    try{
        await isAllowedToGetProfileList(userId);
        let result = [];
        if(profileId){
            result = await getProfile({orgId, profileId });
        }else{
            result = await getProfileList({orgId, from, to });
        }
        sendResponse(res,{status: SUCCESS_STATUS, response:result})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const createDepartmentAPI = async (req, res)=>{
    const { orgId, deptName, userId } = req.body;
    try{
        // await isAllowedToCreateDept(userId); Not completed Fully
        await createDepartment({orgId, deptName });
        sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['PROFILE_CREATED']})
    }catch(e){
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const getDepartmentListAPI = async (req, res)=>{
    const { userId, orgid:orgId } = req.headers;
    const { from, to } = parseFromLimit(req.query)
    const { departmentId } = req.params;
    try{
        await isAllowedToGetProfileList(userId);
        let result = [];
        if(departmentId){
            result = await getDepartment({orgId, deptId:departmentId });
        }else{
            result = await getDeptList({orgId, from, to });
        }
        sendResponse(res,{status: SUCCESS_STATUS, response:result})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}

export const getAccessibleDeptListAPI = async (req, res)=>{
    const { userId, orgid:orgId } = req.headers;
    const { from, to } = parseFromLimit(req.query)
    const { departmentId } = req.params;
    try{
        await isAllowedToGetProfileList(userId);
        let result = [];
        if(departmentId){
            result = await getAccessibleDepartment({userId, deptId:departmentId });
        }else{
            result = await getAccessibleDeptList({orgId, from, to });
        }
        sendResponse(res,{status: SUCCESS_STATUS, response:result})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}


export const createAccountAPI = async (req, res)=>{
    const { 
        orgName, 
        password,
        userName,
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
            await isDuplicateModuleFound({moduleType:"ORG", moduleName: orgName});
            await isDuplicateModuleFound({moduleType:"USER", moduleName: userName});
            await createAccount({...req.body,password: encrptedPassword})
            return sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES.ACCOUNT_CREATED})
        });
    }catch(error){
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}

export const login = async (req, res)=>{
    const { 
        userName, 
        password,
    } = req.body;
    try{
        const userDetails = await loginUser(userName);
        bcrypt.compare(password, userDetails.password, (err, isMatch) => {
            if(err){
                console.log(err);
                throw "INTERNAL_SERVER_ERROR"
            }
            if (isMatch) {
                delete userDetails.password
                return sendResponse(res,{status: SUCCESS_STATUS, response: userDetails})
            } else {
                return sendResponse(res,ERROR_MESSAGES['UNAUTHORIZED_ACCESS'])
            }
          });
    }catch(error){
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}