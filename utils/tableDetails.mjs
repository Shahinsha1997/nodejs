import bcrypt from 'bcrypt'
import { getRating, selectn } from './commonUtil.mjs';
export const tableDetails = {
    orgTable: `CREATE TABLE organizations (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        orgName VARCHAR(255) NOT NULL UNIQUE,
        maxDept INTEGER NOT NULL DEFAULT 2,
        maxProfiles INTEGER NOT NULL DEFAULT 5,
        maxUsers INTEGER NOT NULL DEFAULT 10,
        maxSessionLimit INTEGER NOT NULL DEFAULT 3,
        maxSessionTime INTEGER NOT NULL DEFAULT 72,
        isDisabledOrg BOOLEAN NOT NULL DEFAULT FALSE
      );`,
    userProfileTable : `CREATE TABLE
    user_profile (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      orgID INTEGER NOT NULL,
      profileName VARCHAR(255) NOT NULL,
      permissions VARCHAR(255) NOT NULL,
      FOREIGN KEY (orgID) REFERENCES organizations (ID) ON DELETE CASCADE
    );`,
    userTable: `CREATE TABLE users (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        orgID INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        userName VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        userProfileID INTEGER NOT NULL,
        maxSessionLimit INTEGER DEFAULT 3,
        maxSessionTime INTEGER DEFAULT 72,
        isDisabledUser BOOLEAN NOT NULL DEFAULT FALSE,
        FOREIGN KEY (orgID) REFERENCES organizations(ID) ON DELETE CASCADE,
        FOREIGN KEY (userProfileID) REFERENCES user_profile(id) ON DELETE CASCADE
      );`,
    sessionTable: `CREATE TABLE
            session_details (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            userID INTEGER NOT NULL,
            userAgent VARCHAR(255) NOT NULL,
            FOREIGN KEY (userID) REFERENCES users (ID) ON DELETE CASCADE
            );`,
    deptTable: `CREATE TABLE departments (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        orgID INT NOT NULL,
        deptName VARCHAR(255) NOT NULL,
        isDisabledDept BOOLEAN NOT NULL DEFAULT FALSE,
        FOREIGN KEY (orgID) REFERENCES organizations(ID) ON DELETE CASCADE
        );`,
    deptAccessTable: `CREATE TABLE department_access (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        userID INTEGER NOT NULL,
        deptID INTEGER NOT NULL,
        FOREIGN KEY (userID) REFERENCES users(ID) ON DELETE CASCADE,
        FOREIGN KEY (deptID) REFERENCES departments(ID) ON DELETE CASCADE
        );`,
  //   jMovTable: `CREATE TABLE movie_details (
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,       
  //     movie_id VARCHAR(50) NOT NULL,           
  //     actor_name VARCHAR(100),                
  //     added_date DATE DEFAULT CURRENT_DATE,               
  //     image_link VARCHAR(255),                
  //     download_link VARCHAR(255),             
  //     subtitle_link VARCHAR(255),              
  //     rating INTEGER,                   
  //     release_date DATE
  // );`,
      labDetails: `CREATE TABLE labDetails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        added_time BIGINT,
        modified_time BIGINT,
        patientId INTEGER,
        name TEXT,
        mobile_number TEXT,
        doctor_name TEXT,
        status TEXT,
        work TEXT,
        total_amount INTEGER,
        paid_amount INTEGER,
        due_amount INTEGER,
        discount INTEGER,
        comments TEXT
    );`,
    testDetails: `CREATE TABLE testDetails (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        testName INTEGER,
        testAmount INTEGER
    );`,
    drDetails: `CREATE TABLE drDetails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      drName VARCHAR(255) NOT NULL
    );`
};
export const userTables = ['orgTable', 'userProfileTable', 'userTable','sessionTable','deptTable','deptAccessTable']

export const MAX_SESSION_LIMIT = 3;
export const HR_IN_MS = 60 * 60 * 1000;
export const PER_DAY_IN_MS = 24 * HR_IN_MS;
export const MAX_SESSION_TIME = 3 * PER_DAY_IN_MS; //3 Days

//Organizaiton Queries
const ORGANIZATION_TABLE = 'organizations'
export const getOrgByNameQuery = (orgName) => `SELECT  * from ${ORGANIZATION_TABLE} WHERE orgName = '${orgName}'`;
export const getOrgByIDQuery = (orgId) => `SELECT * from ${ORGANIZATION_TABLE} WHERE ID = '${orgId}'`;
export const getOrgIdByName = (orgName) => `SELECT ID from ${ORGANIZATION_TABLE} WHERE orgName = '${orgName}'`;
export const insertOrgQuery = (orgName)=>`INSERT INTO ${ORGANIZATION_TABLE} (orgName) VALUES ('${orgName}');`;
export const updateOrgQuery = ({values, orgId}) => `UPDATE ${ORGANIZATION_TABLE} SET ${values} WHERE ID=${orgId}`

//Profile Queries
const PROFILE_TABLE = 'user_profile'
export const getProfIdByNameAndOrgId = (orgName, profileName)=> `SELECT ID from ${PROFILE_TABLE} WHERE orgID='${getOrgIdByName(orgName)}' AND profileName='${profileName}' `
export const getProfileListQuery = ({orgId, from, to}) => `SELECT  * from ${PROFILE_TABLE} WHERE orgID = '${orgId}' BETWEEN ${from} AND ${to}`
export const getProfileQuery = ({orgId, profileId}) => `SELECT  * from ${PROFILE_TABLE} WHERE orgID = '${orgId}' AND ID = ${profileId}`
export const getProfileCountQuery = ({orgId}) => `SELECT count(*) as count FROM ${PROFILE_TABLE} WHERE orgID = ${orgId};`;
export const insertProfileQuery = ({orgId, profileName, permissions}) => `INSERT INTO ${PROFILE_TABLE} (orgID, profileName,permissions) VALUES ('${orgId}','${profileName}','${permissions}');`
export const updateProfileQuery = ({id, values}) => `UPDATE ${PROFILE_TABLE} SET ${values} WHERE ID = ${id}`
export const deleteProfileQuery = ({profileId}) => `DELETE FROM ${PROFILE_TABLE} WHERE ID=${profileId};`

//User Queries
const USERS_TABLE = 'users'
export const getUserByNameQuery = (userName) => `SELECT * from ${USERS_TABLE} WHERE userName = '${userName}'`;
export const insertUserQuery = ({orgId, profileId, userName, name, password, maxSessionLimit, maxSessionTime}) => `INSERT INTO ${USERS_TABLE} (orgID, name, userName, password, userProfileID, maxSessionLimit, maxSessionTime) VALUES ('${orgId}','${name}','${userName}','${password}', '${profileId}', '${maxSessionLimit}', '${maxSessionTime}');`
export const getUsersListQuery = ({orgId, from, to}) => `SELECT * FROM ${USERS_TABLE} WHERE orgID = ${orgId} BETWEEN ${from} AND ${to};`
export const getUserQuery = ({orgId, userId}) => `SELECT * FROM ${USERS_TABLE} WHERE orgID = ${orgId} AND ID = ${userId}`;
export const updateUserQuery = ({values, userId})=> `UPDATE ${USERS_TABLE} SET ${values} WHERE ID = ${userId}`
export const getUserCountQuery = ({orgId}) => `SELECT count(*) as count FROM ${USERS_TABLE} WHERE orgID = ${orgId};`;
export const deleteUserQuery = ({userId}) => `DELETE FROM ${USERS_TABLE} WHERE ID=${userId};`

//User Session Queries
const USER_SESSION_TABLE = 'session_details';
export const insertUserSessionQuery = ({userAgent, userId}) => `INSERT INTO ${USER_SESSION_TABLE} (userID, userAgent) VALUES ('${userId}','${userAgent}');`
export const getSessionCountQuery = ({userId}) => `SELECT count(*) as count FROM ${USER_SESSION_TABLE} WHERE userID = ${userId}`;
export const getSessionDetailsQuery = ({userId}) => `SELECT * from ${USER_SESSION_TABLE} WHERE userID = ${userId}`;
export const getAllSessionQuery = ({orgId, from , to}) => `SELECT sess.*, user.name  from ${USER_SESSION_TABLE} as sess INNER JOIN ${USERS_TABLE} as user ON user.ID = sess.userID WHERE orgID = ${orgId} BETWEEN ${from} AND ${to};`;
export const deleteSession = ({sessionId}) => `DELETE FROM ${USER_SESSION_TABLE} WHERE ID = ${sessionId};`
//Department Queries
const DEPT_TABLE = 'departments'
export const insertDeptQuery = ({orgId, deptName, isDisabled}) => `INSERT INTO ${DEPT_TABLE} (orgID, deptName, isDisabledDept) VALUES ('${orgId}','${deptName}', ${isDisabled});`
export const getDeptListQuery = ({orgId, from, to}) => `SELECT  * FROM ${DEPT_TABLE} WHERE orgID = ${orgId} BETWEEN ${from} AND ${to};`
export const getDeptQuery = ({orgId, deptId}) => `SELECT * FROM ${DEPT_TABLE} WHERE u.orgID = ${orgId} AND ID = ${deptId};`;
export const getDeptCountQuery = ({orgId}) => `SELECT count(*) as count FROM ${DEPT_TABLE} WHERE orgID = ${orgId};`;
export const updateDeptQuery = ({deptId, values}) => `UPDATE ${DEPT_TABLE} SET ${values} WHERE ID=${deptId};`
export const deleteDeptQuery = ({deptId}) => `DELETE FROM ${DEPT_TABLE} WHERE ID=${deptId};`

// Dept Access Queries
const DEPT_ACCESS_TABLE = 'department_access'
export const insertDeptAccessQuery = ({userId, deptId}) => `INSERT INTO ${DEPT_ACCESS_TABLE} (userID, deptID) VALUES ('${userId}','${deptId}');`
export const getAccessibleDeptListQuery = ({from, to, userId}) => `SELECT u.*,up.deptName FROM ${DEPT_ACCESS_TABLE} u INNER JOIN ${DEPT_TABLE} up ON u.deptID = up.id WHERE up.isDisabledDept=FALSE AND u.userID=${userId} BETWEEN ${from} AND ${to};`
export const getAccesibleDeptQuery = ({userId, deptId}) => `SELECT u.*,up.deptName FROM ${DEPT_ACCESS_TABLE} u INNER JOIN ${DEPT_TABLE} up ON u.deptID = up.id WHERE up.isDisabledDept=FALSE AND u.userID=${userId} AND u.deptID=${deptId};`
export const isAccessibleDeptQuery = ({userId, deptList}) => `SELECT deptID from ${DEPT_ACCESS_TABLE} WHERE userID=${userId} AND deptID in (${deptList});`
export const insertDeptsAccessQuery = (values)=>`INSERT OR IGNORE INTO ${DEPT_ACCESS_TABLE} (userID, deptID) VALUES ${values.join(', ')}`
export const revokeAccessDeptQuery = ({userId, deptIds}) =>`DELETE FROM ${DEPT_ACCESS_TABLE} WHERE userID=${userId} AND deptID IN (${deptIds});`


const updateObj = {
  'DEPT_UPDATE' : {
    'deptName' : {
      name: 'deptName',
      getValue: (val)=>val
    },
    'isDisabled' : {
      name:'isDisabledDept',
      getValue: (val)=> val === false ? 0 : 1
    }
  },
  'ORG_UPDATE': {
    'isDisabled' : {
      name:'isDisabledOrg',
      getValue: (val) => val === false ? 0 : 1
    },
    'maxSessionLimit' : {
      name:'maxSessionLimit',
      getValue: (val)=>val,
    },
    'maxSessionTime' : {
      name:'maxSessionTime',
      getValue: (val)=>val,
    },
    'maxDept' : {
      name:'maxDept',
      getValue: (val)=>val,
    },
    'maxProfiles' : {
      name:'maxProfiles',
      getValue: (val)=>val,
    },
    'maxUsers' : {
      name:'maxUsers',
      getValue: (val)=>val,
    },
  },
  'USER_UPDATE':{
    'name' : {
      name:'name',
      getValue: (val)=>val
    },
    'maxSessionLimit' : {
      name:'maxSessionLimit',
      getValue: (val)=>val,
    },
    'maxSessionTime' : {
      name:'maxSessionTime',
      getValue: (val)=>val,
    },
    'isDisabled' : {
      name:'isDisabledUser',
      getValue: (val) => val === false ? 0 : 1
    },
  },
  'PROFILE_UPDATE':{
    'profileName' : {
      name:'profileName',
      getValue: (val)=>val
    },
    'permissions' : {
      name:'permissions',
      getValue: (val)=>val,
    }
  },
  'MOVIE_UPDATE':{
    'id' : {
      name:'id',
      getValue: (val)=>val
    },
    'movie_id' : {
      name:'movie_id',
      getValue: (val)=>val,
    },
    'actor_name' : {
      name:'actor_name',
      getValue: (val)=>val
    },
    'image_link' : {
      name:'image_link',
      getValue: (val)=>val
    },
    'download_link' : {
      name:'download_link',
      getValue: (val)=>val,
    },
    'subtitle_link' : {
      name:'subtitle_link',
      getValue: (val)=>val
    },
    'rating' : {
      name:'rating',
      getValue: getRating
    },
    'release_date':{
      name:'release_date',
      getValue: (val)=>val
    }
  },
  'LAB_UPDATE' : {
    'id' : {
      name:'id',
      getValue: (val)=>val
    },
    'patientId' : {
      name:'patientId',
      getValue: (val)=>val,
    },
    'added_time' : {
      name:'added_time',
      getValue: (val)=>val
    },
    'modified_time' : {
      name:'modified_time',
      getValue: (val)=>Date.now()
    },
    'name' : {
      name:'name',
      getValue: (val)=>val,
    },
    'mobile_number' : {
      name:'mobile_number',
      getValue: (val)=>val
    },
    'doctor_name' : {
      name:'doctor_name',
      getValue: (val)=>val
    },
    'status':{
      name:'status',
      getValue: (val)=>val
    },
    'work' : {
      name:'work',
      getValue: (val)=>val
    },
    'total_amount':{
      name:'total_amount',
      getValue: (val)=>val
    },
    'paid_amount':{
      name:'paid_amount',
      getValue: (val)=>val
    },
    'due_amount':{
      name:'due_amount',
      getValue: (val)=>val
    },
    'discount':{
      name:'discount',
      getValue: (val)=>val
    },
    'comments':{
      name:'comments',
      getValue: (val)=>val
    }
  },
  'TEST_UPDATE' : {
    'id' : {
      name:'id',
      getValue: (val)=>val
    },
    'testName' : {
      name:'testName',
      getValue: (val)=>val,
    },
    'testAmount' : {
      name:'testAmount',
      getValue: (val)=>val
    }
  }
}
export const getUpdateValues = (type, valueObj)=>{
  const obj = updateObj[type];
  let values = '';
  Object.keys(valueObj).map(val=>{
    if(obj[val]){
      const { name, getValue } = obj[val];
      values += `${name} = '${getValue(valueObj[val])}',`
    }
  })
  return values.slice(0,values.length-1);
}
const saltRounds = 10;
export const getEncryptedPassword = async (password) =>{
  const salt = await bcrypt.genSalt(saltRounds)
  return await bcrypt.hash(password, salt);
}
export const isPasswordMatch = async (password, realPassword) =>{
  return await bcrypt.compare(password, realPassword);
}

export const getUserSessionDetails = (req, type='user') =>{
    const objTypes = {
      'user' : 'userObj',
      'org' : 'orgObj'
    }
    const allSessionObj = selectn(`sessionStore.sessions`,req);
    const { session } = req.headers;
    const sessionObj = JSON.parse(selectn(`${session}`,allSessionObj) || '{}');
    return sessionObj[objTypes[type]] || {};
}