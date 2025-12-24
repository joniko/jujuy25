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
    'https://ejovs.com', // Nuevo dominio
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
app.use(express.json()); // Para parsear JSON en el body

// Definir una ruta para la raíz
app.get('/', (req, res) => {
    res.send('Servidor de Socket.IO funcionando');
});

// Endpoint proxy para el admin panel
app.post('/api/admin-webhook', async (req, res) => {
    if (!WEBHOOK_URL) {
        return res.status(500).json({
            success: false,
            error: 'WEBHOOK_URL no está configurado en el servidor'
        });
    }

    try {
        const response = await axios.post(WEBHOOK_URL, req.body, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 segundos
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('Error en proxy webhook:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
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
    // NO crear usuario aquí - esperar a que complete el modal y envíe 'newUser'
    console.log('Socket connected:', socket.id);

    socket.on('disconnect', () => {
        const disconnectedUser = userList.find(user => user.id === socket.id);
        
        // Solo procesar si el usuario completó el modal (tiene datos reales)
        if (disconnectedUser) {
            onlineUsers--;
            userList = userList.filter(user => user.id !== socket.id);
            io.emit('onlineUsers', { count: onlineUsers, users: userList });
            console.log('User disconnected', socket.id);
            console.log('Online Users:', onlineUsers, userList);
            
            // Send leave event to webhook with full user data
            sendToWebhook({
                event: 'leave',
                name: disconnectedUser.name,
                age: disconnectedUser.age,
                church: disconnectedUser.church,
                attendance: disconnectedUser.attendance || 'online',
                comment: disconnectedUser.comment || '',
                socketId: socket.id
            });
        } else {
            console.log('Socket disconnected before completing modal:', socket.id);
        }
    });

    socket.on('newUser', async ({ name, age, church, attendance }) => {
        // Validar que los datos no contengan palabras prohibidas
        if (containsForbiddenWords(name) || containsForbiddenWords(church)) {
            console.log(`⛔ Registro rechazado - contenido prohibido detectado`);
            socket.emit('contentRejected', { 
                field: 'profile',
                message: 'Tu información contiene contenido no permitido. Por favor usa un lenguaje respetuoso.' 
            });
            return;
        }
        
        const userIndex = userList.findIndex(user => user.id === socket.id);
        
        // Si el usuario ya existe, actualizar sus datos
        if (userIndex !== -1) {
            userList[userIndex] = {
                id: socket.id,
                name: name || 'Anónimo',
                age: age || 'N/A',
                church: church || 'N/A',
                attendance: attendance || 'online',
                comment: userList[userIndex].comment || ''
            };
        } else {
            // Si no existe, crear nuevo usuario
            onlineUsers++;
            userList.push({
                id: socket.id,
                name: name || 'Anónimo',
                age: age || 'N/A',
                church: church || 'N/A',
                attendance: attendance || 'online',
                comment: ''
            });
        }
        
        io.emit('onlineUsers', { count: onlineUsers, users: userList });
        
        // Send join event to webhook
        sendToWebhook({
            event: 'join',
            name: name || 'Anónimo',
            age: age || 'N/A',
            church: church || 'N/A',
            attendance: attendance || 'online',
            socketId: socket.id
        });
    });

    // Handle user comment updates
    socket.on('updateComment', ({ comment }) => {
        const userIndex = userList.findIndex(user => user.id === socket.id);
        if (userIndex !== -1) {
            // Validar que el comentario no contenga palabras prohibidas
            if (comment && containsForbiddenWords(comment)) {
                console.log(`⛔ Comentario rechazado - contenido prohibido detectado`);
                socket.emit('contentRejected', { 
                    field: 'comment',
                    message: 'Tu comentario contiene contenido no permitido. Por favor usa un lenguaje respetuoso.' 
                });
                return;
            }
            
            userList[userIndex].comment = comment || '';
            io.emit('onlineUsers', { count: onlineUsers, users: userList });
            
            // Send comment event to webhook with full user data
            if (comment) {
                sendToWebhook({
                    event: 'comment',
                    name: userList[userIndex].name,
                    age: userList[userIndex].age,
                    church: userList[userIndex].church,
                    attendance: userList[userIndex].attendance || 'online',
                    comment: comment,
                    socketId: socket.id
                });
            }
        }
    });
});

// Lista ampliada de palabras prohibidas (no case-sensitive)
const FORBIDDEN_WORDS = [
    // Insultos y palabras ofensivas
    'idiota', 'estúpido', 'imbécil', 'tonto', 'pendejo', 'cabrón', 'maldito',
    'puto', 'puta', 'zorra', 'bastardo', 'hijo de puta', 'hdp', 'hp',
    
    // Blasfemias y palabras irrespetuosas
    'mierda', 'carajo', 'coño', 'joder', 'chingar', 'verga', 'cojones',
    
    // Contenido sexual inapropiado
    'sexo', 'porno', 'xxx', 'desnudo', 'desnuda', 'pornografía',
    
    // Violencia y amenazas
    'matar', 'muere', 'suicidio', 'morir', 'asesinar', 'violencia',
    
    // Discriminación y odio
    'racismo', 'nazi', 'fascista', 'odio',
    
    // Drogas
    'droga', 'cocaína', 'marihuana', 'heroína', 'crack',
    
    // Spam y promociones
    'compra', 'vende', 'dinero fácil', 'ganar dinero', 'oferta', 'descuento',
    'promoción', 'bitcoin', 'forex', 'inversión garantizada', 'haz click',
    
    // URLs y contactos (patrones básicos)
    'http://', 'https://', 'www.', '.com', '.net', '.org', '.co',
    'whatsapp', 'telegram', 'instagram', '@gmail', '@hotmail', '@yahoo',
    
    // Otros
    'paypal', 'transferencia', 'cuenta bancaria', 'tarjeta de crédito'
];

// Función para validar que el texto no contenga palabras prohibidas
function containsForbiddenWords(text) {
    if (!text || typeof text !== 'string') return false;
    
    const lowerText = text.toLowerCase();
    
    // Verificar cada palabra prohibida
    for (const word of FORBIDDEN_WORDS) {
        if (lowerText.includes(word.toLowerCase())) {
            console.log(`⛔ Palabra prohibida detectada: "${word}" en texto: "${text}"`);
            return true;
        }
    }
    
    return false;
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📊 Analytics: ${WEBHOOK_URL ? '✅ ENABLED' : '❌ DISABLED (WEBHOOK_URL not configured)'}`);
    console.log(`🛡️  Content filter: ${FORBIDDEN_WORDS.length} palabras prohibidas`);
    if (WEBHOOK_URL) {
        console.log(`🔗 Webhook URL: ${WEBHOOK_URL.substring(0, 50)}...`);
    } else {
        console.log(`⚠️  Set WEBHOOK_URL environment variable to enable analytics`);
        console.log(`📖 See ENV_SETUP.md for instructions\n`);
    }
});
