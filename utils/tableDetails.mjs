import bcrypt from 'bcrypt'
export const tableDetails = {
    orgTable: `CREATE TABLE organizations (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        orgName VARCHAR(255) NOT NULL UNIQUE,
        maxDept INTEGER NOT NULL DEFAULT 2,
        maxProfiles INTEGER NOT NULL DEFAULT 5,
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
        );`
};
export const userTables = ['orgTable', 'userProfileTable', 'userTable','sessionTable','deptTable','deptAccessTable']

export const MAX_SESSION_LIMIT = 3;
export const HR_IN_MS = 60 * 60 * 1000;
export const PER_DAY_IN_MS = 24 * HR_IN_MS;
export const MAX_SESSION_TIME = 3 * PER_DAY_IN_MS; //3 Days

//Organizaiton Queries
const ORGANIZATION_TABLE = 'organizations'
export const getOrgByNameQuery = (orgName) => `SELECT * from ${ORGANIZATION_TABLE} WHERE orgName = '${orgName}'`;
export const getOrgByIDQuery = (orgId) => `SELECT * from ${ORGANIZATION_TABLE} WHERE ID = '${orgId}'`;
export const getOrgIdByName = (orgName) => `SELECT ID from ${ORGANIZATION_TABLE} WHERE orgName = '${orgName}'`;
export const insertOrgQuery = (orgName)=>`INSERT INTO ${ORGANIZATION_TABLE} (orgName) VALUES ('${orgName}');`;
export const updateOrgQuery = ({values, orgId}) => `UPDATE ${ORGANIZATION_TABLE} SET ${values} WHERE ID=${orgId}`

//Profile Queries
const PROFILE_TABLE = 'user_profile'
export const getProfIdByNameAndOrgId = (orgName, profileName)=> `SELECT ID from ${PROFILE_TABLE} WHERE orgID='${getOrgIdByName(orgName)}' AND profileName='${profileName}' `
export const getProfileListQuery = ({orgId, from, to}) => `SELECT * from ${PROFILE_TABLE} WHERE orgID = '${orgId}' BETWEEN ${from} AND ${to}`
export const getProfileQuery = ({orgId, profileId}) => `SELECT * from ${PROFILE_TABLE} WHERE orgID = '${orgId}' AND ID = ${profileId}`
export const getProfileCountQuery = ({orgId}) => `SELECT count(*) as count FROM ${PROFILE_TABLE} WHERE orgId = ${orgId};`;
export const insertProfileQuery = ({orgId, profileName, permissions}) => `INSERT INTO ${PROFILE_TABLE} (orgID, profileName,permissions) VALUES ('${orgId}','${profileName}','${permissions}');`


//User Queries
const USERS_TABLE = 'users'
export const getUserByNameQuery = (userName) => `SELECT * from ${USERS_TABLE} WHERE userName = '${userName}'`;
export const insertUserQuery = ({orgId, profileId, userName, name, password, maxSessionLimit, maxSessionTime}) => `INSERT INTO ${USERS_TABLE} (orgID, name, userName, password, userProfileID, maxSessionLimit, maxSessionTime) VALUES ('${orgId}','${name}','${userName}','${password}', '${profileId}', '${maxSessionLimit}', '${maxSessionTime}');`
export const getUsersListQuery = ({orgId, from, to}) => `SELECT u.name, u.userName,up.id,up.profileName,up.permissions FROM ${USERS_TABLE} u INNER JOIN ${PROFILE_TABLE} up ON u.userProfileID = up.id WHERE u.orgId = ${orgId} BETWEEN ${from} AND ${to};`
export const getUserQuery = ({orgId, userId}) => `SELECT u.name, u.userName,up.id,up.profileName,up.permissions FROM ${USERS_TABLE} u INNER JOIN ${PROFILE_TABLE} up ON u.userProfileID = up.id WHERE u.orgId = ${orgId} AND u.ID = ${userId}`;
export const updateUserQuery = ({values, userId})=> `UPDATE ${USERS_TABLE} SET ${values} WHERE ID = ${userId}`

//User Session Queries
const USER_SESSION_TABLE = 'session_details';
export const insertUserSessionQuery = ({userAgent, userId}) => `INSERT INTO ${USER_SESSION_TABLE} (userId, userAgent) VALUES ('${userId}','${userAgent}');`
export const getSessionCountQuery = ({userId}) => `SELECT count(*) as count FROM ${USER_SESSION_TABLE} WHERE userId = ${userId}`;
export const getSessionDetailsQuery = ({userId}) => `SELECT * from ${USER_SESSION_TABLE} WHERE userId = ${userId}`;
export const deleteSession = ({sessionId}) => `DELETE FROM ${USER_SESSION_TABLE} WHERE ID = ${sessionId};`
//Department Queries
const DEPT_TABLE = 'departments'
export const insertDeptQuery = ({orgId, deptName}) => `INSERT INTO ${DEPT_TABLE} (orgID, deptName) VALUES ('${orgId}','${deptName}');`
export const getDeptListQuery = ({orgId, from, to}) => `SELECT * FROM ${DEPT_TABLE} WHERE orgId = ${orgId} BETWEEN ${from} AND ${to};`
export const getDeptQuery = ({orgId, deptId}) => `SELECT * FROM ${DEPT_TABLE} WHERE u.orgId = ${orgId} AND ID = ${deptId};`;
export const getDeptCountQuery = ({orgId}) => `SELECT count(*) as count FROM ${DEPT_TABLE} WHERE orgId = ${orgId};`;
export const updateDeptQuery = ({deptId, values}) => `UPDATE ${DEPT_TABLE} SET ${values} WHERE ID=${deptId};`
export const deleteDeptQuery = ({deptId}) => `DELETE FROM ${DEPT_TABLE} WHERE ID=${deptId};`

// Dept Access Queries
const DEPT_ACCESS_TABLE = 'department_access'
export const insertDeptAccessQuery = ({userId, deptId}) => `INSERT INTO ${DEPT_ACCESS_TABLE} (userID, deptID) VALUES ('${userId}','${deptId}');`
export const getAccessibleDeptListQuery = ({from, to, userId}) => `SELECT u.*,up.deptName FROM ${DEPT_ACCESS_TABLE} u INNER JOIN ${DEPT_TABLE} up ON u.deptID = up.id WHERE up.isDisabledDept=FALSE AND u.userId=${userId} BETWEEN ${from} AND ${to};`
export const getAccesibleDeptQuery = ({userId, deptId}) => `SELECT u.*,up.deptName FROM ${DEPT_ACCESS_TABLE} u INNER JOIN ${DEPT_TABLE} up ON u.deptID = up.id WHERE up.isDisabledDept=FALSE AND u.userId=${userId} AND u.deptId=${deptId};`
export const isAccessibleDeptQuery = ({userId, deptList}) => `SELECT deptId from ${DEPT_ACCESS_TABLE} WHERE userId=${userId} AND deptId in (${deptList});`
export const insertDeptsAccessQuery = (values)=>`INSERT OR IGNORE INTO ${DEPT_ACCESS_TABLE} (userID, deptID) VALUES ${values.join(', ')}`
export const revokeAccessDeptQuery = ({userId, deptIds}) =>`DELETE FROM ${DEPT_ACCESS_TABLE} WHERE userID=${userId} AND deptID IN (${deptIds});`
const updateObj = {
  'DEPT_UPDATE' : {
    'departmentName' : {
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
    }
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

export const getUserSessionDetails = (session, type='user') =>{
    const objTypes = {
      'user' : 'userObj',
      'org' : 'orgObj'
    }
    return session[objTypes[type]];
}