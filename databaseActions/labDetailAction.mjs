
import { getLabManagementAcc, getLabManagementDB } from "../utils/dbUtils.mjs";
import { deleteLabRecordQuery, deleteTestRecordQuery, dueAlarmQuery, getDashboardQuery, getDocRecordListQuery, getLabRecordListQuery, getLabRecordQuery, getTestRecordListQuery, insertDocRecordQuery, insertLabRecordQuery, insertTestRecordQuery, profitByDocQuery, updateLabRecordQuery, updateTestRecordQuery } from "../utils/labTableDetails.mjs";


const labDBQueries = async (query)=>{
    console.log("Query",query)
    const movManagementDB =  await getLabManagementDB();
    const result = await movManagementDB.execute(query);
    movManagementDB.close();
    return result;
}
const labDBBatchQueries = async (queries) =>{
    const movManagementDB =  await getLabManagementDB();
    console.log(queries)
    const result = await movManagementDB.batch(queries,'write');
    movManagementDB.close();
    return result;
}

export const createLabRecord = async ({added_time=Date.now(),modified_time=Date.now(),patientId,name, mobile_number, doctor_name, status, work,total_amount, paid_amount, due_amount, discount,comments})=>{
    const result = await labDBQueries(insertLabRecordQuery({added_time,modified_time,patientId,name, mobile_number, doctor_name, status, work,total_amount, paid_amount, due_amount, discount,comments}));
    return result.lastInsertRowid;
}
export const updateLabRecord = async ({id, values})=>{
    const result = await labDBQueries(updateLabRecordQuery({id, values}));
    return result.lastInsertRowid;
}
export const getLabRecordList = async ({sortField, searchField, sortOrder, from, to, searchStr, timeFrom, timeTo, isAdmin}) =>{
    const result = await labDBQueries(getLabRecordListQuery({searchField, sortField, sortOrder, from, to, searchStr, timeFrom, timeTo, isAdmin}));
    return result.rows;
}
export const getLabRecord = async(id, isAdmin) =>{
    const result = await  labDBQueries(getLabRecordQuery(id, isAdmin));
    return result.rows;
}
export const getDueAlarmDatas = async(from) =>{
    const result = await labDBQueries(dueAlarmQuery(from));
    return result.rows;
    
}
export const deleteLabRecord = async (id)=>{
    const result = await labDBQueries(deleteLabRecordQuery(id));
    return result.rows;
}
export const labRecordCounts = async ()=>{
    // const result = await labDBQueries(getMovieCountQuery())
    // return result;
}
export const getLabDashboard = async ({timeFrom, timeTo, isAdmin})=>{
    const result = await labDBQueries(getDashboardQuery({timeFrom, timeTo, isAdmin}))
    return result;
}
export const getDBUsageStat = async ()=>{
    const result = await getLabManagementAcc()
    return result.databases.usage('abulab');
}
export const getProfitByDoc = async ({timeFrom, timeTo, from})=>{
    const result = await labDBQueries(profitByDocQuery(timeFrom, timeTo, from))
    return result; 
}

export const createDocRecord = async (drName)=>{
    const result = await labDBQueries(insertDocRecordQuery(drName));
    return result.lastInsertRowid;
}

export const getDocRecordList = async () =>{
    const result = await labDBQueries(getDocRecordListQuery());
    return result.rows;
}
export const createTestRecord = async ({testName, testAmount})=>{
    const result = await labDBQueries(insertTestRecordQuery({testName, testAmount}));
    return result.lastInsertRowid;
}
export const updateTestRecord = async ({id, values})=>{
    const result = await labDBQueries(updateTestRecordQuery({id, values}));
    return result.lastInsertRowid;
}
export const getTestRecordList = async ({sortField, sortOrder, from, to, searchStr}) =>{
    const result = await labDBQueries(getTestRecordListQuery({sortField, sortOrder, from, to, searchStr}));
    return result.rows;
}
export const deleteTestRecord = async (id)=>{
    const result = await labDBQueries(deleteTestRecordQuery(id));
    return result.rows;
}



export function getCurrentDate(date='', isNormalFormat) {
    date = date ? new Date(date) : new Date();

    // Get year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-based, so we add 1
    const day = String(date.getDate()).padStart(2, '0');         // Pad day with leading zero

    return isNormalFormat ? `${day}-${month}-${year}` : `${year}-${month}-${day}`;
}