import express from 'express';
import { createServer } from 'http';
import { createWebSocket } from './websocket/websocketconfig.mjs';
import session from 'express-session'
import { addUserAPI, beforeAllAPI, createAccountAPI, createDepartmentAPI, createOrgAPI, createProfileAPI, createUserTablesAPI, deleteDepartmentAPI, deleteSessionDetailsAPI, getAccessibleDeptListAPI, getDepartmentListAPI, getOrgAPI, getProfileListAPI, getSessionDetailsAPI, getUsersListAPI, login, logout, updateDepartmentAPI, updateDeptToUser, updateOrgAPI, updateUserAPI } from './userApiActions.mjs';
const port = process.env.PORT || 8443
const sessionMiddleware = session({
  secret: "ssproject-20240701",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
});
var app = express();
app.use(express.json());
app.use(sessionMiddleware);
const server = createServer(app);
createWebSocket(server);
app.use(beforeAllAPI,sessionMiddleware)
app.get("/",
    (req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Node Js server started...');
    });

// app.get("/getDB",async (req,res)=>{
//     const databases = await turso.databases.list();
//     res.end(getResponse(databases))
// })

app.post('/login', login)
app.post('/logout', logout)
app.post('/createOrg', createOrgAPI)
app.post('/organization/:orgId', updateOrgAPI)
app.get('/organization/:orgId', getOrgAPI)
app.post('/createUserTables', createUserTablesAPI)

app.get('/users', getUsersListAPI)
app.get('/users/:userId',getUsersListAPI)
app.post('/users',addUserAPI)
app.put('/users/:userId',updateUserAPI);

app.get('/sessions/:userId',getSessionDetailsAPI);
app.delete('/sessions/:sessionId',deleteSessionDetailsAPI)

app.post('/profiles', createProfileAPI)
app.get('/profiles', getProfileListAPI)
app.get('/profiles/:profileId', getProfileListAPI)


app.post('/departments', createDepartmentAPI); 
app.get('/departments', getDepartmentListAPI)
app.get('/departments/:departmentId', getDepartmentListAPI)
app.put('/departments/:departmentId', updateDepartmentAPI)
app.delete('/departments/:departmentId', deleteDepartmentAPI)

app.post('/accessibledepartments', updateDeptToUser)
app.get('/accessibledepartments', getAccessibleDeptListAPI)
app.get('/accessibledepartments/:departmentId', getAccessibleDeptListAPI)


app.post('/createAccount', createAccountAPI)

server.listen(port, ()=>{
  console.log(`Server running`);
});


// fetch('http://localhost:8443/createAccount', {method:"POST", headers:{'Content-Type': 'application/json'},body:JSON.stringify({ orgName:"ShaOrg", 
//         profileName:"Admin", 
//         permissions:"1111111111",
//         name:'Shahinsha',
//         userName:"Shahin1997", 
//         password:"Demo@2019",
//         maxSessionLimit:"3",
//         maxSessionTime:"48",
//         deptName:'ShaDepartment'})})
//   .then(response => response.json())  // Parse the response as JSON
//   .then(responseData => {
//     console.log(responseData);  // Handle the response data
//   })
//   .catch(error => {
//     console.error('Error:', error);  // Handle errors
//   });