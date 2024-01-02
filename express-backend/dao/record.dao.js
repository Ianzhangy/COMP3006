import mongodb from 'mongodb'

const ObjectId = mongodb.ObjectId
let records

export default class RecordDAO {
  static async injectDB(conn) {
    if (records) {
      return
    }
    try {
      records = await conn.db(process.env.COLLECTION).collection('records')
    } catch (e) {
      console.error(`Unable to connect to RecordDAO: ${e}`)
    }
  }

  static async addRecord(record) {
    try {
      return await records.insertOne(record)
    } catch (e) {
      console.error(`Unable to add record: ${e}`)
      throw e
    }
  }

  static async updateRecord(recordId, update) {
    try {
      if (!ObjectId.isValid(recordId)) {
        return { error: 'Invalid id' }
      }

      const record = await records.findOne({ _id: new ObjectId(recordId) })
      if (!record) {
        return { error: 'Record not found' }
      }

      return await records.updateOne(
        { _id: new ObjectId(recordId) },
        { $set: update }
      )
    } catch (e) {
      console.error(`Unable to update record: ${e}`)
      throw e
    }
  }

  static async deleteRecord(recordId) {
    try {
      if (!ObjectId.isValid(recordId)) {
        return { error: 'Invalid id' }
      }
      return await records.deleteOne({ _id: new ObjectId(recordId) })
    } catch (e) {
      console.error(`Unable to delete record: ${e}`)
      throw e
    }
  }

  static async getRecords(filters = {}, page = 0, pageSize = 20) {
    let query = {};

    if (filters.libraryCard) {
      query.libraryCard = filters.libraryCard;
    }

    if (filters.bookName) {
      query.bookName = { $regex: `.*${filters.bookName}.*`, $options: 'i' };
    }

    if (filters.status) {
      query.status = filters.status;
    }

    let cursor;
    try {
      cursor = await records
        .find(query)
        .limit(pageSize)
        .skip(pageSize * page);

      const recordsList = await cursor.toArray()
      const total = await records.countDocuments(query)

      return { recordsList, total }
    } catch (e) {
      console.error(`Unable to get records: ${e}`)
      return { recordsList: [], total: 0 }
    }
  }

  static async getRecordById(recordId) {
    try {
      if (!ObjectId.isValid(recordId)) {
        return { error: 'Invalid id' }
      }
      return await records.findOne({ _id: new ObjectId(recordId) })
    } catch (e) {
      console.error(`Unable to get record by ID: ${e}`)
      throw e
    }
  }
}
