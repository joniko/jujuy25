// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const socketio = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = socketio(server);

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

        socket.on('disconnect', () => {
            onlineUsers--;
            userList = userList.filter(user => user.id !== socket.id);
            io.emit('onlineUsers', { count: onlineUsers, users: userList });
        });

        socket.on('newUser', ({ name, age, church }) => {
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

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});
