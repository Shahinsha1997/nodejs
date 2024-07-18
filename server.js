import express from 'express';
import { createServer } from 'http';
import { createWebSocket } from './websocket/websocketconfig.mjs';
import { createAccountAPI, createOrgAPI, createProfileAPI, createUserTablesAPI } from './userApiActions.mjs';
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

app.post('/createOrg', createOrgAPI)
// app.post('/updateOrg', createOrgAPI)
app.post('/createUserTables', createUserTablesAPI)
app.post('/createprofile', createProfileAPI)

app.post('/createAccount', createAccountAPI)

server.listen(port, host, ()=>{
  console.log(`Server running at http://${host}:${port}/`);
});


