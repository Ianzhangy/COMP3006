import mongodb from 'mongodb'
import dotenv from 'dotenv'

import app from './server.js'
import CategoryDao from './dao/category.dao.js'
import BookDao from './dao/book.dao.js'
import ReaderDao from './dao/reader.dao.js'
import RecordDao from './dao/record.dao.js'
import AdminDAO from './dao/admin.dao.js'

async function main () {
  dotenv.config()

  const client = new mongodb.MongoClient(process.env.DB_URI)
  const port = process.env.PORT || 5001

  try {
    // Connect to MongoDB server
    await client.connect()
    await CategoryDao.injectDB(client)
    await BookDao.injectDB(client)
    await ReaderDao.injectDB(client)
    await RecordDao.injectDB(client)
    await AdminDAO.injectDB(client)
    // Start the server listening for requests
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main().catch(console.error)


export default app