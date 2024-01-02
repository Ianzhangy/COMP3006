import express from 'express'
import { auth, authAdmin } from '../utils/auth.js'
import AuthController from './auth.controller.js'
import BookController from './book.controller.js'
import CategoryController from './category.controller.js'
import ReaderController from './reader.controller.js'
import RecordController from './record.controller.js'
import CommonController from './common.controller.js'
const ignoreAuth = express.Router()
ignoreAuth.route('/auth/login').post(AuthController.apiLogin)

const commonRouter = express.Router()
if(process.env.NODE_ENV !== 'test'){
  commonRouter.use(auth)
}

commonRouter.route('/home').get(CommonController.apiGetHomeInfo)
commonRouter.route('/auth/info').get(AuthController.apiGetInfo)
commonRouter.route('/auth/changePassword').post(AuthController.apiChangePassword)
commonRouter.route('/book').get(BookController.apiGetBooks)
commonRouter.route('/record').get(RecordController.apiGetRecords)

commonRouter.route('/book/borrow').post(BookController.apiBorrowBook)


const adminRouter = express.Router()
if(process.env.NODE_ENV !== 'test'){
  adminRouter.use(auth, authAdmin)
}
adminRouter.route('/book/returned').post(BookController.apiReturnBook)

adminRouter.route('/category').get(CategoryController.apiGetCategories)
adminRouter.route('/category/all').get(CategoryController.apiGetAllCategories)
adminRouter.route('/category/id').get(CategoryController.apiGetCategoryById)
adminRouter.route('/category').post(CategoryController.apiAddCategory)
adminRouter.route('/category').put(CategoryController.apiUpdateCategory)
adminRouter.route('/category').delete(CategoryController.apiDeleteCategory)


adminRouter.route('/book/id').get(BookController.apiGetBookById)
adminRouter.route('/book').post(BookController.apiAddBook)
adminRouter.route('/book').put(BookController.apiUpdateBook)
adminRouter.route('/book').delete(BookController.apiDeleteBook)

adminRouter.route('/reader').get(ReaderController.apiGetReaders)
adminRouter.route('/reader/id').get(ReaderController.apiGetReaderById)
adminRouter.route('/reader').post(ReaderController.apiAddReader)
adminRouter.route('/reader').put(ReaderController.apiUpdateReader)
adminRouter.route('/reader').delete(ReaderController.apiDeleteReader)


adminRouter.route('/record/id').get(RecordController.apiGetRecordById)
adminRouter.route('/record').post(RecordController.apiAddRecord)
adminRouter.route('/record').put(RecordController.apiUpdateRecord)
adminRouter.route('/record').delete(RecordController.apiDeleteRecord)

export { adminRouter, commonRouter, ignoreAuth }

