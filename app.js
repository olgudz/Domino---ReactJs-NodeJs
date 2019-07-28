const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: false,
    cookie: {maxAge:269999999999}
  }))
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "build")));

const loginRoutes = require('./server/routes/login');
const lobbyRoutes = require('./server/routes/lobby');
const gameRoutes = require('./server/routes/game');

app.use('/users', loginRoutes);
app.use('/lobby', lobbyRoutes);
app.use('/game', gameRoutes);

app.listen(3000, console.log('Example app listening on port 3000!'));