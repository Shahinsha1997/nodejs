import express from 'express';
import { createServer } from 'http';
import { createWebSocket } from './websocket/websocketconfig.mjs';
import session from 'express-session'
import cors from 'cors'
import { addUserAPI, beforeAllAPI, createAccountAPI, createDepartmentAPI, createOrgAPI, createProfileAPI, createUserTablesAPI, deleteDepartmentAPI, deleteProfileAPI, deleteSessionDetailsAPI, getAccessibleDeptListAPI, getDepartmentListAPI, getOrgAPI, getProfileListAPI, getSessionDetailsAPI, getUsersListAPI, isValidSession, login, logout, updateDepartmentAPI, updateDeptToUser, updateOrgAPI, updateUserAPI } from './userApiActions.mjs';
import { countMovieAPI, createMovieAPI, deleteMovieAPI, getMovieListAPI, updateMovieAPI } from './movieApiActions.mjs';
import { createDocRecordAPI, createLabRecordAPI, createTestRecordAPI, deleteLabRecordAPI, deleteTestRecordAPI, getDBUsageStatsAPI, getDashboardAPI, getDocRecordListAPI, getDueAlarmAPI, getLabRecordListAPI, getProfitByDocAPI, getTestRecordListAPI, updateLabRecordAPI, updateTestRecordAPI } from './APIActions/labApiActions.mjs';
const port = process.env.PORT || 8443
const commonAPIStr = '/api/v1'
const sessionMiddleware = session({
  secret: "ssproject-20240701",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly:false, sameSite:'None' }
});
var app = express();
app.use(cors({
  origin: '*', // Replace with your React app's URL
  credentials: true,
}));
app.use(express.json());
// app.use(sessionMiddleware);
const server = createServer(app);
const io = createWebSocket(server);
app.use((req,res,next) =>{
  req.io = io;
  next();
})
// app.use(beforeAllAPI,sessionMiddleware)
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
app.delete('/users/:userId', deleteProfileAPI)

app.get('/isValidSession',isValidSession)
app.get('/sessions',getSessionDetailsAPI);
app.get('/sessions/:userId',getSessionDetailsAPI);
app.delete('/sessions/:sessionId',deleteSessionDetailsAPI)

app.post('/profiles', createProfileAPI)
app.get('/profiles', getProfileListAPI)
app.put('/profiles/:profileId', updateDepartmentAPI)
app.get('/profiles/:profileId', getProfileListAPI)
app.delete('/profiles/:profileId', deleteProfileAPI)


app.post('/departments', createDepartmentAPI); 
app.get('/departments', getDepartmentListAPI)
app.get('/departments/:departmentId', getDepartmentListAPI)
app.put('/departments/:departmentId', updateDepartmentAPI)
app.delete('/departments/:departmentId', deleteDepartmentAPI)

app.post('/accessibledepartments', updateDeptToUser)
app.get('/accessibledepartments', getAccessibleDeptListAPI)
app.get('/accessibledepartments/:departmentId', getAccessibleDeptListAPI)



app.get(commonAPIStr+'/movies', getMovieListAPI)
app.get(commonAPIStr+'/movies/counts', countMovieAPI)
app.post(commonAPIStr+'/movies', createMovieAPI)
app.put(commonAPIStr+'/movies/:movieId', updateMovieAPI)
app.get(commonAPIStr+'/movies/:movieId', getMovieListAPI)
app.delete(commonAPIStr+'/movies/:movieId', deleteMovieAPI)


app.get(commonAPIStr+'/labRecord', getLabRecordListAPI)
app.post(commonAPIStr+'/labRecord', createLabRecordAPI)
app.put(commonAPIStr+'/labRecord/:recordId', updateLabRecordAPI)
// app.get(commonAPIStr+'/labRecord/:movieId', getMovieListAPI)
app.delete(commonAPIStr+'/labRecord/:recordId', deleteLabRecordAPI)
app.get(commonAPIStr+'/dashboard', getDashboardAPI)
app.get(commonAPIStr+'/lab/apiusage', getDBUsageStatsAPI)
app.get(commonAPIStr+'/profitByDoc', getProfitByDocAPI)
app.get(commonAPIStr+'/dueDatas', getDueAlarmAPI)

app.get(commonAPIStr+'/doctor', getDocRecordListAPI)
app.post(commonAPIStr+'/doctor', createDocRecordAPI)


app.get(commonAPIStr+'/testRecord', getTestRecordListAPI)
app.post(commonAPIStr+'/testRecord', createTestRecordAPI)
app.put(commonAPIStr+'/testRecord/:recordId', updateTestRecordAPI)
// app.get(commonAPIStr+'/labRecord/:movieId', getMovieListAPI)
app.delete(commonAPIStr+'/testRecord/:recordId', deleteTestRecordAPI)

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