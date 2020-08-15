const { client, getAsync, setAsync } = require('./db')

function setValue(req, res) {
  setAsync('hello', 'Hello Redis').then(() => {
    res.send(`SET OK`)
  }).catch((err) => {
    res.send(`SET NG ${err}`)
  }).finally(() => {
    client.quit()
  })
}

function getValue(req, res) {
  getAsync('hello').then(result => {
    res.send(`GET OK ${result}`)
  }).catch((err) => {
    res.send(`SET NG ${err}`)
  }).finally(() => {
    client.quit()
  })
}

module.exports = {
  setValue,
  getValue
}
