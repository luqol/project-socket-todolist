const express = require('express');
const path = require('path');
const db = require('./db/db');
const socket = require('socket.io');

const app = express();

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
  });

const server = app.listen( process.env.PORT || 8000, () => {
    console.log('Server is running on port: 8000');
});

const io = socket(server);

