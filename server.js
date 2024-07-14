const express = require('express');
const socketIO = require('socket.io');
const http = require('http')
const port = process.env.PORT || 3000
var app = express();
let server = http.createServer(app);
var io = socketIO(server);
const host = '0.0.0.0';
io.on('connection',
    (socket) => {
        console.log('New user connected');
        //emit message from server to user
        socket.emit('newMessage',
            {
                from: 'jen@mds',
                text: 'hepppp',
                createdAt: 123
            });
        socket.on('addAppointment',
        (newMessage) => {
            console.log('newMessage', newMessage);
            socket.emit('newAppointment');
        });
        // listen for message from user
        socket.on('createMessage',
            (newMessage) => {
                console.log('newMessage', newMessage);
            });

        // when server disconnects from user
        socket.on('disconnect',
            () => {
                console.log('disconnected from user');
            });
    });

app.get("/",
    (req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Zeet Hellow updated Node');
    });

server.listen(port, host, ()=>{
  console.log(`Server running at http://${host}:${port}/`);
});
