import RecordDAO from '../dao/record.dao.js';

export default class RecordController {

  static async apiAddRecord(req, res, next) {
    try {
      const { libraryCard, bookName, readerName, borrowDate, returnDate } = req.body;
      const result = await RecordDAO.addRecord({
        libraryCard,
        bookName,
        readerName,
        borrowDate,
        returnDate,
        status: "Borrowing"
      });

      res.json({ status: 'success', insertedId: result.insertedId });
    } catch (e) {
      console.error(`API Error: ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiUpdateRecord(req, res, next) {
    try {
      const { _id, libraryCard, bookName, readerName, borrowDate, returnDate, status } = req.body;
      const newRecord = {};

      if (libraryCard) {
        newRecord.libraryCard = libraryCard;
      }
      if (bookName) {
        newRecord.bookName = bookName;
      }
      if (readerName) {
        newRecord.readerName = readerName;
      }
      if (borrowDate) {
        newRecord.borrowDate = borrowDate;
      }
      if (returnDate) {
        newRecord.returnDate = returnDate;
      }
      if (status) {
        newRecord.status = status;
      }

      const result = await RecordDAO.updateRecord(_id, newRecord);
      if (result.error) {
        res.status(400).json({ error: result.error });
        return;
      }
      if (result.matchedCount === 0) {
        res.status(400).json({ error: 'Record not found' });
        return;
      }

      res.json({ status: 'success', modifiedCount: result.modifiedCount });
    } catch (e) {
      console.error(`API Error: ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiDeleteRecord(req, res, next) {
    try {
      const { _id } = req.body;
      const result = await RecordDAO.deleteRecord(_id);
      if (result.error) {
        res.status(400).json({ error: result.error });
        return;
      }

      if (result.deletedCount === 0) {
        res.status(400).json({ error: 'Record not found' });
        return;
      }

      res.json({ status: 'success', deletedCount: result.deletedCount });
    } catch (e) {
      console.error(`API Error: ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiGetRecords(req, res, next) {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
    let filters = {};

    if (req.query.libraryCard) {
      filters.libraryCard = req.query.libraryCard;
    }

    if (req.query.bookName) {
      filters.bookName = req.query.bookName;
    }

    if (req.query.status){
      filters.status = req.query.status;
    }

    if (res.locals.userType && res.locals.userType === 'reader') {
      filters.libraryCard = res.locals.userInfo.libraryCard;
    }

    try {
      const { recordsList, total } = await RecordDAO.getRecords(filters, page - 1, pageSize);

      let response = {
        data: recordsList,
        page: page,
        pageSize: pageSize,
        total: total
      };

      res.json(response);
    } catch (e) {
      console.error(`API Error: ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiGetRecordById(req, res, next) {
    try {
      const recordId = req.query._id;
      const result = await RecordDAO.getRecordById(recordId);

      if (!result) {
        res.status(400).json({ error: 'Record not found' });
        return;
      }

      if (result.error) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.json(result);
    } catch (e) {
      console.error(`API Error: ${e}`);
      res.status(500).json({ error: e });
    }
  }
}
