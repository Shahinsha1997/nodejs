import { addSessionDetails, addUser, createAccount, createDepartment, createOrg, createProfile, createUserTables, deleteDept, getAccessibleDepartment, getAccessibleDeptList, getDepartment, getDeptList, getProfileList, getUser, getUserList, isAccesibleDeptList, isDuplicateModuleFound,  loginUser, updadteAccessibleDepartments, updateDept, updateOrg, updateUser } from "./databaseActions/userDetailAction.mjs";
import { ERROR_MESSAGES, INTERNAL_SERVER_ERROR, SUCCESS_MESSAGES, SUCCESS_STATUS, convertResAsStr, parseFromLimit, sendResponse } from "./utils/commonUtil.mjs";
import { MAX_SESSION_LIMIT, MAX_SESSION_TIME, getEncryptedPassword, getUpdateValues, isPasswordMatch } from "./utils/tableDetails.mjs";
import { isAllowedToCreateDept, isAllowedToDeleteDept, isAllowedToGetProfileList, isAllowedToGetUsersList, isAllowedToUpdateDept } from "./authorizations/userAuthorization.mjs";
import useragent from "useragent";
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
export const updateeOrgAPI = async (req, res) =>{
    try{
        const { orgId } = req.params;
        await updateOrg({orgId, values:getUpdateValues('ORG_UPDATE',req.body)});
        return sendResponse(res,{status: SUCCESS_STATUS, 'message': SUCCESS_MESSAGES['ORG_UPDATED']})
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
export const addUserAPI = async (req, res)=>{
    const { userId, orgid:orgId } = req.headers;
    const { userName, name, password, maxSessionLimit, maxSessionTime, profileId } = req.body;
    try{
        if(maxSessionLimit > MAX_SESSION_LIMIT){
            throw 'MAX_SESSION_LIMIT_ERROR'
        }
        if(maxSessionTime > MAX_SESSION_TIME){
            throw 'MAX_SESSION_TIME_ERROR'
        }
        const encrptedPassword = await getEncryptedPassword(password);
        await addUser({orgId, userName, name, password:encrptedPassword, profileId, maxSessionLimit, maxSessionTime})
    }catch(error){
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const updateUserAPI = async (req, res)=>{
    const { userId } = req.params;
    const { password, maxSessionLimit, maxSessionTime } = req.body;
    try{
        if(maxSessionLimit && maxSessionLimit > MAX_SESSION_LIMIT){
            throw 'MAX_SESSION_LIMIT_ERROR'
        }
        if(maxSessionTime && maxSessionTime > MAX_SESSION_TIME){
            throw 'MAX_SESSION_TIME_ERROR'
        }
        let encrptedPassword = '';
        if(password){
            encrptedPassword = await getEncryptedPassword(password)
        }
        const values = encrptedPassword ? `password=${encrptedPassword},`: ''
        await updateUser({userId, values:values+getUpdateValues('USER_UPDATE',req.body)});
        return sendResponse(res,{status: SUCCESS_STATUS, 'message': SUCCESS_MESSAGES['USER_UPDATED']})
    }catch(error){
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const createProfileAPI = async (req, res)=>{
    const { orgId, profileName, permissions } = req.body;
    try{
        await createProfile({orgId, profileName, permissions });
        sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['PROFILE_CREATED']})
    }catch(error){
        console.log(error)
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
    const { orgid:orgId } =req.headers;
    const { departmentName, userId } = req.body;
    try{
        // await isAllowedToCreateDept(userId); Not completed Fully
        await createDepartment({orgId, deptName:departmentName });
        sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['DEPARTMENT_CREATED']})
    }catch(error){
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const getDepartmentListAPI = async (req, res)=>{
    const { userId, orgid:orgId } = req.headers;
    const { from, to } = parseFromLimit(req.query)
    const { departmentId } = req.params;
    try{
        await isAllowedToUpdateDept(userId);
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
export const updateDepartmentAPI = async (req,res) =>{
    const { userId, orgid:orgId } = req.headers;
    const { departmentId } = req.params;
    try{
        await isAllowedToUpdateDept(userId);
        const values = getUpdateValues('DEPT_UPDATE',req.body)
        const result = await updateDept({deptId:departmentId, values });
        sendResponse(res,{status: SUCCESS_STATUS, response:result})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const deleteDepartmentAPI = async (req, res)=>{
    const { userId, orgid:orgId } = req.headers;
    const { departmentId } = req.params;
    try{
        await isAllowedToDeleteDept(userId);
        const result = await deleteDept({deptId:departmentId});
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
            result = await getAccessibleDeptList({from, to, userId });
        }
        sendResponse(res,{status: SUCCESS_STATUS, response:result})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}

export const updateDeptToUser = async (req, res)=>{
    const { userid:userId, orgid:orgId } = req.headers;
    const { accessDeptIds, revokeDeptIds } = req.body;
    try{
        const uniqueDeptIds = [...new Set(accessDeptIds), ...new Set(revokeDeptIds)];
        const isAccesibleDeptObj = await isAccesibleDeptList({userId, deptList:uniqueDeptIds.join(',')})
        const existingDeptIds = [...new Set(isAccesibleDeptObj.map(obj => obj.deptID))];
        const revokeDeptList = existingDeptIds.filter(id=>revokeDeptIds.includes(id));
        const missingDeptIds = accessDeptIds.filter(deptId => !existingDeptIds.includes(deptId));
        await updadteAccessibleDepartments({userId, revokeDeptIds:revokeDeptList.join(','), addDeptIds:missingDeptIds.map(deptId=>`(${userId},${deptId})`)})
        sendResponse(res,{status: SUCCESS_STATUS, message:SUCCESS_MESSAGES['DEPT_ACCESS_GRANTED']})
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
        const encrptedPassword = await getEncryptedPassword(password)
        await isDuplicateModuleFound({moduleType:"ORG", moduleName: orgName});
        await isDuplicateModuleFound({moduleType:"USER", moduleName: userName});
        await createAccount({...req.body,password: encrptedPassword})
        return sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES.ACCOUNT_CREATED})
    }catch(error){
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const addSessionDetailsAPI = async (req, userId)=>{
    const userAgent = req.headers['user-agent'];
    await addSessionDetails({userId, userAgent });
}
export const login = async (req, res)=>{
    const { 
        userName, 
        password,
    } = req.body;
    try{
        const userDetails = await loginUser(userName);
        const isAuthorized = isPasswordMatch(password, userDetails.password);
        if(isAuthorized) {
            const { ID, name, orgID } = userDetails;
            addSessionDetailsAPI(req,ID);
            return sendResponse(res,{status: SUCCESS_STATUS, response: {id:ID, name, orgId: orgID}})
        }
        return sendResponse(res,ERROR_MESSAGES['UNAUTHORIZED_ACCESS'])
    }catch(error){
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}