const { promisify } = require('util')
const redis = require('redis')
const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis Connect')
})
client.on('error', err => {
  console.error(`Redis Error: ${err}`)
})
client.on('end', () => {
  console.log('Redis End')
})

const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)

module.exports = {
  client,
  getAsync,
  setAsync
}
