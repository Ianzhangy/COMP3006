import jwt from 'jsonwebtoken';
import AdminDao from '../dao/admin.dao.js';
import ReaderDao from '../dao/reader.dao.js';

export default class AuthController {

  static async apiLogin(req, res, next) {
    try {
      const { username, password, userType } = req.body;
      if (!username || !password || !userType) {
        res.status(400).json({ error: 'Request body incomplete: username, password and userType are required' });
        return;
      }
      if (userType === 'reader') {
        const reader = await ReaderDao.getReaderByLibraryCard(username);
        if (!reader || reader.error) {
          res.status(400).json({ error: 'Invalid username or password' });
          return;
        }
        if (reader.password !== password) {
          res.status(400).json({ error: 'Invalid username or password' });
          return;
        }
        const token = jwt.sign(
          { userId: reader._id, userType: 'reader' },
          process.env.JWT_SECRET,
          { expiresIn: '24h' });
        res.json({ token: token });
        return;
      }

      const admin = await AdminDao.getAdminByUsername(username);
      if (!admin || admin.error) {
        res.status(400).json({ error: 'Invalid username or password' });
        return;
      }
      if (admin.password !== password) {
        res.status(400).json({ error: 'Invalid username or password' });
        return;
      }
      const token = jwt.sign(
        { userId: admin._id, userType: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' });
      res.json({ token: token });
    } catch (e) {
      console.error(`API Error: ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiChangePassword(req, res, next) {
    try {
      const { userId, userType } = res.locals;
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        res.status(400).json({ error: 'Request body incomplete: oldPassword and newPassword are required' });
        return;
      }
      if (userType === 'reader') {
        const reader = await ReaderDao.getReaderById(userId);
        if (!reader || reader.error) {
          res.status(400).json({ error: 'Invalid user ID' });
          return;
        }
        if (reader.password !== oldPassword) {
          res.status(400).json({ error: 'Invalid password' });
          return;
        }
        const result = await ReaderDao.updateReader(userId, { password: newPassword });
        if (result.error) {
          res.status(400).json({ error: result.error });
          return;
        }
        if (result.matchedCount === 0) {
          res.status(400).json({ error: 'Reader not found' });
          return;
        }
        res.json({ status: 'success', modifiedCount: result.modifiedCount });
        return;
      }

      const admin = await AdminDao.getAdminById(userId);
      if (!admin || admin.error) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }
      if (admin.password !== oldPassword) {
        res.status(400).json({ error: 'Invalid password' });
        return;
      }
      const result = await AdminDao.updateAdmin(userId, { password: newPassword });
      if (result.error) {
        res.status(400).json({ error: result.error });
        return;
      }
      if (result.matchedCount === 0) {
        res.status(400).json({ error: 'Admin not found' });
        return;
      }
      res.json({ status: 'success', modifiedCount: result.modifiedCount });
    } catch (e) {
      console.error(`API Error: ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiGetInfo(req, res, next) {
    try {
      const { userId, userType } = res.locals;
      if (userType === 'reader') {
        const reader = await ReaderDao.getReaderById(userId);
        if (!reader || reader.error) {
          res.status(400).json({ error: 'Invalid user ID' });
          return;
        }
        res.json({ status: 'success', data: {
          username: reader.username,
          role: 'reader',
        } });
        return;
      }

      const admin = await AdminDao.getAdminById(userId);
      if (!admin || admin.error) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }
      res.json({ status: 'success', data: {
        username: admin.username,
        role: 'admin',
      } });
    } catch (e) {
      console.error(`API Error: ${e}`);
      res.status(500).json({ error: e });
    }
  }
}
