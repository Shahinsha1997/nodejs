import { addSessionDetails, addUser, createAccount, createDepartment, createOrg, createProfile, createUserTables, deleteDept, deleteProfile, deleteSessionDetails, deleteUser, getAccessibleDepartment, getAccessibleDeptList, getAllSessionDetails, getDepartment, getDeptList, getOrganizaitonByID, getProfile, getProfileList, getSessionDetails, getUser, getUserList, isAccesibleDeptList, isDuplicateModuleFound,  loginUser, updadteAccessibleDepartments, updateDept, updateOrg, updateProfile, updateUser } from "./databaseActions/userDetailAction.mjs";
import { ERROR_MESSAGES, INTERNAL_SERVER_ERROR, NOT_FOUND_STATUS, SUCCESS_MESSAGES, SUCCESS_STATUS, UNAUTHORIZED_ACCESS, convertResAsStr, parseFromLimit, selectn, sendResponse, structureDeptObj, structureOrgObj, structureProfileObj, structureSessionObj, structureUserObj } from "./utils/commonUtil.mjs";
import { HR_IN_MS, MAX_SESSION_LIMIT, MAX_SESSION_TIME, PER_DAY_IN_MS, getEncryptedPassword, getUpdateValues, getUserSessionDetails, isPasswordMatch } from "./utils/tableDetails.mjs";
import { isAllowedToAddDept, isAllowedToAddOrg, isAllowedToAddProfile, isAllowedToAddUser, isAllowedToDeleteDept, isAllowedToDeleteProfile, isAllowedToDeleteUser, isAllowedToLogin, isAllowedToUpdateDept, isAllowedToUpdateOrg, isAllowedToUpdateProfile, isAllowedToUpdateUser, isAllowedToViewDept, isAllowedToViewProfile, isAllowedToViewUser } from "./authorizations/userAuthorization.mjs";
import useragent from "useragent";
export const createOrgAPI = async (req, res) =>{
    try{
        const { orgName } = req.body;
        const { userId, permissions } = getUserSessionDetails(req)
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
        const { userId, permissions } = getUserSessionDetails(req)
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
        const { orgId } = getUserSessionDetails(req);
        if(orgId != req.params.orgId){
            throw 'UNAUTHORIZED_ACCESS'
        }
        const orgDetails = await getOrganizaitonByID(orgId);
        req.session.orgObj = orgDetails;
        if(orgDetails){
            return sendResponse(res,{status: SUCCESS_STATUS,response:structureOrgObj([orgDetails])})
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
        // const { userId, permissions } = getUserSessionDetails(req)
        // await isAllowedToAddOrg(permissions);
        await createUserTables();
        sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['TABLE_CREATED']})
    }catch(e){
        console.log(e)
        sendResponse(res,{status: INTERNAL_SERVER_ERROR, 'message': SUCCESS_MESSAGES['TABLE_NOT_CREATED']});
    }
}
export const getUsersListAPI = async (req, res)=>{
    const { userId:requestingUserId, orgId, permissions } = getUserSessionDetails(req)
    const { from, to } = parseFromLimit(req.query)
    const { userId } = req.params;
    try{
        await isAllowedToViewUser(permissions);
        let result = [];
        if(userId){
            result = await getUser({orgId, userId });
        }else{
            result = await getUserList({orgId, from, to });
        }
        sendResponse(res,{status: SUCCESS_STATUS, response:structureUserObj(result)})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const addUserAPI = async (req, res)=>{
    const { userId, orgId, permissions } = getUserSessionDetails(req);
    const orgObj = getUserSessionDetails(req, 'org')
    const { maxSessionTime:orgMaxSessionTime=MAX_SESSION_TIME, maxSessionLimit:orgMaxSessionLimit=MAX_SESSION_LIMIT } = getUserSessionDetails(req, 'org') || {};
    const { userName, name, password, maxSessionLimit=MAX_SESSION_LIMIT, maxSessionTime=MAX_SESSION_TIME, profileId } = req.body;
    try{
        await isAllowedToAddUser({orgId, permissions, orgObj});
        if(maxSessionLimit > orgMaxSessionLimit){
            throw 'MAX_SESSION_LIMIT_ERROR'
        }
        if(maxSessionTime > orgMaxSessionTime){
            throw 'MAX_SESSION_TIME_ERROR'
        }
        await isDuplicateModuleFound({moduleType:"USER", moduleName: userName});
        const encrptedPassword = await getEncryptedPassword(password);
        const id = await addUser({orgId, userName, name, password:encrptedPassword, profileId, maxSessionLimit, maxSessionTime})
        return sendResponse(res,{status: SUCCESS_STATUS, 'message': SUCCESS_MESSAGES['USER_ADDED'], id:Number(id)})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const updateUserAPI = async (req, res)=>{
    const { userId } = req.params;
    const { userId:requestingUserId, orgId, permissions } = getUserSessionDetails(req)
    const { password, maxSessionLimit, maxSessionTime } = req.body;
    const { maxSessionTime:orgMaxSessionTime, maxSessionLimit:orgMaxSessionLimit } = getUserSessionDetails(req, 'org');
    try{
        const { userName } = req.body;
        await isAllowedToUpdateUser(permissions);
        if(maxSessionLimit && maxSessionLimit > orgMaxSessionLimit){
            throw 'MAX_SESSION_LIMIT_ERROR'
        }
        if(maxSessionTime && maxSessionTime > orgMaxSessionTime){
            throw 'MAX_SESSION_TIME_ERROR'
        }
        await isDuplicateModuleFound({moduleType:"USER", moduleName: userName});
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
export const deleteUserAPI = async (req, res)=>{
    const { orgId, permissions } = getUserSessionDetails(req)
    const { userId } = req.params;
    try{
        await isAllowedToDeleteUser((permissions));
        await deleteUser({userId});
        return sendResponse(res,{status: SUCCESS_STATUS, message:SUCCESS_MESSAGES['USER_DELETED']})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const createProfileAPI = async (req, res)=>{
    const { userId:requestingUserId, orgId, permissions:existPermissions } = getUserSessionDetails(req)
    const { profileName, permissions } = req.body;
    const orgObj = getUserSessionDetails(req,'org')
    try{
        await isAllowedToAddProfile({orgId, permissions:existPermissions,orgObj});
        const id = await createProfile({orgId, profileName, permissions });
        return sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['PROFILE_CREATED'], id:Number(id)})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const updateProfileAPI = async (req, res)=>{
    const { userId:requestingUserId, orgId, permissions:existPermissions } = getUserSessionDetails(req)
    const orgObj = getUserSessionDetails(req,'org')
    const { profileId } = req.params;
    try{
        await isAllowedToUpdateProfile({orgId, permissions:existPermissions,orgObj})
        const values = getUpdateValues('PROFILE_UPDATE',req.body)
        await updateProfile({id:profileId, values });
        return sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['PROFILE_UPDATED']})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const getProfileListAPI = async (req, res)=>{
    const { userId, orgId, permissions, profileId:userProfileId } = getUserSessionDetails(req)
    const { from, to } = parseFromLimit(req.query)
    const { profileId } = req.params;
    try{
        userProfileId != profileId && await isAllowedToViewProfile(permissions);
        let result = [];
        if(profileId){
            result = await getProfile({orgId, profileId });
            const userObj = selectn('session.userObj',req) || {};
            userObj.permissions = result.permissions;
        }else{
            result = await getProfileList({orgId, from, to });
        }
        return sendResponse(res,{status: SUCCESS_STATUS, response:structureProfileObj(result)})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const deleteProfileAPI = async (req, res)=>{
    const { userId, orgId, permissions } = getUserSessionDetails(req)
    const { profileId } = req.params;
    try{
        await isAllowedToDeleteProfile(permissions);
        const result = await deleteProfile({profileId});
        return sendResponse(res,{status: SUCCESS_STATUS, response:result})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const createDepartmentAPI = async (req, res)=>{
    const { userId, orgId, permissions } = getUserSessionDetails(req)
    const orgObj = getUserSessionDetails(req,'org')
    const { deptName, isDisabled } = req.body;
    try{
        await isAllowedToAddDept({orgId, permissions,orgObj});
        const id =await createDepartment({orgId, deptName:deptName, isDisabled });
        return sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['DEPARTMENT_CREATED'], id:Number(id)})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const getDepartmentListAPI = async (req, res)=>{
    const { userId, orgId, permissions } = getUserSessionDetails(req)
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
        return sendResponse(res,{status: SUCCESS_STATUS, response:structureDeptObj(result)})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const updateDepartmentAPI = async (req,res) =>{
    const { userId, orgId, permissions } = getUserSessionDetails(req)
    const { departmentId } = req.params;
    try{
        await isAllowedToUpdateDept(permissions);
        const values = getUpdateValues('DEPT_UPDATE',req.body)
        await updateDept({deptId:departmentId, values });
        return sendResponse(res,{status: SUCCESS_STATUS, message:SUCCESS_MESSAGES['DEPARTMENT_UPDATED']})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const deleteDepartmentAPI = async (req, res)=>{
    const { userId, orgId, permissions } = getUserSessionDetails(req)
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
    const { userId, orgId } = getUserSessionDetails(req)
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
    const { userId, orgId, permissions } = getUserSessionDetails(req)
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
    // const { userId, permissions } = getUserSessionDetails(req)
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
        const { userId:requestingUserId, permissions, orgId } = getUserSessionDetails(req);
        const { userId } = req.params;
        await isAllowedToViewUser(permissions);
        let result = [];
        const { from, to } = parseFromLimit(req.query)
        if(userId){
            result = await getSessionDetails({userId });
        }else{
            result = await getAllSessionDetails({orgId, from , to});
        }
        return sendResponse(res,{status:SUCCESS_STATUS, response:structureSessionObj(result)})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const deleteSessionDetailsAPI = async (req, res)=>{
    try{
        const { userId, permissions, orgId } = getUserSessionDetails(req);
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
            const profile = await getProfile({orgId, profileId });
            const [{permissions}] = structureProfileObj(profile)
            req.session['userObj'] = {
                userId:Number(id), 
                orgId: Number(orgId), 
                sessionId:Number(sessionId),
                maxSessionTime,
                createdAt: Date.now(),
                permissions
            };
            return sendResponse(res,{status: SUCCESS_STATUS, sessionId:req.sessionID,response: {id, name, orgId, profileId, permissions}})
        }
        return sendResponse(res,ERROR_MESSAGES['UNAUTHORIZED_ACCESS'])
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const logout = async (req, res) =>{
    try{
        const userObj =  getUserSessionDetails(req);
        const { sessionId } = getUserSessionDetails(req);
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
    const sessionObj = getUserSessionDetails(req);
    const userObj = sessionObj
    if(userObj || req.path == '/login' || req.path == '/createUserTables' || req.path == '/createAccount'){
        const { createdAt, maxSessionTime } = userObj || {};
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
        const { userObj } = JSON.parse(sessionObj[sessionArr[i]]);
        if(userObj.sessionId == sessionId){
            if(userObj.orgId != orgId){
                throw 'UNAUTHORIZED_ACCESS'
            }
            await req.sessionStore.destroy(sessionArr[i])
            break;
        }
    }
}