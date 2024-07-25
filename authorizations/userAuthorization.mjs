import { getLoggedInSession, isDeptLimitReached, isProfileLimitReached } from "../databaseActions/userDetailAction.mjs";
import { hasPermission } from "../utils/commonUtil.mjs"


const isAllowedAction = async (actionName, permissions)=>{
    return hasPermission(permissions, actionName);
}

//Org
export const isAllowedToViewOrg = async (permissions) =>{
    const isAllowed = await isAllowedAction('viewOrg',permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}
export const isAllowedToAddOrg = async (permissions)=>{
    const isAllowed = await isAllowedAction('addOrg', permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}
export const isAllowedToUpdateOrg = async (permissions) =>{
    const isAllowed = await isAllowedAction('editOrg',permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}
export const isAllowedToDeleteOrg = async (permissions) =>{
    const isAllowed = await isAllowedAction('deleteOrg',permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}


//Profile
export const isAllowedToViewProfile = async (permissions) =>{
    const isAllowed = await isAllowedAction('viewProfile',permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}
export const isAllowedToAddProfile = async ({orgId, permissions})=>{
    const isAllowed = await isAllowedAction('addProfile', permissions);
    const maxProfileReached = await isProfileLimitReached(orgId)
    if(!isAllowed) throw "UNAUTHORIZED_ACCESS";
    if(maxProfileReached) throw "MAX_PROFILE_REACHED"
    return true;
}
export const isAllowedToUpdateProfile = async (permissions) =>{
    const isAllowed = await isAllowedAction('editProfile',permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}
export const isAllowedToDeleteProfile = async (permissions) =>{
    const isAllowed = await isAllowedAction('deleteProfile',permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}


//User
export const isAllowedToViewUser = async (permissions) =>{
    const isAllowed = await isAllowedAction('viewUser',permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}
export const isAllowedToAddUser = async (permissions)=>{
    const isAllowed = await isAllowedAction('addUser', permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}
export const isAllowedToUpdateUser = async (permissions) =>{
    const isAllowed = await isAllowedAction('editUser',permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}
export const isAllowedToDeleteUser = async (permissions) =>{
    const isAllowed = await isAllowedAction('deleteUser',permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}

//Dept
export const isAllowedToViewDept = async (permissions)=>{
   const isAllowed =  await isAllowedAction('viewDept', permissions)
   if(isAllowed){
    return isAllowed;
   }
   throw "UNAUTHORIZED_ACCESS"
}
export const isAllowedToAddDept = async ({orgId, permissions})=>{
    const isAllowed = await isAllowedAction('addDept', permissions);
    const maxDeptReached = await isDeptLimitReached(orgId)
    if(!isAllowed) throw "UNAUTHORIZED_ACCESS";
    if(maxDeptReached) throw "MAX_DEPT_REACHED"
    return true;
}
export const isAllowedToUpdateDept = async (permissions) =>{
    const isAllowed = await isAllowedAction('editDept',permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}
export const isAllowedToDeleteDept = async (permissions) =>{
    const isAllowed = await isAllowedAction('deleteDept',permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}

//Stock
export const isAllowedToViewStock = async (permissions) =>{
    const isAllowed = await isAllowedAction('viewStock',permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}
export const isAllowedToAddStock = async (permissions)=>{
    const isAllowed = await isAllowedAction('addStock', permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}
export const isAllowedToUpdateStock = async (permissions) =>{
    const isAllowed = await isAllowedAction('editStock',permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}
export const isAllowedToDeleteStock = async (permissions) =>{
    const isAllowed = await isAllowedAction('deleteStock',permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}

//Sale
export const isAllowedToViewSale = async (permissions) =>{
    const isAllowed = await isAllowedAction('viewSale',permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}
export const isAllowedToAddSale = async (permissions)=>{
    const isAllowed = await isAllowedAction('addSale', permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}
export const isAllowedToUpdateSale = async (permissions) =>{
    const isAllowed = await isAllowedAction('editSale',permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}
export const isAllowedToDeleteSale = async (permissions) =>{
    const isAllowed = await isAllowedAction('deleteSale',permissions)
    if(isAllowed){
        return isAllowed;
    }
    throw "UNAUTHORIZED_ACCESS"
}
export const isAllowedToLogin = async (userId, maxSessionLimit) =>{
    const [{ count: existSessionCount }] = await getLoggedInSession(userId);
    if(existSessionCount >= maxSessionLimit){
        throw "MAX_SESSION_REACHED"
    }
    return true;
}