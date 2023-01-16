const express = require('express');
const app = express();

const http = require('http');
const server = http.Server(app);

const socket = require('socket.io')
const io = socket(server);

io.on('connection', function (connection) {
  connection.on('message', function (data) {
    console.log('new message: ' + data);
    io.emit('broadcast', data);
  });
});

server.listen(3000, function () {
  console.log('listening on 3000');
});
