import mongodb from 'mongodb'

const ObjectId = mongodb.ObjectId
let books

// isbn name categoryId author price language status
export default class BookDao {
  static async injectDB(conn) {
    if (books) {
      return
    }
    try {
      books = await conn.db(process.env.COLLECTION).collection('books')
    } catch (e) {
      console.error(`Unable to connect to BookDao: ${e}`)
    }
  }
  static async getBookCount() {
    try {
      return await books.countDocuments();
    } catch (e) {
      console.error(`Unable to get book count: ${e}`);
      throw e;
    }
  }
  static async getBorrowedBookCount() {
    try {
      return await books.countDocuments({ status: 'borrowed' });
    } catch (e) {
      console.error(`Unable to get borrowed book count: ${e}`);
      throw e;
    }
  }
  // Create a new book
  static async addBook(book) {
    try {
      // check isbn already exists
      const exist = await books.findOne({ isbn: book.isbn })
      if (exist) {
        return { error: 'Book already exists' }
      }
      return await books.insertOne(book)
    } catch (e) {
      console.error(`Unable to add book: ${e}`)
      throw e
    }
  }

  // Update a book by ID
  static async updateBook(bookId, update) {
    try {
      // check id is valid
      if (!ObjectId.isValid(bookId)) {
        return { error: 'Invalid id' }
      }
      // check id is exist
      const book = await books.findOne({ _id: new ObjectId(bookId) })
      if (!book) {
        return { error: 'Book not found' }
      }
      // check isbn already exists
      const exist = await books.findOne({ isbn: update.isbn })
      if (exist != null && exist._id.toString() !== bookId) {
        return { error: 'Book already exists' }
      }
      return await books.updateOne(
        { _id: new ObjectId(bookId) },
        { $set: update }
      )
    } catch (e) {
      console.error(`Unable to update book: ${e}`)
      throw e
    }
  }

  // Delete a book by ID
  static async deleteBook(bookId) {
    try {
      // check id is valid
      if (!ObjectId.isValid(bookId)) {
        return { error: 'Invalid id' }
      }
      return await books.deleteOne({ _id: new ObjectId(bookId) })
    } catch (e) {
      console.error(`Unable to delete book: ${e}`)
      throw e
    }
  }

  // Get paginated books
  static async getBooks( filters = {}, page = 0, pageSize = 20, ) {
    let query = {};
    if (filters.isbn) {
      query.isbn = { $regex: `.*${filters.isbn}.*`, $options: 'i' };
    }
    if (filters.name) {
      query.name = { $regex: `.*${filters.name}.*`, $options: 'i' };
    }

    if (filters.categoryId) {
      query.categoryId = filters.categoryId;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    let cursor;
    try {
      cursor = await books
        .find(query)
        .limit(pageSize)
        .skip(pageSize * page);

      const booksList = await cursor.toArray()
      const total = await books.countDocuments(query)

      return { booksList, total }
    } catch (e) {
      console.error(`Unable to get books: ${e}`)
      return { booksList: [], total: 0 }
    }
  }

  // Get book by ID
  static async getBookById(bookId) {
    try {
      // check id is valid
      if (!ObjectId.isValid(bookId)) {
        return { error: 'Invalid id' }
      }
      return await books.findOne({ _id: new ObjectId(bookId) })
    } catch (e) {
      console.error(`Unable to get book by ID: ${e}`)
      throw e
    }
  }
}
