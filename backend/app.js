const express = require('express')
const redis = require('redis')
const app = express()
const port = 3000

const client = redis.createClient();
client.on('connect', () => {
  console.log('Redis Connect')
})
client.on('error', err => {
  console.error(`Redis Error: ${err}`)
})

app.get('/', (req, res) => {
  client.set('hello', 'Hello Redis')
  res.send('Hello World!')
})

app.get('/hello', (req, res) => {
  client.get('hello', (err, result) => {
    if (err) {
      console.error(error)
    }
    console.log(result)
  })
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})
