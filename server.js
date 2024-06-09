const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();

const allowedOrigins = [
    'http://localhost:3000', // Origen local para desarrollo
    'https://oremos.vercel.app', // Tu dominio de producción en Vercel
    'https://oremos.app', // Nuevo dominio
    'https://www.oremos.app' // Con y sin www
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
    allowedHeaders: ["Content-Type"],
    credentials: true
};

app.use(cors(corsOptions)); // Habilita CORS con opciones

// Definir una ruta para la raíz
app.get('/', (req, res) => {
    res.send('Servidor de Socket.IO funcionando');
});

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
        }
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
