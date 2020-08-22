const { getConnection } = require('./db')
const uuid = require('uuid')

async function getUser(req, res) {
  let statusCode = 500
  const data = {user: null}
  const key = req.params.userId
  const client = await getConnection()
  await client.hgetallAsync(key).then(value => {
    if (value === null) {
      statusCode = 404
    } else {
      statusCode = 200
      data.user = value
    }
  }).catch(err => {
    statusCode = 503
    console.error(err)
  }).finally(async () => {
    await client.quit()
  })
  res.status(statusCode).send(data)
}

async function getAllUser(req, res) {
  let statusCode = 500
  const data = {users: []}
  const client = await getConnection()
  await client.keysAsync('*').then(async keys => {
    await Promise.all(keys.map(key => client.hgetallAsync(key))).then(values => {
      statusCode = 200
      data.users = values
    })
  }).catch(err => {
    statusCode = 503
    console.error(err)
  }).finally(async () => {
    await client.quit()
  })
  res.status(statusCode).send(data)
}

async function addUser(req, res) {
  let statusCode = 500
  const data = {userId: null}
  const key = uuid.v4()
  const value = {
    id: key,
    name: req.body.name,
    email: req.body.email
  }
  const client = await getConnection()
  await client.hmsetAsync(key, value).then(() => {
    statusCode = 201
    data.userId = key
  }).catch(err => {
    statusCode = 503
    console.error(err)
  }).finally(async () => {
    await client.quit()
  })
  res.status(statusCode).send(data)
}

async function modUser(req, res) {
  let statusCode = 500
  const data = {user: null}
  const key = req.params.userId
  const name = req.body.name
  const email = req.body.email
  const client = await getConnection()
  await client.hgetallAsync(key).then(async value => {
    if (value === null) {
      statusCode = 404
    } else {
      value.name = name
      value.email = email
      await client.hmsetAsync(key, value).then(result => {
        statusCode = 200
        data.user = value
      })
    }
  }).catch(err => {
    statusCode = 503
    console.error(err)
  }).finally(async () => {
    await client.quit()
  })
  res.status(statusCode).send(data)
}

async function rmvUser(req, res) {
  let statusCode = 500
  const data = {resultCount: 0}
  const key = req.params.userId
  const client = await getConnection()
  await client.hgetallAsync(key).then(async value => {
    if (value === null) {
      statusCode = 404
    } else {
      await client.delAsync(key).then(result => {
        statusCode = 200
        data.resultCount = result
      })
    }
  }).catch(err => {
    statusCode = 503
    console.error(err)
  }).finally(async () => {
    await client.quit()
  })
  res.status(statusCode).send(data)
}

module.exports = {
  getUser,
  getAllUser,
  addUser,
  modUser,
  rmvUser
}
