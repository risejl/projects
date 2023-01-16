const io = require('socket.io-client');
const readline = require('readline');

let socket = io('URL')

const chatInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let chatHandle = '';
let messageToSend = '';

socket.on('connect', function () {
  getChatHandle();
  socket.on('broadcast', displayMessage);
});

const getChatHandle = function () {
  chatInterface.question(`Hello! What's your chat handle?`, function (answer) {
    chatHandle = answer;
    socket.emit('message', chatHanle + ' has entered the chat');
    chat();
  });
}

const chat = function () {
  chatInterface.question(chatHandle + ': ', function (message) {
    messageToSend = chatHandle + ': ' + message;
    socket.emit('message', messageToSend);
    chat();
  });
}

const displayMessage = function (message) {
  if (message !== messageToSend) {
    console.log('\n' + message);
    chat();
  }
}
