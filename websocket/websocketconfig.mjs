
import { Server } from 'socket.io';


export const createWebSocket = (server) =>{
    const io = new Server(server);
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
            io.emit('newAppointment');
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
}