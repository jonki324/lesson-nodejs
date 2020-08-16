const express = require('express')
const bodyParser = require('body-parser');
const { getUser, getAllUser, addUser, modUser, rmvUser } = require('./api')
const app = express()

app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/api/users', getAllUser)

app.get('/api/users/:userId', getUser)

app.post('/api/users', addUser)

app.put('/api/users/:userId', modUser)

app.delete('/api/users/:userId', rmvUser)

module.exports = app;
