import { getCurrentDate } from "../databaseActions/movDetailAction.mjs";
import { HR_IN_MS, MAX_SESSION_LIMIT, MAX_SESSION_TIME } from "./tableDetails.mjs";

export const convertResAsStr =(obj) =>{
    return JSON.stringify(obj);
}
export const selectn = (key,obj={}) =>{
    var keyArr = key.split(".");
    var returnVal = obj
    for(let i=0;i<keyArr.length;i++){
      returnVal = returnVal[keyArr[i]]
      if(typeof returnVal == 'undefined'){
        break;
      }
    }
    return returnVal;
  }
  

export const INTERNAL_SERVER_ERROR = 500
export const UNAUTHORIZED_ACCESS = 401
export const NOT_FOUND_STATUS = 404
export const SUCCESS_STATUS = 200

export const INTERNAL_SERVER_ERROR_MESSAGE = 'InternalError';
export const UNAUTHORIZED_ACCESS_MESSAGE = "Unauthorized"
export const NOT_FOUND_STATUS_MESSAGE = "NotFound"

export const ERROR_MESSAGES = {
    'INTERNAL_SERVER_ERROR' : {
        status: INTERNAL_SERVER_ERROR,
        message: INTERNAL_SERVER_ERROR_MESSAGE
    },
    'NOT_FOUND_STATUS': {
        status: NOT_FOUND_STATUS,
        message: NOT_FOUND_STATUS_MESSAGE
    },
    'UNAUTHORIZED_ACCESS':{
        status: UNAUTHORIZED_ACCESS,
        message: UNAUTHORIZED_ACCESS_MESSAGE
    },
    'DUPLICATE_ORG':{
        status: 409,
        message: 'Organization name already exist'
    },
    'USER_NAME_EXIST':{
        status: 409,
        message: 'Username already exist'
    },
    'MAX_SESSION_LIMIT_ERROR':{
        status: 400,
        message:`Maximum 3 sessions are allowed`
    },
    'MAX_SESSION_TIME_ERROR':{
        status: 400,
        message:`Maximum 72 hours are allowed`
    },
    'MAX_DEPT_REACHED':{
        status:400,
        message: `Maximum allowed departments created.`
    },
    'MAX_PROFILE_REACHED':{
        status:400,
        message: `Maximum allowed profiles created.`
    },
    'MAX_SESSION_REACHED': {
        status: 400,
        message: 'Maximum allowed session reached.'
    },
    'MAX_USER_REACHED': {
        status:400,
        message: 'Maximum allowed users created.'
    },
    'MOVIE_EXIST': {
        status: 409,
        message: 'Movie Exist'
    }
};
export const SUCCESS_MESSAGES = {
    TABLE_NOT_CREATED : "Table doesn't created properly",
    TABLE_CREATED : 'Tables created successfully',
    ORG_CREATED : 'Organization created successfully',
    ORG_UDPATED : 'Organization updated successfully',
    USER_ADDED : 'User added successfully',
    USER_UPDATED : 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
    PROFILE_CREATED: 'Profile created successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    ACCOUNT_CREATED: 'Account created successfully',
    ACCOUNT_NOT_CREATED: "Account doesn't created successfully",
    DEPARTMENT_CREATED: 'Department created successfully',
    DEPARTMENT_UPDATED: 'Department updated successfully',
    DEPT_ACCESS_GRANTED: 'Department access updated successfully',
    SESSION_DELETED: 'Session revoked successfully',
    LOGOUT_SUCCESS: 'Logout successfully',
    MOVIE_NOT_CREATED : "Movie doesn't Added properly",
    MOVIE_CREATED : 'Movie added successfully',
    MOVIE_NOT_UPDATED : "Movie doesn't updated properly",
    MOVIE_UPDATED : 'Movie updated successfully',
}



export const sendResponse = (res, obj=ERROR_MESSAGES['INTERNAL_SERVER_ERROR'])=>{
    res.status(obj.status);
    res.end(convertResAsStr(obj));
}

export const parseFromLimit = (obj)=>{
    let { from=0, limit=50, sortField="ID", sortOrder='DESC', searchStr } = obj;
    limit = parseInt(limit) > 50 ? 50 : limit;
    const to = parseInt(from) + parseInt(limit);
    return { from, to, sortField, sortOrder, searchStr};
}
const permissionArr = [
    'viewAdminPanel',
    'viewOrg','addOrg','editOrg','deleteOrg',
    'viewProfile','addProfile','editProfile','deleteProfile',
    'viewDept','addDept','editDept','deleteDept',
    'viewUser','addUser','editUser','deleteUser',
    'viewStock','addStock','editStock','deleteStock',
    'viewSale','addSale','editSale','deleteSale'
];
export const hasPermission = (permissions,permissionName) => {
    // Admin Panel - View
    // Org - View/ Create / Update
    // Profile - View/ Add / Edit / Delete
    // Department -View/ Add / Edit/ Delete
    // Users - View / Add/ Edit / Delete
    // Stock - View / Add / Edit / Delete 
    // Sale - View / Add / Edit / Delete
    return permissions[permissionName] || false;
}


export const setSessionDetails = (sessionDetails, userId, userDetails) =>{
    if(!sessionDetails.userId){
        sessionDetails.userId = {};
    }
    sessionDetails[userId] = {...sessionDetails.userId, userDetails};
}

export const structureDeptObj = (arr=[])=>{
    const result = [];
    arr.map(deptObj=>{
        const { ID, deptName, isDisabledDept } = deptObj;
        result.push({id:ID, deptName, isDisabled: isDisabledDept == 1})
    })
    return result;
}
export const structureProfileObj = (arr=[]) =>{
    const result = [];
    arr.map(profileObj=>{
        const { ID, profileName, permissions } = profileObj;
        const permissionObj = {};
        permissionArr.map((permission,index)=>{
            permissionObj[permission] = permissions[index] == 1 ? true : false
        })
        result.push({id:ID, profileName, permissions:permissionObj})
    })
    return result;
}
export const structureUserObj = (arr=[])=>{
    const result = [];
    arr.map(userObj=>{
        const { ID, name, userName, isDisabledUser, maxSessionTime, maxSessionLimit, userProfileID } = userObj;
        result.push({id:ID, userName, name, profileId:userProfileID, maxSessionLimit, maxSessionTime , isDisabled: isDisabledUser == 1})
    })
    return result;
}
export const structureOrgObj = (arr=[])=>{
    const result = [];
    arr.map(orgObj=>{
        const { ID, orgName, maxDept, maxUsers, maxProfiles, maxSessionLimit, maxSessionTime, isDisabledOrg } = orgObj;
        result.push({id:ID, orgName, maxDept, maxUsers, maxProfiles, maxSessionLimit, maxSessionTime, isDisabled: isDisabledOrg == 1})
    })
    return result;
}
export const structureSessionObj = (arr=[])=>{
    const result = [];
    arr.map(sessionObj=>{
        const { ID, userID, name, userAgent } = sessionObj;
        result.push({id:ID, userId: userID, name, userAgent})
    })
    return result;
}

export const structureMovObj = (arr=[])=>{
    const result = [];
    arr.map(movObj=>{
        const { id, movie_id, actor_name, added_date, image_link, download_link, subtitle_link, rating, release_date } = movObj;
        result.push({mvId: id, name: movie_id, actName: actor_name, date: getCurrentDate(added_date,true), imageLink: image_link, downloadLink: download_link, subLink: subtitle_link, rating, releaseDate: getCurrentDate(release_date,true)})
    })
    return result;
}
export const getRating = (val) => val > 5 ? 5 : val < 0 ? 0 : val;