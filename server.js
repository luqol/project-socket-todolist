const express = require('express');
const path = require('path');
const tasks = require('./db/db');
const socket = require('socket.io');

const app = express();

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
  });

const server = app.listen( process.env.PORT || 8000, () => {
    console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client! Its id - ' + socket.id);

    io.to(socket.id).emit('updateData', tasks);

    socket.on('addTask', (task) => {
        tasks.push(task);
        socket.broadcast.emit('addTask', task);
    })

    socket.on('removeTask', (taskId) => {
        const index = tasks.findIndex( task => task.id === taskId);

        if( index !== -1){
            tasks.splice(index, 1);
            socket.broadcast.emit('removeTask', taskId);
        }
    });

    socket.on('disconnect', () => { console.log('Oh, socket ' + socket.id + ' has left') });
});
