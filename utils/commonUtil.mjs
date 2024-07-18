import { HR_IN_MS, MAX_SESSION_LIMIT, MAX_SESSION_TIME } from "./tableDetails.mjs";

export const convertResAsStr =(obj) =>{
    return JSON.stringify(obj);
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
    MAX_SESSION_LIMIT_ERROR:{
        status: 400,
        message:`Maximum ${MAX_SESSION_LIMIT} sessions are allowed`
    },
    MAX_SESSION_TIME_ERROR:{
        status: 400,
        message:`Maximum ${MAX_SESSION_TIME/(HR_IN_MS)} hours are allowed`
    },
};
export const SUCCESS_MESSAGES = {
    TABLE_NOT_CREATED : "Table doesn't created properly",
    TABLE_CREATED : 'Tables created successfully',
    ORG_CREATED : 'Organization created successfully',
    PROFILE_NOT_CREATED: "Profile doesn't created successfully",
    PROFILE_CREATED: 'Profile created successfully',
    ACCOUNT_CREATED: 'Account created successfully',
    ACCOUNT_NOT_CREATED: "Account doesn't created successfully"
}



export const sendResponse = (res, obj=ERROR_MESSAGES['INTERNAL_SERVER_ERROR'])=>{
    res.status(obj.status);
    res.end(convertResAsStr(obj));
}