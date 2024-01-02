import jwt from 'jsonwebtoken';
import ReaderDao from '../dao/reader.dao.js';
import AdminDao from '../dao/admin.dao.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const userType = decodedToken.userType;
    if (!userId || !userType) {
      throw 'Invalid user ID';
    }
    if (userType === 'reader') {
      const reader = await ReaderDao.getReaderById(userId);
      if (!reader || reader.error) {
        throw 'Invalid user ID';
      }
      res.locals.userInfo = reader;
    }else{
      const admin = await AdminDao.getAdminById(userId);
      if (!admin || admin.error) {
        throw 'Invalid user ID';
      }
      res.locals.userInfo = admin;
    }
    res.locals.userId = userId;
    res.locals.userType = userType;  
    next();
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};


export const authAdmin = async (req, res, next) => {
  try {
    if(res.locals.userType !== 'admin'){
      throw 'Invalid user type';
    }
    next();
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
}

