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
export const insertOrgQuery = (orgName)=>`INSERT INTO organizations (orgName) VALUES ('${orgName}');`;
export const getOrgIdByName = (orgName) => `SELECT ID from organizations WHERE orgName = '${orgName}'`;
export const getProfIdByNameAndOrgId = (orgName, profileName)=> `SELECT ID from user_profile where orgID='${getOrgIdByName(orgName)}' AND profileName='${profileName}' `
export const getOrgByNameQuery = (orgName) => `SELECT * from organizations WHERE orgName = '${orgName}'`;
export const getOrgByIDQuery = (orgId) => `SELECT * from organizations WHERE ID = '${orgId}'`;
export const insertProfileQuery = ({orgId, profileName, permissions}) => `INSERT INTO user_profile (orgID, profileName,permissions) VALUES ('${orgId}','${profileName}','${permissions}');`
export const insertUserQuery = ({orgId, profileId, userName, password, maxSessionLimit, maxSessionTime}) => `INSERT INTO users (orgID, userName, password, userProfileID, maxSessionLimit, maxSessionTime) VALUES ('${orgId}','${userName}','${password}', '${profileId}', '${maxSessionLimit}', '${maxSessionTime}');`
export const insertDeptQuery = ({orgId, deptName}) => `INSERT INTO departments (orgID, deptName) VALUES ('${orgId}','${deptName}');`
export const insertDeptAccessQuery = ({userId, deptId}) => `INSERT INTO department_access (userID, deptID) VALUES ('${userId}','${deptId}');`