import mongodb from 'mongodb'

const ObjectId = mongodb.ObjectId
let categories

const collectionName = 'category'
// id name description
export default class CategoryDao {
  static async injectDB(conn) {
    if (categories) {
      return
    }
    try {
      categories = await conn.db(process.env.COLLECTION).collection(collectionName)
    } catch (e) {
      console.error(`Unable to connect to ${collectionName}: ${e}`)
    }
  }

  static async addCategory(category) {
    try {
      // check if category already exists
      const exist = await categories.findOne({ name: category.name })
      if (exist) {
        return { error: 'Category already exists' }
      }
      return await categories.insertOne(category)
    } catch (e) {
      console.error(`Unable to add category: ${e}`)
      throw e
    }
  }

  static async updateCategory(categoryId, update) {
    try {
      // check if category already exists
      const exist = await categories.findOne({ name: update.name })
      if (exist && exist._id.toString() !== categoryId) {
        return { error: 'Category already exists' }
      }
      return await categories.updateOne(
        { _id: new ObjectId(categoryId) },
        { $set: update }
      )
    } catch (e) {
      console.error(`Unable to update category: ${e}`)
      throw e
    }
  }

  static async deleteCategory(categoryId) {
    try {
      return await categories.deleteOne({ _id: new ObjectId(categoryId) })
    } catch (e) {
      console.error(`Unable to delete category: ${e}`)
      throw e
    }
  }

  static async getCategories(filters = {}, page = 0, pageSize = 20) {
    let query = {};

    
    if (filters.name) {
      query = { name: { $regex: `.*${filters.name}.*`, $options: 'i' } };
    }

    let cursor;
    try {
      cursor = await categories
        .find(query)
        .limit(pageSize)
        .skip(pageSize * page);

      const categoriesList = await cursor.toArray();
      const total = await categories.countDocuments(query);

      return { categoriesList, total, page, pageSize };
    } catch (e) {
      console.error(`Unable to get categories: ${e}`);
      return { categoriesList: [], total: 0, page, pageSize };
    }
  }

  static async getAllCategories() {
    try {
      return await categories.find({}).toArray()
    } catch (e) {
      console.error(`Unable to get all categories: ${e}`)
      return []
    }
  }

  static async getCategoryById(id) {
    try {
      return await categories.findOne({ _id: new ObjectId(id) })
    } catch (e) {
      console.error(`Unable to get category by ID: ${e}`)
      throw e
    }
  }
}
