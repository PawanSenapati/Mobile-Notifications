const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const port = process.env.PORT || 3000;
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.post('/notification', (req, res) => {
	if (req.headers['x-auth'] === process.env.X_AUTH) {
		console.log(req.body);
		io.sockets.emit('notification:recieved', req.body);
		res.json({
			status: 200,
			message: 'Notification Processed',
		});
	} else {
		console.log('Auth header mismatch!');
		res.json({
			status: 401,
			message: 'Invalid Header',
		});
	}
});

app.post('/auth', (req, res) => {
	console.log(req.body);
	if (req.body.password === process.env.PASSWORD) {
		res.json({
			status: 200,
			isPasswordCorrect: true,
		});
	} else {
		res.json({
			status: 401,
			isPasswordCorrect: false,
		});
	}
});

io.on('connection', (socket) => {
	console.log('User Connected');
	socket.on('disconnect', () => {
		console.log('User Disconnected!');
	});
});

server.listen(port, () => {
	console.log('listening on :', port);
});
