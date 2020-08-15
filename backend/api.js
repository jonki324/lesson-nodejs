const { getConnection } = require('./db')

async function setValue(req, res) {
  const client = await getConnection()
  await client.setAsync('hello', 'Hello Redis').then(() => {
    res.send(`SET OK`)
  }).catch((err) => {
    res.send(`SET NG ${err}`)
  }).finally(() => {
    client.quit()
  })
}

async function getValue(req, res) {
  const client = await getConnection()
  await client.getAsync('hello').then(result => {
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
