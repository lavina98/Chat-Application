$(function(){
    var socket = io.connect('http://localhost:4000');

    // var messages = document.getElementById('messages');
    var messages = $('#messages')
    var sendMessage = $('#sendMessage');
    var input = $("#in");
    var username = $('#username');
    var sendUsername=$('#sendUsername');
    //client sending message 
    sendMessage.click(() =>{
        console.log('sending message to server');
        console.log(input.val());
        socket.emit('new_message',{message:input.val()});
    })

    socket.on('new_message',(data)=>{
        console.log('got a new message from the server');
        console.log(messages);
        messages.append('<div><p>'+data.username+':'+data.message+ '</p></div>');
    })

    sendUsername.click(() =>{
        console.log('changind username');
        console.log(username.val());
        socket.emit('change_username',{username:username.val()});
    })

    input.bind('keypress',() =>{
        socket.emit('typing');
    })

    socket.on('typing',(data)=>{
        feedback.html('<p><i>'+data.username+' is typing</i></p>');
    })

    //new user joins so all other users are notified
    socket.on('new_user', (data)=>{
        messages.append('<div><p><i>'+data.username+' has joined the conversation </i></p></div>');
    })

    socket.on('notify_username_change',(data)=>{
        messages.append('<div><p><i>'+data.oldUsername+' has changed to'+ data.newUsername+' </i></p></div>');
    })
})