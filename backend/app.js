const express = require('express')
const { setValue, getValue } = require('./api')
const app = express()

app.get('/', setValue)

app.get('/get', getValue)

module.exports = app;
