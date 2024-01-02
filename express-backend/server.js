import cors from 'cors'
import express from 'express'
import fs from 'fs'
import multer from 'multer'
import { adminRouter, commonRouter, ignoreAuth } from './api/route.js'

const app = express()

app.use(cors())
app.use(express.json())

const router = express.Router()

router.post("/images", multer({
  dest: "static/images",
}).array("file", 1),
  function (req, res, next) {
    let files = req.files;
    let file = files[0];
    let fileInfo = {};
    let path = "static/images/" + Date.now().toString() + "_" + file.originalname;
    fs.renameSync("./static/images/" + file.filename, path);
    fileInfo.type = file.mimetype;
    fileInfo.name = file.originalname;
    fileInfo.size = file.size;
    fileInfo.url = path;
    res.send(fileInfo);
  }
)
app.use("/static/images" ,express.static('static/images'));
app.use("/api/v1", router)

app.use('/api/v1', ignoreAuth)
app.use('/api/v1', commonRouter)

app.use('/api/v1', adminRouter)




app.use('*', (req, res) => {
  res.status(404).json({ error: 'not found' })
})

export default app
