import BookDao from '../dao/book.dao.js';
import RecordDAO from '../dao/record.dao.js';
export default class BookController {

  static async apiBorrowBook(req, res, next) {
    try {
      const { _id } = req.body;
      const result = await BookDao.getBookById(_id);
      if (result.error) {
        res.status(400).json({ error: result.error });
        return;
      }
      if (result.matchedCount === 0) {
        res.status(400).json({ error: 'Book not found' });
        return;
      }
      // check status
      if (result.status !== 'inStock') {
        res.status(400).json({ error: 'Book is borrowed' });
        return;
      }

      // update book status
      const newBook = {};
      newBook.status = 'borrowed';
      const updateStatusRes = await BookDao.updateBook(_id, newBook);
      if (updateStatusRes.error) {
        res.status(400).json({ error: updateStatusRes.error });
        return;
      }
      if (updateStatusRes.matchedCount === 0) {
        res.status(400).json({ error: 'Book not found' });
        return;
      }
      // add record
      const newRecord = {
        libraryCard: res.locals.userInfo.libraryCard,
        bookName: result.name,
        bookId: result._id,
        userId: res.locals.userInfo._id,
        readerName: res.locals.userInfo.realName,
        borrowDate: new Date(),
        status: 'borrowing'
      };
      const addRecordRes = await RecordDAO.addRecord(newRecord);
      if (addRecordRes.error) {
        res.status(400).json({ error: addRecordRes.error });
        return;
      }
      res.json({ status: 'success', insertedId: addRecordRes.insertedId });
    } catch (e) {
      console.error(`API Error: ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiReturnBook(req, res, next) {
    try{
      const { _id } = req.body;
      // check record
      const record = await RecordDAO.getRecordById(_id);
      if (record.error) {
        res.status(400).json({ error: record.error });
        return;
      }
      if (record.matchedCount === 0) {
        res.status(400).json({ error: 'Record not found' });
        return;
      }
      if (record.status !== 'borrowing') {
        res.status(400).json({ error: 'Record is not borrowing' });
        return;
      }
      // update record
      const newRecord = {};
      newRecord.status = 'returned';
      newRecord.returnDate = new Date();
      const updateRecordRes = await RecordDAO.updateRecord(_id, newRecord);
      if (updateRecordRes.error) {
        res.status(400).json({ error: updateRecordRes.error });
        return;
      }
      if (updateRecordRes.matchedCount === 0) {
        res.status(400).json({ error: 'Record not found' });
        return;
      }
      // update book status
      const bookId = record.bookId;
      const newBook = {};
      newBook.status = 'inStock';
      const updateBookRes = await BookDao.updateBook(bookId, newBook);
      if (updateBookRes.error) {
        res.status(400).json({ error: updateBookRes.error });
        return;
      }
      if (updateBookRes.matchedCount === 0) {
        res.status(400).json({ error: 'Book not found' });
        return;
      }
      res.json({ status: 'success', modifiedCount: updateBookRes.modifiedCount });
    }catch(e){
      console.error(`API Error: ${e}`);
      res.status(500).json({ error: e });
    }
  }

  // Get paginated books with filtering options
  static async apiGetBooks(req, res, next) {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
    let filters = {};

    if (req.query.isbn) {
      filters.isbn = req.query.isbn;
    }

    if (req.query.name) {
      filters.name = req.query.name;
    }

    if (req.query.categoryId) {
      filters.categoryId = req.query.categoryId;
    }

    if (req.query.status){
      filters.status = req.query.status;
    }

    try {
      const { booksList, total } = await BookDao.getBooks(filters, page - 1, pageSize);

      let response = {
        data: booksList,
        page: page,
        pageSize: pageSize,
        total: total
      };

      res.json(response);
    } catch (e) {
      console.log(`API Error: ${e}`);
      res.status(500).json({ error: e });
    }
  }

  // Get a book by ID
  static async apiGetBookById(req, res, next) {
    try {
      const bookId = req.query._id;
      const result = await BookDao.getBookById(bookId);

      if (!result) {
        res.status(400).json({ error: 'Book not found' });
        return;
      }

      if (result.error) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.json(result);
    } catch (e) {
      console.log(`API Error: ${e}`);
      res.status(500).json({ error: e });
    }
  }

  // Add a new book
  static async apiAddBook(req, res, next) {
    try {
      const { isbn, name, categoryId, author, price, language, cover } = req.body;
      const result = await BookDao.addBook({
        isbn,
        name,
        categoryId,
        author,
        price,
        language,
        cover,
        status: 'inStock'
      });
      if (result.error) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json({ status: 'success', insertedId: result.insertedId });
    } catch (e) {
      console.log(`API Error: ${e}`);
      res.status(500).json({ error: e });
    }
  }

  // Update a book by ID
  static async apiUpdateBook(req, res, next) {
    try {
      const { _id, isbn, name, categoryId, author, price, language, cover } = req.body;
      const newBook = {}
      if (isbn) {
        newBook.isbn = isbn;
      }
      if (name) {
        newBook.name = name;
      }
      if (categoryId) {
        newBook.categoryId = categoryId;
      }
      if (author) {
        newBook.author = author;
      }
      if (price) {
        newBook.price = price;
      }
      if (language) {
        newBook.language = language;
      }
      if (cover) {
        newBook.cover = cover;
      }

      const result = await BookDao.updateBook(_id, newBook);
      if (result.error) {
        res.status(400).json({ error: result.error });
        return;
      }
      if (result.matchedCount === 0) {
        res.status(400).json({ error: 'Book not found' });
        return;
      }

      res.json({ status: 'success', modifiedCount: result.modifiedCount });
    } catch (e) {
      console.log(`API Error: ${e}`);
      res.status(500).json({ error: e });
    }
  }

  // Delete a book by ID
  static async apiDeleteBook(req, res, next) {
    try {
      const { _id } = req.body;
      const result = await BookDao.deleteBook(_id);
      if (result.error) {
        res.status(400).json({ error: result.error });
        return;
      }

      if (result.deletedCount === 0) {
        res.status(400).json({ error: 'Book not found' });
        return;
      }

      res.json({ status: 'success', deletedCount: result.deletedCount });
    } catch (e) {
      console.log(`API Error: ${e}`);
      res.status(500).json({ error: e });
    }
  }
}
