export const tableDetails = {
    orgTable: `CREATE TABLE organizations (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        orgName VARCHAR(255) NOT NULL UNIQUE,
        isDisabledOrg BOOLEAN NOT NULL DEFAULT FALSE
      );`,
    userProfileTable : `CREATE TABLE
    user_profile (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      orgID INTEGER NOT NULL,
      profileName VARCHAR(255) NOT NULL,
      permissions INTEGER NOT NULL,
      FOREIGN KEY (orgID) REFERENCES organizations (ID)
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
        FOREIGN KEY (orgID) REFERENCES organizations(ID),
        FOREIGN KEY (userProfileID) REFERENCES user_profile(id)
      );`,
    sessionTable: `CREATE TABLE
            session_details (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            userID INTEGER NOT NULL,
            userAgent VARCHAR(255) NOT NULL,
            FOREIGN KEY (userID) REFERENCES users (ID)
            );`,
    deptTable: `CREATE TABLE departments (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        orgID INT NOT NULL,
        deptName VARCHAR(255) NOT NULL,
        isDisabledDept BOOLEAN NOT NULL DEFAULT FALSE,
        FOREIGN KEY (orgID) REFERENCES organizations(ID)
        );`,
    deptAccessTable: `CREATE TABLE department_access (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        userID INTEGER NOT NULL,
        deptID INTEGER NOT NULL,
        FOREIGN KEY (userID) REFERENCES users(ID),
        FOREIGN KEY (deptID) REFERENCES departments(ID)
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

//Profile Queries
const PROFILE_TABLE = 'user_profile'
export const getProfIdByNameAndOrgId = (orgName, profileName)=> `SELECT ID from ${PROFILE_TABLE} WHERE orgID='${getOrgIdByName(orgName)}' AND profileName='${profileName}' `
export const getProfileListQuery = ({orgId, from, to}) => `SELECT * from ${PROFILE_TABLE} WHERE orgID = '${orgId}' BETWEEN ${from} AND ${to}`
export const getProfileQuery = ({orgId, profileId}) => `SELECT * from ${PROFILE_TABLE} WHERE orgID = '${orgId}' AND ID = ${profileId}`
export const insertProfileQuery = ({orgId, profileName, permissions}) => `INSERT INTO ${PROFILE_TABLE} (orgID, profileName,permissions) VALUES ('${orgId}','${profileName}','${permissions}');`


//User Queries
const USERS_TABLE = 'users'
export const getUserByNameQuery = (userName) => `SELECT * from ${USERS_TABLE} WHERE userName = '${userName}'`;
export const insertUserQuery = ({orgId, profileId, userName, name, password, maxSessionLimit, maxSessionTime}) => `INSERT INTO ${USERS_TABLE} (orgID, name, userName, password, userProfileID, maxSessionLimit, maxSessionTime) VALUES ('${orgId}','${name}','${userName}','${password}', '${profileId}', '${maxSessionLimit}', '${maxSessionTime}');`
export const getUsersListQuery = ({orgId, from, to}) => `SELECT u.name, u.userName,up.id,up.profileName,up.permissions FROM ${USERS_TABLE} u INNER JOIN ${PROFILE_TABLE} up ON u.userProfileID = up.id WHERE u.orgId = ${orgId} BETWEEN ${from} AND ${to};`
export const getUserQuery = ({orgId, userId}) => `SELECT u.name, u.userName,up.id,up.profileName,up.permissions FROM ${USERS_TABLE} u INNER JOIN ${PROFILE_TABLE} up ON u.userProfileID = up.id WHERE u.orgId = ${orgId} AND u.ID = ${userId}`;

//Department Queries
const DEPT_TABLE = 'departments'
export const insertDeptQuery = ({orgId, deptName}) => `INSERT INTO ${DEPT_TABLE} (orgID, deptName) VALUES ('${orgId}','${deptName}');`
export const getDeptListQuery = ({orgId, from, to}) => `SELECT * FROM ${DEPT_TABLE} WHERE orgId = ${orgId} BETWEEN ${from} AND ${to};`
export const getDeptQuery = ({orgId, deptId}) => `SELECT * FROM ${DEPT_TABLE} WHERE u.orgId = ${orgId} AND ID = ${deptId}`;



// Dept Access Queries
const DEPT_ACCESS_TABLE = 'department_access'
export const insertDeptAccessQuery = ({userId, deptId}) => `INSERT INTO ${DEPT_ACCESS_TABLE} (userID, deptID) VALUES ('${userId}','${deptId}');`
export const getAccessibleDeptListQuery = ({orgId, from, to}) => `SELECT u.*,up.deptName FROM ${DEPT_ACCESS_TABLE} u INNER JOIN ${DEPT_TABLE} up ON u.deptID = up.id WHERE up.orgId = ${orgId} AND up.isDisabledDept=FALSE BETWEEN ${from} AND ${to};`
export const getAccesibleDeptQuery = ({userId, deptId}) => `SELECT * FROM ${DEPT_TABLE} WHERE deptId = ${deptId} AND userId = ${userId}`;



