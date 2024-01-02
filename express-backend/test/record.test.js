import { expect } from 'chai';
import supertest from 'supertest';
import app from '../index.js';

const requestWithSupertest = supertest(app);

describe('Testing Record API Endpoints', () => {
  let recordId = undefined;

  const record = {
    "libraryCard": "123456",
    "bookName": "Test Book",
    "readerName": "Test Reader",
    "borrowDate": "2023-01-01",
    "returnDate": "2023-01-07",
    "status": "borrowed"
  };

  it('Create record', async function () {
    const response = await requestWithSupertest.post('/api/v1/record').send(record);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.insertedId).to.not.be.undefined;
    recordId = response.body.insertedId;
  });

  const modifiedStatus = "returned";
  it('Update record', async function () {
    let data = {
      "_id": recordId,
      "status": modifiedStatus
    };

    const response = await requestWithSupertest.put('/api/v1/record').send(data);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
  });

  it('Error when updating record with non-existent ID', async function () {
    let data = {
      "_id": "non-existent-id",
      "status": modifiedStatus
    };

    const response = await requestWithSupertest.put('/api/v1/record').send(data);
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Invalid id');
  });

  it('Get record by ID', async function () {
    const response = await requestWithSupertest.get(`/api/v1/record/id?_id=${recordId}`);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal(modifiedStatus);
    // Add assertions for other properties
  });

  it('Error when getting record with non-existent ID', async function () {
    const response = await requestWithSupertest.get('/api/v1/record/id?_id=non-existent-id');
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Invalid id');
  });

  it('Get all records', async function () {
    const response = await requestWithSupertest.get('/api/v1/record');
    expect(response.status).to.equal(200);
    expect(response.body.data.length).to.be.greaterThan(0);
    // Add assertions for total records
  });

  it('Delete record', async function () {
    let data = {
      "_id": recordId
    };

    const response = await requestWithSupertest.delete('/api/v1/record').send(data);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
  });

  it('Error when deleting record with non-existent ID', async function () {
    let data = {
      "_id": "non-existent-id"
    };

    const response = await requestWithSupertest.delete('/api/v1/record').send(data);
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Invalid id');
  });
});
