import BookDao from "../dao/book.dao.js";
import ReaderDao from "../dao/reader.dao.js";

export default class CommonController {
  static async apiGetHomeInfo(req, res, next) {
    try{
      const readerCount = await ReaderDao.getReaderCount();
      const bookCount = await BookDao.getBookCount();
      const borrowedBookCount = await BookDao.getBorrowedBookCount();

      res.json({
        readerCount,
        bookCount,
        borrowedBookCount
      })
    }catch(e){
      console.error(`API Error: ${e}`);
      res.status(500).json({ error: e });
    }
  }
}