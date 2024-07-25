import { addSessionDetails, addUser, createAccount, createDepartment, createOrg, createProfile, createUserTables, deleteDept, deleteSessionDetails, getAccessibleDepartment, getAccessibleDeptList, getDepartment, getDeptList, getOrganizaitonByID, getProfile, getProfileList, getSessionDetails, getUser, getUserList, isAccesibleDeptList, isDuplicateModuleFound,  loginUser, updadteAccessibleDepartments, updateDept, updateOrg, updateUser } from "./databaseActions/userDetailAction.mjs";
import { ERROR_MESSAGES, INTERNAL_SERVER_ERROR, NOT_FOUND_STATUS, SUCCESS_MESSAGES, SUCCESS_STATUS, UNAUTHORIZED_ACCESS, convertResAsStr, parseFromLimit, selectn, sendResponse } from "./utils/commonUtil.mjs";
import { HR_IN_MS, MAX_SESSION_LIMIT, MAX_SESSION_TIME, getEncryptedPassword, getUpdateValues, getUserSessionDetails, isPasswordMatch } from "./utils/tableDetails.mjs";
import { isAllowedToAddDept, isAllowedToAddOrg, isAllowedToAddProfile, isAllowedToAddUser, isAllowedToDeleteDept, isAllowedToLogin, isAllowedToUpdateDept, isAllowedToUpdateOrg, isAllowedToUpdateUser, isAllowedToViewDept, isAllowedToViewProfile, isAllowedToViewUser } from "./authorizations/userAuthorization.mjs";
import useragent from "useragent";
export const createOrgAPI = async (req, res) =>{
    try{
        const { orgName } = req.body;
        const { userId, permissions } = getUserSessionDetails(req.session)
        await isAllowedToAddOrg(permissions)
        await isDuplicateModuleFound({moduleType: 'ORG', moduleName: orgName})
        await createOrg(orgName);
        return sendResponse(res,{status: SUCCESS_STATUS, 'message': SUCCESS_MESSAGES['ORG_CREATED']})
      }
      catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
      }
}
export const updateOrgAPI = async (req, res) =>{
    try{
        const { orgId } = req.params;
        const { userId, permissions } = getUserSessionDetails(req.session)
        await isAllowedToUpdateOrg(permissions);
        await updateOrg({orgId, values:getUpdateValues('ORG_UPDATE',req.body)});
        return sendResponse(res,{status: SUCCESS_STATUS, 'message': SUCCESS_MESSAGES['ORG_UPDATED']})
      }
      catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
      }
}
export const getOrgAPI = async (req, res) =>{
    try{
        const { orgId } = getUserSessionDetails(req.session);
        if(orgId != req.params.orgId){
            throw 'UNAUTHORIZED_ACCESS'
        }
        const orgDetails = await getOrganizaitonByID(orgId);
        console.log(orgDetails)
        req.session.orgObj = orgDetails;
        if(orgDetails){
            return sendResponse(res,{status: SUCCESS_STATUS,res:orgDetails})
        }
        throw 'NOT_FOUND_STATUS'
      }
      catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
      }
}
export const createUserTablesAPI = async (req, res) =>{ 
    try{
        // const { userId, permissions } = getUserSessionDetails(req.session)
        // await isAllowedToAddOrg(permissions);
        await createUserTables();
        sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['TABLE_CREATED']})
    }catch(e){
        console.log(e)
        sendResponse(res,{status: INTERNAL_SERVER_ERROR, 'message': SUCCESS_MESSAGES['TABLE_NOT_CREATED']});
    }
}
export const getUsersListAPI = async (req, res)=>{
    const { userId:requestingUserId, orgId, permissions } = getUserSessionDetails(req.session)
    const { from, to } = parseFromLimit(req.query)
    const { userId } = req.params;
    try{
        await isAllowedToViewUser(permissions);
        await isAllowedToGetUsersList(permissions);
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
    const { userId, orgId, permissions } = getUserSessionDetails(req.session)
    const { maxSessionTime:orgMaxSessionTime=MAX_SESSION_TIME, maxSessionLimit:orgMaxSessionLimit=MAX_SESSION_LIMIT } = getUserSessionDetails(req.session, 'org') || {};
    const { userName, name, password, maxSessionLimit=MAX_SESSION_LIMIT, maxSessionTime=MAX_SESSION_TIME, profileId } = req.body;
    try{
        await isAllowedToAddUser(permissions);
        if(maxSessionLimit > orgMaxSessionLimit){
            throw 'MAX_SESSION_LIMIT_ERROR'
        }
        if(maxSessionTime > orgMaxSessionTime){
            throw 'MAX_SESSION_TIME_ERROR'
        }
        const encrptedPassword = await getEncryptedPassword(password);
        await addUser({orgId, userName, name, password:encrptedPassword, profileId, maxSessionLimit, maxSessionTime})
        return sendResponse(res,{status: SUCCESS_STATUS, 'message': SUCCESS_MESSAGES['USER_ADDED']})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const updateUserAPI = async (req, res)=>{
    const { userId } = req.params;
    const { userId:requestingUserId, orgId, permissions } = getUserSessionDetails(req.session)
    const { password, maxSessionLimit, maxSessionTime } = req.body;
    const { maxSessionTime:orgMaxSessionTime, maxSessionLimit:orgMaxSessionLimit } = getUserSessionDetails(req.session, 'org');
    try{
        await isAllowedToUpdateUser(permissions);
        if(maxSessionLimit && maxSessionLimit > orgMaxSessionLimit){
            throw 'MAX_SESSION_LIMIT_ERROR'
        }
        if(maxSessionTime && maxSessionTime > orgMaxSessionTime){
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
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const createProfileAPI = async (req, res)=>{
    const { userId:requestingUserId, orgId, permissions:existPermissions } = getUserSessionDetails(req.session)
    const { profileName, permissions } = req.body;
    try{
        await isAllowedToAddProfile({orgId, permissions:existPermissions});
        await createProfile({orgId, profileName, permissions });
        return sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['PROFILE_CREATED']})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const getProfileListAPI = async (req, res)=>{
    const { userId, orgId, permissions } = getUserSessionDetails(req.session)
    const { from, to } = parseFromLimit(req.query)
    const { profileId } = req.params;
    try{
        await isAllowedToViewProfile(permissions);
        let result = [];
        if(profileId){
            result = await getProfile({orgId, profileId });
        }else{
            result = await getProfileList({orgId, from, to });
        }
        return sendResponse(res,{status: SUCCESS_STATUS, response:result})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const createDepartmentAPI = async (req, res)=>{
    const { userId, orgId, permissions } = getUserSessionDetails(req.session)
    const { departmentName } = req.body;
    try{
        await isAllowedToAddDept({orgId, permissions});
        await createDepartment({orgId, deptName:departmentName });
        return sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['DEPARTMENT_CREATED']})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const getDepartmentListAPI = async (req, res)=>{
    const { userId, orgId, permissions } = getUserSessionDetails(req.session)
    const { from, to } = parseFromLimit(req.query)
    const { departmentId } = req.params;
    try{
        await isAllowedToViewDept(permissions);
        let result = [];
        if(departmentId){
            result = await getDepartment({orgId, deptId:departmentId });
        }else{
            result = await getDeptList({orgId, from, to });
        }
        return sendResponse(res,{status: SUCCESS_STATUS, response:result})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const updateDepartmentAPI = async (req,res) =>{
    const { userId, orgId, permissions } = getUserSessionDetails(req.session)
    const { departmentId } = req.params;
    try{
        await isAllowedToUpdateDept(permissions);
        const values = getUpdateValues('DEPT_UPDATE',req.body)
        const result = await updateDept({deptId:departmentId, values });
        return sendResponse(res,{status: SUCCESS_STATUS, response:result})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const deleteDepartmentAPI = async (req, res)=>{
    const { userId, orgId, permissions } = getUserSessionDetails(req.session)
    const { departmentId } = req.params;
    try{
        await isAllowedToDeleteDept(permissions);
        const result = await deleteDept({deptId:departmentId});
        return sendResponse(res,{status: SUCCESS_STATUS, response:result})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const getAccessibleDeptListAPI = async (req, res)=>{
    const { userId, orgId } = getUserSessionDetails(req.session)
    const { from, to } = parseFromLimit(req.query)
    const { departmentId } = req.params;
    try{
        let result = [];
        if(departmentId){
            result = await getAccessibleDepartment({userId, deptId:departmentId });
        }else{
            result = await getAccessibleDeptList({from, to, userId });
        }
        return sendResponse(res,{status: SUCCESS_STATUS, response:result})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}

export const updateDeptToUser = async (req, res)=>{
    const { userId, orgId, permissions } = getUserSessionDetails(req.session)
    const { accessDeptIds, revokeDeptIds } = req.body;
    try{
        await isAllowedToUpdateUser(permissions);
        const uniqueDeptIds = [...new Set(accessDeptIds), ...new Set(revokeDeptIds)];
        const isAccesibleDeptObj = await isAccesibleDeptList({userId, deptList:uniqueDeptIds.join(',')})
        const existingDeptIds = [...new Set(isAccesibleDeptObj.map(obj => obj.deptID))];
        const revokeDeptList = existingDeptIds.filter(id=>revokeDeptIds.includes(id));
        const missingDeptIds = accessDeptIds.filter(deptId => !existingDeptIds.includes(deptId));
        await updadteAccessibleDepartments({userId, revokeDeptIds:revokeDeptList.join(','), addDeptIds:missingDeptIds.map(deptId=>`(${userId},${deptId})`)})
        return sendResponse(res,{status: SUCCESS_STATUS, message:SUCCESS_MESSAGES['DEPT_ACCESS_GRANTED']})
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
        maxSessionLimit=MAX_SESSION_LIMIT,
        maxSessionTime=MAX_SESSION_TIME,
    } = req.body;
    // const { userId, permissions } = getUserSessionDetails(req.session)
    try{
        // await isAllowedToAddOrg(permissions);
        const encrptedPassword = await getEncryptedPassword(password)
        await isDuplicateModuleFound({moduleType:"ORG", moduleName: orgName});
        await isDuplicateModuleFound({moduleType:"USER", moduleName: userName});
        await createAccount({...req.body,password: encrptedPassword})
        return sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES.ACCOUNT_CREATED})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const addSessionDetailsAPI = async (req, userId)=>{
    const userAgent = req.headers['user-agent'];
    return await addSessionDetails({userId, userAgent });
}
export const getSessionDetailsAPI = async (req, res)=>{
    try{
        const { userId:requestingUserId, permissions } = getUserSessionDetails(req.session);
        const { userId } = req.params;
        await isAllowedToViewUser(permissions);
        const result = await getSessionDetails({userId });
        return sendResponse(res,{status:SUCCESS_STATUS, response:result})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const deleteSessionDetailsAPI = async (req, res)=>{
    try{
        const { userId, permissions, orgId } = getUserSessionDetails(req.session);
        const { sessionId } = req.params;
        await isAllowedToUpdateUser(permissions);
        await deleteSessions(req,sessionId, orgId)
        await deleteSessionDetails({sessionId });
        return sendResponse(res,{status:SUCCESS_STATUS, message:SUCCESS_MESSAGES['SESSION_DELETED']})
    }catch(error){
        console.log(error)
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
        const isAuthorized = isPasswordMatch(password, userDetails.password);
        const { ID:id, name, orgID:orgId, maxSessionLimit, maxSessionTime, userProfileID:profileId } = userDetails;
        await isAllowedToLogin(id, maxSessionLimit)
        if(isAuthorized){
            const sessionId = await addSessionDetailsAPI(req,id);
            const { permissions } = await getProfile({orgId, profileId });
            req.session['userObj'] = {
                userId:Number(id), 
                orgId: Number(orgId), 
                sessionId:Number(sessionId),
                maxSessionTime,
                createdAt: Date.now(),
                permissions
            }
            return sendResponse(res,{status: SUCCESS_STATUS, response: {id, name, orgId, profileId, permissions}})
        }
        return sendResponse(res,ERROR_MESSAGES['UNAUTHORIZED_ACCESS'])
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const logout = async (req, res) =>{
    try{
        const { sessionId } = getUserSessionDetails(req.session);
        await deleteSessionDetails({sessionId });
        req.session.destroy(err => {
            if (err) {
              throw 'INTERNAL_SERVER_ERROR'
            }
            return sendResponse(res,{status: SUCCESS_STATUS, message:SUCCESS_MESSAGES['LOGOUT_SUCCESS']})
          });
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }

}

export const beforeAllAPI = async (req, res, next) =>{
    if(req.session.userObj || req.path == '/login' || req.path == '/createUserTables' || req.path == '/createAccount'){
        const { createdAt, maxSessionTime } = selectn(`session.userObj`,req) || {};
        if(createdAt && createdAt + (maxSessionTime * HR_IN_MS) <= Date.now()){
            return await logout()
        }
        return next();
    }else{
        return sendResponse(res,ERROR_MESSAGES['UNAUTHORIZED_ACCESS'])
    }
}

const deleteSessions = async (req,sessionId, orgId)=>{
    const sessionObj = selectn(`sessionStore.sessions`,req);
    const sessionArr = Object.keys(sessionObj);
    for(let i=0;i<sessionArr.length;i++){
        const { userObj, cookie } = JSON.parse(sessionObj[sessionArr[i]]);
        if(userObj.sessionId == sessionId){
            if(userObj.orgId != orgId){
                throw 'UNAUTHORIZED_ACCESS'
            }
            await req.sessionStore.destroy(sessionArr[i])
            break;
        }
    }
}