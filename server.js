const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { appendUserData } = require('./googleSheets'); // Si estás utilizando Google Sheets

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let onlineUsers = 0;
let userList = [];

io.on('connection', (socket) => {
    onlineUsers++;
    const newUser = {
        id: socket.id,
        name: 'Anónimo',
        age: 'N/A',
        church: 'N/A'
    };
    userList.push(newUser);
    io.emit('onlineUsers', { count: onlineUsers, users: userList });
    console.log('User connected', newUser);
    console.log('Online Users:', onlineUsers, userList);

    socket.on('disconnect', () => {
        onlineUsers--;
        userList = userList.filter(user => user.id !== socket.id);
        io.emit('onlineUsers', { count: onlineUsers, users: userList });
        console.log('User disconnected', socket.id);
        console.log('Online Users:', onlineUsers, userList);
    });

    socket.on('newUser', async ({ name, age, church }) => {
        const userIndex = userList.findIndex(user => user.id === socket.id);
        if (userIndex !== -1) {
            userList[userIndex] = {
                id: socket.id,
                name: name || 'Anónimo',
                age: age || 'N/A',
                church: church || 'N/A'
            };
            io.emit('onlineUsers', { count: onlineUsers, users: userList });

            // Registrar usuario en Google Sheets
            try {
                await appendUserData({ name, age, church });
            } catch (error) {
                console.error('Error al guardar los datos en Google Sheets:', error);
            }
        }
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
