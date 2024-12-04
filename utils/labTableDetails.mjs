
const ALL = 'all_movies'
const TODAY = 'today';
const THIS_WEEK = 'thisWeek'
const NEXT_WEEK = 'nextWeek'
const OTHER_RELEASE = 'otherRelease'
const RELEASED_MOVIES = 'releasedMovies'
const ONE_DAY_IN_MS = 24*60*60*1000
//Lab Queries
const LAB_TABLE = 'labDetails'
// export const getIdByMovId = (movie_id)=> `SELECT ID from ${LAB_TABLE} WHERE movie_id='${movie_id}' `

const getQueryCondition = ({ searchStr, searchField,timeFrom, timeTo, isAdmin, filterType, id }) => {
    const conditions = [];
    let groupByPart = ''
    if (!isAdmin) {
      conditions.push(`name NOT LIKE '%Admin Only%'`);
    }
  
    if (searchStr) {
      conditions.push(`${searchField} LIKE '%${searchStr}%'`);
    }
  
    if (timeFrom && timeTo) {
      conditions.push(`added_time BETWEEN ${timeFrom} AND ${timeTo}`);
    }
    if(id){
      conditions.push(`ID = ${id}`)
    }
    const conditionPart = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
    return conditionPart + groupByPart;
  };
export const getLabRecordQuery = (id, isAdmin) =>`SELECT * from ${LAB_TABLE} ${getQueryCondition({id, isAdmin})}`  
export const getLabRecordListQuery = 
    ({sortField,searchField, sortOrder, from, to, searchStr, timeFrom, timeTo, isAdmin, filterType}) => 
        `SELECT  * from ${LAB_TABLE}
        ${getQueryCondition({searchField, searchStr, timeFrom, timeTo, isAdmin, filterType})}
        ORDER BY ${sortField} ${sortOrder} LIMIT 20 OFFSET ${from};`
// export const getLabRecordQuery = ({id}) => `SELECT  * from ${LAB_TABLE} WHERE ID = '${id}'`
// export const getMovieByMovIdQuery = (id) => `SELECT  * from ${LAB_TABLE} WHERE movie_id = '${id}'`
export const insertLabRecordQuery = ({added_time,modified_time,patientId,name, mobile_number, doctor_name, status, work,total_amount, paid_amount, due_amount, discount,comments}) => `INSERT INTO ${LAB_TABLE} (added_time,modified_time,patientId,name, mobile_number, doctor_name, status, work,total_amount, paid_amount, due_amount, discount,comments)
VALUES ("${added_time}","${modified_time}","${patientId}","${name}", "${mobile_number}", "${doctor_name}", "${status}", "${work}","${total_amount}", "${paid_amount}", "${due_amount}", "${discount}","${comments}")`
export const updateLabRecordQuery = ({id, values}) => `UPDATE ${LAB_TABLE} SET ${values} WHERE id = '${id}'`
export const deleteLabRecordQuery = (id) => `DELETE FROM ${LAB_TABLE} WHERE id='${id}';`;
export const profitByDocQuery = ({timeFrom, timeTo, from}) => `SELECT doctor_name,SUM(paid_amount) as paidAmount,SUM(due_amount) as dueAmount,SUM(total_amount) as totalAmount,SUM(discount) as discount FROM ${LAB_TABLE} WHERE added_time <=${timeFrom} AND added_time >=${timeTo} LIMIT 20 OFFSET ${from};`;
export const dueAlarmQuery = (from) =>
`SELECT  * from ${LAB_TABLE}
 ${getDueAlarmTime()}
 ORDER BY ID ASC LIMIT 20 OFFSET ${from};`

const getDueAlarmTime = ()=>{
  const currentTime = Date.now();
  const minimumTime = currentTime - (15 * ONE_DAY_IN_MS )
  const maxTime = currentTime - (60 * ONE_DAY_IN_MS)
  const modifyMinTime = currentTime - (7 * ONE_DAY_IN_MS )
  return `WHERE status = 'Outstanding' AND ((${maxTime} <= added_time AND added_time <= ${minimumTime} AND comments == '') OR (comments != '' AND modified_time <= ${modifyMinTime})) `
}
//Dr Queries
const DR_TABLE = 'drDetails';
export const insertDocRecordQuery = (drName) => `INSERT INTO ${DR_TABLE} (drName) VALUES ('${drName}')`  
export const getDocRecordListQuery = () => `SELECT  * from ${DR_TABLE};` 

//Test Queries
const TEST_TABLE = 'testDetails'
// export const getIdByMovId = (movie_id)=> `SELECT ID from ${LAB_TABLE} WHERE movie_id='${movie_id}' `
export const getTestRecordListQuery = 
    ({sortField, sortOrder, from, to, searchStr}) => 
        `SELECT  * from ${TEST_TABLE};`
// export const getLabRecordQuery = ({id}) => `SELECT  * from ${LAB_TABLE} WHERE ID = '${id}'`
// export const getMovieByMovIdQuery = (id) => `SELECT  * from ${LAB_TABLE} WHERE movie_id = '${id}'`
export const insertTestRecordQuery = ({testName, testAmount}) => `INSERT INTO ${TEST_TABLE} (testName, testAmount)
VALUES ('${testName}','${testAmount}')`
export const updateTestRecordQuery = ({id, values}) => `UPDATE ${TEST_TABLE} SET ${values} WHERE id = '${id}'`
export const deleteTestRecordQuery = (id) => `DELETE FROM ${TEST_TABLE} WHERE id='${id}';`;
const incomeQuery = "SUM(CASE WHEN status = 'Income' THEN paid_amount END) AS income";
const expenseQuery = `SUM(CASE WHEN status = 'Expense' THEN paid_amount END) AS expense`;
const personalExpenseQuery = `SUM(CASE WHEN name LIKE '%Personal Expense%' THEN paid_amount END) AS personalExpense`;
const externalLabExpenseQuery = `SUM(CASE WHEN name LIKE '%External Lab%' THEN paid_amount END) AS externalLabExpense`;
const outstandingQuery = `SUM(CASE WHEN status = 'Outstanding' THEN due_amount END) AS outstanding`;
const patientCountQuery = `SUM(CASE WHEN status!='Expense' THEN 1 END) AS patientCount`
const discountQuery =  `SUM(discount) AS discount`
export const getDashboardQuery = ({timeFrom, timeTo, isAdmin})=>
    isAdmin ? `SELECT ${incomeQuery},${expenseQuery},${personalExpenseQuery},${externalLabExpenseQuery},${outstandingQuery},${patientCountQuery},${discountQuery} FROM ${LAB_TABLE} WHERE added_time BETWEEN ${timeFrom} AND ${timeTo};`
    : `SELECT ${outstandingQuery} FROM ${LAB_TABLE} WHERE added_time BETWEEN ${timeFrom} AND ${timeTo};`

//Count Queries

// export const getTodayMovieQuery = ()=> `SELECT * FROM ${LAB_TABLE} WHERE release_date = '${getCurrentDate()}';`;
// export const getThisWeekMovieQuery = ()=> `SELECT * FROM ${LAB_TABLE} WHERE release_date ${getByDatas('thisWeek')}`
// export const getNextWeekMovieQuery = ()=> `SELECT * FROM ${LAB_TABLE} WHERE release_date ${getByDatas('nextWeek')}`
// export const getOtherMovieQuery = ()=> `SELECT * FROM ${LAB_TABLE} WHERE release_date ${getByDatas('otherReleases')}`

// const getByDatas = (type)=>{
//     const dayInMs = 86400000
//     let today = new Date()
//     let startTime = today.setHours(0,0,0,0);
//     let endTime = startTime + dayInMs
//     CASE WHEN type == THIS_WEEK){
//         const day = today.getDay();
//         startTime = startTime - (day * dayInMs)
//         endTime = startTime + (7 * dayInMs)
//     }else CASE WHEN type == NEXT_WEEK || type == OTHER_RELEASE){
//         const day = 7 - today.getDay();
//         startTime = startTime + (day * dayInMs)
//         endTime = startTime + (7 * dayInMs)
//     }
//     CASE WHEN type == OTHER_RELEASE){
//         return `> '${getCurrentDate(endTime)}'`;
//     }else CASE WHEN type == RELEASED_MOVIES){
//         return ` <= '${getCurrentDate()}'`
//     }else CASE WHEN type == TODAY){
//         return ` = '${getCurrentDate()}'`
//     }
//     return `BETWEEN '${getCurrentDate(startTime)}' AND '${getCurrentDate(endTime)}'`
// }

// const allMovieQuery = 'COUNT(ID) AS all_movies';
// const todayMovieQuery = `COUNT(CASE WHEN release_date ${getByDatas(TODAY)} THEN 1 END) AS ${TODAY}`;
// const thisWeekMovieQuery = `COUNT(CASE WHEN release_date ${getByDatas(THIS_WEEK)} THEN 1 END) AS ${THIS_WEEK}`;
// const nextWeekMovieQuery = `COUNT(CASE WHEN release_date ${getByDatas(NEXT_WEEK)} THEN 1 END) AS ${NEXT_WEEK}`;
// const otherMovieQuery = `COUNT(CASE WHEN release_date ${getByDatas(OTHER_RELEASE)} THEN 1 END) AS ${OTHER_RELEASE}`;

// export const getMovieCountQuery = ()=>`SELECT ${allMovieQuery},${todayMovieQuery},${thisWeekMovieQuery},${nextWeekMovieQuery},${otherMovieQuery} FROM ${LAB_TABLE};`
