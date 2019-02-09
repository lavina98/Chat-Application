
var SimpleCrypto = require('simple-crypto-js').default;
const express = require('express');
const app = express();
const server = app.listen(4000, () =>{
    console.log('server listening on port 4000');
});
//setting the view engine
app.set('view engine','ejs');

//to serve ejs pages
app.use(express.static('public'));

app.get('/',(req,res) =>{
    res.render('index');
})

//login api
app.post('/login',(req,res)=>{
    console.log('here');
})

//initialize socket.io
const io = require('socket.io') (server);
//listening to connections
io.on('connection', (socket) =>{
    console.log('new user connected');
    socket.username = 'anon';

    //notifying others of a newly joined user
    socket.broadcast.emit('new_user',{username:socket.username});


    //user name changed by client
    socket.on('change_username',(data)=>{
        console.log(data);
        var prevUsername = socket.username;
        socket.username = data.username;
        console.log(socket.username);
        socket.broadcast.emit('notify_username_change',{
            oldUsername:prevUsername,
            newUsername:socket.username});
    }) 
    //new  message received by server
    socket.on('new_message',(data)=>{
        console.log('received message from client')
        //sending to all client
        console.log(data);
        io.sockets.emit('new_message',{username: socket.username ,message:data.message});
    })

    //typing message
    socket.on('typing', (data) =>{
        socket.broadcast.emit('typing',{username:socket.username});
    })
})

