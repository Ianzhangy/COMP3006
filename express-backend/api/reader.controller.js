import ReaderDao from '../dao/reader.dao.js';

export default class ReaderController {
  
  // Get paginated readers with filtering options
  static async apiGetReaders(req, res, next) {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
    let filters = {};

    if (req.query.libraryCard) {
      filters.libraryCard = req.query.libraryCard;
    }

    if (req.query.username) {
      filters.username = req.query.username;
    }

    if (req.query.phone) {
      filters.phone = req.query.phone;
    }

    try {
      const { readersList, total } = await ReaderDao.getReaders(filters, page - 1, pageSize);

      let response = {
        data: readersList,
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

  // Get a reader by ID
  static async apiGetReaderById(req, res, next) {
    try {
      const readerId = req.query._id;
      const result = await ReaderDao.getReaderById(readerId);

      if (!result) {
        res.status(400).json({ error: 'Reader not found' });
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

  // Add a new reader
  static async apiAddReader(req, res, next) {
    try {
      const { libraryCard, username, realName, sex, phone, email, password } = req.body;
      const result = await ReaderDao.addReader({
        libraryCard,
        username,
        realName,
        sex,
        phone,
        email,
        password
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

  // Update a reader by ID
  static async apiUpdateReader(req, res, next) {
    try {
      const { _id, libraryCard, username, realName, sex, phone, email } = req.body;
      const newReader = {}
      if (libraryCard) {
        newReader.libraryCard = libraryCard;
      }
      if (username) {
        newReader.username = username;
      }
      if (realName) {
        newReader.realName = realName;
      }
      if (sex) {
        newReader.sex = sex;
      }
      if (phone) {
        newReader.phone = phone;
      }
      if (email) {
        newReader.email = email;
      }

      const result = await ReaderDao.updateReader(_id, newReader);
      if (result.error) {
        res.status(400).json({ error: result.error });
        return;
      }
      if (result.matchedCount === 0) {
        res.status(400).json({ error: 'Reader not found' });
        return;
      }

      res.json({ status: 'success', modifiedCount: result.modifiedCount });
    } catch (e) {
      console.log(`API Error: ${e}`);
      res.status(500).json({ error: e });
    }
  }

  // Delete a reader by ID
  static async apiDeleteReader(req, res, next) {
    try {
      const { _id } = req.body;
      const result = await ReaderDao.deleteReader(_id);
      if (result.error) {
        res.status(400).json({ error: result.error });
        return;
      }

      if (result.deletedCount === 0) {
        res.status(400).json({ error: 'Reader not found' });
        return;
      }

      res.json({ status: 'success', deletedCount: result.deletedCount });
    } catch (e) {
      console.log(`API Error: ${e}`);
      res.status(500).json({ error: e });
    }
  }
}
