import { getUserManagementDB } from "../utils/dbUtils.mjs";
import { insertOrgQuery, getOrgByNameQuery, tableDetails, userTables, insertProfileQuery, getOrgByIDQuery, insertUserQuery, insertDeptQuery, insertDeptAccessQuery, getUserByNameQuery, getProfileListQuery, getUsersListQuery, getUserQuery, getProfileQuery, getDeptListQuery, getDeptQuery, getAccessibleDeptListQuery, getAccesibleDeptQuery, insertDeptsAccessQuery, updateDeptQuery, deleteDeptQuery, isAccessibleDeptQuery, revokeAccessDeptQuery, updateOrgQuery, updateUserQuery, insertUserSessionQuery, getDeptCountQuery, getProfileCountQuery, getSessionCountQuery, deleteSession, getSessionDetailsQuery } from "../utils/tableDetails.mjs";

const userDBQueries = async (query)=>{
    const userManagementDB =  await getUserManagementDB();
    const result = await userManagementDB.execute(query);
    userManagementDB.close();
    return result;
}
const userDBBatchQueries = async (queries) =>{
    const userManagementDB =  await getUserManagementDB();
    const result = await userManagementDB.batch(queries,'write');
    userManagementDB.close();
    return result;
}
export const createOrg = async (orgName)=>{
    return await userDBQueries(insertOrgQuery(orgName))
}
export const updateOrg = async ({orgId, values})=>{
    return await userDBQueries(updateOrgQuery({orgId, values}))
}
export const getOrganizaitonByID = async (orgId) =>{
    const results = await userDBQueries(getOrgByIDQuery(orgId));
    return results.rows[0];
}
export const getOrganizaitonByName = async (orgName)=>{
    return await userDBQueries(getOrgByNameQuery(orgName));
}
export const getUserByUserName = async (userName)=>{
    const results = await userDBQueries(getUserByNameQuery(userName));
    return results.rows[0]
}
export const isDuplicateModuleFound =async ({moduleType, moduleName}) =>{
    const duplicateConfig = {
        'ORG' : {
            'query' : getOrgByNameQuery,
            'isDuplicateMessage' : 'DUPLICATE_ORG'
        },
        'USER' : {
            'query' : getUserByNameQuery,
            'isDuplicateMessage' : 'USER_NAME_EXIST'
        }
    }
    const duplicateObj = duplicateConfig[moduleType]
    const result = await userDBQueries(duplicateObj['query'](moduleName));
    if(result.rows.length > 0){
         throw duplicateObj.isDuplicateMessage
    }
    return;
}
export const getLoggedInSession = async (userId) =>{
    const result = await userDBQueries(getSessionCountQuery({userId}));
    return result.rows;
}
export const createUserTables = async ()=>{
    const queryList = [];
    for(let i=0;i<userTables.length;i++){
        queryList.push({sql:tableDetails[userTables[i]],args:[]});
    }
    return await userDBBatchQueries(queryList)
}
export const getUserList = async ({orgId, from, to}) =>{
    const result = await userDBQueries(getUsersListQuery({orgId, from, to}));
    return result.rows;
}
export const getUser = async ({orgId, userId}) =>{
    const result = await userDBQueries(getUserQuery({orgId, userId}));
    return result.rows;
}
export const addUser = async (props) =>{
    const result = await userDBQueries(insertUserQuery(props));
    return result.rows;
}
export const updateUser = async ({userId, values}) =>{
    const result = await userDBQueries(updateUserQuery({userId, values}));
    return result.rows;
}


export const createProfile = async ({profileName, orgId, orgName, permissions})=>{
    return await userDBQueries(insertProfileQuery({orgId, orgName, permissions, profileName}));
}
export const getProfileList = async ({orgId, from, to}) =>{
    const result = await userDBQueries(getProfileListQuery({orgId, from, to}));
    return result.rows;
}
export const getProfile = async ({orgId, profileId}) =>{
    const result = await userDBQueries(getProfileQuery({orgId, profileId}));
    return result.rows[0];
}
export const getProfileCount = async ({orgId}) =>{
    const result = await userDBQueries(getProfileCountQuery({orgId}));
    return result.rows;
}
export const createDepartment = async ({deptName, orgId})=>{
    return await userDBQueries(insertDeptQuery({orgId, deptName}));
}
export const getDeptList = async ({orgId, from, to}) =>{
    const result = await userDBQueries(getDeptListQuery({orgId, from, to}));
    return result.rows;
}
export const getDepartment = async ({orgId, deptId}) =>{
    const result = await userDBQueries(getDeptQuery({orgId, deptId}));
    return result.rows[0];
}
export const getDepartmentCount = async ({orgId}) =>{
    const result = await userDBQueries(getDeptCountQuery({orgId}));
    return result.rows;
}
export const updateDept = async ({deptId, values})=>{
    console.log(updateDeptQuery({deptId, values}))
    const result = await userDBQueries(updateDeptQuery({deptId, values}));
    return result.rows;
}
export const deleteDept = async ({deptId})=>{
    const result = await userDBQueries(deleteDeptQuery({deptId}));
    return result.rows;
}
export const getAccessibleDeptList = async ({from, to, userId}) =>{
    const result = await userDBQueries(getAccessibleDeptListQuery({from, to, userId}));
    return result.rows;
}
export const getAccessibleDepartment = async ({userId, deptId}) =>{
    const result = await userDBQueries(getAccesibleDeptQuery({userId, deptId}));
    return result.rows[0];
}
export const addSessionDetails = async ({userAgent, userId})=>{
    const result = await userDBQueries(insertUserSessionQuery({userId, userAgent}));
    return result.lastInsertRowid;
}
export const getSessionDetails = async ({userId})=>{
    const result = await userDBQueries(getSessionDetailsQuery({userId}));
    return result.rows;
}
export const deleteSessionDetails = async ({sessionId})=>{
    return await userDBQueries(deleteSession({sessionId}));
}
export const isAccesibleDeptList = async ({deptList, userId})=>{
    const result = await userDBQueries(isAccessibleDeptQuery({userId, deptList}));
    return result.rows;
}
export const updadteAccessibleDepartments = async ({userId, revokeDeptIds, addDeptIds})=>{
    const queries = [];
    addDeptIds.length > 0 && queries.push(insertDeptsAccessQuery(addDeptIds))
    revokeDeptIds.length > 0 && queries.push(revokeAccessDeptQuery({userId, deptIds:revokeDeptIds}))
    const result = queries.length > 0 ? await userDBBatchQueries(queries) : {rows:[]};
    return result.rows;
}
export const isDeptLimitReached = async ({orgId})=>{
    const orgDetails = await getOrganizaitonByID(orgId);
    const [{count: deptCount}] = await getDepartmentCount({orgId});
    return orgDetails.maxDeptLimit <= deptCount
}
export const isProfileLimitReached = async ({orgId})=>{
    const orgDetails = await getOrganizaitonByID(orgId);
    const [{count: profileCount}] = await getProfileCount({orgId});
    return orgDetails.maxProfileLimit <= profileCount
}
export const createAccount = async (args) =>{
    const { 
        orgName, 
        profileName, 
        permissions,
        userName, 
        password,
        deptName,
        maxSessionLimit,
        maxSessionTime,
        name
    } = args;
    const userManagementDB =  await getUserManagementDB();
    const transaction = await userManagementDB.transaction('write');
    try{
        const orgResult = await transaction.execute({
            sql: insertOrgQuery(orgName),
            args: [],
            });
        
        const orgId = orgResult.lastInsertRowid
        const profileResult = await transaction.execute({
            sql: insertProfileQuery({orgId, profileName, permissions}),
            args: [],
        });
        const profileId = profileResult.lastInsertRowid;
        const userResult = await transaction.execute({
            sql: insertUserQuery({orgId, userName, name, password, profileId, maxSessionLimit, maxSessionTime}),
            args: [],
        });
        const userId = userResult.lastInsertRowid;
        const deptResult = await transaction.execute({
            sql: insertDeptQuery({orgId, deptName}),
            args: [],
        });
        const deptId = deptResult.lastInsertRowid;
        const deptAccessResult = await transaction.execute({
            sql: insertDeptAccessQuery({deptId, userId}),
            args: [],
        });
        await transaction.commit();
        userManagementDB.close();
    }catch(e){
        console.log("ACCOUNT_CREATION_ERROR: "+e)
        await transaction.rollback();
        throw 'INTERNAL_SERVER_ERROR'
    }
   
}

export const loginUser = async (userName)=>{
    try{
        const userObj = await getUserByUserName(userName)
        if(userObj) {
            return userObj;
        }
        throw 'UNAUTHORIZED_ACCESS'
    }catch(e){
        console.log(e)
        throw 'INTERNAL_SERVER_ERROR'
    }
   
}