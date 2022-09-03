import express from 'express';
import fs from 'fs'
import { isAuth, isAdmin } from '../utils.js';
// Require the Cloudinary library
const cloudinary = require('cloudinary').v2

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename(req, file, cb) {
//     cb(null, `${Date.now()}.jpg`);
//   },
// });

// const upload = multer({ storage });
// const uploadRouter = express.Router();

// uploadRouter.post('/', isAuth, isAdmin, upload.single('image'), (req, res) => {
//   res.status(201).send({ image: `/${req.file.path}` });
// });
const uploadRouter = express.Router();

uploadRouter.post('/', isAuth, isAdmin, async(req,res)=>{

  const result = await cloudinary.uploader.upload(req.files.image.tempFilePath,{
    use_filename:true,
    folder:'wine-shop-file-upload'
  })
  fs.unlinkSync(req.files.image.tempFilePath)
  res.status(201).send({ image: result.secure_url })
})


export default uploadRouter;

