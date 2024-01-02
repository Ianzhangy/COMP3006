import mongodb from 'mongodb'

const ObjectId = mongodb.ObjectId
let readers

// 
export default class ReaderDao {
  static async injectDB(conn) {
    if (readers) {
      return
    }
    try {
      readers = await conn.db(process.env.COLLECTION).collection('readers')
    } catch (e) {
      console.error(`Unable to connect to ReaderDao: ${e}`)
    }
  }

  static async getReaderCount() {
    try {
      return await readers.countDocuments();
    } catch (e) {
      console.error(`Unable to get reader count: ${e}`);
      throw e;
    }
  }
  // Create a new reader
  static async addReader(reader) {
    try {
      // check if libraryCard already exists
      const exist = await readers.findOne({ libraryCard: reader.libraryCard })
      if (exist) {
        return { error: 'Reader already exists' }
      }
      return await readers.insertOne(reader)
    } catch (e) {
      console.error(`Unable to add reader: ${e}`)
      throw e
    }
  }

  // Update a reader by ID
  static async updateReader(readerId, update) {
    try {
      // check if id is valid
      if (!ObjectId.isValid(readerId)) {
        return { error: 'Invalid id' }
      }
      // check if id exists
      const reader = await readers.findOne({ _id: new ObjectId(readerId) })
      if (!reader) {
        return { error: 'Reader not found' }
      }
      // check if libraryCard already exists
      const exist = await readers.findOne({ libraryCard: update.libraryCard })
      if (exist != null && exist._id.toString() !== readerId) {
        return { error: 'Reader already exists' }
      }
      return await readers.updateOne(
        { _id: new ObjectId(readerId) },
        { $set: update }
      )
    } catch (e) {
      console.error(`Unable to update reader: ${e}`)
      throw e
    }
  }

  // Delete a reader by ID
  static async deleteReader(readerId) {
    try {
      // check if id is valid
      if (!ObjectId.isValid(readerId)) {
        return { error: 'Invalid id' }
      }
      return await readers.deleteOne({ _id: new ObjectId(readerId) })
    } catch (e) {
      console.error(`Unable to delete reader: ${e}`)
      throw e
    }
  }

  // Get paginated readers with filtering options
  static async getReaders(filters = {}, page = 0, pageSize = 20) {
    let query = {};
    if (filters.libraryCard) {
      query.libraryCard = { $regex: `.*${filters.libraryCard}.*`, $options: 'i' };
    }
    if (filters.username) {
      query.username = { $regex: `.*${filters.username}.*`, $options: 'i' };
    }
    if (filters.phone) {
      query.phone = { $regex: `.*${filters.phone}.*`, $options: 'i' };
    }

    let cursor;
    try {
      cursor = await readers
        .find(query)
        .limit(pageSize)
        .skip(pageSize * page);

      const readersList = await cursor.toArray()
      const total = await readers.countDocuments(query)

      return { readersList, total }
    } catch (e) {
      console.error(`Unable to get readers: ${e}`)
      return { readersList: [], total: 0 }
    }
  }

  static async getReaderByLibraryCard(libraryCard) {
    try {
      return await readers.findOne({ 
        libraryCard
       });
    } catch (e) {
      console.error(`Unable to get reader by libraryCard: ${e}`);
      throw e;
    }
  }

  // Get reader by ID
  static async getReaderById(readerId) {
    try {
      // check if id is valid
      if (!ObjectId.isValid(readerId)) {
        return { error: 'Invalid id' }
      }
      return await readers.findOne({ _id: new ObjectId(readerId) })
    } catch (e) {
      console.error(`Unable to get reader by ID: ${e}`)
      throw e
    }
  }
}
