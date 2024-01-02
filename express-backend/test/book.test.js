import { expect } from 'chai';
import supertest from 'supertest';
import app from '../index.js';
const requestWithSupertest = supertest(app)


describe('Testing Book API Endpoints', () => {
  let categoryId = undefined
  const categoryName = "book-test" + new Date().getTime()

  before(async () => {
    let data = {
      "name": categoryName
    }
    const response = await requestWithSupertest.post('/api/v1/category').send(data)
    expect(response.status).to.equal(200)
    expect(response.body.status).to.equal('success')
    expect(response.body._id).to.not.be.undefined
    categoryId = response.body._id
  })

  after(async () => {
    let data = {
      "_id": categoryId,
    }
    const response = await requestWithSupertest.delete('/api/v1/category').send(data)
    expect(response.status).to.equal(200)
    expect(response.body.status).to.equal('success')
  })

  let bookId = undefined;
  const isbn = new Date().getTime();
  let book = {
    "isbn": isbn,
    "name": "Test Book",
    "categoryId": categoryId,
    "author": "Test Author",
    "price": 100,
    "language": "English"
  };

  it('Create book', async function () {

    const response = await requestWithSupertest.post('/api/v1/book').send(book);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.insertedId).to.not.be.undefined;
    bookId = response.body.insertedId;
  });

  it('Error when creating book with the same isbn', async function () {
    let data = Object.assign({}, book);
    
    const response = await requestWithSupertest.post('/api/v1/book').send(data);
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Book already exists');
  });

  const modifiedTitle = "Modified Book name";
  it('Update book', async function () {

    let data = {
      "_id": bookId,
      "name": modifiedTitle
    };

    const response = await requestWithSupertest.put('/api/v1/book').send(data);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
  });

  it('Error when updating book with non-existent ID', async function () {
    let data = {
      "_id": "non-existent-id",
      "name": modifiedTitle
    };

    const response = await requestWithSupertest.put('/api/v1/book').send(data);
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Invalid id');
  });

  it('Get book by ID', async function () {
    const response = await requestWithSupertest.get(`/api/v1/book/id?_id=${bookId}`);
    expect(response.status).to.equal(200);
    expect(response.body.name).to.equal(modifiedTitle);
    // Add assertions for other properties
  });

  it('Error when getting book with non-existent ID', async function () {
    const response = await requestWithSupertest.get('/api/v1/book/id?_id=non-existent-id');
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Invalid id');
  });

  it('Get all books', async function () {
    const response = await requestWithSupertest.get('/api/v1/book');
    expect(response.status).to.equal(200);
    expect(response.body.data.length).to.be.greaterThan(0);
  
  });

  // it('Get books with isbn', async () => {
  //   const response = await requestWithSupertest.get('/api/v1/book').query({ isbn: isbn });
  //   expect(response.status).to.equal(200);
  //   expect(response.body.data.length).to.be.equal(1);
  
  // })

  it('Delete book', async function () {
    let data = {
      "_id": bookId
    };

    const response = await requestWithSupertest.delete('/api/v1/book').send(data);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
  });

  it('Error when deleting book with non-existent ID', async function () {
    let data = {
      "_id": "non-existent-id"
    };

    const response = await requestWithSupertest.delete('/api/v1/book').send(data);
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Invalid id');
  });

});