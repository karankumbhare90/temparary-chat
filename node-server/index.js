const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer);
const cors = require('cors');
const PORT = 5522;

const users = {};

// Set up CORS headers for Socket.IO connections
io.engine.on('headers', (headers, request) => {
    headers['Access-Control-Allow-Origin'] = '*'; // Allow requests from any origin
    headers['Access-Control-Allow-Methods'] = 'GET, POST'; // Allow GET and POST requests
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
    headers['Access-Control-Allow-Credentials'] = 'true'; // Allow credentials (e.g., cookies)
});

io.on('connection', socket => {
    // console.log('A user connected');

    try {
        socket.on('new-user-joined', name => {
            // console.log("New user joined:", name);
            users[socket.id] = name;
            socket.broadcast.emit('user-joined', name);
        });

        socket.on('send', message => {
            socket.broadcast.emit('receive', { message : message, name: users[socket.id] });
        });

        socket.on('disconnect', message => {
            socket.broadcast.emit('left', users[socket.id]);
            delete users[socket.id];
        });
    } catch (error) {
        console.error('Socket error:', error);
    }
});

// Additional error handling for specific events (optional):
io.on('error', error => {
    console.error('Server error:', error);
});

httpServer.listen(PORT, () => {
    console.log('Socket.IO server listening on port 5522');
});
