import { expect } from 'chai'
import supertest from 'supertest'
import app from '../index.js'

const requestWithSupertest = supertest(app)
describe('Testing Reader API Endpoints', () => {

  let newReaderId = undefined;
  const newLibraryCard = "9876543210";
  const newUsername = "newUser987";

  it('Create reader', async function () {
    // 创建一个新的读者
    const newReaderData = {
      "libraryCard": newLibraryCard,
      "username": newUsername,
      "realName": "New User",
      "sex": "Female",
      "phone": "987654321",
      "email": "newuser@example.com"
    };

    const response = await requestWithSupertest.post('/api/v1/reader').send(newReaderData);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.insertedId).to.not.be.undefined;
    newReaderId = response.body.insertedId;
  });

  it('Error when creating reader with existing library card', async function () {
    const data = {
      "libraryCard": newLibraryCard,
      "username": "uniqueUser",
      "realName": "Unique User",
      "sex": "Male",
      "phone": "123456789",
      "email": "uniqueuser@example.com"
    };

    const response = await requestWithSupertest.post('/api/v1/reader').send(data);
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Reader already exists');
  });

  it('Update reader', async function () {
    const data = {
      "_id": newReaderId,
      "username": "UpdatedUser"
    };

    const response = await requestWithSupertest.put('/api/v1/reader').send(data);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
  });

  it('Error when updating non-existent reader ID', async function () {
    const data = {
      "_id": "non-existent-id",
      "username": "UpdatedUser"
    };

    const response = await requestWithSupertest.put('/api/v1/reader').send(data);
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Invalid id');
  });

  it('Get reader by ID', async function () {
    const response = await requestWithSupertest.get(`/api/v1/reader/id?_id=${newReaderId}`);
    expect(response.status).to.equal(200);
    expect(response.body.username).to.equal('UpdatedUser');
  });

  it('Error when getting reader with non-existent ID', async function () {
    const response = await requestWithSupertest.get('/api/v1/reader/id?_id=non-existent-id');
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Invalid id');
  });

  it('Get all readers', async function () {
    const response = await requestWithSupertest.get('/api/v1/reader');
    expect(response.status).to.equal(200);
    expect(response.body.data.length).to.be.greaterThan(0);
  });

  it('Delete reader', async function () {
    const data = {
      "_id": newReaderId
    };

    const response = await requestWithSupertest.delete('/api/v1/reader').send(data);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
  });

  it('Error when deleting reader with non-existent ID', async function () {
    const data = {
      "_id": "non-existent-id"
    };

    const response = await requestWithSupertest.delete('/api/v1/reader').send(data);
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Invalid id');
  });
});
