import { getUserManagementDB } from "../utils/dbUtils.mjs";
import { insertOrgQuery, getOrgByNameQuery, tableDetails, userTables, insertProfileQuery, MAX_SESSION_LIMIT, MAX_SESSION_TIME, getOrgByIDQuery, insertUserQuery, insertDeptQuery, insertDeptAccessQuery } from "../utils/tableDetails.mjs";

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
export const getOrganizaitonByID = async (orgId) =>{
    return await userDBQueries(getOrgByIDQuery(orgId));
}
export const getOrganizaitonByName = async (orgName)=>{
    return await userDBQueries(getOrgByNameQuery(orgName));
}
export const isOrgPresent = async (orgName) =>{
    const result = await getOrganizaitonByName(orgName)
    if(result.rows.length > 0){
         throw 'DUPLICATE_ORG';
    }
    return;
}
export const createUserTables = async ()=>{
    const queryList = [];
    for(let i=0;i<userTables.length;i++){
        queryList.push({sql:tableDetails[userTables[i]],args:[]});
    }
    return await userDBBatchQueries(queryList)
}
export const createProfile = async ({profileName, orgId, orgName, permissions})=>{
    return await userDBQueries(insertProfileQuery({orgId, orgName, permissions, profileName}));
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
            sql: insertUserQuery({orgId, userName, password, profileId, maxSessionLimit, maxSessionTime}),
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