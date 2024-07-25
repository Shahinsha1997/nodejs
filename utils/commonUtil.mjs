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
    INTERNAL_SERVER_ERROR : {
        status: INTERNAL_SERVER_ERROR,
        message: INTERNAL_SERVER_ERROR_MESSAGE
    },
    NOT_FOUND_STATUS: {
        status: NOT_FOUND_STATUS,
        message: NOT_FOUND_STATUS_MESSAGE
    },
    UNAUTHORIZED_ACCESS:{
        status: UNAUTHORIZED_ACCESS,
        message: UNAUTHORIZED_ACCESS_MESSAGE
    },
    DUPLICATE_ORG:{
        status: 409,
        message: 'Organization name already exist'
    },
    USER_NAME_EXIST:{
        status: 409,
        message: 'Username already exist'
    },
    MAX_SESSION_LIMIT_ERROR:{
        status: 400,
        message:`Maximum ${MAX_SESSION_LIMIT} sessions are allowed`
    },
    MAX_SESSION_TIME_ERROR:{
        status: 400,
        message:`Maximum ${MAX_SESSION_TIME/(HR_IN_MS)} hours are allowed`
    },
    MAX_DEPT_REACHED:{
        status:400,
        message: `Maximum allowed departments created.`
    },
    MAX_PROFILE_REACHED:{
        status:400,
        message: `Maximum allowed profiles created.`
    },
    MAX_SESSION_REACHED: {
        status: 400,
        message: 'Maximum allowed session reached.'
    }
};
export const SUCCESS_MESSAGES = {
    TABLE_NOT_CREATED : "Table doesn't created properly",
    TABLE_CREATED : 'Tables created successfully',
    ORG_CREATED : 'Organization created successfully',
    ORG_UDPATED : 'Organization updated successfully',
    USER_ADDED : 'User added successfully',
    USER_UDPATED : 'User updated successfully',
    PROFILE_CREATED: 'Profile created successfully',
    ACCOUNT_CREATED: 'Account created successfully',
    ACCOUNT_NOT_CREATED: "Account doesn't created successfully",
    DEPARTMENT_CREATED: 'Department created successfully',
    DEPT_ACCESS_GRANTED: 'Department access updated successfully',
    SESSION_DELETED: 'Session revoked successfully',
    LOGOUT_SUCCESS: 'Logout successfully'
}



export const sendResponse = (res, obj=ERROR_MESSAGES['INTERNAL_SERVER_ERROR'])=>{
    res.status(obj.status);
    res.end(convertResAsStr(obj));
}

export const parseFromLimit = (obj)=>{
    let { from, limit=50 } = obj;
    limit = parseInt(limit) > 50 ? 50 : limit;
    const to = parseInt(from) + parseInt(limit);
    return { from, to};
}
export const hasPermission = (permissions,permissionName) => {
    // Org - View/ Create / Update
    // Profile - View/ Add / Edit / Delete
    // Department -View/ Add / Edit/ Delete
    // Users - View / Add/ Edit / Delete
    // Stock - View / Add / Edit / Delete 
    // Sale - View / Add / Edit / Delete
    const permissionArr = [
        'viewAdminPanel',
        'viewOrg','addOrg','editOrg','deleteOrg',
        'viewProfile','addProfilt','editProfilt','deleteProfile',
        'viewDept','addDept','editDept','deleteDept',
        'viewUser','addUser','editUser','deletUser',
        'viewStock','addStock','editStock','deleteStock',
        'viewSale','addSale','editSale','deleteSale'
    ];
    const permissionIndex = permissionArr.indexOf(permissionName);
    console.log(permissionName, permissionIndex, permissions)
    return permissions[permissionIndex] == 1;
}


export const setSessionDetails = (sessionDetails, userId, userDetails) =>{
    if(!sessionDetails.userId){
        sessionDetails.userId = {};
    }
    sessionDetails[userId] = {...sessionDetails.userId, userDetails};
}