const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(server, {
    cors: {
      origin: dev ? '*' : false,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-user-room', (userId) => {
      if (userId) {
        socket.join(`user-${userId}`);
        console.log(`Socket ${socket.id} joined room: user-${userId}`);
      }
    });

    socket.on('notification', (data) => {
      const { userId, message, type } = data;
      if (userId) {
        io.to(`user-${userId}`).emit('notification', { message, type, timestamp: new Date() });
      }
    });

    socket.on('booking-update', (data) => {
      const { userId, bookingId, status } = data;
      if (userId) {
        io.to(`user-${userId}`).emit('booking-update', { bookingId, status, timestamp: new Date() });
      }
    });

    socket.on('report-update', (data) => {
      const { userId, reportId, status } = data;
      if (userId) {
        io.to(`user-${userId}`).emit('report-update', { reportId, status, timestamp: new Date() });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Socket.IO server running on http://${hostname}:${port}`);
  });
});