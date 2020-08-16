const { getConnection } = require('./db')
const uuid = require('uuid')

async function getUser(req, res) {
  const key = req.params.userId
  const client = await getConnection()
  await client.hgetallAsync(key).then(value => {
    res.send({ msg: 'OK', user: value })
  }).catch(err => {
    res.send({ msg: err, user: null })
  }).finally(() => {
    client.quit()
  })
}

async function getAllUser(req, res) {
  const client = await getConnection()
  await client.keysAsync('*').then(keys => {
    Promise.all(keys.map(key => client.hgetallAsync(key))).then(values => {
      res.send({ msg: 'OK', users: values })
    })
  }).catch(err => {
    res.send({ msg: err, users: [] })
  }).finally(() => {
    client.quit()
  })
}

async function addUser(req, res) {
  const key = uuid.v4()
  const value = {
    id: key,
    name: req.body.name,
    email: req.body.email
  }
  const client = await getConnection()
  await client.hmsetAsync(key, value).then(() => {
    res.send({ msg: 'OK', userId: key })
  }).catch(err => {
    res.send({ msg: err, userId: ''})
  }).finally(() => {
    client.quit()
  })
}

async function modUser(req, res) {
  const key = req.params.userId
  const name = req.body.name
  const email = req.body.email
  const client = await getConnection()
  await client.hgetallAsync(key).then(async value => {
    value.name = name
    value.email = email
    await client.hmsetAsync(key, value).then(() => {
      res.send({ msg: 'OK', user: value })
    })
  }).catch(err => {
    res.send({ msg: err, user: null })
  }).finally(() => {
    client.quit()
  })
}

async function rmvUser(req, res) {
  const key = req.params.userId
  const client = await getConnection()
  await client.delAsync(key).then(result => {
    res.send({ msg: 'OK', count: result })
  }).catch(err => {
    res.send({ msg: err, userId: key})
  }).finally(() => {
    client.quit()
  })
}

module.exports = {
  getUser,
  getAllUser,
  addUser,
  modUser,
  rmvUser
}
