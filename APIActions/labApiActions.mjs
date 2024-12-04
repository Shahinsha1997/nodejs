import { createDocRecord, createLabRecord, createTestRecord, deleteLabRecord, deleteTestRecord, getDBUsageStat, getDocRecordList, getDueAlarmDatas, getLabDashboard, getLabRecord, getLabRecordList, getProfitByDoc, getTestRecordList, updateLabRecord, updateTestRecord } from "../databaseActions/labDetailAction.mjs";
import { ERROR_MESSAGES, SUCCESS_MESSAGES, SUCCESS_STATUS, getNeededDatas, parseFromLimit, sendResponse, structureDashboardObj, structureDocObj, structureLabObj, structureTestObj, structureUsageObj } from "../utils/commonUtil.mjs";
import { getUpdateValues } from "../utils/tableDetails.mjs";

let testDatas = ''
const adminId = '1714472831071'
const isAdminUser = (req)=>{
    const { userId } = req.query;
    const isAdmin = userId == adminId
    if(!isAdmin){
        throw 'UNAUTHORIZED_ACCESS'
    }
    return true;
}
export const createLabRecordAPI = async (req, res)=>{
    // const { userId:requestingUserId, orgId, permissions:existPermissions } = getUserSessionDetails(req)
    // const { profileName, permissions } = req.body;
    // const orgObj = getUserSessionDetails(req,'org')
    const { isNewDr, drName } = req.body;
    try{
        if(isNewDr){
           await createDocRecord(drName);
        }
        // await isAllowedToAddProfile({orgId, permissions:existPermissions,orgObj});
        // await isMovieExist(movie_id)
        const id = await createLabRecord(getNeededDatas('LAB_CREATE',req.body));
        return sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['RECORD_CREATED'], id:Number(id)})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const updateLabRecordAPI = async (req, res)=>{
    // const { userId:requestingUserId, orgId, permissions:existPermissions } = getUserSessionDetails(req)
    // const orgObj = getUserSessionDetails(req,'org')
    const { recordId } = req.params;
    try{
        // await isAllowedToUpdateProfile({orgId, permissions:existPermissions,orgObj})
        const values = getUpdateValues('LAB_UPDATE',getNeededDatas('LAB_UPDATE',req.body))
        await updateLabRecord({id:recordId, values });
        return sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['RECORD_UPDATED']})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const getLabRecordListAPI = async (req, res)=>{
    // const { userId, orgId, permissions, profileId:userProfileId } = getUserSessionDetails(req)
    const { from, to, sortField='ID', searchField='', sortOrder='DESC', searchStr='', timeFrom, timeTo } = parseFromLimit(req.query);
    const { userId } = req.query;
    const isAdmin = userId == adminId
    const { recordId } = req.params;
    try{
        // userProfileId != profileId && await isAllowedToViewProfile(permissions);
        let result = [];
        if(recordId){
            result = await getLabRecord(recordId,isAdmin);
        }else{
            result = await getLabRecordList({searchField, timeFrom, timeTo, sortField, sortOrder: sortOrder, from, to, searchStr, isAdmin });
        }
        return sendResponse(res,{status: SUCCESS_STATUS, response:structureLabObj(result)})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const getDueAlarmAPI = async (req, res)=>{
    // const { userId, orgId, permissions, profileId:userProfileId } = getUserSessionDetails(req)
    const { from, to, sortField='ID', searchField='', sortOrder='DESC', searchStr='', timeFrom, timeTo } = parseFromLimit(req.query);
    try{
        // userProfileId != profileId && await isAllowedToViewProfile(permissions);
        let result = [];
        // if(recordId){
        //     result = await getMovie(recordId);
            // const userObj = selectn('session.userObj',req) || {};
            // userObj.permissions = result.permissions;
        // }else{

            result = await getDueAlarmDatas(from);
        // }
        return sendResponse(res,{status: SUCCESS_STATUS, response:structureLabObj(result)})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}

export const getProfitByDocAPI = async (req, res)=>{
    // const { userId, orgId, permissions, profileId:userProfileId } = getUserSessionDetails(req)
    const { from, to, sortField='ID', sortOrder='DESC', searchStr='', timeFrom, timeTo } = parseFromLimit(req.query)
    try{
        isAdminUser(req);
        // userProfileId != profileId && await isAllowedToViewProfile(permissions);
        let result = [];
        // if(recordId){
        //     result = await getMovie(recordId);
            // const userObj = selectn('session.userObj',req) || {};
            // userObj.permissions = result.permissions;
        // }else{
            result = await getProfitByDoc({timeFrom, timeTo, from });
        // }
        return sendResponse(res,{status: SUCCESS_STATUS, response:structureLabObj(result)})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}

export const deleteLabRecordAPI = async (req, res)=>{
    // const { userId, orgId, permissions } = getUserSessionDetails(req)
    const { recordId } = req.params
    try{
        isAdminUser(req);
        // await isAllowedToDeleteProfile(permissions);
        const result = await deleteLabRecord(recordId);
        return sendResponse(res,{status: SUCCESS_STATUS, response:result})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}

export const getDashboardAPI = async (req, res)=>{
    // const { userId, orgId, permissions, profileId:userProfileId } = getUserSessionDetails(req)
    const { from, to, sortField='ID', sortOrder='DESC', searchStr='', timeFrom, timeTo } = parseFromLimit(req.query);
    const { recordId } = req.params;
    const { userId } = req.query;
    const isAdmin = userId == adminId
    try{
        // userProfileId != profileId && await isAllowedToViewProfile(permissions);
        let result = [];
        // if(recordId){
        //     result = await getMovie(recordId);
            // const userObj = selectn('session.userObj',req) || {};
            // userObj.permissions = result.permissions;
        // }else{
            result = await getLabDashboard({timeFrom, timeTo, isAdmin });
        // }
        return sendResponse(res,{status: SUCCESS_STATUS, response:structureDashboardObj(result)})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const getDBUsageStatsAPI = async (req, res)=>{
    try{
        isAdminUser(req);
        const result = await getDBUsageStat();
        return sendResponse(res,{status: SUCCESS_STATUS, response:structureUsageObj(result)});
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}

export const createDocRecordAPI = async (req, res)=>{
    // const { userId:requestingUserId, orgId, permissions:existPermissions } = getUserSessionDetails(req)
    // const { profileName, permissions } = req.body;
    // const orgObj = getUserSessionDetails(req,'org')
    const { drName } = req.body;
    try{
        // await isAllowedToAddProfile({orgId, permissions:existPermissions,orgObj});
        // await isMovieExist(movie_id)
        const id = await createDocRecord(drName);
        return sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['MOVIE_CREATED'], id:Number(id)})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const getDocRecordListAPI = async (req, res)=>{
    // const { userId, orgId, permissions, profileId:userProfileId } = getUserSessionDetails(req)
    const { from, to, sortField='ID', sortOrder='DESC', searchStr='' } = parseFromLimit(req.query);
    try{
        // userProfileId != profileId && await isAllowedToViewProfile(permissions);
        let result = [];
        // if(recordId){
        //     result = await getMovie(recordId);
            // const userObj = selectn('session.userObj',req) || {};
            // userObj.permissions = result.permissions;
        // }else{
            result = await getDocRecordList();
        // }
        return sendResponse(res,{status: SUCCESS_STATUS, response:structureDocObj(result)})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const createTestRecordAPI = async (req, res)=>{
    // const { userId:requestingUserId, orgId, permissions:existPermissions } = getUserSessionDetails(req)
    // const { profileName, permissions } = req.body;
    // const orgObj = getUserSessionDetails(req,'org')
    const { movie_id } = req.body;
    console.log(req.body)
    try{
        // await isAllowedToAddProfile({orgId, permissions:existPermissions,orgObj});
        // await isMovieExist(movie_id)
        const id = await createTestRecord(req.body);
        testDatas = '';
        return sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['MOVIE_CREATED'], id:Number(id)})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const updateTestRecordAPI = async (req, res)=>{
    // const { userId:requestingUserId, orgId, permissions:existPermissions } = getUserSessionDetails(req)
    // const orgObj = getUserSessionDetails(req,'org')
    const { recordId } = req.params;
    try{
        // await isAllowedToUpdateProfile({orgId, permissions:existPermissions,orgObj})
        const values = getUpdateValues('TEST_UPDATE',req.body)
        await updateTestRecord({id:recordId, values });
        testDatas = '';
        return sendResponse(res,{status: SUCCESS_STATUS, message: SUCCESS_MESSAGES['MOVIE_UPDATED']})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const getTestRecordListAPI = async (req, res)=>{
    // const { userId, orgId, permissions, profileId:userProfileId } = getUserSessionDetails(req)
    const { from, to, sortField='ID', sortOrder='DESC', searchStr='' } = parseFromLimit(req.query);
    const { recordId } = req.params;
    console.log("From",from,to,sortField,sortOrder)
    if(testDatas){
        return sendResponse(res,{status: SUCCESS_STATUS, response:testDatas})
    }
    try{
        // userProfileId != profileId && await isAllowedToViewProfile(permissions);
        let result = [];
        // if(recordId){
        //     result = await getMovie(recordId);
            // const userObj = selectn('session.userObj',req) || {};
            // userObj.permissions = result.permissions;
        // }else{
            result = await getTestRecordList({sortField, sortOrder, from, to, searchStr });
        // }
        testDatas = structureTestObj(result)
        return sendResponse(res,{status: SUCCESS_STATUS, response:testDatas})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}
export const deleteTestRecordAPI = async (req, res)=>{
    // const { userId, orgId, permissions } = getUserSessionDetails(req)
    const { recordId } = req.params;
    try{
        // await isAllowedToDeleteProfile(permissions);
        const result = await deleteTestRecord(recordId);
        testDatas = ''
        return sendResponse(res,{status: SUCCESS_STATUS, response:result})
    }catch(error){
        console.log(error)
        return sendResponse(res,ERROR_MESSAGES[error])
    }
}


export const countLabRecordAPI = async (req, res)=>{
    const result = await movieCounts();
    const resObj = {};
    for(let i=0;i<result.columns.length;i++){
        resObj[result.columns[i]] = result.rows[0][i];
    }
    return sendResponse(res,{status: SUCCESS_STATUS, response:resObj})
}