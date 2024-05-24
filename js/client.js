const socket = io('http://localhost:5522');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('message');
const messageContainer = document.querySelector('.container');

function scrollToBottom() {
    var chatContainer = document.getElementById('chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
let audio;

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement)
    if(position == 'right'){
        audio = new Audio('message_sent.mp3');
        audio.play();
    }
    else{
        audio = new Audio('message_receiver.mp3');
        audio.play();
    }
    scrollToBottom();
}

form.addEventListener('submit', (e)=> {
    e.preventDefault();
    const message = messageInput.value;

    if(message === ''){
        alert('Please, enter something..')
    }else{
        append(`${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
})

const username = prompt("Enter your name : ");
socket.emit('new-user-joined', username);

socket.on('user-joined', name => {
    append(`${name} joined the chat.`, 'center');
});

socket.on('receive', data => {
    append(`${data.name} : ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name} left the chat.`, 'center');
});