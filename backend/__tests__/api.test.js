const request = require('supertest')
const app = require('../app')
const db = require('../db')

let userId = '';
const testUser1 = {name: '田中太郎', email: 'taro@example.com'}
const testUser2 = {name: '田中太郎2', email: 'taro2@example.com'}
const testUser3 = {name: '鈴木一郎', email: 'ichiro@example.com'}

describe('/api/users ユーザーAPIテスト', () => {
  beforeAll(async () => {
    const client = await db.getConnection()
    await client.keysAsync('*').then(async keys => {
      await Promise.all(keys.map(key => client.delAsync(key))).then(result => {
      })
    }).catch(err => {
      console.error(err)
    }).finally(async () => {
      await client.quit()
    })
  })
  test('POST 1ユーザー登録', async () => {
    const response = await request(app).post('/api/users').type('application/x-www-form-urlencoded').send(testUser1)
    expect(response.statusCode).toBe(201)
    expect(response.body.userId).not.toBeNull()
    userId = response.body.userId
  })
  test('GET 1ユーザー取得', async () => {
    const response = await request(app).get('/api/users/' + userId)
    expect(response.statusCode).toBe(200)
    expect(response.body.user).not.toBeNull()
    expect(response.body.user.id).toMatch(userId)
    expect(response.body.user.name).toMatch(testUser1.name)
    expect(response.body.user.email).toMatch(testUser1.email)
  })
  test('PUT 1ユーザー更新', async () => {
    const response = await request(app).put('/api/users/' + userId).type('application/x-www-form-urlencoded').send(testUser2)
    expect(response.statusCode).toBe(200)
    expect(response.body.userId).not.toBeNull()
    expect(response.body.user.id).toMatch(userId)
    expect(response.body.user.name).toMatch(testUser2.name)
    expect(response.body.user.email).toMatch(testUser2.email)
  })
  test('GET 全ユーザー取得', async () => {
    testUser2.id = userId
    await request(app).post('/api/users').type('application/x-www-form-urlencoded').send(testUser3)
    const response = await request(app).get('/api/users')
    expect(response.statusCode).toBe(200)
    expect(response.body.users).not.toBeNull()
    expect(response.body.users.length).toBe(2)
    expect(response.body.users).toContainEqual(testUser2)
  })
  test('DELETE 1ユーザー削除', async () => {
    const response = await request(app).delete('/api/users/' + userId)
    expect(response.statusCode).toBe(200)
    expect(response.body.resultCount).toBe(1)
    const response2 = await request(app).get('/api/users')
    expect(response2.body.users.length).toBe(1)
    expect(response2.body.users).not.toContainEqual(testUser2)
  })
})
