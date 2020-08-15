const Promise = require('bluebird')
const redis = Promise.promisifyAll(require('redis'))

function getConnection() {
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
  
  return client
}

module.exports = {
  getConnection
}
