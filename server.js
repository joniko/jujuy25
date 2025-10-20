// Load environment variables from .env.local (fallback to .env)
require('dotenv').config({ path: '.env.local' });
require('dotenv').config(); // Fallback to .env if .env.local doesn't exist

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');

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

// Webhook URL from environment variable
const WEBHOOK_URL = process.env.WEBHOOK_URL;

// Function to send data to Google Apps Script webhook
async function sendToWebhook(eventData) {
    if (!WEBHOOK_URL) {
        console.log('⚠️  WEBHOOK_URL not configured, skipping analytics');
        return;
    }
    
    try {
        const response = await axios.post(WEBHOOK_URL, eventData, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000 // 5 second timeout
        });
        console.log(`📊 Analytics sent: ${eventData.event} - ${eventData.name}`);
        console.log(`✅ Response:`, response.data);
    } catch (error) {
        console.error(`❌ Failed to send analytics for ${eventData.event}:`, error.message);
        // Don't throw error - analytics failure shouldn't break the app
    }
}

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
        const disconnectedUser = userList.find(user => user.id === socket.id);
        userList = userList.filter(user => user.id !== socket.id);
        io.emit('onlineUsers', { count: onlineUsers, users: userList });
        console.log('User disconnected', socket.id);
        console.log('Online Users:', onlineUsers, userList);
        
        // Send leave event to webhook
        if (disconnectedUser) {
            sendToWebhook({
                event: 'leave',
                name: disconnectedUser.name,
                age: disconnectedUser.age,
                church: disconnectedUser.church,
                socketId: socket.id
            });
        }
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
            
            // Send join event to webhook
            sendToWebhook({
                event: 'join',
                name: name || 'Anónimo',
                age: age || 'N/A',
                church: church || 'N/A',
                socketId: socket.id
            });
        }
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📊 Analytics: ${WEBHOOK_URL ? '✅ ENABLED' : '❌ DISABLED (WEBHOOK_URL not configured)'}`);
    if (WEBHOOK_URL) {
        console.log(`🔗 Webhook URL: ${WEBHOOK_URL.substring(0, 50)}...`);
    } else {
        console.log(`⚠️  Set WEBHOOK_URL environment variable to enable analytics`);
        console.log(`📖 See ENV_SETUP.md for instructions\n`);
    }
});
