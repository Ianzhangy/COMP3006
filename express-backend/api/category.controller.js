import CategoryDAO from '../dao/category.dao.js'

export default class CategoryController {

  // Get paginated categories information
  static async apiGetCategories(req, res, next) {
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20
    const page = req.query.page ? parseInt(req.query.page) : 1
    let filters = {}

    if (req.query.name) {
      filters.name = req.query.name
    }

    try {
      const { categoriesList, total } = await CategoryDAO.getCategories(filters, page - 1, pageSize)

      let response = {
        data: categoriesList,
        page: page,
        pageSize: pageSize,
        total: total
      }

      res.json(response)
    } catch (e) {
      console.log(`API Error: ${e}`)
      res.status(500).json({ error: e , status: 'error'})
    }
  }

  // Get all categories information
  static async apiGetAllCategories(req, res, next) {
    try {
      const allCategories = await CategoryDAO.getAllCategories()
      res.json(allCategories)
    } catch (e) {
      console.log(`API Error: ${e}`)
      res.status(500).json({ error: e , status: 'error'})
    }
  }

  // Get category information by ID
  static async apiGetCategoryById(req, res, next) {
    try {
      const _id = req.query._id
      const category = await CategoryDAO.getCategoryById(_id)
      if (!category) {
        res.status(400).json({ error: "not found", status: 'error' })
        return
      }
      res.json(category)
    } catch (e) {
      console.log(`API Error: ${e}`)
      res.status(500).json({ error: e , status: 'error'})
    }
  }

  // Add category information
  static async apiAddCategory(req, res, next) {
    try {
      const { name, description } = req.body
      const result = await CategoryDAO.addCategory({ name, description })
      if (result.error){
        res.status(400).json({ error: result.error, status: 'error' })
        return
      }
      res.json({ status: "success", _id: result.insertedId })
    } catch (e) {
      console.log(`API Error: ${e}`)
      res.status(500).json({ error: e , status: 'error'})
    }
  }

  // Update category information
  static async apiUpdateCategory(req, res, next) {
    try {
      const { _id, name, description } = req.body

      const result = await CategoryDAO.updateCategory(_id, { name, description })
      if (result.error){
        res.status(400).json({ error: result.error, status: 'error' })
        return
      }
      res.json({ status: "success" })
    } catch (e) {
      console.log(`API Error: ${e}`)
      res.status(500).json({ error: e , status: 'error'})
    }
  }

  // Delete category information
  static async apiDeleteCategory(req, res, next) {
    try {
      const { _id } = req.body

      const result = await CategoryDAO.deleteCategory(_id)
      
      if (result.deletedCount === 0) {
        res.status(400).json({ error: 'Book not found', status: 'error' });
        return;
      }
      res.json({ status: "success" })
    } catch (e) {
      console.log(`API Error: ${e}`)
      res.status(500).json({ error: e , status: 'error'})
    }
  }
}
