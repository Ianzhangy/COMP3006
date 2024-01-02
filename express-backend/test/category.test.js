import { expect } from 'chai'
import supertest from 'supertest'
import app from '../index.js'

const requestWithSupertest = supertest(app)
// test for /api/v1/category crud

describe('Testing Category API Endpoints', function () {
  let categoryId = undefined
  const categoryName = "Test Category" + new Date().getTime()
  it('create category', async function () {
    let data = {
      "name": categoryName,
      "description": "test category"
    }
    const response = await requestWithSupertest.post('/api/v1/category').send(data)
    expect(response.status).to.equal(200)
    expect(response.body.status).to.equal('success')
    expect(response.body._id).to.not.be.undefined
    categoryId = response.body._id
  })

  it('error when create category with same name', async function () {
    let data = {
      "name": categoryName
    }
    const response = await requestWithSupertest.post('/api/v1/category').send(data)
    expect(response.status).to.equal(400)
    expect(response.body.error).to.equal('Category already exists')
  })

  const modifyCategoryName = "Test Category Modified" + new Date().getTime()
  it('update category', async function () {
    let data = {
      "_id": categoryId,
      "name": modifyCategoryName,
      "description": "test category"
    }
    const response = await requestWithSupertest.put('/api/v1/category').send(data)
    expect(response.status).to.equal(200)
    expect(response.body.status).to.equal('success')
  })

  it('error when update category with not exist id', async function () {
    let data = {
      "_id": "not exist id",
      "name": modifyCategoryName,
      "description": "test category"
    }
    const response = await requestWithSupertest.put('/api/v1/category').send(data)
    expect(response.status).to.equal(400)
    expect(response.body.status).to.equal('error')
  })

  it('successfully updates category name', async function () {
    const response = await requestWithSupertest.get('/api/v1/category/id').query({ _id: categoryId })
    expect(response.status).to.equal(200)
    expect(response.body.name).to.equal(modifyCategoryName)

  })

  it('error when get category with not exist id', async function () {
    const response = await requestWithSupertest.get('/api/v1/category/id').query({ _id: 'not exist id' })
    expect(response.status).to.equal(400)
    expect(response.body.error).to.equal('not found')

  })

  it('find all', async function () {
    const response = await requestWithSupertest.get('/api/v1/category/all')
    expect(response.status).to.equal(200)
    expect(response.body.length).to.be.greaterThan(0)
  })

  it('find by name', async function () {
    const response = await requestWithSupertest.get('/api/v1/category').query({ name: 'Test Category modified' })
    expect(response.status).to.equal(200)
    expect(response.body.data.length).to.be.greaterThan(0)
    expect(response.body.page).to.equal(1)
    expect(response.body.pageSize).to.equal(20)
    expect(response.body.total).to.be.be.greaterThan(0)
  })

  it('delete category', async function () {
    let data = {
      "_id": categoryId,
    }
    const response = await requestWithSupertest.delete('/api/v1/category').send(data)
    expect(response.status).to.equal(200)
    expect(response.body.status).to.equal('success')
  })

  it('error when delete category with not exist id', async function () {
    let data = {
      "_id": "not exist id",
    }
    const response = await requestWithSupertest.delete('/api/v1/category').send(data)
    expect(response.status).to.equal(400)
    expect(response.body.status).to.equal('error')
  })

})


