const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
// const { appendUserData } = require('./googleSheets'); // Comentar o eliminar esta línea si no es necesaria

const app = express();

const allowedOrigins = [
    'http://localhost:3000', // Origen local para desarrollo
    'https://oremos.vercel.app' // Reemplaza con tu dominio de producción en Vercel
];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
};

app.use(cors(corsOptions)); // Habilita CORS con opciones

const server = http.createServer(app);
const io = socketIo(server, {
    cors: corsOptions
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

            // Registrar usuario en Google Sheets, si es necesario
            // try {
            //   await appendUserData({ name, age, church });
            // } catch (error) {
            //   console.error('Error al guardar los datos en Google Sheets:', error);
            // }
        }
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
