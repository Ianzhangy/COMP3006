db = db.getSiblingDB('library');

db.admin.insertMany([
  {
    "username": "admin",
    "password": "6c699ae033181fe13003e2f1d853b57c",
  },
]);