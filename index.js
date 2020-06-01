const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});

let users = [];

io.on('connect', (socket) => {
    let me;
    socket.emit('users', users);
    socket.on('login', (name, fn) => {
        for(var user of users){
            if (user==name) {
                fn('failed');
                return;
            }
        }
        me = name;
        users.push(me);
        io.emit('newUser', me);
        fn('success');
    });
    socket.on('logout', () => {
        if (me == null) {
            return;
        }
        let index = users.indexOf(me);
        users.splice(index, 1);
        io.emit('removeUser', me);
    });
    socket.on('disconnect', () => {
        if (me==null) {
            return;
        }
        let index = users.indexOf(me);
        users.splice(index, 1);
        socket.broadcast.emit('removeUser', me);
    });
});
