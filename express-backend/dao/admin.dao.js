import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectId;
let admins;

export default class AdminDAO {
  static async injectDB(conn) {
    if (admins) {
      return;
    }
    try {
      admins = await conn.db(process.env.COLLECTION).collection('admin');
    } catch (e) {
      console.error(`Unable to connect to AdminDAO: ${e}`);
    }
  }

  static async addAdmin(admin) {
    try {
      return await admins.insertOne(admin);
    } catch (e) {
      console.error(`Unable to add admin: ${e}`);
      throw e;
    }
  }

  static async updateAdmin(id, update) {
    try {
      if (!ObjectId.isValid(id)) {
        return { error: 'Invalid id' };
      }
      const result = await admins.updateOne({ _id: new ObjectId(id) }, { $set: update });
      return result;
    } catch (e) {
      console.error(`Unable to update admin: ${e}`);
      throw e;
    }
  }

  static async deleteAdmin(id) {
    try {
      if (!ObjectId.isValid(id)) {
        return { error: 'Invalid id' };
      }
      const result = await admins.deleteOne({ _id: new ObjectId(id) });
      return result;
    } catch (e) {
      console.error(`Unable to delete admin: ${e}`);
      throw e;
    }
  }

  static async getAdminByUsername(username) {
    try {
      return await admins.findOne({ username });
    } catch (e) {
      console.error(`Unable to get admin by username: ${e}`);
      throw e;
    }
  }

  static async getAdminById(id) {
    try {
      if (!ObjectId.isValid(id)) {
        return { error: 'Invalid id' };
      }
      return await admins.findOne({ _id: new ObjectId(id) });
    } catch (e) {
      console.error(`Unable to get admin by ID: ${e}`);
      throw e;
    }
  }
}
