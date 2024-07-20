import express from 'express';
import { createServer } from 'http';
import { createWebSocket } from './websocket/websocketconfig.mjs';
import { addUserAPI, createAccountAPI, createDepartmentAPI, createOrgAPI, createProfileAPI, createUserTablesAPI, deleteDepartmentAPI, getAccessibleDeptListAPI, getDepartmentListAPI, getProfileListAPI, getUsersListAPI, login, updateDepartmentAPI, updateDeptToUser, updateUserAPI, updateeOrgAPI } from './userApiActions.mjs';
const port = process.env.PORT || 3000
var app = express();
app.use(express.json());
const server = createServer(app);
const host = '0.0.0.0';
createWebSocket(server);
app.get("/",
    (req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Zeet Hellow updated Node');
    });

// app.get("/getDB",async (req,res)=>{
//     const databases = await turso.databases.list();
//     res.end(getResponse(databases))
// })

app.post('/login', login)
app.post('/createOrg', createOrgAPI)
app.post('/organization/:orgId', updateeOrgAPI)
app.post('/createUserTables', createUserTablesAPI)

app.get('/users', getUsersListAPI)
app.get('/users/:userId',getUsersListAPI)
app.post('/users',addUserAPI)
app.put('/users/:userId',updateUserAPI)

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

server.listen(port, host, ()=>{
  console.log(`Server running at http://${host}:${port}/`);
});


// fetch('http://localhost:3000/createAccount', {method:"POST", headers:{'Content-Type': 'application/json'},body:JSON.stringify({ orgName:"ShaOrg", 
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